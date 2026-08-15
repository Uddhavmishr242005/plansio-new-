import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_PROJECT_ID = 'owdcbnparzmrharilofb';
export const DEFAULT_SUPABASE_URL = 'https://owdcbnparzmrharilofb.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable__3iFeQpULG86l5yIV45Yqw_QmbmU6Ai';

// Environment variables or localStorage stored credentials
const getStoredConfig = () => {
  const customUrl = localStorage.getItem('plansio_supabase_url');
  const customKey = localStorage.getItem('plansio_supabase_anon_key');
  
  // Fallbacks: process.env or defaults
  const envUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || '';
  const envKey = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || '';

  return {
    url: customUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: customKey || envKey || DEFAULT_SUPABASE_ANON_KEY
  };
};

let supabaseInstance: SupabaseClient | null = null;

export const isLiveSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getStoredConfig();
  return Boolean(url) && Boolean(anonKey);
};

export const getSupabaseCredentials = () => {
  const { url, anonKey } = getStoredConfig();
  return {
    projectId: DEFAULT_SUPABASE_PROJECT_ID,
    url: url || DEFAULT_SUPABASE_URL,
    key: anonKey || DEFAULT_SUPABASE_ANON_KEY
  };
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const { url, anonKey } = getStoredConfig();
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
};

export const setLiveSupabaseCredentials = (url: string, anonKey: string): void => {
  localStorage.setItem('plansio_supabase_url', url.trim());
  localStorage.setItem('plansio_supabase_anon_key', anonKey.trim());
  supabaseInstance = createClient(url.trim(), anonKey.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};

export const updateSupabaseCredentials = setLiveSupabaseCredentials;

export const resetSupabaseCredentials = (): void => {
  localStorage.removeItem('plansio_supabase_url');
  localStorage.removeItem('plansio_supabase_anon_key');
  supabaseInstance = null;
};
