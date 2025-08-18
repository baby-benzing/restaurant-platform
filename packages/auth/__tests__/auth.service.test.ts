import { AuthService } from '../src/services/auth.service';
import { UserRole } from '../src/middleware/rbac';

// Mock Prisma globally
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
};

// Set global mock
(global as any).mockPrisma = mockPrisma;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: UserRole.VIEWER,
        isActive: true,
      });

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(userData.email);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: userData.email,
          name: userData.name,
          passwordHash: expect.any(String),
        }),
      });
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePassword123!',
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing',
        email: userData.email,
      });

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Password');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      passwordHash: '$2a$12$mock.hash', // This will be replaced with actual hash in test
      role: UserRole.ADMIN,
      isActive: true,
    };

    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      // First register to get actual hash
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      await authService.register({ ...credentials, name: 'Test' });

      // Now test login
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockPrisma.session.create as jest.Mock).mockResolvedValue({
        id: 'session123',
        token: 'token123',
        userId: mockUser.id,
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
      });
    });

    it('should reject invalid email', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.login({
        email: 'nonexistent@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should reject incorrect password', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'WrongPassword!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should reject inactive user', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Account is disabled');
    });

    it('should create audit log on login', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockPrisma.session.create as jest.Mock).mockResolvedValue({
        id: 'session123',
        token: 'token123',
      });

      await authService.login({
        email: 'test@example.com',
        password: 'SecurePassword123!',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGIN',
          userId: mockUser.id,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        }),
      });
    });
  });

  describe('logout', () => {
    it('should invalidate session token', async () => {
      const token = 'valid-token';
      
      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue({
        id: 'session123',
        userId: 'user123',
        token,
      });

      const result = await authService.logout(token);

      expect(result.success).toBe(true);
      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });

    it('should handle non-existent session', async () => {
      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.logout('invalid-token');

      expect(result.success).toBe(true); // Idempotent
      expect(mockPrisma.session.delete).not.toHaveBeenCalled();
    });

    it('should create audit log on logout', async () => {
      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue({
        id: 'session123',
        userId: 'user123',
        token: 'token123',
      });

      await authService.logout('token123');

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGOUT',
          userId: 'user123',
        }),
      });
    });
  });

  describe('validateSession', () => {
    it('should validate active session', async () => {
      const token = 'valid-token';
      const mockSession = {
        id: 'session123',
        userId: 'user123',
        token,
        expires: new Date(Date.now() + 3600000), // 1 hour from now
        user: {
          id: 'user123',
          email: 'test@example.com',
          role: UserRole.ADMIN,
          isActive: true,
        },
      };

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await authService.validateSession(token);

      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('user123');
    });

    it('should reject expired session', async () => {
      const mockSession = {
        id: 'session123',
        token: 'token',
        expires: new Date(Date.now() - 3600000), // 1 hour ago
        user: { isActive: true },
      };

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await authService.validateSession('token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Session expired');
      expect(mockPrisma.session.delete).toHaveBeenCalled();
    });

    it('should reject session for inactive user', async () => {
      const mockSession = {
        id: 'session123',
        token: 'token',
        expires: new Date(Date.now() + 3600000),
        user: {
          id: 'user123',
          isActive: false,
        },
      };

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await authService.validateSession('token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('User account is disabled');
    });

    it('should update last activity', async () => {
      const mockSession = {
        id: 'session123',
        token: 'token',
        expires: new Date(Date.now() + 3600000),
        user: { id: 'user123', isActive: true },
      };

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      await authService.validateSession('token');

      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session123' },
        data: { lastActivity: expect.any(Date) },
      });
    });
  });

  describe('resetPassword', () => {
    it('should generate reset token for existing user', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user123',
        email,
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockPrisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        resetToken: 'reset-token',
      });

      const result = await authService.requestPasswordReset(email);

      expect(result.success).toBe(true);
      expect(result.resetToken).toBeDefined();
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { email },
        data: {
          resetToken: expect.any(String),
          resetTokenExpiry: expect.any(Date),
        },
      });
    });

    it('should not reveal if email exists', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.requestPasswordReset('nonexistent@example.com');

      expect(result.success).toBe(true); // Always returns success
      expect(result.resetToken).toBeUndefined();
    });

    it('should reset password with valid token', async () => {
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewSecurePassword123!';
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      };

      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (mockPrisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        resetToken: null,
        resetTokenExpiry: null,
      });

      const result = await authService.resetPassword(resetToken, newPassword);

      expect(result.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          passwordHash: expect.any(String),
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    });

    it('should reject expired reset token', async () => {
      const mockUser = {
        id: 'user123',
        resetToken: 'expired-token',
        resetTokenExpiry: new Date(Date.now() - 3600000), // 1 hour ago
      };

      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.resetPassword('expired-token', 'NewPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Reset token has expired');
      expect(mockPrisma.user.update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            passwordHash: expect.any(String),
          }),
        })
      );
    });
  });
});