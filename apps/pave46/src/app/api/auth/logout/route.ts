import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth-service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value;

    if (token) {
      const authService = await getAuthService();
      await authService.logout(token);
    }

    // Clear cookie
    cookies().delete('auth-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Always return success for logout (idempotent)
    cookies().delete('auth-token');
    return NextResponse.json({ success: true });
  }
}