## SIS-139 — /esg — ENVIRONMENT: as seis práticas ganham imagem, cor no hover, movimento contínuo e destaque no título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-139/esg-environment-as-seis-praticas-ganham-imagem-cor-no-hover-movimento

### Pedido
Na seção ENVIRONMENT de `/esg`, cada uma das seis práticas ganha imagem (`public/images/esg/esg-1.png` a `esg-6.png`), os cards mudam de cor no hover, ficam em movimento contínuo e o título ganha destaque. Critérios: par imagem↔prática conferido; imagens em WebP com PNG fora de `public/` e peso antes/depois no comentário; `width`/`height` e `sizes` casados; `alt` descritivo; hover e `:focus-visible` com a mesma cor; movimento só com `transform`/`opacity`, pausa em `:hover`/`:focus-within`; com `prefers-reduced-motion` os seis visíveis; texto legível no ciclo; destaque do título e decisão sobre SOCIAL/GOVERNANCE; GOVERNANCE só muda se a decisão do hover disser; o que sair fica comentado.

### O que foi feito
Relatório inicial (## Feito) e rework após devolução.

**Imagens.** Seis PNGs convertidos para WebP 595×595, q82, alfa preservado (`hasAlpha: true`, `alphaMin: 0`). 1528 KB → 139 KB. Originais em `docs/fontes/esg/`. O pareamento não seguia a numeração: ordem correta contra o array é `esg-1, esg-4, esg-2, esg-5, esg-3, esg-6`. Arquivos renomeados pela prática: `env-coleta-seletiva`, `env-agua-energia`, `env-borra-cafe`, `env-lixo-eletronico`, `env-descartaveis`, `env-papeis`. Primeira versão usou `aspect-[4/3]` + `object-cover` e decapitava o círculo; ficou `aspect-square`.

**Movimento.** Classificado como decorativo. Para sob `prefers-reduced-motion`; pausa em `:hover`/`:focus-within`. Defasagem `--esg-fase: -${i * 1.7}s`. Bug: animar `.esg-pratica-foto` (com `overflow: hidden`) escalava o recorte e a foto cobria a legenda (contraste 2,85:1 a 390px, fundo `rgb(115,145,172)`). Animação, pausa e reduced-motion foram para `.esg-pratica-foto img`.

**Títulos.** As três `h2` passaram a `TituloAceso`. `esg-social` ficou sem `destaque`. Custo de três observers registrado.

**Contraste preexistente.** `glass-card` em `rgba(17,95,160,0.55)` com fundo `rgb(30,125,195)` levantava a superfície a `rgb(57,126,196)`; `text-white/85` a 14px dava 3,54:1. Criada `.esg-superficie` nas duas seções escuras. Hover reescreve todas as camadas do `background` (shorthand).

**Medições (pior pixel, 390/768/1024/1440/1920).** Legenda ENV 5,02:1; `<dd>` GOVERNANCE 4,96–4,99:1; `h2` ENVIRONMENT branco 4,11–4,53 e destaque 3,33–3,75 (piso 3,0); GOVERNANCE branco ~4,94–5 e destaque ~3,96–4; `#esg-social` 12,37–12,51:1. Primeira leitura de social deu 1,2:1 por sondar branco em título `text-ink`. Alturas de linha 365 em 1440/1920. Reduced motion: `animationName: none`, `transform: matrix(1,0,0,1,0,0)`, seis visíveis. Hover: `animationPlayState: paused`.

**Rework.** Parágrafo das três camadas reancorado junto de `.esg-superficie:hover` (alfa 0,94/0,8). `sizes` corrigido para `min(31vw, 359px)` (content box 359,33px a 1440/1920, 307,33px a 1024). Achado: `images: { unoptimized: true }` em `next.config.mjs` — `srcset` vazio, `sizes` inerte em 19 atributos do repo; os 139 KB vieram da conversão WebP. `sizes` mantido com ressalva. `:focus-visible` documentado como não disparando em `<li>` sem `tabindex`. `will-change: transform` removido.

**Portões (após edições):** `npx tsc --noEmit` limpo · `npx eslint src --ext .ts,.tsx` 18 warnings / 0 errors · `npx next build` exit 0, 27/27 páginas. Comentários CSS 928/928. `TODO` do Canal de Denúncia intacto.

### Conferência
Primeira rodada: volta para In Progress por comentário órfão em `globals.css:13836-13847` e `sizes` 356px vs conta 361,3px. Segunda: os dois pontos fechados; `sizes` 359px conferido; `unoptimized` confirmado; veredito **SIS-139 aprovada**, etiqueta `conferir` retirada, fica em In Review.

### Arquivos tocados
Não declarados no relatório em lista fechada. O relato cita `src/app/esg/page.tsx`, `src/app/globals.css`, `docs/fontes/esg/`, WebPs em `public/images/esg/`, e `next.config.mjs` (não alterado).

---

## SIS-138 — /esg — abertura: título quebrado à esquerda e a continuação ao lado, na mesma fonte

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-138/esg-abertura-titulo-quebrado-a-esquerda-e-a-continuacao-ao-lado-na

### Pedido
Na abertura de `/esg`, quebrar a frase: à esquerda “A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis”; à direita “em suas operações e cultura corporativa.” na fonte do título, a partir de 1280px. Abaixo de 1280, bloco único. Um único `h1`; contraste ≥ 4,5:1 contra a foto; globo ESG legível ou decisão registrada; sem `<br />`; corpo fixado em CSS escopado por `.hero-backdrop--esg`; as outras 13 rotas do `PageHero` não mudam.

### O que foi feito
**Primeira entrega.** Grade a partir de 1280; bases do `h1` e da continuação em 570/570 em 1280, 1440 e 1920. Contraste da continuação 7,78:1 (1440) e 6,62:1 (1920) na primeira tabela; depois 5,43:1 citado na conferência intermediária. Abaixo de 1280 empilhado. `PageHero.tsx` intocado. Armadilha: medir durante a animação de entrada (588 vs 604); após 4s, `transform: none` e pés em 570. Desvio: continuação em `var(--font-editorial)` (Instrument Serif). Portões: `tsc` limpo, eslint 18/0, `next build` 0. Captura `docs/capturas/sis138-depois.png`.

**Item que faltava.** `font-size: clamp(2rem, 3.6vw, 3.2rem)` em `.hero-backdrop--esg .pagehero-entrada h1`. Aritmética: `title` + `highlight` = 85 caracteres, faixa `longo`, teto 51,2px. Medido: 46,08px a 1280, 51,2px de ~1422. Comentário do `max-w-2xl` corrigido: a 1920 a coluna abre 685px e trava em 672px (continuação em 1 linha). Overflow-x 6px/4px a 390/768 não é desta issue. Curl 200 em `/`, `/esg`, `/contato`, `/quem-somos`.

### Conferência
Primeira: critério de `font-size` escopado não cumprido; volta In Progress. Segunda: **aprovada**. Conferente mediu sete larguras; limiar 1280 exato; pés 570/570; contraste pior pixel 5,83:1 (1440) e 6,62:1 (1920). Label `conferido`. Sugestões: `line-height` ainda vem da faixa; transbordo 7px a 390 (issue própria); lint deve ser `npm run lint` (24/0).

### Arquivos tocados
- `src/app/globals.css` (bloco `.hero-backdrop--esg`)
- Captura `docs/capturas/sis138-depois.png`

---

## SIS-137 — /trabalhe-conosco — abertura com vídeo, formulário ao lado da escrita e a tag revista

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-137/trabalhe-conosco-abertura-com-video-formulario-ao-lado-da-escrita-e-a

### Pedido
Refazer a abertura de `/trabalhe-conosco`: vídeo `trabalheconosco.mp4` via `HeroVideoBackdrop`; formulário ao lado da escrita a partir de 1024px; escrita maior; tag “Carreira” ajustada; aparência do formulário. Critérios: poster, reencode sem áudio/`+faststart`; título sem linha nova a 1024 e 1440; decisão da tag; borda de campo ≥ 3:1; texto ≥ 4,5:1; `#curriculo`; reduced-motion com pôster; `PageHero` das outras 13 rotas intacto.

### O que foi feito
**Impedimento:** SIS-117 tirou o `DemoForm` (`enviarFormulario` sem destino). A segunda coluna é o cartão `#curriculo` com a verdade sobre vagas e LinkedIn. Critérios de campo/foco/rótulos Nome ficam pendentes, sem marcação.

**Vídeo.** 7,68 MB, AAC, marca “Veo”. ffmpeg: `-an`, crop 1824×1026, scale 1920×1080, CRF 30, `+faststart` → `trabalhe-conosco-hero-loop.mp4` **1.899.837 bytes (1,90 MB)**; poster WebP 1280 **43.200 bytes**. `foco="50% 55%"`. Original preservado.

**Véu.** Fechado em 70% no meio. YAVG 82,2 no quadro, 68,9 à esquerda, 102,7 à direita. Erro: medir `text-white/85` declarado (5,16:1) em vez de composto (3,93:1). Após conserto do recuo, contraste remedido: `h1` 6,58/5,75/5,37; destaque 5,35/4,52/4,22 (piso 3:1); descrição 4,83/4,62/4,65; eyebrow 10,88–11,69.

**Geometria.** `.carreira-abertura` envolve `PageHero` + `#curriculo` em grid. `PageHero` intocado. Devolução: `max-width: 1116px` + clamp cobrava recuo duas vezes (desvio 48px a 1440). Conserto: `max-width: 1180px` e padding `1.25rem` / `1.5rem` @640 / `2rem` @1024. Delta caixa vs `container-lp` = 0. Título: 2 linhas em 390–1920 após o conserto (antes 3 linhas a 1440 com coluna de 522px). Tag: “Carreira” continua `eyebrow`; pílula `#sistran` saiu do cartão. Item “Currículo” comentado em `pageSections.ts`. Reduced-motion: `paused`, `currentTime: 0`, poster no lugar.

**Portões:** `tsc` limpo · eslint src 18/0 · `next build` 0.

### Conferência
Não conferida enquanto Backlog + tags cruzadas. Devolvida pelo desalinhamento 1116 vs 1180. Após conserto: **Aprovada.** Cinco itens do formulário seguem desmarcados até SIS-117. `conferir` removido.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/app/globals.css` (bloco SIS-137)
- `src/data/pageSections.ts`
- `public/videos/trabalhe-conosco-hero-loop.mp4`
- `public/videos/trabalhe-conosco-hero-loop-poster.webp`

---

## SIS-136 — /contato — a faixa de parceiros sobe para entre a abertura e o formulário

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-136/contato-a-faixa-de-parceiros-sobe-para-entre-a-abertura-e-o-formulario

### Pedido
Mover `SignalMarquee` para entre a abertura e o painel de contato. Emendas nas duas bordas com recurso existente; LCP sem regressão; sem salto de layout; loop sem salto; reduced-motion com lista rolável sem sequestro vertical; cópia `aria-hidden`; emenda do `#timeSISTRAN`; comentário antigo reescrito, não apagado.

### O que foi feito
Mesmo `legacy/SignalMarquee` e `clients.ts`; só posição no JSX. Classes `.contato-faixa-parceiros` / `.contato-emenda-clara`.

**Bordas.** Cima: sem rampa; banda SIS-134 entrega `#071d36` plano (amostra `7,29,54`). Baixo: emenda de claro 200px (não `NotchDivider`). Tentativas erradas registradas (fundo da seção, camada de `.fundo-contato`, `::after` com `z-index: -1` que não pinta). `padding-top` de `.fundo-contato-cena` → `clamp(13rem, 16vw, 16rem)`. Fio de baixo do `.lp-signals` removido neste escopo.

**Rework LCP.** Faixa em y=1017 a 1440×900, dentro do limiar lazy. 17–18 requisições, ~1,22 MB, `repeats` = 1. `fetchPriority="low"` em `SignalMarquee.tsx:183`. Hero 76ms vs 1ª logo 100ms (antes 390/396ms). CLS = 0,0000. Loop a 1440: trilha 5459,34px, cópia 2729,67px. Reduced-motion: roda 600px, página desce 600, `scrollLeft` = 0. Cópia `aria-hidden`; `display: none` não tira do DOM. `#timeSISTRAN`: branco 5,57:1. Comentário “fora do DOM” corrigido.

**Portões:** tsc limpo · eslint 18/0 (eslint-disable reposicionado junto do `<img>`) · next build 0.

Follow-up 14/09/2026: usuária pede retirar `.contato-emenda-clara` → SIS-259, sem reabrir a posição.

### Conferência
Dois pontos (LCP invertido; “fora do DOM”). Após rework: **aprovada**; único ponto da rodada que mudou código (`fetchPriority`). Fica In Review.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `src/components/legacy/SignalMarquee.tsx` (no rework)

---

## SIS-135 — /contato — “Onde Estamos”: o mapa maior dentro da seção

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-135/contato-onde-estamos-o-mapa-maior-dentro-da-secao

### Pedido
Aumentar o mapa em “Onde Estamos”. Critérios: cartão visivelmente maior que 512px; título+pílula+cartão visíveis juntos em janela 793px; área limpa cresce; contraste do painel ≥ 4,5:1 se o véu mudar; pino na área limpa nos três degraus; mobile ganha mapa; atribuição visível; tiles vetoriais conferidos.

### O que foi feito
Só CSS. `UnitsMap.tsx` intocado.

| Onde | Antes | Depois (1ª passagem) |
|---|---|---|
| `.mapa-cartao` `padding-top` móvel | 13rem | 16rem |
| `min-height` @64rem | 32rem (512px) | 38rem (608px) |
| `.mapa-veu` rampa | 34% → 66% | 40% / 44% / 47% → 50% |

Ponto 5 (mapa vazio): 8 requisições `tiles.openfreemap.org` HTTP 200, 796 cores; consertado pela SIS-132 (`setWorkerUrl`). Teto: H ≤ 644; 38rem deixa 36px. Mobile: janela mapa 208→256px, painel 409px inalterado. Pino: rampa termina em 50%; primeiro pixel limpo em 49,9%. Área limpa +75% vs caixa +19%. Contraste painel (branco forçado): 12,20:1. Atribuição 11,51:1 / 13,49:1.

**2ª passagem (escopo novo):** máscara vertical em `.mapa-veu` no largo — banda opaca 30rem (480px) centrada, rampa 4rem. `min-height` → 40rem (640px); 149+640=789, sobra zero. Área quase sem véu +10,7% (1440) / +11,3% (1024). Contraste remedido 17,46:1 / 17,63:1. Pino branco puro em (50%, 50%). `padding-top` estreito permanece 16rem.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Várias voltas por registro (números em presente vs código) e depois por escopo novo da captura. 2ª passagem **aprovada**, com dívidas: margem de 17px é o caso mais alto (só SP tem `address`); contraste 12,20 vs 17,46 inexplicado (método). Label `conferir` removida.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-134 — /contato — faixa com os sete indicadores antes do painel de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-134/contato-faixa-com-os-sete-indicadores-antes-do-painel-de-contato

### Pedido
Faixa com os sete indicadores de `METRICS` (`src/data/metrics.ts`) antes do painel, número em cima e descrição abaixo. Sem literais novos; alinhamento 1920/1366/390; mobile 2 ou 3 colunas; números no HTML; reduced-motion no valor final; par anunciado; contraste ≥ 4,5:1; home `Metrics.tsx` intocada.

### O que foi feito
Componente `src/components/MetricsBand.tsx`, CSS `.contato-indicadores*`, inserção em `contato/page.tsx`. Sem `CountUp` (Server Component; HTML serve `850+ 23+ 130+ 650+ 230+ 35+ 25+`). Arranjo **4+3** em grade de 8 colunas, 5º com `grid-column-start: 2`. Mobile 2 colunas. Overflow-x 0. Marcação `<ul>`/`<li>`, não `<dl>`. Fundo `#0f2b4a` → `#071d36`. Contraste número 14,52:1; rótulo ~11,5:1.

**Rework.** Comentário de `align-content: start` (declaração inexistente) reescrito: alinhamento pelo primeiro filho + stretch. `tabular-nums`: ganho é o 1 não ser mais estreito que o 8 *dentro* do mesmo número. `#0f2b4a` remedido após SIS-133: altura hero 522px (58svh) inalterada; erro 2–4 por canal; degrau mediano 7/255, máximo 21/255. Armadilha: `.motion-banner` do `next dev` falseava degrau para 200/255.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Três pontos de registro. Após rework: **aprovada**.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`
- `src/app/contato/page.tsx`

---

## SIS-133 — /contato — abertura em duas colunas: título à esquerda, descrição ao lado, e escrita maior

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-133/contato-abertura-em-duas-colunas-titulo-a-esquerda-descricao-ao-lado-e

### Pedido
A partir de 1024px, título e descrição lado a lado em `/contato`; abaixo empilha. Corpos maiores que 70,4px @1920 e 18px, registrados. Linhas do título sem órfã; linha da descrição 45–75 caracteres; contraste descrição ≥ 4,5:1; outras treze rotas intactas.

### O que foi feito
Tudo em CSS escopado por `.hero-backdrop--contato`; `PageHero.tsx` intocado. Título 80px de 1366 a 1920, 3 linhas; corpo 20px travado (clamp a 22px piorava a linha porque `container-lp` trava em 1116px). Vão teto 2,75rem. Contraste descrição 6,09:1 (pior pixel `rgb(54,86,117)`). Grade `minmax(0, 1fr) minmax(min(100%, 30rem), 1.12fr)` — descrição é a coluna maior. `padding-top` da coluna da descrição 1rem (delta 0 a 1366/1440/1920). Varredura caracteres: 44/47 a 1024 (caixa ~49ch), 56/44 de 1200+. Ressalva de 38ch caiu após o teto do vão. Faixa `min-height: 58svh` = 522px; conteúdo 426px.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Voltas por comentário obsoleto (`1.15fr` vs `1.12fr`), 85px recusado usado na conta, critério 45ch. 2ª passagem **aprovada**. Recomendação: citar por seletor, não por número de linha.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-132 — Mapa das unidades: trocar o mosaico OSM invertido por MapLibre + tiles vetoriais, sem chave

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-132/mapa-das-unidades-trocar-o-mosaico-osm-invertido-por-maplibre-tiles

### Pedido
Trocar o provedor por MapLibre GL + tiles vetoriais sem chave (OpenFreeMap), portando `ESTILO_ESCURO`. Três degraus: Google → vetorial → mosaico. Import dinâmico; sem WebGL cai no mosaico; sem sequestro de scroll; `jumpTo` com reduced-motion; pino da marca; atribuição visível; HTML de endereço/telefone/rota de pé sem JS.

### O que foi feito
`provedor: 'google' | 'vetorial' | 'mosaico'`. Estilo em `src/data/mapaEstiloEscuro.ts` (não o style hospedado). Source aponta para TileJSON `/planet`, não `{z}/{x}/{y}.pbf` com data de build.

**Armadilhas.** (1) Worker MapLibre 6 com `import.meta.url` vazio → `setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')`, cópia via `scripts/copiar-worker-maplibre.mjs` em `predev`/`prebuild`. (2) `.maplibregl-map { position: relative }` zerava altura; corrigido com `h-full w-full`.

**Medições 1440×900.** Canvas 1114×510; atribuição no topo; zoom em x=1238; 1 canvas na troca de unidade; `cooperativeGestures: true`; sem WebGL → 48 tiles raster; reduced-motion `jumpTo`. Produção: biblioteca ~997 kB só após IntersectionObserver; chunk inicial 22 kB.

**Portões:** tsc limpo · eslint 18/0 · next build verde. Custo: OpenFreeMap sem SLA — degrau 3 permanece.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não há lista fechada no relatório. O texto cita `src/components/UnitsMap.tsx`, `src/data/mapaEstiloEscuro.ts`, `package.json` (`maplibre-gl`), `scripts/copiar-worker-maplibre.mjs`, worker em `/maplibre/`.

---

## SIS-130 — /contato — “Venha Fazer Parte do #timeSISTRAN!”: escrita ampliada, palco com marca d’água atrás e “Venha ser Sistran” como cartão dinâmico

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-130/contato-venha-fazer-parte-do-timesistran-escrita-ampliada-palco-com

### Pedido
Ampliar a escrita do fechamento de `/contato`; palco compartilhado com `#SomosSistraners` (marca d’água `#timeSISTRAN`); “Venha ser Sistran” como cartão de duas faces, link único para `/trabalhe-conosco`; essencial visível sem hover; reduced-motion; SIS-42 (`transform` vs `translate`); AA; performance com o mapa na mesma janela.

### O que foi feito
Palco extraído para `src/components/ui/PalcoReativo.tsx`; cartão para `src/components/ui/CartaoDuasFaces.tsx`. CSS `.social-*` → `.palco-*`, `.linkedin-card*` → `.cartao-duas-faces*` (zero `social-` em `globals.css`). `grade-tecnica` saiu. Geometria 1440: colunas `732px 320px`; cartão 320×416. Destino na frente: `Carreira · enviar currículo`. Reduced-motion: parado e visível. SIS-42 medido: `transform` no scroll, `translate` no ponteiro.

**AA.** Título sobre emenda clara 1,43:1 → variante `.palco-emenda-de-claro-curta` (150px, partida `#cfe7f7`). Corpo 3,19:1 sobre luz → véu `.palco-copy::before`. Após véu: branco 9,74/9,62/9,51.

**Performance produção:** mapa→palco mediana 116,7ms (igual ao `#social` da home); topo `/contato` 83,3ms. Custo ~33ms do palco, anterior a esta issue.

**Adendo.** Véu subiu para `.palco-copy` (home também falhava: 3,20/3,14/3,10 branco). Blur 28px no `::before`; inset `-2rem -3rem`. Contraste pós-blur home 10,62/8,56 a 1440.

Critérios de RH (`[~]`): escrita sem benefícios inventados; portal de vagas aberto.

**Portões:** tsc limpo · eslint 18/0 · next build ok.

### Conferência
Devolvida: véu só em `/contato`. Após medir a home e subir o véu: reconferência **corrigido**, In Review. Aprovação de RH e vagas seguem abertas.

### Arquivos tocados
- `src/components/ui/PalcoReativo.tsx`
- `src/components/ui/CartaoDuasFaces.tsx`
- `src/components/Social.tsx`
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- Consumidores: home e `eventos-inovacao/page.tsx`

---

## SIS-129 — /contato — “Onde Estamos”: o mapa passa a ser o cartão inteiro, com seletor e endereço por cima

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-129/contato-onde-estamos-o-mapa-passa-a-ser-o-cartao-inteiro-com-seletor-e

### Pedido
Um único cartão escuro cujo fundo é o mapa; seletor e endereço sobrepostos à esquerda com véu; pílula e título fora, em `container-lp`. Endereço/telefone/rota em HTML. Provedor: Google, vetorial ou fallback OSM aceito. AA do véu no pior caso; sem paleta clara; atribuição visível; reduced-motion seco.

### O que foi feito
Arquivos: `UnitsMap.tsx`, `globals.css` (bloco SIS-129). `contato/page.tsx` não mudou. Grid de duas colunas saiu. Painel em fluxo, não `absolute`. `padding-top: 13rem` no estreito (209px de mapa a 390). Contraste com `#fff` forçado no mapa: branco 17,46 / 15,44 / 16,93:1. Véu 97–98% até 34% (depois corrigido na conferência). `pointer-events: none` no véu/painel, `auto` só em `button, a`. Defeitos: `.section-light h3/p/span` vencendo `text-white` → `on-dark`; `z-index: 0` no mapa soterrava ODbL. Mosaico 6×4 → 8×6. Sem JS: painel no HTML, piso `#0e1b2e`. Zoom Google: `RIGHT_CENTER` (`[~]`). Fallback OSM aceito (`[~]` chave). Comentário posterior: caminho MapLibre recomendado (viraria SIS-132).

**Rework conferência:** aritmética do véu — cartão 1116px, painel 33,0% a 1440 (folga 1 ponto), 38,3% a 1024 (borda na rampa). AA pela rampa lenta: `rgb(23,37,57)` = 15,44:1.

**Portões:** tsc limpo · eslint 18/0. Capturas `docs/capturas/tmp-129-*.png` (não versionadas).

### Conferência
Volta por comentário da folga de 4% falsa. Reconferência: aritmética corrigida, **In Review**. Provedor vetorial ficou para SIS-132.

### Arquivos tocados
- `src/components/UnitsMap.tsx`
- `src/app/globals.css`

---

## SIS-128 — /contato: o fundo atrás do painel “Entre em contato conosco” não pode ser azul chapado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-128/contato-o-fundo-atras-do-painel-entre-em-contato-conosco-nao-pode-ser

### Pedido
Tratamento dinâmico atrás do painel só em `/contato`. Só `transform`/`opacity`; sem blur full-bleed; reduced-motion para visível; borda do painel legível; sem inset negativo na seção; verificado em 1920, 1366 e 390.

### O que foi feito
Camadas estáticas + malha reforçada; movimento por `animation-timeline: view()`. Zero JS novo. `.fundo-contato` `inset: 0`, `z-index: -1`, lajes `--longe` / `--perto`. Sem `blur`. Reduced-motion: `animationName: none`, `opacity: 1`. Amplitude de luminância 238,5 (1920) / 236,7 (1366) / 41,1 (390); cores distintas 11977 / 3779 / 1020. Malha: módulo `/ 2` = 48px, traço 20%, máscara radial, escopo `.fundo-contato-cena`. Chanfro `[~]`: `/contato` nunca teve `NotchDivider`; pico do escuro em 88%. Performance A/B headless: camadas não adicionaram custo mensurável (ruído do ambiente).

### Conferência
Devolvida: comentário afirmava `NotchDivider` na rota. Após reescrita: **corrigido**, In Review. Conta do conferente sobre consumidores do Notch também foi corrigida pelo executor (`/quem-somos` 10, `/parceiros` 2).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`

---

## SIS-127 — /contato: mover “Prefere e-mail?” para dentro do destaque do telefone, só nesta tela

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-127/contato-mover-prefere-e-mail-para-dentro-do-destaque-do-telefone-so

### Pedido
O e-mail comercial entra no destaque do telefone só em `/contato`. Home e modal sem e-mail; `mailto:` e AA; telefone continua o maior peso; texto do bloco relido; comentário de `contato/page.tsx` atualizado; 1920/1366/mobile.

### O que foi feito
Prop `mostrarEmail?: boolean`, padrão `false`, ligada só em `/contato`. E-mail abaixo do telefone (`.contact-dialog-fone-email`): 15,2px / peso 600 / sublinhado permanente vs telefone 16,8px / 800. Contraste e-mail: 8,28 / 5,18 / 8,27. Token `--contact-cyan` `rgb(20,200,245)`. Notas: sem prop “Ou se preferir, deixe uma mensagem abaixo…”; com prop “Prefere não ligar nem escrever?…”. Parágrafo solto removido; import `CONTACT_EMAIL` saiu da página. `overflow-wrap: anywhere`. Ressalva SIS-83.

### Conferência
**Passa**, In Review. Leitura de código, sem navegador (quebra do endereço em estreito não conferida em captura).

### Arquivos tocados
- `src/components/ContactPanel.tsx`
- `src/app/contato/page.tsx`
- `src/app/globals.css` ( degrau `.contact-dialog-fone-email`)

---

## SIS-126 — /contato: foto do escritório atrás da abertura “Preencha o formulário e fale com a gente!”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-126/contato-foto-do-escritorio-atras-da-abertura-preencha-o-formulario-e

### Pedido
Foto do escritório cobrindo a faixa da abertura. Critérios: WebP e peso; `foco` próprio; AA do ciano; header e ScrollSpy legíveis; `alt=""`; reduced-motion idêntico (imagem).

### O que foi feito
`HeroImageBackdrop` + `.hero-backdrop--contato`. Foto **`escritoriosp1.jpg`**, não `escritoriosp.jpg` (já em 3 lugares; posada vira assunto). 179 kB JPG → `public/images/contato/contato-hero.webp` q72 **92 kB** (arquivo 94.374 bytes na conferência). Original permanece em `public/` porque `solutions.ts:28` consome o JPG. `foco="50% 55%"`. Véu 74/70/84% + 32%. Contraste: título 9,22/7,30/6,22; ciano 9,13/5,76/**4,88** (390; véu 34% dava 4,17); descrição 11,66/9,17/8,18. `alt=""`. `#topo` `ancoraTop = 144`.

### Conferência
**Confere.** Desvio da foto aceito. Critério `docs/fontes/` tratado como cumprido pela razão do consumidor em `solutions.ts`. Contraste/header/viewports não verificados pelo conferente (só declaração).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `public/images/contato/contato-hero.webp`

---

## SIS-125 — Varredura por tela: índice das alterações pendentes, rota por rota

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-125/varredura-por-tela-indice-das-alteracoes-pendentes-rota-por-rota

### Pedido
Índice das nove telas sem issue própria (university, trabalhe-conosco, blog, legado, solucoes/[slug], latam, labs, privacidade, transparência salarial). Não é issue de execução. Critérios: filhas com estado/bloqueio/próximo passo; padrões com tratamento; rotas indexáveis na navegação; ScrollSpy com `label`.

### O que foi feito
**## Entrega — rodada 2.** Nenhum código. Nove filhas com estado; SIS-117 pendente de conferência; SIS-123/124 Backlog jurídico. `/latam` textual até ativos regionais (SIS-121). ScrollSpy: 54 estáticas + 20 derivadas = 74 com `label`; 24 candidatas antes do limiar; QA Integrado e Connect API suprimidas (2 entradas). Critérios reescritos para não concluir filhas. Portões: `npm run lint` 24/0; tsc/build/copy-lock não repetidos. Arquivos: nenhum.

Rodada 1 do índice (09/09) atualizou a descrição Linear: padrões de description, pageSections, imagens, links mortos, sitemap/menu. `copy-lock --check` OK (1194). Lint então falhava por plugin `react-hooks` (SIS-182), declarado não cumprido.

### Conferência
Rodada 1: **VEREDITO: REPROVADO** (latam sem decisão de imagem; critérios de índice; cifra 58/58). Rodada 2: **VEREDITO: APROVADO**. Mantida In Review + `conferido`, não Done.

### Arquivos tocados
Nenhum (só descrições/comentários no Linear).

---

## SIS-122 — /sistran-labs: Guru de Seguros e Smart Miner aparecem duas vezes na mesma página, e a abertura tem três parágrafos com caixa alta no meio do texto

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-122/sistran-labs-guru-de-seguros-e-smart-miner-aparecem-duas-vezes-na

### Pedido
Resolver sobreposição `SOLUCOES` × `ACCELERATORS`; tirar corpo da abertura; caixa alta só via CSS; decidir CTA de e-mail do meio; ids em `pageSections.ts`; 1920/1366/mobile.

### O que foi feito
Filtro derivado: `NOMES_COM_PAGINA_PROPRIA` de `ACCELERATORS`; `SOLUCOES_SO_AQUI` no DOM. Guru/Smart 1× cada; Churn e Fast Claims publicados. Corpo em `#labs-o-que-e`; abertura sem `description`. `h1` 70,4px @1920 (faixa média). Caixa mista no DOM + `uppercase` no CSS; highlight do h1 em caixa mista (prop `string`). E-mail do meio **fica** (`mailto:` único endereço escrito; `ContactCTA` vai a `/#contato`). `pageSections.ts`: `{ id: 'labs-o-que-e', label: 'O Labs' }`. Quatro paradas. `h2` `sr-only`. copy-lock não regenerado (já falhava).

**Portões:** tsc limpo · eslint src 18/0 · curl 200 · next build 0 · overflow-x 0.

### Conferência
**Aprovada.** Sete critérios. Sugestões: comentário “41 caracteres” é 37; colisão ScrollSpy 27px a 1280 (SIS-170); usar `npm run lint`; copy-lock pendente; Fast vs Fast Claims.

### Arquivos tocados
- `src/app/sistran-labs/page.tsx`
- `src/data/pageSections.ts`

---

## SIS-121 — /latam: “Alianzas” sem alianças, notícias sem destino, doze escritórios sem mapa

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-121/latam-alianzas-sem-aliancas-noticias-sem-destino-doze-escritorios-sem

### Pedido
Alianzas com conteúdo ou rótulo honesto; notícias com destino ou sem aparência de clique; “Más info” distinguíveis; decisão de mapa e de fechamento; uma navegação por largura; tudo em `lang="es"`; 1920/1366/mobile.

### O que foi feito
Parada **Aseguradoras** (não inventar marcas; `clients.ts` é lista BR de tecnologia). Notícias: `glass-card` estático. `sr-only` com nome do produto nos três “Más info”. Mapa não entra (espera SIS-132). Fecha no card RRHH, sem `ContactCTA` em português. Nav âncoras `xl:hidden` vs ScrollSpy ≥1280. Overflow-x 0.

**2ª volta.** `navIdiomaForPath` em `pageSections.ts`; `ScrollSpy` `lang={idioma.lang}` e `aria-label`. `/latam`: `{ lang: 'es', rotulo: 'Secciones de esta página' }`. Compañía → Experiencia. Comentário mentiroso de `latam.ts` reescrito. `npm run lint` 24/0; tsc; build; copy-lock 1195 após as duas trocas.

**09/09:** decisão complementar — `/latam` permanece textual sem ativos regionais.

### Conferência
**DEVOLVIDA** por `lang` da nav lateral fora de `es`. Correção do conferente: troca Alianzas→Aseguradoras estava declarada. Conferência 2: **APROVADA**. `conferido`. Pontos parados: marcas, URLs, mapa, CTA em espanhol.

### Arquivos tocados
- `src/app/latam/page.tsx`
- `src/data/latam.ts`
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-120 — /solucoes/[slug]: as sete páginas de produto são texto corrido, sem imagem, sem volta e sem navegação entre elas

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-120/solucoesslug-as-sete-paginas-de-produto-sao-texto-corrido-sem-imagem

### Pedido
Sem duplicar `page.lead`/`accel.description`; parágrafo órfão em seção; decisão de imagem; volta a `/solucoes` e nav entre os sete com `aria-current`; ids + `pageSections.ts`; `key` estável; sete páginas em 1920/1366/mobile.

### O que foi feito
`page.lead` fica; `accel.description` sai (continua na vitrine). Páginas **textuais** (sem asset por slug). Nav fichas + link “Ver todas as soluções e serviços”. Atual é `<span aria-current="page">`. `idDoBloco()` compartilhado com `pageSections.ts` (`SECOES_DE_ACELERADOR`). qa-integrado e connect-api: 0 paradas (regra &lt;3). `chaveDoBloco`; `startIndex` removido. Eyebrow igual nas sete. 21 medições overflow 0. copy-lock não regenerado.

**Portões:** tsc 0 · eslint src 18/0 · curl 200 nas sete · next build 0 SSG.

### Conferência
**APROVADO.** Achado: ScrollSpy sobre o hero a 1280–1366 (geometria pré-existente, issue própria). Resíduo posterior: cabeçalho de `pageSections.ts` ainda diz que `/solucoes/[slug]` não tem chave.

### Arquivos tocados
- `src/app/solucoes/[slug]/page.tsx`
- `src/data/acceleratorPages.ts`
- `src/data/pageSections.ts`

---

## SIS-119 — /transformacao-legado: página sem abertura, sem h1 e fora do menu

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-119/transformacao-legado-pagina-sem-abertura-sem-h1-e-fora-do-menu

### Pedido
`PageHero` com h1 e `#topo`; decisão de menu; reavaliar exclusão do ScrollSpy; `StackScenes` após a mudança; sem texto da home; 1920/1366/mobile.

### O que foi feito
`PageHero` título “Transformação de Legado”; **sem `description`** (metadata promete “método em quatro movimentos” e `#sistema` está comentado no DOM). Eyebrow “Arquitetura e roadmap”. Menu: filha de Soluções (`nav.ts`), 7 itens de primeiro nível, overflow header 0. ScrollSpy: 3 paradas `#topo` / `#sinais` / `#roadmap`; `#sistema` comentado. `StackScenes` sem `variante`, sticky (sem ScrollTrigger). ImpactSequence só na home.

**Portões:** tsc limpo · eslint src 18/0 · curl 200 · next build 0.

### Conferência
**APROVADA.** Recuos da description e de `#sistema` aceitos. Sugestão: comentário “quatro seções” vs três paradas; rota entra na SIS-170; metadata.description mentindo; usar `npm run lint`.

### Arquivos tocados
- `src/app/transformacao-legado/page.tsx`
- `src/data/nav.ts`
- `src/data/pageSections.ts`

---

## SIS-118 — /blog e /blog/[slug]: a seção está órfã no site e o post tem três links mortos

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-118/blog-e-blogslug-a-secao-esta-orfa-no-site-e-o-post-tem-tres-links

### Pedido
Cada slug com o próprio corpo em `blog.ts`; decisão de navegação; rótulos de sessão viram link ou saem; grade sem coluna vazia; pageSections se ganharem seções.

### O que foi feito
Premissa corrigida: **1 post**, não 2. `Post.body` em blocos tipados (não HTML string/MDX); `default: never`. Aspas curvas no dado. “ASSISTA…” comentado no lugar. Blog no rodapé Institucional; sitemap intacto. Grade deriva de `POSTS.length` (`max-w-md` com 1). `pageSections.ts` sem alteração (critério dos 3). Title “Blog · Sistran”.

**Portões:** tsc limpo · eslint src 18/0 · next build 0 · curl 200 · overflow 0 · 1 h1.

### Conferência
**Aprovado.** Conferente rodou `npm run lint` 24/0. `/blog/nao-existe` 404. Sugestões: link voltar do post; comentário pageSections (resíduo SIS-120); nota da sidebar em `blog/page.tsx`. URLs dos webinars paradas.

### Arquivos tocados
Não listados em bloco único no relatório. O texto cita `src/data/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`, `src/components/Footer.tsx`.

---

## SIS-117 — /trabalhe-conosco: o currículo enviado não vai a lugar nenhum, e a página não tem vagas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-117/trabalhe-conosco-o-curriculo-enviado-nao-vai-a-lugar-nenhum-e-a-pagina

### Pedido
Destino do formulário ligado e verificado; confirmação ao candidato; `accept`/limite/validação; aviso de privacidade; verdade sobre vagas; anúncios a11y; seções em `pageSections.ts`.

### O que foi feito
Auditoria: `actions/contato.ts:70-87` devolve sucesso sem e-mail/storage/ATS. Formulário **comentado no lugar** (FIELDS completo). No `#curriculo`: verdade sobre vagas, LinkedIn (`LINKEDIN_URL`), aviso de que não há coleta (sem link para política só de cookies). `CampoArquivo`: `accept=".pdf,.doc,.docx"`, 5 MB, validação por extensão, `role="alert"`. Destino real **não atendido** (`[~]`). 11/09: pedido da usuária para voltar o form → SIS-223.

### Conferência
Devolvida: tags cruzadas (junto SIS-137). 2ª passagem: **tecnicamente aprovada**; fica parada por decisão de produto (RH), sem `conferir`. Destino do currículo bloqueia Done.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/components/forms/DemoForm.tsx` (`CampoArquivo`)

---

## SIS-116 — /sistran-university: a página é só a abertura — falta a página inteira

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-116/sistran-university-a-pagina-e-so-a-abertura-falta-a-pagina-inteira

### Pedido
Abertura com título + uma frase; ≥3 seções com id; rota em `pageSections.ts`; números 60/17/2022 como indicadores; ≥1 imagem WebP com alt desta página; nenhum texto novo da fonte; 1920/1366/mobile.

### O que foi feito
Description = última frase do 1º parágrafo (154 caracteres). Seções `#university-programa`, `#university-unidep`, `#university-numeros` com títulos literais da fonte. “2022” no h2, não em cartão (desvio declarado). Fotos `1/2/3-turma-Gerando-Talentos.webp` 41/67/56 KB (SIS-109); alt desta rota. Galeria estática. Link `/esg#esg-social`. Frase agramatical da fonte não reescrita.

**Portões:** tsc limpo · eslint src 18/0 · next build 0 · overflow 0.

### Conferência
**APROVADA.** Fidelidade frase a frase contra `03-sistran-university.md`. Conferente usou `npm run lint` 24/0. Sugestão: “em ESG” no link é texto novo não declarado; metadata sem description.

### Arquivos tocados
Não listados em bloco. O relatório opera em `src/app/sistran-university/page.tsx` e `src/data/pageSections.ts`.

---

## SIS-115 — /eventos-inovacao: imagem em destaque no centro da tela e preview reduzido a anterior/próximo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-115/eventos-inovacao-imagem-em-destaque-no-centro-da-tela-e-preview

### Pedido
Imagem centralizada e inteira; preview só anterior/próximo; posição 01/15; controles reais; pontas com `aria-disabled`; 15 eventos alcançáveis; preview discreto com contraste/alvo; AA nas 15 fotos; 1920/1366/mobile.

### O que foi feito
Redesenho: tokens `--evento-painel` / `--evento-caixa` e grade de duas colunas removidos. Controles em barra `position: fixed` na base (`IntersectionObserver` `data-visivel`). ResizeObserver publica `--evento-barra`. Centro @1920: 961 (desvio 1px); @1366 desvio 0; `dentro: true`. Foto @1366 987×555; @1920 1125×633. Folga foto–barra +20px (antes −75px). Posição `.evento-posicao` tabular-nums. Botões nomeiam o destino; pontas `aria-disabled` focáveis, sem wrap. Opacidade 0.78; alvo 44–46px. AA pior caso evento 01: 5,94 título / 5,33 descrição. A 390 controles `display: none`. Tokens migrados de `:root` para `.evento-cena`. Filtros: seletor `.evento-navegador .evento-filtros`.

**Portões:** next build verde 27 rotas · tsc limpo · eslint src 19 avisos / 0 erros (baseline da época).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados em lista. O relatório aponta `src/components/EventsGrid.tsx` e `src/app/globals.css`.
