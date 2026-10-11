import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Spinner from './components/common/Spinner';
import lazyWithRetry from './utils/lazyWithRetry';

// Code-split pages with automatic ChunkLoadError retry recovery
const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const SectorsPage = lazyWithRetry(() => import('./pages/SectorsPage'));
const ProductsPage = lazyWithRetry(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazyWithRetry(() => import('./pages/ProductDetailPage'));
const BrandsPage = lazyWithRetry(() => import('./pages/BrandsPage'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const ComparePage = lazyWithRetry(() => import('./pages/ComparePage'));
const CartPage = lazyWithRetry(() => import('./pages/CartPage'));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('./pages/RegisterPage'));
const AccountPage = lazyWithRetry(() => import('./pages/AccountPage'));
const WishlistPage = lazyWithRetry(() => import('./pages/WishlistPage'));
const SavedProductsPage = lazyWithRetry(() => import('./pages/SavedProductsPage'));
const RecentlyViewedPage = lazyWithRetry(() => import('./pages/RecentlyViewedPage'));
const AdminDashboardPage = lazyWithRetry(() => import('./pages/admin/AdminDashboardPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <Spinner size="lg" />
    <span className="text-xs font-mono text-slate-400">Loading experience...</span>
  </div>
);

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sectors" element={<SectorsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Authentication Routes (Phase 2) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Personalized & Protected Routes (Phase 2) */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/saved" element={<SavedProductsPage />} />
                <Route path="/recent" element={<RecentlyViewedPage />} />
                <Route path="/recently-viewed" element={<RecentlyViewedPage />} />

              {/* Admin & Analytics Dashboard (Phase 5) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
