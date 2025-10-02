'use client';

import { useState } from 'react';
import { Home, UtensilsCrossed } from 'lucide-react';
import { LiquidGlassNav, NavItem } from '@restaurant-platform/web-common';
import HomePage from '@/components/HomePage';
import MenuPage from '@/components/MenuPage';

export default function MainPage() {
  const [activeSection, setActiveSection] = useState('home');

  const navItems: NavItem[] = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'menu', icon: <UtensilsCrossed size={24} />, label: 'Menu' },
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Content Sections */}
      <div className="relative">
        {activeSection === 'home' && <HomePage />}
        {activeSection === 'menu' && <MenuPage />}
      </div>

      {/* Liquid Glass Navigation */}
      <LiquidGlassNav
        items={navItems}
        activeId={activeSection}
        onItemClick={handleSectionChange}
        variant={activeSection === 'home' ? 'dark' : 'light'}
      />
    </main>
  );
}
