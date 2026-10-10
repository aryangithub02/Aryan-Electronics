import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';
import ProtectedRoute from '../src/components/common/ProtectedRoute';
import { AuthContext } from '../src/context/AuthContext';

describe('Phase 2 Authentication UI Tests', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuth = (ui, authOverrides = {}) => {
    const authValue = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      wishlist: [],
      savedProducts: [],
      recentlyViewed: [],
      comparisonList: [],
      login: mockLogin,
      register: mockRegister,
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
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders LoginPage with email and password inputs and submits credentials', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    renderWithAuth(<LoginPage />);

    expect(screen.getByRole('heading', { name: /Welcome/i })).toBeInTheDocument();
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Aryan Electronics/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123!'
      });
    });
  });

  it('validates email and password on LoginPage', async () => {
    renderWithAuth(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /Sign In to Aryan Electronics/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Email address is required/i)).toBeInTheDocument();
  });

  it('renders RegisterPage and checks password match validation', async () => {
    renderWithAuth(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /Create an/i })).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitBtn = screen.getByRole('button', { name: /Create My Free Account/i });

    fireEvent.change(nameInput, { target: { value: 'New Engineer' } });
    fireEvent.change(emailInput, { target: { value: 'engineer@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Secured123!' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPassword!' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits valid registration form', async () => {
    mockRegister.mockResolvedValueOnce({ success: true });

    renderWithAuth(<RegisterPage />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitBtn = screen.getByRole('button', { name: /Create My Free Account/i });

    fireEvent.change(nameInput, { target: { value: 'Engineer Aryan' } });
    fireEvent.change(emailInput, { target: { value: 'aryan@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Engineer Aryan',
        email: 'aryan@example.com',
        password: 'Password123!'
      });
    });
  });

  it('guards protected routes when unauthenticated', () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          user: null
        }}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret User Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Redirect Target</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Secret User Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page Redirect Target')).toBeInTheDocument();
  });

  it('allows access to protected routes when authenticated', () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          isLoading: false,
          user: { name: 'Aryan Dev' }
        }}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret User Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Secret User Content')).toBeInTheDocument();
  });
});
