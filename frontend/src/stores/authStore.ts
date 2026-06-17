/**
 * Authentication Store
 */

import { create } from 'zustand';
import type { User, UserRole } from '@/types/auth';
import { localStorageUtil, storageKeys } from '@utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorageUtil.set(storageKeys.token, token);
    } else {
      localStorageUtil.remove(storageKeys.token);
    }
  },

  login: (user, token) => {
    set({ user, token, isAuthenticated: true, error: null });
    localStorageUtil.set(storageKeys.user, user);
    localStorageUtil.set(storageKeys.token, token);
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    localStorageUtil.remove(storageKeys.user);
    localStorageUtil.remove(storageKeys.token);
  },

  setError: (error) => set({ error }),

  setLoading: (loading) => set({ isLoading: loading }),

  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to everything

    // Permission-to-role mapping matching the 5-role spec
    const permissionRoleMap: Record<string, string[]> = {
      'view_stock':          ['gestionnaire_stock'],
      'manage_stock':        ['gestionnaire_stock'],
      'approve_requests':    ['responsable_service'],
      'manage_orders':       ['responsable_achats'],
      'view_reports':        ['gestionnaire_stock', 'responsable_achats'],
      'view_ai_forecasts':   ['responsable_achats'],
      'submit_requests':     ['employe', 'gestionnaire_stock', 'responsable_service', 'responsable_achats'],
    };

    return permissionRoleMap[permission]?.includes(user.role) ?? false;
  },

  initializeAuth: () => {
    const user = localStorageUtil.get<User>(storageKeys.user);
    const token = localStorageUtil.get<string>(storageKeys.token);

    if (user && token) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
