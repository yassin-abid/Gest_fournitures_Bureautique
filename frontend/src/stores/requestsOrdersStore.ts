/**
 * Requests and Orders Store
 */

import { create } from 'zustand';
import type { SupplyRequest, Order } from '@/types/requests';

interface RequestsOrdersState {
  requests: SupplyRequest[];
  orders: Order[];
  selectedRequest: SupplyRequest | null;
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Request Actions
  setRequests: (requests: SupplyRequest[]) => void;
  addRequest: (request: SupplyRequest) => void;
  updateRequest: (request: SupplyRequest) => void;
  deleteRequest: (id: number) => void;
  setSelectedRequest: (request: SupplyRequest | null) => void;

  // Order Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: number) => void;
  setSelectedOrder: (order: Order | null) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRequestsOrdersStore = create<RequestsOrdersState>((set) => ({
  requests: [],
  orders: [],
  selectedRequest: null,
  selectedOrder: null,
  isLoading: false,
  error: null,

  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),
  updateRequest: (request) =>
    set((state) => ({
      requests: state.requests.map((r) => (r.id === request.id ? request : r)),
      selectedRequest: state.selectedRequest?.id === request.id ? request : state.selectedRequest,
    })),
  deleteRequest: (id: number) =>
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== id),
      selectedRequest: state.selectedRequest?.id === id ? null : state.selectedRequest,
    })),
  setSelectedRequest: (request) => set({ selectedRequest: request }),

  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),
  updateOrder: (order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === order.id ? order : o)),
      selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
      selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    })),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
