/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: '#F5C518',
        'gold-dark': '#C9A000',
        pink: '#FF3CAC',
        purple: '#784BA0',
        blue: '#2BD9FE',
        edge: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
