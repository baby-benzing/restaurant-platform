'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface MediaItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  premium?: boolean;
}

export default function MediaSection() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Media items with press articles and reviews
  const mediaItems: MediaItem[] = [
    {
      id: 1,
      src: '/images/media/nytimes-review.jpg',
      alt: 'New York Times Review',
      title: 'NY Times: Best New Bakery',
      description: '"Pavé brings authentic Parisian pastries to Midtown Manhattan with a level of craftsmanship rarely seen outside of France. Their croissants rival those found on Boulevard Saint-Germain." - Pete Wells, NY Times Food Critic',
      premium: false,
    },
    {
      id: 2,
      src: '/images/media/michelin-feature.jpg',
      alt: 'Michelin Guide Feature',
      title: 'Michelin Guide 2024',
      description: 'Featured in the prestigious Michelin Guide as a Bib Gourmand recipient, recognizing exceptional food at moderate prices.',
      premium: true,
    },
    {
      id: 3,
      src: '/images/media/eater-article.jpg',
      alt: 'Eater NY Article',
      title: 'Eater: Essential NYC Bakeries',
      description: '"The butter lamination at Pavé is nothing short of perfection. This is where New Yorkers come for their morning croissant fix." - Eater NY Essential 38 List',
      premium: false,
    },
    {
      id: 4,
      src: '/images/media/chef-interview.jpg',
      alt: 'Chef Interview Feature',
      title: 'Chef Philippe Interview',
      description: 'Exclusive interview with Executive Chef Philippe about his journey from Lyon to New York and the art of French baking.',
      premium: true,
    },
    {
      id: 5,
      src: '/images/media/timeout-review.jpg',
      alt: 'Time Out NY Review',
      title: 'Time Out: Top 10 Brunch',
      description: '"Skip the tourist traps and head to Pavé for the most authentic French brunch experience in the city. The croque monsieur is life-changing." - Time Out New York',
      premium: false,
    },
    {
      id: 6,
      src: '/images/media/vogue-feature.jpg',
      alt: 'Vogue Dining Feature',
      title: 'Vogue: Fashion Week Dining',
      description: 'Where fashion insiders fuel up during NYFW - an exclusive look at the style set\'s favorite French café.',
      premium: true,
    },
    {
      id: 7,
      src: '/images/media/wsj-article.jpg',
      alt: 'Wall Street Journal Article',
      title: 'WSJ: Business of Bakeries',
      description: '"How Pavé revolutionized the NYC bakery scene with traditional techniques and modern business acumen." - Wall Street Journal Business Section',
      premium: false,
    },
    {
      id: 8,
      src: '/images/media/bon-appetit.jpg',
      alt: 'Bon Appétit Feature',
      title: 'Bon Appétit: Secret Menu',
      description: 'Discover the off-menu items that regulars order at this Midtown gem, plus Chef Philippe\'s personal favorites.',
      premium: true,
    },
  ];

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-20" data-section="media">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-gray-900">
          Press & Articles
        </h2>

        {/* Media Grid - Optimized for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in group"
              onClick={() => handleMediaClick(item)}
              data-testid={`media-item-${item.id}`}
            >
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              
              {/* Actual image (would be used when images are available) */}
              {/* <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              /> */}
              
              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full" />
                  <p className="text-xs text-gray-600">{item.title}</p>
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
              {item.premium && (
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
              {selectedMedia.premium ? (
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
                          <dt className="text-gray-500">Category</dt>
                          <dd className="text-gray-900">Gallery</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Date Added</dt>
                          <dd className="text-gray-900">January 2024</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Photography</dt>
                          <dd className="text-gray-900">Studio Pavé</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Location</dt>
                          <dd className="text-gray-900">New York</dd>
                        </div>
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