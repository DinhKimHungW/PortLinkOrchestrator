import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '' }) {
  return <div className={clsx('rounded bg-white p-4 text-slate-900 shadow', className)}>{children}</div>;
}
