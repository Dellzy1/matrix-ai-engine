-- Round 6: assumptions, evidence, recommendation history, and a numeric budget.
-- Run once in the Supabase SQL editor. Safe to re-run.

-- 1. Numeric budget. The existing text budget stays as the description.
alter table projects add column if not exists budget_amount numeric(14,2);
alter table projects add column if not exists budget_currency text not null default '';
alter table projects add column if not exists budget_status text not null default '';
alter table projects drop constraint if exists projects_budget_status_check;
alter table projects add constraint projects_budget_status_check
  check (budget_status in ('', 'estimated', 'committed', 'spent'));

-- 2. Assumptions: a claim the plan depends on. Linked to a project, a decision, or both.
create table if not exists assumptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid,                      -- reserved for future company workspaces; null = personal
  project_id uuid references projects(id) on delete cascade,
  decision_id uuid references matrices(id) on delete cascade,
  statement text not null,
  status text not null default 'unvalidated'
    check (status in ('unvalidated', 'supported', 'contradicted', 'validated', 'dismissed')),
  validation_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (project_id is not null or decision_id is not null)
);

-- 3. Evidence: facts for or against an assumption. Every item stays tied to its assumption.
create table if not exists evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid,
  assumption_id uuid not null references assumptions(id) on delete cascade,
  stance text not null check (stance in ('supports', 'opposes')),
  content text not null,
  source text not null default '',
  created_at timestamptz not null default now()
);

-- 4. Recommendation history: what the engine suggested, and how the user responded.
create table if not exists recommendation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid,
  project_id uuid references projects(id) on delete cascade,
  task_id uuid references project_tasks(id) on delete set null,
  decision_id uuid references matrices(id) on delete cascade,
  source text not null check (source in ('next_step', 'challenge')),
  kind text not null,                     -- e.g. 'overdue', 'no_deadline', 'overload'
  title text not null,
  reason text not null default '',
  fingerprint text not null default '',   -- the facts behind it; a change re-opens the item
  recommended_at timestamptz not null default now(),
  response text not null default 'pending'
    check (response in ('pending', 'accepted', 'rejected', 'explained')),
  response_note text not null default '',
  responded_at timestamptz,
  resolved boolean not null default false,
  resolved_at timestamptz
);

create index if not exists recommendation_history_lookup
  on recommendation_history (user_id, project_id, kind);

-- Row Level Security: each person sees only their own rows.
alter table assumptions enable row level security;
alter table evidence enable row level security;
alter table recommendation_history enable row level security;

drop policy if exists "own assumptions" on assumptions;
create policy "own assumptions" on assumptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own evidence" on evidence;
create policy "own evidence" on evidence
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own recommendation history" on recommendation_history;
create policy "own recommendation history" on recommendation_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
