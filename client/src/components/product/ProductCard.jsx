import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, ArrowRight, Heart, Bookmark, Scale } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, calculateDiscountPrice, formatRating, handleImageError } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    toggleWishlist,
    isInWishlist,
    toggleSaved,
    isSaved,
    addToCompare,
    removeFromCompare,
    isInCompare,
    token
  } = useAuth();

  if (!product) return null;

  const prodId = product.id || product._id;
  const hasPrice = product.price !== null && product.price !== undefined;
  const discountedPrice = hasPrice ? calculateDiscountPrice(product.price, product.discountPercentage) : null;
  const hasDiscount = hasPrice && product.discountPercentage > 0;

  const inWishlist = isInWishlist(prodId);
  const inSaved = isSaved(prodId);
  const inCompare = isInCompare(prodId);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleSavedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(prodId);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 relative">
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] bg-slate-900/95 overflow-hidden flex items-center justify-center p-4 border-b border-slate-800/60">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Sector Badge Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="cyan" size="sm">
            {product.sector}
          </Badge>
          {Array.isArray(product.badges) && product.badges.length > 0 && (
            <span className={`backdrop-blur-sm text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
              product.badges[0] === 'Best Rated'
                ? 'bg-amber-600/90'
                : product.badges[0] === 'Best Value'
                ? 'bg-emerald-600/90'
                : product.badges[0] === 'Lowest Price'
                ? 'bg-teal-600/90'
                : product.badges[0] === 'Premium Choice'
                ? 'bg-indigo-600/90'
                : 'bg-rose-600/90'
            }`}>
              ★ {product.badges[0]}
            </span>
          )}
          {product.sellers && product.sellers.length > 1 && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
              {product.sellers.length} Sellers
            </span>
          )}
          {product.provider && product.provider !== 'local' && (
            <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow uppercase">
              {product.provider === 'dummyjson' ? 'DummyJSON' : product.provider}
            </span>
          )}
        </div>

        {/* Action Trays Top Right (Wishlist & Save) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mr-1">
              -{product.discountPercentage}%
            </span>
          )}

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
            }`}
            title={!token ? 'Sign in to add to Wishlist' : inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={`Toggle wishlist for ${product.title}`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleSavedClick}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
              inSaved
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'bg-slate-950/70 text-slate-300 hover:text-brand-400 hover:bg-slate-900'
            }`}
            title={!token ? 'Sign in to save Hardware' : inSaved ? 'Remove from Saved' : 'Save Hardware'}
            aria-label={`Toggle saved for ${product.title}`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${inSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand, Score & Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium tracking-wide uppercase font-mono">
              {product.brand}
            </span>
            <div className="flex items-center gap-2">
              {typeof product.discoveryScore === 'number' && (
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  title={`Discovery Score: ${product.discoveryScore}/100`}
                >
                  Score: {product.discoveryScore}
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{formatRating(product.rating)}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-100 text-base group-hover:text-cyan-400 transition-colors line-clamp-2">
            <Link to={`/products/${prodId}`}>
              {product.title}
            </Link>
          </h3>

          {/* Description Preview */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Quick Action Toolbar */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-white tracking-tight ${hasPrice ? 'text-lg font-mono' : 'text-sm text-cyan-300'}`}>
                {hasPrice ? formatCurrency(discountedPrice) : 'Price on Request'}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <div className="text-[11px] flex items-center gap-1 mt-0.5">
              {product.stock !== null && product.stock !== undefined ? (
                product.stock > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>In Stock ({product.stock})</span>
                  </span>
                ) : (
                  <span className="text-rose-400">Out of Stock</span>
                )
              ) : (
                <span className="text-slate-400">Availability on Request</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Compare Button */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`p-2 rounded-xl transition-all ${
                inCompare
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
              aria-label={`Toggle compare for ${product.title}`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* View Details Link */}
            <Link
              to={`/products/${prodId}`}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-brand-600 text-slate-300 hover:text-white transition-all duration-200 border border-slate-700/60 hover:border-brand-500 shadow-sm group-hover:translate-x-0.5"
              aria-label={`View details for ${product.title}`}
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
