import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Code,
  Copy,
  Clock,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { Address, Order } from '../types/database';
import * as api from '../services/api';
import { SUPABASE_SQL_SCHEMA } from '../lib/sqlSchema';

export const ProfileModal: React.FC = () => {
  const { user, profile, logout, updateUserProfile } = useAuth();
  const { isProfileOpen, setIsProfileOpen, setIsDatabaseModalOpen, setActiveTab } = useShop();
  const { showToast } = useToast();

  const [activeTabNav, setActiveTabNav] = useState<'profile' | 'orders' | 'addresses' | 'schema'>('orders');
  
  // Profile edit fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Orders and Addresses
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Add Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false
  });

  const userId = user?.id || 'guest_or_demo_user';

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (isProfileOpen) {
      loadData();
    }
  }, [isProfileOpen, userId]);

  const loadData = async () => {
    setLoadingOrders(true);
    try {
      const [ordList, addrList] = await Promise.all([
        api.getOrders(userId),
        api.getAddresses(userId)
      ]);
      setOrders(ordList);
      setAddresses(addrList);
    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isProfileOpen) return null;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateUserProfile({ full_name: fullName, phone });
    setIsSavingProfile(false);
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.full_name || !newAddr.phone || !newAddr.address_line_1 || !newAddr.city || !newAddr.postal_code) {
      showToast('Missing Fields', 'warning', 'Please fill all required address inputs.');
      return;
    }
    await api.saveAddress(userId, newAddr);
    await loadData();
    setIsAddingAddress(false);
    showToast('Address Added', 'success');
  };

  const handleDeleteAddress = async (id: string) => {
    await api.deleteAddress(id);
    await loadData();
    showToast('Address Deleted', 'info');
  };

  const handleCopySchema = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    showToast('SQL Schema Copied!', 'success', 'Paste into your Supabase SQL Editor.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-[#1b4332] dark:border-[#74c69d]"
            />
            <div>
              <h2 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                {profile?.full_name || 'My Account'}
              </h2>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">{profile?.email}</p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#142217] px-5 gap-4 overflow-x-auto">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'profile', label: 'Personal Profile', icon: User },
            { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
            { id: 'schema', label: 'Supabase SQL Schema', icon: Code },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabNav(tab.id as any)}
                className={`py-3.5 px-2 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTabNav === tab.id
                    ? 'border-[#1b4332] text-[#1b4332] dark:border-[#74c69d] dark:text-[#74c69d]'
                    : 'border-transparent text-[#526352] dark:text-[#a3b8a6] hover:text-[#1b4332]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          
          {/* 1. ORDERS TAB */}
          {activeTabNav === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              {loadingOrders ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-28 rounded-2xl bg-[#e2ede0] dark:bg-[#1c2e20] animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-gray-400 mx-auto" />
                  <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">No orders placed yet</h3>
                  <p className="text-xs text-gray-500">Your botanical purchases will appear here.</p>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setActiveTab('shop');
                    }}
                    className="px-5 py-2 rounded-full bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#143526] dark:bg-[#40916c]"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3 shadow-sm"
                  >
                    {/* Order Head */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                          {order.order_number}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {order.order_status}
                        </span>
                        <span className="text-xs font-bold text-[#1b4332] dark:text-[#74c69d]">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828]">
                          <img
                            src={item.product_image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                          <div className="text-xs min-w-0">
                            <p className="font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] truncate">
                              {item.product_name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Qty: {item.quantity} • ₹{item.unit_price} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Shipping Footer */}
                    <div className="flex items-center justify-between text-[11px] text-[#526352] dark:text-[#a3b8a6] pt-1">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                        <span>Deliver to {order.shipping_name}, {order.shipping_city}</span>
                      </span>
                      <span>Payment: <strong>{order.payment_method}</strong> ({order.payment_status})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTabNav === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg animate-fade-in">
              <div>
                <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400">Authenticated through Supabase Auth</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb]">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 dark:bg-[#40916c]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. ADDRESSES TAB */}
          {activeTabNav === 'addresses' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">Saved Shipping Addresses</h3>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#143526] flex items-center gap-1 dark:bg-[#40916c]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleSaveNewAddress} className="p-4 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.full_name}
                        onChange={e => setNewAddr({ ...newAddr, full_name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newAddr.phone}
                        onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.address_line_1}
                      onChange={e => setNewAddr({ ...newAddr, address_line_1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.state}
                        onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.postal_code}
                        onChange={e => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#142217]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3.5 py-1.5 rounded-xl border text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-semibold dark:bg-[#40916c]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-[#fcfdfc] dark:bg-[#1c2e20] border border-[#e2ede0] dark:border-[#243828] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">{addr.full_name}</p>
                        {addr.is_default && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-1">
                        {addr.address_line_1}, {addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">Phone: {addr.phone}</p>
                    </div>

                    <div className="flex justify-end pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUPABASE SCHEMA TAB */}
          {activeTabNav === 'schema' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#1b4332] dark:text-[#eaf2eb]">
                    Supabase PostgreSQL DDL & RLS Policies
                  </h3>
                  <p className="text-xs text-[#526352] dark:text-[#a3b8a6]">
                    Complete production-ready script with all tables, constraints, triggers, and Row Level Security.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold flex items-center gap-1.5 dark:bg-[#40916c]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-300 font-mono text-xs overflow-x-auto max-h-72 border border-gray-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
