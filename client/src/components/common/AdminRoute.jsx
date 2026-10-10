import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-mono text-slate-400">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-slate-900 border border-rose-500/30 rounded-2xl text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 text-3xl">
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Administrator Access Required</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          The requested area is restricted to authorized Aryan Electronics system administrators.
          Your current account (<span className="text-cyan-400">{user?.email}</span>) does not hold administrative privileges.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700"
          >
            Return to Store
          </Link>
          <Link
            to="/account"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20"
          >
            Account Details
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
