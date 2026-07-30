/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14212B',
          soft: '#243442',
          muted: '#4A5A66',
        },
        sand: {
          DEFAULT: '#F3EEE6',
          deep: '#E7E1D8',
          warm: '#FAF7F2',
        },
        brass: {
          DEFAULT: '#9C7A3C',
          soft: '#B8945A',
          deep: '#7A5E2C',
        },
        forest: {
          DEFAULT: '#2F5D50',
          soft: '#3E7566',
          deep: '#23463C',
        },
        primary: {
          50: '#F3EEE6',
          100: '#E7E1D8',
          200: '#CFC6B8',
          300: '#A8A095',
          400: '#6B7280',
          500: '#4A5A66',
          600: '#243442',
          700: '#1A2A34',
          800: '#14212B',
          900: '#0C151B',
        },
        secondary: {
          50: '#F7F1E4',
          100: '#EDE0C8',
          200: '#D4B87E',
          300: '#B8945A',
          400: '#9C7A3C',
          500: '#9C7A3C',
          600: '#7A5E2C',
          700: '#5C4621',
          800: '#3F3017',
          900: '#2A2010',
        },
        accent: {
          50: '#E8F2EF',
          100: '#C5DED6',
          200: '#8FBBAE',
          300: '#5A917F',
          400: '#3E7566',
          500: '#2F5D50',
          600: '#23463C',
          700: '#1A342D',
          800: '#12231E',
          900: '#0B1613',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'Segoe UI', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'rise': 'rise 0.7s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
