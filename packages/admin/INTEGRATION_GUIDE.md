# Admin Package Integration Guide

This guide shows how each restaurant app (pave46, noreetuh, hulihuli) can integrate the shared admin infrastructure.

## Quick Setup for Each App

### 1. Install the Admin Package

In your app directory (e.g., `/apps/pave46`):

```bash
pnpm add @restaurant-platform/admin
```

### 2. Create Admin API Routes

Create shared admin API routes that use the platform-level handlers:

```typescript
// apps/pave46/src/app/api/admin/menu/[id]/route.ts
import { AdminAPIHandler } from '@restaurant-platform/admin/api';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return AdminAPIHandler.handleMenuItem(req, params);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return AdminAPIHandler.handleMenuItem(req, params);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return AdminAPIHandler.handleMenuItem(req, params);
}
```

```typescript
// apps/pave46/src/app/api/admin/audit/route.ts
import { AdminAPIHandler } from '@restaurant-platform/admin/api';

export async function GET(req: Request) {
  return AdminAPIHandler.handleAuditLogs(req);
}
```

### 3. Use Data Manager in Your Code

The DataManager automatically tracks all changes with audit trails:

```typescript
// apps/pave46/src/app/admin/menu/actions.ts
import { createDataManager } from '@restaurant-platform/admin';
import { getServerSession } from 'next-auth';

export async function updateMenuItem(itemId: string, updates: any) {
  const session = await getServerSession();
  
  const dataManager = createDataManager({
    userId: session.user.id,
    restaurantId: 'pave46', // or get from context
    ipAddress: request.ip,
    userAgent: request.headers.get('user-agent'),
  });

  // This automatically creates an audit log entry
  return await dataManager.updateMenuItem(itemId, updates);
}
```

### 4. View Audit Trails in Admin UI

```typescript
// apps/pave46/src/app/admin/audit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AuditLogViewer } from '@restaurant-platform/admin/components';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/admin/audit')
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div>
      <h1>Audit Trail</h1>
      <AuditLogViewer logs={logs} />
    </div>
  );
}
```

## Shared Features Available to All Apps

### 1. Automatic Audit Trails

Every data modification is automatically tracked:

```typescript
// When you update a menu item:
await dataManager.updateMenuItem(id, { price: 15.99 });

// This automatically creates an audit log:
{
  action: 'MENU_ITEM_UPDATED',
  entityType: 'MenuItem',
  entityId: 'item-123',
  userId: 'user-456',
  restaurantId: 'pave46',
  oldValue: { price: 12.99, name: 'Croissant' },
  newValue: { price: 15.99, name: 'Croissant' },
  changes: { price: { from: 12.99, to: 15.99 } },
  timestamp: '2024-01-15T10:30:00Z'
}
```

### 2. Unified Data Operations

All apps use the same data management interface:

```typescript
const dataManager = createDataManager(context);

// Menu Management
await dataManager.createMenuItem(data);
await dataManager.updateMenuItem(id, updates);
await dataManager.deleteMenuItem(id);
await dataManager.bulkUpdateMenuItems(ids, updates);

// Settings Management
await dataManager.updateContactInfo(id, updates);
await dataManager.updateOperatingHours(id, updates);

// Media Management
await dataManager.uploadImage(data);
await dataManager.deleteImage(id);

// Get data with full history
const { current, history } = await dataManager.getWithHistory('MenuItem', id);
```

### 3. Shared Admin Components

Use pre-built admin components:

```tsx
import {
  AdminLayout,
  DataTable,
  AuditLogViewer,
  MenuEditor,
  ImageUploader,
  HoursEditor
} from '@restaurant-platform/admin/components';

// Use in your admin pages
<AdminLayout>
  <MenuEditor 
    menu={menu}
    onSave={handleSave}
    showAuditHistory={true}
  />
</AdminLayout>
```

### 4. Role-Based Access Control

Check permissions consistently across all apps:

```typescript
import { checkPermission } from '@restaurant-platform/admin/auth';

// In your API routes or server components
const canEdit = await checkPermission(session.user, 'menu.edit');
const canViewAudit = await checkPermission(session.user, 'audit.view');

if (!canEdit) {
  return { error: 'Permission denied' };
}
```

### 5. Bulk Operations

Perform bulk updates with automatic audit trails:

```typescript
// Mark multiple items as out of stock
await dataManager.bulkUpdateMenuItems(
  ['item1', 'item2', 'item3'],
  { isAvailable: false }
);

// Each item gets its own audit log entry
```

### 6. Version History & Rollback

View and rollback changes:

```typescript
// Get full history of an entity
const history = await AuditService.getEntityHistory('MenuItem', itemId);

// Rollback to a previous version
await AuditService.rollback(auditLogId);
```

## Example: Complete Admin Page

Here's a complete example of an admin page using the shared infrastructure:

```tsx
// apps/pave46/src/app/admin/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  MenuEditor, 
  AuditTimeline,
  BulkActions 
} from '@restaurant-platform/admin/components';
import { createDataManager } from '@restaurant-platform/admin';

export default function MenuAdminPage() {
  const [menu, setMenu] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Load menu data
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(setMenu);
  }, []);

  // Handle individual item update
  const handleItemUpdate = async (itemId, updates) => {
    const response = await fetch(`/api/admin/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (response.ok) {
      // Refresh menu and audit logs
      refreshData();
    }
  };

  // Handle bulk operations
  const handleBulkUpdate = async (updates) => {
    const response = await fetch('/api/admin/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'update',
        entityType: 'menuItem',
        items: selectedItems,
        updates
      })
    });

    if (response.ok) {
      setSelectedItems([]);
      refreshData();
    }
  };

  // Load audit logs for selected item
  const loadAuditLogs = async (itemId) => {
    const response = await fetch(`/api/admin/audit?entityType=MenuItem&entityId=${itemId}`);
    const logs = await response.json();
    setAuditLogs(logs);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Menu Editor */}
      <div className="col-span-2">
        <h1>Menu Management</h1>
        
        <BulkActions
          selectedCount={selectedItems.length}
          onMarkUnavailable={() => handleBulkUpdate({ isAvailable: false })}
          onMarkAvailable={() => handleBulkUpdate({ isAvailable: true })}
          onDelete={() => handleBulkDelete()}
        />

        <MenuEditor
          menu={menu}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          onItemUpdate={handleItemUpdate}
          onItemClick={loadAuditLogs}
        />
      </div>

      {/* Audit Timeline Sidebar */}
      <div className="col-span-1">
        <h2>Change History</h2>
        <AuditTimeline 
          logs={auditLogs}
          onRollback={handleRollback}
        />
      </div>
    </div>
  );
}
```

## Benefits of This Shared Approach

1. **Consistency**: All restaurant apps work the same way
2. **Compliance**: Complete audit trail for all operations
3. **Efficiency**: No code duplication across apps
4. **Maintainability**: Update once, deploy everywhere
5. **Security**: Centralized permission checking
6. **Scalability**: Easy to add new restaurants to the platform

## Migration from Existing Code

For apps with existing admin functionality:

1. **Phase 1**: Add audit logging to existing operations
   ```typescript
   // Add after your existing update logic
   await AuditService.record({
     action: 'UPDATE',
     entityType: 'YourEntity',
     // ... other fields
   });
   ```

2. **Phase 2**: Gradually replace with DataManager
   ```typescript
   // Old way
   await prisma.menuItem.update(...)
   
   // New way (with automatic audit)
   await dataManager.updateMenuItem(...)
   ```

3. **Phase 3**: Adopt shared UI components
   ```tsx
   // Replace custom components with shared ones
   import { MenuEditor } from '@restaurant-platform/admin/components';
   ```

## Environment Variables

Each app needs these environment variables:

```env
# Restaurant identifier
RESTAURANT_ID=pave46

# Admin settings
ENABLE_AUDIT_TRAILS=true
AUDIT_RETENTION_DAYS=365
MAX_AUDIT_LOGS_PER_PAGE=50

# Permissions (optional overrides)
ADMIN_FEATURES=menu,settings,media,audit
```

## Support

For questions or issues with the admin package:
1. Check the package documentation
2. Review the audit logs for debugging
3. Contact the platform team

---

This shared infrastructure ensures all restaurant apps have enterprise-grade admin capabilities with complete audit trails, without duplicating code or effort.