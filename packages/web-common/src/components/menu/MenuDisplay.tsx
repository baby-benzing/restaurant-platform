import React from 'react';
import { cn } from '../../utils/cn';
import { MenuSection, type MenuSectionData } from './MenuSection';
import { Grid } from '../layout/Grid';

export interface MenuData {
  id: string;
  name: string;
  description?: string | null;
  sections: MenuSectionData[];
}

export interface MenuDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: MenuData;
  hideUnavailable?: boolean;
  columns?: 1 | 2;
}

export const MenuDisplay = React.forwardRef<HTMLDivElement, MenuDisplayProps>(
  ({ 
    menu, 
    hideUnavailable = false,
    columns = 1,
    className, 
    ...props 
  }, ref) => {
    const { name, description, sections } = menu;

    return (
      <div
        ref={ref}
        className={cn('space-y-8', className)}
        {...props}
      >
        {(name || description) && (
          <div className="text-center">
            {name && (
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                {name}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-lg text-neutral-600">
                {description}
              </p>
            )}
          </div>
        )}
        
        {sections.length > 0 ? (
          columns === 2 ? (
            <Grid cols={2} gap="lg" responsive>
              {sections.map((section) => (
                <MenuSection
                  key={section.id}
                  section={section}
                  hideUnavailable={hideUnavailable}
                />
              ))}
            </Grid>
          ) : (
            <div className="space-y-12">
              {sections.map((section) => (
                <MenuSection
                  key={section.id}
                  section={section}
                  hideUnavailable={hideUnavailable}
                />
              ))}
            </div>
          )
        ) : (
          <p className="text-center text-neutral-500 italic py-8">
            No menu sections available
          </p>
        )}
      </div>
    );
  }
);

MenuDisplay.displayName = 'MenuDisplay';