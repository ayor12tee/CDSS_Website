-- Webinars: upcoming events people register for on Microsoft Teams, and past events with YouTube recordings.
-- Run once in the Supabase SQL Editor. Safe to re-run.

create table if not exists public.webinars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null default '',
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 5 and 600),
  speakers text[] not null default '{}',
  products text[] not null default '{}',
  registration_url text,
  recording_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists webinars_starts_at_idx on public.webinars (starts_at desc);

create or replace function public.webinars_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists webinars_touch_updated_at on public.webinars;
create trigger webinars_touch_updated_at before update on public.webinars
  for each row execute function public.webinars_touch_updated_at();

-- The site reads and writes with the service-role key on the server only, so no public policies are needed.
alter table public.webinars enable row level security;
