import { greetFromWebCommon, webCommonVersion } from '../../packages/web-common/src';
import { getDatabaseConfig, databaseVersion } from '../../packages/database/src';
import { initializeAdmin, adminVersion } from '../../packages/admin/src';

describe('Workspace Package References', () => {
  describe('Package Exports', () => {
    it('should export from web-common package', () => {
      expect(webCommonVersion).toBe('0.1.0');
      expect(greetFromWebCommon('Test')).toBe('Hello Test from web-common package!');
    });

    it('should export from database package', () => {
      expect(databaseVersion).toBe('0.1.0');
      const config = getDatabaseConfig();
      expect(config).toHaveProperty('url');
      expect(config).toHaveProperty('schema');
    });

    it('should export from admin package', () => {
      expect(adminVersion).toBe('0.1.0');
      const adminInit = initializeAdmin();
      expect(adminInit).toContain('Hello Admin from web-common package!');
      expect(adminInit).toContain('Database configured at:');
    });
  });

  describe('Cross-Package Dependencies', () => {
    it('admin package should use web-common exports', () => {
      const adminInit = initializeAdmin();
      expect(adminInit).toContain('web-common package');
    });

    it('admin package should use database exports', () => {
      const adminInit = initializeAdmin();
      expect(adminInit).toContain('postgresql://localhost:5432/restaurant_platform');
    });
  });
});