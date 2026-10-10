import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComparePage from '../src/pages/ComparePage';
import { AuthContext } from '../src/context/AuthContext';
import api from '../src/services/api';

jest.mock('../src/services/api', () => ({
  getProducts: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: 'prod-A',
        title: 'Device Alpha',
        brand: 'BrandA',
        sector: 'Computing & Gaming',
        price: 1000,
        discountPercentage: 0,
        rating: 4.5,
        stock: 10,
        SKU: 'DEV-A',
        specifications: [{ name: 'CPU', value: 'Intel i7' }]
      },
      {
        id: 'prod-B',
        title: 'Device Beta',
        brand: 'BrandB',
        sector: 'Mobile & Audio',
        price: 800,
        discountPercentage: 10,
        rating: 4.8,
        stock: 5,
        SKU: 'DEV-B',
        specifications: [{ name: 'CPU', value: 'AMD Ryzen 7' }]
      }
    ]
  })
}));

describe('Phase 2 Comparison Matrix UI Tests', () => {
  const mockRemoveFromCompare = jest.fn();
  const mockClearCompare = jest.fn();
  const mockAddToCompare = jest.fn();

  const mockCompareItems = [
    {
      id: 'prod-A',
      title: 'Device Alpha',
      brand: 'BrandA',
      sector: 'Computing & Gaming',
      price: 1000,
      discountPercentage: 0,
      rating: 4.5,
      stock: 10,
      SKU: 'DEV-A',
      specifications: [{ name: 'CPU', value: 'Intel i7' }]
    },
    {
      id: 'prod-B',
      title: 'Device Beta',
      brand: 'BrandB',
      sector: 'Mobile & Audio',
      price: 800,
      discountPercentage: 10,
      rating: 4.8,
      stock: 5,
      SKU: 'DEV-B',
      specifications: [{ name: 'CPU', value: 'AMD Ryzen 7' }]
    }
  ];

  const renderWithAuth = (comparisonList = mockCompareItems) => {
    return render(
      <AuthContext.Provider
        value={{
          comparisonList,
          addToCompare: mockAddToCompare,
          removeFromCompare: mockRemoveFromCompare,
          clearCompare: mockClearCompare,
          isAuthenticated: true
        }}
      >
        <MemoryRouter>
          <ComparePage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders ComparePage matrix with products and their parameters', async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Product Comparison/i })).toBeInTheDocument();
      expect(screen.getByText('Device Alpha')).toBeInTheDocument();
      expect(screen.getByText('Device Beta')).toBeInTheDocument();
    });

    expect(screen.getByText('Comparing (2 of 4 max devices)')).toBeInTheDocument();
    expect(screen.getByText('Intel i7')).toBeInTheDocument();
    expect(screen.getByText('AMD Ryzen 7')).toBeInTheDocument();
  });

  it('toggles difference highlighting mode', async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText('Device Alpha')).toBeInTheDocument();
    });

    const highlightBtn = screen.getByRole('button', { name: /Highlight Differences/i });
    fireEvent.click(highlightBtn);

    expect(screen.getByText(/Differences Highlighted/i)).toBeInTheDocument();
  });

  it('calls clearCompare when Clear All button is clicked', async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText('Device Alpha')).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearBtn);

    expect(mockClearCompare).toHaveBeenCalled();
  });

  it('calls removeFromCompare when individual remove button is clicked', async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText('Device Alpha')).toBeInTheDocument();
    });

    const removeBtn = screen.getByLabelText(/Remove Device Alpha from compare/i);
    fireEvent.click(removeBtn);

    expect(mockRemoveFromCompare).toHaveBeenCalledWith('prod-A');
  });

  it('renders empty comparison state when no products are selected', async () => {
    renderWithAuth([]);

    await waitFor(() => {
      expect(screen.getByText(/No Products in Comparison Matrix/i)).toBeInTheDocument();
    });
  });
});
