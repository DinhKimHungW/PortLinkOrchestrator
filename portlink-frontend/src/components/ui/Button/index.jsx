import React from 'react';
import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-sky-600 text-white shadow-sm hover:bg-sky-700',
  secondary: 'border border-sky-200 bg-white text-sky-600 shadow-sm hover:bg-sky-50',
  ghost: 'bg-transparent text-sky-600 hover:bg-sky-100',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center rounded font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        variant === 'ghost' ? 'shadow-none' : null,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
