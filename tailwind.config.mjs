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
          canvas: '#0d0c11',      // --color-1
          primary: '#ffffff',     // --color-2
          accent: '#f6db00',      // --color-3
          accentHover: '#e6cc00',
          accentText: '#0d0c11',
          light: '#efeef4',       // --color-4
          secondary: '#aaa7b4',   // --color-5
          muted: '#5d5a67',       // --color-6
          card: '#1f1d26',        // --color-7
          cardHover: '#282631',
          divider: 'rgba(255, 255, 255, 0.06)',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      fontFamily: {
        heading: ['Gabarito', 'sans-serif'],
        display: ['Gabarito', 'sans-serif'],
        sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'token-1': '28px', // --radius-1
        'token-2': '999px', // --radius-2
        'token-3': '14px', // --radius-3
        'apple-xl': '14px',
        'apple-2xl': '20px',
        'apple-3xl': '28px',
      },
      boxShadow: {
        'apple-card': '0 4px 24px -1px rgba(0, 0, 0, 0.4), 0 2px 8px -1px rgba(0, 0, 0, 0.3)',
        'apple-float': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'yellow-glow': '0 0 20px rgba(246, 219, 0, 0.35)',
      }
    },
  },
  plugins: [],
};
