import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
  Printer,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    recentOrder,
    setIsProfileOpen,
    setActiveTab
  } = useShop();

  useEffect(() => {
    if (isOrderSuccessOpen) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !recentOrder) return null;

  const orderStatuses = [
    { title: 'Order Placed', desc: 'Received & verified', completed: true, active: false },
    { title: 'Processing', desc: 'Nursery packing & prep', completed: false, active: true },
    { title: 'Shipped', desc: 'Dispatched in eco-transit', completed: false, active: false },
    { title: 'Out for Delivery', desc: 'Arriving at local hub', completed: false, active: false },
    { title: 'Delivered', desc: 'At your doorstep', completed: false, active: false },
  ];

  const handleGoToOrders = () => {
    setIsOrderSuccessOpen(false);
    setIsProfileOpen(true);
  };

  const handleContinueShopping = () => {
    setIsOrderSuccessOpen(false);
    setActiveTab('shop');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] dark:from-[#1b3824] dark:to-[#2d6a4f] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-[#95d5b2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-[#d8f3dc] mt-1 font-medium">
            Thank you for choosing PLANSIO to green your home.
          </p>
          <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md font-mono text-xs font-bold text-white border border-white/10">
            Order ID: {recentOrder.order_number}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Visual 5-Step Order Progress Tracker */}
          <div className="p-4 rounded-2xl bg-[#f6fbf4] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-3">
            <h3 className="font-bold text-xs text-[#1b4332] dark:text-[#74c69d] uppercase tracking-wider">
              Live Order Status
            </h3>
            
            <div className="relative flex justify-between items-center px-2">
              {/* Connector line */}
              <div className="absolute top-3 left-4 right-4 h-0.5 bg-[#e2ede0] dark:bg-[#243828] -z-0" />
              
              {orderStatuses.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                      step.completed
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : step.active
                        ? 'bg-[#1b4332] text-white border-[#1b4332] dark:bg-[#74c69d] dark:text-black animate-pulse'
                        : 'bg-white dark:bg-[#142217] text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <span className="text-[10px] font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] mt-1">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-1">
              <div className="flex items-center gap-1.5 text-[#2d6a4f] dark:text-[#74c69d] font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping To</span>
              </div>
              <p className="font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">
                {recentOrder.shipping_name} ({recentOrder.shipping_phone})
              </p>
              <p className="text-[#526352] dark:text-[#a3b8a6]">
                {recentOrder.shipping_address}, {recentOrder.shipping_city}, {recentOrder.shipping_state} - {recentOrder.shipping_postal_code}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-1">
              <div className="flex items-center gap-1.5 text-[#2d6a4f] dark:text-[#74c69d] font-bold mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment & Delivery</span>
              </div>
              <p className="text-[#526352] dark:text-[#a3b8a6]">
                Method: <strong className="text-[#1f2d1f] dark:text-[#eaf2eb]">{recentOrder.payment_method}</strong>
              </p>
              <p className="text-[#526352] dark:text-[#a3b8a6]">
                Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{recentOrder.payment_status}</span>
              </p>
              <p className="text-[#526352] dark:text-[#a3b8a6]">
                Speed: <strong>{recentOrder.delivery_type} Delivery</strong>
              </p>
            </div>
          </div>

          {/* Items Purchased Snapshot */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-[#1b4332] dark:text-[#eaf2eb]">
              Ordered Botanical Products ({recentOrder.items.length})
            </h4>
            <div className="rounded-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden divide-y divide-[#e2ede0] dark:divide-[#243828]">
              {recentOrder.items.map(item => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs bg-white dark:bg-[#142217]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] truncate">
                        {item.product_name}
                      </p>
                      <span className="text-[10px] text-gray-500">
                        {item.variant_name || 'Standard'} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1b4332] dark:text-[#74c69d] shrink-0">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="p-3.5 rounded-2xl bg-[#f6fbf4] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-1 text-xs text-[#526352] dark:text-[#a3b8a6]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#1f2d1f] dark:text-[#eaf2eb]">₹{recentOrder.subtotal}</span>
            </div>
            {recentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Savings</span>
                <span>-₹{recentOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{recentOrder.shipping_fee === 0 ? 'FREE' : `₹${recentOrder.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#1b4332] dark:text-[#74c69d] pt-1.5 border-t border-[#e2ede0] dark:border-[#243828]">
              <span>Total Paid</span>
              <span>₹{recentOrder.total}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] flex flex-wrap gap-2.5 justify-between items-center">
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="order-success-view-orders-btn"
              onClick={handleGoToOrders}
              className="px-4 py-2.5 rounded-xl border border-[#1b4332] dark:border-[#74c69d] text-[#1b4332] dark:text-[#74c69d] text-xs font-semibold hover:bg-[#1b4332] hover:text-white dark:hover:bg-[#74c69d] dark:hover:text-black transition-all"
            >
              Track in My Orders
            </button>

            <button
              id="order-success-continue-btn"
              onClick={handleContinueShopping}
              className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 dark:bg-[#40916c]"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
