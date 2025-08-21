import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderSection from '../OrderSection';

// Mock the OnlineOrder component from web-common
jest.mock('@restaurant-platform/web-common', () => ({
  OnlineOrder: () => (
    <div data-testid="online-order-component">
      Online Order Component
    </div>
  ),
}));

describe('OrderSection', () => {
  describe('Basic Rendering', () => {
    it('should render the order section', () => {
      const { container } = render(<OrderSection />);
      expect(container.querySelector('[data-section="order"]')).toBeInTheDocument();
    });

    it('should display the section title', () => {
      render(<OrderSection />);
      expect(screen.getByRole('heading', { name: 'Order Online' })).toBeInTheDocument();
    });

    it('should display the description text', () => {
      render(<OrderSection />);
      expect(screen.getByText('Fresh baked goods and artisanal sandwiches delivered to your door')).toBeInTheDocument();
    });

    it('should render OnlineOrder component', () => {
      render(<OrderSection />);
      expect(screen.getByTestId('online-order-component')).toBeInTheDocument();
    });
  });

  describe('Direct Order Links', () => {
    it('should display Square order link', () => {
      render(<OrderSection />);
      const squareLink = screen.getByRole('link', { name: 'Order via Square' });
      expect(squareLink).toBeInTheDocument();
      expect(squareLink).toHaveAttribute('href', 'https://pav-108819.square.site');
      expect(squareLink).toHaveAttribute('target', '_blank');
      expect(squareLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display call to order link', () => {
      render(<OrderSection />);
      const callLink = screen.getByRole('link', { name: 'Call to Order' });
      expect(callLink).toBeInTheDocument();
      expect(callLink).toHaveAttribute('href', 'tel:6464541387');
    });

    it('should display partner order text', () => {
      render(<OrderSection />);
      expect(screen.getByText('Order directly through our partners')).toBeInTheDocument();
    });
  });

  describe('Feature Cards', () => {
    it('should display Quick Pickup card', () => {
      render(<OrderSection />);
      expect(screen.getByRole('heading', { name: 'Quick Pickup' })).toBeInTheDocument();
      expect(screen.getByText('Ready in 15-20 minutes')).toBeInTheDocument();
    });

    it('should display Fresh Daily card', () => {
      render(<OrderSection />);
      expect(screen.getByRole('heading', { name: 'Fresh Daily' })).toBeInTheDocument();
      expect(screen.getByText('Made with finest ingredients')).toBeInTheDocument();
    });

    it('should display Best Value card', () => {
      render(<OrderSection />);
      expect(screen.getByRole('heading', { name: 'Best Value' })).toBeInTheDocument();
      expect(screen.getByText('Quality at fair prices')).toBeInTheDocument();
    });

    it('should render all three feature cards', () => {
      const { container } = render(<OrderSection />);
      const featureCards = container.querySelectorAll('.bg-white.rounded-xl.p-6');
      expect(featureCards).toHaveLength(3);
    });
  });

  describe('Icons and SVGs', () => {
    it('should render clock icon for Quick Pickup', () => {
      const { container } = render(<OrderSection />);
      const clockIcon = container.querySelector('.bg-blue-100 svg');
      expect(clockIcon).toBeInTheDocument();
      expect(clockIcon).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render checkmark icon for Fresh Daily', () => {
      const { container } = render(<OrderSection />);
      const checkIcon = container.querySelector('.bg-green-100 svg');
      expect(checkIcon).toBeInTheDocument();
    });

    it('should render dollar icon for Best Value', () => {
      const { container } = render(<OrderSection />);
      const dollarIcon = container.querySelector('.bg-purple-100 svg');
      expect(dollarIcon).toBeInTheDocument();
    });

    it('should have correct icon colors', () => {
      const { container } = render(<OrderSection />);
      expect(container.querySelector('.text-blue-600')).toBeInTheDocument();
      expect(container.querySelector('.text-green-600')).toBeInTheDocument();
      expect(container.querySelector('.text-purple-600')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct section background', () => {
      const { container } = render(<OrderSection />);
      const section = container.querySelector('[data-section="order"]');
      expect(section).toHaveClass('min-h-screen', 'bg-gray-50', 'px-4', 'py-20');
    });

    it('should have centered content container', () => {
      const { container } = render(<OrderSection />);
      const contentContainer = container.querySelector('.max-w-4xl.mx-auto');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have white card with shadow', () => {
      const { container } = render(<OrderSection />);
      const card = container.querySelector('.bg-white.rounded-2xl.shadow-lg');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('p-8', 'md:p-12');
    });

    it('should have grid layout for feature cards', () => {
      const { container } = render(<OrderSection />);
      const grid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('gap-6');
    });

    it('should have separator between sections', () => {
      const { container } = render(<OrderSection />);
      const separator = container.querySelector('.border-t.border-gray-200');
      expect(separator).toBeInTheDocument();
      expect(separator?.parentElement).toHaveClass('mt-8', 'pt-8');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive title text size', () => {
      render(<OrderSection />);
      const title = screen.getByRole('heading', { name: 'Order Online' });
      expect(title).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should have responsive padding on main card', () => {
      const { container } = render(<OrderSection />);
      const card = container.querySelector('.bg-white.rounded-2xl');
      expect(card).toHaveClass('p-8', 'md:p-12');
    });

    it('should have responsive grid for feature cards', () => {
      const { container } = render(<OrderSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-3');
    });

    it('should have responsive button layout', () => {
      const { container } = render(<OrderSection />);
      const buttonContainer = container.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('gap-4');
    });
  });

  describe('Button Styling', () => {
    it('should style Square button correctly', () => {
      render(<OrderSection />);
      const squareButton = screen.getByRole('link', { name: 'Order via Square' });
      expect(squareButton).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'px-8',
        'py-3',
        'bg-green-600',
        'text-white',
        'rounded-full',
        'hover:bg-green-700',
        'transition-colors'
      );
    });

    it('should style Call button correctly', () => {
      render(<OrderSection />);
      const callButton = screen.getByRole('link', { name: 'Call to Order' });
      expect(callButton).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'px-8',
        'py-3',
        'bg-blue-600',
        'text-white',
        'rounded-full',
        'hover:bg-blue-700',
        'transition-colors'
      );
    });
  });

  describe('Typography', () => {
    it('should apply correct title styling', () => {
      render(<OrderSection />);
      const title = screen.getByRole('heading', { name: 'Order Online' });
      expect(title).toHaveClass('font-light', 'text-center', 'mb-12', 'text-gray-900');
    });

    it('should style description text correctly', () => {
      render(<OrderSection />);
      const description = screen.getByText('Fresh baked goods and artisanal sandwiches delivered to your door');
      expect(description).toHaveClass('text-lg', 'text-gray-600', 'mb-6');
    });

    it('should style partner text correctly', () => {
      render(<OrderSection />);
      const partnerText = screen.getByText('Order directly through our partners');
      expect(partnerText).toHaveClass('text-sm', 'text-gray-500', 'mb-4');
    });

    it('should style feature card titles correctly', () => {
      render(<OrderSection />);
      const featureTitles = [
        screen.getByRole('heading', { name: 'Quick Pickup' }),
        screen.getByRole('heading', { name: 'Fresh Daily' }),
        screen.getByRole('heading', { name: 'Best Value' })
      ];
      featureTitles.forEach(title => {
        expect(title).toHaveClass('font-semibold', 'text-gray-900', 'mb-2');
      });
    });

    it('should style feature card descriptions correctly', () => {
      render(<OrderSection />);
      const descriptions = [
        screen.getByText('Ready in 15-20 minutes'),
        screen.getByText('Made with finest ingredients'),
        screen.getByText('Quality at fair prices')
      ];
      descriptions.forEach(desc => {
        expect(desc).toHaveClass('text-sm', 'text-gray-600');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<OrderSection />);
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Order Online' });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings).toHaveLength(3);
    });

    it('should have accessible links', () => {
      render(<OrderSection />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('should have proper rel attributes for external links', () => {
      render(<OrderSection />);
      const externalLink = screen.getByRole('link', { name: 'Order via Square' });
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<OrderSection />);
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelectorAll('h3')).toHaveLength(3);
    });
  });

  describe('Icon Backgrounds', () => {
    it('should have correct background colors for icons', () => {
      const { container } = render(<OrderSection />);
      expect(container.querySelector('.bg-blue-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-green-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-purple-100')).toBeInTheDocument();
    });

    it('should center icons in circular backgrounds', () => {
      const { container } = render(<OrderSection />);
      const iconContainers = container.querySelectorAll('.w-12.h-12.rounded-full');
      expect(iconContainers).toHaveLength(3);
      iconContainers.forEach(container => {
        expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'mx-auto');
      });
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct phone number', () => {
      render(<OrderSection />);
      const callLink = screen.getByRole('link', { name: 'Call to Order' });
      expect(callLink).toHaveAttribute('href', 'tel:6464541387');
    });

    it('should display correct Square URL', () => {
      render(<OrderSection />);
      const squareLink = screen.getByRole('link', { name: 'Order via Square' });
      expect(squareLink).toHaveAttribute('href', 'https://pav-108819.square.site');
    });
  });
});