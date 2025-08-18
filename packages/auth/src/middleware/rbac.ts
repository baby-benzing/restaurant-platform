export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export const PERMISSIONS = {
  RESTAURANT: {
    CREATE: 'restaurant:create',
    UPDATE: 'restaurant:update',
    DELETE: 'restaurant:delete',
    VIEW: 'restaurant:view',
  },
  MENU: {
    CREATE: 'menu:create',
    UPDATE: 'menu:update',
    DELETE: 'menu:delete',
    VIEW: 'menu:view',
  },
  USER: {
    CREATE: 'user:create',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    VIEW: 'user:view',
  },
  AUDIT: {
    VIEW: 'audit:view',
  },
} as const;

type Permission = string;

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS.RESTAURANT),
    ...Object.values(PERMISSIONS.MENU),
    ...Object.values(PERMISSIONS.USER),
    ...Object.values(PERMISSIONS.AUDIT),
  ],
  [UserRole.EDITOR]: [
    // Editor can manage content but not users
    PERMISSIONS.RESTAURANT.UPDATE,
    PERMISSIONS.RESTAURANT.VIEW,
    ...Object.values(PERMISSIONS.MENU),
  ],
  [UserRole.VIEWER]: [
    // Viewer has read-only access
    PERMISSIONS.RESTAURANT.VIEW,
    PERMISSIONS.MENU.VIEW,
  ],
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 3,
  [UserRole.EDITOR]: 2,
  [UserRole.VIEWER]: 1,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function checkPermission(
  user: { role: UserRole } | { id?: string; role: UserRole },
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions.includes(permission);
}

interface RoutePermission {
  path: string;
  method?: string;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
}

const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin-only routes
  { path: '/admin/users', requiredRole: UserRole.ADMIN },
  { path: '/admin/audit', requiredRole: UserRole.ADMIN },
  { path: '/admin/settings', requiredRole: UserRole.ADMIN },
  
  // Editor routes
  { path: '/admin/menu', requiredRole: UserRole.EDITOR },
  { path: '/admin/content', requiredRole: UserRole.EDITOR },
  { path: '/admin/images', requiredRole: UserRole.EDITOR },
  
  // Viewer routes
  { path: '/admin/dashboard', requiredRole: UserRole.VIEWER },
  { path: '/admin/reports', requiredRole: UserRole.VIEWER },
  
  // API routes with specific permissions
  { path: '/api/users', method: 'POST', requiredPermission: PERMISSIONS.USER.CREATE },
  { path: '/api/users', method: 'PUT', requiredPermission: PERMISSIONS.USER.UPDATE },
  { path: '/api/users', method: 'DELETE', requiredPermission: PERMISSIONS.USER.DELETE },
  { path: '/api/menu', method: 'POST', requiredPermission: PERMISSIONS.MENU.CREATE },
  { path: '/api/menu', method: 'PUT', requiredPermission: PERMISSIONS.MENU.UPDATE },
  { path: '/api/menu', method: 'DELETE', requiredPermission: PERMISSIONS.MENU.DELETE },
  { path: '/api/menu', method: 'GET', requiredPermission: PERMISSIONS.MENU.VIEW },
];

export function canAccess(
  user: { role: UserRole } | null,
  path: string,
  method?: string
): boolean {
  // Public routes (not starting with /admin or /api)
  if (!path.startsWith('/admin') && !path.startsWith('/api')) {
    return true;
  }

  // No user means no access to protected routes
  if (!user) {
    return false;
  }

  // Find matching route permission
  const routePermission = ROUTE_PERMISSIONS.find(rp => {
    const pathMatch = path.startsWith(rp.path);
    const methodMatch = !rp.method || rp.method === method;
    return pathMatch && methodMatch;
  });

  if (!routePermission) {
    // No specific permission required, allow access
    return true;
  }

  // Check role requirement
  if (routePermission.requiredRole) {
    return hasRole(user.role, routePermission.requiredRole);
  }

  // Check permission requirement
  if (routePermission.requiredPermission) {
    return checkPermission(user, routePermission.requiredPermission);
  }

  return false;
}

export function getRequiredRole(path: string): UserRole | null {
  const routePermission = ROUTE_PERMISSIONS.find(rp => path.startsWith(rp.path));
  return routePermission?.requiredRole || null;
}

export function getUserPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}