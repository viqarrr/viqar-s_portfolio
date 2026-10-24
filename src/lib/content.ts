import seedData from '../../supabase/seed.json';

export interface SiteSettings {
  site_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  brand_name: string;
  hero_lead: string;
  hero_word: string;
  statement_lines: string[];
  statement_lead: string;
  work_lead: string;
  again_lead: string;
  capabilities_lead: string;
  method_lead: string;
  contact_lead: string;
}

export interface Project {
  slug: string;
  name: string;
  tag: string;
  line: string;
  image_srcset: string;
  image_src: string;
  image_sizes: string;
  image_width: number;
  image_height: number;
  image_alt: string;
  image_bg: string;
  sort_order: number;
  status: string;
}

export interface Skill {
  slug: string;
  name: string;
  category: string;
  card_bg: string;
  logo_svg: string;
  sort_order: number;
  status: string;
}

export interface Credential {
  slug: string;
  kind: string;
  level: string;
  year: number | string;
  scope_label: string;
  scope_icon_svg: string;
  award: string;
  name: string;
  issuer: string;
  description: string;
  image_src: string;
  image_width: number;
  image_height: number;
  image_alt: string;
  sort_order: number;
  status: string;
}

export interface Experience {
  slug: string;
  kind: string;
  tag: string;
  period: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
  sort_order: number;
  status: string;
}

export interface ContactLink {
  slug: string;
  label: string;
  href: string;
  description: string;
  icon_svg: string;
  external: boolean;
  sort_order: number;
  status: string;
}

export function getSettings(): SiteSettings {
  return seedData.settings as SiteSettings;
}

export function getProjects(): Project[] {
  return (seedData.projects as Project[])
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getSkills(): Skill[] {
  return (seedData.skills as Skill[])
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getCredentials(): Credential[] {
  return (seedData.credentials as Credential[])
    .filter((c) => c.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getExperiences(): Experience[] {
  return (seedData.experiences as Experience[])
    .filter((e) => e.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getContactLinks(): ContactLink[] {
  return (seedData.contact_links as ContactLink[])
    .filter((l) => l.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}
