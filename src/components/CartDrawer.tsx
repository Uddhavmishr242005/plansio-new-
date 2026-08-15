import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Truck,
  Check,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    setActiveTab
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 499;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Invalid coupon code. Try PLANSIO10');
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#142217] shadow-2xl flex flex-col justify-between h-full border-l border-[#e2ede0] dark:border-[#243828] animate-scale-in">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1b4332] dark:text-[#74c69d]" />
            <h2 className="font-bold text-lg text-[#1b4332] dark:text-[#eaf2eb]">
              Your Cart ({cartCount})
            </h2>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-[#f6fbf4] dark:bg-[#0e1710] border-b border-[#e2ede0] dark:border-[#243828] text-xs">
          <div className="flex items-center justify-between font-semibold text-[#1b4332] dark:text-[#74c69d] mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>
                {remainingForFreeShipping === 0
                  ? '🎉 You unlocked FREE Express Delivery!'
                  : `Add ₹${remainingForFreeShipping} more for FREE Shipping`}
              </span>
            </div>
            <span>{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full bg-[#e2ede0] dark:bg-[#1c2e20] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#1b4332] dark:from-[#40916c] dark:to-[#74c69d] h-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Your basket is empty
                </h3>
                <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-1">
                  Explore our pure vermicompost, fertilizers, and indoor air-purifiers.
                </p>
              </div>
              <button
                id="cart-empty-explore-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('shop');
                }}
                className="px-6 py-2.5 rounded-full bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#143526] transition-colors dark:bg-[#40916c]"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = item.variant ? item.variant.price : item.product.price;
              const imgUrl =
                item.product.images && item.product.images.length > 0
                  ? item.product.images[0].image_url
                  : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="flex gap-3 p-3 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={imgUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#e2ede0] dark:border-[#243828] shrink-0 bg-white"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-5">
                        <h4 className="font-semibold text-xs text-[#1b4332] dark:text-[#eaf2eb] line-clamp-1">
                          {item.product.name}
                        </h4>
                      </div>
                      {item.variant && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-[#e2ede0] dark:bg-[#243828] text-[10px] text-[#526352] dark:text-[#a3b8a6] mt-0.5 font-medium">
                          {item.variant.value}
                        </span>
                      )}
                      <p className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d] mt-1">
                        ₹{itemPrice}
                      </p>
                    </div>

                    {/* Stepper & Trash */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center border border-[#e2ede0] dark:border-[#243828] rounded-lg bg-white dark:bg-[#142217]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-l"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1f2d1f] dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-r"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        id={`remove-cart-item-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Cost Breakdown */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#e2ede0] dark:border-[#243828] bg-[#fcfdfc] dark:bg-[#0e1710] space-y-3.5">
            
            {/* Promo Code Input */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{couponCode}' Applied (-₹{cartDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. PLANSIO10)"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white uppercase placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold dark:bg-[#40916c]"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#526352] dark:text-[#a3b8a6]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{cartShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${cartShipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1b4332] dark:text-[#74c69d] pt-2 border-t border-[#e2ede0] dark:border-[#243828]">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 dark:bg-[#40916c] dark:hover:bg-[#52b788]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <button onClick={clearCart} className="hover:text-rose-500 transition-colors">
                Clear Cart
              </button>
              <span>🔒 256-Bit SSL Encrypted Checkout</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
