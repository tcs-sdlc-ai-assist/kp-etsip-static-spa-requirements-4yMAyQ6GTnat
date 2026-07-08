/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        // KP ETSIP Color Palette - replace with actual values
        'kp-primary': '#2563eb',
        'kp-secondary': '#64748b',
        'kp-accent': '#fbbf24',
        'kp-background': '#f8fafc',
        'kp-text': '#1e293b'
      }
    }
  },
  plugins: []
}