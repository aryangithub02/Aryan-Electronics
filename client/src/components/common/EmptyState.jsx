import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters to find what you are looking for.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-brand-400 mb-4 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
