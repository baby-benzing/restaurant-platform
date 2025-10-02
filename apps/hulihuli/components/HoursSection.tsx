'use client';

import { Clock } from 'lucide-react';
import { HoursDisplay } from '@restaurant-platform/web-common';

interface HoursSectionProps {
  hours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
}

export default function HoursSection({ hours }: HoursSectionProps) {
  if (!hours) return null;

  const formattedHours = hours.map((h) => ({
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek],
    openTime: h.openTime,
    closeTime: h.closeTime,
    isClosed: h.isClosed,
  }));

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Clock className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Hours of Operation
          </h2>
          <p className="text-gray-600">Visit us during these hours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <HoursDisplay
            hours={formattedHours}
            variant="default"
            showCurrentStatus
            highlightToday
          />
        </div>
      </div>
    </section>
  );
}
