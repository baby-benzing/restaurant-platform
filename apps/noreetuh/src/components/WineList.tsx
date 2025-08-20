'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@restaurant-platform/web-common';

interface Wine {
  id: string;
  name: string;
  producer?: string;
  vintage?: number;
  region?: string;
  country?: string;
  grapeVarieties: string[];
  type: string;
  glassPrice?: number;
  bottlePrice?: number;
  tastingNotes?: string;
  foodPairings?: string[];
  inventoryStatus: string;
  featured: boolean;
}

interface WineListProps {
  className?: string;
}

const WINE_TYPES = [
  { value: 'all', label: 'All Wines' },
  { value: 'RED', label: 'Red' },
  { value: 'WHITE', label: 'White' },
  { value: 'ROSE', label: 'Rosé' },
  { value: 'SPARKLING', label: 'Sparkling' },
];

export default function WineList({ className }: WineListProps) {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedWine, setExpandedWine] = useState<string | null>(null);

  const fetchWines = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());

      const response = await fetch(`/api/wines?${params}`);
      const result = await response.json();

      if (result.success) {
        setWines(result.data);
        setTotalPages(result.totalPages);
        
        // Track search analytics
        if (searchQuery) {
          trackAnalytics('SEARCH', { query: searchQuery });
        }
        if (selectedType !== 'all') {
          trackAnalytics('FILTER', { type: selectedType });
        }
      }
    } catch (error) {
      console.error('Failed to fetch wines:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedType, searchQuery, priceRange]);

  useEffect(() => {
    fetchWines();
  }, [fetchWines]);

  const trackAnalytics = async (eventType: string, metadata?: any) => {
    try {
      const sessionId = sessionStorage.getItem('wine-session-id') || 
                       (() => {
                         const id = Math.random().toString(36).substring(7);
                         sessionStorage.setItem('wine-session-id', id);
                         return id;
                       })();

      await fetch('/api/wines/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ eventType, metadata }),
      });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const handleWineClick = async (wine: Wine) => {
    setExpandedWine(expandedWine === wine.id ? null : wine.id);
    
    if (expandedWine !== wine.id) {
      await trackAnalytics('VIEW', { wineId: wine.id });
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Market Price';
    return `$${price.toFixed(0)}`;
  };

  const getWineTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      RED: 'text-red-700 bg-red-50',
      WHITE: 'text-amber-700 bg-amber-50',
      ROSE: 'text-pink-700 bg-pink-50',
      SPARKLING: 'text-blue-700 bg-blue-50',
    };
    return colors[type] || 'text-gray-700 bg-gray-50';
  };

  return (
    <div className={cn('wine-list', className)}>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search wines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap">
          {WINE_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedType === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Price:</span>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="flex-1"
          />
          <span className="text-sm font-medium">${priceRange[0]} - ${priceRange[1]}+</span>
        </div>
      </div>

      {/* Wine List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading wines...</p>
        </div>
      ) : wines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No wines found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wines.map((wine) => (
            <div
              key={wine.id}
              className={cn(
                'border rounded-lg p-4 transition-all cursor-pointer',
                expandedWine === wine.id ? 'border-primary-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
              )}
              onClick={() => handleWineClick(wine)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {wine.name}
                        {wine.vintage && <span className="ml-2 text-gray-600">{wine.vintage}</span>}
                      </h3>
                      {wine.producer && (
                        <p className="text-sm text-gray-600">{wine.producer}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getWineTypeColor(wine.type))}>
                          {wine.type}
                        </span>
                        {wine.region && (
                          <span className="text-sm text-gray-500">{wine.region}</span>
                        )}
                        {wine.country && (
                          <span className="text-sm text-gray-500">{wine.country}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {wine.glassPrice && (
                    <div className="text-sm text-gray-600">
                      Glass: {formatPrice(wine.glassPrice)}
                    </div>
                  )}
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(wine.bottlePrice)}
                  </div>
                  {wine.inventoryStatus === 'LOW_STOCK' && (
                    <span className="text-xs text-orange-600">Limited</span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedWine === wine.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {wine.grapeVarieties.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Grapes: </span>
                      <span className="text-sm text-gray-600">{wine.grapeVarieties.join(', ')}</span>
                    </div>
                  )}
                  
                  {wine.tastingNotes && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 italic">"{wine.tastingNotes}"</p>
                    </div>
                  )}
                  
                  {wine.foodPairings && wine.foodPairings.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Pairs with: </span>
                      <span className="text-sm text-gray-600">{wine.foodPairings.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}