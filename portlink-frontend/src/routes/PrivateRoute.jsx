import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import routes from '../constants/routes';
import { Spinner } from '../components/ui';

export default function PrivateRoute({ children }) {
  const { user, initialized, loading } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  return children;
}
