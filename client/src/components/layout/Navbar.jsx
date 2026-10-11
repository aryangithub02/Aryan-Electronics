import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Scale,
  User,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  Layers,
  Sparkles,
  Bookmark,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import AryanLogo from '../common/AryanLogo';
import SearchAutocomplete from '../common/SearchAutocomplete';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [navSearch, setNavSearch] = useState('');
  const { cartCount } = useCart();

  const userMenuRef = useRef(null);
  const locationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    logout,
    wishlist = [],
    comparisonList = []
  } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const countries = ['India', 'United States', 'United Kingdom', 'UAE', 'Germany', 'Singapore', 'Canada', 'Australia'];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Products', path: '/products' },
    { name: 'Brands', path: '/brands' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans shadow-md">
      {/* 1. Main Header Bar (Dark Navy #090e1a) */}
      <div className="bg-[#090e1a] border-b border-slate-800/60 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-4 sm:gap-6">
            {/* Left: Aryan Electronics Logo */}
            <div className="flex-shrink-0">
              <AryanLogo />
            </div>

            {/* Center: Search Bar with Autocomplete & Categories */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <SearchAutocomplete
                value={navSearch}
                onChange={setNavSearch}
                onSubmit={(query, cat) => {
                  const catParam = cat && cat !== 'All Categories' ? `&sector=${encodeURIComponent(cat)}` : '';
                  navigate(`/products?search=${encodeURIComponent(query)}${catParam}`);
                  setNavSearch('');
                }}
                placeholder="Search for products, brands, or categories..."
              />
            </div>

            {/* Right: Actions (Wishlist, Compare, Account, Cart) */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors group relative"
                title="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium mt-0.5 hidden sm:block">Wishlist</span>
              </Link>

              {/* Compare */}
              <Link
                to="/compare"
                className="flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors group relative"
                title="Compare Products"
              >
                <div className="relative">
                  <Scale className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {comparisonList.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                      {comparisonList.length}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium mt-0.5 hidden sm:block">Compare</span>
              </Link>

              {/* Account Dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors group focus:outline-none"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium mt-0.5 hidden sm:block">
                    {isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Account'}
                  </span>
                </button>

                {/* Account Dropdown Popover */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] rounded-2xl border border-slate-700/80 shadow-2xl py-2 z-50 animate-fade-in text-white">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-800">
                          <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-800/80"
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
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            Account Dashboard
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            My Wishlist
                          </Link>
                          <Link
                            to="/compare"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                          >
                            <Scale className="w-3.5 h-3.5 text-cyan-400" />
                            Compare Matrix
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
                      </>
                    ) : (
                      <div className="p-3 space-y-2">
                        <p className="text-xs text-slate-300 mb-2">Welcome to Aryan Electronics</p>
                        <Link
                          to="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Register Free
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors group relative"
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[1rem] h-4 px-1 flex items-center justify-center font-mono">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium mt-0.5 hidden sm:block">Cart</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar in dropdown */}
          <div className="md:hidden pb-3">
            <SearchAutocomplete
              value={navSearch}
              onChange={setNavSearch}
              onSubmit={(query, cat) => {
                const catParam = cat && cat !== 'All Categories' ? `&sector=${encodeURIComponent(cat)}` : '';
                navigate(`/products?search=${encodeURIComponent(query)}${catParam}`);
                setNavSearch('');
                setIsMobileMenuOpen(false);
              }}
              placeholder="Search for products, brands, or categories..."
            />
          </div>
        </div>
      </div>

      {/* 2. Secondary Navigation Bar (Dark Slate #0c1424) */}
      <div className="bg-[#0c1424] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            {/* Navigation Links */}
            <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar h-full">
              {navLinks.map((item) => {
                const isExactHome = item.path === '/' && location.pathname === '/';
                const isSectors = item.path === '/sectors' && location.pathname.startsWith('/sectors');
                const isProducts = item.path === '/products' && location.pathname.startsWith('/products') && !location.search;
                const isActive = isExactHome || isSectors || isProducts;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive: navActive }) => {
                      const active = isActive || navActive;
                      return `h-full flex items-center text-xs sm:text-sm font-medium transition-colors whitespace-nowrap relative border-b-2 ${
                        active
                          ? 'border-blue-500 text-white font-semibold'
                          : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
                      }`;
                    }}
                  >
                    {item.name}
                  </NavLink>
                );
              })}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `h-full flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap relative border-b-2 text-amber-400 hover:text-amber-300 ${
                      isActive ? 'border-amber-400' : 'border-transparent'
                    }`
                  }
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin</span>
                </NavLink>
              )}
            </nav>

            {/* Country / Location Selector Right Side */}
            <div ref={locationRef} className="relative flex-shrink-0 ml-4">
              <button
                type="button"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1 focus:outline-none"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedCountry}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#0f172a] rounded-xl border border-slate-700/80 shadow-xl py-1 z-50 text-white max-h-56 overflow-y-auto">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-3 py-1 block border-b border-slate-800">
                    Select Region
                  </span>
                  {countries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        selectedCountry === country
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1122] border-b border-slate-800 text-white px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Region: {selectedCountry}
            </span>
            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-blue-400 hover:underline"
            >
              Compare ({comparisonList.length})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
