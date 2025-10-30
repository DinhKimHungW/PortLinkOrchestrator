import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import routes from '../../constants/routes';
import { Button } from '../ui';
import LanguageSwitcher from './LanguageSwitcher';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from '../../i18n/LanguageProvider';

const NAV_ITEMS = [
  { to: routes.dashboard, labelKey: 'nav.dashboard' },
  { to: routes.report, labelKey: 'nav.report' },
];

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  const activeSection = useMemo(() => {
    const current = NAV_ITEMS.find((item) => {
      if (item.to === routes.dashboard) {
        return location.pathname === routes.root || location.pathname.startsWith(item.to);
      }
      return location.pathname.startsWith(item.to);
    });
    return current ? t(current.labelKey) : null;
  }, [location.pathname, t]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate(routes.login, { replace: true });
  };

  const renderNavLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        clsx(
          'rounded-full px-3 py-1 text-sm font-medium transition-colors',
          isActive ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
        )
      }
      onClick={() => setMenuOpen(false)}
    >
      {t(item.labelKey)}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to={routes.dashboard} className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-bold uppercase tracking-[0.2em] text-white">
                PL
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 sm:inline-flex">
                Portlink
              </span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">{NAV_ITEMS.map(renderNavLink)}</nav>
          </div>
          <div className="flex items-center gap-3">
            {activeSection && (
              <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 lg:inline">
                {activeSection}
              </span>
            )}
            <div className="hidden items-center gap-2 sm:flex">
              <LanguageSwitcher selectClassName="border-slate-300" />
              {user && (
                <div className="text-right text-xs">
                  <span className="block font-semibold text-slate-700">{user.name || user.username || user.email}</span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">{t('nav.online')}</span>
                </div>
              )}
            </div>
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
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">{NAV_ITEMS.map(renderNavLink)}</nav>
            <div className="mt-4 flex flex-col gap-3">
              <LanguageSwitcher />
              {user && (
                <span className="text-sm font-semibold text-slate-700">{user.name || user.username || user.email}</span>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} PortLink Orchestrator</span>
          <span>{t('nav.support')}</span>
        </div>
      </footer>
    </div>
  );
}
