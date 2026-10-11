import React from 'react';
import { Link } from 'react-router-dom';

export const AryanLogo = ({ className = '', subtitle = true, to = '/' }) => {
  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Origami 3D Folded 'A' Emblem */}
      <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="logoAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Left angled stem */}
          <path
            d="M8 36L22 6L28 17L17 36H8Z"
            fill="url(#logoBlueGrad)"
          />
          {/* Right angled stem */}
          <path
            d="M36 36L22 6L28 17L36 36Z"
            fill="url(#logoCyanGrad)"
            opacity="0.9"
          />
          {/* Dynamic folded crossbar ribbon */}
          <path
            d="M13 27L22 21L33 27L29 32L22 26L16 32L13 27Z"
            fill="url(#logoAccentGrad)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight font-sans">
          Aryan <span className="font-extrabold text-blue-400">Electronics</span>
        </span>
        {subtitle && (
          <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-normal font-sans font-normal leading-tight">
            Discover Compare Choose Better
            <span className="sr-only">AGGREGATION ENGINE</span>
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default AryanLogo;
