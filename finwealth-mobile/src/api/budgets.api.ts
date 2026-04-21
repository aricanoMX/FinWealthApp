import { apiClient } from './client';

export interface BudgetPerformance {
  id: string;
  accountId?: string | null;
  category?: string | null;
  amountLimit: number;
  amountSpent: number;
  percentage: number;
}

export const BudgetsApi = {
  /**
   * Obtiene el desempeño de los presupuestos para un ledger y periodo específico.
   */
  getBudgetPerformance: async (
    ledgerId: string,
    month: number,
    year: number,
  ): Promise<BudgetPerformance[]> => {
    const response = await apiClient.get<BudgetPerformance[]>('/budgets/performance', {
      params: { ledgerId, month, year },
    });
    return response.data;
  },
};
