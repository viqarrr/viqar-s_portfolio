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
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return SiteSettingsSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch site settings from Supabase, falling back to seed:', error.message);
    }
  }

  return SiteSettingsSchema.parse(seedData.settings);
}

export async function getProjects(): Promise<Project[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return ProjectsSchema.parse(data);
    }
    if (error) {
      console.warn('Failed to fetch projects from Supabase, falling back to seed:', error.message);
    }
  }

  const published = (seedData.projects as Array<{ status: string; sort_order: number }>)
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

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

    if (!error && data && data.length > 0) {
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

    if (!error && data && data.length > 0) {
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

    if (!error && data && data.length > 0) {
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

    if (!error && data && data.length > 0) {
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
