import { UserRole } from '../middleware/rbac';
import { 
  hashPassword, 
  verifyPassword, 
  validatePassword,
  generateResetToken 
} from '../utils/password';
import { generateToken } from '../utils/jwt';

// Mock prisma for now - will be injected in production
let prisma: any;
try {
  prisma = require('@restaurant-platform/database').prisma;
} catch {
  prisma = (global as any).mockPrisma || {
    user: { findUnique: () => null, findFirst: () => null, create: () => null, update: () => null },
    session: { create: () => null, findUnique: () => null, update: () => null, delete: () => null, deleteMany: () => null },
    auditLog: { create: () => null },
  };
}

interface User {
  id: string;
  email: string;
  name?: string | null;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  emailVerified?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthResult {
  success: boolean;
  user?: Partial<User>;
  token?: string;
  error?: string;
}

export interface SessionValidation {
  valid: boolean;
  user?: Partial<User>;
  error?: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

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

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: data.role || UserRole.VIEWER,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: 'Account is disabled' };
      }

      // Verify password
      const isValidPassword = await verifyPassword(data.password, user.passwordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Create session
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expires,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN',
          userId: user.id,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

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
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(token: string): Promise<AuthResult> {
    try {
      // Find session
      const session = await prisma.session.findUnique({
        where: { token },
      });

      if (session) {
        // Delete session
        await prisma.session.delete({
          where: { token },
        });

        // Create audit log
        await prisma.auditLog.create({
          data: {
            action: 'LOGOUT',
            userId: session.userId,
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: true }; // Idempotent - always return success
    }
  }

  async validateSession(token: string): Promise<SessionValidation> {
    try {
      // Find session with user
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session) {
        return { valid: false, error: 'Session not found' };
      }

      // Check if session expired
      if (session.expires < new Date()) {
        await prisma.session.delete({
          where: { id: session.id },
        });
        return { valid: false, error: 'Session expired' };
      }

      // Check if user is active
      if (!session.user.isActive) {
        return { valid: false, error: 'User account is disabled' };
      }

      // Update last activity
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActivity: new Date() },
      });

      return {
        valid: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        },
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, error: 'Session validation failed' };
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; resetToken?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if email exists
        return { success: true };
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'PASSWORD_RESET_REQUEST',
          userId: user.id,
        },
      });

      return { success: true, resetToken };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false };
    }
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<AuthResult> {
    try {
      // Find user with reset token
      const user = await prisma.user.findFirst({
        where: {
          resetToken,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return { success: false, error: 'Invalid or expired reset token' };
      }

      // Check if token is expired
      if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
        return { success: false, error: 'Reset token has expired' };
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update user password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Invalidate all existing sessions
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'PASSWORD_RESET',
          userId: user.id,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
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

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'PASSWORD_CHANGE',
          userId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed' };
    }
  }
}