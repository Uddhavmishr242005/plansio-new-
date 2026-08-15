import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, CartItem, WishlistItem, Order, ProductFilter } from '../types/database';
import * as api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface ShopContextType {
  products: Product[];
  categories: Category[];
  fetchProducts: () => Promise<void>;
  isLoadingProducts: boolean;

  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  couponCode: string;
  couponDiscountAmount: number;
  
  // Actions
  addToCart: (product: Product, variantId?: string | null, quantity?: number) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // UI States & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  recentOrder: Order | null;
  setRecentOrder: (order: Order | null) => void;
  activeQuickViewProduct: Product | null;
  setActiveQuickViewProduct: (product: Product | null) => void;
  isDatabaseModalOpen: boolean;
  setIsDatabaseModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  
  // Navigation & Filtering
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: ProductFilter;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilter>>;
  resetFilters: () => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>('home');
  const [filters, setFilters] = useState<ProductFilter>({
    category: 'all',
    minPrice: 0,
    maxPrice: 2500,
    inStockOnly: false,
    organicOnly: false,
    rating: 0,
    minRating: 0,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('plansio_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('plansio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('plansio_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const userId = user?.id || 'guest_or_demo_user';

  // Fetch products and categories
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load cart and wishlist
  const refreshCartAndWishlist = useCallback(async () => {
    try {
      const [c, w] = await Promise.all([api.getCart(userId), api.getWishlist(userId)]);
      setCart(c);
      setWishlist(w);
    } catch (err) {
      console.error('Error loading cart/wishlist:', err);
    }
  }, [userId]);

  useEffect(() => {
    refreshCartAndWishlist();
  }, [refreshCartAndWishlist]);

  // Totals calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.variant ? item.variant.price : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Free shipping threshold: ₹499
  const cartShipping = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 50;
  const cartDiscount = couponDiscountAmount;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const addToCart = async (product: Product, variantId?: string | null, quantity: number = 1) => {
    try {
      await api.addToCart(userId, product, variantId, quantity);
      await refreshCartAndWishlist();
      const variant = variantId ? product.variants.find(v => v.id === variantId) : null;
      const label = variant ? `${product.name} (${variant.value})` : product.name;
      showToast('Added to Cart', 'success', `${label} is in your basket!`);
    } catch (err: any) {
      showToast('Cart Error', 'error', err.message || 'Could not add product to cart');
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await api.updateCartQuantity(cartItemId, quantity);
      await refreshCartAndWishlist();
    } catch (err: any) {
      showToast('Cart Update Failed', 'error', err.message);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await api.removeFromCart(cartItemId);
      await refreshCartAndWishlist();
      showToast('Item Removed', 'info', 'Item has been removed from your basket');
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(userId);
      await refreshCartAndWishlist();
      setCouponCode('');
      setCouponDiscountAmount(0);
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    }
  };

  const toggleWishlist = async (product: Product) => {
    try {
      const isAdded = await api.toggleWishlist(userId, product);
      await refreshCartAndWishlist();
      if (isAdded) {
        showToast('Saved to Wishlist', 'success', `${product.name} added to your favorites.`);
      } else {
        showToast('Removed from Wishlist', 'info', `${product.name} removed from favorites.`);
      }
    } catch (err: any) {
      showToast('Wishlist Error', 'error', err.message);
    }
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlist.some(w => w.product_id === productId);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PLANSIO10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setCouponCode(clean);
      setCouponDiscountAmount(disc);
      showToast('Coupon Applied!', 'success', 'Enjoy 10% instant discount on your order.');
      return true;
    } else if (clean === 'GREENLIFE' || clean === 'ORGANIC50') {
      const disc = Math.min(100, Math.round(cartSubtotal * 0.15));
      setCouponCode(clean);
      setCouponDiscountAmount(disc);
      showToast('Coupon Applied!', 'success', `₹${disc} discount has been applied.`);
      return true;
    } else {
      showToast('Invalid Coupon', 'error', 'Try code PLANSIO10 or GREENLIFE for savings.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountAmount(0);
    showToast('Coupon Removed', 'info');
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 2500,
      inStockOnly: false,
      organicOnly: false,
      rating: 0,
      minRating: 0,
      sortBy: 'featured',
      searchQuery: ''
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        fetchProducts,
        isLoadingProducts,
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        couponCode,
        couponDiscountAmount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        recentOrder,
        setRecentOrder,
        activeQuickViewProduct,
        setActiveQuickViewProduct,
        isDatabaseModalOpen,
        setIsDatabaseModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
