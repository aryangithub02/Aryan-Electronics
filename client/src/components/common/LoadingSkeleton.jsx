import React from 'react';

export const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/80 rounded-xl ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-4 flex flex-col space-y-4">
    <div className="w-full h-48 bg-slate-800/70 rounded-xl animate-pulse" />
    <div className="space-y-2">
      <div className="w-1/3 h-4 bg-slate-800 rounded animate-pulse" />
      <div className="w-4/5 h-6 bg-slate-850 rounded animate-pulse" />
      <div className="w-full h-3 bg-slate-800/60 rounded animate-pulse" />
    </div>
    <div className="pt-2 flex justify-between items-center">
      <div className="w-1/3 h-6 bg-slate-800 rounded animate-pulse" />
      <div className="w-1/4 h-8 bg-slate-800 rounded-lg animate-pulse" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductGridSkeleton;
