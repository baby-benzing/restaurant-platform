/**
 * Role-Based Access Control (RBAC) System
 * 
 * Two roles:
 * - ADMIN: Can invite/uninvite users and make data changes
 * - EDITOR: Can only make data changes
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export enum Permission {
  // User Management
  INVITE_USER = 'invite_user',
  REMOVE_USER = 'remove_user',
  VIEW_USERS = 'view_users',
  
  // Data Management
  EDIT_MENU = 'edit_menu',
  EDIT_HOURS = 'edit_hours',
  EDIT_CONTACT = 'edit_contact',
  EDIT_IMAGES = 'edit_images',
  EDIT_CATERING = 'edit_catering',
  
  // Audit
  VIEW_AUDIT = 'view_audit',
}

// Define role permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // User management - Admin only
    Permission.INVITE_USER,
    Permission.REMOVE_USER,
    Permission.VIEW_USERS,
    
    // Data management - Both roles
    Permission.EDIT_MENU,
    Permission.EDIT_HOURS,
    Permission.EDIT_CONTACT,
    Permission.EDIT_IMAGES,
    Permission.EDIT_CATERING,
    
    // Audit - Both roles
    Permission.VIEW_AUDIT,
  ],
  
  [UserRole.EDITOR]: [
    // Data management only - Editors cannot manage users
    Permission.EDIT_MENU,
    Permission.EDIT_HOURS,
    Permission.EDIT_CONTACT,
    Permission.EDIT_IMAGES,
    Permission.EDIT_CATERING,
    
    // Audit - Can view audit logs
    Permission.VIEW_AUDIT,
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Check if a user can manage other users
 */
export function canManageUsers(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Check if a user can invite new users
 */
export function canInviteUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, Permission.INVITE_USER);
}

/**
 * Check if a user can remove other users
 */
export function canRemoveUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, Permission.REMOVE_USER);
}

/**
 * Check if a user can edit data
 */
export function canEditData(userRole: UserRole): boolean {
  return hasPermission(userRole, Permission.EDIT_MENU) ||
         hasPermission(userRole, Permission.EDIT_HOURS) ||
         hasPermission(userRole, Permission.EDIT_CONTACT);
}

/**
 * Validate role assignment
 * Only admins can assign any role, editors cannot assign roles at all
 */
export function canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
  // Only admins can assign roles
  if (assignerRole !== UserRole.ADMIN) {
    return false;
  }
  
  // Admins can assign both ADMIN and EDITOR roles
  return targetRole === UserRole.ADMIN || targetRole === UserRole.EDITOR;
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.EDITOR:
      return 'Editor';
    default:
      return 'Unknown';
  }
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Full access to manage users and edit all restaurant data';
    case UserRole.EDITOR:
      return 'Can edit restaurant data but cannot manage users';
    default:
      return 'No permissions';
  }
}