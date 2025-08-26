# Restaurant Platform Setup Guide

## Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- pnpm (`npm install -g pnpm`)

## Initial Setup

### 1. Clone the repository
```bash
git clone https://github.com/claudev-cheval/restaurant-platform.git
cd restaurant-platform
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up PostgreSQL
```bash
# Using Docker (recommended)
docker run -d --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_platform \
  -p 5433:5432 \
  postgres:15-alpine
```

### 4. Configure environment variables
```bash
cd apps/pave46
cp .env.example .env.local
```

Edit `.env.local` with your settings:
```env
# Required
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"
RESTAURANT_SLUG=pave

# For production (optional in dev)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. Set up the database
```bash
cd ../../packages/database

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed the database with sample data
pnpm prisma db seed
```

### 6. Build packages
```bash
cd ../..
pnpm build
```

### 7. Start the development server
```bash
cd apps/pave46
pnpm dev
```

The application will be available at http://localhost:3000

## Admin Access

### Development Mode
In development, you can use the dev bypass login:
1. Go to http://localhost:3000/auth/login
2. Use the yellow "Development Mode - Quick Login" panel
3. Click on any role (Admin, Editor, Viewer)

### Production Mode
Configure Google SSO following the instructions in `docs/GOOGLE_SSO_SETUP.md`

## Troubleshooting

### "No menu items found" in admin
1. Ensure database is running: `docker ps`
2. Re-seed the database: `cd packages/database && pnpm prisma db seed`
3. Check logs for errors: Look for database connection errors

### Authentication issues
1. In development, the dev bypass login should work automatically
2. For production, ensure Google SSO is properly configured
3. Check that middleware is not blocking requests

### Port conflicts
If port 3000 is in use, the app will automatically use 3001 or 3002

## Key Features
- **Admin Panel**: /admin/dashboard (requires authentication)
- **Menu Management**: /admin/menu
- **Media Articles**: /admin/media
- **User Management**: /admin/users
- **Public Site**: / (no auth required)

## Architecture Notes
- Monorepo structure using pnpm workspaces
- Next.js 14 with App Router
- PostgreSQL with Prisma ORM
- Authentication via NextAuth (Google SSO) or dev bypass
- Middleware handles all admin route protection