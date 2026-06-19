/**
 * Orders Service
 */

import apiClient from './apiClient';
import type { Order, CreateOrderRequest } from '@/types/requests';
import type { PaginatedResponse } from '@/types/common';

export const ordersService = {
  // Get all orders
  getOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit, status },
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  // Update order
  updateOrder: async (id: number, data: Partial<CreateOrderRequest>): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  // Confirm order
  confirmOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/confirm`, {});
    return response.data;
  },

  // Ship order
  shipOrder: async (id: number, trackingNumber?: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/ship`, { trackingNumber });
    return response.data;
  },

  // Receive delivery
  receiveDelivery: async (id: number, items: Array<{ itemId: number; quantity: number }>): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/receive`, { items });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: number, reason?: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },

  // Generate invoice
  generateInvoice: async (id: number): Promise<{ url: string }> => {
    const response = await apiClient.post<{ url: string }>(`/orders/${id}/invoice`, {});
    return response.data;
  },

  // Export order
  exportOrder: async (id: number, format: 'pdf' | 'excel'): Promise<Blob> => {
    const response = await apiClient.get(`/orders/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};
