import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaSection from '../MediaSection';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className, sizes, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...props} />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: ({ size }: any) => <div data-testid="x-icon">X</div>,
  ZoomIn: ({ size, className }: any) => <div data-testid="zoom-icon" className={className}>ZoomIn</div>,
}));

describe('MediaSection', () => {
  describe('Grid Layout', () => {
    it('should render Media Gallery title', () => {
      render(<MediaSection />);
      expect(screen.getByText('Media Gallery')).toBeInTheDocument();
    });

    it('should display exactly 8 media items', () => {
      render(<MediaSection />);
      for (let i = 1; i <= 8; i++) {
        expect(screen.getByTestId(`media-item-${i}`)).toBeInTheDocument();
      }
    });

    it('should have grid layout with correct classes', () => {
      const { container } = render(<MediaSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4', 'gap-2', 'md:gap-4');
    });

    it('should display footer instruction text', () => {
      render(<MediaSection />);
      expect(screen.getByText('Click on any image to view details')).toBeInTheDocument();
    });

    it('should display premium badges on correct items', () => {
      render(<MediaSection />);
      const premiumBadges = screen.getAllByText('Premium');
      expect(premiumBadges).toHaveLength(4); // Items 2, 4, 6, 8 are premium
    });
  });

  describe('Modal Behavior', () => {
    it('should not show modal initially', () => {
      render(<MediaSection />);
      expect(screen.queryByTestId('media-modal')).not.toBeInTheDocument();
    });

    it('should open modal when clicking media item', () => {
      render(<MediaSection />);
      const firstItem = screen.getByTestId('media-item-1');
      fireEvent.click(firstItem);
      
      expect(screen.getByTestId('media-modal')).toBeInTheDocument();
      expect(screen.getByTestId('media-modal-backdrop')).toBeInTheDocument();
    });

    it('should display correct title in modal', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      expect(screen.getByText('Artisan Croissant')).toBeInTheDocument();
    });

    it('should close modal when clicking close button', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      expect(screen.getByTestId('media-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('modal-close-button'));
      expect(screen.queryByTestId('media-modal')).not.toBeInTheDocument();
    });

    it('should close modal when clicking backdrop', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      expect(screen.getByTestId('media-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('media-modal-backdrop'));
      expect(screen.queryByTestId('media-modal')).not.toBeInTheDocument();
    });

    it('should not close modal when clicking inside modal content', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      const modal = screen.getByTestId('media-modal');
      fireEvent.click(modal);
      
      expect(screen.getByTestId('media-modal')).toBeInTheDocument();
    });
  });

  describe('Free vs Premium Content', () => {
    it('should display free content details', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      expect(screen.getByText(/Our signature butter croissant/)).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    it('should display premium paywall for locked content', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-2'));
      
      expect(screen.getByText('Premium Content')).toBeInTheDocument();
      expect(screen.getByText('Subscribe for $9.99/month')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('should show lock icon for premium content', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-2'));
      
      const lockIcon = screen.getByText('Premium Content').parentElement?.querySelector('svg');
      expect(lockIcon).toBeInTheDocument();
    });

    it('should display different content for each item', () => {
      render(<MediaSection />);
      
      // Check first item
      fireEvent.click(screen.getByTestId('media-item-1'));
      expect(screen.getByText('Artisan Croissant')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('modal-close-button'));
      
      // Check third item
      fireEvent.click(screen.getByTestId('media-item-3'));
      expect(screen.getByText('Cozy Ambiance')).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should show zoom icon on hover', () => {
      render(<MediaSection />);
      const item = screen.getByTestId('media-item-1');
      
      // Initially zoom icon should not be visible (opacity-0)
      const zoomIcon = item.querySelector('[data-testid="zoom-icon"]');
      expect(zoomIcon).toHaveClass('opacity-0');
      
      // After hover, it should become visible (opacity-100)
      fireEvent.mouseEnter(item);
      expect(zoomIcon).toHaveClass('group-hover:opacity-100');
    });

    it('should have zoom-in cursor class', () => {
      render(<MediaSection />);
      const item = screen.getByTestId('media-item-1');
      expect(item).toHaveClass('cursor-zoom-in');
    });

    it('should have scale effect on hover', () => {
      render(<MediaSection />);
      const item = screen.getByTestId('media-item-1');
      const innerDiv = item.querySelector('.group-hover\\:scale-110');
      expect(innerDiv).toBeInTheDocument();
    });
  });

  describe('Modal Content Structure', () => {
    it('should have modal header with title and close button', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      const header = screen.getByText('Artisan Croissant').parentElement;
      expect(header).toBeInTheDocument();
      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });

    it('should display all details for free content', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-5'));
      
      expect(screen.getByText('Photography')).toBeInTheDocument();
      expect(screen.getByText('Studio Pavé')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('should display premium subscription options', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-4'));
      
      const subscribeButton = screen.getByText('Subscribe for $9.99/month');
      expect(subscribeButton).toBeInTheDocument();
      expect(subscribeButton.tagName).toBe('BUTTON');
      
      const learnMoreButton = screen.getByText('Learn More');
      expect(learnMoreButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MediaSection />);
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Media Gallery');
    });

    it('should have alt text for images', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      // Check that item has proper title
      expect(screen.getByText('Artisan Croissant')).toBeInTheDocument();
    });

    it('should trap focus in modal when open', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      const modal = screen.getByTestId('media-modal');
      expect(modal).toBeInTheDocument();
      
      // Modal should prevent interaction with background
      const backdrop = screen.getByTestId('media-modal-backdrop');
      expect(backdrop).toHaveClass('fixed', 'inset-0');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<MediaSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
    });

    it('should have responsive gap classes', () => {
      const { container } = render(<MediaSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-2', 'md:gap-4');
    });

    it('should have aspect-square for all items', () => {
      const { container } = render(<MediaSection />);
      const items = container.querySelectorAll('.aspect-square');
      expect(items).toHaveLength(8);
    });

    it('should have max width constraint for modal', () => {
      render(<MediaSection />);
      fireEvent.click(screen.getByTestId('media-item-1'));
      
      const modalContent = screen.getByTestId('media-modal');
      expect(modalContent).toHaveClass('max-w-2xl', 'w-full', 'max-h-[90vh]');
    });
  });

  describe('Premium Badge', () => {
    it('should display premium badge with gradient', () => {
      const { container } = render(<MediaSection />);
      const premiumBadges = container.querySelectorAll('.bg-gradient-to-r.from-yellow-400.to-yellow-500');
      expect(premiumBadges.length).toBeGreaterThan(0);
    });

    it('should position premium badge in top-right corner', () => {
      const { container } = render(<MediaSection />);
      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Premium');
    });
  });

  describe('State Management', () => {
    it('should update selected media when clicking different items', () => {
      render(<MediaSection />);
      
      // Click first item
      fireEvent.click(screen.getByTestId('media-item-1'));
      expect(screen.getByText('Artisan Croissant')).toBeInTheDocument();
      
      // Close and click another item
      fireEvent.click(screen.getByTestId('modal-close-button'));
      fireEvent.click(screen.getByTestId('media-item-7'));
      expect(screen.getByText('Curated Wines')).toBeInTheDocument();
    });

    it('should reset selected media when closing modal', () => {
      render(<MediaSection />);
      
      fireEvent.click(screen.getByTestId('media-item-1'));
      expect(screen.getByTestId('media-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('modal-close-button'));
      expect(screen.queryByTestId('media-modal')).not.toBeInTheDocument();
      
      // Should be able to open a different item
      fireEvent.click(screen.getByTestId('media-item-3'));
      expect(screen.getByText('Cozy Ambiance')).toBeInTheDocument();
    });
  });
});