import { test, expect } from '@playwright/test';

test.describe('Menu CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Login as admin
    await page.fill('#email', 'admin@pave46.com');
    await page.fill('#password', 'AdminPassword123!');
    
    // Submit and wait for response
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]')
    ]);
    
    // Wait for cookie to be set
    await page.waitForTimeout(1000);
    
    // Navigate to menu management
    await page.goto('/admin/menu');
  });

  test('displays menu items list', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Menu Management');
    
    // Check that menu items are displayed
    await expect(page.getByText('French Onion Soup', { exact: true })).toBeVisible();
    await expect(page.getByText('Steak Frites', { exact: true })).toBeVisible();
    await expect(page.getByText('Crème Brûlée', { exact: true })).toBeVisible();
    
    // Check category badges
    await expect(page.locator('text=appetizers').first()).toBeVisible();
    await expect(page.locator('text=mains').first()).toBeVisible();
    await expect(page.locator('text=desserts').first()).toBeVisible();
  });

  test('filters menu items by category', async ({ page }) => {
    // Click on Appetizers filter
    await page.click('button:has-text("Appetizers")');
    
    // Check that only appetizers are shown
    await expect(page.getByText('French Onion Soup', { exact: true })).toBeVisible();
    await expect(page.getByText('Steak Frites', { exact: true })).not.toBeVisible();
    
    // Click on Main Courses filter
    await page.click('button:has-text("Main Courses")');
    
    // Check that only mains are shown
    await expect(page.getByText('Steak Frites', { exact: true })).toBeVisible();
    await expect(page.getByText('French Onion Soup', { exact: true })).not.toBeVisible();
    
    // Click on All Items to reset
    await page.click('button:has-text("All Items")');
    
    // Check that all items are shown again
    await expect(page.getByText('French Onion Soup', { exact: true })).toBeVisible();
    await expect(page.getByText('Steak Frites', { exact: true })).toBeVisible();
  });

  test.skip('creates a new menu item', async ({ page }) => {
    // Skip: Requires persistent data storage
    // Click Add New Item button
    await page.click('text=Add New Item');
    
    // Check we're on the create page
    await expect(page.locator('h1')).toContainText('Add New Menu Item');
    
    // Fill in the form
    await page.fill('#name', 'Test Salad');
    await page.fill('#description', 'Fresh garden salad with vinaigrette');
    await page.fill('#price', '18.50');
    await page.selectOption('#category', 'appetizers');
    
    // Select allergens
    await page.click('button:has-text("gluten")');
    await page.click('button:has-text("dairy")');
    
    // Ensure item is available
    const checkbox = page.locator('#isAvailable');
    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }
    
    // Submit the form
    await page.click('button:has-text("Create Item")');
    
    // Check we're back on the menu list
    await page.waitForURL('**/admin/menu');
    
    // Verify the new item appears in the list
    await expect(page.locator('text=Test Salad')).toBeVisible();
    await expect(page.locator('text=Fresh garden salad with vinaigrette')).toBeVisible();
    await expect(page.locator('text=$18.50')).toBeVisible();
  });

  test.skip('edits an existing menu item', async ({ page }) => {
    // Skip: Requires persistent data storage
    // Find the French Onion Soup row and click Edit
    const row = page.locator('tr', { hasText: 'French Onion Soup' });
    await row.locator('text=Edit').click();
    
    // Check we're on the edit page
    await expect(page.locator('h1')).toContainText('Edit Menu Item');
    await expect(page.locator('text=Update the details for French Onion Soup')).toBeVisible();
    
    // Modify the form
    await page.fill('#name', 'French Onion Soup Deluxe');
    await page.fill('#price', '16.99');
    
    // Toggle availability
    await page.click('#isAvailable');
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    
    // Check we're back on the menu list
    await page.waitForURL('**/admin/menu');
    
    // Verify the changes
    await expect(page.locator('text=French Onion Soup Deluxe')).toBeVisible();
    await expect(page.locator('text=$16.99')).toBeVisible();
    
    // Check availability status changed
    const updatedRow = page.locator('tr', { hasText: 'French Onion Soup Deluxe' });
    await expect(updatedRow.locator('text=Unavailable')).toBeVisible();
  });

  test.skip('deletes a menu item', async ({ page }) => {
    // Skip: Requires persistent data storage
    // Count initial items
    const initialCount = await page.locator('tbody tr').count();
    
    // Set up dialog handler before clicking delete
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete');
      dialog.accept();
    });
    
    // Find a specific item and delete it
    const row = page.locator('tr', { hasText: 'Crème Brûlée' });
    await row.locator('button:has-text("Delete")').click();
    
    // Wait for the item to be removed
    await page.waitForTimeout(500);
    
    // Verify the item is gone
    await expect(page.locator('text=Crème Brûlée')).not.toBeVisible();
    
    // Verify count decreased
    const newCount = await page.locator('tbody tr').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('cancels delete when declined', async ({ page }) => {
    // Set up dialog handler to cancel
    page.on('dialog', dialog => {
      dialog.dismiss();
    });
    
    // Find a specific item and try to delete it
    const row = page.locator('tr', { hasText: 'Old Fashioned' });
    await row.locator('button:has-text("Delete")').click();
    
    // Wait a moment
    await page.waitForTimeout(500);
    
    // Verify the item is still there
    await expect(page.locator('text=Old Fashioned')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    // Navigate to create page
    await page.click('text=Add New Item');
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Create Item")');
    
    // Check we're still on the create page (form validation prevented submission)
    await expect(page).toHaveURL(/\/admin\/menu\/new/);
    
    // Fill in name only
    await page.fill('#name', 'Incomplete Item');
    await page.click('button:has-text("Create Item")');
    
    // Should still be on create page (description is required)
    await expect(page).toHaveURL(/\/admin\/menu\/new/);
  });

  test('navigates back to dashboard', async ({ page }) => {
    // Click Back to Dashboard
    await page.click('text=Back to Dashboard');
    
    // Verify navigation
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });
});

test.describe('Menu CRUD - Editor Role', () => {
  test.beforeEach(async ({ page }) => {
    // Login as editor
    await page.goto('/auth/login');
    await page.fill('#email', 'editor@pave46.com');
    await page.fill('#password', 'EditorPassword123!');
    
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]')
    ]);
    
    await page.waitForTimeout(1000);
    await page.goto('/admin/menu');
  });

  test('editor can access menu management', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Menu Management');
    await expect(page.locator('text=Add New Item')).toBeVisible();
  });

  test.skip('editor can create and edit items', async ({ page }) => {
    // Skip: Requires persistent data storage
    // Create a new item
    await page.click('text=Add New Item');
    await page.fill('#name', 'Editor Test Item');
    await page.fill('#description', 'Created by editor');
    await page.fill('#price', '12.99');
    await page.click('button:has-text("Create Item")');
    
    await page.waitForURL('**/admin/menu');
    await expect(page.locator('text=Editor Test Item')).toBeVisible();
  });
});