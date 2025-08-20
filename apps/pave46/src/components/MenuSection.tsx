'use client';

import { MenuDisplay } from '@restaurant-platform/web-common';

interface MenuSectionProps {
  menu: any;
}

export default function MenuSection({ menu }: MenuSectionProps) {
  return (
    <div className="min-h-screen bg-white px-4 py-20" data-section="menu">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-gray-900">
          Our Menu
        </h2>
        
        {menu ? (
          <MenuDisplay menu={menu} />
        ) : (
          <div className="text-center text-gray-500">
            <p>Menu is being updated</p>
          </div>
        )}
      </div>
    </div>
  );
}