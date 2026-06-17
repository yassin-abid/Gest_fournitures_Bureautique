/**
 * Stock Management Types
 */

export interface StockMovement {
  id: string;
  articleId: string;
  articleName?: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  reason?: string;
  notes?: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

export interface StockAlert {
  id: string;
  articleId: string;
  articleName?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  alertType: 'low' | 'high' | 'critical';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface StockStatus {
  id: string;
  articleId: string;
  code: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: 'normal' | 'low' | 'critical' | 'excess';
  lastMovement?: string;
  updatedAt: string;
}

export interface CreateStockMovementRequest {
  articleId: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  reason?: string;
  notes?: string;
}
