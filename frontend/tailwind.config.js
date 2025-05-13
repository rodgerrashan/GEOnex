/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-signal': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'scale(0.5)', opacity: '0.6' },
          '70%': { transform: 'scale(2)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'pulse-signal': 'pulse-signal 1.5s ease-out infinite',
         wave: 'wave 2s ease-out infinite',
        'wave-delay': 'wave 2s ease-out infinite 1s',
      },
    }
  },
  plugins: [],
}