---
name: sistran-labs-pattern
description: Cria landing pages executivas seguindo a arquitetura, identidade visual e padrões de código reais do projeto Sistran Labs (Next 16 + Tailwind 3 + motion/react). Use quando o usuário pedir novo site institucional, LP corporativa, ou replicar o visual "Luminna/Sistran" (navy escuro, glass cards, gradientes azul/violeta, seções alternando dark/light).
---

# Sistran Labs Pattern

Skill baseada 1:1 no código real de `sistran-labs/`. Substitui o `luminna-site-pattern` para novos projetos (aquele descreve stack desatualizada). Consulte os arquivos de referência em `reference/` desta pasta para copiar tokens, config e componentes-base.

## Stack obrigatória

- **Next.js 16** (App Router) + **React 19** + **TypeScript strict**, `paths: { "@/*": ["./src/*"] }` — versões exatas, ESLint flat config e pitfalls na skill `nextjs-16-setup` (ela manda na stack; esta skill manda no visual)
- **Tailwind CSS 3** com `tailwind.config.ts` (JS/TS, NÃO config-in-CSS)
- **motion** (import `motion/react`) — nunca `framer-motion`
- **lucide-react** para ícones (`strokeWidth={1.8}`)
- **clsx** para composição condicional de classes
- Fontes: **Inter** (body) + **Sora** (display) via `next/font/google`, expostas em `--font-inter` / `--font-sora`

## Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx        # server component: fontes + <Background/> + <CursorGlow/> + metadata pt-BR
│   ├── globals.css       # tokens, .container-lp, .section-py, .glass-card, .btn-*, .pill, .eyebrow, .section-light
│   └── page.tsx          # composição: Header → Hero → Pillars → Portfolio → Roadmap → Footer
├── components/
│   ├── Background.tsx    # orbs blur fixed
│   ├── Header.tsx        # sticky nav
│   ├── Hero.tsx
│   ├── [Sections].tsx    # PascalCase por seção
│   ├── Footer.tsx
│   └── ui/
│       ├── Reveal.tsx    # IntersectionObserver → .is-visible
│       ├── SectionTitle.tsx
│       ├── Pill.tsx
│       ├── CursorGlow.tsx
│       └── HeroScrollWrapper.tsx  # motion useScroll sticky 200vh
├── data/                 # copy tipado em .ts (as const) — separar do JSX
│   ├── types.ts
│   └── [entidade].ts
└── lib/
    └── icons.ts          # registry name→lucide component
```

**Convenções:**
- Componentes: **PascalCase.tsx**
- Dados/utils: **camelCase.ts**
- IDs / âncoras: **kebab-case em português** (`#pilares`, `#roadmap`, `#top`)
- Categorias/slugs internos: inglês (`ia|cloud|security|data|qa`…)

## Design tokens (copiar de `reference/tailwind.config.ts` e `reference/globals.css`)

### Paleta
| Papel | Hex |
|---|---|
| Base azul médio | `#1273BC` `#0E639F` `#1885CE` |
| Primário azul | `#2A9BE0` `#57B7EE` |
| Sky/accent | `#78C9F8` |
| Violet/purple | `#7c3aed` `#a855f7` |
| Deep blue | `#024EA0` |
| Success | `#34d399` |
| Texto dark bg | `#f8fafc` `#cbd5e1` `#94a3b8` |
| Texto light bg | `#0a1f44` `#3d5a80` `#5c7a9e` |

### Tipografia
- `font-sans` = Inter (body)
- `font-display` = Sora (headings) — usar `font-bold`/`font-extrabold`/`font-black` (800–900)
- Escala custom: `text-hero` (`clamp(2.8rem, 7vw, 5.8rem)`, lh 0.98) / `text-section` (`clamp(2rem, 4vw, 3.6rem)`)
- Eyebrow: `text-xs font-semibold uppercase tracking-[0.18em]`

### Espaço / raios / sombras
- Container: `max-w-container` = 1180px
- Seção: `.section-py` = `py-20 md:py-28 lg:py-32`
- Cards: `rounded-2xl` (18px) e `rounded-3xl` (28px), `--radius-card: 24px`
- Sombras assinatura: `shadow-glow` (azul), `shadow-glow-violet`, `shadow-card`

### Animações globais (tailwind.config)
- `fade-up` 0.7s `cubic-bezier(0.22, 1, 0.36, 1)`
- `float` 6s infinite (±8px Y)
- `pulse-soft` 4s
- Easing padrão em toda animação motion: `[0.22, 1, 0.36, 1]`
- Sempre respeitar `prefers-reduced-motion` (já configurado em globals.css)

## Utilities CSS assinatura (@layer components em globals.css)

```
.container-lp      → wrapper mx-auto + max-w-container + px responsivo
.section-py        → padding vertical padrão
.glass-card        → gradiente translúcido azul claro + border white/14 + blur(16px) + shadow
.glass-card-hover  → + hover translateY(-3px) + border-active + glow
.text-gradient     → white → sky clipped (invertido em .section-light)
.text-gradient-accent
.btn-primary       → pill gradient #2A9BE0→#57B7EE + hover lift
.btn-ghost         → pill glass translúcido
.pill / .pill-accent
.eyebrow           → uppercase micro-caps sky (#78C9F8)
.section-light     → radial #FEFEFF→#CCE4F5 (cascade override de cores automático)
.reveal / .reveal.is-visible
```

## Composição de página (regra de ouro)

```tsx
// app/page.tsx
<Header />
<main>
  <HeroScrollWrapper><Hero /></HeroScrollWrapper>
  <div className="section-light"><Pillars /></div>   {/* claro */}
  <Portfolio />                                        {/* escuro */}
  <div className="section-light"><Roadmap /></div>    {/* claro */}
  <FinalCTA />
</main>
<Footer />
```

**Ritmo visual:** alternar dark ↔ light envolvendo seções em `<div className="section-light">`. Todo componente de seção usa raiz:

```tsx
<section id="ancora-pt-br" className="section-py relative overflow-hidden">
  <div className="container-lp">
    ...
  </div>
</section>
```

## Padrões de componente

### Section header
```tsx
<Reveal>
  <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Rótulo</span>
  <h2 className="font-display text-section font-bold text-ink">
    Título com <span className="text-gradient">destaque</span>
  </h2>
  <p className="mt-4 max-w-2xl text-ink-muted">Subtítulo…</p>
</Reveal>
```

### Card padrão (dark)
```tsx
<div className="glass-card-hover p-6">
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
       style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
    <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.8} />
  </div>
  <h3 className="font-display text-lg font-bold text-ink">Título</h3>
  <p className="mt-2 text-sm text-ink-muted">Descrição curta.</p>
</div>
```

### Card em `section-light`
Mesma estrutura — o CSS de `.section-light` inverte cores automaticamente. Para background sólido claro, usar inline `background: 'rgba(255,255,255,0.88)'` + `border: '1px solid rgba(120,201,248,0.22)'`.

### Reveal na entrada
```tsx
<Reveal delay={120}><div>…</div></Reveal>
```
Escalonar delay em múltiplos de 60/80/120ms para cascata.

### Contagem animada
Usar hook local `useCountUp(target, active)` com `easeOutCubic`, ativado por `IntersectionObserver` — copiar de `Hero.tsx` do projeto real.

### Motion variants recorrentes
```ts
const VP = { once: true, margin: '-60px' };
const vFadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } },
};
```

## Dados sempre em `src/data/*.ts`

```ts
// data/types.ts
export type Pillar = { id: string; title: string; description: string; icon: IconName; color: string; };

// data/pillars.ts
import type { Pillar } from './types';
export const PILLARS: readonly Pillar[] = [
  { id: 'ia', title: 'IA aplicada', description: '…', icon: 'Brain', color: '#06b6d4' },
  …
] as const;
```

Ícones via string: `icon: 'Brain'` resolvido em `src/lib/icons.ts` (mapa `Record<IconName, LucideIcon>`).

## Assets
- Logos reais em `public/images/` (PNG/SVG). Sem logo → renderizar **monogram badge** (iniciais em círculo com gradiente por "tone" — ver `LogoBadge.tsx`).
- Fotos de entrega em `public/images/deliveries/<slug>/cover.png`.
- `next/image` com `sizes` e `priority` no hero.

## Metadata / SEO (layout.tsx)
- `lang="pt-BR"`, `locale: 'pt_BR'`
- `metadataBase: new URL('https://…')`
- OpenGraph + Twitter card
- `viewport.themeColor: '#050816'`

## Checklist ao criar novo site

1. Copiar `reference/tailwind.config.ts` → renomear cores se marca mudar (manter escala/keyframes).
2. Copiar `reference/globals.css` → ajustar `:root` se paleta trocar.
3. Copiar `reference/layout.tsx` como base (só trocar metadata + fontes se necessário).
4. Criar `src/data/types.ts` + arquivos por seção.
5. Criar `src/lib/icons.ts` com só os ícones lucide usados.
6. Componentes de seção em PascalCase; sempre wrapear em `<section className="section-py"><div className="container-lp">`.
7. Compor em `page.tsx` alternando `section-light`.
8. Rodar `npm run lint` e `npm run build` antes de entregar.

## Motion variants padrão (copiar `reference/motion-variants.ts` → `src/lib/motion.ts`)

Sempre que uma seção usar `motion/react`, importar variants deste módulo em vez de recriá-los:

- `ease` = `[0.25,0.46,0.45,0.94]` — curva padrão
- `easeExpo` = `[0.22,1,0.36,1]` — curva para títulos e cards
- `VP` = `{ once: true, margin: '-80px' }` — viewport padrão
- `vHeader` — container que faz stagger de eyebrow/title/subtitle (0.13s)
- `vEyebrow` — fade + y:14
- `vTitle` — fade + y:28 + blur (curva `easeExpo`, 0.88s)
- `vSubtitle` — fade + y:18
- `vGrid` — container stagger 0.09s para cards
- `vCard` — fade + y:36 + scale 0.96→1
- `vFadeUp` — fade + y:22 (uso geral)
- `tabContent` — enter/exit para `<AnimatePresence mode="wait">`
- `grad` — className do gradiente de texto azul assinatura
- `useReducedMotion()` — hook com listener de `prefers-reduced-motion`

Regra: sempre combinar com `useReducedMotion()` e passar `initial={rm ? false : 'hidden'}` para não animar quando o usuário pediu redução.

## Analytics (opcional — se o site tiver GA)

Configurar GA via `@next/third-parties/google` no `layout.tsx` e copiar `reference/analytics.ts` → `src/lib/analytics.ts`. Chamar sempre pelo helper `track.*`, nunca `window.gtag` direto no JSX:

```tsx
<a href="#contato" onClick={() => track.ctaContact('hero')} className="btn-primary">Falar</a>
```

Eventos padrão disponíveis: `ctaContact`, `ctaPlatform`, `navLink`, `sectionView`, `externalLink`.

## Regras invariáveis (checklist ao revisar código)

1. `'use client'` em toda seção que usa hooks, motion ou eventos.
2. `useReducedMotion()` + `initial={rm ? false : 'hidden'}` em toda animação motion.
3. `whileInView` com `viewport={VP}` — nunca animar no mount fora do hero.
4. Seção sem `id` (âncora em pt-BR kebab-case) é seção incompleta.
5. Cards com hover: `whileHover={{ y: -6, scale: 1.02 }}` OU classe `.glass-card-hover`.
6. Padding vertical de seção: `section-py` (nunca hardcodar `py-24`).
7. Container: `container-lp` (mx-auto max-w-container + px responsivo).
8. Sem dados mockados em produção — sempre em `src/data/*.ts` com `as const`.
9. Ícones lucide com `strokeWidth={1.8}`.
10. Anti-flash: respeitar dark/light da seção via wrap em `.section-light` (não hardcodar cores no componente).

## Ordem de criação recomendada para um novo site

1. `tailwind.config.ts` + `src/app/globals.css` (copiar de `reference/`)
2. `src/lib/motion.ts` (copiar de `reference/motion-variants.ts`)
3. `src/lib/icons.ts` (registry só dos ícones lucide usados)
4. `src/data/types.ts` + arquivos de dados por seção
5. `src/app/layout.tsx` — fontes + metadata + `<Background/>` + `<CursorGlow/>`
6. `src/components/ui/Reveal.tsx`, `SectionTitle.tsx`, `Pill.tsx`
7. `src/components/Header.tsx` + `Footer.tsx`
8. Seções em PascalCase (Hero, Pillars, Portfolio, Roadmap, FinalCTA…)
9. `src/app/page.tsx` — composição alternando `section-light`
10. `npm run lint && npm run build` antes de entregar

## Anti-padrões (não fazer)

- Não usar `framer-motion` — só `motion/react`.
- Não hardcodar copy em JSX — sempre em `data/*.ts`.
- Não usar CSS-in-JS runtime; usar Tailwind + `@layer components` + inline `style` para valores únicos.
- Não misturar Bootstrap/outros frameworks.
- Não colocar background do body em componente — está em `body::before/after` de `globals.css`.
- Não esquecer `overflow-x: hidden` no `body` (orbs vazam senão).

## Arquivos de referência (nesta skill)

- `reference/tailwind.config.ts` — cópia do config real
- `reference/globals.css` — cópia dos tokens + utilities
- `reference/layout.tsx` — cópia do root layout
- `reference/example-page.tsx` — página de exemplo (Hero+Features+CTA) para validar o padrão
- `reference/example-section.tsx` — snippet base de qualquer seção nova
- `reference/Reveal.tsx` — wrapper IntersectionObserver
- `reference/motion-variants.ts` — variants motion + `useReducedMotion` + `grad`
- `reference/analytics.ts` — helper `track.*` para GA
- `reference/dynamic-components.md` — **padrões dinâmicos reais**: 3D tilt + orb cursor (MetricCard), count-up com easeOutCubic, IntersectionObserver → cascata, card "deck" com gradiente por categoria, modal com backdrop-blur + ESC, filtro com `motion.div layout` + `AnimatePresence`, hover-glow por card, timeline com linha animada, header sticky, pill/eyebrow com dot pulsante ("Próximos Passos"), fundo azul com grid de pontos + linhas SVG tracejadas animadas (HeroBackground/Roadmap/FinalCTA), regras de ouro. **Consultar SEMPRE que criar cards, métricas, modais, grids filtráveis, eyebrows/pills ou fundos institucionais escuros.**
