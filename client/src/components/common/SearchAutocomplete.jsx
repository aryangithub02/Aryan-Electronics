import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, Layers, ArrowRight, CornerDownLeft, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency, handleImageError } from '../../utils/formatters';

export const SearchAutocomplete = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search for products, brands, or categories...',
  className = '',
  selectedCategory = 'All Categories',
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(selectedCategory);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  const categoriesList = [
    'All Categories',
    'Education',
    'Healthcare',
    'Agriculture',
    'Home',
    'Industrial',
    'Automotive',
    'Office',
    'Entertainment',
    'Computing & Gaming',
    'Audio & Sound'
  ];

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
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectQuery = (queryText) => {
    if (onChange) onChange(queryText);
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(queryText, category);
    } else {
      const catParam = category && category !== 'All Categories' ? `&sector=${encodeURIComponent(category)}` : '';
      navigate(`/products?search=${encodeURIComponent(queryText)}${catParam}`);
    }
  };

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    if (onCategoryChange) onCategoryChange(cat);
    setIsCategoryOpen(false);
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
      setIsOpen(false);
      if (onSubmit) {
        onSubmit(value, category);
      } else if (value.trim()) {
        const catParam = category && category !== 'All Categories' ? `&sector=${encodeURIComponent(category)}` : '';
        navigate(`/products?search=${encodeURIComponent(value.trim())}${catParam}`);
      }
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(value, category);
    } else if (value.trim()) {
      const catParam = category && category !== 'All Categories' ? `&sector=${encodeURIComponent(category)}` : '';
      navigate(`/products?search=${encodeURIComponent(value.trim())}${catParam}`);
    } else if (category && category !== 'All Categories') {
      navigate(`/products?sector=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box Matching Screenshot */}
      <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/90 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        {/* Text Input */}
        <div className="relative flex-1 flex items-center min-w-0">
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
            className="w-full bg-transparent py-2.5 pl-4 pr-8 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
          />

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange && onChange('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div ref={categoryRef} className="relative hidden sm:block border-l border-slate-200">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50/80 hover:bg-slate-100/80 transition-colors whitespace-nowrap"
          >
            <span className="max-w-[110px] truncate">{category}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isCategoryOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 max-h-60 overflow-y-auto">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    category === cat
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blue Search Button */}
        <button
          type="button"
          onClick={handleSubmitClick}
          aria-label="Submit Search"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 flex items-center justify-center transition-colors shadow-sm focus:outline-none"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto divide-y divide-slate-100 font-sans">
          {/* Spelling Correction / Did you mean */}
          {suggestions.correctedQuery &&
            suggestions.correctedQuery.toLowerCase() !== value.toLowerCase().trim() && (
              <div className="p-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-700">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  <span>
                    Did you mean:{' '}
                    <button
                      type="button"
                      onClick={() => handleSelectQuery(suggestions.correctedQuery)}
                      className="font-bold underline text-blue-600 hover:text-blue-800"
                    >
                      "{suggestions.correctedQuery}"
                    </button>
                    ?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectQuery(suggestions.correctedQuery)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all font-semibold"
                >
                  Search this
                </button>
              </div>
            )}

          {/* Quick Query Suggestions */}
          {suggestions.suggestions && suggestions.suggestions.length > 0 && (
            <div className="p-2 space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2.5 py-1 block">
                Suggested Queries
              </span>
              {suggestions.suggestions.map((queryText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuery(queryText)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:text-blue-600 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                    <span>{queryText}</span>
                  </div>
                  <CornerDownLeft className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Categories & Brands Row */}
          {((suggestions.categories && suggestions.categories.length > 0) ||
            (suggestions.brands && suggestions.brands.length > 0)) && (
            <div className="p-3 bg-slate-50/70 space-y-2">
              {suggestions.categories && suggestions.categories.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Matching Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.categories.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/products?category=${encodeURIComponent(cat)}`);
                        }}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Tag className="w-3 h-3 text-blue-500" />
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.brands && suggestions.brands.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Matching Brands
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.brands.map((b, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectBrand(b)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Layers className="w-3 h-3 text-blue-500" />
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
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2.5 py-1 block">
                Direct Hardware Matches
              </span>
              {suggestions.instantProducts.map((prod) => (
                <button
                  key={prod.id || prod._id}
                  type="button"
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 p-1 flex-shrink-0 border border-slate-200 flex items-center justify-center">
                    <img
                      src={prod.thumbnail || prod.images?.[0]}
                      alt={prod.title}
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                      {prod.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{prod.brand}</span>
                      {prod.price && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-bold">
                            {formatCurrency(prod.price)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
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
