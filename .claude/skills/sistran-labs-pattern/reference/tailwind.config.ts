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
          900: '#1273BC',
          800: '#2A9BE0',
          700: '#1885CE',
          600: '#0E639F',
        },
        // Superficies
        surface: {
          DEFAULT: 'rgba(14, 99, 159, 0.72)',
          strong: 'rgba(18, 115, 188, 0.85)',
          soft: 'rgba(14, 99, 159, 0.45)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.14)',
          active: 'rgba(120, 201, 248, 0.55)',
        },
        // Texto
        ink: {
          DEFAULT: '#f8fafc',
          muted: '#cbd5e1',
          faint: '#94a3b8',
        },
        // Acentos Luminna
        cyan: {
          glow: '#2A9BE0',
        },
        sky: {
          brand: '#78C9F8',
        },
        blue: {
          brand: '#2A9BE0',
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
        section: ['clamp(2rem, 4vw, 3.6rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
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
          'radial-gradient(ellipse at 80% 10%, rgba(120, 201, 248, 0.28), transparent 45%), radial-gradient(ellipse at 10% 25%, rgba(24, 133, 206, 0.45), transparent 40%), linear-gradient(180deg, #1273BC 0%, #2A9BE0 50%, #1273BC 100%)',
        'gradient-text':
          'linear-gradient(135deg, #ffffff 0%, #D6ECFB 52%, #78C9F8 100%)',
        'gradient-primary': 'linear-gradient(135deg, #2A9BE0 0%, #1273BC 100%)',
        'gradient-timeline': 'linear-gradient(180deg, #1885CE 0%, #0E639F 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(24, 133, 206, 0.60), rgba(87, 183, 238, 0.30))',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(42, 155, 224, 0.45)',
        'glow-violet': '0 0 40px -8px rgba(124, 58, 237, 0.35)',
        card: '0 18px 40px -16px rgba(10, 70, 120, 0.55)',
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
