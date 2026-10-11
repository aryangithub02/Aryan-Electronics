import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Truck, Headphones, RotateCcw } from 'lucide-react';
import AryanLogo from '../common/AryanLogo';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090e1a] text-slate-400 pt-16 pb-12 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Free & Fast Delivery</p>
              <p className="text-xs text-slate-400">On verified orders nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Genuine Specs</p>
              <p className="text-xs text-slate-400">Verified manufacturer data</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Multi-Seller Compare</p>
              <p className="text-xs text-slate-400">Real-time best price engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Expert Tech Support</p>
              <p className="text-xs text-slate-400">24/7 dedicated assistance</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <AryanLogo />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Aryan Electronics is your one-stop aggregation platform to discover, compare, and choose top electronics across Education, Healthcare, Agriculture, Home, Industrial, Automotive, Office, and Entertainment.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              <p>Trusted across 8+ specialized tech domains.</p>
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Sectors
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products?sector=Education" className="hover:text-blue-400 transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Healthcare" className="hover:text-blue-400 transition-colors">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Agriculture" className="hover:text-blue-400 transition-colors">
                  Agriculture
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Home" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Industrial" className="hover:text-blue-400 transition-colors">
                  Industrial
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Automotive" className="hover:text-blue-400 transition-colors">
                  Automotive
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sectors" className="hover:text-white transition-colors">
                  Explore by Sector
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Help & Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Aryan Electronics. All rights reserved.</p>
          <p className="text-slate-400">Discover. Compare. Choose Better.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
