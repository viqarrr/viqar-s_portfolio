import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

function isolateTailwindToAdmin() {
  return {
    name: 'isolate-tailwind-to-admin',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-plugin-isolate-tailwind',
                configResolved(config) {
                  const postcssPlugins = config.css?.postcss?.plugins;
                  if (Array.isArray(postcssPlugins)) {
                    for (const p of postcssPlugins) {
                      if (p && p.postcssPlugin === 'tailwindcss' && Array.isArray(p.plugins)) {
                        const orig = p.plugins[0];
                        p.plugins[0] = async function (root, result) {
                          const file = result?.opts?.from || root?.source?.input?.file || '';
                          if (!file.includes('admin')) {
                            return;
                          }
                          return orig.call(this, root, result);
                        };
                      }
                    }
                  }
                }
              }
            ]
          }
        });
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://viqar.dev',
  output: 'static',
  integrations: [
    sitemap(),
    react(),
    tailwind({ applyBaseStyles: false }),
    isolateTailwindToAdmin()
  ],
  devToolbar: {
    enabled: false
  },
  adapter: vercel({
    webAnalytics: {
      enabled: false
    }
  })
});
