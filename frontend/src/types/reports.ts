/**
 * Dashboard and Reports Types
 */

export interface DashboardStats {
  totalArticles: number;
  activeSuppliers: number;
  pendingRequests: number;
  pendingOrders: number;
  lowStockAlerts: number;
  totalUsers: number;
}

export interface DashboardChartData {
  label: string;
  value: number;
  percentage?: number;
}

export interface ReportRequest {
  startDate: string;
  endDate: string;
  reportType: 'stock' | 'requests' | 'orders' | 'spending' | 'usage';
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  generatedBy: string;
  fileUrl: string;
  fileSize: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AnalyticsData {
  period: string;
  totalSpending: number;
  orderCount: number;
  requestCount: number;
  averageOrderValue: number;
  topSuppliers: Array<{
    name: string;
    amount: number;
    orderCount: number;
  }>;
  topArticles: Array<{
    name: string;
    quantity: number;
    spending: number;
  }>;
}
