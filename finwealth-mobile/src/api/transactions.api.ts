import { apiClient } from './client';

export interface AccountSuggestion {
  accountId: string;
  name: string;
  count: number;
}

export interface CreateJournalEntry {
  accountId: string;
  amount: string;
  isDeductible?: boolean;
  taxAmount?: string;
}

export interface CreateTransaction {
  ledgerId: string;
  date: string;
  description: string;
  entries: CreateJournalEntry[];
}

export interface TransactionEntry {
  id: string;
  transactionId: string;
  accountId: string;
  amount: string;
  isDeductible: boolean;
  taxAmount: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  ledgerId: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  entries: TransactionEntry[];
}

export interface GetTransactionsResponse {
  data: Transaction[];
  total: number;
}

export const TransactionsApi = {
  getTransactions: async (
    ledgerId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<GetTransactionsResponse> => {
    const response = await apiClient.get(`/transactions`, {
      params: { ledgerId, limit, offset },
    });
    return {
      data: response.data.data,
      total: response.data.total,
    };
  },

  exportCsv: async (ledgerId: string): Promise<Blob> => {
    const response = await apiClient.get(`/analytics/export`, {
      params: { ledgerId },
      responseType: 'blob',
    });
    return response.data;
  },

  getSuggestions: async (ledgerId: string): Promise<AccountSuggestion[]> => {
    const response = await apiClient.get(`/transactions/suggestions`, {
      params: { ledgerId },
    });
    return response.data.data;
  },

  createTransaction: async (data: CreateTransaction): Promise<{ id: string }> => {
    const response = await apiClient.post(`/transactions`, data);
    return response.data.data;
  },

  updateTransaction: async (
    id: string,
    data: Partial<CreateTransaction>,
  ): Promise<{ id: string }> => {
    const response = await apiClient.patch(`/transactions/${id}`, data);
    return response.data.data;
  },
};
