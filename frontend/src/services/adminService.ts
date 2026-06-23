/**
 * Admin Service
 */

import apiClient from './apiClient';
import type { User } from '@/types/auth';
import type { Role, SystemSettings, AuditLog } from '@/types/admin';
import type { PaginatedResponse } from '@/types/common';

export const adminService = {
  // Users Management
  getUsers: async (page = 1, limit = 10, role?: string, search?: string): Promise<PaginatedResponse<User>> => {
    const params: any = { page, limit };
    if (role) params.role = role;
    if (search) params.search = search;
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await apiClient.post<User>('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  hardDeleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}/hard`);
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(`/admin/users/${id}/deactivate`, {});
    return response.data;
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await apiClient.post<User>(`/admin/users/${id}/activate`, {});
    return response.data;
  },

  resetUserPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/admin/users/${id}/reset-password`,
      { newPassword }
    );
    return response.data;
  },

  // Roles Management
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/admin/roles');
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await apiClient.get<Role>(`/admin/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
    const response = await apiClient.post<Role>('/admin/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Role> => {
    const response = await apiClient.put<Role>(`/admin/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/roles/${id}`);
  },

  // Settings
  getSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get<SystemSettings>('/admin/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await apiClient.put<SystemSettings>('/admin/settings', data);
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (page = 1, limit = 20): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<PaginatedResponse<AuditLog>>('/admin/logs', {
      params: { page, limit },
    });
    return response.data;
  },
};
