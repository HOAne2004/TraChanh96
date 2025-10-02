/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        primary: '#22c55e',
        primary_hover:'#16a34a',
        dark: '#374151',
      },
      fontSize:{

      },
    },
  },
  plugins: [],
}

