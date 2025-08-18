import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthService, isUsingMockAuth } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authService = await getAuthService();
    const result = await authService.login({
      email,
      password,
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    if (result.success && result.token) {
      // Set secure httpOnly cookie
      cookies().set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({
        success: true,
        user: result.user,
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || 'Login failed' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}