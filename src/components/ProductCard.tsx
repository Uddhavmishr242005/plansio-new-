import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types/database';
import { useShop } from '../context/ShopContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isWishlisted, setActiveQuickViewProduct } = useShop();
  const { getProductRealRating } = useSiteSettings();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [isAdding, setIsAdding] = useState(false);

  const realRatingData = getProductRealRating(product.id);
  const displayRating = realRatingData.count > 0 ? realRatingData.average : (product.rating || 0);
  const displayReviewCount = realRatingData.count > 0 ? realRatingData.count : (product.review_count || 0);

  const isFavorited = isWishlisted(product.id);
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find(img => img.is_primary)?.image_url || product.images[0].image_url
      : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80';

  const currentVariant = selectedVariantId
    ? product.variants.find(v => v.id === selectedVariantId)
    : null;

  const currentPrice = currentVariant ? currentVariant.price : product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, selectedVariantId, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setActiveQuickViewProduct(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f0f7ef] dark:bg-[#1c2e20]">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.bestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 dark:bg-[#40916c]">
              <Sparkles className="w-2.5 h-2.5" />
              Bestseller
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wide shadow-sm">
              {product.discount_percentage}% OFF
            </span>
          )}
          {product.category_id === 'cat-1' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-semibold tracking-wide">
              100% Organic
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 scale-110 shadow-md'
              : 'bg-white/85 dark:bg-[#142217]/85 text-gray-600 dark:text-gray-300 hover:text-rose-600 hover:scale-110'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-3 px-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            id={`quickview-btn-${product.id}`}
            onClick={handleQuickView}
            className="w-full py-2 px-3 rounded-xl bg-white/95 dark:bg-[#1c2e20]/95 text-[#1b4332] dark:text-[#eaf2eb] text-xs font-semibold shadow-md backdrop-blur-md hover:bg-[#1b4332] hover:text-white dark:hover:bg-[#40916c] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Authentic Real Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="text-[#526352] dark:text-[#a3b8a6] font-medium uppercase tracking-wider text-[11px] truncate">
              {product.category_name || 'PLANSIO'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              {displayReviewCount > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">{displayRating}</span>
                  <span className="text-[11px] text-gray-400">({displayReviewCount})</span>
                </>
              ) : (
                <span className="text-[11px] text-gray-400 font-medium">Unrated</span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleQuickView}
            className="font-semibold text-sm sm:text-base text-[#1b4332] dark:text-[#eaf2eb] line-clamp-1 hover:text-[#2d6a4f] dark:hover:text-[#74c69d] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] line-clamp-2 mt-1 leading-snug">
            {product.short_description}
          </p>

          {/* Variants selector pill if multiple */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all ${
                    selectedVariantId === v.id
                      ? 'border-[#1b4332] bg-[#1b4332] text-white dark:border-[#74c69d] dark:bg-[#74c69d] dark:text-black font-semibold'
                      : 'border-[#e2ede0] dark:border-[#243828] text-[#526352] dark:text-[#a3b8a6] hover:border-gray-400'
                  }`}
                >
                  {v.value}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="mt-4 pt-3 border-t border-[#e2ede0] dark:border-[#243828] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#1b4332] dark:text-[#74c69d]">
                ₹{currentPrice}
              </span>
              {product.compare_at_price > currentPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.compare_at_price}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
              {product.stock_quantity > 0 ? '✓ In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0 || isAdding}
            className={`p-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all duration-200 flex items-center gap-1.5 ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1b4332] hover:bg-[#143526] text-white active:scale-95 dark:bg-[#40916c] dark:hover:bg-[#52b788]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Add to Cart"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
