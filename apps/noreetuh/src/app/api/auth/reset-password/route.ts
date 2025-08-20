import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;
    const authService = await getAuthService();

    // Request password reset
    if (email && !token && !newPassword) {
      await authService.requestPasswordReset(email);
      
      // Always return success to avoid revealing if email exists
      return NextResponse.json({ success: true });
    }

    // Reset password with token
    if (token && newPassword) {
      const result = await authService.resetPassword(token, newPassword);
      
      if (result.success) {
        return NextResponse.json({ success: true });
      }
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}