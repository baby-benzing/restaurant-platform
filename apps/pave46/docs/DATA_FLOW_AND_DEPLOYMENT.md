# Pavé46 Data Flow & Deployment Documentation

## Table of Contents
1. [Data Flow Architecture](#data-flow-architecture)
2. [Step-by-Step Data Flow](#step-by-step-data-flow)
3. [Database Setup & Seeding](#database-setup--seeding)
4. [Deployment Guide](#deployment-guide)
5. [Maintenance Guide](#maintenance-guide)

---

## Data Flow Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        DB[(PostgreSQL Database)]
        MOCK[Mock Data Fallback]
    end
    
    subgraph "Backend Layer"
        PRISMA[Prisma ORM]
        API_LIB[/lib/api.ts]
        API_ROUTE[/api/restaurant]
    end
    
    subgraph "Frontend Layer"
        HOOK[useRestaurantData Hook]
        PAGE[Page Component]
        SECTION[Section Components]
    end
    
    subgraph "UI Components"
        MENU_DISPLAY[MenuDisplay]
        HOURS_DISPLAY[HoursDisplay]
        CONTACT_DISPLAY[ContactDisplay]
    end
    
    DB --> PRISMA
    MOCK --> API_LIB
    PRISMA --> API_LIB
    API_LIB --> API_ROUTE
    API_ROUTE --> HOOK
    HOOK --> PAGE
    PAGE --> SECTION
    SECTION --> MENU_DISPLAY
    SECTION --> HOURS_DISPLAY
    SECTION --> CONTACT_DISPLAY
```

---

## Step-by-Step Data Flow

### 1. **Data Storage Layer**

#### Primary Source: PostgreSQL Database
```
Location: External PostgreSQL instance
Schema: /packages/database/prisma/schema.prisma
```

#### Fallback: Mock Data
```
Location: /apps/pave46/src/lib/api.ts (mockRestaurantData)
          /apps/pave46/src/app/api/restaurant/route.ts (inline mock)
```

### 2. **Data Retrieval Flow**

```
1. Client loads page (e.g., HomePage)
   ↓
2. useRestaurantData() hook fires
   ↓
3. Fetch request to /api/restaurant
   ↓
4. API Route handler executes
   ↓
5. getRestaurantData() called from /lib/api.ts
   ↓
6. Prisma attempts database query
   ↓
7a. SUCCESS: Returns database data
7b. FAILURE: Returns mock data
   ↓
8. Data flows back through chain
   ↓
9. Components render with data
```

### 3. **Data Transformation**

#### Hours Data Flow:
```typescript
// Database Format
{ dayOfWeek: 0, openTime: '09:00', closeTime: '15:00', isClosed: false }
↓
// API Response (same format)
↓
// InfoSection transforms to:
{ dayOfWeek: 'Sunday', openTime: '09:00', closeTime: '15:00', isClosed: false }
↓
// HoursDisplay component renders as:
"Sunday: 9:00 AM - 3:00 PM"
```

#### Menu Data Flow:
```typescript
// Database Format
menu: {
  sections: [{
    name: 'Breakfast',
    items: [{
      name: 'Croissant',
      price: 4.50,
      description: '...'
    }]
  }]
}
↓
// No transformation needed
↓
// MenuDisplay renders directly
```

---

## Database Setup & Seeding

### Initial Setup for New Deployment

#### 1. **Environment Configuration**
Create `.env` file in root:
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/restaurant_platform"

# Restaurant Configuration
RESTAURANT_SLUG="pave46"

# JWT (for admin features)
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="24h"

# Application
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NODE_ENV="production"
```

#### 2. **Database Initialization**
```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with initial data
pnpm db:seed
```

#### 3. **Seed Data Structure**
Edit `/packages/database/prisma/seed.ts`:
```typescript
const paveData = {
  slug: 'pave46',
  name: 'Pavé',
  description: 'European-style café and bakery',
  
  // Operating Hours (0=Sunday, 6=Saturday)
  hours: [
    { dayOfWeek: 0, openTime: '09:00', closeTime: '15:00' },
    { dayOfWeek: 1, openTime: '07:00', closeTime: '16:00' },
    { dayOfWeek: 2, openTime: '07:00', closeTime: '19:00' },
    { dayOfWeek: 3, openTime: '07:00', closeTime: '19:00' },
    { dayOfWeek: 4, openTime: '07:00', closeTime: '19:00' },
    { dayOfWeek: 5, openTime: '07:00', closeTime: '16:00' },
    { dayOfWeek: 6, isClosed: true }, // Saturday closed
  ],
  
  // Menu Structure
  menu: {
    name: 'Main Menu',
    sections: [
      {
        name: 'Breakfast & Pastries',
        items: [
          { name: 'Croissant', price: 4.50, description: '...' },
          { name: 'Pain au Chocolat', price: 5.00, description: '...' }
        ]
      },
      {
        name: 'Sandwiches',
        items: [
          { name: 'Croque Monsieur', price: 14.00, description: '...' },
          { name: 'Salmon Sandwich', price: 16.00, description: '...' }
        ]
      }
    ]
  },
  
  // Contact Information
  contacts: [
    { type: 'PHONE', value: '(646) 454-1387' },
    { type: 'EMAIL', value: 'pavenyc@gmail.com' },
    { type: 'ADDRESS', value: '511 10th Avenue, New York, NY 10018' }
  ]
};
```

---

## Deployment Guide

### Option 1: Vercel Deployment (Recommended)

#### Prerequisites:
- Vercel account
- PostgreSQL database (Supabase, Neon, or Railway)
- GitHub repository

#### Steps:

1. **Database Setup**
```bash
# Use a managed PostgreSQL service
# Recommended: Supabase (free tier available)
# 1. Create account at supabase.com
# 2. Create new project
# 3. Copy connection string from Settings > Database
```

2. **Prepare Repository**
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

3. **Vercel Configuration**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

4. **Environment Variables in Vercel**
```
Go to Vercel Dashboard > Project Settings > Environment Variables
Add:
- DATABASE_URL (your PostgreSQL connection string)
- JWT_SECRET (generate with: openssl rand -base64 32)
- RESTAURANT_SLUG (pave46)
```

5. **Initialize Production Database**
```bash
# After deployment, run migrations
vercel env pull .env.production.local
pnpm db:push:prod
pnpm db:seed:prod
```

### Option 2: Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/pave46
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pave46
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
docker-compose exec app pnpm db:push
docker-compose exec app pnpm db:seed
```

---

## Maintenance Guide

### Daily Operations

#### 1. **Update Menu Items**

**Via Database (Production)**
```sql
-- Connect to database
psql $DATABASE_URL

-- Update a menu item price
UPDATE "MenuItem" 
SET price = 5.50 
WHERE name = 'Croissant';

-- Add new menu item
INSERT INTO "MenuItem" (id, name, description, price, "sectionId", "isAvailable")
VALUES ('new-id', 'Almond Croissant', 'Filled with almond cream', 6.00, 'section-id', true);
```

**Via Admin Panel** (when implemented)
```
Navigate to: https://your-domain.com/admin
Login with admin credentials
Go to Menu Management
Edit items directly
```

#### 2. **Update Operating Hours**

**Temporary Closure (Holiday)**
```sql
-- Close for a specific day
UPDATE "OperatingHours" 
SET "isClosed" = true 
WHERE "restaurantId" = 'pave46-id' 
AND "dayOfWeek" = 1; -- Monday
```

**Permanent Schedule Change**
```sql
-- Change hours
UPDATE "OperatingHours" 
SET "openTime" = '08:00', "closeTime" = '20:00'
WHERE "restaurantId" = 'pave46-id' 
AND "dayOfWeek" = 2; -- Tuesday
```

#### 3. **Update Without Database**

If database is unavailable, update mock data:

**Location 1**: `/apps/pave46/src/lib/api.ts`
```typescript
const mockRestaurantData = {
  // Update this object with new data
  hours: [
    { dayOfWeek: 0, openTime: '10:00', closeTime: '16:00', isClosed: false },
    // ... etc
  ]
};
```

**Location 2**: `/apps/pave46/src/app/api/restaurant/route.ts`
```typescript
// Update the fallback data in the catch block
return NextResponse.json({
  hours: [
    // Your updated hours
  ],
  menus: [
    // Your updated menu
  ]
});
```

### Troubleshooting

#### Issue: Data not updating
1. Clear Next.js cache: `rm -rf .next`
2. Restart server: `pnpm dev`
3. Check database connection: `pnpm db:studio`

#### Issue: Mock data showing instead of database
1. Verify DATABASE_URL is correct
2. Check database is accessible: `nc -zv [host] 5432`
3. Regenerate Prisma client: `pnpm db:generate`

#### Issue: Hours showing wrong day
- Ensure dayOfWeek mapping is correct (0=Sunday, 6=Saturday)
- Check timezone settings in database

### Backup & Recovery

#### Daily Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

#### Restore from Backup
```bash
psql $DATABASE_URL < backup_20240115.sql
```

---

## Quick Reference

### Key Files
| Purpose | Location |
|---------|----------|
| Database Schema | `/packages/database/prisma/schema.prisma` |
| Seed Data | `/packages/database/prisma/seed.ts` |
| API Endpoint | `/apps/pave46/src/app/api/restaurant/route.ts` |
| Data Fetching | `/apps/pave46/src/lib/api.ts` |
| Mock Data | `/apps/pave46/src/lib/api.ts` (mockRestaurantData) |
| Hours Display | `/apps/pave46/src/components/InfoSection.tsx` |
| Menu Display | `/apps/pave46/src/components/MenuSection.tsx` |

### Common Commands
```bash
# Development
pnpm dev                  # Start dev server
pnpm db:studio           # Visual database editor

# Database
pnpm db:push             # Push schema changes
pnpm db:seed             # Seed database
pnpm db:reset            # Reset and reseed

# Production
pnpm build               # Build for production
pnpm start               # Start production server
```

### Data Format Reference

**Hours Format**:
```typescript
{
  dayOfWeek: 0-6,  // 0=Sunday, 6=Saturday
  openTime: "HH:MM",  // 24-hour format
  closeTime: "HH:MM", // 24-hour format
  isClosed: boolean
}
```

**Menu Format**:
```typescript
{
  name: string,
  sections: [{
    name: string,
    description?: string,
    items: [{
      name: string,
      description?: string,
      price: number,
      isAvailable: boolean
    }]
  }]
}
```

---

*Last Updated: 2024-01-15*
*Version: 1.0.0*