import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductCard from '../src/components/product/ProductCard';
import ProductDetailPage from '../src/pages/ProductDetailPage';
import { ComparePage } from '../src/pages/ComparePage';
import { AuthContext } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import api from '../src/services/api';

jest.mock('../src/services/api');

describe('Frontend Real Products Integration Tests', () => {
  const mockAuthContext = {
    user: { id: 'user-1', name: 'Test Engineer', email: 'engineer@aryan.com' },
    isAuthenticated: true,
    wishlist: [],
    savedProducts: [],
    recentlyViewed: [],
    comparisonList: [],
    toggleWishlist: jest.fn(),
    isInWishlist: jest.fn().mockReturnValue(false),
    toggleSaved: jest.fn(),
    isSaved: jest.fn().mockReturnValue(false),
    addToCompare: jest.fn().mockResolvedValue({ success: true }),
    removeFromCompare: jest.fn(),
    clearCompare: jest.fn(),
    isInCompare: jest.fn().mockReturnValue(false),
    recordRecentlyViewed: jest.fn()
  };

  const realProductSample = {
    id: 1,
    SKU: 'AE-EDU-PRD-001',
    sku: 'AE-EDU-PRD-001',
    title: 'Acer Chromebook 314 (CB314-2H/CB314-2HT)',
    brand: 'Acer',
    sector: 'Education',
    category: 'Chromebook laptop',
    description: 'Acer portable ChromeOS laptop for education and productivity.',
    price: 22299,
    discountPercentage: 38,
    rating: 3.8,
    stock: 50,
    thumbnail: 'https://cdn.assets.prezly.com/5da9e86f-cf33-4c43-92b3-52f93f412382/-/preview/-/format/auto/Acer-Chromebook-314-CB314-2H(T)_01.jpg',
    images: [
      'https://cdn.assets.prezly.com/5da9e86f-cf33-4c43-92b3-52f93f412382/-/preview/-/format/auto/Acer-Chromebook-314-CB314-2H(T)_01.jpg'
    ],
    specifications: [
      { name: 'Operating System', value: 'Chrome OS' },
      { name: 'Processor', value: 'MediaTek MT8183 octa-core' }
    ],
    features: ['Long battery life', 'Spill-resistant keyboard'],
    useCases: ['Classroom learning', 'Remote studying'],
    sellers: [
      {
        name: 'Amazon India',
        price: 22299,
        availability: 'In Stock',
        rating: 4.2,
        url: 'https://www.amazon.in/dp/B08X'
      }
    ],
    sources: [
      {
        type: 'official_product_page',
        url: 'https://www.acer.com/us-en/chromebooks/acer-chromebook-314'
      }
    ]
  };

  const realNullPriceProduct = {
    id: 15,
    SKU: 'AE-HLT-PRD-015',
    sku: 'AE-HLT-PRD-015',
    title: 'Mindray BeneVision N15',
    brand: 'Mindray',
    sector: 'Healthcare',
    category: 'Patient Monitor',
    description: 'Hospital-grade critical care patient monitoring workstation.',
    price: null,
    discountPercentage: 0,
    rating: 4.8,
    stock: null,
    thumbnail: 'https://www.mindray.com/content/dam/mindray/en/products/patient-monitoring/benevision-n15/overview.jpg',
    images: [
      'https://www.mindray.com/content/dam/mindray/en/products/patient-monitoring/benevision-n15/overview.jpg'
    ],
    specifications: [
      { name: 'Screen Size', value: '15.6 inch capacitive touchscreen' }
    ],
    features: ['Advanced arrhythmia detection'],
    useCases: ['Intensive Care Unit (ICU)'],
    sellers: [
      {
        name: 'Mindray Direct Commercial',
        price: null,
        availability: 'Custom Hospital Quote',
        rating: 4.9,
        url: 'https://www.mindray.com/en/contact'
      }
    ],
    sources: [
      {
        type: 'official_product_page',
        url: 'https://www.mindray.com/en/products/patient-monitoring/benevision-n15'
      }
    ]
  };

  it('ProductCard renders real product data directly with no placehold.co images', () => {
    render(
      <CartProvider>
        <AuthContext.Provider value={mockAuthContext}>
          <BrowserRouter>
            <ProductCard product={realProductSample} />
          </BrowserRouter>
        </AuthContext.Provider>
      </CartProvider>
    );

    expect(screen.getByText('Acer Chromebook 314 (CB314-2H/CB314-2HT)')).toBeInTheDocument();
    expect(screen.getByText('Acer')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', realProductSample.thumbnail);
    expect(img.getAttribute('src')).not.toContain('placehold.co');
  });

  it('ProductCard displays Price on Request and Availability on Request for commercial items with null price/stock', () => {
    render(
      <CartProvider>
        <AuthContext.Provider value={mockAuthContext}>
          <BrowserRouter>
            <ProductCard product={realNullPriceProduct} />
          </BrowserRouter>
        </AuthContext.Provider>
      </CartProvider>
    );

    expect(screen.getByText('Mindray BeneVision N15')).toBeInTheDocument();
    expect(screen.getByText('Price on Request')).toBeInTheDocument();
    expect(screen.getByText('Availability on Request')).toBeInTheDocument();
  });

  it('ProductCard image triggers onError fallback cleanly without breaking', () => {
    render(
      <CartProvider>
        <AuthContext.Provider value={mockAuthContext}>
          <BrowserRouter>
            <ProductCard product={realProductSample} />
          </BrowserRouter>
        </AuthContext.Provider>
      </CartProvider>
    );

    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('ProductDetailPage renders specifications, sellers, and sources with safe external links', async () => {
    api.getProductById.mockResolvedValueOnce({
      success: true,
      data: realProductSample
    });

    render(
      <CartProvider>
        <AuthContext.Provider value={mockAuthContext}>
          <MemoryRouter initialEntries={['/products/1']}>
            <Routes>
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </CartProvider>
    );

    expect(await screen.findByText('Acer Chromebook 314 (CB314-2H/CB314-2HT)')).toBeInTheDocument();
    expect(screen.getByText('Operating System')).toBeInTheDocument();
    expect(screen.getByText('Chrome OS')).toBeInTheDocument();

    // Multi-Seller Aggregation Matrix
    expect(screen.getByText('Multi-Seller Aggregation Matrix')).toBeInTheDocument();
    expect(screen.getByText('Amazon India')).toBeInTheDocument();
    const sellerLink = screen.getByRole('link', { name: /view product/i });
    expect(sellerLink).toHaveAttribute('href', 'https://www.amazon.in/dp/B08X');
    expect(sellerLink).toHaveAttribute('target', '_blank');
    expect(sellerLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Verified Sources & Documentation
    expect(screen.getByText('Verified Sources & Manufacturer Documentation')).toBeInTheDocument();
    const sourceLink = screen.getByText('https://www.acer.com/us-en/chromebooks/acer-chromebook-314').closest('a');
    expect(sourceLink).toHaveAttribute('target', '_blank');
    expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('ComparePage handles comparing products with real pricing and null pricing gracefully', async () => {
    api.getProducts.mockResolvedValueOnce({
      success: true,
      data: [realProductSample, realNullPriceProduct]
    });

    const compareAuth = {
      ...mockAuthContext,
      comparisonList: [realProductSample, realNullPriceProduct]
    };

    render(
      <CartProvider>
        <AuthContext.Provider value={compareAuth}>
          <BrowserRouter>
            <ComparePage />
          </BrowserRouter>
        </AuthContext.Provider>
      </CartProvider>
    );

    expect(await screen.findByText('Acer Chromebook 314 (CB314-2H/CB314-2HT)')).toBeInTheDocument();
    expect(screen.getByText('Mindray BeneVision N15')).toBeInTheDocument();
    expect(screen.getByText('Price on Request')).toBeInTheDocument();
    expect(screen.getByText('Availability on Request')).toBeInTheDocument();
  });
});
