import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@restaurant-platform/database';
import { authConfig } from './auth.config';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Check if user exists in AdminUser table
      const adminUser = await prisma.adminUser.findUnique({
        where: { email: user.email },
      });

      // Only allow existing admin users
      if (!adminUser || adminUser.status !== 'ACTIVE') {
        return false;
      }

      // Update last login time
      await prisma.adminUser.update({
        where: { email: user.email },
        data: { lastLoginAt: new Date() },
      });

      return true;
    },
  },
});
