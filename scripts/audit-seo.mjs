// Automated SEO & Structured Data audit script: verifies meta tags, canonical URL, Open Graph, Twitter cards, JSON-LD, robots.txt, and sitemap.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const indexHtmlPath = path.join(DIST, 'index.html');
const robotsTxtPath = path.join(DIST, 'robots.txt');
const sitemapIndexPath = path.join(DIST, 'sitemap-index.xml');
const sitemap0Path = path.join(DIST, 'sitemap-0.xml');

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`FAIL: ${indexHtmlPath} does not exist. Run npm run build first.`);
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf8');
const errors = [];

// 1. Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
if (!titleMatch || !titleMatch[1].trim()) {
  errors.push('Missing or empty <title> tag.');
} else {
  console.log(`✓ Title: "${titleMatch[1]}"`);
}

// 2. Meta description (properly extracting double-quoted or single-quoted content)
const descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]+)"/i) ||
                  html.match(/<meta\s+name=["']description["']\s+content='([^']+)'/i);
if (!descMatch || descMatch[1].length < 50) {
  errors.push(`Missing or too short (<50 chars) meta description. Found: ${descMatch ? descMatch[1] : 'null'}`);
} else {
  console.log(`✓ Meta description (${descMatch[1].length} chars): "${descMatch[1].slice(0, 60)}..."`);
}

// 3. Canonical URL
const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
if (!canonicalMatch || !canonicalMatch[1].startsWith('https://')) {
  errors.push('Missing or invalid https canonical link tag.');
} else {
  console.log(`✓ Canonical URL: "${canonicalMatch[1]}"`);
}

// 4. Open Graph tags
const requiredOg = ['og:type', 'og:title', 'og:description', 'og:url', 'og:image'];
for (const og of requiredOg) {
  const ogRegex = new RegExp(`<meta\\s+property=["']${og}["']\\s+content="([^"]+)"`, 'i');
  if (!ogRegex.test(html)) {
    errors.push(`Missing Open Graph tag: ${og}`);
  }
}
console.log('✓ Open Graph tags present (type, title, description, url, image)');

// 5. Twitter Card tags
const requiredTwitter = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
for (const tw of requiredTwitter) {
  const twRegex = new RegExp(`<meta\\s+name=["']${tw}["']\\s+content="([^"]+)"`, 'i');
  if (!twRegex.test(html)) {
    errors.push(`Missing Twitter tag: ${tw}`);
  }
}
console.log('✓ Twitter Card tags present (card, title, description, image)');

// 6. Schema.org Person JSON-LD
const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
if (!jsonLdMatch) {
  errors.push('Missing <script type="application/ld+json"> tag.');
} else {
  try {
    const data = JSON.parse(jsonLdMatch[1]);
    if (data['@type'] !== 'Person' || !data.name || !data.jobTitle) {
      errors.push(`Invalid JSON-LD Person schema: ${JSON.stringify(data)}`);
    } else {
      console.log(`✓ Valid schema.org Person JSON-LD parsed: "${data.name}" (${data.jobTitle})`);
    }
  } catch (err) {
    errors.push(`JSON-LD failed to parse: ${err.message}`);
  }
}

// 7. robots.txt
if (!fs.existsSync(robotsTxtPath)) {
  errors.push('dist/robots.txt does not exist.');
} else {
  const robots = fs.readFileSync(robotsTxtPath, 'utf8');
  if (!robots.includes('Disallow: /admin') || !robots.includes('Sitemap:')) {
    errors.push('dist/robots.txt missing Disallow: /admin or Sitemap directive.');
  } else {
    console.log('✓ dist/robots.txt contains Disallow: /admin and Sitemap link');
  }
}

// 8. sitemap
const hasSitemapIndex = fs.existsSync(sitemapIndexPath);
const hasSitemap0 = fs.existsSync(sitemap0Path);
if (!hasSitemapIndex && !hasSitemap0) {
  errors.push('Neither dist/sitemap-index.xml nor dist/sitemap-0.xml exists.');
} else {
  const sitemapContent = fs.readFileSync(hasSitemapIndex ? sitemapIndexPath : sitemap0Path, 'utf8');
  if (!sitemapContent.includes('viqar.dev')) {
    errors.push('Sitemap does not reference configured site domain viqar.dev.');
  } else {
    console.log(`✓ Sitemap generated and verified (${hasSitemapIndex ? 'sitemap-index.xml' : 'sitemap-0.xml'})`);
  }
}

if (errors.length > 0) {
  console.error('\nSEO AUDIT FAILED:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
} else {
  console.log('\nSEO AUDIT PASSED: All 8 criteria 100% satisfied.');
  process.exit(0);
}
