import { getSupabaseClient, isLiveSupabaseConfigured } from '../lib/supabase';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/mockSeedData';
import {
  Category,
  Product,
  CartItem,
  WishlistItem,
  Profile,
  Address,
  Order,
  Review,
  ProductFilter
} from '../types/database';

// Local storage keys for persistent offline sandbox sync when live Supabase is not connected
const DB_STORAGE_PREFIX = 'plansio_db_';

const getLocalDb = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(DB_STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
};

const setLocalDb = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(DB_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

// Initialize seed data in local storage sandbox if not present
const initializeSandboxData = () => {
  const existingProds = getLocalDb<Product[]>('products', []);
  if (!existingProds || existingProds.length === 0) {
    setLocalDb('products', INITIAL_PRODUCTS);
  } else {
    // Ensure all products have authentic 0 ratings if no real user reviews were submitted
    const sanitized = existingProds.map(p => ({
      ...p,
      rating: p.reviews && p.reviews.length > 0 ? p.rating : 0,
      review_count: p.reviews ? p.reviews.length : 0,
      reviews: p.reviews || []
    }));
    setLocalDb('products', sanitized);
  }
  // Sync categories
  const storedCats = getLocalDb<Category[]>('categories', []);
  if (!storedCats || storedCats.length === 0 || !storedCats.some(c => c.slug === 'vermicompost')) {
    setLocalDb('categories', INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(DB_STORAGE_PREFIX + 'cart_items')) {
    setLocalDb('cart_items', []);
  }
  if (!localStorage.getItem(DB_STORAGE_PREFIX + 'wishlist_items')) {
    setLocalDb('wishlist_items', []);
  }
  if (!localStorage.getItem(DB_STORAGE_PREFIX + 'addresses')) {
    setLocalDb('addresses', [
      {
        id: 'addr-demo-1',
        user_id: 'guest_or_demo_user',
        full_name: 'Aditi Deshmukh',
        phone: '+91 98765 43210',
        address_line_1: 'Flat 402, Green Meadows Residency',
        address_line_2: 'Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postal_code: '560038',
        country: 'India',
        is_default: true,
        created_at: new Date().toISOString()
      }
    ]);
  }
  if (!localStorage.getItem(DB_STORAGE_PREFIX + 'orders')) {
    setLocalDb('orders', [
      {
        id: 'ord-seed-01',
        user_id: 'guest_or_demo_user',
        order_number: 'PLN-2026-000412',
        subtotal: 1048,
        discount: 100,
        shipping_fee: 0,
        total: 948,
        payment_method: 'UPI',
        payment_status: 'Paid',
        order_status: 'Out for Delivery',
        shipping_name: 'Aditi Deshmukh',
        shipping_phone: '+91 98765 43210',
        shipping_address: 'Flat 402, Green Meadows Residency, Indiranagar',
        shipping_city: 'Bengaluru',
        shipping_state: 'Karnataka',
        shipping_postal_code: '560038',
        shipping_country: 'India',
        delivery_type: 'Standard',
        items: [
          {
            id: 'ord-itm-1',
            order_id: 'ord-seed-01',
            product_id: 'prod-1',
            product_name: 'PLANSIO Gold Grade Vermicompost',
            product_image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            variant_name: '5 KG Bag',
            quantity: 2,
            unit_price: 349,
            subtotal: 698
          },
          {
            id: 'ord-itm-2',
            order_id: 'ord-seed-01',
            product_id: 'prod-3',
            product_name: 'PLANSIO Cold-Pressed Seaweed Liquid Booster',
            product_image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
            variant_name: '500 ML Bottle',
            quantity: 1,
            unit_price: 399,
            subtotal: 399
          }
        ],
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      }
    ]);
  }
};

initializeSandboxData();

// ==========================================
// 1. CATEGORIES API
// ==========================================
export const getCategories = async (): Promise<Category[]> => {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Live Supabase query failed, falling back to local dataset:', err);
    }
  }
  return getLocalDb<Category[]>('categories', INITIAL_CATEGORIES);
};

export const updateCategory = async (
  categoryId: string,
  updates: Partial<Category>
): Promise<Category | null> => {
  const categories = getLocalDb<Category[]>('categories', INITIAL_CATEGORIES);
  const index = categories.findIndex(c => c.id === categoryId || c.slug === categoryId);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...updates
  };

  setLocalDb('categories', categories);

  if (isLiveSupabaseConfigured() && isValidUUID(categoryId)) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('categories').update(updates).eq('id', categoryId);
    } catch (err) {
      console.warn('Supabase updateCategory error:', err);
    }
  }

  return categories[index];
};

// ==========================================
// 2. PRODUCTS API
// ==========================================
export const getProducts = async (filters: Partial<ProductFilter> = {}): Promise<Product[]> => {
  let products: Product[] = [];

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      let query = supabase
        .from('products')
        .select('*, category:categories(name), images:product_images(*), variants:product_variants(*), reviews:reviews(*)')
        .eq('is_active', true);

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.inStockOnly) {
        query = query.gt('stock_quantity', 0);
      }
      if (filters.minRating !== undefined) {
        query = query.gte('rating', filters.minRating);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data;
      }
    } catch (err) {
      console.warn('Live Supabase products query failed, using local dataset:', err);
    }
  }

  if (products.length === 0) {
    products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  }

  // Apply client-side filters / sorting
  let filtered = [...products];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(
      p => p.category_id === filters.category || p.category_name?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter(p => p.stock_quantity > 0);
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    filtered = filtered.filter(p => p.rating >= filters.minRating!);
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'bestseller':
      filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return filtered;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(*), variants:product_variants(*), reviews:reviews(*)')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase product query error:', err);
    }
  }

  const all = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  return all.find(p => p.id === id || p.slug === id) || null;
};

// ==========================================
// 3. CART API
// ==========================================
export const getCart = async (userId: string): Promise<CartItem[]> => {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*), variant:product_variants(*)')
        .eq('user_id', userId);
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase cart query error:', err);
    }
  }

  const items = getLocalDb<CartItem[]>('cart_items', []);
  return items.filter(item => item.user_id === userId);
};

export const addToCart = async (
  userId: string,
  product: Product,
  variantId?: string | null,
  quantity: number = 1
): Promise<CartItem> => {
  const selectedVariant = variantId ? product.variants.find(v => v.id === variantId) || null : null;
  const currentItems = getLocalDb<CartItem[]>('cart_items', []);

  // Check if exists
  const existingIndex = currentItems.findIndex(
    item => item.user_id === userId && item.product_id === product.id && item.variant_id === variantId
  );

  let updatedItem: CartItem;

  if (existingIndex > -1) {
    currentItems[existingIndex].quantity += quantity;
    currentItems[existingIndex].updated_at = new Date().toISOString();
    updatedItem = currentItems[existingIndex];
  } else {
    updatedItem = {
      id: 'cart-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      product_id: product.id,
      variant_id: variantId || null,
      quantity,
      product,
      variant: selectedVariant,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    currentItems.push(updatedItem);
  }

  setLocalDb('cart_items', currentItems);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('cart_items').upsert({
        user_id: userId,
        product_id: product.id,
        variant_id: variantId || null,
        quantity: updatedItem.quantity
      });
    } catch (err) {
      console.warn('Supabase live cart sync error:', err);
    }
  }

  return updatedItem;
};

export const updateCartQuantity = async (cartItemId: string, quantity: number): Promise<void> => {
  const currentItems = getLocalDb<CartItem[]>('cart_items', []);
  const index = currentItems.findIndex(i => i.id === cartItemId);
  if (index > -1) {
    if (quantity <= 0) {
      currentItems.splice(index, 1);
    } else {
      currentItems[index].quantity = quantity;
      currentItems[index].updated_at = new Date().toISOString();
    }
    setLocalDb('cart_items', currentItems);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', cartItemId);
      } else {
        await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId);
      }
    } catch (err) {
      console.warn('Supabase cart update error:', err);
    }
  }
};

export const removeFromCart = async (cartItemId: string): Promise<void> => {
  const currentItems = getLocalDb<CartItem[]>('cart_items', []);
  const filtered = currentItems.filter(i => i.id !== cartItemId);
  setLocalDb('cart_items', filtered);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('cart_items').delete().eq('id', cartItemId);
    } catch (err) {
      console.warn('Supabase cart remove error:', err);
    }
  }
};

export const clearCart = async (userId: string): Promise<void> => {
  const currentItems = getLocalDb<CartItem[]>('cart_items', []);
  const filtered = currentItems.filter(i => i.user_id !== userId);
  setLocalDb('cart_items', filtered);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('cart_items').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase clear cart error:', err);
    }
  }
};

// ==========================================
// 4. WISHLIST API
// ==========================================
export const getWishlist = async (userId: string): Promise<WishlistItem[]> => {
  const items = getLocalDb<WishlistItem[]>('wishlist_items', []);
  return items.filter(w => w.user_id === userId);
};

export const toggleWishlist = async (userId: string, product: Product): Promise<boolean> => {
  const items = getLocalDb<WishlistItem[]>('wishlist_items', []);
  const existsIndex = items.findIndex(w => w.user_id === userId && w.product_id === product.id);

  let isNowWishlisted = false;
  if (existsIndex > -1) {
    items.splice(existsIndex, 1);
    isNowWishlisted = false;
  } else {
    items.push({
      id: 'wish-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      product_id: product.id,
      product,
      created_at: new Date().toISOString()
    });
    isNowWishlisted = true;
  }

  setLocalDb('wishlist_items', items);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (isNowWishlisted) {
        await supabase.from('wishlist_items').insert({ user_id: userId, product_id: product.id });
      } else {
        await supabase.from('wishlist_items').delete().match({ user_id: userId, product_id: product.id });
      }
    } catch (err) {
      console.warn('Supabase wishlist error:', err);
    }
  }

  return isNowWishlisted;
};

// ==========================================
// 5. ADDRESSES API
// ==========================================
export const getAddresses = async (userId: string): Promise<Address[]> => {
  const addresses = getLocalDb<Address[]>('addresses', []);
  return addresses.filter(a => a.user_id === userId || a.user_id === 'guest_or_demo_user');
};

export const saveAddress = async (userId: string, address: Partial<Address>): Promise<Address> => {
  const addresses = getLocalDb<Address[]>('addresses', []);
  let saved: Address;

  if (address.is_default) {
    addresses.forEach(a => {
      if (a.user_id === userId) a.is_default = false;
    });
  }

  if (address.id) {
    const index = addresses.findIndex(a => a.id === address.id);
    if (index > -1) {
      addresses[index] = { ...addresses[index], ...address, updated_at: new Date().toISOString() } as Address;
      saved = addresses[index];
    } else {
      saved = address as Address;
    }
  } else {
    saved = {
      id: 'addr-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      full_name: address.full_name || '',
      phone: address.phone || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'India',
      is_default: address.is_default ?? (addresses.length === 0),
      created_at: new Date().toISOString()
    };
    addresses.push(saved);
  }

  setLocalDb('addresses', addresses);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('addresses').upsert(saved);
    } catch (err) {
      console.warn('Supabase address save error:', err);
    }
  }

  return saved;
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  const addresses = getLocalDb<Address[]>('addresses', []);
  const filtered = addresses.filter(a => a.id !== addressId);
  setLocalDb('addresses', filtered);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('addresses').delete().eq('id', addressId);
    } catch (err) {
      console.warn('Supabase address delete error:', err);
    }
  }
};

// ==========================================
// UUID Validator Helper
// ==========================================
export const isValidUUID = (str?: string | null): boolean => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// ==========================================
// 6. ORDERS API
// ==========================================
export const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> => {
  const currentOrders = getLocalDb<Order[]>('orders', []);
  const orderCount = currentOrders.length + 1;
  const orderNumber = `PLN-2026-${String(orderCount).padStart(6, '0')}`;

  const newOrder: Order = {
    ...orderData,
    id: 'ord-' + Math.random().toString(36).substring(2, 10),
    order_number: orderNumber,
    created_at: new Date().toISOString()
  };

  // Local storage save
  currentOrders.unshift(newOrder);
  setLocalDb('orders', currentOrders);

  // Clear user cart
  await clearCart(orderData.user_id);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const validUserId = isValidUUID(orderData.user_id) ? orderData.user_id : null;

      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: validUserId,
          order_number: orderNumber,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shipping_fee: orderData.shipping_fee,
          total: orderData.total,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          order_status: orderData.order_status,
          shipping_name: orderData.shipping_name,
          shipping_phone: orderData.shipping_phone,
          shipping_address: orderData.shipping_address,
          shipping_city: orderData.shipping_city,
          shipping_state: orderData.shipping_state,
          shipping_postal_code: orderData.shipping_postal_code,
          shipping_country: orderData.shipping_country || 'India',
          delivery_type: orderData.delivery_type,
          tracking_number: orderData.tracking_number || null,
          carrier: orderData.carrier || null,
          notes: orderData.notes || null
        })
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase live order placement error:', orderError);
      } else if (insertedOrder) {
        newOrder.id = insertedOrder.id;

        // Insert order items into Supabase
        const orderItemsPayload = orderData.items.map(item => ({
          order_id: insertedOrder.id,
          product_id: isValidUUID(item.product_id) ? item.product_id : null,
          variant_id: isValidUUID(item.variant_id) ? item.variant_id : null,
          product_name: item.product_name,
          product_image: item.product_image,
          variant_name: item.variant_name || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
        if (itemsError) {
          console.warn('Supabase order_items insertion error:', itemsError);
        }
      }
    } catch (err) {
      console.warn('Supabase live order placement exception:', err);
    }
  }

  return newOrder;
};

export const getAllOrders = async (): Promise<Order[]> => {
  let ordersFromSupabase: Order[] = [];

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        ordersFromSupabase = data.map(o => ({
          ...o,
          items: o.items || []
        }));
      } else if (error) {
        console.warn('Supabase getAllOrders query error:', error);
      }
    } catch (err) {
      console.warn('Supabase getAllOrders exception:', err);
    }
  }

  // Merge with local dataset
  const localOrders = getLocalDb<Order[]>('orders', []);
  const orderMap = new Map<string, Order>();

  // Add local orders first
  localOrders.forEach(o => {
    orderMap.set(o.order_number || o.id, o);
  });

  // Add Supabase orders (take precedence)
  ordersFromSupabase.forEach(o => {
    orderMap.set(o.order_number || o.id, o);
  });

  const merged = Array.from(orderMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return merged;
};

export const getOrders = async (userId: string): Promise<Order[]> => {
  const allOrders = await getAllOrders();
  if (!userId || userId === 'guest_or_demo_user') {
    return allOrders;
  }
  return allOrders.filter(o => o.user_id === userId || !o.user_id || o.user_id === 'guest_or_demo_user');
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const all = await getAllOrders();
  return all.find(o => o.id === orderId || o.order_number === orderId) || null;
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: Order['order_status'],
  trackingNumber?: string,
  carrier?: string
): Promise<Order | null> => {
  const localOrders = getLocalDb<Order[]>('orders', []);
  const index = localOrders.findIndex(o => o.id === orderId || o.order_number === orderId);

  let updatedOrder: Order | null = null;
  if (index > -1) {
    localOrders[index] = {
      ...localOrders[index],
      order_status: orderStatus,
      tracking_number: trackingNumber || localOrders[index].tracking_number,
      carrier: carrier || localOrders[index].carrier,
      updated_at: new Date().toISOString()
    };
    updatedOrder = localOrders[index];
    setLocalDb('orders', localOrders);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const payload: any = {
        order_status: orderStatus,
        updated_at: new Date().toISOString()
      };
      if (trackingNumber) payload.tracking_number = trackingNumber;
      if (carrier) payload.carrier = carrier;

      const { data, error } = await supabase
        .from('orders')
        .update(payload)
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .select()
        .single();

      if (!error && data) {
        if (!updatedOrder) updatedOrder = data as Order;
      }
    } catch (err) {
      console.warn('Supabase updateOrderStatus error:', err);
    }
  }

  return updatedOrder;
};

export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<Order | null> => {
  const localOrders = getLocalDb<Order[]>('orders', []);
  const index = localOrders.findIndex(o => o.id === orderId || o.order_number === orderId);

  let updatedOrder: Order | null = null;
  if (index > -1) {
    localOrders[index] = {
      ...localOrders[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    updatedOrder = localOrders[index];
    setLocalDb('orders', localOrders);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const orderFields: any = { ...updates, updated_at: new Date().toISOString() };
      delete orderFields.items;

      if (orderFields.user_id && !isValidUUID(orderFields.user_id)) {
        orderFields.user_id = null;
      }

      await supabase
        .from('orders')
        .update(orderFields)
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);

      if (updates.items && updates.items.length > 0) {
        // Find UUID of order
        const targetId = isValidUUID(orderId) ? orderId : updatedOrder?.id;
        if (targetId && isValidUUID(targetId)) {
          // Delete old items and insert fresh
          await supabase.from('order_items').delete().eq('order_id', targetId);
          const freshItems = updates.items.map(itm => ({
            order_id: targetId,
            product_id: isValidUUID(itm.product_id) ? itm.product_id : null,
            variant_id: isValidUUID(itm.variant_id) ? itm.variant_id : null,
            product_name: itm.product_name,
            product_image: itm.product_image,
            variant_name: itm.variant_name || null,
            quantity: itm.quantity,
            unit_price: itm.unit_price,
            subtotal: itm.subtotal
          }));
          await supabase.from('order_items').insert(freshItems);
        }
      }
    } catch (err) {
      console.warn('Supabase updateOrder error:', err);
    }
  }

  return updatedOrder;
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  const localOrders = getLocalDb<Order[]>('orders', []);
  const filtered = localOrders.filter(o => o.id !== orderId && o.order_number !== orderId);
  setLocalDb('orders', filtered);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from('orders')
        .delete()
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } catch (err) {
      console.warn('Supabase deleteOrder error:', err);
    }
  }

  return true;
};

// ==========================================
// 7. ADMIN PRODUCT & PRICE MANAGEMENT API
// ==========================================
export const updateProductPrice = async (
  productId: string,
  newPrice: number,
  newCompareAtPrice?: number
): Promise<Product | null> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const index = products.findIndex(p => p.id === productId);
  let updated: Product | null = null;

  if (index > -1) {
    const compare = newCompareAtPrice ?? products[index].compare_at_price ?? Math.round(newPrice * 1.25);
    const discount = compare > newPrice ? Math.round(((compare - newPrice) / compare) * 100) : 0;

    products[index] = {
      ...products[index],
      price: newPrice,
      compare_at_price: compare,
      discount_percentage: discount,
      updated_at: new Date().toISOString()
    };
    updated = products[index];
    setLocalDb('products', products);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (isValidUUID(productId)) {
        await supabase
          .from('products')
          .update({
            price: newPrice,
            compare_at_price: newCompareAtPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', productId);
      }
    } catch (err) {
      console.warn('Supabase updateProductPrice error:', err);
    }
  }

  return updated;
};

export const bulkUpdatePrices = async (
  percentageChange: number,
  categoryId?: string
): Promise<Product[]> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const multiplier = 1 + percentageChange / 100;

  const updatedProducts = products.map(p => {
    if (!categoryId || categoryId === 'all' || p.category_id === categoryId) {
      const newPrice = Math.max(1, Math.round(p.price * multiplier));
      const newCompare = p.compare_at_price ? Math.max(newPrice, Math.round(p.compare_at_price * multiplier)) : Math.round(newPrice * 1.25);
      const discount = newCompare > newPrice ? Math.round(((newCompare - newPrice) / newCompare) * 100) : 0;
      return {
        ...p,
        price: newPrice,
        compare_at_price: newCompare,
        discount_percentage: discount,
        updated_at: new Date().toISOString()
      };
    }
    return p;
  });

  setLocalDb('products', updatedProducts);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      for (const p of updatedProducts) {
        if (isValidUUID(p.id)) {
          await supabase
            .from('products')
            .update({
              price: p.price,
              compare_at_price: p.compare_at_price,
              updated_at: new Date().toISOString()
            })
            .eq('id', p.id);
        }
      }
    } catch (err) {
      console.warn('Supabase bulk price update error:', err);
    }
  }

  return updatedProducts;
};

export const addProductImage = async (
  productId: string,
  imageUrl: string,
  isPrimary: boolean = false
): Promise<Product | null> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return null;

  const newImg = {
    id: 'img-' + Math.random().toString(36).substring(2, 9),
    product_id: productId,
    image_url: imageUrl,
    sort_order: (products[index].images?.length || 0) + 1,
    is_primary: isPrimary || (products[index].images?.length === 0),
    created_at: new Date().toISOString()
  };

  if (isPrimary && products[index].images) {
    products[index].images.forEach(img => {
      img.is_primary = false;
    });
  }

  products[index].images = [...(products[index].images || []), newImg];
  setLocalDb('products', products);

  if (isLiveSupabaseConfigured() && isValidUUID(productId)) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('product_images').insert({
        product_id: productId,
        image_url: imageUrl,
        sort_order: newImg.sort_order,
        is_primary: isPrimary
      });
    } catch (err) {
      console.warn('Supabase addProductImage error:', err);
    }
  }

  return products[index];
};

export const removeProductImage = async (
  productId: string,
  imageIdOrUrl: string
): Promise<Product | null> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return null;

  products[index].images = (products[index].images || []).filter(
    img => img.id !== imageIdOrUrl && img.image_url !== imageIdOrUrl
  );

  // If primary was deleted, assign first available as primary
  if (products[index].images.length > 0 && !products[index].images.some(i => i.is_primary)) {
    products[index].images[0].is_primary = true;
  }

  setLocalDb('products', products);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (isValidUUID(imageIdOrUrl)) {
        await supabase.from('product_images').delete().eq('id', imageIdOrUrl);
      } else {
        await supabase.from('product_images').delete().match({ product_id: productId, image_url: imageIdOrUrl });
      }
    } catch (err) {
      console.warn('Supabase removeProductImage error:', err);
    }
  }

  return products[index];
};

export const updateProduct = async (
  productId: string,
  updates: Partial<Product>
): Promise<Product | null> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  setLocalDb('products', products);

  if (isLiveSupabaseConfigured() && isValidUUID(productId)) {
    try {
      const supabase = getSupabaseClient();
      const payload = { ...updates, updated_at: new Date().toISOString() };
      delete (payload as any).images;
      delete (payload as any).variants;
      delete (payload as any).reviews;
      delete (payload as any).category;
      await supabase.from('products').update(payload).eq('id', productId);
    } catch (err) {
      console.warn('Supabase updateProduct error:', err);
    }
  }

  return products[index];
};

// ==========================================
// 8. REVIEWS API
// ==========================================
export const createReview = async (
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  title: string,
  reviewText: string
): Promise<Review> => {
  const newReview: Review = {
    id: 'rev-' + Math.random().toString(36).substring(2, 9),
    product_id: productId,
    user_id: userId,
    user_name: userName,
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating,
    title,
    review_text: reviewText,
    is_verified_purchase: true,
    created_at: new Date().toISOString()
  };

  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const pIndex = products.findIndex(p => p.id === productId);
  if (pIndex > -1) {
    if (!products[pIndex].reviews) products[pIndex].reviews = [];
    products[pIndex].reviews!.unshift(newReview);
    products[pIndex].review_count = products[pIndex].reviews!.length;
    // Calculate new average rating
    const totalRating = products[pIndex].reviews!.reduce((acc, r) => acc + r.rating, 0);
    products[pIndex].rating = Number((totalRating / products[pIndex].reviews!.length).toFixed(1));
    setLocalDb('products', products);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('reviews').insert({
        product_id: productId,
        user_id: userId,
        rating,
        title,
        review_text: reviewText,
        is_verified_purchase: true
      });
    } catch (err) {
      console.warn('Supabase review insert error:', err);
    }
  }

  return newReview;
};

export const resetAllProductRatings = async (): Promise<Product[]> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const resetProducts = products.map(p => ({
    ...p,
    rating: 0,
    review_count: 0,
    reviews: []
  }));
  setLocalDb('products', resetProducts);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').update({ rating: 0, review_count: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.warn('Supabase resetAllProductRatings error:', err);
    }
  }

  return resetProducts;
};

export const getAllReviews = async (): Promise<Review[]> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const allReviews: Review[] = [];
  products.forEach(p => {
    if (p.reviews && p.reviews.length > 0) {
      allReviews.push(...p.reviews);
    }
  });
  return allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const deleteReview = async (reviewId: string, productId?: string): Promise<boolean> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  let modified = false;

  products.forEach(p => {
    if (p.reviews && p.reviews.some(r => r.id === reviewId)) {
      p.reviews = p.reviews.filter(r => r.id !== reviewId);
      p.review_count = p.reviews.length;
      if (p.reviews.length > 0) {
        const total = p.reviews.reduce((acc, r) => acc + r.rating, 0);
        p.rating = Number((total / p.reviews.length).toFixed(1));
      } else {
        p.rating = 0;
      }
      modified = true;
    }
  });

  if (modified) {
    setLocalDb('products', products);
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('reviews').delete().eq('id', reviewId);
    } catch (err) {
      console.warn('Supabase deleteReview error:', err);
    }
  }

  return true;
};

export const addCustomProduct = async (productData: Partial<Product>): Promise<Product> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const newProduct: Product = {
    id: 'prod-' + Math.random().toString(36).substring(2, 9),
    name: productData.name || 'New Product',
    slug: (productData.name || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category_id: productData.category_id || 'cat-1',
    description: productData.description || '',
    short_description: productData.short_description || productData.description?.substring(0, 100) || '',
    price: productData.price || 499,
    compare_at_price: productData.compare_at_price || Math.round((productData.price || 499) * 1.3),
    discount_percentage: productData.discount_percentage || 0,
    sku: productData.sku || 'PLN-' + Math.floor(1000 + Math.random() * 9000),
    rating: 0,
    review_count: 0,
    featured: productData.featured || false,
    bestseller: productData.bestseller || false,
    is_active: productData.is_active !== false,
    stock_quantity: productData.stock_quantity || 50,
    variants: productData.variants || [],
    images: productData.images || [
      {
        id: 'img-' + Math.random().toString(36).substring(2, 9),
        product_id: '',
        image_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        is_primary: true,
        sort_order: 1,
        created_at: new Date().toISOString()
      }
    ],
    reviews: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  products.unshift(newProduct);
  setLocalDb('products', products);
  return newProduct;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const products = getLocalDb<Product[]>('products', INITIAL_PRODUCTS);
  const filtered = products.filter(p => p.id !== productId);
  setLocalDb('products', filtered);
  return true;
};
