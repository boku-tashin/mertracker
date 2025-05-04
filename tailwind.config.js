// tailwind.config.js
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        keyframes: {
          shrinkFade: {
            '0%': { transform: 'scale(1)', opacity: '1' },
            '100%': { transform: 'scale(0.5)', opacity: '0' },
          },
        },
        animation: {
          shrinkFade: 'shrinkFade 0.3s ease forwards',
        },
      }
    },
    plugins: [],
  }