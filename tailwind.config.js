/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C0392B',
          dark: '#A93226',
          light: '#E74C3C'
        },
        offwhite: '#F9F9F9'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],      // Default body
        heading: ['Poppins', 'sans-serif']  // For headings/buttons
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        flyOff: {
          '0%': { transform: 'translateX(0) translateY(0) rotate(0deg)', opacity: '1' },
          '20%': { transform: 'translateX(5px) translateY(-5px) rotate(15deg)', opacity: '1' },
          '100%': { transform: 'translateX(150px) translateY(-100px) rotate(45deg)', opacity: '0' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.7s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'fly-off': 'flyOff 1s ease-in forwards', // Use as 'animate-fly-off'
      },
    },
  },
  plugins: [],
}