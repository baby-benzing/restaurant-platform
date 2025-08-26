/**
 * Auth Service Provider
 * Returns either the real AuthService (when database is available)
 * or MockAuthService (when database is not available)
 */

let authServiceInstance: any = null;
let isMockService = false;

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { prisma } = require('@restaurant-platform/database');
    // Try to connect to database
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

export async function getAuthService() {
  if (authServiceInstance) {
    return authServiceInstance;
  }

  const dbAvailable = await checkDatabaseConnection();
  
  if (dbAvailable) {
    const { AuthService } = await import('@restaurant-platform/auth');
    authServiceInstance = new AuthService();
    isMockService = false;
  } else {
    // Create a simple mock service inline to avoid build issues
    authServiceInstance = {
      async login(data: any) {
        
        // Mock users
        const mockUsers = [
          { 
            id: 'mock-admin', 
            email: 'admin@pave46.com', 
            password: 'AdminPassword123!',
            role: 'ADMIN',
            name: 'Admin User'
          },
          { 
            id: 'mock-editor', 
            email: 'editor@pave46.com', 
            password: 'EditorPassword123!',
            role: 'EDITOR',
            name: 'Editor User'
          },
        ];
        
        const user = mockUsers.find(u => u.email === data.email);
        
        if (!user || user.password !== data.password) {
          return { success: false, error: 'Invalid credentials' };
        }
        
        // Generate a simple token
        const { generateToken } = await import('@restaurant-platform/auth');
        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
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
      },
      
      async logout(_token: string) {
        return { success: true };
      },
      
      async validateSession(token: string) {
        // For demo, always return valid
        const { verifyToken } = await import('@restaurant-platform/auth');
        const decoded = verifyToken(token);
        
        if (!decoded) {
          return { valid: false, error: 'Invalid token' };
        }
        
        return {
          valid: true,
          user: {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
          },
        };
      },
      
      async requestPasswordReset(email: string) {
        return { success: true };
      },
      
      async resetPassword(_token: string, _password: string) {
        return { success: true };
      },
    };
    isMockService = true;
  }
  
  return authServiceInstance;
}

export function isUsingMockAuth(): boolean {
  return isMockService;
}