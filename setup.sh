#!/bin/bash

# Restaurant Platform Quick Setup Script
# This script sets up everything needed for a fresh installation

set -e  # Exit on error

echo "🚀 Restaurant Platform Setup Script"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Step 1: Start PostgreSQL
echo "1️⃣ Starting PostgreSQL database..."
if docker ps | grep -q restaurant-db; then
    echo "   ✓ Database container already running"
    echo "   Restarting to ensure clean state..."
    docker restart restaurant-db
    sleep 3
else
    # Remove any existing stopped container
    docker rm -f restaurant-db 2>/dev/null || true
    
    # Start fresh container
    docker run -d --name restaurant-db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=restaurant_platform \
        -e POSTGRES_HOST_AUTH_METHOD=trust \
        -p 5432:5432 \
        postgres:16-alpine
    echo "   ✓ Database started"
    echo "   Waiting for database to be ready..."
    sleep 8
fi

# Test database connection
echo "   Testing database connection..."
until docker exec restaurant-db pg_isready -U postgres -d restaurant_platform > /dev/null 2>&1; do
    echo "   Waiting for database to accept connections..."
    sleep 2
done
echo "   ✓ Database is ready"

# Step 2: Install dependencies
echo ""
echo "2️⃣ Installing dependencies..."
pnpm install
echo "   ✓ Dependencies installed"

# Step 3: Set up environment files
echo ""
echo "3️⃣ Setting up environment variables..."

# Create .env.local for the app
if [ ! -f apps/pave46/.env.local ]; then
    cat > apps/pave46/.env.local << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-for-local-development-only"
NODE_ENV="development"
EOL
    echo "   ✓ Created apps/pave46/.env.local file"
else
    echo "   ✓ apps/pave46/.env.local already exists"
fi

# Create .env for database package (needed for Prisma)
if [ ! -f packages/database/.env ]; then
    cat > packages/database/.env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"
EOL
    echo "   ✓ Created packages/database/.env file"
else
    echo "   ✓ packages/database/.env already exists"
fi

# Step 4: Set up Prisma
echo ""
echo "4️⃣ Setting up database with Prisma..."
cd packages/database

echo "   Generating Prisma client..."
pnpm prisma generate

echo "   Running migrations..."
pnpm prisma migrate deploy || pnpm prisma db push

echo "   Seeding database with restaurant data..."
pnpm prisma db seed

cd ../..
echo "   ✓ Database setup complete"

# Step 5: Build packages
echo ""
echo "5️⃣ Building packages..."
pnpm build
echo "   ✓ Build complete"

# Done!
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  cd apps/pave46"
echo "  pnpm dev"
echo ""
echo "The app will be available at http://localhost:3000"
echo ""
echo "For admin access in development:"
echo "1. Go to http://localhost:3000/auth/login"
echo "2. Use the yellow 'Development Mode' panel"
echo "3. Click 'Admin' for full access"
echo ""
echo "Happy coding! 🎉"