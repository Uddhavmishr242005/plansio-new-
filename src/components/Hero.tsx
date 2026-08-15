import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Hero: React.FC = () => {
  const { setActiveTab, setFilters } = useShop();
  const { settings } = useSiteSettings();
  const hero = settings.heroBanner;

  const handleAction = (target: string) => {
    if (target === 'shop') {
      setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
      setActiveTab('shop');
    } else if (target === 'vermicompost') {
      setFilters(prev => ({ ...prev, category: 'cat-1', searchQuery: '' }));
      setActiveTab('shop');
    } else if (target === 'indoor-plants') {
      setFilters(prev => ({ ...prev, category: 'cat-3', searchQuery: '' }));
      setActiveTab('shop');
    } else if (target === 'fertilizers') {
      setFilters(prev => ({ ...prev, category: 'cat-2', searchQuery: '' }));
      setActiveTab('shop');
    } else if (target === 'tools') {
      setFilters(prev => ({ ...prev, category: 'cat-6', searchQuery: '' }));
      setActiveTab('shop');
    } else {
      setActiveTab(target);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f6fbf4] via-[#eaf4e8] to-[#f6fbf4] dark:from-[#0e1710] dark:via-[#142418] dark:to-[#0e1710] py-12 md:py-20 lg:py-24 border-b border-[#e2ede0] dark:border-[#243828] transition-colors duration-200">
      
      {/* Decorative Natural Ambient Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#52b788]/10 dark:bg-[#40916c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#b7e4c7]/20 dark:bg-[#1b3824]/30 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8f3dc] dark:bg-[#1b3824] border border-[#b7e4c7] dark:border-[#284e34] text-[#1b4332] dark:text-[#95d5b2] text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f] dark:text-[#74c69d]" />
              <span>{hero.badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1b4332] dark:text-[#eaf2eb] leading-[1.12]">
              {hero.headlineMain} <br />
              <span className="text-[#2d6a4f] dark:text-[#74c69d] font-extrabold">
                {hero.headlineAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#526352] dark:text-[#a3b8a6] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subheadline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-primary-btn"
                onClick={() => handleAction(hero.primaryBtnTarget || 'shop')}
                className="px-7 py-3.5 rounded-full bg-[#1b4332] hover:bg-[#143526] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#1b4332]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 dark:bg-[#40916c] dark:hover:bg-[#52b788]"
              >
                <span>{hero.primaryBtnText || 'SHOP NOW'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {hero.secondaryBtnText && (
                <button
                  id="hero-secondary-btn"
                  onClick={() => handleAction(hero.secondaryBtnTarget || 'indoor-plants')}
                  className="px-6 py-3.5 rounded-full bg-white dark:bg-[#142217] hover:bg-[#f6fbf4] text-[#1b4332] dark:text-[#eaf2eb] border border-[#b7e4c7] dark:border-[#284e34] text-sm font-semibold tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {hero.secondaryBtnText}
                </button>
              )}

              <button
                id="hero-quick-vermicompost-btn"
                onClick={() => handleAction('vermicompost')}
                className="px-5 py-3.5 rounded-full bg-[#d8f3dc]/80 dark:bg-[#1c2e20] text-[#1b4332] dark:text-[#74c69d] text-sm font-semibold hover:bg-[#b7e4c7] transition-colors"
              >
                Vermicompost Gold
              </button>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-semibold text-[#1b4332] dark:text-[#95d5b2]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span>{hero.featureTag1 || '100% Bio-Organic'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span>{hero.featureTag2 || 'Nursery Conditioned'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span>{hero.featureTag3 || 'Authentic Real Reviews'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1f3323] bg-white dark:bg-[#142217] aspect-[4/4.5] group">
                <img
                  src={hero.imageUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'}
                  alt="PLANSIO Organic Nursery & Vermicompost"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Visual Glass Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-[#101c13]/90 backdrop-blur-md border border-[#e2ede0] dark:border-[#243828] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shadow-md">
                      <Leaf className="w-5 h-5 text-[#74c69d]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1b4332] dark:text-[#eaf2eb]">{settings.brandName || 'PLANSIO'}</p>
                      <p className="text-[10px] text-[#526352] dark:text-[#a3b8a6]">Pure Castings & Living Greens</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction('shop')}
                    className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold transition-colors"
                  >
                    View All
                  </button>
                </div>
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-[#1b4332] dark:bg-[#2d6a4f] text-white py-2 px-3.5 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white dark:border-[#142217]">
                <ShieldCheck className="w-4 h-4 text-[#74c69d]" />
                <span className="text-xs font-bold">100% Odor-Free Soil</span>
              </div>

              {/* Floating Free Delivery Tag */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white dark:bg-[#1c2e20] text-[#1b4332] dark:text-[#eaf2eb] py-2 px-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-[#e2ede0] dark:border-[#284e34]">
                <Truck className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span className="text-xs font-bold">Pan-India Dispatch</span>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
