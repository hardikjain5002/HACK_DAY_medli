/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          400: '#3eb484',
          500: '#1e9469',
        },
        surface: '#0d1117',
        card:    '#161b22',
        border:  '#21262d',
      }
    },
  },
  plugins: [],
}