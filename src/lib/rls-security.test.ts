import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Supabase Row Level Security (RLS) Policy Specifications', () => {
  const sql = readFileSync(resolve('supabase/migrations/0001_init.sql'), 'utf8');

  it('enforces RLS enablement on all seven tables', () => {
    const requiredTables = [
      'admin_users',
      'site_settings',
      'projects',
      'skills',
      'credentials',
      'experiences',
      'contact_links'
    ];

    for (const table of requiredTables) {
      const rlsRegex = new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security;`, 'i');
      expect(sql).toMatch(rlsRegex);
    }
  });

  it('defines is_admin() security definer function checking admin_users', () => {
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.is_admin\(\)/i);
    expect(sql).toMatch(/security\s+definer/i);
    expect(sql).toMatch(/select\s+exists\s*\(\s*select\s+1\s+from\s+public\.admin_users\s+where\s+user_id\s*=\s*auth\.uid\(\)\s*\)/i);
  });

  it('restricts admin_users table select and write strictly to is_admin()', () => {
    expect(sql).toMatch(/create\s+policy\s+"Allow admin read admin_users"\s+on\s+public\.admin_users\s+for\s+select\s+using\s*\(\s*public\.is_admin\(\)\s*\);/i);
    expect(sql).toMatch(/create\s+policy\s+"Allow admin write admin_users"\s+on\s+public\.admin_users\s+for\s+all\s+using\s*\(\s*public\.is_admin\(\)\s*\)/i);
  });

  it('configures public read isolation (status = "published") on content tables', () => {
    const contentTables = ['projects', 'skills', 'credentials', 'experiences', 'contact_links'];
    for (const table of contentTables) {
      const selectPolicyRegex = new RegExp(
        `create\\s+policy\\s+"Allow public read published ${table}"\\s+on\\s+public\\.${table}\\s+for\\s+select\\s+using\\s*\\(\\s*status\\s*=\\s*'published'\\s+or\\s+public\\.is_admin\\(\\)\\s*\\);`,
        'i'
      );
      expect(sql).toMatch(selectPolicyRegex);
    }
  });

  it('restricts content tables write operations strictly to is_admin()', () => {
    const contentTables = ['projects', 'skills', 'credentials', 'experiences', 'contact_links'];
    for (const table of contentTables) {
      const writePolicyRegex = new RegExp(
        `create\\s+policy\\s+"Allow admin write ${table}"\\s+on\\s+public\\.${table}\\s+for\\s+all\\s+using\\s*\\(\\s*public\\.is_admin\\(\\)\\s*\\)\\s+with\\s+check\\s*\\(\\s*public\\.is_admin\\(\\)\\s*\\);`,
        'i'
      );
      expect(sql).toMatch(writePolicyRegex);
    }
  });

  it('allows public read on site_settings while restricting write to is_admin()', () => {
    expect(sql).toMatch(/create\s+policy\s+"Allow public read on site_settings"\s+on\s+public\.site_settings\s+for\s+select\s+using\s*\(\s*true\s*\);/i);
    expect(sql).toMatch(/create\s+policy\s+"Allow admin write on site_settings"\s+on\s+public\.site_settings\s+for\s+all\s+using\s*\(\s*public\.is_admin\(\)\s*\)\s+with\s+check\s*\(\s*public\.is_admin\(\)\s*\);/i);
  });
});

describe('RLS Execution Simulator (Deterministic Policy Enforcement)', () => {
  interface RecordItem {
    id: string;
    status?: 'draft' | 'published';
    name?: string;
  }

  interface DatabaseState {
    admin_users: { user_id: string; email: string }[];
    site_settings: { id: string; site_title: string }[];
    projects: RecordItem[];
    skills: RecordItem[];
    credentials: RecordItem[];
    experiences: RecordItem[];
    contact_links: RecordItem[];
  }

  function createMockDb(): DatabaseState {
    return {
      admin_users: [{ user_id: 'admin-uuid-1', email: 'admin@example.com' }],
      site_settings: [{ id: '00000000-0000-0000-0000-000000000001', site_title: 'Viqar Portfolio' }],
      projects: [
        { id: 'p1', name: 'Published Project', status: 'published' },
        { id: 'p2', name: 'Draft Secret Project', status: 'draft' }
      ],
      skills: [
        { id: 's1', name: 'TypeScript', status: 'published' },
        { id: 's2', name: 'Unreleased Tech', status: 'draft' }
      ],
      credentials: [
        { id: 'c1', name: 'Published Cert', status: 'published' },
        { id: 'c2', name: 'Pending Review Cert', status: 'draft' }
      ],
      experiences: [
        { id: 'e1', name: 'SMK 12', status: 'published' },
        { id: 'e2', name: 'Confidential Role', status: 'draft' }
      ],
      contact_links: [
        { id: 'l1', name: 'GitHub', status: 'published' },
        { id: 'l2', name: 'Private Phone', status: 'draft' }
      ]
    };
  }

  class MockSupabaseClient {
    private db: DatabaseState;
    private currentUserId: string | null;

    constructor(db: DatabaseState, currentUserId: string | null = null) {
      this.db = db;
      this.currentUserId = currentUserId;
    }

    private isAdmin(): boolean {
      if (!this.currentUserId) return false;
      return this.db.admin_users.some(u => u.user_id === this.currentUserId);
    }

    select(table: keyof DatabaseState): { data: any[] | null; error: { code: string; message: string } | null } {
      if (table === 'admin_users') {
        if (!this.isAdmin()) {
          return { data: null, error: { code: '42501', message: 'permission denied for table admin_users' } };
        }
        return { data: [...this.db.admin_users], error: null };
      }

      if (table === 'site_settings') {
        return { data: [...this.db.site_settings], error: null };
      }

      // Content tables
      const items = this.db[table] as RecordItem[];
      if (this.isAdmin()) {
        return { data: [...items], error: null };
      }
      return { data: items.filter(item => item.status === 'published'), error: null };
    }

    insert(table: keyof DatabaseState, record: any): { data: any | null; error: { code: string; message: string } | null } {
      if (!this.isAdmin()) {
        return { data: null, error: { code: '42501', message: `new row violates row-level security policy for table "${table}"` } };
      }
      (this.db[table] as any[]).push(record);
      return { data: record, error: null };
    }

    update(table: keyof DatabaseState, id: string, updates: any): { data: any | null; error: { code: string; message: string } | null } {
      if (!this.isAdmin()) {
        return { data: null, error: { code: '42501', message: `row-level security policy violation for table "${table}"` } };
      }
      const list = this.db[table] as any[];
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        return { data: list[idx], error: null };
      }
      return { data: null, error: { code: 'P0002', message: 'Row not found' } };
    }

    delete(table: keyof DatabaseState, id: string): { success: boolean; error: { code: string; message: string } | null } {
      if (!this.isAdmin()) {
        return { success: false, error: { code: '42501', message: `row-level security policy violation for table "${table}"` } };
      }
      const list = this.db[table] as any[];
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list.splice(idx, 1);
        return { success: true, error: null };
      }
      return { success: false, error: { code: 'P0002', message: 'Row not found' } };
    }
  }

  describe('Unauthenticated / Anonymous Client', () => {
    const db = createMockDb();
    const anon = new MockSupabaseClient(db, null);

    it('isolates content queries to published items only (drafts are excluded)', () => {
      const contentTables: (keyof DatabaseState)[] = ['projects', 'skills', 'credentials', 'experiences', 'contact_links'];
      for (const table of contentTables) {
        const { data, error } = anon.select(table);
        expect(error).toBeNull();
        expect(data).toHaveLength(1);
        expect(data![0].status).toBe('published');
        expect(data!.some(r => r.status === 'draft')).toBe(false);
      }
    });

    it('rejects unauthenticated reads to admin_users table', () => {
      const { data, error } = anon.select('admin_users');
      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501');
    });

    it('rejects unauthorized insert mutations on all tables', () => {
      const tables: (keyof DatabaseState)[] = [
        'site_settings',
        'projects',
        'skills',
        'credentials',
        'experiences',
        'contact_links',
        'admin_users'
      ];
      for (const table of tables) {
        const { data, error } = anon.insert(table, { id: 'evil-1', name: 'Exploit' });
        expect(data).toBeNull();
        expect(error?.code).toBe('42501');
      }
    });

    it('rejects unauthorized update and delete operations on content', () => {
      const updateResult = anon.update('projects', 'p1', { name: 'Defaced' });
      expect(updateResult.data).toBeNull();
      expect(updateResult.error?.code).toBe('42501');

      const deleteResult = anon.delete('projects', 'p1');
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error?.code).toBe('42501');
    });
  });

  describe('Authenticated Non-Admin User', () => {
    const db = createMockDb();
    const nonAdmin = new MockSupabaseClient(db, 'regular-user-id-999');

    it('restricts queries to published rows only', () => {
      const { data, error } = nonAdmin.select('projects');
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].status).toBe('published');
    });

    it('blocks access to admin_users list', () => {
      const { data, error } = nonAdmin.select('admin_users');
      expect(data).toBeNull();
      expect(error?.code).toBe('42501');
    });

    it('rejects mutation attempts', () => {
      const { error } = nonAdmin.insert('skills', { id: 's3', name: 'Hacked Skill' });
      expect(error?.code).toBe('42501');
    });
  });

  describe('Authenticated Admin User', () => {
    const db = createMockDb();
    const admin = new MockSupabaseClient(db, 'admin-uuid-1');

    it('grants full read access to draft and published items', () => {
      const { data, error } = admin.select('projects');
      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data!.some(r => r.status === 'draft')).toBe(true);
      expect(data!.some(r => r.status === 'published')).toBe(true);
    });

    it('grants read access to admin_users', () => {
      const { data, error } = admin.select('admin_users');
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].email).toBe('admin@example.com');
    });

    it('allows valid insert, update, and delete mutations', () => {
      const newSkill = { id: 's3', name: 'GraphQL', status: 'draft' };
      const insertResult = admin.insert('skills', newSkill);
      expect(insertResult.error).toBeNull();
      expect(insertResult.data.name).toBe('GraphQL');

      const updateResult = admin.update('skills', 's3', { name: 'GraphQL & Apollo' });
      expect(updateResult.error).toBeNull();
      expect(updateResult.data.name).toBe('GraphQL & Apollo');

      const deleteResult = admin.delete('skills', 's3');
      expect(deleteResult.error).toBeNull();
      expect(deleteResult.success).toBe(true);
    });
  });
});
