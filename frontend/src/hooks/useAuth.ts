/**
 * useAuth Hook
 */

import React, { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { authService } from '@services/authService';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Initialize auth on mount
    authStore.initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    authStore.setLoading(true);
    authStore.setError(null);
    try {
      const response = await authService.login({ email, password });
      authStore.login(response.user, response.token);
      return response;
    } catch (error: any) {
      authStore.setError(error.message || 'Login failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  const register = async (data: any) => {
    authStore.setLoading(true);
    authStore.setError(null);
    try {
      const response = await authService.register(data);
      // Wait for login to be called after register
      return response;
    } catch (error: any) {
      authStore.setError(error.message || 'Registration failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  const logout = async () => {
    authStore.setLoading(true);
    try {
      await authService.logout();
    } finally {
      authStore.logout();
      authStore.setLoading(false);
    }
  };

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login,
    register,
    logout,
    hasRole: authStore.hasRole,
    hasPermission: authStore.hasPermission,
  };
};

/**
 * useNotification Hook
 */
export const useNotification = () => {
  const { addNotification, removeNotification } = useUIStore();

  const showSuccess = (message: string, title = 'Success') => {
    const notification = {
      type: 'success' as const,
      message,
      title,
    };
    addNotification(notification);
  };

  const showError = (message: string, title = 'Error') => {
    const notification = {
      type: 'error' as const,
      message,
      title,
    };
    addNotification(notification);
  };

  const showWarning = (message: string, title = 'Warning') => {
    const notification = {
      type: 'warning' as const,
      message,
      title,
    };
    addNotification(notification);
  };

  const showInfo = (message: string, title = 'Info') => {
    const notification = {
      type: 'info' as const,
      message,
      title,
    };
    addNotification(notification);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};

/**
 * useAsync Hook
 */
interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncState<T> & { execute: () => Promise<void> } => {
  const [state, setState] = React.useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = React.useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
    } catch (error) {
      setState({ data: null, error: error as Error, isLoading: false });
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};
