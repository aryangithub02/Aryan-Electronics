import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Cpu, Smartphone, Home, Headphones, Factory, Sparkles, Monitor, Activity } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

export const SectorsPage = () => {
  const [sectors, setSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sector icons and thematic metadata for all real & legacy sectors
  const sectorMeta = {
    'Computing & Office': {
      icon: Cpu,
      gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      border: 'border-blue-500/30',
      description: 'Laptops, enterprise workstations, desktop computers, high-volume laser printers, and office electronics.'
    },
    'Computing & Gaming': {
      icon: Cpu,
      gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      border: 'border-blue-500/30',
      description: 'High-performance laptops, desktop workstations, GPUs, ultra-wide monitors, and specialized workstation computing hardware.'
    },
    'Consumer Electronics': {
      icon: Smartphone,
      gradient: 'from-pink-600/20 via-rose-600/10 to-transparent',
      border: 'border-pink-500/30',
      description: 'Flagship smartphones, tablets, wearable smartwatches, handheld imaging, and commercial lifestyle electronics.'
    },
    'Displays & Projection': {
      icon: Monitor,
      gradient: 'from-purple-600/20 via-violet-600/10 to-transparent',
      border: 'border-purple-500/30',
      description: 'Commercial 4K UHD monitors, interactive whiteboards, laser projectors, and enterprise presentation systems.'
    },
    'Audio & Sound': {
      icon: Headphones,
      gradient: 'from-cyan-600/20 via-sky-600/10 to-transparent',
      border: 'border-cyan-500/30',
      description: 'Studio monitors, noise-canceling headsets, wireless audio systems, microphones, and professional sound hardware.'
    },
    'Audio & Entertainment': {
      icon: Headphones,
      gradient: 'from-cyan-600/20 via-sky-600/10 to-transparent',
      border: 'border-cyan-500/30',
      description: 'Studio-grade planar magnetic headphones, wireless spatial audio devices, DACs, and high-fidelity sound transmitters.'
    },
    'Components & Development': {
      icon: Cpu,
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      border: 'border-emerald-500/30',
      description: 'Microcontroller boards, single-board computers, sensor development kits, and prototyping electronic components.'
    },
    'Smart Home & Automation': {
      icon: Home,
      gradient: 'from-teal-600/20 via-emerald-600/10 to-transparent',
      border: 'border-teal-500/30',
      description: 'Matter & Zigbee smart home hubs, automated security devices, robotic vacuums, and environmental control systems.'
    },
    'Smart Home & IoT': {
      icon: Home,
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      border: 'border-emerald-500/30',
      description: 'Multi-protocol Matter and Zigbee gateway bridges, edge automation hubs, security sensors, and smart environment orchestration.'
    },
    'Industrial & Measurement': {
      icon: Factory,
      gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent',
      border: 'border-amber-500/30',
      description: 'Programmable logic controllers, precision test instruments, thermal cameras, and robotic automation systems.'
    },
    'Industrial Electronics': {
      icon: Factory,
      gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent',
      border: 'border-amber-500/30',
      description: 'Programmable logic controllers (PLCs), opto-isolated I/O modules, DIN-rail automation systems, and industrial bus controllers.'
    },
    'Healthcare & Well-being': {
      icon: Activity,
      gradient: 'from-rose-600/20 via-red-600/10 to-transparent',
      border: 'border-rose-500/30',
      description: 'Clinical patient telemetry monitors, digital diagnostic instruments, medical electrocardiographs, and health hardware.'
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadSectors = async () => {
      try {
        setIsLoading(true);
        const res = await api.getSectors();
        if (isMounted && res.data) {
          setSectors(res.data);
        }
      } catch (err) {
        console.warn('Failed to load sectors:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadSectors();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Hardware Taxonomy & Classification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Electronics <span className="gradient-text">Sectors</span>
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Explore products aggregated across distinct electronics engineering sectors. Each sector features standardized specification normalization and multi-vendor pricing.
        </p>
      </div>

      {/* Sectors Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sector) => {
            const meta = sectorMeta[sector.name] || {
              icon: Sparkles,
              gradient: 'from-slate-800 to-transparent',
              border: 'border-slate-800',
              description: 'Aggregated electronics items in this specialized sector.'
            };
            const Icon = meta.icon;

            return (
              <div
                key={sector.name}
                className={`glass-card rounded-2xl p-8 border ${meta.border} bg-gradient-to-br ${meta.gradient} flex flex-col justify-between space-y-6 hover:shadow-glow-brand transition-all`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-900 text-brand-300 border border-slate-700">
                      {sector.productCount} {sector.productCount === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{sector.name}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  {/* Categories Pills */}
                  {sector.categories && sector.categories.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono uppercase text-slate-400">Categories Included:</span>
                      <div className="flex flex-wrap gap-2">
                        {sector.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-800 font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    to={`/products?sector=${encodeURIComponent(sector.name)}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View all {sector.name} products <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SectorsPage;
