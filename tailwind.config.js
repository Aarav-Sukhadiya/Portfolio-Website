/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#171717',
        border: '#262626',
        primary: '#ffffff',
        secondary: '#a3a3a3',
        accent: '#3b82f6', // subtle blue accent
      }
    },
  },
  plugins: [],
}
