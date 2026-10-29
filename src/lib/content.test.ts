import { describe, it, expect } from 'vitest';
import {
  getSettings,
  getProjects,
  getSkills,
  getCredentials,
  getExperiences,
  getContactLinks,
  resolveContactLinks,
  getSupabaseClient
} from './content';
import seedData from '../../supabase/seed.json';

describe('Content Data Layer & Seed Fallback', () => {
  it('returns null client when Supabase environment variables are absent', () => {
    // When PUBLIC_SUPABASE_URL is not set, getSupabaseClient returns null
    const client = getSupabaseClient();
    // In local test runner without .env, client is null
    if (!process.env.PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
      expect(client).toBeNull();
    }
  });

  it('getSettings returns validated site settings from seed', async () => {
    const settings = await getSettings();
    expect(settings).toBeDefined();
    expect(settings.brand_name).toBe(seedData.settings.brand_name);
    expect(settings.site_title).toBe(seedData.settings.site_title);
    expect(settings.statement_lines.length).toBeGreaterThan(0);
  });

  it('getProjects returns published projects sorted by sort_order ascending', async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.status).toBe('published');
    }
    for (let i = 1; i < projects.length; i++) {
      expect(projects[i].sort_order).toBeGreaterThanOrEqual(projects[i - 1].sort_order);
    }
  });

  it('getSkills returns published skills sorted by sort_order ascending', async () => {
    const skills = await getSkills();
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) {
      expect(skill.status).toBe('published');
    }
    for (let i = 1; i < skills.length; i++) {
      expect(skills[i].sort_order).toBeGreaterThanOrEqual(skills[i - 1].sort_order);
    }
  });

  it('getCredentials returns published credentials sorted by sort_order ascending', async () => {
    const credentials = await getCredentials();
    expect(credentials.length).toBeGreaterThan(0);
    for (const cred of credentials) {
      expect(cred.status).toBe('published');
    }
    for (let i = 1; i < credentials.length; i++) {
      expect(credentials[i].sort_order).toBeGreaterThanOrEqual(credentials[i - 1].sort_order);
    }
  });

  it('getExperiences returns published experiences sorted by sort_order ascending', async () => {
    const experiences = await getExperiences();
    expect(experiences.length).toBeGreaterThan(0);
    for (const exp of experiences) {
      expect(exp.status).toBe('published');
    }
    for (let i = 1; i < experiences.length; i++) {
      expect(experiences[i].sort_order).toBeGreaterThanOrEqual(experiences[i - 1].sort_order);
    }
  });

  it('getContactLinks returns published contact links sorted by sort_order ascending', async () => {
    const contactLinks = await getContactLinks();
    expect(contactLinks.length).toBeGreaterThan(0);
    for (const link of contactLinks) {
      expect(link.status).toBe('published');
    }
    for (let i = 1; i < contactLinks.length; i++) {
      expect(contactLinks[i].sort_order).toBeGreaterThanOrEqual(contactLinks[i - 1].sort_order);
    }
  });

  it('resolveContactLinks extracts email, github, and linkedin correctly', async () => {
    const contactLinks = await getContactLinks();
    const resolved = resolveContactLinks(contactLinks);

    expect(resolved.email).toBe('viqar@example.com');
    expect(resolved.emailHref).toBe('mailto:viqar@example.com');
    expect(resolved.githubHref).toBe('https://github.com/placeholder');
    expect(resolved.linkedinHref).toBe('https://linkedin.com/in/placeholder');
  });

  it('resolveContactLinks gracefully handles empty or custom links', () => {
    const emptyResolved = resolveContactLinks([]);
    expect(emptyResolved.email).toBe('');
    expect(emptyResolved.emailHref).toBe('#contact');
    expect(emptyResolved.githubHref).toBeUndefined();

    const customLinks = [
      {
        slug: 'my-github',
        label: 'GitHub Profile',
        href: 'https://github.com/custom-user',
        description: 'code',
        icon_svg: '<svg></svg>',
        external: true,
        sort_order: 1,
        status: 'published' as const
      },
      {
        slug: 'contact-mail',
        label: 'Email Me',
        href: 'mailto:custom@domain.com',
        description: 'mail',
        icon_svg: '<svg></svg>',
        external: false,
        sort_order: 2,
        status: 'published' as const
      }
    ];
    const customResolved = resolveContactLinks(customLinks);
    expect(customResolved.email).toBe('custom@domain.com');
    expect(customResolved.emailHref).toBe('mailto:custom@domain.com');
    expect(customResolved.githubHref).toBe('https://github.com/custom-user');
  });
});
