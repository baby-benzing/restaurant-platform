import React from 'react';
import { cn } from '../../utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    children, 
    className,
    cols = 1,
    gap = 'md',
    responsive = true,
    ...props 
  }, ref) => {
    const colsClasses = {
      1: 'grid-cols-1',
      2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
      3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
      4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
      6: responsive ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
      12: responsive ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12' : 'grid-cols-12',
    };

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsClasses[cols],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    children, 
    className,
    direction = 'row',
    justify = 'start',
    align = 'stretch',
    wrap = false,
    gap = 'none',
    ...props 
  }, ref) => {
    const directionClasses = {
      'row': 'flex-row',
      'col': 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    };

    const justifyClasses = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const alignClasses = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          wrap && 'flex-wrap',
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';