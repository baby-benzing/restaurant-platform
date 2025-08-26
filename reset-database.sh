#!/bin/bash

# Complete Database Reset Script
# This will fix all PostgreSQL permission and connection issues

set -e

echo "🔄 Complete Database Reset Script"
echo "=================================="
echo ""
echo "This will completely reset your database and fix permission issues."
echo ""

# Step 1: Stop and remove ALL PostgreSQL containers
echo "1️⃣ Cleaning up existing PostgreSQL containers..."
docker stop restaurant-db 2>/dev/null || true
docker rm restaurant-db 2>/dev/null || true
docker ps -a | grep postgres | awk '{print $1}' | xargs -r docker rm -f 2>/dev/null || true
echo "   ✓ Removed all existing containers"

# Step 2: Remove any existing volumes (clean slate)
echo ""
echo "2️⃣ Removing old database volumes..."
docker volume prune -f 2>/dev/null || true
echo "   ✓ Cleaned up volumes"

# Step 3: Start fresh PostgreSQL with explicit permissions
echo ""
echo "3️⃣ Starting fresh PostgreSQL database..."
docker run -d \
    --name restaurant-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=restaurant_platform \
    -e POSTGRES_INITDB_ARGS="--auth-host=trust --auth-local=trust" \
    -p 5432:5432 \
    postgres:16-alpine \
    postgres -c "listen_addresses=*"

echo "   ✓ Database container started"

# Step 4: Wait for database to be fully ready
echo ""
echo "4️⃣ Waiting for database to initialize (this may take 10-15 seconds)..."
sleep 10

# Wait until PostgreSQL is ready
MAX_TRIES=30
COUNTER=0
until docker exec restaurant-db psql -U postgres -c "SELECT 1" > /dev/null 2>&1; do
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -gt $MAX_TRIES ]; then
        echo "   ❌ Database failed to start. Check Docker logs:"
        docker logs restaurant-db --tail 50
        exit 1
    fi
    echo "   Waiting for database... (attempt $COUNTER/$MAX_TRIES)"
    sleep 2
done

echo "   ✓ Database is ready"

# Step 5: Ensure database exists and permissions are correct
echo ""
echo "5️⃣ Setting up database and permissions..."
docker exec restaurant-db psql -U postgres << EOF
-- Ensure the database exists
SELECT 'CREATE DATABASE restaurant_platform' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'restaurant_platform');

-- Connect to the database
\c restaurant_platform

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE restaurant_platform TO postgres;
GRANT ALL ON SCHEMA public TO postgres;

-- Ensure public schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
ALTER DATABASE restaurant_platform SET search_path TO public;

-- Confirm setup
SELECT current_database(), current_user, current_schema();
EOF

echo "   ✓ Database permissions configured"

# Step 6: Create proper environment files
echo ""
echo "6️⃣ Creating environment files..."

# Remove old env files
rm -f apps/pave46/.env.local packages/database/.env

# Create new env files with correct DATABASE_URL
cat > apps/pave46/.env.local << 'EOL'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-for-local-development-only"
NODE_ENV="development"
EOL

cat > packages/database/.env << 'EOL'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
EOL

echo "   ✓ Environment files created"

# Step 7: Test the connection
echo ""
echo "7️⃣ Testing database connection..."
docker exec restaurant-db psql -U postgres -d restaurant_platform -c "SELECT version();" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Database connection successful!"
else
    echo "   ❌ Connection test failed"
    exit 1
fi

# Step 8: Set up Prisma
echo ""
echo "8️⃣ Setting up Prisma..."
cd packages/database

# Clean Prisma cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Reinstall Prisma dependencies
echo "   Installing Prisma dependencies..."
pnpm install

# Generate Prisma client
echo "   Generating Prisma client..."
pnpm prisma generate

# Push schema to database
echo "   Creating database tables..."
pnpm prisma db push --force-reset --accept-data-loss

# Seed the database
echo "   Seeding database with Pavé restaurant data..."
pnpm prisma db seed

cd ../..

# Step 9: Verify everything works
echo ""
echo "9️⃣ Verifying database setup..."
cd packages/database
pnpm prisma studio &
STUDIO_PID=$!
sleep 3
kill $STUDIO_PID 2>/dev/null || true
cd ../..

echo ""
echo "✅ Database reset complete!"
echo ""
echo "The database has been completely reset with:"
echo "  • User: postgres"
echo "  • Password: postgres"
echo "  • Database: restaurant_platform"
echo "  • Tables created and seeded with Pavé data"
echo ""
echo "You can now run:"
echo "  cd apps/pave46"
echo "  pnpm dev"
echo ""
echo "If you still have issues, check the database logs:"
echo "  docker logs restaurant-db"