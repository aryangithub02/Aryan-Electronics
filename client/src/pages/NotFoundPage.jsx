import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-cyan-400 mb-2 shadow-inner">
        <Cpu className="w-10 h-10" />
      </div>

      <span className="font-mono text-sm uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
        404 • Signal Lost
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-400 max-w-md leading-relaxed">
        The hardware destination or catalog route you requested does not exist or has been relocated within Aryan Electronics.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary" icon={ArrowLeft}>
            Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
