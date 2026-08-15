import React, { useState } from 'react';
import {
  Calculator,
  Sprout,
  Droplets,
  Sun,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PlantCareGuidePage: React.FC = () => {
  const { products, addToCart, setActiveTab } = useShop();

  const [plantType, setPlantType] = useState('foliage');
  const [potSize, setPotSize] = useState('medium');

  // Dosage computation
  const getDosageRecommendation = () => {
    let grams = 80;
    let frequency = 'every 15 to 20 days';

    if (potSize === 'small') grams = 40;
    if (potSize === 'medium') grams = 80;
    if (potSize === 'large') grams = 180;
    if (potSize === 'bed') grams = 350;

    if (plantType === 'flowering') {
      grams = Math.round(grams * 1.3);
      frequency = 'every 12 to 15 days (during bloom phase)';
    } else if (plantType === 'vegetables') {
      grams = Math.round(grams * 1.4);
      frequency = 'every 10 to 14 days';
    } else if (plantType === 'trees') {
      grams = Math.round(grams * 2);
      frequency = 'every 30 days';
    }

    return { grams, frequency };
  };

  const dosage = getDosageRecommendation();

  const handleAddVermicompostToCart = async () => {
    const vermiProduct = products.find(p => p.id === 'prod-1') || products[0];
    if (vermiProduct) {
      await addToCart(vermiProduct, null, 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8f3dc] dark:bg-[#1b3824] text-xs font-semibold text-[#1b4332] dark:text-[#95d5b2]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Botanical Care Laboratory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b4332] dark:text-[#eaf2eb]">
          Vermicompost Dosage Calculator & Plant Guides
        </h1>
        <p className="text-xs sm:text-sm text-[#526352] dark:text-[#a3b8a6] leading-relaxed">
          Learn the exact measurements and care rituals to give your indoor and outdoor green companions optimal nutrition without chemical toxicity.
        </p>
      </div>

      {/* 1. Interactive Dosage Calculator */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1b4332] to-[#24523e] text-white p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#95d5b2]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Organic Dosage Calculator</h2>
              <p className="text-xs text-[#d8f3dc]">Customized to your plant type and pot dimensions</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1.5 text-[#d8f3dc]">1. Select Plant Variety</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'foliage', label: 'Indoor Foliage / Monstera' },
                  { id: 'flowering', label: 'Flowering Plants (Roses, Hibiscus)' },
                  { id: 'vegetables', label: 'Kitchen Herbs & Veggies' },
                  { id: 'trees', label: 'Fruit Trees & Bonsai' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlantType(p.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      plantType === p.id
                        ? 'bg-white text-[#1b4332] font-bold border-white shadow-md'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-[#d8f3dc]">2. Select Container / Planter Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'small', label: 'Small (4-6" Pot)' },
                  { id: 'medium', label: 'Medium (8-10" Pot)' },
                  { id: 'large', label: 'Large (12-16" Pot)' },
                  { id: 'bed', label: 'Garden Bed (sq ft)' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setPotSize(s.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                      potSize === s.id
                        ? 'bg-white text-[#1b4332] font-bold border-white shadow-md'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white text-[#1f2d1f] shadow-2xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d6a4f]">
            Recommended Dosage
          </span>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#1b4332]">
                {dosage.grams}g
              </span>
              <span className="text-xs font-semibold text-gray-500">per application</span>
            </div>
            <p className="text-xs text-[#526352]">
              Repeat <strong>{dosage.frequency}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f6fbf4] border border-[#e2ede0] space-y-1.5 text-xs text-[#526352]">
            <p className="font-semibold text-[#1b4332]">How to Apply:</p>
            <p>1. Scratch the top 1 inch of soil away from the plant stem.</p>
            <p>2. Spread {dosage.grams}g of PLANSIO Vermicompost evenly.</p>
            <p>3. Cover back with soil and water thoroughly.</p>
          </div>

          <button
            onClick={handleAddVermicompostToCart}
            className="w-full py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add 5 KG Vermicompost to Cart (₹299)</span>
          </button>
        </div>

      </div>

      {/* 2. Visual Care Matrix: Water, Light, Soil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Light Matrix */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb]">Light Calibration</h3>
          <ul className="space-y-2 text-xs text-[#526352] dark:text-[#a3b8a6]">
            <li>• <strong>Low Light:</strong> Snake Plant, ZZ Plant, Pothos</li>
            <li>• <strong>Bright Indirect:</strong> Monstera, Fiddle Leaf, Peace Lily</li>
            <li>• <strong>Direct Sun:</strong> Bougainvillea, Basil, Citrus, Succulents</li>
          </ul>
        </div>

        {/* Moisture Matrix */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-500">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb]">Hydration Protocols</h3>
          <ul className="space-y-2 text-xs text-[#526352] dark:text-[#a3b8a6]">
            <li>• <strong>Top-Dry Test:</strong> Insert finger 1-2 inches deep.</li>
            <li>• <strong>Drainage holes:</strong> Ensure pots have holes to prevent root rot.</li>
            <li>• <strong>Morning watering:</strong> Water early in the morning for best absorption.</li>
          </ul>
        </div>

        {/* Nutrition Matrix */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142217] border border-[#e2ede0] dark:border-[#243828] space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] dark:bg-[#1b3824] flex items-center justify-center text-[#1b4332] dark:text-[#74c69d]">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb]">Soil & Manure Blend</h3>
          <ul className="space-y-2 text-xs text-[#526352] dark:text-[#a3b8a6]">
            <li>• <strong>Potting mix:</strong> 40% Soil + 30% Vermicompost + 30% Cocopeat.</li>
            <li>• <strong>Microbe boost:</strong> Add liquid seaweed every 30 days.</li>
            <li>• <strong>Pest prevention:</strong> Mix 5% Neem cake powder in soil.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
