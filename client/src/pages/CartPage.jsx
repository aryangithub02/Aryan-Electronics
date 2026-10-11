import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateDiscountPrice, handleImageError } from '../utils/formatters';
import Button from '../components/common/Button';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    subtotal,
    totalSavings,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Order Inquired Successfully!
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Your electronics requisition has been registered. An authorized vendor representative will reach out for billing and delivery coordination.
          </p>
        </div>
        <div className="pt-4">
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Browsing Catalog
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You don't have any electronic hardware or consumer devices in your cart yet. Explore our genuine dataset catalog to add real products.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/products" className="hover:text-blue-600 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const prod = item.product || {};
            const prodId = item.id || prod.id || prod._id;
            const hasPrice = typeof prod.price === 'number';
            const unitEffectivePrice =
              hasPrice && prod.discountPercentage > 0
                ? calculateDiscountPrice(prod.price, prod.discountPercentage)
                : prod.price;
            const lineTotal = hasPrice ? unitEffectivePrice * item.quantity : null;

            return (
              <div
                key={prodId}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/products/${prodId}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 p-2 flex-shrink-0 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
                >
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">{prod.brand}</span>
                    <span>|</span>
                    <span className="truncate">{prod.sector}</span>
                    {prod.SKU && (
                      <>
                        <span>|</span>
                        <span className="font-mono text-[11px] text-slate-400">{prod.SKU}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-blue-600">
                    <Link to={`/products/${prodId}`}>{prod.title}</Link>
                  </h3>

                  {/* Unit price display */}
                  <div className="pt-1 flex items-baseline gap-2">
                    {hasPrice ? (
                      <>
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {formatCurrency(unitEffectivePrice)}
                        </span>
                        {prod.discountPercentage > 0 && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(prod.price)}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {Math.round(prod.discountPercentage)}% OFF
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-blue-600">
                        Price on Request
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(prodId, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 font-mono min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(prodId, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[5rem]">
                    {hasPrice ? (
                      <div className="font-bold text-slate-900 text-base sm:text-lg">
                        {formatCurrency(lineTotal)}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">—</div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(prodId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove item from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal ({cartCount})</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Special Discount Savings</span>
                  <span className="font-semibold">-{formatCurrency(totalSavings)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Standard Shipping</span>
                </span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                <span className="text-base font-bold text-slate-900">Total Price</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {formatCurrency(subtotal)}
                  </span>
                  <p className="text-[10px] text-slate-400">Inclusive of all applicable GST</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>100% Verified OEM & Authorized Distributor Products</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Fast & Insured Shipping Across All India Pin Codes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>Manufacturer Warranty on All Catalog Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
