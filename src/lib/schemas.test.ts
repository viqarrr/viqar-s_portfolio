import { describe, it, expect } from 'vitest';
import {
  SiteSettingsSchema,
  ProjectSchema,
  ProjectsSchema,
  SkillSchema,
  SkillsSchema,
  CredentialSchema,
  CredentialsSchema,
  ExperienceSchema,
  ExperiencesSchema,
  ContactLinkSchema,
  ContactLinksSchema
} from './schemas';
import seedData from '../../supabase/seed.json';

describe('Zod Validation Schemas', () => {
  describe('SiteSettingsSchema', () => {
    it('validates valid seed settings', () => {
      const result = SiteSettingsSchema.safeParse(seedData.settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.brand_name).toBe(seedData.settings.brand_name);
        expect(result.data.statement_lines.length).toBeGreaterThan(0);
      }
    });

    it('rejects settings missing required fields', () => {
      const invalid = { ...seedData.settings, site_title: '' };
      const result = SiteSettingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty statement_lines array', () => {
      const invalid = { ...seedData.settings, statement_lines: [] };
      const result = SiteSettingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('ProjectSchema & ProjectsSchema', () => {
    it('validates seed projects array', () => {
      const result = ProjectsSchema.safeParse(seedData.projects);
      expect(result.success).toBe(true);
    });

    it('rejects project missing required slug or line', () => {
      const invalid = { ...seedData.projects[0], slug: '' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);

      const missingLine = { ...seedData.projects[0] };
      // @ts-expect-error test missing field
      delete missingLine.line;
      expect(ProjectSchema.safeParse(missingLine).success).toBe(false);
    });

    it('rejects negative or zero image dimensions', () => {
      const negativeWidth = { ...seedData.projects[0], image_width: -100 };
      expect(ProjectSchema.safeParse(negativeWidth).success).toBe(false);

      const zeroHeight = { ...seedData.projects[0], image_height: 0 };
      expect(ProjectSchema.safeParse(zeroHeight).success).toBe(false);
    });

    it('accepts optional live_url, github_url, and description', () => {
      const withUrls = {
        ...seedData.projects[0],
        live_url: 'https://example.com',
        github_url: 'https://github.com/example/repo',
        description: '<p>Rich project description</p>'
      };
      const result = ProjectSchema.safeParse(withUrls);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.live_url).toBe('https://example.com');
        expect(result.data.github_url).toBe('https://github.com/example/repo');
      }
    });

    it('supports confidential and NDA client projects with null or empty URLs', () => {
      // 1. Explicit null values
      const confidentialNull = {
        ...seedData.projects[0],
        live_url: null,
        github_url: null
      };
      const nullResult = ProjectSchema.safeParse(confidentialNull);
      expect(nullResult.success).toBe(true);
      if (nullResult.success) {
        expect(nullResult.data.live_url).toBeNull();
        expect(nullResult.data.github_url).toBeNull();
      }

      // 2. Empty string values (from form inputs)
      const confidentialEmpty = {
        ...seedData.projects[0],
        live_url: '',
        github_url: ''
      };
      const emptyResult = ProjectSchema.safeParse(confidentialEmpty);
      expect(emptyResult.success).toBe(true);
      if (emptyResult.success) {
        expect(emptyResult.data.live_url).toBe('');
        expect(emptyResult.data.github_url).toBe('');
      }

      // 3. Omitted / undefined values
      const confidentialOmitted = { ...seedData.projects[0] };
      delete (confidentialOmitted as any).live_url;
      delete (confidentialOmitted as any).github_url;
      const omittedResult = ProjectSchema.safeParse(confidentialOmitted);
      expect(omittedResult.success).toBe(true);

      // 4. Invalid URL format fails
      const invalidUrl = {
        ...seedData.projects[0],
        live_url: 'not-a-valid-url'
      };
      const invalidResult = ProjectSchema.safeParse(invalidUrl);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('SkillSchema & SkillsSchema', () => {
    it('validates seed skills array', () => {
      const result = SkillsSchema.safeParse(seedData.skills);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const invalid = { ...seedData.skills[0], status: 'archived' };
      expect(SkillSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('CredentialSchema & CredentialsSchema', () => {
    it('validates seed credentials array', () => {
      const result = CredentialsSchema.safeParse(seedData.credentials);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status or missing award', () => {
      const invalidStatus = { ...seedData.credentials[0], status: 'deleted' };
      expect(CredentialSchema.safeParse(invalidStatus).success).toBe(false);

      const missingAward = { ...seedData.credentials[0], award: '' };
      expect(CredentialSchema.safeParse(missingAward).success).toBe(false);
    });
  });

  describe('ExperienceSchema & ExperiencesSchema', () => {
    it('validates seed experiences array', () => {
      const result = ExperiencesSchema.safeParse(seedData.experiences);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status or missing organization', () => {
      const invalidStatus = { ...seedData.experiences[0], status: 'drafted' };
      expect(ExperienceSchema.safeParse(invalidStatus).success).toBe(false);

      const missingOrg = { ...seedData.experiences[0], org: '' };
      expect(ExperienceSchema.safeParse(missingOrg).success).toBe(false);
    });
  });

  describe('ContactLinkSchema & ContactLinksSchema', () => {
    it('validates seed contact links array', () => {
      const result = ContactLinksSchema.safeParse(seedData.contact_links);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status or missing href', () => {
      const invalidStatus = { ...seedData.contact_links[0], status: 'inactive' };
      expect(ContactLinkSchema.safeParse(invalidStatus).success).toBe(false);

      const missingHref = { ...seedData.contact_links[0], href: '' };
      expect(ContactLinkSchema.safeParse(missingHref).success).toBe(false);
    });
  });
});
