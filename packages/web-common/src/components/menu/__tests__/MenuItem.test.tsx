import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MenuItem } from '../MenuItem';

describe('MenuItem', () => {
  const mockItem = {
    id: '1',
    name: 'French Onion Soup',
    description: 'Classic soup with melted Gruyère cheese',
    price: 12,
    isAvailable: true,
  };

  it('should render item name', () => {
    render(<MenuItem item={mockItem} />);
    expect(screen.getByText('French Onion Soup')).toBeInTheDocument();
  });

  it('should render item description', () => {
    render(<MenuItem item={mockItem} />);
    expect(screen.getByText('Classic soup with melted Gruyère cheese')).toBeInTheDocument();
  });

  it('should format and display price', () => {
    render(<MenuItem item={mockItem} />);
    expect(screen.getByText('$12')).toBeInTheDocument();
  });

  it('should handle null price', () => {
    const itemWithoutPrice = { ...mockItem, price: null };
    render(<MenuItem item={itemWithoutPrice} />);
    
    const priceElements = screen.queryAllByText(/\$/);
    expect(priceElements).toHaveLength(0);
  });

  it('should show unavailable state', () => {
    const unavailableItem = { ...mockItem, isAvailable: false };
    const { container } = render(<MenuItem item={unavailableItem} />);
    
    expect(container.firstChild).toHaveClass('opacity-50');
    expect(screen.getByText('(Currently Unavailable)')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MenuItem item={mockItem} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper layout structure', () => {
    const { container } = render(<MenuItem item={mockItem} />);
    
    const element = container.firstChild;
    expect(element).toHaveClass('flex', 'justify-between');
  });

  it('should handle long descriptions gracefully', () => {
    const longDescItem = {
      ...mockItem,
      description: 'A very long description that goes on and on and on and contains many words to test how the component handles lengthy text content',
    };
    
    render(<MenuItem item={longDescItem} />);
    const description = screen.getByText(longDescItem.description);
    expect(description).toBeInTheDocument();
  });

  it('should display price with proper formatting for decimals', () => {
    const itemWithDecimals = { ...mockItem, price: 12.50 };
    render(<MenuItem item={itemWithDecimals} />);
    expect(screen.getByText('$12.50')).toBeInTheDocument();
  });
});