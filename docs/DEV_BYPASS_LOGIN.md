# Development Bypass Login

## Overview

To speed up local development and testing, the platform includes a **development-only** bypass that allows instant login without Google SSO configuration. This bypass is **automatically disabled in production** for security.

## How It Works

### Visual Indicator
When using dev bypass login, you'll see:
1. **Yellow warning panel** on the login page with quick login buttons
2. **"DEV MODE" indicator** in the bottom-right corner of the admin panel

### Security Features
- ✅ **Only works when `NODE_ENV !== 'production'`**
- ✅ Returns 404 in production environments
- ✅ Uses mock users with `@dev.local` emails
- ✅ Clear visual indicators when active
- ✅ Separate session cookies from production auth

## Quick Start

### 1. Start in Development Mode
```bash
npm run dev
# or
pnpm dev
```

### 2. Navigate to Login
Go to: `http://localhost:3000/auth/login`

### 3. Use Quick Login
You'll see a yellow "Development Mode - Quick Login" panel with three buttons:

| Button | Role | Permissions |
|--------|------|-------------|
| **Admin** | Full access | All features |
| **Editor** | Content management | Menu, hours, media |
| **Viewer** | Read-only | View all sections |

Click any button to instantly login with that role.

## Mock Users

The following mock users are created:

```javascript
{
  admin: {
    email: 'admin@dev.local',
    name: 'Dev Admin',
    role: 'ADMIN'
  },
  editor: {
    email: 'editor@dev.local',
    name: 'Dev Editor',
    role: 'EDITOR'
  },
  viewer: {
    email: 'viewer@dev.local',
    name: 'Dev Viewer',
    role: 'VIEWER'
  }
}
```

## Manual API Testing

You can also login programmatically:

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Login as editor
curl -X POST http://localhost:3000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"role": "editor"}'

# Logout
curl -X DELETE http://localhost:3000/api/auth/dev-login
```

## Testing Different Roles

### Admin Testing
```javascript
// Login as admin to test:
- User management features
- All CRUD operations
- System settings
- Full menu/content management
```

### Editor Testing
```javascript
// Login as editor to test:
- Menu item creation/editing
- Hours management
- Media uploads
- Contact updates
// Should NOT have access to:
- User management
- System settings
```

### Viewer Testing
```javascript
// Login as viewer to test:
- Read-only access
- All view pages work
// Should NOT have access to:
- Any edit/create/delete operations
- Form submissions should be disabled
```

## Environment Detection

The bypass checks `process.env.NODE_ENV`:

| Environment | Bypass Available | Google SSO Required |
|-------------|-----------------|---------------------|
| `development` | ✅ Yes | ❌ No |
| `test` | ✅ Yes | ❌ No |
| `production` | ❌ No | ✅ Yes |
| Not set | ✅ Yes | ❌ No |

## Switching Between Auth Methods

### Use Dev Bypass
1. Just click the quick login buttons
2. No configuration needed

### Use Google SSO in Dev
1. Set up Google OAuth credentials
2. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   NEXTAUTH_SECRET=xxx
   ```
3. Use the regular "Sign in with Google" button

### Force Production Mode Locally
```bash
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```
The dev bypass will be completely disabled.

## Common Use Cases

### 1. Quick Admin Access
```javascript
// Need to quickly check admin panel
Click "Admin" button → Instant access
```

### 2. Testing Permissions
```javascript
// Test if editors can't access user management
1. Click "Editor" button
2. Try to access /admin/users
3. Should be blocked or redirected
```

### 3. UI Development
```javascript
// Rapidly switch between roles
1. Click "Viewer" → Check read-only UI
2. Logout
3. Click "Editor" → Check edit capabilities
4. Logout  
5. Click "Admin" → Check full access
```

### 4. Automated Testing
```javascript
// In your tests
beforeEach(async () => {
  await fetch('/api/auth/dev-login', {
    method: 'POST',
    body: JSON.stringify({ role: 'admin' })
  });
});

afterEach(async () => {
  await fetch('/api/auth/dev-login', {
    method: 'DELETE'
  });
});
```

## Troubleshooting

### Dev Panel Not Showing
- Check `NODE_ENV` is not set to `production`
- Verify you're on `/auth/login` page
- Clear browser cache/cookies

### Can't Access Admin After Dev Login
- Check middleware is properly configured
- Ensure `NEXTAUTH_SECRET` is set (even to 'dev-secret-key')
- Try clearing all cookies and login again

### Dev Mode Indicator Not Showing
- The indicator only shows when using dev bypass
- It won't show for Google SSO logins
- Check browser console for errors

### Production Build Testing
To test that dev bypass is properly disabled:
```bash
# Build for production
NODE_ENV=production npm run build

# Start production server
NODE_ENV=production npm run start

# Try to access dev login
curl -X POST http://localhost:3000/api/auth/dev-login
# Should return 404
```

## Security Notes

⚠️ **IMPORTANT**: The dev bypass is a security feature designed to:
1. Only work in development environments
2. Be automatically disabled in production
3. Use obvious mock emails (`@dev.local`)
4. Show clear visual warnings when active

**Never attempt to:**
- Enable dev bypass in production
- Remove the production checks
- Use real email addresses in dev users
- Share dev bypass endpoints publicly

## Best Practices

1. **Use for Development Only**: Never try to enable in production
2. **Test All Roles**: Regularly test viewer/editor/admin permissions
3. **Clear Sessions**: Logout between role testing
4. **Visual Checks**: Ensure dev mode indicator is visible
5. **Production Verification**: Always test production builds before deploy

---

*Last Updated: 2024*
*Security Level: Development Only*