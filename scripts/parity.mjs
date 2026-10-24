// Visual + computed-style parity: legacy/reference.html (truth) vs the Astro build.
// Usage: npm i -D playwright pixelmatch pngjs && npx playwright install chromium
//        NEW_URL=http://localhost:4321 node scripts/parity.mjs [--mode=reduce|motion] [--update-baseline] [--self-check]
// Exit code 1 on failure. Output: .parity/{ref,new,diff}/*.png + report.json
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Auto-fallback to D:\ms-playwright if present to save C: drive space
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('D:/ms-playwright')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = 'D:/ms-playwright';
}

const { chromium } = await import('playwright');
const { PNG } = await import('pngjs');
const { default: pixelmatch } = await import('pixelmatch');

const arg = n => process.argv.find(a => a.startsWith(`--${n}=`))?.split('=')[1];
const mode = arg('mode') ?? 'reduce';                       // reduce = deterministic static layout; motion = scroll-driven states
const isSelfCheck = process.argv.includes('--self-check');
const REF = pathToFileURL(resolve('legacy/reference.html')).href;
const NEW = isSelfCheck ? REF : (process.env.NEW_URL ?? 'http://localhost:4321');
const MAX_DIFF_RATIO = mode === 'reduce' ? 0.001 : 0.01;   // fraction of differing pixels allowed per shot
const VIEWPORTS = [
  { w: 375, h: 667 },   // mobile (PARITY-01)
  { w: 390, h: 844 },   // modern mobile
  { w: 768, h: 1024 },  // tablet
  { w: 1440, h: 900 }   // desktop
];
const STEPS = mode === 'reduce' ? [0] : [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // scroll fractions
const SETTLE_MS = mode === 'reduce' ? 600 : 1400;           // lets Lenis lerp + scrubbed tweens settle
const PROPS = ['transform', 'opacity', 'clipPath', 'width', 'height', 'top', 'left', 'color', 'backgroundColor', 'fontSize', 'fontFamily'];

for (const d of ['ref', 'new', 'diff']) mkdirSync(`.parity/${d}`, { recursive: true });
const browser = await chromium.launch();
const report = [];
let failed = false;

async function capture(url, vp, ctxOpts) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, ...ctxOpts });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const shots = [];
  for (const f of STEPS) {
    await page.evaluate(y => window.scrollTo(0, y), Math.round((height - vp.h) * f));
    await page.waitForTimeout(SETTLE_MS);
    const png = await page.screenshot({ animations: 'disabled', caret: 'hide' });
    const styles = await page.evaluate(props => {
      const out = {}, seen = {};
      document.querySelectorAll('[class]').forEach(el => {
        const c = el.className.toString().split(' ')[0]; seen[c] = (seen[c] ?? -1) + 1;
        const cs = getComputedStyle(el); out[`${c}:${seen[c]}`] = props.map(p => cs[p]).join('|');
      });
      return out;
    }, PROPS);
    shots.push({ png, styles });
  }
  await ctx.close();
  return { height, shots };
}

for (const vp of VIEWPORTS) {
  const ctxOpts = { reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' };
  const [ref, cur] = [await capture(REF, vp, ctxOpts), await capture(NEW, vp, ctxOpts)];
  const row = { viewport: `${vp.w}x${vp.h}`, docHeight: { ref: ref.height, new: cur.height }, shots: [] };
  if (ref.height !== cur.height) { failed = true; row.heightMismatch = true; }
  ref.shots.forEach((r, i) => {
    const c = cur.shots[i]; const a = PNG.sync.read(r.png); const b = PNG.sync.read(c.png);
    const tag = `${vp.w}-${String(i).padStart(2, '0')}`;
    writeFileSync(`.parity/ref/${tag}.png`, r.png); writeFileSync(`.parity/new/${tag}.png`, c.png);
    const diff = new PNG({ width: a.width, height: a.height });
    const px = a.width === b.width && a.height === b.height ? pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }) : a.width * a.height;
    const ratio = px / (a.width * a.height);
    if (ratio > 0) writeFileSync(`.parity/diff/${tag}.png`, PNG.sync.write(diff));
    const styleDiffs = Object.keys(r.styles).filter(k => r.styles[k] !== c.styles[k]).slice(0, 15);
    const ok = ratio <= MAX_DIFF_RATIO && (mode === 'motion' || styleDiffs.length === 0);
    if (!ok) failed = true;
    row.shots.push({ tag, scroll: STEPS[i], diffRatio: +ratio.toFixed(5), ok, styleDiffs });
  });
  report.push(row);
}
await browser.close();
writeFileSync('.parity/report.json', JSON.stringify({ mode, failed, report }, null, 2));
const bad = report.flatMap(r => r.shots.filter(s => !s.ok).map(s => `${r.viewport} ${s.tag} diff=${s.diffRatio} styles=${s.styleDiffs.slice(0, 3).join(',')}`));
console.log(failed ? `PARITY FAIL (${mode})\n` + bad.join('\n') + '\nSee .parity/diff/*.png' : `PARITY OK (${mode})`);
process.exit(failed ? 1 : 0);
