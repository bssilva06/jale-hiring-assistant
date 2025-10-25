/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jale/Work4Workers Brand Colors (Updated)
        primary: '#1B56FD',      // Bright Blue (main brand color)
        secondary: '#0118D8',    // Deep Blue (darker accent)
        accent: '#E9DFC3',       // Cream/Beige (highlights)
        light: '#FFF8F8',        // Off-white (backgrounds)
        success: '#10B981',      // Green (success states)
        warning: '#F59E0B',      // Amber (warnings)
        danger: '#EF4444',       // Red (errors)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
