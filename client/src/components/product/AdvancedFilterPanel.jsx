import React, { useState, useEffect } from 'react';
import {
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

  const activeBrands = filters.brand ? filters.brand.split(',').map((b) => b.trim()).filter(Boolean) : [];

  const hasActiveFilters = Boolean(
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4 font-sans">
      {/* Top Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Advanced Filters & Parameters
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 sm:hidden px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200"
          >
            {isExpanded ? 'Hide' : 'Expand'}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter Body */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <span className="text-slate-400 text-xs font-medium">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max ₹"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                onKeyDown={handlePriceKeyDown}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={handlePriceApply}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
                title="Apply price filter"
              >
                Go
              </button>
            </div>
            {/* Quick Price Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput('');
                  setMaxPriceInput('2000');
                  onFilterChange({ minPrice: undefined, maxPrice: 2000, page: 1 });
                }}
                className="hover:text-blue-600 hover:underline"
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
                className="hover:text-blue-600 hover:underline"
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
                className="hover:text-blue-600 hover:underline"
              >
                ₹50k+
              </button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" />
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
                    className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    <span>{rate}+</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Switch */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
              Availability Status
            </label>
            <button
              type="button"
              onClick={handleAvailabilityToggle}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                filters.availability === 'in_stock'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${filters.availability === 'in_stock' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>In Stock Only</span>
              </div>
              {filterOptions?.availability?.inStock && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  {filterOptions.availability.inStock} items
                </span>
              )}
            </button>
          </div>

          {/* Merchant / Seller Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              Seller / Merchant
            </label>
            <div className="relative">
              <select
                value={filters.seller || ''}
                onChange={(e) => handleSellerChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Filter by Brands ({activeBrands.length > 0 ? `${activeBrands.length} selected` : 'Multi-select'})
              </label>
              {filterOptions.brands.length > 8 && (
                <input
                  type="text"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all w-36"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {displayedBrands.slice(0, 24).map((b) => {
                const isSelected = activeBrands.includes(b.name);
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleBrandToggle(b.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border border-blue-600 font-semibold shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border border-slate-200'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      ({b.count})
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
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
