#!/bin/bash

# Database Fix Script - Resolves common PostgreSQL connection issues

echo "🔧 Database Connection Fix Script"
echo "=================================="
echo ""

# Stop and remove existing container
echo "1. Stopping and removing existing database container..."
docker stop restaurant-db 2>/dev/null || true
docker rm restaurant-db 2>/dev/null || true
echo "   ✓ Cleaned up old container"

# Start fresh database
echo ""
echo "2. Starting fresh PostgreSQL container..."
docker run -d --name restaurant-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=restaurant_platform \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    -p 5432:5432 \
    postgres:16-alpine

echo "   ✓ Database container started"

# Wait for database to be ready
echo ""
echo "3. Waiting for database to initialize..."
sleep 10

# Test connection
echo ""
echo "4. Testing database connection..."
docker exec restaurant-db psql -U postgres -d restaurant_platform -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Database connection successful!"
else
    echo "   ❌ Connection failed. Checking logs..."
    docker logs restaurant-db --tail 20
fi

# Create proper .env files
echo ""
echo "5. Creating environment files..."

# For the app
cat > apps/pave46/.env.local << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-for-local-development-only"
NODE_ENV="development"
EOL
echo "   ✓ Created apps/pave46/.env.local"

# For Prisma
cat > packages/database/.env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
EOL
echo "   ✓ Created packages/database/.env"

echo ""
echo "6. Setting up database with Prisma..."
cd packages/database

# Generate Prisma client
echo "   Generating Prisma client..."
pnpm prisma generate

# Push schema to database
echo "   Creating database tables..."
pnpm prisma db push --accept-data-loss

# Seed database
echo "   Seeding database with restaurant data..."
pnpm prisma db seed

echo ""
echo "✅ Database fix complete!"
echo ""
echo "Now you can run:"
echo "  cd ../../apps/pave46"
echo "  pnpm dev"