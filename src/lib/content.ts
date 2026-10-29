import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import {
  SiteSettingsSchema,
  ProjectsSchema,
  SkillsSchema,
  CredentialsSchema,
  ExperiencesSchema,
  ContactLinksSchema,
  type SiteSettings,
  type Project,
  type Skill,
  type Credential,
  type Experience,
  type ContactLink,
  type Status
} from './schemas';
import seedData from '../../supabase/seed.json';

export type { SiteSettings, Project, Skill, Credential, Experience, ContactLink, Status };

let supabaseInstance: SupabaseClient<Database> | null | undefined;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (supabaseInstance !== undefined) {
    return supabaseInstance;
  }

  const supabaseUrl =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_URL) ||
    process.env.PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const supabaseAnonKey =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_ANON_KEY) ||
    process.env.PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
  } else {
    supabaseInstance = null;
  }

  return supabaseInstance;
}

export async function getSettings(): Promise<SiteSettings> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return SiteSettingsSchema.parse({
        ...seedData.settings,
        ...data,
      });
    }
    if (error) {
      console.warn('Failed to fetch site settings from Supabase, falling back to seed:', error.message);
    }
  }

  return SiteSettingsSchema.parse(seedData.settings);
}

export const getSiteSettings = getSettings;

export async function getProjects(): Promise<Project[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      const cleaned = data.map((item: any) => {
        const liveUrl = typeof item.live_url === 'string' && item.live_url.trim() && item.live_url.trim() !== '#'
          ? item.live_url.trim()
          : null;
        const githubUrl = typeof item.github_url === 'string' && item.github_url.trim() && item.github_url.trim() !== '#'
          ? item.github_url.trim()
          : null;

        return {
          ...item,
          live_url: liveUrl,
          github_url: githubUrl
        };
      });
      return ProjectsSchema.parse(cleaned);
    }
    if (error) {
      console.warn('Failed to fetch projects from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.projects as Array<{ status: string; sort_order: number; slug: string; live_url?: string | null; github_url?: string | null }>)
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(p => ({
      ...p,
      live_url: typeof p.live_url === 'string' && p.live_url.trim() && p.live_url.trim() !== '#'
        ? p.live_url.trim()
        : null,
      github_url: typeof p.github_url === 'string' && p.github_url.trim() && p.github_url.trim() !== '#'
        ? p.github_url.trim()
        : null
    }));

  return ProjectsSchema.parse(published);
}

export async function getSkills(): Promise<Skill[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('skills')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      return SkillsSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch skills from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.skills as Array<{ status: string; sort_order: number }>)
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  return SkillsSchema.parse(published);
}

export async function getCredentials(): Promise<Credential[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('credentials')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      return CredentialsSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch credentials from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.credentials as Array<{ status: string; sort_order: number }>)
    .filter((c) => c.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  return CredentialsSchema.parse(published);
}

export async function getExperiences(): Promise<Experience[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('experiences')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      return ExperiencesSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch experiences from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.experiences as Array<{ status: string; sort_order: number }>)
    .filter((e) => e.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  return ExperiencesSchema.parse(published);
}

export async function getContactLinks(): Promise<ContactLink[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('contact_links')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      return ContactLinksSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch contact links from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.contact_links as Array<{ status: string; sort_order: number }>)
    .filter((l) => l.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  return ContactLinksSchema.parse(published);
}

export interface ResolvedContactLinks {
  emailLink?: ContactLink;
  githubLink?: ContactLink;
  linkedinLink?: ContactLink;
  instagramLink?: ContactLink;
  otherLinks: ContactLink[];
  email: string;
  emailHref: string;
  githubHref?: string;
  linkedinHref?: string;
  instagramHref?: string;
}

export function resolveContactLinks(contactLinks: ContactLink[] = []): ResolvedContactLinks {
  const getHref = (link?: ContactLink): string | undefined => {
    if (!link) return undefined;
    const raw = link.href || (link as any).url;
    if (typeof raw !== 'string') return undefined;
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const findLink = (...keys: string[]): ContactLink | undefined => {
    return contactLinks.find((l) => {
      const slug = (l.slug || '').toLowerCase();
      const label = (l.label || (l as any).title || (l as any).name || '').toLowerCase();
      const href = (l.href || (l as any).url || '').toLowerCase();
      return keys.some(
        (key) =>
          slug === key ||
          slug.includes(key) ||
          label === key ||
          label.includes(key) ||
          href.includes(key)
      );
    });
  };

  const emailLink = findLink('email', 'mailto:');
  const githubLink = findLink('github');
  const linkedinLink = findLink('linkedin');
  const instagramLink = findLink('instagram');

  let rawEmail = getHref(emailLink) || '';
  let email = '';
  let emailHref = '#contact';

  if (rawEmail) {
    if (rawEmail.startsWith('mailto:')) {
      email = rawEmail.replace(/^mailto:/i, '').split('?')[0].trim();
      emailHref = rawEmail;
    } else if (rawEmail.includes('@') && !rawEmail.startsWith('http')) {
      email = rawEmail;
      emailHref = `mailto:${rawEmail}`;
    } else {
      emailHref = rawEmail;
      email = emailLink?.label || 'Contact';
    }
  }

  const githubHref = getHref(githubLink);
  const linkedinHref = getHref(linkedinLink);
  const instagramHref = getHref(instagramLink);

  const matchedSlugs = new Set(
    [emailLink?.slug, githubLink?.slug, linkedinLink?.slug, instagramLink?.slug].filter(Boolean)
  );
  const otherLinks = contactLinks.filter((l) => !matchedSlugs.has(l.slug));

  return {
    emailLink,
    githubLink,
    linkedinLink,
    instagramLink,
    otherLinks,
    email,
    emailHref,
    githubHref,
    linkedinHref,
    instagramHref,
  };
}
