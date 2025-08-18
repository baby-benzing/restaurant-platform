import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullscreen?: boolean;
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ 
    size = 'md',
    text,
    fullscreen = false,
    className, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };

    const spinner = (
      <svg
        className={cn('animate-spin text-primary-600', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const content = (
      <div className="flex flex-col items-center justify-center gap-3">
        <div role="status" aria-label="Loading">
          {spinner}
        </div>
        {text && (
          <p className="text-sm text-neutral-600">{text}</p>
        )}
      </div>
    );

    if (fullscreen) {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm',
            className
          )}
          {...props}
        >
          {content}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center p-8', className)}
        {...props}
      >
        {content}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    variant = 'text',
    width,
    height,
    count = 1,
    className, 
    ...props 
  }, ref) => {
    const variantClasses = {
      text: 'h-4 w-full rounded',
      circular: 'rounded-full',
      circle: 'rounded-full',
      rectangular: 'rounded',
    };

    const defaultSizes = {
      text: { width: '100%', height: '1rem' },
      circular: { width: '40px', height: '40px' },
      circle: { width: '40px', height: '40px' },
      rectangular: { width: '100%', height: '60px' },
    };

    const finalWidth = width || defaultSizes[variant].width;
    const finalHeight = height || defaultSizes[variant].height;

    const skeleton = (
      <div
        className={cn(
          'animate-pulse bg-neutral-200',
          variantClasses[variant],
          className
        )}
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
        {...props}
      />
    );

    if (count > 1) {
      return (
        <>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              ref={index === 0 ? ref : undefined}
              className={cn(
                'animate-pulse bg-neutral-200',
                variantClasses[variant],
                index < count - 1 && 'mb-2',
                className
              )}
              style={{
                width: finalWidth,
                height: finalHeight,
              }}
              {...props}
            />
          ))}
        </>
      );
    }

    return React.cloneElement(skeleton, { ref });
  }
);

Skeleton.displayName = 'Skeleton';