'use client';

import { useState } from 'react';
import { 
  ShowAllIcon,
  WineIcon,
  BreadIcon,
  SandwichIcon,
  SoupSaladIcon,
  CroissantIcon,
  AfternoonIcon
} from '@/icons/menu-categories';

export type MenuCategory = 
  | 'WINE'
  | 'BREADS' 
  | 'SANDWICHES'
  | 'FOCACCIA'
  | 'SOUP'
  | 'SALADS' 
  | 'PASTRIES'
  | 'VIENNOISERIES' 
  | 'AFTERNOON_MENU';

// Group categories for UI display
export type MenuCategoryGroup = 
  | 'WINE'
  | 'BREADS'
  | 'SANDWICHES_FOCACCIA'
  | 'SOUP_SALADS'
  | 'PASTRIES_VIENNOISERIES'
  | 'AFTERNOON_MENU';

interface CategoryIcon {
  id: MenuCategoryGroup;
  label: string;
  icon: JSX.Element;
  categories: MenuCategory[]; // Which database categories this icon represents
}

interface MenuCategoriesProps {
  selectedCategories: MenuCategory[];
  onCategorySelect: (categories: MenuCategory[]) => void;
}

const categories: CategoryIcon[] = [
  {
    id: 'SHOW_ALL' as MenuCategoryGroup,
    label: 'Show All',
    categories: [],
    icon: <ShowAllIcon />,
  },
  {
    id: 'WINE',
    label: 'Wine',
    categories: ['WINE'],
    icon: <WineIcon />,
  },
  {
    id: 'BREADS',
    label: 'Breads',
    categories: ['BREADS'],
    icon: <BreadIcon />,
  },
  {
    id: 'SANDWICHES_FOCACCIA',
    label: 'Sandwiches & Focaccia',
    categories: ['SANDWICHES', 'FOCACCIA'],
    icon: <SandwichIcon />,
  },
  {
    id: 'SOUP_SALADS',
    label: 'Soup & Salads',
    categories: ['SOUP', 'SALADS'],
    icon: <SoupSaladIcon />,
  },
  {
    id: 'PASTRIES_VIENNOISERIES',
    label: 'Pastries & Viennoiseries',
    categories: ['PASTRIES', 'VIENNOISERIES'],
    icon: <CroissantIcon />,
  },
  {
    id: 'AFTERNOON_MENU',
    label: 'Afternoon Menu',
    categories: ['AFTERNOON_MENU'],
    icon: <AfternoonIcon />,
  },
];

export default function MenuCategories({ selectedCategories, onCategorySelect }: MenuCategoriesProps) {
  const isShowAll = selectedCategories.length === 0;
  
  const isSelected = (category: CategoryIcon) => {
    if (category.id === 'SHOW_ALL') {
      return isShowAll;
    }
    return category.categories.some(cat => selectedCategories.includes(cat));
  };

  const handleCategoryClick = (category: CategoryIcon) => {
    if (category.id === 'SHOW_ALL') {
      onCategorySelect([]);
    } else {
      // If clicking the same category, deselect (show all)
      // If clicking a different category, select it
      const alreadySelected = category.categories.some(cat => selectedCategories.includes(cat));
      onCategorySelect(alreadySelected ? [] : category.categories);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
      {categories.map((category) => {
        const selected = isSelected(category);
        const isShowAllButton = category.id === 'SHOW_ALL';
        
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`
              relative flex flex-col items-center justify-center
              w-24 h-24 md:w-32 md:h-32
              rounded-2xl transition-all duration-300
              ${selected
                ? isShowAllButton 
                  ? 'bg-gray-100 border-2 border-gray-500 scale-105 shadow-lg'
                  : 'bg-primary-100 border-2 border-primary-600 scale-105 shadow-lg'
                : 'bg-white border-2 border-gray-200 hover:border-primary-400 hover:shadow-md'
              }
            `}
            aria-label={category.label}
            aria-pressed={selected}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mb-1">
              {category.icon}
            </div>
            <span className={`
              text-xs md:text-sm font-medium
              ${selected 
                ? isShowAllButton ? 'text-gray-700' : 'text-primary-700' 
                : 'text-gray-700'}
            `}>
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}