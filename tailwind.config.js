/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#12121A',
        surface_hover: '#1C1C26',
        primary: '#6366F1', // Indigo
        primary_glow: 'rgba(99, 102, 241, 0.4)',
        secondary: '#10B981', // Emerald
        accent: '#8B5CF6', // Violet
        text_main: '#F8FAFC',
        text_muted: '#94A3B8',
        danger: '#EF4444',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
