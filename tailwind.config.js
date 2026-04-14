/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFAB00',
        secondary: '#25D366',
        dark: '#1a1a2e',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
