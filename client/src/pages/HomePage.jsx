import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Layers,
  Cpu,
  Smartphone,
  Home,
  Headphones,
  Factory,
  Monitor
} from 'lucide-react';
import Button from '../components/common/Button';
import ProductGrid from '../components/product/ProductGrid';
import api from '../services/api';
import { formatProductPrice } from '../utils/formatters';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const res = await api.getProducts({ limit: 4 });
        if (isMounted && res.data) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.warn('Could not load featured products:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  const sectorHighlights = [
    { name: 'Computing & Office', count: 'Laptops, Desktops & Displays', icon: Cpu, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
    { name: 'Consumer Electronics', count: 'Smartphones, Tablets & Watches', icon: Smartphone, color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
    { name: 'Displays & Projection', count: '4K Monitors & Projectors', icon: Monitor, color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30' },
    { name: 'Audio & Sound', count: 'Studio Monitors & ANC Headsets', icon: Headphones, color: 'from-cyan-500/20 to-indigo-500/20 border-cyan-500/30' },
    { name: 'Components & Development', count: 'Microcontrollers & Dev Kits', icon: Cpu, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
    { name: 'Industrial & Measurement', count: 'PLCs, Multimeters & Sensors', icon: Factory, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30' }
  ];

  const fallbackHeroProducts = [
    {
      id: 1,
      sector: 'Education & Computing',
      title: 'Acer Chromebook 314',
      price: 22299,
      discountPercentage: 38
    },
    {
      id: 2,
      sector: 'Office & Computing',
      title: 'Lenovo IdeaPad Slim 3',
      price: 70491,
      discountPercentage: 20
    },
    {
      id: 4,
      sector: 'Enterprise Notebooks',
      title: 'HP ProBook 440 G10',
      price: 85799,
      discountPercentage: 15
    }
  ];

  const heroDisplayProducts =
    featuredProducts && featuredProducts.length >= 3
      ? featuredProducts.slice(0, 3)
      : fallbackHeroProducts;

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Electronics Aggregation Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Discover, Compare & Aggregate{' '}
              <span className="gradient-text">Electronic Innovations</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Aryan Electronics unifies consumer tech, smart home devices, computing gear, and industrial automation into a single, high-fidelity discovery platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Products
                </Button>
              </Link>
              <Link to="/sectors">
                <Button variant="secondary" size="lg" icon={Layers}>
                  Browse Sectors
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl font-black text-white font-mono">5+</p>
                <p className="text-xs text-slate-400">Core Sectors</p>
              </div>
              <div>
                <p className="text-2xl font-black text-cyan-400 font-mono">100%</p>
                <p className="text-xs text-slate-400">Spec Transparency</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-400 font-mono">Real-Time</p>
                <p className="text-xs text-slate-400">Multi-Seller Aggregation</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
              <div className="relative glass-card rounded-3xl p-8 border border-slate-700/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400">Live Aggregation Pipeline</span>
                </div>

                <div className="space-y-4">
                  {heroDisplayProducts.map((item, idx) => {
                    const itemId = item.id || item._id || idx + 1;
                    return (
                      <Link
                        key={itemId}
                        to={`/products/${itemId}`}
                        className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition-colors group block"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-mono text-slate-400 truncate">{item.sector || 'Electronics'}</p>
                          <p className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-cyan-400 font-mono flex-shrink-0">
                          {formatProductPrice(item.price, item.discountPercentage)}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 text-center">
                  <Link to="/compare" className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1">
                    Try the side-by-side comparison matrix →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sector Directory Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Explore by Electronic Sector</h2>
          </div>
          <Link to="/sectors" className="text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
            View All Sectors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectorHighlights.map((sector) => {
            const Icon = sector.icon;
            return (
              <Link
                key={sector.name}
                to={`/products?sector=${encodeURIComponent(sector.name)}`}
                className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${sector.color} hover:scale-[1.02] transition-transform`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center text-white mb-3">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{sector.name}</h3>
                <p className="text-xs text-slate-400">{sector.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-400">Spotlight</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Hardware & Devices</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Multi-Seller Price Aggregation</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Consolidate pricing, real-time seller stock, and discount variations across verified merchant distributors.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Unified Technical Specs</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Consistent normalization for frequencies, digital I/O, display resolutions, battery ratings, and communication protocols.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Consumer to Enterprise Scope</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            From consumer handhelds to industrial programmable controllers, explore hardware across the entire electronics spectrum.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
