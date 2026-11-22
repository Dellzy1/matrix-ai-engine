-- Round 7: Assumption Journal fields.
-- Safe to run more than once. Run it after supabase-round6.sql.
--
-- What this does:
--   1. Adds five columns to the existing assumptions table. Existing rows are kept, and no default is written to them.
--   2. Adds 'testing' to the existing status list. The other statuses stay exactly as they are.
--   3. Does not change evidence, row level security, or any existing relationship.

-- 1. The journal's fields. Every one is optional, so existing assumptions stay as they are.
alter table assumptions add column if not exists importance text
  check (importance in ('low', 'medium', 'high'));

alter table assumptions add column if not exists confidence integer
  check (confidence between 0 and 100);

alter table assumptions add column if not exists category text;

alter table assumptions add column if not exists review_date date;

alter table assumptions add column if not exists next_validation_action text;

-- 2. 'testing' means an assumption is being investigated. It replaces nothing.
alter table assumptions drop constraint if exists assumptions_status_check;
alter table assumptions add constraint assumptions_status_check
  check (status in ('unvalidated', 'testing', 'supported', 'contradicted', 'validated', 'dismissed'));
