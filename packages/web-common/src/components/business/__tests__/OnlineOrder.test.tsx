import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnlineOrder, OnlineOrderProps, OrderProvider } from '../OnlineOrder';

describe('OnlineOrder', () => {
  const mockProviders: OrderProvider[] = [
    {
      name: 'DoorDash',
      url: 'https://doordash.com/restaurant',
      type: 'both',
      description: 'Fast delivery and pickup',
    },
    {
      name: 'Uber Eats',
      url: 'https://ubereats.com/restaurant',
      type: 'delivery',
      logo: 'uber-logo.png',
    },
    {
      name: 'Postmates',
      url: 'https://postmates.com/restaurant',
      type: 'pickup',
    },
  ];

  describe('Error Handling', () => {
    it('should handle undefined providers gracefully', () => {
      const { container } = render(<OnlineOrder providers={undefined as any} />);
      expect(container.querySelector('.online-order')).toBeInTheDocument();
      // Should not crash and render empty
    });

    it('should handle null providers gracefully', () => {
      const { container } = render(<OnlineOrder providers={null as any} />);
      expect(container.querySelector('.online-order')).toBeInTheDocument();
      // Should not crash and render empty
    });

    it('should handle empty providers array', () => {
      const { container } = render(<OnlineOrder providers={[]} />);
      expect(container.querySelector('.online-order')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should render with title when providers is undefined', () => {
      render(<OnlineOrder providers={undefined as any} title="Order Online" />);
      expect(screen.getByText('Order Online')).toBeInTheDocument();
    });
  });

  describe('Provider Display', () => {
    it('should display all providers', () => {
      render(<OnlineOrder providers={mockProviders} />);
      expect(screen.getByText(/Order on DoorDash/)).toBeInTheDocument();
      expect(screen.getByText(/Delivery on Uber Eats/)).toBeInTheDocument();
      expect(screen.getByText(/Pick Up on Postmates/)).toBeInTheDocument();
    });

    it('should create proper links for providers', () => {
      render(<OnlineOrder providers={mockProviders} />);
      const doordashLink = screen.getByRole('link', { name: /Order.*DoorDash/i });
      expect(doordashLink).toHaveAttribute('href', 'https://doordash.com/restaurant');
      expect(doordashLink).toHaveAttribute('target', '_blank');
      expect(doordashLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display provider descriptions in cards variant', () => {
      render(<OnlineOrder providers={mockProviders} variant="cards" />);
      expect(screen.getByText('Fast delivery and pickup')).toBeInTheDocument();
    });

    it('should display provider logos when showLogos is true', () => {
      render(<OnlineOrder providers={mockProviders} showLogos={true} />);
      const logo = screen.getByAlt('Uber Eats');
      expect(logo).toHaveAttribute('src', 'uber-logo.png');
    });

    it('should not display logos when showLogos is false', () => {
      render(<OnlineOrder providers={mockProviders} showLogos={false} />);
      expect(screen.queryByAlt('Uber Eats')).not.toBeInTheDocument();
    });
  });

  describe('Primary Provider', () => {
    it('should highlight primary provider', () => {
      render(<OnlineOrder providers={mockProviders} primaryProvider="DoorDash" />);
      const doordashLink = screen.getByRole('link', { name: /Order.*DoorDash/i });
      expect(doordashLink).toHaveClass('bg-primary-600', 'text-white');
    });

    it('should separate primary provider from others in default variant', () => {
      const { container } = render(
        <OnlineOrder providers={mockProviders} primaryProvider="DoorDash" variant="default" />
      );
      // Primary provider should be in a separate container
      const buttons = container.querySelectorAll('a[href*="doordash"]');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should handle non-existent primary provider gracefully', () => {
      render(<OnlineOrder providers={mockProviders} primaryProvider="NonExistent" />);
      // All providers should still render normally
      expect(screen.getByText(/Order on DoorDash/)).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render inline variant with compact layout', () => {
      const { container } = render(<OnlineOrder providers={mockProviders} variant="inline" />);
      expect(container.querySelector('.inline-flex')).toBeInTheDocument();
      // Should not show full provider names
      expect(screen.queryByText(/Order on DoorDash/)).not.toBeInTheDocument();
      expect(screen.getByText('Order')).toBeInTheDocument();
    });

    it('should render compact variant with smaller buttons', () => {
      render(<OnlineOrder providers={mockProviders} variant="compact" />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        if (link.textContent?.includes('Order') || 
            link.textContent?.includes('Delivery') || 
            link.textContent?.includes('Pick Up')) {
          expect(link).toHaveClass('px-4', 'py-2', 'text-sm');
        }
      });
    });

    it('should render cards variant with grid layout', () => {
      const { container } = render(<OnlineOrder providers={mockProviders} variant="cards" />);
      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(screen.getByText('DoorDash')).toBeInTheDocument();
      expect(screen.getByText('Pickup & Delivery')).toBeInTheDocument();
    });

    it('should render default variant with spacing', () => {
      const { container } = render(<OnlineOrder providers={mockProviders} variant="default" />);
      expect(container.querySelector('.space-y-4')).toBeInTheDocument();
    });
  });

  describe('Title and Description', () => {
    it('should display custom title', () => {
      render(<OnlineOrder providers={mockProviders} title="Get Food Delivered" />);
      expect(screen.getByText('Get Food Delivered')).toBeInTheDocument();
    });

    it('should display description', () => {
      render(
        <OnlineOrder 
          providers={mockProviders} 
          description="Order from your favorite delivery apps"
        />
      );
      expect(screen.getByText('Order from your favorite delivery apps')).toBeInTheDocument();
    });

    it('should not display title section when both title and description are undefined', () => {
      render(<OnlineOrder providers={mockProviders} title={undefined} />);
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });
  });

  describe('Reservation Integration', () => {
    it('should display reservation link when provided', () => {
      render(
        <OnlineOrder 
          providers={mockProviders} 
          reservationUrl="https://resy.com/restaurant"
          reservationProvider="Resy"
        />
      );
      const reservationLink = screen.getByText('Make a Reservation on Resy');
      expect(reservationLink).toHaveAttribute('href', 'https://resy.com/restaurant');
    });

    it('should display reservation in inline variant', () => {
      render(
        <OnlineOrder 
          providers={mockProviders} 
          variant="inline"
          reservationUrl="https://resy.com/restaurant"
        />
      );
      expect(screen.getByText('Reserve Table')).toBeInTheDocument();
    });

    it('should not display reservation section when URL not provided', () => {
      render(<OnlineOrder providers={mockProviders} />);
      expect(screen.queryByText(/Make a Reservation/)).not.toBeInTheDocument();
    });

    it('should use default provider name when not specified', () => {
      render(
        <OnlineOrder 
          providers={mockProviders} 
          reservationUrl="https://opentable.com/restaurant"
          reservationProvider={undefined}
        />
      );
      expect(screen.getByText('Make a Reservation on Resy')).toBeInTheDocument();
    });
  });

  describe('Provider Types', () => {
    it('should display correct text for delivery type', () => {
      const deliveryProvider: OrderProvider[] = [{
        name: 'DeliveryApp',
        url: 'https://delivery.com',
        type: 'delivery',
      }];
      render(<OnlineOrder providers={deliveryProvider} />);
      expect(screen.getByText(/Delivery on DeliveryApp/)).toBeInTheDocument();
    });

    it('should display correct text for pickup type', () => {
      const pickupProvider: OrderProvider[] = [{
        name: 'PickupApp',
        url: 'https://pickup.com',
        type: 'pickup',
      }];
      render(<OnlineOrder providers={pickupProvider} />);
      expect(screen.getByText(/Pick Up on PickupApp/)).toBeInTheDocument();
    });

    it('should display correct text for both type', () => {
      const bothProvider: OrderProvider[] = [{
        name: 'BothApp',
        url: 'https://both.com',
        type: 'both',
      }];
      render(<OnlineOrder providers={bothProvider} />);
      expect(screen.getByText(/Order on BothApp/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels for provider links', () => {
      render(<OnlineOrder providers={mockProviders} />);
      expect(screen.getByLabelText('Order delivery and pickup from DoorDash')).toBeInTheDocument();
      expect(screen.getByLabelText('Order delivery from Uber Eats')).toBeInTheDocument();
      expect(screen.getByLabelText('Order pickup from Postmates')).toBeInTheDocument();
    });

    it('should have proper rel attributes for external links', () => {
      render(<OnlineOrder providers={mockProviders} />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('should have alt text for provider logos', () => {
      render(<OnlineOrder providers={mockProviders} showLogos={true} />);
      const logo = screen.getByAlt('Uber Eats');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <OnlineOrder providers={mockProviders} className="custom-order-class" />
      );
      expect(container.querySelector('.online-order')).toHaveClass('custom-order-class');
    });

    it('should forward additional props', () => {
      const { container } = render(
        <OnlineOrder providers={mockProviders} data-testid="order-component" />
      );
      expect(container.querySelector('[data-testid="order-component"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle providers with missing optional fields', () => {
      const minimalProviders: OrderProvider[] = [{
        name: 'MinimalApp',
        url: 'https://minimal.com',
        type: 'delivery',
      }];
      render(<OnlineOrder providers={minimalProviders} />);
      expect(screen.getByText(/Delivery on MinimalApp/)).toBeInTheDocument();
    });

    it('should handle very long provider names', () => {
      const longNameProviders: OrderProvider[] = [{
        name: 'This Is A Very Long Provider Name That Should Still Display',
        url: 'https://longname.com',
        type: 'both',
      }];
      render(<OnlineOrder providers={longNameProviders} />);
      expect(screen.getByText(/Order on This Is A Very Long Provider Name/)).toBeInTheDocument();
    });

    it('should handle special characters in provider names', () => {
      const specialProviders: OrderProvider[] = [{
        name: 'Provider & Co.',
        url: 'https://special.com',
        type: 'both',
      }];
      render(<OnlineOrder providers={specialProviders} />);
      expect(screen.getByText(/Order on Provider & Co\./)).toBeInTheDocument();
    });
  });
});