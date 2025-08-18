# @restaurant-platform/web-common

Shared UI component library for the Restaurant Platform.

## Features

- **Layout Components** - Container, Section, Grid, Card
- **Menu Components** - Menu display with sections and items
- **Business Components** - Operating hours, contact info
- **UI Components** - Button, Loading, Skeleton
- **Tailwind CSS** - Custom design tokens and utilities
- **TypeScript** - Full type safety
- **Accessibility** - WCAG AA compliant components

## Installation

```bash
pnpm install
```

## Usage

### Basic Setup

```tsx
import '@restaurant-platform/web-common/styles/globals.css';
import { Container, Button, MenuDisplay } from '@restaurant-platform/web-common';
```

### Layout Components

```tsx
import { Container, Section, Grid, Card } from '@restaurant-platform/web-common';

<Container maxWidth="lg">
  <Section spacing="lg" background="gray">
    <Grid cols={3} gap="md">
      <Card variant="shadow">Card content</Card>
    </Grid>
  </Section>
</Container>
```

### Menu Components

```tsx
import { MenuDisplay } from '@restaurant-platform/web-common';

const menu = {
  id: '1',
  name: 'Dinner Menu',
  sections: [
    {
      id: '1',
      name: 'Appetizers',
      items: [
        { id: '1', name: 'Soup', price: 12, description: 'Daily special' }
      ]
    }
  ]
};

<MenuDisplay menu={menu} hideUnavailable columns={2} />
```

### Business Components

```tsx
import { OperatingHours, ContactInfo } from '@restaurant-platform/web-common';

const hours = [
  { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00', isClosed: false }
];

const contacts = [
  { type: 'phone', value: '(212) 555-0146', label: 'Call us' },
  { type: 'email', value: 'info@restaurant.com' }
];

<OperatingHours hours={hours} showToday groupSimilar />
<ContactInfo contacts={contacts} showIcons />
```

### UI Components

```tsx
import { Button, Loading, Skeleton } from '@restaurant-platform/web-common';

<Button variant="primary" size="lg" loading={isLoading}>
  Submit Order
</Button>

<Loading size="md" text="Loading menu..." />

<Skeleton variant="text" count={3} />
```

## Component Props

### Container
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `noPadding`: boolean
- `as`: 'div' | 'section' | 'article' | 'main'

### Section
- `spacing`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `background`: 'white' | 'gray' | 'primary' | 'secondary'
- `withContainer`: boolean

### Grid
- `cols`: 1 | 2 | 3 | 4 | 6 | 12
- `gap`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `responsive`: boolean

### Button
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean

## Utilities

### cn()
Utility for merging Tailwind classes:
```tsx
import { cn } from '@restaurant-platform/web-common';

className={cn('base-class', conditional && 'conditional-class')}
```

### Formatters
```tsx
import { 
  formatPrice,     // $12.50
  formatTime,      // 5:00 PM
  formatPhoneNumber, // (212) 555-0146
  getDayName       // Monday
} from '@restaurant-platform/web-common';
```

## Design Tokens

### Colors
- Primary: Blue scale
- Secondary: Amber scale
- Neutral: Gray scale
- Success/Error/Warning states

### Spacing
Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

### Typography
- Serif font for headings
- System font stack for body

## Development

### Build
```bash
pnpm build
```

### Test
```bash
pnpm test
pnpm test:coverage
```

### Lint
```bash
pnpm lint
pnpm typecheck
```

## Accessibility

All components follow WCAG AA guidelines:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## License

Private - All rights reserved