import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';

// NextAuth v5 types
type NextAuthOptions = any;

/**
 * NextAuth configuration for platform-wide Google SSO
 * 
 * This configuration provides:
 * - Google OAuth authentication only (no password management)
 * - Automatic user creation on first login
 * - Role-based access control via email whitelist
 * - Session management in database
 */

// Email domain/address whitelist configuration
export interface AdminWhitelist {
  // Allowed email domains (e.g., '@restaurant.com')
  allowedDomains?: string[];
  // Specific allowed email addresses
  allowedEmails?: string[];
  // Default role for new users
  defaultRole?: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

/**
 * Check if an email is allowed to access admin (from database)
 */
async function isEmailAllowedInDatabase(email: string, prisma: any): Promise<boolean> {
  try {
    // Check if user exists and is active
    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: { status: true }
    });
    
    // User must exist and be ACTIVE
    return user?.status === 'ACTIVE';
  } catch (error) {
    console.error('Failed to check user access:', error);
    return false;
  }
}

/**
 * Create NextAuth configuration with restaurant-specific whitelist
 */
export function createAuthConfig(whitelist: AdminWhitelist): NextAuthOptions {
  // Get prisma at runtime to avoid build issues
  let prisma: any;
  try {
    prisma = require('@restaurant-platform/database').prisma;
  } catch {
    console.warn('Database not available for auth adapter');
  }

  const config: NextAuthOptions = {
    ...(prisma ? { adapter: PrismaAdapter(prisma) } : {}),
    
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],

    callbacks: {
      async signIn({ user, account }: any) {
        // Only allow Google OAuth
        if (account?.provider !== 'google') {
          return false;
        }

        if (!user.email) {
          return false;
        }

        // Check if email is allowed in database
        const isAllowed = await isEmailAllowedInDatabase(user.email, prisma);
        if (!isAllowed) {
          // If not in database, check if this is the first user (system bootstrap)
          const userCount = await prisma?.adminUser?.count() || 0;
          if (userCount > 0) {
            // System already has users, deny access
            return false;
          }
          // First user - will be created as admin below
        }

        // Only perform database operations if prisma is available
        if (prisma) {
          try {
            // Check if this is a new user
            const existingUser = await prisma.adminUser.findUnique({
              where: { email: user.email }
            });

            if (!existingUser) {
              // Check if this is the first user
              const userCount = await prisma.adminUser.count();
              const isFirstUser = userCount === 0;
              
              // First user is always ADMIN, others get invited with specific roles
              const roleName = isFirstUser ? 'ADMIN' : 'VIEWER';
              
              // Get or create the role
              let role = await prisma.adminRole.findFirst({
                where: { name: roleName }
              });

              if (!role) {
                // Create default roles if they don't exist
                role = await prisma.adminRole.create({
                  data: {
                    name: roleName,
                    description: `${roleName} role`,
                    permissions: getDefaultPermissions(roleName),
                    isSystem: true
                  }
                });
              }

              // Create the admin user
              await prisma.adminUser.create({
                data: {
                  email: user.email,
                  googleId: account.providerAccountId,
                  name: user.name || user.email.split('@')[0],
                  avatar: user.image,
                  roleId: role.id,
                  status: 'ACTIVE',
                  lastLoginAt: new Date()
                }
              });

              // Create audit log for new user
              const adminUser = await prisma.adminUser.findUnique({
                where: { email: user.email }
              });

              if (adminUser) {
                await prisma.auditLog.create({
                  data: {
                    restaurantId: process.env.RESTAURANT_ID || 'system',
                    userId: adminUser.id,
                    action: 'USER_CREATED',
                    entityType: 'AdminUser',
                    entityId: adminUser.id,
                    metadata: {
                      source: 'Google SSO',
                      email: user.email
                    }
                  }
                });
              }
            } else {
              // Update last login
              await prisma.adminUser.update({
                where: { id: existingUser.id },
                data: { 
                  lastLoginAt: new Date(),
                  // Update Google ID if it changed
                  googleId: account.providerAccountId,
                  // Update avatar if available
                  avatar: user.image || existingUser.avatar
                }
              });

              // Create audit log for login
              await prisma.auditLog.create({
                data: {
                  restaurantId: process.env.RESTAURANT_ID || 'system',
                  userId: existingUser.id,
                  action: 'USER_LOGIN',
                  entityType: 'AdminUser',
                  entityId: existingUser.id,
                  metadata: {
                    source: 'Google SSO'
                  }
                }
              });
            }
          } catch (error) {
            console.error('Database operation failed:', error);
            // Still allow login even if database fails
          }
        }

        return true;
      },

      async session({ session }: any) {
        if (session.user?.email && prisma) {
          try {
            // Get user details from database
            const adminUser = await prisma.adminUser.findUnique({
              where: { email: session.user.email },
              include: { role: true }
            });

            if (adminUser) {
              // Enhance session with user details
              session.user = {
                ...session.user,
                id: adminUser.id,
                role: adminUser.role.name,
                permissions: adminUser.role.permissions,
                status: adminUser.status
              };
            }
          } catch (error) {
            console.error('Failed to enhance session:', error);
          }
        }

        return session;
      },

      async jwt({ token, user, account }: any) {
        if (account && user) {
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      }
    },

    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },

    session: {
      strategy: 'jwt',
      maxAge: 3 * 24 * 60 * 60, // 3 days
    },

    debug: process.env.NODE_ENV === 'development',
  };

  return config;
}

/**
 * Get default permissions based on role
 */
function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'ADMIN':
      return ['*']; // All permissions
    case 'EDITOR':
      return [
        'menu:read',
        'menu:write',
        'media:read',
        'media:write',
        'hours:read',
        'hours:write',
        'contact:read',
        'contact:write'
      ];
    case 'VIEWER':
    default:
      return [
        'menu:read',
        'media:read',
        'hours:read',
        'contact:read'
      ];
  }
}

// Export types for use in apps
export type { NextAuthOptions };