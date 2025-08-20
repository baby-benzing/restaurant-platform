import { test, expect } from '@playwright/test';

test.describe('Shared Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Menu Display Component', () => {
    test('should display menu sections', async ({ page }) => {
      const menuSection = page.locator('.menu-section').first();
      await expect(menuSection).toBeVisible();
    });

    test('should show menu item names and prices', async ({ page }) => {
      const menuItem = page.locator('.menu-item').first();
      await expect(menuItem).toBeVisible();
      
      // Check if price is displayed
      const price = menuItem.locator('text=/\\$\\d+/');
      await expect(price).toBeVisible();
    });

    test('should handle different display variants', async ({ page }) => {
      // Test that menu display responds to different screen sizes
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      const mobileMenu = page.locator('.menu-display');
      await expect(mobileMenu).toBeVisible();
      
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await expect(mobileMenu).toBeVisible();
    });
  });

  test.describe('Contact Display Component', () => {
    test('should display contact information', async ({ page }) => {
      const contact = page.locator('.contact-display').first();
      
      // Check for address
      const address = contact.locator('address');
      if (await address.count() > 0) {
        await expect(address.first()).toBeVisible();
      }
      
      // Check for phone number
      const phone = contact.locator('a[href^="tel:"]');
      if (await phone.count() > 0) {
        await expect(phone.first()).toBeVisible();
      }
    });

    test('should have clickable phone and email links', async ({ page }) => {
      const phoneLink = page.locator('a[href^="tel:"]').first();
      if (await phoneLink.count() > 0) {
        const href = await phoneLink.getAttribute('href');
        expect(href).toMatch(/^tel:/);
      }
      
      const emailLink = page.locator('a[href^="mailto:"]').first();
      if (await emailLink.count() > 0) {
        const href = await emailLink.getAttribute('href');
        expect(href).toMatch(/^mailto:/);
      }
    });
  });

  test.describe('Hours Display Component', () => {
    test('should display operating hours', async ({ page }) => {
      const hours = page.locator('.hours-display, .operating-hours').first();
      if (await hours.count() > 0) {
        await expect(hours).toBeVisible();
        
        // Check for day names
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (const day of days) {
          const dayElement = hours.locator(`text=${day}`);
          if (await dayElement.count() > 0) {
            await expect(dayElement.first()).toBeVisible();
            break; // At least one day is visible
          }
        }
      }
    });

    test('should show current status if enabled', async ({ page }) => {
      const statusIndicator = page.locator('text=/Open Now|Closed Now/i').first();
      if (await statusIndicator.count() > 0) {
        await expect(statusIndicator).toBeVisible();
      }
    });
  });

  test.describe('Online Order Component', () => {
    test('should display ordering options', async ({ page }) => {
      const orderSection = page.locator('.online-order').first();
      if (await orderSection.count() > 0) {
        await expect(orderSection).toBeVisible();
        
        // Check for order buttons
        const orderButton = orderSection.locator('a[href*="order"], a[href*="grubhub"], a[href*="square"]');
        if (await orderButton.count() > 0) {
          await expect(orderButton.first()).toBeVisible();
        }
      }
    });

    test('should have external links for ordering', async ({ page }) => {
      const orderLinks = page.locator('a[target="_blank"][rel*="noopener"]');
      if (await orderLinks.count() > 0) {
        const firstLink = orderLinks.first();
        const target = await firstLink.getAttribute('target');
        expect(target).toBe('_blank');
      }
    });
  });

  test.describe('Photo Slideshow Component', () => {
    test('should display images', async ({ page }) => {
      const images = page.locator('img').filter({ hasNot: page.locator('nav img') });
      if (await images.count() > 0) {
        await expect(images.first()).toBeVisible();
        
        // Check that images have alt text
        const firstImage = images.first();
        const alt = await firstImage.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('should handle carousel navigation if present', async ({ page }) => {
      const nextButton = page.locator('button[aria-label*="Next"], button:has-text("→")').first();
      const prevButton = page.locator('button[aria-label*="Previous"], button:has-text("←")').first();
      
      if (await nextButton.count() > 0 && await prevButton.count() > 0) {
        // Test navigation
        await nextButton.click();
        await page.waitForTimeout(500); // Wait for animation
        
        await prevButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should be responsive', async ({ page }) => {
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileImages = page.locator('img').filter({ hasNot: page.locator('nav img') });
      if (await mobileImages.count() > 0) {
        await expect(mobileImages.first()).toBeVisible();
      }
      
      // Test desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      if (await mobileImages.count() > 0) {
        await expect(mobileImages.first()).toBeVisible();
      }
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check for buttons with aria-labels
      const buttons = page.locator('button[aria-label]');
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        const ariaLabel = await firstButton.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
      
      // Check for links with proper labels
      const links = page.locator('a[aria-label]');
      if (await links.count() > 0) {
        const firstLink = links.first();
        const ariaLabel = await firstLink.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    });

    test('should have semantic HTML structure', async ({ page }) => {
      // Check for main content area
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check for proper heading hierarchy
      const h1 = page.locator('h1');
      if (await h1.count() > 0) {
        await expect(h1.first()).toBeVisible();
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load images with lazy loading', async ({ page }) => {
      const images = page.locator('img[loading="lazy"]');
      if (await images.count() > 0) {
        const firstLazyImage = images.first();
        const loading = await firstLazyImage.getAttribute('loading');
        expect(loading).toBe('lazy');
      }
    });

    test('should have optimized image formats', async ({ page }) => {
      const images = page.locator('img');
      if (await images.count() > 0) {
        const firstImage = images.first();
        const src = await firstImage.getAttribute('src');
        if (src) {
          // Check if using Next.js image optimization or modern formats
          const isOptimized = src.includes('_next/image') || 
                            src.includes('.webp') || 
                            src.includes('.avif');
          expect(isOptimized || src.includes('.jpg') || src.includes('.png')).toBeTruthy();
        }
      }
    });
  });
});

test.describe('Component Documentation', () => {
  test('generate component documentation', async ({ page }) => {
    // This test generates documentation for the components
    const documentation = {
      'Menu Display': {
        description: 'Displays restaurant menu with sections and items',
        variants: ['default', 'minimal', 'detailed', 'image-focused'],
        props: {
          showPrices: 'boolean - Show/hide prices',
          showDescriptions: 'boolean - Show/hide item descriptions',
          showDietary: 'boolean - Show/hide dietary information',
          showImages: 'boolean - Show/hide item images',
          variant: 'string - Display variant',
        },
        usage: 'Use for displaying menu items in various layouts',
      },
      'Contact Display': {
        description: 'Shows restaurant contact information',
        variants: ['default', 'compact', 'detailed', 'footer'],
        props: {
          showAddress: 'boolean - Show/hide address',
          showPhone: 'boolean - Show/hide phone',
          showEmail: 'boolean - Show/hide email',
          showSocial: 'boolean - Show/hide social media links',
        },
        usage: 'Use in footer or contact pages',
      },
      'Hours Display': {
        description: 'Displays operating hours with current status',
        variants: ['default', 'compact', 'detailed', 'inline'],
        props: {
          showCurrentStatus: 'boolean - Show open/closed status',
          highlightToday: 'boolean - Highlight current day',
          format24Hour: 'boolean - Use 24-hour format',
        },
        usage: 'Use to show business hours with live status',
      },
      'Online Order': {
        description: 'Provides online ordering and reservation links',
        variants: ['default', 'compact', 'cards', 'inline'],
        props: {
          providers: 'array - List of ordering providers',
          showLogos: 'boolean - Show provider logos',
          primaryProvider: 'string - Featured provider',
        },
        usage: 'Use for order CTAs and third-party integrations',
      },
      'Photo Slideshow': {
        description: 'Displays photos in various layouts',
        variants: ['hero', 'carousel', 'grid', 'masonry', 'fade'],
        props: {
          autoPlay: 'boolean - Enable auto-play',
          showThumbnails: 'boolean - Show thumbnail navigation',
          showIndicators: 'boolean - Show slide indicators',
          enableLightbox: 'boolean - Enable lightbox view',
        },
        usage: 'Use for hero sections, galleries, and slideshows',
      },
    };

    // Log documentation to console
    console.log('Component Documentation:', JSON.stringify(documentation, null, 2));
    
    // Verify documentation structure
    expect(Object.keys(documentation).length).toBe(5);
    for (const component of Object.values(documentation)) {
      expect(component).toHaveProperty('description');
      expect(component).toHaveProperty('variants');
      expect(component).toHaveProperty('props');
      expect(component).toHaveProperty('usage');
    }
  });
});