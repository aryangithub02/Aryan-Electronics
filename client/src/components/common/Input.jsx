import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          spellCheck={false}
          data-lpignore="true"
          className={`block w-full rounded-xl bg-slate-900/80 border ${
            error
              ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
          } text-slate-100 placeholder-slate-500 text-sm py-2.5 ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
