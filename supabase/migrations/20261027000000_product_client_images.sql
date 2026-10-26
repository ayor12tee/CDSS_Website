-- Optional images chosen in the admin: a logo and a feature image for each product, and a logo for each client.
-- Values are media-library URLs, other https image links, or built-in illustration names. Run once; safe to re-run.

alter table public.products add column if not exists logo text;
alter table public.products add column if not exists image text;
alter table public.clients add column if not exists logo text;
