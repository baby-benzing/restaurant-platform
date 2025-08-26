# Restaurant Platform

A multi-restaurant website platform with shared components and individual restaurant configurations.

## Project Structure

```
restaurant-platform/
├── apps/
│   └── pave46/              # Pavé46 restaurant application
├── packages/
│   ├── web-common/          # Shared UI components library
│   ├── database/            # Prisma ORM and database utilities
│   ├── auth/                # Authentication system
│   └── admin/               # Admin panel components
├── planning/                # Task breakdowns and planning documents
├── docs/
│   ├── decisions/          # Architecture Decision Records
│   └── testing/            # Test documentation
└── docker-compose.yml      # PostgreSQL database setup
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker (for PostgreSQL database)

### First-Time Setup (New Machine/Fresh Clone)

1. **Clone the repository:**
```bash
git clone https://github.com/claudev-cheval/restaurant-platform.git
cd restaurant-platform
```

2. **Run the one-time setup script:**
```bash
./setup.sh  # Run this ONLY on first setup
```

This will automatically:
- Start PostgreSQL database with Docker
- Install all dependencies
- Set up environment variables (.env.local)
- Generate Prisma client
- Create database tables
- Seed the database with Pavé restaurant data (not mock/oyster data!)
- Build all packages

3. **Start the development server:**
```bash
cd apps/pave46
pnpm dev
```

✅ The app will be available at http://localhost:3000

### Daily Development (After Initial Setup)

Once you've run the initial setup, you have two options for daily development:

**Option 1: Use the development script (Recommended)**
```bash
./start-dev.sh  # Starts database + all dev servers
```

**Option 2: Manual start**
```bash
# Start existing database container
docker start restaurant-db

# Start development server
cd apps/pave46
pnpm dev
```

📝 **Note:** 
- `./setup.sh` = One-time setup for new installations (creates database, seeds data)
- `./start-dev.sh` = Daily use (starts existing database and dev servers)
- Don't run `./setup.sh` again unless you want to reset everything!

### Manual Setup

If you prefer to set up manually:

1. **Start PostgreSQL database:**
```bash
docker run -d --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_platform \
  -p 5432:5432 \
  postgres:16-alpine
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**

**IMPORTANT:** Environment files are needed in TWO locations:

```bash
# For the app (apps/pave46/.env.local)
cd apps/pave46
cp .env.example .env.local

# For Prisma database commands (packages/database/.env)
cd ../../packages/database
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform?schema=public"' > .env
```

Edit `apps/pave46/.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform?schema=public"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-for-local-development-only"
NODE_ENV="development"
```

4. **Initialize the database:**
```bash
cd ../../packages/database

# Generate Prisma client
pnpm prisma generate

# Create database tables
pnpm prisma migrate deploy

# Seed with Pavé restaurant data
pnpm prisma db seed
```

5. **Build packages:**
```bash
cd ../..  # Back to root
pnpm build
```

6. **Start the development server:**
```bash
cd apps/pave46
pnpm dev
```

✅ The app will be available at http://localhost:3000

## Development Guide

### Working with Packages

This is a monorepo using pnpm workspaces. All packages are linked automatically.

#### Using web-common components:

```tsx
// In any app (e.g., apps/pave46)
import { 
  Button, 
  Card, 
  Container,
  MenuDisplay 
} from '@restaurant-platform/web-common';

export default function MyPage() {
  return (
    <Container>
      <Card padding="lg">
        <Button variant="primary">Click me</Button>
      </Card>
    </Container>
  );
}
```

#### Using authentication:

```tsx
import { AuthService, verifyToken } from '@restaurant-platform/auth';

const authService = new AuthService();

// Login
const result = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// Verify JWT token
const decoded = verifyToken(token);
```

### Available Scripts

Run these from the root directory:

```bash
# Development
pnpm dev              # Start only app development servers (recommended)
pnpm dev:all          # Start all packages in watch mode (for library development)

# Building
pnpm build            # Build all packages
pnpm build:web-common # Build only web-common package

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report

# Code Quality
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
pnpm typecheck        # Type check all packages

# Database (run from packages/database)
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:seed          # Seed database with sample data
```

### Package-Specific Commands

#### Web Common (`packages/web-common`)
```bash
cd packages/web-common
pnpm test             # Run component tests
pnpm build            # Build component library
pnpm storybook        # Start Storybook (if configured)
```

#### Database (`packages/database`)
```bash
cd packages/database
pnpm db:studio        # Visual database editor
pnpm test             # Run repository tests
```

#### Auth (`packages/auth`)
```bash
cd packages/auth
pnpm test             # Run auth tests
pnpm test:coverage    # Check coverage
```

#### Pavé46 App (`apps/pave46`)
```bash
cd apps/pave46
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
```

## Common Issues & Solutions

### "No menu items found" or "Oyster data"

This means the database isn't properly seeded. Fix:
```bash
cd packages/database
pnpm prisma db seed
```

### "Database not responding" or "User postgres was denied access" error

This is a PostgreSQL permission issue. Use the reset script:
```bash
./reset-database.sh
```

This will:
- Completely reset the PostgreSQL container
- Fix all permission issues
- Recreate the database with proper access
- Seed with Pavé restaurant data

Alternative manual fix:
```bash
# 1. Stop and remove the container
docker stop restaurant-db && docker rm restaurant-db

# 2. Start fresh with proper permissions
docker run -d --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_platform \
  -e POSTGRES_INITDB_ARGS="--auth-host=trust --auth-local=trust" \
  -p 5432:5432 \
  postgres:16-alpine

# 3. Wait 10 seconds, then continue with setup
sleep 10
cd packages/database
pnpm prisma db push --force-reset
pnpm prisma db seed
```

### Docker Issues

**Error: "Cannot connect to the Docker daemon"**
- Docker Desktop is not running
- Start Docker Desktop first, then run the commands

**Database connection refused:**
```bash
# Check if Docker is running
docker version

# Check if container is running
docker ps

# View container logs
docker logs restaurant-db

# Restart container
docker restart restaurant-db

# Remove and recreate container
docker rm -f restaurant-db
# Then run the docker run command again
```

### Database Issues

**Prisma client not found:**
```bash
cd packages/database
pnpm db:generate
```

**Migration issues:**
```bash
# Reset database (WARNING: deletes all data)
cd packages/database
pnpm prisma migrate reset
```

### Development Server Issues

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 [PID]
```

**Module not found errors:**
```bash
# Reinstall dependencies
pnpm install

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Admin Access

### Development Mode

In development, you have two options:

1. **Quick Dev Login (Easiest):**
   - Go to http://localhost:3000/auth/login
   - Use the yellow "Development Mode - Quick Login" panel
   - Click any role button (Admin, Editor, Viewer)

2. **Default Admin User:**
   - After seeding the database, login with:
   - Email: `admin@pave46.com`
   - Password: `AdminPassword123!`

### Production Mode

For production, configure Google SSO following `docs/GOOGLE_SSO_SETUP.md`

### Creating New Users

Currently, users must be created via database seed or Prisma Studio:

```bash
cd packages/database
pnpm db:studio
# Navigate to User table and add new records
```

### Role Permissions

- **ADMIN**: Full access to all features
- **EDITOR**: Can edit content (menus, hours, etc.)
- **VIEWER**: Read-only access to admin panel

## Testing

This project follows Test-Driven Development (TDD):

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test --filter @restaurant-platform/auth

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Writing Tests

Tests are co-located with source files:

```
packages/web-common/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
```

## Production Deployment

### Build for Production

```bash
# Build all packages
pnpm build

# Build specific app
cd apps/pave46
pnpm build
```

### Environment Variables

Required for production:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=strong-random-secret
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/pave46
vercel
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Authentication**: Custom JWT implementation
- **Package Manager**: pnpm (workspace)
- **Language**: TypeScript (strict mode)

## Project Status

✅ Completed:
- Project setup and structure
- Database schema and ORM
- Shared component library
- Pavé46 restaurant website
- Authentication system

🚧 In Progress:
- Content Management System
- API layer development

## Contributing

1. Follow TDD principles
2. Maintain 80% test coverage
3. Update CHANGELOG.md
4. Document decisions in docs/decisions/

## License

Private - All rights reserved