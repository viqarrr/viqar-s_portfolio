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
          canvas: '#0d0c11',
          card: '#18171f',
          cardHover: '#1f1d26',
          accent: '#6c3cff',
          accentHover: '#5a2de0',
          primary: '#ffffff',
          secondary: '#aaa7b4',
          muted: '#5d5a67',
          divider: 'rgba(255, 255, 255, 0.06)',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      fontFamily: {
        heading: ['Gabarito', 'sans-serif'],
        sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'apple-xl': '16px',
        'apple-2xl': '20px',
        'apple-3xl': '24px',
      },
      boxShadow: {
        'apple-card': '0 4px 24px -1px rgba(0, 0, 0, 0.4), 0 2px 8px -1px rgba(0, 0, 0, 0.3)',
        'apple-float': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'apple-glow': '0 0 20px rgba(108, 60, 255, 0.35)',
      }
    },
  },
  plugins: [],
};
