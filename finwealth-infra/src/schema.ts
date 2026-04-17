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
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
});

export const ledgers = pgTable('ledgers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Ej. "Personal", "Negocio Freelance"
  currency: varchar('currency', { length: 3 }).notNull(),
  isPersonal: boolean('is_personal').default(true).notNull(),
});

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
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  ledgerId: uuid('ledger_id')
    .notNull()
    .references(() => ledgers.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  description: text('description').notNull(),
  rawData: jsonb('raw_data'), // Red de seguridad para Tentáculos
  receiptUrl: text('receipt_url'),
});

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
});

// 3. Inteligencia Predictiva
export const accountMetadata = pgTable('account_metadata', {
  accountId: uuid('account_id')
    .primaryKey()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  cutoffDay: integer('cutoff_day'),
  paymentDueDay: integer('payment_due_day'),
  creditLimit: numeric('credit_limit', { precision: 15, scale: 2 }),
  interestRateApr: numeric('interest_rate_apr', { precision: 5, scale: 2 }),
});
