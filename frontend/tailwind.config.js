import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables dark mode via 'dark' class
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',   // light blue background (like bg-blue-50)
          100: '#dbeafe',  // light border or hover
          500: '#3b82f6',  // main button/active color (like blue-500)
        },
        danger: {
          50: '#fef2f2',   // soft red bg
          100: '#fee2e2',  // light red bg
          500: '#ef4444',  // red button / text
        },
        dark: {
          900: '#111827',  // default dark background
        },
        gray: {
          900: '#111827',  // override Tailwind’s default for dark mode
        }
      },
    },
  },
  plugins: [flowbitePlugin],
};
