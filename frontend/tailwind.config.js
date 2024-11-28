/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core trading colors
        buy: {
          light: '#4caf50',
          DEFAULT: '#388e3c',
          dark: '#2e7d32',
        },
        sell: {
          light: '#ef5350',
          DEFAULT: '#d32f2f',
          dark: '#c62828',
        },
        // UI colors
        surface: {
          DEFAULT: '#1a1a1a',
          light: '#242424',
          dark: '#121212',
        },
        border: {
          DEFAULT: '#333333',
          light: '#404040',
          dark: '#262626',
        },
      },
      fontSize: {
        price: ['0.875rem', '1.25rem'], // For price displays
        amount: ['0.75rem', '1rem'], // For amount displays
      },
    },
  },
  plugins: [],
}
