import React from 'react';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  fullWidth,
  disabled,
  isLoading,
  onClick,
  className = ''
}) => {
  const baseClasses = "transition-colors duration-200 rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2";
  
  let variantClasses = "";
  if (variant === 'primary') {
    variantClasses = "bg-[var(--action-primary-bg-default)] text-[var(--action-primary-text)] hover:bg-[var(--action-primary-bg-hover)] disabled:opacity-70";
  } else if (variant === 'secondary') {
    variantClasses = "bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-70";
  }

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
    >
      {isLoading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </button>
  );
};