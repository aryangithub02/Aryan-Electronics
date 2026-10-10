import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  RotateCcw,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  PackageCheck,
  Store,
  Tag,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdvancedFilterPanel = ({
  filters = {},
  onFilterChange,
  onReset,
  sectors = [],
  availableCategories = []
}) => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // Local state for price inputs
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice || '');

  // Keep price inputs in sync with parent props
  useEffect(() => {
    setMinPriceInput(filters.minPrice || '');
    setMaxPriceInput(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  // Load dynamic filter bounds from backend
  useEffect(() => {
    let isMounted = true;
    if (typeof api.getFilterOptions === 'function') {
      api.getFilterOptions()
        .then((res) => {
          if (isMounted && res.data) {
            setFilterOptions(res.data);
          }
        })
        .catch((err) => console.warn('Could not fetch filter options:', err.message));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePriceApply = () => {
    onFilterChange({
      minPrice: minPriceInput ? minPriceInput : undefined,
      maxPrice: maxPriceInput ? maxPriceInput : undefined,
      page: 1
    });
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePriceApply();
    }
  };

  const handleRatingSelect = (ratingValue) => {
    const nextRating = filters.minRating === String(ratingValue) ? '' : String(ratingValue);
    onFilterChange({ minRating: nextRating || undefined, page: 1 });
  };

  const handleAvailabilityToggle = () => {
    const nextVal = filters.availability === 'in_stock' ? '' : 'in_stock';
    onFilterChange({ availability: nextVal || undefined, page: 1 });
  };

  const handleBrandToggle = (brandName) => {
    const currentBrands = filters.brand ? filters.brand.split(',').map((b) => b.trim()) : [];
    let updated;
    if (currentBrands.includes(brandName)) {
      updated = currentBrands.filter((b) => b !== brandName);
    } else {
      updated = [...currentBrands, brandName];
    }
    onFilterChange({
      brand: updated.length > 0 ? updated.join(',') : undefined,
      page: 1
    });
  };

  const handleSellerChange = (sellerName) => {
    onFilterChange({
      seller: sellerName || undefined,
      page: 1
    });
  };

  // Check active filters count
  const activeBrands = filters.brand ? filters.brand.split(',').filter(Boolean) : [];
  const hasActiveFilters = Boolean(
    filters.sector ||
    filters.category ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.availability ||
    filters.seller ||
    activeBrands.length > 0
  );

  const displayedBrands = (filterOptions?.brands || []).filter((b) =>
    brandSearch ? b.name.toLowerCase().includes(brandSearch.toLowerCase()) : true
  );

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
      {/* Top Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            Advanced Filters & Parameters
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-900"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 sm:hidden px-2 py-1 rounded-lg bg-slate-900 border border-slate-800"
          >
            {isExpanded ? 'Hide' : 'Expand'}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter Body */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min ₹"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                onKeyDown={handlePriceKeyDown}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-1.5 px-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500 text-xs font-mono">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max ₹"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                onKeyDown={handlePriceKeyDown}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-1.5 px-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handlePriceApply}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-colors"
                title="Apply price filter"
              >
                Go
              </button>
            </div>
            {/* Quick Price Shortcuts */}
            <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput('');
                  setMaxPriceInput('2000');
                  onFilterChange({ minPrice: undefined, maxPrice: 2000, page: 1 });
                }}
                className="hover:text-cyan-300 hover:underline"
              >
                &lt;₹2k
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput('2000');
                  setMaxPriceInput('10000');
                  onFilterChange({ minPrice: 2000, maxPrice: 10000, page: 1 });
                }}
                className="hover:text-cyan-300 hover:underline"
              >
                ₹2k-₹10k
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput('50000');
                  setMaxPriceInput('');
                  onFilterChange({ minPrice: 50000, maxPrice: undefined, page: 1 });
                }}
                className="hover:text-cyan-300 hover:underline"
              >
                ₹50k+
              </button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[3.5, 4.0, 4.5].map((rate) => {
                const isSelected = filters.minRating === String(rate);
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleRatingSelect(rate)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isSelected ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{rate}+</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Switch */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
              Availability Status
            </label>
            <button
              type="button"
              onClick={handleAvailabilityToggle}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                filters.availability === 'in_stock'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${filters.availability === 'in_stock' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>In Stock Only</span>
              </div>
              {filterOptions?.availability?.inStock && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {filterOptions.availability.inStock} items
                </span>
              )}
            </button>
          </div>

          {/* Merchant / Seller Filter */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-purple-400" />
              Seller / Merchant
            </label>
            <div className="relative">
              <select
                value={filters.seller || ''}
                onChange={(e) => handleSellerChange(e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Sellers</option>
                {filterOptions?.sellers?.map((sel) => (
                  <option key={sel.name} value={sel.name}>
                    {sel.name} ({sel.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Brands Multi-Select Section */}
        {filterOptions?.brands && filterOptions.brands.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Filter by Brands ({activeBrands.length > 0 ? `${activeBrands.length} selected` : 'Multi-select'})
              </label>
              {filterOptions.brands.length > 8 && (
                <input
                  type="text"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="bg-slate-900/90 border border-slate-800 rounded-lg py-0.5 px-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-32"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto scrollbar-thin pr-1">
              {displayedBrands.slice(0, 24).map((b) => {
                const isSelected = activeBrands.includes(b.name);
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleBrandToggle(b.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-slate-500">({b.count})</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
