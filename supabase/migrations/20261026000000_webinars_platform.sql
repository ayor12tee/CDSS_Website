-- Webinars can run on Microsoft Teams or Google Meet, and the summary becomes optional
-- (imported past recordings often have only a title). Run once after 20261025000000_webinars.sql. Safe to re-run.

alter table public.webinars
  add column if not exists platform text not null default 'teams';

alter table public.webinars drop constraint if exists webinars_platform_check;
alter table public.webinars add constraint webinars_platform_check check (platform in ('teams', 'meet'));

alter table public.webinars alter column summary set default '';
