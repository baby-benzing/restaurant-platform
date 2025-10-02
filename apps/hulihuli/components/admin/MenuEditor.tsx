'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  sortOrder: number;
  isAvailable: boolean;
}

interface MenuSection {
  id: string;
  name: string;
  description?: string | null;
  items: MenuItem[];
}

interface MenuEditorProps {
  restaurantId: string;
  menu?: {
    id: string;
    name: string;
    sections: MenuSection[];
  };
}

export default function MenuEditor({ restaurantId, menu }: MenuEditorProps) {
  const [sections, setSections] = useState<MenuSection[]>(menu?.sections || []);
  const [saving, setSaving] = useState(false);

  const handleItemChange = (
    sectionId: string,
    itemId: string,
    field: keyof MenuItem,
    value: string | number | boolean
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : section
      )
    );
  };

  const addItem = (sectionId: string) => {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`,
      name: 'New Item',
      description: '',
      price: 0,
      sortOrder: 999,
      isAvailable: true,
    };

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    );
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, menuId: menu?.id, sections }),
      });

      if (response.ok) {
        alert('Menu updated successfully!');
      } else {
        alert('Failed to update menu');
      }
    } catch (error) {
      alert('Error updating menu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            {section.name}
          </h2>

          <div className="space-y-4">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(section.id, item.id, 'name', e.target.value)
                  }
                  className="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Item name"
                />

                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) =>
                    handleItemChange(section.id, item.id, 'description', e.target.value)
                  }
                  className="md:col-span-5 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Description"
                />

                <input
                  type="number"
                  step="0.01"
                  value={item.price || ''}
                  onChange={(e) =>
                    handleItemChange(section.id, item.id, 'price', parseFloat(e.target.value))
                  }
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Price"
                />

                <label className="md:col-span-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.isAvailable}
                    onChange={(e) =>
                      handleItemChange(section.id, item.id, 'isAvailable', e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Available</span>
                </label>

                <button
                  onClick={() => deleteItem(section.id, item.id)}
                  className="md:col-span-1 flex items-center justify-center text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addItem(section.id)}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}
