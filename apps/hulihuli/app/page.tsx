'use client';

import { useState } from 'react';
import { Home, UtensilsCrossed } from 'lucide-react';
import { LiquidGlassNav } from '@restaurant-platform/web-common';
import HeroBanner from '@/components/HeroBanner';
import HoursSection from '@/components/HoursSection';
import LocationSection from '@/components/LocationSection';
import MenuSection from '@/components/MenuSection';
import { useRestaurantData } from '@/hooks/useRestaurantData';

export default function MainPage() {
  const [activeSection, setActiveSection] = useState('home');
  const { restaurant } = useRestaurantData();

  const navItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'menu', icon: <UtensilsCrossed size={24} />, label: 'Menu' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {activeSection === 'home' && (
        <div className="pb-24">
          <HeroBanner />
          <HoursSection hours={restaurant?.hours} />
          <LocationSection contact={restaurant?.contacts} />
        </div>
      )}

      {activeSection === 'menu' && (
        <div className="pb-24">
          <MenuSection menu={restaurant?.menus?.[0]} />
        </div>
      )}

      <LiquidGlassNav
        items={navItems}
        activeId={activeSection}
        onItemClick={setActiveSection}
        variant={activeSection === 'home' ? 'dark' : 'light'}
      />
    </main>
  );
}
