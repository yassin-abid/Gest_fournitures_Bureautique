/**
 * Request and Orders Types
 */

export type RequestStatus = 'en_attente' | 'approuvée' | 'refusée' | 'annulée' | 'livrée' | 'traitee';
export type RequestPriority = 'basse' | 'normale' | 'haute' | 'urgente';

export interface RequestItem {
  id: number;
  articleId: number;
  articleName?: string;
  quantity: number;
  approvedQuantity?: number;
  unit?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface SupplyRequest {
  id: number;
  requestNumber: string;
  userId: number;
  userName?: string;
  department?: string;
  status: RequestStatus;
  priority: RequestPriority;
  items: RequestItem[];
  justification?: string;
  estimatedBudget?: number;
  approvedBy?: number;
  rejectionReason?: string;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  updatedAt: string;
}

export type OrderStatus = 'en_attente' | 'confirmée' | 'expédiée' | 'livrée' | 'partielle' | 'annulée';

export interface OrderItem {
  id: number;
  articleId: number;
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
  id: number;
  orderNumber: string;
  requestId?: number;
  requestNumber?: string;
  supplierId: number;
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
  articleId: number;
  quantity: number;
  notes?: string;
}

export interface CreateOrderRequest {
  requestId?: number;
  supplierId: number;
  items: CreateOrderItemRequest[];
  paymentTerms?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface CreateOrderItemRequest {
  articleId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
