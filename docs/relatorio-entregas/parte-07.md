## SIS-169 — Quem somos · Escritórios BRASIL: a rolagem volta a dirigir — transição de Pato Branco para São Paulo entre as duas referências

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-169/quem-somos-escritorios-brasil-a-rolagem-volta-a-dirigir-transicao-de

### Pedido
Na seção Escritórios BRASIL de `/quem-somos`, os dois estados deixam de ser só destinos de aba e passam a ser percurso de rolagem: a cena entra como `mapaescritorio.png` (Pato Branco) e, ao rolar, transiciona até `mapasescritorio1.png` (São Paulo, render da torre no lugar do 3D). É só a transição; depende da SIS-161 (estado PB) e da SIS-163 (estado SP). Reverte a decisão da SIS-161 de que a aba é dona do estado e a rolagem não opina. Critérios: trânsito reversível; um escritor de `ativa`; `position: sticky` sem `pin: true`; trilha e sticky na mesma caixa; grade/`width`/`left` não animados; contraste em cinco frações incluindo `BRASIL`; comprimento do percurso com conta por trecho; as duas cidades alcançáveis com movimento reduzido e abaixo de 1024; `npm run build` e `npm run lint` limpos.

### O que foi feito
**Percurso e conta (item 11).** `PERCURSO_SVH = 300`, em três trechos: pouso em Pato Branco 0 → 0,25; trânsito esfregado 0,25 → 0,75; pouso em São Paulo 0,75 → 1. Constantes derivadas em `OfficesScene.tsx` (`TRANSITO_INICIO`, `TRANSITO_FIM`, `TROCA = 0,5`, `POUSO = 0,125 / 0,875`).

**Dono do estado (item 3):** opção (a) — a rolagem, sozinha. `ativa` tem um escritor: o `onUpdate` do gatilho. A aba voltou a ser atalho (o clique leva a janela até a fração da cidade). Quem clica é transportado de novo; o cartão não troca no lugar.

**Sticky (item 4).** Sem `pin: true`. `.os-inner` cola em `top: 0` dentro de `.os-trilha`; o `end` do gatilho é `trilha.offsetHeight - inner.offsetHeight`. A folga do cabeçalho virou padding do palco para `top` poder ser zero (armadilha da SIS-156).

**Dois eixos de tempo (item 5).** Entrada continua `once` (montagem do mapa). Trânsito é esfregado e reversível. `data-ativa` e `data-revelado` não colapsaram: `revelado` vem da entrada e `ativa` do trânsito.

**Grade não animada (item 2).** Nada de `grid-template-columns`, `width` ou `left`. Medido no build de produção, 90 passos: mediana 71,1 ms no percurso vs 66,0 ms no controle; `LayoutDuration` 0,24 ms no total contra 7,67 ms de recálculo de estilo.

**Contraste em cinco frações (itens 8 e 9), 1440×900, pior pixel:** `BRASIL` 3,99:1 (piso 3,0); olho 6,66:1; aba acesa 4,59:1; aba apagada 10,40:1; nome da cidade 14,19:1; texto da ficha 12,51:1; balão 15,19:1. Máscara `44%/62%` do `.os-fundo` continua servindo. Gradiente de `BRASIL` com stop roxo `#7c3aed` anotado como fora de escopo.

**Torre (item 10).** WebP em duas larguras da SIS-163. Fica no DOM e some por `opacity` (nunca `display`); `inert`/`aria-hidden` para leitor de tela.

**Defeitos medidos e corrigidos.** (1) Cartão passava 80px além da borda interna a 1800: sistemas de coordenadas misturados (`offsetLeft` vs caixa errada). Corrigido com `getBoundingClientRect().right` de `.os-baixo`. Depois: 1024 → 489,61px, 1366 → 797,40px, 1440 → 864px, 1800 → 1208px. (2) Percurso escondia o mapa: recuo da câmera insuficiente e medida em `.bm-mapa` em vez de `.bm-pais`. Com `-34%`, faixa livre vs país desenhado anotados em 1280/1366/1440/1800. `--os-foco-escala` de SP de 1,22 para 1. Coluna de leitura cortada pelo `overflow: clip` corrigida (`min-height: 760px`, fotos em `svh`, três fotos em uma fileira no modo scroll). Balão em 3,20:1 no meio do trânsito: entrada confinada à cauda `clamp(0, (transito − 0,7) / 0,3, 1)`.

**Piso de largura do percurso:** 1024 → 1280px + `min-height: 760px`. De 1024 a 1279, janela baixa e `prefers-reduced-motion`: modo lista completo. Espelhos `@media` e `html[data-motion="reduce"]`.

**Item 7 — inversão do país não feita:** `DIVISAS_BRASIL` são 65 polilinhas abertas; sem caminhos fechados de SP/PR no `viewBox="0 0 720 640"`. País recua enquanto o cartão de SP chega.

**Composição: duas faixas, não três.** Faixa livre (`cartão.left − fachada.right`): 328 · 328 · 406 · 472 · 816 · 1576px nas seis larguras. `mapasescritorio1.png` não seguida ao pé da letra: mapa não é terceira coluna de grade; arte diz 8º andar, dado confirmado é 2º.

**Feixe pino→torre (segunda volta, após devolução).** Quando SP pousa, o pino cai entre fachada e cartão. Folga `cartão.left − pino.centro`: 90 / 81 / 120 / 180 / 343 / 723px. Primeira versão acendia numa rampa 0,92→1 e media na entrada: feixe 12,9px adiante do núcleo (`--os-desliza = transito * -34%` ainda movia o pino). Correção: limiar `transito = 1` (saída 0,995, histerese), atributo `data-pousado="sp"`, `opacity` 0,35s. `setTimeout` 1200ms remede; `onRefresh` zera (`feixeMedidoRef`). `.os-feixe` desligado por padrão, ligado só em `[data-modo="scroll"][data-pousado="sp"]`, desligado em janela estreita e `html[data-motion="reduce"]`. Sonda passo 0,02, 1400ms de assentamento: `erroNoPino = 0` e `cruzaCartao = false` em toda amostra.

**Portões (entrega + feixe):** `npx tsc --noEmit` limpo; `npm run lint` = `eslint .` → 24 avisos / 0 erros; `npm run test:copy` OK (1195 textos); `npm run build` Compiled successfully.

### Conferência
Primeira volta **DEVOLVIDA** pelo feixe pino→torre, que a SIS-163 transferiu e esta não mencionava; resto aprovado (percurso, dono do estado, sticky, eixos de tempo, grade, contraste, torre, modo lista). Pediu ratificar duas faixas na descrição da issue. Segunda volta **APROVADA**: feixe gateado certo, tabela aritmética fecha nas seis larguras, rampa trocada por `data-pousado` discreto; `feixeMedidoRef.current = false` no `onRefresh` e `clearTimeout` na limpeza. `conferir` → `conferido`. Pendência de produto: desvio das duas faixas ainda no `DECISOES-PENDENTES.md`. Verificação que não bloqueia: ponta esquerda do fio ancorada em `left: 100%` da caixa da torre, não medida contra a fachada pintada.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/app/globals.css`
- `src/app/quem-somos/page.tsx`

---

## SIS-168 — Contato · Onde Estamos: o mapa deixa de ser cartão e passa a ser o fundo da seção, com título e painel por cima

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-168/contato-onde-estamos-o-mapa-deixa-de-ser-cartao-e-passa-a-ser-o-fundo

### Pedido
Na seção `#sistran` / Onde Estamos de `/contato`, o mapa deixa de ser cartão escuro arredondado dentro de `container-lp` e passa a ser a superfície da seção: sangra de borda a borda; pílula, título, três seletores e endereço ficam por cima, à esquerda, com navy dissolvendo para a direita. Reverte duas decisões da SIS-129 (não sangrar; pílula e título fora do cartão) — os comentários têm de ser reescritos. Critérios: emenda com `#timeSISTRAN` decidida; destino de `section-light`; rampa do véu refeita; máscara vertical em rem; contraste medido com branco forçado e painel oculto; `min-height` justificado; mosaico `COLUNAS`/`LINHAS` recalculados; atribuição visível; zoom e `cooperativeGestures` intactos; estreito decidido; `npm run build` e `npm run lint` limpos.

### O que foi feito
Números de linha da issue vencidos: bloco citado como `globals.css:6474-6755` estava em **6843-7124**. Trabalho por seletor.

**Saiu (comentado no lugar):** `section-light section-light-blue`, `section-py`, `container-lp`, `border-radius: 1.5rem` + `border: 1px solid rgb(255 255 255 / 12%)`, `max-width: 42%` do `.mapa-painel` (a 2560 pedia 1090px e 42% davam 1075px), `on-dark` + `mt-10`, `palco-emenda-de-claro-curta` (quem toca `#timeSISTRAN` agora é navy). `overflow: hidden` ficou para os 3072×1536px de tiles não empurrarem scroll; `scrollWidth === innerWidth` nas sete larguras.

**Eixo `--mapa-eixo`:** `max(2rem, calc((100% - 73.75rem) / 2 + 2rem))` — 1180px = 73,75rem, `lg:px-8` = 2rem, piso 32px. Cabeçalho em x=402 a 1920 e x=722 a 2560.

**Rampa horizontal:** de `%` para rem. Opaco até `eixo + 24rem`, dissolvendo em 7rem (112px da SIS-135). Quatro paradas preservadas.

**Máscara vertical:** banda 30rem → **38rem** (`50%±19rem` opaca + 4rem de rampa). Painel cresceu com pílula e título.

**Contraste** (branco forçado, painel não pintado, `nav.fixed` escondido — senão 1,00:1 no texto do nav): pior pixel sob o painel **17,11:1** (390/768) e **17,46:1** (1024–2560). Banda opaca real y=88 a y=696 (609px vs 608px de projeto). Atribuição OSM **8,68 a 9,73:1**. Pino a 1024 na cauda (~18% de véu, 208/255); custo real **5/255** — rampa não encurtada.

**Estreito:** paradas em rem preservadoras a 390 (26% = 173px, 38% = 253px ≈ 16rem do `padding-top`).

**Mosaico:** 8×6 → **12×6**. `(12/2−1)×256 = 1280` cobre janela até 2560px; `(6/2−1)×256 = 512` cobre 784px. **72 tiles por unidade** (era 48). `min-height: 34rem` estreito / **49rem** em `@media (min-width: 64rem)`. Zoom `top-right` e `cooperativeGestures` / `gestureHandling: 'cooperative'` intactos. `.mapa-cartao-mapa` sem `z-index`.

**Captura do degrau 3 (após devolução).** Folgas positivas nas quatro bordas: 390 (quadro 390×782,8, mosaico 3072×1536); 1440 (1440×784); 2560 (2560×784, dir **+71,1px**). 72/72 tiles carregadas. Receita: regex `/openfreemap/` (glob `**/openfreemap**` não casa `tiles.openfreemap.org`); rolagem via `window.__lenis.scrollTo`, não `scrollIntoView`. Limite 2560 dito, não coberto. Densidade de POI estilo Google não entrou (item herdado da SIS-162). Altura em rem/`svh`, não `100vh`.

**Portões:** `npm run lint` 24/0; `npx tsc --noEmit` silencioso; `npm run build` 14 rotas estáticas + `/solucoes/[slug]` SSG; `npm run test:copy` OK (1195).

### Conferência
Devolvida por **um** ponto: mosaico não capturado com vetorial abortado. Restante conferido no código (sangramento, fronteiras, emenda `#timeSISTRAN`, `on-dark`, rampa, banda, 12×6, atribuição, zoom, gestos, comentários). Conferente mediu o item 12: **APROVADA**; `conferido` aplicado. Correção posterior da receita de sonda (glob vs regex; Lenis) registrada na própria issue e na SIS-169.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/components/UnitsMap.tsx`
- `src/app/globals.css`

---

## SIS-167 — Eventos: espalhar as miniaturas com flutuação (como /transformacao-legado) e aumentar a arte do cartão

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-167/eventos-espalhar-as-miniaturas-com-flutuacao-como-transformacao-legado

### Pedido
Três ajustes na cena de destaque de `/eventos-inovacao` (SIS-166): espalhar as miniaturas (hoje duas colunas coladas com `gap: 0.4rem`); fazê-las flutuar no modelo de `/transformacao-legado` (`.mosaic-float`, um `@keyframes` de três paradas); aumentar a arte do cartão central. Critérios: divisão do palco escrita antes do CSS; um keyframes; duas profundidades; sonda `scripts/medir-cena-eventos.mjs` de novo incluindo amplitude de `--float-x`; nada cortado por `overflow: clip`; fio e vaga em destaque definidos; rótulo sem transbordo; palco `100svh`; `prefers-reduced-motion` para flutuação; Performance; lista abaixo de 1024; lint/build. Divergência declarada depois: `top` revertido para `space-between`.

### O que foi feito
**Divisão do palco (item 1), medida em 1440×900 antes do CSS.** Coluna antiga 122→217; cartão 38vw = 547px em 446→993; **229px de vazio morto de cada lado**. Miniaturas espalham em faixa `clamp(7rem, 10vw, 12rem)` (era `clamp(5.5rem, 6.6vw, 8rem)`), vaga `clamp(4.5rem, 6vw, 7rem)`. Arte: `min(38vw, 36rem)` → `min(42vw, 38rem)`: cartão 547→605px, arte ~292→~347px (+19% linear, +42% de área). Depois, em 1440: faixa 122→266, cartão 417→1022, folga 151px; em 1024: folga 65px.

**Fio (item 5).** Nunca encostou no cartão: toco `clamp(2rem, 5vw, 5.5rem)` com nó, `left: 100%`. Fica como está.

**Vaga em destaque (item 6).** Não flutua; as catorze flutuam.

**Colisão (item 3).** Amplitude própria menor que o mosaico: `--evt-float-x: 9px`, `--evt-float-rot: 2deg`, `--evt-float-y` zerado depois (folga vertical ~1,6px em 1366). Recuo mínimo do `nth-child` **4%**.

**Profundidade (divergência declarada).** Sem `useScroll`/`slow`/`fast` da origem (um só IntersectionObserver; palco sticky em `overflow: clip`). Duas camadas `--evt-camada--perto` / `--evt-camada--longe` (0,86 / 1,06; 9,5s / 7s; 6px / 9px de X).

**Sonda 21/21 verdes** em 1670×940, 1440×900, 1366×768, 1280×800, 1024×768, mais 390 e reduced-motion. Contraste pior pixel: título 16,39:1, descrição 11,60:1, placa 11,57:1.

**Três defeitos achados pela sonda.** (1) `top: %` cobria vagas em 1366; quinze `top` comentados; vertical por `space-between`. (2) Altura do destaque ≠ botão com `flex: 1 1 0`; agora `flex: 0 0 var(--evt-vaga-h)`; placa do destaque em uma linha. (3) Item 10: Next 16 apaga `display: -webkit-box` quando `line-clamp` padrão está presente; teto `max-height` em linhas inteiras + `flex-shrink: 0` na placa.

**Performance (item 8), 1440×900, 4s:** com flutuação médio ~22–24 ms; sem ~21 ms; p95 33,4 ms nos dois. Custo ~2 ms/quadro; Chromium headless sem GPU.

**Um `@keyframes eventos-flutua`**, três paradas, paradas 2 e 3 por `calc()`. Espelho `html[data-motion="reduce"]`. Palco `100svh`. Comentário de `EventsSpotlight.tsx` reescrito (item 4).

**Portões:** `npx tsc --noEmit` limpo; `npx eslint src` 18/0 (relato); conferente: `npm run lint` **25 avisos / 0 erros**; `npx next build` exit 0.

### Conferência
**APROVADO.** Portões e sonda 21/21 reproduzidos. Correção factual: com `space-between` as faixas **não** distribuem no mesmo passo (8 vagas vs 7). Desvio de `top` tinha de aparecer na issue (entrou na nota de divergência). Follow-up: `padding-block` assimétrico na faixa direita. `conferido` aplicado.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-166 — /eventos-inovacao — cena única de destaque: cartão central que troca com a rolagem + duas colunas de miniaturas (substitui mosaico e palco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-166/eventos-inovacao-cena-unica-de-destaque-cartao-central-que-troca-com-a

### Pedido
Cena nova (não ajuste do `EventsMosaic`): sobretítulo EVENTOS, título Eventos & Inovação, cartão central (chip, title, description verbatim de `events.ts`, botão YouTube, arte), duas colunas de miniaturas, vaga do destaque vazia, fios ciano, contador `01 / 15`, rolagem troca o destaque. Quinze eventos, sem logos de patrocinador, botão para o canal. Substitui `<EventsMosaic />` e `<EventsGrid />` (comentados). Sem `aria-hidden` no conteúdo; mobile com lista; clique nas miniaturas para reduced-motion. Sem filtro nesta issue. Contraste pelo método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`. Miniaturas usam `thumb`, não `image`.

### O que foi feito
Arquivos novos `EventsSpotlight.tsx` e `events-spotlight.css`; troca dos dois blocos em `eventos-inovacao/page.tsx`. Componentes antigos, CSS no `globals.css` e `events.ts` intactos. SIS-160 citada no comentário de saída, não reaberta.

**Mecânica.** Quinze sentinelas; `IntersectionObserver` com `rootMargin: -50% 0 -50%`, `threshold: 0`. Palco `position: sticky`, sem `pin: true`. Trilha `margin-top: -100svh` + `padding-bottom: 60svh`: sticky e trilha são a mesma caixa. Altura = soma das sentinelas (`EVENTS.length`).

**Sonda** `scripts/medir-cena-eventos.mjs`. **1440×900:** seção 8100px; 15º em y=7275 com `palcoTopo: 0`. Contraste: título 16,39:1, descrição 11,60:1, rótulo 10,67:1. **1366×768:** seção 6912px; 15º em y=6205. **390:** cena `display: none`, lista com quinze itens.

**Folga ScrollSpy.** Primeira versão `clamp(5.5rem, 7vw, 9rem)` = x=100 vs caixa do ScrollSpy em x=103 (3px dentro). Subiu para `clamp(7.5rem, 8.5vw, 10rem)` = 120px, ~17px de folga.

**Acessibilidade.** Nada `aria-hidden` além das sentinelas vazias. Cartão `aria-live="polite"` + `aria-atomic`. Miniaturas `<button>`. Mobile: lista empilhada, `display: none` na versão escondida. Pulo com `window.scrollTo` (não `scrollIntoView`), `behavior: 'auto'` se reduced-motion. Botão YouTube: `YOUTUBE_URL` de `contact.ts`, constante única; `<a>` com `rel="noopener noreferrer"`.

**Layout.** Pares à esquerda (8), ímpares à direita (7), por índice do catálogo. Fio em CSS a partir da vaga. Superfície navy; `hero → eventos` por linha; `eventos → social` fecha em `#041d37`. Filtros saíram com o `EventsGrid`.

**Adendos de conferência aplicados:** comentários contraditórios de folga fundidos; `aria-current` deixou de ser prometido (vaga em destaque é `<div>`).

**Portões:** `npx tsc --noEmit` silencioso; eslint src 18/0; `npx next build` 0; rota 200.

### Conferência
**Aprovado**, com três adendos de comentário (folga 5,5rem falsa no CSS e no TSX; `aria-current` prometido e inexistente) — aplicados na mesma passada. SIS-131 (YouTube clicável) morre aqui. Custo de conteúdo: quinze botões para o mesmo canal. Label `conferir` retirada; segue In Review. Sem label `conferido` na issue.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `src/app/eventos-inovacao/page.tsx`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-163 — /quem-somos — trecho de São Paulo de "Escritórios BRASIL": trocar o explorador 3D pelo render da torre e seguir mapasescritorio1.png

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-163/quem-somos-trecho-de-sao-paulo-de-escritorios-brasil-trocar-o

### Pedido
Trecho de São Paulo igual a `mapasescritorio1.png`; explorador 3D WebGL sai, comentado, no lugar do render `substituiçãodo3d.png`. Composição: abas, torre com base/anel, balão do andar, mapa claro com SP aceso, legenda com `·`, feixe, cartão à direita. Critérios: `three` fora do bundle da rota; WebP duas larguras, nome ASCII fora de `imagensexemplo/`; rótulo 360° só se o arraste existir; andar confirmado; texto de `aSistran.ts`; SP aceso via divisas da SIS-161; feixe `aria-hidden`; alt na torre estática; build e lint.

### O que foi feito
**Asset.** `scripts/preparar-render-torre.mjs`: PNG com xadrez pintado (`channels: 3, hasAlpha: false`); alfa por flood fill da borda. Saída: `public/images/escritorios/torre-sp-720.webp` 720×725, 97 kB; `torre-sp-1200.webp` 1200×1209, 178 kB (conferente: 99.128 B e 182.238 B).

**Torre.** `TorreSaoPaulo()` em `OfficesScene.tsx`, no painel de SP, antes do `<h3>`. `<img>` com `srcSet`/`sizes` à mão, `loading="lazy"`, alt do prédio.

**Decisões:** render estático, sem `ARRASTE PARA GIRAR 360°`. Andar **2º** (referência 8º errada), comentado. Texto em `aSistran.ts` com “inovação” e “São Paulo”; `copy-lock.json` atualizado junto.

**`three`:** `grep WebGLRenderer .next/static/chunks` → 0 chunks. `BuildingExplorer`/`BuildingShowcase` intactos sem consumidor.

**Defeitos.** Balão vazio: `.section-light p` (0,1,1) vencia a classe; reescopado `.os-torre .os-torre-balao`. Cartão de PB inflou 354px: `align-self: start` nos dois `grid-area: 1/1`.

**Não entregues nesta issue.** Estado de SP aceso: polilinhas abertas. Feixe e cartão à direita transferidos para a SIS-169 (layout de 2 colunas atravessaria o texto).

**Portões:** tsc limpo; eslint src 18/0; next build 0; curl `/quem-somos` 200. Conferente: lint 24/0.

### Conferência
**APROVADA**, com feixe órfão cobrado na SIS-169 (depois entregue lá). Asset de SP aceso não reprova. `conferido` aplicado.

### Arquivos tocados
- `scripts/preparar-render-torre.mjs`
- `src/components/ui/OfficesScene.tsx`
- `src/app/globals.css`
- `src/data/aSistran.ts`
- `copy-lock.json`
- `src/app/quem-somos/page.tsx`
- `public/images/escritorios/torre-sp-720.webp`
- `public/images/escritorios/torre-sp-1200.webp`

---

## SIS-160 — /eventos-inovacao — trazer a estrutura de mosaico da apresentação de Transformação de Legado para as imagens dos eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-160/eventos-inovacao-trazer-a-estrutura-de-mosaico-da-apresentacao-de

### Pedido
Trazer o mosaico de Transformação de Legado (`StackScenes`, `.mosaic`) para os quinze eventos: três camadas (tile/float/face), parallax slow/fast, `perspective()` local, `overflow: clip`. Decidir se substitui o palco ou abre antes. Cartões usam `thumb` (240px), nunca `image`. Filtros sem rearranjo por `:nth-child`. Contraste AA. Palco e classes `.evento-*` comentados se saírem. Depois o usuário pediu título sticky “Eventos & Inovação”, fundo claro e legenda por cartão.

### O que foi feito
**Abertura, palco intacto.** `EventsMosaic.tsx` entre `HeroVideoBackdrop` e `<EventsGrid />`. CSS em bloco novo do `globals.css`. Nenhuma linha de `EventsGrid.tsx` mudou.

**Decisões:** (a) mosaico antes do palco; (b) filtros só no palco — posição por índice do catálogo, quinze pares `[x, y]`; (c) face 16:9 com `thumb`; (d) quinze cartões; (e) fundo inicialmente navy, depois revertido para claro com degradê navy nas pontas.

**Três camadas:** `.eventos-mosaico-tile` / `-flutua` / `-face`. `perspective(900px)` local. `overflow: clip`. `aria-hidden` no cartão. `thumb`: 164 KB vs 2508 KB de `image`. Medido 1024–1920: 15 cartões, 0 cortados nas bordas, palco sticky. `min-height: 108svh`. Mobile `display: none` abaixo de `lg`.

**Primeira conferência DEVOLVIDA:** flutuação de dois tempos/um eixo; sem tilt de repouso; sombra estática; hover sem pausa. Segunda entrega: `@keyframes mosaico-flutua` quatro tempos (0/30/62/84%) e cinco eixos; `RITMOS` com período 4,6s–7,5s; `--tilt-y` 7–11° / `--tilt-x` 3–5°; sombra no `::before` da flutuação `blur(30px)`; hover pausa + `translateZ(46px)`.

**Título sticky, fundo claro, legendas.** `h2` “Eventos & Inovação” (`aria-labelledby`). Fundo nasce navy, clareia, fecha `#041d37`. Legenda irmã da face, fora da inclinação. Geometria: colunas A 2/36/70 e B 18/52/84; teto de `y` 80%→76%; amplitude lateral 16→12px; `line-clamp` 3→4; altura fixa da placa removida. Colisões 0 nas quatro larguras (gapMin 14–83px). Reduced-motion: percurso de função, zero residual (`tituloPctFluxo: 0`).

**Contraste (piso 4,5:1).** Título 14,82:1 (placa branca opaca — sem ela 1,00:1). Legendas 10,78–11,50:1. `h2` ganhou placa porque sticky cruzava fotos.

**Portões:** tsc silencioso; eslint src 18/0; next build 0.

### Conferência
Devolvida (mecânica ≠ origem). Após ajustes + título/fundo/legenda: **APROVADO**. Atenção: quinze `blur(30px)` + `will-change` permanente; cinco cartões no corredor central (item da SIS-164). Sem label `conferido`.

### Arquivos tocados
- `src/components/EventsMosaic.tsx`
- `src/app/globals.css`
- `src/app/eventos-inovacao/page.tsx`

---

## SIS-159 — Parceiros — trocar a grade bento de 16 cards pela trilha horizontal pinada (código de referência)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-159/parceiros-trocar-a-grade-bento-de-16-cards-pela-trilha-horizontal

### Pedido
Em `/parceiros-e-implementacoes`, a seção Parceiros deixa a grade bento de 16 cards com filtros e passa a trilha horizontal presa: painéis deslizam no scroll, contador `01 / 16`, barra, foco no ativo (vizinhos `.42` / `scale(.88)`), detalhe dentro do painel. Código de referência veio no pedido; encaixa mal (altura 520vh, CSS Modules, `--font-mono` indefinida, pin GSAP vs sticky da casa, `short`/`tags` inexistentes). Critérios: altura derivada da contagem; botão real; fallback &lt;1024 e reduced-motion; sem `*.module.css`; filtros como atalhos (saída b).

### O que foi feito
Sem relatório de entrega no Linear. O `stateHistory` mostra passagem por In Progress (06/09/2026, depois devolução ao Todo em 07/09 e retomada) e permanência em In Review após as voltas de conferência; `completedAt` continua nulo. A apuração da execução e a segunda volta estão na **descrição** da issue, não em comentário `## Entrega`.

`PartnersTrack.tsx` + `partners-track.css`, montados em `parceiros-e-implementacoes/page.tsx`. Sem `pin: true`: seção alta + `sticky`. Altura `H = (N-1) × passo + 100` → **550svh** (4950px a 1440). Primeira cauda a olho (60svh) deixava o 16º painel 406px fora do centro (`--par-t` 0,943); derivado das sentinelas. Contador e barra com `scaleX(var(--par-t))`. Detalhe `absolute; inset: 0` (track 9756px aberto e fechado). Sem ScrollTrigger, sem motion/GSAP: CSS `transform` em custom property. Painel `clamp(21rem, 44vw, 36rem)` (não 62vw); gap `clamp(1.25rem, 2.5vw, 2.5rem)`. `MONO` com fallback. Filtros = atalhos `PARTNERS.findIndex` + `window.scrollTo`. Sem inventar `short`/`tags`. `PartnersGrid.tsx` intacto, import comentado.

**Acessibilidade na lista:** gatilho só com `naTrilha`; `line-clamp-4` só na trilha.

**Segunda volta (defeitos da conferência).** Espelho `html[data-motion='reduce'] .parceiros-trilha { display: none }` / lista `display: grid` — cenário B (botão da interface) ia de 2/16 para 16/16. `onFocus={() => irPara(i)}` no gatilho (foco em x=2939/5387). `aria-live` espera 350ms. Overlay do detalhe `tabIndex={0}` quando aberto.

**Portões:** tsc limpo; `npm run lint` 24/0; next build 0. Passo de amostragem 60px (300px dava falso 14/16). Aval de produto 08/09: trilha fica, 550svh aceitos.

### Conferência
**DEVOLVIDA** (interruptor da interface congelava no painel 01; Tab focava fora da janela). Reconferência **APROVADA** tecnicamente; aval do item 1 depois **concedido**. `conferido` aplicado.

### Arquivos tocados
- `src/components/PartnersTrack.tsx`
- `src/components/partners-track.css`
- `src/app/parceiros-e-implementacoes/page.tsx`

---

## SIS-158 — Parceiros — o card da Nuclea é o único sem logo; ligar o Nuclea-logo.png que já está no repositório

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-158/parceiros-o-card-da-nuclea-e-o-unico-sem-logo-ligar-o-nuclea-logopng

### Pedido
Card da Nuclea (Dados e integrações) é o único dos 16 sem logo. Arquivo já em `public/images/Nuclea-logo.png` (25,8 kB). Ligar `logo` e `logoAlt` em `partners.ts:148-156`. Sem entrada nova; textos intactos; filtro continua contando 2; placa branca; PNG não como retângulo na placa; `logoAlt: 'Nuclea'`; decisão do acento em `title` e `logoAlt` juntos ou em nenhum.

### O que foi feito
Dois campos na entrada existente: `logo: '/images/Nuclea-logo.png'`, `logoAlt: 'Nuclea'`. HTML: 16 cards, 16 placas, `category: 'dados'` = 2. PNG: 715×120, 74,7% transparente, 0% branco opaco, margem estreita. Render ~251×42 a 1440 (logo 5,96:1; largura da placa limita).

**Acento (segunda passada):** decisão **Núclea**. Quatro lugares: `title` e `logoAlt` em `partners.ts`; `copy-lock.json` chave `src/data/partners.ts:44` casada por valor; `.claude/conteudo-site/05-parceiros-e-implementacoes.md`. Arquivo `Nuclea-logo.png` não renomeado. `timeline.ts:30` já tinha acento, não tocada. Comentário de premissa falsa substituído.

**Portões:** tsc limpo; eslint src 18/0; rota 200; next build 0.

### Conferência
Primeira volta **APROVADO** (logo); adendo: site já escrevia Núclea na timeline. Após acento: **Conferido e aprovado** nos quatro lugares. Item visual “retângulo na placa” fica para olho no navegador. Sem label `conferido`.

### Arquivos tocados
- `src/data/partners.ts`
- `copy-lock.json`
- `.claude/conteudo-site/05-parceiros-e-implementacoes.md`

---

## SIS-157 — CTA "Fale com a Gente!" — o parágrafo do cartão mede 3,33:1 nas dez telas (piso é 4,5:1)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-157/cta-fale-com-a-gente-o-paragrafo-do-cartao-mede-3331-nas-dez-telas

### Pedido
Parágrafo do `ContactCTA` mede 3,33:1 no pior pixel (piso AA 4,5:1 para 16px). Culpado: terceira parada `rgba(14,216,246,0.5)`. Branco puro chega ~3,8:1 — o degradê tem de mudar. Bloco fecha várias rotas; paleta branco + azuis. Critérios: parágrafo ≥ 4,5:1 a 1440; h2 ≥ 3,0:1 e não piora; conferido nas telas que montam o bloco; números no comentário com o método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`.

### O que foi feito
Caminho 1: baixar o clareamento da terceira parada. Degradê: `rgba(0,62,118,0.95)` / `rgba(0,88,155,0.9)` / `rgba(14,160,220,0.35)`. Antigo comentado verbatim.

**Medido** (1440×900, header escondido, tinta `color: transparent`, pior pixel, mínimo de 6 quadros após 3,5s): sete rotas 3,30 → **4,80** (`rgb(7,102,171)`), h2 4,20 → 6,43; `/esg` 3,97 → **5,45** (`rgb(5,93,157)`), h2 4,66 → 6,26.

**Contagem:** oito telas montam o bloco (home e `/eventos-inovacao` comentadas, SIS-54 e SIS-152).

**Portões:** tsc limpo; eslint src 18/0; next build 0.

### Conferência
**APROVADA.** Contraste recalculado por WCAG a partir do RGB relatado (4,805 e 5,442). Adendos: sonda `p157.mjs` não está na árvore; “dez telas” era premissa errada (oito). Sem label `conferido`.

### Arquivos tocados
- `src/components/ContactCTA.tsx`

---

## SIS-156 — Home — trocar a faixa rolante de logos por uma grade estática de marcas (referência: terminal-industries.com)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-156/home-trocar-a-faixa-rolante-de-logos-por-uma-grade-estatica-de-marcas

### Pedido
Na home, no lugar do `SignalMarquee` (rodapé de “Sistran em números”), grade estática no formato terminal-industries.com: título editorial + malha com linhas finas, logos parados. Título não inventado. Sem fileira incompleta. Percurso pinado de Metrics reconferido (caixa 340vh + altura da faixa). Emenda com palco escuro. `/contato` e `/parceiros` continuam rolantes. Marquee comentado, não deletado.

### O que foi feito
`BrandGrid.tsx` (Server Component) + `brand-grid.css` (malha `gap: 1px` sobre `var(--line)`). **15 marcas** (`CLIENTS.filter(c => c.logo)`), não 16: **5×3** ≥1024 e **3×5** abaixo. Título “Impulsionando as operações por trás das marcas que você conhece” no `copy-lock.json`. Tetos ópticos `max-height: 46%` e `max-width: 68%`.

**Defeito silencioso.** `ETAPAS_FIM = 0.94` era a aritmética da faixa (~130px): `(3060−900)/(3190−900) = 0.943`. Com a grade (~690px) a razão cai a 0,758 e a 7ª etapa vinha **527px** depois de o palco sair (`p: 0.9428, palcoTopo: -527` a 1440). Corrigido: `etapasFimRef` + `ResizeObserver` nas duas caixas. Sonda `scripts/medir-percurso-marcas.mjs`: 1440 seção 3750px, 7ª em p=0,758, palcoTopo −1px; 1366 3286px, p=0,731, 0px.

`SignalMarquee` comentado em `Metrics.tsx`; vivo em duas telas. `forced-colors` nas células.

**Portões:** tsc limpo; eslint 18/0; next build 0; home 200.

### Conferência
**Aprovada** (árvore). Adendo posterior: título é redação nova, **não** está em `.claude/conteudo-site/` — critério de texto aprovado pendente de produto; frase fica provisória. Contagens da issue (16 marcas, três telas do marquee) corrigidas para 15 e duas. Sem label `conferido`.

### Arquivos tocados
- `src/components/BrandGrid.tsx`
- `src/components/brand-grid.css`
- `src/components/Metrics.tsx`
- `src/app/page.tsx`
- `src/components/legacy/SignalMarquee.tsx`
- `copy-lock.json`

---

## SIS-155 — Site inteiro — trocar o sistema tipográfico pelo par Geist Sans + Geist Mono (referência: terminal-industries.com)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-155/site-inteiro-trocar-o-sistema-tipografico-pelo-par-geist-sans-geist

### Pedido
Trocar Instrument Serif + Inter por Geist Sans 400/500 + Geist Mono 600, só tipografia, segundo `docs/terminal-typography-prompt.md`. Serifa sai dos 76 `font-display` (aval de marca 09/09). `--font-proportional` e `--font-mono`; oito papéis sobre os cinco degraus (`pagehero-medio`/`longo` preservados); caption 10px do prompt **proibido** (piso SIS-174: 11px rótulo / 12px corrido). Varredura de constantes medidas em px com ANTES/DEPOIS. Carregamento antigo comentado. Geist é alternativa livre, não a fonte da Terminal Industries.

### O que foi feito
**Declaração:** Geist = alternativa livre SIL OFL via `next/font/google`; não é a fonte da referência.

**Carregamento.** `Geist({ weight: ['400','500','600','700'], style: ['normal','italic'] })` + `Geist_Mono({ weight: '600' })`, `display: 'swap'`. Desvio: sonda achou **285 pontos** acima de 500 (600 em 178, 700 em 95); com `font-synthesis: none` a ênfase sumiria. Itálico de Geist é corte real nesta versão do Next (`essence-accordion.css:311` mantido). `Instrument_Serif`/`Inter` comentados.

**Ponto 12 — `ch`:** Instrument 0,460 · Inter 0,600 · Geist 0,6631 · Geist Mono 0,6000. Caixas `Nch` na serifa cresceram ≈44%; no Inter ≈10%. Tabela-mestra em `globals.css:82`. ScrollSpy: tinta “Conheça também” 131,53→127,08px; mínimo W≥1430,16; limiar **1439,98px preservado** (+4,45px de folga). Cartão contato 358,7px **inalterado** (é `17.5rem`). Manchete `/solucoes` não voltou a 7 linhas no desktop; em 320px 6→9 linhas, sem overflow.

**Brindes.** Última serifa viva em `globals.css:16103` (cauda Georgia) removida. Oito `font-mono` sem peso → `font-semibold`. `.rec-contagem` 780→600. `--font-mono` definida. Quatro rótulos PartnersTrack 10→11px.

**Piso 11px:** na Mono, só `.solutions-coord` a 9,6px (exceção pré-declarada). 24 rótulos proporcionais sub-piso reportados para SIS-174.

**Copy-lock:** `fontFeatureSettings`/`fontVariantNumeric` em `NOMES_TECNICOS` (precedente SIS-173) — 11× `"tnum" 1` não entram como texto.

**Portões:** `npm run lint` 24/0; tsc 0; `test:copy` 1196 OK; build 0.

**Reparo da conferência 1:** notas de `pageSections.ts` e `ScrollSpy.tsx` atualizadas (sem 150px vigente); ordinal `01–04` de `ServicesJourneyStage` em Geist Mono 600 + `tnum`.

### Conferência
Rodada 1 **REPROVADA** (comentários ScrollSpy; 13º tabular ainda proporcional). Rodada 2 **APROVADA**. VEREDITO: APROVADO. `conferido` aplicado.

### Arquivos tocados
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`
- `src/components/ui/ServicesJourneyStage.tsx`
- `TIPOGRAFIA.md`
- (demais consumidores de `font-mono` / tokens listados no relatório de entrega)

---

## SIS-153 — /eventos-inovacao — retirar o número (01, 02, …) de cima do título de todos os eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-153/eventos-inovacao-retirar-o-numero-01-02-de-cima-do-titulo-de-todos-os

### Pedido
O número acima do título sobre a foto sai nos quinze eventos. Selo, título, descrição e chip YouTube ficam. Só o número sobre a foto — `ordemNoCatalogo` continua no painel e nas miniaturas. Sai do JSX, não `display: none`. Comentário de `globals.css` que justificava o número pela régua (já removida na SIS-106) corrigido. JSX e `.evento-ordem` comentados.

### O que foi feito
`<span className="evento-ordem">` comentado; `<h3>` só `{e.title}`. Prop `ordem` saiu da fatia. `ordemNoCatalogo` permanece para miniaturas. `.evento-ordem` comentado; justificativa reescrita (posição = contador do painel). HTML servido: 0 `evento-ordem`; títulos começam pelo nome. Respiro selo→título **19,9px** nas três larguras (não dependia do rótulo). Contador `08 / 15` ok. FENACOR 2 linhas com `text-wrap: balance`. Contraste pior 9,25:1 a 1366 (melhor que 8,93:1). Armadilha: delimitador `*/` em nota CSS derrubou `next dev` com 500.

**Retrabalho:** referências de linha trocadas por nomes (`ordemNoCatalogo(alvo)`, `activeIdx + 1`, `.evento-posicao-total`).

**Portões:** tsc limpo; eslint src 18/0.

### Conferência
Devolvida pelas linhas 565-566/~607 erradas (~16 linhas pelo bloco comentado). Conserto **aprovado**. Sem label `conferido`.

### Arquivos tocados
- `src/components/EventsGrid.tsx`
- `src/app/globals.css`

---

## SIS-152 — /eventos-inovacao — retirar o bloco "Fale com a Gente!" do fim da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-152/eventos-inovacao-retirar-o-bloco-fale-com-a-gente-do-fim-da-pagina

### Pedido
Cartão de fechamento de `/eventos-inovacao` sai da rota (não é ajustado ao ESG). Só a chamada em `page.tsx`; `ContactCTA` intacto nas outras rotas. Risco: emenda Social→CTA vira Social→rodapé. Comentário de quatro capítulos/três passagens atualizado. Linha comentada, não deletada.

### O que foi feito
`<ContactCTA className="emenda-de-azul-medio" />` e import comentados. Rodapé `bg-[#1273BC]/85` vs última parada `#1273bc` de `.palco-de-cena-escura` — mesma junção da SIS-54 na home. Sonda 40px na fronteira a 1440: degrau real ≤7/255 (descontada a `brand-line`). `ctaPresente: false` em 1440 e 390. Home e `/esg` seguem com o bloco. Cabeçalho: três capítulos, duas passagens; `social -> contato` extinta. Sem substituto de CTA.

**Retrabalho de conferência:** contagem em `ContactCTA.tsx` num lugar só (dez chamadas, duas comentadas, oito montam, sete usam `<Link>`); `page.tsx` “OUTRAS OITO páginas”; título do bloco em `globals.css` “Passagem 3 … SEM CONSUMIDOR DESDE A SIS-152”.

**Portões:** tsc limpo; eslint src 18/0.

### Conferência
Devolvida (comentário da home “nove páginas” incluindo eventos; folha ainda falava Passagem 3 no presente). Retrabalho **aprovado**. Sem label `conferido`.

### Arquivos tocados
- `src/app/eventos-inovacao/page.tsx`
- `src/components/ContactCTA.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-149 — /eventos-inovacao — a explicação volta para o canto inferior esquerdo da foto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-149/eventos-inovacao-a-explicacao-volta-para-o-canto-inferior-esquerdo-da

### Pedido
Selo, número, título, descrição e chip voltam do centro para o canto inferior esquerdo da foto. Reverte alinhamento da SIS-111, **não** a geometria compartilhada texto/foto (`.evento-quadro` intacto). Escrim volta a horizontal-à-esquerda, laterais zero, sem `%` de −6/−8. Contraste AA nas quinze. Mobile inalterado. Regras de centralização comentadas.

### O que foi feito
Só `globals.css` no `@media (min-width: 1024px)`. `.evento-texto`: `margin-inline: 2.5rem 0` (centralização comentada). Descrição `margin-inline: 0`. Chip centralizado comentado. Escrim horizontal, `inset: -3rem 0 -2rem 0`.

**Geometria 1440:** foto 157,5–1282,5; texto 197,5–823,3 (+40px = 2,5rem); base −40px (acima da foto). `scrollWidth` = innerWidth em 1024–1180. Contraste título 14,39–17,08:1; descrição 12,87–18,08:1; evento 02 14,81 / 15,96. Controle sem escrim: pixel `254,253,248` (~1,05:1).

**Retrabalho:** platô 58% documentado — `62ch` vence o `min()`; tinta do título a 1366 chega a **65,5%** (já na rampa); pior contraste 8,93:1. Span `data-rm` morto comentado; prop `rm` da fatia saiu.

**Portões:** tsc limpo; eslint 18/0; next build 0.

### Conferência
Devolvida (platô justificado pelo parágrafo vs título; `data-rm` sem consumidor). Retrabalho **aprovado** (medição com Range). Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/EventsGrid.tsx`

---

## SIS-147 — /eventos-inovacao — diminuir a altura da abertura com vídeo

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-147/eventos-inovacao-diminuir-a-altura-da-abertura-com-video

### Pedido
Abertura com vídeo alta demais (título ~500px do topo a 1920×648). Reduzir para o título subir e a cena aparecer mais cedo. **Não** mexer no `.pagehero-entrada` base das 14 rotas — escopo em `.hero-backdrop--eventos`. Título inteiro sem encostar no header; emenda sem listra; telão de LED no quadro; mobile 46svh conferido; valor antigo comentado.

### O que foi feito
```css
@media (min-width: 1024px) {
  .hero-backdrop--eventos .pagehero-entrada { min-height: 46svh; }
}
```
`58svh` permanece na regra base. Sonda `scripts/medir-abertura-eventos.mjs`, header visível:

| | 1920×1080 | 1366×768 | 390×844 |
| entrada agora | 497 (46%) | 353 (46%) | 388 (46%) |
| topo do título | 459 | 317 | 396 |
| folga título↔header | 355 | 213 | 308 |
| topo `#eventos` | 641 | 497 | 500 |
| vídeo visível | 59% | 65% | 100% |

Controle 1366: `/solucoes` 445, `/quem-somos` 445, `/contato` 453 — irmãs intactas. `h1` ancorado na **base** da entrada (banda vazia estava acima). Telão: `object-position: 50% 62%`, janela [0,252…0,845] a 1920. Véu `rgb(4 27 61 / 78%)` vs cena `#041b3d` — mesmo RGB.

**Portões:** tsc 0; eslint src 18/0; next build 0.

### Conferência
**APROVADO.** Números batem. Follow-up: correção não ataca a ancoragem (ainda 355px de vídeo vazio a 1920); janela 1920×648 da queixa não foi medida. `conferido` aplicado.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-abertura-eventos.mjs`

---

## SIS-146 — /contato — bloco #timeSISTRAN: aumentar a escrita do cartão de carreira e tirar o travessão do parágrafo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-146/contato-bloco-timesistran-aumentar-a-escrita-do-cartao-de-carreira-e

### Pedido
No `#timeSISTRAN` de `/contato`: aumentar a escrita do cartão duas faces; tirar o travessão do parágrafo (“…todos os dias — e de gente…”), repontuando. `height` e `--lc-passo` juntos (`passo = height/4`). Escopo nas telas do `CartaoDuasFaces` ou via `className`. Contraste verso ≥ 4,5:1. Reduced-motion nasce aberto. Travessão do verso do cartão só se a decisão estiver escrita.

### O que foi feito
| classe | antes | depois |
| frente-rotulo | 1,05rem | 1,2rem |
| frente-destino | 0,72rem | 0,8rem |
| verso-titulo | 1,15rem | 1,3rem |
| verso-texto | 0,86rem | 1rem |
| verso-cta | 0,78rem | 0,88rem |
| height | 26rem | 30rem |
| `--lc-passo` | 6,5rem | 7,5rem |

Face antiga 208px / 160px úteis / 132,2px de conteúdo; tipo novo 172,3px — não cabia. 30rem → 240px / 192px úteis / 19,7px de folga. Destino 248,9px em uma linha. 390/1024/1440: cartão 320px; transbordo 0; metades coincidem. Reduced-motion: `matrix(1,0,0,1,0,0)`, aberto. Contraste `#3c5a7a` sobre branco **7,15:1**.

**Travessão:** vírgula (“…todos os dias, e de gente…”). Verso do cartão mantém travessão (orações independentes; escrita SIS-130).

**Alcance:** quatro telas (`contato/page.tsx` + `Social.tsx` em home, eventos, trabalhe-conosco). +64px de altura de seção; cartão 5px dentro da grade, 133px acima do pé.

**Portões:** tsc limpo; eslint 18/0; next build 0.

### Conferência
Devolvida pela contagem (duas telas vs quatro). Correção **APROVADA** (Social.tsx:80 tem 80 caracteres, não 81). Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/app/contato/page.tsx`

---

## SIS-145 — /contato — encurtar o vão entre a faixa de parceiros e o painel de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-145/contato-encurtar-o-vao-entre-a-faixa-de-parceiros-e-o-painel-de

### Pedido
~230px de degradê vazio entre a faixa de logos e o cartão “Entre em contato conosco” (captura ~1629px). Linha: `.fundo-contato-cena { padding-top: clamp(13rem, 16vw, 16rem) }` e rampa `.contato-emenda-clara` 200px. Os dois andam juntos; `padding-top` ≥ altura da rampa. Sem listra nas quatro colunas do painel. Valores antigos comentados.

### O que foi feito
Vão = `padding-top` (base da faixa e topo da seção no mesmo pixel). `clamp(13rem, 16vw, 16rem)` → `clamp(9.5rem, 11vw, 10.5rem)`; rampa 200→**140px**.

| largura | padding antes | depois | sobra acima do cartão |
| 390 | 208px | 152px | 12px |
| 1440 | 230,4px | 158,4px | 18,4px |
| 1629/1920 | 256px | 168px | 28px |

Encurtar a rampa deixou cauda íngreme (R=15 a 10px do fim). Parada 22% em 55%; resíduo voltou a 7–8. Emenda nas quatro colunas a 1440/1629/1920 sem salto. Fio da faixa ausente; borda de cima reta.

**Portões:** tsc limpo; eslint 18/0; rota 200; next build 0.

### Conferência
**Conferida no código e aprovada.** Aritmética do clamp e regra rampa ≤ padding mínimo conferidas; pixels são relato do par. Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-144 — /contato — a faixa de indicadores fixa na tela e os cartões correm para o lado com o scroll, e depois a página desce

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-144/contato-a-faixa-de-indicadores-fixa-na-tela-e-os-cartoes-correm-para-o

### Pedido
Faixa dos sete indicadores em `/contato`: seção presa, cartões correm na horizontal, depois a página desce. Mecanismo `sticky`, nunca `pin: true`. Transbordo já medido na SIS-143: 2630,9px vs trilho 1116px = 1514,9px. Reduced-motion **e** `html[data-motion="reduce"]`; overflow clip; svh; só transform; grade comentada; lint 24/0.

### O que foi feito
`PercursoIndicadores.tsx` + `metrics-band-track.css`; `MetricsBand.tsx` envolve. Sem ScrollTrigger: distância em CSS; `useProgressoDeSecao` relê rect e resize. Palco `sticky` + `overflow: clip` + `100svh`.

**Medido (produção):** 1024 cartão 280, deslocamento −1116,2, 7/7; 1440 345,6 / −1214,4 / 7/7; 1920 360 / −848 / 7/7. Escala a 1024: −1115,6 de −1116,2 no último quadro preso.

**Três desligamentos a 1440 idênticos:** grid, espaçador 0, 7/7 — sistema, botão da interface, JS off. Correção: regras impedidas com `html:not([data-motion='reduce'])` (espelho que desfazia deixava espaçador de 1620px).

**390/768:** grade, não percurso nem overflow-x nativo (uma coluna a 390). Focáveis na trilha: 0. Degradê da SIS-136 no palco 100svh; seção alta `#071d36` plano.

**Portões:** lint 24/0; tsc 0; build ok; copy-lock 1196 intacto.

### Conferência
**Aprovada.** Portões e geometria reproduzidos; dois interruptores byte a byte iguais; emenda logos limpa (`rgb(7,29,54)` / `rgb(245,250,255)`). `conferido` implícito na label da issue.

### Arquivos tocados
- `src/components/ui/PercursoIndicadores.tsx`
- `src/components/ui/metrics-band-track.css`
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`

---

## SIS-143 — /contato — os sete indicadores viram cartões: número maior, contagem ao entrar na tela e rótulo ao lado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-143/contato-os-sete-indicadores-viram-cartoes-numero-maior-contagem-ao

### Pedido
Faixa de números de `/contato`: número maior; CountUp ao entrar; cartão com número à esquerda e rótulo ao lado. Reverter a decisão de não contar (HTML servido com zeros). `metrics.ts` e `Metrics.tsx` da home intocados. Sem roxo. Pé `#071d36` (contrato SIS-136). Cartão fluido (decisão da usuária: não fabricar transbordo para a SIS-144).

### O que foi feito
**CountUp (b):** MotionValue nasce em `target`; efeito zera e anima. HTML servido: `850` visível, não `0`. Um quadro (~16ms) com valor certo na hidratação. Sem `once`. `srText={`${m.value}${m.suffix}`}`; `+` `aria-hidden`. MetricsBand continua Server Component; CountUp é filho client.

**Grade:** `repeat(auto-fit, minmax(17.5rem, 1fr))`; 4+3 comentado. Por fileira: 390 = 1; 768 = 2+2+2+1; 1024/1440/1920 = 3+3+1. Cartão 350 / 352 / 309,1 / 358,7 / 358,7px. Rótulos no máximo 2 linhas. Sem glass-card (roxo `rgba(124,58,237,0.1)` + sete blurs). Superfície branco 7%→3%.

**Contraste no cartão:** pior 9,67:1 (rótulo, canto claro do 1º). Pé `7,29,54` = `#071d36`. Número `clamp(2.5rem, 4.2vw, 3.5rem)` vs 7,5rem da home.

**Portões:** tsc limpo; eslint 18/0.

### Conferência
**APROVADA.** Adendo: nota de alcance do CountUp errada (só `MetricsStrip` e `MetricsBand` importam o primitivo; About/CompanySignature/Metrics têm contador próprio). Sem label `conferido`.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/components/primitives/CountUp.tsx`
- `src/app/globals.css`

---

## SIS-142 — /esg — CTA “Fale com a Gente!”: fundo azul claro, cartão mais inovador, reação ao mouse e o botão abrindo o modal de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-142/esg-cta-fale-com-a-gente-fundo-azul-claro-cartao-mais-inovador-reacao

### Pedido
No fim de `/esg`: azul claro atrás do bloco; cartão mais inovador; reação ao mouse; botão abre o `ContactModal` existente em vez de `/#contato`. ContactCTA fecha várias páginas — props opt-in. Só transform/opacity; `:focus-visible`; reduced-motion visível; ContactPanel intocado; copy-lock; Link comentado/ramo.

### O que foi feito
Props `haloClaro`, `reativo`, `contatoNoModal` default false; só `/esg` liga as três. Halo: `.cta-halo-claro::before` acima e abaixo do cartão (halo centrado caía h2 a 2,1:1). Reativo: invólucro (não o `motion.div` — `transform` inline do `vFadeUp` vencia a classe). Hover: `matrix(1.006, 0, 0, 1.006, 0, -6)`; calha 32px não levanta; Tab igual. Espelhos `@media` e `html[data-motion="reduce"]`. Botão abre o mesmo `ContactModal` do Header; Esc/clique fora devolvem foco. `<Link href="/#contato">` no outro ramo do ternário.

**Contraste 1440:** `/esg` h2 4,66:1, parágrafo 3,98:1 (melhor que `/solucoes` intocada 4,09 / 3,33). Parágrafo 3,33:1 nas telas irmãs → SIS-157.

**Portões:** tsc limpo; eslint 18/0.

Follow-up visual (igual `falecomagente.png`) aberto em **SIS-253**, não reabre esta.

### Conferência
**Aprovada.** Quatro mudanças opt-in; ContactPanel diff é SIS-127; seletor `:has(:focus-visible)`; SIS-157 reconhecida para o piso 4,5:1 do parágrafo. Sem label `conferido`.

### Arquivos tocados
- `src/components/ContactCTA.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`

---

## SIS-141 — /esg — GOVERNANCE no mesmo formato de ENVIRONMENT: seis imagens e escritas maiores

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-141/esg-governance-no-mesmo-formato-de-environment-seis-imagens-e-escritas

### Pedido
GOVERNANCE no mesmo desenho de ENVIRONMENT (SIS-139): imagem em cada card, hover, movimento, destaque no título; arquivos de `public/images/governance/`; escritas maiores. Manter `<dl>`/`<dt>`/`<dd>`. WebP, PNG fora de `public/`. TODO Canal de Denúncia permanece. Par imagem↔item conferido.

### O que foi feito
Par no array (ordem arquivos ≠ ordem dos itens: 1,4,2,3,5,6). Nomes por prática: `gov-transparencia`, `gov-isencao-autonomia`, `gov-formalidade`, `gov-codigo-etica`, `gov-comite-interno`, `gov-canal-denuncia`. Foto **dentro do `<dt>`**. Mesmas classes `esg-pratica` / `esg-pratica-foto` — **nenhum CSS novo**. Compasso 1,3s (não 1,7s). Parágrafo `text-lg`→`text-xl` nas duas gêmeas; termo 16→18px; descrição 14→16px. `h2` `text-section` não subiu. PNG `docs/fontes/governance/`; **2.157 KB → 176 KB (−92%)**. Canal de Denúncia: pictograma de megafone, não UI de canal.

**1024:** termo “Código de Ética…” em 1 linha (coluna 309,3px, útil 259,3px); alturas 445,3 / 471,3px entre fileiras.

**Contestação aceita (na descrição):** arquivos de Comitê Interno e Código de Ética trocados no disco; só os dois `alt` mudaram no `page.tsx`.

**Portões:** tsc 0; lint 24/0; build 0.

### Conferência
**APROVADA** com contestação dos dois pares (depois atendida na descrição). Ponto 5 fechado por medição. `conferido` aplicado.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css` (superfície / reduced-motion já de ENVIRONMENT)
- `public/images/governance/*.webp`
- `docs/fontes/governance/` (PNG)

---

## SIS-140 — /esg — SOCIAL: destaque no título, galeria dinâmica com imagem que expande, foguete no scroll e cards iguais

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-140/esg-social-destaque-no-titulo-galeria-dinamica-com-imagem-que-expande

### Pedido
SOCIAL de `/esg`: mesmo destaque de título da SIS-139; logo Gerando Talentos dinâmica; foguete discreto no scroll atrás das escritas; três turmas em movimento e clique que expande; letras maiores em Huerta Niño/Aguas; sombra azul, hover scale, cards do mesmo tamanho. Lightbox com teclado. Reduced-motion visível. Contraste do foguete medido.

### O que foi feito
**TituloAceso:** pontuação colada (`SO_PONTUACAO`); SOCIAL 11→9 passos; outros nove títulos com a mesma contagem de tokens.

**Selo:** `.esg-selo` 9s, `translateY(±3px) rotate(±0.5deg)`, sem scale/skew/filter.

**Foguete:** `FogueteScroll.tsx`, silhueta do selo (webp). Branco translúcido. `useTransform` no DOM, zero setState/quadro. Contraste parágrafos 5,09:1; h3 12,08:1; Δ com/sem foguete 0,03. Links `#1273BC` 3,79:1 — pré-existente, issue à parte. Header fixo lia 1,00:1 (armadilha de sonda).

**GaleriaTurmas:** `<dialog>` + `showModal()`; rótulos distintos; Esc/clique fora; foto não fecha o modal. Deriva `scale(1.03)`, delays 0 / −3,67 / −7,33s.

**Apoio:** `text-sm`→`text-base` + `leading-relaxed`; h3 `text-xl`→`text-2xl`. Pluma `--esg-fase`. Hover `scale` + `z-index: 2`, `:not(.esg-selo)`. `col-span-2` da 1ª turma mantido (sequência cronológica); 2ª/3ª 259,0×186,6; apoio 546×512.

**Reparo conferência:** `will-change` saiu de `.esg-apoio::before` (6 wrappers, mesma condição da SIS-139).

**Portões:** tsc limpo; eslint 18/0; next build 0.

Follow-up do foguete em **SIS-207** (10/09), não reabre esta.

### Conferência
Devolvida pelo `will-change`. Após remoção: **SIS-140 aprovada**. Ressalvas: `sizes`/`unoptimized` (SIS-154); “mesmo tamanho” não nas três turmas, decisão escrita. Sem label `conferido`.

### Arquivos tocados
- `src/components/ui/TituloAceso.tsx`
- `src/components/ui/FogueteScroll.tsx`
- `src/components/ui/GaleriaTurmas.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`
