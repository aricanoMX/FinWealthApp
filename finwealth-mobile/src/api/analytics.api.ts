import { apiClient } from './client';

export interface NetWorthResponse {
  assets: string;
  liabilities: string;
  netWorth: string;
}

export interface CashFlowResponse {
  income: string;
  expenses: string;
  netCashFlow: string;
}

export const AnalyticsApi = {
  /**
   * Obtiene el patrimonio neto (Activos + Pasivos) para un ledger específico.
   */
  getNetWorth: async (ledgerId: string, date?: string): Promise<NetWorthResponse> => {
    const response = await apiClient.get<NetWorthResponse>('/analytics/net-worth', {
      params: { ledgerId, date },
    });
    return response.data;
  },

  /**
   * Obtiene el flujo de caja (Ingresos vs Gastos) para un periodo específico.
   */
  getCashFlow: async (
    ledgerId: string,
    startDate: string,
    endDate: string,
  ): Promise<CashFlowResponse> => {
    const response = await apiClient.get<CashFlowResponse>('/analytics/cash-flow', {
      params: { ledgerId, startDate, endDate },
    });
    return response.data;
  },
};
