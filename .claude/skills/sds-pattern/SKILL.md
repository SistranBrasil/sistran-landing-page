---
name: sds-pattern
description: Cria/edita landing pages do padrão SDS (Sistema Digital de Sinistros) — sub-produto Sistran. Herda o padrão sistran-labs (Next 16 + Tailwind 3 + motion/react + tokens navy/violet) mas com estrutura narrativa própria: Hero(logo+halo) → Desafio → Jornada → Agentes IA → Benefícios → Timeline → Resultado(KPIs) → CTA Final. Use quando o usuário pedir LP institucional de produto Sistran com foco em jornada operacional, agentes IA e KPIs.
---

# SDS — Sistema Digital de Sinistros (pattern)

Skill dedicada ao projeto `sistran-labs-2/`. É um **fork narrativo** do `sistran-labs-pattern`: mesma stack, mesmos tokens, mesmas utilities CSS (`container-lp`, `section-py`, `glass-card`, `.section-light`, `btn-primary`, `text-gradient`), mas com **composição de página específica** para apresentar um produto (não um portfólio).

## Stack (idêntica ao sistran-labs)
- Next 16 App Router + React 19 + TS strict, `@/*` → `./src/*` — versões exatas e ESLint flat config na skill `nextjs-16-setup`
- Tailwind 3 (`tailwind.config.ts`)
- `motion/react` (nunca `framer-motion`)
- `lucide-react` (`strokeWidth={1.8}`)
- `clsx`
- Inter (body) + Sora (display) via `next/font/google`

## Estrutura mínima (a que existe hoje)

```
src/
├── app/
│   ├── layout.tsx      # fontes + Background + CursorGlow + metadata pt-BR
│   ├── globals.css     # tokens + .container-lp + .section-py + .glass-card + .btn-* + .section-light
│   └── page.tsx        # UMA página com todas as seções inline
├── components/
│   ├── Background.tsx
│   └── ui/
│       ├── Reveal.tsx      # IntersectionObserver → .is-visible
│       └── CursorGlow.tsx
└── data/
    └── sds.ts          # CHALLENGES, JOURNEY, AGENTS, BENEFITS, TIMELINE, KPIS (as const)
```

**Diferente do sistran-labs**: neste projeto todas as seções vivem em `app/page.tsx` inline (não há PascalCase por seção). Ao **evoluir**, extrair seções longas para `components/<Section>.tsx` mantendo o padrão do sistran-labs.

## Narrativa fixa (ordem das seções)

```
1. HERO          — logo SDS com halo + 2 badges flutuantes (Agentes IA / Rastreável)
2. DESAFIO       — grid de dores (CHALLENGES) — dark bg, ícones vermelhos
3. JORNADA       — 8 passos numerados 01..08  — section-light
4. AGENTES IA    — 2-col: texto + grid 2x2 de AGENTS (Brain, FileSearch, Sparkles…)
5. BENEFÍCIOS    — grid 3-col (BENEFITS) — section-light
6. TIMELINE      — linha horizontal com 7 ícones "Do comunicado à regulação"
7. RESULTADO     — 2-col: texto + KPIs em cards — section-light
8. CTA FINAL     — bloco radial com logo grande + "Sistran. Beyond Technology."
```

Regra: alternar `section-light` (2, 4, 6 do zero-index → jornada/benefícios/resultado ficam claros; desafio/agentes/timeline/CTA ficam dark). Mantém o ritmo dark↔light da marca.

## Componentes recorrentes desta LP

### Halo radial atrás do logo (Hero)
```tsx
<div className="relative mx-auto flex aspect-square max-w-[520px] items-center justify-center">
  <div className="absolute inset-0 rounded-full opacity-60 blur-3xl"
       style={{ background: 'radial-gradient(circle at center, rgba(0,153,230,.55), transparent 60%)' }} />
  <div className="glass-card relative flex h-full w-full items-center justify-center p-12">
    <Image src="/sdslogo.png" alt="SDS" className="animate-float drop-shadow-[0_20px_50px_rgba(0,121,203,.55)]" />
    <div className="pointer-events-none absolute inset-6 rounded-3xl border border-white/[.10]" />
  </div>
  {/* Badges flutuantes */}
  <div className="absolute -left-4 top-8 hidden md:block rounded-2xl px-4 py-3 backdrop-blur-md"
       style={{ background: 'rgba(0,55,100,.85)', border: '1px solid rgba(120,201,248,.25)' }}>…</div>
</div>
```

### Card numerado (Jornada)
```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-lg font-black text-white"
     style={{ background: 'linear-gradient(135deg,#0079CB,#0099E6)',
              boxShadow: '0 8px 24px -6px rgba(0,121,203,.45)' }}>
  {n.toString().padStart(2, '0')}
</div>
```

### Card claro (Benefits/KPI)
Em `section-light`, cards precisam de background sólido inline (não usar `glass-card`, que é dark):
```tsx
<div style={{
  background: 'rgba(255,255,255,.90)',
  border: '1px solid rgba(120,201,248,.22)',
  boxShadow: '0 8px 32px -8px rgba(0,121,203,.14)',
}}>
```

### Timeline horizontal com conectores
```tsx
<div className="absolute left-0 right-0 top-9 hidden h-px lg:block"
     style={{ background: 'linear-gradient(90deg,transparent,rgba(120,201,248,.55),transparent)' }} />
<div className="grid gap-6 lg:grid-cols-7">
  {TIMELINE.map((t,i) => (
    <div className="relative flex flex-col items-center text-center">
      <div className="h-[72px] w-[72px] rounded-2xl"
           style={{ background: 'linear-gradient(135deg,rgba(0,121,203,.35),rgba(124,58,237,.30))',
                    border: '1px solid rgba(120,201,248,.35)',
                    boxShadow: '0 12px 30px -10px rgba(0,121,203,.55)' }}>
        <t.icon />
      </div>
      {i < TIMELINE.length-1 && <ChevronRight className="absolute -right-3 top-8 hidden lg:block" />}
    </div>
  ))}
</div>
```

### CTA Final (bloco radial)
```tsx
<div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
     style={{
       background: 'radial-gradient(ellipse at top right, rgba(5,121,232,.55) 0%, rgba(3,98,200,.40) 45%, rgba(2,66,153,.30) 100%), rgba(0,55,100,.85)',
       border: '1px solid rgba(120,201,248,.28)',
       boxShadow: '0 40px 100px -30px rgba(0,121,203,.55)',
     }}>
  <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{background:'#7c3aed'}} />
  <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{background:'#0079CB'}} />
  {/* conteúdo */}
</div>
```

## Melhorias recomendadas (efeitos que ainda faltam)

O `page.tsx` atual usa apenas `Reveal` (fade in por observer). Para elevar ao nível do sistran-labs, adicionar:

1. **KPI count-up animado** — hoje `KPIS` só mostram label. Adicionar valor numérico + hook `useCountUp` (copiar de `reference/dynamic-components.md` da skill `sistran-labs-pattern`).
2. **Cards de AGENTS com 3D tilt** — atualmente hover só faz translate-y. Aplicar padrão `MetricCard` (perspective + orb cursor).
3. **Timeline com progresso animado** — `motion.div` com `scaleX: 0 → 1` na linha do conector, `whileInView`.
4. **Jornada com stagger motion** em vez de delay em `Reveal` — usar `vGrid`/`vCard` da skill mãe.
5. **Header com estado de scroll** — hoje o background é fixo; adicionar `scrolled` state (ver `dynamic-components.md`).
6. **CTA Final: partículas ou glow pulsante** — orbs violet/blue que respiram (`animate-pulse-soft`).
7. **Extrair seções** para `components/<Section>.tsx` (Hero, Challenge, Journey, Agents, Benefits, Timeline, Result, FinalCTA) quando arquivo passar de ~400 linhas.

## Dados (padrão obrigatório)

Todo copy em `src/data/sds.ts`, tipado, `as const`. Nunca hardcodar em JSX. Ícones importados diretamente como `LucideIcon` no data (diferente do sistran-labs que usa string + registry — aqui é OK porque é uma única LP pequena).

```ts
export type Agent = { icon: LucideIcon; title: string; desc: string; color: string; };
export const AGENTS: Agent[] = [
  { icon: FileSearch, title: 'Leitura inteligente', desc: '…', color: '#0099E6' },
  …
];
```

## Regras invariáveis

1. `'use client'` em `page.tsx` (usa hooks e handlers).
2. Todas as seções envolvidas em `<section id="ancora-pt-br" className="section-py relative overflow-hidden">`.
3. Wrap `container-lp` sempre presente por seção.
4. Ícones lucide com `strokeWidth={1.8}`.
5. Cores acento por seção via inline `style={{ color: '#78C9F8' }}` no eyebrow (não criar tokens novos).
6. `section-light` recebe cards com background sólido rgba(255,255,255,.88–.92) + border cyan claro.
7. `text-gradient` no dark; `text-gradient-accent` no light.
8. Botões: `btn-primary` (gradient) e `btn-ghost` (glass).
9. Logo em `public/sdslogo.png` — sempre com `next/image` + `priority` no hero.
10. Copyright do footer: `© {new Date().getFullYear()} Sistran · Sistema Digital de Sinistros`.

## Ao criar novo produto Sistran (irmão do SDS)

1. Copiar `sistran-labs-2/` inteiro como base
2. Trocar `sds.ts` por `<produto>.ts` mantendo os 6 arrays (CHALLENGES, JOURNEY, AGENTS, BENEFITS, TIMELINE, KPIS)
3. Trocar `sdslogo.png` e paleta se marca muda
4. Manter os 8 blocos da narrativa (Hero → Desafio → Jornada → Agentes → Benefícios → Timeline → Resultado → CTA)
5. Aplicar as 7 melhorias listadas acima antes de entregar

## Anti-padrões

- Não usar `framer-motion` — `motion/react`.
- Não hardcodar copy em JSX — sempre em `data/sds.ts`.
- Não usar `glass-card` em `section-light` (fica invisível).
- Não hardcodar `py-24` — usar `.section-py`.
- Não misturar GSAP aqui (o projeto é motion-only). GSAP fica em landings de campanha, não produto.
- Não animar cards no mount — sempre `whileInView` / IntersectionObserver.

## Skill relacionada

Ao trabalhar com componentes dinâmicos avançados (3D tilt, count-up, filtros, modais), consultar `sistran-labs-pattern` → `reference/dynamic-components.md`. Os padrões são 100% reaproveitáveis aqui.
