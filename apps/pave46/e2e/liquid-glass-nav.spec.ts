import { test, expect } from '@playwright/test';

test.describe('LiquidGlassNav Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all navigation items', async ({ page }) => {
    // Check if navigation is present
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();

    // Check for all navigation items
    await expect(page.getByTestId('nav-item-home')).toBeVisible();
    await expect(page.getByTestId('nav-item-menu')).toBeVisible();
    await expect(page.getByTestId('nav-item-order')).toBeVisible();
    await expect(page.getByTestId('nav-item-info')).toBeVisible();

    // Check labels
    await expect(page.getByTestId('nav-label-home')).toHaveText('Home');
    await expect(page.getByTestId('nav-label-menu')).toHaveText('Menu');
    await expect(page.getByTestId('nav-label-order')).toHaveText('Order');
    await expect(page.getByTestId('nav-label-info')).toHaveText('Info');
  });

  test('should highlight active section', async ({ page }) => {
    // Home should be active by default
    const homeButton = page.getByTestId('nav-item-home');
    await expect(homeButton).toHaveClass(/scale-105/);

    // Click on Menu
    const menuButton = page.getByTestId('nav-item-menu');
    await menuButton.click();
    
    // Menu should now be active
    await expect(menuButton).toHaveClass(/scale-105/);
    await expect(homeButton).not.toHaveClass(/scale-105/);
  });

  test('should change sections when clicking navigation items', async ({ page }) => {
    // Click Menu
    await page.getByTestId('nav-item-menu').click();
    await expect(page.locator('[data-section="menu"]')).toBeVisible();

    // Click Order
    await page.getByTestId('nav-item-order').click();
    await expect(page.locator('[data-section="order"]')).toBeVisible();

    // Click Info
    await page.getByTestId('nav-item-info').click();
    await expect(page.locator('[data-section="info"]')).toBeVisible();

    // Click Home
    await page.getByTestId('nav-item-home').click();
    await expect(page.locator('[data-section="home"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // Check aria-current for active item
    const homeButton = page.getByTestId('nav-item-home');
    await expect(homeButton).toHaveAttribute('aria-current', 'page');

    // After clicking menu, menu should have aria-current
    const menuButton = page.getByTestId('nav-item-menu');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-current', 'page');
    await expect(homeButton).not.toHaveAttribute('aria-current', 'page');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be visible
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
    
    // All items should be visible
    await expect(page.getByTestId('nav-item-home')).toBeVisible();
    await expect(page.getByTestId('nav-item-menu')).toBeVisible();
    await expect(page.getByTestId('nav-item-order')).toBeVisible();
    await expect(page.getByTestId('nav-item-info')).toBeVisible();
  });

  test('should have glass morphism effect', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    
    // Check for backdrop blur
    await expect(nav).toHaveClass(/backdrop-blur-xl/);
    
    // Check for transparency
    await expect(nav).toHaveClass(/bg-black\/10/);
    
    // Check for border
    await expect(nav).toHaveClass(/border/);
  });
});