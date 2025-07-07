/* @import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities"; */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Autofill fixes */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0px 1000px #fff inset !important;
  -webkit-text-fill-color: #1a1a1a !important; /* Light mode text */
  transition: background-color 5000s ease-in-out 0s;
    /* -webkit-text-fill-color: #000 !important; */

}

/* Dark mode autofill support */
.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus {
    /* -webkit-text-fill-color: #fff !important; */

  box-shadow: 0 0 0px 1000px #23272f inset !important;  /* Dark card background */
  -webkit-text-fill-color: #f4f4f4 !important; /* Light text for dark mode */
}

html, body {
  overflow: hidden;
}

/* Smooth background transition for html and body */
html, body {
  transition: background-color 0.21s ease-in-out;
  background-color: white; /* default light mode */
}

/* Dark mode support */
html.dark, body.dark {
  /* background-color: #111827; Tailwind's bg-gray-900 */
  background-color: #23272f; /* Dark mode background */
  color: #f4f4f4; /* Light text for dark mode */
}


html, body {
  background-color: #ffffff; /* fallback for light mode */
  transition: background-color 0.21s ease-in-out;
  min-height: 100%;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
html.dark, body.dark {
  background-color: #111827;
}







//category buttons css

"bg-pink-500 dark:bg-[#1f2226] border border-pink-600 text-white dark:text-pink-500 py-2 px-4 rounded-lg m-3  hover:bg-pink-600 dark:hover:bg-pink-600 hover:text-white dark:hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"