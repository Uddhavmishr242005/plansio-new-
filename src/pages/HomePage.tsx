import React from 'react';
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
  Quote
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductCard } from '../components/ProductCard';
import { VideoShowcaseSection } from '../components/VideoShowcaseSection';
import { useShop } from '../context/ShopContext';

export const HomePage: React.FC = () => {
  const { products, setFilters, setActiveTab, setActiveQuickViewProduct } = useShop();

  const featuredVermicompost = products.filter(p => p.category_id === 'cat-1' || p.category_id === 'cat-4').slice(0, 4);
  const bestSellers = products.filter(p => p.bestseller).slice(0, 8);
  const newArrivals = products.filter(p => p.featured || p.rating >= 4.8).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 animate-fade-in">
      
      {/* 1. Brand Hero Section */}
      <Hero />

      {/* 2. Category Showcase */}
      <CategorySection />

      {/* 3. Featured Vermicompost & Organic Soil Power Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          
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
                  className="px-6 py-3 rounded-full bg-white text-[#1b4332] text-sm font-bold shadow-lg hover:bg-[#d8f3dc] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>Shop Organic Manures</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredVermicompost.slice(0, 2).map(prod => (
                <div key={prod.id} className="text-left">
                  <ProductCard product={prod} onQuickView={setActiveQuickViewProduct} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2d6a4f] dark:text-[#74c69d]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Botanical Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#eaf2eb] mt-1">
              Bestselling Plants & Organic Supplies
            </h2>
          </div>

          <button
            id="home-view-all-bestsellers-btn"
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setActiveTab('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-[#1b4332] dark:text-[#74c69d] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setActiveQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. NEW VIDEO CONTAINER: Sample Farm & Botanical Masterclass Videos */}
      <VideoShowcaseSection />

      {/* 6. Plant Care & Gardening Guides (Educational Interactive Block) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#f0f7ef] dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] p-8 sm:p-12">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f] dark:text-[#74c69d]">
              Botanical Mastery
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
              Expert Plant Care & Soil Guides
            </h2>
            <p className="text-xs sm:text-sm text-[#526352] dark:text-[#a3b8a6]">
              Simple routines to ensure your houseplants and edible gardens thrive all year round.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Guide Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                Vermicompost Feeding Ratio
              </h3>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
                Add 2 tablespoons for 6-inch pots and 1 cup for 12-inch pots every 15-20 days. Gently aerate the top inch of soil before watering.
              </p>
            </div>

            {/* Guide Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                Watering Gold Standard
              </h3>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
                Always test top 2 inches with your finger. If dry, water deeply until moisture drains from bottom holes. Avoid overwatering roots.
              </p>
            </div>

            {/* Guide Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                Optimal Light Orientation
              </h3>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
                Most indoor foliage loves bright, indirect light near East/North facing windows. Shield delicate leaves from harsh afternoon glare.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Newsletter Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#d8f3dc] dark:bg-[#1b3824] border border-[#b7e4c7] dark:border-[#284e34] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#95d5b2]">
              Join the PLANSIO Green Club
            </h3>
            <p className="text-xs sm:text-sm text-[#2d6a4f] dark:text-[#d8f3dc]">
              Get 10% off your first organic order with coupon <code className="font-bold bg-white/60 dark:bg-black/30 px-1.5 py-0.5 rounded">PLANSIO10</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2.5 rounded-xl border border-[#b7e4c7] dark:border-[#284e34] bg-white dark:bg-[#142217] text-xs text-[#1f2d1f] dark:text-white w-full sm:w-64"
            />
            <button
              onClick={() => alert("Welcome to the PLANSIO Green Club! Use coupon code PLANSIO10 at checkout for 10% off.")}
              className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-md whitespace-nowrap dark:bg-[#40916c]"
            >
              Get Discount
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
