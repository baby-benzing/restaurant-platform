'use client';

import { X, Calendar, User, Link as LinkIcon, Crown } from 'lucide-react';

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
}

interface MediaPreviewModalProps {
  article: MediaArticle | null;
  onClose: () => void;
}

export function MediaPreviewModal({ article, onClose }: MediaPreviewModalProps) {
  if (!article) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Preview: {article.title}
            </h3>
            {!article.isPublished && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                Draft
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Mimics the public website display */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {article.isPremium ? (
            /* Premium Content Preview - Shows paywall */
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                Premium Content
              </h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This exclusive content is available to our premium members. 
                Subscribe to unlock chef&apos;s secrets, behind-the-scenes content, and special recipes.
              </p>
              <div className="space-y-3">
                <button className="w-full max-w-xs mx-auto block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold cursor-not-allowed opacity-75">
                  Subscribe for $9.99/month
                </button>
                <button className="w-full max-w-xs mx-auto block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold cursor-not-allowed opacity-75">
                  Learn More
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-6">
                This is how premium content appears to visitors
              </p>
            </div>
          ) : (
            /* Free Content Preview */
            <div>
              {/* Image placeholder */}
              {article.coverImage ? (
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-400 rounded-full" />
                      <p className="text-gray-600">Image: {article.coverImage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <p className="text-gray-500">No cover image</p>
                </div>
              )}
              
              {/* Description */}
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {article.description}
                  </p>
                </div>
                
                {/* Additional details */}
                <div className="pt-4 border-t">
                  <h5 className="font-semibold text-gray-900 mb-3">Article Details</h5>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500 flex items-center gap-1 mb-1">
                        <User size={14} />
                        Source
                      </dt>
                      <dd className="text-gray-900 font-medium">{article.source || 'Pavé46'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 flex items-center gap-1 mb-1">
                        <Calendar size={14} />
                        Date
                      </dt>
                      <dd className="text-gray-900 font-medium">{formatDate(article.publishDate)}</dd>
                    </div>
                    {article.author && (
                      <div>
                        <dt className="text-gray-500 mb-1">Author</dt>
                        <dd className="text-gray-900 font-medium">{article.author}</dd>
                      </div>
                    )}
                    {article.link && (
                      <div>
                        <dt className="text-gray-500 flex items-center gap-1 mb-1">
                          <LinkIcon size={14} />
                          External Link
                        </dt>
                        <dd>
                          <a 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Original
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Preview notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Preview Mode:</strong> This is how the article will appear on the public website.
                    {!article.isPublished && ' This article is currently in draft mode and not visible to the public.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}