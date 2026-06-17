/**
 * Stock Service
 */

import apiClient from './apiClient';
import type { StockStatus, StockMovement, StockAlert, CreateStockMovementRequest } from '@/types/stock';
import type { PaginatedResponse } from '@/types/common';

export const stockService = {
  // Stock Status
  getStockStatus: async (
    page = 1,
    limit = 20,
    search = ''
  ): Promise<PaginatedResponse<StockStatus>> => {
    const response = await apiClient.get<PaginatedResponse<StockStatus>>('/stock/status', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getStockStatusByArticle: async (articleId: string): Promise<StockStatus> => {
    const response = await apiClient.get<StockStatus>(`/stock/status/${articleId}`);
    return response.data;
  },

  // Stock Movements
  getMovements: async (
    page = 1,
    limit = 20,
    articleId?: string
  ): Promise<PaginatedResponse<StockMovement>> => {
    const response = await apiClient.get<PaginatedResponse<StockMovement>>('/stock/movements', {
      params: { page, limit, articleId },
    });
    return response.data;
  },

  createMovement: async (data: CreateStockMovementRequest): Promise<StockMovement> => {
    const response = await apiClient.post<StockMovement>('/stock/movements', data);
    return response.data;
  },

  // Stock Alerts
  getAlerts: async (
    page = 1,
    limit = 10,
    status = 'active'
  ): Promise<PaginatedResponse<StockAlert>> => {
    const response = await apiClient.get<PaginatedResponse<StockAlert>>('/stock/alerts', {
      params: { page, limit, status },
    });
    return response.data;
  },

  getAlertById: async (id: string): Promise<StockAlert> => {
    const response = await apiClient.get<StockAlert>(`/stock/alerts/${id}`);
    return response.data;
  },

  resolveAlert: async (id: string): Promise<StockAlert> => {
    const response = await apiClient.put<StockAlert>(`/stock/alerts/${id}/resolve`, {});
    return response.data;
  },

  // Stock Adjustments
  adjustStock: async (articleId: string, quantity: number, reason: string): Promise<void> => {
    await apiClient.post('/stock/adjust', { articleId, quantity, reason });
  },
};
