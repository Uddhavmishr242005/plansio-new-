import { Category, Product } from '../types/database';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Vermicompost',
    slug: 'vermicompost',
    description: '100% pure organic earthworm castings rich in bio-nutrients and beneficial soil microbes.',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 4,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Organic Fertilizers',
    slug: 'organic-fertilizers',
    description: 'Cold-pressed neem, seaweed extracts, bone meal, and natural plant growth boosters.',
    image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 5,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Air-purifying, low-maintenance living greens tailored for homes, desks, and bedrooms.',
    image_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 6,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Hardy flowering perennials, palms, and balcony greenery built to thrive under sunlight.',
    image_url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 4,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Plant Care & Protection',
    slug: 'plant-care',
    description: 'Organic pest control, leaf shine sprays, potting mixes, and moisture balancers.',
    image_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 4,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Gardening Tools',
    slug: 'gardening-tools',
    description: 'Ergonomic stainless steel shears, trowels, brass watering cans, and planters.',
    image_url: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 5,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Pots & Accessories',
    slug: 'accessories',
    description: 'Ceramic planters, terracotta pots, bamboo stands, and moisture meters.',
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    is_active: true,
    product_count: 3,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    category_name: 'Vermicompost',
    name: 'PLANSIO Gold Grade Vermicompost',
    slug: 'plansio-gold-grade-vermicompost',
    short_description: '100% pure organic earthworm castings fortified with bio-enzymes and micro-nutrients.',
    description: 'PLANSIO Gold Grade Vermicompost is an elite, odor-free, non-toxic bio-fertilizer produced through precision vermiculture using African Nightcrawler worms. It enhances soil aeration, water retention, and supplies natural plant growth hormones (auxins, gibberellins). Ideal for vegetables, flowering plants, lawns, and indoor foliage.',
    benefits: [
      'Increases organic carbon content in soil by 45%',
      'Rich in beneficial mycorrhizae and beneficial bacterial colonies',
      'Naturally protects plant roots against nematodes and root rot',
      'Completely weed-seed free and sanitized'
    ],
    how_to_use: 'For potted plants, gently loosen the top 1-2 inches of soil and mix 50-100g of vermicompost once every 15 days. Water generously immediately after application.',
    specifications: {
      'Form': 'Granular moist powder',
      'Organic Carbon': '> 18%',
      'Moisture Content': '15-25%',
      'C:N Ratio': '< 20:1',
      'Odor': 'Earthy forest scent, zero foul smell'
    },
    price: 349,
    compare_at_price: 499,
    discount_percentage: 30,
    sku: 'PLN-VC-001',
    stock_quantity: 85,
    rating: 0,
    review_count: 0,
    featured: true,
    bestseller: true,
    is_active: true,
    images: [
      {
        id: 'img-1-1',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'img-1-2',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
        sort_order: 2,
        is_primary: false,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'img-1-3',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
        sort_order: 3,
        is_primary: false,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-1-1', product_id: 'prod-1', name: 'Weight', value: '5 KG Bag', price: 349, stock_quantity: 50, sku: 'PLN-VC-5KG' },
      { id: 'var-1-2', product_id: 'prod-1', name: 'Weight', value: '10 KG Bag', price: 629, stock_quantity: 25, sku: 'PLN-VC-10KG' },
      { id: 'var-1-3', product_id: 'prod-1', name: 'Weight', value: '25 KG Super Saver', price: 1399, stock_quantity: 10, sku: 'PLN-VC-25KG' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-2',
    category_id: 'cat-3',
    category_name: 'Indoor Plants',
    name: 'Monstera Deliciosa (Swiss Cheese Plant)',
    slug: 'monstera-deliciosa',
    short_description: 'Iconic lush tropical plant with distinctive split leaves. Excellent indoor air purifier.',
    description: 'The Monstera Deliciosa is a botanical masterpiece loved for its architectural deep-green leaves with natural fenestrations. Acclimatized in our climate-controlled nursery, this plant brings a vibrant tropical jungle aesthetic to your living room or office corner with minimal care required.',
    benefits: [
      'Removes airborne pollutants like formaldehyde and benzene',
      'Thrives in moderate to bright indirect sunlight',
      'Requires watering only once a week when topsoil dries',
      'Comes potted in nutrient-rich PLANSIO potting mix'
    ],
    how_to_use: 'Place in bright indirect light. Water when the top 2 inches of soil feel dry to the touch. Mist leaves once a week for enhanced humidity.',
    specifications: {
      'Plant Height': '14 - 18 Inches',
      'Pot Size': '6 Inch Nursery Pot',
      'Light Requirement': 'Medium to Bright Indirect Light',
      'Watering': 'Once every 6-8 days',
      'Toxicity': 'Mildly toxic to pets if chewed'
    },
    price: 699,
    compare_at_price: 999,
    discount_percentage: 30,
    sku: 'PLN-PL-MON01',
    stock_quantity: 42,
    rating: 0,
    review_count: 0,
    featured: true,
    bestseller: true,
    is_active: true,
    images: [
      {
        id: 'img-2-1',
        product_id: 'prod-2',
        image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'img-2-2',
        product_id: 'prod-2',
        image_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        sort_order: 2,
        is_primary: false,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-2-1', product_id: 'prod-2', name: 'Pot Type', value: 'Eco Nursery Pot', price: 699, stock_quantity: 25, sku: 'PLN-MON-ECO' },
      { id: 'var-2-2', product_id: 'prod-2', name: 'Pot Type', value: 'White Ceramic Pot + Stand', price: 1199, stock_quantity: 17, sku: 'PLN-MON-CER' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-3',
    category_id: 'cat-2',
    category_name: 'Organic Fertilizers',
    name: 'PLANSIO Cold-Pressed Seaweed Liquid Booster',
    slug: 'seaweed-liquid-fertilizer',
    short_description: 'Organic marine algae extract rich in 60+ trace minerals and plant growth stimulants.',
    description: 'A concentrated organic bio-stimulant extracted from wild Ascophyllum Nodosum seaweed. Accelerates root architecture, strengthens immunity against environmental stress, and enhances vibrant foliage and bumper blooms.',
    benefits: [
      'Over 60 natural trace minerals, amino acids, and enzymes',
      'Promotes robust chlorophyll synthesis for deep green leaves',
      '100% water soluble — suitable for foliar spray and drip irrigation',
      'OMRI-listed organic standard'
    ],
    how_to_use: 'Mix 3-5 ml in 1 Litre of clean water. Spray on foliage or drench root soil once every 14 days early in the morning.',
    specifications: {
      'Volume': '500 ml / 1000 ml',
      'Form': 'Dark concentrated liquid',
      'pH': '6.0 - 7.5',
      'Shelf Life': '24 Months'
    },
    price: 399,
    compare_at_price: 549,
    discount_percentage: 27,
    sku: 'PLN-FERT-SW01',
    stock_quantity: 60,
    rating: 0,
    review_count: 0,
    featured: true,
    bestseller: false,
    is_active: true,
    images: [
      {
        id: 'img-3-1',
        product_id: 'prod-3',
        image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-3-1', product_id: 'prod-3', name: 'Size', value: '500 ML Bottle', price: 399, stock_quantity: 40, sku: 'PLN-SW-500' },
      { id: 'var-3-2', product_id: 'prod-3', name: 'Size', value: '1000 ML (1L) Eco Jug', price: 699, stock_quantity: 20, sku: 'PLN-SW-1000' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-4',
    category_id: 'cat-3',
    category_name: 'Indoor Plants',
    name: 'Sansevieria Laurentii (Snake Plant)',
    slug: 'sansevieria-laurentii-snake-plant',
    short_description: 'Indestructible NASA-certified bedroom plant. Releases oxygen 24/7.',
    description: 'Known as Mother-in-Law’s Tongue, Sansevieria Laurentii features erect sword-like leaves with vivid golden yellow borders. It is one of the hardiest houseplants alive, tolerating drought, low light, and neglect while continuously purifying indoor air.',
    benefits: [
      'Produces oxygen even at night via CAM photosynthesis',
      'Filters airborne toxins: Xylene, Toluene, and Trichloroethylene',
      'Ultra-forgiving: Needs water only twice a month',
      'Perfect for bedrooms, cubicles, and living spaces'
    ],
    how_to_use: 'Allow the soil to dry out completely between waterings. Place in low to bright indirect light.',
    specifications: {
      'Height': '12 - 16 Inches',
      'Pot Size': '5.5 Inch Self-Draining Pot',
      'Care Level': 'Beginner / Very Easy',
      'Watering': 'Once every 14-20 days'
    },
    price: 499,
    compare_at_price: 699,
    discount_percentage: 28,
    sku: 'PLN-PL-SNK01',
    stock_quantity: 58,
    rating: 0,
    review_count: 0,
    featured: false,
    bestseller: true,
    is_active: true,
    images: [
      {
        id: 'img-4-1',
        product_id: 'prod-4',
        image_url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-4-1', product_id: 'prod-4', name: 'Planter', value: 'Forest Green Matte Pot', price: 499, stock_quantity: 35, sku: 'PLN-SNK-GRN' },
      { id: 'var-4-2', product_id: 'prod-4', name: 'Planter', value: 'Textured Terracotta Pot', price: 649, stock_quantity: 23, sku: 'PLN-SNK-TER' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-5',
    category_id: 'cat-6',
    category_name: 'Gardening Tools',
    name: 'Precision Japanese Steel Bypass Pruning Shears',
    slug: 'japanese-steel-bypass-pruner',
    short_description: 'Ultra-sharp SK-5 high carbon steel blade with ergonomic non-slip handle.',
    description: 'Engineered for clean, surgical cuts that heal fast without crushing plant stems. Features a shock-absorbing spring mechanism, safety thumb lock, and rust-resistant Teflon coating for years of smooth trimming.',
    benefits: [
      'SK-5 Japanese high-carbon steel razor blade',
      'Effortlessly cuts branches up to 20mm diameter',
      'Ergonomic TPR non-slip comfort grip',
      'Includes spare replacement spring and oil sponge'
    ],
    how_to_use: 'Clean blades with a soft cloth after pruning sap-heavy plants. Apply a light coat of machine oil before storing.',
    specifications: {
      'Blade Material': 'SK-5 High Carbon Steel',
      'Length': '8.2 Inches',
      'Weight': '210 Grams',
      'Max Cut Diameter': '20 mm'
    },
    price: 749,
    compare_at_price: 1099,
    discount_percentage: 31,
    sku: 'PLN-TL-PRN01',
    stock_quantity: 34,
    rating: 0,
    review_count: 0,
    featured: true,
    bestseller: false,
    is_active: true,
    images: [
      {
        id: 'img-5-1',
        product_id: 'prod-5',
        image_url: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-5-1', product_id: 'prod-5', name: 'Color', value: 'Forest Green & Brass', price: 749, stock_quantity: 34, sku: 'PLN-PRN-FGR' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-6',
    category_id: 'cat-5',
    category_name: 'Plant Care & Protection',
    name: 'PLANSIO Cold-Pressed Pure Organic Neem Oil Spray',
    slug: 'organic-neem-oil-spray',
    short_description: 'Ready-to-use emulsified 100% natural pest controller & anti-fungal spray.',
    description: 'Cold-pressed from wild neem seeds containing high active Azadirachtin content. Naturally repels mealybugs, aphids, spider mites, thrips, whiteflies, and powdery mildew without harmful synthetic chemicals or toxic odors.',
    benefits: [
      '100% safe for organic kitchen herbs, fruits, and pets',
      'Breaks insect life cycles naturally',
      'Leaves a glossy protective sheen on indoor foliage',
      'Pre-mixed with organic botanical wetting agent'
    ],
    how_to_use: 'Shake bottle thoroughly. Spray evenly on upper and lower sides of leaves once a week during early evening hours.',
    specifications: {
      'Volume': '450 ml Trigger Spray',
      'Active Ingredient': 'Cold-Pressed Pure Neem Kernel Extract',
      'Chemical Free': '100% Eco-Friendly'
    },
    price: 299,
    compare_at_price: 399,
    discount_percentage: 25,
    sku: 'PLN-CARE-NEEM01',
    stock_quantity: 90,
    rating: 0,
    review_count: 0,
    featured: false,
    bestseller: true,
    is_active: true,
    images: [
      {
        id: 'img-6-1',
        product_id: 'prod-6',
        image_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-6-1', product_id: 'prod-6', name: 'Pack', value: 'Single Bottle (450ml)', price: 299, stock_quantity: 50, sku: 'PLN-NEEM-1' },
      { id: 'var-6-2', product_id: 'prod-6', name: 'Pack', value: 'Value Duo Pack (2x 450ml)', price: 529, stock_quantity: 40, sku: 'PLN-NEEM-2' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'cat-4-prod-7',
    category_id: 'cat-4',
    category_name: 'Outdoor Plants',
    name: 'Areca Palm (Golden Cane Palm)',
    slug: 'areca-palm-outdoor',
    short_description: 'Majestic feathery fronds that create a lush tropical privacy screen.',
    description: 'The Areca Palm is an all-time favourite for balconies, patios, and garden entryways. Its arching golden stems and vibrant green foliage provide a serene natural canopy while withstanding bright sunlight.',
    benefits: [
      'High natural transpiration rate adds moisture to dry urban air',
      'Provides natural shade and acoustic insulation for balconies',
      'Fast growing and non-toxic to cats and dogs'
    ],
    how_to_use: 'Provide 3-4 hours of morning sun. Water regularly during summer keeping soil evenly moist.',
    specifications: {
      'Height': '2.5 - 3.2 Feet',
      'Pot Size': '8 Inch Heavy Duty Pot',
      'Sunlight': 'Partial to Full Outdoor Sunlight'
    },
    price: 899,
    compare_at_price: 1299,
    discount_percentage: 30,
    sku: 'PLN-PL-ARC01',
    stock_quantity: 26,
    rating: 0,
    review_count: 0,
    featured: true,
    bestseller: false,
    is_active: true,
    images: [
      {
        id: 'img-7-1',
        product_id: 'cat-4-prod-7',
        image_url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-7-1', product_id: 'cat-4-prod-7', name: 'Pot Size', value: '8 Inch Standard Pot', price: 899, stock_quantity: 16, sku: 'PLN-ARC-8' },
      { id: 'var-7-2', product_id: 'cat-4-prod-7', name: 'Pot Size', value: '10 Inch Large Planter', price: 1399, stock_quantity: 10, sku: 'PLN-ARC-10' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-8',
    category_id: 'cat-6',
    category_name: 'Gardening Tools',
    name: 'Hand-Forged Vintage Copper Watering Can (1.5L)',
    slug: 'vintage-copper-watering-can',
    short_description: 'Solid brass long-spout watering can with comfortable ergonomic handle.',
    description: 'Precision balanced watering can crafted from anti-rust brushed copper alloy. The extended slender gooseneck delivers pinpoint water flow straight to root balls without splashing delicate foliage or counter tops.',
    benefits: [
      'Targeted root-zone watering prevents fungal leaf diseases',
      'Solid copper finish with anti-tarnish protective lacquer',
      'Timeless vintage aesthetic that looks stunning on display'
    ],
    how_to_use: 'Fill with room temperature filtered water. Hold by top arch handle for optimal gravity-assisted pouring.',
    specifications: {
      'Capacity': '1.5 Litres',
      'Material': 'Brushed Copper Alloy & Solid Brass',
      'Spout Length': '10.5 Inches'
    },
    price: 1199,
    compare_at_price: 1699,
    discount_percentage: 29,
    sku: 'PLN-TL-WC01',
    stock_quantity: 19,
    rating: 0,
    review_count: 0,
    featured: false,
    bestseller: false,
    is_active: true,
    images: [
      {
        id: 'img-8-1',
        product_id: 'prod-8',
        image_url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-8-1', product_id: 'prod-8', name: 'Finish', value: 'Antique Brushed Copper', price: 1199, stock_quantity: 12, sku: 'PLN-WC-CPR' },
      { id: 'var-8-2', product_id: 'prod-8', name: 'Finish', value: 'Forest Green Matte Brass', price: 1299, stock_quantity: 7, sku: 'PLN-WC-FGR' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-9',
    category_id: 'cat-7',
    category_name: 'Pots & Accessories',
    name: 'Artisan Terracotta Planter with Drainage Saucer',
    slug: 'artisan-terracotta-planter',
    short_description: 'Breathable porous natural clay pot that promotes healthy root oxygenation.',
    description: 'Hand-thrown natural terracotta pot kiln-fired at high temperatures. The porous clay walls allow air and moisture to circulate freely through the root ball, effectively preventing overwatering and root decay.',
    benefits: [
      'Natural clay regulates root temperature in hot weather',
      'Porous material evaporates excess moisture naturally',
      'Comes with matching drainage dish to protect furniture'
    ],
    how_to_use: 'Place a small mesh over the drainage hole before filling with PLANSIO potting mix.',
    specifications: {
      'Diameter': '7 Inches',
      'Height': '6.5 Inches',
      'Material': '100% Pure Terracotta Clay'
    },
    price: 449,
    compare_at_price: 599,
    discount_percentage: 25,
    sku: 'PLN-POT-TER01',
    stock_quantity: 45,
    rating: 0,
    review_count: 0,
    featured: false,
    bestseller: false,
    is_active: true,
    images: [
      {
        id: 'img-9-1',
        product_id: 'prod-9',
        image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-9-1', product_id: 'prod-9', name: 'Size', value: '7-inch Medium', price: 449, stock_quantity: 30, sku: 'PLN-POT-7M' },
      { id: 'var-9-2', product_id: 'prod-9', name: 'Size', value: '9-inch Large', price: 699, stock_quantity: 15, sku: 'PLN-POT-9L' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-10',
    category_id: 'cat-2',
    category_name: 'Organic Fertilizers',
    name: 'PLANSIO Micro-Enriched Organic Neem Cake Powder',
    slug: 'organic-neem-cake-powder',
    short_description: 'Dual-action bio-fertilizer and soil pest nematicide for robust root systems.',
    description: 'Produced from cold-pressed neem kernel residues. Provides slow-release natural nitrogen, phosphorus, and potassium while guarding root structures against soil grubs, termites, and root-knot nematodes.',
    benefits: [
      'Improves soil fertility with slow-release N-P-K nutrients',
      'Acts as a natural bio-nematicide and insect repellent in soil',
      'Reduces nitrogen leaching and boosts nitrogen-fixing bacteria'
    ],
    how_to_use: 'Mix 25-50g into the topsoil of medium pots once a month or mix 10% volume into initial potting mix.',
    specifications: {
      'Weight': '2 KG / 5 KG',
      'Form': 'Coarse powder',
      'Azadirachtin Content': '> 1000 ppm'
    },
    price: 249,
    compare_at_price: 349,
    discount_percentage: 28,
    sku: 'PLN-FERT-NCP01',
    stock_quantity: 70,
    rating: 0,
    review_count: 0,
    featured: false,
    bestseller: true,
    is_active: true,
    images: [
      {
        id: 'img-10-1',
        product_id: 'prod-10',
        image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
        sort_order: 1,
        is_primary: true,
        created_at: '2026-01-01T00:00:00Z'
      }
    ],
    variants: [
      { id: 'var-10-1', product_id: 'prod-10', name: 'Weight', value: '2 KG Pack', price: 249, stock_quantity: 45, sku: 'PLN-NC-2KG' },
      { id: 'var-10-2', product_id: 'prod-10', name: 'Weight', value: '5 KG Value Pack', price: 499, stock_quantity: 25, sku: 'PLN-NC-5KG' }
    ],
    reviews: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];
