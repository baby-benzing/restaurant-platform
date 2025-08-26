#!/bin/bash

# Simple Database Setup - Works with Prisma 5.x and PostgreSQL 15
# This uses the most compatible settings

echo "🚀 Simple Database Setup"
echo "========================"
echo ""

# Step 1: Clean up ANY existing PostgreSQL
echo "1. Removing any existing PostgreSQL containers..."
docker stop $(docker ps -aq --filter name=postgres) 2>/dev/null || true
docker stop $(docker ps -aq --filter name=restaurant) 2>/dev/null || true
docker rm $(docker ps -aq --filter name=postgres) 2>/dev/null || true
docker rm $(docker ps -aq --filter name=restaurant) 2>/dev/null || true
echo "   ✓ Cleaned up"

# Step 2: Use PostgreSQL 15 (most stable with Prisma)
echo ""
echo "2. Starting PostgreSQL 15..."
docker run -d \
    --name restaurant-db \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=postgres \
    -p 5432:5432 \
    postgres:15

echo "   ✓ PostgreSQL 15 started"

# Step 3: Wait for PostgreSQL to be ready
echo ""
echo "3. Waiting for PostgreSQL to be ready..."
sleep 10

# Step 4: Create the database manually
echo ""
echo "4. Creating database..."
docker exec -it restaurant-db psql -U postgres -c "DROP DATABASE IF EXISTS restaurant_platform;" 2>/dev/null || true
docker exec -it restaurant-db psql -U postgres -c "CREATE DATABASE restaurant_platform;"
docker exec -it restaurant-db psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE restaurant_platform TO postgres;"
echo "   ✓ Database created"

# Step 5: Create the SIMPLEST possible .env files
echo ""
echo "5. Creating .env files..."

# For Prisma (in packages/database)
cat > packages/database/.env << 'EOL'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
EOL
echo "   ✓ Created packages/database/.env"

# For the app
cat > apps/pave46/.env.local << 'EOL'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret"
NODE_ENV="development"
EOL
echo "   ✓ Created apps/pave46/.env.local"

# Step 6: Test connection with psql
echo ""
echo "6. Testing connection..."
docker exec -it restaurant-db psql -U postgres -d restaurant_platform -c "SELECT current_database();"
if [ $? -eq 0 ]; then
    echo "   ✓ Connection successful"
else
    echo "   ❌ Connection failed - checking Docker logs:"
    docker logs restaurant-db --tail 20
    exit 1
fi

# Step 7: Set up Prisma (the simple way)
echo ""
echo "7. Setting up Prisma..."
cd packages/database

# Clean everything
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Install fresh
npm install

# Generate client
npx prisma generate

# Push schema (simpler than migrate)
npx prisma db push

# Seed
npm run db:seed

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Database details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  User: postgres"
echo "  Pass: postgres"
echo "  Database: restaurant_platform"
echo ""
echo "Run: cd apps/pave46 && pnpm dev"