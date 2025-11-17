/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#6B46C1',
          blue: '#3B82F6',
          orange: '#F97316',
          dark: '#0F172A',
          slate: '#1E293B',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 50%, #F97316 100%)',
        'soul-gradient': 'radial-gradient(circle at top, #6B46C1, #0F172A)',
      },
    },
  },
  plugins: [],
}

