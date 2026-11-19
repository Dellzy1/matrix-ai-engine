-- Round 5: budget and resources for plans. Run once in Supabase SQL Editor.
alter table projects add column if not exists budget text not null default '';
alter table projects add column if not exists resources text not null default '';
