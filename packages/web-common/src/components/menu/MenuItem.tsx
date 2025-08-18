import React from 'react';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/formatters';

export interface MenuItemData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  isAvailable?: boolean;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: MenuItemData;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ item, className, ...props }, ref) => {
    const { name, description, price, isAvailable = true } = item;

    return (
      <div
        ref={ref}
        className={cn(
          'flex justify-between gap-4 py-3',
          !isAvailable && 'opacity-50',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-neutral-900">
            {name}
            {!isAvailable && (
              <span className="ml-2 text-sm text-neutral-500 font-normal">
                (Currently Unavailable)
              </span>
            )}
          </h4>
          {description && (
            <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {price != null && (
          <div className="flex-shrink-0">
            <span className="text-base font-semibold text-neutral-900">
              {formatPrice(price)}
            </span>
          </div>
        )}
      </div>
    );
  }
);

MenuItem.displayName = 'MenuItem';