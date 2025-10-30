import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/features/auth/LoginForm';
import { Card } from '../components/ui';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import useAuth from '../hooks/useAuth';
import routes from '../constants/routes';
import { useTranslation } from '../i18n/LanguageProvider';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const t = useTranslation();

  useEffect(() => {
    if (initialized && user) {
      navigate(routes.dashboard, { replace: true });
    }
  }, [initialized, navigate, user]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative flex min-h-[40vh] w-full items-end justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white md:w-1/2 md:items-start md:justify-normal md:p-12">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute -left-10 top-16 h-56 w-56 rounded-full bg-sky-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-400/30 blur-3xl" />
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-sky-200">
            Portlink orchestrator
          </span>
          <h1 className="mt-6 text-3xl font-semibold md:text-4xl lg:text-5xl">{t('app.name')}</h1>
          <p className="mt-4 max-w-md text-sm text-sky-100 md:text-base">{t('app.tagline')}</p>
        </div>
        <LanguageSwitcher
          className="relative z-10 text-white"
          labelClassName="text-white/80"
          selectClassName="bg-white/10 text-white border-white/20"
        />
      </div>
      <div className="flex w-full items-center justify-center bg-slate-50 p-6 md:w-1/2">
        <Card className="w-full max-w-md border border-slate-200 shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">{t('auth.loginTitle')}</h2>
          <p className="mb-6 text-sm text-slate-500">{t('app.tagline')}</p>
          <LoginForm onSuccess={() => navigate(routes.dashboard, { replace: true })} />
        </Card>
      </div>
    </div>
  );
}
