'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff, Crown, Calendar, User, Link } from 'lucide-react';

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

interface SortableMediaItemProps {
  article: MediaArticle;
  onEdit: (article: MediaArticle) => void;
  onDelete: (id: string) => void;
}

export function SortableMediaItem({ article, onEdit, onDelete }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={20} />
      </div>

      {/* Article Info */}
      <div className="flex-1">
        <div className="flex items-start gap-3">
          {article.coverImage && (
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {/* Placeholder for image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-neutral-900">{article.title}</h3>
              {article.isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <Crown size={12} />
                  Premium
                </span>
              )}
              {!article.isPublished && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  <EyeOff size={12} />
                  Draft
                </span>
              )}
            </div>
            
            <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
              {article.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              {article.source && (
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {article.source}
                </span>
              )}
              {article.author && (
                <span>{article.author}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(article.publishDate)}
              </span>
              {article.link && (
                <span className="flex items-center gap-1">
                  <Link size={12} />
                  External Link
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(article)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Edit article"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(article.id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete article"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center">
        {article.isPublished ? (
          <Eye size={18} className="text-green-600" title="Published" />
        ) : (
          <EyeOff size={18} className="text-gray-400" title="Draft" />
        )}
      </div>
    </div>
  );
}