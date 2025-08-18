import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Section } from '../Section';

describe('Section', () => {
  it('should render children', () => {
    render(
      <Section>
        <div>Section content</div>
      </Section>
    );
    
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('should apply default padding', () => {
    const { container } = render(
      <Section>Content</Section>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('py-12', 'md:py-16', 'lg:py-20');
  });

  it('should apply spacing variants', () => {
    const spacings = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const expectedClasses = {
      xs: ['py-4', 'md:py-6'],
      sm: ['py-8', 'md:py-10'],
      md: ['py-12', 'md:py-16', 'lg:py-20'],
      lg: ['py-16', 'md:py-20', 'lg:py-24'],
      xl: ['py-20', 'md:py-24', 'lg:py-32'],
    };

    spacings.forEach((spacing) => {
      const { container } = render(
        <Section spacing={spacing}>Content</Section>
      );
      
      const element = container.firstChild;
      expectedClasses[spacing].forEach(className => {
        expect(element).toHaveClass(className);
      });
    });
  });

  it('should apply background colors', () => {
    const { container } = render(
      <Section background="gray">Content</Section>
    );
    
    expect(container.firstChild).toHaveClass('bg-neutral-50');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Section className="border-t border-b">Content</Section>
    );
    
    expect(container.firstChild).toHaveClass('border-t', 'border-b');
  });

  it('should render as different HTML elements', () => {
    const { container } = render(
      <Section as="article">Content</Section>
    );
    
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Section ref={ref}>Content</Section>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('should combine container with section when withContainer is true', () => {
    render(
      <Section withContainer>
        <div>Contained content</div>
      </Section>
    );
    
    const content = screen.getByText('Contained content');
    const container = content.closest('.mx-auto');
    
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });
});