/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'],
        body: ["'DM Sans'", 'sans-serif'],
      },
      colors: {
        primary: '#1a1a2e',
        accent: '#e94560',
        accent2: '#0f9b58',
      },
    },
  },
  plugins: [],
}
