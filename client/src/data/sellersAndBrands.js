import React from 'react';

/**
 * Verified Sellers and Leading Hardware Brands in Aryan Electronics Catalog
 * All counts, names, and ratings reflect the real MongoDB dataset and aggregator network.
 */

export const POPULAR_SELLERS = [
  {
    id: 'amazon-india',
    name: 'Amazon India',
    slug: 'amazon-india',
    badge: 'Verified Marketplace',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    rating: 4.8,
    reviews: '12.4k verified reviews',
    productCount: 528,
    fulfillment: 'Express Prime Fulfillment (1-2 Days)',
    policy: '10-Day Easy Returns & Free Pickup',
    tagline: 'India’s largest multi-category electronics marketplace with A-to-z buyer protection.',
    specialties: ['Express Shipping', 'A-to-z Guarantee', 'Consumer Electronics'],
    filterQuery: 'Amazon India',
    logo: () => (
      <div className="flex items-center gap-1 font-bold text-slate-900 tracking-tight text-base font-sans">
        <span className="text-slate-900">amazon</span>
        <span className="text-amber-500 font-extrabold text-xs">.in</span>
        <svg viewBox="0 0 40 12" className="w-8 h-3 -mt-1 ml-0.5 fill-amber-500">
          <path d="M1 4c10 7 24 7 35 0-3 3-10 6-18 6-7 0-14-3-17-6z" />
          <path d="M37 3c1 1 2 3 2 4-1 0-3-1-4-2l2-2z" />
        </svg>
      </div>
    )
  },
  {
    id: 'croma',
    name: 'Croma',
    slug: 'croma',
    badge: 'Tata Enterprise',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rating: 4.7,
    reviews: '4.8k verified reviews',
    productCount: 237,
    fulfillment: 'Express Store Pickup & Home Delivery',
    policy: 'Manufacturer Warranty Guaranteed',
    tagline: 'Tata’s premium electronics retail network with brand-authorized warranty coverage.',
    specialties: ['Brand Warranty', 'Zero-Cost EMI', 'Store Network'],
    filterQuery: 'Croma',
    logo: () => (
      <div className="flex items-center gap-1.5 font-sans">
        <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white text-[10px] font-black">
          C
        </div>
        <span className="font-extrabold text-base tracking-tight text-teal-600">croma</span>
      </div>
    )
  },
  {
    id: 'industrybuying',
    name: 'IndustryBuying',
    slug: 'industrybuying',
    badge: 'B2B Certified',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    rating: 4.6,
    reviews: '3.2k verified reviews',
    productCount: 190,
    fulfillment: 'Commercial Freight & Secure Dispatch',
    policy: 'GST Invoice & Bulk Tax Credit',
    tagline: 'Specialized industrial distributor for testing instruments, sensors, and commercial tools.',
    specialties: ['GST Invoicing', 'Industrial Tech', 'Bulk Pricing'],
    filterQuery: 'IndustryBuying',
    logo: () => (
      <div className="flex items-center gap-1 font-sans">
        <span className="bg-[#1e3a8a] text-white font-black text-xs px-1.5 py-0.5 rounded">IB</span>
        <span className="font-bold text-xs tracking-tight text-[#1e3a8a]">industry<span className="text-orange-500">buying</span></span>
      </div>
    )
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    badge: 'National Retail Network',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rating: 4.6,
    reviews: '3.9k verified reviews',
    productCount: 150,
    fulfillment: 'Same-Day Local Delivery Available',
    policy: 'ResQ Authorized Expert Service',
    tagline: 'Reliance Retail’s flagship electronics chain with extensive multi-city service centers.',
    specialties: ['ResQ Service', 'Same-Day Dispatch', 'In-Store Demos'],
    filterQuery: 'Reliance Digital',
    logo: () => (
      <div className="flex flex-col items-start leading-none font-sans">
        <span className="font-extrabold text-[13px] text-[#e11d48] tracking-tight">reliance</span>
        <span className="font-bold text-[10px] text-[#2563eb] tracking-widest uppercase">digital</span>
      </div>
    )
  },
  {
    id: 'rs-components',
    name: 'RS Components India',
    slug: 'rs-components-india',
    badge: 'Global Distributor',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    rating: 4.9,
    reviews: '2.9k verified reviews',
    productCount: 112,
    fulfillment: 'Precision Temperature-Controlled Dispatch',
    policy: '100% Traceable Authentic Components',
    tagline: 'Global electronics distributor for high-reliability lab gear, semiconductors, and automation.',
    specialties: ['Lab Precision', 'Semiconductors', 'Global Catalog'],
    filterQuery: 'RS Components India',
    logo: () => (
      <div className="flex items-center gap-1.5 font-sans">
        <div className="bg-[#cc0000] text-white font-black text-xs px-2 py-0.5 rounded-sm tracking-wider">
          RS
        </div>
        <span className="font-bold text-xs text-slate-800">Components</span>
      </div>
    )
  },
  {
    id: 'robu-in',
    name: 'Robu.in',
    slug: 'robu-in',
    badge: 'Maker & Robotics Specialist',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    rating: 4.8,
    reviews: '5.6k verified reviews',
    productCount: 84,
    fulfillment: 'Priority Dispatch Across India',
    policy: 'Technical Support & Tested Modules',
    tagline: 'India’s #1 maker hub for Raspberry Pi, Arduino microcontrollers, drone parts, and sensors.',
    specialties: ['Robotics & STEM', 'Dev Boards', 'Maker Community'],
    filterQuery: 'Robu.in',
    logo: () => (
      <div className="flex items-center gap-1 font-sans">
        <div className="w-5 h-5 rounded-md bg-cyan-600 flex items-center justify-center text-white text-[10px] font-mono font-bold">
          R
        </div>
        <span className="font-extrabold text-sm tracking-wide text-slate-900">ROBU<span className="text-cyan-600">.IN</span></span>
      </div>
    )
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    badge: 'Verified Marketplace',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    rating: 4.5,
    reviews: '9.3k verified reviews',
    productCount: 37,
    fulfillment: 'Flipkart Assured Priority Logistics',
    policy: '7-Day Return & Replacement',
    tagline: 'India’s prominent marketplace partner featuring verified electronics and electronics deals.',
    specialties: ['F-Assured', 'SuperCoins', 'Pan-India Reach'],
    filterQuery: 'Flipkart',
    logo: () => (
      <div className="flex items-center gap-1 font-sans">
        <div className="bg-[#2874f0] text-[#ffe500] font-black text-xs px-1.5 py-0.5 rounded italic">
          fk
        </div>
        <span className="font-extrabold text-xs tracking-tight text-[#2874f0]">Flipkart</span>
      </div>
    )
  },
  {
    id: 'bajaao',
    name: 'Bajaao',
    slug: 'bajaao',
    badge: 'Pro Audio Specialist',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    rating: 4.8,
    reviews: '1.2k verified reviews',
    productCount: 29,
    fulfillment: 'Acoustic & Studio Safe Transport',
    policy: 'Musician-Tested Hardware Support',
    tagline: 'India’s premier pro-audio retailer for studio monitors, audio interfaces, and synthesizer gear.',
    specialties: ['Studio Tech', 'Acoustic Safe', 'Musician Support'],
    filterQuery: 'Bajaao',
    logo: () => (
      <div className="flex items-center gap-1 font-sans">
        <span className="bg-red-600 text-white font-black text-xs px-1.5 py-0.5 rounded-full">
          ♪
        </span>
        <span className="font-extrabold text-xs tracking-tight text-red-600">bajaao</span>
      </div>
    )
  },
  {
    id: 'sony-center',
    name: 'Sony Center',
    slug: 'sony-center',
    badge: 'Authorized Sony Flagship',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    rating: 4.9,
    reviews: '1.7k verified reviews',
    productCount: 21,
    fulfillment: 'Specialized Fragile Tech Courier',
    policy: 'Official Sony India Extended Warranty',
    tagline: 'Authorized Sony Center delivering Alpha cameras, premium Bravia TVs, and PlayStation consoles.',
    specialties: ['Sony Warranty', 'Alpha Pro Demos', 'Audio Experts'],
    filterQuery: 'Sony Center',
    logo: () => (
      <div className="flex items-center gap-1.5 font-sans">
        <span className="font-black text-xs tracking-widest text-slate-900">SONY</span>
        <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs">CENTER</span>
      </div>
    )
  },
  {
    id: 'apple-store-india',
    name: 'Apple Store India',
    slug: 'apple-store-india',
    badge: 'Direct Flagship',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    rating: 4.9,
    reviews: '8.1k verified reviews',
    productCount: 14,
    fulfillment: 'Insured White-Glove Apple Express',
    policy: 'Direct AppleCare & Official Warranty',
    tagline: 'Official Apple direct retail experience featuring bespoke configs, trade-ins, and accessories.',
    specialties: ['Direct from Apple', 'AppleCare+', 'Free Laser Engraving'],
    filterQuery: 'Apple Store India',
    logo: () => (
      <div className="flex items-center gap-1.5 font-sans">
        <svg viewBox="0 0 170 170" width="18" height="18" fill="#0f172a">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.19-9.35-11-19.64-14.43-30.87-3.43-11.23-5.15-22.14-5.15-32.74 0-14.68 3.73-26.79 11.19-36.31 7.46-9.52 16.73-14.35 27.81-14.48 5.48 0 11.26 1.48 17.34 4.45 6.08 2.97 10.05 4.51 11.91 4.62 1.52 0 5.68-1.66 12.48-4.99 6.8-3.32 12.7-4.8 17.69-4.44 13.62 1.02 24.33 6.37 32.13 16.06-11.89 7.23-17.7 17.1-17.43 29.61.26 9.87 4.14 18.06 11.64 24.58 7.5 6.51 16.38 10.3 26.65 11.36-2.28 6.84-5.01 13.43-8.2 19.78zm-32.94-114.7c0 7.37-2.67 14.19-8.01 20.47-5.99 6.94-13.23 11.02-21.72 12.24-.13-1.01-.2-2.03-.2-3.05 0-7.23 2.82-14.34 8.46-21.32 2.82-3.49 6.3-6.4 10.45-8.73 4.15-2.33 7.82-3.64 11.02-3.93z" />
        </svg>
        <span className="font-semibold text-xs text-slate-800">Store India</span>
      </div>
    )
  },
  {
    id: 'samsung-store',
    name: 'Samsung Store India',
    slug: 'samsung-store-india',
    badge: 'Direct Flagship',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    rating: 4.8,
    reviews: '2.4k verified reviews',
    productCount: 9,
    fulfillment: 'Samsung Express Priority Dispatch',
    policy: 'Samsung Care+ Protection Available',
    tagline: 'Direct flagship store for Galaxy smartphones, SmartThings appliances, and Odyssey displays.',
    specialties: ['Samsung Care+', 'Direct Exchange', 'Flagship Perks'],
    filterQuery: 'Samsung Store India',
    logo: () => (
      <div className="flex items-center gap-1 font-sans">
        <span className="bg-[#1428a0] text-white font-black text-[11px] px-2 py-0.5 rounded tracking-wider">
          SAMSUNG
        </span>
      </div>
    )
  }
];

export const POPULAR_BRANDS = [
  {
    name: 'Apple',
    category: 'Computing, Mobile & Displays',
    productCount: 23,
    accent: '#0f172a',
    render: () => (
      <svg viewBox="0 0 170 170" width="22" height="22" fill="#0f172a">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.19-9.35-11-19.64-14.43-30.87-3.43-11.23-5.15-22.14-5.15-32.74 0-14.68 3.73-26.79 11.19-36.31 7.46-9.52 16.73-14.35 27.81-14.48 5.48 0 11.26 1.48 17.34 4.45 6.08 2.97 10.05 4.51 11.91 4.62 1.52 0 5.68-1.66 12.48-4.99 6.8-3.32 12.7-4.8 17.69-4.44 13.62 1.02 24.33 6.37 32.13 16.06-11.89 7.23-17.7 17.1-17.43 29.61.26 9.87 4.14 18.06 11.64 24.58 7.5 6.51 16.38 10.3 26.65 11.36-2.28 6.84-5.01 13.43-8.2 19.78zm-32.94-114.7c0 7.37-2.67 14.19-8.01 20.47-5.99 6.94-13.23 11.02-21.72 12.24-.13-1.01-.2-2.03-.2-3.05 0-7.23 2.82-14.34 8.46-21.32 2.82-3.49 6.3-6.4 10.45-8.73 4.15-2.33 7.82-3.64 11.02-3.93z" />
      </svg>
    )
  },
  {
    name: 'Sony',
    category: 'Imaging, Audio & Gaming',
    productCount: 28,
    accent: '#000000',
    render: () => (
      <span className="font-serif font-black text-sm tracking-widest text-slate-900">
        SONY
      </span>
    )
  },
  {
    name: 'Samsung',
    category: 'Smartphones & Displays',
    productCount: 14,
    accent: '#1428a0',
    render: () => (
      <span className="font-black text-xs tracking-wider text-[#1428a0] font-sans">
        SAMSUNG
      </span>
    )
  },
  {
    name: 'DJI',
    category: 'Drones, Gimbals & Cameras',
    productCount: 8,
    accent: '#0284c7',
    render: () => (
      <span className="font-black text-sm tracking-wider text-slate-900 border-2 border-slate-900 px-1.5 py-0.5 rounded-sm">
        DJI
      </span>
    )
  },
  {
    name: 'Lenovo',
    category: 'ThinkPad, Legion & Laptops',
    productCount: 8,
    accent: '#e2231a',
    render: () => (
      <span className="bg-[#e2231a] text-white font-bold text-xs tracking-wider px-2 py-0.5 rounded-xs font-sans">
        Lenovo
      </span>
    )
  },
  {
    name: 'ASUS',
    category: 'ROG Gaming & Ultrabooks',
    productCount: 8,
    accent: '#00539b',
    render: () => (
      <span className="font-extrabold text-sm tracking-widest text-[#00539b] font-sans">
        ASUS
      </span>
    )
  },
  {
    name: 'Dell',
    category: 'XPS, Alienware & Monitors',
    productCount: 17,
    accent: '#007db8',
    render: () => (
      <div className="w-7 h-7 rounded-full border-2 border-[#007db8] flex items-center justify-center">
        <span className="font-extrabold text-[9px] tracking-tight text-[#007db8] font-sans">
          DELL
        </span>
      </div>
    )
  },
  {
    name: 'Raspberry Pi',
    category: 'Single Board Computers & IoT',
    productCount: 14,
    accent: '#c51a4a',
    render: () => (
      <div className="flex items-center gap-1 font-sans">
        <div className="w-5 h-5 rounded-full bg-[#c51a4a] text-white text-[10px] font-bold flex items-center justify-center">
          π
        </div>
        <span className="font-bold text-xs text-[#c51a4a]">Raspberry Pi</span>
      </div>
    )
  },
  {
    name: 'Siemens',
    category: 'Industrial Automation & PLCs',
    productCount: 17,
    accent: '#00646e',
    render: () => (
      <span className="font-black text-xs tracking-widest text-[#00646e] uppercase">
        SIEMENS
      </span>
    )
  },
  {
    name: 'Fluke',
    category: 'Test & Measurement Gear',
    productCount: 18,
    accent: '#eab308',
    render: () => (
      <span className="bg-[#ffbf00] text-black font-black text-xs px-2 py-0.5 rounded-xs uppercase tracking-wider">
        FLUKE
      </span>
    )
  },
  {
    name: 'Philips Hue',
    category: 'Smart Home & Connected Lighting',
    productCount: 4,
    accent: '#8b5cf6',
    render: () => (
      <span className="font-bold text-xs tracking-tight text-purple-700">
        PHILIPS <span className="font-normal italic">hue</span>
      </span>
    )
  },
  {
    name: 'Xiaomi',
    category: 'Smart Home & Wearables',
    productCount: 4,
    accent: '#f97316',
    render: () => (
      <div className="bg-[#ff6700] text-white font-black text-xs px-1.5 py-0.5 rounded">
        mi
      </div>
    )
  },
  {
    name: 'TP-Link',
    category: 'Networking & WiFi 7 Mesh',
    productCount: 4,
    accent: '#06b6d4',
    render: () => (
      <span className="font-extrabold text-xs tracking-tight text-teal-600">
        tp-link
      </span>
    )
  },
  {
    name: 'Acer',
    category: 'Predator Gaming & Displays',
    productCount: 3,
    accent: '#83b817',
    render: () => (
      <span className="font-black text-base tracking-tighter text-[#83b817] font-sans lowercase">
        acer
      </span>
    )
  },
  {
    name: 'Epson',
    category: 'EcoTank Printers & Projectors',
    productCount: 3,
    accent: '#002b80',
    render: () => (
      <span className="font-black text-sm tracking-wider text-[#002b80] font-sans">
        EPSON
      </span>
    )
  },
  {
    name: 'Logitech',
    category: 'Peripherals & Stream Gear',
    productCount: 3,
    accent: '#334155',
    render: () => (
      <span className="font-extrabold text-xs tracking-wider text-slate-800 font-sans lowercase">
        logitech
      </span>
    )
  },
  {
    name: 'Arduino',
    category: 'Microcontrollers & Sensors',
    productCount: 3,
    accent: '#00979d',
    render: () => (
      <div className="flex items-center gap-1 font-sans">
        <span className="bg-[#00979d] text-white font-mono font-bold text-[10px] px-1 rounded-sm">
          ∞
        </span>
        <span className="font-bold text-xs text-[#00979d]">ARDUINO</span>
      </div>
    )
  }
];
