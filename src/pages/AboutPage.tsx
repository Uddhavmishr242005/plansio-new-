import React from 'react';
import { Leaf, ShieldCheck, Heart, Award, Sparkles, Truck, Users, Sprout } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 animate-fade-in">
      
      {/* Brand Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8f3dc] dark:bg-[#1b3824] text-xs font-semibold text-[#1b4332] dark:text-[#95d5b2]">
          <Leaf className="w-3.5 h-3.5" />
          <span>Our Botanical Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1b4332] dark:text-[#eaf2eb] tracking-tight">
          Pioneering Pure Organic Farming for Modern Urban Homes
        </h1>
        <p className="text-sm sm:text-base text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
          Founded with a simple mission: to eliminate hazardous chemical fertilizers from urban living spaces and restore vitality to soil through 100% natural earthworm bio-conversion.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">Eisenia Fetida Earthworms</h3>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
            Our vermicompost is produced by the world's most active red wiggler worms, converting cow dung and organic foliage into nutrient-dense black gold.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">Zero Chemical Adulteration</h3>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
            Free from urea, synthetics, and toxic pesticides. Completely safe for curious pets, toddlers, and indoor culinary herbs.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">Acclimatized Nursery Stock</h3>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
            Every houseplant is conditioned in our shaded greenhouses for 30+ days so it settles into your living room with zero shock.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1b4332] dark:text-[#eaf2eb]">Damage-Proof Eco Packaging</h3>
          <p className="text-xs text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
            Custom engineered ventilated pods that protect root balls, keep moisture locked in, and use 100% recyclable cardboard.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-3xl bg-[#1b4332] text-white p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to Bring Nature Indoors?</h2>
        <p className="text-xs sm:text-sm text-[#d8f3dc] max-w-xl mx-auto">
          Explore our collection of pure vermicompost manures, rare indoor monsteras, and botanical care supplies today.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-8 py-3.5 rounded-full bg-white text-[#1b4332] font-bold text-sm hover:bg-[#d8f3dc] transition-all shadow-lg"
        >
          Explore PLANSIO Catalog
        </button>
      </div>

    </div>
  );
};
