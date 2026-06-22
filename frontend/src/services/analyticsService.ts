import apiClient from './apiClient';

export interface DashboardData {
  monthlyData: Array<{ month: string; amount: number; orders: number }>;
  categorySpending: Array<{ name: string; amount: number; percentage: number; color: string }>;
  departmentSpending: Array<{ name: string; amount: number; percentage: number }>;
  aiForecasts: Array<{ article: string; currentStock: number; threshold: number; forecast1m: number; forecast3m: number; trend: string; confidence: number }>;
  autoSuggestions: Array<{ article: string; suggestedQty: number; reason: string; urgency: string }>;
  criticalStock: Array<{ article: string; stock: number; threshold: number; supplier: string }>;
}

export const analyticsService = {
  getDashboardData: async (period: string = 'year') => {
    return apiClient.get<DashboardData>(`/analytics/dashboard?period=${period}`);
  }
};
