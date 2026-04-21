import { create } from 'zustand';
import { AnalyticsApi } from '../api/analytics.api';
import type { NetWorthResponse, CashFlowResponse } from '../api/analytics.api';

interface AnalyticsState {
  netWorth: NetWorthResponse | null;
  cashFlow: CashFlowResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNetWorth: (ledgerId: string, date?: string) => Promise<void>;
  fetchCashFlow: (ledgerId: string, startDate: string, endDate: string) => Promise<void>;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  netWorth: null,
  cashFlow: null,
  isLoading: false,
  error: null,

  fetchNetWorth: async (ledgerId, date) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AnalyticsApi.getNetWorth(ledgerId, date);
      set({ netWorth: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Error al obtener el patrimonio neto',
        isLoading: false,
      });
    }
  },

  fetchCashFlow: async (ledgerId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AnalyticsApi.getCashFlow(ledgerId, startDate, endDate);
      set({ cashFlow: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Error al obtener el flujo de caja',
        isLoading: false,
      });
    }
  },

  reset: () =>
    set({
      netWorth: null,
      cashFlow: null,
      isLoading: false,
      error: null,
    }),
}));
