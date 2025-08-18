const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Project Setup Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');

  describe('Tool Installation', () => {
    it('should have pnpm installed', () => {
      const version = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
      const major = parseInt(version.split('.')[0]);
      expect(major).toBeGreaterThanOrEqual(8);
    });

    it('should have Node.js 18+ installed', () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      expect(major).toBeGreaterThanOrEqual(18);
    });

    it('should have TypeScript installed', () => {
      const version = execSync('pnpm tsc --version', { encoding: 'utf-8' }).trim();
      expect(version).toContain('Version');
    });

    it('should have Docker installed (optional)', () => {
      try {
        const version = execSync('docker --version', { encoding: 'utf-8' }).trim();
        expect(version).toContain('Docker version');
      } catch (error) {
        console.warn('Docker not installed - PostgreSQL will need to be installed separately');
        expect(true).toBe(true);
      }
    });

    it('should have Docker Compose installed (optional)', () => {
      try {
        const version = execSync('docker compose version', { encoding: 'utf-8' }).trim();
        expect(version).toContain('Docker Compose');
      } catch (error) {
        console.warn('Docker Compose not installed - PostgreSQL will need to be managed manually');
        expect(true).toBe(true);
      }
    });
  });

  describe('Project Structure', () => {
    it('should have required directories', () => {
      const requiredDirs = [
        'apps/pave46',
        'packages/web-common',
        'packages/database',
        'packages/admin',
        'planning',
        'docs/decisions',
        'docs/testing',
        'tests/unit',
        'tests/integration',
        'tests/e2e'
      ];

      requiredDirs.forEach(dir => {
        const fullPath = path.join(rootDir, dir);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    it('should have required configuration files', () => {
      const requiredFiles = [
        'package.json',
        'pnpm-workspace.yaml',
        'tsconfig.json',
        '.eslintrc.json',
        '.prettierrc',
        '.gitignore',
        'docker-compose.yml',
        'README.md',
        'CHANGELOG.md',
        'progress.log'
      ];

      requiredFiles.forEach(file => {
        const fullPath = path.join(rootDir, file);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('Package Configuration', () => {
    it('should have workspace packages configured', () => {
      const packages = [
        'apps/pave46/package.json',
        'packages/web-common/package.json',
        'packages/database/package.json',
        'packages/admin/package.json'
      ];

      packages.forEach(pkg => {
        const fullPath = path.join(rootDir, pkg);
        expect(fs.existsSync(fullPath)).toBe(true);
        
        const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        expect(packageJson.name).toBeDefined();
        expect(packageJson.version).toBeDefined();
      });
    });

    it('should have TypeScript config in each package', () => {
      const tsconfigs = [
        'apps/pave46/tsconfig.json',
        'packages/web-common/tsconfig.json',
        'packages/database/tsconfig.json',
        'packages/admin/tsconfig.json'
      ];

      tsconfigs.forEach(config => {
        const fullPath = path.join(rootDir, config);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    it('should have Jest config in each package', () => {
      const jestConfigs = [
        'apps/pave46/jest.config.js',
        'packages/web-common/jest.config.js',
        'packages/database/jest.config.js',
        'packages/admin/jest.config.js'
      ];

      jestConfigs.forEach(config => {
        const fullPath = path.join(rootDir, config);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('Dependencies', () => {
    it('should have all dependencies installed', () => {
      const nodeModulesExists = fs.existsSync(path.join(rootDir, 'node_modules'));
      expect(nodeModulesExists).toBe(true);
      
      const lockFileExists = fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'));
      expect(lockFileExists).toBe(true);
    });
  });
});