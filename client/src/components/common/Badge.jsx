import React from 'react';

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  className = ''
}) => {
  const variants = {
    brand: 'bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold',
    cyan: 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${variants[variant] || variants.brand} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
