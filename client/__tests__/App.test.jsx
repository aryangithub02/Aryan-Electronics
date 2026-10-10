import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock api to prevent network calls in tests
jest.mock('../src/services/api', () => ({
  getProducts: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: 'mock-1',
        title: 'Mock Laptop',
        brand: 'MockBrand',
        sector: 'Computing & Gaming',
        category: 'Laptops',
        description: 'Test description',
        price: 999,
        discountPercentage: 10,
        rating: 4.5,
        stock: 10,
        SKU: 'MCK-001'
      }
    ]
  }),
  getSectors: jest.fn().mockResolvedValue({
    success: true,
    data: [
      { name: 'Computing & Gaming', productCount: 1, categories: ['Laptops'] }
    ]
  }),
  getProductById: jest.fn().mockResolvedValue({
    success: true,
    data: null
  }),
  getAggregatedProducts: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: 'mock-1',
        title: 'Mock Laptop',
        brand: 'MockBrand',
        sector: 'Computing & Gaming',
        category: 'Laptops',
        description: 'Test description',
        price: 999,
        discountPercentage: 10,
        rating: 4.5,
        stock: 10,
        SKU: 'MCK-001'
      }
    ],
    total: 1,
    providerBreakdown: { local: 1, external: 0 }
  }),
  getAggregatedProductById: jest.fn().mockResolvedValue({
    success: true,
    data: null
  }),
  getHealth: jest.fn().mockResolvedValue({
    success: true,
    status: 'healthy'
  })
}));

describe('App Component', () => {
  it('renders without crashing and displays brand header', () => {
    render(<App />);
    const aryanElements = screen.getAllByText(/Aryan/i);
    expect(aryanElements.length).toBeGreaterThan(0);
    const aggElements = screen.getAllByText(/AGGREGATION ENGINE/i);
    expect(aggElements.length).toBeGreaterThan(0);
  });

  it('renders main navigation links', () => {
    render(<App />);
    expect(screen.getAllByRole('link', { name: /Home/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Sectors/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Products/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Compare/i })[0]).toBeInTheDocument();
  });
});
