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
    echo "   ✓ Database already running"
else
    docker run -d --name restaurant-db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=restaurant_platform \
        -p 5432:5432 \
        postgres:16-alpine
    echo "   ✓ Database started"
    echo "   Waiting for database to be ready..."
    sleep 5
fi

# Step 2: Install dependencies
echo ""
echo "2️⃣ Installing dependencies..."
pnpm install
echo "   ✓ Dependencies installed"

# Step 3: Set up environment file
echo ""
echo "3️⃣ Setting up environment variables..."
if [ ! -f apps/pave46/.env.local ]; then
    cat > apps/pave46/.env.local << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform?schema=public"
RESTAURANT_SLUG=pave
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-for-local-development-only"
NODE_ENV="development"
EOL
    echo "   ✓ Created .env.local file"
else
    echo "   ✓ .env.local already exists"
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