import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  pgEnum,
  timestamp,
  numeric,
  jsonb,
  integer,
  index,
  pgPolicy,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Helper de Supabase para obtener el auth.uid() en las políticas RLS
const authUid = sql`(auth.uid())`;

// Enums
export const accountTypeEnum = pgEnum('account_type', [
  'asset',
  'liability',
  'revenue',
  'expense',
  'equity',
]);

// 1. Identidad y Espacios (Multi-Ledger)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // Reference to auth.users in Supabase
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  preferences: jsonb('preferences'),
}, (table) => [
  pgPolicy('Profiles access policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    using: sql`${table.id} = ${authUid}`,
  })
]);

export const ledgers = pgTable('ledgers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Ej. "Personal", "Negocio Freelance"
  currency: varchar('currency', { length: 3 }).notNull(),
  isPersonal: boolean('is_personal').default(true).notNull(),
}, (table) => [
  pgPolicy('Ledgers owner policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    using: sql`${table.userId} = ${authUid}`,
  })
]);

// 2. Motor de Partida Doble (Strict Double-Entry)
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  ledgerId: uuid('ledger_id')
    .notNull()
    .references(() => ledgers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Ej. "Banamex Crédito", "Sueldo"
  type: accountTypeEnum('type').notNull(),
  parentId: uuid('parent_id'), // Self-reference para jerarquías
  isActive: boolean('is_active').default(true).notNull(),
}, (table) => [
  // Política para cuentas: Solo puedes interactuar con cuentas cuyo ledger te pertenece
  pgPolicy('Accounts ledger owner policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    using: sql`exists (select 1 from ledgers where ledgers.id = ${table.ledgerId} and ledgers.user_id = ${authUid})`,
  })
]);

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  ledgerId: uuid('ledger_id')
    .notNull()
    .references(() => ledgers.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  description: text('description').notNull(),
  rawData: jsonb('raw_data'), // Red de seguridad para Tentáculos
  receiptUrl: text('receipt_url'),
}, (table) => [
  index('idx_transactions_ledger_date').on(table.ledgerId, table.date),
  pgPolicy('Transactions ledger owner policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    using: sql`exists (select 1 from ledgers where ledgers.id = ${table.ledgerId} and ledgers.user_id = ${authUid})`,
  })
]);

export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionId: uuid('transaction_id')
    .notNull()
    .references(() => transactions.id, { onDelete: 'cascade' }),
  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(), // Débitos Positivos, Créditos Negativos
  isDeductible: boolean('is_deductible').default(false).notNull(),
  taxAmount: numeric('tax_amount', { precision: 15, scale: 2 }),
}, (table) => [
  index('idx_journal_entries_account_id').on(table.accountId),
  index('idx_journal_entries_transaction_id').on(table.transactionId),
  pgPolicy('Journal entries owner policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    // Usar la relación hacia transactions -> ledgers para seguridad RLS
    using: sql`exists (
      select 1 from transactions 
      join ledgers on ledgers.id = transactions.ledger_id 
      where transactions.id = ${table.transactionId} and ledgers.user_id = ${authUid}
    )`,
  })
]);

// 3. Inteligencia Predictiva
export const accountMetadata = pgTable('account_metadata', {
  accountId: uuid('account_id')
    .primaryKey()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  cutoffDay: integer('cutoff_day'),
  paymentDueDay: integer('payment_due_day'),
  creditLimit: numeric('credit_limit', { precision: 15, scale: 2 }),
  interestRateApr: numeric('interest_rate_apr', { precision: 5, scale: 2 }),
}, (table) => [
  pgPolicy('Account metadata owner policy', {
    as: 'permissive',
    for: 'all',
    to: 'authenticated',
    using: sql`exists (
      select 1 from accounts 
      join ledgers on ledgers.id = accounts.ledger_id 
      where accounts.id = ${table.accountId} and ledgers.user_id = ${authUid}
    )`,
  })
]);