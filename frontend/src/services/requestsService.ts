/**
 * Requests Service
 */

import apiClient from './apiClient';
import type { SupplyRequest, CreateRequestRequest } from '@/types/requests';
import type { PaginatedResponse } from '@/types/common';

export const requestsService = {
  // Get all requests
  getRequests: async (
    page = 1,
    limit = 10,
    status?: string
  ): Promise<PaginatedResponse<SupplyRequest>> => {
    const response = await apiClient.get<PaginatedResponse<SupplyRequest>>('/requests', {
      params: { page, limit, status },
    });
    return response.data;
  },

  // Get request by ID
  getRequestById: async (id: number): Promise<SupplyRequest> => {
    const response = await apiClient.get<SupplyRequest>(`/requests/${id}`);
    return response.data;
  },

  // Create request
  createRequest: async (data: CreateRequestRequest): Promise<SupplyRequest> => {
    const response = await apiClient.post<SupplyRequest>('/requests', data);
    return response.data;
  },

  // Update request
  updateRequest: async (id: number, data: Partial<CreateRequestRequest>): Promise<SupplyRequest> => {
    const response = await apiClient.put<SupplyRequest>(`/requests/${id}`, data);
    return response.data;
  },

  // Submit request
  submitRequest: async (id: number): Promise<SupplyRequest> => {
    const response = await apiClient.post<SupplyRequest>(`/requests/${id}/submit`, {});
    return response.data;
  },

  // Approve request
  approveRequest: async (id: number, notes?: string): Promise<SupplyRequest> => {
    const response = await apiClient.post<SupplyRequest>(`/requests/${id}/approve`, { notes });
    return response.data;
  },

  // Reject request
  rejectRequest: async (id: number, reason: string): Promise<SupplyRequest> => {
    const response = await apiClient.post<SupplyRequest>(`/requests/${id}/reject`, { reason });
    return response.data;
  },

  // Cancel request
  cancelRequest: async (id: number): Promise<SupplyRequest> => {
    const response = await apiClient.post<SupplyRequest>(`/requests/${id}/cancel`, {});
    return response.data;
  },

  // Delete request
  deleteRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/requests/${id}`);
  },
};
