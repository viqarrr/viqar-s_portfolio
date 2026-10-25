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
