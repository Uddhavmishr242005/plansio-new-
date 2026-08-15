import React, { useEffect, useState } from 'react';
import { Category } from '../types/database';
import { getCategories } from '../services/api';
import { useShop } from '../context/ShopContext';

// Explicit curated category items matching the client's mockup design
interface CategoryDisplayItem {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  customComponent?: boolean;
}

const MOCKUP_CATEGORIES: CategoryDisplayItem[] = [
  {
    id: 'cat-1',
    slug: 'indoor-plants',
    name: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-2',
    slug: 'outdoor-plants',
    name: 'Outdoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-3',
    slug: 'pots-planters',
    name: 'Pots & Planters',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-4',
    slug: 'vermicompost',
    name: 'Vermicompost',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-5',
    slug: 'seeds-soil',
    name: 'Seeds & Soil',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-6',
    slug: 'plant-care',
    name: 'Plant Care',
    imageUrl: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=400&q=85',
  },
  {
    id: 'cat-7',
    slug: 'gift-cards',
    name: 'Gift Cards',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=85',
    customComponent: true,
  }
];

export const CategorySection: React.FC = () => {
  const { categories, setFilters, setActiveTab } = useShop();

  const handleCategoryClick = (categoryId: string, slug?: string) => {
    // Keep user on HomePage so Hero Banner remains visible
    setFilters(prev => ({ ...prev, category: categoryId, searchQuery: '' }));
    setActiveTab('home');
    const el = document.getElementById('home-all-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Merge loaded categories with live updated photos/names
  const displayCategories = MOCKUP_CATEGORIES.map(m => {
    const matched = categories.find(c => c.slug === m.slug || c.id === m.id || c.name.toLowerCase() === m.name.toLowerCase());
    return {
      ...m,
      id: matched ? matched.id : m.id,
      name: matched ? matched.name : m.name,
      imageUrl: (matched && matched.image_url) ? matched.image_url : m.imageUrl
    };
  });

  return (
    <section className="bg-white dark:bg-[#0e1710] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Soft Warm Cream Card Container matching client's mockup */}
        <div className="rounded-3xl bg-[#faf6ee] dark:bg-[#16271c] border border-[#eee5d8] dark:border-[#25422e] p-8 sm:p-10 lg:p-12 shadow-xs">
          
          {/* Header with Title and Centered Leaf Divider Line */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#f2f8f3] font-serif tracking-tight">
              Shop by Category
            </h2>
            
            {/* Center Leaf Line Divider ── 🌿 ── */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="w-12 sm:w-16 h-px bg-gray-400 dark:bg-gray-600" />
              <div className="text-[#0e3b24] dark:text-emerald-400 text-sm flex items-center justify-center">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
              </div>
              <div className="w-12 sm:w-16 h-px bg-gray-400 dark:bg-gray-600" />
            </div>
          </div>

          {/* 7 Circular Category Items Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-6 lg:gap-4 justify-items-center">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                id={`category-circle-${cat.slug}`}
                onClick={() => handleCategoryClick(cat.id, cat.slug)}
                className="group flex flex-col items-center text-center cursor-pointer focus:outline-none w-full"
              >
                {/* Circular Image Frame with subtle ambient glow */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-b from-[#f2e7d7] to-[#e8dac7] dark:from-[#213828] dark:to-[#17271c] p-1.5 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#0e3b24]/40 transition-all duration-300">
                  
                  {cat.customComponent && !cat.imageUrl ? (
                    // Luxury PLANSIO Green & Gold Gift Card matching mockup
                    <div className="w-full h-full rounded-full bg-[#0d3b23] flex flex-col items-center justify-center p-2 text-white relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffd166_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                      <div className="w-full h-1.5 bg-[#ffd166] my-auto absolute top-1/2 -translate-y-1/2 left-0 right-0 shadow-xs" />
                      <div className="relative z-10 text-center bg-[#0d3b23] px-2 py-0.5 rounded border border-[#ffd166]/40">
                        <span className="block text-[8px] sm:text-[9px] font-black tracking-widest text-[#ffd166] uppercase">
                          PLANSIO
                        </span>
                        <span className="block text-[6px] text-white/90 tracking-wider">
                          GIFT CARD
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#101e14] flex items-center justify-center">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                </div>

                {/* Category Label below Circle */}
                <span className="mt-3.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-[#eaf2eb] group-hover:text-[#0e3b24] dark:group-hover:text-emerald-400 group-hover:font-semibold transition-colors duration-200">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
