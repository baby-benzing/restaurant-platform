import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/edge-verify-token';

export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verify token using Edge-compatible verification
    const decoded = verifyTokenEdge(token);
    if (!decoded) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Add user info to headers for use in pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};