/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        calc: {
          50: '#eef3ff',
          100: '#dfe9ff',
          400: '#5d7de6',
          500: '#3f5fcf',
          600: '#334ca8',
          800: '#1e2a52',
        },
        spark: {
          100: '#d3f8ff',
          400: '#3bc8e2',
          500: '#14acc9',
        },
        panel: {
          100: '#f7faff',
          200: '#e9effd',
          900: '#111a34',
        },
      },
    },
  },
  plugins: [],
}
