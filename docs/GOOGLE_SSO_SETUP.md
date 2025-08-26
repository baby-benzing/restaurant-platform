# Google SSO Setup Guide

This guide explains how to set up Google Single Sign-On (SSO) for the restaurant platform admin panel.

## Overview

The platform uses Google OAuth 2.0 for authentication, which means:
- **No password management** - Google handles all authentication
- **Enhanced security** - Leverages Google's security infrastructure
- **Simple user management** - Control access via email whitelist
- **Automatic user creation** - Users are created on first login

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
   - Copy the Client ID and Client Secret

### 2. Configure Environment Variables

Create a `.env.local` file in your app directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_SECRET=generate_random_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change for production

# Database
DATABASE_URL=your_database_url_here
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Configure Admin Whitelist

Edit `/apps/[your-app]/src/config/admin-whitelist.ts`:

```typescript
export const adminWhitelist: AdminWhitelist = {
  // Individual emails
  allowedEmails: [
    'admin@example.com',
    'manager@example.com',
  ],
  
  // Entire domains (optional)
  allowedDomains: [
    'yourcompany.com',  // Allows any @yourcompany.com email
  ],
  
  // Default role for new users
  defaultRole: 'EDITOR',  // ADMIN, EDITOR, or VIEWER
};
```

### 4. Database Setup

Run migrations to create necessary tables:

```bash
cd packages/database
pnpm prisma migrate dev
```

The system will automatically create:
- AdminUser records on first login
- AdminRole records with default permissions
- Session tracking
- Audit logs

## User Management

### Adding New Admins

1. **Via Whitelist** (Recommended):
   - Add their email to `admin-whitelist.ts`
   - They sign in with Google
   - Account created automatically

2. **Via Domain**:
   - Add domain to `allowedDomains`
   - Anyone with that domain can access

### Roles and Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access to all features |
| **EDITOR** | Can modify content (menu, hours, media) |
| **VIEWER** | Read-only access |

### Changing User Roles

Currently, roles must be changed directly in the database:

```sql
UPDATE admin_users 
SET roleId = (SELECT id FROM admin_roles WHERE name = 'ADMIN')
WHERE email = 'user@example.com';
```

### Removing Admin Access

1. Remove email from whitelist configuration
2. Their existing sessions remain valid until expiry
3. They cannot login again after current session expires

To immediately revoke access:
```sql
UPDATE admin_users 
SET status = 'SUSPENDED'
WHERE email = 'user@example.com';
```

## Production Deployment

### 1. Update Environment Variables

In your production environment (Vercel, etc.):

```env
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
NEXTAUTH_SECRET=strong_random_secret
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=production_database_url
```

### 2. Update Google OAuth Settings

In Google Cloud Console:
1. Add production domain to authorized JavaScript origins
2. Add production callback URL to authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`

### 3. Configure Whitelist

Update production whitelist with real email addresses:
- Remove test emails
- Add actual admin emails
- Consider using domain-based access for organizations

## Troubleshooting

### "Access Denied" Error

**Cause**: Email not in whitelist
**Solution**: Add email to `admin-whitelist.ts`

### "Configuration Error"

**Cause**: Missing environment variables
**Solution**: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set

### User Created but Wrong Role

**Cause**: Default role setting
**Solution**: Update `defaultRole` in whitelist or manually update in database

### Session Expired Quickly

**Cause**: Short session duration
**Solution**: Increase `maxAge` in NextAuth config (default is 30 days)

## Security Best Practices

1. **Whitelist Management**:
   - Keep whitelist minimal
   - Regular audits of access list
   - Remove former employees promptly

2. **Environment Variables**:
   - Never commit `.env` files
   - Use different credentials for dev/staging/production
   - Rotate NEXTAUTH_SECRET periodically

3. **Audit Trail**:
   - Monitor audit_logs table for suspicious activity
   - Regular review of login patterns

4. **Role Assignment**:
   - Start users with minimal permissions (VIEWER)
   - Upgrade to EDITOR/ADMIN as needed
   - Document who has ADMIN access

## Multi-Restaurant Setup

For multiple restaurants in the monorepo:

1. Each app has its own `admin-whitelist.ts`
2. Share the auth package configuration
3. Use different email lists per restaurant
4. Consider using subdomains for organization

Example:
- Pave46: `admin-pave46@company.com`
- Restaurant2: `admin-restaurant2@company.com`

## Migration from Password-Based Auth

If migrating from password-based authentication:

1. Notify users of change to Google SSO
2. Add their emails to whitelist
3. Remove password-related UI/endpoints
4. Archive old user table (keep for audit purposes)
5. Update documentation

## Support

For issues or questions:
1. Check error messages in browser console
2. Review server logs for detailed errors
3. Verify environment variables are set
4. Ensure database is accessible
5. Check Google Cloud Console for OAuth issues

---

*Last Updated: 2024*
*Platform Version: 1.0.0*