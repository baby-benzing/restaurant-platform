export const databaseVersion = '0.1.0';

export interface DatabaseConfig {
  url: string;
  schema?: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/restaurant_platform',
    schema: 'public'
  };
}

// Export Prisma client
export { prisma as db, prisma } from './client';
export * from './client';

// Export repositories
export * from './repositories';

// Export utilities
export * from './utils';