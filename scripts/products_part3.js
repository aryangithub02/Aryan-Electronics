/**
 * Aryan Electronics - Catalog Products Part 3
 * Consumer Electronics (161-180) and Industrial Electronics (181-200)
 */

const PRODUCTS_PART3 = [
  // ==========================================
  // 4. Consumer Electronics (20 products: 161-180)
  // ==========================================
  {
    id: 161,
    sku: "AE-CNS-PRD-161",
    title: "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Forged in aerospace-grade titanium with textured matte glass back, industry-first 3nm A17 Pro chip, Action button, 48MP main camera system with 5x optical telephoto zoom, and USB-C with USB 3 speeds.",
    price: 154000,
    discountPercentage: 6,
    rating: 4.8,
    stock: 25,
    searchQuery: "iPhone 15 Pro Max 256GB Natural Titanium",
    specifications: {
      display: "6.7-inch Super Retina XDR display, ProMotion 120Hz, Always-On, Dynamic Island, 2000 nits peak outdoor brightness",
      chip: "A17 Pro chip, 6-core CPU, 6-core GPU with hardware-accelerated ray tracing, 16-core Neural Engine",
      cameraSystem: "Pro camera system: 48MP Main, 12MP Ultra Wide, 12MP 5x Telephoto with tetraprism design",
      batteryLife: "Up to 29 hours video playback",
      connectivity: "USB-C connector supporting USB 3 (up to 10Gb/s), Wi-Fi 6E, 5G, Bluetooth 5.3",
      durability: "Titanium design, Ceramic Shield front, IP68 water resistance (6 meters up to 30 mins)"
    },
    features: [
      "Lightweight aerospace-grade titanium frame with contoured edges",
      "Customizable Action button to quickly access flashlight, camera, voice memo, or shortcuts",
      "5x optical zoom at 120mm focal length for crystal-clear telephoto portraits"
    ],
    useCases: [
      "Professional 4K ProRes 60fps HDR cinematography recording straight to external SSD",
      "Console-quality ray-traced gaming on iOS (Resident Evil 4, Death Stranding)"
    ],
    sellers: [
      { name: "Amazon India", price: 148900, availability: "In Stock, Prime Free Next-Day Delivery", url: "https://www.amazon.in/dp/B0CHX1W1XY" },
      { name: "Apple Store India", price: 154000, availability: "Official Brand Store", url: "https://www.apple.com/in/shop/buy-iphone/iphone-15-pro" },
      { name: "Croma", price: 151900, availability: "Instant HDFC Bank Discount Available", url: "https://www.croma.com/apple-iphone-15-pro-max/p/300781" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/iphone-15-pro/" }
    ]
  },
  {
    id: 162,
    sku: "AE-CNS-PRD-162",
    title: "Apple iPhone 15 (128GB, Black)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Features Dynamic Island, 48MP main camera with 2x optical-quality telephoto, color-infused glass and aluminum design, A16 Bionic chip, and universal USB-C charging.",
    price: 71999,
    discountPercentage: 10,
    rating: 4.7,
    stock: 50,
    searchQuery: "Apple iPhone 15 128GB Black",
    specifications: {
      display: "6.1-inch Super Retina XDR display, Dynamic Island, 2000 nits peak outdoor brightness",
      chip: "A16 Bionic chip with 5-core GPU",
      camera: "Advanced dual-camera system: 48MP Main with sensor-shift OIS, 12MP Ultra Wide, 2x Telephoto option",
      charging: "USB-C connector, MagSafe wireless charging up to 15W",
      durability: "Ceramic Shield front, color-infused back glass, IP68 water resistance"
    },
    features: [
      "Dynamic Island bubbles up alerts and Live Activities so you never miss a notification",
      "Next-generation portraits with focus and depth control adjustable after capturing",
      "Roadside Assistance via satellite and Emergency SOS"
    ],
    useCases: [
      "Premium everyday smartphone experience with iOS ecosystem integration",
      "High-resolution social media photography and 4K Dolby Vision vlogging"
    ],
    sellers: [
      { name: "Amazon India", price: 69999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0CHX171JC" },
      { name: "Flipkart", price: 71999, availability: "Available", url: "https://www.flipkart.com/apple-iphone-15/p/itm12345" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/iphone-15/" }
    ]
  },
  {
    id: 163,
    sku: "AE-CNS-PRD-163",
    title: "Apple iPhone 14 (128GB, Midnight)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Equipped with A15 Bionic chip with 5-core GPU, dual-camera system with Photonic Engine, Crash Detection, all-day battery life, and durable Ceramic Shield protection.",
    price: 58999,
    discountPercentage: 15,
    rating: 4.6,
    stock: 45,
    searchQuery: "Apple iPhone 14 128GB Midnight",
    specifications: {
      display: "6.1-inch Super Retina XDR OLED display, HDR10, True Tone",
      chip: "A15 Bionic chip, 6-core CPU, 5-core GPU, 16-core Neural Engine",
      camera: "Dual 12MP camera system (Main and Ultra Wide), Photonic Engine, Action Mode video stabilization",
      battery: "Up to 20 hours video playback",
      safety: "Emergency SOS via satellite and Crash Detection"
    },
    features: [
      "Action mode enables smooth, handheld videos without needing an external gimbal stabilizer",
      "Photonic Engine dramatically improves mid- to low-light photo performance across both cameras",
      "Aerospace-grade aluminum enclosure with Ceramic Shield front glass"
    ],
    useCases: [
      "Reliable, high-value flagship entry into Apple iOS ecosystem",
      "All-day communication, web browsing, and mobile streaming"
    ],
    sellers: [
      { name: "Amazon India", price: 57999, availability: "In Stock", url: "https://www.amazon.in/dp/B0BDHX8Z63" },
      { name: "Reliance Digital", price: 58999, availability: "In Stock", url: "https://www.reliancedigital.in/apple-iphone-14/p/493177749" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/iphone-14/" }
    ]
  },
  {
    id: 164,
    sku: "AE-CNS-PRD-164",
    title: "Samsung Galaxy S24 Ultra 5G (256GB, Titanium Gray)",
    brand: "Samsung",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "The ultimate Galaxy flagship featuring Galaxy AI, titanium frame, built-in S Pen, 200MP quad telephoto camera, Snapdragon 8 Gen 3 for Galaxy, and flat 6.8-inch Dynamic AMOLED 2X display.",
    price: 129999,
    discountPercentage: 7,
    rating: 4.8,
    stock: 30,
    searchQuery: "Samsung Galaxy S24 Ultra Titanium Gray",
    specifications: {
      display: "6.8\" Flat QHD+ Dynamic AMOLED 2X, 1-120Hz adaptive refresh, 2600 nits peak brightness, Corning Gorilla Armor glass",
      processor: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)",
      cameras: "200MP Wide + 50MP 5x Telephoto + 10MP 3x Telephoto + 12MP Ultra-Wide (100x Space Zoom)",
      memoryStorage: "12GB RAM, 256GB UFS 4.0 storage",
      batteryCharging: "5000 mAh battery, 45W wired charging, Fast Wireless Charging 2.0",
      stylus: "Integrated S Pen with Bluetooth remote control"
    },
    features: [
      "Galaxy AI suite includes Circle to Search with Google, Live Translate phone calls, and Generative Photo Edit",
      "Corning Gorilla Armor reduces screen reflections by up to 75% and enhances scratch resistance",
      "7 years of Android OS updates and security patches guaranteed"
    ],
    useCases: [
      "Ultra-high zoom concert and wildlife photography (100x Space Zoom)",
      "Digital sketching, handwritten PDF annotation, and document signing with S Pen"
    ],
    sellers: [
      { name: "Amazon India", price: 124999, availability: "In Stock, Free Prime Delivery", url: "https://www.amazon.in/dp/B0CS5XW9G7" },
      { name: "Samsung India Store", price: 129999, availability: "Official Brand Store", url: "https://www.samsung.com/in/smartphones/galaxy-s24-ultra/" },
      { name: "Croma", price: 129999, availability: "Available", url: "https://www.croma.com/samsung-galaxy-s24-ultra/p/304192" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.samsung.com/in/smartphones/galaxy-s24-ultra/" }
    ]
  },
  {
    id: 165,
    sku: "AE-CNS-PRD-165",
    title: "Samsung Galaxy S23 5G (128GB, Phantom Black)",
    brand: "Samsung",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Compact premium flagship equipped with Snapdragon 8 Gen 2 for Galaxy, 50MP triple camera system with Nightography, 6.1-inch 120Hz AMOLED display, and Armor Aluminum frame.",
    price: 52999,
    discountPercentage: 25,
    rating: 4.6,
    stock: 40,
    searchQuery: "Samsung Galaxy S23 Phantom Black",
    specifications: {
      display: "6.1-inch FHD+ Dynamic AMOLED 2X, 48-120Hz adaptive, 1750 nits peak brightness",
      processor: "Snapdragon 8 Gen 2 Mobile Platform for Galaxy",
      camera: "50MP Main (f/1.8, OIS) + 12MP Ultra-Wide + 10MP 3x Optical Telephoto (OIS)",
      memoryStorage: "8GB LPDDR5X RAM, 128GB storage",
      battery: "3900 mAh battery with wireless charging and wireless power share",
      weight: "168 g compact lightweight ergonomics"
    },
    features: [
      "Compact 6.1-inch form factor that comfortably fits in one hand",
      "Nightography sensor picks up more light for vivid, bright low-light photos",
      "IP68 dust and water resistance with Corning Gorilla Glass Victus 2 on front and back"
    ],
    useCases: [
      "Users seeking a one-handed premium flagship phone with zero performance compromises",
      "Everyday social media, photography, and gaming"
    ],
    sellers: [
      { name: "Amazon India", price: 49999, availability: "In Stock", url: "https://www.amazon.in/dp/B0BTYW5PLN" },
      { name: "Flipkart", price: 52999, availability: "Available", url: "https://www.flipkart.com/samsung-galaxy-s23-5g/p/itm123456" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.samsung.com/in/smartphones/galaxy-s23/" }
    ]
  },
  {
    id: 166,
    sku: "AE-CNS-PRD-166",
    title: "Samsung Galaxy Z Flip5 (256GB, Mint)",
    brand: "Samsung",
    sector: "Consumer Electronics",
    category: "Foldable Smartphones",
    description: "Pocket-sized clamshell foldable featuring a large 3.4-inch Flex Window cover screen, zero-gap Flex Hinge, Snapdragon 8 Gen 2 for Galaxy, and hands-free FlexCam photography.",
    price: 89999,
    discountPercentage: 18,
    rating: 4.6,
    stock: 20,
    searchQuery: "Samsung Galaxy Z Flip5 Mint",
    specifications: {
      mainDisplay: "6.7\" FHD+ Dynamic AMOLED 2X Infinity Flex Display, 120Hz adaptive, 2640 x 1080",
      coverDisplay: "3.4\" Super AMOLED 60Hz Flex Window (720 x 748)",
      processor: "Qualcomm Snapdragon 8 Gen 2 for Galaxy (4nm)",
      cameras: "Dual 12MP rear cameras (Wide with OIS + Ultra Wide), 10MP selfie camera",
      battery: "3700 mAh dual battery with fast charging and wireless power share",
      waterResistance: "IPX8 water resistant"
    },
    features: [
      "Large 3.4-inch Flex Window lets you reply to messages, browse maps, and take high-res selfies without opening the phone",
      "New zero-gap Flex Hinge folds completely flat for sleek pocketability",
      "FlexCam props the phone up at any angle for hands-free group photos and video calls"
    ],
    useCases: [
      "Hands-free TikTok and Instagram reel recording from unique low and high angles",
      "Ultra-compact pocket carry in formal and casual apparel"
    ],
    sellers: [
      { name: "Amazon India", price: 79999, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B0CC9L3CVV" },
      { name: "Samsung Store India", price: 89999, availability: "In Stock", url: "https://www.samsung.com/in/smartphones/galaxy-z-flip5/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.samsung.com/in/smartphones/galaxy-z-flip5/" }
    ]
  },
  {
    id: 167,
    sku: "AE-CNS-PRD-167",
    title: "Google Pixel 8 Pro (128GB, Obsidian)",
    brand: "Google",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Google's pro smartphone engineered with Google Tensor G3 chip, fully upgraded triple camera with Best Take and Magic Editor, 6.7-inch Super Actua display, and built-in temperature sensor.",
    price: 96999,
    discountPercentage: 9,
    rating: 4.7,
    stock: 22,
    searchQuery: "Google Pixel 8 Pro Obsidian",
    specifications: {
      display: "6.7-inch Super Actua LTPO OLED (1344 x 2992), 1-120Hz, up to 2400 nits peak brightness",
      processor: "Google Tensor G3 processor with Titan M2 security coprocessor",
      cameras: "50MP Octa PD Wide + 48MP Quad PD Ultra Wide with Macro Focus + 48MP Quad PD 5x Telephoto (30x Super Res Zoom)",
      memoryStorage: "12GB LPDDR5X RAM, 128GB UFS 3.1 storage",
      battery: "5050 mAh battery, beyond 24-hour battery life, fast wireless charging",
      sensors: "Infrared temperature sensor for checking object and pan temperatures"
    },
    features: [
      "Next-generation computational photography with Best Take and Audio Magic Eraser",
      "Video Boost with Night Sight Video enhances low-light videos with cloud HDR processing",
      "7 full years of Android OS upgrades, Feature Drops, and security updates"
    ],
    useCases: [
      "Pure clean Android experience with zero bloatware",
      "Color-accurate computational mobile photography and astrophotography"
    ],
    sellers: [
      { name: "Flipkart", price: 96999, availability: "Authorized Google Retailer India", url: "https://www.flipkart.com/google-pixel-8-pro/p/itm12345" },
      { name: "Amazon India", price: 98990, availability: "In Stock", url: "https://www.amazon.in/dp/B0CGVWW9WJ" }
    ],
    sources: [
      { type: "official_product_page", url: "https://store.google.com/product/pixel_8_pro" }
    ]
  },
  {
    id: 168,
    sku: "AE-CNS-PRD-168",
    title: "Google Pixel 7a (128GB, Charcoal)",
    brand: "Google",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Mid-range value powerhouse with Google Tensor G2 processor, 64MP main camera, 90Hz Smooth Display, wireless charging, and Titan M2 chip security.",
    price: 37999,
    discountPercentage: 15,
    rating: 4.5,
    stock: 40,
    searchQuery: "Google Pixel 7a Charcoal",
    specifications: {
      display: "6.1-inch FHD+ OLED (1080 x 2400) Smooth Display up to 90Hz",
      processor: "Google Tensor G2 with Titan M2 security coprocessor",
      camera: "64MP Quad PD Quad Bayer wide camera + 13MP ultra-wide camera",
      memoryStorage: "8GB LPDDR5 RAM, 128GB UFS 3.1 storage",
      durability: "IP67 dust and water resistance, scratch-resistant Corning Gorilla Glass 3"
    },
    features: [
      "Flagship-tier camera quality at a fraction of the flagship price",
      "Photo Unblur and Magic Eraser built right into Google Photos",
      "Wireless Qi charging added to the A-series for the first time"
    ],
    useCases: [
      "High-value mobile photography phone under ₹40,000",
      "Clean Google software interface with immediate day-one Android updates"
    ],
    sellers: [
      { name: "Flipkart", price: 37999, availability: "Official Indian Partner", url: "https://www.flipkart.com/google-pixel-7a-charcoal-128-gb/p/itmb444d3d2579b4" }
    ],
    sources: [
      { type: "official_product_page", url: "https://store.google.com/product/pixel_7a" }
    ]
  },
  {
    id: 169,
    sku: "AE-CNS-PRD-169",
    title: "OnePlus 12 5G (16GB RAM, 512GB, Silky Black)",
    brand: "OnePlus",
    sector: "Consumer Electronics",
    category: "Smartphones",
    description: "Flagship speed and imaging tuned with Hasselblad. Powered by Snapdragon 8 Gen 3, 2K 120Hz ProXDR display, 5400mAh battery with 100W SUPERVOOC charging, and Sony LYT-808 sensor.",
    price: 69999,
    discountPercentage: 7,
    rating: 4.7,
    stock: 35,
    searchQuery: "OnePlus 12 5G Silky Black",
    specifications: {
      processor: "Qualcomm Snapdragon 8 Gen 3 (4nm) with Dual Cryo-velocity VC cooling",
      display: "6.82\" 2K 120Hz ProXDR Display with LTPO 3.0, 4500 nits peak brightness, DisplayMate A+",
      cameras: "4th Gen Hasselblad Camera System: 50MP Sony LYT-808 Main + 64MP 3x Periscope Telephoto + 48MP Ultra-Wide",
      charging: "100W SUPERVOOC wired (1-100% in 26 minutes) + 50W AIRVOOC wireless",
      battery: "5,400 mAh dual-cell battery"
    },
    features: [
      "Ultra-fast 100W charging fully juices the massive 5400mAh battery in under half an hour",
      "Class-leading 4500 nits peak display brightness for crystal-clear outdoor sunlight visibility",
      "64MP periscope telephoto lens with 3x optical zoom and up to 120x digital zoom"
    ],
    useCases: [
      "Power users demanding heavy multitasking without battery anxiety",
      "High refresh rate mobile gaming (PUBG, Genshin Impact) with massive vapor chamber cooling"
    ],
    sellers: [
      { name: "Amazon India", price: 69999, availability: "In Stock, Free Prime Delivery", url: "https://www.amazon.in/dp/B0CQPNW7J7" },
      { name: "OnePlus Store India", price: 69999, availability: "Official Brand Store", url: "https://www.oneplus.in/12" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.oneplus.in/12" }
    ]
  },
  {
    id: 170,
    sku: "AE-CNS-PRD-170",
    title: "Apple iPad (10th Generation, Wi-Fi, 64GB, Blue)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Tablets",
    description: "All-screen design with 10.9-inch Liquid Retina display, A14 Bionic chip, landscape 12MP Ultra Wide front camera with Center Stage, USB-C, and Apple Pencil support.",
    price: 34900,
    discountPercentage: 12,
    rating: 4.7,
    stock: 55,
    searchQuery: "Apple iPad 10th generation Blue",
    specifications: {
      display: "10.9-inch Liquid Retina display with True Tone, 2360 x 1640 resolution, 500 nits",
      chip: "A14 Bionic chip with 6-core CPU, 4-core GPU, 16-core Neural Engine",
      cameras: "12MP Wide back camera, landscape 12MP Ultra Wide front camera with Center Stage",
      authentication: "Touch ID integrated into the top power button",
      connectivity: "Wi-Fi 6 (802.11ax), Bluetooth 5.2, USB-C connector"
    },
    features: [
      "Landscape front camera with Center Stage keeps you centered in frame during video calls",
      "Modern all-screen aesthetic with flat edges and vibrant color options",
      "Supports Apple Pencil (USB-C & 1st gen) and Magic Keyboard Folio"
    ],
    useCases: [
      "Digital student note-taking, sketching, and textbook reading",
      "Streaming movies, Zoom meetings, and family FaceTime calls"
    ],
    sellers: [
      { name: "Amazon India", price: 32900, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0BJLHP53N" },
      { name: "Croma", price: 34900, availability: "In Stock", url: "https://www.croma.com/apple-ipad-10th-gen/p/264389" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/ipad-10.9/" }
    ]
  },
  {
    id: 171,
    sku: "AE-CNS-PRD-171",
    title: "Apple iPad Air 11-inch (M2 Chip, Wi-Fi, 128GB, Space Grey)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Tablets",
    description: "Supercharged by the M2 chip delivering blazing-fast performance, Liquid Retina display, landscape 12MP front camera with Center Stage, and support for Apple Pencil Pro.",
    price: 59900,
    discountPercentage: 5,
    rating: 4.8,
    stock: 30,
    searchQuery: "Apple iPad Air M2 11 inch",
    specifications: {
      processor: "Apple M2 chip, 8-core CPU, 9-core GPU, 16-core Neural Engine",
      display: "11-inch Liquid Retina display, P3 wide color, True Tone, anti-reflective coating, 500 nits",
      storage: "128GB high-speed internal flash storage",
      accessoryCompatibility: "Apple Pencil Pro, Apple Pencil (USB-C), Magic Keyboard",
      connectivity: "Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C (up to 10Gb/s)"
    },
    features: [
      "M2 chip provides a massive leap in speed for 4K video editing and 3D rendering",
      "Support for Apple Pencil Pro with barrel roll, squeeze gesture, and haptic feedback",
      "Landscape 12MP Ultra Wide front camera optimized for Zoom and video calls"
    ],
    useCases: [
      "Digital art illustration and graphic design in Procreate",
      "High-performance mobile video editing in DaVinci Resolve and Final Cut Pro for iPad"
    ],
    sellers: [
      { name: "Apple Store India", price: 59900, availability: "In Stock", url: "https://www.apple.com/in/shop/buy-ipad/ipad-air" },
      { name: "Amazon India", price: 57900, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B0D3J7CVN7" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/ipad-air/" }
    ]
  },
  {
    id: 172,
    sku: "AE-CNS-PRD-172",
    title: "Samsung Galaxy Tab S9 (11-inch Dynamic AMOLED 2X, 128GB)",
    brand: "Samsung",
    sector: "Consumer Electronics",
    category: "Tablets",
    description: "Premium Android tablet with 11-inch 120Hz Dynamic AMOLED 2X screen, Snapdragon 8 Gen 2 for Galaxy, bundled IP68 S Pen, quad speakers by AKG, and IP68 water resistance.",
    price: 67999,
    discountPercentage: 15,
    rating: 4.7,
    stock: 25,
    searchQuery: "Samsung Galaxy Tab S9",
    specifications: {
      display: "11.0\" Dynamic AMOLED 2X, 120Hz, 2560 x 1600 (WQXGA), HDR10+",
      processor: "Qualcomm Snapdragon 8 Gen 2 for Galaxy (4nm)",
      memoryStorage: "8GB RAM, 128GB storage (microSD card up to 1TB)",
      battery: "8400 mAh battery with 45W fast charging",
      protection: "IP68 water and dust resistant (first time on Galaxy Tab S series)",
      audio: "Quad stereo speakers tuned by AKG with Dolby Atmos"
    },
    features: [
      "IP68 rating makes tablet and included S Pen safe from water splashes and outdoor rain",
      "Vibrant Dynamic AMOLED 2X display with Vision Booster enhances outdoor visibility",
      "Samsung DeX mode transforms tablet into a multi-window desktop interface"
    ],
    useCases: [
      "Digital illustration and note-taking with zero-latency included S Pen",
      "HDR movie streaming and split-screen productivity"
    ],
    sellers: [
      { name: "Amazon India", price: 61999, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B0CC9QW981" },
      { name: "Samsung Store India", price: 67999, availability: "Official Retailer", url: "https://www.samsung.com/in/tablets/galaxy-tab-s9/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.samsung.com/in/tablets/galaxy-tab-s9/" }
    ]
  },
  {
    id: 173,
    sku: "AE-CNS-PRD-173",
    title: "Apple Watch Series 9 (GPS, 45mm Midnight Aluminum)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Smartwatches & Wearables",
    description: "Smarter, brighter, and mightier with S9 SiP chip, double tap gesture control, 2000 nits display, precision finding for iPhone, and comprehensive health monitoring.",
    price: 44900,
    discountPercentage: 8,
    rating: 4.8,
    stock: 35,
    searchQuery: "Apple Watch Series 9 45mm Midnight",
    specifications: {
      chip: "S9 SiP with 64-bit dual-core processor, 4-core Neural Engine",
      display: "Always-On Retina LTPO OLED display, up to 2000 nits, down to 1 nit in dark rooms",
      healthSensors: "Electrical heart sensor (ECG app), third-gen optical heart sensor, temperature sensing, blood oxygen sensor",
      durability: "WR50 water resistance (swimproof to 50m), IP6X dust resistance",
      batteryLife: "18 hours all-day battery life (up to 36 hours in Low Power Mode)"
    },
    features: [
      "Double tap gesture lets you answer calls, pause music, and stop timers using one hand without touching the screen",
      "On-device Siri processes health and timer requests faster without an internet connection",
      "Second-generation Ultra Wideband chip provides Precision Finding with directional distance arrows to find misplaced iPhones"
    ],
    useCases: [
      "Cardiovascular health monitoring (ECG, irregular rhythm notifications)",
      "Daily fitness tracking and Apple Fitness+ workout metrics"
    ],
    sellers: [
      { name: "Amazon India", price: 41900, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0CHX3LMWC" },
      { name: "Apple Store India", price: 44900, availability: "In Stock", url: "https://www.apple.com/in/watch/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/apple-watch-series-9/" }
    ]
  },
  {
    id: 174,
    sku: "AE-CNS-PRD-174",
    title: "Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)",
    brand: "Apple",
    sector: "Consumer Electronics",
    category: "Smartwatches & Wearables",
    description: "The most rugged and capable Apple Watch. Engineered with a lightweight 49mm titanium case, 3000 nits display, dual-frequency precision GPS, up to 36 hours of battery life, and 100m water resistance.",
    price: 89900,
    discountPercentage: 5,
    rating: 4.9,
    stock: 18,
    searchQuery: "Apple Watch Ultra 2 49mm",
    specifications: {
      case: "49mm aerospace-grade titanium case with raised bezel edge to protect flat sapphire crystal display",
      display: "Always-On Retina display, up to 3000 nits peak brightness",
      batteryLife: "Up to 36 hours of normal use, up to 72 hours in Low Power Mode",
      waterResistance: "100m water resistance, EN13319 certified for recreational scuba diving to 40m",
      gps: "Precision dual-frequency GPS (L1 and L5) with custom antenna",
      siren: "86-decibel Emergency Siren audible up to 180 meters"
    },
    features: [
      "Customizable physical Action button for instant workout marks, compass waypoints, and dive starts",
      "Depth gauge with water temperature sensor integrates with Oceanic+ scuba dive computer app",
      "Three-microphone array with wind noise mitigation for clear calls in outdoor blizzards and gales"
    ],
    useCases: [
      "Ultra-marathons, trail running, mountain trekking, and extreme wilderness expeditions",
      "Recreational scuba diving, freediving, and water sports"
    ],
    sellers: [
      { name: "Amazon India", price: 86900, availability: "In Stock", url: "https://www.amazon.in/dp/B0CHX19YV7" },
      { name: "Apple Store India", price: 89900, availability: "Official Brand Store", url: "https://www.apple.com/in/apple-watch-ultra-2/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/apple-watch-ultra-2/" }
    ]
  },
  {
    id: 175,
    sku: "AE-CNS-PRD-175",
    title: "Samsung Galaxy Watch 6 (40mm Bluetooth, Graphite)",
    brand: "Samsung",
    sector: "Consumer Electronics",
    category: "Smartwatches & Wearables",
    description: "Personalized wellness coach with 20% larger display, slimmer bezel, advanced sleep coaching, ECG, Blood Pressure monitoring, and BioActive sensor.",
    price: 23999,
    discountPercentage: 20,
    rating: 4.5,
    stock: 45,
    searchQuery: "Samsung Galaxy Watch 6 40mm Graphite",
    specifications: {
      display: "1.3\" (33.3mm) Sapphire Crystal Super AMOLED (432 x 432), Always-On",
      processor: "Exynos W930 dual-core 1.4GHz (5nm)",
      healthSensors: "Samsung BioActive Sensor (Optical Heart Rate + Electrical Heart Signal + Bioelectrical Impedance Analysis), Temperature sensor",
      durability: "5ATM + IP68 water resistance / MIL-STD-810H durability standard",
      operatingSystem: "Wear OS Powered by Samsung (One UI 5 Watch)"
    },
    features: [
      "Detailed Sleep Coaching with sleep animal symbols to build healthier nighttime habits",
      "Body Composition BIA sensor measures skeletal muscle and body fat percentage",
      "One-Click band mechanism allows changing straps in seconds"
    ],
    useCases: [
      "Android and Samsung Galaxy users tracking daily health, steps, and sleep cycles",
      "Instant wrist notifications and Samsung Wallet contactless payments"
    ],
    sellers: [
      { name: "Amazon India", price: 19999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0CC9K34CV" },
      { name: "Samsung Store India", price: 23999, availability: "In Stock", url: "https://www.samsung.com/in/watches/galaxy-watch/galaxy-watch6/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.samsung.com/in/watches/galaxy-watch/galaxy-watch6/" }
    ]
  },
  {
    id: 176,
    sku: "AE-CNS-PRD-176",
    title: "Garmin Forerunner 265 GPS Running Smartwatch",
    brand: "Garmin",
    sector: "Consumer Electronics",
    category: "Smartwatches & Wearables",
    description: "Dedicated running and triathlon smartwatch featuring brilliant 1.3-inch AMOLED touchscreen, Training Readiness score, wrist-based running power, multi-band GPS, and up to 13 days of battery life.",
    price: 50490,
    discountPercentage: 10,
    rating: 4.8,
    stock: 15,
    searchQuery: "Garmin Forerunner 265 smartwatch",
    specifications: {
      display: "1.3\" AMOLED touchscreen with optional always-on mode (416 x 416 pixels), Corning Gorilla Glass 3",
      batteryLife: "Smartwatch mode: Up to 13 days; GPS-only mode: Up to 20 hours; SatIQ (AutoSelect) GNSS: Up to 16 hours",
      waterRating: "5 ATM (50 meters swim-proof)",
      satelliteSystems: "Multi-band GPS / GLONASS / Galileo with SatIQ technology",
      weight: "47 g lightweight fiber-reinforced polymer casing"
    },
    features: [
      "Morning Report summarizes your sleep, recovery, heart rate variability (HRV), and daily training outlook",
      "Training Readiness score tells you whether today is a good day to push hard or take it easy",
      "SatIQ technology dynamically determines GPS mode to maximize battery life without compromising accuracy"
    ],
    useCases: [
      "Marathon, half-marathon, and 10K running training plans",
      "Triathlon multi-sport seamless transition tracking"
    ],
    sellers: [
      { name: "Garmin India Store", price: 50490, availability: "Official Indian Warranty", url: "https://www.garmin.co.in/products/wearables/forerunner-265-black/" },
      { name: "Amazon India", price: 46990, availability: "In Stock", url: "https://www.amazon.in/dp/B0BY2H9DFG" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.garmin.co.in/products/wearables/forerunner-265-black/" }
    ]
  },
  {
    id: 177,
    sku: "AE-CNS-PRD-177",
    title: "Amazon Kindle Paperwhite (16GB, 6.8-inch Glare-Free Display)",
    brand: "Amazon",
    sector: "Consumer Electronics",
    category: "E-Readers",
    description: "Featuring a 6.8-inch 300 ppi glare-free display, adjustable warm light, up to 10 weeks of battery life, 20% faster page turns, and IPX8 waterproof rating.",
    price: 14999,
    discountPercentage: 13,
    rating: 4.8,
    stock: 60,
    searchQuery: "Kindle Paperwhite 16GB 6.8 inch",
    specifications: {
      display: "6.8\" Paperwhite display technology with built-in light, 300 ppi, 16-level gray scale, optimized font technology",
      storage: "16 GB (holds thousands of books)",
      batteryLife: "A single charge via USB-C lasts up to 10 weeks based on a half hour of reading per day",
      waterproofing: "IPX8 rated to withstand immersion in up to 2 meters of fresh water for 60 minutes",
      lighting: "17 white and amber LEDs with adjustable warm light"
    },
    features: [
      "Paper-like glare-free display reads comfortably even in direct bright sunlight",
      "Adjustable warm light shifts screen shade from white to amber for nighttime reading comfort",
      "Flush-front design and 10-week battery life eliminate charging worry"
    ],
    useCases: [
      "Immersive book reading without blue light eye strain or notification distractions",
      "Poolside, beach, and bathtub reading thanks to IPX8 waterproof rating"
    ],
    sellers: [
      { name: "Amazon India", price: 12999, availability: "In Stock, Free Next-Day Prime Delivery", url: "https://www.amazon.in/dp/B08N3TCP2F" },
      { name: "Croma", price: 14999, availability: "In Stock", url: "https://www.croma.com/amazon-kindle-paperwhite-16gb/p/264210" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.amazon.in/dp/B08N3TCP2F" }
    ]
  },
  {
    id: 178,
    sku: "AE-CNS-PRD-178",
    title: "DJI Mini 3 Lightweight Camera Drone (with DJI RC)",
    brand: "DJI",
    sector: "Consumer Electronics",
    category: "Drones & Imaging",
    description: "Compact, ultralight under 249g drone featuring 4K HDR video, True Vertical Shooting for social media reels, 38-minute flight time, and up to 10km HD video transmission.",
    price: 45990,
    discountPercentage: 10,
    rating: 4.7,
    stock: 20,
    searchQuery: "DJI Mini 3 drone with DJI RC",
    specifications: {
      weight: "Under 249 grams (exempt from many regional drone registration regulations)",
      camera: "1/1.3-inch CMOS sensor, 48MP effective pixels, f/1.7 aperture, dual native ISO",
      videoResolution: "4K HDR at 30 fps, True Vertical Shooting (camera gimbal physically rotates 90°)",
      maxFlightTime: "Up to 38 minutes on standard Intelligent Flight Battery",
      transmission: "DJI O2 digital video transmission up to 10 km (line of sight)",
      windResistance: "Level 5 wind resistance (up to 10.7 m/s)"
    },
    features: [
      "True Vertical Shooting physically rotates the gimbal 90 degrees for zero-crop social media footage",
      "Sub-249g regulation-friendly takeoff weight",
      "Bundled DJI RC remote controller features a built-in 5.5-inch FHD screen (no smartphone needed)"
    ],
    useCases: [
      "Travel landscape aerial photography and 4K Instagram reel creation",
      "Real estate exterior aerial video walkthroughs"
    ],
    sellers: [
      { name: "Amazon India", price: 44990, availability: "In Stock", url: "https://www.amazon.in/dp/B0BNW1GBRL" },
      { name: "DesignInfo", price: 45990, availability: "Authorized DJI Dealer", url: "https://www.designinfo.in/p/dji-mini-3-with-dji-rc" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.dji.com/mini-3" }
    ]
  },
  {
    id: 179,
    sku: "AE-CNS-PRD-179",
    title: "GoPro HERO11 Black Waterproof Action Camera",
    brand: "GoPro",
    sector: "Consumer Electronics",
    category: "Action Cameras",
    description: "Rugged action camera featuring a 1/1.9-inch sensor delivering revolutionary 8:7 aspect ratio, 5.3K60 video, Emmy Award-winning HyperSmooth 5.0 stabilization with Horizon Lock, and dual LCD screens.",
    price: 34990,
    discountPercentage: 22,
    rating: 4.6,
    stock: 30,
    searchQuery: "GoPro HERO11 Black action camera",
    specifications: {
      sensor: "1/1.9\" CMOS sensor, 27MP photos",
      videoResolution: "5.3K at 60 fps, 4K at 120 fps, 2.7K at 240 fps (8x slo-mo)",
      stabilization: "HyperSmooth 5.0 with 360-degree Horizon Lock",
      waterproofing: "Rugged and waterproof to 33 ft (10 m) without external housing",
      battery: "1720 mAh Enduro cold-weather battery included",
      colorDepth: "10-bit color delivering over 1 billion colors"
    },
    features: [
      "Large 8:7 sensor lets you shoot once and crop into vertical 9:16 or widescreen 16:9 in the GoPro Quik app",
      "Horizon Lock keeps your horizon steady and level even if your camera rotates a full 360 degrees",
      "Enduro battery dramatically improves cold-weather performance and extends recording times by 38%"
    ],
    useCases: [
      "Action sports recording (motorcycling, downhill skiing, mountain biking, surfing)",
      "High-frame-rate 8x super slow motion capture"
    ],
    sellers: [
      { name: "Amazon India", price: 32990, availability: "In Stock, Free Prime Delivery", url: "https://www.amazon.in/dp/B0B974N9DF" },
      { name: "Croma", price: 34990, availability: "In Stock", url: "https://www.croma.com/gopro-hero11-black/p/262849" }
    ],
    sources: [
      { type: "official_product_page", url: "https://gopro.com/en/in/shop/cameras/hero11-black/CHDHX-111-master.html" }
    ]
  },
  {
    id: 180,
    sku: "AE-CNS-PRD-180",
    title: "SanDisk Extreme Portable SSD 1TB (USB 3.2 Gen 2, Up to 1050MB/s)",
    brand: "SanDisk",
    sector: "Consumer Electronics",
    category: "External Storage",
    description: "Rugged portable NVMe solid state drive with up to 1050MB/s read and 1000MB/s write speeds, IP65 water and dust resistance, 3-meter drop protection, and handy carabiner loop.",
    price: 9999,
    discountPercentage: 35,
    rating: 4.7,
    stock: 90,
    searchQuery: "SanDisk Extreme Portable SSD 1TB",
    specifications: {
      capacity: "1TB high-speed 3D NAND NVMe SSD",
      interface: "USB 3.2 Gen 2 (Type-C to Type-C cable with Type-A adapter included)",
      sequentialPerformance: "Read speed up to 1050 MB/s, write speed up to 1000 MB/s",
      durability: "IP65 water and dust resistance, up to 3-meter drop protection",
      encryption: "256-bit AES hardware encryption with password protection",
      weight: "52 g compact silicone-coated shell"
    },
    features: [
      "Durable silicone exterior coating provides a tactile feel and rugged buffer protection",
      "Carabiner loop secures the drive to your belt loop or photographer backpack",
      "Universal compatibility with Windows, Mac, iPad Pro, Android, and iPhone 15 series"
    ],
    useCases: [
      "Direct external ProRes 4K recording from iPhone 15 Pro",
      "High-speed photo library backup on photography expeditions"
    ],
    sellers: [
      { name: "Amazon India", price: 8499, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B08GTYFC37" },
      { name: "Reliance Digital", price: 9499, availability: "In Stock", url: "https://www.reliancedigital.in/sandisk-extreme-portable-ssd-1tb/p/491934912" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.westerndigital.com/en-in/products/portable-drives/sandisk-extreme-usb-3-2-ssd" }
    ]
  },

  // ==========================================
  // 5. Industrial Electronics (20 products: 181-200)
  // ==========================================
  {
    id: 181,
    sku: "AE-IND-PRD-181",
    title: "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC (6ES7214-1AG40-0XB0)",
    brand: "Siemens",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Compact industrial programmable logic controller with onboard PROFINET interface, 14 digital inputs (24V DC), 10 digital outputs (24V DC), 2 analog inputs (0-10V), and 100KB work memory.",
    price: 32500,
    discountPercentage: 8,
    rating: 4.9,
    stock: 18,
    searchQuery: "Siemens S7-1200 CPU 1214C",
    specifications: {
      modelNumber: "6ES7214-1AG40-0XB0",
      supplyVoltage: "24V DC (20.4 to 28.8 V DC)",
      workMemory: "100 KB integrated work memory (expandable with SIMATIC Memory Card)",
      digitalInputs: "14 digital inputs (24V DC sink/source, 6 inputs configurable as high-speed counters up to 100 kHz)",
      digitalOutputs: "10 digital outputs (24V DC transistor, 0.5A, 4 outputs configurable as pulse train outputs)",
      analogInputs: "2 analog inputs (0 to 10 V DC, 10-bit resolution)",
      communication: "1 PROFINET port (RJ45, 10/100 Mbit/s) supporting TCP/IP, ISO-on-TCP, S7 communication"
    },
    features: [
      "Integrated PROFINET interface allows seamless programming via TIA Portal and HMI communication",
      "High-speed pulse train outputs (PTO) for precise stepper and servo motor motion control",
      "Modular expandability with up to 3 communication modules and 8 signal modules"
    ],
    useCases: [
      "Factory automated assembly lines and conveyor belt routing",
      "Packaging machines, sorting mechanisms, and industrial pump station control"
    ],
    sellers: [
      { name: "IndustryBuying", price: 31900, availability: "In Stock, GST Invoice Available", url: "https://www.industrybuying.com/programmable-logic-controllers-siemens-ELE.PRO.91823741/" },
      { name: "RS Components India", price: 32500, availability: "Dispatches within 24 hours", url: "https://in.rs-online.com/web/p/plcs/8643961" },
      { name: "Amazon India", price: 33499, availability: "In Stock", url: "https://www.amazon.in/dp/B07N1V9X8Z" }
    ],
    sources: [
      { type: "official_product_page", url: "https://mall.industry.siemens.com/mall/en/in/Catalog/Product/6ES7214-1AG40-0XB0" }
    ]
  },
  {
    id: 182,
    sku: "AE-IND-PRD-182",
    title: "Siemens LOGO! 24RCE Logic Module (6ED1052-1MD08-0BA1)",
    brand: "Siemens",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Compact smart logic controller with integrated display and keypad, Ethernet port, integrated web server, 8 digital inputs, and 4 relay outputs (10A).",
    price: 14200,
    discountPercentage: 5,
    rating: 4.8,
    stock: 25,
    searchQuery: "Siemens LOGO! 24RCE logic module",
    specifications: {
      modelNumber: "6ED1052-1MD08-0BA1",
      supplyVoltage: "12/24V DC",
      inputs: "8 digital inputs (of which 4 can be used as analog inputs 0-10V DC)",
      outputs: "4 relay outputs (10 A resistive load, 3 A inductive load)",
      display: "Backlit graphic LCD display with configurable backlight color (white, amber, red)",
      connectivity: "Integrated Ethernet interface with micro SD card slot and web server"
    },
    features: [
      "Integrated web server allows monitoring and switching relays from any smartphone or tablet browser",
      "Easy drag-and-drop ladder logic or function block diagram (FBD) programming in LOGO! Soft Comfort",
      "Cloud connectivity via MQTT to AWS or Siemens MindSphere"
    ],
    useCases: [
      "Commercial building automated lighting and ventilation control",
      "Automated greenhouse irrigation and pump alternation systems"
    ],
    sellers: [
      { name: "RS Components India", price: 13990, availability: "In Stock", url: "https://in.rs-online.com/web/p/logic-modules/1653241" },
      { name: "IndustryBuying", price: 14200, availability: "Available", url: "https://www.industrybuying.com/siemens-logo-24rce" }
    ],
    sources: [
      { type: "official_product_page", url: "https://mall.industry.siemens.com/mall/en/in/Catalog/Product/6ED1052-1MD08-0BA1" }
    ]
  },
  {
    id: 183,
    sku: "AE-IND-PRD-183",
    title: "Schneider Electric Modicon TM221C24R Compact Logic Controller",
    brand: "Schneider Electric",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "High-performance compact programmable controller with 24 I/O (14 digital inputs, 10 relay outputs), 2 analog inputs, RS232/RS485 serial link, and Ethernet port.",
    price: 24800,
    discountPercentage: 10,
    rating: 4.7,
    stock: 15,
    searchQuery: "Schneider Electric Modicon TM221C24R",
    specifications: {
      partNumber: "TM221C24R",
      ratedSupplyVoltage: "100...240 V AC",
      discreteInputNumber: "14 discrete inputs conforming to IEC 61131-2 Type 1",
      discreteOutputNumber: "10 relay outputs (2A maximum)",
      analogInputs: "2 analog inputs (0...10 V, 10-bit resolution)",
      communicationPorts: "USB mini-B programming port, Non-isolated serial link (RJ45, RS232/RS485), Ethernet port"
    },
    features: [
      "Engineered for simple standalone machines in the EcoStruxure Machine Expert - Basic software environment",
      "Embedded Ethernet port for direct connection to Scada systems and web visualization",
      "Detachable screw terminal blocks for rapid field maintenance"
    ],
    useCases: [
      "Industrial material handling, packaging, and sorting machinery",
      "Water treatment facility chemical dosing and pump management"
    ],
    sellers: [
      { name: "IndustryBuying", price: 23900, availability: "In Stock", url: "https://www.industrybuying.com/schneider-tm221c24r" },
      { name: "RS Components India", price: 24800, availability: "Available", url: "https://in.rs-online.com/web/p/plcs/8067054" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.se.com/in/en/product/TM221C24R/" }
    ]
  },
  {
    id: 184,
    sku: "AE-IND-PRD-184",
    title: "Schneider Electric Zelio Logic Smart Relay (SR3B261BD)",
    brand: "Schneider Electric",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Modular smart relay with integrated LCD display and keypad, 26 I/O (16 digital inputs including 6 analog, 10 relay outputs), powered by 24V DC.",
    price: 18500,
    discountPercentage: 7,
    rating: 4.6,
    stock: 20,
    searchQuery: "Schneider Electric Zelio Logic SR3B261BD",
    specifications: {
      reference: "SR3B261BD",
      supplyVoltage: "24 V DC (19.2...30 V)",
      inputsNumber: "16 digital inputs (6 configurable as 0-10V analog inputs)",
      outputsNumber: "10 relay outputs (8 A for NO contact)",
      displayType: "Backlit LCD display (4 lines of 18 characters)",
      programmingLanguage: "FBD (Function Block Diagram) and Ladder logic"
    },
    features: [
      "Direct programming on the front panel display without needing a PC for quick field commissioning",
      "Clocks with weekly and calendar scheduling for automated facilities",
      "Modular expandability with discrete, analog, and communication extension blocks"
    ],
    useCases: [
      "Automated HVAC compressor and chiller rotation",
      "Commercial gate barriers and access turnstile sequencing"
    ],
    sellers: [
      { name: "IndustryBuying", price: 17800, availability: "In Stock", url: "https://www.industrybuying.com/schneider-sr3b261bd" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.se.com/in/en/product/SR3B261BD/" }
    ]
  },
  {
    id: 185,
    sku: "AE-IND-PRD-185",
    title: "Omron CP1E-N30DR-A Programmable Logic Controller",
    brand: "Omron",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Economical and reliable micro-PLC featuring 18 digital inputs, 12 relay outputs, built-in RS232C serial communication port, USB programming port, and 8K steps program capacity.",
    price: 22400,
    discountPercentage: 6,
    rating: 4.8,
    stock: 16,
    searchQuery: "Omron CP1E-N30DR-A PLC",
    specifications: {
      model: "CP1E-N30DR-A",
      powerSupply: "100 to 240 V AC 50/60 Hz",
      inputs: "18 digital inputs (24V DC, including 6 high-speed counter inputs up to 100 kHz)",
      outputs: "12 relay outputs (2A @ 250V AC / 24V DC)",
      memoryCapacity: "8K steps program memory, 8K words data memory",
      builtInPorts: "USB 2.0 peripheral port, RS-232C port"
    },
    features: [
      "Easy programming with standard CX-Programmer software",
      "High-speed counters and pulse catch functions for encoder monitoring",
      "Built-in RS-232C port for effortless connection to Omron NB-series HMI touchscreens"
    ],
    useCases: [
      "Small-scale automated packaging and bottling lines",
      "Textile loom machinery and plastic molding injection controllers"
    ],
    sellers: [
      { name: "IndustryBuying", price: 21500, availability: "In Stock, GST Invoice", url: "https://www.industrybuying.com/omron-cp1e-n30dr-a" },
      { name: "RS Components India", price: 22400, availability: "Available", url: "https://in.rs-online.com/web/p/plcs/6987512" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.ia.omron.com/products/family/2064/" }
    ]
  },
  {
    id: 186,
    sku: "AE-IND-PRD-186",
    title: "Omron ZEN-20C1AR-A-V2 Nano Programmable Relay",
    brand: "Omron",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Compact 20 I/O programmable relay with LCD screen, 12 inputs (100-240V AC), 8 relay outputs (8A), real-time calendar timer, and front panel ladder editing.",
    price: 11900,
    discountPercentage: 5,
    rating: 4.7,
    stock: 22,
    searchQuery: "Omron ZEN-20C1AR-A-V2",
    specifications: {
      model: "ZEN-20C1AR-A-V2",
      supplyVoltage: "100 to 240 V AC",
      inputsNumber: "12 AC inputs (100 to 240 V AC)",
      outputsNumber: "8 relay outputs (8 A @ 250 V AC)",
      display: "LCD with 4 lines of 12 characters and operational pushbuttons",
      dimensions: "122.5 x 90 x 56 mm (DIN rail mount)"
    },
    features: [
      "Replaces multiple relays, timers, and counters in control panels with a single unit",
      "Ladder programs can be input directly using the 8 front panel operator buttons",
      "Retentive memory holds states through power failures"
    ],
    useCases: [
      "Automated water tank level control with dual pump changeover",
      "Commercial neon sign lighting and street light day/night sequencing"
    ],
    sellers: [
      { name: "IndustryBuying", price: 11500, availability: "In Stock", url: "https://www.industrybuying.com/omron-zen-20c1ar-a-v2" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.ia.omron.com/products/family/258/" }
    ]
  },
  {
    id: 187,
    sku: "AE-IND-PRD-187",
    title: "Mitsubishi Electric MELSEC FX3U-32MR/ES PLC",
    brand: "Mitsubishi Electric",
    sector: "Industrial Electronics",
    category: "PLCs & Automation Controllers",
    description: "Industry-workhorse third-generation micro PLC featuring 16 digital inputs, 16 relay outputs, ultra-high processing speed (0.065 µs per basic instruction), and 64,000 steps RAM memory.",
    price: 26500,
    discountPercentage: 8,
    rating: 4.9,
    stock: 14,
    searchQuery: "Mitsubishi Electric FX3U-32MR/ES PLC",
    specifications: {
      modelNumber: "FX3U-32MR/ES",
      powerSupply: "100-240 V AC",
      inputs: "16 digital inputs (24V DC sink/source)",
      outputs: "16 relay outputs (2A per point, 8A per group)",
      executionSpeed: "0.065 µs / basic instruction",
      programMemory: "64,000 steps RAM (battery backed)",
      highSpeedCounters: "Up to 8 channels high-speed counting (up to 100 kHz)"
    },
    features: [
      "Exceptional computing speed and rock-solid Japanese industrial reliability",
      "Dual bus architecture allows adding both high-speed adapter modules and standard expansion blocks",
      "Compatible with GX Works2 and GX Developer software platforms"
    ],
    useCases: [
      "CNC machine tool automation and rotary table positioning",
      "High-speed automated carton packing and label dispensing"
    ],
    sellers: [
      { name: "IndustryBuying", price: 25500, availability: "In Stock, Genuine Mitsubishi", url: "https://www.industrybuying.com/mitsubishi-fx3u-32mr-es" },
      { name: "RS Components India", price: 26500, availability: "In Stock", url: "https://in.rs-online.com/web/p/plcs/0533421" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/fx3u/index.html" }
    ]
  },
  {
    id: 188,
    sku: "AE-IND-PRD-188",
    title: "Mean Well NDR-240-24 240W 24V DIN-Rail Industrial Power Supply",
    brand: "Mean Well",
    sector: "Industrial Electronics",
    category: "Industrial Power Supplies",
    description: "Slim 240W single output DIN-rail power supply providing 24V DC at 10A with universal AC input, active PFC function, high efficiency up to 88.5%, and metal casing.",
    price: 4450,
    discountPercentage: 12,
    rating: 4.8,
    stock: 50,
    searchQuery: "Mean Well NDR-240-24 power supply",
    specifications: {
      outputVoltage: "24V DC (adjustable range: 24 ~ 28V DC)",
      ratedCurrent: "10A (output power: 240W)",
      inputVoltageRange: "90 ~ 264V AC / 127 ~ 370V DC",
      efficiency: "88.5% typical",
      protections: "Short circuit / Overload (constant current limiting) / Over voltage / Over temperature",
      formFactor: "Slim 63mm width for TS-35/7.5 or TS-35/15 DIN rails"
    },
    features: [
      "Built-in active Power Factor Correction (PFC) function complying with EN61000-3-2",
      "Convection cooling with no fan required, ensuring zero maintenance and long lifespan",
      "UL 508 (industrial control equipment) approved"
    ],
    useCases: [
      "Powering 24V DC PLC racks, sensors, and relays inside electrical control panels",
      "Industrial automation test fixtures and robotic arms"
    ],
    sellers: [
      { name: "IndustryBuying", price: 4250, availability: "In Stock, Prime Distributor", url: "https://www.industrybuying.com/meanwell-ndr-240-24" },
      { name: "Amazon India", price: 4450, availability: "In Stock", url: "https://www.amazon.in/dp/B013UO3B7M" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.meanwell.com/productDetail.aspx?i=63" }
    ]
  },
  {
    id: 189,
    sku: "AE-IND-PRD-189",
    title: "Mean Well LRS-350-24 350W 24V Enclosed Switching Power Supply",
    brand: "Mean Well",
    sector: "Industrial Electronics",
    category: "Industrial Power Supplies",
    description: "Low-profile 30mm enclosed switching power supply providing 24V DC at 14.6A with 115V/230V AC input selectable by switch, built-in cooling fan, and 300V AC surge withstand.",
    price: 2850,
    discountPercentage: 15,
    rating: 4.7,
    stock: 65,
    searchQuery: "Mean Well LRS-350-24 power supply",
    specifications: {
      dcVoltage: "24V DC (adjustable 21.6 ~ 28.8V)",
      ratedCurrent: "14.6A (rated power: 350.4W)",
      inputVoltage: "90 ~ 132V AC / 180 ~ 264V AC by switch",
      dimensions: "215 x 115 x 30 mm (1U low profile)",
      protections: "Short circuit, overload, over voltage, over temperature",
      fanControl: "Built-in DC fan with ON-OFF thermal control"
    },
    features: [
      "1U low profile design enables integration into compact industrial enclosures",
      "Withstands 300V AC surge input for 5 seconds without damage",
      "Vibration resistant up to 5G acceleration"
    ],
    useCases: [
      "Powering heavy-duty 24V stepper motors and heated beds in industrial 3D printers and CNCs",
      "LED industrial signage and factory machinery illumination"
    ],
    sellers: [
      { name: "Robu.in", price: 2750, availability: "In Stock", url: "https://robu.in/product/mean-well-lrs-350-24-smps/" },
      { name: "Amazon India", price: 2850, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B013ETVO6U" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.meanwell.com/productDetail.aspx?i=418" }
    ]
  },
  {
    id: 190,
    sku: "AE-IND-PRD-190",
    title: "Phoenix Contact STEP-PS/1AC/24DC/2.5 DIN Rail Power Supply",
    brand: "Phoenix Contact",
    sector: "Industrial Electronics",
    category: "Industrial Power Supplies",
    description: "Compact German-engineered power supply tailored for distributor boards and control cabinets, delivering 24V DC at 2.5A with stepless output voltage trimming.",
    price: 5800,
    discountPercentage: 6,
    rating: 4.8,
    stock: 20,
    searchQuery: "Phoenix Contact STEP-PS/1AC/24DC/2.5",
    specifications: {
      orderNumber: "2868651",
      nominalInputVoltage: "100 V AC ... 240 V AC",
      nominalOutputVoltage: "24 V DC ±1% (adjustable 22.5 V DC ... 29.5 V DC)",
      nominalOutputCurrent: "2.5 A (60 W output power)",
      efficiency: "> 86% (for 230 V AC and nominal values)",
      mounting: "DIN rail mounting (EN 60715)"
    },
    features: [
      "Extremely low idling losses (< 0.4 W) for maximum energy efficiency",
      "Compact stepped contour design specifically fits standard flat building distribution boards",
      "Wide ambient temperature range from -25°C to +70°C"
    ],
    useCases: [
      "Building automation distribution cabinets",
      "Powering isolated industrial transmitter loops and telemetry field units"
    ],
    sellers: [
      { name: "RS Components India", price: 5800, availability: "In Stock", url: "https://in.rs-online.com/web/p/power-supplies/6657788" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.phoenixcontact.com/en-in/products/power-supply-unit-step-ps-1ac-24dc-25-2868651" }
    ]
  },
  {
    id: 191,
    sku: "AE-IND-PRD-191",
    title: "Fluke 87V Industrial True-RMS Digital Multimeter",
    brand: "Fluke",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "The premier industrial digital multimeter delivering accurate frequency and voltage measurements on variable frequency motor drives (VFDs), True-RMS AC voltage, built-in thermometer, and lifetime warranty.",
    price: 48990,
    discountPercentage: 10,
    rating: 4.9,
    stock: 25,
    searchQuery: "Fluke 87V industrial multimeter",
    specifications: {
      voltageDC: "Up to 1000 V (0.05% basic accuracy)",
      voltageAC: "Up to 1000 V True-RMS (bandwidth up to 20 kHz)",
      currentACDC: "Up to 10 A (20 A for up to 30 seconds)",
      temperature: "-200.0 °C to 1090 °C (-328.0 °F to 1994.0 °F) built-in thermometer probe",
      displayCount: "6,000 counts (resolution switchable to 20,000 counts in high-res mode)",
      safetyRating: "CAT III 1000 V, CAT IV 600 V"
    },
    features: [
      "Unique low-pass filter captures accurate voltage and frequency readings on noisy variable speed motor drives (VFDs)",
      "Withstands voltage spikes up to 8,000 volts caused by load switching and industrial power faults",
      "Built-in temperature measurement removes the need to carry a standalone digital thermometer"
    ],
    useCases: [
      "Industrial electrical maintenance in power plants, refineries, and factory floors",
      "Troubleshooting heavy machinery, 3-phase electric motors, and high-voltage switchgear"
    ],
    sellers: [
      { name: "Amazon India", price: 44990, availability: "In Stock, Prime, Official Fluke India Warranty", url: "https://www.amazon.in/dp/B0002YFD1K" },
      { name: "IndustryBuying", price: 47500, availability: "Available, GST Invoice Included", url: "https://www.industrybuying.com/digital-multimeter-fluke-TEST.DIG.234123/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.fluke.com/en-in/product/electrical-testing/digital-multimeters/fluke-87v" }
    ]
  },
  {
    id: 192,
    sku: "AE-IND-PRD-192",
    title: "Fluke 179 True-RMS Digital Multimeter with Temperature",
    brand: "Fluke",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "Full-featured precision industrial technician multimeter with True-RMS AC measurements, built-in temperature probe, min/max/average recording, and backlit digital display with analog bargraph.",
    price: 38500,
    discountPercentage: 8,
    rating: 4.8,
    stock: 30,
    searchQuery: "Fluke 179 digital multimeter",
    specifications: {
      voltageMeasurement: "AC/DC voltage up to 1000 V (0.09% basic DC accuracy)",
      currentMeasurement: "AC/DC current up to 10 A",
      resistanceCapacitance: "Resistance up to 50 MΩ; Capacitance up to 10,000 µF",
      display: "6000 count backlit display with 33-segment fast analog bargraph",
      safetyRating: "CAT IV 600 V / CAT III 1000 V"
    },
    features: [
      "Manual and automatic ranging for maximum versatility across components",
      "Display Hold and Auto Hold to freeze readings in hard-to-see electrical panels",
      "Overmolded protective rubber holster provides comfortable grip and drop protection"
    ],
    useCases: [
      "Commercial HVAC technician diagnosis and boiler temperature profiling",
      "Field servicing of electronic circuit boards and industrial control panels"
    ],
    sellers: [
      { name: "Amazon India", price: 36500, availability: "In Stock", url: "https://www.amazon.in/dp/B00012Z0U6" },
      { name: "IndustryBuying", price: 38500, availability: "In Stock", url: "https://www.industrybuying.com/fluke-179-multimeter" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.fluke.com/en-in/product/electrical-testing/digital-multimeters/fluke-179" }
    ]
  },
  {
    id: 193,
    sku: "AE-IND-PRD-193",
    title: "Fluke 115 True-RMS Compact Field Multimeter",
    brand: "Fluke",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "Compact True-RMS technician multimeter designed for simple, one-handed operation in field service, electrical testing, and electronic bench troubleshooting.",
    price: 19900,
    discountPercentage: 10,
    rating: 4.7,
    stock: 40,
    searchQuery: "Fluke 115 digital multimeter",
    specifications: {
      measurements: "Resistance, continuity, frequency, capacitance, diode test",
      acDcVoltage: "600 V True-RMS",
      acDcCurrent: "10 A (20 A overload for 30-seconds)",
      backlight: "Large white LED backlight for working in poorly lit areas",
      safetyRating: "CAT III 600 V"
    },
    features: [
      "True-RMS for accurate measurements on non-linear electrical loads",
      "Min/Max/Average with elapsed time to record signal fluctuations",
      "Compact ergonomic design fits comfortably in pocket or toolbox"
    ],
    useCases: [
      "Field maintenance technicians checking electronic systems and circuit breakers",
      "Automotive electronic diagnosis and audio installer testing"
    ],
    sellers: [
      { name: "Amazon India", price: 17990, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B000N301EQ" },
      { name: "IndustryBuying", price: 19500, availability: "In Stock", url: "https://www.industrybuying.com/fluke-115-multimeter" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.fluke.com/en-in/product/electrical-testing/digital-multimeters/fluke-115" }
    ]
  },
  {
    id: 194,
    sku: "AE-IND-PRD-194",
    title: "Fluke 376 FC True-RMS AC/DC Clamp Meter with iFlex",
    brand: "Fluke",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "Advanced industrial clamp meter with included iFlex flexible current probe measuring up to 2500A AC, integrated VFD low-pass filter, inrush capture, and Fluke Connect wireless logging.",
    price: 52400,
    discountPercentage: 7,
    rating: 4.8,
    stock: 12,
    searchQuery: "Fluke 376 FC clamp meter",
    specifications: {
      currentJaw: "1000 A AC/DC via fixed jaw",
      currentIFlex: "2500 A AC via included iFlex flexible current probe (allows access to awkward busbars)",
      voltage: "1000 V AC/DC",
      frequency: "500 Hz",
      safetyRating: "CAT IV 600 V, CAT III 1000 V",
      connectivity: "Fluke Connect wireless smartphone app sync"
    },
    features: [
      "Included iFlex flexible current probe expands measurement range to 2500 A AC and fits into tight, crowded wire bundles",
      "Fluke Connect logs measurements remotely to smartphones outside arc flash boundary zones",
      "Proprietary inrush measurement technology filters out noise and captures motor starting current accurately"
    ],
    useCases: [
      "Measuring massive current loads in heavy industrial distribution panels",
      "Capturing startup inrush current spikes on heavy 3-phase industrial induction motors"
    ],
    sellers: [
      { name: "Amazon India", price: 49900, availability: "In Stock", url: "https://www.amazon.in/dp/B017NX3Y3G" },
      { name: "RS Components India", price: 52400, availability: "In Stock", url: "https://in.rs-online.com/web/p/clamp-meters/9181052" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.fluke.com/en-in/product/electrical-testing/clamp-meters/fluke-376-fc" }
    ]
  },
  {
    id: 195,
    sku: "AE-IND-PRD-195",
    title: "Rigol DS1054Z 50MHz 4-Channel Digital Storage Oscilloscope",
    brand: "Rigol",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "The most popular benchtop digital oscilloscope in electronics engineering, featuring 4 analog channels, 50MHz bandwidth, 1 GSa/s real-time sample rate, and deep 24 Mpts memory.",
    price: 38900,
    discountPercentage: 11,
    rating: 4.9,
    stock: 20,
    searchQuery: "Rigol DS1054Z oscilloscope",
    specifications: {
      bandwidth: "50 MHz (4 analog channels)",
      realTimeSampleRate: "1 GSa/s (single channel), 250 MSa/s (all 4 channels)",
      memoryDepth: "24 Mpts standard memory depth",
      waveformCaptureRate: "Up to 30,000 waveforms per second (wfms/s)",
      display: "7-inch WVGA (800x480) TFT color LCD with multi-level intensity grading",
      connectivity: "USB Host & Device, LAN (LXI compliant), AUX output"
    },
    features: [
      "UltraVision technology delivers deep memory depth and real-time waveform recording",
      "Math operations, FFT frequency analysis, and automated parameter measurements",
      "Optional serial bus triggering and hardware decoding (I2C, SPI, RS232)"
    ],
    useCases: [
      "Embedded microcontroller hardware debugging (SPI, I2C, UART signals)",
      "University electrical engineering laboratories and hardware startup prototyping"
    ],
    sellers: [
      { name: "Robu.in", price: 36900, availability: "In Stock, Official Rigol Distributor", url: "https://robu.in/product/rigol-ds1054z-digital-oscilloscope/" },
      { name: "Amazon India", price: 38900, availability: "In Stock", url: "https://www.amazon.in/dp/B012938E76" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.rigol.com/products/detail/DS1000Z" }
    ]
  },
  {
    id: 196,
    sku: "AE-IND-PRD-196",
    title: "Siglent SDS1104X-E 100MHz 4-Channel Super Phosphor Oscilloscope",
    brand: "Siglent",
    sector: "Industrial Electronics",
    category: "Test & Measurement Equipment",
    description: "High-accuracy benchtop 4-channel oscilloscope featuring 100MHz bandwidth, 1 GSa/s sample rate, Super Phosphor Oscilloscope (SPO) display technology, and 14 Mpts memory.",
    price: 47500,
    discountPercentage: 9,
    rating: 4.8,
    stock: 15,
    searchQuery: "Siglent SDS1104X-E oscilloscope",
    specifications: {
      bandwidth: "100 MHz (4 channels)",
      samplingRate: "1 GSa/s real-time sampling rate",
      waveformCaptureRate: "100,000 wfm/s (normal mode), up to 400,000 wfm/s (sequence mode)",
      recordLength: "14 Mpts",
      serialDecoding: "Free standard I2C, SPI, UART, CAN, LIN serial bus decoding",
      display: "7-inch TFT-LCD with 256-level color temperature and intensity grading"
    },
    features: [
      "Includes free hardware-based serial bus decoding for I2C, SPI, UART, CAN, and LIN out of the box",
      "1M points FFT calculation for high-frequency spectral analysis",
      "Web browser remote control interface via Ethernet LAN without installing drivers"
    ],
    useCases: [
      "Automotive CAN bus packet diagnosis and electronics reverse engineering",
      "Power electronics switching waveform analysis and SMPS ripple testing"
    ],
    sellers: [
      { name: "Robu.in", price: 44900, availability: "In Stock", url: "https://robu.in/product/siglent-sds1104x-e-oscilloscope/" },
      { name: "Amazon India", price: 47500, availability: "In Stock", url: "https://www.amazon.in/dp/B0771N1ZF9" }
    ],
    sources: [
      { type: "official_product_page", url: "https://siglentna.com/digital-oscilloscopes/sds1000x-e-series/" }
    ]
  },
  {
    id: 197,
    sku: "AE-IND-PRD-197",
    title: "IFM Electronic O5D100 Optical Laser Distance Sensor",
    brand: "IFM Electronic",
    sector: "Industrial Electronics",
    category: "Industrial Sensors",
    description: "Time-of-flight (ToF) laser optical distance sensor with IO-Link interface, background suppression, visible laser light spot, and measuring range up to 2 meters.",
    price: 21500,
    discountPercentage: 5,
    rating: 4.8,
    stock: 18,
    searchQuery: "IFM Electronic O5D100 laser sensor",
    specifications: {
      measuringPrinciple: "Optical time-of-flight (PMD: Photonic Mixer Device)",
      measuringRange: "0.03 to 2 meters (independent of object color or surface reflectivity)",
      laserClass: "Class 2 visible red laser (650 nm)",
      operatingVoltage: "10...30 V DC",
      outputs: "2x switching outputs (push-pull: PNP/NPN) or 1x switching + 1x analog (4...20 mA / 0...10 V)",
      housingProtection: "IP65 / IP67 robust industrial housing"
    },
    features: [
      "PMD time-of-flight technology measures distance reliably regardless of whether the object is shiny black, metallic, or matte",
      "Integrated 3-digit display on the sensor head shows exact distance in centimeters",
      "IO-Link communication transmits measured distance values digitally without analog noise"
    ],
    useCases: [
      "Collision avoidance for automated guided vehicles (AGVs) in smart warehouses",
      "Level monitoring in material hoppers and presence detection on assembly conveyors"
    ],
    sellers: [
      { name: "RS Components India", price: 21500, availability: "In Stock", url: "https://in.rs-online.com/web/p/photoelectric-sensors/8772391" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.ifm.com/in/en/product/O5D100" }
    ]
  },
  {
    id: 198,
    sku: "AE-IND-PRD-198",
    title: "Sick WL12-3P2431 Photoelectric Sensor with Polarizing Filter",
    brand: "Sick",
    sector: "Industrial Electronics",
    category: "Industrial Sensors",
    description: "High-precision retro-reflective photoelectric sensor with pinpoint LED, polarizing filter preventing false triggers from reflective metal cans, and metal housing.",
    price: 14800,
    discountPercentage: 6,
    rating: 4.8,
    stock: 24,
    searchQuery: "Sick WL12-3P2431 photoelectric sensor",
    specifications: {
      partNumber: "1041436",
      sensingRangeMax: "0.1 m ... 5 m (with PL80A reflector)",
      sensorPrinciple: "Photoelectric retro-reflective sensor with autocollimation",
      lightSource: "Pinpoint LED, visible red light (640 nm)",
      switchingOutput: "PNP, light/dark switching selectable",
      enclosureRating: "IP66 / IP67 metal die-cast zinc housing"
    },
    features: [
      "Polarizing filter ensures only light reflected by the dedicated reflector is detected, ignoring shiny objects",
      "Pinpoint LED provides a bright, precise light spot for effortless mechanical alignment",
      "Rugged metal housing withstands harsh machine tool cleaning fluids and vibration"
    ],
    useCases: [
      "Detecting shiny beverage cans and plastic bottles on bottling plant conveyors",
      "Pallet presence sensing on automated palletizer logistics systems"
    ],
    sellers: [
      { name: "RS Components India", price: 14800, availability: "In Stock", url: "https://in.rs-online.com/web/p/photoelectric-sensors/7632840" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sick.com/in/en/catalog/products/detection-sensors/photoelectric-sensors/w12-3/wl12-3p2431/p/p1041436" }
    ]
  },
  {
    id: 199,
    sku: "AE-IND-PRD-199",
    title: "Moxa EDS-208 8-Port Industrial Unmanaged Ethernet Switch",
    brand: "Moxa",
    sector: "Industrial Electronics",
    category: "Industrial Networking",
    description: "Rugged 8-port entry-level industrial Ethernet switch supporting IEEE 802.3/802.3u with 10/100BaseT(X) ports, redundant 12/24/48V DC power inputs, and DIN-rail mounting.",
    price: 12900,
    discountPercentage: 8,
    rating: 4.8,
    stock: 35,
    searchQuery: "Moxa EDS-208 industrial switch",
    specifications: {
      ports: "8x 10/100BaseT(X) ports (RJ45 connector, auto MDI/MDI-X)",
      inputVoltage: "12/24/48 V DC (9.6 to 60 V DC redundant dual power inputs)",
      housing: "Rugged high-strength plastic housing with IP30 rating",
      installation: "DIN-rail mounting and optional wall mounting",
      operatingTemperature: "-10 to 60 °C (14 to 140 °F)"
    },
    features: [
      "Broadcast storm protection prevents network downtime caused by broadcast packets",
      "Dual redundant power inputs ensure continuous operation if one power source drops out",
      "No configuration required; plug-and-play for immediate machine network interconnectivity"
    ],
    useCases: [
      "Connecting multiple PLCs, HMIs, and SCADA gateways inside industrial control cabinets",
      "Substation and solar plant Ethernet communication networks"
    ],
    sellers: [
      { name: "IndustryBuying", price: 12400, availability: "In Stock, Authorized Dealer", url: "https://www.industrybuying.com/moxa-eds-208" },
      { name: "RS Components India", price: 12900, availability: "In Stock", url: "https://in.rs-online.com/web/p/industrial-switches/6182394" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.moxa.com/en/products/industrial-network-infrastructure/ethernet-switches/unmanaged-switches/eds-208-series" }
    ]
  },
  {
    id: 200,
    sku: "AE-IND-PRD-200",
    title: "WAGO 221-413 Lever-Nuts 3-Conductor Splicing Connector Box (50 pcs)",
    brand: "WAGO",
    sector: "Industrial Electronics",
    category: "Industrial Connectors & Wiring",
    description: "Compact tool-free lever-operated splicing connectors for solid, stranded, and fine-stranded electrical conductors from 0.14 to 4 mm² (24-12 AWG). Box of 50 pieces.",
    price: 2250,
    discountPercentage: 10,
    rating: 4.9,
    stock: 120,
    searchQuery: "WAGO 221-413 connector 50 pack",
    specifications: {
      itemNumber: "221-413",
      totalNumberOfConnectionPoints: "3 conductors per connector",
      nominalVoltage: "450 V (rated surge voltage: 4 kV)",
      nominalCurrent: "32 A",
      conductorCrossSection: "Solid / Stranded: 0.2 ... 4 mm² (24 ... 12 AWG); Fine-stranded: 0.14 ... 4 mm²",
      stripLength: "11 mm / 0.43 inch",
      packageQuantity: "Box of 50 connectors"
    },
    features: [
      "Tool-free lever operation allows connecting solid and stranded copper wires together instantly",
      "Transparent housing provides visual confirmation of proper wire insertion depth and stripped length",
      "Two test slots allow checking circuit voltage with a multimeter probe without disconnecting wires"
    ],
    useCases: [
      "Industrial control cabinet terminal distribution and junction box wiring",
      "Commercial building automated lighting and junction splicing"
    ],
    sellers: [
      { name: "Amazon India", price: 1999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B00JB3U7WY" },
      { name: "IndustryBuying", price: 2250, availability: "In Stock, Box of 50", url: "https://www.industrybuying.com/wago-221-413-box" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.wago.com/in/installation-terminal-blocks-and-connectors/compact-splicing-connector/p/221-413" }
    ]
  }
];

module.exports = { PRODUCTS_PART3 };
