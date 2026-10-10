import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/layout/Layout';
import HomePage from '../src/pages/HomePage';
import SectorsPage from '../src/pages/SectorsPage';
import ProductsPage from '../src/pages/ProductsPage';
import ProductDetailPage from '../src/pages/ProductDetailPage';
import ComparePage from '../src/pages/ComparePage';
import NotFoundPage from '../src/pages/NotFoundPage';

jest.mock('../src/services/api', () => {
  const mockProducts = [
    {
      id: 'mock-101',
      title: 'Quantum Test Unit',
      brand: 'TestBrand',
      sector: 'Computing & Gaming',
      category: 'Workstations',
      description: 'Test description for unit testing.',
      price: 500,
      discountPercentage: 0,
      rating: 4.9,
      stock: 5,
      SKU: 'QTU-101',
      specifications: [{ name: 'CPU', value: 'Octa-Core' }],
      sellers: [{ name: 'Test Seller', rating: 4.8, price: 500, inStock: true }]
    }
  ];

  return {
    getProducts: jest.fn().mockResolvedValue({
      success: true,
      data: mockProducts
    }),
    getAggregatedProducts: jest.fn().mockResolvedValue({
      success: true,
      data: mockProducts,
      total: 1,
      providerBreakdown: { local: 1, external: 0 }
    }),
    getSectors: jest.fn().mockResolvedValue({
      success: true,
      data: [
        { name: 'Computing & Gaming', productCount: 1, categories: ['Workstations'] }
      ]
    }),
    getProductById: jest.fn().mockResolvedValue({
      success: true,
      data: mockProducts[0]
    }),
    getAggregatedProductById: jest.fn().mockResolvedValue({
      success: true,
      data: mockProducts[0]
    }),
    getHealth: jest.fn().mockResolvedValue({ success: true, status: 'healthy' })
  };
});

const renderRoute = (initialPath) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </MemoryRouter>
  );
};

describe('Route Navigation Tests', () => {
  it('renders Home page at "/"', async () => {
    renderRoute('/');
    await waitFor(() => {
      expect(screen.getByText(/Discover, Compare & Aggregate/i)).toBeInTheDocument();
    });
  });

  it('renders Sectors page at "/sectors"', async () => {
    renderRoute('/sectors');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Electronics Sectors/i })).toBeInTheDocument();
    });
  });

  it('renders Products catalog at "/products"', async () => {
    renderRoute('/products');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Product Catalog/i })).toBeInTheDocument();
    });
  });

  it('renders Compare page at "/compare"', async () => {
    renderRoute('/compare');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Product Comparison/i })).toBeInTheDocument();
    });
  });

  it('renders 404 Not Found at unknown route', async () => {
    renderRoute('/some-random-unknown-route');
    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });
  });
});
