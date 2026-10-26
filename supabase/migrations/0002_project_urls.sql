-- Add live_url and github_url columns to projects table
alter table public.projects add column if not exists live_url text;
alter table public.projects add column if not exists github_url text;
