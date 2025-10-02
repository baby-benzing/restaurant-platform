'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface Hour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface HoursEditorProps {
  restaurantId: string;
  hours: Hour[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function HoursEditor({ restaurantId, hours }: HoursEditorProps) {
  const [hoursData, setHoursData] = useState<Hour[]>(hours);
  const [saving, setSaving] = useState(false);

  const handleChange = (dayOfWeek: number, field: keyof Hour, value: string | boolean) => {
    setHoursData((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, hours: hoursData }),
      });

      if (response.ok) {
        alert('Hours updated successfully!');
      } else {
        alert('Failed to update hours');
      }
    } catch (error) {
      alert('Error updating hours');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
      <div className="space-y-4">
        {DAYS.map((day, index) => {
          const dayHours = hoursData.find((h) => h.dayOfWeek === index);
          return (
            <div key={day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-32 font-semibold text-gray-900">{day}</div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dayHours?.isClosed || false}
                  onChange={(e) => handleChange(index, 'isClosed', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Closed</span>
              </label>

              {!dayHours?.isClosed && (
                <>
                  <input
                    type="time"
                    value={dayHours?.openTime || '09:00'}
                    onChange={(e) => handleChange(index, 'openTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={dayHours?.closeTime || '17:00'}
                    onChange={(e) => handleChange(index, 'closeTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Hours'}
      </button>
    </div>
  );
}
