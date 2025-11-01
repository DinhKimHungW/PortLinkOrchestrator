import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ReportPage from '../pages/ReportPage';
import NotFoundPage from '../pages/NotFoundPage';
import IncidentsPage from '../pages/IncidentsPage';
import AssetsPage from '../pages/AssetsPage';
import VisitsPage from '../pages/VisitsPage';
import PrivateRoute from './PrivateRoute';
import routes from '../constants/routes';
import AppShell from '../components/layout/AppShell';

export default function AppRoutes() {
  const renderWithShell = (Component) => (
    <PrivateRoute>
      <AppShell>
        <Component />
      </AppShell>
    </PrivateRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.root} element={renderWithShell(DashboardPage)} />
        <Route path={routes.dashboard} element={renderWithShell(DashboardPage)} />
    <Route path={routes.incidents} element={renderWithShell(IncidentsPage)} />
    <Route path={routes.assets} element={renderWithShell(AssetsPage)} />
    <Route path={routes.visits} element={renderWithShell(VisitsPage)} />
        <Route path={routes.report} element={renderWithShell(ReportPage)} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.notFound} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
