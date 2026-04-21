import { create } from 'zustand';
import { BudgetsApi, BudgetPerformance } from '../api/budgets.api';

interface BudgetsState {
  budgetsPerformance: BudgetPerformance[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBudgetsPerformance: (ledgerId: string, month: number, year: number) => Promise<void>;
  reset: () => void;
}

export const useBudgetsStore = create<BudgetsState>((set) => ({
  budgetsPerformance: [],
  isLoading: false,
  error: null,

  fetchBudgetsPerformance: async (ledgerId, month, year) => {
    set({ isLoading: true, error: null });
    try {
      const data = await BudgetsApi.getBudgetPerformance(ledgerId, month, year);
      set({ budgetsPerformance: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Error al obtener el desempeño de presupuestos',
        isLoading: false,
      });
    }
  },

  reset: () =>
    set({
      budgetsPerformance: [],
      isLoading: false,
      error: null,
    }),
}));
