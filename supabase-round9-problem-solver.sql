-- Round 9: Problem Solver, Round 1 (the problems table).
-- Safe to run more than once. Run it after supabase-round8-validation-plans.sql.
--
-- What this does:
--   1. Creates one new table, problems, for saved problems and their drafts.
--   2. Turns on row level security, so each person sees only their own problems.
--   3. Changes no existing table, column, policy or record.
--   4. Does not link to projects or matrices yet. Those links come in later rounds.

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  description text,
  category text check (category in (
    'personal_life', 'education', 'career', 'finance', 'health_lifestyle', 'relationships_family',
    'business', 'work_projects', 'technology', 'team_organisation', 'other'
  )),
  category_other text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'resolved', 'archived')),
  desired_outcome text,
  started_on date,
  frequency text,
  affected text,
  already_tried text,
  current_stage smallint not null default 1 check (current_stage between 1 and 8),
  stage_statuses jsonb not null default '{}'::jsonb check (jsonb_typeof(stage_statuses) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A draft can be saved without a title. Any other status needs one.
  constraint problems_title_required check (
    status = 'draft' or (title is not null and length(trim(title)) > 0)
  )
);

-- Lists are sorted by most recent change for one person.
create index if not exists problems_user_updated on problems (user_id, updated_at desc);

-- Row level security: the same "own rows only" rule used for assumptions.
alter table problems enable row level security;

drop policy if exists "own problems" on problems;
create policy "own problems" on problems
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
