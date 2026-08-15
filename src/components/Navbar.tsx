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
    isAdmin,
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
    { id: 'cat-1', label: 'Plants', categoryId: 'cat-1' },
    { id: 'cat-3', label: 'Planters', categoryId: 'cat-3' },
    { id: 'cat-4', label: 'Vermicompost', categoryId: 'cat-4' },
    { id: 'cat-5', label: 'Seeds & Soil', categoryId: 'cat-5' },
    { id: 'cat-6', label: 'Plant Care', categoryId: 'cat-6' },
    { id: 'cat-7', label: 'Gift Cards', categoryId: 'cat-7' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0e1710]/95 border-b border-gray-200 dark:border-[#243828] transition-colors duration-200">
      {/* Top Announcement Banner */}
      <div className="bg-[#0e3b24] text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-xs">
        <span>🚚 FREE SHIPPING on orders above ₹999 | Extra 5% OFF on Prepaid Orders 🎁</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
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
              className="flex items-center gap-2.5 text-left group p-1 -ml-1 rounded-2xl hover:opacity-90 transition-all duration-200 focus:outline-none cursor-pointer"
              title={`Go to ${settings.brandName || 'PLANSIO'} Home`}
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.brandName || 'PLANSIO'}
                  referrerPolicy="no-referrer"
                  style={{
                    height: `${settings.logoHeight || 44}px`,
                    maxWidth: `${settings.logoMaxWidth || 300}px`
                  }}
                  className="w-auto max-w-full object-contain select-none"
                />
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0e3b24] dark:text-emerald-400 font-serif leading-none">
                      PLANSIO
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm -mt-3 font-serif">🌱</span>
                  </div>
                  <span className="text-[10px] font-medium tracking-wide text-gray-600 dark:text-gray-400 block -mt-0.5">
                    Plant. Decor. Live Better.
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links with Dropdown Indicators */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
              }}
              className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#0e3b24] dark:text-emerald-400 font-bold border-b-2 border-[#0e3b24] dark:border-emerald-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-[#0e3b24]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-1', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] flex items-center gap-1 cursor-pointer"
            >
              <span>Plants</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-3', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] flex items-center gap-1 cursor-pointer"
            >
              <span>Planters</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-4', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] flex items-center gap-1 cursor-pointer"
            >
              <span>Vermicompost</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-5', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] flex items-center gap-1 cursor-pointer"
            >
              <span>Seeds & Soil</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-6', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] flex items-center gap-1 cursor-pointer"
            >
              <span>Plant Care</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'cat-7', searchQuery: '' }));
                setActiveTab('home');
                const el = document.getElementById('home-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#0e3b24] cursor-pointer"
            >
              Gift Cards
            </button>
          </nav>

          {/* Right Action Section: Search Bar & Icons */}
          <div className="flex items-center gap-3">
            
            {/* Inline Search Bar matching Mockup */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 sm:w-60 lg:w-64">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for plants, pots..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-3.5 pr-9 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#142217] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0e3b24]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0e3b24]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* User Profile Button / Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {user ? (
                <button
                  id="nav-user-profile-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="User account"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#0e3b24] bg-[#eaf4ee] flex items-center justify-center text-xs font-bold text-[#0e3b24]">
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
                  <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
                </button>
              ) : (
                <button
                  id="nav-user-profile-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="User account"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#142217] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-[#0e3b24] dark:text-[#eaf2eb] truncate">
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
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-[#0e3b24]" />
                    <span>My Account & Orders</span>
                  </button>

                  <button
                    id="user-tracking-menu-item"
                    onClick={() => {
                      setActiveTab('tracking');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                  >
                    <Truck className="w-4 h-4 text-[#0e3b24]" />
                    <span>Track Live Delivery</span>
                  </button>

                  <button
                    id="user-wishlist-menu-item"
                    onClick={() => {
                      setActiveTab('wishlist');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-[#f6fbf4] dark:hover:bg-[#1c2e20] flex items-center gap-2.5"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Saved Wishlist</span>
                  </button>

                  {isAdmin && (
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
                  )}

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

            {/* Admin Console Quick Pill (Only for Administrator) */}
            {isAdmin && (
              <button
                id="nav-admin-quick-btn"
                onClick={() => setActiveTab('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700 shadow-xs hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all cursor-pointer"
                title="Open Administrator Console"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0e3b24] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

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
                  setActiveTab('home');
                  const el = document.getElementById('home-all-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab(link.id);
                  if (link.id === 'home') {
                    setFilters(prev => ({ ...prev, category: 'all' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
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
          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Console</span>
            </button>
          )}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <button
              onClick={() => {
                setActiveTab('tracking');
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-[#2d6a4f] dark:text-[#74c69d] flex items-center gap-1.5 px-3 py-1.5"
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
