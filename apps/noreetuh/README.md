# Pavé46 Restaurant Website

Next.js 14 application for Pavé46 restaurant using App Router.

## Features

- **Server Components** - Optimized performance with React Server Components
- **App Router** - Next.js 14 App Router for better layouts and loading states
- **SEO Optimized** - Full metadata API implementation
- **Responsive Design** - Mobile-first responsive design
- **Image Optimization** - next/image for automatic optimization
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth loading experiences with Suspense

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (optional, uses mock data if unavailable)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # App Router pages and layouts
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Homepage
│   ├── menu/          # Menu page
│   ├── about/         # About page
│   ├── contact/       # Contact page
│   ├── error.tsx      # Error boundary
│   ├── not-found.tsx  # 404 page
│   └── loading.tsx    # Loading state
├── components/         # React components
│   ├── Hero.tsx       # Hero section
│   ├── FeaturedMenu.tsx # Featured menu items
│   └── RestaurantInfo.tsx # Hours and contact
└── lib/               # Utilities and API
    └── api.ts         # Data fetching functions
```

## Routes

- `/` - Homepage with hero, featured menu, hours
- `/menu` - Full restaurant menu
- `/about` - About the restaurant
- `/contact` - Contact information and hours

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
RESTAURANT_SLUG=pave46
```

## Development

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck
```

### Building for Production

```bash
# Build application
pnpm build

# Start production server
pnpm start
```

## Performance

Target metrics:
- Lighthouse Score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1

## SEO

- Custom metadata for each page
- OpenGraph tags for social sharing
- Structured data for search engines
- Sitemap generation
- Robots.txt configuration

## Deployment

The application is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel
```

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- @restaurant-platform/web-common (component library)
- @restaurant-platform/database (data layer)

## License

Private - All rights reserved