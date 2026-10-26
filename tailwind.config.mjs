/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/admin/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}',
    './src/components/admin/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}',
    './src/layouts/AdminLayout.astro'
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f8fafc',
          muted: '#94a3b8',
          primary: '#3b82f6',
          danger: '#ef4444',
          success: '#10b981'
        }
      }
    },
  },
  plugins: [],
};
