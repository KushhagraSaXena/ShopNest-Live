import flowbitePlugin from 'flowbite/plugin';


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- This line enables dark mode via the 'dark' class
  content: [
    "/index.html",
    "./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gray': {
          900: '#111827', // Override Tailwind's gray-900 for dark backgrounds
        },
      },
    },
  },
  plugins: [flowbitePlugin],
}
