## SIS-235 — /eventos-inovacao · tag «Realizado pela Sistran» vira componente carimbo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-235/eventos-inovacao-tag-realizado-pela-sistran-vira-componente-carimbo

### Pedido
Em `/eventos-inovacao`, no lugar da tag «Realizado pela Sistran» (`kind: proprio`), criar um componente de carimbo no formato visual de `public/images/carimbo.png`: oval inclinado, logo S no topo, «REALIZADO» + «PELA SISTRAN», textura azul/ciano. Converter o PNG (~2,5 MB) para WebP com alfa em tamanho de uso. Substituir o chip em Grid + Spotlight nos eventos próprios; manter o significado acessível via `alt` ou sr-only; filtros/admin podem permanecer texto. Outros kinds não viram carimbo. Aceite: tag textual some e o carimbo aparece no mesmo lugar hierárquico; visual alinhado à arte; Spotlight e Grid (desktop sticky + mobile) cobertos; leitor de tela anuncia o sentido; lint OK.

### O que foi feito
Relatório do executor («SIS-235 — implementado, item por item»).

**Portões:** `npm run lint` — 22 problemas · 0 erros · 22 avisos (nenhum nos arquivos novos; preexistentes em `MorphingHeadline`, `PillarsCarousel`, `EventsSpotlight:213`). `npm run test:copy` — OK, 1194 textos distintos, nada mudou. Movimento reduzido (sonda `reducedMotion: "reduce"`): carimbo nasce no estado final (`opacity: 1`, sem `transform` do GSAP), caixa idêntica em duas leituras a 500 ms.

**Item 1 — componente reutilizável.** `src/components/CarimboRealizadoSistran.tsx` + `src/components/carimbo-realizado-sistran.css`. Arte: `public/images/carimbo-realizado-sistran.webp` · 520×399 · alfa real · 96,8 KB (era 2,39 MB, 96,0% menor), gerada por `scripts/gerar-carimbo-webp.mjs`. `alt` e rotação leve conforme pedido.

**Item 2 — troca nos cartões `proprio`.** Em `EventsSpotlight.tsx` o chip textual dá lugar ao carimbo quando `kind === "proprio"`, nos dois markups: cartão do palco (~linha 699, com batida de entrada) e item do carrossel estreito (~linha 931, sem animação). O markup do chip permanece para `global`, `nacional` e `parceiro`. Ressalva: `EventsGrid` e `EventsMosaic` saíram da rota na SIS-166 — em `src/app/eventos-inovacao/page.tsx` os imports estão comentados; não existe `.evento-selo` pintado. O que a issue chama de «Grid + Spotlight» está coberto pelo par palco (desktop, `position: sticky`) + carrossel (mobile).

**Item 3 — escala, evento Web Summit AI (`proprio`, índice 0), sonda `scripts/medir-carimbo-sis235.mjs`.**

- 390×844: selo chip 183×23,9 → carimbo 111,8×90,2; razão selo/título (alturas) 0,6 → 2,1; arte h 160,8 (igual); cartão 319×568,4 → 319×624,3; sem transbordo (622/622).
- 1440×900: chip 186,5×24,3 → carimbo 142,4×114,9; razão 0,4 → 2,0; selo/largura do cartão 0,2; arte h 316,4 (igual); cartão 604,8×593,4 → 604,8×670,8; cabe no palco.
A foto não pagou o carimbo: altura da arte idêntica; o cartão cresceu +77,4 px em 1440 e +55,9 px em 390 e continua dentro do palco.

**Item 4 — filtros e admin.** `EVENT_KIND_META.proprio.label` continua texto. O `alt` do carimbo sai dessa constante.

**Leitor de tela.** «Realizado pela Sistran» em 390 e 1440, medido como `innerText` + `aria-label` + `alt`. Sentido no `alt`, sem `.sr-only` irmão.

**Três premissas que não se sustentaram.** (1) `carimbo.png` não é transparente: 1374×1145 · png · 3 canais · `hasAlpha=false`; xadrez achatado nos pixels. Alfa reconstruído por chave de croma (fundo neutro croma 0–6; tinta azul ~190) com o S resgatado pelo brilho (limiar 235). Inundação a partir da borda reprovada (anel contínuo deixava o xadrez interno opaco). O script relê o arquivo e reprova sozinho (`hasAlpha`, alfa dos cantos, % transparente, contagem do S). (2) O chip vive na área de texto do cartão, placa `rgba(255,255,255,0.96)`, nunca sobre a foto — carimbo sem sombra. (3) A arte não traz rotação (oval reto); ramo da issue: **−6°** (em −10° o canto cruzava o título em 1440).

**Defeito corrigido.** A propriedade CSS `rotate` não compõe com o `transform` do GSAP na prática (CSSPlugin grava `translate: none; rotate: none; scale: none;`). Palco assentava reto (caixa 132,5×101,6 vs 142,4×114,9 com movimento reduzido). Tween passa a terminar no tombo de repouso (−6°).

**Animação.** Batida de montagem: `scale 1.9 → 1`, `rotation −19° → −6°`, `back.out(1.7)`, 0,42 s — só no cartão do palco. Sem `ScrollTrigger`. Com movimento reduzido a timeline não monta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/CarimboRealizadoSistran.tsx` (novo)
- `src/components/carimbo-realizado-sistran.css` (novo)
- `public/images/carimbo-realizado-sistran.webp` (novo)
- `scripts/gerar-carimbo-webp.mjs` (novo)
- `scripts/medir-carimbo-sis235.mjs` (novo)
- `src/components/EventsSpotlight.tsx`
- `public/images/carimbo.png` permanece como entrada da conversão (não no caminho crítico)

---

## SIS-234 — /esg SOCIAL · foguete do scroll colorido e 3D (logo Gerando Talentos)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-234/esg-social-foguete-do-scroll-colorido-e-3d-logo-gerando-talentos

### Pedido
Na seção SOCIAL de `/esg`, o foguete de scroll (`FogueteScroll`) deve ganhar cores e leitura 3D a partir do logo `public/images/esg/logo-Gerando-Talentos.webp`. Manter sticky, trajetória e reduced-motion parado visível. Contraste AA do texto (`text-ink` / `text-ink-muted`) no pior ponto do trajeto. Não substituir o selo estático. Capturas 390 / 1024 / 1440; lint OK.

### O que foi feito
Relatório do executor («SIS-234 — foguete de SOCIAL colorido e com leitura 3D»). Arquivos: `src/components/ui/FogueteScroll.tsx` (arte), `scripts/medir-foguete-social-sis234.mjs`.

**Item 1 — paleta medida no WebP (sharp), não a olho:** navy `#001849`, laranja `#f88633`/`#f38835`, azul `#0d8ac4`/`#2087ad`, prata `#d6dce3`, branco `#fefdff`. Cada peça com degradê em `<defs>`: tanque (prata → branco → aresta azul); auxiliares (moldura laranja, pico `#f88633` alfa 0,26); orbitador (branco no nariz → teal, `radialGradient`); três chamas (laranja → azul); rastro em esteira; anéis das tubeiras (traço 1 un. azul lavado). Continua `<svg viewBox="0 0 120 300">` com os mesmos `path`. Navy do selo ficou de fora: em qualquer alfa visível o fundo cai abaixo de AA.

**Item 2 — mecânica intocada:** `sticky top-0`, âncora de altura zero, `overflow-clip`, `useScroll`/`useTransform` em MotionValue, `-z-10`, `aria-hidden`, `pointer-events-none`. Diff só `fill`/`defs` + atenuação mobile. Reduced motion 1440: em `p=0,45` e `p=0,75` o SVG no mesmo lugar — `top: 95`, `transform: matrix(0.990268, 0.139173, -0.139173, 0.990268, 0, 108)`, `opacity: 1`. Foto: `sis234-depois-reduce-1440.png`.

**Item 3 — contraste com máscara de glifos, 9 passos, 390/1024/1440, vs `SEM_FOGUETE=1`.** Pior ponto sob o foguete (`text-ink-muted` `#3d5a80`, piso 4,5:1): 390 **4,96:1** (sem foguete 3,74:1); 1024 **4,81:1** (5,06:1); 1440 **5,39:1** (5,39:1). A 390 a camada entra a 60% (`opacity-60 md:opacity-100`). JSDoc: `text-ink-muted` L=0,0986 → fundo precisa L ≥ 0,619; fundo da seção ~0,75. Achado fora de escopo (não mexido): parágrafos em `glass-card` a 1024/1440 dão 4,33:1 e 4,28:1 com e sem foguete.

**Item 4.** `GERANDO_TALENTOS.logo` / `.esg-selo` / `.esg-apoio` intocados.

**Capturas.** `docs/capturas/`: `sis234-antes-{390,1024,1440}-p{4,6}.png` e `sis234-depois-…`; o «antes» usa `ANTES_BRANCO=1` (código já estava mudado).

**Portões:** `npx tsc --noEmit` limpo; `npm run lint` 22 problemas / 0 erros; `npm run test:copy` OK (1183 textos); `npm run build` OK.

Comentário posterior: a usuária trouxe arte nova `public/images/esg/foguete.png`; follow-up **SIS-254**. Esta issue (SVG 3D) fica como histórico.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `scripts/medir-foguete-social-sis234.mjs`

---

## SIS-233 — /esg · título e descrição da abertura iguais a /contato

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-233/esg-titulo-e-descricao-da-abertura-iguais-a-contato

### Pedido
Na abertura de `/esg`, título e descrição devem ficar visualmente iguais ao padrão de `/contato` (manchete title+highlight + parágrafo de apoio), sem copiar o texto de contato. Alinhar tipografia/layout a `.hero-backdrop--contato` via CSS escopado em `.hero-backdrop--esg`; remover regras que forçam a descrição a ser continuação do h1. Preservar foto/véu e globo. Capturas 390 / 1024 / 1440; contraste OK; lint OK.

### O que foi feito
Relatório do executor («Feito — item por item»).

**1. Papel manchete + descrição.** `src/app/esg/page.tsx:295-300`. Recorte: `title` «A Sistran demonstra seu forte»; `highlight` «compromisso com o ESG.»; `description` «Integrando práticas sustentáveis em suas operações e cultura corporativa.» Ciano no fecho da manchete, como «fale com a gente!». Nota em `page.tsx:265-294`.

**2. Tipografia alinhada a `.hero-backdrop--contato` (sonda `scripts/medir-abertura-esg-sis233.mjs`).** Em 1440: h1 47,52 px → **80 px** (contato 80); peso 400 → **700**; descrição 36 px → **20 px**; família `--font-editorial` → corpo do componente; `line-height` 39,6 px (1,1) → **32,5 px (1,625)**; medida `max-width: none` → **672 px (`max-w-2xl`)**; `white-space` nowrap → normal; colunas 533,7/671,2 → **568,3/636,5** (contato 506,0/566,8); `gap` 43,2 px (igual); `align-items` end → start; padding-top da descrição 1 rem. Linhas em `globals.css:17806` (`clamp(2.6rem, 5.9vw, 5rem)` + weight 700), `:17855` (1,25 rem), `:17912`, `:17957`, `:17976`.

Divergência deliberada: descrição `#fff` em vez de `text-white/85`. Com 85%: 390 7,30:1 passa; **1024 4,37:1 REPROVA** (pior pixel `rgb(73,111,140)`); 1440 4,85:1. Com branco opaco o mesmo pixel 5,34:1.

**3. Regras de continuação comentadas (não apagadas):** editorial + clamp display; `line-height: 1.1`; `max-width: none` / `nowrap`; grid `max-content` → `minmax(min(100%, 30rem), 1.12fr)` e `align-items: start`; clamp do h1 da SIS-206.

**4. Foto/véu/globo.** `foco="50% 42%"`, src e recuo 10 rem da SIS-113 intocados. Sobreposição h1×globo a 1024: 21.455 px² → **0**; a 390: 22.356 → 11.586.

**5. Grade.** Limiar 1280 → **64 rem (1024)**. Colunas: 390/768 uma; 1024 430,8/482,5; 1280 495,1/554,5; 1440 568,3/636,5; 1920 794,3/889,7. Sem rolagem lateral.

**Contraste descrição (branco opaco):** 390 8,64:1; 1024 5,30:1; 1440 5,88:1. h1 (piso 3:1): 5,86 / 6,24 / 5,82.

**Portões:** tsc 0 erros; lint 22 problems (0 errors); copy-lock regravado (recorte da frase); `npm run build` ok. `PageHero.tsx` não tocado.

Capturas em `docs/capturas/sis233-esg/` (esg e contato, 390/1024/1440).

Comentário posterior: usuária redefine abertura («ESG - Environment, Social & Governance»); escopo em **SIS-257**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/medir-abertura-esg-sis233.mjs`

---

## SIS-232 — /eventos-inovacao · miniaturas laterais maiores e mais perto do card em destaque

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-232/eventos-inovacao-miniaturas-laterais-maiores-e-mais-perto-do-card-em

### Pedido
Em `EventsSpotlight`, aumentar as miniaturas laterais e aproximá-las do card central. Subir `--evt-vaga-w`; reduzir inset entre coluna e centro; sem sobreposição vaga↔cartão/vaga↔vaga; rótulos inteiros; capturas 1440 (+1024 se mexer no piso); lint OK.

### O que foi feito
Relatório («Relatório SIS-232 — item por item»). Sonda `scripts/medir-vagas-eventos-sis232.mjs`; `docs/medidas/vagas-eventos-sis232/{antes,depois}.json`. Janelas: 1024×768, 1280×800, 1366×768, 1440×900, 1600×900, 1670×940.

**O caminho prescrito (reduzir inset/`left`/`right`) não passou.** O inset externo não é margem morta: caixa do ScrollSpy em x=103 a 1440; `left: clamp(7.5rem, 8.5vw, 10rem)` põe a coluna em 122,4 — 17 px de folga. Interno: cartão x=417,6, vaga mais avançada 400,8 → 16,8 px brutos, 7,8 px após `--evt-float-x`. Faixa 270,7 px contra 270,6 exigidos por `--evt-faixa-w >= --evt-vaga-w × 1,606`.

**Alavanca:** banda de espalhamento `4–34%` → `14–26%`; fator 1,606 → 1,432 (~12% de largura de vaga). Amplitude do zig-zag 30% → 12% (~81 px → ~32 px em 1440).

**Aumento de vagas (área de arte):** 1280 +37% (122,9 → 136,7 px); 1366 +39%; **1440 +31%** (146,8 → 159,8 px); 1600 +26%; 1670 +27%. 1024 inalterado (−1%).

**Aproximação em 1440 esq:** distância média ao cartão 81,2 → **60,4 px (−26%)**. Ímpares +40 a +42 px mais perto; seis das oito mais perto; duas recuaram (6,4 px e 1 px). A vaga mais avançada ficou 6,4 px mais longe (subir recuo a 28% estouraria o cartão).

**Sobreposição:** zero `⛔ VAGA SOBRE O CARTÃO`; zero pares apertados (vão < 3,4 px); zero rótulos cortados. Pior vão: 1366 esq 5,4 px.

**Mobile:** não aplicado. SIS-239 já trocou `.eventos-lista` por carrossel; nada abaixo de 1024. Reduced motion: medidas melhoram (flutuação para); zero cortes.

**Lint:** 22 problemas (0 errors). CSS only: `events-spotlight.css` (379 inserções / 22 remoções).

**Correções:** `--evt-arte-fr` 0,44 em 1280 estourou 1366 (vão 1,4 px) → **0,38**. Degrau topo 0,54 estourou 1600/1670 → **0,46**, teto 21,3 svh → 20,5 svh. Padding `.eventos-vaga` 0,3 rem → 0,18 rem; coluna `padding-block` 1,25 rem → 1 rem.

Capturas: `docs/capturas/sis232-vagas-1440x900-{antes,depois}.png` e `sis232-vagas-1024x768-…`.

Follow-up (15/09): vão ainda grande; **SIS-268**. Esta 232 é a 1ª aproximação (banda 14–26%).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `scripts/medir-vagas-eventos-sis232.mjs`

---

## SIS-231 — /solucoes · remover seção Transformação de Legado (método / quatro movimentos)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-231/solucoes-remover-secao-transformacao-de-legado-metodo-quatro

### Pedido
Em `/solucoes`, remover a seção `#transformacao-legado` (título, `scenesIntro`/`mosaicIntro`, CTA «Ver o método, a arquitetura e o roadmap»), o AnchorPill e a entrada no spy. A rota `/transformacao-legado` não é apagada. Lint / tsc / build / test:copy OK.

### O que foi feito
Em `/solucoes` saíram o bloco `#transformacao-legado`, o `AnchorPill` da barra «Nesta página» e a entrada `{ id: 'transformacao-legado', label: 'Legado' }` no spy. A página fecha em Consultoria → `ContactCTA`. Preservados: rota `/transformacao-legado`; item do menu global (`nav.ts`); `sitemap.ts`; dados `scenesIntro`/`mosaicIntro` em `legacy.ts`. O CTA não era o único acesso.

Copy-lock: `Transformação de Legado` 4→1, CTA 1→0, label `Legado` 2→1. Depois: OK (1177 textos distintos, nada mudou).

**Portões:** `npm run lint` OK, 22 warnings preexistentes; `npx tsc --noEmit` OK; `npm run build` OK; `npm run test:copy` OK; `git diff --check` do escopo OK.

Entregue em In Review, sem `conferir`/`conferido`; Done permanece decisão da usuária.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-230 — /quem-somos · Premiações: Celent (troféu + logo + texto) e arte LATAM abaixo

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-230/quem-somos-premiacoes-celent-trofeu-logo-texto-e-arte-latam-abaixo

### Pedido
Na seção Premiações (`RecognitionTheater` / `#premiacoes`), logo abaixo do eyebrow e do título, inserir destaque Celent: `public/trofeu.png`, `public/logo-Celent.png` e as duas frases do conteúdo-site. Abaixo, arte `public/celentlatam.png`. Não inventar copy; teatro existente continua. Mobile, contraste, WebP; capturas 1440; portões OK. (Atualização 11/09 aponta follow-up SIS-238 para fundo `cele.png`.)

### O que foi feito
Faixa `.rec-abertura` em fluxo normal, antes do percurso fixo: eyebrow + `h2#premiacoes` (movidos), bloco Celent, arte LATAM. Ordem DOM: `.rec-header` → `.rec-celent` (`.rec-celent-trofeu`, `.rec-celent-chip`, `.rec-celent-linha1`, `.rec-celent-linha2`) → `.rec-latam`.

Copy: «A Sistran foi reconhecida pela Celent com o Technology Standout 2023.» e «A mais alta categoria no quesito tecnologia» (espaços duplos normalizados). Texto já existia em `PREMIACOES_NOTAS[1]` — movido, não duplicado; entrada antiga comentada em `aSistran.ts`.

Teatro: `.rec-cena` = 4, `.rec-nav-item` = 4; 10% → Gaivotas de Ouro; 60% → Certificações. Mobile: coluna até 767 px; `scrollWidth=clientWidth` em 390 e 1440.

Contraste: linha1 branco sobre `rgb(6 42 92)` **14,03:1**; linha2 `rgba(211 235 250 / .9)` **11,62:1**.

Peso: `trofeu.png` 1 690 395 B → `trofeu.webp` **72 928 B** (760×950, q82), −95,7%; `celentlatam.png` 1 785 360 B → **124 734 B** (1600×900, q80), −93,0%.

A11y: alt descritivo no troféu, `alt="Celent"`, LATAM com alt do quadrante. Logo em chip branco (tinta `rgb(68 118 117)` ilegível no navy). Máscara de duas linear-gradients (`mask-composite: intersect`); troféu com brilho ciano.

Reduce: `[data-rec-entra]` com `opacity: "1"`, `transform: "none"`. Checa `prefersReducedMotion()` e `html[data-motion="reduce"]`.

**Desvio:** cabeçalho saiu do palco sticky (`overflow: clip` apararia o bloco). Emenda medida: degradê fecha em `#032658` (0,0229 → 0,0211, ≈1,02:1).

Movimento: `gsap.context()` + `ScrollTrigger` `once: true`, `start: 'top 82%'`, `stagger: 0.09`, `ease: 'expo.out'`. IntersectionObserver 1,2 s de rede de segurança.

**Portões:** tsc limpo; lint 22/0; copy-lock 1632 travados; test:copy OK (1181); test:extrator 41 casos; build OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/RecognitionTheater.tsx`
- `src/components/recognition-theater.css`
- `src/data/reconhecimentos.ts`
- `src/data/aSistran.ts`
- `public/trofeu.webp`
- `public/celentlatam.webp`

---

## SIS-229 — /sistran-labs · Principais Soluções: arte principaissolucoes bem integrada (não quadrado)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-229/sistran-labs-principais-solucoes-arte-principaissolucoes-bem-integrada

### Pedido
Na seção `#labs-principais`, integrar `public/principaissolucoes.png` de forma bonita (full-bleed/largura generosa, bordas moles, fundo que deixe o neon respirar, WebP). Nomes alcançáveis por texto/links (preferência: arte + cards ACCELERATORS abaixo). Mobile sem crop dos nós; capturas; portões OK.

### O que foi feito
A arte `principaissolucoes` passou a peça principal de `#labs-principais`: largura generosa, palco navy, pluma no azul-claro, sombra difusa ciano/navy, cantos suaves — sem moldura retangular dura. Grade `ACCELERATORS` abaixo.

Medido: 1440 arte 1116 × 628 px; 390 366 × 206 px; `object-fit: contain`, sem crop/overflow; seis nós visíveis.

PNG matriz preservado. Página usa `public/images/sistran-labs/principais-solucoes.webp`: 2.227.691 → 264.998 bytes (−88,1%). `alt` curto da topologia; nomes nos cards.

Capturas: `docs/capturas/sis-229/` em 1440 e 390.

**Portões:** lint 22 warnings; tsc OK; build OK; test:copy OK; git diff --check do escopo OK (whitespace preexistente em `scripts/gerar-divisas-brasil.mjs:337` fora do escopo).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-228 — /parceiros-e-implementacoes · sombra atrás do título e da descrição na abertura

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-228/parceiros-e-implementacoes-sombra-atras-do-titulo-e-da-descricao-na

### Pedido
Na abertura de `/parceiros-e-implementacoes`, sombra atrás do bloco de escrita (eyebrow + título + dois parágrafos) para contraste sobre a capa, sem navy chapado. Medir WCAG 390–1920. Escopo só `--parceiros`. Copy intacta.

### O que foi feito
Baseline com véu anulado (pior pixel, `scripts/medir-contraste-abertura-parceiros-sis225.mjs`): descrição reprovava em todas as larguras; a 390 reprovava tudo. Pior pixel 1440 `rgb(17,182,233)`; 390 `rgb(219,244,254)`.

**O que entrou:** `radial-gradient` no véu full-bleed, centro 20% × 58% a partir de 1024, + eixo vertical leve. Elipse (não linear) para não criar aresta tipo SIS-224. Sem `filter: blur()` em `.pagehero-entrada` (`overflow: hidden` recortaria). Abaixo de 1024: centro 42% × 46%, semi-eixos 140%/86%. Véu comentado da SIS-225 permanece comentado.

**Contraste depois:** 390 eyebrow 6,11 / título 7,28 / destaque 5,72 / p1 6,16 / p2 8,81; 1024 p1 **5,06** (margem mais apertada vs 4,5); 1440 todos ≥ 6,14. Todos OK nas cinco larguras.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1178); test:extrator 41.

Capturas: `docs/capturas/sis228-{antes,depois}-{390,1440,1920}.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/capturar-abertura-parceiros-sis228.mjs`

---

## SIS-227 — /sistran-labs · capa SISTRAN-LABS no fundo do título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-227/sistran-labs-capa-sistran-labs-no-fundo-do-titulo

### Pedido
Abertura de `/sistran-labs` com `public/SISTRAN-LABS.png` como capa full-bleed atrás do título «Sistran Labs: Laboratório de Inovação», via `HeroImageBackdrop`. Manter h1 HTML; não colidir com texto da arte; WebP; véu `--labs` suave; emenda com `#labs-o-que-e`; `alt=""`; capturas 1440; portões OK.

### O que foi feito
Abertura usa `HeroImageBackdrop` com a arte SISTRAN Labs. Derivada `public/images/sistran-labs/labs-hero.webp`; PNG 1.778.802 B → WebP 125.624 B (−92,9%). Título HTML e copy intactos; «Technology First!» não duplicado no DOM. Recorte e véu posicionam título à esquerda e arte à direita. Contraste medido entre 7,20:1 e 10,33:1. Emenda com `#labs-o-que-e` por gradiente. Provas `docs/capturas/sis227-*.png` (1440 e 390). Portões: lint sem erros, tsc limpo, build OK, copy-lock 1177 textos inalterado.

Ajuste posterior: sombra leve na manchete. `.hero-backdrop--labs .pagehero-entrada h1` com `text-shadow` em duas camadas (`0 1px 2px` alfa 45%; `0 6px 26px` alfa 32%) — receita de `.hero-caption` com alfas menores. `text-shadow` e não `filter: drop-shadow` (`webkitBackgroundClip` é `border-box`). Medido em `docs/medidas/sis227-sombra/`. Título já tinha 7,2:1 a 10,3:1 antes da sombra.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-226 — Home · hero: escritas alternando durante o vídeo (3 slides + pitch final)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-226/home-hero-escritas-alternando-durante-o-video-3-slides-pitch-final

### Pedido
No hero da home, a coluna de escrita alterna em sequência alinhada ao vídeo: 3 slides de `HERO_SLIDES` + pitch final (`HeroPitch` / `mosaicIntroHome`) que permanece. Reveal da 1ª escrita na entrada; sync por progresso/scroll, não timer infinito; um só h1; reduce legível; copy verbatim; capturas; portões OK.

### O que foi feito
**1. Ciclo por rolagem.** `HeroCaptions` de volta; `JANELAS = [[0.01,0.08,0.15,0.2],[0.24,0.31,0.36,0.41],[0.44,0.5,0.54,0.58]]` em `HeroCaptions.tsx:78-82`. Sonda `scripts/medir-sequencia-hero-sis226.mjs`: em patamares 1 legível / 3 apagadas (1440 e 390).

**2. Reveal da 1ª escrita.** `animate` 1,1 s, easeOut, delay 0,12. 1440: 0 ms 0/0 · 250 ms 0,464/0,234 · 600 ms 1,000/0,800 · 1600 ms 1/1. Reduce: quatro escritas empilhadas em fluxo (`display: block !important` nos dois interruptores); 4 legíveis / 0 apagadas em 8 posições.

**3. Bloco 4.** `HeroPitch` entra em `[0.575, 0.65]`; sem rampa de saída. Medido opacity 1,000 em 0,70 / 0,85 / 0,99.

**4. Um h1.** `["Entrega com Alta Performance e Comprometimento"]`; legendas em `<p className="hero-caption-title">`.

**5. CTAs omitidos** (justificativa em `HeroCaptions.tsx:41`); copy de `hero.ts` intacta.

**6–7.** Classes `.hero-caption*` reusadas; nota SIS-226 em `.claude/conteudo-site/00-home.md:97` e `:144-146`. copy-lock OK (1178, nada mudou).

**Contraste:** 30 alvos aprovados (`scripts/medir-contraste-legendas-sis226.mjs`). 390: razões 7,18–13,82; 1024 6,36–14,46; 1440 6,14–14,45. `#tintaTeimosa: 0`.

**Defeitos corrigidos.** (a) `useTransform` em array fazia o pitch decair (`opacity: 0` no fim) — ViewTimeline vs sticky; corrigido com `useScrollOpacity` (`src/lib/motion.ts:199`). (b) Título cortado <1024: `clamp(4.5rem)` 72 px vs caixa 265 px; `globals.css:2472-2475` `clamp(1.9rem, 8.6vw, 4.6rem)` até 1023,98 px. (c) Regime C a 390 reprovava (~1,00–2,86:1); tarja `rgb(3 17 38 / 70%)` em `:3019-3026` (70% e não 64% por causa do sobretítulo 11,2 px). (d) Sonda sincroniza `currentTime` e patamar; `CENTROS` `[0.125, 0.345, 0.53]`.

**Portões:** tsc sem erros; lint 22/0; test:copy OK; build OK. Capturas `docs/capturas/sis226-hero/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `HeroCaptions.tsx`, `HeroCinematic.tsx`, `HeroPitch.tsx`, `src/lib/motion.ts`, `globals.css`, `00-home.md` e os scripts de medida.)

---

## SIS-225 — /parceiros-e-implementacoes · capa fundocapaparceiros no fundo do título e descrição

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-225/parceiros-e-implementacoes-capa-fundocapaparceiros-no-fundo-do-titulo

### Pedido
Abertura com `public/fundocapaparceiros.png` full-bleed via `HeroImageBackdrop`. Copy intacta; WebP; véu só `--parceiros`; texto esquerda / arte direita; emenda com `#parceiros`; `alt=""`; contraste medido; capturas 1440; portões OK.

### O que foi feito
**Entrega inicial (seis tarefas).** (1) `PageHero` em `HeroImageBackdrop` — `page.tsx:57-78`. (2) `scripts/otimizar-capa-parceiros-sis225.mjs` gera `public/images/parceiros/parceiros-hero.webp`: 1672×941, 1681 kB → 123 kB (−93%), `quality: 78`, `smartSubsample`. (3) Véu `.hero-backdrop--parceiros .hero-backdrop-veu` com eixo horizontal 100deg (luminância terços 0,025 / 0,041 / 0,082). (4) Sem prop `foco`; `object-position` 62% 50% no mobile; teto do h1 a 46 vw (título x 162–662,4 = 46,0% da janela a 1440). (5) Emenda `#parceiros` idêntica ao gradiente `section-light-blue`. (6) `alt=""`.

Contraste inicial (20/20): 390 destaque 4,83:1 (piso 3); demais ≥ 5,12. Portões na 1ª entrega: lint 0 erros 0 avisos (depois corrigido para 22 avisos preexistentes); tsc limpo; build OK.

**Pedido posterior: «retire as tarjas e deixe só a imagem».** Véu `background: none`; `::before` `content: none`; variante mobile comentada. **11 das 20 medições reprovam AA** (1,0:1 em vários trechos). Causa: fios de luz da arte (pior pixel 1440 `rgb(17,182,233)`) e, a 390, escrita sobre o globo.

Feedback seguinte abriu **SIS-228** (sombra atrás do texto).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `src/app/parceiros-e-implementacoes/page.tsx`, `src/app/globals.css`, `scripts/otimizar-capa-parceiros-sis225.mjs`, `public/images/parceiros/parceiros-hero.webp`.)

---

## SIS-224 — /trabalhe-conosco · suavizar véu/sombra feia da abertura

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-224/trabalhe-conosco-suavizar-veusombra-feia-da-abertura

### Pedido
Na abertura de `/trabalhe-conosco` (`hero-backdrop--carreira`), suavizar o véu/sombra que lê como bloco azul de bordas duras. Manter contraste WCAG; não piorar emenda com Social; só CSS `--carreira`; capturas; lint OK.

### O que foi feito
Duas causas: (1) véu 70% no meio + 22% chapado, só vertical; (2) orbs `blur(130px)` de `PageHero` recortados por `.pagehero-entrada { overflow: hidden }` — caixa medida a 1440 **x=162–736, y=240–575**.

Mudanças em `.hero-backdrop--carreira`: orbs `display: none`; véu eixo horizontal **96deg**; rampa vertical quatro paradas (meio 70% → **44%**, degrau 72%); chapado 22% → **12%**. Abaixo de 1024: meio 56% (com valores desktop a descrição a 390 dava **4,13:1**).

**Contraste** (`scripts/medir-contraste-abertura-carreira-sis224.mjs`, três instantes 0/2/5 s): eyebrow 7,46–12,76; h1 4,15–7,88; destaque 3,78–6,20; descrição 4,64–6,19; cartão h2 ≥ 6,14; parágrafo ≥ 4,99; nota ≥ 5,05. Todos OK. Emenda Social a 1440: pé `8,33,67` → `6,33,66`; Social `10,78,135` nas duas.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1177); test:extrator 41. Capturas `docs/capturas/sis224-{antes,depois}-{390,1440,1920}.png`. Scripts: `medir-contraste-abertura-carreira-sis224.mjs`, `capturar-abertura-carreira-sis224.mjs`.

Follow-up visual da abertura inteira: **SIS-258**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-contraste-abertura-carreira-sis224.mjs`
- `scripts/capturar-abertura-carreira-sis224.mjs`

---

## SIS-223 — /trabalhe-conosco · formulário em card no scroll (campos + envio tipo Contato)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-223/trabalhe-conosco-formulario-em-card-no-scroll-campos-envio-tipo

### Pedido
Ao rolar `/trabalhe-conosco`, card de formulário no espírito de Contato: Nome Completo*, E-mail*, Telefone* (placeholder `(11) 96123-4567`), envio de arquivo*, Enviar e estado de sucesso. Sem campo «Layout». Reveal no scroll; POST via server action; aviso de privacidade honesto (backend demo). Persistência real continua aberta. Portões OK.

### O que foi feito
Caminho: `DemoForm` evoluído (não fork de `ContactPanel`).

**Arquivos:** `CurriculoCard.tsx` (novo, `#curriculo` + GSAP); `curriculo-card.css`; `DemoForm.tsx` (`kind: 'row'`, dropzone); `demo-form.css`; `trabalhe-conosco/page.tsx`; `pageSections.ts` (item Currículo descomentado); `copy-lock.json`.

Campos: um Nome Completo; E-mail+Telefone na linha; dropzone com a frase do conteúdo-site; sem Layout. Telefone `required` (copy-lock); objeção SIS-117 registrada no docblock.

Reveal: GSAP + ScrollTrigger `start: 'top 82%'`, sem pin; clip-path do card, linha ciano, stagger 0,07. `gsap.context` + `ctx.revert()`. Reduce: timeline não criada. IntersectionObserver 600 ms se o gatilho falhar.

POST: `<form action={enviar}>` + `useActionState(enviarFormulario)`. Avisos: pé «demonstração… nada é armazenado»; sucesso «não foi encaminhado ao RH»; cartão LinkedIn deixou de dizer «Não coletamos…».

**Portões:** tsc limpo; lint 22/0; build `/trabalhe-conosco` ○ Static; test:copy OK — 1192 textos (lock 1652).

Ressalvas: lock absorveu texto Celent não commitado; `#curriculo` migrou do LinkedIn para o form (`#como-chegar` no cartão); mobile/teclado por construção, sem sonda de contraste; bloqueio de produto aberto.

Comentário seguinte: bloqueio virou **SIS-246**. Follow-up de layout da abertura: **SIS-258**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/CurriculoCard.tsx`
- `src/components/curriculo-card.css`
- `src/components/forms/DemoForm.tsx`
- `src/components/forms/demo-form.css`
- `src/app/trabalhe-conosco/page.tsx`
- `src/data/pageSections.ts`
- `copy-lock.json`

---

## SIS-222 — /contato · loading até a página (e o mapa) estarem prontos a cada entrada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-222/contato-loading-ate-a-pagina-e-o-mapa-estarem-prontos-a-cada-entrada

### Pedido
Em `/contato`, overlay/gate a cada entrada (soft e hard) até o essencial — incluindo o mapa — estar pronto. Timeout 8–12 s; reduce sem animação ruidosa; a11y `aria-busy`; não aplicar a outras rotas. Capturas/vídeo; portões OK.

### O que foi feito
Gate exclusivo da rota, HTML inicial navy/ciano. Toda entrada começa `aria-busy` + `inert`, scroll bloqueado, status «Carregando…». Liberação após hero e mapa prontos, ou timeout **10 s**. Fade 240 ms; reduce imediato.

Arquitetura: `ContactLoadGate` provider client envolvendo children server; pré-carga de `/images/contato/contato-hero.webp`; contexto força `UnitsMap` a montar abaixo da dobra (evita deadlock com IntersectionObserver); overlay sai do DOM após reveal.

Sinais: Google `idle` one-shot; MapLibre `load` + `idle`; mosaico OSM ≥ 24 tiles resolvidos e 12 carregados.

Sonda `docs/medidas/sis222/`: hard load, soft nav, saída/retorno, timeout, reduce, isolamento — **nenhuma falha**. Caminho normal sem timeout. Bloqueado: overlay saiu em 11.040 ms. Outras rotas: zero overlays. Capturas `hard-inicio-1440.png`, `hard-mapa-pronto-1440.png`.

**Portões:** lint 22 avisos; tsc OK; build OK; copy-lock 1183; diff-check OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-221 — /quem-somos · Escritórios BRASIL: marcador do 2º andar SP muito alto na torre

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-221/quem-somos-escritorios-brasil-marcador-do-2o-andar-sp-muito-alto-na

### Pedido
Em `OfficesScene`, o balão «2º andar · escritório São Paulo» e o ponto na fachada estão ~meio do prédio (`top: 30%`). Descer para o 2º andar real da ilustração, ancorado em %. Não alterar copy. Capturas; lint OK.

### O que foi feito
CSS-only em `.os-torre .os-torre-balao` (~6448) e `::before`/`::after`. Régua em `torre-sp-1200.webp` (`scripts/regua-torre-sis221.mjs`): 2º andar centro em **76%**.

`top: 30%` → `top: 55%`. Ponto: 1440 **44,8% → 76,0%**; 390 **44,9% → 76,1%** (`docs/medidas/torre-sis221.json`). Ângulo do fio 30° → **70°** (a 30° pousava a 67% da largura, na copa; agora 59,7%/60,0% sobre o vidro). Comprimento 3,1 rem inalterado.

Modos: 1440 `scroll`, 390 `lista`; overrides não reescrevem `top`. Rótulo intacto. Feixe `.os-feixe` não tocado.

**Portões:** lint 22/0. test:copy falha na árvore por «Sistran University» em `HeroCinematic.tsx` (alheio); lock não reescrito.

Capturas `docs/capturas/sis221-*-torre.png`. Sondas: `regua-torre-sis221.mjs`, `medir-torre-sis221.mjs`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/regua-torre-sis221.mjs`
- `scripts/medir-torre-sis221.mjs`

---

## SIS-220 — /parceiros-e-implementacoes · Linha do tempo: viajante = logo Luminna de /transformacao-legado

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-220/parceiros-e-implementacoes-linha-do-tempo-viajante-logo-luminna-de

### Pedido
O `.roadmap-traveler` deve exibir a mesma logo de `/transformacao-legado` (`/imagens/luminna-latam.png`). Remover `traveler={null}`. Copy Luminna nos cards continua proibida. Paridade visual; mobile oculto como no legado; portões OK.

### O que foi feito
`traveler={null}` removido em `parceiros-e-implementacoes/page.tsx` (default do `RoadmapTrail` já é o PNG). Comentário SIS-202 reescrito: arte volta; proibição de copy permanece. JSDoc atualizado. `.roadmap-traveler` não tocado.

**Paridade 1440:** `<img>` sim nas duas rotas; src `/imagens/luminna-latam.png`; natural 889×760; caixa 70×60; círculo 94×94; borda `rgb(14 216 246)`; glow `drop-shadow(rgba(14,216,246,.55) 0 0 26px)`.

Copy dos cards inalterada. Mobile 390: `display: none`, caixa 0×0, `scrollWidth=390`; fronteira 1023 none / 1030 grid.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1183, nada mudou); build OK.

Capturas `docs/capturas/sis220-depois-*-1440.png` e `*-390.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- JSDoc de `RoadmapTrail` (componente citado, sem path no relatório)

---

## SIS-219 — /parceiros-e-implementacoes · logos dos cards bem maiores e mais destacadas

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-219/parceiros-e-implementacoes-logos-dos-cards-bem-maiores-e-mais

### Pedido
Em `PartnerTerminalCards`, placas bem maiores (~1,5×–2× altura). Recalibrar eco de hover; contraste navy/branco; mobile sem estourar ~34 rem; reduce estático. Capturas idle+hover; portões OK. Medir preferencialmente após/junto da SIS-218.

### O que foi feito
Oito valores em `partner-terminal-cards.css` + `sizes` da img em `PartnerTerminalCards.tsx`. Copy intocada. Card altura idêntica (642 px a 1440, 546 px a 390).

Idle: `min-height` 4,25 → **7,5 rem**; `min-width` 7,5 → **12 rem**; img `max-height` 3,25 → **6 rem**, `max-width` 13 → **20 rem**. `sizes` 200 px → **320 px**. ITG 164,2×52 → **303,2×96** (1,85×); ST IT 185,7×52 → **320×89,6** (1,72×).

Contraste (`medir-logos-parceiros-sis201.mjs`): tabela byte-idêntica. Pior chip branco Microsoft Azure 3,41:1; navy addactis 5,98:1.

Eco: `eco-img max-height` 6 → **9 rem**; escala hover 1,45 → **1,34**; largura `min(28rem, 62%)`. Folga eco→texto min 69 px a 1440, 58 px a 390. Folga placa→texto 184 → 128 px (1440), 96 → 68 px (390).

Mobile: placa 3,5 → **5,25 rem**; img 2,25 → **3,5 rem**; `min-height: 34 rem` intocado.

Capturas `docs/capturas/sis219-placas/` (16 arquivos). Script `capturar-placas-sis219.mjs`.

**Portões:** tsc limpo; lint 0 erros 22 avisos; build 5,2 s.

Nota: SIS-218 ainda estava em Todo na entrega; números no enquadramento carrossel.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/partner-terminal-cards.css`
- `src/components/PartnerTerminalCards.tsx`

---

## SIS-218 — /parceiros-e-implementacoes · Parceiros: seção fixa + avanço lateral com o scroll da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-218/parceiros-e-implementacoes-parceiros-secao-fixa-avanco-lateral-com-o

### Pedido
Em `#parceiros` / `PartnerTerminalCards`, pin no desktop e scroll vertical empurra a trilha na horizontal. Filtros e setas permanecem. Mobile/reduce sem pin. Copy intacta. Capturas 1440; portões OK.

### O que foi feito
Desktop ≥1024: palco `position: sticky` (não GSAP `pin: true`, para não reparentar e ficar com Lenis). Altura da cena = `100svh + percurso horizontal`; percurso = `offsetLeft(último) - offsetLeft(primeiro)`; ResizeObserver; cleanup de observers/frames/CSS vars.

Medido 1440: início primeiro card 719,98 px (centro 720), transform 0; meio −7.554,17 px; final −15.108 px, último card 719,8 px; 400 px depois palco liberado. Filtro Cloud: 16→2 cards, percurso 15.108→1.008 px. Anúncio ativo debounce 350 ms.

Mobile / reduce / `data-motion=reduce`: sem pin, overflow horizontal nativo. Fronteira: estático 1023 / sticky 1024. Copy, overlay, fundos, RoadmapTrail e SIS-219 preservados.

Evidências: `docs/medidas/sis218/` (`falhas: []`); `docs/capturas/sis218/`.

**Portões:** lint 22 warnings; tsc OK; build OK; copy-lock 1178; diff-check do escopo OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-217 — /solucoes · logos dos aceleradores nos cards + reação no hover

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-217/solucoes-logos-dos-aceleradores-nos-cards-reacao-no-hover

### Pedido
Nos sete cards de Tecnologia Disruptiva, substituir ícones Lucide pelas logos de `public/images/logos` (de-para Match AI, Lumina AI, Fast, QA Integrado, Connect API, Smart Miner, Guru de Seguros). Hover com scale/eco/sombra ciano; reduce estático; `alt=""` se o h3 já nomeia; copy intacta.

### O que foi feito
Sete logos substituem Lucide; placa preserva proporção; hover/foco com escala, `translateY` leve e eco ciano; reduce estático; imagens `alt=""` + `aria-hidden`; nome no `<h3>`; copy e rotas internas intactas. Portões: lint sem erros, tsc limpo, copy-lock inalterado, build OK. Ressalva: outro processo editava os mesmos arquivos durante a execução.

Ajuste posterior: `<h3>` virou `sr-only` (esqueleto de cabeçalhos + logo decorativa, WCAG H67, copy-lock intacto). Placa 52→72 px, teto largura 14→18 rem, arte 28→44 px, teto 68%→76%. Medido a 1440 (`docs/medidas/sis217-logo-destaque/`): placa 72 px nos sete; folga mínima até ordinal 36 px (Match AI); hover `scale(1.06)`, placa `translateY(-2px)`, eco 0,55. Portões: tsc limpo, eslint sem erros, copy-lock 1177.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-216 — Esboço · admin de eventos (senha, sem sessão/seção pública)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-216/esboco-admin-de-eventos-senha-sem-sessaosecao-publica

### Pedido
Natureza original: esboço de admin de `/eventos-inovacao` com senha, sem sessão de usuário e sem seção pública. Opções A (HTTP Basic), B (cookie HMAC), C (host). Depois o time pediu implementar: acesso A, persistência v0 (JSON), zero link público, senha só em env.

### O que foi feito
**Primeira entrega — A + v0.** Decisões: implementar (não só esboço), acesso A, JSON versionado. Catálogo `src/data/events.ts` → `src/data/events.json` (15 eventos verbatim); `.ts` confere `kind`/`icon`. Proxy `src/proxy.ts` (Next 16.3: não `middleware.ts`): sem credencial 401 `WWW-Authenticate: Basic realm="Sistran · admin de eventos"`; senha errada 401; certa 200; sem env 503. Superfície `GET /admin/eventos` e `/admin/eventos/<id>` (`force-dynamic`). Sem link público: `Disallow: /admin` em robots, meta noindex, `x-robots-tag`. Senha `EVENTOS_ADMIN_PASSWORD` com `timingSafeEqual`. Defesa dupla: proxy + Server Action (POST sem credencial 401, arquivo intacto). Extrator do copy-lock passou a ler `.json` sob `src/data/` e ignora `src/app/admin/**`. Formulário controlado (React 19 resetava `defaultValue` após recusa). Limites: FS gravável; publicar = commit; sem upload nesta versão; `id` não editável.

**Portões (1ª):** lint 23/0; test:copy 1177; extrator 41; tsc limpo; build `/admin/*` ƒ, `/eventos-inovacao` ○.

**Ampliação.** (1) Login próprio A→B: cookie `src/lib/adminSessao.ts`, token `<expiraEm>.<HMAC-SHA256>`, 8 h, httpOnly, sameSite=lax, path=/admin; Basic antigo 307 para `/admin/entrar`. (2) Fundo claro opaco no `admin/layout.tsx`; diálogo de movimento suprimido em `/admin`. (3) Upload: cliente recorta 16:9 e gera dois webp (1672×941 e 240×135); servidor ≤2 MB e assinatura `RIFF….WEBP`; nome `id`+timestamp. Sonda: login fundo `rgb(244, 245, 247)`; upload 225 kB / 15,9 kB. Aberto: Vercel FS read-only.

**Portões (2ª):** tsc limpo; lint 22/0 (nenhum em `src/app/admin/**`); test:copy 1177; extrator 41; build OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/proxy.ts` (novo)
- `src/lib/adminGate.ts` (novo)
- `src/lib/eventosArquivo.ts` (novo)
- `src/data/events.json` (novo)
- `src/app/admin/layout.tsx` (novo)
- `src/app/admin/eventos/page.tsx` (novo)
- `src/app/admin/eventos/acoes.ts` (novo)
- `src/app/admin/eventos/[id]/page.tsx` (novo)
- `src/app/admin/eventos/[id]/FormularioEvento.tsx` (novo)
- `docs/admin-eventos.md` (novo)
- `src/data/events.ts`
- `scripts/copy-lock.mjs`
- `src/app/robots.ts`
- (ampliação:) `src/lib/adminSessao.ts`, `src/app/admin/eventos/arte.ts`

---

## SIS-215 — /eventos-inovacao — retirar ou clarear as bandas azuis escuras no início e fim do scroll

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-215/eventos-inovacao-retirar-ou-clarear-as-bandas-azuis-escuras-no-inicio

### Pedido
Em `EventsSpotlight`, retirar ou clarear as bandas navy no começo e fim do scroll (hero→cena e cena→Social). Alvo `#eaf2fb` / `#cfe7f7`; desktop e `.eventos-lista`; fio ciano pode ficar; contraste AA; capturas 1440 início+fim; portões OK.

### O que foi feito
Antes (`scripts/medir-bandas-eventos-sis215.mjs`): ponta×miolo 1440 **15,65:1**; 390 **15,89:1**; ~324 px navy no topo de 8.100 px; base a partir de f=0,80 (~1.300 px).

Degradês: paradas navy saíram; ficou `#eaf2fb 0% → #f6fafd 45% → #eef5fc → #cfe7f7 100%` (`.eventos-lista:75` e `.eventos-destaque:99`). Depois ponta×miolo 1440 topo 1,63 / base 1,21; 390 1,03 / 1,16.

Emenda eventos→social: degrauRGB 0 (390) / 1 (1440). `<Social>` de `palco-de-cena-escura` para **`palco-emenda-de-claro-curta`** (`page.tsx:201`). Hero→cena: aresta navy/`#eaf2fb` de propósito (precedente parceiros). `.evento-veu-topo` é do EventsGrid (fora da rota).

Fio `.eventos-destaque-fio` intacto (`#0ed8f6`, 1,58:1 vs `#eaf2fb`).

Contraste: `#0b7fa8` reprovava (4,03 / **3,56** sobre `#cfe7f7`); trocado por **`#0a6788`** em :1137, :1233, :952. Piores 1440: sobretítulo 5,48; título 14,13; «/ 15» 5,08; texto cartão 11,57 (todos em f=0,97). 390: sobretítulo 5,62.

Capturas `docs/capturas/sis215-eventos/`. Sonda de scroll em 10 degraus (IntersectionObserver não via `scrollTo` instantâneo).

**Portões:** tsc 0; lint 22/0; copy-lock 1632; build OK, 30 rotas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `src/app/eventos-inovacao/page.tsx`
- `scripts/medir-bandas-eventos-sis215.mjs`
- `scripts/medir-contraste-cena-eventos-sis215.mjs`

---

## SIS-214 — Home · Sobre o Luminna AI entre Números e Desafios

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-214/home-sobre-o-luminna-ai-entre-numeros-e-desafios

### Pedido
Na home, entre Números (`Metrics`) e «Desafios no desenvolvimento de software», o capítulo «Sobre o Luminna AI» + parágrafo verbatim de `legacy.ts`. Ordem: Números → Luminna → Desafios. Sem inventar etapas; sem pin; spy coerente; capturas 1440; portões OK.

### O que foi feito
Os dois títulos estavam na mesma `.sequence-copy` com Desafios acima. Inversão em `ImpactSequence.tsx:222-246`: h2 «Sobre o Luminna AI» → `lp-lead` → eyebrow «Desafios…». `--reveal-i` 0/1/2. CSS: `.sequence-copy .lp-lead + .lp-eyebrow { margin: 1.6rem 0 0 }`.

Sonda `scripts/medir-sequencia-luminna-sis214.mjs`: `luminnaAntesDeDesafios: true` em 1440/390, f0.04/0.3/0.55, com e sem reduce. 1440 depois: h2 y=566 → lead 687 → chip 773. Verbatim `{title, text, kicker}: true`. `pageSections.ts` sem mudança (`impacto` nunca esteve no spy). Sem `pin: true`.

Emenda Números→sequência (`medir-emenda-numeros-sis214.mjs`): 1440 `#002248 → #032143`, degrau 5; 390 `#013060 → #041b3c`, degrau 36 — sem branco. Sombra de Números continua SIS-213.

**Portões:** tsc 0; lint 22/0; copy-lock 1634; build concluído. Capturas `docs/capturas/sis214-luminna/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/ImpactSequence.tsx`
- `src/components/legacy/legacy.css`
- `scripts/medir-sequencia-luminna-sis214.mjs`
- `scripts/medir-emenda-numeros-sis214.mjs`
