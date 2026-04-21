// TODO: Phase 2 - Reemplazar esta interface manual con los tipos autogenerados de Supabase.
// Ej. type JournalEntryInput = Database['public']['Tables']['journal_entries']['Insert']
export interface JournalEntryInput {
  accountId: string;
  amount: string | number;
}
