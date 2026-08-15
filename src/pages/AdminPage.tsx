import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  X,
  Save,
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
  Lock,
  LogOut,
  MapPin,
  Phone,
  User,
  CreditCard,
  Layers,
  ArrowUpDown,
  Percent,
  Check,
  Send,
  Upload,
  Palette,
  Sparkles,
  Video,
  Play,
  RotateCcw,
  Sliders,
  Type,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sprout,
  Move,
  AlignLeft,
  Paintbrush
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useSiteSettings, HERO_TEMPLATES } from '../context/SiteSettingsContext';
import { Order, OrderItem, OrderStatus, Product, ProductImage, PaymentStatus, PaymentMethod, VideoItem } from '../types/database';
import * as api from '../services/api';
import { isLiveSupabaseConfigured, getSupabaseClient, DEFAULT_SUPABASE_PROJECT_ID } from '../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../lib/sqlSchema';

export const AdminPage: React.FC = () => {
  const { products, categories, fetchProducts } = useShop();
  const { showToast } = useToast();
  const {
    settings,
    updateSettings,
    updateHeroBanner,
    applyHeroTemplate,
    setCustomLogo,
    setLogoSize,
    setLogoDisplayMode,
    setLogoPosition,
    setLogoPlacement,
    setFooterBgMode,
    setLogoColorFilter,
    setLogoBackdropStyle,
    setFooterLogoSize,
    setFooterLogoPosition,
    setFooterLogoFilter,
    addVideo,
    updateVideo,
    deleteVideo,
    resetToDefaults
  } = useSiteSettings();

  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('plansio_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-tab
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products' | 'branding' | 'hero-studio' | 'videos' | 'supabase'>('branding');

  // File Upload Ref for Logo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoInputUrl, setLogoInputUrl] = useState(settings.logoUrl || '');
  const [brandNameInput, setBrandNameInput] = useState(settings.brandName || 'PLANSIO');
  const [taglineInput, setTaglineInput] = useState(settings.tagline || '100% Organic Vermicompost & Nursery Living');

  // New Video Form State
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '3:00',
    category: 'Farm Tour',
    author: 'PLANSIO Horticulturist'
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected Order for Detail / Tracking
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Ship Order Modal State
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [carrierName, setCarrierName] = useState('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Edit / Replace Order Modal State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Create New Order Modal State
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [newOrderCustomer, setNewOrderCustomer] = useState({
    name: 'Rohan Sharma',
    phone: '+91 98234 56789',
    address: 'B-104, Green Heights, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560103',
    country: 'India'
  });
  const [newOrderItems, setNewOrderItems] = useState<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
  }[]>([]);
  const [newOrderDeliveryType, setNewOrderDeliveryType] = useState<'Standard' | 'Express'>('Standard');
  const [newOrderPaymentMethod, setNewOrderPaymentMethod] = useState<PaymentMethod>('UPI');
  const [newOrderPaymentStatus, setNewOrderPaymentStatus] = useState<PaymentStatus>('Paid');
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('Order Placed');

  // Product & Pricing State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  
  // Single Product Edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const isLive = isLiveSupabaseConfigured();

  // Load orders on authentication or tab switch
  useEffect(() => {
    if (isAuthenticated) {
      loadAllOrders();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPin === 'admin123' || adminPin === 'admin' || adminPin === 'plansio2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('plansio_admin_auth', 'true');
      setAuthError('');
      showToast('Admin Access Granted', 'success', 'Welcome to PLANSIO Control Center');
    } else {
      setAuthError('Invalid Admin PIN. Use admin123 or click One-Click Demo Access.');
    }
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('plansio_admin_auth', 'true');
    setAuthError('');
    showToast('Admin Access Granted', 'success', 'Demo Owner Mode Active');
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('plansio_admin_auth');
    showToast('Logged Out', 'info', 'Admin session ended');
  };

  const loadAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const list = await api.getAllOrders();
      setOrders(list);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      showToast('Failed to load orders', 'error', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Status Change Helpers
  const handleConfirmOrder = async (order: Order) => {
    try {
      const updated = await api.updateOrderStatus(order.id, 'Confirmed');
      await loadAllOrders();
      showToast('Order Confirmed', 'success', `Order #${order.order_number} is now Confirmed`);
      if (selectedOrder && (selectedOrder.id === order.id || selectedOrder.order_number === order.order_number)) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: 'Confirmed' } : null);
      }
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    }
  };

  const openShipModal = (order: Order) => {
    setShippingOrder(order);
    setTrackingNumber(`DELH-${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleShipOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrder) return;

    try {
      await api.updateOrderStatus(shippingOrder.id, 'Shipped', trackingNumber, carrierName);
      await loadAllOrders();
      showToast('Order Shipped!', 'success', `Dispatched via ${carrierName} (AWB: ${trackingNumber})`);
      setShippingOrder(null);
      if (selectedOrder && selectedOrder.id === shippingOrder.id) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: 'Shipped', tracking_number: trackingNumber, carrier: carrierName } : null);
      }
    } catch (err: any) {
      showToast('Shipping Update Failed', 'error', err.message);
    }
  };

  const handleDeliverOrder = async (order: Order) => {
    try {
      await api.updateOrderStatus(order.id, 'Delivered');
      await loadAllOrders();
      showToast('Order Delivered', 'success', `Order #${order.order_number} marked as Delivered`);
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: 'Delivered' } : null);
      }
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order from the database?')) return;
    try {
      await api.deleteOrder(orderId);
      await loadAllOrders();
      showToast('Order Deleted', 'info', 'Order removed from database');
      if (selectedOrder?.id === orderId) {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (err: any) {
      showToast('Delete Failed', 'error', err.message);
    }
  };

  // Replace / Edit Order
  const handleSaveEditedOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    // Recalculate subtotal
    const subtotal = editingOrder.items.reduce((sum, itm) => sum + (itm.unit_price * itm.quantity), 0);
    const total = Math.max(0, subtotal - editingOrder.discount + editingOrder.shipping_fee);

    const updatedPayload: Partial<Order> = {
      shipping_name: editingOrder.shipping_name,
      shipping_phone: editingOrder.shipping_phone,
      shipping_address: editingOrder.shipping_address,
      shipping_city: editingOrder.shipping_city,
      shipping_state: editingOrder.shipping_state,
      shipping_postal_code: editingOrder.shipping_postal_code,
      order_status: editingOrder.order_status,
      payment_status: editingOrder.payment_status,
      payment_method: editingOrder.payment_method,
      tracking_number: editingOrder.tracking_number,
      carrier: editingOrder.carrier,
      subtotal,
      total,
      items: editingOrder.items
    };

    try {
      await api.updateOrder(editingOrder.id, updatedPayload);
      await loadAllOrders();
      showToast('Order Updated', 'success', `Order #${editingOrder.order_number} modified successfully`);
      setEditingOrder(null);
    } catch (err: any) {
      showToast('Failed to Update', 'error', err.message);
    }
  };

  // Create New Order Submission
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrderItems.length === 0) {
      showToast('Missing Items', 'warning', 'Please add at least one product to the order.');
      return;
    }
    if (!newOrderCustomer.name || !newOrderCustomer.phone || !newOrderCustomer.address || !newOrderCustomer.city) {
      showToast('Missing Details', 'warning', 'Please fill customer shipping fields.');
      return;
    }

    try {
      const itemsFormatted: OrderItem[] = newOrderItems.map(item => {
        const prod = products.find(p => p.id === item.productId)!;
        const variant = prod.variants.find(v => v.id === item.variantId);
        return {
          id: 'ord-itm-' + Math.random().toString(36).substring(2, 9),
          order_id: '',
          product_id: prod.id,
          variant_id: variant?.id || null,
          product_name: prod.name,
          product_image: prod.images[0]?.image_url || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
          variant_name: variant?.value,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.unitPrice * item.quantity
        };
      });

      const subtotal = itemsFormatted.reduce((acc, i) => acc + i.subtotal, 0);
      const shippingFee = newOrderDeliveryType === 'Express' ? 99 : (subtotal >= 499 ? 0 : 49);
      const total = subtotal + shippingFee;

      const orderPayload = {
        user_id: 'admin_manual_order',
        subtotal,
        discount: 0,
        shipping_fee: shippingFee,
        total,
        payment_method: newOrderPaymentMethod,
        payment_status: newOrderPaymentStatus,
        order_status: newOrderStatus,
        shipping_name: newOrderCustomer.name,
        shipping_phone: newOrderCustomer.phone,
        shipping_address: newOrderCustomer.address,
        shipping_city: newOrderCustomer.city,
        shipping_state: newOrderCustomer.state,
        shipping_postal_code: newOrderCustomer.postal_code,
        shipping_country: newOrderCustomer.country,
        delivery_type: newOrderDeliveryType,
        items: itemsFormatted
      };

      const created = await api.createOrder(orderPayload);
      await loadAllOrders();
      setIsCreateOrderOpen(false);
      setNewOrderItems([]);
      showToast('Order Created!', 'success', `Order #${created.order_number} saved to Supabase`);
    } catch (err: any) {
      showToast('Order Creation Failed', 'error', err.message);
    }
  };

  // Bulk Price Updates
  const handleApplyBulkPriceChange = async (percentage: number) => {
    setIsBulkUpdating(true);
    try {
      await api.bulkUpdatePrices(percentage, bulkCategory);
      await fetchProducts();
      showToast(
        'Prices Adjusted',
        'success',
        `${percentage > 0 ? '+' : ''}${percentage}% applied to ${bulkCategory === 'all' ? 'all catalog products' : 'selected category'}`
      );
    } catch (err: any) {
      showToast('Error', 'error', err.message);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Single Product Price Update
  const handleSaveProductPrices = async (productId: string, price: number, comparePrice: number) => {
    try {
      await api.updateProductPrice(productId, price, comparePrice);
      await fetchProducts();
      showToast('Price Updated', 'success', `New price: ₹${price}`);
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(prev => prev ? { ...prev, price, compare_at_price: comparePrice } : null);
      }
    } catch (err: any) {
      showToast('Price Update Failed', 'error', err.message);
    }
  };

  // Image Management
  const handleAddImage = async () => {
    if (!editingProduct || !newImageUrl.trim()) return;
    try {
      const updated = await api.addProductImage(editingProduct.id, newImageUrl.trim(), false);
      if (updated) {
        setEditingProduct(updated);
        await fetchProducts();
        setNewImageUrl('');
        showToast('Image Added', 'success', 'New image saved to product gallery');
      }
    } catch (err: any) {
      showToast('Failed to Add Image', 'error', err.message);
    }
  };

  const handleRemoveImage = async (imageIdOrUrl: string) => {
    if (!editingProduct) return;
    try {
      const updated = await api.removeProductImage(editingProduct.id, imageIdOrUrl);
      if (updated) {
        setEditingProduct(updated);
        await fetchProducts();
        showToast('Image Removed', 'info', 'Image deleted from gallery');
      }
    } catch (err: any) {
      showToast('Failed to Remove Image', 'error', err.message);
    }
  };

  // Seed sample orders to Supabase
  const handleSeedOrdersToSupabase = async () => {
    try {
      showToast('Syncing Sample Orders...', 'info');
      const sampleOrders = [
        {
          user_id: 'guest_user_1',
          subtotal: 898,
          discount: 100,
          shipping_fee: 0,
          total: 798,
          payment_method: 'UPI' as PaymentMethod,
          payment_status: 'Paid' as PaymentStatus,
          order_status: 'Confirmed' as OrderStatus,
          shipping_name: 'Pooja Iyer',
          shipping_phone: '+91 97412 34567',
          shipping_address: '42, Lotus Boulevard, Koramangala 4th Block',
          shipping_city: 'Bengaluru',
          shipping_state: 'Karnataka',
          shipping_postal_code: '560034',
          shipping_country: 'India',
          delivery_type: 'Standard' as const,
          items: [
            {
              id: 'ord-itm-' + Math.random().toString(36).substring(2, 9),
              order_id: '',
              product_id: products[0]?.id || 'prod-1',
              product_name: 'PLANSIO Gold Grade Vermicompost',
              product_image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
              variant_name: '5 KG Bag',
              quantity: 2,
              unit_price: 349,
              subtotal: 698
            },
            {
              id: 'ord-itm-' + Math.random().toString(36).substring(2, 9),
              order_id: '',
              product_id: products[2]?.id || 'prod-3',
              product_name: 'PLANSIO Cold-Pressed Seaweed Liquid Booster',
              product_image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
              variant_name: '250 ML Bottle',
              quantity: 1,
              unit_price: 200,
              subtotal: 200
            }
          ]
        },
        {
          user_id: 'guest_user_2',
          subtotal: 1299,
          discount: 0,
          shipping_fee: 99,
          total: 1398,
          payment_method: 'Credit/Debit Card' as PaymentMethod,
          payment_status: 'Paid' as PaymentStatus,
          order_status: 'Shipped' as OrderStatus,
          tracking_number: 'BLUEDART-8829103',
          carrier: 'Blue Dart Air Express',
          shipping_name: 'Vikram Mehta',
          shipping_phone: '+91 98201 23456',
          shipping_address: 'Flat 1201, Imperial Heights, Bandra West',
          shipping_city: 'Mumbai',
          shipping_state: 'Maharashtra',
          shipping_postal_code: '400050',
          shipping_country: 'India',
          delivery_type: 'Express' as const,
          items: [
            {
              id: 'ord-itm-' + Math.random().toString(36).substring(2, 9),
              order_id: '',
              product_id: products[1]?.id || 'prod-2',
              product_name: 'Live Fiddle Leaf Fig (Conditioned)',
              product_image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
              variant_name: 'Large (10-inch Pot)',
              quantity: 1,
              unit_price: 1299,
              subtotal: 1299
            }
          ]
        }
      ];

      for (const ord of sampleOrders) {
        await api.createOrder(ord);
      }

      await loadAllOrders();
      showToast('Sample Orders Seeded', 'success', 'Live orders pushed to Supabase & local cache');
    } catch (err: any) {
      showToast('Seed Failed', 'error', err.message);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      (o.order_number && o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shipping_name && o.shipping_name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shipping_phone && o.shipping_phone.includes(orderSearchQuery)) ||
      (o.shipping_city && o.shipping_city.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category_id === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Key Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'Paid' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.order_status === 'Order Placed').length;
  const confirmedOrdersCount = orders.filter(o => o.order_status === 'Confirmed' || o.order_status === 'Processing').length;
  const shippedOrdersCount = orders.filter(o => o.order_status === 'Shipped' || o.order_status === 'Out for Delivery').length;
  const deliveredOrdersCount = orders.filter(o => o.order_status === 'Delivered').length;

  // Render Login Gate if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#f6fbf4] dark:bg-[#0e1710]">
        <div className="w-full max-w-md bg-white dark:bg-[#142217] rounded-3xl p-8 shadow-xl border border-[#e2ede0] dark:border-[#243828] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#1b4332]/20">
            <ShieldCheck className="w-8 h-8 text-[#d8f3dc]" />
          </div>
          
          <h1 className="text-2xl font-bold text-[#1b4332] dark:text-[#eaf2eb] mb-1 font-['Poppins']">
            PLANSIO Admin Gate
          </h1>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mb-6">
            Authorized management for live orders, products, and Supabase database.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#526352] dark:text-[#a3b8a6] mb-1">
                Admin Password / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (admin123)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0e1710] text-[#1f2d1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#e2ede0] dark:border-[#243828]">
            <p className="text-[11px] text-gray-500 mb-3">Quick testing for workspace owner:</p>
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>One-Click Owner Access</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fbf4] dark:bg-[#0e1710] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 shadow-sm border border-[#e2ede0] dark:border-[#243828] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#d8f3dc]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#eaf2eb] font-['Poppins']">
                  PLANSIO Admin Console
                </h1>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Admin
                </span>
              </div>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] flex items-center gap-1.5 mt-0.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase ID: <strong className="font-mono">{DEFAULT_SUPABASE_PROJECT_ID}</strong></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>

          {/* Quick Actions & Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="bg-[#f6fbf4] dark:bg-[#0e1710] p-1 rounded-2xl border border-[#e2ede0] dark:border-[#243828] flex flex-wrap gap-1">
              <button
                id="admin-tab-branding"
                onClick={() => setActiveAdminTab('branding')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'branding'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Brand & Logo</span>
              </button>

              <button
                id="admin-tab-hero"
                onClick={() => setActiveAdminTab('hero-studio')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'hero-studio'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Hero Studio</span>
              </button>

              <button
                id="admin-tab-videos"
                onClick={() => setActiveAdminTab('videos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'videos'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({settings.sampleVideos?.length || 0})</span>
              </button>

              <button
                id="admin-tab-orders"
                onClick={() => setActiveAdminTab('orders')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'orders'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                id="admin-tab-products"
                onClick={() => setActiveAdminTab('products')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'products'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pricing & Catalog</span>
              </button>

              <button
                id="admin-tab-supabase"
                onClick={() => setActiveAdminTab('supabase')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'supabase'
                    ? 'bg-[#1b4332] text-white shadow-sm dark:bg-[#40916c]'
                    : 'text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Sync</span>
              </button>
            </div>

            <button
              onClick={handleAdminLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: ORDERS MANAGEMENT                                      */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-[#142217] p-5 rounded-2xl border border-[#e2ede0] dark:border-[#243828] shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="text-2xl font-bold text-[#1b4332] dark:text-[#eaf2eb] mt-1">
                  {orders.length}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Live in Supabase</span>
              </div>

              <div className="bg-white dark:bg-[#142217] p-5 rounded-2xl border border-[#e2ede0] dark:border-[#243828] shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="text-2xl font-bold text-[#1b4332] dark:text-[#74c69d] mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">From paid orders</span>
              </div>

              <div className="bg-white dark:bg-[#142217] p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
                  Placed / Pending
                </span>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                  {pendingOrdersCount}
                </div>
                <span className="text-[10px] text-amber-600 block mt-1">Awaiting confirmation</span>
              </div>

              <div className="bg-white dark:bg-[#142217] p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm bg-blue-50/40 dark:bg-blue-950/20">
                <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 block uppercase tracking-wider">
                  In Transit / Shipped
                </span>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {shippedOrdersCount}
                </div>
                <span className="text-[10px] text-blue-600 block mt-1">With Tracking ID</span>
              </div>

              <div className="bg-white dark:bg-[#142217] p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm bg-emerald-50/40 dark:bg-emerald-950/20 col-span-2 lg:col-span-1">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">
                  Delivered
                </span>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {deliveredOrdersCount}
                </div>
                <span className="text-[10px] text-emerald-600 block mt-1">Successfully fulfilled</span>
              </div>
            </div>

            {/* Filter and Search Bar + Add Order button */}
            <div className="bg-white dark:bg-[#142217] p-4 sm:p-5 rounded-2xl border border-[#e2ede0] dark:border-[#243828] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 w-full">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Order #, Customer Name, Phone, City..."
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] text-[#1f2d1f] dark:text-white"
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-[#1f2d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={loadAllOrders}
                  disabled={isLoadingOrders}
                  className="p-2 text-[#2d6a4f] dark:text-[#74c69d] hover:bg-[#e2ede0] dark:hover:bg-[#1c2e20] rounded-xl border border-[#e2ede0] dark:border-[#243828] transition-colors"
                  title="Refresh Orders from Supabase"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setIsCreateOrderOpen(true)}
                  className="px-4 py-2 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Order</span>
                </button>
              </div>
            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-[#142217] rounded-3xl p-12 text-center border border-[#e2ede0] dark:border-[#243828]">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">No Orders Found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                  {orderSearchQuery ? 'Try changing your search keywords or status filter.' : 'You can create a new order manually or seed sample orders to test Supabase persistence.'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsCreateOrderOpen(true)}
                    className="px-4 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Create Custom Order
                  </button>
                  <button
                    onClick={handleSeedOrdersToSupabase}
                    className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold"
                  >
                    Seed Sample Orders to Supabase
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div
                    key={order.id || order.order_number}
                    className="bg-white dark:bg-[#142217] rounded-2xl p-5 sm:p-6 border border-[#e2ede0] dark:border-[#243828] shadow-sm hover:border-[#2d6a4f]/50 transition-all space-y-4"
                  >
                    {/* Order Top Line */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e2ede0] dark:border-[#243828]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm sm:text-base text-[#1b4332] dark:text-[#74c69d]">
                          #{order.order_number}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.order_status === 'Shipped' || order.order_status === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : order.order_status === 'Confirmed' || order.order_status === 'Processing'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : order.order_status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {order.order_status}
                        </span>

                        <span className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {order.payment_method} • <strong className={order.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{order.payment_status}</strong>
                        </span>
                        <span className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb] ml-2">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Order Middle Grid: Customer & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      {/* Customer info */}
                      <div className="md:col-span-4 space-y-1 bg-[#fbfdfb] dark:bg-[#0e1710] p-3 rounded-xl border border-[#e2ede0] dark:border-[#243828]">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#2d6a4f]" />
                          <span>{order.shipping_name}</span>
                        </div>
                        <div className="text-gray-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.shipping_phone}</span>
                        </div>
                        <div className="text-gray-500 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</span>
                        </div>
                        {order.tracking_number && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>{order.carrier || 'Courier'}: <strong>{order.tracking_number}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Items Snapshot */}
                      <div className="md:col-span-8 space-y-2">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Items Ordered ({order.items?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items?.map((itm, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-[#f6fbf4] dark:bg-[#17261a] px-2.5 py-1.5 rounded-xl border border-[#e2ede0] dark:border-[#243828]"
                            >
                              <img
                                src={itm.product_image}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                              <div>
                                <span className="font-semibold text-gray-800 dark:text-gray-200 block truncate max-w-[160px]">
                                  {itm.product_name}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {itm.variant_name ? itm.variant_name + ' • ' : ''}Qty: {itm.quantity} × ₹{itm.unit_price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Action Toolbar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[#e2ede0] dark:border-[#243828]">
                      {/* Left Status Controls */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {order.order_status === 'Order Placed' && (
                          <button
                            onClick={() => handleConfirmOrder(order)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Order</span>
                          </button>
                        )}

                        {(order.order_status === 'Order Placed' || order.order_status === 'Confirmed' || order.order_status === 'Processing') && (
                          <button
                            onClick={() => openShipModal(order)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Ship Order</span>
                          </button>
                        )}

                        {order.order_status === 'Shipped' && (
                          <button
                            onClick={() => handleDeliverOrder(order)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as Delivered</span>
                          </button>
                        )}
                      </div>

                      {/* Right Detail / Edit / Delete Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Track & View</span>
                        </button>

                        <button
                          onClick={() => setEditingOrder(JSON.parse(JSON.stringify(order)))}
                          className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-emerald-300 dark:border-emerald-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Replace / Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete Order from Database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PRICING & PRODUCT IMAGES                               */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Bulk Price Adjustment Card */}
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1b4332] dark:text-[#eaf2eb] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span>Bulk Price Modifier (Increase or Decrease)</span>
                  </h2>
                  <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                    Apply instant percentage discounts or inflationary markups across live Supabase catalog.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={bulkCategory}
                    onChange={e => setBulkCategory(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-[#1f2d1f] dark:text-white"
                  >
                    <option value="all">Apply to All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Percentage Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold mr-2">Quick Presets:</span>
                
                {/* Increase buttons */}
                <button
                  onClick={() => handleApplyBulkPriceChange(5)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800"
                >
                  +5% Price
                </button>
                <button
                  onClick={() => handleApplyBulkPriceChange(10)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800"
                >
                  +10% Price
                </button>
                <button
                  onClick={() => handleApplyBulkPriceChange(20)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800"
                >
                  +20% Price
                </button>

                {/* Decrease buttons */}
                <button
                  onClick={() => handleApplyBulkPriceChange(-5)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800"
                >
                  -5% Discount
                </button>
                <button
                  onClick={() => handleApplyBulkPriceChange(-10)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800"
                >
                  -10% Discount
                </button>
                <button
                  onClick={() => handleApplyBulkPriceChange(-20)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800"
                >
                  -20% Discount
                </button>
              </div>
            </div>

            {/* Product Catalog List with Individual Price & Image Controls */}
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2d6a4f]" />
                  <span>Product Catalog & Images ({filteredProducts.length})</span>
                </h3>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-[#1f2d1f] dark:text-white"
                  />
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-[#1f2d1f] dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl border border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0e1710] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={product.images[0]?.image_url || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80'}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover border border-[#e2ede0] dark:border-[#243828]"
                      />
                      <div className="min-w-0">
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">
                          {product.category_name || 'Plant Care'} • SKU: {product.sku}
                        </span>
                        <h4 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-gray-500">
                          {product.images?.length || 0} Images • Stock: {product.stock_quantity}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Price Editors */}
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <label className="text-[10px] text-gray-400 block font-semibold">Selling Price (₹)</label>
                        <input
                          type="number"
                          defaultValue={product.price}
                          onBlur={e => handleSaveProductPrices(product.id, Number(e.target.value), product.compare_at_price)}
                          className="w-24 px-2.5 py-1 text-sm font-bold bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] rounded-lg text-[#1b4332] dark:text-[#74c69d]"
                        />
                      </div>

                      <div className="text-left">
                        <label className="text-[10px] text-gray-400 block font-semibold">Compare MRP (₹)</label>
                        <input
                          type="number"
                          defaultValue={product.compare_at_price}
                          onBlur={e => handleSaveProductPrices(product.id, product.price, Number(e.target.value))}
                          className="w-24 px-2.5 py-1 text-sm bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] rounded-lg text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Right: Manage Images Button */}
                    <div>
                      <button
                        onClick={() => setEditingProduct(JSON.parse(JSON.stringify(product)))}
                        className="px-3.5 py-2 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Manage Images ({product.images?.length || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SUPABASE DIAGNOSTICS & SQL HELPER                      */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'supabase' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                    Supabase Live Integration Hub
                  </h2>
                  <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                    Direct connection to project <strong className="font-mono">{DEFAULT_SUPABASE_PROJECT_ID}</strong>
                  </p>
                </div>
              </div>

              {/* Status Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Client Status</span>
                  <div className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Supabase Connected</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f6fbf4] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Orders Table</span>
                  <div className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                    {orders.length} Synced Records
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f6fbf4] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Products Table</span>
                  <div className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                    {products.length} Catalog Items
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSeedOrdersToSupabase}
                  className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Seed Test Orders to Supabase</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    showToast('SQL Schema Copied!', 'success', 'Paste into your Supabase SQL Editor.');
                  }}
                  className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Schema Script (with RLS Policies)</span>
                </button>
              </div>

              {/* SQL Schema Preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  SQL Schema & Table Setup:
                </span>
                <pre className="p-4 rounded-2xl bg-gray-900 text-gray-200 text-xs font-mono overflow-x-auto max-h-64 border border-gray-800">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: BRANDING & COMPANY LOGO STUDIO                           */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'branding' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2ede0] dark:border-[#243828]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-md">
                    <Palette className="w-6 h-6 text-[#d8f3dc]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                      Brand Identity & Company Logo Studio
                    </h2>
                    <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                      Upload your official company logo, customize brand typography, and live-preview changes across navbar & footer.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    resetToDefaults();
                    setLogoInputUrl('');
                    setBrandNameInput('PLANSIO');
                    setTaglineInput('100% Organic Vermicompost & Nursery Living');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Logo</span>
                </button>
              </div>

              {/* Grid: Left Logo Upload & Form | Right: Live Navbar Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Logo Uploader & Sizing Controls */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* File Upload Box with Background Removed / Transparency notice */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Upload Company Logo (Transparent PNG / SVG / Image)
                      </label>
                      {settings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomLogo(null);
                            setLogoInputUrl('');
                          }}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Logo</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,.svg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 8 * 1024 * 1024) {
                            showToast('File Too Large', 'error', 'Please upload a logo image under 8MB.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setCustomLogo(result);
                              setLogoInputUrl(result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer border-2 border-dashed border-emerald-400 dark:border-emerald-700/80 hover:border-emerald-600 dark:hover:border-emerald-400 rounded-2xl p-6 text-center bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-sm text-[#1b4332] dark:text-[#74c69d] block">
                        Click or Drag to Upload Background-Removed Company Logo
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Transparent PNG, SVG, WEBP, or JPG • Entire logo replaces brand header perfectly
                      </p>
                    </div>
                  </div>

                  {/* Or Image URL Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Or Paste Direct Logo Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/your-transparent-logo.png"
                        value={logoInputUrl}
                        onChange={(e) => setLogoInputUrl(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm text-[#1f2d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (logoInputUrl.trim()) {
                            setCustomLogo(logoInputUrl.trim());
                          }
                        }}
                        className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    </div>
                  </div>

                  {/* Logo Display Mode Switcher */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Logo Display Presentation Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLogoDisplayMode('logo-only')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          (settings.logoDisplayMode || 'logo-only') === 'logo-only'
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                            : 'border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0e1710] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                            Full Logo Graphic Only
                          </span>
                          {(settings.logoDisplayMode || 'logo-only') === 'logo-only' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                          Recommended for full logos. Shows your uploaded logo image directly across the header and footer.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLogoDisplayMode('logo-with-text')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          settings.logoDisplayMode === 'logo-with-text'
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                            : 'border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0e1710] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                            Logo Emblem + Custom Text
                          </span>
                          {settings.logoDisplayMode === 'logo-with-text' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                          Shows the uploaded logo emblem on the left, with editable brand title & tagline beside it.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* LOGO COLOR, TINT & HIGH-VISIBILITY STUDIO */}
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] rounded-2xl p-5 border border-[#e2ede0] dark:border-[#243828] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                          Logo Color, Visibility & Tint Effects
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase font-mono">
                        {settings.logoColorFilter || 'original'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Pro-tip for maximum visibility:</strong> If your logo has dark green or black colors that blend into dark headers or footers, choose <strong>Crisp Pure White (Invert)</strong> or <strong>White Card Pill</strong> to make it 100% sharp and visible.
                    </p>

                    {/* Filter Mode Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          id: 'original',
                          label: 'Natural / Original',
                          desc: 'Unmodified natural uploaded colors and transparent alpha channel.',
                          iconBg: 'bg-gray-100 text-gray-700'
                        },
                        {
                          id: 'invert-white',
                          label: '✨ Pure Crisp White',
                          desc: 'Inverts colors to brilliant white for ultra-high contrast on dark backgrounds.',
                          iconBg: 'bg-black text-white font-bold'
                        },
                        {
                          id: 'glow-white',
                          label: '🌟 Radiant White Glow',
                          desc: 'Surrounds logo contours with a luminous soft white halo.',
                          iconBg: 'bg-gray-900 text-yellow-100'
                        },
                        {
                          id: 'glow-emerald',
                          label: '🌿 Neon Emerald Glow',
                          desc: 'Lush organic emerald aura highlighting edges and shapes.',
                          iconBg: 'bg-emerald-950 text-emerald-400'
                        },
                        {
                          id: 'brightness-boost',
                          label: '⚡ Brightness Booster',
                          desc: 'Boosts luminance and contrast by +160% without color shift.',
                          iconBg: 'bg-amber-100 text-amber-900'
                        },
                        {
                          id: 'gold-glow',
                          label: '👑 Golden Warm Aura',
                          desc: 'Warm golden luxury radiance for premium organic botanical styling.',
                          iconBg: 'bg-amber-950 text-amber-300'
                        }
                      ].map((filterOpt) => (
                        <button
                          key={filterOpt.id}
                          type="button"
                          onClick={() => setLogoColorFilter(filterOpt.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            (settings.logoColorFilter || 'original') === filterOpt.id
                              ? 'bg-emerald-50 border-emerald-600 text-[#1b4332] dark:bg-emerald-950/70 dark:text-emerald-300 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                              : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{filterOpt.label}</span>
                              {(settings.logoColorFilter || 'original') === filterOpt.id && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
                              {filterOpt.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Logo Backdrop Pill Container Styling */}
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                        Logo Backdrop / Floating Capsule Card:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'none', label: 'Transparent (None)' },
                          { id: 'white-pill', label: 'White Card Pill' },
                          { id: 'frosted-glass', label: 'Frosted Glass' },
                          { id: 'emerald-badge', label: 'Forest Green Pill' }
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setLogoBackdropStyle(b.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                              (settings.logoBackdropStyle || 'none') === b.id
                                ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600 text-[#1b4332] dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                                : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DEDICATED FOOTER LOGO STUDIO (SIZE, POSITION & VISIBILITY) */}
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] rounded-2xl p-5 border border-[#e2ede0] dark:border-[#243828] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                          Dedicated Footer Logo Studio (Lower Section)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFooterLogoSize(48);
                          setFooterLogoPosition(0, 0);
                          setFooterLogoFilter('match-header');
                        }}
                        className="text-[10px] text-gray-500 hover:text-emerald-700 underline"
                      >
                        Reset Footer Logo
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Customize how your logo looks at the bottom of every page (independent sizing, up/down, left/right, and visibility styling).
                    </p>

                    {/* Footer Logo Height Slider with Steppers */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Footer Logo Height (Size):</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const current = settings.footerLogoHeight || settings.logoHeight || 48;
                              setFooterLogoSize(Math.max(20, current - 6));
                            }}
                            className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            <ZoomOut className="w-3 h-3" />
                            <span>-6px</span>
                          </button>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 px-1">
                            {settings.footerLogoHeight || settings.logoHeight || 48} px
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const current = settings.footerLogoHeight || settings.logoHeight || 48;
                              setFooterLogoSize(Math.min(250, current + 6));
                            }}
                            className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            <ZoomIn className="w-3 h-3" />
                            <span>+6px</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-mono">20px</span>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          step="4"
                          value={settings.footerLogoHeight || settings.logoHeight || 48}
                          onChange={(e) => setFooterLogoSize(Number(e.target.value))}
                          className="flex-1 accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">250px</span>
                      </div>
                    </div>

                    {/* Quick Presets for Footer Logo */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { label: 'Compact', size: 36 },
                        { label: 'Standard', size: 48 },
                        { label: 'Medium', size: 68 },
                        { label: 'Large', size: 96 },
                        { label: 'Prominent', size: 140 },
                        { label: 'Jumbo', size: 180 }
                      ].map((preset) => (
                        <button
                          key={preset.size}
                          type="button"
                          onClick={() => setFooterLogoSize(preset.size)}
                          className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all ${
                            (settings.footerLogoHeight || settings.logoHeight || 48) === preset.size
                              ? 'bg-[#1b4332] text-white font-bold'
                              : 'bg-white dark:bg-[#142217] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {preset.label} ({preset.size}px)
                        </button>
                      ))}
                    </div>

                    {/* Footer Logo Translation Position (Left/Right & Up/Down) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Footer X-Axis (Left / Right):</span>
                          <span className="font-mono text-emerald-700 font-semibold">{settings.footerLogoPositionX || 0} px</span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          step="2"
                          value={settings.footerLogoPositionX || 0}
                          onChange={(e) => setFooterLogoPosition(Number(e.target.value), settings.footerLogoPositionY || 0)}
                          className="w-full accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Footer Y-Axis (Up / Down):</span>
                          <span className="font-mono text-emerald-700 font-semibold">{settings.footerLogoPositionY || 0} px</span>
                        </div>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="2"
                          value={settings.footerLogoPositionY || 0}
                          onChange={(e) => setFooterLogoPosition(settings.footerLogoPositionX || 0, Number(e.target.value))}
                          className="w-full accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Dedicated Footer Visibility Style */}
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                        Footer Logo Visibility & Contrast Theme:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'match-header', label: 'Match Header Settings' },
                          { id: 'invert-white', label: '✨ Pure Crisp White' },
                          { id: 'white-pill', label: '🏷️ White Capsule Card' },
                          { id: 'glow-white', label: '🌟 Radiant White Glow' },
                          { id: 'glow-emerald', label: '🌿 Neon Emerald Glow' },
                          { id: 'original', label: 'Original Colors' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFooterLogoFilter(opt.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                              (settings.footerLogoFilter || 'match-header') === opt.id
                                ? 'bg-emerald-50 border-emerald-600 text-[#1b4332] dark:bg-emerald-950/70 dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                                : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE LOGO SIZING STUDIO: INCREASE & DECREASE UP TO 300PX */}
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] rounded-2xl p-5 border border-[#e2ede0] dark:border-[#243828] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                          Logo Size & Scaling Controls (Up to 300px)
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                        {settings.logoHeight || 44} px height
                      </span>
                    </div>

                    {/* Height Slider with Direct Steppers & 300px range */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Logo Height (Vertical Scaling):</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const current = settings.logoHeight || 44;
                              const next = Math.max(20, current - 8);
                              setLogoSize(next);
                            }}
                            className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                            title="Decrease Logo Size"
                          >
                            <ZoomOut className="w-3 h-3" />
                            <span>-8px</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const current = settings.logoHeight || 44;
                              const next = Math.min(300, current + 8);
                              setLogoSize(next);
                            }}
                            className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                            title="Increase Logo Size"
                          >
                            <ZoomIn className="w-3 h-3" />
                            <span>+8px</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-mono">20px</span>
                        <input
                          type="range"
                          min="20"
                          max="300"
                          step="4"
                          value={settings.logoHeight || 44}
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          className="flex-1 accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">300px</span>
                      </div>
                    </div>

                    {/* Quick Preset Pills with up to 300px */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">
                        Quick Sizing Presets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Compact', size: 36 },
                          { label: 'Standard', size: 48 },
                          { label: 'Medium', size: 68 },
                          { label: 'Large', size: 96 },
                          { label: 'Prominent', size: 140 },
                          { label: 'Jumbo (200px)', size: 200 },
                          { label: 'Ultra (300px)', size: 300 }
                        ].map((preset) => (
                          <button
                            key={preset.size}
                            type="button"
                            onClick={() => setLogoSize(preset.size)}
                            className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all ${
                              (settings.logoHeight || 44) === preset.size
                                ? 'bg-[#1b4332] text-white shadow-xs font-bold'
                                : 'bg-white dark:bg-[#142217] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-500'
                            }`}
                          >
                            {preset.label} ({preset.size}px)
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Max Width Slider */}
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Max Width (Horizontal Constraint):</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                          {settings.logoMaxWidth || 300} px
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-mono">100px</span>
                        <input
                          type="range"
                          min="100"
                          max="500"
                          step="10"
                          value={settings.logoMaxWidth || 300}
                          onChange={(e) => setLogoSize(settings.logoHeight || 44, Number(e.target.value))}
                          className="flex-1 accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-400 font-mono">500px</span>
                      </div>
                    </div>
                  </div>

                  {/* LOGO POSITIONING & ALIGNMENT CONTROLS (X & Y AXIS OFFSETS & CORNER PLACEMENT) */}
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] rounded-2xl p-5 border border-[#e2ede0] dark:border-[#243828] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                          Logo Position & Side Alignment
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPosition(0, 0);
                          setLogoPlacement('left');
                        }}
                        className="text-[10px] text-gray-500 hover:text-emerald-700 underline"
                      >
                        Reset Position
                      </button>
                    </div>

                    {/* Corner vs Left Placement */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block">
                        Side Anchor & Corner Placement:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setLogoPlacement('left')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            (settings.logoPlacement || 'left') === 'left'
                              ? 'bg-emerald-50 border-emerald-600 text-[#1b4332] dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500'
                              : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-600'
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>Standard Left Side</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoPlacement('corner')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            settings.logoPlacement === 'corner'
                              ? 'bg-emerald-50 border-emerald-600 text-[#1b4332] dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500'
                              : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-600'
                          }`}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Right in Corner (Flush)</span>
                        </button>
                      </div>
                    </div>

                    {/* Horizontal X-Axis Offset (Right to Left & Left to Right) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Horizontal Position (X-Axis: Left / Right):</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                          {settings.logoPositionX || 0} px
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-mono">-50px (Left)</span>
                        <input
                          type="range"
                          min="-50"
                          max="80"
                          step="2"
                          value={settings.logoPositionX || 0}
                          onChange={(e) => setLogoPosition(Number(e.target.value), settings.logoPositionY || 0)}
                          className="flex-1 accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-400 font-mono">+80px (Right)</span>
                      </div>
                    </div>

                    {/* Vertical Y-Axis Offset */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Vertical Position (Y-Axis: Up / Down):</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                          {settings.logoPositionY || 0} px
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-mono">-20px (Up)</span>
                        <input
                          type="range"
                          min="-20"
                          max="30"
                          step="1"
                          value={settings.logoPositionY || 0}
                          onChange={(e) => setLogoPosition(settings.logoPositionX || 0, Number(e.target.value))}
                          className="flex-1 accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-400 font-mono">+30px (Down)</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM FOOTER CUSTOMIZATION (WHITE BACKGROUND & THEME REPLACEMENT) */}
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] rounded-2xl p-5 border border-[#e2ede0] dark:border-[#243828] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paintbrush className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                          Footer Bottom Section Styling
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                        {settings.footerBgMode || 'dark'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block">
                        Select Footer Background Theme:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'white', label: 'Clean White', bg: 'bg-white text-gray-800 border-gray-300 shadow-sm' },
                          { id: 'light-green', label: 'Soft Green', bg: 'bg-[#f4faf2] text-[#1b4332] border-[#d8ecd4]' },
                          { id: 'emerald', label: 'Deep Forest', bg: 'bg-[#1b4332] text-white border-[#2d6a4f]' },
                          { id: 'dark', label: 'Midnight Dark', bg: 'bg-[#101c13] text-gray-300 border-[#1c2e20]' }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setFooterBgMode(theme.id as any)}
                            className={`p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1.5 ${
                              (settings.footerBgMode || 'dark') === theme.id
                                ? 'ring-2 ring-emerald-600 shadow-md font-extrabold'
                                : 'opacity-85 hover:opacity-100'
                            } ${theme.bg}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current shrink-0"></span>
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Company Brand Name & Tagline Inputs */}
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandNameInput}
                        onChange={(e) => {
                          setBrandNameInput(e.target.value);
                          updateSettings({ brandName: e.target.value });
                        }}
                        placeholder="e.g. PLANSIO / GreenCorp Organics"
                        className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm text-[#1f2d1f] dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Brand Tagline / Slogan
                      </label>
                      <input
                        type="text"
                        value={taglineInput}
                        onChange={(e) => {
                          setTaglineInput(e.target.value);
                          updateSettings({ tagline: e.target.value });
                        }}
                        placeholder="e.g. 100% Organic Vermicompost & Nursery Living"
                        className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm text-[#1f2d1f] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Preset Transparent Company Logos for 1-click test */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                      Instant Sample Transparent Logos (1-Click Test):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          name: 'Botanical Leaf',
                          url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=240&q=80'
                        },
                        {
                          name: 'Bio Vermi Earth',
                          url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=240&q=80'
                        },
                        {
                          name: 'Eco Nursery Hub',
                          url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=240&q=80'
                        },
                        {
                          name: 'Flora Bloom Gold',
                          url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=240&q=80'
                        }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCustomLogo(preset.url);
                            setLogoInputUrl(preset.url);
                          }}
                          className="p-2 rounded-xl border border-[#e2ede0] dark:border-[#243828] hover:border-emerald-500 bg-[#fbfdfb] dark:bg-[#0e1710] flex flex-col items-center gap-1.5 transition-all group"
                        >
                          <img src={preset.url} alt={preset.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Responsive Multi-Canvas Real-Time Preview */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="bg-[#f6fbf4] dark:bg-[#0e1710] p-6 rounded-3xl border border-[#e2ede0] dark:border-[#243828] space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e2ede0] dark:border-[#243828]">
                      <span className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb] flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>Live Real-Time Navbar & Logo Preview</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                        Interactive
                      </span>
                    </div>

                    {/* Isolated Background Removal / Transparency Checkerboard Test */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                          Transparency & Background Removal Test Canvas:
                        </span>
                        <span className="text-[10px] text-gray-400">
                          H: {settings.logoHeight || 44}px • W: {settings.logoMaxWidth || 240}px
                        </span>
                      </div>
                      
                      <div
                        style={{
                          backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px), radial-gradient(#d1d5db 1px, #f9fafb 1px)`,
                          backgroundSize: '16px 16px',
                          backgroundPosition: '0 0, 8px 8px'
                        }}
                        className="p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center min-h-[100px] transition-all"
                      >
                        {settings.logoUrl ? (
                          <div
                            style={{
                              height: `${settings.logoHeight || 44}px`,
                              maxWidth: `${settings.logoMaxWidth || 240}px`
                            }}
                            className="flex items-center justify-center transition-all duration-150"
                          >
                            <img
                              src={settings.logoUrl}
                              alt="Logo Transparency Test"
                              style={{ height: `${settings.logoHeight || 44}px` }}
                              className="w-auto max-w-full object-contain filter drop-shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center">
                              <Sprout className="w-6 h-6 text-[#d8f3dc]" />
                            </div>
                            <span className="text-xl font-black text-[#1b4332] font-['Poppins']">
                              {settings.brandName || 'PLANSIO'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Light Mode Navbar Appearance */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-gray-600 block">Light Mode Header Appearance:</span>
                      <div className="p-4 rounded-2xl bg-white border border-[#e2ede0] shadow-sm flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          {settings.logoUrl ? (
                            settings.logoDisplayMode === 'logo-with-text' ? (
                              <>
                                <div
                                  style={{
                                    height: `${settings.logoHeight || 44}px`,
                                    maxWidth: `${settings.logoMaxWidth || 240}px`
                                  }}
                                  className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent transition-all"
                                >
                                  <img
                                    src={settings.logoUrl}
                                    alt="Logo Preview"
                                    style={{ height: `${settings.logoHeight || 44}px` }}
                                    className="w-auto max-w-full object-contain"
                                  />
                                </div>
                                <div>
                                  <span className="text-xl font-black tracking-tight text-[#1b4332] block leading-none font-['Poppins']">
                                    {settings.brandName || 'PLANSIO'}
                                  </span>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#526352] block mt-0.5">
                                    {settings.tagline || 'Grow Better. Live Greener.'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div
                                style={{
                                  height: `${settings.logoHeight || 48}px`,
                                  maxWidth: `${settings.logoMaxWidth || 280}px`
                                }}
                                className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent transition-all"
                              >
                                <img
                                  src={settings.logoUrl}
                                  alt="Logo Preview"
                                  style={{ height: `${settings.logoHeight || 48}px` }}
                                  className="w-auto max-w-full object-contain filter drop-shadow-xs"
                                />
                              </div>
                            )
                          ) : (
                            <>
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1b4332] via-[#24533e] to-[#2d6a4f] flex items-center justify-center text-white shadow-md shadow-[#1b4332]/25 ring-2 ring-emerald-500/20">
                                <Sprout className="w-6 h-6 text-[#d8f3dc]" />
                              </div>
                              <div>
                                <span className="text-xl font-black tracking-tight text-[#1b4332] block leading-none font-['Poppins']">
                                  {settings.brandName || 'PLANSIO'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#526352] block mt-0.5">
                                  {settings.tagline || 'Grow Better. Live Greener.'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-xs font-semibold px-3 py-1 bg-[#1b4332] text-white rounded-full">
                            Shop All
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dark Mode Navbar Appearance */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-gray-400 block">Dark Mode Header Appearance:</span>
                      <div className="p-4 rounded-2xl bg-[#0e1710] border border-[#243828] shadow-sm flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          {settings.logoUrl ? (
                            settings.logoDisplayMode === 'logo-with-text' ? (
                              <>
                                <div
                                  style={{
                                    height: `${settings.logoHeight || 44}px`,
                                    maxWidth: `${settings.logoMaxWidth || 240}px`
                                  }}
                                  className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent transition-all"
                                >
                                  <img
                                    src={settings.logoUrl}
                                    alt="Logo Dark Preview"
                                    style={{ height: `${settings.logoHeight || 44}px` }}
                                    className="w-auto max-w-full object-contain filter drop-shadow-xs"
                                  />
                                </div>
                                <div>
                                  <span className="text-xl font-black tracking-tight text-[#74c69d] block leading-none font-['Poppins']">
                                    {settings.brandName || 'PLANSIO'}
                                  </span>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#a3b8a6] block mt-0.5">
                                    {settings.tagline || 'Grow Better. Live Greener.'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div
                                style={{
                                  height: `${settings.logoHeight || 48}px`,
                                  maxWidth: `${settings.logoMaxWidth || 280}px`
                                }}
                                className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent transition-all"
                              >
                                <img
                                  src={settings.logoUrl}
                                  alt="Logo Dark Preview"
                                  style={{ height: `${settings.logoHeight || 48}px` }}
                                  className="w-auto max-w-full object-contain filter brightness-105"
                                />
                              </div>
                            )
                          ) : (
                            <>
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-white shadow-md">
                                <Sprout className="w-6 h-6 text-[#d8f3dc]" />
                              </div>
                              <div>
                                <span className="text-xl font-black tracking-tight text-[#74c69d] block leading-none font-['Poppins']">
                                  {settings.brandName || 'PLANSIO'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#a3b8a6] block mt-0.5">
                                  {settings.tagline || 'Grow Better. Live Greener.'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-xs font-semibold px-3 py-1 bg-[#40916c] text-white rounded-full">
                            Shop All
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Representation Card */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] text-xs text-gray-500 dark:text-gray-400 space-y-2">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">
                        Instant Storefront Synchronization
                      </span>
                      <p>
                        Any logo replacement, size adjustment, or typography change made here instantly synchronizes with the customer-facing header, mobile navigation drawer, and footer with zero reload required.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: HERO BANNER TEMPLATE STUDIO                              */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'hero-studio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-6">
              
              <div className="flex items-center gap-3.5 pb-6 border-b border-[#e2ede0] dark:border-[#243828]">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-md">
                  <LayoutTemplate className="w-6 h-6 text-[#d8f3dc]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                    Hero Banner Template Studio
                  </h2>
                  <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                    Select curated homepage hero presets or customize headlines, discount pill text, and promotional banners.
                  </p>
                </div>
              </div>

              {/* 4 Template Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Select Hero Template Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {HERO_TEMPLATES.map((tmpl) => {
                    const isSelected = settings.heroBanner?.templateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => applyHeroTemplate(tmpl.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#2d6a4f] bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-[#2d6a4f]/30'
                            : 'border-[#e2ede0] dark:border-[#243828] bg-[#fbfdfb] dark:bg-[#0e1710] hover:border-emerald-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs sm:text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                              {tmpl.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {tmpl.description}
                          </p>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg text-center ${
                          isSelected ? 'bg-[#1b4332] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {isSelected ? 'Active Template' : 'Click to Apply'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editable Hero Banner Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#e2ede0] dark:border-[#243828]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={settings.heroBanner?.headlineMain || ''}
                      onChange={(e) => updateHeroBanner({ headlineMain: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm font-bold text-[#1b4332] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Accent Headline (Green Highlight)
                    </label>
                    <input
                      type="text"
                      value={settings.heroBanner?.headlineAccent || ''}
                      onChange={(e) => updateHeroBanner({ headlineAccent: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm font-bold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Subheadline Copy
                    </label>
                    <textarea
                      rows={3}
                      value={settings.heroBanner?.subheadline || ''}
                      onChange={(e) => updateHeroBanner({ subheadline: e.target.value })}
                      className="w-full px-4 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Top Announcement & Discount Banner Pill
                    </label>
                    <input
                      type="text"
                      value={settings.heroBanner?.discountPillText || ''}
                      onChange={(e) => updateHeroBanner({ discountPillText: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Hero Banner Image URL
                    </label>
                    <input
                      type="url"
                      value={settings.heroBanner?.imageUrl || ''}
                      onChange={(e) => updateHeroBanner({ imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={settings.heroBanner?.primaryBtnText || 'SHOP NOW'}
                        onChange={(e) => updateHeroBanner({ primaryBtnText: e.target.value })}
                        className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Secondary CTA Button
                      </label>
                      <input
                        type="text"
                        value={settings.heroBanner?.secondaryBtnText || 'EXPLORE PLANTS'}
                        onChange={(e) => updateHeroBanner({ secondaryBtnText: e.target.value })}
                        className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: VIDEO SHOWCASE MANAGER                                   */}
        {/* ------------------------------------------------------------- */}
        {activeAdminTab === 'videos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#142217] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2ede0] dark:border-[#243828] space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2ede0] dark:border-[#243828]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-md">
                    <Video className="w-6 h-6 text-[#d8f3dc]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
                      Organic Video Showcase Manager
                    </h2>
                    <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                      Manage masterclass videos, nursery tours, and organic soil preparation guides shown on the homepage.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddVideoOpen(true)}
                  className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Video</span>
                </button>
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(settings.sampleVideos || []).map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-[#fbfdfb] dark:bg-[#0e1710] rounded-2xl overflow-hidden border border-[#e2ede0] dark:border-[#243828] shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-black/40">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded-md font-mono">
                        {vid.duration}
                      </span>
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-emerald-700/90 text-white text-[10px] font-bold rounded-full">
                        {vid.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb] line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {vid.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#e2ede0] dark:border-[#243828] text-xs">
                        <span className="text-gray-400 text-[11px]">{vid.views || '12.4k views'}</span>
                        <button
                          onClick={() => deleteVideo(vid.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Modal: Add New Video */}
        {isAddVideoOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#e2ede0] dark:border-[#243828] pb-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                    Add New Showcase Video
                  </h3>
                </div>
                <button onClick={() => setIsAddVideoOpen(false)} className="p-1 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newVideoForm.title || !newVideoForm.videoUrl) {
                    showToast('Validation Error', 'error', 'Title and Video URL are required.');
                    return;
                  }
                  addVideo({
                    title: newVideoForm.title,
                    description: newVideoForm.description,
                    videoUrl: newVideoForm.videoUrl,
                    thumbnailUrl: newVideoForm.thumbnailUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                    duration: newVideoForm.duration || '2:30',
                    category: newVideoForm.category,
                    author: newVideoForm.author,
                    views: '1.2k views'
                  });
                  setIsAddVideoOpen(false);
                }}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newVideoForm.title}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
                    placeholder="e.g. Masterclass: Preparing Potting Mix with Vermicompost"
                    className="w-full px-3.5 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Video URL (.mp4 or stream link)
                  </label>
                  <input
                    type="url"
                    required
                    value={newVideoForm.videoUrl}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, videoUrl: e.target.value })}
                    placeholder="https://assets.mixkit.co/.../video.mp4"
                    className="w-full px-3.5 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={newVideoForm.thumbnailUrl}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newVideoForm.category}
                      onChange={(e) => setNewVideoForm({ ...newVideoForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newVideoForm.duration}
                      onChange={(e) => setNewVideoForm({ ...newVideoForm, duration: e.target.value })}
                      placeholder="3:45"
                      className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={newVideoForm.description}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddVideoOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Save Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TRACK & VIEW ORDER DETAIL                              */}
      {/* ------------------------------------------------------------- */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2d6a4f]" />
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Order Tracking: #{selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              {/* Visual Tracker Timeline */}
              <div className="bg-[#fbfdfb] dark:bg-[#0e1710] p-4 rounded-2xl border border-[#e2ede0] dark:border-[#243828] space-y-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Fulfillment Status Tracker
                </span>
                
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                  {/* Step 1 */}
                  <div className={`p-2 rounded-xl border flex flex-col items-center ${
                    ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(selectedOrder.order_status)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold'
                      : 'border-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 mb-1" />
                    <span>Placed</span>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-2 rounded-xl border flex flex-col items-center ${
                    ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(selectedOrder.order_status)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold'
                      : 'border-gray-200 text-gray-400'
                  }`}>
                    <Package className="w-4 h-4 mb-1" />
                    <span>Confirmed</span>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-2 rounded-xl border flex flex-col items-center ${
                    ['Shipped', 'Out for Delivery', 'Delivered'].includes(selectedOrder.order_status)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold'
                      : 'border-gray-200 text-gray-400'
                  }`}>
                    <Truck className="w-4 h-4 mb-1" />
                    <span>Shipped</span>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-2 rounded-xl border flex flex-col items-center ${
                    selectedOrder.order_status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold'
                      : 'border-gray-200 text-gray-400'
                  }`}>
                    <Check className="w-4 h-4 mb-1" />
                    <span>Delivered</span>
                  </div>
                </div>

                {selectedOrder.tracking_number && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between">
                    <span>Carrier: <strong>{selectedOrder.carrier || 'Standard Express'}</strong></span>
                    <span>AWB: <strong className="font-mono">{selectedOrder.tracking_number}</strong></span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">Ordered Items</span>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828]"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{item.product_name}</div>
                          <div className="text-[11px] text-gray-500">{item.variant_name || 'Standard'} • Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-bold text-[#1b4332] dark:text-[#74c69d]">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address & Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-1">
                  <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Shipping Destination</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{selectedOrder.shipping_name}</p>
                  <p className="text-gray-500">{selectedOrder.shipping_phone}</p>
                  <p className="text-gray-500">{selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_postal_code}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] space-y-1">
                  <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Financial Breakdown</span>
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee:</span>
                    <span>₹{selectedOrder.shipping_fee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1b4332] dark:text-[#74c69d] pt-1 border-t border-gray-200 dark:border-gray-800">
                    <span>Total Paid:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#e2ede0] dark:border-[#243828] flex justify-end gap-2 bg-[#f6fbf4] dark:bg-[#0e1710]">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SHIP ORDER DIALOG                                      */}
      {/* ------------------------------------------------------------- */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#e2ede0] dark:border-[#243828] pb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Ship Order #{shippingOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setShippingOrder(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShipOrderSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Courier / Logistics Partner
                </label>
                <select
                  value={carrierName}
                  onChange={e => setCarrierName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-gray-800 dark:text-white"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="Blue Dart Air">Blue Dart Air</option>
                  <option value="DTDC Premium">DTDC Premium</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="Shadowfax Local">Shadowfax Local</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Tracking ID / AWB Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  required
                  placeholder="e.g. DELH-98721382"
                  className="w-full px-3 py-2.5 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-gray-800 dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShippingOrder(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REPLACE / EDIT ORDER                                   */}
      {/* ------------------------------------------------------------- */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Replace & Modify Order #{editingOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setEditingOrder(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedOrder} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_name}
                    onChange={e => setEditingOrder({ ...editingOrder, shipping_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_phone}
                    onChange={e => setEditingOrder({ ...editingOrder, shipping_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingOrder.shipping_address}
                  onChange={e => setEditingOrder({ ...editingOrder, shipping_address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_city}
                    onChange={e => setEditingOrder({ ...editingOrder, shipping_city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_state}
                    onChange={e => setEditingOrder({ ...editingOrder, shipping_state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_postal_code}
                    onChange={e => setEditingOrder({ ...editingOrder, shipping_postal_code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  />
                </div>
              </div>

              {/* Status & Payment selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Order Status</label>
                  <select
                    value={editingOrder.order_status}
                    onChange={e => setEditingOrder({ ...editingOrder, order_status: e.target.value as OrderStatus })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Payment Status</label>
                  <select
                    value={editingOrder.payment_status}
                    onChange={e => setEditingOrder({ ...editingOrder, payment_status: e.target.value as PaymentStatus })}
                    className="w-full px-3 py-2 bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828] rounded-xl"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Order Items Quantity Adjuster */}
              <div className="space-y-3 pt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">Edit / Replace Quantities</span>
                <div className="space-y-2">
                  {editingOrder.items.map((itm, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710] border border-[#e2ede0] dark:border-[#243828]">
                      <div className="flex items-center gap-3">
                        <img src={itm.product_image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 block">{itm.product_name}</span>
                          <span className="text-[11px] text-gray-500">₹{itm.unit_price} each</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          value={itm.quantity}
                          onChange={e => {
                            const newQty = Math.max(1, Number(e.target.value));
                            const updatedItems = [...editingOrder.items];
                            updatedItems[i].quantity = newQty;
                            updatedItems[i].subtotal = updatedItems[i].unit_price * newQty;
                            setEditingOrder({ ...editingOrder, items: updatedItems });
                          }}
                          className="w-16 px-2 py-1 bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] rounded-lg text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedItems = editingOrder.items.filter((_, idx) => idx !== i);
                            setEditingOrder({ ...editingOrder, items: updatedItems });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-[#e2ede0] dark:border-[#243828] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Modifications to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD NEW MANUAL ORDER                                   */}
      {/* ------------------------------------------------------------- */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Create New Order (Direct to Supabase)
                </h3>
              </div>
              <button onClick={() => setIsCreateOrderOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              {/* Product Selector */}
              <div className="space-y-3 bg-[#fbfdfb] dark:bg-[#0e1710] p-4 rounded-2xl border border-[#e2ede0] dark:border-[#243828]">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">Select Products for Order</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {products.map(p => {
                    const isSelected = newOrderItems.some(itm => itm.productId === p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (isSelected) {
                            setNewOrderItems(newOrderItems.filter(itm => itm.productId !== p.id));
                          } else {
                            setNewOrderItems([
                              ...newOrderItems,
                              {
                                productId: p.id,
                                variantId: p.variants[0]?.id,
                                quantity: 1,
                                unitPrice: p.variants[0]?.price || p.price
                              }
                            ]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700'
                            : 'bg-white dark:bg-[#142217] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={p.images[0]?.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-medium truncate">{p.name}</span>
                        </div>
                        <span className="font-bold ml-2">₹{p.price}</span>
                      </div>
                    );
                  })}
                </div>

                {newOrderItems.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase">Selected Items & Quantities:</span>
                    {newOrderItems.map((item, idx) => {
                      const prod = products.find(p => p.id === item.productId)!;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#142217] border border-gray-200 dark:border-gray-800">
                          <span className="font-medium text-xs truncate max-w-[200px]">{prod?.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => {
                                const q = Math.max(1, Number(e.target.value));
                                const updated = [...newOrderItems];
                                updated[idx].quantity = q;
                                setNewOrderItems(updated);
                              }}
                              className="w-14 px-1.5 py-0.5 border rounded text-center text-xs"
                            />
                            <span className="font-bold text-xs">₹{item.unitPrice * item.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer Shipping Form */}
              <div className="space-y-3">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">Customer & Destination</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newOrderCustomer.name}
                    onChange={e => setNewOrderCustomer({ ...newOrderCustomer, name: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710]"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newOrderCustomer.phone}
                    onChange={e => setNewOrderCustomer({ ...newOrderCustomer, phone: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710]"
                  />
                  <input
                    type="text"
                    placeholder="Address Line"
                    value={newOrderCustomer.address}
                    onChange={e => setNewOrderCustomer({ ...newOrderCustomer, address: e.target.value })}
                    required
                    className="sm:col-span-2 px-3 py-2 border rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710]"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newOrderCustomer.city}
                    onChange={e => setNewOrderCustomer({ ...newOrderCustomer, city: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710]"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={newOrderCustomer.postal_code}
                    onChange={e => setNewOrderCustomer({ ...newOrderCustomer, postal_code: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-xl bg-[#fbfdfb] dark:bg-[#0e1710]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#e2ede0] dark:border-[#243828] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save & Place Order in Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PRODUCT IMAGE MANAGEMENT                               */}
      {/* ------------------------------------------------------------- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                  Manage Images: {editingProduct.name}
                </h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              {/* Existing Gallery Images */}
              <div className="space-y-3">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">
                  Current Gallery Images ({editingProduct.images?.length || 0})
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {editingProduct.images?.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="group relative rounded-2xl overflow-hidden border border-[#e2ede0] dark:border-[#243828] aspect-square bg-gray-100"
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <span className="absolute top-2 left-2 bg-[#1b4332] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                          Primary
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveImage(img.id || img.image_url)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Image Input */}
              <div className="bg-[#fbfdfb] dark:bg-[#0e1710] p-4 rounded-2xl border border-[#e2ede0] dark:border-[#243828] space-y-3">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">Add New Image URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] rounded-xl text-xs"
                  />
                  <button
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#1b4332] hover:bg-[#143526] text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Add Image
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-semibold text-gray-400 block mb-1.5">Sample Botanical Image Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-lg"
                    >
                      Vermicompost Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-lg"
                    >
                      Bio Booster Bottle
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-lg"
                    >
                      Indoor Foliage
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#e2ede0] dark:border-[#243828] flex justify-end bg-[#f6fbf4] dark:bg-[#0e1710]">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
