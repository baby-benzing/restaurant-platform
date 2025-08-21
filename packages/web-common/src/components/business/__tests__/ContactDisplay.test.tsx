import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContactDisplay, ContactDisplayProps } from '../ContactDisplay';

describe('ContactDisplay', () => {
  const mockData: ContactDisplayProps['data'] = {
    address: {
      street: '123 Main St',
      street2: 'Suite 100',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
    },
    phone: '4155551234',
    email: 'info@restaurant.com',
    socialMedia: {
      instagram: 'https://instagram.com/restaurant',
      facebook: 'https://facebook.com/restaurant',
      twitter: 'https://twitter.com/restaurant',
    },
    reservations: {
      provider: 'Resy',
      url: 'https://resy.com/restaurant',
      phone: '4155555678',
    },
  };

  describe('Error Handling', () => {
    it('should handle undefined data gracefully', () => {
      render(<ContactDisplay data={undefined as any} />);
      expect(screen.getByText('Contact information not available')).toBeInTheDocument();
    });

    it('should handle null data gracefully', () => {
      render(<ContactDisplay data={null as any} />);
      expect(screen.getByText('Contact information not available')).toBeInTheDocument();
    });

    it('should not crash when data properties are undefined', () => {
      const partialData = { phone: '4155551234' };
      const { container } = render(<ContactDisplay data={partialData} />);
      expect(container.querySelector('.contact-display')).toBeInTheDocument();
      expect(screen.getByText('(415) 555-1234')).toBeInTheDocument();
    });
  });

  describe('Address Display', () => {
    it('should display full address when provided', () => {
      render(<ContactDisplay data={mockData} />);
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Suite 100')).toBeInTheDocument();
      expect(screen.getByText('San Francisco, CA 94105')).toBeInTheDocument();
      expect(screen.getByText('USA')).toBeInTheDocument();
    });

    it('should handle address without street2', () => {
      const dataWithoutStreet2 = {
        address: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
        },
      };
      render(<ContactDisplay data={dataWithoutStreet2} />);
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.queryByText('Suite 100')).not.toBeInTheDocument();
    });

    it('should not display address when showAddress is false', () => {
      render(<ContactDisplay data={mockData} showAddress={false} />);
      expect(screen.queryByText('123 Main St')).not.toBeInTheDocument();
    });

    it('should display map link when showMap is true and mapUrl provided', () => {
      render(
        <ContactDisplay 
          data={mockData} 
          showMap={true} 
          mapUrl="https://maps.google.com/restaurant"
        />
      );
      const mapLink = screen.getByText('View on Map →');
      expect(mapLink).toHaveAttribute('href', 'https://maps.google.com/restaurant');
      expect(mapLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Phone Display', () => {
    it('should format phone number correctly', () => {
      render(<ContactDisplay data={mockData} />);
      const phoneLink = screen.getByText('(415) 555-1234');
      expect(phoneLink).toHaveAttribute('href', 'tel:4155551234');
    });

    it('should handle phone number with non-numeric characters', () => {
      const dataWithFormattedPhone = {
        phone: '+1 (415) 555-1234',
      };
      render(<ContactDisplay data={dataWithFormattedPhone} />);
      const phoneLink = screen.getByText('(415) 555-1234');
      expect(phoneLink).toHaveAttribute('href', 'tel:14155551234');
    });

    it('should display unformatted phone for non-10-digit numbers', () => {
      const dataWithInternationalPhone = {
        phone: '+44 20 7123 4567',
      };
      render(<ContactDisplay data={dataWithInternationalPhone} />);
      expect(screen.getByText('+44 20 7123 4567')).toBeInTheDocument();
    });

    it('should not display phone when showPhone is false', () => {
      render(<ContactDisplay data={mockData} showPhone={false} />);
      expect(screen.queryByText('(415) 555-1234')).not.toBeInTheDocument();
    });
  });

  describe('Email Display', () => {
    it('should display email with mailto link', () => {
      render(<ContactDisplay data={mockData} />);
      const emailLink = screen.getByText('info@restaurant.com');
      expect(emailLink).toHaveAttribute('href', 'mailto:info@restaurant.com');
    });

    it('should not display email when showEmail is false', () => {
      render(<ContactDisplay data={mockData} showEmail={false} />);
      expect(screen.queryByText('info@restaurant.com')).not.toBeInTheDocument();
    });
  });

  describe('Social Media Display', () => {
    it('should display social media icons', () => {
      render(<ContactDisplay data={mockData} />);
      const instagramLink = screen.getByLabelText('Instagram');
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/restaurant');
      expect(instagramLink).toHaveAttribute('target', '_blank');
    });

    it('should not display social media when showSocial is false', () => {
      render(<ContactDisplay data={mockData} showSocial={false} />);
      expect(screen.queryByLabelText('Instagram')).not.toBeInTheDocument();
    });

    it('should handle empty social media object', () => {
      const dataWithEmptySocial = {
        socialMedia: {},
      };
      render(<ContactDisplay data={dataWithEmptySocial} />);
      expect(screen.queryByText('Follow Us')).not.toBeInTheDocument();
    });

    it('should only display social media platforms with URLs', () => {
      const dataWithPartialSocial = {
        socialMedia: {
          instagram: 'https://instagram.com/restaurant',
          facebook: undefined,
          twitter: '',
        },
      };
      render(<ContactDisplay data={dataWithPartialSocial} />);
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
      expect(screen.queryByLabelText('Facebook')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Twitter')).not.toBeInTheDocument();
    });
  });

  describe('Reservations Display', () => {
    it('should display reservation button with provider', () => {
      render(<ContactDisplay data={mockData} />);
      expect(screen.getByText('Reserve on Resy')).toBeInTheDocument();
    });

    it('should display reservation phone number', () => {
      render(<ContactDisplay data={mockData} />);
      expect(screen.getByText('(415) 555-5678')).toBeInTheDocument();
    });

    it('should not display reservations when showReservations is false', () => {
      render(<ContactDisplay data={mockData} showReservations={false} />);
      expect(screen.queryByText('Reserve on Resy')).not.toBeInTheDocument();
    });

    it('should display generic text when provider is not specified', () => {
      const dataWithoutProvider = {
        reservations: {
          url: 'https://reservations.com',
        },
      };
      render(<ContactDisplay data={dataWithoutProvider} />);
      expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render compact variant without headers', () => {
      render(<ContactDisplay data={mockData} variant="compact" />);
      expect(screen.queryByText('Address')).not.toBeInTheDocument();
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    it('should render footer variant with grid layout', () => {
      const { container } = render(<ContactDisplay data={mockData} variant="footer" />);
      const displayDiv = container.querySelector('.contact-display');
      expect(displayDiv).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('should render detailed variant with spacing', () => {
      const { container } = render(<ContactDisplay data={mockData} variant="detailed" />);
      const displayDiv = container.querySelector('.contact-display');
      expect(displayDiv).toHaveClass('space-y-4');
    });
  });

  describe('Custom Class Names', () => {
    it('should apply custom className to root element', () => {
      const { container } = render(
        <ContactDisplay data={mockData} className="custom-class" />
      );
      expect(container.querySelector('.contact-display')).toHaveClass('custom-class');
    });

    it('should apply custom addressClassName', () => {
      const { container } = render(
        <ContactDisplay data={mockData} addressClassName="custom-address" />
      );
      expect(container.querySelector('.contact-address')).toHaveClass('custom-address');
    });

    it('should apply custom socialClassName', () => {
      const { container } = render(
        <ContactDisplay data={mockData} socialClassName="custom-social" />
      );
      expect(container.querySelector('.contact-social')).toHaveClass('custom-social');
    });
  });

  describe('Accessibility', () => {
    it('should use semantic address element', () => {
      const { container } = render(<ContactDisplay data={mockData} />);
      expect(container.querySelector('address')).toBeInTheDocument();
    });

    it('should have proper aria-labels for social links', () => {
      render(<ContactDisplay data={mockData} />);
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    });

    it('should have rel="noopener noreferrer" on external links', () => {
      render(<ContactDisplay data={mockData} />);
      const externalLinks = screen.getAllByRole('link', { target: { target: '_blank' } });
      externalLinks.forEach(link => {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });
  });
});