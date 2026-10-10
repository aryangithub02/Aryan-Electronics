import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Activity, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                Aryan <span className="gradient-text">Electronics</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Unified electronics aggregation and discovery engine across consumer, industrial, IoT, and embedded computing domains.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                Multi-Seller Verification
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Real-Time Specs
              </span>
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Sectors
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products?sector=Computing" className="hover:text-cyan-400 transition-colors">
                  Computing & Gaming
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Consumer" className="hover:text-cyan-400 transition-colors">
                  Consumer Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Smart+Home" className="hover:text-cyan-400 transition-colors">
                  Smart Home & IoT
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Audio" className="hover:text-cyan-400 transition-colors">
                  Audio & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?sector=Industrial" className="hover:text-cyan-400 transition-colors">
                  Industrial & Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/sectors" className="hover:text-white transition-colors">
                  Sector Directory
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Compare Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Architecture
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Platform:</span>
                <span className="font-mono text-cyan-400 font-semibold">Active & Aggregated</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Frontend:</span>
                <span className="font-mono text-slate-300">React + Tailwind</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Backend:</span>
                <span className="font-mono text-slate-300">Node / Express</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database:</span>
                <span className="font-mono text-emerald-400">MongoDB Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Aryan Electronics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with clean scalability</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              API Diagnostics <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
