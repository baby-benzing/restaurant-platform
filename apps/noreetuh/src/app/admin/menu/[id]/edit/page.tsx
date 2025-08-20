'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section, Card, Button } from '@restaurant-platform/web-common';
import Link from 'next/link';
interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  isAvailable: boolean;
  sectionId: string;
  sectionName?: string;
  sortOrder: number;
  imageUrl?: string | null;
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateMenuItemInput {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string;
  allergens?: string[];
}

export default function EditMenuItemPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [formData, setFormData] = useState<MenuItem | null>(null);

  const categories = [
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'mains', label: 'Main Courses' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'cocktails', label: 'Cocktails' },
    { value: 'wines', label: 'Wines' },
  ];

  const commonAllergens = [
    'dairy', 'eggs', 'fish', 'gluten', 'nuts', 
    'peanuts', 'shellfish', 'soy', 'sesame'
  ];

  useEffect(() => {
    loadMenuItem();
  }, [resolvedParams.id]);

  const loadMenuItem = async () => {
    try {
      const response = await fetch(`/api/admin/menu/${resolvedParams.id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData(result.data);
      } else {
        alert('Menu item not found');
        router.push('/admin/menu');
      }
    } catch (error) {
      console.error('Failed to load menu item:', error);
      alert('Failed to load menu item');
      router.push('/admin/menu');
    } finally {
      setLoadingItem(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setLoading(true);

    try {
      const updateData: UpdateMenuItemInput = {
        id: formData.id,
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price || undefined,
        category: formData.category,
        isAvailable: formData.isAvailable,
        imageUrl: formData.imageUrl || undefined,
        allergens: formData.allergens,
      };
      
      const response = await fetch(`/api/admin/menu/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      if (result.success) {
        router.push('/admin/menu');
      } else {
        alert('Failed to update menu item. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('Failed to update menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAllergenToggle = (allergen: string) => {
    if (!formData) return;
    
    setFormData(prev => ({
      ...prev!,
      allergens: prev!.allergens?.includes(allergen)
        ? prev!.allergens.filter(a => a !== allergen)
        : [...(prev!.allergens || []), allergen]
    }));
  };

  if (loadingItem) {
    return (
      <main>
        <Section spacing="lg" className="pt-24">
          <Container>
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-500">Loading menu item...</div>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  if (!formData) {
    return (
      <main>
        <Section spacing="lg" className="pt-24">
          <Container>
            <div className="text-center">
              <p className="text-neutral-500">Menu item not found</p>
              <Link href="/admin/menu" className="text-primary-600 hover:underline mt-4">
                Back to Menu
              </Link>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card padding="lg" variant="shadow">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-neutral-900">
                  Edit Menu Item
                </h1>
                <p className="text-neutral-600 mt-2">
                  Update the details for {formData.name}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., French Onion Soup"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the dish..."
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Allergens
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonAllergens.map(allergen => (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => handleAllergenToggle(allergen)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.allergens?.includes(allergen)
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {allergen}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-neutral-700">
                    Item is currently available
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200">
                  <Link
                    href="/admin/menu"
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Cancel
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>

              {/* Last Updated */}
              <div className="mt-6 pt-4 border-t border-neutral-200 text-sm text-neutral-500">
                Last updated: {new Date(formData.updatedAt).toLocaleDateString()}
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}