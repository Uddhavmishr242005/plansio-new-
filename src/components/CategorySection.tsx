import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types/database';
import { getCategories } from '../services/api';
import { useShop } from '../context/ShopContext';

export const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { setFilters, setActiveTab } = useShop();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId, searchQuery: '' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-[#f6fbf4] dark:bg-[#0e1710] border-b border-[#e2ede0] dark:border-[#243828] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2d6a4f] dark:text-[#74c69d]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#eaf2eb] mt-1">
              Curated by Botanical Experts
            </h2>
            <p className="text-sm text-[#526352] dark:text-[#a3b8a6] mt-1 max-w-xl">
              From pure earthworm castings to lush air-purifying foliage and precision shears.
            </p>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setActiveTab('shop');
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b4332] dark:text-[#74c69d] hover:text-[#2d6a4f] group self-start md:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse rounded-2xl bg-[#e2ede0] dark:bg-[#1c2e20] h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(cat => (
              <div
                key={cat.id}
                id={`cat-card-${cat.slug}`}
                onClick={() => handleCategoryClick(cat.id)}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Category Pill on Image */}
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                    {cat.product_count || '4+'} Products
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#1b4332] dark:text-[#eaf2eb] group-hover:text-[#2d6a4f] dark:group-hover:text-[#74c69d] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#526352] dark:text-[#a3b8a6] line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#f6fbf4] dark:bg-[#1c2e20] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d] group-hover:bg-[#1b4332] group-hover:text-white dark:group-hover:bg-[#40916c] transition-colors shrink-0 ml-2">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
