'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableMediaItem } from '@/components/admin/SortableMediaItem';
import { MediaArticleForm } from '@/components/admin/MediaArticleForm';
import { MediaPreviewModal } from '@/components/admin/MediaPreviewModal';

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

export default function MediaManagementPage() {
  const [articles, setArticles] = useState<MediaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<MediaArticle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<MediaArticle | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = articles.findIndex((item) => item.id === active.id);
      const newIndex = articles.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(articles, oldIndex, newIndex);
      
      // Update sortOrder for each item
      const updatedArticles = newOrder.map((article, index) => ({
        ...article,
        sortOrder: index,
      }));

      setArticles(updatedArticles);

      // Save the new order to the server
      try {
        await fetch('/api/admin/media', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articles: updatedArticles }),
        });
      } catch (error) {
        console.error('Error updating article order:', error);
        // Revert on error
        fetchArticles();
      }
    }
  };

  const handleEdit = (article: MediaArticle) => {
    setSelectedArticle(article);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setIsFormOpen(true);
  };

  const handlePreview = (article: MediaArticle) => {
    setPreviewArticle(article);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete article');
      
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleSave = async (data: Partial<MediaArticle>) => {
    setSaving(true);
    try {
      const url = selectedArticle
        ? `/api/admin/media/${selectedArticle.id}`
        : '/api/admin/media';
      
      const method = selectedArticle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sortOrder: selectedArticle?.sortOrder ?? articles.length,
        }),
      });

      if (!response.ok) throw new Error('Failed to save article');
      
      await fetchArticles();
      setIsFormOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Press & Articles</h1>
          <p className="text-neutral-600 mt-2">Manage media coverage and press articles</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <p className="text-sm text-neutral-600">
            Drag and drop articles to reorder them. The order here will be reflected on the public website.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No articles yet. Add your first press article!</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={articles.map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y">
                {articles.map((article) => (
                  <SortableMediaItem
                    key={article.id}
                    article={article}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {isFormOpen && (
        <MediaArticleForm
          article={selectedArticle}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedArticle(null);
          }}
          saving={saving}
        />
      )}

      {/* Preview Modal */}
      <MediaPreviewModal 
        article={previewArticle}
        onClose={() => setPreviewArticle(null)}
      />
    </div>
  );
}