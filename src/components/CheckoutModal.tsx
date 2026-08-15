import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Smartphone,
  Banknote,
  Sparkles,
  ArrowRight,
  Edit2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, PaymentMethod } from '../types/database';
import * as api from '../services/api';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsOrderSuccessOpen,
    setRecentOrder
  } = useShop();

  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const userId = user?.id || 'guest_or_demo_user';

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    full_name: profile?.full_name || 'Aditi Deshmukh',
    phone: profile?.phone || '+91 98765 43210',
    address_line_1: 'Flat 402, Green Meadows Residency',
    address_line_2: '100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560038',
    country: 'India',
    is_default: true
  });

  // Delivery & Payment selection
  const [deliveryType, setDeliveryType] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // UPI VPA input
  const [upiId, setUpiId] = useState('aditi@okaxis');

  useEffect(() => {
    if (isCheckoutOpen) {
      loadAddresses();
    }
  }, [isCheckoutOpen, userId]);

  const loadAddresses = async () => {
    try {
      const list = await api.getAddresses(userId);
      setAddresses(list);
      const defaultAddr = list.find(a => a.is_default) || list[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  if (!isCheckoutOpen) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line_1 || !newAddress.city || !newAddress.postal_code) {
      showToast('Missing Fields', 'warning', 'Please fill in all mandatory address fields.');
      return;
    }

    try {
      const saved = await api.saveAddress(userId, newAddress);
      await loadAddresses();
      setSelectedAddressId(saved.id);
      setIsAddingAddress(false);
      showToast('Address Saved', 'success', 'Delivery destination updated.');
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    }
  };

  const deliveryCost = deliveryType === 'Express' ? 99 : cartShipping;
  const finalPayableTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCost);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast('Empty Cart', 'warning', 'Your cart has no items to order.');
      return;
    }

    const currentSelectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    if (!currentSelectedAddress) {
      showToast('Address Required', 'warning', 'Please add and select a delivery address.');
      setIsAddingAddress(true);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderItems = cart.map(item => ({
        id: 'ord-itm-' + Math.random().toString(36).substring(2, 9),
        order_id: '',
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product.name,
        product_image:
          item.product.images && item.product.images.length > 0
            ? item.product.images[0].image_url
            : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
        variant_name: item.variant ? item.variant.value : undefined,
        quantity: item.quantity,
        unit_price: item.variant ? item.variant.price : item.product.price,
        subtotal: (item.variant ? item.variant.price : item.product.price) * item.quantity
      }));

      const orderPayload = {
        user_id: userId,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping_fee: deliveryCost,
        total: finalPayableTotal,
        payment_method: paymentMethod,
        payment_status: (paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Paid') as any,
        order_status: 'Order Placed' as any,
        shipping_name: currentSelectedAddress.full_name,
        shipping_phone: currentSelectedAddress.phone,
        shipping_address: `${currentSelectedAddress.address_line_1}${currentSelectedAddress.address_line_2 ? ', ' + currentSelectedAddress.address_line_2 : ''}`,
        shipping_city: currentSelectedAddress.city,
        shipping_state: currentSelectedAddress.state,
        shipping_postal_code: currentSelectedAddress.postal_code,
        shipping_country: currentSelectedAddress.country || 'India',
        delivery_type: deliveryType,
        items: orderItems
      };

      const placedOrder = await api.createOrder(orderPayload);
      setRecentOrder(placedOrder);
      setIsCheckoutOpen(false);
      setIsOrderSuccessOpen(true);
      showToast('Order Placed Successfully!', 'success', `Order #${placedOrder.order_number}`);
    } catch (err: any) {
      showToast('Order Failed', 'error', err.message || 'Could not place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1b4332] dark:bg-[#40916c] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[#1b4332] dark:text-[#eaf2eb]">
                PLANSIO Secure Checkout
              </h2>
              <p className="text-[11px] text-[#526352] dark:text-[#a3b8a6]">
                Direct to Supabase Order Creation
              </p>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Address, Delivery & Payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. DELIVERY ADDRESS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center dark:bg-[#40916c]">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                      Delivery Address
                    </h3>
                  </div>
                  {!isAddingAddress && (
                    <button
                      id="add-address-trigger-btn"
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs font-semibold text-[#2d6a4f] dark:text-[#74c69d] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  /* New Address Form */
                  <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.full_name || ''}
                          onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone || ''}
                          onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">Street Address / House No. *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.address_line_1 || ''}
                        onChange={e => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">City *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city || ''}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">State *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.state || ''}
                          onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#526352] dark:text-[#a3b8a6]">PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.postal_code || ''}
                          onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#143526] dark:bg-[#40916c]"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Address Cards */
                  <div className="space-y-2.5">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                          selectedAddressId === addr.id
                            ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d] shadow-sm'
                            : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                            selectedAddressId === addr.id ? 'border-[#1b4332] bg-[#1b4332] dark:border-[#74c69d] dark:bg-[#74c69d]' : 'border-gray-400'
                          }`}>
                            {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                              {addr.full_name} <span className="font-normal text-gray-500 text-[11px]">({addr.phone})</span>
                            </p>
                            <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-0.5">
                              {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}, {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                          </div>
                        </div>
                        {addr.is_default && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. DELIVERY METHOD */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center dark:bg-[#40916c]">
                    2
                  </span>
                  <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                    Delivery Method
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryType('Standard')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryType === 'Standard'
                        ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                        Standard Nursery Transit
                      </span>
                      <span className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                        {cartShipping === 0 ? 'FREE' : '₹50'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526352] dark:text-[#a3b8a6]">
                      Delivered in 3-5 business days in ventilated eco-boxes.
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryType('Express')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryType === 'Express'
                        ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                        Express Guaranteed
                      </span>
                      <span className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                        ₹99
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526352] dark:text-[#a3b8a6]">
                      Priority dispatch in 24-48 hrs with plant hydration pack.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT METHOD SELECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center dark:bg-[#40916c]">
                    3
                  </span>
                  <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                    Select Payment Method
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      paymentMethod === 'UPI'
                        ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                        <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                          UPI (Google Pay / PhonePe / Paytm / BHIM)
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                        Fastest
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="pt-2 flex gap-2 animate-fade-in">
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] text-[#1f2d1f] dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('Credit/Debit Card')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Credit/Debit Card'
                        ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                        <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                          Credit or Debit Card (Visa, Mastercard, RuPay)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#1b4332] bg-[#f6fbf4] dark:bg-[#1c2e20] dark:border-[#74c69d]'
                        : 'border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Banknote className="w-4 h-4 text-[#2d6a4f] dark:text-[#74c69d]" />
                        <span className="font-semibold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500">Pay at doorstep</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb] pb-2 border-b border-[#e2ede0] dark:border-[#243828]">
                  Order Items ({cart.length})
                </h3>

                {/* Items Mini List */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={
                            item.product.images && item.product.images.length > 0
                              ? item.product.images[0].image_url
                              : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80'
                          }
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-medium text-[#1f2d1f] dark:text-[#eaf2eb] truncate">
                            {item.product.name}
                          </p>
                          <span className="text-[10px] text-gray-500">
                            Qty: {item.quantity} {item.variant ? `(${item.variant.value})` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-[#1b4332] dark:text-[#74c69d] shrink-0">
                        ₹{(item.variant ? item.variant.price : item.product.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-3 border-t border-[#e2ede0] dark:border-[#243828] space-y-2 text-xs text-[#526352] dark:text-[#a3b8a6]">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">₹{cartSubtotal}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{cartDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges ({deliveryType})</span>
                    <span>{deliveryCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCost}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1b4332] dark:text-[#74c69d] pt-2 border-t border-[#e2ede0] dark:border-[#243828]">
                    <span>Total Payable</span>
                    <span>₹{finalPayableTotal}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  id="checkout-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white font-bold text-sm shadow-lg shadow-[#1b4332]/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-[#40916c] dark:hover:bg-[#52b788]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPlacingOrder ? 'Creating Order in Supabase...' : `PLACE ORDER • ₹${finalPayableTotal}`}</span>
                </button>

                <p className="text-[10px] text-center text-gray-400">
                  By clicking Place Order, your transaction will be securely logged in Supabase orders.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
