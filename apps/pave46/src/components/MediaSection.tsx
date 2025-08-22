'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  publishDate: Date | string;
  source?: string;
  author?: string;
  link?: string;
  isPremium: boolean;
}

export default function MediaSection() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaArticles();
  }, []);

  const fetchMediaArticles = async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media articles');
      const data = await response.json();
      setMediaItems(data.articles);
    } catch (error) {
      console.error('Error fetching media articles:', error);
      // Fall back to empty array if API fails
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-20" data-section="media">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-gray-900">
            Press & Articles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-20" data-section="media">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-gray-900">
          Press & Articles
        </h2>

        {mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Media Grid - Optimized for mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {mediaItems.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in group"
                  onClick={() => handleMediaClick(item)}
                  data-testid={`media-item-${item.id}`}
                >
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  
                  {/* Actual image (would be used when images are available) */}
                  {item.coverImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                      {/* Image would go here when available */}
                    </div>
                  )}
                  
                  {/* Placeholder content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full" />
                      <p className="text-xs text-gray-600 line-clamp-2">{item.title}</p>
                    </div>
                  </div>

                  {/* Hover overlay with magnifier icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn 
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      size={32}
                    />
                  </div>

                  {/* Premium badge */}
                  {item.isPremium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Premium
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer text */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Click on any image to view details
            </p>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          data-testid="media-modal-backdrop"
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="media-modal"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedMedia.title}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                data-testid="modal-close-button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {selectedMedia.isPremium ? (
                /* Premium Content - Paywall */
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    Premium Content
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    This exclusive content is available to our premium members. 
                    Subscribe to unlock chef&apos;s secrets, behind-the-scenes content, and special recipes.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full max-w-xs mx-auto block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-colors">
                      Subscribe for $9.99/month
                    </button>
                    <button className="w-full max-w-xs mx-auto block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ) : (
                /* Free Content */
                <div>
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-400 rounded-full" />
                        <p className="text-gray-600">Full Resolution Image</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedMedia.description}
                    </p>
                    
                    {/* Additional details */}
                    <div className="pt-4 border-t">
                      <h5 className="font-semibold text-gray-900 mb-2">Details</h5>
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-gray-500">Source</dt>
                          <dd className="text-gray-900">{selectedMedia.source || 'Pavé46'}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Date</dt>
                          <dd className="text-gray-900">{formatDate(selectedMedia.publishDate)}</dd>
                        </div>
                        {selectedMedia.author && (
                          <div>
                            <dt className="text-gray-500">Author</dt>
                            <dd className="text-gray-900">{selectedMedia.author}</dd>
                          </div>
                        )}
                        {selectedMedia.link && (
                          <div>
                            <dt className="text-gray-500">Link</dt>
                            <dd>
                              <a 
                                href={selectedMedia.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Original
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom cursor style */}
      <style jsx>{`
        .cursor-zoom-in {
          cursor: zoom-in;
        }
      `}</style>
    </div>
  );
}