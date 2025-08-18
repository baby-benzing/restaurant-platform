# @restaurant-platform/database

Database layer for the Restaurant Platform using Prisma ORM with PostgreSQL.

## Features

- **Prisma ORM** for type-safe database access
- **Repository Pattern** for clean data access layer
- **Transaction Support** with retry mechanisms
- **Error Handling** with custom error classes
- **Seed Data** for development
- **TypeScript** with full type safety

## Installation

```bash
pnpm install
```

## Setup

### 1. Database Configuration

Create a `.env` file in the package root:

```env
DATABASE_URL="postgresql://restaurant_admin:restaurant_pass_2024@localhost:5432/restaurant_platform?schema=public"
```

### 2. Start PostgreSQL

Using Docker (recommended):
```bash
docker-compose up -d
```

Or install PostgreSQL locally and create the database:
```sql
CREATE DATABASE restaurant_platform;
CREATE USER restaurant_admin WITH PASSWORD 'restaurant_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE restaurant_platform TO restaurant_admin;
```

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

### 4. Run Migrations

```bash
pnpm db:migrate
```

### 5. Seed Database

```bash
pnpm db:seed
```

## Usage

### Basic Usage

```typescript
import { prisma, RestaurantRepository } from '@restaurant-platform/database';

// Using Prisma directly
const restaurants = await prisma.restaurant.findMany();

// Using repositories
const restaurantRepo = new RestaurantRepository(prisma);
const pave46 = await restaurantRepo.findBySlug('pave46');
```

### Repository Pattern

```typescript
import { RepositoryFactory, prisma } from '@restaurant-platform/database';

const repos = RepositoryFactory.getInstance(prisma);

// Restaurant operations
const restaurant = await repos.restaurant.findBySlugWithRelations('pave46');
const allRestaurants = await repos.restaurant.getActiveRestaurants();

// Menu operations
const menu = await repos.menu.findWithSections('menu-id');
await repos.menu.toggleActive('menu-id');

// User operations
const user = await repos.user.verifyPassword('email@example.com', 'password');
const safeUser = await repos.user.findSafeById('user-id'); // Without password hash
```

### Transactions

```typescript
import { withTransaction, prisma } from '@restaurant-platform/database';

// Simple transaction
const result = await withTransaction(async (tx) => {
  const restaurant = await tx.restaurant.create({ data: {...} });
  const menu = await tx.menu.create({ 
    data: { restaurantId: restaurant.id, ...} 
  });
  return { restaurant, menu };
});

// Retry transaction (for handling deadlocks)
import { retryTransaction } from '@restaurant-platform/database';

const result = await retryTransaction(async (tx) => {
  // Complex operations that might deadlock
}, 3, 100); // 3 retries, 100ms delay
```

### Error Handling

```typescript
import { 
  RecordNotFoundError, 
  UniqueConstraintError,
  ValidationError 
} from '@restaurant-platform/database';

try {
  await repos.restaurant.updateBySlug('invalid', data);
} catch (error) {
  if (error instanceof RecordNotFoundError) {
    // Handle not found
  } else if (error instanceof UniqueConstraintError) {
    // Handle unique constraint violation
  } else if (error instanceof ValidationError) {
    // Handle validation error
  }
}
```

## Available Scripts

- `pnpm build` - Build the package
- `pnpm dev` - Watch mode for development
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes (development)
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio

## Database Schema

### Core Models

- **Restaurant** - Restaurant information with slug, name, description
- **Menu** - Restaurant menus with sections and items
- **MenuSection** - Groupings within a menu
- **MenuItem** - Individual menu items with pricing
- **OperatingHours** - Restaurant hours by day
- **Contact** - Contact information (phone, email, address, social)
- **Image** - Restaurant images and galleries
- **User** - User accounts with roles and authentication

### Relationships

- Restaurant → has many → Menus, OperatingHours, Contacts, Images
- Menu → has many → MenuSections
- MenuSection → has many → MenuItems
- All relationships use CASCADE delete for data integrity

## Testing

Run all tests:
```bash
pnpm test
```

Run specific test suites:
```bash
pnpm test client.test.ts        # Client tests
pnpm test repositories/         # Repository tests
pnpm test seed.test.ts          # Seed tests
```

## Development

### Adding New Models

1. Update `prisma/schema.prisma`
2. Generate migration: `pnpm db:migrate --name your_migration_name`
3. Generate client: `pnpm db:generate`
4. Create repository in `src/repositories/`
5. Add tests in `src/__tests__/`
6. Update seed data if needed

### Custom Repositories

```typescript
import { BaseRepository } from '@restaurant-platform/database';
import type { PrismaClient } from '@prisma/client';

export class CustomRepository extends BaseRepository<CustomModel> {
  constructor(private prisma: PrismaClient) {
    super(prisma.customModel);
  }

  // Add custom methods
  async customMethod() {
    return this.model.findMany({
      where: { /* custom filters */ }
    });
  }
}
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production/test)

## License

Private - All rights reserved