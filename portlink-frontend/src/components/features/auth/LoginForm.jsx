import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import useAuth from '../../../hooks/useAuth';
import { useTranslation } from '../../../i18n/LanguageProvider';

export default function LoginForm({ onSuccess }) {
  const { login, loading } = useAuth();
  const t = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await login({ username, password, remember });
      if (data?.access_token && onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const message = err?.response?.data?.message || t('auth.invalid');
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('auth.username')}
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="ops01"
        required
        autoComplete="username"
      />
      <Input
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="********"
        required
        autoComplete="current-password"
      />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="h-4 w-4"
        />
        {t('auth.rememberMe')}
      </label>
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('auth.loggingIn') : t('auth.login')}
      </Button>
    </form>
  );
}
