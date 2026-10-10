import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, Layers, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency, handleImageError } from '../../utils/formatters';

export const SearchAutocomplete = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search products, brands, specs, or SKU...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({
    suggestions: [],
    categories: [],
    brands: [],
    instantProducts: [],
    correctedQuery: null
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced fetch of suggestions
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions({
        suggestions: [],
        categories: [],
        brands: [],
        instantProducts: [],
        correctedQuery: null
      });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        if (typeof api.getSearchSuggestions === 'function') {
          const res = await api.getSearchSuggestions(value.trim());
          if (res && res.data) {
            setSuggestions(res.data);
            const hasAny =
              (res.data.suggestions && res.data.suggestions.length > 0) ||
              (res.data.categories && res.data.categories.length > 0) ||
              (res.data.brands && res.data.brands.length > 0) ||
              (res.data.instantProducts && res.data.instantProducts.length > 0) ||
              res.data.correctedQuery;
            setIsOpen(Boolean(hasAny));
          }
        }
      } catch (err) {
        // fail silently for suggestions
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectQuery = (queryText) => {
    if (onChange) onChange(queryText);
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(queryText);
    } else {
      navigate(`/products?search=${encodeURIComponent(queryText)}`);
    }
  };

  const handleSelectCategory = (category) => {
    setIsOpen(false);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleSelectBrand = (brand) => {
    setIsOpen(false);
    navigate(`/products?brand=${encodeURIComponent(brand)}`);
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    navigate(`/products/${product.id || product._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (isOpen && suggestions.correctedQuery && selectedIndex === -1 && value.toLowerCase() !== suggestions.correctedQuery.toLowerCase()) {
        // Allow enter to proceed
      }
      setIsOpen(false);
      if (onSubmit) onSubmit(value);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => {
            if (value && value.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-2 pl-10 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange && onChange('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden max-h-[420px] overflow-y-auto divide-y divide-slate-800/80 font-sans">
          {/* Spelling Correction / Did you mean */}
          {suggestions.correctedQuery &&
            suggestions.correctedQuery.toLowerCase() !== value.toLowerCase().trim() && (
              <div className="p-3 bg-cyan-950/30 border-b border-cyan-800/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>
                    Did you mean:{' '}
                    <button
                      type="button"
                      onClick={() => handleSelectQuery(suggestions.correctedQuery)}
                      className="font-bold underline hover:text-white text-cyan-200"
                    >
                      "{suggestions.correctedQuery}"
                    </button>
                    ?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectQuery(suggestions.correctedQuery)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all"
                >
                  Search this
                </button>
              </div>
            )}

          {/* Quick Query Suggestions */}
          {suggestions.suggestions && suggestions.suggestions.length > 0 && (
            <div className="p-2 space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2.5 py-1 block">
                Suggested Queries
              </span>
              {suggestions.suggestions.map((queryText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuery(queryText)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-900/80 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                    <span>{queryText}</span>
                  </div>
                  <CornerDownLeft className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Categories & Brands Row */}
          {((suggestions.categories && suggestions.categories.length > 0) ||
            (suggestions.brands && suggestions.brands.length > 0)) && (
            <div className="p-3 bg-slate-900/40 space-y-2">
              {suggestions.categories && suggestions.categories.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
                    Matching Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.categories.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-brand-400" />
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.brands && suggestions.brands.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
                    Matching Brands
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.brands.map((b, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectBrand(b)}
                        className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Layers className="w-3 h-3 text-cyan-400" />
                        <span>{b}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instant Product Matches */}
          {suggestions.instantProducts && suggestions.instantProducts.length > 0 && (
            <div className="p-2 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2.5 py-1 block">
                Direct Hardware Matches
              </span>
              {suggestions.instantProducts.map((prod) => (
                <button
                  key={prod.id || prod._id}
                  type="button"
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-900/90 flex items-center gap-3 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900 p-1 flex-shrink-0 border border-slate-800">
                    <img
                      src={prod.thumbnail || prod.images?.[0]}
                      alt={prod.title}
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
                      {prod.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{prod.brand}</span>
                      {prod.price && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">
                            {formatCurrency(prod.price)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
