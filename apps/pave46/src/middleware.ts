import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateUserSession, getSessionUser } from '@/lib/session-validator';

/**
 * Middleware to protect admin routes
 * 
 * In production: Checks for NextAuth session
 * In development: Also accepts dev bypass tokens
 */

// Check if we have a valid dev bypass
function hasValidDevBypass(request: NextRequest): boolean {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  // Check for dev bypass cookie
  const devBypass = request.cookies.get('dev-bypass-active')?.value;
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  
  // If we have dev bypass flag or a session token, allow access
  return !!(devBypass === 'true' || sessionToken);
}

// Check for NextAuth session
function hasNextAuthSession(request: NextRequest): boolean {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                       request.cookies.get('__Secure-next-auth.session-token')?.value;
  return !!sessionToken;
}

export async function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for authentication
    const hasAuth = hasValidDevBypass(request) || hasNextAuthSession(request);
    
    if (!hasAuth) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Get user info from session
    const user = getSessionUser(request);
    if (user) {
      // Validate that user is still active (not suspended)
      const isActive = await validateUserSession(user.email);
      if (!isActive) {
        // User has been suspended - redirect to login with error
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('error', 'AccessRevoked');
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};