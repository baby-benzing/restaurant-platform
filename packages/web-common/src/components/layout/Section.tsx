import React from 'react';
import { cn } from '../../utils/cn';
import { Container } from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'primary' | 'secondary';
  withContainer?: boolean;
  as?: 'section' | 'div' | 'article';
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    children, 
    className,
    spacing = 'md',
    background,
    withContainer = false,
    as: Component = 'section',
    ...props 
  }, ref) => {
    const spacingClasses = {
      xs: 'py-4 md:py-6',
      sm: 'py-8 md:py-10',
      md: 'py-12 md:py-16 lg:py-20',
      lg: 'py-16 md:py-20 lg:py-24',
      xl: 'py-20 md:py-24 lg:py-32',
    };

    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-neutral-50',
      primary: 'bg-primary-50',
      secondary: 'bg-secondary-50',
    };

    const content = withContainer ? (
      <Container>{children}</Container>
    ) : (
      children
    );

    return (
      <Component
        ref={ref as any}
        className={cn(
          spacingClasses[spacing],
          background && backgroundClasses[background],
          className
        )}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Section.displayName = 'Section';