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

export const TransactionsApi = {
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
};
