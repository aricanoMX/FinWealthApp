import { create } from 'zustand';
import { TransactionsApi, AccountSuggestion, CreateTransaction } from '../api/transactions.api';

interface TransactionsState {
  suggestions: AccountSuggestion[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSuggestions: (ledgerId: string) => Promise<void>;
  createTransaction: (data: CreateTransaction) => Promise<void>;
  reset: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  suggestions: [],
  isLoading: false,
  error: null,

  fetchSuggestions: async (ledgerId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await TransactionsApi.getSuggestions(ledgerId);
      set({ suggestions: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Error al obtener sugerencias',
        isLoading: false,
      });
    }
  },

  createTransaction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await TransactionsApi.createTransaction(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Error al crear la transacción',
        isLoading: false,
      });
      throw err;
    }
  },

  reset: () =>
    set({
      suggestions: [],
      isLoading: false,
      error: null,
    }),
}));
