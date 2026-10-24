import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://viqar.dev',
  output: 'static',
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: false
    }
  })
});
