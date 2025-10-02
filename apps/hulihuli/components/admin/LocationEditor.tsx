'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface Contact {
  id: string;
  type: string;
  label?: string | null;
  value: string;
}

interface LocationEditorProps {
  restaurantId: string;
  contacts: Contact[];
}

export default function LocationEditor({ restaurantId, contacts }: LocationEditorProps) {
  const [contactData, setContactData] = useState<Contact[]>(contacts);
  const [saving, setSaving] = useState(false);

  const getValue = (type: string) => contactData.find((c) => c.type === type)?.value || '';

  const handleChange = (type: string, value: string) => {
    setContactData((prev) => {
      const existing = prev.find((c) => c.type === type);
      if (existing) {
        return prev.map((c) => (c.type === type ? { ...c, value } : c));
      }
      return [...prev, { id: '', type, value, label: null }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, contacts: contactData }),
      });

      if (response.ok) {
        alert('Contact information updated successfully!');
      } else {
        alert('Failed to update contact information');
      }
    } catch (error) {
      alert('Error updating contact information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={getValue('address')}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={getValue('phone')}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={getValue('email')}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contact@hulihuli.com"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Contact Info'}
      </button>
    </div>
  );
}
