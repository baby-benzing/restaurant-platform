import React from 'react';
import { cn } from '../../utils/cn';
import { MenuItem, type MenuItemData } from './MenuItem';

export interface MenuSectionData {
  id: string;
  name: string;
  description?: string | null;
  items: MenuItemData[];
}

export interface MenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  section: MenuSectionData;
  hideUnavailable?: boolean;
  headingLevel?: 'h2' | 'h3' | 'h4';
}

export const MenuSection = React.forwardRef<HTMLDivElement, MenuSectionProps>(
  ({ 
    section, 
    hideUnavailable = false,
    headingLevel = 'h3',
    className, 
    ...props 
  }, ref) => {
    const { name, description, items } = section;
    const Heading = headingLevel;

    const displayItems = hideUnavailable 
      ? items.filter(item => item.isAvailable !== false)
      : items;

    return (
      <div
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        <div>
          <Heading className="text-xl font-serif font-semibold text-neutral-900">
            {name}
          </Heading>
          {description && (
            <p className="mt-1 text-sm text-neutral-600">
              {description}
            </p>
          )}
        </div>
        
        <div className="divide-y divide-neutral-200">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))
          ) : (
            <p className="py-3 text-sm text-neutral-500 italic">
              No items available
            </p>
          )}
        </div>
      </div>
    );
  }
);

MenuSection.displayName = 'MenuSection';