#!/bin/bash

# Restaurant Platform Development Startup Script

echo "🚀 Starting Restaurant Platform Development Environment..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Flag to track if database is available
DB_AVAILABLE=false

# Function to check if database is accessible
check_database() {
    # Try to connect to PostgreSQL
    if command -v psql &> /dev/null; then
        PGPASSWORD=postgres psql -h localhost -U postgres -d restaurant_platform -c "SELECT 1" &> /dev/null
        return $?
    else
        # Alternative: check if port is open
        nc -z localhost 5432 &> /dev/null
        return $?
    fi
}

# Check if Docker is installed and running
if command -v docker &> /dev/null; then
    # Test if Docker daemon is running
    if docker version &> /dev/null; then
        echo "📦 Starting PostgreSQL database..."
        
        # Check if container already exists
        if docker ps -a | grep -q restaurant-db; then
            echo "   Container exists, checking status..."
            
            # Check if container is running
            if docker ps | grep -q restaurant-db; then
                echo -e "   ${GREEN}Container is already running${NC}"
            else
                echo "   Starting container..."
                docker start restaurant-db
            fi
        else
            echo "   Creating new PostgreSQL container..."
            docker run -d \
                --name restaurant-db \
                -e POSTGRES_USER=postgres \
                -e POSTGRES_PASSWORD=postgres \
                -e POSTGRES_DB=restaurant_platform \
                -p 5432:5432 \
                postgres:16-alpine
        fi
        
        # Wait for database to be ready
        echo "⏳ Waiting for database to be ready..."
        MAX_ATTEMPTS=30
        ATTEMPT=0
        
        while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
            if check_database; then
                echo -e "   ${GREEN}Database is ready!${NC}"
                DB_AVAILABLE=true
                break
            fi
            echo -n "."
            sleep 1
            ATTEMPT=$((ATTEMPT + 1))
        done
        
        if [ "$DB_AVAILABLE" = false ]; then
            echo ""
            echo -e "   ${YELLOW}⚠️  Database is not responding after 30 seconds${NC}"
            echo "   The app will use mock authentication instead."
        fi
    else
        echo -e "${YELLOW}⚠️  Docker is installed but not running.${NC}"
        echo "   Please start Docker Desktop and try again."
        echo "   The app will use mock authentication instead."
        echo ""
        echo "   To start Docker:"
        echo "   - On macOS: open -a Docker"
        echo "   - On Linux: sudo systemctl start docker"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not found.${NC}"
    echo "   The app will use mock authentication instead."
    echo ""
    echo "   To install Docker:"
    echo "   - Visit: https://docs.docker.com/get-docker/"
fi

# Only run database operations if database is available
if [ "$DB_AVAILABLE" = true ]; then
    echo ""
    echo "🔧 Setting up database..."
    
    # Generate Prisma client
    echo "   Generating Prisma client..."
    cd packages/database
    pnpm db:generate > /dev/null 2>&1
    
    # Push schema to database
    echo "   Updating database schema..."
    if pnpm db:push > /dev/null 2>&1; then
        echo -e "   ${GREEN}Schema updated successfully${NC}"
        
        # Seed database (skip interactive prompt in CI or when NO_INTERACTIVE is set)
        if [[ -z "${CI}" && -z "${NO_INTERACTIVE}" ]]; then
            echo ""
            read -p "Would you like to seed the database with sample data? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo "🌱 Seeding database..."
                if pnpm db:seed; then
                    echo -e "   ${GREEN}Database seeded successfully${NC}"
                else
                    echo -e "   ${RED}Failed to seed database${NC}"
                fi
            fi
        fi
    else
        echo -e "   ${RED}Failed to update schema${NC}"
        DB_AVAILABLE=false
    fi
    
    cd ../..
else
    echo ""
    echo "📝 Skipping database setup (database not available)"
    echo ""
    echo "🔐 Mock Authentication Mode:"
    echo "   You can login with these test accounts:"
    echo "   • Admin: admin@pave46.com / AdminPassword123!"
    echo "   • Editor: editor@pave46.com / EditorPassword123!"
fi

echo ""
echo "🎨 Starting development servers..."
echo ""

# Start all dev servers
pnpm dev &
DEV_PID=$!

echo ""
if [ "$DB_AVAILABLE" = true ]; then
    echo -e "${GREEN}✅ Development environment is ready!${NC}"
    echo ""
    echo "📍 Access points:"
    echo "   • Main app: http://localhost:3000 (or 3001/3002 if port is busy)"
    echo "   • Admin panel: http://localhost:3001/admin"
    echo "   • Database UI: cd packages/database && pnpm db:studio"
else
    echo -e "${YELLOW}⚠️  Development environment is ready (without database)${NC}"
    echo ""
    echo "📍 Access points:"
    echo "   • Main app: http://localhost:3000 (or 3001/3002 if port is busy)"
    echo "   • Admin panel: http://localhost:3001/admin"
    echo ""
    echo "   Using mock authentication - no database required!"
fi

echo ""
echo "📚 Useful commands:"
echo "   • View logs: tail -f /tmp/pave46-dev.log"
echo "   • Run tests: pnpm test"
echo "   • Build all: pnpm build"
echo "   • Stop all: Press Ctrl+C"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $DEV_PID 2>/dev/null; exit" INT
wait $DEV_PID