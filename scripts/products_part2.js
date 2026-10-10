/**
 * Aryan Electronics - Catalog Products Part 2
 * Audio & Entertainment (121-140) and Smart Home & IoT (141-160)
 */

const PRODUCTS_PART2 = [
  // ==========================================
  // 2. Audio & Entertainment (20 products: 121-140)
  // ==========================================
  {
    id: 121,
    sku: "AE-AUD-PRD-121",
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "Industry-leading noise canceling with two processors and 8 microphones, Auto NC Optimizer, specially engineered 30mm carbon-fiber driver unit, and up to 30 hours of battery life.",
    price: 29990,
    discountPercentage: 14,
    rating: 4.8,
    stock: 45,
    searchQuery: "Sony WH-1000XM5 wireless headphones",
    specifications: {
      driverUnit: "30mm, dome type (CCAW Voice coil), Carbon fiber composite",
      frequencyResponse: "4 Hz - 40,000 Hz (JEITA)",
      batteryLife: "Max. 30 hours (NC ON), Max. 40 hours (NC OFF)",
      bluetoothVersion: "Bluetooth 5.2, LDAC, AAC, SBC",
      noiseCanceling: "HD Noise Canceling Processor QN1 & Integrated Processor V1, 8 microphones",
      weight: "Approx. 250 g lightweight synthetic leather"
    },
    features: [
      "Industry-leading noise cancellation optimized automatically based on wearing conditions and atmospheric pressure",
      "Crystal clear hands-free calling with 4 beamforming microphones and AI noise reduction",
      "Speak-to-Chat technology automatically pauses music when you start talking"
    ],
    useCases: [
      "Frequent flyer and long commute travel listening",
      "Quiet office focus and remote Zoom conference calls",
      "High-resolution wireless audiophile music listening"
    ],
    sellers: [
      { name: "Amazon India", price: 29990, availability: "In Stock, Prime Free One-Day Delivery", url: "https://www.amazon.in/dp/B09XS7JWHH" },
      { name: "Sony Center", price: 29990, availability: "Brand Authorized Store", url: "https://shopatsc.com/products/wh-1000xm5" },
      { name: "Croma", price: 29990, availability: "In Stock at local hub", url: "https://www.croma.com/sony-wh-1000xm5/p/259163" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sony.co.in/headphones/products/wh-1000xm5" }
    ]
  },
  {
    id: 122,
    sku: "AE-AUD-PRD-122",
    title: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "Legendary folding design featuring HD Noise Canceling Processor QN1, 40mm hybrid drivers with Liquid Crystal Polymer diaphragms, Edge-AI DSEE Extreme upscaling, and 30-hour battery life.",
    price: 22990,
    discountPercentage: 23,
    rating: 4.7,
    stock: 55,
    searchQuery: "Sony WH-1000XM4 wireless headphones",
    specifications: {
      driverUnit: "40mm, dome type (CCAW Voice coil), LCP diaphragm",
      frequencyResponse: "4 Hz - 40,000 Hz",
      batteryLife: "Up to 30 hours (NC ON), 38 hours (NC OFF)",
      bluetoothVersion: "Bluetooth 5.0, LDAC, SBC, AAC",
      design: "Foldable swivel structure with luxury hard travel case",
      weight: "254 g"
    },
    features: [
      "Multipoint connection allows effortless pairing with two Bluetooth devices at once",
      "Touch sensor controls to pause, skip tracks, and adjust volume",
      "Quick Attention mode lowers music instantly by covering the right ear cup"
    ],
    useCases: [
      "Daily office and coding work sessions",
      "Compact travel companion with foldable carrying case"
    ],
    sellers: [
      { name: "Amazon India", price: 22990, availability: "In Stock, Fulfilled by Amazon", url: "https://www.amazon.in/dp/B0863TXGM3" },
      { name: "Reliance Digital", price: 22990, availability: "Available", url: "https://www.reliancedigital.in/sony-wh-1000xm4/p/491895312" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sony.co.in/headphones/products/wh-1000xm4" }
    ]
  },
  {
    id: 123,
    sku: "AE-AUD-PRD-123",
    title: "Sony WF-1000XM5 True Wireless Noise-Canceling Earbuds",
    brand: "Sony",
    sector: "Audio & Entertainment",
    category: "In-Ear Earbuds",
    description: "Next-gen flagship true wireless earbuds featuring Dynamic Driver X, dual processors (V2 and QN2e), bone conduction sensors, and AI noise reduction.",
    price: 23990,
    discountPercentage: 17,
    rating: 4.6,
    stock: 38,
    searchQuery: "Sony WF-1000XM5 earbuds",
    specifications: {
      driverUnit: "8.4 mm Dynamic Driver X",
      processor: "Integrated Processor V2 and HD Noise Canceling Processor QN2e",
      batteryLife: "Up to 8 hours (earbuds) + 16 hours (case) = 24 hours total",
      waterResistance: "IPX4 water resistant (splashes and sweat)",
      codecs: "LDAC, LC3, AAC, SBC, Hi-Res Audio Wireless",
      weight: "Approx. 5.9 g per earbud (25% smaller than WF-1000XM4)"
    },
    features: [
      "Dynamic Driver X provides richer vocals and enhanced deeper bass details",
      "Bone conduction sensors and Deep Neural Network for crystal-clear calls",
      "Qi wireless charging and 3-minute quick charge for 60 minutes of playtime"
    ],
    useCases: [
      "Pocketable commuting, gym workouts, and jogging",
      "High-fidelity wireless music listening"
    ],
    sellers: [
      { name: "Amazon India", price: 23990, availability: "In Stock", url: "https://www.amazon.in/dp/B0C33XXS56" },
      { name: "Sony Center", price: 23990, availability: "Official Retailer", url: "https://shopatsc.com/products/wf-1000xm5" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sony.co.in/headphones/products/wf-1000xm5" }
    ]
  },
  {
    id: 124,
    sku: "AE-AUD-PRD-124",
    title: "Apple AirPods Max (Space Grey) Over-Ear Headphones",
    brand: "Apple",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "High-fidelity audio engineered with an Apple-designed 40mm dynamic driver, computational audio powered by Apple H1 chips, Active Noise Cancellation with Transparency mode, and knit mesh canopy.",
    price: 59900,
    discountPercentage: 5,
    rating: 4.8,
    stock: 20,
    searchQuery: "Apple AirPods Max Space Grey",
    specifications: {
      driver: "Apple-designed 40mm dynamic driver, dual neodymium ring magnet motor",
      chips: "Apple H1 headphone chip (one in each ear cup)",
      sensors: "Optical sensor, position sensor, case-detect sensor, accelerometer, gyroscope",
      microphones: "Nine microphones total (eight for Active Noise Cancellation)",
      battery: "Up to 20 hours listening time on a single charge with ANC enabled",
      materials: "Stainless steel frame, anodized aluminum cups, breathable knit mesh canopy"
    },
    features: [
      "Personalized Spatial Audio with dynamic head tracking for theater-like sound",
      "Computational audio combines custom acoustic design with H1 chip algorithms",
      "Digital Crown for volume control, track skip, and Siri activation"
    ],
    useCases: [
      "Cinematic Dolby Atmos movie watching in Apple ecosystem",
      "Studio-grade audio mixing and analytical listening"
    ],
    sellers: [
      { name: "Amazon India", price: 56990, availability: "In Stock", url: "https://www.amazon.in/dp/B08Q2CXYKZ" },
      { name: "Apple Store India", price: 59900, availability: "Official Store", url: "https://www.apple.com/in/shop/buy-airpods/airpods-max" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/airpods-max/" }
    ]
  },
  {
    id: 125,
    sku: "AE-AUD-PRD-125",
    title: "Apple AirPods Pro (2nd Generation, MagSafe Case USB-C)",
    brand: "Apple",
    sector: "Audio & Entertainment",
    category: "In-Ear Earbuds",
    description: "Flagship wireless earbuds featuring Apple H2 chip, up to 2x more Active Noise Cancellation, Adaptive Audio, Conversation Awareness, and MagSafe Charging Case (USB-C) with Precision Finding.",
    price: 24900,
    discountPercentage: 8,
    rating: 4.9,
    stock: 50,
    searchQuery: "Apple AirPods Pro 2 USB-C",
    specifications: {
      chip: "Apple H2 headphone chip in earbuds, Apple U1 chip in charging case",
      audioTechnology: "Custom high-excursion Apple driver, custom high dynamic range amplifier",
      batteryLife: "Up to 6 hours (ANC on); up to 30 hours with MagSafe Charging Case",
      connectivity: "Bluetooth 5.3, USB-C, MagSafe, Apple Watch charger compatible",
      durability: "IP54 dust, sweat, and water resistant for both earbuds and case"
    },
    features: [
      "Adaptive Audio dynamically blends Transparency and Active Noise Cancellation",
      "Conversation Awareness automatically lowers media volume when you speak",
      "Built-in speaker on case plays sound for Find My tracking"
    ],
    useCases: [
      "Daily iPhone companion for music, phone calls, and workouts",
      "Immersive spatial audio listening during travel and gym sessions"
    ],
    sellers: [
      { name: "Amazon India", price: 22990, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B0CHWRXH8B" },
      { name: "Apple Store India", price: 24900, availability: "Official Warranty", url: "https://www.apple.com/in/airpods-pro/" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/airpods-pro/" }
    ]
  },
  {
    id: 126,
    sku: "AE-AUD-PRD-126",
    title: "Apple AirPods (3rd Generation with Lightning Charging Case)",
    brand: "Apple",
    sector: "Audio & Entertainment",
    category: "In-Ear Earbuds",
    description: "All-new contoured design with force sensor controls, Personalized Spatial Audio with dynamic head tracking, adaptive EQ, and sweat and water resistance.",
    price: 19900,
    discountPercentage: 10,
    rating: 4.6,
    stock: 40,
    searchQuery: "Apple AirPods 3rd generation",
    specifications: {
      chip: "Apple H1 headphone chip",
      batteryLife: "Up to 6 hours listening time (up to 30 hours with case)",
      sweatResistance: "IPX4 sweat and water resistant",
      connectivity: "Bluetooth 5.0, Lightning connector",
      weight: "4.28 g per earbud"
    },
    features: [
      "Adaptive EQ automatically tunes music to the shape of your ear",
      "Force sensor on the stem makes controlling music and calls effortless",
      "Fast charging gives 1 hour of listening time in just 5 minutes"
    ],
    useCases: [
      "All-day comfortable open-ear style listening without silicone ear tips",
      "Hands-free voice calls and Siri assistant commands"
    ],
    sellers: [
      { name: "Amazon India", price: 17990, availability: "In Stock", url: "https://www.amazon.in/dp/B09JQMJHXY" },
      { name: "Croma", price: 18490, availability: "In Stock", url: "https://www.croma.com/apple-airpods-3rd-gen/p/244312" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/airpods-3rd-gen/" }
    ]
  },
  {
    id: 127,
    sku: "AE-AUD-PRD-127",
    title: "Bose QuietComfort 45 Wireless Noise-Cancelling Headphones",
    brand: "Bose",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "Iconic comfort and legendary silence. Features TriPort acoustic architecture, Quiet and Aware modes, volume-optimized Active EQ, and 24 hours of wireless battery life.",
    price: 26900,
    discountPercentage: 15,
    rating: 4.7,
    stock: 30,
    searchQuery: "Bose QuietComfort 45 headphones",
    specifications: {
      batteryLife: "Up to 24 hours per charge; 15-minute quick charge yields 2.5 hours",
      bluetooth: "Bluetooth 5.1 with 9-meter range",
      connectivity: "USB-C charging, 3.5mm backup audio cable included",
      dimensions: "18.4 x 15.2 x 7.6 cm; weight: 240 g",
      microphones: "Six microphones total (four beamforming microphones for voice pick-up)"
    },
    features: [
      "Legendary acoustic noise canceling with Quiet Mode and Aware Mode",
      "Padded synthetic leather earcups and impact-resistant glass-filled nylon headband",
      "SimpleSync technology to pair seamlessly with Bose Smart Soundbars"
    ],
    useCases: [
      "Long-haul international flights and noisy office environments",
      "Unmatched physical comfort for all-day continuous wear"
    ],
    sellers: [
      { name: "Amazon India", price: 22900, availability: "In Stock, Prime Free Delivery", url: "https://www.amazon.in/dp/B098FKXT8L" },
      { name: "Reliance Digital", price: 24900, availability: "In Stock", url: "https://www.reliancedigital.in/bose-quietcomfort-45/p/492572102" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.boseindia.com/en_in/products/headphones/noise_cancelling_headphones/quietcomfort-headphones-45.html" }
    ]
  },
  {
    id: 128,
    sku: "AE-AUD-PRD-128",
    title: "Bose QuietComfort Ultra Wireless Headphones",
    brand: "Bose",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "Flagship wireless headphones introducing revolutionary Bose Immersive Audio spatial sound, world-class active noise cancellation, and CustomTune audio personalization.",
    price: 35900,
    discountPercentage: 11,
    rating: 4.8,
    stock: 22,
    searchQuery: "Bose QuietComfort Ultra headphones",
    specifications: {
      batteryLife: "Up to 24 hours (up to 18 hours with Immersive Audio)",
      audioTech: "Bose Immersive Audio, CustomTune technology",
      bluetooth: "Bluetooth 5.3, Snapdragon Sound certified, aptX Adaptive",
      materials: "Polished aluminum yokes, ultra-soft protein leather ear cushions",
      weight: "250 g luxury folding chassis"
    },
    features: [
      "Bose Immersive Audio creates a multi-dimensional, wider spatial soundstage",
      "CustomTune technology analyzes your unique ear canal shape to tailor audio and noise cancellation",
      "Quiet, Aware, and Immersion modes accessible via touch capacitive strip"
    ],
    useCases: [
      "Spatial acoustic music streaming and premium gaming",
      "Executive business travel and silence on demanding flights"
    ],
    sellers: [
      { name: "Amazon India", price: 31900, availability: "In Stock", url: "https://www.amazon.in/dp/B0CCZ26B5V" },
      { name: "Croma", price: 35900, availability: "Brand Warranty", url: "https://www.croma.com/bose-quietcomfort-ultra/p/302812" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.boseindia.com/en_in/products/headphones/noise_cancelling_headphones/bose-quietcomfort-ultra-headphones.html" }
    ]
  },
  {
    id: 129,
    sku: "AE-AUD-PRD-129",
    title: "Sennheiser Momentum 4 Wireless ANC Headphones",
    brand: "Sennheiser",
    sector: "Audio & Entertainment",
    category: "Over-Ear Headphones",
    description: "Audiophile-inspired wireless headphone offering an industry-shattering 60 hours of battery life, 42mm transducer system, adaptive noise cancellation, and aptX Adaptive codec support.",
    price: 24990,
    discountPercentage: 28,
    rating: 4.7,
    stock: 35,
    searchQuery: "Sennheiser Momentum 4 Wireless",
    specifications: {
      transducer: "42mm dynamic driver",
      frequencyRange: "6 Hz to 22,000 Hz",
      batteryLife: "Up to 60 hours continuous playback via Bluetooth with ANC active",
      chargingTime: "2 hours for full charge; 10 min charge provides 6 hours",
      codecs: "aptX Adaptive, aptX, AAC, SBC",
      weight: "293 g"
    },
    features: [
      "Unrivaled 60-hour battery life ensures you never run out of juice mid-journey",
      "Customizable Sound Personalization feature tailored to individual hearing",
      "Smart Pause automatically halts playback when headphones are removed"
    ],
    useCases: [
      "Week-long travel without needing a charger",
      "Audiophile high-resolution wireless streaming"
    ],
    sellers: [
      { name: "Amazon India", price: 24990, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0B6GHW1XQ" },
      { name: "HeadphoneZone", price: 24990, availability: "Authorized Dealer", url: "https://www.headphonezone.in/products/sennheiser-momentum-4-wireless" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sennheiser-hearing.com/en-IN/p/momentum-4-wireless/" }
    ]
  },
  {
    id: 130,
    sku: "AE-AUD-PRD-130",
    title: "Sennheiser HD 660S2 Open-Back Dynamic Audiophile Headphones",
    brand: "Sennheiser",
    sector: "Audio & Entertainment",
    category: "Audiophile Headphones",
    description: "Reference-grade open-back stereo headphones featuring upgraded 300-ohm aluminum voice coil transducers delivering sub-bass extension, precision imaging, and musical warmth.",
    price: 49990,
    discountPercentage: 12,
    rating: 4.9,
    stock: 15,
    searchQuery: "Sennheiser HD 660S2 headphones",
    specifications: {
      transducerPrinciple: "Dynamic, open-back acoustic design",
      frequencyResponse: "8 Hz – 41,500 Hz",
      impedance: "300 Ohms",
      soundPressureLevel: "104 dB (1 kHz / 1 Vrms)",
      cablesIncluded: "6.35mm stereo jack cable (1.8m) & 4.4mm balanced jack cable (1.8m)",
      weight: "260 g (without cable)"
    },
    features: [
      "Double sound pressure at lowest octaves for visceral sub-bass depth",
      "Plush velour earpads and lightweight headband for hours of listening fatigue-free",
      "Balanced 4.4mm Pentaconn cable included for high-end DACs and amplifiers"
    ],
    useCases: [
      "Critical studio mastering and acoustic mixing",
      "High-end audiophile vinyl and DSD lossless listening at home"
    ],
    sellers: [
      { name: "HeadphoneZone India", price: 44990, availability: "In Stock", url: "https://www.headphonezone.in/products/sennheiser-hd-660s2" },
      { name: "Amazon India", price: 49990, availability: "In Stock", url: "https://www.amazon.in/dp/B0BTQ72GL4" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sennheiser-hearing.com/en-IN/p/hd-660s2/" }
    ]
  },
  {
    id: 131,
    sku: "AE-AUD-PRD-131",
    title: "Audio-Technica ATH-M50x Professional Studio Monitor Headphones",
    brand: "Audio-Technica",
    sector: "Audio & Entertainment",
    category: "Studio Headphones",
    description: "Industry-standard monitor headphones with proprietary 45mm large-aperture drivers, rare earth magnets, copper-clad aluminum wire voice coils, and 90-degree swiveling earcups.",
    price: 12990,
    discountPercentage: 20,
    rating: 4.8,
    stock: 60,
    searchQuery: "Audio-Technica ATH-M50x headphones",
    specifications: {
      driver: "45mm Neodymium dynamic drivers",
      voiceCoil: "CCAW (Copper-clad aluminum wire)",
      frequencyResponse: "15 - 28,000 Hz",
      maximumInputPower: "1,600 mW at 1 kHz",
      impedance: "38 Ohms",
      cables: "Detachable 1.2m-3.0m coiled cable, 3.0m straight cable, 1.2m straight cable"
    },
    features: [
      "Critically acclaimed sonic performance praised by top audio engineers",
      "Circumaural design contours around the ears for excellent sound isolation in loud environments",
      "90-degree swiveling earcups for easy, one-ear monitoring"
    ],
    useCases: [
      "Studio recording, podcast tracking, and audio editing",
      "DJ performance and live sound reinforcement"
    ],
    sellers: [
      { name: "Amazon India", price: 10990, availability: "In Stock, Free Prime Delivery", url: "https://www.amazon.in/dp/B00HVLUR86" },
      { name: "Bajaao", price: 11499, availability: "Authorized Musical Retailer", url: "https://www.bajaao.com/products/audio-technica-ath-m50x" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.audio-technica.com/en-in/ath-m50x" }
    ]
  },
  {
    id: 132,
    sku: "AE-AUD-PRD-132",
    title: "Beyerdynamic DT 990 PRO Studio Headphones (250 Ohm)",
    brand: "Beyerdynamic",
    sector: "Audio & Entertainment",
    category: "Studio Headphones",
    description: "Legendary open-back diffuse-field studio headphones hand-crafted in Germany, delivering spacious soundstage, transparent highs, and robust spring steel headband construction.",
    price: 13990,
    discountPercentage: 15,
    rating: 4.7,
    stock: 25,
    searchQuery: "Beyerdynamic DT 990 PRO 250 Ohm",
    specifications: {
      transducerType: "Dynamic, open-back",
      operatingPrinciple: "Diffuse-field studio open acoustics",
      frequencyResponse: "5 - 35,000 Hz",
      nominalImpedance: "250 Ohms (requires dedicated headphone amplifier / audio interface)",
      cable: "3m coiled cable with gold plated 3.5mm jack and 6.35mm adapter",
      weight: "250 g (without cable)"
    },
    features: [
      "Extremely wide and three-dimensional soundstage due to open-back construction",
      "Soft, replaceable circumaural velour ear pads for exceptional wearing comfort",
      "Rugged German manufacturing with all parts easily replaceable"
    ],
    useCases: [
      "Mixing and mastering in professional recording control rooms",
      "Immersive PC gaming with dedicated soundcards/amps"
    ],
    sellers: [
      { name: "HeadphoneZone India", price: 12999, availability: "In Stock", url: "https://www.headphonezone.in/products/beyerdynamic-dt-990-pro" },
      { name: "Amazon India", price: 13990, availability: "In Stock", url: "https://www.amazon.in/dp/B0011UB9CQ" }
    ],
    sources: [
      { type: "official_product_page", url: "https://global.beyerdynamic.com/dt-990-pro.html" }
    ]
  },
  {
    id: 133,
    sku: "AE-AUD-PRD-133",
    title: "Shure SM7B Cardioid Dynamic Vocal Microphone",
    brand: "Shure",
    sector: "Audio & Entertainment",
    category: "Microphones & Audio Recording",
    description: "The gold standard broadcast dynamic microphone with smooth, flat, wide-range frequency response, air suspension shock isolation, and electromagnetic hum shielding.",
    price: 39999,
    discountPercentage: 10,
    rating: 4.9,
    stock: 30,
    searchQuery: "Shure SM7B microphone",
    specifications: {
      type: "Dynamic (moving coil)",
      polarPattern: "Cardioid",
      frequencyResponse: "50 Hz to 20,000 Hz",
      outputImpedance: "150 Ohms (actual: 150 Ohms at 1 kHz)",
      connector: "Three-pin professional audio (XLR), male",
      shielding: "Electromagnetic hum bucking coil eliminates broadband interference"
    },
    features: [
      "Classic cardioid polar pattern provides maximum rejection of off-axis noise",
      "Internal air suspension shock isolation eliminates mechanical noise transmission",
      "Bass roll-off and mid-range emphasis (presence boost) switches with graphic display"
    ],
    useCases: [
      "Studio podcasting, YouTube broadcasting, and live streaming",
      "Vocal recording for music production and voiceover work"
    ],
    sellers: [
      { name: "Amazon India", price: 38499, availability: "In Stock, Prime Free Delivery", url: "https://www.amazon.in/dp/B0002E4Z8M" },
      { name: "Bajaao", price: 39999, availability: "In Stock", url: "https://www.bajaao.com/products/shure-sm7b-cardioid-dynamic-vocal-microphone" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.shure.com/en-IN/products/microphones/sm7b" }
    ]
  },
  {
    id: 134,
    sku: "AE-AUD-PRD-134",
    title: "Rode Wireless GO II Dual Channel Wireless Microphone System",
    brand: "Rode",
    sector: "Audio & Entertainment",
    category: "Microphones & Audio Recording",
    description: "Ultra-compact dual-channel wireless microphone system with Series IV 2.4GHz digital transmission, onboard recording capability, and universal compatibility with cameras, mobile devices, and computers.",
    price: 26990,
    discountPercentage: 15,
    rating: 4.7,
    stock: 25,
    searchQuery: "Rode Wireless GO II microphone",
    specifications: {
      acousticPrinciple: "Pre-polarized pressure transducer",
      polarPattern: "Omnidirectional built-in broadcast condenser mic",
      frequencyRange: "50Hz – 20kHz",
      transmissionRange: "200m line of sight",
      batteryLife: "Up to 7 hours built-in rechargeable lithium-ion battery",
      storage: "Over 40 hours of onboard memory recording per transmitter"
    },
    features: [
      "Dual channel receiver allows capturing two microphones simultaneously",
      "Onboard recording acts as an uncompressed safety backup against wireless dropouts",
      "3.5mm TRS analog output and digital audio via USB-C"
    ],
    useCases: [
      "Two-person interviews, YouTube filmmaking, and documentary video shoots",
      "Mobile vlogging and TikTok high-definition live creation"
    ],
    sellers: [
      { name: "Amazon India", price: 24990, availability: "In Stock", url: "https://www.amazon.in/dp/B08XFQ6KP9" },
      { name: "Croma", price: 26990, availability: "In Stock", url: "https://www.croma.com/rode-wireless-go-ii/p/243102" }
    ],
    sources: [
      { type: "official_product_page", url: "https://rode.com/en/microphones/wireless/wirelessgoii" }
    ]
  },
  {
    id: 135,
    sku: "AE-AUD-PRD-135",
    title: "Focusrite Scarlett 2i2 4th Gen USB Audio Interface",
    brand: "Focusrite",
    sector: "Audio & Entertainment",
    category: "Audio Interfaces",
    description: "The world's best-selling audio interface completely revamped with 69dB ultra-low-noise preamps, 120dB studio-grade converters, Auto Gain, Clip Safe, and re-engineered Air mode.",
    price: 17990,
    discountPercentage: 11,
    rating: 4.8,
    stock: 35,
    searchQuery: "Focusrite Scarlett 2i2 4th Gen",
    specifications: {
      preamps: "2 ultra-low-noise 4th-Gen Scarlett mic preamps with +69dB gain range",
      converters: "24-bit / 192kHz converters from Focusrite's flagship RedNet range (120dB dynamic range)",
      inputs: "2x XLR/TRS combo inputs, 2x Hi-Z instrument inputs",
      outputs: "2x balanced 1/4\" monitor outputs, independent high-power headphone amp",
      connectivity: "USB Type-C bus-powered"
    },
    features: [
      "Auto Gain automatically sets recording levels in seconds without clipping",
      "Clip Safe monitors levels up to 96,000 times a second and adjusts gain to prevent distortion",
      "Air Mode adds analog high-end presence and rich harmonic drive"
    ],
    useCases: [
      "Home recording studio vocal and guitar tracking",
      "Podcasting, voiceover, and live streaming with professional XLR condenser mics"
    ],
    sellers: [
      { name: "Amazon India", price: 16990, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B0C3NW9T6H" },
      { name: "Bajaao", price: 17990, availability: "Official Distributor", url: "https://www.bajaao.com/products/focusrite-scarlett-2i2-4th-gen" }
    ],
    sources: [
      { type: "official_product_page", url: "https://focusrite.com/products/scarlett-2i2" }
    ]
  },
  {
    id: 136,
    sku: "AE-AUD-PRD-136",
    title: "Marshall Stanmore III Bluetooth Home Speaker",
    brand: "Marshall",
    sector: "Audio & Entertainment",
    category: "Bluetooth Speakers",
    description: "Legendary vintage rock-inspired home stereo speaker featuring a 50 Watt Class D amplifier for the woofer, two 15 Watt Class D amplifiers for the tweeters, and Placement Compensation.",
    price: 37999,
    discountPercentage: 13,
    rating: 4.7,
    stock: 20,
    searchQuery: "Marshall Stanmore III speaker",
    specifications: {
      powerAmplifiers: "One 50 Watt Class D amplifier (woofer), two 15 Watt Class D amplifiers (tweeters)",
      frequencyRange: "45–20,000 Hz",
      maxSoundLevel: "97 dB @ 1 m",
      connectivity: "Bluetooth 5.2, 3.5 mm auxiliary input, RCA input",
      controls: "Analog brass control knobs for volume, bass, and treble",
      mainsInput: "100–240 V"
    },
    features: [
      "Re-engineered with a wider soundstage and outward-angled tweeters",
      "Placement Compensation corrects for any nearby reflective surfaces",
      "Iconic vintage script logo, brass knobs, and textured vinyl wrap"
    ],
    useCases: [
      "Centerpiece living room high-fidelity music playback",
      "Connecting to vinyl turntables via analog RCA inputs"
    ],
    sellers: [
      { name: "Amazon India", price: 34999, availability: "In Stock, Prime Free Delivery", url: "https://www.amazon.in/dp/B0B2W2B215" },
      { name: "Croma", price: 37999, availability: "In Stock", url: "https://www.croma.com/marshall-stanmore-iii/p/260195" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.marshallheadphones.com/in/en/stanmore-iii.html" }
    ]
  },
  {
    id: 137,
    sku: "AE-AUD-PRD-137",
    title: "Marshall Emberton II Portable Bluetooth Speaker",
    brand: "Marshall",
    sector: "Audio & Entertainment",
    category: "Bluetooth Speakers",
    description: "Compact waterproof portable speaker delivering True Stereophonic 360-degree sound, 30+ hours of playtime on a single charge, and tough IP67 dust and water resistance.",
    price: 14999,
    discountPercentage: 15,
    rating: 4.6,
    stock: 40,
    searchQuery: "Marshall Emberton II speaker",
    specifications: {
      powerAmplifiers: "Two 10 W Class D amplifiers for the drivers",
      drivers: "Two 2\" 10 W full range drivers and two passive radiators",
      batteryPlaytime: "30+ hours; 3 hours full recharge; 20 min quick charge gives 4 hours",
      waterResistance: "IP67 dust and waterproof (submersible up to 1m for 30 min)",
      connectivity: "Bluetooth 5.1 with Stack Mode multi-speaker linking",
      weight: "0.7 kg compact portable chassis"
    },
    features: [
      "True Stereophonic multi-directional sound for an immersive 360-degree sweet spot",
      "Stack Mode allows connecting to multiple Emberton II speakers simultaneously",
      "Durable silicone exterior and solid metal grille"
    ],
    useCases: [
      "Outdoor camping, poolside parties, and beach trips",
      "Desk companion for room-filling acoustic sound"
    ],
    sellers: [
      { name: "Amazon India", price: 13999, availability: "In Stock", url: "https://www.amazon.in/dp/B0B2W3B5Q1" },
      { name: "Reliance Digital", price: 14999, availability: "In Stock", url: "https://www.reliancedigital.in/marshall-emberton-ii/p/492912450" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.marshallheadphones.com/in/en/emberton-ii.html" }
    ]
  },
  {
    id: 138,
    sku: "AE-AUD-PRD-138",
    title: "JBL Flip 6 Portable Waterproof Bluetooth Speaker",
    brand: "JBL",
    sector: "Audio & Entertainment",
    category: "Bluetooth Speakers",
    description: "Bold 2-way speaker system with racetrack-shaped woofer, separate tweeter, dual pumping passive radiators, 12 hours of playtime, and IP67 waterproof/dustproof rating.",
    price: 9999,
    discountPercentage: 20,
    rating: 4.6,
    stock: 75,
    searchQuery: "JBL Flip 6 bluetooth speaker",
    specifications: {
      outputPower: "20 W RMS for woofer, 10 W RMS for tweeter (30W Total)",
      frequencyResponse: "63 Hz - 20k Hz",
      batteryLife: "Up to 12 hours playback time",
      chargingTime: "2.5 hours via USB-C (USB-C protection system)",
      protectionRating: "IP67 waterproof and dustproof",
      connectivity: "Bluetooth 5.1 with PartyBoost pairing"
    },
    features: [
      "2-way speaker system delivers loud, crystal clear, and powerful sound with deep bass",
      "PartyBoost allows pairing two JBL PartyBoost-compatible speakers for stereo sound",
      "Can stand vertically or horizontally with bold color options"
    ],
    useCases: [
      "Outdoor sports, cycling, picnics, and shower singing",
      "Everyday casual music and podcast playback"
    ],
    sellers: [
      { name: "Amazon India", price: 8999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B09G3F12N8" },
      { name: "JBL India Official", price: 9999, availability: "Official Warranty", url: "https://in.jbl.com/FLIP-6-.html" }
    ],
    sources: [
      { type: "official_product_page", url: "https://in.jbl.com/FLIP-6-.html" }
    ]
  },
  {
    id: 139,
    sku: "AE-AUD-PRD-139",
    title: "Sonos Era 100 Smart Speaker with Voice Control",
    brand: "Sonos",
    sector: "Audio & Entertainment",
    category: "Smart Speakers",
    description: "Next-gen acoustic smart speaker featuring stereo sound separation, 25% larger woofer for deeper bass, Trueplay tuning, Wi-Fi 6, Bluetooth 5.0, and USB-C line-in.",
    price: 29999,
    discountPercentage: 10,
    rating: 4.8,
    stock: 18,
    searchQuery: "Sonos Era 100 speaker",
    specifications: {
      amplifiers: "Three Class-D digital amplifiers precision-tuned to speaker's architecture",
      tweeters: "Two angled tweeters create crisp high-frequency separation",
      midWoofer: "One midwoofer ensures faithful playback of mid-range vocal frequencies and deep bass",
      connectivity: "Wi-Fi 6 (802.11ax), Bluetooth 5.0, USB-C Line-in with adapter, Apple AirPlay 2",
      microphones: "Far-field microphone array with beamforming for voice control and Trueplay"
    },
    features: [
      "Dual angled tweeters send high frequencies left and right for detailed stereo sound",
      "Trueplay tuning analyzes room acoustics and optimizes the speaker's EQ",
      "Seamlessly groups with other Sonos multi-room speakers throughout the home"
    ],
    useCases: [
      "Whole-home synchronous audio streaming via Wi-Fi and AirPlay 2",
      "Premium stereo pair bookshelf setup in living rooms and bedrooms"
    ],
    sellers: [
      { name: "Amazon India", price: 27999, availability: "In Stock", url: "https://www.amazon.in/dp/B0BX4N1X3Q" },
      { name: "Croma", price: 29999, availability: "Authorized Retailer", url: "https://www.croma.com/sonos-era-100/p/271295" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sonos.com/en-in/shop/era-100" }
    ]
  },
  {
    id: 140,
    sku: "AE-AUD-PRD-140",
    title: "Sony HT-S20R 5.1ch Dolby Digital Soundbar with Subwoofer",
    brand: "Sony",
    sector: "Audio & Entertainment",
    category: "Soundbars & Home Theater",
    description: "Real 5.1 channel surround sound system delivering 400W total power output, external subwoofer, two compact rear satellite speakers, and Dolby Digital cinematic audio.",
    price: 17990,
    discountPercentage: 20,
    rating: 4.6,
    stock: 50,
    searchQuery: "Sony HT-S20R soundbar",
    specifications: {
      channels: "5.1 Channel real surround sound (3-ch soundbar + wired subwoofer + 2 rear speakers)",
      totalPowerOutput: "400 W total power",
      audioFormats: "Dolby Digital, Dolby Dual mono, LPCM 2ch",
      connectivity: "HDMI ARC (Audio Return Channel), Optical digital input, Analog 3.5mm, USB Type-A, Bluetooth 5.0",
      soundModes: "Auto Sound, Cinema, Music, Standard"
    },
    features: [
      "Real 5.1 channel discrete audio puts you in the center of movies and video games",
      "Single cable HDMI ARC connection to modern 4K smart TVs",
      "Dedicated Voice button enhances dialogue clarity in movies"
    ],
    useCases: [
      "Budget-friendly home cinema surround sound enhancement for 55-inch+ 4K TVs",
      "Bluetooth music streaming for home parties"
    ],
    sellers: [
      { name: "Amazon India", price: 15990, availability: "In Stock, Free Prime Delivery", url: "https://www.amazon.in/dp/B084685MT1" },
      { name: "Sony Center", price: 17990, availability: "Brand Store", url: "https://shopatsc.com/products/ht-s20r" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.sony.co.in/home-theatre-sound-bars/products/ht-s20r" }
    ]
  },

  // ==========================================
  // 3. Smart Home & IoT (20 products: 141-160)
  // ==========================================
  {
    id: 141,
    sku: "AE-SHT-PRD-141",
    title: "Amazon Echo Dot (5th Gen) Smart Speaker with Alexa",
    brand: "Amazon",
    sector: "Smart Home & IoT",
    category: "Smart Speakers",
    description: "Best-sounding Echo Dot yet featuring deeper bass, clearer vocals, built-in indoor temperature sensor, motion detection routines, and hands-free Alexa smart assistant.",
    price: 4499,
    discountPercentage: 11,
    rating: 4.6,
    stock: 90,
    searchQuery: "Amazon Echo Dot 5th Gen",
    specifications: {
      audio: "1.73\" (44 mm) front-firing speaker, High-Definition Lossless",
      connectivity: "Dual-band Wi-Fi (2.4 and 5 GHz), Bluetooth Low Energy Mesh, Matter compatible",
      sensors: "Temperature sensor, ultrasound motion detection",
      processor: "MediaTek MT8519 processor with AZ2 Neural Edge silicon",
      dimensions: "100 x 100 x 89 mm; weight: 304 g"
    },
    features: [
      "Deeper bass and vibrant audio from an all-new 1.73-inch speaker driver",
      "Built-in temperature sensor triggers routines like turning on the smart AC",
      "Tap gesture control on top to pause music or dismiss alarms"
    ],
    useCases: [
      "Voice controlling smart lights, plugs, and air conditioners",
      "Playing music from Spotify, Amazon Music, and Apple Music via voice"
    ],
    sellers: [
      { name: "Amazon India", price: 4499, availability: "In Stock, Free 1-Day Delivery", url: "https://www.amazon.in/dp/B09B8VGCR8" },
      { name: "Croma", price: 4499, availability: "Available", url: "https://www.croma.com/amazon-echo-dot-5th-gen/p/269123" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.amazon.in/dp/B09B8VGCR8" }
    ]
  },
  {
    id: 142,
    sku: "AE-SHT-PRD-142",
    title: "Amazon Echo Show 8 (2nd Gen) HD Smart Display with Alexa",
    brand: "Amazon",
    sector: "Smart Home & IoT",
    category: "Smart Displays",
    description: "8-inch HD touchscreen smart display with 13MP camera that pans and zooms automatically to keep you in frame, stereo speakers, and central smart home dashboard.",
    price: 8999,
    discountPercentage: 22,
    rating: 4.5,
    stock: 35,
    searchQuery: "Amazon Echo Show 8 2nd Gen",
    specifications: {
      display: "8.0\" touchscreen (1280 x 800 resolution)",
      camera: "13 MP camera with built-in camera shutter and auto-framing",
      speakers: "2 x 2.0\" (52 mm) neodymium speakers with passive bass radiator",
      processor: "MediaTek MT8183 octa-core processor",
      connectivity: "Dual-band 802.11a/b/g/n/ac Wi-Fi, Bluetooth A2DP"
    },
    features: [
      "13MP camera auto-frames video calls so you can move around naturally",
      "Glanceable visual dashboard for calendar, timers, news headlines, and smart devices",
      "Stream TV shows and movies from Prime Video and Netflix"
    ],
    useCases: [
      "Kitchen counter companion for recipe walkthroughs and timer management",
      "Home video intercom and drop-in surveillance check-in"
    ],
    sellers: [
      { name: "Amazon India", price: 8499, availability: "In Stock", url: "https://www.amazon.in/dp/B084TNH1TC" },
      { name: "Reliance Digital", price: 8999, availability: "In Stock", url: "https://www.reliancedigital.in/amazon-echo-show-8-2nd-gen/p/492403192" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.amazon.in/dp/B084TNH1TC" }
    ]
  },
  {
    id: 143,
    sku: "AE-SHT-PRD-143",
    title: "Amazon Echo Pop Compact Smart Speaker with Alexa",
    brand: "Amazon",
    sector: "Smart Home & IoT",
    category: "Smart Speakers",
    description: "Compact semi-sphere smart speaker designed for bedrooms and small spaces, featuring a 1.95-inch front-firing speaker and Amazon AZ2 Neural Edge processor.",
    price: 3499,
    discountPercentage: 20,
    rating: 4.4,
    stock: 80,
    searchQuery: "Amazon Echo Pop speaker",
    specifications: {
      speaker: "1.95\" (49.5 mm) front-firing directional speaker, lossless high-definition audio",
      processor: "Amazon AZ2 Neural Edge processor",
      connectivity: "Wi-Fi 802.11a/b/g/n/ac (2.4 & 5 GHz), Bluetooth, Matter controller",
      dimensions: "99 x 83 x 91 mm; weight: 196 g"
    },
    features: [
      "Directional audio perfectly fills small bedrooms, dorms, and work desks",
      "Front-facing LED light bar indicates Alexa listening status",
      "Built with 100% post-consumer recycled fabric and 80% recycled aluminum"
    ],
    useCases: [
      "Nightstand alarm clock and bedtime ambient white noise player",
      "Affordable voice assistant expansion into secondary rooms"
    ],
    sellers: [
      { name: "Amazon India", price: 2999, availability: "In Stock", url: "https://www.amazon.in/dp/B09ZXJN4B3" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.amazon.in/dp/B09ZXJN4B3" }
    ]
  },
  {
    id: 144,
    sku: "AE-SHT-PRD-144",
    title: "Google Nest Mini (2nd Gen) Smart Speaker with Google Assistant",
    brand: "Google",
    sector: "Smart Home & IoT",
    category: "Smart Speakers",
    description: "Compact smart speaker with 2x stronger bass, improved voice recognition with three far-field microphones, wall-mount design, and helpful Google Assistant AI.",
    price: 3999,
    discountPercentage: 15,
    rating: 4.5,
    stock: 60,
    searchQuery: "Google Nest Mini 2nd Gen",
    specifications: {
      speaker: "360-degree sound with 40 mm driver",
      microphones: "3 far-field microphones with Voice Match technology",
      processor: "Quad-core 64-bit ARM CPU 1.4 GHz, high-performance ML hardware engine",
      connectivity: "802.11b/g/n/ac (2.4 GHz/5 GHz) Wi-Fi, Bluetooth 5.0, Chromecast built-in",
      materials: "Durable fabric top made from 100% recycled plastic bottles"
    },
    features: [
      "Voice Match distinguishes your voice from others for personalized calendars and commutes",
      "Ultrasound sensing illuminates touch volume controls as your hand approaches",
      "Integrated wall mount screw hole for flush hanging on walls"
    ],
    useCases: [
      "Controlling Google Home compatible lights and Chromecast TVs",
      "Asking questions backed by Google Search knowledge graph"
    ],
    sellers: [
      { name: "Flipkart", price: 3499, availability: "In Stock, Fast Shipping", url: "https://www.flipkart.com/google-nest-mini-2nd-gen/p/itmd09f583f73315" },
      { name: "Reliance Digital", price: 3999, availability: "In Stock", url: "https://www.reliancedigital.in/google-nest-mini-charcoal/p/491630650" }
    ],
    sources: [
      { type: "official_product_page", url: "https://store.google.com/product/google_nest_mini" }
    ]
  },
  {
    id: 145,
    sku: "AE-SHT-PRD-145",
    title: "Apple HomePod (2nd Gen) Premium Smart Speaker",
    brand: "Apple",
    sector: "Smart Home & IoT",
    category: "Smart Speakers",
    description: "Acoustic masterpiece engineered with a high-excursion 4-inch woofer, array of 5 beamforming tweeters, S7 chip computational audio, Matter hub, and spatial audio with Dolby Atmos.",
    price: 32900,
    discountPercentage: 5,
    rating: 4.8,
    stock: 18,
    searchQuery: "Apple HomePod 2nd Gen speaker",
    specifications: {
      audioHardware: "4-inch high-excursion woofer, array of 5 horn-loaded tweeters with neodymium magnets",
      processor: "Apple S7 chip with system sensing for real-time acoustic modeling",
      smartHomeHub: "Matter-enabled, Thread border router, Apple Home hub",
      sensors: "Temperature and humidity sensor, Sound Recognition for smoke alarms, accelerometer",
      connectivity: "802.11n Wi-Fi, Bluetooth 5.0, Thread, Ultra Wideband chip"
    },
    features: [
      "Room sensing automatically tunes acoustic profile based on boundary reflections",
      "Acts as a Thread border router and central Matter home automation orchestrator",
      "Built-in temperature and humidity sensor triggers automated climate routines"
    ],
    useCases: [
      "Audiophile living room music playback with Apple Music Lossless and Spatial Audio",
      "Central local control for HomeKit and Matter smart home ecosystems"
    ],
    sellers: [
      { name: "Apple Store India", price: 32900, availability: "Official Brand Store", url: "https://www.apple.com/in/homepod-2023/" },
      { name: "Amazon India", price: 31900, availability: "In Stock", url: "https://www.amazon.in/dp/B0BSJ2G6NX" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/homepod-2023/" }
    ]
  },
  {
    id: 146,
    sku: "AE-SHT-PRD-146",
    title: "Apple HomePod mini (Space Grey) Smart Speaker",
    brand: "Apple",
    sector: "Smart Home & IoT",
    category: "Smart Speakers",
    description: "Compact 3.3-inch acoustic sphere delivering 360-degree sound, Apple S5 computational audio, Intercom announcements, and Thread smart home hub capability.",
    price: 10900,
    discountPercentage: 8,
    rating: 4.7,
    stock: 45,
    searchQuery: "Apple HomePod mini Space Grey",
    specifications: {
      driver: "Full-range driver and dual passive radiators for deep bass and crisp highs",
      acousticWaveguide: "Acoustic waveguide for a 360-degree sound field",
      processor: "Apple S5 chip with advanced computational audio modeling",
      microphones: "Four-microphone design for far-field Siri reception",
      connectivity: "802.11n Wi-Fi, Direct guest access, Bluetooth 5.0, Thread border router, UWB"
    },
    features: [
      "Touch surface on top illuminates with colorful Siri waveform animation",
      "Handoff audio seamlessly by holding iPhone close to HomePod mini",
      "Intercom feature broadcasts messages to all other HomePods in the home"
    ],
    useCases: [
      "Desk and bedroom personal smart speaker in the Apple ecosystem",
      "Affordable Thread border router for Matter smart accessories"
    ],
    sellers: [
      { name: "Apple Store India", price: 10900, availability: "In Stock", url: "https://www.apple.com/in/homepod-mini/" },
      { name: "Amazon India", price: 9990, availability: "In Stock, Free Delivery", url: "https://www.amazon.in/dp/B09JQX4512" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.apple.com/in/homepod-mini/" }
    ]
  },
  {
    id: 147,
    sku: "AE-SHT-PRD-147",
    title: "Philips Hue White and Color Ambiance E27 Smart Bulb Starter Kit",
    brand: "Philips Hue",
    sector: "Smart Home & IoT",
    category: "Smart Lighting",
    description: "Complete smart lighting kit including 3x E27 16-million color smart LED bulbs, Hue Bridge Zigbee hub, and Smart Dimmer Switch for local wireless control.",
    price: 9999,
    discountPercentage: 15,
    rating: 4.8,
    stock: 25,
    searchQuery: "Philips Hue Starter Kit E27",
    specifications: {
      colorSpectrum: "16 million colors plus warm-to-cool white light (2000K-6500K)",
      brightness: "1100 lumens per bulb (75W equivalent), 9.5W power consumption",
      communicationProtocol: "Zigbee 3.0 & Bluetooth",
      bridgeCapacity: "Supports up to 50 Hue lights and 12 accessories throughout the home",
      lifespan: "25,000 hours rated life"
    },
    features: [
      "Sync lights to movies, games, and music via Philips Hue Sync app",
      "Zigbee mesh networking ensures zero delay and works without bogging down Wi-Fi router",
      "Compatible with Apple HomeKit, Amazon Alexa, Google Home, and Matter"
    ],
    useCases: [
      "Dynamic ambient lighting scenes for home cinema and gaming rooms",
      "Circadian rhythm lighting scheduling (energizing cool white in morning, relaxed warm sunset at dusk)"
    ],
    sellers: [
      { name: "Amazon India", price: 8999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B096B3698H" },
      { name: "Philips Lighting Store", price: 9999, availability: "Official Warranty", url: "https://www.philips-hue.com/en-in/p/hue-white-and-color-ambiance-starter-kit-e27/8719514289130" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.philips-hue.com/en-in" }
    ]
  },
  {
    id: 148,
    sku: "AE-SHT-PRD-148",
    title: "TP-Link Tapo C200 Pan/Tilt Home Security Wi-Fi Camera",
    brand: "TP-Link",
    sector: "Smart Home & IoT",
    category: "Security Cameras",
    description: "High-definition 1080p pan and tilt indoor security camera with 360-degree horizontal field of view, advanced night vision up to 30 feet, motion detection, and two-way audio.",
    price: 1999,
    discountPercentage: 25,
    rating: 4.5,
    stock: 120,
    searchQuery: "TP-Link Tapo C200 security camera",
    specifications: {
      resolution: "1080p Full HD (1920 x 1080) at 15 fps",
      panTiltRange: "360° horizontal range and 114° vertical range",
      nightVision: "850 nm IR LED up to 30 ft (9 m)",
      storage: "MicroSD card slot supporting up to 512 GB (local storage without subscription)",
      audio: "Built-in microphone and speaker for two-way communication",
      connectivity: "2.4 GHz Wi-Fi"
    },
    features: [
      "Motion detection sends immediate push notifications with snapshot preview",
      "Privacy Mode physically closes the lens to safeguard personal moments",
      "Sound and light alarm triggers effects to frighten away unwanted visitors"
    ],
    useCases: [
      "Baby monitoring and nursery check-ins",
      "Pet surveillance and indoor home entrance security"
    ],
    sellers: [
      { name: "Amazon India", price: 1699, availability: "In Stock, Prime Free Delivery", url: "https://www.amazon.in/dp/B07XLML2YS" },
      { name: "Flipkart", price: 1749, availability: "In Stock", url: "https://www.flipkart.com/tp-link-tapo-c200/p/itm123456" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.tapo.com/en/product/smart-camera/tapo-c200/" }
    ]
  },
  {
    id: 149,
    sku: "AE-SHT-PRD-149",
    title: "TP-Link Tapo P110 Smart Wi-Fi Energy Monitoring Plug (16A)",
    brand: "TP-Link",
    sector: "Smart Home & IoT",
    category: "Smart Plugs",
    description: "Heavy-duty 16A smart plug with real-time power consumption monitoring, remote app control, customizable scheduling and timers, and voice control via Alexa and Google.",
    price: 1299,
    discountPercentage: 30,
    rating: 4.6,
    stock: 95,
    searchQuery: "TP-Link Tapo P110 smart plug 16A",
    specifications: {
      maximumLoad: "3680W, 16A (rated for heavy appliances like geysers and ACs)",
      voltage: "220-240 V~ 50/60 Hz",
      energyMonitoring: "Real-time power consumption (Watts), historical usage charts (kWh)",
      wirelessType: "2.4 GHz Wi-Fi, 802.11 b/g/n",
      materials: "Flame-retardant UL94-V0 PC material with safety child shutter"
    },
    features: [
      "Monitors electricity consumption in real time to calculate appliance energy costs",
      "Away Mode turns connected devices on and off at random times to simulate occupancy",
      "No hub required: connects directly to standard home 2.4GHz Wi-Fi"
    ],
    useCases: [
      "Scheduling geysers and water heaters to turn on 30 minutes before waking up",
      "Automating high-wattage window/split air conditioners and monitoring energy bills"
    ],
    sellers: [
      { name: "Amazon India", price: 999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B09JWR2LDF" },
      { name: "Croma", price: 1199, availability: "In Stock", url: "https://www.croma.com/tp-link-tapo-p110/p/264125" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.tapo.com/en/product/smart-plug/tapo-p110/" }
    ]
  },
  {
    id: 150,
    sku: "AE-SHT-PRD-150",
    title: "Aqara Smart Hub M2 Zigbee 3.0 & Matter Controller",
    brand: "Aqara",
    sector: "Smart Home & IoT",
    category: "Gateways & Hubs",
    description: "Versatile multi-protocol smart home hub equipped with 360-degree infrared transceiver, Zigbee 3.0 radio, Ethernet RJ45 port, built-in speaker, and Matter bridge compatibility.",
    price: 6499,
    discountPercentage: 12,
    rating: 4.7,
    stock: 20,
    searchQuery: "Aqara Smart Hub M2",
    specifications: {
      protocols: "Zigbee 3.0, Wi-Fi IEEE 802.11 b/g/n 2.4GHz, Bluetooth 5.0, Infrared (IR)",
      wiredConnectivity: "RJ45 Ethernet LAN port, Micro-USB 5V 1A power input",
      deviceCapacity: "Supports up to 128 Aqara Zigbee child sensors and switches",
      irRange: "360-degree infrared transmitter array",
      ecosystemCompatibility: "Matter, Apple HomeKit, Amazon Alexa, Google Assistant, IFTTT"
    },
    features: [
      "Built-in 360-degree IR transmitter allows voice controlling traditional non-smart ACs and TVs",
      "Wired Ethernet port ensures ultra-stable latency and local automation reliability",
      "Exposes all connected Zigbee sensors to Apple HomeKit and Matter platforms"
    ],
    useCases: [
      "Central gateway coordinating door sensors, motion detectors, and smart switches",
      "Bridging legacy infrared remote air conditioners into Apple HomeKit"
    ],
    sellers: [
      { name: "Amazon India", price: 5999, availability: "In Stock", url: "https://www.amazon.in/dp/B08X1S9K59" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.aqara.com/en/product/hub-m2/" }
    ]
  },
  {
    id: 151,
    sku: "AE-SHT-PRD-151",
    title: "Mi 360 Home Security Camera 2K Pro",
    brand: "Xiaomi",
    sector: "Smart Home & IoT",
    category: "Security Cameras",
    description: "Ultra-clear 2K (2304x1296) indoor camera with 3-megapixel lens, F1.4 large aperture, full-color night vision in low light, dual-mic noise reduction, and physical privacy shield.",
    price: 3999,
    discountPercentage: 15,
    rating: 4.5,
    stock: 50,
    searchQuery: "Mi 360 Home Security Camera 2K Pro",
    specifications: {
      resolution: "2K (2304 x 1296) 3MP resolution",
      aperture: "F1.4 large aperture 6P lens",
      fieldOfView: "360° horizontal panoramic view, 118° vertical view",
      wireless: "Dual-band Wi-Fi (2.4 GHz / 5 GHz), Bluetooth gateway",
      storageOptions: "MicroSD card (up to 32GB), NAS storage, free rolling cloud storage",
      nightVision: "940-nm infrared light with no visible red glow"
    },
    features: [
      "Dual-band 5GHz Wi-Fi eliminates camera lag and transmission interference",
      "One-key physical lens shielding rotates lens inside the casing for guaranteed privacy",
      "Built-in Bluetooth gateway connects to BLE temperature and humidity sensors"
    ],
    useCases: [
      "Living room and children room remote surveillance via Mi Home app",
      "Two-way voice calls with elderly parents at home"
    ],
    sellers: [
      { name: "Mi Store India", price: 3999, availability: "Official Brand Store", url: "https://store.mi.com/in/item/3211500001" },
      { name: "Amazon India", price: 3799, availability: "In Stock", url: "https://www.amazon.in/dp/B08V8YBL8W" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.mi.com/in/product/mi-360-home-security-camera-2k-pro/" }
    ]
  },
  {
    id: 152,
    sku: "AE-SHT-PRD-152",
    title: "Mi Smart LED Bulb (B22) 9W Wi-Fi Controlled",
    brand: "Xiaomi",
    sector: "Smart Home & IoT",
    category: "Smart Lighting",
    description: "Energy-efficient 9W B22 base smart LED bulb capable of 16 million colors, 810 lumens brightness, tunable white from 1700K to 6500K, and direct Wi-Fi app connection without a bridge.",
    price: 799,
    discountPercentage: 20,
    rating: 4.4,
    stock: 150,
    searchQuery: "Mi Smart LED Bulb B22 9W",
    specifications: {
      baseFitting: "B22 (standard Indian bayonet socket)",
      powerRating: "9W (equivalent to 60W incandescent)",
      luminousFlux: "810 lumens",
      colorTemperature: "1700K – 6500K tunable",
      connectivity: "Wi-Fi IEEE 802.11 b/g/n 2.4GHz",
      lifespan: "Approximately 25,000 hours"
    },
    features: [
      "No hub or bridge required; connects straight to your home Wi-Fi",
      "Voice control with Alexa and Google Assistant",
      "Sunrise and sunset automation schedules in the Mi Home app"
    ],
    useCases: [
      "Direct drop-in replacement for traditional Indian B22 incandescent bulbs",
      "Bedroom night reading and party mood lighting"
    ],
    sellers: [
      { name: "Amazon India", price: 699, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0848QZ4D6" },
      { name: "Mi Store India", price: 799, availability: "In Stock", url: "https://store.mi.com/in/item/3201400018" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.mi.com/in/product/mi-smart-led-bulb-b22/" }
    ]
  },
  {
    id: 153,
    sku: "AE-SHT-PRD-153",
    title: "Raspberry Pi 5 (8GB RAM) Single Board Computer",
    brand: "Raspberry Pi",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "Next-generation single-board computer powered by a 2.4GHz quad-core 64-bit Arm Cortex-A76 CPU, VideoCore VII GPU, dual 4Kp60 HDMI display outputs, PCIe 2.0 interface, and 8GB LPDDR4X RAM.",
    price: 8499,
    discountPercentage: 6,
    rating: 4.9,
    stock: 40,
    searchQuery: "Raspberry Pi 5 8GB",
    specifications: {
      processor: "Broadcom BCM2712 2.4GHz quad-core 64-bit Arm Cortex-A76 CPU with Cryptography extensions",
      graphics: "VideoCore VII GPU, supporting OpenGL ES 3.1, Vulkan 1.2",
      memory: "8GB LPDDR4X-4267 SDRAM",
      videoOutput: "Dual 4Kp60 HDMI display outputs with HDR support",
      expansion: "PCIe 2.0 x1 interface for fast peripherals (M.2 NVMe SSDs)",
      power: "5V/5A DC power via USB-C with Power Delivery (PD) support"
    },
    features: [
      "2-3x the CPU performance of Raspberry Pi 4 for effortless desktop and server workloads",
      "Custom RP1 southbridge silicon delivering high-speed USB 3.0 and camera throughput",
      "Onboard power button and real-time clock (RTC) battery connector"
    ],
    useCases: [
      "Home Assistant local smart home automation server",
      "Self-hosted Docker server running Pi-hole, Nextcloud, and Plex",
      "Edge AI camera machine vision processing"
    ],
    sellers: [
      { name: "Robu.in", price: 8499, availability: "Authorized Raspberry Pi Reseller India", url: "https://robu.in/product/raspberry-pi-5-8gb/" },
      { name: "Amazon India", price: 8999, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0CP2HY39C" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.raspberrypi.com/products/raspberry-pi-5/" }
    ]
  },
  {
    id: 154,
    sku: "AE-SHT-PRD-154",
    title: "Raspberry Pi 4 Model B (4GB RAM) Single Board Computer",
    brand: "Raspberry Pi",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "Popular SBC with Broadcom BCM2711 quad-core Cortex-A72 processor, 4GB LPDDR4 RAM, dual micro-HDMI 4K outputs, Gigabit Ethernet, and USB 3.0 ports.",
    price: 5499,
    discountPercentage: 8,
    rating: 4.8,
    stock: 55,
    searchQuery: "Raspberry Pi 4 Model B 4GB",
    specifications: {
      processor: "Broadcom BCM2711, Quad-core Cortex-A72 (ARM v8) 64-bit SoC @ 1.8GHz",
      memory: "4GB LPDDR4-3200 SDRAM",
      ports: "2x USB 3.0 ports, 2x USB 2.0 ports, Gigabit Ethernet, 2x micro-HDMI ports (up to 4kp60)",
      wireless: "2.4 GHz and 5.0 GHz IEEE 802.11ac wireless, Bluetooth 5.0, BLE",
      gpio: "Standard 40-pin GPIO header (fully backwards compatible with previous boards)"
    },
    features: [
      "Complete desktop computing capability in a credit-card-sized board",
      "True Gigabit Ethernet with separate throughput from USB bus",
      "Dual-monitor 4K display capability"
    ],
    useCases: [
      "IoT home gateway and Home Assistant hub",
      "Retro gaming emulation console (RetroPie)",
      "Python programming and robotics prototyping"
    ],
    sellers: [
      { name: "Robu.in", price: 5499, availability: "In Stock", url: "https://robu.in/product/raspberry-pi-4-model-b-with-4-gb-ram/" },
      { name: "Amazon India", price: 5899, availability: "In Stock", url: "https://www.amazon.in/dp/B07TC2BK1X" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/" }
    ]
  },
  {
    id: 155,
    sku: "AE-SHT-PRD-155",
    title: "Raspberry Pi Zero 2 W Ultra-Small Development Board",
    brand: "Raspberry Pi",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "Tiny 65mm x 30mm single board computer featuring a quad-core 64-bit Arm Cortex-A53 processor clocked at 1GHz, 512MB LPDDR2 SDRAM, and wireless LAN.",
    price: 1899,
    discountPercentage: 5,
    rating: 4.7,
    stock: 65,
    searchQuery: "Raspberry Pi Zero 2 W",
    specifications: {
      processor: "Broadcom BCM2710A1, quad-core 64-bit Arm Cortex-A53 CPU @ 1GHz",
      memory: "512MB LPDDR2 SDRAM",
      wireless: "2.4GHz IEEE 802.11b/g/n wireless LAN, Bluetooth 4.2, BLE",
      connectors: "Mini HDMI port, Micro USB On-The-Go (OTG) port, Micro USB power port, CSI-2 camera connector",
      dimensions: "65 mm x 30 mm x 5 mm footprint"
    },
    features: [
      "Up to 5x faster than original single-core Raspberry Pi Zero",
      "Extremely low power consumption suitable for battery-operated IoT gadgets",
      "Unpopulated 40-pin GPIO header footprint"
    ],
    useCases: [
      "Smart security doorbell or miniature spy camera",
      "Smart mirror display driver",
      "Portable Bluetooth audio streamer"
    ],
    sellers: [
      { name: "Robu.in", price: 1899, availability: "In Stock", url: "https://robu.in/product/raspberry-pi-zero-2-w/" },
      { name: "Silverline Electronics", price: 1999, availability: "Ready to Dispatch", url: "https://silverlineelectronics.in/raspberry-pi-zero-2-w" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/" }
    ]
  },
  {
    id: 156,
    sku: "AE-SHT-PRD-156",
    title: "Arduino Uno R3 Microcontroller Board",
    brand: "Arduino",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "The world's most popular electronics prototyping board based on the ATmega328P microcontroller with 14 digital I/O pins, 6 analog inputs, and 16 MHz ceramic resonator.",
    price: 2199,
    discountPercentage: 10,
    rating: 4.8,
    stock: 110,
    searchQuery: "Arduino Uno R3 board",
    specifications: {
      microcontroller: "ATmega328P 8-bit AVR RISC architecture",
      operatingVoltage: "5V (input voltage recommended: 7-12V)",
      digitalIOPins: "14 (of which 6 provide PWM output)",
      analogInputPins: "6 analog inputs (10-bit resolution)",
      flashMemory: "32 KB (ATmega328P) of which 0.5 KB used by bootloader",
      clockSpeed: "16 MHz"
    },
    features: [
      "Vast global open-source community with millions of tutorials and libraries",
      "Removable DIP package microcontroller for easy replacement if damaged",
      "Full hardware shield ecosystem compatibility"
    ],
    useCases: [
      "Introductory electronics engineering education and STEM school labs",
      "Custom sensor reading, robotics motor control, and relay switching"
    ],
    sellers: [
      { name: "Robu.in", price: 2199, availability: "Original Italian Made Arduino", url: "https://robu.in/product/original-arduino-uno-r3/" },
      { name: "Amazon India", price: 2299, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B008GRTSV6" }
    ],
    sources: [
      { type: "official_product_page", url: "https://store.arduino.cc/products/arduino-uno-rev3" }
    ]
  },
  {
    id: 157,
    sku: "AE-SHT-PRD-157",
    title: "Arduino Mega 2560 Rev3 Development Board",
    brand: "Arduino",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "High-capability microcontroller board based on the ATmega2560 with 54 digital input/output pins, 16 analog inputs, 4 hardware UART serial ports, and 256 KB flash memory.",
    price: 3999,
    discountPercentage: 8,
    rating: 4.8,
    stock: 45,
    searchQuery: "Arduino Mega 2560 Rev3",
    specifications: {
      microcontroller: "ATmega2560",
      operatingVoltage: "5V (input voltage: 7-12V)",
      digitalIOPins: "54 (of which 15 provide PWM output)",
      analogInputPins: "16 analog inputs",
      hardwareSerial: "4 hardware UART serial ports",
      flashMemory: "256 KB of which 8 KB used by bootloader, 8 KB SRAM, 4 KB EEPROM"
    },
    features: [
      "Designed for complex projects requiring numerous sensors, displays, and actuators",
      "Compatible with most shields designed for the Arduino Uno",
      "USB overcurrent protection on board"
    ],
    useCases: [
      "3D printers (RAMPS controller board base)",
      "Autonomous robotics with dozens of ultrasonic sensors and motor drivers"
    ],
    sellers: [
      { name: "Robu.in", price: 3999, availability: "In Stock, Official Arduino", url: "https://robu.in/product/original-arduino-mega-2560-r3/" },
      { name: "Amazon India", price: 4299, availability: "In Stock", url: "https://www.amazon.in/dp/B0046AMGW0" }
    ],
    sources: [
      { type: "official_product_page", url: "https://store.arduino.cc/products/arduino-mega-2560-rev3" }
    ]
  },
  {
    id: 158,
    sku: "AE-SHT-PRD-158",
    title: "Espressif ESP32-WROOM-32D Wi-Fi & BLE Development Board",
    brand: "Espressif",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "Powerful dual-core 32-bit IoT microcontroller board featuring integrated 2.4 GHz Wi-Fi, Bluetooth v4.2 BR/EDR and BLE, 4MB SPI flash, and 30 GPIO breakout pins.",
    price: 599,
    discountPercentage: 25,
    rating: 4.8,
    stock: 200,
    searchQuery: "ESP32 development board",
    specifications: {
      cpu: "Xtensa dual-core 32-bit LX6 microprocessor, operating at up to 240 MHz (up to 600 DMIPS)",
      wirelessConnectivity: "Wi-Fi: 802.11 b/g/n (up to 150 Mbps); Bluetooth: v4.2 BR/EDR and BLE specification",
      memory: "448 KB ROM, 520 KB SRAM, 4MB external SPI Flash",
      interfaces: "Capacitive touch sensors, Hall sensor, SD card interface, Ethernet, SPI, UART, I2S, I2C, PWM",
      powerConsumption: "Deep sleep mode current down to 5 µA"
    },
    features: [
      "Exceptional price-to-performance ratio for commercial and DIY IoT smart home devices",
      "Supported by ESP-IDF, Arduino IDE, MicroPython, and ESPHome firmware",
      "Integrated antenna and RF balun with low power consumption"
    ],
    useCases: [
      "ESPHome and Home Assistant custom smart sensor integrations",
      "Low-power Wi-Fi data loggers, smart relays, and weather stations"
    ],
    sellers: [
      { name: "Robu.in", price: 449, availability: "In Stock, Bulk Discounts Available", url: "https://robu.in/product/esp32-development-board/" },
      { name: "Amazon India", price: 599, availability: "In Stock, Prime", url: "https://www.amazon.in/dp/B0718T232Z" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.espressif.com/en/products/dev-kits/esp32-devkitc" }
    ]
  },
  {
    id: 159,
    sku: "AE-SHT-PRD-159",
    title: "NodeMCU ESP8266 CP2102 Wi-Fi Development Board",
    brand: "Espressif",
    sector: "Smart Home & IoT",
    category: "Development Boards & IoT",
    description: "Open-source IoT development platform based on ESP8266 Wi-Fi SoC with CP2102 USB-to-UART bridge, onboard micro-USB port, 4MB flash, and integrated PCB antenna.",
    price: 349,
    discountPercentage: 20,
    rating: 4.6,
    stock: 250,
    searchQuery: "NodeMCU ESP8266 board",
    specifications: {
      processor: "Tensilica 32-bit RISC CPU Xtensa LX106 @ 80MHz/160MHz",
      wireless: "Wi-Fi 802.11 b/g/n, WEP/WPA-PSK/WPA2-PSK",
      storage: "4MB external SPI Flash memory",
      gpio: "11 digital I/O pins, 1 analog input pin (ADC 0-3.3V range)",
      usbInterface: "CP2102 high stability USB-TTL serial converter"
    },
    features: [
      "Ultra-low cost Wi-Fi connectivity for budget DIY automation",
      "Full Arduino IDE and Lua scripting support",
      "Breadboard-friendly 30-pin DIP layout"
    ],
    useCases: [
      "Simple smart switch relays controlling tube lights and fans",
      "Wireless temperature and humidity monitoring nodes with DHT22"
    ],
    sellers: [
      { name: "Robu.in", price: 299, availability: "In Stock", url: "https://robu.in/product/nodemcu-esp8266-cp2102/" },
      { name: "Amazon India", price: 349, availability: "In Stock", url: "https://www.amazon.in/dp/B010O1G1ES" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.espressif.com/en/products/socs/esp8266" }
    ]
  },
  {
    id: 160,
    sku: "AE-SHT-PRD-160",
    title: "Ecovacs Deebot N8 2-in-1 Robot Vacuum Cleaner and Mop",
    brand: "Ecovacs",
    sector: "Smart Home & IoT",
    category: "Smart Appliances",
    description: "Intelligent robotic vacuum and mop featuring TrueMapping laser-based LiDAR navigation, 2300Pa suction power, OZMO mopping system, and multi-floor mapping.",
    price: 27900,
    discountPercentage: 35,
    rating: 4.5,
    stock: 25,
    searchQuery: "Ecovacs Deebot N8 robot vacuum",
    specifications: {
      navigation: "TrueMapping LiDAR dToF laser navigation (2x coverage and 4x precision)",
      suctionPower: "2300 Pa max suction with carpet auto-boost",
      moppingTech: "OZMO Mopping System with electronically controlled water pump",
      batteryCapacity: "3200 mAh, up to 110 minutes runtime on single charge",
      dustbinCapacity: "420 ml dustbin, 240 ml water tank",
      voiceControl: "Amazon Alexa and Google Assistant integration"
    },
    features: [
      "TrueMapping technology creates an accurate home floor map in minutes",
      "Simultaneously vacuums and mops hard floors with automatic carpet avoidance when mopping",
      "Virtual boundary zones and custom room cleaning sequences set in Ecovacs Home app"
    ],
    useCases: [
      "Automated daily dust and pet hair removal on tile and wooden floors",
      "Hands-free scheduled floor cleaning while away from home"
    ],
    sellers: [
      { name: "Amazon India", price: 24900, availability: "In Stock, Free Installation Demo", url: "https://www.amazon.in/dp/B08YRP9D6X" },
      { name: "Croma", price: 27900, availability: "In Stock", url: "https://www.croma.com/ecovacs-deebot-n8/p/251842" }
    ],
    sources: [
      { type: "official_product_page", url: "https://www.ecovacs.com/in/deebot-robotic-vacuum-cleaner/DEEBOT-N8" }
    ]
  }
];

module.exports = { PRODUCTS_PART2 };
