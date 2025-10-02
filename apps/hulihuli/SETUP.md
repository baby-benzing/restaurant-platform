# Hulihuli Setup Guide

## Quick Start

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Hulihuli Admin
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Hulihuli
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

### 2. Environment Variables

Create `.env` file in `apps/hulihuli/`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/restaurant_platform"

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Make sure PostgreSQL is running on port 5433
docker run -d --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_platform \
  -p 5433:5432 \
  postgres:15-alpine

# Run migrations (from monorepo root)
cd packages/database
pnpm prisma migrate dev

# Seed initial data
pnpm db:seed
```

### 4. Create Admin User

Connect to your database and run:

```sql
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

-- Create admin user (replace with your Google email)
INSERT INTO admin_users (
  id,
  email,
  "roleId",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-hulihuli',
  'your-google-email@gmail.com',  -- ⚠️ REPLACE THIS
  'role-admin',
  'ACTIVE',
  NOW(),
  NOW()
);

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
) ON CONFLICT DO NOTHING;

-- Add sample operating hours
INSERT INTO operating_hours ("restaurantId", "dayOfWeek", "openTime", "closeTime", "isClosed", "createdAt", "updatedAt")
VALUES
  ('hulihuli-restaurant', 0, '10:00', '21:00', false, NOW(), NOW()), -- Sunday
  ('hulihuli-restaurant', 1, '10:00', '21:00', false, NOW(), NOW()), -- Monday
  ('hulihuli-restaurant', 2, '10:00', '21:00', false, NOW(), NOW()), -- Tuesday
  ('hulihuli-restaurant', 3, '10:00', '21:00', false, NOW(), NOW()), -- Wednesday
  ('hulihuli-restaurant', 4, '10:00', '22:00', false, NOW(), NOW()), -- Thursday
  ('hulihuli-restaurant', 5, '10:00', '22:00', false, NOW(), NOW()), -- Friday
  ('hulihuli-restaurant', 6, '10:00', '22:00', false, NOW(), NOW())  -- Saturday
ON CONFLICT DO NOTHING;

-- Add contact information
INSERT INTO contacts ("restaurantId", "type", "value", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('hulihuli-restaurant', 'address', '123 Aloha Street, Honolulu, HI 96815', 0, NOW(), NOW()),
  ('hulihuli-restaurant', 'phone', '(808) 555-1234', 1, NOW(), NOW()),
  ('hulihuli-restaurant', 'email', 'info@hulihuli.com', 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create a menu
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
) ON CONFLICT DO NOTHING;

-- Add menu sections
INSERT INTO menu_sections (id, "menuId", name, description, "sortOrder", "createdAt", "updatedAt")
VALUES
  ('section-mains', 'hulihuli-menu', 'Main Dishes', 'Traditional Hawaiian plates', 0, NOW(), NOW()),
  ('section-appetizers', 'hulihuli-menu', 'Appetizers', 'Start your meal right', 1, NOW(), NOW()),
  ('section-drinks', 'hulihuli-menu', 'Beverages', 'Refreshing tropical drinks', 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add sample menu items
INSERT INTO menu_items ("sectionId", name, description, price, "sortOrder", "isAvailable", "createdAt", "updatedAt")
VALUES
  ('section-mains', 'Kalua Pork Plate', 'Slow-roasted pork with cabbage, rice, and macaroni salad', 16.99, 0, true, NOW(), NOW()),
  ('section-mains', 'Chicken Katsu', 'Crispy panko-breaded chicken with katsu sauce', 14.99, 1, true, NOW(), NOW()),
  ('section-mains', 'Poke Bowl', 'Fresh ahi tuna with rice, seaweed, and vegetables', 18.99, 2, true, NOW(), NOW()),
  ('section-appetizers', 'Spam Musubi', 'Grilled spam on rice wrapped in nori', 5.99, 0, true, NOW(), NOW()),
  ('section-appetizers', 'Ahi Poke Nachos', 'Wonton chips topped with poke and wasabi aioli', 12.99, 1, true, NOW(), NOW()),
  ('section-drinks', 'Passion Fruit Iced Tea', 'Refreshing tropical iced tea', 4.99, 0, true, NOW(), NOW()),
  ('section-drinks', 'Pineapple Juice', 'Fresh pressed pineapple juice', 4.99, 1, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
```

### 5. Add Hero Image

Place your hero image at:
```
apps/hulihuli/public/images/hulihuli-hero.jpg
```

Recommended specifications:
- Dimensions: 1920x1080 or higher
- Format: JPG (optimized) or PNG
- Size: < 500KB for best performance
- Subject: Restaurant interior, food, or Hawaiian scenery

### 6. Start Development Server

```bash
# From the hulihuli directory
cd apps/hulihuli
pnpm dev

# Or from monorepo root
pnpm --filter @restaurant-platform/hulihuli dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin login**: http://localhost:3000/auth/signin
- **Admin dashboard**: http://localhost:3000/admin

## Testing the Admin Panel

1. Go to http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. Sign in with the Google account you added to the database
4. You should be redirected to http://localhost:3000/admin
5. Test editing hours, location, and menu items

## Troubleshooting

### "Unauthorized" when accessing admin
- Make sure your Google email is in the `admin_users` table
- Check that the user's `status` is `ACTIVE`
- Verify the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### "Failed to fetch restaurant data"
- Ensure the database is running
- Check the `DATABASE_URL` in `.env`
- Verify the restaurant record exists with slug `'hulihuli'`

### Google OAuth redirect error
- Make sure the redirect URI matches exactly in Google Console
- Check that `NEXTAUTH_URL` matches your local URL
- Clear browser cookies and try again

### Missing hero image
- Add image at `public/images/hulihuli-hero.jpg`
- Or update the path in `components/HeroBanner.tsx`

## Production Deployment

### Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL="your-production-database-url"
AUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Google OAuth Production Setup

1. Add production redirect URI to Google Console:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. Update OAuth consent screen with production domain

3. Verify your domain if required

### Deployment Steps

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   vercel --prod
   ```

3. **Or deploy to any Node.js hosting**
   ```bash
   pnpm start
   ```

## Next Steps

- [ ] Add your actual hero image
- [ ] Customize colors in `tailwind.config.js`
- [ ] Update restaurant information in database
- [ ] Add real menu items
- [ ] Configure email notifications
- [ ] Set up analytics
- [ ] Add more admin users if needed
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test all functionality in production

## Support

For issues or questions:
1. Check the main README.md
2. Review the CLAUDE.md architecture documentation
3. Check the database schema in `packages/database/prisma/schema.prisma`
