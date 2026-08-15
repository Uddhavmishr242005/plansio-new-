import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistModal: React.FC = () => {
  const {
    wishlist,
    wishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setActiveTab,
    setActiveQuickViewProduct
  } = useShop();

  if (!isWishlistOpen) return null;

  const handleMoveAllToCart = async () => {
    for (const item of wishlist) {
      await addToCart(item.product, null, 1);
    }
    setIsWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-bold text-lg text-[#1b4332] dark:text-[#eaf2eb]">
              My Wishlist ({wishlistCount})
            </h2>
          </div>
          <button
            id="close-wishlist-modal-btn"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {wishlist.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] max-w-xs mx-auto">
                Save your favorite vermicompost bags, exotic monsteras, and tools to buy anytime.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setActiveTab('shop');
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#143526] transition-colors dark:bg-[#40916c]"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {wishlist.map(item => {
                const img =
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0].image_url
                    : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] flex gap-3 relative group"
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setActiveQuickViewProduct(item.product);
                      }}
                      className="w-20 h-20 rounded-xl object-cover border border-[#e2ede0] dark:border-[#243828] cursor-pointer hover:opacity-90"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setActiveQuickViewProduct(item.product);
                          }}
                          className="font-semibold text-xs text-[#1b4332] dark:text-[#eaf2eb] line-clamp-1 cursor-pointer hover:underline"
                        >
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d] mt-1">
                          ₹{item.product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          id={`wishlist-add-cart-${item.product_id}`}
                          onClick={() => addToCart(item.product, null, 1)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1b4332] hover:bg-[#143526] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors dark:bg-[#40916c]"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(item.product)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-[#e2ede0] dark:border-[#243828] bg-[#fcfdfc] dark:bg-[#0e1710] flex justify-between items-center">
            <button
              onClick={() => wishlist.forEach(w => toggleWishlist(w.product))}
              className="text-xs text-gray-500 hover:text-rose-600 transition-colors"
            >
              Clear All Wishlist
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 dark:bg-[#40916c]"
            >
              <span>Move All to Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
