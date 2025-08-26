'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@restaurant-platform/web-common';
import Link from 'next/link';
import { auditMenuChange } from '@/lib/audit';

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

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu');
      const result = await response.json();
      if (result.success) {
        setMenuItems(result.data);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      // Find the item being deleted for audit log
      const itemToDelete = menuItems.find(item => item.id === id);
      
      const response = await fetch(`/api/admin/menu?id=${id}`, { 
        method: 'DELETE' 
      });
      const result = await response.json();
      if (result.success) {
        setMenuItems(menuItems.filter(item => item.id !== id));
        
        // Track the deletion in audit log
        if (itemToDelete) {
          await auditMenuChange('delete', itemToDelete);
        }
      }
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'Breads', label: 'Breads' },
    { value: 'Sandwiches', label: 'Sandwiches' },
    { value: 'Focaccia', label: 'Focaccia' },
    { value: 'Pastries', label: 'Pastries' },
    { value: 'Afternoon Menu', label: 'Afternoon Menu' },
    { value: 'Cocktails', label: 'Cocktails' },
    { value: 'Wines', label: 'Wines' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const formatPrice = (price: number | null) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900">
                Menu Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage your restaurant menu items
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/admin/menu/new"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Add New Item
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-500">Loading menu items...</div>
            </div>
          )}

          {/* Menu Items Table */}
          {!loading && (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                        No menu items found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-neutral-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 text-neutral-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/menu/${item.id}/edit`}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {!loading && (
            <div className="mt-4 text-sm text-neutral-500">
              Showing {filteredItems.length} of {menuItems.length} items
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}