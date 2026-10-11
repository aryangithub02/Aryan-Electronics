import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import Navbar from '../src/components/layout/Navbar';

describe('Navbar Component', () => {
  it('renders logo and navigation links', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Aryan/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sectors')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });

  it('renders quick search input placeholder', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getAllByPlaceholderText(/Search for products, brands, or categories/i)[0]).toBeInTheDocument();
  });
});
