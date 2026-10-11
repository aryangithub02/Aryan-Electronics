import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Scale, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency, calculateDiscountPrice, formatRating, handleImageError } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
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
  const inCompare = isInCompare(prodId);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
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

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1500);
  };

  const reviewCount = product.reviewsCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-3.5 sm:p-4 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group font-sans overflow-hidden">
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between z-10">
        {/* Discount Badge */}
        {hasDiscount ? (
          <span className="bg-[#e02424] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-2xs uppercase tracking-tight">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        ) : (
          <span />
        )}

        {/* Action Buttons: Wishlist & Compare */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCompareClick}
            className={`p-1.5 rounded-full transition-all ${
              inCompare
                ? 'bg-blue-100 text-blue-600'
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            aria-label={`Toggle compare for ${product.title}`}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-full transition-all ${
              inWishlist
                ? 'text-rose-500 fill-rose-500'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
            }`}
            title={!token ? 'Sign in to add to Wishlist' : inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={`Toggle wishlist for ${product.title}`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link
        to={`/products/${prodId}`}
        className="w-full aspect-square my-3 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform duration-300"
      >
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      {/* Product Information */}
      <div className="space-y-1.5">
        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          <Link to={`/products/${prodId}`}>
            {product.title}
          </Link>
        </h3>

        {/* Brand & Sector Breadcrumb matching Screenshot */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-sans">
          <span className="font-medium text-slate-600">{product.brand}</span>
          <span>|</span>
          <span className="text-slate-500 truncate">{product.sector}</span>
        </div>

        {/* Rating & Review Count */}
        {product.rating !== undefined && product.rating !== null && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {formatRating(product.rating)}
            </span>
            {reviewCount !== undefined && reviewCount !== null && (
              <span className="text-xs text-slate-400">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price & Cart Button Row */}
        <div className="pt-2.5 flex items-end justify-between border-t border-slate-100 gap-2">
          <div className="min-w-0 flex-1">
            {hasPrice ? (
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through leading-tight">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-blue-600 block truncate">
                Price on Request
              </span>
            )}

            {/* Availability Stock */}
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              {product.stock !== null && product.stock !== undefined ? (
                product.stock > 0 ? (
                  <span className="text-emerald-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-rose-500 font-medium">Out of Stock</span>
                )
              ) : (
                <span className="text-slate-400">Availability on Request</span>
              )}
            </div>
          </div>

          {/* Blue Cart Button */}
          <button
            type="button"
            onClick={handleCartClick}
            className={`w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
              isAddedToCart
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
            title="Add to Cart"
            aria-label={`Add ${product.title} to Cart`}
          >
            {isAddedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
