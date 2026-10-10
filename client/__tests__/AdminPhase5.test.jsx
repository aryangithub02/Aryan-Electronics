import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from '../src/components/common/AdminRoute';
import Navbar from '../src/components/layout/Navbar';
import AdminDashboardPage from '../src/pages/admin/AdminDashboardPage';
import { AuthContext } from '../src/context/AuthContext';
import api from '../src/services/api';

jest.mock('../src/services/api');

describe('Phase 5 Administration & Analytics Frontend Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getAdminStats.mockResolvedValue({
      success: true,
      data: {
        totalProducts: 188,
        totalFeatured: 12,
        totalTrending: 15,
        totalUsers: 5,
        sectorsCount: 7,
        brandsCount: 25
      }
    });
    api.getHealth.mockResolvedValue({
      success: true,
      status: 'healthy',
      uptime: 4200,
      database: { connected: true, mode: 'live' }
    });
    api.getAnalyticsOverview.mockResolvedValue({
      success: true,
      data: {
        totalViews: 120,
        totalSearches: 45,
        totalComparisons: 20,
        totalWishlistAdds: 18,
        searchConversionRate: 40,
        topProducts: [],
        popularSearches: [],
        sectorPopularity: [],
        brandPopularity: [],
        dataSource: 'mongodb-live'
      }
    });
    api.getAdminProducts.mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
    });
  });

  const renderWithAuth = (ui, authOverrides = {}, initialRoute = '/') => {
    const authValue = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      wishlist: [],
      savedProducts: [],
      recentlyViewed: [],
      comparisonList: [],
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      toggleWishlist: jest.fn(),
      isInWishlist: jest.fn().mockReturnValue(false),
      toggleSaved: jest.fn(),
      isSaved: jest.fn().mockReturnValue(false),
      recordRecentlyViewed: jest.fn(),
      addToCompare: jest.fn(),
      removeFromCompare: jest.fn(),
      clearCompare: jest.fn(),
      isInCompare: jest.fn().mockReturnValue(false),
      ...authOverrides
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  describe('1. AdminRoute Protection (RBAC)', () => {
    it('redirects unauthenticated visitor away from protected admin area', () => {
      renderWithAuth(
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Protected Admin Secret Area</div>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<div>Redirected Login Page</div>} />
        </Routes>,
        { isAuthenticated: false, user: null },
        '/admin'
      );

      expect(screen.getByText('Redirected Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Admin Secret Area')).not.toBeInTheDocument();
    });

    it('denies access to authenticated non-admin users with 403 screen', () => {
      renderWithAuth(
        <AdminRoute>
          <div>Protected Admin Secret Area</div>
        </AdminRoute>,
        {
          isAuthenticated: true,
          user: { id: 'usr-1', email: 'regular@user.com', role: 'user' }
        }
      );

      expect(screen.getByText(/Administrator Access Required/i)).toBeInTheDocument();
      expect(screen.getByText(/regular@user.com/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Admin Secret Area')).not.toBeInTheDocument();
    });

    it('renders protected admin children when user has admin role', () => {
      renderWithAuth(
        <AdminRoute>
          <div>Protected Admin Secret Area</div>
        </AdminRoute>,
        {
          isAuthenticated: true,
          user: { id: 'admin-1', email: 'admin@aryanelectronics.com', role: 'admin' }
        }
      );

      expect(screen.getByText('Protected Admin Secret Area')).toBeInTheDocument();
    });
  });

  describe('2. Navbar Admin Role Integration', () => {
    it('does not display Admin link for regular users', () => {
      renderWithAuth(<Navbar />, {
        isAuthenticated: true,
        user: { id: 'usr-1', name: 'Regular User', role: 'user' }
      });

      expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument();
    });

    it('displays Admin link when user is logged in as administrator', () => {
      renderWithAuth(<Navbar />, {
        isAuthenticated: true,
        user: { id: 'admin-1', name: 'Admin Boss', role: 'admin' }
      });

      expect(screen.getByRole('link', { name: /^Admin$/i })).toBeInTheDocument();
    });
  });

  describe('3. AdminDashboardPage Rendering', () => {
    it('renders administration dashboard header and navigation tabs', async () => {
      renderWithAuth(<AdminDashboardPage />, {
        isAuthenticated: true,
        user: { id: 'admin-1', name: 'Admin Boss', role: 'admin' }
      });

      expect(screen.getByText(/Platform Administration & Analytics/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Analytics Hub/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Product Catalog/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Taxonomy & Offers/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /User Accounts/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /System Health/i })).toBeInTheDocument();

      await waitFor(() => {
        expect(api.getAdminStats).toHaveBeenCalled();
        expect(api.getAnalyticsOverview).toHaveBeenCalled();
      });
    });
  });
});
