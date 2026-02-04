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
        // Dark Mode (Default)
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#1A1A1A',
        'bg-tertiary': '#262626',
        'bg-elevated': '#333333',
        
        'border-subtle': '#2A2A2A',
        'border-default': '#3D3D3D',
        'border-strong': '#525252',
        
        'text-primary': '#FAFAFA',
        'text-secondary': '#A3A3A3',
        'text-tertiary': '#737373',
        'text-muted': '#525252',
        
        // Functional (monochrome only)
        'accent-subtle': '#404040',
        'success': '#525252',
        'destructive': '#737373',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': '0.64rem',
        'sm': '0.8rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.05em',
        'wider': '0.1em',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '2px',
        'md': '4px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'DEFAULT': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
