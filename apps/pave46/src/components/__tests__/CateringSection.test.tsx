import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CateringSection from '../CateringSection';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChefHat: ({ className }: any) => <div data-testid="chef-hat-icon" className={className}>ChefHat</div>,
  Users: ({ className }: any) => <div data-testid="users-icon" className={className}>Users</div>,
  Calendar: ({ className }: any) => <div data-testid="calendar-icon" className={className}>Calendar</div>,
  Package: ({ className }: any) => <div data-testid="package-icon" className={className}>Package</div>,
}));

// Mock fetch
global.fetch = jest.fn();

describe('CateringSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the catering section', () => {
      const { container } = render(<CateringSection />);
      expect(container.querySelector('[data-section="catering"]')).toBeInTheDocument();
    });

    it('should display the main title', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Catering Services' })).toBeInTheDocument();
    });

    it('should display the subtitle', () => {
      render(<CateringSection />);
      expect(screen.getByText('Let us bring the authentic taste of Paris to your next event')).toBeInTheDocument();
    });
  });

  describe('Service Cards', () => {
    it('should display all four service cards', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Corporate Events' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Private Parties' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Social Events' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Custom Menus' })).toBeInTheDocument();
    });

    it('should display service descriptions', () => {
      render(<CateringSection />);
      expect(screen.getByText('Breakfast meetings, lunch presentations, and office parties')).toBeInTheDocument();
      expect(screen.getByText('Birthday celebrations, anniversaries, and special occasions')).toBeInTheDocument();
      expect(screen.getByText('Cocktail parties, receptions, and networking events')).toBeInTheDocument();
      expect(screen.getByText('Tailored menus to match your specific needs and preferences')).toBeInTheDocument();
    });

    it('should render service icons', () => {
      render(<CateringSection />);
      expect(screen.getByTestId('chef-hat-icon')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByTestId('package-icon')).toBeInTheDocument();
    });

    it('should apply correct icon colors', () => {
      render(<CateringSection />);
      expect(screen.getByTestId('chef-hat-icon')).toHaveClass('text-blue-600');
      expect(screen.getByTestId('users-icon')).toHaveClass('text-green-600');
      expect(screen.getByTestId('calendar-icon')).toHaveClass('text-purple-600');
      expect(screen.getByTestId('package-icon')).toHaveClass('text-orange-600');
    });
  });

  describe('Catering Menu', () => {
    it('should display menu section title', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Our Catering Menu' })).toBeInTheDocument();
    });

    it('should display breakfast & brunch items', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Breakfast & Brunch' })).toBeInTheDocument();
      expect(screen.getByText('• Fresh baked croissants and pastries')).toBeInTheDocument();
      expect(screen.getByText('• Artisanal breakfast sandwiches')).toBeInTheDocument();
      expect(screen.getByText('• French toast and quiche selections')).toBeInTheDocument();
    });

    it('should display lunch & dinner items', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Lunch & Dinner' })).toBeInTheDocument();
      expect(screen.getByText('• Gourmet sandwich platters')).toBeInTheDocument();
      expect(screen.getByText('• Fresh salad trays')).toBeInTheDocument();
      expect(screen.getByText('• Charcuterie and cheese boards')).toBeInTheDocument();
    });

    it('should display menu notes', () => {
      render(<CateringSection />);
      expect(screen.getByText('* Custom menus available. Minimum order requirements apply. 48-hour advance notice required.')).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    it('should display form title', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Request Catering Quote' })).toBeInTheDocument();
    });

    it('should display all form sections', () => {
      render(<CateringSection />);
      expect(screen.getByRole('heading', { name: 'Contact Information' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Event Details' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Location & Delivery' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Additional Information' })).toBeInTheDocument();
    });

    it('should render all required input fields', () => {
      render(<CateringSection />);
      expect(screen.getByPlaceholderText('Your Name *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Number of Guests *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Address *')).toBeInTheDocument();
    });

    it('should render optional input fields', () => {
      render(<CateringSection />);
      expect(screen.getByPlaceholderText('Company (Optional)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Venue Name (Optional)')).toBeInTheDocument();
    });

    it('should render select dropdowns', () => {
      render(<CateringSection />);
      expect(screen.getByRole('combobox', { name: /event time/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Select Event Type')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Delivery')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Select Budget Range (Optional)')).toBeInTheDocument();
    });

    it('should render textarea for message', () => {
      render(<CateringSection />);
      expect(screen.getByPlaceholderText(/Tell us about your event/)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<CateringSection />);
      expect(screen.getByRole('button', { name: 'Submit Catering Request' })).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update input values on change', () => {
      render(<CateringSection />);
      const nameInput = screen.getByPlaceholderText('Your Name *') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      expect(nameInput.value).toBe('John Doe');
    });

    it('should update select values on change', () => {
      render(<CateringSection />);
      const eventTypeSelect = screen.getByDisplayValue('Select Event Type') as HTMLSelectElement;
      fireEvent.change(eventTypeSelect, { target: { value: 'corporate' } });
      expect(eventTypeSelect.value).toBe('corporate');
    });

    it('should update textarea value on change', () => {
      render(<CateringSection />);
      const messageTextarea = screen.getByPlaceholderText(/Tell us about your event/) as HTMLTextAreaElement;
      fireEvent.change(messageTextarea, { target: { value: 'We need catering for 50 people' } });
      expect(messageTextarea.value).toBe('We need catering for 50 people');
    });

    it('should handle date input', () => {
      render(<CateringSection />);
      const dateInput = screen.getByDisplayValue('') as HTMLInputElement;
      fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
      expect(dateInput.value).toBe('2024-12-25');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with correct data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CateringSection />);
      
      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('Your Name *'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address *'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByPlaceholderText('Number of Guests *'), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText('Full Address *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/Tell us about your event/), { target: { value: 'Birthday party' } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Catering Request' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/catering/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('John Doe'),
        });
      });
    });

    it('should show success message on successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CateringSection />);
      
      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('Your Name *'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address *'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByPlaceholderText('Number of Guests *'), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText('Full Address *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/Tell us about your event/), { target: { value: 'Birthday party' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit Catering Request' }));

      await waitFor(() => {
        expect(screen.getByText("Thank you for your inquiry! We'll contact you within 24 hours.")).toBeInTheDocument();
      });
    });

    it('should show error message on failed submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<CateringSection />);
      
      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('Your Name *'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address *'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByPlaceholderText('Number of Guests *'), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText('Full Address *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/Tell us about your event/), { target: { value: 'Birthday party' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit Catering Request' }));

      await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again or call us at (646) 454-1387.')).toBeInTheDocument();
      });
    });

    it('should disable submit button while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
      );

      render(<CateringSection />);
      
      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('Your Name *'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address *'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByPlaceholderText('Number of Guests *'), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText('Full Address *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/Tell us about your event/), { target: { value: 'Birthday party' } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Catering Request' });
      fireEvent.click(submitButton);

      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    });

    it('should reset form after successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CateringSection />);
      
      const nameInput = screen.getByPlaceholderText('Your Name *') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address *'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByPlaceholderText('Number of Guests *'), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText('Full Address *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/Tell us about your event/), { target: { value: 'Birthday party' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit Catering Request' }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });
  });

  describe('Contact Alternative', () => {
    it('should display alternative contact text', () => {
      render(<CateringSection />);
      expect(screen.getByText('Prefer to speak with someone directly?')).toBeInTheDocument();
    });

    it('should display phone link', () => {
      render(<CateringSection />);
      const phoneLink = screen.getByRole('link', { name: /Call \(646\) 454-1387/i });
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', 'tel:6464541387');
    });

    it('should display email link', () => {
      render(<CateringSection />);
      const emailLink = screen.getByRole('link', { name: /Email Us/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:pavenyc@gmail.com');
    });
  });

  describe('Styling and Layout', () => {
    it('should have gradient background', () => {
      const { container } = render(<CateringSection />);
      const section = container.querySelector('[data-section="catering"]');
      expect(section).toHaveClass('bg-gradient-to-b', 'from-white', 'to-gray-50');
    });

    it('should have responsive grid for service cards', () => {
      const { container } = render(<CateringSection />);
      const grid = container.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });

    it('should style form card correctly', () => {
      const { container } = render(<CateringSection />);
      const formCard = container.querySelector('.bg-white.rounded-2xl.shadow-lg');
      expect(formCard).toBeInTheDocument();
    });

    it('should style menu info section', () => {
      const { container } = render(<CateringSection />);
      const menuSection = container.querySelector('.bg-blue-50.rounded-2xl');
      expect(menuSection).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require name field', () => {
      render(<CateringSection />);
      const nameInput = screen.getByPlaceholderText('Your Name *');
      expect(nameInput).toHaveAttribute('required');
    });

    it('should require email field', () => {
      render(<CateringSection />);
      const emailInput = screen.getByPlaceholderText('Email Address *');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should require phone field', () => {
      render(<CateringSection />);
      const phoneInput = screen.getByPlaceholderText('Phone Number *');
      expect(phoneInput).toHaveAttribute('required');
      expect(phoneInput).toHaveAttribute('type', 'tel');
    });

    it('should require guest count with minimum value', () => {
      render(<CateringSection />);
      const guestInput = screen.getByPlaceholderText('Number of Guests *');
      expect(guestInput).toHaveAttribute('required');
      expect(guestInput).toHaveAttribute('min', '1');
      expect(guestInput).toHaveAttribute('type', 'number');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<CateringSection />);
      const h2 = screen.getByRole('heading', { level: 2, name: 'Catering Services' });
      expect(h2).toBeInTheDocument();
      
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
      
      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s.length).toBeGreaterThan(0);
    });

    it('should have accessible form labels', () => {
      render(<CateringSection />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('placeholder');
      });
    });

    it('should have accessible links', () => {
      render(<CateringSection />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });
  });
});