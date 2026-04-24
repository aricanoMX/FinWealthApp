import { create } from 'zustand';
import {
  TransactionsApi,
  AccountSuggestion,
  CreateTransaction,
  Transaction,
} from '../api/transactions.api';

interface TransactionsState {
  suggestions: AccountSuggestion[];
  transactions: Transaction[];
  total: number;
  page: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Actions
  fetchSuggestions: (ledgerId: string) => Promise<void>;
  createTransaction: (data: CreateTransaction) => Promise<void>;
  fetchTransactions: (ledgerId: string, isRefresh?: boolean) => Promise<void>;
  fetchNextPage: (ledgerId: string) => Promise<void>;
  reset: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  suggestions: [],
  transactions: [],
  total: 0,
  page: 1,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  fetchTransactions: async (ledgerId, isRefresh = false) => {
    set({ isLoading: isRefresh ? true : get().isLoading, error: null });
    try {
      const pageToFetch = isRefresh ? 1 : 1;
      const limit = 20;
      const offset = (pageToFetch - 1) * limit;

      const data = await TransactionsApi.getTransactions(ledgerId, limit, offset);
      set({
        transactions: data.data,
        total: data.total,
        page: 1,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Error al obtener transacciones',
        isLoading: false,
      });
    }
  },

  fetchNextPage: async (ledgerId) => {
    const { transactions, total, page, isLoadingMore } = get();
    if (isLoadingMore || transactions.length >= total) return;

    set({ isLoadingMore: true, error: null });
    try {
      const limit = 20;
      const nextPage = page + 1;
      const offset = (nextPage - 1) * limit;

      const data = await TransactionsApi.getTransactions(ledgerId, limit, offset);
      set({
        transactions: [...transactions, ...data.data],
        total: data.total,
        page: nextPage,
        isLoadingMore: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Error al obtener más transacciones',
        isLoadingMore: false,
      });
    }
  },

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
      transactions: [],
      total: 0,
      page: 1,
      isLoading: false,
      isLoadingMore: false,
      error: null,
    }),
}));
