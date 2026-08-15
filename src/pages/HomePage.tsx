import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Sprout,
  Droplets,
  Sun,
  Star,
  Search,
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Filter,
  Check
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductCard } from '../components/ProductCard';
import { VideoShowcaseSection } from '../components/VideoShowcaseSection';
import { useShop } from '../context/ShopContext';

export const HomePage: React.FC = () => {
  const { products, categories, filters, setFilters, setActiveTab, setActiveQuickViewProduct } = useShop();

  // Local state for Home Page All Products Filter
  const selectedHomeCategory = filters.category || 'all';
  const [homeSearch, setHomeSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(12);

  const handleCategorySelect = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  // Compute products for home catalog
  const filteredHomeProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedHomeCategory !== 'all' && product.category_id !== selectedHomeCategory) {
        return false;
      }

      // Search
      if (homeSearch.trim()) {
        const query = homeSearch.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // Stock
      if (onlyInStock && product.stock_quantity <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedHomeCategory, homeSearch, sortBy, onlyInStock]);

  const visibleProducts = filteredHomeProducts.slice(0, displayCount);

  return (
    <div className="bg-white dark:bg-[#0e1710] space-y-12 sm:space-y-20 pb-16 animate-fade-in transition-colors duration-200">
      
      {/* 1. Long Botanical Panoramic Hero Banner */}
      <Hero />

      {/* 2. Category Section with Visible Lining & 'Explore Categories' */}
      <CategorySection />

      {/* 3. ALL PRODUCTS SECTION (Appears immediately below categories) */}
      <section id="home-all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lined Header for All Products */}
        <div className="relative flex items-center justify-center my-4 mb-8">
          <div className="w-full border-t border-gray-200 dark:border-gray-800 absolute" />
          <div className="relative bg-white dark:bg-[#0e1710] px-6 py-2 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
              ALL PRODUCTS
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </div>
        </div>

        {/* Section Title & Subheading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-[#eaf2eb] tracking-tight">
              All Plants, Vermicompost & Gardening Supplies
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
              Showing {filteredHomeProducts.length} nursery-fresh items ready for direct doorstep dispatch.
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px] sm:min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search all products..."
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#142217] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#142217] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedHomeCategory === 'all'
                ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-600'
                : 'bg-gray-100 dark:bg-[#142217] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedHomeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-gray-100 dark:bg-[#142217] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredHomeProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-[#142217] rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No products found matching your search.</h3>
            <p className="text-xs text-gray-500 mt-1">Try clearing search filters or selecting another category.</p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setHomeSearch('');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setActiveQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Load More Button if remaining products */}
        {displayCount < filteredHomeProducts.length && (
          <div className="text-center pt-10">
            <button
              onClick={() => setDisplayCount(prev => prev + 12)}
              className="px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Load More Products ({filteredHomeProducts.length - displayCount} remaining)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>

      {/* 4. SAMPLE VIDEOS SECTION (Appears immediately after products) */}
      <VideoShowcaseSection />

      {/* 5. Featured Vermicompost & Organic Soil Power Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
          
          {/* Ambient organic circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#d8f3dc]">
                <Leaf className="w-3.5 h-3.5" />
                <span>The Black Gold of Gardening</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Why Pure Vermicompost Transforms Your Plants
              </h2>
              <p className="text-sm sm:text-base text-[#d8f3dc] leading-relaxed">
                Vermicompost is 100% natural organic manure enriched with beneficial soil microbes, nitrogen, phosphorus, and essential micro-nutrients. Unlike synthetic fertilizers, it rejuvenates dead soil and never burns delicate roots.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#95d5b2] shrink-0" />
                  <span>5x more bio-available nitrogen</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#95d5b2] shrink-0" />
                  <span>Improves water retention by 40%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#95d5b2] shrink-0" />
                  <span>Zero chemical residue</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#95d5b2] shrink-0" />
                  <span>100% odorless & sterilized</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="home-explore-vermicompost-btn"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'cat-1', searchQuery: '' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-white text-[#1b4332] text-sm font-bold shadow-lg hover:bg-[#d8f3dc] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Shop Organic Manures</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.filter(p => p.category_id === 'cat-1' || p.category_id === 'cat-4').slice(0, 2).map(prod => (
                <div key={prod.id} className="text-left">
                  <ProductCard product={prod} onQuickView={setActiveQuickViewProduct} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Plant Care & Gardening Guides (Educational Interactive Block on Pure White) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-[#142217] border border-gray-200 dark:border-[#243828] p-8 sm:p-12 shadow-xs">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#74c69d]">
              Botanical Mastery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-[#eaf2eb]">
              Expert Plant Care & Soil Guides
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Simple routines to ensure your houseplants and edible gardens thrive all year round.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Guide Card 1 */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1c2e20] border border-gray-200 dark:border-[#243828] space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-[#1b3824] flex items-center justify-center text-emerald-800 dark:text-[#74c69d]">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-[#eaf2eb]">
                Vermicompost Feeding Ratio
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#a3b8a6] leading-relaxed">
                Add 2 tablespoons for 6-inch pots and 1 cup for 12-inch pots every 15-20 days. Gently aerate the top inch of soil before watering.
              </p>
            </div>

            {/* Guide Card 2 */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1c2e20] border border-gray-200 dark:border-[#243828] space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-[#1b3824] flex items-center justify-center text-emerald-800 dark:text-[#74c69d]">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-[#eaf2eb]">
                Watering Gold Standard
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#a3b8a6] leading-relaxed">
                Always test top 2 inches with your finger. If dry, water deeply until moisture drains from bottom holes. Avoid overwatering roots.
              </p>
            </div>

            {/* Guide Card 3 */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1c2e20] border border-gray-200 dark:border-[#243828] space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-[#1b3824] flex items-center justify-center text-emerald-800 dark:text-[#74c69d]">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-[#eaf2eb]">
                Optimal Light Orientation
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#a3b8a6] leading-relaxed">
                Most indoor foliage loves bright, indirect light near East/North facing windows. Shield delicate leaves from harsh afternoon glare.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Newsletter Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-emerald-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Join the PLANSIO Green Club
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              Get 10% off your first organic order with coupon <code className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">PLANSIO10</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2.5 rounded-xl border border-emerald-700 bg-emerald-950/80 text-xs text-white placeholder:text-emerald-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={() => alert("Welcome to the PLANSIO Green Club! Use coupon code PLANSIO10 at checkout for 10% off.")}
              className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-gray-950 text-xs font-bold shadow-md whitespace-nowrap cursor-pointer transition-colors"
            >
              Get Discount
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

