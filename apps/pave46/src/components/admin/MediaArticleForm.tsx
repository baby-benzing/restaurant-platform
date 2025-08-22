'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface MediaArticle {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  publishDate: Date;
  source?: string;
  author?: string;
  link?: string;
  isPremium: boolean;
  isPublished: boolean;
  sortOrder: number;
}

interface MediaArticleFormProps {
  article: MediaArticle | null;
  onSave: (data: Partial<MediaArticle>) => void;
  onClose: () => void;
  saving: boolean;
}

export function MediaArticleForm({ article, onSave, onClose, saving }: MediaArticleFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    publishDate: new Date().toISOString().split('T')[0],
    source: '',
    author: '',
    link: '',
    isPremium: false,
    isPublished: true,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        description: article.description,
        coverImage: article.coverImage || '',
        publishDate: new Date(article.publishDate).toISOString().split('T')[0],
        source: article.source || '',
        author: article.author || '',
        link: article.link || '',
        isPremium: article.isPremium,
        isPublished: article.isPublished,
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      publishDate: new Date(formData.publishDate),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-neutral-900">
            {article ? 'Edit Article' : 'Add New Article'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., NY Times: Best New Bakery"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Article excerpt or quote..."
              />
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-neutral-700 mb-2">
                Cover Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/images/media/article.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Upload feature coming soon"
                  disabled
                >
                  <Upload size={18} />
                  Upload
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Image upload feature coming soon. For now, use a URL path.
              </p>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Source */}
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-neutral-700 mb-2">
                  Source Publication
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., New York Times"
                />
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-neutral-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Pete Wells"
                />
              </div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Publish Date */}
              <div>
                <label htmlFor="publishDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  Publish Date *
                </label>
                <input
                  type="date"
                  id="publishDate"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* External Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-neutral-700 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Premium Content (requires subscription to view)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Published (visible on website)
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-neutral-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>Save Article</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}