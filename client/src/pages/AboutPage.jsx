import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Globe,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Database,
  Search,
  Sparkles,
  Building2,
  Store,
  GraduationCap,
  HeartPulse,
  Sprout,
  Home,
  Wrench,
  Car,
  Briefcase,
  Gamepad2,
  ChevronRight
} from 'lucide-react';
import AryanLogo from '../components/common/AryanLogo';

export const AboutPage = () => {
  const corePillars = [
    {
      icon: Database,
      iconBg: 'bg-blue-600/10 text-blue-600',
      title: 'Unified Hardware Aggregation',
      description:
        'Instead of hopping between fragmented consumer portals, industrial distributors, and maker stores, Aryan Electronics unifies 680+ verified products and 15+ world-class manufacturers under one roof.'
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-600/10 text-amber-600',
      title: 'Real-Time Price Intelligence',
      description:
        'We continuously monitor and cross-reference live pricing from verified merchants including Amazon India, Croma, IndustryBuying, and RS Components to guarantee you never overpay.'
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-emerald-600/10 text-emerald-600',
      title: '100% Verified Authentic Merchants',
      description:
        'Zero gray-market goods or cloned modules. Every merchant on our network is vetted for active GST compliance, authorized distributorships, and official manufacturer warranty coverage.'
    },
    {
      icon: Cpu,
      iconBg: 'bg-purple-600/10 text-purple-600',
      title: 'Spec-First Technical Matrix',
      description:
        'Our comparison matrix goes deeper than superficial marketing copy. We evaluate clock speeds, sensor accuracies, bus bandwidths, thermal envelopes, and interface compatibility.'
    }
  ];

  const aggregationSteps = [
    {
      step: '01',
      title: 'Multi-Source Ingestion',
      description: 'Crawlers and API feeds continuously ingest live stock and pricing across 11+ leading e-commerce platforms, official brand stores, and specialized industrial vendors.'
    },
    {
      step: '02',
      title: 'MPN & Schema Normalization',
      description: 'Our catalog engine resolves identical Manufacturer Part Numbers (MPNs) and normalizes messy vendor specifications into clean, standard technical schemas.'
    },
    {
      step: '03',
      title: 'Trust & Logistics Scoring',
      description: 'We evaluate merchant delivery reliability, past customer feedback scores, return policies, and GST-ready invoicing before recommending any seller.'
    },
    {
      step: '04',
      title: 'Unbiased Best-Deal Delivery',
      description: 'You get an objective, side-by-side comparison matrix showing exact prices, seller ratings, and express delivery timelines without sponsored distortion.'
    }
  ];

  const sectorList = [
    { name: 'Education', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-200', count: 'Laptops, STEM & Dev Boards' },
    { name: 'Healthcare', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200', count: 'Vitals, Sensors & Diagnostics' },
    { name: 'Agriculture', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', count: 'Soil Telemetry & IoT Drones' },
    { name: 'Home', icon: Home, color: 'text-amber-600 bg-amber-50 border-amber-200', count: 'Smart Lighting, Audio & Displays' },
    { name: 'Industrial', icon: Wrench, color: 'text-orange-600 bg-orange-50 border-orange-200', count: 'Siemens PLCs, Fluke & Tooling' },
    { name: 'Automotive', icon: Car, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', count: 'OBD-II Scanners & Dashcams' },
    { name: 'Office', icon: Briefcase, color: 'text-teal-600 bg-teal-50 border-teal-200', count: 'Workstations & Networking' },
    { name: 'Entertainment', icon: Gamepad2, color: 'text-purple-600 bg-purple-50 border-purple-200', count: 'Consoles, Studio Audio & VR' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-16">
      {/* 1. Hero Header */}
      <div className="bg-[#090e1a] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400 font-medium">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Pioneering Electronics Aggregation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Empowering Smarter Hardware Decisions Across India
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Aryan Electronics is a multi-sector electronics discovery, aggregation, and price comparison platform. We bring together certified regional merchants, national retail chains, and premier global manufacturers into an open, transparent catalog.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">8</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Specialized Tech Sectors</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">11+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Verified Merchant Partners</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">680+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Curated Hardware Items</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">GST & Warranty Backed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* 2. Mission & Story */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                <Award className="w-3.5 h-3.5 text-blue-600" /> Our Mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Solving the Problem of Fragmented Electronics Sourcing
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Finding the right electronic equipment used to require cross-checking dozens of retail websites, specialized industrial portals, and manufacturer spec sheets. Prices varied wildly, stock availability was erratic, and gray-market knockoffs were common.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Aryan Electronics was built to fix this. We created a centralized aggregation platform that pairs deep technical specification matching with transparent multi-merchant pricing. Whether an engineer is outfitting an industrial PLC panel, a university lab is sourcing microcontrollers, or a consumer is seeking the best price on a workstation laptop, we deliver authentic choices with speed and clarity.
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white space-y-4 border border-slate-800 shadow-md">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Our Guiding Principles</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span><strong>Zero Hidden Markups:</strong> We display actual merchant prices and clear shipping terms directly from the vendor.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span><strong>Spec Integrity:</strong> Every specification is audited against manufacturer datasheets for true compatibility.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span><strong>Reliable Merchant Standards:</strong> We only partner with sellers who provide verifiable GST invoices and official support.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. The Core Value Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose Aryan Electronics?
            </h2>
            <p className="text-sm text-slate-500">
              Designed from the ground up for speed, transparency, and deep technical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {corePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${pillar.iconBg}`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. How the Aggregation Engine Works */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Under The Hood
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How the Multi-Seller Aggregation Engine Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A high-precision pipeline connecting you to the best deals without marketing fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aggregationSteps.map((step) => (
              <div
                key={step.step}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-black font-mono text-slate-700/70">
                  {step.step}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 8 Specialized Sectors */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                8 Dedicated Technology Sectors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Targeted categories tailored for engineering, education, health, and commercial applications.
              </p>
            </div>
            <Link
              to="/sectors"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Explore All Sectors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {sectorList.map((sec) => (
              <Link
                key={sec.name}
                to={`/products?sector=${encodeURIComponent(sec.name)}`}
                className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${sec.color}`}>
                    <sec.icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sec.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {sec.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Partner Network & Verified Guarantees */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Explore Our Verified Sellers & Leading Brands
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              From Amazon India and Croma to Robu.in and RS Components India, browse the complete merchant reliability scorecard and hardware brand directory.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/brands"
              className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              Browse Brands & Sellers
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-600 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              Search Catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
