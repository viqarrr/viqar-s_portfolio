-- 0001_init.sql: Initial Supabase schema with Row Level Security (RLS)

-- Extension for UUID generation
create extension if not exists pgcrypto;

-- Helper function to verify if current authenticated user is an administrator
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- Trigger function for auto-updating updated_at timestamp
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Admin Users Table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- 2. Site Settings Table (Singleton)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  meta_description text not null,
  og_title text not null,
  og_description text not null,
  og_image text not null,
  brand_name text not null,
  hero_lead text not null,
  hero_word text not null,
  statement_lines text[] not null default '{}',
  statement_lead text not null,
  work_lead text not null,
  again_lead text not null,
  capabilities_lead text not null,
  method_lead text not null,
  contact_lead text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text not null,
  line text not null,
  image_srcset text not null,
  image_src text not null,
  image_sizes text not null,
  image_width integer not null,
  image_height integer not null,
  image_alt text not null,
  image_bg text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Skills Table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  card_bg text not null,
  logo_svg text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Credentials Table
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null,
  level text not null,
  year text not null,
  scope_label text not null,
  scope_icon_svg text not null,
  award text not null,
  name text not null,
  issuer text not null,
  description text not null,
  image_src text not null,
  image_width integer not null,
  image_height integer not null,
  image_alt text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Experiences Table
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null,
  tag text not null,
  period text not null,
  title text not null,
  org text not null,
  description text not null,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Contact Links Table
create table if not exists public.contact_links (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  href text not null,
  description text not null,
  icon_svg text not null,
  external boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers for updated_at
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.touch_updated_at();
create trigger set_projects_updated_at before update on public.projects for each row execute function public.touch_updated_at();
create trigger set_skills_updated_at before update on public.skills for each row execute function public.touch_updated_at();
create trigger set_credentials_updated_at before update on public.credentials for each row execute function public.touch_updated_at();
create trigger set_experiences_updated_at before update on public.experiences for each row execute function public.touch_updated_at();
create trigger set_contact_links_updated_at before update on public.contact_links for each row execute function public.touch_updated_at();

-- Performance Indexes
create index if not exists idx_projects_status_sort on public.projects(status, sort_order);
create index if not exists idx_skills_status_sort on public.skills(status, sort_order);
create index if not exists idx_credentials_status_sort on public.credentials(status, sort_order);
create index if not exists idx_experiences_status_sort on public.experiences(status, sort_order);
create index if not exists idx_contact_links_status_sort on public.contact_links(status, sort_order);

-- Enable Row Level Security (RLS) on all 7 tables
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.credentials enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_links enable row level security;

-- RLS Policies: site_settings
create policy "Allow public read on site_settings" on public.site_settings
  for select using (true);
create policy "Allow admin write on site_settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: projects
create policy "Allow public read published projects" on public.projects
  for select using (status = 'published' or public.is_admin());
create policy "Allow admin write projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: skills
create policy "Allow public read published skills" on public.skills
  for select using (status = 'published' or public.is_admin());
create policy "Allow admin write skills" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: credentials
create policy "Allow public read published credentials" on public.credentials
  for select using (status = 'published' or public.is_admin());
create policy "Allow admin write credentials" on public.credentials
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: experiences
create policy "Allow public read published experiences" on public.experiences
  for select using (status = 'published' or public.is_admin());
create policy "Allow admin write experiences" on public.experiences
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: contact_links
create policy "Allow public read published contact_links" on public.contact_links
  for select using (status = 'published' or public.is_admin());
create policy "Allow admin write contact_links" on public.contact_links
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS Policies: admin_users
create policy "Allow admin read admin_users" on public.admin_users
  for select using (public.is_admin());
create policy "Allow admin write admin_users" on public.admin_users
  for all using (public.is_admin()) with check (public.is_admin());

-- Media Storage Bucket
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects for all using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
