#!/bin/bash

# Hulihuli Restaurant Setup Script
# Sets up database, environment, and seeds initial data

set -e

echo "🌺 Hulihuli Restaurant Setup"
echo "============================"
echo ""

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the hulihuli app directory"
    echo "   cd apps/hulihuli && ./setup.sh"
    exit 1
fi

# 1. Check if database is running
echo "1. Checking database connection..."
if docker ps | grep -q restaurant-db; then
    echo "   ✓ Database container is running"
else
    echo "   ⚠️  Database not running. Starting PostgreSQL..."
    cd ../..
    ./setup.sh
    cd apps/hulihuli
    echo "   ✓ Database started"
fi

# 2. Create environment file
echo ""
echo "2. Creating environment file..."
if [ -f ".env" ]; then
    echo "   ⚠️  .env already exists. Creating backup..."
    cp .env .env.backup
fi

cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"

# NextAuth
AUTH_SECRET="hulihuli-dev-secret-$(openssl rand -base64 32 | tr -d '\n')"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (REQUIRED - Add your credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
EOF

echo "   ✓ Created .env file"

# 3. Install dependencies
echo ""
echo "3. Installing dependencies..."
pnpm install
echo "   ✓ Dependencies installed"

# 4. Setup database
echo ""
echo "4. Setting up Hulihuli database..."

# Generate a unique email for admin
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@hulihuli.com}"

# Execute SQL setup
docker exec restaurant-db psql -U postgres -d restaurant_platform << EOSQL
-- Create admin role (if not exists)
INSERT INTO admin_roles (id, name, description, permissions, "isSystem", "createdAt", "updatedAt")
VALUES (
  'role-admin',
  'Admin',
  'Full system access',
  '{"*"}',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create admin user for Hulihuli
INSERT INTO admin_users (
  id,
  email,
  "roleId",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-hulihuli',
  '${ADMIN_EMAIL}',
  'role-admin',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE';

-- Create Hulihuli restaurant
INSERT INTO restaurants (
  id,
  slug,
  name,
  description,
  "createdAt",
  "updatedAt"
) VALUES (
  'hulihuli-restaurant',
  'hulihuli',
  'Hulihuli',
  'Authentic Hawaiian cuisine with a modern twist',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Link admin user to restaurant
INSERT INTO admin_user_restaurants (
  id,
  "userId",
  "restaurantId",
  "isPrimary",
  "createdAt"
) VALUES (
  'admin-hulihuli-restaurant',
  'admin-hulihuli',
  'hulihuli-restaurant',
  true,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Add operating hours
INSERT INTO operating_hours ("restaurantId", "dayOfWeek", "openTime", "closeTime", "isClosed", "createdAt", "updatedAt")
VALUES
  ('hulihuli-restaurant', 0, '10:00', '21:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 1, '10:00', '21:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 2, '10:00', '21:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 3, '10:00', '21:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 4, '10:00', '22:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 5, '10:00', '22:00', false, NOW(), NOW()),
  ('hulihuli-restaurant', 6, '10:00', '22:00', false, NOW(), NOW())
ON CONFLICT ("restaurantId", "dayOfWeek") DO NOTHING;

-- Add contact information
INSERT INTO contacts ("restaurantId", "type", "value", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('hulihuli-restaurant', 'address', '123 Aloha Street, Honolulu, HI 96815', 0, NOW(), NOW()),
  ('hulihuli-restaurant', 'phone', '(808) 555-1234', 1, NOW(), NOW()),
  ('hulihuli-restaurant', 'email', 'info@hulihuli.com', 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create main menu
INSERT INTO menus (id, "restaurantId", name, description, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  'hulihuli-menu',
  'hulihuli-restaurant',
  'Main Menu',
  'Our signature Hawaiian dishes',
  0,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Add menu sections
INSERT INTO menu_sections (id, "menuId", name, description, "sortOrder", "createdAt", "updatedAt")
VALUES
  ('section-mains', 'hulihuli-menu', 'Main Dishes', 'Traditional Hawaiian plates', 0, NOW(), NOW()),
  ('section-appetizers', 'hulihuli-menu', 'Appetizers', 'Start your meal right', 1, NOW(), NOW()),
  ('section-drinks', 'hulihuli-menu', 'Beverages', 'Refreshing tropical drinks', 2, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample menu items
INSERT INTO menu_items ("sectionId", name, description, price, "sortOrder", "isAvailable", "createdAt", "updatedAt")
VALUES
  ('section-mains', 'Kalua Pork Plate', 'Slow-roasted pork with cabbage, rice, and macaroni salad', 16.99, 0, true, NOW(), NOW()),
  ('section-mains', 'Chicken Katsu', 'Crispy panko-breaded chicken with katsu sauce', 14.99, 1, true, NOW(), NOW()),
  ('section-mains', 'Poke Bowl', 'Fresh ahi tuna with rice, seaweed, and vegetables', 18.99, 2, true, NOW(), NOW()),
  ('section-mains', 'Loco Moco', 'Beef patty over rice with fried egg and gravy', 13.99, 3, true, NOW(), NOW()),
  ('section-appetizers', 'Spam Musubi', 'Grilled spam on rice wrapped in nori', 5.99, 0, true, NOW(), NOW()),
  ('section-appetizers', 'Ahi Poke Nachos', 'Wonton chips topped with poke and wasabi aioli', 12.99, 1, true, NOW(), NOW()),
  ('section-appetizers', 'Maui Onion Rings', 'Sweet Maui onion rings with spicy aioli', 8.99, 2, true, NOW(), NOW()),
  ('section-drinks', 'Passion Fruit Iced Tea', 'Refreshing tropical iced tea', 4.99, 0, true, NOW(), NOW()),
  ('section-drinks', 'Pineapple Juice', 'Fresh pressed pineapple juice', 4.99, 1, true, NOW(), NOW()),
  ('section-drinks', 'Hawaiian Lemonade', 'Lilikoi and guava lemonade', 5.99, 2, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
EOSQL

echo "   ✓ Database seeded with Hulihuli data"

# 5. Build the app
echo ""
echo "5. Building application..."
pnpm build || echo "   ⚠️  Build failed, but you can still run dev mode"

echo ""
echo "✅ Hulihuli Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Google OAuth:"
echo "   - Go to https://console.cloud.google.com/"
echo "   - Create OAuth credentials"
echo "   - Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
echo ""
echo "2. Update admin email (if needed):"
echo "   - Current admin email: ${ADMIN_EMAIL}"
echo "   - To change: ADMIN_EMAIL=your-email@gmail.com ./setup.sh"
echo ""
echo "3. Add hero image:"
echo "   - Place image at: public/images/hulihuli-hero.jpg"
echo "   - Recommended: 1920x1080, < 500KB"
echo ""
echo "4. Start development server:"
echo "   pnpm dev"
echo ""
echo "5. Visit the site:"
echo "   Public:  http://localhost:3000"
echo "   Admin:   http://localhost:3000/auth/signin"
echo ""
echo "📚 Documentation:"
echo "   - Full setup: SETUP.md"
echo "   - README: README.md"
