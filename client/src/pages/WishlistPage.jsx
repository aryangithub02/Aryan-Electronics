import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Scale, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, calculateDiscountPrice, formatRating, handleImageError } from '../utils/formatters';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCompare, isInCompare, token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-mono">
          <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
          <span>Curated Personal Favorites</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My <span className="text-rose-600">Wishlist</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Track electronic products you are interested in. Access updated distributor pricing, inventory levels, and specifications anytime.
        </p>
      </div>

      {!token ? (
        <div className="py-12">
          <EmptyState
            icon={Heart}
            title="Sign In to View Your Wishlist"
            description="You need to be signed in to save products to your wishlist and access them across all your devices."
            actionLabel="Sign In Now"
            onAction={() => navigate('/login')}
          />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Your Wishlist is Empty"
            description="You haven't saved any electronics to your wishlist yet. Discover products in our catalog and click the heart icon to save them here."
            actionLabel="Explore Product Catalog"
            onAction={() => navigate('/products')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const prodId = product.id || product._id;
            const hasPrice = product.price !== null && product.price !== undefined;
            const discountedPrice = hasPrice ? calculateDiscountPrice(product.price, product.discountPercentage) : null;
            const inCompare = isInCompare(prodId);

            return (
              <div
                key={prodId}
                className="glass-card rounded-2xl overflow-hidden flex flex-col border border-slate-800 hover:border-brand-500/40 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-slate-900/95 overflow-hidden flex items-center justify-center border-b border-slate-800/80 p-4">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="cyan" size="sm">{product.sector}</Badge>
                  </div>
                  <button
                    onClick={() => toggleWishlist(prodId)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                    title="Remove from Wishlist"
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
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

export default WishlistPage;
