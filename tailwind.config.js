/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom colors for our wine app
        'wine-red': '#722F37',
        'wine-gold': '#C3A17D',
        'wine-dark': '#1A1A1A',
        'wine-light': '#F5F0E6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
