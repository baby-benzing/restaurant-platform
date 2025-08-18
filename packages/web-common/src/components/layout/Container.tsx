import React from 'react';
import { cn } from '../../utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
  as?: 'div' | 'section' | 'article' | 'main';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    children, 
    className, 
    maxWidth = 'xl',
    noPadding = false,
    as: Component = 'div',
    ...props 
  }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'mx-auto',
          !noPadding && 'px-4 sm:px-6 lg:px-8',
          maxWidthClasses[maxWidth],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';