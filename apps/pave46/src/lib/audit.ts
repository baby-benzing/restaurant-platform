/**
 * Audit logging helper functions
 * Used to track all admin actions for security and compliance
 */

interface AuditLogData {
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  changes?: any;
  metadata?: any;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await fetch('/api/admin/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Helper to track menu changes
 */
export async function auditMenuChange(
  action: 'create' | 'update' | 'delete',
  menuItem: any,
  oldItem?: any
) {
  const actionMap = {
    create: 'MENU_CREATE',
    update: 'MENU_UPDATE',
    delete: 'MENU_DELETE',
  };

  await createAuditLog({
    action: actionMap[action],
    entityType: 'MenuItem',
    entityId: menuItem.id || 'new',
    description: `${action === 'create' ? 'Created' : action === 'update' ? 'Updated' : 'Deleted'} menu item: ${menuItem.name}`,
    oldValue: oldItem,
    newValue: action !== 'delete' ? menuItem : undefined,
    changes: action === 'update' && oldItem ? calculateChanges(oldItem, menuItem) : undefined,
  });
}

/**
 * Helper to track hours changes
 */
export async function auditHoursChange(
  day: string,
  oldHours: any,
  newHours: any
) {
  await createAuditLog({
    action: 'HOURS_UPDATE',
    entityType: 'OperatingHours',
    entityId: `hours-${day.toLowerCase()}`,
    description: `Updated ${day} hours`,
    oldValue: oldHours,
    newValue: newHours,
    changes: calculateChanges(oldHours, newHours),
  });
}

/**
 * Helper to track contact info changes
 */
export async function auditContactChange(
  type: string,
  oldValue: string,
  newValue: string
) {
  await createAuditLog({
    action: 'CONTACT_UPDATE',
    entityType: 'Contact',
    entityId: `contact-${type.toLowerCase()}`,
    description: `Updated ${type}`,
    oldValue: { value: oldValue },
    newValue: { value: newValue },
    changes: { value: { from: oldValue, to: newValue } },
  });
}

/**
 * Helper to track media uploads
 */
export async function auditMediaUpload(
  fileName: string,
  fileSize: string,
  type: 'image' | 'document' = 'image'
) {
  await createAuditLog({
    action: 'MEDIA_UPLOAD',
    entityType: type === 'image' ? 'Image' : 'Document',
    entityId: `media-${Date.now()}`,
    description: `Uploaded new ${type}: ${fileName}`,
    metadata: {
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
    },
  });
}

/**
 * Helper to track media deletion
 */
export async function auditMediaDelete(
  fileName: string,
  mediaId: string
) {
  await createAuditLog({
    action: 'MEDIA_DELETE',
    entityType: 'Media',
    entityId: mediaId,
    description: `Deleted media: ${fileName}`,
    oldValue: { fileName },
  });
}

/**
 * Helper to track user login
 */
export async function auditUserLogin(
  userEmail: string,
  source: 'Google SSO' | 'Dev Bypass' = 'Google SSO'
) {
  await createAuditLog({
    action: 'USER_LOGIN',
    entityType: 'Session',
    entityId: `session-${Date.now()}`,
    description: 'User logged in',
    metadata: { source, email: userEmail },
  });
}

/**
 * Helper to track settings changes
 */
export async function auditSettingsChange(
  settingType: string,
  changes: any
) {
  await createAuditLog({
    action: 'SETTINGS_UPDATE',
    entityType: 'Settings',
    entityId: `settings-${settingType}`,
    description: `Updated ${settingType} settings`,
    changes,
  });
}

/**
 * Calculate the differences between two objects
 */
function calculateChanges(oldObj: any, newObj: any): any {
  const changes: any = {};
  
  // Check all keys in the new object
  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changes[key] = {
        from: oldObj[key],
        to: newObj[key],
      };
    }
  }
  
  // Check for deleted keys
  for (const key in oldObj) {
    if (!(key in newObj)) {
      changes[key] = {
        from: oldObj[key],
        to: undefined,
      };
    }
  }
  
  return Object.keys(changes).length > 0 ? changes : undefined;
}