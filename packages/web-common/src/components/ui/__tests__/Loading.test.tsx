import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loading, Skeleton } from '../Loading';

describe('Loading', () => {
  it('should render spinner by default', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should apply size variants', () => {
    const { container: smContainer } = render(<Loading size="sm" />);
    expect(smContainer.firstChild?.firstChild).toHaveClass('w-4', 'h-4');

    const { container: mdContainer } = render(<Loading size="md" />);
    expect(mdContainer.firstChild?.firstChild).toHaveClass('w-8', 'h-8');

    const { container: lgContainer } = render(<Loading size="lg" />);
    expect(lgContainer.firstChild?.firstChild).toHaveClass('w-12', 'h-12');
  });

  it('should show text when provided', () => {
    render(<Loading text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should render fullscreen overlay', () => {
    const { container } = render(<Loading fullscreen />);
    expect(container.firstChild).toHaveClass('fixed', 'inset-0');
  });

  it('should apply custom className', () => {
    const { container } = render(<Loading className="custom-loading" />);
    expect(container.firstChild).toHaveClass('custom-loading');
  });

  it('should have accessible aria-label', () => {
    render(<Loading />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('should render skeleton element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'bg-neutral-200');
  });

  it('should apply width and height', () => {
    const { container } = render(<Skeleton width="100px" height="20px" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('100px');
    expect(element.style.height).toBe('20px');
  });

  it('should apply variant shapes', () => {
    const { container: textContainer } = render(<Skeleton variant="text" />);
    expect(textContainer.firstChild).toHaveClass('h-4', 'w-full');

    const { container: circleContainer } = render(<Skeleton variant="circle" />);
    expect(circleContainer.firstChild).toHaveClass('rounded-full');

    const { container: rectContainer } = render(<Skeleton variant="rectangular" />);
    expect(rectContainer.firstChild).toHaveClass('rounded');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.firstChild).toHaveClass('custom-skeleton');
  });

  it('should render multiple skeletons with count', () => {
    const { container } = render(<Skeleton count={3} />);
    expect(container.children).toHaveLength(3);
  });

  it('should have proper spacing between multiple skeletons', () => {
    const { container } = render(<Skeleton count={2} />);
    expect(container.children[0]).toHaveClass('mb-2');
    expect(container.children[1]).not.toHaveClass('mb-2');
  });
});