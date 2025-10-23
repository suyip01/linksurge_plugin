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
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'dropdown-in': 'dropdownIn 0.4s ease-out forwards',
        'dropdown-out': 'dropdownOut 0.3s ease-in forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-10px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          }
        },
        dropdownIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.9) translateY(-8px)', 
            'transform-origin': 'top'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)', 
            'transform-origin': 'top'
          }
        },
        dropdownOut: {
          '0%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)', 
            'transform-origin': 'top'
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0.9) translateY(-8px)', 
            'transform-origin': 'top'
          }
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}