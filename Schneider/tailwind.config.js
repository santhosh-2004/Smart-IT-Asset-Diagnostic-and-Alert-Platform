/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'factory-blue': '#1e3a8a',
        'factory-gray': '#374151',
        'status-green': '#10b981',
        'status-yellow': '#f59e0b',
        'status-red': '#ef4444',
        'floor-grid': '#e5e7eb',
        'floor-border': '#9ca3af'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} 