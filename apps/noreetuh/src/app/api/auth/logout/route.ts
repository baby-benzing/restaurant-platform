import { NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth-service';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
      const authService = await getAuthService();
      await authService.logout(token);
    }

    // Clear cookie
    cookieStore.delete('auth-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Always return success for logout (idempotent)
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    return NextResponse.json({ success: true });
  }
}