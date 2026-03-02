/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
    "./stores/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

module.exports = config;
