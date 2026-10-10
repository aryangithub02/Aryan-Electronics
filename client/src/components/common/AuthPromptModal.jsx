import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Heart, Bookmark, X, LogIn, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export const AuthPromptModal = ({ isOpen, onClose, message, type = 'wishlist' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    navigate('/login', { state: { from: location } });
  };

  const handleRegister = () => {
    onClose();
    navigate('/register', { state: { from: location } });
  };

  const isSaved = type === 'saved';
  const Icon = isSaved ? Bookmark : Heart;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 p-0.5 shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Icon className="w-6 h-6 text-rose-400 fill-rose-500/20" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-300">
              <Lock className="w-3 h-3" />
              <span>Authentication Required</span>
            </div>
            <h3 id="auth-prompt-title" className="text-xl font-extrabold text-white pt-1">
              {isSaved ? 'Save Hardware to Account' : 'Sign In to Save Favorites'}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {message ||
            'You must be signed in to save items to your wishlist or collection. Sign in now to sync your saved electronics across all your devices.'}
        </p>

        {/* Benefits list */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Sync wishlist & hardware bookmarks across devices</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Receive distributor stock & price alert updates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Build custom comparison matrices and BOM drafts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={LogIn}
            onClick={handleSignIn}
            className="shadow-lg shadow-brand-500/25"
          >
            Sign In to Continue
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleRegister}
          >
            Create Free Account
          </Button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel and continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
