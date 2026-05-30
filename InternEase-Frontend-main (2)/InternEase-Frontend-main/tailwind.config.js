/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        pop: ['"Poppins"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      colors: {
        primary: "#9B5DE5",
        secondary: "#F15BB5",
        accent: "#00BBF9",
        warning: "#FEE440",
        success: "#00F5D4",
        darkBg: "#0f0f0f",
        cardDark: "#1c1c1c",
        grayDark: "#2d2d2d",
        textLight: "#f8f9fa",
        textGray: "#6c757d"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}