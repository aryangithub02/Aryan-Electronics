import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Layers,
  Grid,
  Scale,
  Menu,
  X,
  Heart,
  Bookmark,
  User,
  LogOut,
  LogIn,
  UserPlus,
  History,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchAutocomplete from '../common/SearchAutocomplete';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
    wishlist = [],
    comparisonList = []
  } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Cpu },
    { name: 'Sectors', path: '/sectors', icon: Layers },
    { name: 'Products', path: '/products', icon: Grid },
    {
      name: 'Compare',
      path: '/compare',
      icon: Scale,
      badge: comparisonList.length > 0 ? comparisonList.length : null
    }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-tight">
                Aryan <span className="gradient-text">Electronics</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono block">
                AGGREGATION ENGINE
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar with Intelligent Autocomplete */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <SearchAutocomplete
              value={navSearch}
              onChange={setNavSearch}
              onSubmit={(query) => {
                navigate(`/products?search=${encodeURIComponent(query)}`);
                setNavSearch('');
              }}
              placeholder="Search specs, brands, SKU, or sector..."
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Wishlist Link */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-brand-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
              title="Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            {/* Admin Dashboard Link for Admin Users */}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-amber-400 hover:text-amber-200 hover:bg-amber-500/10'
                  }`
                }
                title="System Administration & Analytics"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* User Auth & Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-500 transition-colors focus:outline-none"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user?.name || 'Account'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border-b border-slate-800/80 mb-1"
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          Admin Console
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        Account Dashboard
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                      >
                        <span className="flex items-center gap-2.5">
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          My Wishlist
                        </span>
                        {wishlist.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/saved"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-brand-400" />
                        Saved Hardware
                      </Link>

                      <Link
                        to="/recent"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                      >
                        <History className="w-3.5 h-3.5 text-amber-400" />
                        Browsing History
                      </Link>

                      <Link
                        to="/compare"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                      >
                        <span className="flex items-center gap-2.5">
                          <Scale className="w-3.5 h-3.5 text-cyan-400" />
                          Compare Matrix
                        </span>
                        {comparisonList.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            {comparisonList.length}
                          </span>
                        )}
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800/60 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
            </form>

            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              <NavLink
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Wishlist
                </div>
                {wishlist.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white font-mono">
                    {wishlist.length}
                  </span>
                )}
              </NavLink>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Admin Console & Analytics
                    </NavLink>
                  )}
                  <NavLink
                    to="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    Account Dashboard
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800/60 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-white border border-slate-700"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-600 to-indigo-600 text-white"
                  >
                    <UserPlus className="w-4 h-4" /> Register Free Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
