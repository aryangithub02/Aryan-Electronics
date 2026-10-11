import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Bookmark,
  History,
  Scale,
  LogOut,
  Shield,
  Calendar,
  Mail,
  ExternalLink,
  Trash2,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatCurrency, calculateDiscountPrice, formatProductPrice, handleImageError } from '../utils/formatters';

export const AccountPage = () => {
  const {
    user,
    logout,
    wishlist,
    savedProducts,
    recentlyViewed,
    comparisonList,
    toggleWishlist,
    toggleSaved,
    removeFromCompare
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'AE';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      })
    : 'Recent Member';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* User Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Initials Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {getInitials(user?.name)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user?.name || 'Account Dashboard'}
                </h1>
                <Badge variant="cyan" size="sm">
                  {user?.role || 'Verified User'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleLogout}
              icon={LogOut}
              className="text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wishlist Tile */}
        <Link
          to="/wishlist"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Wishlist</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500/20" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{wishlist.length}</div>
          <p className="text-xs text-slate-500 mt-1">Saved favorites</p>
        </Link>

        {/* Saved Products Tile */}
        <Link
          to="/saved"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Saved Hardware</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{savedProducts.length}</div>
          <p className="text-xs text-slate-500 mt-1">Bookmarked items</p>
        </Link>

        {/* Recently Viewed Tile */}
        <Link
          to="/recent"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Browsing History</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{recentlyViewed.length}</div>
          <p className="text-xs text-slate-500 mt-1">Recently viewed</p>
        </Link>

        {/* Active Comparisons Tile */}
        <Link
          to="/compare"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Comparison</span>
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 group-hover:scale-110 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {comparisonList.length} <span className="text-sm font-semibold text-slate-400">/ 4</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Active devices</p>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: User },
          { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'saved', label: `Saved (${savedProducts.length})`, icon: Bookmark },
          { id: 'recent', label: `History (${recentlyViewed.length})`, icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Comparison Tray if items exist */}
          {comparisonList.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-600" />
                    Active Comparison Matrix ({comparisonList.length} of 4)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your side-by-side technical evaluation workbench.
                  </p>
                </div>
                <Link to="/compare">
                  <Button variant="primary" size="sm">
                    Open Comparison Matrix
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {comparisonList.map((prod) => (
                  <div
                    key={prod.id || prod._id}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/90 relative group flex items-center gap-3 hover:border-slate-300 transition-all"
                  >
                    <img
                      src={prod.thumbnail || prod.images?.[0]}
                      alt={prod.title}
                      className="w-12 h-12 object-contain p-1 rounded-lg bg-white border border-slate-200 flex-shrink-0"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{prod.title}</p>
                      <p className="text-xs font-mono font-bold text-blue-600">
                        {formatProductPrice(prod.price, prod.discountPercentage)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(prod.id || prod._id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Security Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Account Security & Session Information
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account is secured with standard 256-bit JWT authentication and bcrypt password hashing.
              Your personalized preferences, saved hardware lists, and product comparisons are synchronized with Aryan Electronics database.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                JWT Auth Active
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                Encrypted Session
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Wishlist Products</h2>
            <Link to="/wishlist" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View Full Wishlist Page →
            </Link>
          </div>
          {wishlist.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center text-slate-500 text-sm">
              Your wishlist is currently empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((prod) => (
                <div key={prod.id || prod._id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-500">{prod.brand}</p>
                    <p className="text-xs font-mono font-bold text-blue-600 mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-blue-600 hover:underline font-semibold">
                        View
                      </Link>
                      <button
                        onClick={() => toggleWishlist(prod.id || prod._id)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline font-semibold ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Saved Electronic Hardware</h2>
            <Link to="/saved" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View Full Saved Page →
            </Link>
          </div>
          {savedProducts.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center text-slate-500 text-sm">
              You haven't bookmarked any hardware yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProducts.map((prod) => (
                <div key={prod.id || prod._id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-500">{prod.brand}</p>
                    <p className="text-xs font-mono font-bold text-blue-600 mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-blue-600 hover:underline font-semibold">
                        View
                      </Link>
                      <button
                        onClick={() => toggleSaved(prod.id || prod._id)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline font-semibold ml-auto"
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Browsing History (Recently Viewed)</h2>
            <Link to="/recent" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View Full History Page →
            </Link>
          </div>
          {recentlyViewed.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center text-slate-500 text-sm">
              No recent hardware browsing history recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyViewed.map((prod) => (
                <div key={prod.id || prod._id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-500">{prod.brand} • {prod.sector}</p>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-blue-600 hover:underline font-semibold">
                        Explore Specs →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
