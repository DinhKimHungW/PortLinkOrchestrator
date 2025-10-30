import React from 'react';
import clsx from 'clsx';

export default function Select({ label, className = '', options = [], helperText, allowEmpty = false, placeholder = '--', ...props }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label && <span className="mb-1 block">{label}</span>}
      <select
        className={clsx(
          'block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
          className,
        )}
        {...props}
      >
        {allowEmpty && (
          <option value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <span className="mt-1 block text-xs text-gray-500">{helperText}</span>}
    </label>
  );
}
