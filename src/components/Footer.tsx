import React from 'react';
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Sprout
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setFilters } = useShop();
  const { settings } = useSiteSettings();

  const handleCategoryNav = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId, searchQuery: '' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isWhiteBg = settings.footerBgMode === 'white';
  const isLightGreenBg = settings.footerBgMode === 'light-green';
  const isEmeraldBg = settings.footerBgMode === 'emerald';

  const footerRootClass = isWhiteBg
    ? 'bg-white text-gray-700 border-t border-gray-200'
    : isLightGreenBg
    ? 'bg-[#f4faf2] text-[#2d4a34] border-t border-[#d8ecd4]'
    : isEmeraldBg
    ? 'bg-[#1b4332] text-[#d8f3dc] border-t border-[#2d6a4f]'
    : 'bg-[#101c13] text-gray-300 border-t border-[#1c2e20]';

  const dividerClass = isWhiteBg
    ? 'border-gray-200'
    : isLightGreenBg
    ? 'border-[#d8ecd4]'
    : isEmeraldBg
    ? 'border-[#2d6a4f]'
    : 'border-[#1c2e20]';

  const headingTextClass = isWhiteBg
    ? 'text-gray-900 font-extrabold'
    : isLightGreenBg
    ? 'text-[#14321e] font-extrabold'
    : 'text-white font-bold';

  const subtextClass = isWhiteBg
    ? 'text-gray-600'
    : isLightGreenBg
    ? 'text-[#385c3f]'
    : 'text-gray-400';

  const linkHoverClass = isWhiteBg
    ? 'hover:text-emerald-700'
    : isLightGreenBg
    ? 'hover:text-emerald-800'
    : 'hover:text-emerald-400';

  const legalBarBg = isWhiteBg
    ? 'bg-gray-50 border-gray-200 text-gray-500'
    : isLightGreenBg
    ? 'bg-[#e8f5e5] border-[#d8ecd4] text-[#4a6b51]'
    : isEmeraldBg
    ? 'bg-[#143526] border-[#2d6a4f] text-[#a3b8a6]'
    : 'bg-[#0b140d] border-[#1c2e20] text-gray-500';

  const inputBgClass = isWhiteBg
    ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400'
    : isLightGreenBg
    ? 'bg-white border-[#c8e2c4] text-gray-900 placeholder:text-gray-400'
    : 'bg-[#17281c] border-[#243d2b] text-white placeholder:text-gray-500';

  const getFooterLogoFilterStyle = () => {
    const filter = settings.footerLogoFilter === 'match-header' || !settings.footerLogoFilter
      ? settings.logoColorFilter
      : settings.footerLogoFilter;

    switch (filter) {
      case 'invert-white':
        return { filter: 'brightness(0) invert(1)' };
      case 'brightness-boost':
        return { filter: 'brightness(1.8) contrast(1.1)' };
      case 'glow-white':
        return { filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 2px rgba(255, 255, 255, 1))' };
      case 'glow-emerald':
        return { filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 2px rgba(16, 185, 129, 0.8))' };
      case 'gold-glow':
        return { filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9)) sepia(0.3) saturate(1.4)' };
      default:
        return {};
    }
  };

  const footerLogoHeightVal = settings.footerLogoHeight || settings.logoHeight || 52;
  const footerLogoMaxWidthVal = settings.footerLogoMaxWidth || settings.logoMaxWidth || 320;
  const isFooterWhitePill = settings.footerLogoFilter === 'white-pill' || settings.logoBackdropStyle === 'white-pill';

  return (
    <footer className={`${footerRootClass} transition-colors duration-200`}>
      
      {/* Upper Footer: Newsletter & Brand Value */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b ${dividerClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 space-y-2">
            <div className={`flex items-center gap-2 ${isWhiteBg || isLightGreenBg ? 'text-emerald-700' : 'text-emerald-400'} font-bold text-sm tracking-wider uppercase`}>
              <Sparkles className="w-4 h-4" />
              <span>Pure Botanical Nursery Direct</span>
            </div>
            <h3 className={`text-xl sm:text-2xl ${headingTextClass}`}>
              Stay in the loop with seasonal organic advice.
            </h3>
            <p className={`text-xs sm:text-sm ${subtextClass}`}>
              Receive monthly vermicompost care guides, monsoon tips, and exclusive club discounts.
            </p>
          </div>

          <div className="md:col-span-6">
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Thank you for subscribing! Your 10% coupon is PLANSIO10");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className={`flex-1 px-4 py-3 text-xs rounded-xl ${inputBgClass} focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold tracking-wide transition-colors whitespace-nowrap shadow-md"
              >
                Join Free
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info with Custom Photo Logo Support */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                transform: `translate(${settings.footerLogoPositionX || 0}px, ${settings.footerLogoPositionY || 0}px)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              {settings.logoUrl ? (
                settings.logoDisplayMode === 'logo-with-text' ? (
                  <>
                    <div
                      style={{
                        height: `${footerLogoHeightVal}px`,
                        maxWidth: `${footerLogoMaxWidthVal}px`
                      }}
                      className={`rounded-xl flex items-center justify-center transition-all ${
                        isFooterWhitePill
                          ? 'bg-white px-3 py-1.5 shadow-md border border-gray-200'
                          : 'bg-transparent'
                      }`}
                    >
                      <img
                        src={settings.logoUrl}
                        alt={settings.brandName || 'PLANSIO'}
                        referrerPolicy="no-referrer"
                        style={{
                          height: `${footerLogoHeightVal}px`,
                          ...(!isFooterWhitePill ? getFooterLogoFilterStyle() : {})
                        }}
                        className="w-auto max-w-full object-contain"
                      />
                    </div>
                    <span className={`font-extrabold text-xl tracking-tight ${headingTextClass} font-['Poppins']`}>
                      {settings.brandName || 'PLANSIO'}
                    </span>
                  </>
                ) : (
                  <div
                    style={{
                      height: `${footerLogoHeightVal}px`,
                      maxWidth: `${footerLogoMaxWidthVal}px`
                    }}
                    className={`rounded-xl flex items-center justify-center transition-all ${
                      isFooterWhitePill
                        ? 'bg-white px-3 py-1.5 shadow-md border border-gray-200'
                        : 'bg-transparent'
                    }`}
                  >
                    <img
                      src={settings.logoUrl}
                      alt={settings.brandName || 'PLANSIO'}
                      referrerPolicy="no-referrer"
                      style={{
                        height: `${footerLogoHeightVal}px`,
                        ...(!isFooterWhitePill ? getFooterLogoFilterStyle() : {})
                      }}
                      className="w-auto max-w-full object-contain"
                    />
                  </div>
                )
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                    <Sprout className="w-4 h-4 text-emerald-200" />
                  </div>
                  <span className={`font-extrabold text-xl tracking-tight ${headingTextClass} font-['Poppins']`}>
                    {settings.brandName || 'PLANSIO'}
                  </span>
                </>
              )}
            </div>

            <p className={`text-xs ${subtextClass} leading-relaxed max-w-sm`}>
              {settings.brandName || 'PLANSIO'} is India's premium organic gardening brand. We manufacture 100% pure vermicompost, nurture disease-resistant foliage plants, and formulate zero-chemical bio-fertilizers.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs ${isWhiteBg || isLightGreenBg ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border-emerald-200' : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border-emerald-800/40'} font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${headingTextClass} mb-4`}>
              Explore Store
            </h4>
            <ul className={`space-y-2 text-xs ${subtextClass}`}>
              <li>
                <button onClick={() => handleCategoryNav('cat-1')} className={`${linkHoverClass} transition-colors`}>
                  Gold Vermicompost
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('cat-3')} className={`${linkHoverClass} transition-colors`}>
                  Indoor Air Purifiers
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('cat-2')} className={`${linkHoverClass} transition-colors`}>
                  Organic Bio-Fertilizers
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('cat-4')} className={`${linkHoverClass} transition-colors`}>
                  Outdoor Garden Greens
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('cat-6')} className={`${linkHoverClass} transition-colors`}>
                  Pruning & Garden Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${headingTextClass} mb-4`}>
              Gardener Care
            </h4>
            <ul className={`space-y-2 text-xs ${subtextClass}`}>
              <li>
                <button onClick={() => { setActiveTab('tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`${linkHoverClass} transition-colors flex items-center gap-1`}>
                  <Truck className="w-3 h-3 text-emerald-500" />
                  <span>Track Consignment</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('care-guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`${linkHoverClass} transition-colors`}>
                  Plant Care Encyclopedia
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`${linkHoverClass} transition-colors`}>
                  Our Vermiculture Process
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`${linkHoverClass} transition-colors`}>
                  Green Helpline Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${headingTextClass} mb-4`}>
              Get in Touch
            </h4>
            <ul className={`space-y-2.5 text-xs ${subtextClass}`}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nursery & Vermiculture Center, Pune, Maharashtra 411038</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>care@plansio.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className={`border-t ${dividerClass} ${legalBarBg} py-6 text-center text-xs`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName || 'PLANSIO'} Organics Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Shipping & Refunds</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
