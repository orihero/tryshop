/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wheat: '#F5DEB3',
      },
      fontFamily: {
        'gothic': ['"Special Gothic Expanded One"', 'sans-serif'],
        'gothic-cyrillic': ['"Dela Gothic One"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
