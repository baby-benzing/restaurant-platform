import { hashPassword, verifyPassword, validatePassword } from '../src/utils/password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'SecurePassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'SecurePassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'SecurePassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'SecurePassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should handle empty password', async () => {
      const hash = await hashPassword('SecurePassword123!');
      const isValid = await verifyPassword('', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong password', () => {
      const result = validatePassword('SecureP@ssw0rd123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 12 characters long');
    });

    it('should require uppercase letter', () => {
      const result = validatePassword('lowercase123!@#');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = validatePassword('UPPERCASE123!@#');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = validatePassword('NoNumbers!@#ABC');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const result = validatePassword('NoSpecialChar123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject common passwords', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is too common');
    });
  });
});