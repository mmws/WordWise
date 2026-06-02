/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        root: {
          bg: '#0a0908',
          surface: '#141210',
          card: '#1e1a17',
          border: '#2e2824',
          muted: '#3d3530',
        },
        amber: {
          glow: '#d4a24c',
          soft: '#e8c278',
          dim: '#8a6220',
        },
        forest: {
          DEFAULT: '#2d5a4e',
          light: '#3d7a6a',
        },
        parchment: {
          DEFAULT: '#f5f0e8',
          dim: '#c8bfb0',
          muted: '#8a8070',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 8px #d4a24c40' }, '50%': { boxShadow: '0 0 24px #d4a24c80' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
}
