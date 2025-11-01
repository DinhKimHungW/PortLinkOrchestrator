import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-lg border border-base bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
