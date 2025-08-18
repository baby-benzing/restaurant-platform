import jwt from 'jsonwebtoken';
import { UserRole } from '../middleware/rbac';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface GenerateTokenInput {
  id: string;
  email: string;
  role: UserRole | string;
}

export function generateToken(user: GenerateTokenInput, expiresIn?: string): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (expiresIn || JWT_EXPIRES_IN) as string | number,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function refreshToken(token: string): string | null {
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return null;
  }

  // Generate new token with fresh expiration
  return generateToken({
    id: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenExpiry(token: string): Date | null {
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
}