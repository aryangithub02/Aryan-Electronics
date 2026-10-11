import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Sparkles, Building2, Store } from 'lucide-react';
import { POPULAR_SELLERS, POPULAR_BRANDS } from '../../data/sellersAndBrands';

export const BrandLogos = ({ showHeader = true }) => {
  const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' | 'brands'

  return (
    <section className="space-y-5 font-sans">
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                <Sparkles className="w-3 h-3 text-blue-600" /> Aggregator Network
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Top Verified Sellers & Leading Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Compare prices across certified retail partners, authorized distributors, and direct manufacturers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('sellers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'sellers'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Popular Sellers</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'brands'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Top Brands</span>
              </button>
            </div>

            <Link
              to="/brands"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors ml-1"
            >
              <span>Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Sellers Grid View */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {POPULAR_SELLERS.slice(0, 8).map((seller) => (
              <Link
                key={seller.id}
                to={`/products?seller=${encodeURIComponent(seller.name)}`}
                className="group relative bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Bar: Logo & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-8 flex items-center group-hover:scale-105 transition-transform origin-left">
                      {seller.logo()}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{seller.rating}</span>
                    </div>
                  </div>

                  {/* Seller Name & Verified Badge */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {seller.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" title="Verified Merchant" />
                  </div>

                  {/* Tagline / Subtitle */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {seller.tagline}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                    {seller.productCount} in Catalog
                  </span>
                  <span className="text-blue-600 font-semibold group-hover:underline inline-flex items-center gap-0.5 text-[11px]">
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>All sellers are verified for authentic manufacturer serials, valid GST invoices, and return compliance.</span>
            </span>
            <Link
              to="/brands"
              className="text-blue-600 font-bold hover:underline flex-shrink-0 ml-2"
            >
              See all sellers →
            </Link>
          </div>
        </div>
      )}

      {/* Brands Strip View */}
      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {POPULAR_BRANDS.slice(0, 16).map((brand) => (
              <Link
                key={brand.name}
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="bg-white border border-slate-200/90 rounded-xl h-20 flex flex-col items-center justify-center p-3 shadow-2xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all group text-center"
                title={`Browse ${brand.name} Products (${brand.productCount} in catalog)`}
              >
                <div className="group-hover:scale-110 transition-transform h-7 flex items-center justify-center">
                  {brand.render()}
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-600 mt-1">
                  {brand.productCount} items
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center pt-1">
            <Link
              to="/brands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>Explore all 15+ verified hardware manufacturers in the brands directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default BrandLogos;
