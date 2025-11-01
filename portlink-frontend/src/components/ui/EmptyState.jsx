import React from 'react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
      {icon && <div className="text-3xl" aria-hidden>{icon}</div>}
      {title && <h3 className="text-base font-semibold text-slate-700">{title}</h3>}
      {description && <p className="max-w-sm text-sm leading-relaxed">{description}</p>}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
