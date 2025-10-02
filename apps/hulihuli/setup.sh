#!/bin/bash

# Hulihuli Restaurant Setup Script
# One-command setup: database, environment, and data

set -e

echo "🌺 Hulihuli Restaurant Setup"
echo "============================"
echo ""

# 1. Start database if needed
echo "1. Starting database..."
if ! docker ps | grep -q restaurant-db; then
    docker run -d --name restaurant-db \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=restaurant_platform \
      -p 5433:5432 \
      postgres:15-alpine
    echo "   Waiting for database..."
    sleep 10
fi
echo "   ✓ Database running"

# 2. Create .env
echo ""
echo "2. Creating .env..."
if [ ! -f ".env" ]; then
cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
EOF
fi
echo "   ✓ Created .env"

# 3. Install dependencies
echo ""
echo "3. Installing..."
cd ../.. && pnpm install --silent && cd apps/hulihuli
echo "   ✓ Installed"

# 4. Populate database
echo ""
echo "4. Populating database..."
docker exec restaurant-db psql -U postgres -d restaurant_platform << 'EOSQL' 2>/dev/null
INSERT INTO admin_roles (id, name, description, permissions, "isSystem", "createdAt", "updatedAt")
VALUES ('role-admin', 'Admin', 'Full access', '{"*"}', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_users (id, email, "roleId", status, "createdAt", "updatedAt")
VALUES ('admin-hulihuli', 'admin@hulihuli.com', 'role-admin', 'ACTIVE', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE';

INSERT INTO restaurants (id, slug, name, description, "createdAt", "updatedAt")
VALUES ('hulihuli-restaurant', 'hulihuli', 'Hulihuli', 'Authentic Hawaiian cuisine', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO admin_user_restaurants (id, "userId", "restaurantId", "isPrimary", "createdAt")
VALUES ('admin-hulihuli-restaurant', 'admin-hulihuli', 'hulihuli-restaurant', true, NOW())
ON CONFLICT (id) DO NOTHING;

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

echo "   ✓ Database populated"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Start the site:"
echo "  pnpm dev"
echo ""
echo "Then visit:"
echo "  http://localhost:3000"
echo ""
echo "Note: Add Google OAuth credentials to .env for admin panel"
