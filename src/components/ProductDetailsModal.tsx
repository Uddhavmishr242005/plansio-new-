import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  Send,
  Plus,
  Minus,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Product } from '../types/database';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import * as api from '../services/api';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isWishlisted, setIsCheckoutOpen } = useShop();
  const { user, profile, setIsAuthOpen, setAuthMode } = useAuth();
  const { showToast } = useToast();
  const { getProductRealRating, addCustomerReview } = useSiteSettings();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'benefits' | 'how-to' | 'specs' | 'reviews'>('desc');
  const [isAdding, setIsAdding] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const realRatingData = getProductRealRating(product.id);
  const displayRating = realRatingData.count > 0 ? realRatingData.average : 0;
  const displayReviewCount = realRatingData.count > 0 ? realRatingData.count : 0;
  const allReviews = [...realRatingData.reviews, ...(product.reviews || [])];

  const isFavorited = isWishlisted(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [
    { id: 'def', product_id: product.id, image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', sort_order: 1, is_primary: true, created_at: '' }
  ];

  const currentVariant = selectedVariantId
    ? product.variants.find(v => v.id === selectedVariantId)
    : null;

  const currentPrice = currentVariant ? currentVariant.price : product.price;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, selectedVariantId, quantity);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = async () => {
    await addToCart(product, selectedVariantId, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Authentication Required', 'warning', 'Please sign in or continue as guest to post a review.');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    if (!reviewTitle.trim() || !reviewText.trim()) {
      showToast('Missing Fields', 'warning', 'Please provide a title and review message.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Save review to local site settings & trigger re-render
      await addCustomerReview({
        product_id: product.id,
        user_id: user.id,
        user_name: profile?.full_name || 'PLANSIO Gardener',
        user_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        rating: reviewRating,
        title: reviewTitle.trim(),
        review_text: reviewText.trim(),
        is_verified_purchase: true
      });

      // Also attempt backend persistence
      try {
        await api.createReview(
          product.id,
          user.id,
          profile?.full_name || 'PLANSIO Member',
          reviewRating,
          reviewTitle,
          reviewText
        );
      } catch (backendErr) {
        console.warn('Backend review sync notice:', backendErr);
      }

      setReviewTitle('');
      setReviewText('');
      setActiveTab('reviews');
    } catch (err: any) {
      showToast('Error', 'error', err.message || 'Could not submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied', 'info', 'Product link copied to your clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-[#1c2e20]/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f0f7ef] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] shadow-inner">
              <img
                src={images[selectedImageIndex]?.image_url || images[0].image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-110 cursor-zoom-in"
              />

              {/* Badges on main image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.bestseller && (
                  <span className="px-2.5 py-1 rounded-full bg-[#1b4332] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Bestseller
                  </span>
                )}
                {product.discount_percentage > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wide shadow-sm">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#1b4332] scale-105 shadow-md dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-[#526352] dark:text-[#a3b8a6]">
              <div className="p-2 rounded-xl bg-[#f6fbf4] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span className="font-semibold">Fast Dispatch</span>
              </div>
              <div className="p-2 rounded-xl bg-[#f6fbf4] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span className="font-semibold">100% Organic</span>
              </div>
              <div className="p-2 rounded-xl bg-[#f6fbf4] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span className="font-semibold">Live Plant Safe</span>
              </div>
            </div>

          </div>

          {/* Right Column: Product Overview & Buy Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f] dark:text-[#74c69d]">
                  {product.category_name || 'Organic Garden'}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  {displayReviewCount > 0 ? (
                    <>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star
                            key={st}
                            className={`w-3.5 h-3.5 ${st <= Math.round(displayRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[#1f2d1f] dark:text-[#eaf2eb]">{displayRating}</span>
                      <span className="text-gray-400">({displayReviewCount} real reviews)</span>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-gray-300" />
                      <span>Unrated • Be the first to review</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#eaf2eb] leading-tight">
                {product.name}
              </h2>

              {/* SKU */}
              <p className="text-[11px] text-gray-400 font-mono">SKU: {product.sku}</p>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-[#f6fbf4] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828]">
                <span className="text-2xl sm:text-3xl font-black text-[#1b4332] dark:text-[#74c69d]">
                  ₹{currentPrice}
                </span>
                {product.compare_at_price > currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.compare_at_price}
                  </span>
                )}
                {product.discount_percentage > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold">
                    Save ₹{product.compare_at_price - currentPrice} ({product.discount_percentage}%)
                  </span>
                )}
              </div>

              {/* Short Summary */}
              <p className="text-xs sm:text-sm text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
                {product.short_description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-[#1f2d1f] dark:text-[#eaf2eb]">
                    Select {product.variants[0].name || 'Option'}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVariantId === v.id
                            ? 'border-[#1b4332] bg-[#1b4332] text-white dark:border-[#74c69d] dark:bg-[#74c69d] dark:text-black shadow-sm'
                            : 'border-[#e2ede0] dark:border-[#243828] text-[#1f2d1f] dark:text-[#eaf2eb] bg-white dark:bg-[#142217] hover:border-gray-400'
                        }`}
                      >
                        {v.value} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-[#1f2d1f] dark:text-[#eaf2eb]">Quantity:</span>
                <div className="flex items-center border border-[#e2ede0] dark:border-[#243828] rounded-xl bg-white dark:bg-[#142217] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 py-1 text-xs font-bold text-[#1f2d1f] dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  ({product.stock_quantity} available in nursery stock)
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock_quantity <= 0}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    isAdding
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1b4332] hover:bg-[#143526] text-white dark:bg-[#40916c] dark:hover:bg-[#52b788]'
                  } disabled:opacity-50`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity <= 0}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  Buy Now Instantly
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="text-xs font-semibold text-[#526352] dark:text-[#a3b8a6] hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorited ? 'In Saved Wishlist' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="text-xs font-semibold text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Product</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Tabs: Description, Benefits, How to Use, Specs, Customer Reviews */}
        <div className="border-t border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0f1911] p-6 sm:p-8">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-[#e2ede0] dark:border-[#243828] pb-3">
            {[
              { id: 'desc', label: 'Detailed Description' },
              { id: 'benefits', label: 'Botanical Benefits' },
              { id: 'how-to', label: 'How to Apply' },
              { id: 'specs', label: 'Product Specifications' },
              { id: 'reviews', label: `Customer Reviews (${displayReviewCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:bg-[#e2ede0]/60 dark:hover:bg-[#1c2e20]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-5 min-h-[160px] text-sm text-[#1f2d1f] dark:text-[#eaf2eb] leading-relaxed">
            
            {/* 1. Description */}
            {activeTab === 'desc' && (
              <div className="space-y-3 animate-fade-in">
                <p>{product.description}</p>
                <div className="p-4 rounded-2xl bg-[#d8f3dc]/40 dark:bg-[#1b3824]/40 border border-[#b7e4c7] dark:border-[#284e34] flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#2d6a4f] dark:text-[#74c69d] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1b4332] dark:text-[#95d5b2]">
                    Every PLANSIO batch is rigorously lab-checked for chemical toxicity, pathogen sterilization, and active bio-microbe viability.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Benefits */}
            {activeTab === 'benefits' && (
              <div className="space-y-2.5 animate-fade-in">
                <p className="font-semibold text-xs text-[#2d6a4f] dark:text-[#74c69d] uppercase tracking-wider">
                  Proven Advantages
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.benefits || [
                    'Enhances root development and nutrient uptake',
                    '100% safe for organic home gardens and edible herbs',
                    'Boosts plant vitality, blossom rate, and lush foliage',
                    'Eco-friendly, chemical-free and sustainable'
                  ]).map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. How to Use */}
            {activeTab === 'how-to' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-2">
                  <h4 className="font-bold text-sm text-[#1b4332] dark:text-[#74c69d]">
                    Application & Care Instructions:
                  </h4>
                  <p className="text-xs sm:text-sm text-[#526352] dark:text-[#a3b8a6]">
                    {product.how_to_use || 'Apply uniformly around the base of the plant once every 14-20 days. Water thoroughly after application.'}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Specifications */}
            {activeTab === 'specs' && (
              <div className="animate-fade-in">
                <div className="rounded-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden divide-y divide-[#e2ede0] dark:divide-[#243828]">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-3 p-3 text-xs">
                        <span className="font-semibold text-[#526352] dark:text-[#a3b8a6]">{key}</span>
                        <span className="col-span-2 text-[#1f2d1f] dark:text-[#eaf2eb]">{val}</span>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-gray-500">Standard botanical grading specifications.</p>
                  )}
                </div>
              </div>
            )}

            {/* 5. Customer Reviews & Write Review */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                        Write a Customer Review
                      </h4>
                      <p className="text-[11px] text-gray-400">Share your real botanical results</p>
                    </div>
                    
                    {/* Star Selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Review title (e.g. Very fast growth on my roses)"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-[#f6fbf4] dark:bg-[#1c2e20] focus:ring-2 focus:ring-[#2d6a4f] text-[#1f2d1f] dark:text-white"
                  />

                  <textarea
                    rows={3}
                    placeholder="Describe your gardening results, soil texture, plant health..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-[#f6fbf4] dark:bg-[#1c2e20] focus:ring-2 focus:ring-[#2d6a4f] text-[#1f2d1f] dark:text-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 dark:bg-[#40916c]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Publishing...' : 'Submit Real Review'}</span>
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {allReviews.length > 0 ? (
                    allReviews.map(rev => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-[#2d6a4f]"
                            />
                            <div>
                              <p className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                                {rev.user_name || 'PLANSIO Gardener'}
                              </p>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                ✓ Verified Customer Review
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(st => (
                              <Star
                                key={st}
                                className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="font-semibold text-xs text-[#1b4332] dark:text-[#74c69d]">
                          {rev.title}
                        </p>
                        <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                          {rev.review_text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-500 bg-white dark:bg-[#142217] rounded-2xl border border-[#e2ede0] dark:border-[#243828] p-4">
                      No customer reviews submitted yet. Rate this product above to share your experience!
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
