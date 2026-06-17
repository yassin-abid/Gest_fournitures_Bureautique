/**
 * Main App Component with Routing
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';

// Pages
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ArticlesPage } from '@pages/ArticlesPage';
import { CategoriesPage } from '@pages/CategoriesPage';
import { SuppliersPage } from '@pages/SuppliersPage';
import { StockStatusPage } from '@pages/StockStatusPage';
import { StockMovementsPage } from '@pages/StockMovementsPage';
import { StockAlertsPage } from '@pages/StockAlertsPage';
import { RequestsListPage } from '@pages/RequestsListPage';
import { CreateRequestPage } from '@pages/CreateRequestPage';
import { RequestDetailsPage } from '@pages/RequestDetailsPage';
import { OrdersListPage } from '@pages/OrdersListPage';
import { CreateOrderPage } from '@pages/CreateOrderPage';
import { OrderDetailsPage } from '@pages/OrderDetailsPage';
import { ReportsPage } from '@pages/ReportsPage';
import { AnalyticsPage } from '@pages/AnalyticsPage';
import { SettingsPage } from '@pages/SettingsPage';
import { RolesPermissionsPage } from '@pages/RolesPermissionsPage';
import { UsersManagementPage } from '@pages/UsersManagementPage';
import { ProfilePage } from '@pages/ProfilePage';

/**
 * Protected Route Component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * App Component
 */
export const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catalog Routes */}
        <Route
          path="/catalog/articles"
          element={
            <ProtectedRoute>
              <ArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/suppliers"
          element={
            <ProtectedRoute>
              <SuppliersPage />
            </ProtectedRoute>
          }
        />

        {/* Stock Routes */}
        <Route
          path="/stock/status"
          element={
            <ProtectedRoute>
              <StockStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/movements"
          element={
            <ProtectedRoute>
              <StockMovementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/alerts"
          element={
            <ProtectedRoute>
              <StockAlertsPage />
            </ProtectedRoute>
          }
        />

        {/* Requests Routes */}
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/create"
          element={
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Orders Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/create"
          element={
            <ProtectedRoute requiredRole={['admin', 'purchase_manager']}>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Reports Routes */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole={['admin', 'purchase_manager', 'stock_manager']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/analytics"
          element={
            <ProtectedRoute requiredRole={['admin', 'purchase_manager']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <UsersManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <RolesPermissionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Category Root Redirects */}
        <Route path="/catalog" element={<Navigate to="/catalog/articles" replace />} />
        <Route path="/stock" element={<Navigate to="/stock/status" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />

        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
