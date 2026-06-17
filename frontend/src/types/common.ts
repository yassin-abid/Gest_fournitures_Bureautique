/**
 * Common Types
 */

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'danger';

export interface Notification {
  id: string;
  type: AlertType;
  message: string;
  title?: string;
  duration?: number;
  timestamp: string;
}

export interface Modal {
  isOpen: boolean;
  title?: string;
  content?: string;
  type?: 'confirm' | 'alert' | 'form';
  data?: any;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface SortOption {
  field: string;
  label: string;
  order?: 'asc' | 'desc';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}
