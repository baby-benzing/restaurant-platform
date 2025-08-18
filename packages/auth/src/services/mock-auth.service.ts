import { UserRole } from '../middleware/rbac';
import { 
  hashPassword, 
  verifyPassword, 
  validatePassword,
  generateResetToken 
} from '../utils/password';
import { generateToken } from '../utils/jwt';
import { 
  RegisterData, 
  LoginData, 
  AuthResult, 
  SessionValidation 
} from './auth.service';

// Mock user data for development without database
const MOCK_USERS = [
  {
    id: 'mock-admin-001',
    email: 'admin@pave46.com',
    name: 'Admin User',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY3ppjf3UhJ4p.q', // Password: AdminPassword123!
    role: UserRole.ADMIN,
    isActive: true,
    emailVerified: new Date(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'mock-editor-001',
    email: 'editor@pave46.com',
    name: 'Editor User',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY3ppjf3UhJ4p.q', // Password: AdminPassword123!
    role: UserRole.EDITOR,
    isActive: true,
    emailVerified: new Date(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const MOCK_SESSIONS = new Map<string, any>();

export class MockAuthService {
  async register(data: RegisterData): Promise<AuthResult> {
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        error: `Password validation failed: ${passwordValidation.errors.join(', ')}` 
      };
    }

    // Create mock user
    const passwordHash = await hashPassword(data.password);
    const newUser = {
      id: `mock-user-${Date.now()}`,
      email: data.email,
      name: data.name || '',
      passwordHash,
      role: data.role || UserRole.VIEWER,
      isActive: true,
      emailVerified: new Date(), // Set to now for mock users
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_USERS.push(newUser);

    return { 
      success: true, 
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }
    };
  }

  async login(data: LoginData): Promise<AuthResult> {
    console.log('MockAuthService: Attempting login for', data.email);
    
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === data.email);
    
    if (!user) {
      console.log('MockAuthService: User not found');
      return { success: false, error: 'Invalid credentials' };
    }

    // Check if user is active
    if (!user.isActive) {
      return { success: false, error: 'Account is disabled' };
    }

    // For demo purposes, accept the hardcoded password
    const isValidPassword = data.password === 'AdminPassword123!' || 
                          await verifyPassword(data.password, user.passwordHash);
    
    if (!isValidPassword) {
      console.log('MockAuthService: Invalid password');
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store mock session
    const sessionId = `session-${Date.now()}`;
    MOCK_SESSIONS.set(token, {
      id: sessionId,
      userId: user.id,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    console.log('MockAuthService: Login successful');

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(token: string): Promise<AuthResult> {
    MOCK_SESSIONS.delete(token);
    return { success: true };
  }

  async validateSession(token: string): Promise<SessionValidation> {
    const session = MOCK_SESSIONS.get(token);
    
    if (!session) {
      return { valid: false, error: 'Session not found' };
    }

    if (session.expires < new Date()) {
      MOCK_SESSIONS.delete(token);
      return { valid: false, error: 'Session expired' };
    }

    const user = MOCK_USERS.find(u => u.id === session.userId);
    
    if (!user || !user.isActive) {
      return { valid: false, error: 'User account is disabled' };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; resetToken?: string }> {
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    const resetToken = generateResetToken();
    console.log('MockAuthService: Password reset token:', resetToken);
    
    return { success: true, resetToken };
  }

  async resetPassword(_resetToken: string, newPassword: string): Promise<AuthResult> {
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
      };
    }

    // In a real implementation, you'd verify the reset token
    // For mock, just return success
    console.log('MockAuthService: Password reset successful');
    return { success: true };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const isValidPassword = currentPassword === 'AdminPassword123!' ||
                          await verifyPassword(currentPassword, user.passwordHash);
    
    if (!isValidPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
      };
    }

    // Update password hash in mock data
    user.passwordHash = await hashPassword(newPassword);
    user.updatedAt = new Date();

    return { success: true };
  }
}