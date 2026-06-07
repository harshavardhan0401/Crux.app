/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0D0D14',
          'base-light': '#F4F4FA',
          surface: '#14141F',
          'surface-light': '#FFFFFF',
          surface2: '#1C1C2C',
          'surface2-light': '#F0F0F8',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          hover: '#FF5252',
          glow: 'rgba(255,107,107,0.25)',
        },
        purple: {
          DEFAULT: '#C06AF2',
          hover: '#A855D4',
          glow: 'rgba(192,106,242,0.20)',
        },
        teal: {
          DEFAULT: '#4ECDC4',
          hover: '#3BB5AC',
          glow: 'rgba(78,205,196,0.20)',
        },
        text: {
          primary: '#F1F1F5',
          'primary-light': '#0A0A0F',
          secondary: '#8B8BA0',
          'secondary-light': '#5A5A75',
          muted: '#4A4A65',
          'muted-light': '#9090B0',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4)',
        'coral-glow': '0 0 20px rgba(255,107,107,0.3)',
        'teal-glow': '0 0 20px rgba(78,205,196,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
