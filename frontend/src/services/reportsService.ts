/**
 * Reports Service
 */

import apiClient from './apiClient';
import type { AnalyticsData, ActivityLog } from '@/types/reports';
import type { PaginatedResponse } from '@/types/common';

export const reportsService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<any> => {
    const response = await apiClient.get('/reports/dashboard-stats');
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (
    startDate: string,
    endDate: string,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/reports/analytics', {
      params: { startDate, endDate, period },
    });
    return response.data;
  },

  // Get activity logs
  getActivityLogs: async (page = 1, limit = 20): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await apiClient.get<PaginatedResponse<ActivityLog>>('/reports/activity-logs', {
      params: { page, limit },
    });
    return response.data;
  },

  // Generate report
  generateReport: async (data: {
    type: 'stock' | 'requests' | 'orders' | 'spending' | 'usage';
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> => {
    const response = await apiClient.post('/reports/generate', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get stock report
  getStockReport: async (
    startDate: string,
    endDate: string
  ): Promise<{ movements: any[]; summary: any }> => {
    const response = await apiClient.get('/reports/stock', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get spending report
  getSpendingReport: async (
    startDate: string,
    endDate: string
  ): Promise<{ total: number; bySupplier: any[]; byCategory: any[] }> => {
    const response = await apiClient.get('/reports/spending', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Export report
  exportReport: async (id: string, format: 'pdf' | 'excel'): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};
