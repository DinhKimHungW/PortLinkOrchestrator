import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);
const DEFAULT_DURATION = 4000;
const VARIANT_STYLES = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  info: 'border-sky-300 bg-sky-50 text-sky-900',
};

export function ToastProvider({ children, duration = DEFAULT_DURATION }) {
  const [toasts, setToasts] = useState([]);
  const queue = useRef([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const add = useCallback(
    ({ title, description, variant = 'info', autoClose = true, timeout } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
      const toast = {
        id,
        title,
        description,
        variant,
        autoClose,
        timeout: timeout ?? duration,
      };
      setToasts((current) => [...current, toast]);
      queue.current = [...queue.current, toast];
      return id;
    },
    [duration],
  );

  useEffect(() => {
    if (!queue.current.length) return undefined;

    const timers = queue.current.map((toast) => {
      if (!toast.autoClose) return null;
      const timeoutId = setTimeout(() => dismiss(toast.id), toast.timeout);
      return timeoutId;
    });

    queue.current = [];
    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [toasts, dismiss]);

  const value = useMemo(
    () => ({
      push: add,
      dismiss,
    }),
    [add, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const variantClass = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded border px-4 py-3 shadow-lg shadow-slate-900/10 ${variantClass}`}
              role="status"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                  {toast.description && <p className="mt-1 text-sm leading-relaxed opacity-90">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  className="text-sm font-medium opacity-60 transition hover:opacity-100"
                  onClick={() => dismiss(toast.id)}
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
