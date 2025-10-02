# Hulihuli - Hawaiian Restaurant Website

A modern, simplified restaurant website built with Next.js 15, featuring Google OAuth authentication for admin panel access.

## Features

### Public Features (P0)
- ✅ **Liquid Glass Navigation** - Beautiful glass-morphism navigation bar (Home & Menu)
- ✅ **Hero Banner** - Full-screen image slideshow with restaurant branding
- ✅ **Operating Hours** - Display business hours with current status
- ✅ **Location & Contact** - Address, phone, email with map integration
- ✅ **Full Menu Page** - Complete menu with sections and pricing

### Admin Features (P1)
- ✅ **Google Single Sign-On** - Secure OAuth authentication
- ✅ **Hours Management** - Edit operating hours for each day
- ✅ **Location Editor** - Update contact information
- ✅ **Menu Management** - Add, edit, and remove menu items

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: Node.js 24.5.0
- **Database**: PostgreSQL with Prisma ORM (shared)
- **Authentication**: NextAuth v5 with Google Provider
- **Styling**: Tailwind CSS 4
- **UI Components**: Shared from @restaurant-platform/web-common
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 22+ (currently using v24.5.0)
- PostgreSQL database running (default port 5433)
- Google OAuth credentials

### Quick Setup

**Option 1: Automated Setup (Recommended)**
```bash
cd apps/hulihuli
./setup.sh
```

This script will:
- Check/start the database
- Create environment file with generated secrets
- Install dependencies
- Seed the database with sample data
- Build the application

**Option 2: Manual Setup**

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add:
   - Your database connection string
   - Auth secret (generate with: `openssl rand -base64 32`)
   - Google OAuth credentials

3. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env`

4. **Seed the database**
   ```bash
   # From the root of the monorepo
   cd packages/database
   pnpm db:seed
   ```

5. **Create an admin user**
   You'll need to manually add an admin user to the database:
   ```sql
   -- First, create a role if it doesn't exist
   INSERT INTO admin_roles (id, name, description, permissions, "isSystem")
   VALUES ('role-admin', 'Admin', 'Full access', '{"*"}', true);

   -- Then create the admin user with your Google email
   INSERT INTO admin_users (id, email, "roleId", status)
   VALUES ('user-admin', 'your-google-email@gmail.com', 'role-admin', 'ACTIVE');

   -- Create a restaurant record for Hulihuli
   INSERT INTO restaurants (id, slug, name, description)
   VALUES ('hulihuli-id', 'hulihuli', 'Hulihuli', 'Authentic Hawaiian cuisine');
   ```

### Development

```bash
# Start the development server
pnpm dev

# Open http://localhost:3000
```

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
hulihuli/
├── app/
│   ├── admin/              # Admin panel (protected)
│   │   ├── hours/         # Hours management
│   │   ├── location/      # Location/contact editor
│   │   └── menu/          # Menu editor
│   ├── api/
│   │   ├── admin/         # Admin API routes
│   │   └── auth/          # NextAuth routes
│   ├── auth/
│   │   └── signin/        # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── admin/             # Admin components
│   ├── HeroBanner.tsx
│   ├── HoursSection.tsx
│   ├── LocationSection.tsx
│   └── MenuPreview.tsx
├── lib/
│   └── restaurant.ts      # Data fetching utilities
├── auth.ts                # NextAuth configuration
├── auth.config.ts         # Auth config
└── middleware.ts          # Route protection
```

## Authentication Flow

1. User clicks "Sign in with Google" on `/auth/signin`
2. Redirected to Google OAuth consent screen
3. After approval, NextAuth validates the email against `admin_users` table
4. Only existing, active admin users are allowed access
5. Session stored as JWT in httpOnly cookie
6. Middleware protects `/admin/*` routes

## Deployment

### Recommended Platforms

- **Vercel** - Optimized for Next.js
- **Railway** - For PostgreSQL database
- **Supabase** - Managed PostgreSQL alternative
