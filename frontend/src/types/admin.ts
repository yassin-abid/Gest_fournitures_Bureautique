/**
 * Admin Types
 */

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  userCount?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  maxUploadSize: number;
  sessionTimeout: number;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: string;
  status: 'success' | 'failed';
}
