import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page, context }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Login as admin using id selectors
    await page.fill('#email', 'admin@pave46.com');
    await page.fill('#password', 'AdminPassword123!');
    
    // Click submit and wait for navigation
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]')
    ]);
    
    // Small delay to ensure cookie is set
    await page.waitForTimeout(1000);
    
    // Navigate directly to dashboard
    await page.goto('/admin/dashboard');
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('displays dashboard with statistics', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Check welcome message
    await expect(page.locator('text=Welcome back')).toBeVisible();
    
    // Check statistics cards are displayed
    await expect(page.locator('text=Total Page Views')).toBeVisible();
    await expect(page.locator('text=Unique Visitors')).toBeVisible();
    await expect(page.locator('text=Menu Views')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    
    // Check that metric values are displayed
    const pageViewsCard = page.locator('text=Total Page Views').locator('..');
    await expect(pageViewsCard).toContainText(/\d+/); // Should contain numbers
  });

  test('displays recent activity section', async ({ page }) => {
    // Check Recent Activity section exists
    await expect(page.locator('h3:has-text("Recent Activity")')).toBeVisible();
    
    // Activity items should be visible (or "No recent activity" message)
    const activitySection = page.locator('text=Recent Activity').locator('..');
    const hasActivity = await activitySection.locator('text=/Updated|Changed|logged/').count() > 0;
    const hasNoActivity = await activitySection.locator('text=No recent activity').count() > 0;
    
    expect(hasActivity || hasNoActivity).toBeTruthy();
  });

  test('displays quick actions based on user role', async ({ page }) => {
    // Check Quick Actions section exists
    await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible();
    
    // Admin should see all quick actions
    await expect(page.locator('text=Add Menu Item')).toBeVisible();
    await expect(page.locator('text=Update Hours')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
    await expect(page.locator('text=Manage Users')).toBeVisible();
  });

  test('logout functionality works', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Logout")');
    
    // Should redirect to login page
    await page.waitForURL('**/auth/login');
    await expect(page.locator('h1')).toContainText('Admin Login');
  });

  test('view site link works', async ({ page }) => {
    // Click View Site link
    await page.click('text=View Site');
    
    // Should navigate to main site
    await expect(page).toHaveURL('/');
  });

  test('displays user role indicator', async ({ page }) => {
    // Check role indicator is displayed
    await expect(page.locator('text=/Logged in as: (ADMIN|EDITOR|VIEWER)/')).toBeVisible();
  });

  test('quick action links navigate correctly', async ({ page }) => {
    // Test Add Menu Item link
    await page.click('text=Add Menu Item');
    await expect(page).toHaveURL(/\/admin\/menu/);
    
    // Go back to dashboard
    await page.goto('/admin/dashboard');
    
    // Test Update Hours link
    await page.click('text=Update Hours');
    await expect(page).toHaveURL(/\/admin\/hours/);
    
    // Go back to dashboard
    await page.goto('/admin/dashboard');
    
    // Test View Analytics link
    await page.click('text=View Analytics');
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });

  test('shows percentage changes for metrics', async ({ page }) => {
    // Look for percentage indicators
    const percentagePattern = /[↑↓]\d+(\.\d+)?%/;
    const percentages = await page.locator('text=/[↑↓]\\d+(\\.\\d+)?%/').count();
    
    // Should have at least one percentage indicator
    expect(percentages).toBeGreaterThan(0);
    
    // Check "from last month" text appears
    await expect(page.locator('text=from last month').first()).toBeVisible();
  });
});

test.describe('Admin Dashboard - Editor Role', () => {
  test.beforeEach(async ({ page, context }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Login as editor using id selectors
    await page.fill('#email', 'editor@pave46.com');
    await page.fill('#password', 'EditorPassword123!');
    
    // Click submit and wait for navigation
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]')
    ]);
    
    // Small delay to ensure cookie is set
    await page.waitForTimeout(1000);
    
    // Navigate directly to dashboard
    await page.goto('/admin/dashboard');
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('editor sees limited quick actions', async ({ page }) => {
    // Editor should see these actions
    await expect(page.locator('text=Add Menu Item')).toBeVisible();
    await expect(page.locator('text=Update Hours')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
    
    // Editor should NOT see Manage Users
    await expect(page.locator('text=Manage Users')).not.toBeVisible();
  });

  test('displays editor role indicator', async ({ page }) => {
    await expect(page.locator('text=Logged in as: EDITOR')).toBeVisible();
  });
});