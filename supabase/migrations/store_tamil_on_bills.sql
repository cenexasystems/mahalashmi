-- ============================================================================
-- Store setting: print product Tamil names on invoices and bills.
-- Run in the Supabase SQL Editor. Safe to re-run.
-- On by default, so bills look the same as before until it is switched off in
-- Store Settings.
-- ============================================================================

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS show_tamil_on_bills BOOLEAN NOT NULL DEFAULT TRUE;

-- Result: should return one row with show_tamil_on_bills = true
SELECT id, show_tamil_on_bills FROM public.store_settings;
