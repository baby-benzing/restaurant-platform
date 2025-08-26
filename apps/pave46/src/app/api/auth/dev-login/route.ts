import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auditUserLogin } from '@/lib/audit';

/**
 * Development-only bypass login
 * 
 * ⚠️ WARNING: This endpoint is ONLY active in development mode
 * It allows instant login without Google SSO for testing purposes
 * 
 * In production, this endpoint returns 404
 */

// Mock users for development
const DEV_USERS = {
  admin: {
    id: 'dev-admin-001',
    email: 'admin@dev.local',
    name: 'Dev Admin',
    role: 'ADMIN',
    permissions: ['*'],
  },
  editor: {
    id: 'dev-editor-001',
    email: 'editor@dev.local',
    name: 'Dev Editor',
    role: 'EDITOR',
    permissions: ['menu:read', 'menu:write', 'media:read', 'media:write'],
  },
  viewer: {
    id: 'dev-viewer-001',
    email: 'viewer@dev.local',
    name: 'Dev Viewer',
    role: 'VIEWER',
    permissions: ['menu:read', 'media:read'],
  },
};

export async function POST(request: NextRequest) {
  // CRITICAL: Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { role = 'admin' } = body;

    // Get the mock user based on role
    const user = DEV_USERS[role as keyof typeof DEV_USERS] || DEV_USERS.admin;

    // Create a simple session token for dev mode
    const sessionData = {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    
    // Convert to base64 for a simple token
    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: false, // Allow http in development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Also set a dev indicator cookie
    cookieStore.set('dev-bypass-active', 'true', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // Track login in audit log
    await auditUserLogin(user.email, 'Dev Bypass');

    return NextResponse.json({
      success: true,
      user,
      message: 'Development login successful',
    });
  } catch (error) {
    console.error('Dev login error:', error);
    return NextResponse.json(
      { error: 'Dev login failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // CRITICAL: Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  // Clear the session
  const cookieStore = await cookies();
  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('dev-bypass-active');

  return NextResponse.json({
    success: true,
    message: 'Development session cleared',
  });
}