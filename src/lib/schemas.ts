import { z } from 'zod';

export const StatusSchema = z.enum(['draft', 'published']);
export type Status = z.infer<typeof StatusSchema>;

export const SiteSettingsSchema = z.object({
  site_title: z.string().min(1),
  meta_description: z.string().min(1),
  og_title: z.string().min(1),
  og_description: z.string().min(1),
  og_image: z.string().min(1),
  brand_name: z.string().min(1),
  hero_lead: z.string().min(1),
  hero_word: z.string().min(1),
  statement_lines: z.array(z.string().min(1)).min(1),
  statement_lead: z.string().min(1),
  work_lead: z.string().min(1),
  again_lead: z.string().min(1),
  capabilities_lead: z.string().min(1),
  method_lead: z.string().min(1),
  contact_lead: z.string().min(1)
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tag: z.string().min(1),
  line: z.string().min(1),
  image_srcset: z.string().min(1),
  image_src: z.string().min(1),
  image_sizes: z.string().min(1),
  image_width: z.number().int().positive(),
  image_height: z.number().int().positive(),
  image_alt: z.string().min(1),
  image_bg: z.string().min(1),
  sort_order: z.number().int(),
  status: StatusSchema
});
export type Project = z.infer<typeof ProjectSchema>;

export const SkillSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  card_bg: z.string().min(1),
  logo_svg: z.string().min(1),
  sort_order: z.number().int(),
  status: StatusSchema
});
export type Skill = z.infer<typeof SkillSchema>;

export const CredentialSchema = z.object({
  slug: z.string().min(1),
  kind: z.string().min(1),
  level: z.string().min(1),
  year: z.union([z.string().min(1), z.number().int()]),
  scope_label: z.string().min(1),
  scope_icon_svg: z.string().min(1),
  award: z.string().min(1),
  name: z.string().min(1),
  issuer: z.string().min(1),
  description: z.string().min(1),
  image_src: z.string().min(1),
  image_width: z.number().int().positive(),
  image_height: z.number().int().positive(),
  image_alt: z.string().min(1),
  sort_order: z.number().int(),
  status: StatusSchema
});
export type Credential = z.infer<typeof CredentialSchema>;

export const ExperienceSchema = z.object({
  slug: z.string().min(1),
  kind: z.string().min(1),
  tag: z.string().min(1),
  period: z.string().min(1),
  title: z.string().min(1),
  org: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)),
  sort_order: z.number().int(),
  status: StatusSchema
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const ContactLinkSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  description: z.string(),
  icon_svg: z.string().min(1),
  external: z.boolean(),
  sort_order: z.number().int(),
  status: StatusSchema
});
export type ContactLink = z.infer<typeof ContactLinkSchema>;

export const ProjectsSchema = z.array(ProjectSchema);
export const SkillsSchema = z.array(SkillSchema);
export const CredentialsSchema = z.array(CredentialSchema);
export const ExperiencesSchema = z.array(ExperienceSchema);
export const ContactLinksSchema = z.array(ContactLinkSchema);
