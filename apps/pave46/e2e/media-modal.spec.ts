import { test, expect } from '@playwright/test';

test.describe('Media Section Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Media section
    await page.goto('http://localhost:3000');
    
    // Click on Media button in navigation
    await page.getByTestId('nav-item-media').click();
    
    // Wait for Media section to be visible
    await expect(page.getByText('Media Gallery')).toBeVisible();
  });

  test('should display 8 media items in grid', async ({ page }) => {
    // Check that all 8 media items are present
    for (let i = 1; i <= 8; i++) {
      await expect(page.getByTestId(`media-item-${i}`)).toBeVisible();
    }
    
    // Verify grid layout on mobile
    const firstItem = page.getByTestId('media-item-1');
    const boundingBox = await firstItem.boundingBox();
    
    // Check aspect ratio is square
    if (boundingBox) {
      expect(Math.abs(boundingBox.width - boundingBox.height)).toBeLessThan(5);
    }
  });

  test('should show magnifier cursor on hover', async ({ page }) => {
    const mediaItem = page.getByTestId('media-item-1');
    
    // Hover over media item
    await mediaItem.hover();
    
    // Check that zoom icon appears
    const zoomIcon = mediaItem.locator('svg');
    await expect(zoomIcon).toBeVisible();
    
    // Verify cursor style
    const cursorStyle = await mediaItem.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    expect(cursorStyle).toBe('zoom-in');
  });

  test('should open modal when clicking media item', async ({ page }) => {
    // Click on first media item
    await page.getByTestId('media-item-1').click();
    
    // Check modal is visible
    await expect(page.getByTestId('media-modal')).toBeVisible();
    await expect(page.getByTestId('media-modal-backdrop')).toBeVisible();
    
    // Verify modal title
    await expect(page.getByText('Artisan Croissant')).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Open modal
    await page.getByTestId('media-item-1').click();
    await expect(page.getByTestId('media-modal')).toBeVisible();
    
    // Click close button
    await page.getByTestId('modal-close-button').click();
    
    // Verify modal is closed
    await expect(page.getByTestId('media-modal')).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    // Open modal
    await page.getByTestId('media-item-1').click();
    await expect(page.getByTestId('media-modal')).toBeVisible();
    
    // Click backdrop
    await page.getByTestId('media-modal-backdrop').click({ position: { x: 10, y: 10 } });
    
    // Verify modal is closed
    await expect(page.getByTestId('media-modal')).not.toBeVisible();
  });

  test('should display free content correctly', async ({ page }) => {
    // Click on a free content item (item 1)
    await page.getByTestId('media-item-1').click();
    
    // Check free content is displayed
    await expect(page.getByText('Our signature butter croissant')).toBeVisible();
    await expect(page.getByText('Details')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Gallery')).toBeVisible();
  });

  test('should display premium paywall for locked content', async ({ page }) => {
    // Click on a premium content item (item 2)
    await page.getByTestId('media-item-2').click();
    
    // Check paywall is displayed
    await expect(page.getByText('Premium Content')).toBeVisible();
    await expect(page.getByText('Subscribe for $9.99/month')).toBeVisible();
    await expect(page.getByText('Learn More')).toBeVisible();
    
    // Verify lock icon is visible
    const lockIcon = page.locator('svg path[d*="M12 15v2m-6"]');
    await expect(lockIcon).toBeVisible();
  });

  test('should show premium badge on locked items', async ({ page }) => {
    // Check premium badges are visible on correct items
    const premiumItems = [2, 4, 6, 8];
    
    for (const itemId of premiumItems) {
      const item = page.getByTestId(`media-item-${itemId}`);
      const badge = item.locator('.bg-gradient-to-r.from-yellow-400');
      await expect(badge).toContainText('Premium');
    }
  });

  test('should handle modal content switching', async ({ page }) => {
    // Open first item (free)
    await page.getByTestId('media-item-1').click();
    await expect(page.getByText('Artisan Croissant')).toBeVisible();
    
    // Close modal
    await page.getByTestId('modal-close-button').click();
    
    // Open premium item
    await page.getByTestId('media-item-2').click();
    await expect(page.getByText('Classic French Onion')).toBeVisible();
    await expect(page.getByText('Premium Content')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Check grid is 2 columns on mobile
    const mediaGrid = page.locator('.grid').first();
    const gridClass = await mediaGrid.getAttribute('class');
    expect(gridClass).toContain('grid-cols-2');
    
    // Open modal
    await page.getByTestId('media-item-1').click();
    
    // Check modal fits within viewport
    const modal = page.getByTestId('media-modal');
    const modalBox = await modal.boundingBox();
    
    if (modalBox) {
      expect(modalBox.width).toBeLessThanOrEqual(390);
      expect(modalBox.height).toBeLessThanOrEqual(844);
    }
  });

  test('should navigate between sections smoothly', async ({ page }) => {
    // Verify we're in Media section
    await expect(page.getByText('Media Gallery')).toBeVisible();
    
    // Navigate to Menu section
    await page.getByTestId('nav-item-menu').click();
    await expect(page.getByText('Our Menu')).toBeVisible();
    
    // Navigate back to Media
    await page.getByTestId('nav-item-media').click();
    await expect(page.getByText('Media Gallery')).toBeVisible();
    
    // All media items should still be there
    await expect(page.getByTestId('media-item-1')).toBeVisible();
  });

  test('should maintain modal state when scrolling', async ({ page }) => {
    // Open modal
    await page.getByTestId('media-item-1').click();
    await expect(page.getByTestId('media-modal')).toBeVisible();
    
    // Try to scroll (modal should prevent background scroll)
    await page.mouse.wheel(0, 500);
    
    // Modal should still be visible
    await expect(page.getByTestId('media-modal')).toBeVisible();
    
    // Background should have backdrop blur
    const backdrop = page.getByTestId('media-modal-backdrop');
    const backdropClass = await backdrop.getAttribute('class');
    expect(backdropClass).toContain('backdrop-blur-sm');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Open modal
    await page.getByTestId('media-item-1').click();
    await expect(page.getByTestId('media-modal')).toBeVisible();
    
    // Press Escape to close modal
    await page.keyboard.press('Escape');
    
    // Modal should be closed
    await expect(page.getByTestId('media-modal')).not.toBeVisible();
  });

  test('should display all 8 items correctly on iPhone 14 screen size', async ({ page }) => {
    // Set iPhone 14 viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Check all items fit on screen without scrolling
    const mediaSection = page.locator('[data-section="media"]');
    const sectionBox = await mediaSection.boundingBox();
    
    // All 8 items (4 rows × 2 columns) should be visible
    for (let i = 1; i <= 8; i++) {
      const item = page.getByTestId(`media-item-${i}`);
      await expect(item).toBeInViewport();
    }
    
    // Check gaps between items
    const item1 = await page.getByTestId('media-item-1').boundingBox();
    const item2 = await page.getByTestId('media-item-2').boundingBox();
    
    if (item1 && item2) {
      const gap = item2.x - (item1.x + item1.width);
      expect(gap).toBeGreaterThan(0);
      expect(gap).toBeLessThan(20); // Small gap as specified
    }
  });
});