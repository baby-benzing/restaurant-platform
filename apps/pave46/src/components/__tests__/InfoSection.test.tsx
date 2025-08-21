import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoSection from '../InfoSection';

// Mock the components from web-common
jest.mock('@restaurant-platform/web-common', () => ({
  HoursDisplay: ({ hours }: any) => (
    <div data-testid="hours-display">
      Hours: {JSON.stringify(hours)}
    </div>
  ),
  ContactDisplay: ({ contacts }: any) => (
    <div data-testid="contact-display">
      Contacts: {JSON.stringify(contacts)}
    </div>
  ),
}));

describe('InfoSection', () => {
  const mockRestaurant = {
    hours: [
      { dayOfWeek: 0, openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00' },
    ],
    contacts: [
      { type: 'phone', value: '6464541387' },
      { type: 'email', value: 'pavenyc@gmail.com' },
    ],
  };

  describe('Basic Rendering', () => {
    it('should render the info section', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      expect(container.querySelector('[data-section="info"]')).toBeInTheDocument();
    });

    it('should display the main title', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByRole('heading', { name: 'Information' })).toBeInTheDocument();
    });

    it('should display all section headings', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByRole('heading', { name: 'About Pavé' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Hours' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Visit Us' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Follow Us' })).toBeInTheDocument();
    });
  });

  describe('About Section', () => {
    it('should display the about text', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText(/Welcome to Pavé, your neighborhood French bakery/)).toBeInTheDocument();
      expect(screen.getByText(/Every morning, our skilled bakers start before dawn/)).toBeInTheDocument();
    });

    it('should escape apostrophes correctly', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const text = screen.getByText(/Whether you're looking for a quick breakfast/);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Hours Section', () => {
    it('should render HoursDisplay when hours are provided', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByTestId('hours-display')).toBeInTheDocument();
    });

    it('should pass hours data to HoursDisplay', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText(/dayOfWeek.*0/)).toBeInTheDocument();
    });

    it('should display loading message when hours are not provided', () => {
      render(<InfoSection restaurant={{ ...mockRestaurant, hours: null }} />);
      expect(screen.getByText('Loading hours...')).toBeInTheDocument();
    });

    it('should display closed on Saturday note', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText('Note: We are closed on Saturdays')).toBeInTheDocument();
    });
  });

  describe('Contact Section', () => {
    it('should render ContactDisplay when contacts are provided', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByTestId('contact-display')).toBeInTheDocument();
    });

    it('should display fallback contact info when contacts are not provided', () => {
      render(<InfoSection restaurant={{ ...mockRestaurant, contacts: null }} />);
      const phoneLink = screen.getByRole('link', { name: '(646) 454-1387' });
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', 'tel:6464541387');
      
      const emailLink = screen.getByRole('link', { name: 'pavenyc@gmail.com' });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:pavenyc@gmail.com');
    });

    it('should render contact icons', () => {
      const { container } = render(<InfoSection restaurant={{ ...mockRestaurant, contacts: null }} />);
      const svgIcons = container.querySelectorAll('.text-gray-400');
      expect(svgIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Location Section', () => {
    it('should display the restaurant name', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText('Pavé')).toBeInTheDocument();
    });

    it('should display the full address', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText(/511 10th Avenue/)).toBeInTheDocument();
      expect(screen.getByText(/New York, NY 10018/)).toBeInTheDocument();
      expect(screen.getByText(/Midtown Manhattan/)).toBeInTheDocument();
    });

    it('should display get directions link', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const directionsLink = screen.getByRole('link', { name: /Get Directions/i });
      expect(directionsLink).toBeInTheDocument();
      expect(directionsLink).toHaveAttribute('href', 'https://maps.google.com/?q=511+10th+Avenue+New+York+NY+10018');
      expect(directionsLink).toHaveAttribute('target', '_blank');
      expect(directionsLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display transportation info', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      expect(screen.getByText('Quick Access')).toBeInTheDocument();
      expect(screen.getByText('2 minute walk from 42nd St - Port Authority')).toBeInTheDocument();
      expect(screen.getByText('Convenient Location')).toBeInTheDocument();
      expect(screen.getByText(/Near Hell's Kitchen & Times Square/)).toBeInTheDocument();
    });
  });

  describe('Social Media Section', () => {
    it('should display Instagram link', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const instagramLink = screen.getByRole('link', { name: /@pave_nyc/i });
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/pave_nyc');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display Instagram icon', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const instagramSvg = container.querySelector('svg path[d*="M12 2.163c3.204"]');
      expect(instagramSvg).toBeInTheDocument();
    });

    it('should have gradient background on Instagram button', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const instagramButton = screen.getByRole('link', { name: /@pave_nyc/i });
      expect(instagramButton).toHaveClass('bg-gradient-to-r', 'from-purple-600', 'to-pink-600');
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct section background', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const section = container.querySelector('[data-section="info"]');
      expect(section).toHaveClass('min-h-screen', 'bg-white', 'px-4', 'py-20');
    });

    it('should have centered content container', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const contentContainer = container.querySelector('.max-w-4xl.mx-auto');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have grid layout for hours and contact', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const grid = container.querySelector('.grid.md\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should have styled cards for hours and contact', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const cards = container.querySelectorAll('.bg-gray-50.rounded-2xl.p-8');
      expect(cards).toHaveLength(2);
    });

    it('should have gradient background for location card', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const locationCard = container.querySelector('.bg-gradient-to-br.from-blue-50.to-indigo-50');
      expect(locationCard).toBeInTheDocument();
    });

    it('should have yellow background for Saturday note', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const note = container.querySelector('.bg-yellow-100');
      expect(note).toBeInTheDocument();
      expect(note).toHaveClass('rounded-lg');
    });
  });

  describe('Typography', () => {
    it('should apply correct title styling', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const mainTitle = screen.getByRole('heading', { name: 'Information' });
      expect(mainTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-light', 'text-center', 'mb-12', 'text-gray-900');
    });

    it('should apply correct section heading styling', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const aboutHeading = screen.getByRole('heading', { name: 'About Pavé' });
      expect(aboutHeading).toHaveClass('text-2xl', 'font-light', 'mb-6', 'text-gray-900');
    });

    it('should apply prose styling to about text', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const proseDiv = container.querySelector('.prose.prose-lg');
      expect(proseDiv).toBeInTheDocument();
      expect(proseDiv).toHaveClass('max-w-none', 'text-gray-600');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive title text size', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const title = screen.getByRole('heading', { name: 'Information' });
      expect(title).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should have responsive grid for hours and contact', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Icons', () => {
    it('should render phone icon', () => {
      const { container } = render(<InfoSection restaurant={{ ...mockRestaurant, contacts: null }} />);
      const phoneIcon = container.querySelector('path[d*="M3 5a2 2"]');
      expect(phoneIcon).toBeInTheDocument();
    });

    it('should render email icon', () => {
      const { container } = render(<InfoSection restaurant={{ ...mockRestaurant, contacts: null }} />);
      const emailIcon = container.querySelector('path[d*="M3 8l7.89"]');
      expect(emailIcon).toBeInTheDocument();
    });

    it('should render location icon', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const locationIcon = container.querySelector('path[d*="M17.657 16.657"]');
      expect(locationIcon).toBeInTheDocument();
    });

    it('should render clock icon', () => {
      const { container } = render(<InfoSection restaurant={mockRestaurant} />);
      const clockIcon = container.querySelector('path[d*="M12 8v4l3"]');
      expect(clockIcon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined restaurant prop', () => {
      render(<InfoSection restaurant={undefined as any} />);
      expect(screen.getByText('Loading hours...')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '(646) 454-1387' })).toBeInTheDocument();
    });

    it('should handle null restaurant prop', () => {
      render(<InfoSection restaurant={null as any} />);
      expect(screen.getByText('Loading hours...')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'pavenyc@gmail.com' })).toBeInTheDocument();
    });

    it('should handle empty restaurant object', () => {
      render(<InfoSection restaurant={{}} />);
      expect(screen.getByText('Loading hours...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Information');
      
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have accessible links', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('should have proper rel attributes for external links', () => {
      render(<InfoSection restaurant={mockRestaurant} />);
      const externalLinks = screen.getAllByRole('link');
      externalLinks.forEach(link => {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });
  });
});