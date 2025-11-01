import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import routes from '../../constants/routes';
import { Button } from '../ui';
import LanguageSwitcher from './LanguageSwitcher';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from '../../i18n/LanguageProvider';
import { useTheme } from '../../theme/ThemeProvider';

const NAV_ITEMS = [
  { key: 'dashboard', to: routes.dashboard, labelKey: 'nav.dashboard', Icon: DashboardIcon },
  { key: 'incidents', to: routes.incidents, labelKey: 'nav.incidents', Icon: IncidentIcon },
  { key: 'assets', to: routes.assets, labelKey: 'nav.assets', Icon: AssetIcon },
  { key: 'visits', to: routes.visits, labelKey: 'nav.visits', Icon: VisitIcon },
  { key: 'report', to: routes.report, labelKey: 'nav.report', Icon: ReportIcon },
];

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const { theme, toggleTheme, isDark } = useTheme();

  const activeNavItem = useMemo(() => {
    const current = NAV_ITEMS.find((item) => {
      if (item.to === routes.dashboard) {
        return location.pathname === routes.root || location.pathname.startsWith(item.to);
      }
      return location.pathname.startsWith(item.to);
    });
    return current;
  }, [location.pathname]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate(routes.login, { replace: true });
  };

  const renderNavLink = (item) => {
    const { Icon } = item;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          clsx(
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-sky-600/10 text-sky-700 ring-1 ring-inset ring-sky-600/20'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800/60',
          )
        }
        onClick={() => setMenuOpen(false)}
      >
        <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-600" />
        <span>{t(item.labelKey)}</span>
      </NavLink>
    );
  };

  return (
    <div className="relative flex min-h-screen bg-muted text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-base bg-surface/95 px-4 py-6 shadow-sm backdrop-blur md:flex">
        <Link to={routes.dashboard} className="flex items-center gap-3 px-1 text-slate-700 dark:text-slate-100">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold uppercase tracking-[0.25em] text-white">
            PL
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Portlink</p>
            <p className="text-[11px] uppercase tracking-[0.35em] text-soft">Orchestrator</p>
          </div>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">{NAV_ITEMS.map(renderNavLink)}</nav>
        <div className="mt-auto space-y-4 border-t border-base/60 pt-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-lg border border-base/80 px-3 py-2 text-sm text-slate-500 transition hover:border-sky-300 hover:text-sky-600 dark:text-slate-300"
          >
            <span>{t('nav.themeToggle')}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-soft">
              {t(isDark ? 'common.darkTheme' : 'common.lightTheme')}
            </span>
          </button>
          <div className="flex items-center justify-between text-xs text-soft">
            <div>
              <p className="font-semibold text-slate-600 dark:text-slate-200">{user?.name || user?.username || user?.email}</p>
              <p>{t('nav.online')}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-72 bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Portlink</span>
              <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}>
                ×
              </Button>
            </div>
            <nav className="mt-6 flex flex-col gap-2">{NAV_ITEMS.map(renderNavLink)}</nav>
            <div className="mt-6 space-y-3 text-sm">
              <LanguageSwitcher />
              <button
                type="button"
                className="flex items-center justify-between rounded border border-base px-3 py-2"
                onClick={toggleTheme}
              >
                <span>{t('nav.themeToggle')}</span>
                <span>{t(isDark ? 'common.darkTheme' : 'common.lightTheme')}</span>
              </button>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            </div>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-base/80 bg-surface/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMenuOpen((flag) => !flag)}>
                <span className="sr-only">{t('nav.toggle')}</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-12.75 5.25h12.75" />
                  )}
                </svg>
              </Button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-soft">
                  {activeNavItem ? t(activeNavItem.labelKey) : 'PortLink'}
                </p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-soft/70">{t('nav.support')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher selectClassName="border-base" />
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden items-center gap-2 rounded border border-base px-3 py-2 text-xs font-semibold uppercase tracking-wide text-soft transition hover:border-sky-300 hover:text-sky-600 md:flex"
              >
                <ThemeIcon className="h-4 w-4" isDark={isDark} />
                {t(isDark ? 'common.darkTheme' : 'common.lightTheme')}
              </button>
              <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted px-4 py-6 md:px-6 lg:px-10">{children}</main>

        <footer className="border-t border-base/60 bg-surface/90 px-4 py-4 text-xs text-soft md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; {new Date().getFullYear()} PortLink Orchestrator</span>
            <span>{t('nav.support')}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function DashboardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 10h6V4H3v6Z" />
      <path d="M3 20h6v-6H3v6Z" />
      <path d="M15 20h6V10h-6v10Z" />
      <path d="M15 4v4h6V4h-6Z" />
    </svg>
  );
}

function IncidentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 4L3 19h18L12 4Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function AssetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <path d="M9 12h6" />
    </svg>
  );
}

function VisitIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 17h18l-2.5-8h-13L3 17Z" />
      <path d="M6 9V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" />
      <circle cx="7.5" cy="19.5" r="1.5" />
      <circle cx="16.5" cy="19.5" r="1.5" />
    </svg>
  );
}

function ReportIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7 4h10l3 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M7 8h13" />
      <path d="M11 12h6" />
      <path d="M11 16h6" />
    </svg>
  );
}

function ThemeIcon({ className, isDark }) {
  if (isDark) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
