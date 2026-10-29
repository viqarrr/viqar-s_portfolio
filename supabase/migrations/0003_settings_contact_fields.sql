-- 0003_settings_contact_fields.sql: Add contact and social url columns to site_settings table
alter table public.site_settings add column if not exists email text null;
alter table public.site_settings add column if not exists github_url text null;
alter table public.site_settings add column if not exists linkedin_url text null;
alter table public.site_settings add column if not exists instagram_url text null;
alter table public.site_settings add column if not exists contact_url text null;
