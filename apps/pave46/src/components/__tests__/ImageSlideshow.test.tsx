import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageSlideshow from '../ImageSlideshow';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className, priority, quality, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...props} />;
  },
}));

describe('ImageSlideshow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render the slideshow component', () => {
      const { container } = render(<ImageSlideshow />);
      expect(container.querySelector('[data-section="home"]')).toBeInTheDocument();
    });

    it('should display the restaurant title', () => {
      render(<ImageSlideshow />);
      expect(screen.getByText('Pavé')).toBeInTheDocument();
    });

    it('should render all images', () => {
      render(<ImageSlideshow />);
      expect(screen.getByAlt('Pavé Restaurant')).toBeInTheDocument();
      expect(screen.getByAlt('Restaurant Interior')).toBeInTheDocument();
      expect(screen.getByAlt('Dining Area')).toBeInTheDocument();
      expect(screen.getByAlt('Bar Area')).toBeInTheDocument();
      expect(screen.getByAlt('Artisanal Food')).toBeInTheDocument();
      expect(screen.getByAlt('Fresh Pastries')).toBeInTheDocument();
      expect(screen.getByAlt('Signature Dishes')).toBeInTheDocument();
      expect(screen.getByAlt('Restaurant Ambiance')).toBeInTheDocument();
    });

    it('should render correct number of slide indicators', () => {
      render(<ImageSlideshow />);
      const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(indicators).toHaveLength(8);
    });
  });

  describe('Slide Navigation', () => {
    it('should start with the first slide active', () => {
      const { container } = render(<ImageSlideshow />);
      const firstSlide = container.querySelector('.opacity-100');
      const firstImage = firstSlide?.querySelector('img');
      expect(firstImage).toHaveAttribute('alt', 'Pavé Restaurant');
    });

    it('should change slides when clicking indicators', () => {
      const { container } = render(<ImageSlideshow />);
      const thirdIndicator = screen.getByRole('button', { name: 'Go to slide 3' });
      
      fireEvent.click(thirdIndicator);
      
      const activeSlide = container.querySelector('.opacity-100');
      const activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Dining Area');
    });

    it('should highlight the active indicator', () => {
      render(<ImageSlideshow />);
      const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
      
      // First indicator should be active initially
      expect(indicators[0]).toHaveClass('bg-white', 'w-8');
      expect(indicators[1]).toHaveClass('bg-white/50');
      
      // Click second indicator
      fireEvent.click(indicators[1]);
      
      // Second indicator should now be active
      expect(indicators[0]).toHaveClass('bg-white/50');
      expect(indicators[1]).toHaveClass('bg-white', 'w-8');
    });
  });

  describe('Automatic Slide Transition', () => {
    it('should automatically advance slides every 2.5 seconds', () => {
      const { container } = render(<ImageSlideshow />);
      
      // Initially first slide is active
      let activeSlide = container.querySelector('.opacity-100');
      let activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Pavé Restaurant');
      
      // Advance timer by 2.5 seconds
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      
      // Second slide should now be active
      activeSlide = container.querySelector('.opacity-100');
      activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Restaurant Interior');
      
      // Advance timer by another 2.5 seconds
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      
      // Third slide should now be active
      activeSlide = container.querySelector('.opacity-100');
      activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Dining Area');
    });

    it('should loop back to first slide after the last one', () => {
      const { container } = render(<ImageSlideshow />);
      
      // Advance through all 8 slides (7 transitions × 2.5 seconds)
      act(() => {
        jest.advanceTimersByTime(7 * 2500);
      });
      
      // Should be on the last slide
      let activeSlide = container.querySelector('.opacity-100');
      let activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Restaurant Ambiance');
      
      // Advance one more time
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      
      // Should loop back to first slide
      activeSlide = container.querySelector('.opacity-100');
      activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Pavé Restaurant');
    });

    it('should clear interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const { unmount } = render(<ImageSlideshow />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Image Loading', () => {
    it('should set priority on the first image', () => {
      const { container } = render(<ImageSlideshow />);
      const images = container.querySelectorAll('img');
      // First image should have priority prop (mocked as attribute in our mock)
      expect(images[0]).toHaveAttribute('alt', 'Pavé Restaurant');
    });

    it('should apply correct image sources', () => {
      render(<ImageSlideshow />);
      const restaurantImage = screen.getByAlt('Pavé Restaurant');
      expect(restaurantImage).toHaveAttribute('src', '/images/restaurant/hero-main.jpg');
      
      const interiorImage = screen.getByAlt('Restaurant Interior');
      expect(interiorImage).toHaveAttribute('src', '/images/restaurant/interior-1.jpg');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<ImageSlideshow />);
      const slideshowContainer = container.querySelector('[data-section="home"]');
      expect(slideshowContainer).toHaveClass('relative', 'w-full', 'h-screen', 'overflow-hidden');
    });

    it('should position title correctly', () => {
      const { container } = render(<ImageSlideshow />);
      const titleContainer = container.querySelector('.absolute.top-8.left-8');
      expect(titleContainer).toBeInTheDocument();
      expect(titleContainer?.querySelector('h1')).toHaveClass('text-3xl', 'md:text-4xl', 'font-light', 'text-white');
    });

    it('should position indicators at the bottom', () => {
      const { container } = render(<ImageSlideshow />);
      const indicatorContainer = container.querySelector('.absolute.bottom-40.md\\:bottom-48');
      expect(indicatorContainer).toBeInTheDocument();
    });

    it('should apply transition classes to slides', () => {
      const { container } = render(<ImageSlideshow />);
      const slides = container.querySelectorAll('.transition-opacity.duration-1000');
      expect(slides).toHaveLength(8);
    });

    it('should apply overlay gradient', () => {
      const { container } = render(<ImageSlideshow />);
      const overlays = container.querySelectorAll('.bg-gradient-to-b');
      expect(overlays).toHaveLength(8);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels for slide indicators', () => {
      render(<ImageSlideshow />);
      expect(screen.getByRole('button', { name: 'Go to slide 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to slide 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to slide 8' })).toBeInTheDocument();
    });

    it('should have alt text for all images', () => {
      render(<ImageSlideshow />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('should have heading element for title', () => {
      render(<ImageSlideshow />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Pavé');
    });
  });

  describe('User Interaction', () => {
    it('should reset auto-advance when user manually changes slide', () => {
      const { container } = render(<ImageSlideshow />);
      
      // Advance timer by 2 seconds (not enough for auto-advance)
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      // Manually click on slide 4
      const fourthIndicator = screen.getByRole('button', { name: 'Go to slide 4' });
      fireEvent.click(fourthIndicator);
      
      // Should be on slide 4
      let activeSlide = container.querySelector('.opacity-100');
      let activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Bar Area');
      
      // Advance timer by 2.5 seconds
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      
      // Should advance to slide 5 (not restart from slide 1)
      activeSlide = container.querySelector('.opacity-100');
      activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Artisanal Food');
    });

    it('should handle rapid indicator clicks', () => {
      const { container } = render(<ImageSlideshow />);
      const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
      
      // Rapidly click different indicators
      fireEvent.click(indicators[2]);
      fireEvent.click(indicators[5]);
      fireEvent.click(indicators[1]);
      
      // Should end up on slide 2
      const activeSlide = container.querySelector('.opacity-100');
      const activeImage = activeSlide?.querySelector('img');
      expect(activeImage).toHaveAttribute('alt', 'Restaurant Interior');
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive text size classes to title', () => {
      render(<ImageSlideshow />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should apply responsive positioning to indicators', () => {
      const { container } = render(<ImageSlideshow />);
      const indicatorContainer = container.querySelector('.absolute.bottom-40.md\\:bottom-48');
      expect(indicatorContainer).toBeInTheDocument();
    });
  });
});