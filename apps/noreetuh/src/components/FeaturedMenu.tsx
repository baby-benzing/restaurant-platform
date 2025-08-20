'use client';

import { useState } from 'react';
import { MenuDisplay, Button, type MenuData } from '@restaurant-platform/web-common';
import Link from 'next/link';

interface FeaturedMenuProps {
  menu: MenuData;
}

export default function FeaturedMenu({ menu }: FeaturedMenuProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Show only first 2 sections with first 3 items each for homepage
  const featuredSections = menu.sections.slice(0, 2).map(section => ({
    ...section,
    items: section.items.slice(0, 3),
  }));

  const displayMenu = {
    ...menu,
    sections: selectedSection 
      ? featuredSections.filter(s => s.id === selectedSection)
      : featuredSections,
  };

  return (
    <div>
      {/* Section Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={selectedSection === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedSection(null)}
        >
          All
        </Button>
        {featuredSections.map(section => (
          <Button
            key={section.id}
            variant={selectedSection === section.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedSection(section.id)}
          >
            {section.name}
          </Button>
        ))}
      </div>

      {/* Menu Display */}
      <MenuDisplay menu={displayMenu} columns={2} />

      {/* View Full Menu Link */}
      <div className="text-center mt-12">
        <Link href="/menu">
          <Button variant="primary" size="lg">
            View Full Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}