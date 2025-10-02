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

```bash
cd apps/hulihuli
./setup.sh
pnpm dev
```

Open http://localhost:3000

The setup script will:
- Start PostgreSQL database
- Create `.env` with auto-generated secrets
- Install dependencies
- Populate database with Hawaiian menu

### Google OAuth (Optional - for admin panel)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Update `.env` with your credentials

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
