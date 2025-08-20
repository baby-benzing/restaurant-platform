import { test, expect } from '@playwright/test';

test.describe('Settings Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('#email', 'admin@pave46.com');
    await page.fill('#password', 'AdminPassword123!');
    
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200),
      page.click('button[type="submit"]')
    ]);
    
    await page.waitForTimeout(1000);
  });

  test.describe('Hours Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/hours');
    });

    test('displays operating hours page', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Operating Hours');
      
      // Check all days are displayed
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        await expect(page.locator(`text=${day}`).first()).toBeVisible();
      }
      
      // Check time inputs exist
      await expect(page.locator('input[type="time"]').first()).toBeVisible();
    });

    test('can toggle day closed', async ({ page }) => {
      // Find Monday closed checkbox
      const mondayClosedCheckbox = page.locator('#monday_closed');
      
      // Toggle closed
      await mondayClosedCheckbox.click();
      
      // Check that time inputs are hidden when closed
      const mondaySection = page.locator('text=Monday').locator('..');
      await expect(mondaySection.locator('input[type="time"]')).not.toBeVisible();
      
      // Save button should be enabled
      await expect(page.locator('button:has-text("Save Changes")')).not.toBeDisabled();
    });

    test('can change opening hours', async ({ page }) => {
      // Find Tuesday open time input
      const tuesdayOpen = page.locator('input[type="time"]').nth(2); // 0=Mon open, 1=Mon close, 2=Tue open
      
      // Change time
      await tuesdayOpen.fill('18:30');
      
      // Check unsaved changes indicator
      await expect(page.locator('text=You have unsaved changes')).toBeVisible();
      
      // Save button should be enabled
      await expect(page.locator('button:has-text("Save Changes")')).not.toBeDisabled();
    });

    test('can apply Monday hours to weekdays', async ({ page }) => {
      // Set Monday hours
      const mondayOpen = page.locator('input[type="time"]').first();
      await mondayOpen.fill('16:00');
      
      // Click "Apply Monday to Weekdays"
      await page.click('button:has-text("Apply Monday to Weekdays")');
      
      // Check that Tuesday-Friday have the same hours
      const tuesdayOpen = page.locator('input[type="time"]').nth(2);
      await expect(tuesdayOpen).toHaveValue('16:00');
    });

    test('shows preview of hours', async ({ page }) => {
      // Check preview section exists
      await expect(page.locator('h3:has-text("Preview")')).toBeVisible();
      
      // Check format (e.g., "5:00 PM - 11:00 PM")
      await expect(page.locator('text=/\\d{1,2}:\\d{2} (AM|PM) - \\d{1,2}:\\d{2} (AM|PM)/')).toBeVisible();
    });

    test('can reset changes', async ({ page }) => {
      // Make a change
      const mondayOpen = page.locator('input[type="time"]').first();
      const originalValue = await mondayOpen.inputValue();
      await mondayOpen.fill('10:00');
      
      // Reset should be enabled
      await expect(page.locator('button:has-text("Reset")')).not.toBeDisabled();
      
      // Click reset
      await page.click('button:has-text("Reset")');
      
      // Value should be restored
      await expect(mondayOpen).toHaveValue(originalValue);
      
      // Unsaved changes indicator should be gone
      await expect(page.locator('text=You have unsaved changes')).not.toBeVisible();
    });
  });

  test.describe('Contact Information Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/contact');
    });

    test('displays contact management page', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Contact & Information');
      
      // Check sections
      await expect(page.locator('h2:has-text("General Information")')).toBeVisible();
      await expect(page.locator('h2:has-text("Contact Information")')).toBeVisible();
      await expect(page.locator('h2:has-text("Social Media")')).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      // Clear a required field
      const nameInput = page.locator('#name');
      await nameInput.clear();
      
      // Try to save
      await page.click('button:has-text("Save Changes")');
      
      // Should show error
      await expect(page.locator('text=Restaurant Name is required')).toBeVisible();
    });

    test('validates phone format', async ({ page }) => {
      const phoneInput = page.locator('#phone');
      
      // Enter invalid format
      await phoneInput.clear();
      await phoneInput.fill('123-456-7890');
      
      // Tab out to trigger validation
      await phoneInput.press('Tab');
      
      // Should show error
      await expect(page.locator('text=/Invalid format/')).toBeVisible();
      
      // Enter valid format
      await phoneInput.clear();
      await phoneInput.fill('(212) 555-1234');
      await phoneInput.press('Tab');
      
      // Error should be gone
      await expect(page.locator('text=/Invalid format/')).not.toBeVisible();
    });

    test('validates ZIP code', async ({ page }) => {
      const zipInput = page.locator('#zip');
      
      // Enter invalid ZIP
      await zipInput.clear();
      await zipInput.fill('123');
      await zipInput.press('Tab');
      
      // Should show error
      await expect(page.locator('text=/Invalid format|ZIP Code format/')).toBeVisible();
      
      // Enter valid ZIP
      await zipInput.clear();
      await zipInput.fill('10013');
      await zipInput.press('Tab');
      
      // Error should be gone
      await expect(page.locator('text=/Invalid format|ZIP Code format/')).not.toBeVisible();
    });

    test('can update general information', async ({ page }) => {
      // Update tagline
      const taglineInput = page.locator('#tagline');
      await taglineInput.clear();
      await taglineInput.fill('Updated Tagline');
      
      // Update description
      const descriptionInput = page.locator('#description');
      await descriptionInput.clear();
      await descriptionInput.fill('Updated description of the restaurant');
      
      // Should show unsaved changes
      await expect(page.locator('text=You have unsaved changes')).toBeVisible();
      
      // Save button should be enabled
      await expect(page.locator('button:has-text("Save Changes")')).not.toBeDisabled();
    });

    test('can update social media links', async ({ page }) => {
      // Update Instagram
      const instagramInput = page.locator('#instagram');
      await instagramInput.clear();
      await instagramInput.fill('https://instagram.com/newhandle');
      
      // Update Facebook
      const facebookInput = page.locator('#facebook');
      await facebookInput.clear();
      await facebookInput.fill('https://facebook.com/newpage');
      
      // Should show unsaved changes
      await expect(page.locator('text=You have unsaved changes')).toBeVisible();
    });

    test('prevents saving with validation errors', async ({ page }) => {
      // Create an error
      const phoneInput = page.locator('#phone');
      await phoneInput.clear();
      await phoneInput.fill('invalid');
      await phoneInput.press('Tab');
      
      // Save button should be disabled
      await expect(page.locator('button:has-text("Save Changes")')).toBeDisabled();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate between settings pages', async ({ page }) => {
      // Start at dashboard
      await page.goto('/admin/dashboard');
      
      // Navigate to hours
      await page.click('text=Operating Hours');
      await expect(page).toHaveURL(/\/admin\/hours/);
      
      // Navigate back to dashboard
      await page.click('text=Back to Dashboard');
      await expect(page).toHaveURL(/\/admin\/dashboard/);
      
      // Navigate to contact
      await page.click('text=Contact Info');
      await expect(page).toHaveURL(/\/admin\/contact/);
    });
  });
});