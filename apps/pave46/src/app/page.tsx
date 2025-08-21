'use client';

import { useState } from 'react';
import { Home, BookOpen, ShoppingBag, Info, ChefHat, Newspaper } from 'lucide-react';
import { LiquidGlassNav, NavItem } from '@restaurant-platform/web-common';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import ImageSlideshow from '@/components/ImageSlideshow';
import MenuSection from '@/components/MenuSection';
import OrderSection from '@/components/OrderSection';
import InfoSection from '@/components/InfoSection';
import CateringSection from '@/components/CateringSection';
import MediaSection from '@/components/MediaSection';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const { restaurant, loading } = useRestaurantData();

  const navItems: NavItem[] = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'menu', icon: <BookOpen size={24} />, label: 'Menu' },
    { id: 'order', icon: <ShoppingBag size={24} />, label: 'Order' },
    { id: 'catering', icon: <ChefHat size={24} />, label: 'Catering' },
    { id: 'media', icon: <Newspaper size={24} />, label: 'Media' },
    { id: 'info', icon: <Info size={24} />, label: 'Info' },
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Smooth scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-white">
      {/* Content Sections */}
      <div className="relative">
        {activeSection === 'home' && <ImageSlideshow />}
        {activeSection === 'menu' && <MenuSection menu={restaurant?.menus?.[0]} />}
        {activeSection === 'order' && <OrderSection />}
        {activeSection === 'catering' && <CateringSection />}
        {activeSection === 'media' && <MediaSection />}
        {activeSection === 'info' && <InfoSection restaurant={restaurant} />}
      </div>

      {/* Liquid Glass Navigation */}
      <LiquidGlassNav
        items={navItems}
        activeId={activeSection}
        onItemClick={handleSectionChange}
        variant="dark"
      />
    </main>
  );
}