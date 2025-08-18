# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2025-08-18

### Added
- Complete authentication system with JWT tokens
- Role-based access control (Admin, Editor, Viewer)
- Secure login and logout functionality
- Password reset with email tokens
- Admin dashboard with role-based sections
- Protected admin routes with middleware
- Session management and audit logging

### Authentication Features
- **Security**: bcrypt password hashing, httpOnly cookies, CSRF protection
- **Roles**: Three-tier permission system (Admin > Editor > Viewer)
- **Pages**: Login, password reset, admin dashboard
- **API Routes**: /api/auth/login, /api/auth/logout, /api/auth/reset-password
- **Middleware**: Automatic route protection for /admin/*
- **Testing**: Comprehensive test suite for auth components

## [0.4.0] - 2025-08-17

### Added
- Pavé46 restaurant application with Next.js 14
- Full website implementation with App Router
- SEO optimization and metadata
- Responsive design for all devices

### Pavé46 Application Features
- **Pages**: Homepage, Menu, About, Contact with dynamic routing
- **Components**: Hero section, Featured menu, Restaurant info
- **SEO**: Metadata API, OpenGraph tags, structured data ready
- **Performance**: Image optimization, loading states, error boundaries
- **Design**: Mobile-responsive, Tailwind CSS, custom fonts
- **Data**: Mock data fallback when database unavailable

## [0.3.0] - 2025-08-17

### Added
- Complete shared component library in web-common package
- Tailwind CSS with custom design tokens
- Comprehensive component test suite
- Full component documentation

### Component Library Features
- **Layout Components**: Container, Section, Grid, Flex, Card with variants
- **Menu Components**: MenuDisplay, MenuSection, MenuItem with price formatting
- **Business Components**: OperatingHours, ContactInfo with icons
- **UI Components**: Button, Loading, Skeleton utilities
- **Styling**: Tailwind CSS with custom colors, spacing, animations
- **Utilities**: cn() for className merging, formatters for price/time/phone
- **Accessibility**: WCAG AA compliant, keyboard navigation, ARIA labels

## [0.2.0] - 2025-08-17

### Added
- Complete database layer with Prisma ORM
- Repository pattern implementation for all models
- Database utilities (error handling, transactions)
- Seed data for Pavé46 restaurant
- Migration system with initial schema
- Comprehensive test suite for database layer

### Database Features
- **Models**: Restaurant, Menu, MenuSection, MenuItem, OperatingHours, Contact, Image, User
- **Repositories**: Base repository with CRUD operations, specialized repositories for each model
- **Utilities**: Transaction helpers with retry mechanism, custom error classes
- **Seed Data**: Complete Pavé46 restaurant data including menus, hours, contacts
- **Testing**: 35 tests covering client, repositories, and seed data

## [0.1.0] - 2025-08-17

### Added
- Initial project setup with pnpm workspace monorepo
- TypeScript configuration with strict mode
- ESLint and Prettier configuration
- Jest testing framework setup
- Docker Compose configuration for PostgreSQL database
- Git repository initialization with comprehensive .gitignore
- Project structure with apps/ and packages/ directories
- Base package.json files for all workspace packages
- Environment variable configuration
- Progress tracking with progress.log
- README documentation

### Project Structure
- `apps/pave46` - Pavé46 restaurant application
- `packages/web-common` - Shared UI components library
- `packages/database` - Prisma ORM and database utilities
- `packages/admin` - Admin panel components

### Development Environment
- Node.js 18+ required
- pnpm 8.15.1 as package manager
- PostgreSQL via Docker
- TypeScript strict mode enabled
- 80% test coverage requirement