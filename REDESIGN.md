# Redesign Sistran — Registro de implementação

Documento honesto do que foi implementado nesta rodada e do que ficou pendente.
Nenhum texto/copy/link/rota foi alterado.

## Arquivos alterados

- `src/app/page.tsx` — trocou `Hero` por `HeroCinematic` na home. Nenhuma outra
  alteração de estrutura de seções.

## Arquivos criados

- `src/components/HeroCinematic.tsx` — novo hero cinematográfico controlado por
  scroll. Substitui o uso de `Hero.tsx` na home. O arquivo `Hero.tsx` original
  permanece intacto em disco.

## O que o HeroCinematic faz

- Wrapper de altura 200vh (mobile) / 320vh (≥1024px) com cena `sticky top-0`
  ocupando `clamp(640px, 100svh, 960px)`.
- Sequência scrub por progresso do wrapper (GSAP ScrollTrigger, scrub 0.6):
  - 0–15%   chip institucional + chips mobile (atmosfera)
  - 15–40%  título (MorphingHeadline) revelado
  - 40–65%  evolução visual (PillarsCarousel com parallax + scale/rotate leve)
  - 65–82%  parágrafo + CTAs
  - 82–100% TrustTicker + peek "Quem somos" + fade da atmosfera + scale-down
- Todos os textos, ícones, ordens, aria-labels, hrefs (`#solucoes`,
  `#contato`, `#quem-somos`) preservados 1:1 do `Hero.tsx` original.
- `prefers-reduced-motion`: cena renderiza estática (`height: auto`, sem
  sticky, sem scrub, sem peek); todos os elementos visíveis imediatamente.
- Pausa `gsap.globalTimeline` quando `document.hidden`.
- `ctx.revert()` no cleanup para remover ScrollTriggers em unmount/HMR.

## Como plugar os vídeos reais

O componente já está preparado. Dentro de `HeroCinematic.tsx`, procure o
comentário "Placeholder abstrato" e substitua a atmosfera decorativa (ou
adicione abaixo dela, atrás do conteúdo) por:

```tsx
<video
  data-video-src
  className="absolute inset-0 h-full w-full object-cover"
  muted
  playsInline
  preload="metadata"
  poster={POSTER_DESKTOP}
>
  <source src={VIDEO_DESKTOP} type="video/mp4" />
</video>
```

Para servir o mobile, use `<source media="(max-width: 767px)" ...>` com
`VIDEO_MOBILE` / `POSTER_MOBILE`, ou renderize condicionalmente.

Em seguida, no `useEffect` do componente, descomente:

```ts
// const video = scene.querySelector<HTMLVideoElement>('video[data-video-src]');
// if (video && wrapper) driveVideoByScroll(video, wrapper);
```

A função `driveVideoByScroll` já existe exportada no próprio arquivo — usa
ScrollTrigger + rAF com interpolação suave (`0.15` lerp) para dirigir
`video.currentTime` pelo progresso do wrapper. Funciona no scroll reverso.

### Formatos recomendados

- **VIDEO_DESKTOP** — MP4 H.264, 1920×1080, sem áudio, 8–12s loop,
  CRF 28, `-movflags +faststart`. Alternativa WebM/VP9.
- **VIDEO_MOBILE** — MP4 H.264, 720×1280 vertical, mesmos parâmetros.
- **POSTER_DESKTOP** — WebP/JPG 16:9, ~1600px.
- **POSTER_MOBILE** — WebP/JPG 9:16, ~800px.

Sem áudio nunca. `muted playsInline` obrigatórios (política de autoplay iOS).

## Enquanto os vídeos não existem

O hero usa placeholder abstrato dentro da identidade Sistran:
- `HeroMesh` (canvas 2D com pontos/linhas ciano) — já existia.
- Camada `grid-mask` + orbs (ciano, azul, violeta) — já existia.
- Wrapper `[data-hero-atmosphere]` que ganha animação de opacidade
  scroll-driven (fade-in 0–50%, fade-out 80–100%).

Nenhum vídeo de banco genérico foi baixado, conforme especificação.

## Biblioteca de animação

- **GSAP 3.15** + **ScrollTrigger** (já instalados).
- `motion/react` continua sendo usado em outras seções.

## Breakpoints

- Wrapper 200vh até 1023px, 320vh a partir de 1024px.
- Chips mobile aparecem <1024px; TrustTicker aparece ≥1024px (comportamento
  do Hero original preservado).

## Acessibilidade

- Foco visível preservado (`focus-visible:ring-2 ring-[#0ed8f6]` no CTA).
- Peek "Quem somos" é `<a href="#quem-somos">` navegável por teclado.
- Todos os `aria-hidden` decorativos mantidos.
- `prefers-reduced-motion`: layout estático, sem sticky, sem scrub, sem peek.

## Resultado do build

`npm run build` — **✓ passou**. Next 14.2.15. Home: 10.2 kB / 200 kB First
Load JS. Todas as 10 páginas estáticas geradas.

## Rodada 2 — Seções refeitas

- **globals.css** — adicionados CSS vars de motion (`--dur-fast`,
  `--dur-base`, `--dur-chapter`, `--ease-out`, `--stagger`, `--blur-max`) e
  classe `html.no-scroll` para bloquear scroll com menu aberto.
- **Header** — Escape fecha o overlay, `no-scroll` aplicado ao `<html>` quando
  aberto, breakpoint de desktop movido de `xl` (1280) para `≥1440px` via
  `[@media(min-width:1440px)]` para evitar colisão em 1280.
- **ScrollSpy** — só renderiza a partir de 1440px (via `matchMedia`),
  reposicionado para `left-3` para não competir com títulos.
- **Differentials** — refeito com pin sticky em desktop: wrapper de 400vh,
  scene sticky, 4 cards empilhados numerados 01–04, progresso lateral com
  variação ciano/azul/violeta/azul-claro, animação por `progress` derivado
  de `getBoundingClientRect` + rAF. Mobile e reduced-motion caem para
  lista/grid vertical simples sem pin. Todos os títulos e descrições
  preservados 1:1.
- **Metrics** — refeito como coluna editorial: números gigantes
  (clamp 4–10rem) com gradient de marca, alinhamento alternado
  esquerda/direita, `tabular-nums`, linha técnica vertical central
  conectando itens. Valor final sempre presente no HTML (`sr-only` guarda
  o valor real; countUp só afeta o span visual). Sem `HeroMetric` isolado
  fora da grade; a métrica principal é a primeira da lista.
- **Solutions** — sticky lista numerada à esquerda + painel ativo à direita
  em ≥1024px. IntersectionObserver marca o item ativo com `rootMargin
  -45%/-45%`. Barra de progresso e contador `NN / MM`. Teclas
  Arrow↑↓/←→ navegam. Mobile vira acordeão acessível com
  `aria-expanded`/`aria-controls`. Textos preservados.
- **About** — layout editorial 12-col: título ocupa col 1–5, parágrafos
  col 7–12 com leve offset vertical. Régua horizontal separada com 3
  indicadores conectados por linha gradient, dots pulsantes em ciano/azul/
  violeta. Removidos ícones lucide (números viraram protagonistas), textos
  preservados.
- **Contact** — título com `clamp(2.5rem, 6vw, 5rem)`. CTA principal envolto
  em `MagneticButton` (mousemove translate máx 8px, easing 0.35s, respeita
  reduced-motion). Endereço principal + unidades reorganizados em grid
  md:grid-cols-3 (2/1). Linha `brand-line` no topo conecta ao hero.
- **Footer** — 4 colunas lógicas (logo+institucional / navegação /
  contato / legais), removidos `divide-x` pesado e `backdrop-blur` do
  wrapper, `brand-line` no topo. Todos os links preservados.
- **FutureAreas** — régua compacta de roadmap: linha horizontal gradient
  + 3 dots numerados + labels. Altura substancialmente reduzida.
- **Social** — capítulo com fundo dedicado azul-escuro
  (radial gradients + orbs), `#SomosSistraners` em fonte gigante ghost
  centralizado como bg decorativo (opacity 0.06 + mix-blend screen).
  Título maior, CTA em destaque.

## Ainda pendente

- **ClientWall** — não refatorada nesta rodada; usa marquee CSS existente
  (já com hover pause via `.marquee-track:hover` e `prefers-reduced-motion`
  desliga a animação globalmente).
- **Verificação visual** em 390/768/1024/1280/1440 requer browser real.
- **Hero.tsx original** permanece intacto em disco (não usado pela home).

## Limitações

- O scrub de vídeo depende de `video.duration` conhecida — em vídeos com
  metadata lenta, o primeiro segundo de scroll pode ficar sem atualização
  (comportamento aceitável; poster cobre).
- Em conexões lentas, `canplaythrough` pode não disparar; para vídeo real
  recomenda-se adicionar timeout de fallback.
- Se `ScrollSmoother` (pago) vier a ser adotado, revisar interação com
  `sticky` da cena.
