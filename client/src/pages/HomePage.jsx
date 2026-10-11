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
  const [isPaused, setIsPaused] = useState(false);

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

  const heroBanners = [
    {
      id: 'upgrade-tech',
      title: 'Upgrade Your Tech',
      desc: 'Discover smarter electronics for every sector',
      image: '/images/banners/banner_upgrade_tech.png',
      alt: 'Upgrade Your Tech - Discover smarter electronics for every sector',
      link: '/products'
    },
    {
      id: 'better-you',
      title: 'Electronics for a Better You',
      desc: 'Smarter living starts here with trusted brands across 8+ sectors',
      image: '/images/banners/banner_better_you.png',
      alt: 'Electronics for a Better You - Smarter Living Starts Here',
      link: '/products'
    }
  ];

  // Auto-rotate hero banners every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, heroBanners.length]);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 font-sans">
      {/* 1. Hero Banner Carousel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="sr-only">Discover, Compare & Aggregate Electronic Innovations</h1>

        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Banner Slides */}
          <div className="relative aspect-[16/7] sm:aspect-[21/8] lg:aspect-[2.85/1] w-full overflow-hidden">
            {heroBanners.map((banner, idx) => (
              <Link
                key={banner.id}
                to={banner.link}
                aria-label={banner.title}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover sm:object-fill"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
              </Link>
            ))}
          </div>

          {/* Carousel Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentSlide((prev) => (prev > 0 ? prev - 1 : heroBanners.length - 1));
            }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-105 focus:outline-none"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentSlide((prev) => (prev < heroBanners.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-105 focus:outline-none"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-7 h-2 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Value Propositions Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 sm:pt-5">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Wide Range</p>
              <p className="text-[11px] text-slate-500">Across 8+ Sectors</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Compare & Save</p>
              <p className="text-[11px] text-slate-500">Find the Best Deals</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-amber-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Trusted Products</p>
              <p className="text-[11px] text-slate-500">From Top Brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-cyan-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Smarter Choices</p>
              <p className="text-[11px] text-slate-500">Find What Fits You</p>
            </div>
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

      {/* 4. Mid-Page Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          aria-label="Electronics for a Better You - Explore Now"
          className="block relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 aspect-[16/7] sm:aspect-[21/8] lg:aspect-[2.85/1] w-full group hover:shadow-2xl transition-all"
        >
          <img
            src="/images/banners/banner_better_you.png"
            alt="Electronics for a Better You - Smarter Living Starts Here"
            className="w-full h-full object-cover sm:object-fill group-hover:scale-[1.01] transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        </Link>
      </section>

      {/* 5. Popular Brands Section */}
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
