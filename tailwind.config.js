/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'bg-primary': '#3F3F3F',
        'text-primary': '#222222',
      },
      fontFamily: {
        app: ['"Trebuchet MS"', '"Lucida Sans Unicode"', '"Lucida Grande"', '"Lucida Sans"', 'Arial', 'sans-serif'],
        poetsen: ['"PoetsenOne"', 'Verdana', 'Tahoma']
      }
    },
  },
  plugins: [],
}