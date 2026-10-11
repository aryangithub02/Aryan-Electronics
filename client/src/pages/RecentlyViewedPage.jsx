import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, Heart, Bookmark, Scale, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, calculateDiscountPrice, formatRating, handleImageError } from '../utils/formatters';

export const RecentlyViewedPage = () => {
  const {
    recentlyViewed,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare
  } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono">
          <History className="w-3.5 h-3.5 text-amber-600" />
          <span>Chronological Browsing Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Recently <span className="text-blue-600">Viewed</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Review electronic hardware components and systems you have recently explored across Aryan Electronics.
        </p>
      </div>

      {recentlyViewed.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="No Browsing History Yet"
            description="You haven't viewed any products in this session. Start exploring our electronics catalog to automatically trace your research history."
            actionLabel="Browse Product Catalog"
            onAction={() => navigate('/products')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyViewed.map((product, idx) => {
            const prodId = product.id || product._id;
            const hasPrice = product.price !== null && product.price !== undefined;
            const discountedPrice = hasPrice ? calculateDiscountPrice(product.price, product.discountPercentage) : null;
            const inWishlist = isInWishlist(prodId);
            const inCompare = isInCompare(prodId);

            return (
              <div
                key={`${prodId}-${idx}`}
                className="glass-card rounded-2xl overflow-hidden flex flex-col border border-slate-800 hover:border-brand-500/40 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-slate-900/95 overflow-hidden flex items-center justify-center border-b border-slate-800/80 p-4">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant="cyan" size="sm">{product.sector}</Badge>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-xl transition-colors ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-950/80 text-slate-400 hover:text-rose-400'
                    }`}
                    title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono uppercase">{product.brand}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{formatRating(product.rating)}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors line-clamp-2">
                      <Link to={`/products/${prodId}`}>
                        {product.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {product.category}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-bold text-white font-mono ${hasPrice ? 'text-lg' : 'text-sm text-cyan-300'}`}>
                        {hasPrice ? formatCurrency(discountedPrice) : 'Price on Request'}
                      </span>
                      {hasPrice && product.discountPercentage > 0 && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={inCompare ? 'secondary' : 'outline'}
                        size="sm"
                        className="flex-1 text-xs"
                        icon={Scale}
                        onClick={() => inCompare ? navigate('/compare') : addToCompare(product)}
                      >
                        {inCompare ? 'In Compare' : 'Compare'}
                      </Button>

                      <Link
                        to={`/products/${prodId}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors"
                        aria-label="View Product Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedPage;
