import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  const hoverClasses = hoverEffect
    ? 'hover:border-brand-500/40 hover:shadow-glow-brand transition-all duration-300'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${hoverClasses} ${clickableClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
