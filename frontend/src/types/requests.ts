/**
 * Request and Orders Types
 */

export type RequestStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RequestItem {
  id: string;
  articleId: string;
  articleName?: string;
  quantity: number;
  unit?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface SupplyRequest {
  id: string;
  requestNumber: string;
  userId: string;
  userName?: string;
  department?: string;
  status: RequestStatus;
  priority: RequestPriority;
  items: RequestItem[];
  justification?: string;
  estimatedBudget?: number;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  updatedAt: string;
}

export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  articleId: string;
  articleName?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  totalPrice?: number;
  receivedQuantity?: number;
  invoiceNumber?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount?: number;
  paymentTerms?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestRequest {
  priority: RequestPriority;
  items: CreateRequestItemRequest[];
  justification?: string;
  department?: string;
}

export interface CreateRequestItemRequest {
  articleId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderRequest {
  supplierId: string;
  items: CreateOrderItemRequest[];
  paymentTerms?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface CreateOrderItemRequest {
  articleId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
