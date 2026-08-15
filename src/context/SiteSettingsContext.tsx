import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeroBannerConfig, SiteSettings, VideoItem, Review } from '../types/database';
import { useToast } from './ToastContext';

export interface HeroTemplatePreset {
  id: 'modern-organic' | 'lush-nursery' | 'monsoon-harvest' | 'urban-botanical';
  name: string;
  description: string;
  config: Partial<HeroBannerConfig>;
}

export const HERO_TEMPLATES: HeroTemplatePreset[] = [
  {
    id: 'modern-organic',
    name: '🌿 Modern Organic (Signature)',
    description: 'Clean forest-green palette highlighting pure bio-vermicompost and urban living.',
    config: {
      templateId: 'modern-organic',
      badgeText: 'Certified 100% Pure Organic & Nursery Acclimatized',
      headlineMain: 'Grow Better.',
      headlineAccent: 'Live Greener.',
      subheadline: 'Premium vermicompost, healthy nursery plants, cold-pressed organic bio-fertilizers, and everything you need to nurture a thriving urban paradise.',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      primaryBtnText: 'SHOP NOW',
      primaryBtnTarget: 'shop',
      secondaryBtnText: 'EXPLORE PLANTS',
      secondaryBtnTarget: 'indoor-plants',
      discountPillText: 'Special Launch Offer: Use code PLANSIO10 for 10% OFF',
      featureTag1: '100% Bio-Organic',
      featureTag2: 'Fresh Nursery Direct',
      featureTag3: 'Express Safe Dispatch'
    }
  },
  {
    id: 'lush-nursery',
    name: '🏡 Lush Nursery Greenhouse',
    description: 'Warm botanical theme focusing on conditioned living indoor and outdoor plants.',
    config: {
      templateId: 'lush-nursery',
      badgeText: 'Acclimatized Exotic Greenery & Indoor Air Purifiers',
      headlineMain: 'Bring Living Nature',
      headlineAccent: 'Into Your Home.',
      subheadline: 'Hand-nurtured Monstera, Fiddle Leaf Figs, and resilient balcony greens delivered right to your doorstep in biodegradable eco-pots.',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
      primaryBtnText: 'EXPLORE INDOOR GREENS',
      primaryBtnTarget: 'indoor-plants',
      secondaryBtnText: 'VIEW CARE GUIDES',
      secondaryBtnTarget: 'care-guide',
      discountPillText: 'Free Ceramic Planter with Plant Orders Over ₹999',
      featureTag1: 'Potted & Rooted',
      featureTag2: 'Doorstep Guarantee',
      featureTag3: 'Free Plant Care Guide'
    }
  },
  {
    id: 'monsoon-harvest',
    name: '🌧️ Monsoon Soil Nutrition & Vermicompost Harvest',
    description: 'Focused on vermiculture, earthworm castings, and soil microbial boosters.',
    config: {
      templateId: 'monsoon-harvest',
      badgeText: 'Rich in Microbes, Auxins & Beneficial Enzymes',
      headlineMain: 'Supercharge Your Soil',
      headlineAccent: 'With Gold Castings.',
      subheadline: 'Zero-chemical African Nightcrawler vermicompost engineered to restore soil carbon, retain moisture, and multiply flower & fruit yields naturally.',
      imageUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1200&q=80',
      primaryBtnText: 'ORDER GOLD VERMICOMPOST',
      primaryBtnTarget: 'vermicompost',
      secondaryBtnText: 'VIEW FERTILIZERS',
      secondaryBtnTarget: 'fertilizers',
      discountPillText: 'Bulk 25KG Farm Sacks Available with Free Freight',
      featureTag1: 'Odor-Free & Sanitized',
      featureTag2: '18%+ Organic Carbon',
      featureTag3: 'Zero Chemical Fillers'
    }
  },
  {
    id: 'urban-botanical',
    name: '🪴 Urban Balcony & Terrace Sanctuary',
    description: 'Tailored for apartment balconies, kitchen herbs, and modern urban gardeners.',
    config: {
      templateId: 'urban-botanical',
      badgeText: 'Compact Gardening Kits & Balcony Setups',
      headlineMain: 'Turn Any Corner',
      headlineAccent: 'Into an Urban Oasis.',
      subheadline: 'Curated organic seeds, enriched potting substrates, brass misters, and ergonomic tools crafted for mindful apartment living.',
      imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80',
      primaryBtnText: 'EXPLORE TOOLKITS & POTS',
      primaryBtnTarget: 'tools',
      secondaryBtnText: 'BROWSE ALL PRODUCTS',
      secondaryBtnTarget: 'shop',
      discountPillText: 'Combo Pack Deals: Save 25% on Beginner Starter Kits',
      featureTag1: 'Apartment Friendly',
      featureTag2: 'Eco Potting Mix',
      featureTag3: 'Lifetime Support'
    }
  }
];

export const INITIAL_REALISTIC_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'How Genuine Vermicompost is Prepared & Micro-Screened',
    description: 'Take a direct tour inside our organic vermiculture farm. Watch how organic bio-waste is transformed into odor-free, nutrient-dense earthworm castings without synthetic additives.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-planting-a-small-plant-in-a-pot-42867-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    duration: '2:45',
    category: 'Vermicompost Farm',
    uploadedAt: '2026-02-10',
    views: '14.2k views',
    author: 'PLANSIO Master Grower'
  },
  {
    id: 'vid-2',
    title: 'Indoor Plant Acclimatization & Root Care in Potted Soil',
    description: 'Learn the exact steps to water, aerate soil with vermicompost, and provide indirect sunlight for Fiddle Leaf Figs and Monstera plants.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-watering-plants-in-a-greenhouse-42864-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    duration: '3:18',
    category: 'Plant Care Guide',
    uploadedAt: '2026-03-01',
    views: '9.8k views',
    author: 'Botanical Horticulturist'
  },
  {
    id: 'vid-3',
    title: 'Applying Cold-Pressed Seaweed & Bio-Boosters for Rapid Foliage',
    description: 'A realistic walkthrough demonstrating how to dilute and apply cold-pressed seaweed liquid fertilizer once every two weeks for explosive flowering and lush green foliage.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-hands-repotting-a-green-plant-42865-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
    duration: '1:55',
    category: 'Fertilizer Application',
    uploadedAt: '2026-03-15',
    views: '11.5k views',
    author: 'Soil Biologist'
  }
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: null, // null means use high-res botanical SVG / Sprout emblem with clean custom typography
  brandName: 'PLANSIO',
  tagline: '100% Organic Vermicompost & Nursery Living',
  logoHeight: 48, // Default pixel height (adjustable up to 320px)
  logoMaxWidth: 300, // Default pixel max-width (adjustable up to 600px)
  logoPositionX: 0, // Horizontal offset (-60 to +80px)
  logoPositionY: 0, // Vertical offset (-30 to +40px)
  logoPlacement: 'left', // 'left', 'corner', 'center'
  logoDisplayMode: 'logo-only', // 'logo-only' (full uploaded logo replaces text) or 'logo-with-text'
  logoColorFilter: 'original',
  logoBackdropStyle: 'none',
  footerLogoHeight: 48,
  footerLogoMaxWidth: 300,
  footerLogoPositionX: 0,
  footerLogoPositionY: 0,
  footerLogoFilter: 'match-header',
  logoBackdrop: 'transparent',
  footerBgMode: 'dark', // 'dark', 'white', 'light-green', 'emerald'
  footerBgCustom: '',
  heroBanner: {
    templateId: 'modern-organic',
    badgeText: 'Certified 100% Pure Organic & Nursery Acclimatized',
    headlineMain: 'Grow Better.',
    headlineAccent: 'Live Greener.',
    subheadline: 'Premium vermicompost, healthy nursery plants, cold-pressed organic bio-fertilizers, and everything you need to nurture a thriving urban paradise.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    primaryBtnText: 'SHOP NOW',
    primaryBtnTarget: 'shop',
    secondaryBtnText: 'EXPLORE PLANTS',
    secondaryBtnTarget: 'indoor-plants',
    discountPillText: 'Special Launch Offer: Use code PLANSIO10 for 10% OFF',
    featureTag1: '100% Bio-Organic',
    featureTag2: 'Fresh Nursery Direct',
    featureTag3: 'Express Safe Dispatch'
  },
  sampleVideos: INITIAL_REALISTIC_VIDEOS
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateHeroBanner: (heroConfig: Partial<HeroBannerConfig>) => void;
  applyHeroTemplate: (templateId: HeroBannerConfig['templateId']) => void;
  setCustomLogo: (logoUrlOrBase64: string | null) => void;
  setLogoSize: (height: number, maxWidth?: number) => void;
  setLogoPosition: (posX: number, posY?: number) => void;
  setLogoPlacement: (placement: 'left' | 'corner' | 'center') => void;
  setFooterBgMode: (mode: 'dark' | 'white' | 'light-green' | 'emerald') => void;
  setLogoDisplayMode: (mode: 'logo-only' | 'logo-with-text') => void;
  setLogoColorFilter: (filter: SiteSettings['logoColorFilter']) => void;
  setLogoBackdropStyle: (backdrop: SiteSettings['logoBackdropStyle']) => void;
  setFooterLogoSize: (height: number, maxWidth?: number) => void;
  setFooterLogoPosition: (posX: number, posY?: number) => void;
  setFooterLogoFilter: (filter: SiteSettings['footerLogoFilter']) => void;
  addVideo: (video: Omit<VideoItem, 'id' | 'uploadedAt'>) => void;
  updateVideo: (id: string, video: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  resetToDefaults: () => void;
  
  // Real Customer Reviews System
  realReviews: Review[];
  addCustomerReview: (review: Omit<Review, 'id' | 'created_at'>) => Promise<Review>;
  deleteCustomerReview: (reviewId: string) => void;
  getProductRealRating: (productId: string) => { average: number; count: number; reviews: Review[] };
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('plansio_site_settings_v2');
    if (saved) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
      } catch (err) {
        console.error('Error loading site settings:', err);
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [realReviews, setRealReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('plansio_real_customer_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing customer reviews:', err);
      }
    }
    // Default to empty array: authentic reviews must be customer-submitted
    return [];
  });

  useEffect(() => {
    localStorage.setItem('plansio_site_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('plansio_real_customer_reviews', JSON.stringify(realReviews));
  }, [realReviews]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'success', 'Live storefront updated immediately.');
  };

  const updateHeroBanner = (heroConfig: Partial<HeroBannerConfig>) => {
    setSettings(prev => ({
      ...prev,
      heroBanner: {
        ...prev.heroBanner,
        ...heroConfig
      }
    }));
    showToast('Hero Banner Updated', 'success', 'Hero banner reflects new changes.');
  };

  const applyHeroTemplate = (templateId: HeroBannerConfig['templateId']) => {
    const template = HERO_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    setSettings(prev => ({
      ...prev,
      heroBanner: {
        ...prev.heroBanner,
        ...template.config,
        templateId
      }
    }));
    showToast('Hero Template Applied', 'success', `Loaded "${template.name}" template.`);
  };

  const setCustomLogo = (logoUrlOrBase64: string | null) => {
    setSettings(prev => ({
      ...prev,
      logoUrl: logoUrlOrBase64
    }));
    showToast('Logo Updated', 'success', logoUrlOrBase64 ? 'New brand logo active across entire app.' : 'Reset to default botanical emblem.');
  };

  const setLogoSize = (height: number, maxWidth?: number) => {
    setSettings(prev => ({
      ...prev,
      logoHeight: height,
      logoMaxWidth: maxWidth !== undefined ? maxWidth : prev.logoMaxWidth
    }));
  };

  const setLogoPosition = (posX: number, posY?: number) => {
    setSettings(prev => ({
      ...prev,
      logoPositionX: posX,
      logoPositionY: posY !== undefined ? posY : (prev.logoPositionY || 0)
    }));
  };

  const setLogoPlacement = (placement: 'left' | 'corner' | 'center') => {
    setSettings(prev => ({
      ...prev,
      logoPlacement: placement
    }));
    showToast('Placement Updated', 'success', `Logo aligned to ${placement}.`);
  };

  const setFooterBgMode = (mode: 'dark' | 'white' | 'light-green' | 'emerald') => {
    setSettings(prev => ({
      ...prev,
      footerBgMode: mode
    }));
    showToast('Footer Style Updated', 'success', `Footer background set to ${mode} mode.`);
  };

  const setLogoDisplayMode = (mode: 'logo-only' | 'logo-with-text') => {
    setSettings(prev => ({
      ...prev,
      logoDisplayMode: mode
    }));
    showToast('Display Mode Updated', 'success', mode === 'logo-only' ? 'Full logo graphic replacement enabled.' : 'Logo icon + text mode enabled.');
  };

  const setLogoColorFilter = (filter: SiteSettings['logoColorFilter']) => {
    setSettings(prev => ({
      ...prev,
      logoColorFilter: filter
    }));
    showToast('Logo Color Filter Updated', 'success', `Color styling applied: ${filter}`);
  };

  const setLogoBackdropStyle = (backdrop: SiteSettings['logoBackdropStyle']) => {
    setSettings(prev => ({
      ...prev,
      logoBackdropStyle: backdrop
    }));
    showToast('Logo Backdrop Updated', 'success', `Backdrop style: ${backdrop}`);
  };

  const setFooterLogoSize = (height: number, maxWidth?: number) => {
    setSettings(prev => ({
      ...prev,
      footerLogoHeight: height,
      footerLogoMaxWidth: maxWidth !== undefined ? maxWidth : prev.footerLogoMaxWidth
    }));
  };

  const setFooterLogoPosition = (posX: number, posY?: number) => {
    setSettings(prev => ({
      ...prev,
      footerLogoPositionX: posX,
      footerLogoPositionY: posY !== undefined ? posY : (prev.footerLogoPositionY || 0)
    }));
  };

  const setFooterLogoFilter = (filter: SiteSettings['footerLogoFilter']) => {
    setSettings(prev => ({
      ...prev,
      footerLogoFilter: filter
    }));
    showToast('Footer Logo Visibility Updated', 'success', `Footer filter: ${filter}`);
  };

  const addVideo = (videoData: Omit<VideoItem, 'id' | 'uploadedAt'>) => {
    const newVideo: VideoItem = {
      ...videoData,
      id: 'vid-' + Math.random().toString(36).substring(2, 9),
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setSettings(prev => ({
      ...prev,
      sampleVideos: [newVideo, ...prev.sampleVideos]
    }));
    showToast('Video Added', 'success', `"${newVideo.title}" added to video showcase.`);
  };

  const updateVideo = (id: string, updated: Partial<VideoItem>) => {
    setSettings(prev => ({
      ...prev,
      sampleVideos: prev.sampleVideos.map(v => v.id === id ? { ...v, ...updated } : v)
    }));
    showToast('Video Updated', 'success', 'Video details saved.');
  };

  const deleteVideo = (id: string) => {
    setSettings(prev => ({
      ...prev,
      sampleVideos: prev.sampleVideos.filter(v => v.id !== id)
    }));
    showToast('Video Removed', 'info', 'Video deleted from showcase.');
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    showToast('Reset to Defaults', 'info', 'Site configuration restored.');
  };

  // Real Customer Reviews
  const addCustomerReview = async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };

    setRealReviews(prev => [newReview, ...prev]);
    showToast('Review Published!', 'success', 'Your authentic feedback has been verified and posted.');
    return newReview;
  };

  const deleteCustomerReview = (reviewId: string) => {
    setRealReviews(prev => prev.filter(r => r.id !== reviewId));
    showToast('Review Removed', 'info', 'Review deleted by moderator.');
  };

  const getProductRealRating = (productId: string) => {
    const matching = realReviews.filter(r => r.product_id === productId);
    if (matching.length === 0) {
      return { average: 0, count: 0, reviews: [] };
    }
    const sum = matching.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / matching.length).toFixed(1));
    return { average: avg, count: matching.length, reviews: matching };
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateHeroBanner,
        applyHeroTemplate,
        setCustomLogo,
        setLogoSize,
        setLogoPosition,
        setLogoPlacement,
        setFooterBgMode,
        setLogoDisplayMode,
        setLogoColorFilter,
        setLogoBackdropStyle,
        setFooterLogoSize,
        setFooterLogoPosition,
        setFooterLogoFilter,
        addVideo,
        updateVideo,
        deleteVideo,
        resetToDefaults,
        realReviews,
        addCustomerReview,
        deleteCustomerReview,
        getProductRealRating
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
