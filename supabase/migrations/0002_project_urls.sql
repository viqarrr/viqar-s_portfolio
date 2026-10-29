-- Add live_url and github_url columns to projects table (optional / nullable for confidential & NDA projects)
alter table public.projects add column if not exists live_url text null;
alter table public.projects add column if not exists github_url text null;

-- Explicitly ensure NULL values are allowed
alter table public.projects alter column live_url drop not null;
alter table public.projects alter column github_url drop not null;
