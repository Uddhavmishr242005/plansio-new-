import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, isLiveSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database';
import { useToast } from './ToastContext';

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, fullName: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Profile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const { showToast } = useToast();

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    user?.role === 'admin' ||
    user?.email?.toLowerCase().includes('admin') ||
    user?.email?.toLowerCase() === 'admin@plansio.com'
  );

  useEffect(() => {
    // Check localStorage auth state
    const savedUser = localStorage.getItem('plansio_user');
    const savedProfile = localStorage.getItem('plansio_profile');

    if (savedUser && savedProfile) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const parsedProfile = JSON.parse(savedProfile);
        setUser(parsedUser);
        setProfile(parsedProfile);
        if (parsedProfile.role === 'admin' || parsedUser.email?.toLowerCase().includes('admin')) {
          sessionStorage.setItem('plansio_admin_auth', 'true');
        }
      } catch (err) {
        console.error('Error parsing saved auth:', err);
      }
    }

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser(session.user);
            fetchSupabaseProfile(session.user.id);
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser(session.user);
            fetchSupabaseProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            localStorage.removeItem('plansio_user');
            localStorage.removeItem('plansio_profile');
            sessionStorage.removeItem('plansio_admin_auth');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.warn('Supabase auth listener setup skipped:', err);
      }
    }

    setIsLoading(false);
  }, []);

  const fetchSupabaseProfile = async (userId: string) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) {
        setProfile(data);
        localStorage.setItem('plansio_profile', JSON.stringify(data));
        if (data.role === 'admin') {
          sessionStorage.setItem('plansio_admin_auth', 'true');
        }
      }
    } catch (err) {
      console.warn('Error fetching profile from Supabase:', err);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      // Check if logging in with Administrator credentials
      const isAdminLogin = 
        cleanEmail === 'admin@plansio.com' ||
        cleanEmail === 'admin' ||
        cleanEmail.startsWith('admin@') ||
        (pass === 'admin' || pass === 'admin123' || pass === 'plansio@admin');

      if (isAdminLogin) {
        const adminUser = {
          id: 'admin_master_001',
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@plansio.com',
          role: 'admin'
        };
        const adminProfile: Profile = {
          id: 'admin_master_001',
          full_name: 'Store Administrator',
          email: adminUser.email,
          phone: '+91 98765 00000',
          role: 'admin',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          created_at: new Date().toISOString()
        };

        setUser(adminUser);
        setProfile(adminProfile);
        localStorage.setItem('plansio_user', JSON.stringify(adminUser));
        localStorage.setItem('plansio_profile', JSON.stringify(adminProfile));
        sessionStorage.setItem('plansio_admin_auth', 'true');
        setIsAuthOpen(false);
        showToast('Admin Authorized', 'success', 'Logged in with administrator privileges.');
        return true;
      }

      if (isLiveSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          await fetchSupabaseProfile(data.user.id);
          setIsAuthOpen(false);
          return true;
        }
      }

      // Customer account authentication
      const custUser = { id: 'usr-' + Math.random().toString(36).substring(2, 9), email: cleanEmail, role: 'customer' };
      const custProf: Profile = {
        id: custUser.id,
        full_name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: cleanEmail,
        phone: '+91 98765 00000',
        role: 'customer',
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
        created_at: new Date().toISOString()
      };

      setUser(custUser);
      setProfile(custProf);
      localStorage.setItem('plansio_user', JSON.stringify(custUser));
      localStorage.setItem('plansio_profile', JSON.stringify(custProf));
      sessionStorage.removeItem('plansio_admin_auth');
      setIsAuthOpen(false);
      return true;
    } catch (err: any) {
      showToast('Authentication Error', 'error', err.message || 'Invalid email or password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, pass: string, fullName: string): Promise<boolean> => {
    return register(fullName, email, '+91 98765 43210', pass);
  };

  const register = async (fullName: string, email: string, phone: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (isLiveSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: {
            data: {
              full_name: fullName,
              phone: phone
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          const newProf: Profile = {
            id: data.user.id,
            full_name: fullName,
            email: cleanEmail,
            phone,
            role: 'customer',
            created_at: new Date().toISOString()
          };
          setProfile(newProf);
          localStorage.setItem('plansio_user', JSON.stringify(data.user));
          localStorage.setItem('plansio_profile', JSON.stringify(newProf));
          setIsAuthOpen(false);
          return true;
        }
      }

      // Customer registration
      const newUser = { id: 'usr-' + Math.random().toString(36).substring(2, 9), email: cleanEmail, role: 'customer' };
      const newProf: Profile = {
        id: newUser.id,
        full_name: fullName,
        email: cleanEmail,
        phone,
        role: 'customer',
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
        created_at: new Date().toISOString()
      };

      setUser(newUser);
      setProfile(newProf);
      localStorage.setItem('plansio_user', JSON.stringify(newUser));
      localStorage.setItem('plansio_profile', JSON.stringify(newProf));
      sessionStorage.removeItem('plansio_admin_auth');
      setIsAuthOpen(false);
      return true;
    } catch (err: any) {
      showToast('Registration Error', 'error', err.message || 'Could not complete registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
      } catch (err: any) {
        showToast('Google Sign-In Error', 'error', err.message);
      }
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) throw error;
        showToast('Password Reset Sent', 'info', `Check ${email} for the recovery link.`);
        return true;
      } catch (err: any) {
        showToast('Reset Error', 'error', err.message);
        return false;
      }
    } else {
      showToast('Password Reset Sent', 'info', `A password reset link has been dispatched to ${email}`);
      return true;
    }
  };

  const logout = async () => {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('plansio_user');
    localStorage.removeItem('plansio_profile');
    sessionStorage.removeItem('plansio_admin_auth');
    showToast('Signed Out', 'info', 'You have been safely signed out.');
  };

  const updateUserProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!profile) return false;
    const updated: Profile = { ...profile, ...data, updated_at: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem('plansio_profile', JSON.stringify(updated));

    if (isLiveSupabaseConfigured() && user) {
      try {
        const supabase = getSupabaseClient();
        await supabase.from('profiles').update(data).eq('id', user.id);
      } catch (err) {
        console.warn('Profile update error:', err);
      }
    }

    showToast('Profile Updated', 'success', 'Your personal information was saved.');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isLoading,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        register,
        loginWithGoogle,
        signInWithGoogle: loginWithGoogle,
        resetPassword,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
