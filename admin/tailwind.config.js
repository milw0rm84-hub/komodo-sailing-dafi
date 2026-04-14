/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D97706',
        secondary: '#059669',
        dark: '#1F2937',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
