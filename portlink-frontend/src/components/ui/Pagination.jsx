import React from 'react';
import clsx from 'clsx';

export default function Pagination({ page = 1, pageSize = 10, total = 0, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const current = Math.min(Math.max(1, page), totalPages);

  const goTo = (nextPage) => {
    if (!onChange) return;
    if (nextPage < 1 || nextPage > totalPages || nextPage === current) return;
    onChange(nextPage);
  };

  const pages = [];
  const siblings = 1;
  const startPage = Math.max(1, current - siblings);
  const endPage = Math.min(totalPages, current + siblings);
  for (let index = startPage; index <= endPage; index += 1) {
    pages.push(index);
  }

  if (!onChange || totalPages === 1) {
    return (
      <div className="flex items-center justify-end text-xs text-soft">
        <span>
          {current} / {totalPages}
        </span>
      </div>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 text-sm" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        disabled={current === 1}
        className="rounded border border-base px-2 py-1 text-xs transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      {startPage > 1 && (
        <button
          type="button"
          onClick={() => goTo(1)}
          className={clsx(
            'hidden rounded border border-base px-2 py-1 text-xs transition sm:inline-flex',
            current === 1 && 'bg-sky-600 text-white',
          )}
        >
          1
        </button>
      )}
      {startPage > 2 && <span className="text-xs text-soft">…</span>}
      {pages.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => goTo(value)}
          className={clsx(
            'rounded border border-base px-2 py-1 text-xs transition',
            value === current ? 'bg-sky-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          {value}
        </button>
      ))}
      {endPage < totalPages - 1 && <span className="text-xs text-soft">…</span>}
      {endPage < totalPages && (
        <button
          type="button"
          onClick={() => goTo(totalPages)}
          className={clsx(
            'hidden rounded border border-base px-2 py-1 text-xs transition sm:inline-flex',
            current === totalPages && 'bg-sky-600 text-white',
          )}
        >
          {totalPages}
        </button>
      )}
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        disabled={current === totalPages}
        className="rounded border border-base px-2 py-1 text-xs transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
