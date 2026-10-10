import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ExternalLink,
  Scale,
  ShieldCheck,
  Check,
  PackageCheck,
  Heart,
  Bookmark
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { PriceInsightsCard } from '../components/product/PriceInsightsCard';
import { ProductScoreCard } from '../components/product/ProductScoreCard';
import { RecommendationSection } from '../components/product/RecommendationSection';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, calculateDiscountPrice, formatRating, handleImageError } from '../utils/formatters';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    toggleWishlist,
    isInWishlist,
    toggleSaved,
    isSaved,
    addToCompare,
    removeFromCompare,
    isInCompare,
    recordRecentlyViewed
  } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let res;
        try {
          if (typeof api.getAggregatedProductById === 'function') {
            res = await api.getAggregatedProductById(id);
          }
        } catch (aggErr) {
          // ignore error and fallback
        }
        if (!res || !res.data) {
          res = await api.getProductById(id);
        }
        if (isMounted && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.thumbnail || res.data.images?.[0]);
          // Automatically register product in recently viewed history
          recordRecentlyViewed(res.data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Product not found');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 font-mono">Aggregating hardware specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12">
        <EmptyState
          title="Product Not Found"
          description={error || `No electronic product exists with identifier "${id}".`}
          actionLabel="Back to Products"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const prodId = product.id || product._id;
  const hasPrice = product.price !== null && product.price !== undefined;
  const discountedPrice = hasPrice ? calculateDiscountPrice(product.price, product.discountPercentage) : null;
  const hasDiscount = hasPrice && product.discountPercentage > 0;
  const allImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images || [])
  ].filter((v, i, a) => a.indexOf(v) === i);

  const specsList = Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications
    : (product.rawSpecifications || (product.specifications && typeof product.specifications === 'object'))
    ? Object.entries(product.rawSpecifications || product.specifications).map(([k, v]) => ({ name: k, value: String(v) }))
    : [];

  const inWishlist = isInWishlist(prodId);
  const inSaved = isSaved(prodId);
  const inCompare = isInCompare(prodId);

  return (
    <div className="space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
        <div className="hidden sm:flex items-center gap-2 font-mono">
          <span>{product.sector}</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-slate-200">{product.SKU}</span>
        </div>
      </div>

      {/* Main Product Showcase Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-2xl glass-card overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-900/95 p-6 relative">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border transition-all ${
                    selectedImage === img
                      ? 'border-brand-500 ring-2 ring-brand-500/30'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain p-1" onError={handleImageError} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan">{product.sector}</Badge>
              <Badge variant="slate">{product.category}</Badge>
              <span className="text-xs font-mono text-slate-400">SKU: {product.SKU}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-slate-300">
                Brand: <strong className="text-white">{product.brand}</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{formatRating(product.rating)} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Price & Stock Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            {hasPrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-slate-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight">
                  Price on Request
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  Commercial / Enterprise pricing via authorized distributor
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-mono">
              {product.stock !== null && product.stock !== undefined ? (
                product.stock > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4" />
                    <span>Available in Inventory: {product.stock} units</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </span>
                )
              ) : (
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4" />
                  <span>Availability on Request (Contact Distributor)</span>
                </span>
              )}
            </div>

            {/* Phase 2 Action Toolbar */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Button
                variant={inWishlist ? 'primary' : 'secondary'}
                size="sm"
                icon={Heart}
                onClick={() => toggleWishlist(product)}
                className={inWishlist ? 'bg-rose-600 hover:bg-rose-500 text-white' : ''}
              >
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>

              <Button
                variant={inSaved ? 'primary' : 'secondary'}
                size="sm"
                icon={Bookmark}
                onClick={() => toggleSaved(product)}
                className={inSaved ? 'bg-brand-600 hover:bg-brand-500 text-white' : ''}
              >
                {inSaved ? 'Hardware Saved' : 'Save Hardware'}
              </Button>

              <Button
                variant={inCompare ? 'outline' : 'secondary'}
                size="sm"
                icon={Scale}
                onClick={() => {
                  if (inCompare) {
                    navigate('/compare');
                  } else {
                    addToCompare(product);
                  }
                }}
              >
                {inCompare ? 'Open in Compare' : 'Add to Compare'}
              </Button>
            </div>
          </div>

          {/* Price Comparison Insights (Phase 4) */}
          {product.priceInsights && (
            <PriceInsightsCard priceInsights={product.priceInsights} productTitle={product.title} />
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Use Cases */}
          {product.useCases && product.useCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Target Applications & Use Cases</h3>
              <div className="flex flex-wrap gap-2">
                {product.useCases.map((useCase, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                  >
                    • {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Discovery Score & Methodology (Phase 4) */}
          <ProductScoreCard product={product} />
        </div>
      </div>

      {/* Specifications & Key Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-800/80">
        {/* Specifications Table */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Technical Specifications
          </h2>
          <div className="rounded-2xl glass-card overflow-hidden border border-slate-800">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                {specsList && specsList.length > 0 ? (
                  specsList.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-slate-400 w-1/3 bg-slate-900/60 font-medium">{spec.name}</td>
                      <td className="py-3 px-4 text-slate-100">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-4 text-slate-400">Standard specifications in process.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-white">Engineering Highlights</h2>
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            {product.features && product.features.length > 0 ? (
              product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="mt-0.5 p-1 rounded-md bg-brand-500/10 text-cyan-400">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Detailed engineering features available in technical specifications.</p>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Seller Aggregation Matrix */}
      <div className="space-y-4 pt-8 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Multi-Seller Aggregation Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Real-time merchant listings and price transparency aggregated by Aryan Electronics.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {product.sellers?.length || 0} Sellers Cataloged
          </span>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Merchant / Seller</th>
                <th className="py-3.5 px-4">Merchant Trust</th>
                <th className="py-3.5 px-4">Listed Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Offer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs font-mono">
              {product.sellers && product.sellers.length > 0 ? (
                (() => {
                  const validSellerPrices = product.sellers
                    .map((s) => s.price)
                    .filter((p) => typeof p === 'number' && p > 0);
                  const minSellerPrice = validSellerPrices.length > 0 ? Math.min(...validSellerPrices) : null;

                  return product.sellers.map((seller, idx) => {
                    const isLowest = minSellerPrice !== null && seller.price === minSellerPrice && validSellerPrices.length > 1;
                    return (
                      <tr key={idx} className={`hover:bg-slate-900/40 ${isLowest ? 'bg-emerald-950/20' : ''}`}>
                        <td className="py-3 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{seller.name}</span>
                            {seller.source && (
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                {seller.source.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                          {seller.lastVerified && (
                            <span className="text-[10px] text-slate-500 font-sans block">
                              Verified: {new Date(seller.lastVerified).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-amber-400">
                          {seller.rating ? `★ ${formatRating(seller.rating)}` : 'Verified Seller'}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>
                              {seller.price !== null && seller.price !== undefined
                                ? formatCurrency(seller.price)
                                : 'Price on Request'}
                            </span>
                            {isLowest && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                Best Price
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {seller.availability ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {seller.availability}
                            </span>
                          ) : seller.inStock !== undefined ? (
                            seller.inStock ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                              </span>
                            ) : (
                              <span className="text-slate-500">Backordered</span>
                            )
                          ) : (
                            <span className="text-slate-400">Inquire with Seller</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {(() => {
                            const targetUrl = seller.url && seller.url !== '#'
                              ? seller.url
                              : `https://www.google.com/search?q=${encodeURIComponent(`${product.brand || ''} ${product.title} buy online`)}`;
                            return (
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 font-sans inline-flex items-center gap-1 hover:underline"
                              >
                                View Product <ExternalLink className="w-3 h-3" />
                              </a>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  });
                })()
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-slate-400">No third-party merchants registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Sources & Technical Documentation */}
      {product.sources && product.sources.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Verified Sources & Manufacturer Documentation
              </h2>
              <p className="text-xs text-slate-400">
                Direct manufacturer URLs, specifications sheets, and commercial documentation references.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {product.sources.length} Documentation Links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.sources.map((src, idx) => {
              const label = src.type ? src.type.replace(/_/g, ' ') : 'Official Source';
              return (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-card border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <p className="text-xs font-mono capitalize text-cyan-400 font-semibold tracking-wide">
                      {label}
                    </p>
                    <p className="text-xs text-slate-400 truncate group-hover:text-slate-200">
                      {src.url}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Intelligent Product Recommendations (Phase 4) */}
      <RecommendationSection productId={prodId} currentProduct={product} />
    </div>
  );
};

export default ProductDetailPage;
