import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MenuSection } from '../MenuSection';

describe('MenuSection', () => {
  const mockSection = {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal with these delicious options',
    items: [
      {
        id: '1',
        name: 'French Onion Soup',
        description: 'Classic soup with melted Gruyère cheese',
        price: 12,
        isAvailable: true,
      },
      {
        id: '2',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons',
        price: 10,
        isAvailable: true,
      },
    ],
  };

  it('should render section name', () => {
    render(<MenuSection section={mockSection} />);
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
  });

  it('should render section description when provided', () => {
    render(<MenuSection section={mockSection} />);
    expect(screen.getByText('Start your meal with these delicious options')).toBeInTheDocument();
  });

  it('should render all menu items', () => {
    render(<MenuSection section={mockSection} />);
    expect(screen.getByText('French Onion Soup')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
  });

  it('should handle section without description', () => {
    const sectionWithoutDesc = { ...mockSection, description: null };
    render(<MenuSection section={sectionWithoutDesc} />);
    
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.queryByText('Start your meal with these delicious options')).not.toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    const emptySection = { ...mockSection, items: [] };
    render(<MenuSection section={emptySection} />);
    
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MenuSection section={mockSection} className="custom-section" />
    );
    
    expect(container.firstChild).toHaveClass('custom-section');
  });

  it('should have proper heading hierarchy', () => {
    render(<MenuSection section={mockSection} />);
    
    const heading = screen.getByRole('heading', { name: 'Appetizers' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('should render with custom heading level', () => {
    render(<MenuSection section={mockSection} headingLevel="h2" />);
    
    const heading = screen.getByRole('heading', { name: 'Appetizers' });
    expect(heading.tagName).toBe('H2');
  });

  it('should filter out unavailable items when hideUnavailable is true', () => {
    const sectionWithUnavailable = {
      ...mockSection,
      items: [
        ...mockSection.items,
        {
          id: '3',
          name: 'Unavailable Item',
          description: 'This item is not available',
          price: 15,
          isAvailable: false,
        },
      ],
    };
    
    render(<MenuSection section={sectionWithUnavailable} hideUnavailable />);
    
    expect(screen.getByText('French Onion Soup')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.queryByText('Unavailable Item')).not.toBeInTheDocument();
  });
});