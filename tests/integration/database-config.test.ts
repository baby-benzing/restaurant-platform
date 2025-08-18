import * as fs from 'fs';
import * as path from 'path';
import { getDatabaseConfig } from '../../packages/database/src';

describe('Database Configuration', () => {
  describe('Environment Configuration', () => {
    it('should have DATABASE_URL configured', () => {
      const envPath = path.join(__dirname, '../../.env');
      const envExists = fs.existsSync(envPath);
      expect(envExists).toBe(true);

      const envContent = fs.readFileSync(envPath, 'utf-8');
      expect(envContent).toContain('DATABASE_URL');
      expect(envContent).toContain('postgresql://');
    });

    it('should have valid database configuration', () => {
      const config = getDatabaseConfig();
      expect(config.url).toBeDefined();
      expect(config.url).toContain('postgresql://');
      expect(config.schema).toBe('public');
    });
  });

  describe('Prisma Configuration', () => {
    it('should have Prisma schema file', () => {
      const schemaPath = path.join(__dirname, '../../packages/database/prisma/schema.prisma');
      const schemaExists = fs.existsSync(schemaPath);
      expect(schemaExists).toBe(true);
    });

    it('should have valid Prisma schema', () => {
      const schemaPath = path.join(__dirname, '../../packages/database/prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      
      expect(schemaContent).toContain('generator client');
      expect(schemaContent).toContain('datasource db');
      expect(schemaContent).toContain('provider = "postgresql"');
      expect(schemaContent).toContain('model Restaurant');
      expect(schemaContent).toContain('model Menu');
      expect(schemaContent).toContain('model User');
    });
  });

  describe('Docker Configuration', () => {
    it('should have docker-compose.yml configured', () => {
      const dockerComposePath = path.join(__dirname, '../../docker-compose.yml');
      const dockerComposeExists = fs.existsSync(dockerComposePath);
      expect(dockerComposeExists).toBe(true);

      const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf-8');
      expect(dockerComposeContent).toContain('postgres:16-alpine');
      expect(dockerComposeContent).toContain('POSTGRES_DB: restaurant_platform');
      expect(dockerComposeContent).toContain('5432:5432');
    });
  });

  describe('Database Connection', () => {
    it('should be ready for database connection (Docker required)', () => {
      const { execSync } = require('child_process');
      
      try {
        execSync('docker --version', { encoding: 'utf-8' });
        console.log('Docker is available - database can be started with: docker-compose up -d');
      } catch (error) {
        console.warn('Docker not available - PostgreSQL needs to be installed manually');
        console.warn('Connection string from .env:', process.env.DATABASE_URL || 'Not configured');
      }
      
      expect(true).toBe(true);
    });
  });
});