import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base / fundo — paleta Luminna AI
        base: {
          900: '#004D8A',
          800: '#0079CB',
          700: '#005FA3',
          600: '#003D70',
        },
        // Superficies
        surface: {
          DEFAULT: 'rgba(0, 55, 100, 0.80)',
          strong: 'rgba(0, 77, 138, 0.90)',
          soft: 'rgba(0, 55, 100, 0.55)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.14)',
          active: 'rgba(0, 153, 230, 0.45)',
        },
        // Texto
        ink: {
          DEFAULT: '#f8fafc',
          muted: '#e2effa',
          faint: '#bcd8ee',
        },
        // Acentos Luminna
        cyan: {
          glow: '#0079CB',
        },
        sky: {
          brand: '#78C9F8',
        },
        blue: {
          brand: '#0079CB',
          deep: '#024EA0',
        },
        violet: {
          brand: '#7c3aed',
        },
        purple: {
          brand: '#a855f7',
        },
        status: {
          green: '#34d399',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.8rem, 7vw, 5.8rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        section: ['clamp(2.2rem, 4.6vw, 4.1rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '28px',
      },
      maxWidth: {
        container: '1180px',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse at 80% 10%, rgba(0, 153, 230, 0.32), transparent 45%), radial-gradient(ellipse at 10% 25%, rgba(0, 77, 138, 0.55), transparent 40%), linear-gradient(180deg, #004D8A 0%, #0079CB 50%, #004D8A 100%)',
        'gradient-text':
          'linear-gradient(135deg, #ffffff 0%, #002D5C 52%, #001A3D 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0079CB 0%, #004D8A 100%)',
        'gradient-timeline': 'linear-gradient(180deg, #002D5C 0%, #001A3D 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(0, 55, 100, 0.88), rgba(0, 95, 163, 0.55))',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(0, 121, 203, 0.50)',
        'glow-violet': '0 0 40px -8px rgba(124, 58, 237, 0.35)',
        card: '0 18px 40px -16px rgba(0, 55, 100, 0.8)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
