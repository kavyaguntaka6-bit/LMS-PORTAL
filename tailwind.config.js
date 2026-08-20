/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tyc: {
          white: "#FFFFFF",
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
          // Primary Brand: Electric Indigo
          indigo: {
            50: "#EEF2FF",
            100: "#E0E7FF",
            200: "#C7D2FE",
            300: "#A5B4FC",
            400: "#818CF8",
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            800: "#3730A3",
            900: "#312E81",
            DEFAULT: "#4F46E5",
            dark: "#4338CA",
            soft: "#EEF2FF",
            hover: "#4338CA",
          },
          // Accent: Vibrant Emerald
          green: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
            DEFAULT: "#10B981",
            dark: "#059669",
            soft: "#ECFDF5",
            hover: "#059669",
          },
          // Accent: Cyber Violet
          violet: {
            50: "#F5F3FF",
            100: "#EDE9FE",
            200: "#DDD6FE",
            300: "#C4B5FD",
            400: "#A78BFA",
            500: "#8B5CF6",
            600: "#7C3AED",
            700: "#6D28D9",
            800: "#5B21B6",
            900: "#4C1D95",
            DEFAULT: "#7C3AED",
          },
          // Energy Accent: Amber / Coral
          orange: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            DEFAULT: "#F59E0B",
            soft: "#FEF3C7",
            hover: "#D97706",
          },
          black: "#0F172A",
          dark: {
            bg: "#0B0F19",
            surface: "#111827",
            elevated: "#1E293B",
            border: "#1E293B",
            text: "#F8FAFC",
            muted: "#94A3B8",
          },
          gray: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(79, 70, 229, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glow-indigo': '0 0 25px -5px rgba(79, 70, 229, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'tyc': '10px',
        'tyc-lg': '14px',
        'tyc-xl': '20px',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-flow': 'gradient-flow 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
