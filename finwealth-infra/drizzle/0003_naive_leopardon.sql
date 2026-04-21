CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ledger_id" uuid NOT NULL,
	"account_id" uuid,
	"category" text,
	"amount_limit" numeric(15, 2) NOT NULL,
	"period_month" integer NOT NULL,
	"period_year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_budgets_ledger_period" ON "budgets" USING btree ("ledger_id","period_year","period_month");--> statement-breakpoint
CREATE POLICY "Budgets ledger owner policy" ON "budgets" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from ledgers where ledgers.id = "budgets"."ledger_id" and ledgers.user_id = (auth.uid())));