import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, X, Layers, Tag, Globe, Database, Radio, Award, DollarSign, Star, Store, PackageCheck } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import SearchAutocomplete from '../components/common/SearchAutocomplete';
import AdvancedFilterPanel from '../components/product/AdvancedFilterPanel';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const initialSector = searchParams.get('sector') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSource = searchParams.get('source') || 'all';
  const initialBrand = searchParams.get('brand') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialMinRating = searchParams.get('minRating') || '';
  const initialAvailability = searchParams.get('availability') || '';
  const initialSeller = searchParams.get('seller') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialLimit = parseInt(searchParams.get('limit'), 10) || 12;

  const [products, setProducts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSector, setSelectedSector] = useState(initialSector);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSource, setSelectedSource] = useState(initialSource);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [availability, setAvailability] = useState(initialAvailability);
  const [selectedSeller, setSelectedSeller] = useState(initialSeller);
  const [sortBy, setSortBy] = useState(initialSort);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [providerBreakdown, setProviderBreakdown] = useState({ local: 188, external: 0, total: 188 });
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    total: 0
  });

  // Load Sectors list with their category breakdowns
  useEffect(() => {
    let isMounted = true;
    api.getSectors()
      .then((res) => {
        if (isMounted && res.data) setSectors(res.data);
      })
      .catch((err) => console.warn('Could not load sectors list:', err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available categories based on currently selected sector
  const availableCategories = useMemo(() => {
    if (!selectedSector) {
      const allCats = new Set();
      sectors.forEach((s) => {
        (s.categories || []).forEach((c) => allCats.add(c));
      });
      return Array.from(allCats).sort();
    }
    const foundSector = sectors.find(
      (s) => s.name.toLowerCase() === selectedSector.toLowerCase()
    );
    return foundSector ? foundSector.categories || [] : [];
  }, [sectors, selectedSector]);

  // Sync state if URL query params change externally
  useEffect(() => {
    setSelectedSector(searchParams.get('sector') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSearchTerm(searchParams.get('search') || '');
    setSelectedSource(searchParams.get('source') || 'all');
    setSelectedBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMinRating(searchParams.get('minRating') || '');
    setAvailability(searchParams.get('availability') || '');
    setSelectedSeller(searchParams.get('seller') || '');
    setSortBy(searchParams.get('sort') || 'newest');

    const pageInUrl = parseInt(searchParams.get('page'), 10);
    if (pageInUrl && pageInUrl !== currentPage) {
      setCurrentPage(pageInUrl);
    }
  }, [searchParams]);

  // Fetch products with pagination & filtering
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          limit: pageSize
        };
        if (selectedSector) params.sector = selectedSector;
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        if (selectedBrand) params.brand = selectedBrand;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (availability) params.availability = availability;
        if (selectedSeller) params.seller = selectedSeller;
        if (sortBy !== 'newest') params.sort = sortBy;

        let res;
        if (selectedSource === 'local' || typeof api.getAggregatedProducts !== 'function') {
          res = await api.getProducts(params);
        } else {
          const aggParams = { ...params };
          if (selectedSource !== 'all') {
            aggParams.provider = selectedSource;
          }
          res = await api.getAggregatedProducts(aggParams).catch(() => api.getProducts(params));
        }

        if (isMounted && res.data) {
          setProducts(res.data);
          if (res.providerBreakdown) {
            setProviderBreakdown({
              local: res.providerBreakdown.local || 0,
              external: res.providerBreakdown.external || 0,
              total: res.total || res.data.length
            });
          }
          if (res.pagination) {
            setPaginationInfo(res.pagination);
          } else {
            setPaginationInfo({
              page: currentPage,
              limit: pageSize,
              totalPages: Math.ceil((res.total || res.data.length) / pageSize),
              total: res.total || res.data.length
            });
          }
        }
      } catch (err) {
        console.warn('Error fetching products:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [
    selectedSector,
    selectedCategory,
    searchTerm,
    selectedSource,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    availability,
    selectedSeller,
    sortBy,
    currentPage,
    pageSize
  ]);

  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (term) => {
    const query = term !== undefined ? term : searchTerm;
    setCurrentPage(1);
    updateUrlParams({ search: query, page: 1 });
  };

  const handleSectorChange = (sectorName) => {
    setSelectedSector(sectorName);
    setSelectedCategory('');
    setCurrentPage(1);
    updateUrlParams({ sector: sectorName, category: '', page: 1 });
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    updateUrlParams({ category: categoryName, page: 1 });
  };

  const handleSourceChange = (sourceKey) => {
    setSelectedSource(sourceKey);
    setCurrentPage(1);
    updateUrlParams({ source: sourceKey, page: 1 });
  };

  const handleAdvancedFilterChange = (updates) => {
    setCurrentPage(1);
    updateUrlParams(updates);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    updateUrlParams({ limit: newSize, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSelectedCategory('');
    setSelectedSource('all');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setAvailability('');
    setSelectedSeller('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Check which filters are actively modifying the result set
  const activeBrandList = selectedBrand ? selectedBrand.split(',').filter(Boolean) : [];
  const hasActiveFilters = Boolean(
    selectedSector ||
    selectedCategory ||
    searchTerm ||
    selectedSource !== 'all' ||
    activeBrandList.length > 0 ||
    minPrice ||
    maxPrice ||
    minRating ||
    availability ||
    selectedSeller
  );

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Product <span className="gradient-text">Catalog & Aggregator</span>
        </h1>
        <p className="text-sm text-slate-300">
          Intelligent hardware aggregation across verified distributors, live streams, and technical specifications.
        </p>
      </div>

      {/* Main Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4 border border-slate-800">
        {/* Stream Source Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 mr-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Source Stream:
          </span>
          <button
            type="button"
            onClick={() => handleSourceChange('all')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              selectedSource === 'all'
                ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white font-bold shadow-md shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            All Sources (Aggregated)
            {providerBreakdown.total ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-cyan-200">
                {providerBreakdown.total}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => handleSourceChange('local')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              selectedSource === 'local'
                ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Aryan Catalog (188 Verified)
          </button>
          <button
            type="button"
            onClick={() => handleSourceChange('dummyjson')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              selectedSource === 'dummyjson'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            DummyJSON Partner Stream
          </button>
          <button
            type="button"
            onClick={() => handleSourceChange('ebay')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              selectedSource === 'ebay'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            eBay Browse Stream
          </button>
        </div>

        {/* Primary Search and Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Autocomplete Search Input */}
          <div className="md:col-span-5 relative">
            <SearchAutocomplete
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              onSubmit={handleSearchSubmit}
              placeholder="Search specs, brand, SKU, chips..."
            />
          </div>

          {/* Sector Selector */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-10 pr-8 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                aria-label="Filter by Sector"
              >
                <option value="">All Electronic Sectors</option>
                {sectors.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.productCount})
                  </option>
                ))}
              </select>
              <Layers className="w-4 h-4 text-cyan-400 absolute left-3.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-7 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                aria-label="Filter by Category"
              >
                <option value="">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Tag className="w-3.5 h-3.5 text-brand-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sort Selector with Discovery Score option */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ sort: e.target.value, page: 1 });
                }}
                className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-7 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="score_desc">Discovery Score: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rating</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        {availableCategories.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyan-400" /> Categories:
              </span>
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-brand-500 text-white font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All
              </button>
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(isSelected ? '' : cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Tags Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Active filters:</span>

            {selectedSector && (
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center gap-1.5 font-mono">
                Sector: {selectedSector}
                <button
                  type="button"
                  onClick={() => handleSectorChange('')}
                  className="hover:text-white"
                  title="Remove sector"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 font-mono">
                Category: {selectedCategory}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('')}
                  className="hover:text-white"
                  title="Remove category"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-mono">
                Query: "{searchTerm}"
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    updateUrlParams({ search: '', page: 1 });
                  }}
                  className="hover:text-white"
                  title="Remove search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeBrandList.map((b) => (
              <span
                key={b}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 font-mono"
              >
                Brand: {b}
                <button
                  type="button"
                  onClick={() => {
                    const remaining = activeBrandList.filter((item) => item !== b);
                    handleAdvancedFilterChange({ brand: remaining.join(',') || undefined, page: 1 });
                  }}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {(minPrice || maxPrice) && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-mono">
                Price: {minPrice ? formatCurrency(minPrice) : '₹0'} - {maxPrice ? formatCurrency(maxPrice) : 'Any'}
                <button
                  type="button"
                  onClick={() => handleAdvancedFilterChange({ minPrice: undefined, maxPrice: undefined, page: 1 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-mono">
                Rating: {minRating}★+
                <button
                  type="button"
                  onClick={() => handleAdvancedFilterChange({ minRating: undefined, page: 1 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {availability === 'in_stock' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-mono">
                In Stock Only
                <button
                  type="button"
                  onClick={() => handleAdvancedFilterChange({ availability: undefined, page: 1 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSeller && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1.5 font-mono">
                Seller: {selectedSeller}
                <button
                  type="button"
                  onClick={() => handleAdvancedFilterChange({ seller: undefined, page: 1 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSource !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1.5 font-mono">
                Stream: {selectedSource === 'local' ? 'Aryan Verified' : selectedSource === 'dummyjson' ? 'DummyJSON' : 'eBay'}
                <button
                  type="button"
                  onClick={() => handleSourceChange('all')}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-white ml-auto"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filter Panel (Collapsible / Multi-attribute Drawer) */}
      <AdvancedFilterPanel
        filters={{
          sector: selectedSector,
          category: selectedCategory,
          search: searchTerm,
          brand: selectedBrand,
          minPrice,
          maxPrice,
          minRating,
          availability,
          seller: selectedSeller
        }}
        onFilterChange={handleAdvancedFilterChange}
        onReset={handleResetFilters}
        sectors={sectors}
        availableCategories={availableCategories}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-1">
        <span>
          Showing <strong className="text-white">{products.length}</strong> of{' '}
          <strong className="text-cyan-400">{paginationInfo.total}</strong> products
          {selectedCategory && (
            <span> in <span className="text-white">"{selectedCategory}"</span></span>
          )}
          {selectedSector && !selectedCategory && (
            <span> in sector <span className="text-white">"{selectedSector}"</span></span>
          )}
          {selectedSource === 'all' && (
            <span className="text-slate-500 ml-1.5 hidden md:inline">
              (Aryan Catalog: {providerBreakdown.local} | Partner Streams: {providerBreakdown.external})
            </span>
          )}
        </span>
        {paginationInfo.totalPages > 1 && (
          <span className="text-slate-500">
            Page {currentPage} of {paginationInfo.totalPages}
          </span>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Controls */}
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationInfo.totalPages}
          totalItems={paginationInfo.total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[12, 24, 48, 96]}
        />
      )}
    </div>
  );
};

export default ProductsPage;
