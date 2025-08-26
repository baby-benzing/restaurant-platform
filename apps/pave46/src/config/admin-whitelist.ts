/**
 * Admin Whitelist Configuration for Pavé46
 * 
 * This file manages who can access the admin panel.
 * Only Google accounts matching these criteria will be granted access.
 * 
 * IMPORTANT: After modifying this file, changes take effect immediately
 * for new logins. Existing sessions remain valid until they expire.
 */

import { AdminWhitelist } from '@restaurant-platform/auth';

export const adminWhitelist: AdminWhitelist = {
  /**
   * Specific email addresses that are allowed admin access
   * Add individual email addresses here for precise control
   */
  allowedEmails: [
    // Owner/Management
    'owner@pave46.com',
    'manager@pave46.com',
    
    // Add specific team members here
    // 'john.doe@gmail.com',
    // 'jane.smith@gmail.com',
  ],

  /**
   * Email domains that are allowed admin access
   * Anyone with an email from these domains can sign in
   * 
   * Examples:
   * - 'pave46.com' allows any @pave46.com email
   * - 'company.com' allows any @company.com email
   */
  allowedDomains: [
    // Uncomment and add your domains
    // 'pave46.com',
  ],

  /**
   * Default role assigned to new users on first login
   * Options: 'ADMIN', 'EDITOR', 'VIEWER'
   * 
   * - ADMIN: Full access to all features
   * - EDITOR: Can modify content (menu, hours, etc.)
   * - VIEWER: Read-only access
   */
  defaultRole: 'EDITOR',
};

/**
 * Role Permissions Reference:
 * 
 * ADMIN:
 * - Full system access
 * - User management
 * - All content management
 * - Settings and configuration
 * 
 * EDITOR:
 * - Menu management (create, edit, delete)
 * - Hours management
 * - Contact information updates
 * - Media uploads
 * 
 * VIEWER:
 * - Read-only access to all sections
 * - Cannot make any changes
 */