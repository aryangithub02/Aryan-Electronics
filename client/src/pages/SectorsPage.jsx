import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  HeartPulse,
  Leaf,
  Home,
  Factory,
  Car,
  Briefcase,
  Gamepad2,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

export const SectorsPage = () => {
  const [sectorsData, setSectorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sector specifications with dynamic real dataset counts
  const baseSectors = [
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      image: '/images/sectors/education.jpg',
      description: 'Laptops, tablets, projectors, interactive displays and more for modern learning environments.',
      iconBg: 'bg-blue-600 text-white',
      btnBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: HeartPulse,
      image: '/images/sectors/healthcare.jpg',
      description: 'Medical devices, diagnostic equipment, monitoring systems and electronics for better healthcare.',
      iconBg: 'bg-red-500 text-white',
      btnBg: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      icon: Leaf,
      image: '/images/sectors/agriculture.jpg',
      description: 'Drones, sensors, monitoring systems and smart devices for modern farming and agriculture.',
      iconBg: 'bg-emerald-600 text-white',
      btnBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
    },
    {
      id: 'home',
      name: 'Home',
      icon: Home,
      image: '/images/sectors/home.jpg',
      description: 'Smart home devices, home appliances, TVs, audio systems and electronics for everyday living.',
      iconBg: 'bg-orange-500 text-white',
      btnBg: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: Factory,
      image: '/images/sectors/industrial.jpg',
      description: 'Automation equipment, control systems, industrial electronics and monitoring solutions.',
      iconBg: 'bg-purple-600 text-white',
      btnBg: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: Car,
      image: '/images/sectors/automotive.jpg',
      description: 'Car electronics, infotainment systems, safety devices, diagnostic tools and accessories.',
      iconBg: 'bg-sky-500 text-white',
      btnBg: 'bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100'
    },
    {
      id: 'office',
      name: 'Office',
      icon: Briefcase,
      image: '/images/sectors/office.jpg',
      description: 'Laptops, desktops, printers, monitors, networking devices and office electronics for higher productivity.',
      iconBg: 'bg-teal-600 text-white',
      btnBg: 'bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-100'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Gamepad2,
      image: '/images/sectors/entertainment.jpg',
      description: 'Gaming consoles, TVs, audio systems, streaming devices and entertainment electronics.',
      iconBg: 'bg-pink-600 text-white',
      btnBg: 'bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-100'
    }
  ];

  const sectorsConfig = baseSectors.map((sec) => {
    const found = sectorsData.find(
      (s) => (s.name || '').toLowerCase() === sec.name.toLowerCase()
    );
    return {
      ...sec,
      count: found ? `${found.productCount} Products` : 'Products'
    };
  });

  useEffect(() => {
    let isMounted = true;
    const loadSectors = async () => {
      try {
        setIsLoading(true);
        const res = await api.getSectors();
        if (isMounted && res.data) {
          setSectorsData(res.data);
        }
      } catch (err) {
        console.warn('Could not load sectors:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadSectors();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* Header Centered matching Screenshot 2 */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore by Sector
          <span className="sr-only">Electronics Sectors</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          Discover electronics products tailored for your needs across different sectors
        </p>
      </div>

      {/* 8 Sector Cards Grid (4 columns on lg, 2 on sm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sectorsConfig.map((sector) => {
          const Icon = sector.icon;

          return (
            <div
              key={sector.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Top: 16:9 Photography */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={sector.image}
                  alt={sector.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Badge & Title Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${sector.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {sector.name}
                      </h2>
                      <span className="text-xs text-slate-400 font-medium">
                        {sector.count}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[3rem]">
                    {sector.description}
                  </p>
                </div>

                {/* Explore Button */}
                <Link
                  to={`/products?sector=${encodeURIComponent(sector.name)}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${sector.btnBg}`}
                >
                  <span>Explore Sector</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorsPage;
