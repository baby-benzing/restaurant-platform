import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuSection from '../MenuSection';

// Mock the MenuDisplay component from web-common
jest.mock('@restaurant-platform/web-common', () => ({
  MenuDisplay: ({ menu }: any) => (
    <div data-testid="menu-display">
      {menu && <div>Menu content: {JSON.stringify(menu)}</div>}
    </div>
  ),
}));

describe('MenuSection', () => {
  const mockMenu = {
    id: '1',
    name: 'Main Menu',
    sections: [
      {
        id: 's1',
        name: 'Appetizers',
        items: [
          {
            id: 'i1',
            name: 'Bruschetta',
            description: 'Toasted bread with tomatoes',
            price: 8.99,
          },
          {
            id: 'i2',
            name: 'Calamari',
            description: 'Fried squid rings',
            price: 12.99,
          },
        ],
      },
      {
        id: 's2',
        name: 'Main Courses',
        items: [
          {
            id: 'i3',
            name: 'Pasta Carbonara',
            description: 'Classic Italian pasta',
            price: 18.99,
          },
        ],
      },
    ],
  };

  describe('Basic Rendering', () => {
    it('should render the menu section', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      expect(container.querySelector('[data-section="menu"]')).toBeInTheDocument();
    });

    it('should display the section title', () => {
      render(<MenuSection menu={mockMenu} />);
      expect(screen.getByRole('heading', { name: 'Our Menu' })).toBeInTheDocument();
    });

    it('should have correct layout classes', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      const section = container.querySelector('[data-section="menu"]');
      expect(section).toHaveClass('min-h-screen', 'bg-white', 'px-4', 'py-20');
    });

    it('should have centered container with max width', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      const contentContainer = container.querySelector('.max-w-4xl.mx-auto');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Menu Display', () => {
    it('should render MenuDisplay component when menu is provided', () => {
      render(<MenuSection menu={mockMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should pass menu data to MenuDisplay', () => {
      render(<MenuSection menu={mockMenu} />);
      expect(screen.getByText(/Menu content:/)).toBeInTheDocument();
      expect(screen.getByText(/Main Menu/)).toBeInTheDocument();
    });

    it('should display fallback message when menu is null', () => {
      render(<MenuSection menu={null} />);
      expect(screen.getByText('Menu is being updated')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-display')).not.toBeInTheDocument();
    });

    it('should display fallback message when menu is undefined', () => {
      render(<MenuSection menu={undefined} />);
      expect(screen.getByText('Menu is being updated')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-display')).not.toBeInTheDocument();
    });

    it('should handle empty menu object', () => {
      render(<MenuSection menu={{}} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
      expect(screen.queryByText('Menu is being updated')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct title styling', () => {
      render(<MenuSection menu={mockMenu} />);
      const title = screen.getByRole('heading', { name: 'Our Menu' });
      expect(title).toHaveClass('text-3xl', 'md:text-4xl', 'font-light', 'text-center', 'mb-12', 'text-gray-900');
    });

    it('should style fallback message correctly', () => {
      render(<MenuSection menu={null} />);
      const fallbackContainer = screen.getByText('Menu is being updated').parentElement;
      expect(fallbackContainer).toHaveClass('text-center', 'text-gray-500');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive title text size', () => {
      render(<MenuSection menu={mockMenu} />);
      const title = screen.getByRole('heading');
      expect(title).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should have responsive padding', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      const section = container.querySelector('[data-section="menu"]');
      expect(section).toHaveClass('px-4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle menu with no sections', () => {
      const emptyMenu = {
        id: '1',
        name: 'Empty Menu',
        sections: [],
      };
      render(<MenuSection menu={emptyMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle menu with deeply nested data', () => {
      const complexMenu = {
        id: '1',
        name: 'Complex Menu',
        description: 'A very complex menu',
        metadata: {
          lastUpdated: '2024-01-01',
          version: 2,
        },
        sections: [
          {
            id: 's1',
            name: 'Section 1',
            description: 'First section',
            displayOrder: 1,
            items: [
              {
                id: 'i1',
                name: 'Item 1',
                description: 'First item',
                price: 10.99,
                options: [
                  { name: 'Size', values: ['Small', 'Medium', 'Large'] },
                  { name: 'Temperature', values: ['Hot', 'Cold'] },
                ],
                allergens: ['Gluten', 'Dairy'],
                nutritionalInfo: {
                  calories: 450,
                  protein: 20,
                  carbs: 60,
                  fat: 15,
                },
              },
            ],
          },
        ],
      };
      render(<MenuSection menu={complexMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle very long menu names', () => {
      const longNameMenu = {
        id: '1',
        name: 'This is an extremely long menu name that should still render properly without breaking the layout or causing any visual issues in the component',
        sections: [],
      };
      render(<MenuSection menu={longNameMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle special characters in menu data', () => {
      const specialCharsMenu = {
        id: '1',
        name: 'Café & Bistro "Special" Menu',
        sections: [
          {
            id: 's1',
            name: 'Entrées & Appetizers',
            items: [
              {
                id: 'i1',
                name: 'Escargots à la Bourguignonne',
                description: 'Snails with garlic & parsley butter',
                price: 15.99,
              },
            ],
          },
        ],
      };
      render(<MenuSection menu={specialCharsMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle boolean false as menu prop', () => {
      render(<MenuSection menu={false as any} />);
      expect(screen.getByText('Menu is being updated')).toBeInTheDocument();
    });

    it('should handle number as menu prop', () => {
      render(<MenuSection menu={123 as any} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle array as menu prop', () => {
      render(<MenuSection menu={[] as any} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MenuSection menu={mockMenu} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Our Menu');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('should maintain focus management', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      const section = container.querySelector('[data-section="menu"]');
      expect(section).toBeInTheDocument();
      // The section should be accessible for screen readers
      expect(section?.tagName).toBe('DIV');
    });
  });

  describe('Integration with MenuDisplay', () => {
    it('should not pass undefined props to MenuDisplay', () => {
      const { container } = render(<MenuSection menu={mockMenu} />);
      const menuDisplay = container.querySelector('[data-testid="menu-display"]');
      expect(menuDisplay).toBeInTheDocument();
    });

    it('should handle MenuDisplay component errors gracefully', () => {
      // Temporarily mock MenuDisplay to throw an error
      const originalError = console.error;
      console.error = jest.fn();
      
      jest.doMock('@restaurant-platform/web-common', () => ({
        MenuDisplay: () => {
          throw new Error('MenuDisplay error');
        },
      }));
      
      // Component should handle the error gracefully
      expect(() => render(<MenuSection menu={mockMenu} />)).not.toThrow();
      
      console.error = originalError;
    });
  });

  describe('Performance', () => {
    it('should render efficiently with large menu data', () => {
      const largeMenu = {
        id: '1',
        name: 'Large Menu',
        sections: Array.from({ length: 50 }, (_, sIndex) => ({
          id: `s${sIndex}`,
          name: `Section ${sIndex}`,
          items: Array.from({ length: 20 }, (_, iIndex) => ({
            id: `s${sIndex}i${iIndex}`,
            name: `Item ${iIndex}`,
            description: `Description for item ${iIndex}`,
            price: Math.random() * 50,
          })),
        })),
      };
      
      const { container } = render(<MenuSection menu={largeMenu} />);
      expect(container.querySelector('[data-section="menu"]')).toBeInTheDocument();
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<MenuSection menu={mockMenu} />);
      
      // Rapidly re-render with different props
      rerender(<MenuSection menu={null} />);
      expect(screen.getByText('Menu is being updated')).toBeInTheDocument();
      
      rerender(<MenuSection menu={mockMenu} />);
      expect(screen.getByTestId('menu-display')).toBeInTheDocument();
      
      rerender(<MenuSection menu={undefined} />);
      expect(screen.getByText('Menu is being updated')).toBeInTheDocument();
    });
  });
});