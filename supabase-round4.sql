-- Round 4: keep the calculator's recommendation separate from the user's chosen option.
-- Run this once in the Supabase SQL editor.

alter table public.projects
  add column if not exists recommended_option text not null default '';

-- Existing plans: the current selected option is the calculator's recommendation at the time.
update public.projects
  set recommended_option = coalesce(selected_option, '')
  where recommended_option = '' and decision_id is not null;
