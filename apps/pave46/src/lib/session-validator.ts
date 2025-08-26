/**
 * Session Validation Helper
 * Ensures users who are removed/suspended cannot continue accessing the admin
 */

// Mock active users for development
// In production, this would query the database
const mockActiveUsers = new Set([
  'admin@pave46.com',
  'editor@pave46.com',
  'admin@dev.local',
  'editor@dev.local',
]);

/**
 * Check if a user's session is still valid
 * This should be called on each admin request
 */
export async function validateUserSession(email: string): Promise<boolean> {
  // In production, this would:
  // 1. Query the database for the user
  // 2. Check if status === 'ACTIVE'
  // 3. Return false if user is suspended or doesn't exist
  
  // For development, check mock active users
  return mockActiveUsers.has(email);
}

/**
 * Remove a user from active sessions
 * Called when an admin removes/suspends a user
 */
export function invalidateUserSession(email: string): void {
  // In production, this would:
  // 1. Update user status in database to 'SUSPENDED'
  // 2. Optionally: Clear any server-side session cache
  // 3. The next request from this user would fail validation
  
  // For development, remove from mock active users
  mockActiveUsers.delete(email);
}

/**
 * Add a user to active sessions
 * Called when an admin invites a new user
 */
export function activateUserSession(email: string): void {
  // In production, this would:
  // 1. Create/update user in database with status 'ACTIVE'
  // 2. User can now sign in with Google
  
  // For development, add to mock active users
  mockActiveUsers.add(email);
}

/**
 * Get session info from request
 * Extracts user information from session token
 */
export function getSessionUser(request: Request): { email: string; role: string } | null {
  // In production, this would:
  // 1. Get the session token from cookies
  // 2. Decode and verify the JWT
  // 3. Return user info
  
  // For development, return mock user
  const cookies = request.headers.get('cookie') || '';
  const hasDevBypass = cookies.includes('dev-bypass-active=true');
  
  if (hasDevBypass) {
    return {
      email: 'admin@dev.local',
      role: 'ADMIN',
    };
  }
  
  // Check for NextAuth session (simplified)
  if (cookies.includes('next-auth.session-token')) {
    return {
      email: 'admin@pave46.com',
      role: 'ADMIN',
    };
  }
  
  return null;
}