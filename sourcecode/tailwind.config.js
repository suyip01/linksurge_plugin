/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./sidebar.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        youtube: {
          red: '#FF0000',
          gray: '#757575',
          lightgray: '#F5F5F5'
        }
      },
      width: {
        'sidebar': '320px'
      }
    },
  },
  plugins: [],
}