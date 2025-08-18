# Restaurant Platform - Architecture Documentation

## Project Overview

This is a **monorepo** for a multi-restaurant website platform built with modern web technologies. The architecture follows a modular, scalable approach using pnpm workspaces to share code between multiple restaurant websites while maintaining separate deployments.

## Repository Structure

```
custom_web/
├── apps/                    # Deployable applications
│   └── pave46/             # Pavé46 restaurant website
├── packages/               # Shared packages/libraries
│   ├── web-common/        # Shared UI components
│   ├── database/          # Database layer (Prisma ORM)
│   ├── auth/              # Authentication system
│   └── admin/             # Admin panel components (future)
├── planning/              # Task planning documents
├── docs/                  # Additional documentation
└── tests/                 # Integration & E2E tests
```

## Core Technologies

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT implementation
- **Package Manager**: pnpm (workspace monorepo)
- **Language**: TypeScript (strict mode)
- **Testing**: Jest, React Testing Library

## Package Architecture

### 1. Apps Layer (`/apps`)

#### `pave46` - Restaurant Website
- **Purpose**: Customer-facing website for Pavé46 restaurant
- **Technology**: Next.js 14 with App Router
- **Key Features**:
  - Server-side rendering for SEO
  - Dynamic menu display
  - Responsive design
  - Contact information
  - Admin authentication routes

**Entry Points**:
- `/` - Homepage with hero, featured menu, hours
- `/menu` - Full restaurant menu
- `/about` - About the restaurant
- `/contact` - Contact and location info
- `/auth/login` - Admin login
- `/admin/*` - Protected admin routes

### 2. Packages Layer (`/packages`)

#### `web-common` - Shared Component Library
- **Purpose**: Reusable React components for all restaurant websites
- **Exports**: UI components, utilities, styles
- **Key Components**:
  ```typescript
  // Layout Components
  Container, Section, Grid, Flex, Card
  
  // Menu Components
  MenuDisplay, MenuSection, MenuItem
  
  // Business Components
  OperatingHours, ContactInfo
  
  // UI Components
  Button, Loading, Skeleton
  
  // Utilities
  cn() - className merger
  formatPrice(), formatTime(), formatPhone()
  ```

#### `database` - Data Access Layer
- **Purpose**: Database schema, ORM, and data access patterns
- **Technology**: Prisma ORM with PostgreSQL
- **Architecture**: Repository pattern for clean data access
- **Models**:
  ```prisma
  Restaurant - Restaurant information
  Menu - Menu collections
  MenuSection - Menu categories
  MenuItem - Individual dishes/drinks
  OperatingHours - Business hours
  Contact - Contact information
  Image - Media assets
  User - Admin users
  Session - Auth sessions
  AuditLog - Security audit trail
  ```

**Repository Pattern**:
```typescript
BaseRepository<T> - Generic CRUD operations
RestaurantRepository - Restaurant-specific queries
MenuRepository - Menu management
UserRepository - User management
```

#### `auth` - Authentication System
- **Purpose**: Secure authentication and authorization
- **Features**:
  - JWT token generation/validation
  - Password hashing (bcrypt)
  - Role-based access control (RBAC)
  - Session management
  - Password reset flow

**Security Architecture**:
```typescript
// Roles
enum UserRole {
  ADMIN,   // Full system access
  EDITOR,  // Content management
  VIEWER   // Read-only access
}

// Services
AuthService - Login, logout, registration
PasswordService - Hashing, validation, reset
JWTService - Token generation, verification
RBACService - Permission checking
```

#### `admin` - Admin Components (Future)
- **Purpose**: Placeholder for future CMS components
- **Status**: In development
- **Planned Features**:
  - Content management UI
  - Menu editor
  - Hours management
  - User administration

## Data Flow Architecture

```mermaid
graph TD
    Client[Browser Client]
    NextApp[Next.js App]
    Auth[Auth Package]
    WebCommon[Web Common]
    Database[Database Package]
    Prisma[Prisma ORM]
    PostgreSQL[(PostgreSQL)]
    
    Client --> NextApp
    NextApp --> WebCommon
    NextApp --> Auth
    NextApp --> Database
    Auth --> Database
    Database --> Prisma
    Prisma --> PostgreSQL
```

## Authentication Flow

1. **Login Request** → `/api/auth/login`
2. **Credential Validation** → Auth Service
3. **JWT Generation** → httpOnly Cookie
4. **Middleware Protection** → `/admin/*` routes
5. **Role Verification** → RBAC checks
6. **Session Management** → Database tracking

## Development Workflow

### Starting Development

```bash
# Quick start (recommended)
./start-dev.sh

# Manual start
docker run -d --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_platform \
  -p 5432:5432 \
  postgres:16-alpine

pnpm dev  # Starts Next.js dev server
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @restaurant-platform/web-common build

# Type checking
pnpm typecheck
```

### Testing Strategy

```bash
# Run all tests
pnpm test

# Package-specific tests
pnpm --filter @restaurant-platform/auth test

# Coverage report
pnpm test:coverage
```

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_platform"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

## Key Design Decisions

### 1. Monorepo Architecture
- **Why**: Share code between multiple restaurant sites
- **Benefit**: Consistent UI/UX, reduced duplication
- **Tool**: pnpm workspaces for efficient dependency management

### 2. Repository Pattern
- **Why**: Clean separation between business logic and data access
- **Benefit**: Testable, maintainable, swappable data sources
- **Implementation**: Base repository with specialized implementations

### 3. Server Components by Default
- **Why**: Better SEO, reduced client bundle size
- **Benefit**: Faster initial page loads, better Core Web Vitals
- **Trade-off**: More complex state management

### 4. JWT in httpOnly Cookies
- **Why**: Prevent XSS attacks
- **Benefit**: Secure token storage
- **Trade-off**: Cannot access token from client JavaScript

### 5. Role-Based Access Control
- **Why**: Granular permission management
- **Benefit**: Flexible authorization system
- **Implementation**: Three-tier hierarchy (Admin > Editor > Viewer)

## Common Development Tasks

### Adding a New Restaurant App

```bash
# 1. Create new app
cd apps
pnpm create next-app@latest restaurant-name

# 2. Install shared packages
cd restaurant-name
pnpm add @restaurant-platform/web-common @restaurant-platform/database

# 3. Configure Tailwind to use shared config
# 4. Import and use shared components
```

### Creating New Shared Components

```bash
# 1. Add component to web-common
cd packages/web-common/src/components
# Create YourComponent.tsx

# 2. Write tests
# Create YourComponent.test.tsx

# 3. Export from index
echo "export * from './YourComponent'" >> ../index.ts

# 4. Build package
pnpm build

# 5. Use in apps
import { YourComponent } from '@restaurant-platform/web-common'
```

### Database Schema Changes

```bash
cd packages/database

# 1. Update schema
vim prisma/schema.prisma

# 2. Generate migration
pnpm prisma migrate dev --name your_migration_name

# 3. Generate client
pnpm db:generate

# 4. Update seed data if needed
vim prisma/seed.ts
pnpm db:seed
```

## Performance Optimizations

### Current Optimizations
- Image optimization with next/image
- Font optimization with next/font
- React Server Components for reduced bundle
- Dynamic imports for code splitting
- Tailwind CSS purging unused styles

### Monitoring Points
- Lighthouse scores (target >90)
- First Contentful Paint (<1.5s)
- Time to Interactive (<3.5s)
- Cumulative Layout Shift (<0.1)

## Security Measures

### Implemented
- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- httpOnly cookies for tokens
- CSRF protection via SameSite cookies
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (React escaping)

### Audit Points
- Regular dependency updates
- Security headers configuration
- Rate limiting on auth endpoints
- Audit logging for sensitive operations

## Deployment Architecture

### Production Setup (Planned)
```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel    │────▶│  Next.js App │────▶│  PostgreSQL  │
│   (CDN)     │     │   (Serverless)│     │   (Supabase) │
└─────────────┘     └──────────────┘     └──────────────┘
```

### Environment Separation
- **Development**: Local PostgreSQL, mock data fallback
- **Staging**: Shared test database, preview deployments
- **Production**: Managed PostgreSQL, Redis cache, CDN

## Troubleshooting Guide

### Common Issues

1. **Database Connection Failed**
   - Ensure Docker is running
   - Check DATABASE_URL in .env
   - Verify PostgreSQL container: `docker ps`

2. **Module Not Found Errors**
   - Run `pnpm install`
   - Build packages: `pnpm build`
   - Check workspace references
   - For auth package: `cd packages/auth && pnpm build`

3. **Type Errors**
   - Generate Prisma client: `pnpm db:generate`
   - Run type check: `pnpm typecheck`
   - Rebuild packages if needed

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings for your environment
   - Ensure middleware.ts is properly configured
   - Build auth package first: `cd packages/auth && pnpm build`

5. **`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` on dev**
   - This happens when library packages fail to start in watch mode
   - Solution: Use `pnpm dev` (runs only apps) instead of `pnpm dev:all`
   - Library packages don't need to run in watch mode during normal development

## Future Enhancements

### Planned Features
1. **Content Management System**
   - Visual menu editor
   - Drag-and-drop sections
   - Preview mode
   - Version history

2. **Multi-language Support**
   - i18n routing
   - Content translations
   - Locale-specific formatting

3. **Analytics Dashboard**
   - Page views tracking
   - Menu item popularity
   - Conversion metrics
   - Performance monitoring

4. **Reservation System**
   - Online booking
   - Table management
   - Email confirmations
   - Calendar integration

### Technical Improvements
- GraphQL API layer
- Redis caching
- WebSocket for real-time updates
- Image CDN integration
- Automated testing in CI/CD
- Performance monitoring (Sentry)

## Contributing Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Composition over inheritance
- Early returns for readability
- Descriptive variable names

### Git Workflow
- Feature branches from main
- Conventional commits
- PR reviews required
- Automated tests must pass
- Update CHANGELOG.md

### Testing Requirements
- Write tests first (TDD)
- Minimum 80% coverage
- Test user interactions
- Mock external dependencies
- Document test scenarios

## Contact & Support

For questions about this architecture:
1. Check this documentation
2. Review code comments
3. Examine test files for usage examples
4. Check planning documents for context

## Quick Reference

### Important Files
- `/apps/pave46/src/app/layout.tsx` - Root layout
- `/packages/web-common/src/index.ts` - Component exports
- `/packages/database/prisma/schema.prisma` - Database schema
- `/packages/auth/src/middleware/rbac.ts` - Permission system
- `/.env.example` - Environment template

### Key Commands
```bash
pnpm dev                 # Start development
pnpm test               # Run tests
pnpm build              # Build all packages
pnpm db:studio          # Visual database editor
docker logs restaurant-db  # Check database logs
```

### Default Credentials (Development)
- Database: `postgres:postgres@localhost:5432`
- Admin User: `admin@pave46.com` / `AdminPassword123!`
- JWT Secret: Set in `.env`

---

*Last Updated: 2025-08-18*
*Version: 0.5.0*