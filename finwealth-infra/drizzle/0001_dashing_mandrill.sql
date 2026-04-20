ALTER TABLE "account_metadata" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "journal_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ledgers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "idx_journal_entries_account_id" ON "journal_entries" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_journal_entries_transaction_id" ON "journal_entries" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_ledger_date" ON "transactions" USING btree ("ledger_id","date");--> statement-breakpoint
CREATE POLICY "Account metadata owner policy" ON "account_metadata" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
      select 1 from accounts 
      join ledgers on ledgers.id = accounts.ledger_id 
      where accounts.id = "account_metadata"."account_id" and ledgers.user_id = (auth.uid())
    ));--> statement-breakpoint
CREATE POLICY "Accounts ledger owner policy" ON "accounts" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from ledgers where ledgers.id = "accounts"."ledger_id" and ledgers.user_id = (auth.uid())));--> statement-breakpoint
CREATE POLICY "Journal entries owner policy" ON "journal_entries" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
      select 1 from transactions 
      join ledgers on ledgers.id = transactions.ledger_id 
      where transactions.id = "journal_entries"."transaction_id" and ledgers.user_id = (auth.uid())
    ));--> statement-breakpoint
CREATE POLICY "Ledgers owner policy" ON "ledgers" AS PERMISSIVE FOR ALL TO "authenticated" USING ("ledgers"."user_id" = (auth.uid()));--> statement-breakpoint
CREATE POLICY "Profiles access policy" ON "profiles" AS PERMISSIVE FOR ALL TO "authenticated" USING ("profiles"."id" = (auth.uid()));--> statement-breakpoint
CREATE POLICY "Transactions ledger owner policy" ON "transactions" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from ledgers where ledgers.id = "transactions"."ledger_id" and ledgers.user_id = (auth.uid())));