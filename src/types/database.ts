export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  product_count?: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price: number;
  stock_quantity: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  order_id?: string;
  rating: number;
  title: string;
  review_text: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  benefits?: string[];
  how_to_use?: string;
  specifications?: Record<string, string>;
  price: number;
  compare_at_price: number;
  discount_percentage: number;
  sku: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  featured: boolean;
  bestseller: boolean;
  is_active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'customer';
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant | null;
  created_at: string;
  updated_at?: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery';
export type PaymentStatus = 'Pending' | 'Paid' | 'Cash on Delivery' | 'Failed';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  product_image: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  delivery_type: 'Standard' | 'Express';
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface ProductFilter {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  organicOnly?: boolean;
  rating?: number;
  minRating?: number;
  sortBy: 'featured' | 'newest' | 'bestseller' | 'price-low' | 'price-high' | 'price-asc' | 'price-desc' | 'rating';
  searchQuery: string;
}

export interface HeroSlideBanner {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  subheadline?: string;
  showTextOverlay?: boolean;
  textPosition?: 'left' | 'center' | 'right';
  showPrimaryButton?: boolean;
  primaryBtnText?: string;
  primaryTarget?: string;
  showSecondaryButton?: boolean;
  secondaryBtnText?: string;
  secondaryTarget?: string;
  overlayDarkness?: 'none' | 'subtle' | 'medium' | 'gradient-left' | 'gradient-center';
  isActive?: boolean;
}

export interface HeroBannerConfig {
  templateId: 'modern-organic' | 'lush-nursery' | 'monsoon-harvest' | 'urban-botanical' | 'custom';
  badgeText: string;
  headlineMain: string;
  headlineAccent: string;
  subheadline: string;
  imageUrl: string;
  primaryBtnText: string;
  primaryBtnTarget: string;
  secondaryBtnText: string;
  secondaryBtnTarget: string;
  discountPillText: string;
  featureTag1: string;
  featureTag2: string;
  featureTag3: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  uploadedAt: string;
  views?: string;
  author?: string;
}

export interface SiteSettings {
  logoUrl: string | null;
  brandName: string;
  tagline: string;
  logoHeight?: number; // in pixels, e.g. 20 to 320px
  logoMaxWidth?: number; // in pixels, e.g. 80 to 600px
  logoPositionX?: number; // Horizontal offset in pixels (-60 to +80px)
  logoPositionY?: number; // Vertical offset in pixels (-30 to +40px)
  logoPlacement?: 'left' | 'corner' | 'center'; // Positioning alignment in header
  logoDisplayMode?: 'logo-only' | 'logo-with-text'; // full replacement vs icon+text
  logoColorFilter?: 'original' | 'invert-white' | 'brightness-boost' | 'glow-white' | 'glow-emerald' | 'gold-glow';
  logoBackdropStyle?: 'none' | 'white-pill' | 'dark-pill' | 'frosted-glass' | 'emerald-badge';
  
  // Dedicated Footer Logo Controls
  footerLogoHeight?: number; // Footer logo height in px (e.g. 24 to 200px)
  footerLogoMaxWidth?: number; // Footer logo max width in px
  footerLogoPositionX?: number; // Footer logo X offset (-50 to +50px)
  footerLogoPositionY?: number; // Footer logo Y offset (-30 to +30px)
  footerLogoFilter?: 'match-header' | 'original' | 'invert-white' | 'brightness-boost' | 'glow-white' | 'glow-emerald' | 'white-pill';

  logoBackdrop?: 'transparent' | 'light' | 'dark' | 'glass';
  footerBgMode?: 'dark' | 'white' | 'light-green' | 'emerald'; // Lowest part / footer background replacement
  footerBgCustom?: string;
  heroBanner: HeroBannerConfig;
  heroBanners?: HeroSlideBanner[]; // Dynamic multi-banner carousel list
  sampleVideos: VideoItem[];
}

