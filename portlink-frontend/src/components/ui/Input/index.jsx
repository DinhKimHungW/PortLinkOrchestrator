import React from 'react';

export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label && <span className="mb-1 block">{label}</span>}
      <input
        className={`block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${className}`}
        {...props}
      />
    </label>
  );
}
