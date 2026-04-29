/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        astral: {
          bg: '#0F0A1E',
          card: '#1A1030',
          surface: '#251850',
          violet: '#7C3AED',
          'violet-hover': '#6D28D9',
          gold: '#D4AF37',
          'gold-light': '#E8C94F',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
