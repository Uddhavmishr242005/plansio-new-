import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sprout,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    filters,
    setFilters
  } = useShop();

  const {
    user,
    profile,
    setIsAuthOpen,
    setAuthMode,
    logout
  } = useAuth();

  const { settings } = useSiteSettings();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: searchInput }));
    setActiveTab('shop');
    setIsSearchOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'vermicompost', label: 'Vermicompost', categoryId: 'cat-1' },
    { id: 'indoor-plants', label: 'Indoor Plants', categoryId: 'cat-3' },
    { id: 'fertilizers', label: 'Organic Fertilizers', categoryId: 'cat-2' },
    { id: 'tools', label: 'Gardening Tools', categoryId: 'cat-6' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f6fbf4]/90 dark:bg-[#0e1710]/90 border-b border-[#e2ede0] dark:border-[#243828] transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-[#1b4332] text-[#d8f3dc] text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>🌱 {settings.heroBanner?.discountPillText || 'Special Launch Offer: Use code PLANSIO10 for 10% OFF'}</span>
        <span className="hidden md:inline text-white/50">•</span>
        <span className="hidden md:inline">🚚 Free Express Delivery on orders above ₹499</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Supports Dynamic Custom Uploaded Transparent Logo with Sizing, Filters and Position Offsets */}
          <div
            className={`flex items-center gap-2 ${
              settings.logoPlacement === 'corner' ? '-ml-2 sm:-ml-4' : ''
            }`}
            style={{
              transform: `translate(${settings.logoPositionX || 0}px, ${settings.logoPositionY || 0}px)`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            <button
              id="nav-logo-btn"
              onClick={() => {
                setActiveTab('home');
                setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
              }}
              className="flex items-center gap-2.5 text-left group p-1 -ml-1 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-white/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]"
              title={`Go to ${settings.brandName || 'PLANSIO'} Home`}
            >
              {settings.logoUrl ? (
                // Custom Uploaded Entire Logo (with Background Removed / Transparency Support)
                settings.logoDisplayMode === 'logo-with-text' ? (
                  <>
                    <div
                      style={{
                        height: `${settings.logoHeight || 44}px`,
                        maxWidth: `${settings.logoMaxWidth || 300}px`
                      }}
                      className={`flex items-center justify-center overflow-hidden rounded-xl transition-all duration-200 ${
                        settings.logoBackdropStyle === 'white-pill'
                          ? 'bg-white px-3 py-1 shadow-sm border border-gray-200'
                          : settings.logoBackdropStyle === 'dark-pill'
                          ? 'bg-[#101c13] px-3 py-1 shadow-sm border border-white/10'
                          : settings.logoBackdropStyle === 'frosted-glass'
                          ? 'bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1 shadow-sm border border-white/30'
                          : settings.logoBackdropStyle === 'emerald-badge'
                          ? 'bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-sm'
                          : 'bg-transparent'
                      }`}
                    >
                      <img
                        src={settings.logoUrl}
                        alt={settings.brandName || 'Company Logo'}
                        referrerPolicy="no-referrer"
                        style={{
                          height: `${settings.logoHeight || 44}px`,
                          ...(settings.logoColorFilter === 'invert-white'
                            ? { filter: 'brightness(0) invert(1)' }
                            : settings.logoColorFilter === 'brightness-boost'
                            ? { filter: 'brightness(1.6) contrast(1.15)' }
                            : settings.logoColorFilter === 'glow-white'
                            ? { filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 2px rgba(255, 255, 255, 1))' }
                            : settings.logoColorFilter === 'glow-emerald'
                            ? { filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 2px rgba(16, 185, 129, 0.8))' }
                            : settings.logoColorFilter === 'gold-glow'
                            ? { filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9)) sepia(0.3) saturate(1.4)' }
                            : {})
                        }}
                        className="w-auto max-w-full object-contain select-none transition-transform duration-200 group-hover:scale-102"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-2xl font-black tracking-tight text-[#1b4332] dark:text-[#74c69d] block leading-none font-['Poppins'] group-hover:text-[#2d6a4f] dark:group-hover:text-[#95d5b2] transition-colors">
                        {settings.brandName || 'PLANSIO'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#526352] dark:text-[#a3b8a6] block mt-0.5 group-hover:text-[#1b4332] dark:group-hover:text-[#d8f3dc] transition-colors">
                        {settings.tagline || 'Grow Better. Live Greener.'}
                      </span>
                    </div>
                  </>
                ) : (
                  // Full Logo Image (Complete replacement of brand mark + text)
                  <div
                    style={{
                      height: `${settings.logoHeight || 48}px`,
                      maxWidth: `${settings.logoMaxWidth || 320}px`
                    }}
                    className={`flex items-center justify-center overflow-hidden rounded-xl transition-all duration-200 ${
                      settings.logoBackdropStyle === 'white-pill'
                        ? 'bg-white px-3 py-1 shadow-sm border border-gray-200'
                        : settings.logoBackdropStyle === 'dark-pill'
                        ? 'bg-[#101c13] px-3 py-1 shadow-sm border border-white/10'
                        : settings.logoBackdropStyle === 'frosted-glass'
                        ? 'bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1 shadow-sm border border-white/30'
                        : settings.logoBackdropStyle === 'emerald-badge'
                        ? 'bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-sm'
                        : 'bg-transparent'
                    }`}
                  >
                    <img
                      src={settings.logoUrl}
                      alt={settings.brandName || 'Company Logo'}
                      referrerPolicy="no-referrer"
                      style={{
                        height: `${settings.logoHeight || 48}px`,
                        ...(settings.logoColorFilter === 'invert-white'
                          ? { filter: 'brightness(0) invert(1)' }
                          : settings.logoColorFilter === 'brightness-boost'
                          ? { filter: 'brightness(1.6) contrast(1.15)' }
                          : settings.logoColorFilter === 'glow-white'
                          ? { filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 2px rgba(255, 255, 255, 1))' }
                          : settings.logoColorFilter === 'glow-emerald'
                          ? { filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 2px rgba(16, 185, 129, 0.8))' }
                          : settings.logoColorFilter === 'gold-glow'
                          ? { filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9)) sepia(0.3) saturate(1.4)' }
                          : {})
                      }}
                      className="w-auto max-w-full object-contain select-none transition-transform duration-200 group-hover:scale-102"
                    />
                  </div>
                )
              ) : (
                // Default Botanical Emblem & PLANSIO Typography
                <>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1b4332] via-[#24533e] to-[#2d6a4f] dark:from-[#2d6a4f] dark:to-[#52b788] flex items-center justify-center text-white shadow-md shadow-[#1b4332]/25 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#1b4332]/30 transition-all duration-300 ring-2 ring-emerald-500/20">
                    <Sprout className="w-6 h-6 text-[#d8f3dc]" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-2xl font-black tracking-tight text-[#1b4332] dark:text-[#74c69d] block leading-none font-['Poppins'] group-hover:text-[#2d6a4f] dark:group-hover:text-[#95d5b2] transition-colors">
                      {settings.brandName || 'PLANSIO'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526352] dark:text-[#a3b8a6] block mt-0.5 group-hover:text-[#1b4332] dark:group-hover:text-[#d8f3dc] transition-colors">
                      {settings.tagline || 'Grow Better. Live Greener.'}
                    </span>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  if (link.categoryId) {
                    setFilters(prev => ({ ...prev, category: link.categoryId, searchQuery: '' }));
                    setActiveTab('shop');
                  } else {
                    setActiveTab(link.id);
                    if (link.id === 'shop') setFilters(prev => ({ ...prev, category: 'all' }));
                  }
                }}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === link.id || (link.categoryId && filters.category === link.categoryId && activeTab === 'shop')
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0]/70 dark:hover:bg-[#1c2e20]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Admin Panel Quick Access */}
            <button
              id="nav-admin-panel-btn"
              onClick={() => setActiveTab('admin')}
              title="Open Admin Panel"
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#1b4332] text-white border-[#1b4332] dark:bg-[#40916c] dark:border-[#40916c]'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Search Trigger */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search vermicompost, plants..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-sm bg-white dark:bg-[#142217] border border-[#2d6a4f] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] text-[#1f2d1f] dark:text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  id="nav-search-btn"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              id="nav-wishlist-btn"
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 rounded-full text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1b4332] text-white text-[11px] font-bold flex items-center justify-center dark:bg-[#52b788]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {user ? (
                <div>
                  <button
                    id="user-menu-btn"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2d6a4f] bg-[#d8f3dc] flex items-center justify-center text-xs font-bold text-[#1b4332]">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'User'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#142217] rounded-2xl shadow-xl border border-[#e2ede0] dark:border-[#243828] py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-[#1b4332] dark:text-[#eaf2eb] truncate">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      <button
                        id="user-profile-menu-item"
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-[#2d6a4f]" />
                        <span>My Account & Orders</span>
                      </button>

                      <button
                        id="user-tracking-menu-item"
                        onClick={() => {
                          setActiveTab('tracking');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                      >
                        <Truck className="w-4 h-4 text-[#2d6a4f]" />
                        <span>Track Live Delivery</span>
                      </button>

                      <button
                        id="user-wishlist-menu-item"
                        onClick={() => {
                          setActiveTab('wishlist');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>My Saved Wishlist</span>
                      </button>

                      <button
                        id="user-admin-menu-item"
                        onClick={() => {
                          setActiveTab('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Console</span>
                      </button>

                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                      
                      <button
                        id="user-logout-btn"
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    id="nav-login-btn"
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#1b4332] text-white hover:bg-[#143526] transition-colors dark:bg-[#40916c] dark:hover:bg-[#52b788]"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                if (link.categoryId) {
                  setFilters(prev => ({ ...prev, category: link.categoryId, searchQuery: '' }));
                  setActiveTab('shop');
                } else {
                  setActiveTab(link.id);
                  if (link.id === 'shop') setFilters(prev => ({ ...prev, category: 'all' }));
                }
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-[#1b4332] text-white'
                  : 'text-[#1f2d1f] dark:text-[#eaf2eb] hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tracking');
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-[#2d6a4f] dark:text-[#74c69d] flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
