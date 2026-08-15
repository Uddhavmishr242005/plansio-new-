import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    login,
    signup,
    signInWithGoogle,
    loginAsDemoUser
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Missing Credentials', 'warning', 'Please provide email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        if (!fullName.trim()) {
          showToast('Name Required', 'warning', 'Please enter your full name.');
          setIsLoading(false);
          return;
        }
        await signup(email, password, fullName);
        showToast('Account Created!', 'success', 'Welcome to PLANSIO.');
      } else {
        await login(email, password);
        showToast('Welcome Back!', 'success', 'You are now signed in.');
      }
    } catch (err: any) {
      showToast('Authentication Error', 'error', err.message || 'Could not complete sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemoUser();
    showToast('Demo Account Connected', 'info', 'Logged in as Aditi Deshmukh (Demo Profile)');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-[#e2ede0] dark:border-[#243828] overflow-hidden my-6">
        
        {/* Close button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 text-center bg-[#f6fbf4] dark:bg-[#0e1710] border-b border-[#e2ede0] dark:border-[#243828]">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center mx-auto text-[#1b4332] dark:text-[#74c69d] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
            {authMode === 'login' ? 'Welcome Back to PLANSIO' : 'Join the Green Club'}
          </h2>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-1">
            {authMode === 'login'
              ? 'Sign in to access your orders, saved addresses & cart'
              : 'Create an account to track orders and earn green rewards'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-4">
          
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Deshmukh"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1f2d1f] dark:text-[#eaf2eb] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e2ede0] dark:border-[#243828] bg-white dark:bg-[#1c2e20] text-[#1f2d1f] dark:text-white"
              />
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 dark:bg-[#40916c] dark:hover:bg-[#52b788]"
            >
              <span>{isLoading ? 'Processing with Supabase...' : authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Sign In Button */}
          <div className="pt-2">
            <button
              id="auth-demo-user-btn"
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[#d8f3dc] dark:bg-[#1b3824] hover:bg-[#b7e4c7] text-[#1b4332] dark:text-[#95d5b2] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Instant Demo Login</span>
            </button>
          </div>

          {/* Switch Mode */}
          <div className="text-center pt-2 text-xs text-[#526352] dark:text-[#a3b8a6]">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  id="switch-to-signup-btn"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-[#1b4332] dark:text-[#74c69d] hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  id="switch-to-login-btn"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#1b4332] dark:text-[#74c69d] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
