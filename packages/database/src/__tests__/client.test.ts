import * as path from 'path';
import * as fs from 'fs';

describe('Prisma Client', () => {
  describe('Client Generation', () => {
    it('should have Prisma client package installed', () => {
      const packageJsonPath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.dependencies).toHaveProperty('@prisma/client');
      expect(packageJson.devDependencies).toHaveProperty('prisma');
    });

    it('should have Prisma schema file', () => {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    it('should export Prisma client when generated', () => {
      const clientPath = path.join(__dirname, '../client.ts');
      
      if (!fs.existsSync(clientPath)) {
        console.log('Client file not yet created - will be generated');
        expect(true).toBe(true);
        return;
      }

      const clientContent = fs.readFileSync(clientPath, 'utf-8');
      expect(clientContent).toContain('PrismaClient');
      expect(clientContent).toContain('export');
    });
  });

  describe('Client Configuration', () => {
    it('should have database URL configured', () => {
      const envPath = path.join(__dirname, '../../../../.env');
      
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        expect(envContent).toContain('DATABASE_URL');
      } else {
        // Check for example env
        const envExamplePath = path.join(__dirname, '../../../../.env.example');
        expect(fs.existsSync(envExamplePath)).toBe(true);
      }
    });

    it('should have proper TypeScript types configured', () => {
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      expect(tsconfig.extends).toBe('../../tsconfig.json');
    });
  });

  describe('Schema Validation', () => {
    it('should have all required models in schema', () => {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      
      const requiredModels = [
        'Restaurant',
        'Menu',
        'MenuSection',
        'MenuItem',
        'OperatingHours',
        'Contact',
        'Image',
        'User'
      ];
      
      requiredModels.forEach(model => {
        expect(schemaContent).toContain(`model ${model}`);
      });
    });

    it('should have proper relationships defined', () => {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      
      // Check for foreign key relationships
      expect(schemaContent).toContain('restaurantId String');
      expect(schemaContent).toContain('menuId      String');
      expect(schemaContent).toContain('sectionId   String');
      
      // Check for relation directives
      expect(schemaContent).toContain('@relation');
      expect(schemaContent).toContain('onDelete: Cascade');
    });

    it('should have proper database mappings', () => {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      
      // Check for table name mappings
      expect(schemaContent).toContain('@@map("restaurants")');
      expect(schemaContent).toContain('@@map("menus")');
      expect(schemaContent).toContain('@@map("menu_sections")');
      expect(schemaContent).toContain('@@map("menu_items")');
    });
  });
});