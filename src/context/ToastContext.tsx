import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (title: string, type?: ToastType, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, type: ToastType = 'success', message?: string, duration: number = 3500) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, title, message, duration };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Floating Container */}
      <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
          let borderColor = 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100';

          if (toast.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
            borderColor = 'border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
            borderColor = 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />;
            borderColor = 'border-blue-500/30 bg-blue-50/90 dark:bg-blue-950/90 text-blue-950 dark:text-blue-100';
          }

          return (
            <div
              key={toast.id}
              id={`toast-${toast.id}`}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-fade-in ${borderColor}`}
            >
              {icon}
              <div className="flex-1 text-sm">
                <p className="font-semibold leading-tight">{toast.title}</p>
                {toast.message && <p className="mt-1 text-xs opacity-85 leading-snug">{toast.message}</p>}
              </div>
              <button
                id={`close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
