'use client';

import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

interface MenuPreviewProps {
  menu?: {
    name: string;
    sections: Array<{
      name: string;
      items: Array<{
        name: string;
        description?: string | null;
        price?: number | null;
      }>;
    }>;
  };
}

export default function MenuPreview({ menu }: MenuPreviewProps) {
  if (!menu) return null;

  // Show first 2 sections as preview
  const previewSections = menu.sections.slice(0, 2);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Our Menu
          </h2>
          <p className="text-gray-600">Experience the flavors of Hawaii</p>
        </div>

        <div className="space-y-8">
          {previewSections.map((section) => (
            <div key={section.name} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {section.name}
              </h3>
              <div className="space-y-4">
                {section.items.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-semibold text-amber-700 ml-4">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-semibold"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
