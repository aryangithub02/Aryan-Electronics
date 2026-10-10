import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WishlistPage from '../src/pages/WishlistPage';
import SavedProductsPage from '../src/pages/SavedProductsPage';
import RecentlyViewedPage from '../src/pages/RecentlyViewedPage';
import AccountPage from '../src/pages/AccountPage';
import { AuthContext } from '../src/context/AuthContext';

const mockProduct = {
  id: 'prod-001',
  title: 'Ultra Gaming Laptop',
  brand: 'Asus ROG',
  sector: 'Computing & Gaming',
  category: 'Laptops',
  price: 1499,
  discountPercentage: 10,
  rating: 4.8,
  stock: 12,
  SKU: 'ROG-1499',
  thumbnail: 'https://example.com/laptop.jpg'
};

describe('Phase 2 Personalization UI Tests', () => {
  const mockToggleWishlist = jest.fn();
  const mockToggleSaved = jest.fn();
  const mockAddToCompare = jest.fn();
  const mockLogout = jest.fn();

  const renderWithContext = (ui, authOverrides = {}) => {
    const authValue = {
      user: {
        id: 'usr-123',
        name: 'Aryan Tester',
        email: 'tester@example.com',
        role: 'Verified Engineer',
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      token: 'jwt-mock-token',
      isAuthenticated: true,
      isLoading: false,
      wishlist: [mockProduct],
      savedProducts: [mockProduct],
      recentlyViewed: [mockProduct],
      comparisonList: [mockProduct],
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      toggleWishlist: mockToggleWishlist,
      isInWishlist: jest.fn().mockReturnValue(true),
      toggleSaved: mockToggleSaved,
      isSaved: jest.fn().mockReturnValue(true),
      recordRecentlyViewed: jest.fn(),
      addToCompare: mockAddToCompare,
      removeFromCompare: jest.fn(),
      clearCompare: jest.fn(),
      isInCompare: jest.fn().mockReturnValue(false),
      ...authOverrides
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders WishlistPage with items and responds to remove click', () => {
    renderWithContext(<WishlistPage />);

    expect(screen.getByRole('heading', { name: /My/i })).toBeInTheDocument();
    expect(screen.getByText('Ultra Gaming Laptop')).toBeInTheDocument();

    const removeBtn = screen.getByLabelText(/Remove Ultra Gaming Laptop from wishlist/i);
    fireEvent.click(removeBtn);
    expect(mockToggleWishlist).toHaveBeenCalledWith('prod-001');
  });

  it('renders WishlistPage empty state when no items exist', () => {
    renderWithContext(<WishlistPage />, { wishlist: [] });
    expect(screen.getByText(/Your Wishlist is Empty/i)).toBeInTheDocument();
  });

  it('renders SavedProductsPage with bookmarked items and handles unsave', () => {
    renderWithContext(<SavedProductsPage />);

    expect(screen.getByRole('heading', { name: /Saved/i })).toBeInTheDocument();
    expect(screen.getByText('Ultra Gaming Laptop')).toBeInTheDocument();

    const unsaveBtn = screen.getByLabelText(/Unsave Ultra Gaming Laptop/i);
    fireEvent.click(unsaveBtn);
    expect(mockToggleSaved).toHaveBeenCalledWith('prod-001');
  });

  it('renders RecentlyViewedPage with history items', () => {
    renderWithContext(<RecentlyViewedPage />);

    expect(screen.getByRole('heading', { name: /Recently/i })).toBeInTheDocument();
    expect(screen.getByText('Ultra Gaming Laptop')).toBeInTheDocument();
    expect(screen.getByText('Asus ROG')).toBeInTheDocument();
  });

  it('renders WishlistPage sign in prompt when unauthenticated', () => {
    renderWithContext(<WishlistPage />, { token: null, isAuthenticated: false });
    expect(screen.getByText(/Sign In to View Your Wishlist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In Now/i })).toBeInTheDocument();
  });

  it('renders SavedProductsPage sign in prompt when unauthenticated', () => {
    renderWithContext(<SavedProductsPage />, { token: null, isAuthenticated: false });
    expect(screen.getByText(/Sign In to View Saved Hardware/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In Now/i })).toBeInTheDocument();
  });

  it('renders AccountPage dashboard with stats, tabs, and sign out button', () => {
    renderWithContext(<AccountPage />);

    expect(screen.getByText('Aryan Tester')).toBeInTheDocument();
    expect(screen.getByText('tester@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Verified Engineer/i)).toBeInTheDocument();

    const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
    fireEvent.click(signOutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });
});
