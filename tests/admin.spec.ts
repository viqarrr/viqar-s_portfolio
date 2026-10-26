import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Admin CMS Smoke Suite', () => {
  test.describe('Route Guard & Security Headers (AUTH-02, SEC-03)', () => {
    test('unauthenticated visit to /admin redirects to /admin/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      await expect(page).toHaveURL(new RegExp('/admin/login'));
    });

    test('unauthenticated visit to /admin/settings redirects to /admin/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/settings`);
      await expect(page).toHaveURL(new RegExp('/admin/login'));
    });

    test('unauthenticated visit to /admin/projects redirects to /admin/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/projects`);
      await expect(page).toHaveURL(new RegExp('/admin/login'));
    });

    test('unauthenticated visit to /admin/preview redirects to /admin/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/preview`);
      await expect(page).toHaveURL(new RegExp('/admin/login'));
    });

    test('login page serves X-Robots-Tag: noindex, nofollow header', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/admin/login`);
      expect(response.status()).toBe(200);
      const headers = response.headers();
      expect(headers['x-robots-tag']).toContain('noindex, nofollow');
    });
  });

  test.describe('Admin Login Form (AUTH-01)', () => {
    test('renders login form inputs and submit button', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('submitting invalid credentials displays error and remains on login page', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);
      await page.fill('input[type="email"]', 'unauthorized@example.com');
      await page.fill('input[type="password"]', 'WrongPassword123!');
      await page.click('button[type="submit"]');

      // Wait for error feedback
      await expect(page.locator('text=Authentication failed').or(page.locator('text=Invalid credentials')).or(page.locator('text=error'))).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveURL(new RegExp('/admin/login'));
    });
  });

  test.describe('Admin Mutation API Authorization Guards', () => {
    test('POST /api/admin/settings rejects unauthenticated requests', async ({ request }) => {
      const res = await request.put(`${BASE_URL}/api/admin/settings`, {
        data: { site_title: 'Hacked' },
      });
      expect([401, 403]).toContain(res.status());
    });

    test('POST /api/admin/reorder rejects unauthenticated requests', async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/admin/reorder`, {
        data: { collection: 'projects', items: [] },
      });
      expect([401, 403]).toContain(res.status());
    });

    test('POST /api/admin/status rejects unauthenticated requests', async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/admin/status`, {
        data: { collection: 'projects', id: '123', status: 'draft' },
      });
      expect([401, 403]).toContain(res.status());
    });

    test('POST /api/admin/publish rejects unauthenticated requests', async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/admin/publish`);
      expect([401, 403]).toContain(res.status());
    });

    test('POST /api/admin/upload rejects unauthenticated requests', async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/admin/upload`);
      expect([401, 403]).toContain(res.status());
    });
  });

  test.describe('Public Site Parity & Isolation (P0)', () => {
    test('public home page loads 200 OK without admin styles', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/`);
      expect(response?.status()).toBe(200);

      // Verify that admin.css is not linked in public head
      const adminCssLink = await page.$('link[href*="admin.css"]');
      expect(adminCssLink).toBeNull();

      // Verify public content is rendered
      await expect(page.locator('main#main')).toBeVisible();
    });
  });
});
