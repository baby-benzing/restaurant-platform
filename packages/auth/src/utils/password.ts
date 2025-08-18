import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;

const COMMON_PASSWORDS = [
  'password123',
  'Password123!',
  'Admin123!',
  'Welcome123!',
  'Qwerty123!',
];

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common passwords
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => 
    lowerPassword === common.toLowerCase() || 
    password === common
  )) {
    errors.push('Password is too common');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateSecureToken(length: number = 32): string {
  const buffer = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(buffer);
  } else {
    // Node.js environment
    const crypto = require('crypto');
    crypto.randomFillSync(buffer);
  }
  
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}