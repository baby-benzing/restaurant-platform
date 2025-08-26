import { NextRequest, NextResponse } from 'next/server';

// Mock audit logs for development
const mockAuditLogs = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'USER_LOGIN',
    entityType: 'Session',
    entityId: 'session-001',
    description: 'User logged in',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0...',
    metadata: { source: 'Dev Bypass' }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    userId: 'dev-editor-001',
    userEmail: 'editor@dev.local',
    userName: 'Dev Editor',
    action: 'MENU_UPDATE',
    entityType: 'MenuItem',
    entityId: 'item-123',
    description: 'Updated menu item: Croissant',
    oldValue: { price: 4.50 },
    newValue: { price: 5.00 },
    changes: { price: { from: 4.50, to: 5.00 } }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'HOURS_UPDATE',
    entityType: 'OperatingHours',
    entityId: 'hours-monday',
    description: 'Updated Monday hours',
    oldValue: { openTime: '07:00', closeTime: '16:00' },
    newValue: { openTime: '08:00', closeTime: '17:00' },
    changes: { 
      openTime: { from: '07:00', to: '08:00' },
      closeTime: { from: '16:00', to: '17:00' }
    }
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    userId: 'dev-editor-001',
    userEmail: 'editor@dev.local',
    userName: 'Dev Editor',
    action: 'MEDIA_UPLOAD',
    entityType: 'Image',
    entityId: 'img-456',
    description: 'Uploaded new image: hero-banner.jpg',
    metadata: { 
      fileName: 'hero-banner.jpg',
      fileSize: '2.5 MB',
      dimensions: '1920x1080'
    }
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'CONTACT_UPDATE',
    entityType: 'Contact',
    entityId: 'contact-phone',
    description: 'Updated phone number',
    oldValue: { value: '(646) 454-1387' },
    newValue: { value: '(646) 454-1388' },
    changes: { value: { from: '(646) 454-1387', to: '(646) 454-1388' } }
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'USER_CREATED',
    entityType: 'AdminUser',
    entityId: 'user-789',
    description: 'Created new admin user: manager@pave46.com',
    metadata: { 
      email: 'manager@pave46.com',
      role: 'EDITOR'
    }
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    userId: 'dev-editor-001',
    userEmail: 'editor@dev.local',
    userName: 'Dev Editor',
    action: 'MENU_CREATE',
    entityType: 'MenuItem',
    entityId: 'item-new-001',
    description: 'Created new menu item: Seasonal Special',
    newValue: { 
      name: 'Seasonal Special',
      price: 12.00,
      category: 'specials'
    }
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'MENU_DELETE',
    entityType: 'MenuItem',
    entityId: 'item-old-001',
    description: 'Deleted menu item: Old Special',
    oldValue: { 
      name: 'Old Special',
      price: 10.00,
      category: 'specials'
    }
  },
  {
    id: '9',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    userId: 'dev-admin-001',
    userEmail: 'admin@dev.local',
    userName: 'Dev Admin',
    action: 'SETTINGS_UPDATE',
    entityType: 'NotificationSettings',
    entityId: 'settings-001',
    description: 'Updated notification settings',
    changes: { 
      emailEnabled: { from: false, to: true },
      emailAddresses: { added: ['manager@pave46.com'] }
    }
  },
  {
    id: '10',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    userId: 'system',
    userEmail: 'system',
    userName: 'System',
    action: 'SYSTEM_INIT',
    entityType: 'System',
    entityId: 'init',
    description: 'System initialized',
    metadata: { version: '1.0.0' }
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const entityType = searchParams.get('entityType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In production, this would query the database
    // For now, we'll filter the mock data
    let filteredLogs = [...mockAuditLogs];

    // Apply filters
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }
    if (entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === entityType);
    }
    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
    }

    // Apply pagination
    const total = filteredLogs.length;
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// Track audit log for actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, entityType, entityId, description, oldValue, newValue, changes, metadata } = body;

    // Get user from session (in production, this would check the actual session)
    const user = {
      id: 'dev-admin-001',
      email: 'admin@dev.local',
      name: 'Dev Admin'
    };

    const auditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      action,
      entityType,
      entityId,
      description,
      oldValue,
      newValue,
      changes,
      metadata,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    };

    // In production, this would save to database
    console.log('Audit log created:', auditLog);

    return NextResponse.json({
      success: true,
      data: auditLog
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}