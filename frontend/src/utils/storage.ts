/**
 * Storage Utilities for LocalStorage and SessionStorage
 */

export const storageKeys = {
  user: 'user',
  token: 'token',
  refreshToken: 'refreshToken',
  theme: 'theme',
  language: 'language',
  sidebarCollapsed: 'sidebarCollapsed',
  recentSearches: 'recentSearches',
  savedFilters: 'savedFilters',
  userPreferences: 'userPreferences',
};

export const localStorageUtil = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export const sessionStorageUtil = {
  set: (key: string, value: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  },

  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error getting sessionStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },
};
