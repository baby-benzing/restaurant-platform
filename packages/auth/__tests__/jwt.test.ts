import { generateToken, verifyToken, refreshToken, TokenPayload } from '../src/utils/jwt';

describe('JWT Utilities', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    role: 'ADMIN' as const,
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user data in token', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockUser.id);
      expect(decoded?.email).toBe(mockUser.email);
      expect(decoded?.role).toBe(mockUser.role);
    });

    it('should set expiration time', () => {
      const token = generateToken(mockUser, '1h');
      const decoded = verifyToken(token);
      
      expect(decoded?.exp).toBeDefined();
      const expTime = decoded!.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      expect(expTime).toBeGreaterThan(now);
      expect(expTime).toBeLessThanOrEqual(now + oneHour + 1000); // Add 1s buffer
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockUser.id);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    it('should reject expired token', () => {
      // Generate token with immediate expiration
      const token = generateToken(mockUser, '0s');
      
      // Wait a moment to ensure expiration
      setTimeout(() => {
        const decoded = verifyToken(token);
        expect(decoded).toBeNull();
      }, 100);
    });

    it('should reject tampered token', () => {
      const token = generateToken(mockUser);
      const parts = token.split('.');
      parts[1] = Buffer.from('{"tampered": true}').toString('base64');
      const tamperedToken = parts.join('.');
      
      const decoded = verifyToken(tamperedToken);
      expect(decoded).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should generate new token from valid token', () => {
      const originalToken = generateToken(mockUser, '1h');
      const newToken = refreshToken(originalToken);
      
      expect(newToken).toBeDefined();
      expect(newToken).not.toBe(originalToken);
      
      const decoded = verifyToken(newToken!);
      expect(decoded?.userId).toBe(mockUser.id);
    });

    it('should not refresh expired token', () => {
      const expiredToken = generateToken(mockUser, '0s');
      
      setTimeout(() => {
        const newToken = refreshToken(expiredToken);
        expect(newToken).toBeNull();
      }, 100);
    });

    it('should not refresh invalid token', () => {
      const newToken = refreshToken('invalid.token');
      expect(newToken).toBeNull();
    });

    it('should extend expiration on refresh', () => {
      const originalToken = generateToken(mockUser, '30m');
      const newToken = refreshToken(originalToken);
      
      const originalDecoded = verifyToken(originalToken);
      const newDecoded = verifyToken(newToken!);
      
      expect(newDecoded!.exp).toBeGreaterThan(originalDecoded!.exp);
    });
  });
});