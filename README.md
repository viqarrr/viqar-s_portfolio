# Viqar — Developer Portfolio & Admin CMS

A high-performance personal developer portfolio and content management portal for **Viqar 'Ammar Zulfa Mulya**, specializing in Front-End Web, Flutter Mobile, and Unity Game Development.

Built with **Astro 5**, **GSAP 3.13**, **Lenis 1.3**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## Key Highlights & Core Principles

- **Zero-Regressed Parity**: Exact 1:1 pixel and motion parity preserving the original bespoke design, interactive micro-interactions, smooth inertia scrolling, and scrubbed timeline animations.
- **Ultra-Fast Performance**: Zero client JavaScript overhead on static public content by default. Pre-rendered at build time with optimal Core Web Vitals: LCP < 1.5s, CLS = 0.0, and 100 SEO score.
- **Isolated Admin CMS**: Fully responsive, authenticated content management system mounted at `/admin/**` powered by serverless SSR, Supabase Row Level Security (RLS), and isolated React islands with Tailwind CSS.
- **Security-First Architecture**: Content Security Policy (CSP), defense-in-depth HTTP security headers, automated secret scanning in CI/CD, and sanitization of dynamic SVG content against XSS attacks.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │                 Client Edge                   │
                      └───────┬───────────────────────────────┬───────┘
                              │                               │
                      Public Routes (/)               Admin Routes (/admin/**)
                              │                               │
                      ┌───────▼───────────────┐       ┌───────▼───────────────┐
                      │ Static Pre-rendered   │       │ On-Demand SSR Island  │
                      │ Astro HTML + CSS      │       │ React + Tailwind      │
                      └───────┬───────────────┘       └───────┬───────────────┘
                              │                               │
                              │ (Build-time Fetch)            │ (Auth & Mutations)
                              │                               │
                      ┌───────▼───────────────────────────────▼───────┐
                      │              Supabase PostgreSQL              │
                      │  - Row Level Security (RLS)                   │
                      │  - S3-Compatible Media Storage                │
                      │  - Cookie Session Auth via @supabase/ssr      │
                      └───────────────────────────────────────────────┘
```

### Static Public Experience
- Pre-rendered static HTML generated at build time (`output: "static"`).
- Global stylesheets loaded without CSS framework collisions or runtime style reordering.
- Self-hosted Gabarito and Onest fonts in modern WOFF2 format with preloading.
- Motion and interactions powered by exact pins of `gsap@3.13.0` and `lenis@1.3.4`.

### Dynamic Admin CMS
- Server-rendered SSR routes under `/admin/**` isolated from the public layout.
- Protected by Astro middleware verifying session cookies against `admin_users` table whitelist.
- Dynamic CRUD interfaces for Site Settings, Projects, Skills, Credentials, Experiences, Contact Links, and Media Assets.
- Native drag-and-drop reordering powered by `@dnd-kit`.
- Automatic build-trigger webhook integration upon publishing changes.

---

## Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Framework** | [Astro 5](https://astro.build/) | Static site generation with hybrid serverless SSR adapter |
| **Motion & Scroll** | [GSAP 3.13](https://greensock.com/) & [Lenis 1.3](https://lenis.darkroom.engineering/) | Smooth scroll scrubbing, timeline animations, curtain wipe transitions |
| **Database & Auth** | [Supabase](https://supabase.com/) | Managed PostgreSQL, Row Level Security, Auth, S3 Storage |
| **Admin UI** | React 19, Tailwind CSS, Lucide | Isolated interactive islands for content administration |
| **Validation** | [Zod](https://zod.dev/) | Compile-time & runtime schema validation and data sanitization |
| **Testing** | [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/) | Unit tests, schema tests, RLS policy tests, visual parity test suite |

---

## Getting Started

### Prerequisites
- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/placeholder/viqars-portfolio.git
   cd viqars-portfolio
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browser binaries (for parity tests):**
   ```bash
   npx playwright install chromium
   ```

4. **Configure environment variables:**
   Copy the example template and supply your credentials:
   ```bash
   cp .env.example .env
   ```

5. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to view the public site, or [http://localhost:4321/admin](http://localhost:4321/admin) for the admin portal.

---

## Database Setup & Content Seeding

The application uses Supabase for content storage with declarative SQL migrations and seed data fallback.

1. **Create a Supabase Project:**
   Set up a new project on [Supabase Dashboard](https://database.new).

2. **Apply Database Migration:**
   Execute `supabase/migrations/0001_init.sql` in the Supabase SQL Editor. This script creates:
   - Tables: `admin_users`, `site_settings`, `projects`, `skills`, `credentials`, `experiences`, `contact_links`
   - Functions: `is_admin()`, `touch_updated_at()`
   - Row Level Security (RLS) policies protecting write access and draft records
   - Storage bucket: `media` with public read access

3. **Seed Database:**
   Populate the database with initial portfolio content from `supabase/seed.json`:
   ```bash
   npm run seed
   ```

---

## Quality Assurance & Testing Suite

Run the automated verification commands to guarantee code quality and visual integrity:

```bash
# Type check, linting diagnostics, and Vitest unit/RLS test suite
npm run check

# Execute unit and security test suites offline
npm test

# Run Playwright visual & computed-style parity checks across 4 viewports
npm run parity

# Run scrubbed motion timeline parity check
npm run parity:motion

# Run Admin CMS end-to-end smoke test suite
npm run test:admin

# Build production artifacts
npm run build

# Scan build output in dist/ for secret leaks
node scripts/audit-secrets.mjs
```

---

## Production Deployment Runbook

### Deploying to Vercel

1. **Create Vercel Project:**
   Import the Git repository into Vercel. Astro automatically detects the `@astrojs/vercel` adapter.

2. **Configure Environment Variables in Vercel:**
   Add the following environment variables in **Project Settings → Environment Variables**:
   - `PUBLIC_SUPABASE_URL`: Your Supabase Project URL (`https://<id>.supabase.co`)
   - `PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Client Key
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (Server-only secret)
   - `SITE_URL`: Canonical site URL (e.g., `https://viqar.dev`)
   - `DEPLOY_HOOK_URL`: Vercel Deploy Hook URL (generated below)

3. **Create Vercel Deploy Hook:**
   - In Vercel Project Settings, navigate to **Git → Deploy Hooks**.
   - Create a hook named `cms-publish` targeting branch `main`.
   - Copy the webhook URL into `DEPLOY_HOOK_URL` in both Vercel and local `.env`.
   - When the Admin clicks **Publish site**, the CMS triggers this hook to rebuild and redeploy static pages with updated content.

4. **Create Initial Administrator:**
   - Sign up a user in Supabase Auth (or via `/admin/login`).
   - Run the following SQL query in the Supabase SQL Editor to grant admin privileges:
     ```sql
     insert into public.admin_users (user_id, email)
     values ('<auth-user-uuid>', 'admin@example.com')
     on conflict do nothing;
     ```

---

## License

Private repository. Copyright © 2026 Viqar 'Ammar Zulfa Mulya. All rights reserved.
