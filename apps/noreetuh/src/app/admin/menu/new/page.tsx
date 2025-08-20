'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section, Card, Button } from '@restaurant-platform/web-common';
import Link from 'next/link';
interface CreateMenuItemInput {
  name: string;
  description: string;
  price: number;
  sectionId: string;
  isAvailable: boolean;
  sortOrder: number;
}

export default function NewMenuItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Array<{ id: string; name: string; menuName: string }>>([]);
  const [formData, setFormData] = useState<CreateMenuItemInput>({
    name: '',
    description: '',
    price: 0,
    sectionId: '',
    isAvailable: true,
    sortOrder: 999,
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await fetch('/api/admin/menu/sections');
      const result = await response.json();
      if (result.success) {
        setSections(result.data);
        if (result.data.length > 0 && !formData.sectionId) {
          setFormData(prev => ({ ...prev, sectionId: result.data[0]?.id || '' }));
        }
      }
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        router.push('/admin/menu');
      } else {
        alert('Failed to create menu item. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create menu item:', error);
      alert('Failed to create menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'sortOrder') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/menu">
              <Button variant="secondary" size="sm">
                ← Back to Menu
              </Button>
            </Link>
          </div>

          <Card variant="shadow" padding="lg">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">
              Add New Menu Item
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Menu Section *
                </label>
                <select
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.menuName} - {section.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Available for ordering
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Menu Item'}
                </Button>
                <Link href="/admin/menu" className="flex-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}