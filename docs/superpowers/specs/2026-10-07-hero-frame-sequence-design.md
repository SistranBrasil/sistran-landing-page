# Hero da home: de `<video>` raspado para sequência de quadros em Canvas

Data: 2026-10-07 · Branch: `feature/sammuka` · Componente: `src/components/HeroCinematic.tsx`

## 1. Diagnóstico da implementação anterior

- O hero (`HeroCinematic`) é um wrapper `#top` com cena `position: sticky` (nunca `pin: true`,
  decisão registrada no cabeçalho do componente). O relógio da cena é `useScroll` do `motion/react`
  (`scrollYProgress`, offsets `start start` → `end end`), que alimenta as três legendas
  (`ui/HeroCaptions`), a manchete (`ui/HeroPitch`), a pastilha de rolagem, os *beats* de
  enquadramento (`scale`/`x`/`y` da camada `.hero-media`) e a vinheta.
- O vídeo era `primitives/ScrollVideo`: um `<video>` cujo `currentTime` é escrito a cada mudança
  de `scrollYProgress`, com acelerador por `seeking`. Arquivo `public/videos/hero-scroll-v2.mp4`:
  H.264 all-intra, 1440×1440, 24 fps, 361 quadros, CRF 35, 10,43 MiB; pôster WebP de 720 px.
- Percurso de rolagem: `#top { min-height: 260vh }` em ≥1024 px (≈1440 px de curso a 900 px de
  altura) e `170vh` abaixo (≈590 px de curso).
- Layout em ≥1024 px: o vídeo ocupa a metade direita (`.hero-media { width: 58% }`) de um card
  recuado, dissolvendo à esquerda por `mask-image`; moldura ciano (`.hero-frame`), vinheta,
  texto escuro na coluna esquerda. Abaixo de 1024 px: vídeo em sangria, texto claro.
- Limites da abordagem: seek constante em H.264, CRF 35 em um conteúdo com textura densa,
  `object-fit: cover` de um elemento de vídeo sem controle de DPR. Textos e detalhes do vídeo
  chegavam borrados.

## 2. Master

`D:\Downloads\frames\Gerar\dreamina-2026-09-08-7965-Create a 15-second premium cinematic 3D.mp4`,
indicado pelo solicitante em 08/10/2026. É byte a byte (md5 `65c1182f…`) o
`docs/fontes/videos/videohero.mp4` que já estava no repositório — a mesma geração de que o
`hero-scroll-v2.mp4` do site saía a CRF 35. Nenhuma cópia nova foi necessária.

| Propriedade | Valor |
| --- | --- |
| Codec | H.264 High, yuv420p, matriz não marcada (tratada como BT.709), 4 keyframes |
| Resolução | 2160×2160 (1:1) |
| Duração | 15,07 s · 361 quadros · 24 fps efetivos (PTS alternando 33/50 ms numa grade de 1/60; renumerados com `setpts=N/24/TB`) |
| Bitrate | ~52 Mbps (93,5 MiB) |

Descartado: `ElevenLabs_video_topaz-video-upscale_2026-09-09T00_06_46.mp4` (HEVC 2160², 365
quadros). É um upscale Topaz de OUTRA geração — narrativa diferente, rótulos ilegíveis e outro
final. A primeira rodada do pipeline foi feita sobre ele e foi integralmente descartada.

Limitações do master que nenhum pipeline recupera:

1. **Rótulos do mapa**: "BRASIL", "Sistran São Paulo" e "Sistran Pato Branco" são legíveis nos
   quadros em que o mapa está parado (~200–230). Durante o zoom rápido em Pato Branco (~240) o
   rótulo é desenhado pelo gerador com borrão de movimento e letras trocadas ("Slatran") — está
   assim na fonte.
2. **Textura gerada**: fachadas e vegetação têm detalhe sintético denso. É informação real do
   arquivo, não ruído: `hqdn3d` leve não reduziu o tamanho dos quadros em 1%.
3. **Final errado**: um wordmark "SISTRAN / Beyond Technology" em fonte fina genérica, sem o
   emblema, surge do quadro 331 ao 360. Substituído por uma transição para a marca oficial, ver §5.

## 3. Arquitetura

```
master (HEVC 2160²) ─► ffmpeg (correção do logo + cadência + crop + Lanczos + BT.709) ─► AVIF por quadro
                                                                                             │
       public/hero/sistran/v1/{desktop,desktop-hd,mobile}/frame-NNNN.avif  +  poster.webp  ◄─┘
                                        │
             FrameLoader (fila com prioridade, 6 downloads) ─► Blob por quadro
                                        │
             DecodeWindow (ImageBitmap ao redor do playhead, LRU) ─► FrameRenderer (Canvas, DPR, cover)
                                        ▲
             GSAP ScrollTrigger (scrub 0.3) anima playhead.frame 0 → N−1 sobre `#top`
```

- O `<video>` sai. O `motion/react` **continua** sendo o relógio das legendas, manchete, pastilha,
  beats e vinheta (nenhuma dessas peças muda). O GSAP ScrollTrigger entra só para o playhead do
  Canvas, medindo o **mesmo** elemento com os mesmos limites (`top top` → `bottom bottom`).
- A cena continua `sticky` via CSS. Não há `pin: true`: o pin-spacer do GSAP quebraria o
  contrato `#top + *` e a `.hero-sheet` com `margin-bottom: -100svh`.

## 4. Assets

| Tier | Seleção | Quadros | Resolução | Formato | Medido |
| --- | --- | --- | --- | --- | --- |
| `desktop` | ≥1024 px, DPR < 1,5 e viewport < 2200 px | 361 (24 fps) | 1152×1152 | AVIF crf 30 | 31,9 MiB · pôster WebP 375 KB |
| `desktop-hd` | ≥1024 px com DPR ≥ 1,5 ou viewport ≥ 2200 px | 361 (24 fps) | 1440×1440 | AVIF crf 30 | 41,4 MiB · pôster WebP 526 KB |
| `mobile` | <1024 px | 181 (12 fps, 1 a cada 2) | 1080×1440 (recorte 3:4 central) | AVIF crf 30 | 16,9 MiB · pôster WebP 402 KB |

Média por quadro: 90 KB (desktop), 117 KB (desktop-hd), 96 KB (mobile). O pôster WebP só é
baixado por navegador sem AVIF; os demais usam o próprio `frame-0001.avif` como pôster e LCP.

Por que esses números:

- **24 fps no desktop** (todos os quadros). 16 fps ou 20 fps a partir de 24 produzem cadência
  irregular (passos de 1 e 2 quadros alternados: 1-2-1-2 a 16 fps; 1-1-1-1-2 a 20 fps), que num
  pan lento lê como judder pior que o pulldown 3:2. Só 12 e 24 fps dividem 24 exatamente. A
  comparação 16 × 20 pedida foi feita em bytes e cadência; a escolha foi 24 porque o AVIF paga a
  diferença.
- **AVIF, não WebP.** Medido na mesma qualidade visual (crops 1:1, cidade e linhas douradas):
  WebP q85 ≈ 270 KB/quadro a 1440²; AVIF crf30 ≈ 129 KB (−52%). Decode medido no Chrome desta
  máquina via `createImageBitmap`: WebP ≈ 29 ms, AVIF ≈ 38 ms por quadro de 1440² — ambos acima
  do orçamento de um frame, o que já obriga a pré-decodificação (§6) seja qual for o formato.
  Com bytes iguais, AVIF entrega 2× mais quadros. `cpu-used 4` não reduziu tamanho (−0,4%);
  fica `cpu-used 6`.
- **1440² é o teto.** A caixa do vídeo mede ~1006×988 CSS px a 1920×1080 (DPR 1), ~1350×1308 a
  2560×1440 e ~1508×1636 device px num MacBook 1440×900 @2×. Gerar 2160² seria upscale
  artificial para quase todo mundo. O tier 1152² atende DPR 1 até ~1440p sem upscale.
- **Mobile 3:4.** Em telas <1024 px o `cover` mostra só o centro de ~46–75% da largura do
  quadro; o recorte 3:4 (1620×2160 do master → 1080×1440) remove bytes que nunca aparecem e
  rende 33% mais resolução vertical que um 1080² pelo mesmo custo.
- Denoise/sharpen: nenhum. Lanczos 2160 → 1440/1152 já é supersampling. Sem filtros por quadro.

## 5. Final: transição para a marca oficial

Pedido do solicitante (08/10/2026): "uma transição para esta imagem [logo oficial, navy sobre
branco] ao invés dos últimos frames com o logo incorreto". Linha do tempo do master: ≤330 torre
"RIVER PARK" virando wireframe de luz; 331 o wordmark errado começa a surgir; 336–343 explosão
de luz; 348–360 degradê azul com o wordmark parado.

Solução determinística, igual para todos os tiers, só com pixels reais ou luz (`FIM` em
`scripts/gerar-quadros-hero.mjs`):

1. Quadros 0–330: inalterados.
2. **Limpeza** (331+): máscara dos glifos do wordmark (AND dos quadros 348 e 360 binarizados em
   190, faixa y 900–1220, dilatação 6 px) preenchida com o fundo interpolado (`removelogo`)
   suavizado só na horizontal (`avgblur sizeX=61 sizeY=1`, porque o degradê é vertical). Sozinha
   deixava blocos sobre o wireframe e uma faixa clara no degradê — por isso não é a peça final,
   só tira o grosso do texto.
3. **Bloom** (329+): elipse branca suave sobre a região do texto. Na explosão de luz o texto fino
   é branco sobre quase branco: o bloom o apaga e lê como o núcleo da própria luz.
4. **End card** (336–347 por crossfade, segura até 360): logo oficial
   (`docs/fontes/hero/sistran-logo-oficial-4k-16x9.png`, cores originais, alfa preservado) sobre
   branco puro. Posição por tier, porque o layout do hero recorta o quadro de jeitos diferentes:
   - desktop/desktop-hd: 660 px de largura em x 1350→2010 (62,5%→93%), centro vertical 1080. Em
     ≥1024 px a `.hero-media` dissolve a borda esquerda do quadro (`mask-image` opaca só a partir
     de 62% da caixa) e o `cover` corta ~4% de cada lado em caixas mais altas que largas
     (1440×900): a faixa realmente visível e opaca é 62–96% do quadro. Um logo centrado ficava
     com o emblema semitransparente; um de 760 px encostava no traço ciano. Medido no Chrome.
   - mobile: 840 px centrado em x (a coluna visível de um telefone tem ~950 px do quadro), no
     terço inferior (centro em y 1728 = 80%): abaixo de 1024 px a manchete é um painel escuro
     centrado na cena que cobria o logo no centro do quadro.
5. No `HeroCinematic`, a vinheta navy cai de 0,7 a 0 entre 0,90 e 0,96 do percurso (o card entra
   em ≈0,93–0,96) para não escurecer os cantos do card branco.

Testadas e descartadas: `delogo` por retângulo (listras), `removelogo` como peça única (blocos e
faixa fantasma), crossfade do quadro 330 direto para o fim (perdia a explosão de luz) e logo
branco sobre a cena azul (foi o que o pedido de 08/10 substituiu).

## 6. Carregamento, cache e render

- **Pôster/LCP**: `<picture>` com `frame-0001.avif` (mesmo arquivo do quadro 1 da sequência) e
  `poster.webp` como fallback; `<link rel="preload" as="image" type="image/avif">` por tier via
  `media`, hoisted pelo React 19. Marcado `data-route-critical-media` para o `RouteLoadGate`
  esperar por ele, como fazia com o pôster do vídeo.
- **Fila** (`frameLoader`): 6 downloads concorrentes; fase 1 quadros 1–24; fase 2 amostras
  distribuídas (passo 16, depois 8, 4, 2); fase 3 o restante. A cada mudança de quadro, a janela
  `[N−6, N+12]` (sentido da rolagem) vai para a frente da fila. Começa quando o `RouteLoadGate`
  libera (`liberado`), para não disputar banda com as fontes.
- **Decode** (`decodeWindow`): `createImageBitmap(blob)` para `[N−6, N+10]` desktop / `[N−4, N+8]`
  mobile, até 3 decodes paralelos; bitmaps fora da janela recebem `close()`. Blobs comprimidos
  ficam todos em memória (~41 MiB no pior tier). Se o quadro alvo não está decodificado, desenha o
  **decodificado mais próximo** — nunca um Canvas vazio, nunca decode síncrono no caminho do
  frame.
- **Render** (`frameRenderer`): backing = CSS × `min(devicePixelRatio, 3)`; `object-fit: cover`
  calculado por recorte da fonte (`drawImage` de 9 argumentos); `imageSmoothingQuality = 'high'`;
  redesenho só quando o quadro desenhado muda ou no resize (debounced por `ResizeObserver` +
  rAF). Um rAF por rajada de updates.
- **ScrollTrigger**: `trigger: #top`, `start: 'top top'`, `end: 'bottom bottom'`, `scrub: 0.3`,
  `ease: 'none'`, tween de `playhead.frame` 0 → N−1. Cleanup com `gsap.context().revert()`.
- **Percurso**: `#top { min-height: calc(100svh + 3200px) }` em ≥1024 px (≈8,9 px por quadro) e
  `calc(100svh + 2000px)` abaixo (≈11 px por quadro). Antes: 260vh / 170vh.
- **Vinheta**: a opacidade da `.hero-vignette` em `HeroCinematic` passa a ser calculada em forma de
  função (`transform` + `useTransform(() => …)`), porque a forma de array era acelerada pelo
  `motion` numa animação nativa que ignorava o relógio; e cai a zero entre 0,90 e 0,96 do
  percurso, onde entra o end card branco.
- **Movimento reduzido** (sistema ou botão): sem ScrollTrigger e sem download da sequência; o
  pôster fica. Sem suporte a AVIF (Edge <121, Safari <16): idem — pôster WebP estático.
- **Cache HTTP**: `headers()` em `next.config.mjs` para `/hero/:path*` → `public, max-age=31536000,
  immutable`; o caminho carrega a versão (`v1`) para invalidar.

## 7. Componentização

```
src/components/hero/
  heroFrameConfig.ts        tiers, seleção, URL por índice (lê hero-frames.manifest.json)
  hero-frames.manifest.json gerado pelo script: contagem, dimensões e bytes por tier
  frameLoader.ts            fila com prioridade e concorrência; Blob por quadro
  decodeWindow.ts           ImageBitmaps ao redor do playhead
  frameRenderer.ts          Canvas: DPR, cover, draw
  useHeroFrameSequence.ts   hook: tier, loader, decode, renderer, ScrollTrigger, cleanup
  HeroCanvas.tsx            <picture> pôster + <canvas> + preloads
scripts/gerar-quadros-hero.mjs   pipeline ffmpeg reproduzível (desktop | desktop-hd | mobile | all)
```

`HeroCinematic` troca `<ScrollVideo>` por `<HeroCanvas>`; tudo o mais permanece.
`primitives/ScrollVideo` fica no repositório (usado por `legacy/*`).

## 8. Critérios de verificação

Lint, `tsc`, `next build`, `test:copy`; no Chrome: quadro certo em 0 / 0,25 / 0,5 / 0,75 / 1 do
percurso (desktop 1440×900 e mobile 390×844), reverso, nenhum frame vazio em rolagem rápida,
`<head>` com os preloads, rede sem frames antes do `liberado`, trace de performance durante a
rolagem (long tasks, memória), console limpo, `prefers-reduced-motion` com pôster estático.

## 8a. Resultados medidos (08/10/2026, `next dev`, Chrome)

- `scripts/medir-hero-quadros.mjs` (Playwright): aprovado nos seis cenários — 1440×900 @1×,
  1512×982 @2×, 390×844 @3×, cada um com e sem `prefers-reduced-motion`. Quadro = `round(p × (N−1))`
  nas dez leituras de ida e volta; canvas pintado em todas as leituras e em 8/8 instantes de
  rolagem rápida; nenhum quadro além do 1 pedido antes de `data-route-liberado`; com movimento
  reduzido, `data-estado="reduzido"` e só o pôster na rede; quatro preloads de quadro 1 no `<head>`.
- Backing do canvas: 750×817 (1440×900 @1×), 1574×1784 (1512×982 @2×), 1170×2532 (390×844 @3×) —
  sempre `css × DPR`.
- Trace de rolagem (4 s de rolagem contínua + volta rápida + saltos): CLS 0,00; heap JS 22 MB;
  nenhum insight de tarefa longa; os reflows forçados apontados são de `Header.onScroll`, GSAP
  (`_refresh100vh`), `useProgressoNaSecao` e `BackToTop` — nenhum nos módulos do hero.
- Trace de carregamento: o elemento LCP é o `<img class="hero-poster">` (`frame-0001.avif`,
  download 7 ms, 121 ms no total); o LCP de 6,9 s é 90% "render delay", ou seja, a cortina do
  `RouteLoadGate` em modo dev (compilação) — não a sequência. O insight de imagens pesadas aponta
  só arquivos pré-existentes (`escritoriosp.png`, os quatro `Nhome.png` de 1254 px para 40 px).
- Decode medido antes da escolha (bench em `createImageBitmap`, 1440²): WebP 29 ms, AVIF 38 ms.

## 8b. Fluidez e precisão da rolagem (08/10/2026, segunda rodada)

Relato: "a transição está pesada, não está suave; precisa de mais precisão ao scroll". Medido em
build de produção com roda de mouse sintética (30 dentes de 100 px a cada 80 ms ≈ 112 quadros/s
de conteúdo, o ritmo de uma rolagem contínua moderada):

| Métrica (rolagem contínua) | Antes | Causa raiz |
| --- | --- | --- |
| Quadro desenhado atrás do scroll, p90 | 52 quadros (máx. 92) | `scrub: 0.3` em cima do Lenis + janela de decode que perseguia o playhead |
| Quadros distintos desenhados em 3,2 s | 39 | a janela (10 à frente, 3 em paralelo) era toda descartada antes de os bitmaps chegarem: a cena congelava e saltava |
| Custo do `drawImage` por quadro | 3,3 ms (10 ms com a página carregada) | reduzir 1152² para a caixa com `imageSmoothingQuality: 'high'` |

Três causas, três correções, cada uma medida isoladamente:

1. **`scrub: true`** (era 0,3 s). O Lenis já suaviza a rolagem (lerp 0,1); o scrub era um segundo
   filtro e mantinha o quadro até 11 atrás da posição que o Lenis já tinha entregado. Com `true`
   o atraso do scrub caiu para ~1 quadro. A suavidade vem do Lenis; a precisão vem daqui.
2. **Janela de decode por orçamento de memória e mira à frente.** A ordem de decode passou a ser
   pela distância ao ponto onde o playhead ESTARÁ quando o decode terminar
   (`centro + velocidade × latência`, com a latência medida a cada decode), e a janela passou a
   caber num orçamento (160 MB desktop, 90 MB mobile): 31 quadros no tier 1152², 20 no 1440², 15
   no mobile. Em dev, com a máquina folgada, o atraso de decode na rolagem contínua caiu de 61
   quadros (p90 149) para 5 (p90 14–17) e os quadros distintos subiram de 15 para 49–60; na
   volta lenta e nas trocas de sentido o atraso é 0–1 quadro. Quatro decodes em paralelo
   (desktop) ficaram melhores que seis, que disputavam CPU com a thread principal.
3. Testado e **descartado**: pedir o bitmap já no tamanho do canvas com
   `createImageBitmap(blob, { resizeWidth, resizeHeight })`. No Chrome o resize dessa opção roda
   na thread principal (rAF p90 de 22 → 45 ms com 12 decodes). O `drawImage` continua fazendo o
   resample, em 'high'.

Resultado final em produção, medido com a máquina OCUPADA (40–55% de CPU em processos externos;
o controle — a mesma rolagem fora do hero — rodava a 68 ms de rAF, ou seja, a página inteira a
~14 fps, hero ou não):

| Cena (roda sintética) | Atraso desenho × scroll, p90 | Quadro novo por tick |
| --- | --- | --- |
| Ida contínua (1 dente/80 ms) | 10 quadros (antes 52; sob a mesma carga, antes da correção: 249) | 36 em 82 rAF |
| Volta contínua | 11 quadros | 42 em 82 rAF |
| Trocas de sentido (6 dentes para cada lado, ×4) | 29 quadros | 23 em 112 rAF |
| Volta lenta (trackpad) | 1 quadro | 149 em 253 rAF |

Com a máquina folgada (medição em dev no início da rodada), a ida contínua ficou em p90 14–17
quadros de decode e 49–60 quadros distintos. O rAF absoluto durante a rolagem é da máquina, não do
hero: parado, a página volta a 16,7 ms. A sonda ganhou um cenário de precisão com a roda
(critério: p90 ≤ 20 quadros e quadro novo em ≥ 35% dos rAF) para repetir a medição em máquina
folgada.

## 9. Fora de escopo / futuro

- Rótulos do mapa como HTML sobre o Canvas (exige rastreamento da câmera ou um master com
  marcadores) ou regeneração do master com texto correto.
- Hospedar os quadros em CDN/Blob em vez de `public/` (reduz o repositório em ~90 MiB).
- Tier `desktop-hd` só é servido quando a caixa pede; um 2160² para 4K @1× só faria sentido com
  outro master.
