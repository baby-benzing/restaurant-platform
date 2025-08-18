import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from '../Container';

describe('Container', () => {
  it('should render children', () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Container>Content</Container>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('should apply max width variants', () => {
    const { container: smallContainer } = render(
      <Container maxWidth="sm">Content</Container>
    );
    
    expect(smallContainer.firstChild).toHaveClass('max-w-2xl');
    
    const { container: mediumContainer } = render(
      <Container maxWidth="md">Content</Container>
    );
    
    expect(mediumContainer.firstChild).toHaveClass('max-w-4xl');
    
    const { container: largeContainer } = render(
      <Container maxWidth="lg">Content</Container>
    );
    
    expect(largeContainer.firstChild).toHaveClass('max-w-6xl');
    
    const { container: xlContainer } = render(
      <Container maxWidth="xl">Content</Container>
    );
    
    expect(xlContainer.firstChild).toHaveClass('max-w-7xl');
  });

  it('should merge custom className', () => {
    const { container } = render(
      <Container className="bg-white shadow">Content</Container>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('mx-auto', 'px-4', 'bg-white', 'shadow');
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Container ref={ref}>Content</Container>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply padding variants', () => {
    const { container: noPaddingContainer } = render(
      <Container noPadding>Content</Container>
    );
    
    expect(noPaddingContainer.firstChild).not.toHaveClass('px-4');
    expect(noPaddingContainer.firstChild).not.toHaveClass('sm:px-6');
    expect(noPaddingContainer.firstChild).not.toHaveClass('lg:px-8');
  });

  it('should render as different HTML elements', () => {
    const { container } = render(
      <Container as="section">Content</Container>
    );
    
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});