/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        dark: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0',
        subtext: '#64748b',
      },
    },
  },
  plugins: [],
}