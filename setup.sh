#!/bin/bash

# UNIFIED Setup Script - PostgreSQL 15 Alpine
# Tested and verified to work with Prisma 5.8.1

set -e

echo "🚀 Restaurant Platform Setup"
echo "============================"
echo ""

# 1. Clean up any existing containers
echo "1. Cleaning up existing containers..."
docker stop restaurant-db 2>/dev/null || true
docker rm restaurant-db 2>/dev/null || true
echo "   ✓ Cleanup complete"

# 2. Start PostgreSQL 15 Alpine (TESTED VERSION)
echo ""
echo "2. Starting PostgreSQL 15..."
docker run -d \
    --name restaurant-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=restaurant_platform \
    -p 5433:5432 \
    postgres:15-alpine
echo "   ✓ PostgreSQL started"

# 3. Wait for database
echo ""
echo "3. Waiting for database (15 seconds)..."
sleep 15

# 4. Verify connection
echo ""
echo "4. Verifying database connection..."
docker exec restaurant-db psql -U postgres -d restaurant_platform -c "SELECT 1;" > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✓ Database connection verified"
else
    echo "   ❌ Database connection failed"
    echo "   Docker logs:"
    docker logs restaurant-db --tail 20
    exit 1
fi

# 5. Install dependencies
echo ""
echo "5. Installing dependencies..."
if ! command -v pnpm &> /dev/null; then
    echo "   Installing pnpm..."
    npm install -g pnpm
fi
pnpm install
echo "   ✓ Dependencies installed"

# 6. Create environment files
echo ""
echo "6. Creating environment files..."

# Create packages/database/.env
cat > packages/database/.env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"
EOF
echo "   ✓ Created packages/database/.env"

# Create apps/pave46/.env.local
cat > apps/pave46/.env.local << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"
NODE_ENV="development"
EOF
echo "   ✓ Created apps/pave46/.env.local"

# 7. Setup Prisma
echo ""
echo "7. Setting up database schema..."
cd packages/database

# Generate Prisma client
echo "   Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "   Creating database tables..."
npx prisma db push

# Seed database
echo "   Seeding database with Pavé data..."
npm run db:seed

cd ../..

# 8. Build packages
echo ""
echo "8. Building packages..."
pnpm build

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Database is running with:"
echo "  • PostgreSQL 15 Alpine"
echo "  • User: postgres"
echo "  • Password: postgres"
echo "  • Database: restaurant_platform"
echo "  • Port: 5433"
echo ""
echo "To start the development server:"
echo "  cd apps/pave46"
echo "  pnpm dev"
echo ""
echo "To check database:"
echo "  docker exec -it restaurant-db psql -U postgres -d restaurant_platform"