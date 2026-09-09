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
        /* TIPOGRAFIA.md — `font-display` agora resolve para a serifa editorial, e
           por isso as ~28 telas que já usam a classe migram sem tocar em JSX.

           O fallback virou `serif` de propósito, e não é detalhe: com `Inter` no
           fim da lista, uma falha de carregamento faria o título parecer corpo
           aumentado — o layout mudaria de personalidade em vez de degradar. Uma
           serifa de sistema mantém a intenção. */
        display: ['var(--font-serif)', 'Georgia', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        /* TIPOGRAFIA.md — a ESCALA é a daqui (cinco degraus, calibrados contra os
           títulos reais das quatorze rotas); o que mudou foram as MÉTRICAS de cada
           degrau, porque serifa 400 em corpo grande não se comporta como sans 700.

           Duas mudanças em todos eles, na mesma direção: `line-height` mais
           fechado — abaixo de 1 nos dois maiores, onde antes sobrava ar entre as
           linhas — e `letter-spacing` mais negativo. Serifa grande solta parece
           "desmontada"; é a diferença mais visível entre a proposta aplicada e um
           serif aplicado cru. Nos degraus menores o fechamento é menor, porque ali
           o corpo já é pequeno o suficiente para o kerning natural servir. */
        hero: ['clamp(2.8rem, 7vw, 5.8rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        section: ['clamp(2.2rem, 4.6vw, 4.1rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
        /* SIS-180 — EXCEÇÃO DELIBERADA, e está registrada aqui justamente para
           não ser "corrigida" de volta ao `section` numa varredura de
           consistência tipográfica.
           A seção `#SomosSistraners` é o convite final da home (e o fechamento de
           /trabalhe-conosco e de /eventos-inovacao): foi pedido que ela ficasse
           maior e mais destacada que as seções de meio de página. Com o
           `section` ela media 65,6px a 1440, o mesmo de qualquer outra seção da
           rota, e não se distinguia de nada.
           O degrau fica ENTRE `section` e `hero`, e isso é medido: 83,2px a 1440
           contra 65,6px do `section` e 92,8px do `hero`. A hierarquia
           hero > palco > seção continua existindo — um convite de fechamento que
           passasse o título da própria página inverteria a leitura.
           `line-height` um pouco mais solto que o do `section` (0.98 contra 0.96)
           porque o título dele quebra em duas linhas nas três rotas, e serifa
           grande em duas linhas com 0.96 encosta a descendente da primeira na
           ascendente da segunda. */
        palco: ['clamp(2.6rem, 5.8vw, 5.2rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        /* Entrada das rotas internas (`PageHero`, 14 rotas).
           Elas usavam `text-section`, o token dos títulos de MEIO de página, e o
           resultado medido era 65.6px a 1440 ocupando 53% da largura — a entrada
           não dominava a tela em nenhuma das quatorze. Um degrau abaixo do hero
           da home (`clamp(4.5rem, 7.8vw, 9rem)` = 112px a 1440) e um acima do
           corpo: 92px a 1440. A hierarquia home > rota interna > seção passa a
           existir, o que antes não acontecia porque interna == seção.

           São TRÊS degraus e não um porque os títulos das quatorze rotas variam
           de 9 caracteres ("A Sistran") a 118 (`/solucoes`), e a primeira versão
           usava um tamanho só: a captura de `/solucoes` mostrou a frase ocupando
           sete linhas e passando da janela. Um nome e uma sentença não são o
           mesmo objeto tipográfico, e a escala tem de sair do COMPRIMENTO — ver
           `escalaDoTitulo` em `PageHero.tsx`. */
        pagehero: ['clamp(2.6rem, 6.4vw, 5.6rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
        'pagehero-medio': [
          'clamp(2.2rem, 4.9vw, 4.4rem)',
          { lineHeight: '1', letterSpacing: '-0.035em' },
        ],
        /* O degrau dos títulos longos (`/solucoes`, 118 caracteres) é o único que
           NÃO desce abaixo de 1: ali o texto é uma sentença de várias linhas, e
           linha colada em corpo de 3,2rem vira bloco cinza. Fecha só de 1.12 para
           1.08. */
        'pagehero-longo': [
          'clamp(2rem, 3.6vw, 3.2rem)',
          { lineHeight: '1.08', letterSpacing: '-0.03em' },
        ],
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
