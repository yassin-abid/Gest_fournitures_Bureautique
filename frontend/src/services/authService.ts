/**
 * Authentication Service
 */

import apiClient from './apiClient';
import type { User, AuthResponse, LoginRequest } from '@/types/auth';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Connexion impossible. Vérifiez vos identifiants.');
    }
  },

  /**
   * Register new user
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department?: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription.');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Non authentifié');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignorer les erreurs de logout (le token local sera supprimé de toute façon)
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { token });
    return response.data;
  },
};
