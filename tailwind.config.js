/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0f14',
        panel: '#161a23',
        edge: '#262d3a',
        accent: '#e8b923',
        accent2: '#d23f3f',
      },
    },
  },
  plugins: [],
}
