import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { HeroSlideBanner } from '../types/database';

export const Hero: React.FC = () => {
  const { setActiveTab, setFilters } = useShop();
  const { heroBanners } = useSiteSettings();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners: HeroSlideBanner[] = (heroBanners && heroBanners.length > 0)
    ? heroBanners.filter(b => b.isActive !== false)
    : [];

  const slidesToRender = activeBanners.length > 0 ? activeBanners : heroBanners;
  const totalSlides = slidesToRender.length;

  // Safe index bounds
  const safeIndex = currentSlideIndex >= totalSlides ? 0 : currentSlideIndex;

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-advance banner every 6.5 seconds when not paused by hover
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide]);

  const handleAction = (target?: string) => {
    if (!target) return;
    if (target.startsWith('cat-')) {
      setFilters(prev => ({ ...prev, category: target, searchQuery: '' }));
      setActiveTab('home');
      const el = document.getElementById('home-all-products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'shop') {
      setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
      setActiveTab('home');
      const el = document.getElementById('home-all-products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab(target);
    }
  };

  if (!slidesToRender || slidesToRender.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-[#0e1710] py-3 sm:py-5 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Full-Frame Hero Container (Zero vertical bounce, 100% full banner photo) */}
        <div
          id="hero-banner-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md aspect-[16/9] sm:aspect-[2.2/1] lg:aspect-[2.8/1] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] select-none"
        >
          {slidesToRender.map((banner, index) => {
            const isCurrent = index === safeIndex;
            const hasText = (banner.showTextOverlay !== false) && 
              (Boolean(banner.headlineLine1?.trim()) || Boolean(banner.headlineLine2?.trim()) || Boolean(banner.subheadline?.trim()));
            
            const hasPrimaryBtn = banner.showPrimaryButton !== false && Boolean(banner.primaryBtnText?.trim());
            const hasSecondaryBtn = banner.showSecondaryButton !== false && Boolean(banner.secondaryBtnText?.trim());
            const hasButtons = hasPrimaryBtn || hasSecondaryBtn;

            return (
              <div
                key={banner.id || index}
                aria-hidden={!isCurrent}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* 100% Edge-to-Edge Banner Image */}
                <img
                  src={banner.imageUrl}
                  alt={banner.imageAlt || banner.headlineLine1 || 'Hero Banner'}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Text & Button Layer (Only if configured) */}
                {hasText ? (
                  <div className="absolute inset-0 flex items-center">
                    
                    {/* Atmospheric Lighting Overlay for crystal-clear readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent/15" />

                    {/* Content Column */}
                    <div className="relative z-20 px-6 sm:px-12 lg:px-16 py-8 sm:py-12 max-w-2xl space-y-4 sm:space-y-6">
                      
                      {/* Serif Typography */}
                      <div className="space-y-1 sm:space-y-2">
                        {banner.headlineLine1 && (
                          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.12] drop-shadow-md">
                            {banner.headlineLine1}
                          </h1>
                        )}
                        {banner.headlineLine2 && (
                          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-300 font-serif leading-[1.12] drop-shadow-md">
                            {banner.headlineLine2}
                          </h2>
                        )}
                      </div>

                      {/* Subheadline Copy */}
                      {banner.subheadline && (
                        <p className="text-xs sm:text-base text-gray-100 max-w-xl leading-relaxed font-normal drop-shadow-sm line-clamp-3 sm:line-clamp-none">
                          {banner.subheadline}
                        </p>
                      )}

                      {/* Configurable Action Buttons */}
                      {hasButtons && (
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                          
                          {/* Primary CTA */}
                          {hasPrimaryBtn && (
                            <button
                              id={`hero-primary-btn-${banner.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(banner.primaryTarget || 'shop');
                              }}
                              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white text-xs sm:text-sm font-bold tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/40 hover:shadow-xl transition-all duration-200 cursor-pointer"
                            >
                              <span>{banner.primaryBtnText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}

                          {/* Secondary CTA */}
                          {hasSecondaryBtn && (
                            <button
                              id={`hero-secondary-btn-${banner.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(banner.secondaryTarget || 'cat-1');
                              }}
                              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-98 text-white backdrop-blur-md border border-white/30 text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-200 cursor-pointer"
                            >
                              <span>{banner.secondaryBtnText}</span>
                            </button>
                          )}

                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  /* Pure Graphic Banner clickable target */
                  banner.primaryTarget && (
                    <div
                      onClick={() => handleAction(banner.primaryTarget || 'shop')}
                      className="absolute inset-0 cursor-pointer"
                      title="Click to view promotion"
                    />
                  )
                )}

              </div>
            );
          })}

          {/* Navigation Arrows (Rendered when multiple banners exist) */}
          {totalSlides > 1 && (
            <>
              <button
                id="hero-prev-slide-btn"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                id="hero-next-slide-btn"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Dynamic Bottom Indicator Dots */}
              <div className="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-30 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {slidesToRender.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      safeIndex === idx
                        ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-emerald-400 shadow-xs'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

      </div>
    </section>
  );
};



