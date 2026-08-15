import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { PlantCareGuidePage } from './pages/PlantCareGuidePage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

// Global Modals and Drawers
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab, activeQuickViewProduct, setActiveQuickViewProduct } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6fbf4] dark:bg-[#0e1710] text-[#1f2d1f] dark:text-[#eaf2eb] transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'shop' && <ShopPage />}
        {activeTab === 'care-guide' && <PlantCareGuidePage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'admin' && <AdminPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and Overlays */}
      <ProductDetailsModal
        product={activeQuickViewProduct}
        onClose={() => setActiveQuickViewProduct(null)}
      />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <ProfileModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <SiteSettingsProvider>
        <AuthProvider>
          <ShopProvider>
            <AppContent />
          </ShopProvider>
        </AuthProvider>
      </SiteSettingsProvider>
    </ToastProvider>
  );
}
