import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  Star,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    filters,
    setFilters,
    setActiveQuickViewProduct
  } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and Sort calculation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category_id !== filters.category) {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category_name?.toLowerCase().includes(query);
        const matchesTags = product.benefits?.some(b => b.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesTags) {
          return false;
        }
      }

      // Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      // In stock only
      if (filters.inStockOnly && product.stock_quantity <= 0) {
        return false;
      }

      // Organic only
      if (filters.organicOnly && product.category_id !== 'cat-1' && product.category_id !== 'cat-4') {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [products, filters]);

  const activeCategory = categories.find(c => c.id === filters.category);

  const resetAllFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 2500,
      sortBy: 'featured',
      inStockOnly: false,
      organicOnly: false,
      rating: 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Category Banner / Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1b4332] via-[#24523e] to-[#1b4332] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-[#d8f3dc]">
            {activeCategory ? activeCategory.name : 'Complete Botanical Catalog'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {activeCategory ? activeCategory.name : 'All Organic & Gardening Products'}
          </h1>
          <p className="text-xs sm:text-sm text-[#d8f3dc] leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : 'Discover premium vermicompost manures, healthy nursery-acclimatized plants, and heavy-duty gardening tools.'}
          </p>
        </div>
      </div>

      {/* Search and Category Filter Strip */}
      <div className="space-y-4">
        
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Live Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vermicompost, plants, fertilizers, tools..."
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#2d6a4f] shadow-sm"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2.5 rounded-2xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-xs font-semibold flex items-center gap-1.5 text-[#1b4332] dark:text-[#74c69d]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 border border-[#e2ede0] dark:border-[#243828] rounded-2xl px-3 py-2 bg-white dark:bg-[#142217] shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-transparent text-xs font-medium text-[#1f2d1f] dark:text-white border-none focus:ring-0 cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filters.category === 'all'
                ? 'bg-[#1b4332] text-white shadow-md dark:bg-[#40916c]'
                : 'bg-white dark:bg-[#142217] text-[#526352] dark:text-[#a3b8a6] border border-[#e2ede0] dark:border-[#243828] hover:border-gray-400'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filters.category === cat.id
                  ? 'bg-[#1b4332] text-white shadow-md dark:bg-[#40916c]'
                  : 'bg-white dark:bg-[#142217] text-[#526352] dark:text-[#a3b8a6] border border-[#e2ede0] dark:border-[#243828] hover:border-gray-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar (Desktop Filters) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 p-6 rounded-3xl bg-[#fcfdfc] dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] shadow-sm sticky top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#e2ede0] dark:border-[#243828]">
            <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb] flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Refine Catalog</span>
            </h3>
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#2d6a4f] dark:text-[#74c69d] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">
              <span>Max Price:</span>
              <span className="text-[#1b4332] dark:text-[#74c69d] font-bold">₹{filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-[#1b4332] dark:accent-[#74c69d] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>₹100</span>
              <span>₹2,500+</span>
            </div>
          </div>

          {/* Quick Filter Checkboxes */}
          <div className="space-y-3 pt-3 border-t border-[#e2ede0] dark:border-[#243828]">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#1f2d1f] dark:text-[#eaf2eb]">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={e => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f] dark:bg-gray-800"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#1f2d1f] dark:text-[#eaf2eb]">
              <input
                type="checkbox"
                checked={filters.organicOnly}
                onChange={e => setFilters(prev => ({ ...prev, organicOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f] dark:bg-gray-800"
              />
              <span>100% Certified Organic Manures</span>
            </label>
          </div>

          {/* Star Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-[#e2ede0] dark:border-[#243828]">
            <span className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] block">
              Minimum Rating:
            </span>
            <div className="space-y-1">
              {[4.8, 4.5, 4.0].map(star => (
                <button
                  key={star}
                  onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === star ? 0 : star }))}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    filters.rating === star
                      ? 'bg-[#d8f3dc] text-[#1b4332] dark:bg-[#1b3824] dark:text-[#95d5b2] font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{star}★ and above</span>
                  </div>
                  {filters.rating === star && <Check className="w-3 h-3 text-[#1b4332]" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Area: Products Grid */}
        <div className="lg:col-span-9">
          
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6 text-xs text-[#526352] dark:text-[#a3b8a6]">
            <span>
              Showing <strong>{filteredProducts.length}</strong> botanical products
            </span>
            {(filters.category !== 'all' || filters.searchQuery || filters.inStockOnly || filters.organicOnly || filters.rating > 0) && (
              <button
                onClick={resetAllFilters}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear All Active Filters</span>
              </button>
            )}
          </div>

          {/* Grid View */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4 rounded-3xl bg-[#fcfdfc] dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] p-8">
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center mx-auto text-[#1b4332] dark:text-[#74c69d]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                No matching botanical products found
              </h3>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] max-w-sm mx-auto">
                Try loosening your search filters or browse our pure vermicomposts and indoor plants.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-md dark:bg-[#40916c]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setActiveQuickViewProduct}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
