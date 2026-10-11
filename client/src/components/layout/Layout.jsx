import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';
import AuthPromptModal from '../common/AuthPromptModal';
import { useAuth } from '../../context/AuthContext';

export const Layout = ({ children }) => {
  const { authPrompt, closeAuthPrompt } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fb] text-slate-800 antialiased selection:bg-blue-600 selection:text-white font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <AuthPromptModal
        isOpen={Boolean(authPrompt?.isOpen)}
        onClose={closeAuthPrompt}
        message={authPrompt?.message}
        type={authPrompt?.type}
      />
    </div>
  );
};

export default Layout;
