# @restaurant-platform/admin

Shared admin infrastructure for all restaurant applications within the platform. This package provides:

- **Authentication & Authorization** - SSO with Google, role-based access control
- **Data Management** - Unified interface for managing restaurant data
- **Audit Trail** - Complete tracking of all data changes
- **Admin UI Components** - Reusable admin interface components
- **API Middleware** - Shared authentication and authorization middleware

## Features

### 🔐 Authentication & Authorization
- Google SSO integration via NextAuth
- Role-based access control (SuperAdmin, Admin, Editor, Viewer)
- Multi-restaurant support
- Invitation system for adding new admins

### 📝 Data Management
- Unified data management interface
- Version control for all changes
- Bulk operations support
- Import/export capabilities

### 📊 Audit Trail
- Complete change history
- Who, what, when tracking
- Rollback capabilities
- Compliance reporting

### 🎨 UI Components
- Pre-built admin layouts
- Data tables with sorting/filtering
- Form components with validation
- Dashboard widgets

## Installation

```bash
pnpm add @restaurant-platform/admin
```

## Usage

### Setup Authentication

```typescript
// app/api/auth/[...nextauth]/route.ts
import { authOptions } from '@restaurant-platform/admin';

export { GET, POST } from '@restaurant-platform/admin/auth';
```

### Protect Admin Routes

```typescript
// middleware.ts
import { adminMiddleware } from '@restaurant-platform/admin';

export default adminMiddleware;

export const config = {
  matcher: ['/admin/:path*']
};
```

### Use Admin Components

```tsx
// app/admin/layout.tsx
import { AdminLayout } from '@restaurant-platform/admin/components';

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
```

### Track Changes with Audit Trail

```typescript
// Any data modification
import { auditLog } from '@restaurant-platform/admin';

await auditLog.record({
  action: 'UPDATE_MENU_ITEM',
  entityType: 'MenuItem',
  entityId: item.id,
  oldValue: oldItem,
  newValue: newItem,
  userId: session.user.id,
  restaurantId: restaurant.id
});
```

## Architecture

```
@restaurant-platform/admin/
├── src/
│   ├── auth/           # Authentication & SSO
│   ├── authorization/  # RBAC & permissions
│   ├── audit/         # Audit trail system
│   ├── components/    # Shared UI components
│   ├── middleware/    # API & route protection
│   ├── services/      # Business logic
│   └── types/         # TypeScript definitions
├── prisma/
│   └── schema/        # Admin-specific database schemas
└── tests/             # Test suites
```

## License

Private - Restaurant Platform Internal Use Only