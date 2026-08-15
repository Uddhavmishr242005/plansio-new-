import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Key,
  Globe,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import {
  isLiveSupabaseConfigured,
  setLiveSupabaseCredentials,
  getSupabaseCredentials
} from '../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../lib/sqlSchema';

export const SupabaseConnectModal: React.FC = () => {
  const { isDatabaseModalOpen, setIsDatabaseModalOpen, fetchProducts } = useShop();
  const { showToast } = useToast();

  const creds = getSupabaseCredentials();
  const [url, setUrl] = useState(creds.url);
  const [anonKey, setAnonKey] = useState(creds.key);
  const [isLive, setIsLive] = useState(isLiveSupabaseConfigured());

  if (!isDatabaseModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      showToast('Validation Error', 'warning', 'Please provide both Project URL and Anon API key.');
      return;
    }

    setLiveSupabaseCredentials(url.trim(), anonKey.trim());
    setIsLive(true);
    fetchProducts();
    showToast('Supabase Connected!', 'success', 'Frontend is now connected directly to your live Supabase project.');
  };

  const handleCopySchema = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    showToast('SQL Schema Copied', 'success', 'Run this in your Supabase SQL Editor.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-[#e2ede0] dark:border-[#243828] flex items-center justify-between bg-[#f6fbf4] dark:bg-[#0e1710]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">
                Supabase Backend Configuration
              </h2>
              <p className="text-[11px] text-[#526352] dark:text-[#a3b8a6]">
                Pure Backend-as-a-Service Direct Client Integration
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDatabaseModalOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Status Indicator */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isLive
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
              : 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
          }`}>
            {isLive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-xs text-[#1f2d1f] dark:text-[#eaf2eb]">
                {isLive ? 'Supabase Live Connected' : 'Running in Local Sandbox / Fast-Sync Storage'}
              </p>
              <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-0.5">
                {isLive
                  ? 'All authentication, products, cart, wishlist, and orders are executing real-time calls to your Supabase PostgreSQL cluster.'
                  : 'The application is completely functional with simulated persistence. Connect your real Supabase project below whenever ready.'}
              </p>
            </div>
          </div>

          {/* Form to connect custom Supabase instance */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Supabase Anon / Public API Key</span>
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleCopySchema}
                className="px-4 py-2 rounded-xl border border-[#1b4332] dark:border-[#74c69d] text-[#1b4332] dark:text-[#74c69d] text-xs font-semibold hover:bg-[#1b4332] hover:text-white dark:hover:bg-[#74c69d] dark:hover:text-black transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Setup Script</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 dark:bg-[#40916c]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save & Connect</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
