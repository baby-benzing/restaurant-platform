import NextAuth from 'next-auth';
import { createAuthConfig } from '@restaurant-platform/auth';
import { adminWhitelist } from '@/config/admin-whitelist';

// Create NextAuth handler with Pavé46 configuration
const handler = NextAuth(createAuthConfig(adminWhitelist));

// Export for App Router
export { handler as GET, handler as POST };