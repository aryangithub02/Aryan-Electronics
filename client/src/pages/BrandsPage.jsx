import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Search,
  Store,
  Building2,
  Truck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { POPULAR_SELLERS, POPULAR_BRANDS } from '../data/sellersAndBrands';

export const BrandsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'sellers' | 'brands'
  const [sortBy, setSortBy] = useState('products'); // 'products' | 'rating' | 'name'

  // Filter sellers
  const filteredSellers = useMemo(() => {
    let list = POPULAR_SELLERS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.specialties.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });

    if (sortBy === 'products') {
      list.sort((a, b) => b.productCount - a.productCount);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchTerm, sortBy]);

  // Filter brands
  const filteredBrands = useMemo(() => {
    let list = POPULAR_BRANDS.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });

    if (sortBy === 'products') {
      list.sort((a, b) => b.productCount - a.productCount);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchTerm, sortBy]);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-16">
      {/* 1. Page Header */}
      <div className="bg-[#090e1a] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400 font-medium">Brands & Sellers</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-mono font-semibold">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Merchant Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Brands & Verified Sellers Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Aryan Electronics indexes authentic electronics from leading global hardware manufacturers and verified regional merchants. Explore merchant ratings, fulfillment terms, and direct inventory.
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">11+</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Verified Sellers</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">18+</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Top Hardware Brands</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">680+</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Live Aggregated Products</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Genuine Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* 2. Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search seller or brand name..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400 font-sans"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'all'
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Directory ({POPULAR_SELLERS.length + POPULAR_BRANDS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('sellers')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'sellers'
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Sellers ({POPULAR_SELLERS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('brands')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'brands'
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Brands ({POPULAR_BRANDS.length})</span>
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto md:ml-2">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
                >
                  <option value="products">Most Products</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Verified Sellers Section */}
        {(filterType === 'all' || filterType === 'sellers') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-600" />
                  <span>Verified Sellers & Merchant Partners</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Top marketplace platforms, authorized retail distributors, and official brand stores.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                {filteredSellers.length} Sellers Available
              </span>
            </div>

            {filteredSellers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <p>No sellers match "{searchTerm}". Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Brand Logo & Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 flex items-center group-hover:scale-105 transition-transform origin-left">
                          {seller.logo()}
                        </div>
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{seller.rating}</span>
                          <span className="text-[10px] text-amber-600 font-medium">★</span>
                        </div>
                      </div>

                      {/* Seller Title & Verification Badge */}
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {seller.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${seller.badgeColor}`}>
                          {seller.badge}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {seller.tagline}
                      </p>

                      {/* Specialties Pill Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {seller.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Key Fulfillment Terms */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span className="font-medium text-slate-700">{seller.fulfillment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{seller.policy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {seller.productCount} Products
                      </span>
                      <Link
                        to={`/products?seller=${encodeURIComponent(seller.name)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs group-hover:shadow-md"
                      >
                        <span>Browse Inventory</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. Leading Hardware Brands Section */}
        {(filterType === 'all' || filterType === 'brands') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Leading Hardware Manufacturers</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Direct brand catalog containing computers, robotics, lab instruments, displays, and smart gadgets.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                {filteredBrands.length} Brands
              </span>
            </div>

            {filteredBrands.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <p>No brands match "{searchTerm}". Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {filteredBrands.map((brand) => (
                  <Link
                    key={brand.name}
                    to={`/products?brand=${encodeURIComponent(brand.name)}`}
                    className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center group hover:-translate-y-0.5 min-h-[140px]"
                  >
                    <div className="h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {brand.render()}
                    </div>

                    <div className="mt-2">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {brand.category}
                      </p>
                    </div>

                    <div className="mt-2 w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {brand.productCount} items
                      </span>
                      <span className="text-blue-600 font-semibold group-hover:underline inline-flex items-center gap-0.5 text-[10px]">
                        Explore <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 5. Trust & Multi-Seller Architecture Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>How Aryan Electronics Aggregation Works</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Our aggregation engine scans certified merchants across India in real time. We match identical manufacturer part numbers (MPNs), compare live pricing, assess delivery timelines, and verify seller trustworthiness so you always secure authentic electronics at optimal value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-900">1. Verified Invoicing</p>
              <p className="text-slate-500">Every partner issues official GST invoices backing manufacturer warranties.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900">2. Transparent Pricing</p>
              <p className="text-slate-500">No hidden markup — comparison cards present raw merchant prices and shipping fees.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900">3. Multi-Sector Reach</p>
              <p className="text-slate-500">From consumer MacBooks to Siemens industrial automation and STEM robotics kits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
