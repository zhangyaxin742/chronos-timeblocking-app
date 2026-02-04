/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#1A1A1A',
        'bg-tertiary': '#262626',
        'text-primary': '#E8E8E8',
        'text-secondary': '#B8B8B8',
        'text-tertiary': '#888888',
        'text-muted': '#666666',
        'border-default': '#333333',
        'border-subtle': '#262626',
        'border-emphasis': '#4D4D4D',
      },
      fontFamily: {
        mono: ['JetBrainsMono', 'monospace'],
      },
    },
  },
  plugins: [],
}
