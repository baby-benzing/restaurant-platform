import { NextRequest, NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/audit';

// Mock database for development
const mockUsers = [
  {
    id: 'admin-001',
    email: 'admin@pave46.com',
    name: 'Admin User',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    invitedBy: null,
  },
  {
    id: 'editor-001',
    email: 'editor@pave46.com',
    name: 'Editor User',
    role: 'EDITOR',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    invitedBy: 'admin@pave46.com',
  },
  {
    id: 'viewer-001',
    email: 'viewer@pave46.com',
    name: 'Viewer User',
    role: 'VIEWER',
    status: 'SUSPENDED',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    invitedBy: 'admin@pave46.com',
  },
];

// Helper to get current user from session (mock for now)
function getCurrentUser(request: NextRequest) {
  // In production, this would decode the JWT token
  // For now, return mock admin user
  return {
    id: 'admin-001',
    email: 'admin@pave46.com',
    role: 'ADMIN',
  };
}

// GET /api/admin/users - List all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    // Only admins can view user list
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // In production, query from database
    // For now, return mock data
    return NextResponse.json({
      success: true,
      data: mockUsers,
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create/Invite new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    // Only admins can invite users
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, role = 'VIEWER' } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      invitedBy: currentUser.email,
    };

    // In production, save to database
    mockUsers.push(newUser);

    // Create audit log
    await createAuditLog({
      action: 'USER_CREATED',
      entityType: 'AdminUser',
      entityId: newUser.id,
      description: `Invited new ${role.toLowerCase()} user: ${email}`,
      newValue: newUser,
      metadata: { invitedBy: currentUser.email, role },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    // Only admins can update users
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const oldUser = { ...mockUsers[userIndex] };

    // Prevent self-demotion for last admin
    if (userId === currentUser.id && role !== 'ADMIN') {
      const adminCount = mockUsers.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove the last admin' },
          { status: 400 }
        );
      }
    }

    // Update user
    if (role && ['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      mockUsers[userIndex].role = role;
    }
    if (status && ['ACTIVE', 'SUSPENDED'].includes(status)) {
      mockUsers[userIndex].status = status;
    }

    const updatedUser = mockUsers[userIndex];

    // Create audit log
    await createAuditLog({
      action: 'USER_UPDATED',
      entityType: 'AdminUser',
      entityId: userId,
      description: `Updated user: ${updatedUser.email}`,
      oldValue: oldUser,
      newValue: updatedUser,
      changes: {
        ...(role && role !== oldUser.role ? { role: { from: oldUser.role, to: role } } : {}),
        ...(status && status !== oldUser.status ? { status: { from: oldUser.status, to: status } } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Remove user (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    // Only admins can remove users
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot remove yourself' },
        { status: 400 }
      );
    }

    // Find user
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const deletedUser = mockUsers[userIndex];

    // Prevent removing last admin
    if (deletedUser.role === 'ADMIN') {
      const adminCount = mockUsers.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove the last admin' },
          { status: 400 }
        );
      }
    }

    // In production, update status to SUSPENDED instead of deleting
    // This preserves audit trail
    mockUsers[userIndex].status = 'SUSPENDED';

    // Create audit log
    await createAuditLog({
      action: 'USER_SUSPENDED',
      entityType: 'AdminUser',
      entityId: userId,
      description: `Suspended user: ${deletedUser.email}`,
      oldValue: { status: 'ACTIVE' },
      newValue: { status: 'SUSPENDED' },
    });

    return NextResponse.json({
      success: true,
      message: 'User access revoked',
    });
  } catch (error) {
    console.error('Failed to remove user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove user' },
      { status: 500 }
    );
  }
}