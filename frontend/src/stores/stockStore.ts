/**
 * Stock Store
 */

import { create } from 'zustand';
import type { StockStatus, StockMovement, StockAlert } from '@/types/stock';

interface StockState {
  stockItems: StockStatus[];
  movements: StockMovement[];
  alerts: StockAlert[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setStockItems: (items: StockStatus[]) => void;
  updateStockItem: (item: StockStatus) => void;

  setMovements: (movements: StockMovement[]) => void;
  addMovement: (movement: StockMovement) => void;

  setAlerts: (alerts: StockAlert[]) => void;
  updateAlert: (alert: StockAlert) => void;
  resolveAlert: (alertId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStockStore = create<StockState>((set) => ({
  stockItems: [],
  movements: [],
  alerts: [],
  isLoading: false,
  error: null,

  setStockItems: (items) => set({ stockItems: items }),
  updateStockItem: (item) =>
    set((state) => ({
      stockItems: state.stockItems.map((s) => (s.id === item.id ? item : s)),
    })),

  setMovements: (movements) => set({ movements }),
  addMovement: (movement) =>
    set((state) => ({
      movements: [movement, ...state.movements],
    })),

  setAlerts: (alerts) => set({ alerts }),
  updateAlert: (alert) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a)),
    })),
  resolveAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
