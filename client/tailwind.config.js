/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          500: '#1e3a5f',
          700: '#12355b',
          900: '#0A2540',
        },
        gold: {
          100: '#f4e6b5',
          300: '#e2c760',
          500: '#C9A227',
          700: '#8c6f15',
        },
        offwhite: '#F8F9FB',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(10,37,64,0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
