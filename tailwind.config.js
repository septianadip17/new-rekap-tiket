/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#05060a',
        panel: '#0b0e17',
        panel2: '#0f1320',
        edge: 'rgba(148, 163, 184, 0.12)',
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.15), 0 0 24px -4px rgba(34,211,238,0.25)',
        panel: '0 24px 60px -24px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
}
