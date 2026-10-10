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
    <div className="space-y-8">
      {/* User Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Initials Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-xl shadow-brand-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-cyan-400">
                  {getInitials(user?.name)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user?.name || 'Account Dashboard'}
                </h1>
                <Badge variant="cyan" size="sm">
                  {user?.role || 'Verified User'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
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
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400">Wishlist</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500/20" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{wishlist.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Saved favorites</p>
        </Link>

        {/* Saved Products Tile */}
        <Link
          to="/saved"
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400">Saved Hardware</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{savedProducts.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Bookmarked items</p>
        </Link>

        {/* Recently Viewed Tile */}
        <Link
          to="/recent"
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400">Browsing History</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{recentlyViewed.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Recently viewed</p>
        </Link>

        {/* Active Comparisons Tile */}
        <Link
          to="/compare"
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400">Comparison</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{comparisonList.length} / 4</div>
          <p className="text-[11px] text-slate-400 mt-1">Active devices</p>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px">
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
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-500 text-white bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
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
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    Active Comparison Matrix ({comparisonList.length} of 4)
                  </h3>
                  <p className="text-xs text-slate-400">
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
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 relative group flex items-center gap-3"
                  >
                    <img
                      src={prod.thumbnail || prod.images?.[0]}
                      alt={prod.title}
                      className="w-12 h-12 object-contain p-1 rounded-lg bg-slate-950 flex-shrink-0"
                      onError={handleImageError}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{prod.title}</p>
                      <p className="text-[11px] font-mono text-cyan-400">
                        {formatProductPrice(prod.price, prod.discountPercentage)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(prod.id || prod._id)}
                      className="text-slate-500 hover:text-red-400 p-1"
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
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Account Security & Session Information
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is secured with standard 256-bit JWT authentication and bcrypt password hashing.
              Your personalized preferences, saved hardware lists, and product comparisons are synchronized with Aryan Electronics database.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                JWT Auth Active
              </span>
              <span className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Encrypted Session
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">My Wishlist Products</h2>
            <Link to="/wishlist" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              View Full Wishlist Page →
            </Link>
          </div>
          {wishlist.length === 0 ? (
            <div className="p-10 rounded-2xl glass-panel text-center text-slate-400 text-sm">
              Your wishlist is currently empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((prod) => (
                <div key={prod.id || prod._id} className="glass-card p-4 rounded-xl border border-slate-800 flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-900 flex-shrink-0"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-400">{prod.brand}</p>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-cyan-400 hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => toggleWishlist(prod.id || prod._id)}
                        className="text-[11px] text-red-400 hover:underline ml-auto"
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
            <h2 className="text-lg font-bold text-white">Saved Electronic Hardware</h2>
            <Link to="/saved" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              View Full Saved Page →
            </Link>
          </div>
          {savedProducts.length === 0 ? (
            <div className="p-10 rounded-2xl glass-panel text-center text-slate-400 text-sm">
              You haven't bookmarked any hardware yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProducts.map((prod) => (
                <div key={prod.id || prod._id} className="glass-card p-4 rounded-xl border border-slate-800 flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-900 flex-shrink-0"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-400">{prod.brand}</p>
                    <p className="text-xs font-mono font-bold text-cyan-400 mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-cyan-400 hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => toggleSaved(prod.id || prod._id)}
                        className="text-[11px] text-red-400 hover:underline ml-auto"
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
            <h2 className="text-lg font-bold text-white">Browsing History (Recently Viewed)</h2>
            <Link to="/recent" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              View Full History Page →
            </Link>
          </div>
          {recentlyViewed.length === 0 ? (
            <div className="p-10 rounded-2xl glass-panel text-center text-slate-400 text-sm">
              No recent hardware browsing history recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyViewed.map((prod) => (
                <div key={prod.id || prod._id} className="glass-card p-4 rounded-xl border border-slate-800 flex gap-4">
                  <img
                    src={prod.thumbnail || prod.images?.[0]}
                    alt={prod.title}
                    className="w-16 h-16 object-contain p-1.5 rounded-lg bg-slate-900 flex-shrink-0"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                    <p className="text-xs text-slate-400">{prod.brand} • {prod.sector}</p>
                    <p className="text-xs font-mono font-bold text-white mt-1">
                      {formatProductPrice(prod.price, prod.discountPercentage)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/products/${prod.id || prod._id}`} className="text-[11px] text-brand-400 hover:underline">
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
