/**
 * Authentication Service
 */

import apiClient from './apiClient';
import type { User, AuthResponse, LoginRequest } from '@/types/auth';

// Demo credentials — 5 roles as per system specification
const DEMO_CREDENTIALS: Record<string, { id: string; password: string; role: string; firstName: string; lastName: string; department: string }> = {
  'admin@hammemi.com':               { id: 'usr-admin', password: 'Admin123!',     role: 'admin',               firstName: 'Karim',   lastName: 'Administrateur', department: 'Informatique' },
  'resp.service@hammemi.com':        { id: 'usr-resp',  password: 'Service123!',   role: 'responsable_service', firstName: 'Sonia',   lastName: 'Ben Ali',        department: 'Ressources Humaines' },
  'gestionnaire.stock@hammemi.com':  { id: 'usr-stock', password: 'Stock123!',     role: 'gestionnaire_stock',  firstName: 'Mourad',  lastName: 'Gharbi',         department: 'Logistique' },
  'resp.achats@hammemi.com':         { id: 'usr-achats',password: 'Achats123!',    role: 'responsable_achats',  firstName: 'Leila',   lastName: 'Mansour',        department: 'Achats & Finance' },
  'employe@hammemi.com':             { id: 'usr-emp',   password: 'Employe123!',   role: 'employe',             firstName: 'Youssef', lastName: 'Trabelsi',       department: 'Commercial' },
};

// Build a full User object from a DEMO_CREDENTIALS entry
const getMockUser = (email: string, creds: typeof DEMO_CREDENTIALS[string]): User => ({
  id: creds.id,
  email,
  firstName: creds.firstName,
  lastName: creds.lastName,
  role: creds.role as User['role'],
  department: creds.department,
  permissions: [],
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock authentication response
const getMockAuthResponse = (email: string, creds: typeof DEMO_CREDENTIALS[string]): AuthResponse => ({
  user: getMockUser(email, creds),
  token: `mock_jwt_token_${Date.now()}`,
  refreshToken: `mock_refresh_token_${Date.now()}`,
});

export const authService = {
  /**
   * Login with email and password
   * Supports both real API and mock credentials for development
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Check for a known demo/mock account — never hit the network for these
    const demoKey = Object.keys(DEMO_CREDENTIALS).find(
      (k) => k.toLowerCase() === email
    );
    const demo = demoKey ? DEMO_CREDENTIALS[demoKey] : undefined;

    if (demo) {
      // Known demo email — validate password locally
      if (demo.password !== password) {
        throw new Error('Mot de passe incorrect. Vérifiez vos identifiants.');
      }
      await new Promise(resolve => setTimeout(resolve, 400)); // simulate latency
      return getMockAuthResponse(demoKey!, demo);
    }

    // Unknown email — try the real API
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Connexion impossible. Vérifiez vos identifiants.');
    }
  },

  /**
   * Register new user
   * Mock implementation for development
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      user: {
        id: Math.random().toString(36).substring(7),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'employe',
        permissions: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: `mock_jwt_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
    };
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch {
      // Return mock user if API fails
      const token = localStorage.getItem('authToken');
      if (token) {
        return getMockUser('employe@hammemi.com', { id: 'usr-emp', password: '', role: 'employe', firstName: 'Youssef', lastName: 'Trabelsi', department: 'Commercial' });
      }
      throw new Error('Not authenticated');
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
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh token
   */
  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { token });
    return response.data;
  },
};
