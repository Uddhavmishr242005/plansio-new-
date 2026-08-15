import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle
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
    resetPassword
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (authMode === 'forgot') {
      if (!email.trim()) {
        setFormError('Please provide your registered email address.');
        return;
      }
      setIsLoading(true);
      try {
        await resetPassword(email);
        showToast('Reset Instructions Sent', 'info', `Password recovery link sent to ${email}`);
        setAuthMode('login');
      } catch (err: any) {
        setFormError(err.message || 'Could not send recovery email');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        if (!fullName.trim()) {
          setFormError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        await signup(email, password, fullName);
        showToast('Welcome to PLANSIO!', 'success', 'Your account has been created successfully.');
      } else {
        const success = await login(email, password);
        if (success) {
          showToast('Welcome to PLANSIO!', 'success', 'You are now successfully signed in.');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#142217] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#243828] overflow-hidden my-6">
        
        {/* Top Decorative Leaf Stripe */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0e3b24] via-emerald-600 to-[#0e3b24]" />

        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="pt-6 sm:pt-8 px-6 sm:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-[#0e3b24] dark:text-emerald-400 mb-3 shadow-xs">
            {authMode === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : authMode === 'signup' ? (
              <User className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-[#f2f8f3]">
            {authMode === 'login' && 'Sign in to PLANSIO'}
            {authMode === 'signup' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h2>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            {authMode === 'login' && 'Manage your plant orders, delivery tracking, and saved cart.'}
            {authMode === 'signup' && 'Join the PLANSIO organic community and enjoy doorstep plant delivery.'}
            {authMode === 'forgot' && 'Enter your email address and we will send a password reset link.'}
          </p>
        </div>

        {/* Tab Toggle (Sign In / Register) */}
        {authMode !== 'forgot' && (
          <div className="px-6 sm:px-8 pt-6">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-[#1c2e20] border border-gray-200 dark:border-[#274631]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFormError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-[#0e1710] text-[#0e3b24] dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setFormError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-[#0e1710] text-[#0e3b24] dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-4">
          
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Aditi Deshmukh"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c2e20] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0e3b24] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c2e20] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0e3b24] focus:outline-none"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-gray-400 font-normal">(for delivery tracking)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c2e20] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0e3b24] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setFormError(null);
                      }}
                      className="text-[11px] font-semibold text-[#0e3b24] dark:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c2e20] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0e3b24] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#0e3b24] hover:bg-[#092b1a] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <span>
                {isLoading
                  ? 'Please wait...'
                  : authMode === 'login'
                  ? 'Sign In to Account'
                  : authMode === 'signup'
                  ? 'Create New Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom helper text */}
          {authMode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFormError(null);
                }}
                className="text-xs font-semibold text-[#0e3b24] dark:text-emerald-400 hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
