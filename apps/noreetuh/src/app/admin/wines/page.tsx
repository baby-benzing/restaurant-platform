'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@restaurant-platform/web-common';
import Link from 'next/link';

interface Wine {
  id: string;
  name: string;
  producer?: string;
  vintage?: number;
  type: string;
  bottlePrice?: number;
  inventoryStatus: string;
  featured: boolean;
}

export default function WineManagementPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      const response = await fetch('/api/wines');
      const result = await response.json();
      if (result.success) {
        setWines(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch wines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/wines/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert(`Successfully imported ${result.imported} wines`);
        fetchWines();
        setSelectedFile(null);
      } else {
        alert('Failed to import wines');
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wine?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/wines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWines(wines.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete wine:', error);
    }
  };

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900">
                Wine Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage your restaurant wine list
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Import Wine List</h2>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              CSV should have columns: Name, Producer, Vintage, Type, Region, Country, Price, etc.
            </p>
          </div>

          {/* Wine List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-neutral-500">Loading wines...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Wine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
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
                  {wines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                        No wines in the list. Upload a CSV to get started.
                      </td>
                    </tr>
                  ) : (
                    wines.map(wine => (
                      <tr key={wine.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-neutral-900">
                              {wine.name}
                              {wine.vintage && <span className="ml-2 text-gray-500">{wine.vintage}</span>}
                            </div>
                            {wine.producer && (
                              <div className="text-sm text-neutral-500">{wine.producer}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 text-neutral-800">
                            {wine.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900">
                          ${wine.bottlePrice?.toFixed(0) || 'MP'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            wine.inventoryStatus === 'IN_STOCK'
                              ? 'bg-green-100 text-green-800'
                              : wine.inventoryStatus === 'LOW_STOCK'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {wine.inventoryStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleDelete(wine.id)}
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
        </Container>
      </Section>
    </main>
  );
}