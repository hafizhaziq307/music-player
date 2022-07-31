/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.svelte", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],

  variants: {
    scrollbar: ["rounded"],
  },
};
