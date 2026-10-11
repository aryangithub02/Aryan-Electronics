import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Plus,
  Trash2,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  Info,
  Tag
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  formatCurrency,
  calculateDiscountPrice,
  formatRating,
  handleImageError
} from '../utils/formatters';

export const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const {
    comparisonList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isAuthenticated
  } = useAuth();

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [notification, setNotification] = useState('');
  const [recommendationFilter, setRecommendationFilter] = useState('category'); // 'category' | 'sector'

  // Fetch full catalog (up to 250 items) so all categories and sectors are available for fair matching
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setIsLoading(true);
        const res = await api.getProducts({ limit: 250 });
        if (isMounted && res.data) {
          setAllProducts(res.data);

          // If URL param specified a product, add it to compare if not present
          const urlProdId = searchParams.get('prod');
          if (urlProdId) {
            const found = res.data.find((p) => String(p.id) === String(urlProdId));
            if (found && !comparisonList.some((p) => String(p.id || p._id) === String(urlProdId))) {
              if (comparisonList.length < 4) {
                addToCompare(found);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Compare page fetch failed:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleAddProduct = async (id) => {
    if (!id) return;
    const product = allProducts.find((p) => String(p.id) === String(id));
    if (!product) return;

    const result = await addToCompare(product);
    if (result && !result.success) {
      setNotification(result.message || 'Unable to add product.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleRemoveProduct = (id) => {
    removeFromCompare(id);
  };

  const handleClearAll = () => {
    clearCompare();
  };

  // Primary Anchor Product (the first product in the comparison matrix)
  const anchorProduct = comparisonList.length > 0 ? comparisonList[0] : null;

  // Available products for comparison (excluding those already in the matrix)
  const availableProducts = useMemo(() => {
    const activeIds = new Set(comparisonList.map((p) => String(p.id || p._id)));
    return allProducts.filter((p) => !activeIds.has(String(p.id)));
  }, [allProducts, comparisonList]);

  // Group available products by:
  // 1. Same Category (Direct Match - 100% Fair)
  // 2. Same Sector (Sector Match - Related Hardware)
  // 3. Other Sectors (Cross-Sector / Asymmetric)
  const categorizedOptions = useMemo(() => {
    if (!anchorProduct) {
      // If no anchor, group by sector
      const bySector = {};
      availableProducts.forEach((p) => {
        const sec = p.sector || 'General';
        if (!bySector[sec]) bySector[sec] = [];
        bySector[sec].push(p);
      });
      return { sameCategory: [], sameSector: [], otherSectors: availableProducts, bySector };
    }

    const anchorCat = (anchorProduct.category || '').toLowerCase().trim();
    const anchorSec = (anchorProduct.sector || '').toLowerCase().trim();

    const sameCategory = [];
    const sameSector = [];
    const otherSectors = [];

    availableProducts.forEach((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const pSec = (p.sector || '').toLowerCase().trim();

      if (pCat && pCat === anchorCat) {
        sameCategory.push(p);
      } else if (pSec && pSec === anchorSec) {
        sameSector.push(p);
      } else {
        otherSectors.push(p);
      }
    });

    return { sameCategory, sameSector, otherSectors };
  }, [anchorProduct, availableProducts]);

  // Fairness & Compatibility Analysis for current comparison matrix
  const comparisonParity = useMemo(() => {
    if (comparisonList.length < 2) return null;

    const categories = new Set(comparisonList.map((p) => (p.category || '').toLowerCase().trim()));
    const sectors = new Set(comparisonList.map((p) => (p.sector || '').toLowerCase().trim()));

    if (categories.size === 1) {
      return {
        level: 'exact_category',
        status: 'Fair & Balanced Comparison',
        badgeVariant: 'emerald',
        message: `100% Category Parity: All ${comparisonList.length} devices belong to "${comparisonList[0].category}". Hardware architectures, specifications, and use cases are directly comparable.`,
        icon: ShieldCheck
      };
    }

    if (sectors.size === 1) {
      return {
        level: 'same_sector',
        status: 'Sector Match (Sub-categories Differ)',
        badgeVariant: 'cyan',
        message: `Same Sector Comparison (${comparisonList[0].sector}): Devices share the general sector domain, but belong to distinct sub-categories (${Array.from(new Set(comparisonList.map((p) => p.category))).join(', ')}).`,
        icon: Info
      };
    }

    return {
      level: 'cross_sector',
      status: 'Asymmetric Comparison Warning',
      badgeVariant: 'amber',
      message: `Asymmetric Comparison Warning: You are comparing devices across differing sectors (${Array.from(sectors).map(s => comparisonList.find(p => p.sector.toLowerCase() === s)?.sector).join(' vs ')}). Performance metrics and hardware parameters cannot be directly correlated. We recommend comparing within "${comparisonList[0].category}".`,
      icon: AlertTriangle
    };
  }, [comparisonList]);

  // Collect all unique specification names across selected products
  const allSpecNames = useMemo(() => {
    return Array.from(
      new Set(
        comparisonList.flatMap((p) => {
          if (Array.isArray(p.specifications)) {
            return p.specifications.map((s) => s.name);
          }
          const obj =
            p.rawSpecifications ||
            (p.specifications && typeof p.specifications === 'object'
              ? p.specifications
              : null);
          if (obj) {
            return Object.keys(obj);
          }
          return [];
        })
      )
    );
  }, [comparisonList]);

  // Helper function to check if values in a row differ
  const checkRowDiffers = (values) => {
    if (values.length <= 1) return false;
    const first = values[0];
    return values.some(
      (val) => String(val).trim().toLowerCase() !== String(first).trim().toLowerCase()
    );
  };

  const priceDiffers = checkRowDiffers(
    comparisonList.map((p) => calculateDiscountPrice(p.price, p.discountPercentage))
  );
  const ratingDiffers = checkRowDiffers(comparisonList.map((p) => p.rating));
  const stockDiffers = checkRowDiffers(comparisonList.map((p) => p.stock));
  const brandDiffers = checkRowDiffers(comparisonList.map((p) => p.brand));
  const sectorDiffers = checkRowDiffers(comparisonList.map((p) => p.sector));
  const categoryDiffers = checkRowDiffers(comparisonList.map((p) => p.category));

  // Quick Recommendations list for fair comparisons
  const recommendedItems = useMemo(() => {
    if (!anchorProduct) return [];
    if (recommendationFilter === 'category' && categorizedOptions.sameCategory.length > 0) {
      return categorizedOptions.sameCategory.slice(0, 4);
    }
    if (categorizedOptions.sameSector.length > 0) {
      return categorizedOptions.sameSector.slice(0, 4);
    }
    return categorizedOptions.sameCategory.slice(0, 4);
  }, [anchorProduct, recommendationFilter, categorizedOptions]);

  // Start fair sample comparison (finds 2 items in the EXACT same category)
  const handleStartFairSample = () => {
    if (allProducts.length < 2) return;
    // Find first category with at least 2 items
    const catMap = {};
    for (const p of allProducts) {
      const c = p.category || 'General';
      if (!catMap[c]) catMap[c] = [];
      catMap[c].push(p);
      if (catMap[c].length === 2) {
        clearCompare();
        addToCompare(catMap[c][0]);
        addToCompare(catMap[c][1]);
        return;
      }
    }
    // Fallback
    clearCompare();
    addToCompare(allProducts[0]);
    addToCompare(allProducts[1]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-mono">
            <Scale className="w-3.5 h-3.5" />
            <span>Fair Hardware Specification Matrix (2–4 Devices)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Product <span className="text-blue-600">Comparison</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Compare electronic hardware side-by-side with genuine category alignment, balanced specification parity, and verified seller price tracking.
            {isAuthenticated ? ' Synchronized with your account.' : ' Guest session active.'}
          </p>
        </div>

        {/* Highlight Differences & Clear Controls */}
        {comparisonList.length >= 2 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                highlightDifferences
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-inner'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {highlightDifferences ? 'Differences Highlighted' : 'Highlight Differences'}
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-slate-900 hover:bg-rose-600/80 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-24 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fairness Parity Diagnostic Banner */}
          {comparisonParity && (
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                comparisonParity.level === 'exact_category'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : comparisonParity.level === 'same_sector'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <comparisonParity.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-white">{comparisonParity.status}</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 uppercase">
                      {comparisonParity.level.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{comparisonParity.message}</p>
                </div>
              </div>

              {comparisonParity.level === 'cross_sector' && categorizedOptions.sameCategory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    // Retain only anchor product and offer same-category additions
                    clearCompare();
                    addToCompare(anchorProduct);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs whitespace-nowrap transition-colors"
                >
                  Reset to {anchorProduct.category} Only
                </button>
              )}
            </div>
          )}

          {/* Selector & Fair Matching Bar */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Comparing ({comparisonList.length} of 4 max devices)
              </span>
              {anchorProduct && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-brand-400" />
                  Anchor: <strong className="text-cyan-400">{anchorProduct.category}</strong> ({anchorProduct.sector})
                </span>
              )}
              {comparisonList.length < 2 && comparisonList.length > 0 && (
                <span className="text-xs text-amber-400 font-mono">
                  (Add at least 1 more comparable device)
                </span>
              )}
            </div>

            {/* Smart Fair-Comparison Product Selector Dropdown */}
            {comparisonList.length < 4 && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  onChange={(e) => {
                    handleAddProduct(e.target.value);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="w-full md:w-80 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  aria-label="Add product to compare"
                >
                  <option value="" disabled>
                    + Add device (Fair Comparison: Category First)...
                  </option>

                  {/* 1. Same Category (Direct Match - Fair) */}
                  {categorizedOptions.sameCategory.length > 0 && (
                    <optgroup
                      label={`🎯 DIRECT CATEGORY MATCH — ${anchorProduct.category} (100% Fair)`}
                    >
                      {categorizedOptions.sameCategory.map((p) => (
                        <option key={p.id} value={p.id}>
                          ⭐ {p.title} ({p.brand})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* 2. Same Sector (Related Hardware) */}
                  {categorizedOptions.sameSector.length > 0 && (
                    <optgroup
                      label={`🌐 SAME SECTOR — ${anchorProduct.sector} (Related Hardware)`}
                    >
                      {categorizedOptions.sameSector.map((p) => (
                        <option key={p.id} value={p.id}>
                          • {p.title} [{p.category}]
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* 3. Other Sectors (Cross-Sector Comparison) */}
                  {categorizedOptions.otherSectors.length > 0 && (
                    <optgroup label="⚠️ OTHER SECTORS (Cross-Category Comparison)">
                      {categorizedOptions.otherSectors.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} [{p.sector}]
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Interactive Recommended Compatible Devices Shelf */}
          {anchorProduct && comparisonList.length < 4 && recommendedItems.length > 0 && (
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Fair Comparison Recommendations for "{anchorProduct.title}"
                  </h3>
                </div>

                {categorizedOptions.sameSector.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">Show:</span>
                    <button
                      type="button"
                      onClick={() => setRecommendationFilter('category')}
                      className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                        recommendationFilter === 'category'
                          ? 'bg-brand-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Same Category ({categorizedOptions.sameCategory.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommendationFilter('sector')}
                      className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                        recommendationFilter === 'sector'
                          ? 'bg-brand-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Same Sector ({categorizedOptions.sameSector.length})
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recommendedItems.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-800">
                        <img
                          src={rec.thumbnail || rec.images?.[0]}
                          alt={rec.title}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                          {rec.title}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {rec.brand} • {rec.category}
                        </p>
                        <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                          {formatCurrency(rec.price)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddProduct(rec.id)}
                      className="w-full text-xs font-mono py-1.5 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Compare
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table or Empty State */}
          {comparisonList.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No Products in Comparison Matrix"
                description="Select electronic devices from our catalog to compare their hardware architectures, price breakdowns, and seller ratings side-by-side with genuine category parity."
                actionLabel="Start Fair Sample Comparison"
                onAction={handleStartFairSample}
              />
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-x-auto border border-slate-800 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="p-4 w-48 text-xs font-mono uppercase text-slate-400 align-top">
                      Parameter
                    </th>
                    {comparisonList.map((prod) => {
                      const prodId = prod.id || prod._id;
                      return (
                        <th key={prodId} className="p-4 min-w-[240px] max-w-[280px] align-top">
                          <div className="space-y-3">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950/95 border border-slate-800 p-4 flex items-center justify-center">
                              <img
                                src={prod.thumbnail || prod.images?.[0]}
                                alt={prod.title}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                                onError={handleImageError}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(prodId)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                                title="Remove from comparison"
                                aria-label={`Remove ${prod.title} from compare`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div>
                              <div className="flex flex-wrap gap-1 mb-1.5">
                                <Badge variant="cyan" size="sm">
                                  {prod.sector}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                  {prod.category}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-white text-sm line-clamp-1">{prod.title}</h3>
                              <p className="text-xs font-mono text-slate-400">
                                {prod.brand} • {prod.SKU}
                              </p>
                            </div>
                            <Link
                              to={`/products/${prodId}`}
                              className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold"
                            >
                              View Full Specs <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                  {/* Category Row (Fairness Indicator) */}
                  <tr className={highlightDifferences && categoryDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">
                      Product Category
                      {highlightDifferences && categoryDiffers && (
                        <span className="block text-[10px] text-amber-400 font-sans font-normal">(Asymmetric)</span>
                      )}
                    </td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 font-bold text-white">
                        <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {p.category}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Market Sector */}
                  <tr className={highlightDifferences && sectorDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Market Sector</td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 text-cyan-300">
                        {p.sector}
                      </td>
                    ))}
                  </tr>

                  {/* Manufacturer / Brand */}
                  <tr className={highlightDifferences && brandDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Manufacturer / Brand</td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 font-semibold text-slate-200">
                        {p.brand}
                      </td>
                    ))}
                  </tr>

                  {/* Discovery Score & Badges (Phase 4) */}
                  <tr className="hover:bg-slate-900/30 bg-slate-950/40">
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">
                      Discovery Score & Badges
                    </td>
                    {comparisonList.map((p) => {
                      const score = p.discoveryScore ?? 75;
                      const badges = p.badges || [];
                      return (
                        <td key={p.id || p._id} className="p-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-mono text-cyan-400">
                              ★ {score}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
                          </div>
                          {badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {badges.map((b, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Aggregated Price */}
                  <tr className={highlightDifferences && priceDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Aggregated Price</td>
                    {comparisonList.map((p) => {
                      const hasPrice = p.price !== null && p.price !== undefined;
                      const discPrice = hasPrice
                        ? calculateDiscountPrice(p.price, p.discountPercentage)
                        : null;
                      return (
                        <td key={p.id || p._id} className="p-4 font-bold text-base text-white">
                          {hasPrice ? (
                            <>
                              {formatCurrency(discPrice)}
                              {p.discountPercentage > 0 && (
                                <span className="block text-xs text-rose-400 font-normal">
                                  (-{p.discountPercentage}% off {formatCurrency(p.price)})
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-cyan-300">
                              Price on Request
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Lowest Seller Offer (Phase 4 Price Comparison Insights) */}
                  <tr className="hover:bg-slate-900/30">
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">
                      Lowest Seller Offer
                      <span className="block text-[10px] text-slate-500 font-sans font-normal">Best merchant deal</span>
                    </td>
                    {comparisonList.map((p) => {
                      const insights = p.priceInsights;
                      const lowest = insights?.lowestPrice ?? p.price;
                      const bestSellerName =
                        typeof insights?.bestSeller === 'object'
                          ? insights.bestSeller?.name
                          : (insights?.bestSeller || (p.sellers?.[0]?.name ?? 'Direct'));
                      return (
                        <td key={p.id || p._id} className="p-4">
                          {lowest ? (
                            <div>
                              <span className="font-bold text-emerald-400 text-sm">{formatCurrency(lowest)}</span>
                              <span className="block text-[11px] text-slate-400 font-sans">via {bestSellerName}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Average Seller Price & Market Spread */}
                  <tr className="hover:bg-slate-900/30">
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">
                      Market Price Spread
                      <span className="block text-[10px] text-slate-500 font-sans font-normal">Spread & max savings</span>
                    </td>
                    {comparisonList.map((p) => {
                      const insights = p.priceInsights;
                      if (!insights || !insights.hasComparison) {
                        return (
                          <td key={p.id || p._id} className="p-4 text-slate-500">
                            Single verified seller
                          </td>
                        );
                      }
                      return (
                        <td key={p.id || p._id} className="p-4 space-y-1">
                          <div className="text-slate-300">
                            Avg: <strong className="text-white">{formatCurrency(insights.averagePrice)}</strong>
                          </div>
                          {insights.percentageSavings > 0 && (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Spread: {formatCurrency(insights.priceDifference)} ({insights.percentageSavings}% gap)
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Customer Rating */}
                  <tr className={highlightDifferences && ratingDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Customer Rating</td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 text-amber-400 font-bold">
                        ★ {formatRating(p.rating)} / 5.0
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className={highlightDifferences && stockDiffers ? 'bg-amber-500/10' : 'hover:bg-slate-900/30'}>
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Stock Status</td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 text-emerald-400">
                        {p.stock !== null && p.stock !== undefined ? (
                          `${p.stock} units available`
                        ) : (
                          <span className="text-cyan-300">Availability on Request</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Distributor Network */}
                  <tr className="hover:bg-slate-900/30">
                    <td className="p-4 font-bold text-slate-300 bg-slate-900/40">Distributor Network</td>
                    {comparisonList.map((p) => (
                      <td key={p.id || p._id} className="p-4 text-slate-200">
                        {p.sellers?.length || 0} Listed Sellers
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specifications */}
                  {allSpecNames.map((specName) => {
                    const specValues = comparisonList.map((p) => {
                      if (Array.isArray(p.specifications)) {
                        const found = p.specifications.find((s) => s.name === specName);
                        if (found) return found.value;
                      }
                      const obj =
                        p.rawSpecifications ||
                        (p.specifications && typeof p.specifications === 'object'
                          ? p.specifications
                          : null);
                      if (obj && obj[specName] !== undefined) {
                        return String(obj[specName]);
                      }
                      return '—';
                    });
                    const differs = checkRowDiffers(specValues);

                    return (
                      <tr
                        key={specName}
                        className={
                          highlightDifferences && differs
                            ? 'bg-amber-500/10'
                            : 'hover:bg-slate-900/30'
                        }
                      >
                        <td className="p-4 font-bold text-slate-400 bg-slate-900/40">
                          {specName}
                          {highlightDifferences && differs && (
                            <span className="ml-2 text-[10px] text-amber-400 font-sans font-normal">
                              (Differs)
                            </span>
                          )}
                        </td>
                        {comparisonList.map((p) => {
                          let val = '—';
                          if (Array.isArray(p.specifications)) {
                            const found = p.specifications.find((s) => s.name === specName);
                            if (found) val = found.value;
                          }
                          const obj =
                            p.rawSpecifications ||
                            (p.specifications && typeof p.specifications === 'object'
                              ? p.specifications
                              : null);
                          if (obj && obj[specName] !== undefined) {
                            val = String(obj[specName]);
                          }
                          return (
                            <td key={p.id || p._id} className="p-4 text-slate-100">
                              {val !== '—' ? val : <span className="text-slate-600">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparePage;
