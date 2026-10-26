// Upserts supabase/seed.json into Supabase.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
// NEVER hardcode, commit, or log the service role key.

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const isDryRun = process.argv.includes('--dry-run');

let seed;
try {
  const raw = readFileSync('supabase/seed.json', 'utf8');
  seed = JSON.parse(raw);
} catch (err) {
  console.error('Failed to read or parse supabase/seed.json:', err.message);
  process.exit(1);
}

const requiredCollections = ['projects', 'skills', 'credentials', 'experiences', 'contact_links'];
for (const col of requiredCollections) {
  if (!Array.isArray(seed[col])) {
    console.error(`Validation error: seed.${col} must be an array`);
    process.exit(1);
  }
}
if (!seed.settings || typeof seed.settings !== 'object') {
  console.error('Validation error: seed.settings must be an object');
  process.exit(1);
}

if (isDryRun) {
  console.log('[DRY RUN] supabase/seed.json is well-formed. Entity summary:');
  console.log(`  ✓ site_settings (1 configuration record)`);
  for (const col of requiredCollections) {
    console.log(`  ✓ ${col} (${seed[col].length} records)`);
  }
  console.log('[DRY RUN] Verification passed. Exiting without network mutations.');
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  console.error('Set them before running seed:');
  console.error('  $env:SUPABASE_URL="https://your-project.supabase.co"');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.error('  node scripts/seed-supabase.mjs');
  console.error('Or run with --dry-run to validate local seed file without database access.');
  process.exit(1);
}

const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

console.log('Connecting to Supabase and seeding content...');

// 1. Idempotently upsert site_settings
const DEFAULT_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';
const { data: existingSettings } = await db.from('site_settings').select('id').limit(1).maybeSingle();
const settingsRow = {
  id: existingSettings?.id || DEFAULT_SETTINGS_ID,
  ...seed.settings,
};

const { error: settingsError } = await db.from('site_settings').upsert(settingsRow, { onConflict: 'id' });
if (settingsError) {
  console.error('Failed to seed site_settings:', settingsError.message);
  process.exit(1);
}
console.log('✓ site_settings (1 row)');

// 2. Idempotently upsert content collections
for (const col of requiredCollections) {
  let records = seed[col];
  if (col === 'credentials') {
    records = records.map((c) => ({
      ...c,
      year: String(c.year),
    }));
  }

  const { error } = await db.from(col).upsert(records, { onConflict: 'slug' });
  if (error) {
    console.error(`Failed to seed ${col}:`, error.message);
    process.exit(1);
  }
  console.log(`✓ ${col} (${records.length} rows)`);
}

console.log('Supabase database seeding completed successfully.');
