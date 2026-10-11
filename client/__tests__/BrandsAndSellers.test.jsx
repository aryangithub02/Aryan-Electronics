import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BrandLogos from '../src/components/common/BrandLogos';
import BrandsPage from '../src/pages/BrandsPage';

describe('Brands and Sellers Component Tests', () => {
  it('BrandLogos renders popular sellers and allows switching to top brands', () => {
    render(
      <BrowserRouter>
        <BrandLogos />
      </BrowserRouter>
    );

    // Initial sellers tab view
    expect(screen.getByText(/Top Verified Sellers & Leading Brands/i)).toBeInTheDocument();
    expect(screen.getByText('Amazon India')).toBeInTheDocument();
    expect(screen.getByText('Croma')).toBeInTheDocument();
    expect(screen.getByText('IndustryBuying')).toBeInTheDocument();

    // Click Top Brands tab
    const brandsTabButton = screen.getByRole('button', { name: /Top Brands/i });
    fireEvent.click(brandsTabButton);

    expect(screen.getByText(/Explore all 15\+ verified hardware manufacturers/i)).toBeInTheDocument();
  });

  it('BrandsPage renders search input, filters, sellers, and brands', () => {
    render(
      <BrowserRouter>
        <BrandsPage />
      </BrowserRouter>
    );

    // Header and stats
    expect(screen.getByRole('heading', { level: 1, name: /Brands & Verified Sellers Directory/i })).toBeInTheDocument();
    expect(screen.getByText(/Verified Merchant Network/i)).toBeInTheDocument();
    expect(screen.getByText('11+')).toBeInTheDocument();
    expect(screen.getAllByText(/Verified Sellers/i)[0]).toBeInTheDocument();

    // Verify key sellers rendered
    expect(screen.getByText('Amazon India')).toBeInTheDocument();
    expect(screen.getByText('Robu.in')).toBeInTheDocument();
    expect(screen.getByText('RS Components India')).toBeInTheDocument();

    // Filter by search
    const searchInput = screen.getByPlaceholderText(/Search seller or brand name/i);
    fireEvent.change(searchInput, { target: { value: 'Robu' } });

    expect(screen.getByText('Robu.in')).toBeInTheDocument();
    expect(screen.queryByText('Amazon India')).not.toBeInTheDocument();
  });
});
