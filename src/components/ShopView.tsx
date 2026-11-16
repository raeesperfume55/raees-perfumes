import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal, ArrowUpDown, Search, RefreshCw } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onQuickView: (product: Product) => void;
  onWhatsAppInquiry: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onQuickView,
  onWhatsAppInquiry,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedConcentration, setSelectedConcentration] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [priceMax, setPriceMax] = useState<number>(25000);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'men', label: "Men's Collection" },
    { id: 'women', label: "Women's Collection" },
    { id: 'unisex', label: 'Unisex & Oud' },
  ];

  const fragranceFamilies = [
    { id: 'all', label: 'All Olfactory Families' },
    { id: 'Oud & Oriental', label: 'Oud & Oriental' },
    { id: 'Floral & Romantic', label: 'Floral & Romantic' },
    { id: 'Woody & Smoky', label: 'Woody & Smoky' },
    { id: 'Fresh & Citrus', label: 'Fresh & Citrus' },
    { id: 'Amber & Gourmand', label: 'Amber & Gourmand' },
    { id: 'Spicy & Warm', label: 'Spicy & Warm' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Category filter
        if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
          return false;
        }

        // Family filter
        if (selectedFamily !== 'all' && prod.fragranceFamily !== selectedFamily) {
          return false;
        }

        // Concentration filter
        if (selectedConcentration !== 'all' && prod.concentration !== selectedConcentration) {
          return false;
        }

        // Price filter
        if (prod.price > priceMax) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = prod.name.toLowerCase().includes(q);
          const matchDesc = prod.description.toLowerCase().includes(q);
          const matchTagline = prod.tagline.toLowerCase().includes(q);
          const matchNotes = [...prod.topNotes, ...prod.heartNotes, ...prod.baseNotes].some((n) =>
            n.toLowerCase().includes(q)
          );
          return matchName || matchDesc || matchTagline || matchNotes;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedFamily, selectedConcentration, priceMax, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedFamily('all');
    setSelectedConcentration('all');
    setPriceMax(25000);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151722] border border-[#d4af37]/30 text-xs text-[#eed78a] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Luxury Fragrance House Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Explore Sovereign Fragrances
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 font-editorial italic max-w-xl mx-auto">
          Distilled with the world's most coveted botanical essences, each creation is an invitation into regal distinction.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 bg-[#12141d] border border-gray-800 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wider uppercase transition-all ${
                selectedCategory === cat.id
                  ? 'gold-gradient-bg text-black font-bold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-[#191b26]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Control */}
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <select
            id="sort-products-select"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#181a26] border border-gray-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="featured">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>

        {(selectedCategory !== 'all' || selectedFamily !== 'all' || selectedConcentration !== 'all' || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-lg bg-[#1a1d2c] hover:bg-[#222638] text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors border border-gray-800"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search status indicator */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-[#141620] px-4 py-2.5 rounded-xl border border-gray-800 text-xs">
          <span className="text-gray-300">
            Showing results for <strong className="text-[#eed78a]">"{searchQuery}"</strong> ({filteredProducts.length} fragrances found)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-gray-400 hover:text-white underline text-[11px]"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#151722] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mx-auto">
            <Search className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">No fragrances match your filter criteria</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your fragrance family, category, or search terms to uncover our luxury perfumes.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-lg gold-gradient-bg text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110"
          >
            View All Fragrances
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={onQuickView}
              onWhatsAppInquiry={onWhatsAppInquiry}
            />
          ))}
        </div>
      )}
    </div>
  );
};