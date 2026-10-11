import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle2,
  TrendingDown,
  Layers,
  GraduationCap,
  HeartPulse,
  Leaf,
  Home,
  Factory,
  Car,
  Briefcase,
  Gamepad2,
  Star,
  ShoppingCart
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import BrandLogos from '../components/common/BrandLogos';
import api from '../services/api';
import { formatCurrency, calculateDiscountPrice, handleImageError } from '../utils/formatters';

export const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [todaysDeals, setTodaysDeals] = useState([]);
  const [sectorCounts, setSectorCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Exact 8 sectors from dataset
  const baseSectors = [
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      image: '/images/sectors/education.jpg',
      iconBg: 'bg-blue-600 text-white'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: HeartPulse,
      image: '/images/sectors/healthcare.jpg',
      iconBg: 'bg-red-500 text-white'
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      icon: Leaf,
      image: '/images/sectors/agriculture.jpg',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      id: 'home',
      name: 'Home',
      icon: Home,
      image: '/images/sectors/home.jpg',
      iconBg: 'bg-orange-500 text-white'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: Factory,
      image: '/images/sectors/industrial.jpg',
      iconBg: 'bg-purple-600 text-white'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: Car,
      image: '/images/sectors/automotive.jpg',
      iconBg: 'bg-sky-500 text-white'
    },
    {
      id: 'office',
      name: 'Office',
      icon: Briefcase,
      image: '/images/sectors/office.jpg',
      iconBg: 'bg-teal-600 text-white'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Gamepad2,
      image: '/images/sectors/entertainment.jpg',
      iconBg: 'bg-pink-600 text-white'
    }
  ];

  // Dynamically compute real counts from backend API
  const quickSectors = baseSectors.map((sec) => {
    const realCount = sectorCounts[sec.name.toLowerCase()];
    return {
      ...sec,
      count: realCount !== undefined ? `${realCount} Products` : 'Products'
    };
  });

  useEffect(() => {
    let isMounted = true;
    const loadRealData = async () => {
      try {
        setIsLoading(true);

        const [prodsRes, sectorsRes] = await Promise.allSettled([
          api.getProducts({ limit: 50 }),
          api.getSectors()
        ]);

        if (isMounted) {
          // Process real sector counts from DB
          if (sectorsRes.status === 'fulfilled' && sectorsRes.value?.data) {
            const counts = {};
            sectorsRes.value.data.forEach((s) => {
              if (s.name) {
                counts[s.name.toLowerCase()] = s.productCount || 0;
              }
            });
            setSectorCounts(counts);
          }

          // Process real products from DB
          if (prodsRes.status === 'fulfilled' && prodsRes.value?.data) {
            const allProducts = prodsRes.value.data;
            // Set first 5 real products directly from verified catalog
            setFeaturedProducts(allProducts.slice(0, 5));

            // Extract real top deals with actual discounts from the dataset
            const discounted = allProducts
              .filter((p) => typeof p.price === 'number' && p.discountPercentage > 0)
              .sort((a, b) => b.discountPercentage - a.discountPercentage)
              .slice(0, 3)
              .map((p) => ({
                id: p.id || p._id,
                title: p.title,
                price: calculateDiscountPrice(p.price, p.discountPercentage),
                originalPrice: p.price,
                discountPercentage: Math.round(p.discountPercentage),
                thumbnail: p.thumbnail || p.images?.[0]
              }));

            setTodaysDeals(discounted);
          }
        }
      } catch (err) {
        console.warn('Error loading real products on home:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRealData();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroSlides = [
    {
      tag: 'YOUR ONE-STOP DESTINATION FOR ELECTRONICS',
      titlePrefix: 'Discover. Compare. ',
      titleHighlight: 'Choose Better.',
      desc: 'Explore top electronics products across multiple sectors with detailed information, real prices and seller options.',
      image: '/images/hero_gadgets.jpg'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 font-sans">
      {/* 1. Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#071224] via-[#091b3b] to-[#040e21] border border-blue-900/40 shadow-2xl text-white">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Carousel Left / Right Arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0))}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center border border-white/10 backdrop-blur-sm transition-all focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev < heroSlides.length - 1 ? prev + 1 : 0))}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center border border-white/10 backdrop-blur-sm transition-all focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] sm:min-h-[420px] p-6 sm:p-10 lg:p-12 gap-8 relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Uppercase Tag */}
              <div className="inline-block text-[11px] font-bold tracking-widest text-cyan-400 uppercase font-sans">
                {heroSlides[0].tag}
              </div>

              {/* Massive Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                {heroSlides[0].titlePrefix}
                <span className="text-cyan-400">
                  {heroSlides[0].titleHighlight}
                </span>
                <span className="sr-only">Discover, Compare & Aggregate Electronic Innovations</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {heroSlides[0].desc}
              </p>

              {/* Explore Button */}
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-lg hover:shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>

              {/* Value Propositions Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-700/60 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Wide Range</p>
                    <p className="text-[10px] text-slate-400">Across 8+ Sectors</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Compare Prices</p>
                    <p className="text-[10px] text-slate-400">Multiple Sellers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Trusted Information</p>
                    <p className="text-[10px] text-slate-400">Real Products & Specs</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Find What Fits You</p>
                    <p className="text-[10px] text-slate-400">Smarter Choices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Graphic Showcase */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-lg aspect-[16/10] overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={heroSlides[0].image}
                  alt="Electronics Showcase"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            <span className="w-2.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        </div>
      </section>

      {/* 2. Horizontal Quick Sectors Bar (8 Cards matching Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {quickSectors.map((sec) => {
            const Icon = sec.icon;

            return (
              <Link
                key={sec.id}
                to={`/products?sector=${encodeURIComponent(sec.name)}`}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group"
              >
                {/* Photo Preview at Top */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={sec.image}
                    alt={sec.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                </div>

                {/* Bottom Details Strip */}
                <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${sec.iconBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                        {sec.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {sec.count}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products + Today's Deals Section (Split Column matching Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Featured Products (approx 9 cols / 75%) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                  Featured Products
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Handpicked products from across all sectors
                </p>
              </div>
              <Link
                to="/products"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 5-Column Grid of Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          </div>

          {/* Right Column: Today's Deals (approx 3 cols / 25%) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-sm tracking-tight">Today's Deals</h3>
                </div>
                <Link
                  to="/products?deals=true"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Deals List */}
              <div className="divide-y divide-slate-100">
                {todaysDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/products/${deal.id}`}
                    className="py-3 flex items-center gap-3 group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors block"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={deal.thumbnail}
                        alt={deal.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        onError={handleImageError}
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {deal.title}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(deal.price)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(deal.originalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Red Discount Badge */}
                    <span className="bg-[#e02424] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0">
                      {deal.discountPercentage}% OFF
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandLogos />
      </section>

      {/* 5. Bottom Promo Banners (3 Cards matching Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1: Laptops */}
          <div className="bg-gradient-to-br from-[#f5eeff] to-[#eedcff] border border-purple-200/80 rounded-2xl p-6 flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Laptops for Every Need
                </h3>
                <p className="text-xs text-purple-700 font-medium mt-0.5">
                  Study, Work, Gaming
                </p>
              </div>
              <Link
                to="/products?category=laptop"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-700 group-hover:underline"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="w-32 h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/promos/laptops.jpg"
                alt="Laptops promo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Banner 2: Smart Home Devices */}
          <div className="bg-gradient-to-br from-[#e8faf4] to-[#d3f4e9] border border-emerald-200/80 rounded-2xl p-6 flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Smart Home Devices
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Make Your Home Smarter
                </p>
              </div>
              <Link
                to="/products?sector=Home"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 hover:text-emerald-800 group-hover:underline"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="w-32 h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/promos/smarthome.jpg"
                alt="Smart Home promo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Banner 3: Gaming Essentials */}
          <div className="bg-gradient-to-br from-[#fff2ea] to-[#ffe2d1] border border-orange-200/80 rounded-2xl p-6 flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Gaming Essentials
                </h3>
                <p className="text-xs text-orange-800 font-medium mt-0.5">
                  Level Up Your Experience
                </p>
              </div>
              <Link
                to="/products?sector=Entertainment"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-950 hover:text-orange-800 group-hover:underline"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="w-32 h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/promos/gaming.jpg"
                alt="Gaming promo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
