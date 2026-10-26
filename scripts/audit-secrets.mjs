#!/usr/bin/env node

/**
 * scripts/audit-secrets.mjs
 * Post-build secret audit script (SEC-04).
 * Recursively scans dist/ for secret leakage:
 * - Literal SUPABASE_SERVICE_ROLE_KEY
 * - Service-role JWT tokens
 * - Private key headers
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST_DIR = 'dist';

if (!existsSync(DIST_DIR)) {
  console.error(`[audit-secrets] Error: '${DIST_DIR}' directory not found. Run 'npm run build' first.`);
  process.exit(1);
}

const SCANNED_EXTS = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.json', '.map']);

function getAllFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if (SCANNED_EXTS.has(extname(fullPath).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllFiles(DIST_DIR);
let violations = 0;

console.log(`[audit-secrets] Scanning ${files.length} built artifact files in ${DIST_DIR}/...`);

const JWT_REGEX = /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;
const PRIVATE_KEY_REGEX = /-----BEGIN (?:RSA |EC |OPENSSH |PRIVATE )?KEY-----/;

for (const file of files) {
  const content = readFileSync(file, 'utf8');

  // Check 1: Literal env key name
  if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    console.error(`[audit-secrets] VIOLATION: Literal 'SUPABASE_SERVICE_ROLE_KEY' found in ${file}`);
    violations++;
  }

  // Check 2: Private key blocks
  if (PRIVATE_KEY_REGEX.test(content)) {
    console.error(`[audit-secrets] VIOLATION: Private key pattern found in ${file}`);
    violations++;
  }

  // Check 3: JWT with service_role claim
  const jwtMatches = content.match(JWT_REGEX) || [];
  for (const token of jwtMatches) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
        if (payloadStr.includes('service_role')) {
          console.error(`[audit-secrets] VIOLATION: Service role JWT detected in ${file}`);
          violations++;
        }
      }
    } catch {
      // Ignore unparseable JWT-like strings
    }
  }
}

if (violations > 0) {
  console.error(`\n[audit-secrets] AUDIT FAILED: ${violations} secret exposure violation(s) detected.`);
  process.exit(1);
} else {
  console.log(`[audit-secrets] AUDIT PASSED: Zero secret leakage detected across all ${files.length} files.\n`);
  process.exit(0);
}
