import { checkPermission, hasRole, canAccess, PERMISSIONS, UserRole } from '../src/middleware/rbac';

describe('Role-Based Access Control', () => {
  describe('hasRole', () => {
    it('should return true for exact role match', () => {
      expect(hasRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
      expect(hasRole(UserRole.EDITOR, UserRole.EDITOR)).toBe(true);
      expect(hasRole(UserRole.VIEWER, UserRole.VIEWER)).toBe(true);
    });

    it('should return false for insufficient role', () => {
      expect(hasRole(UserRole.VIEWER, UserRole.EDITOR)).toBe(false);
      expect(hasRole(UserRole.VIEWER, UserRole.ADMIN)).toBe(false);
      expect(hasRole(UserRole.EDITOR, UserRole.ADMIN)).toBe(false);
    });

    it('should return true for higher role than required', () => {
      expect(hasRole(UserRole.ADMIN, UserRole.VIEWER)).toBe(true);
      expect(hasRole(UserRole.ADMIN, UserRole.EDITOR)).toBe(true);
      expect(hasRole(UserRole.EDITOR, UserRole.VIEWER)).toBe(true);
    });
  });

  describe('checkPermission', () => {
    const adminUser = { id: '1', role: UserRole.ADMIN };
    const editorUser = { id: '2', role: UserRole.EDITOR };
    const viewerUser = { id: '3', role: UserRole.VIEWER };

    describe('Restaurant permissions', () => {
      it('should allow admin all restaurant operations', () => {
        expect(checkPermission(adminUser, PERMISSIONS.RESTAURANT.CREATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.RESTAURANT.UPDATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.RESTAURANT.DELETE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.RESTAURANT.VIEW)).toBe(true);
      });

      it('should allow editor limited restaurant operations', () => {
        expect(checkPermission(editorUser, PERMISSIONS.RESTAURANT.CREATE)).toBe(false);
        expect(checkPermission(editorUser, PERMISSIONS.RESTAURANT.UPDATE)).toBe(true);
        expect(checkPermission(editorUser, PERMISSIONS.RESTAURANT.DELETE)).toBe(false);
        expect(checkPermission(editorUser, PERMISSIONS.RESTAURANT.VIEW)).toBe(true);
      });

      it('should allow viewer only view operations', () => {
        expect(checkPermission(viewerUser, PERMISSIONS.RESTAURANT.CREATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.RESTAURANT.UPDATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.RESTAURANT.DELETE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.RESTAURANT.VIEW)).toBe(true);
      });
    });

    describe('Menu permissions', () => {
      it('should allow admin all menu operations', () => {
        expect(checkPermission(adminUser, PERMISSIONS.MENU.CREATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.MENU.UPDATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.MENU.DELETE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.MENU.VIEW)).toBe(true);
      });

      it('should allow editor all menu operations', () => {
        expect(checkPermission(editorUser, PERMISSIONS.MENU.CREATE)).toBe(true);
        expect(checkPermission(editorUser, PERMISSIONS.MENU.UPDATE)).toBe(true);
        expect(checkPermission(editorUser, PERMISSIONS.MENU.DELETE)).toBe(true);
        expect(checkPermission(editorUser, PERMISSIONS.MENU.VIEW)).toBe(true);
      });

      it('should allow viewer only view operations', () => {
        expect(checkPermission(viewerUser, PERMISSIONS.MENU.CREATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.MENU.UPDATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.MENU.DELETE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.MENU.VIEW)).toBe(true);
      });
    });

    describe('User management permissions', () => {
      it('should allow only admin to manage users', () => {
        expect(checkPermission(adminUser, PERMISSIONS.USER.CREATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.USER.UPDATE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.USER.DELETE)).toBe(true);
        expect(checkPermission(adminUser, PERMISSIONS.USER.VIEW)).toBe(true);
      });

      it('should not allow editor to manage users', () => {
        expect(checkPermission(editorUser, PERMISSIONS.USER.CREATE)).toBe(false);
        expect(checkPermission(editorUser, PERMISSIONS.USER.UPDATE)).toBe(false);
        expect(checkPermission(editorUser, PERMISSIONS.USER.DELETE)).toBe(false);
        expect(checkPermission(editorUser, PERMISSIONS.USER.VIEW)).toBe(false);
      });

      it('should not allow viewer to manage users', () => {
        expect(checkPermission(viewerUser, PERMISSIONS.USER.CREATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.USER.UPDATE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.USER.DELETE)).toBe(false);
        expect(checkPermission(viewerUser, PERMISSIONS.USER.VIEW)).toBe(false);
      });
    });

    describe('Audit log permissions', () => {
      it('should allow admin to view audit logs', () => {
        expect(checkPermission(adminUser, PERMISSIONS.AUDIT.VIEW)).toBe(true);
      });

      it('should not allow editor to view audit logs', () => {
        expect(checkPermission(editorUser, PERMISSIONS.AUDIT.VIEW)).toBe(false);
      });

      it('should not allow viewer to view audit logs', () => {
        expect(checkPermission(viewerUser, PERMISSIONS.AUDIT.VIEW)).toBe(false);
      });
    });
  });

  describe('canAccess', () => {
    const adminUser = { id: '1', role: UserRole.ADMIN };
    const editorUser = { id: '2', role: UserRole.EDITOR };
    const viewerUser = { id: '3', role: UserRole.VIEWER };

    it('should check route access for admin routes', () => {
      const adminRoutes = ['/admin/users', '/admin/audit', '/admin/settings'];
      
      adminRoutes.forEach(route => {
        expect(canAccess(adminUser, route)).toBe(true);
        expect(canAccess(editorUser, route)).toBe(false);
        expect(canAccess(viewerUser, route)).toBe(false);
      });
    });

    it('should check route access for editor routes', () => {
      const editorRoutes = ['/admin/menu', '/admin/content', '/admin/images'];
      
      editorRoutes.forEach(route => {
        expect(canAccess(adminUser, route)).toBe(true);
        expect(canAccess(editorUser, route)).toBe(true);
        expect(canAccess(viewerUser, route)).toBe(false);
      });
    });

    it('should check route access for viewer routes', () => {
      const viewerRoutes = ['/admin/dashboard', '/admin/reports'];
      
      viewerRoutes.forEach(route => {
        expect(canAccess(adminUser, route)).toBe(true);
        expect(canAccess(editorUser, route)).toBe(true);
        expect(canAccess(viewerUser, route)).toBe(true);
      });
    });

    it('should allow access to public routes', () => {
      const publicRoutes = ['/', '/menu', '/about', '/contact'];
      
      publicRoutes.forEach(route => {
        expect(canAccess(null, route)).toBe(true);
        expect(canAccess(viewerUser, route)).toBe(true);
      });
    });

    it('should handle API route permissions', () => {
      expect(canAccess(adminUser, '/api/users', 'POST')).toBe(true);
      expect(canAccess(editorUser, '/api/users', 'POST')).toBe(false);
      
      expect(canAccess(editorUser, '/api/menu', 'PUT')).toBe(true);
      expect(canAccess(viewerUser, '/api/menu', 'PUT')).toBe(false);
      
      expect(canAccess(viewerUser, '/api/menu', 'GET')).toBe(true);
    });
  });

  describe('Permission inheritance', () => {
    it('should implement proper role hierarchy', () => {
      const roles = [UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN];
      const permissions = [
        PERMISSIONS.MENU.VIEW,
        PERMISSIONS.MENU.UPDATE,
        PERMISSIONS.USER.CREATE,
      ];

      // VIEWER can only view
      expect(checkPermission({ role: roles[0] }, permissions[0])).toBe(true);
      expect(checkPermission({ role: roles[0] }, permissions[1])).toBe(false);
      expect(checkPermission({ role: roles[0] }, permissions[2])).toBe(false);

      // EDITOR can view and update menus, but not manage users
      expect(checkPermission({ role: roles[1] }, permissions[0])).toBe(true);
      expect(checkPermission({ role: roles[1] }, permissions[1])).toBe(true);
      expect(checkPermission({ role: roles[1] }, permissions[2])).toBe(false);

      // ADMIN can do everything
      expect(checkPermission({ role: roles[2] }, permissions[0])).toBe(true);
      expect(checkPermission({ role: roles[2] }, permissions[1])).toBe(true);
      expect(checkPermission({ role: roles[2] }, permissions[2])).toBe(true);
    });
  });
});