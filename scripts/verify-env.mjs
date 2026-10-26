#!/usr/bin/env node

/**
 * scripts/verify-env.mjs
 * Automated validation script ensuring .env.example contains only clean placeholder values (SEC-05).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_EXAMPLE_PATH = resolve('.env.example');

if (!existsSync(ENV_EXAMPLE_PATH)) {
  console.error('[verify-env] Error: .env.example file not found.');
  process.exit(1);
}

const content = readFileSync(ENV_EXAMPLE_PATH, 'utf8');
const lines = content.split('\n');

const REQUIRED_VARS = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DEPLOY_HOOK_URL',
  'SITE_URL'
];

const parsedVars = new Map();

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;

  const eqIdx = line.indexOf('=');
  if (eqIdx !== -1) {
    const key = line.slice(0, eqIdx).trim();
    const val = line.slice(eqIdx + 1).trim();
    parsedVars.set(key, val);
  }
}

let errors = 0;

// 1. Verify presence of all required variables
for (const req of REQUIRED_VARS) {
  if (!parsedVars.has(req)) {
    console.error(`[verify-env] INVALID ENV TEMPLATE: Missing required variable '${req}' in .env.example`);
    errors++;
  }
}

// 2. Verify placeholder safety (no live credentials or real private keys)
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/;
const ALLOWED_PLACEHOLDERS = [
  '',
  'https://YOUR-PROJECT.supabase.co',
  'YOUR_ANON_KEY_PLACEHOLDER',
  'YOUR_ANON_KEY',
  'https://viqar.dev',
  'https://example.com'
];

for (const [key, val] of parsedVars.entries()) {
  if (JWT_PATTERN.test(val)) {
    console.error(`[verify-env] INVALID ENV TEMPLATE: Variable '${key}' contains a real JWT token.`);
    errors++;
  }

  // Ensure high-privilege keys are empty or explicit placeholder
  if (key === 'SUPABASE_SERVICE_ROLE_KEY' && val.length > 0) {
    console.error(`[verify-env] INVALID ENV TEMPLATE: SUPABASE_SERVICE_ROLE_KEY must be empty in .env.example.`);
    errors++;
  }

  if (val.length > 0 && !ALLOWED_PLACEHOLDERS.includes(val) && !val.includes('YOUR-') && !val.includes('example.com') && !val.includes('viqar.dev') && !val.includes('PLACEHOLDER')) {
    console.error(`[verify-env] INVALID ENV TEMPLATE: Variable '${key}' has unexpected non-placeholder value '${val}'.`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n[verify-env] Verification failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`[verify-env] .env.example verified: All ${REQUIRED_VARS.length} required variables documented with clean placeholders.`);
process.exit(0);
