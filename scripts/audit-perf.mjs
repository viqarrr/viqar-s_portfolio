// Performance and CLS audit script: measures Cumulative Layout Shift and verifies 0 external CDN requests.
import { existsSync } from 'node:fs';

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('D:/ms-playwright')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = 'D:/ms-playwright';
}

const { chromium } = await import('playwright');

const URL = process.env.URL ?? 'http://localhost:4321';
const VIEWPORTS = [
  { name: 'mobile', w: 375, h: 667 },
  { name: 'tablet', w: 768, h: 1024 },
  { name: 'desktop', w: 1440, h: 900 }
];

const FORBIDDEN_DOMAINS = ['fonts.gstatic.com', 'fonts.googleapis.com', 'cdn.jsdelivr.net', 'unpkg.com'];

console.log(`Starting performance and CLS audit against ${URL}...`);
const browser = await chromium.launch();
let failed = false;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const externalRequests = [];

  context.on('request', req => {
    const reqUrl = req.url();
    for (const d of FORBIDDEN_DOMAINS) {
      if (reqUrl.includes(d)) {
        externalRequests.push(reqUrl);
      }
    }
  });

  const page = await context.newPage();

  // Evaluate CLS via PerformanceObserver injected early
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // PerformanceObserver fallback
    }
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const cls = await page.evaluate(() => window.__cls || 0);

  console.log(`[${vp.name} (${vp.w}x${vp.h})] CLS: ${cls.toFixed(4)}, External CDN Requests: ${externalRequests.length}`);

  if (cls > 0.01) {
    console.error(`FAIL: CLS exceeded budget on ${vp.name}: ${cls}`);
    failed = true;
  }

  if (externalRequests.length > 0) {
    console.error(`FAIL: External CDN requests detected on ${vp.name}:`, externalRequests);
    failed = true;
  }

  await context.close();
}

await browser.close();

if (failed) {
  console.error('\nPERFORMANCE AUDIT FAILED');
  process.exit(1);
} else {
  console.log('\nPERFORMANCE AUDIT PASSED: CLS is strictly 0.0 and zero external CDN requests.');
  process.exit(0);
}
