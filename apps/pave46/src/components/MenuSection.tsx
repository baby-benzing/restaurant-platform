'use client';

import { useState } from 'react';
import { MenuDisplay } from '@restaurant-platform/web-common';
import MenuCategories, { MenuCategory } from './MenuCategories';

interface MenuSectionProps {
  menu: any;
}

export default function MenuSection({ menu }: MenuSectionProps) {
  const [selectedCategories, setSelectedCategories] = useState<MenuCategory[]>([]);

  // Filter menu sections based on selected categories
  const filteredMenu = menu && selectedCategories.length > 0 ? {
    ...menu,
    name: null, // Remove the "Main Menu" title when filtering
    description: null, // Remove the description when filtering
    sections: menu.sections.filter((section: any) => 
      section.category && selectedCategories.includes(section.category)
    )
  } : {
    ...menu,
    name: null, // Also remove "Main Menu" when showing all
    description: null
  };

  return (
    <div className="min-h-screen bg-white px-4 py-20" data-section="menu">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-2 text-gray-900">
          Our Menu
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Select a category to view items
        </p>
        
        {/* Category Icons */}
        <MenuCategories 
          selectedCategories={selectedCategories}
          onCategorySelect={setSelectedCategories}
        />
        
        {/* Category Subheader */}
        <div className="text-center mb-6 mt-8">
          <h3 className="text-2xl font-medium text-gray-800">
            {selectedCategories.length > 0 
              ? selectedCategories.map(cat => 
                  cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                ).join(' & ')
              : 'All Menu Items'
            }
          </h3>
        </div>
        
        {/* Menu Display */}
        <div className="mt-6">
          {filteredMenu ? (
            <>
              {filteredMenu.sections && filteredMenu.sections.length > 0 ? (
                <MenuDisplay menu={filteredMenu} />
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p>No items available in this category</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>Menu is being updated</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}