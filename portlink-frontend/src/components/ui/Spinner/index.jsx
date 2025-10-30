import React from 'react';
import clsx from 'clsx';

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-[3px]',
  lg: 'h-10 w-10 border-4',
};

export default function Spinner({ size = 'md', className = '', label = 'Loading' }) {
  const dimension = SIZES[size] || SIZES.md;

  return (
    <span className={clsx('inline-flex items-center justify-center', className)} role="status" aria-label={label}>
      <span className={clsx('inline-block animate-spin rounded-full border-sky-500 border-t-transparent', dimension)} />
    </span>
  );
}
