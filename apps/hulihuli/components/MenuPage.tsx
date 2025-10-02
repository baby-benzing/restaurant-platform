'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  name: string;
  description?: string | null;
  price?: number | null;
}

interface MenuSection {
  name: string;
  description?: string | null;
  items: MenuItem[];
}

interface MenuData {
  name: string;
  sections: MenuSection[];
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/restaurant');
        if (response.ok) {
          const data = await response.json();
          setMenu(data.menus?.[0]);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    }
    fetchData();
  }, []);

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 pb-24">
      {/* Menu Header */}
      <div className="relative h-[40vh] overflow-hidden">
        <Image
          src="/images/hulihuli-hero.jpg"
          alt="Hulihuli Menu"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">
            Our Menu
          </h1>
          <p className="text-lg md:text-xl font-light">
            Authentic Hawaiian Flavors
          </p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {menu.sections.map((section) => (
            <div key={section.name} className="bg-white rounded-2xl shadow-xl p-8">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {section.name}
                </h2>
                {section.description && (
                  <p className="text-gray-600 text-lg">{section.description}</p>
                )}
                <div className="mt-4 h-1 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded"></div>
              </div>

              {/* Menu Items */}
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.price && (
                      <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-amber-700">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-2">
            Come Visit Us!
          </h3>
          <p className="text-amber-50 mb-4">
            Experience the authentic taste of Hawaii
          </p>
          <p className="text-sm text-amber-100">
            All menu items are subject to availability
          </p>
        </div>
      </div>
    </div>
  );
}
