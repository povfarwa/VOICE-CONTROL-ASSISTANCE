/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        hud: ['Orbitron', 'monospace'],
        ui: ['Rajdhani', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        nova: {
          bg: '#020408',
          bg2: '#050c14',
          cyan: '#00b4ff',
          cyan2: '#00e5ff',
          violet: '#7c3aed',
          pink: '#f43f8a',
          green: '#00ffaa',
          amber: '#ffaa00',
          border: 'rgba(0,180,255,0.15)',
          border2: 'rgba(0,180,255,0.3)',
          glass: 'rgba(8,20,40,0.7)',
          text: 'rgba(200,230,255,0.9)',
          muted: 'rgba(120,170,220,0.5)',
        },
      },
      animation: {
        'mic-pulse': 'micPulse 1.5s ease-in-out infinite',
        'dot-pulse': 'dotPulse 2s ease-in-out infinite',
        'panel-in': 'panelIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'grid-pulse': 'gridPulse 8s ease-in-out infinite',
        'boot-load': 'bootLoad 2s ease forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        micPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(0,229,255,0.4)' },
          '70%': { boxShadow: '0 0 0 20px rgba(0,229,255,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0,229,255,0)' },
        },
        dotPulse: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        panelIn: {
          from: { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        gridPulse: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        bootLoad: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,180,255,0.4), 0 0 60px rgba(0,180,255,0.1)',
        'glow-sm': '0 0 10px rgba(0,180,255,0.3)',
        'glow-violet': '0 0 20px rgba(124,58,237,0.4)',
        'glow-green': '0 0 20px rgba(0,255,170,0.4)',
        'panel': '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,180,255,0.1)',
      },
    },
  },
  plugins: [],
}