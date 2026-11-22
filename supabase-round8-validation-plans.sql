-- Round 8: validation plans for the Assumption Journal, and a link to the Action Plan task they create.
-- Safe to run more than once. Run it after supabase-round7-assumption-journal.sql.
--
-- Adds four optional columns to the existing assumptions table. Existing rows are kept, and no default is written.
-- Nothing else changes: evidence, row level security, and the status list stay exactly as they are.

alter table assumptions add column if not exists validation_method text;

alter table assumptions add column if not exists validation_success_measure text;

alter table assumptions add column if not exists validation_due_date date;

-- The Action Plan task created from this plan. If the task is deleted, the link is cleared and the assumption is kept.
alter table assumptions add column if not exists validation_task_id uuid
  references project_tasks(id) on delete set null;
