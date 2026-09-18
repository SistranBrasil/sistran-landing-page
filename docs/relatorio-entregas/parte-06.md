## SIS-191 — /quem-somos · Escritórios: mapa cortado no norte e vão excessivo até a seção — país inteiro e emenda justa

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-191/quem-somos-escritorios-mapa-cortado-no-norte-e-vao-excessivo-ate-a

### Pedido
Em `/quem-somos`, seção Escritórios BRASIL: o mapa do Brasil estava cortado no topo (norte / Amapá–Roraima) e havia um vão enorme entre a seção anterior e esta. Aceite: silhueta inteira no pouso de Pato Branco (modo scroll, ≥1280×760); medição de recorte país vs SVG em 1280 / 1366 / 1440 com folga ≥ 0 no topo; pouso de São Paulo sem regressão; vão visivelmente reduzido com números antes/depois; header sem cobrir título nem abas; modo lista intacto; capturas; lint / tsc / build / test:copy OK. Fora de escopo: modo lista por min-height 760px, divisas SP/PR (SIS-185) e a transição PB→SP em si (SIS-169).

### O que foi feito
**Rodada 1.** A correção removeu o padding duplicado apenas do modo scroll e preservou o modo lista. Câmera, percurso de 300svh e `overflow: clip` não foram alterados: a medição mostrou folga superior positiva em PR.

- `src/app/quem-somos/page.tsx`: `section-py` do wrapper de Escritórios substituído por `offices-section`.
- `src/app/globals.css`: espaçamento original de 5/7/8rem preservado no modo lista; zerado somente com `data-modo="scroll"`.
- `docs/medidas/sis191/`: sondas, JSONs e capturas.

**Recorte do Brasil — folgas país vs SVG (rodada 1):** PR 1280×760 topo 6,3px / direita 130,2 / base 69,9 / esquerda 89,4; PR 1366×900 topo 7,6px; PR 1440×900 topo 7,6px. SP 1280 topo 194,7px, faixa livre do cartão 15px; SP 1366 recorte lateral esquerdo preexistente de 13,5px (sem regressão); SP 1440 faixa livre 102,7px.

**Emenda antes → depois:** 1280 254,2 → 126px; 1366 289,6 → 161,6px; 1440 287,1 → 159,1px. Header termina em 104px; título 166,3–201,9px; abas 319,7–365,6px. Lista 1279px / altura 759px / reduced motion: duas cidades visíveis, mapa com folga superior 90,8px; CLS 0. Portões rodada 1: lint 24 avisos / 0 erros; tsc, build (27 páginas), test:copy 1193 textos.

**Rodada 2 (após rejeição visual da usuária).** Causa: medição na borda externa do SVG (padding reduz o viewport; ~10px de corte no norte); fill da América do Sul formando aresta reta; ScrollSpy ativo (x≈140–149px) sobre a coluna (x≈72–80px). Ajustes em `globals.css`: corredor esquerdo no palco largo; máscara limitada à caixa de conteúdo; `--os-foco-y` de PB de `-1%` para `3.4%`; deslocamento de SP em tela larga de `-34%` para `-28%`. Medições: topo do país 34,1px (1440), 32,8px (1512), 37,5px (1920); SP folga esquerda 15,9px (1440), 28,8px (1470), 248px (1920). Portões: lint, tsc, test:copy 1193, build OK.

### Conferência
Rodada 1: **VEREDITO: APROVADO** (depois revogado pela usuária: corte percebido + rótulo `ESCRITÓRIOS` sobre o título). Rodada 2: **VEREDITO: APROVADO**. Conferência independente: PB folga superior real 13,8–16,1px, Brasil inteiro; SP folga esquerda 5,1–248px; máscara só no continente decorativo; ScrollSpy não invade, folga 11,4–19,4px acima de 1440; 1280×760, 1366×768, 1440×900, 1512×860, 1920×1080, lista e reduce OK. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/app/quem-somos/page.tsx`
- `src/app/globals.css`
- `docs/medidas/sis191/`

---

## SIS-190 — Home · hero: borda/moldura no quadro do vídeo — ref public/referenciavideo.png

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-190/home-hero-bordamoldura-no-quadro-do-video-ref-publicreferenciavideopng

### Pedido
Colocar uma borda no quadro do vídeo do hero (`.hero-media` / `hero-scroll-v2.mp4`), alinhada a `public/referenciavideo.png`: cantos arredondados, traço ciano fino com glow, borda em topo/direita/base, esquerda dissolvendo no branco (SIS-178). Aceite: valores medidos; caminho A/B/C escrito; moldura no desktop ≥1024; dissolução esquerda preservada; comportamento <1024 registrado; capturas 1440 e 390; portões OK. Em 10/09 o item de acompanhar scale/drop foi supersedido pela SIS-198.

### O que foi feito
Caminho **C**: `.hero-frame` é `<span>` irmão de `.hero-media` (não borda na camada do vídeo, não `.hero-scene`, não `#top`), com a mesma máscara `linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 35%) 26%, #000 62%)`. Não B (`border-left: 0` deixa aresta seca). Não A (retângulo completo sobre a folha). Traço: anel de **2px** por `padding: 2px` + `mask-composite: exclude`, degradê `#0079CB → #0ed8f6`. Fallback `@supports not (mask-composite…)`: borda sólida `#0ed8f6`. Brilho interno (`inset 0 0 3px / 0 0 26px`).

**Referência** (`public/referenciavideo.png`, 1799×874, script `scripts/medir-referencia-moldura-hero.mjs`): direita pico `#00defe`, núcleo ~2px; esquerda sem traço; cantos dir. arco 19–20px; tokens `#0079CB` e `#0ed8f6`; raio inicial 20px. Recuo de ~51px da ref não adotado (mudaria geometria SIS-178).

**Três `t` a 1440×900** (`scripts/medir-moldura-hero.mjs`): `molduraRaio = useTransform(scrollYProgress, [0.62, 0.96], [20, 30])`. t=0 raio 20px, traço direita 218 `#0cd7f5`; t=0,7 raio 22,35px; t=1 raio 30px. Lado que dissolve ciano ≤15. **<1024:** `.hero-frame { display: none }`; a 390×844 sem caixa. Reduced motion: traço 218 `#0cd7f5`, raio 20px. `opacity: 0.9999` de `.hero-video` intocado.

Portões: tsc limpo; lint 24 / 0 erros; next build OK; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-referencia-moldura-hero.mjs`
- `scripts/medir-moldura-hero.mjs`

---

## SIS-189 — Home · hero: vídeo começa automático ao entrar, e a rolagem controla ida e volta

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-189/home-hero-video-comeca-automatico-ao-entrar-e-a-rolagem-controla-ida-e

### Pedido
Na home, o vídeo do hero deve começar sozinho na entrada e a rolagem deve controlar ida e volta (rebobinar). Modelo: um eixo `t ∈ [0, 1]` com Fase A (play + sync de scroll via Lenis) e Fase B (seek no primeiro gesto). Aceite: automático no topo com movimento permitido; legendas acompanham `t`; primeiro scroll assume; rebobinar contínuo; âncora no meio do hero sem automático; reduce sem play; muted + playsInline; lint / tsc / build / test:copy.

### O que foi feito
Um escritor de `currentTime` por vez.

**`src/components/primitives/ScrollVideo.tsx`:** props `reproduzir`, `tetoReproducao`, `onFracao`, `onEntradaEncerrada`. Fase A: `play()`; `buscar()` sai antes de escrever `currentTime`. Relógio em `requestAnimationFrame` (não `timeupdate`, ~4 Hz). Fração com o mesmo `duration - 0.05` do seek. `play()` recusado = Fase A não acontece.

**`src/components/HeroCinematic.tsx`:** `fase` nasce em `'rolagem'` e é promovida num rAF após montar (hidratação). Teto da entrada = **0.58**. Posicionamento por `syncSmoothScroll` (Lenis). Saída da Fase A: gesto (`wheel`/`touchstart`/`keydown`/`pointerdown`, `once`), divergência de 24px contra o último alvo, teto, recusa do `play()`. Reduce lido por `matchMedia` + `data-motion`.

**Medição** (`scripts/medir-entrada-hero.mjs`, Chromium 1440×900): topo 3,5s `t 0 → 2,88`, `y 0 → 272`; um `wheel` pausa em `t 4,29` e não retoma; rolar ao topo `t → 0`; reduce sistema e `data-motion` pausados; âncora fora do topo pausado.

Portões: tsc limpo; lint 24 / 0 erros (refs de Fase A saíram do render para `useEffect`); next build exit 0; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-entrada-hero.mjs`

---

## SIS-188 — Higiene: inventariar componentes órfãos (Hero, PillarsCarousel, TrustTicker, CompanySignature, PartnersGrid, EventsGrid) — guardar ou declarar rascunho

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-188/higiene-inventariar-componentes-orfaos-hero-pillarscarousel

### Pedido
Issue de decisão + higiene (item 3b-c de `DECISOES-PENDENTES.md`): classificar cada órfão como peça guardada, rascunho ou ainda vivo; cabeçalho com substituto; nenhum import morto em `page.tsx`; portões OK; nenhuma rota muda visualmente. `UnitsMap` não é órfão se ainda montado em `/contato`.

### O que foi feito
Mudança exclusivamente documental, sem alteração de runtime. Cabeçalhos GUARDADO/RASCUNHO nos arquivos; nenhum arquivo/export apagado, movido ou comentado.

Tabela final (reparo da rodada 1):

- `src/components/Hero.tsx` — GUARDADO: nenhum import; home monta `HeroCinematic`.
- `src/components/ui/PillarsCarousel.tsx` — GUARDADO: único importador é o `Hero.tsx` órfão.
- `src/components/ui/TrustTicker.tsx` — GUARDADO: idem.
- `src/components/ui/CompanySignature.tsx` — RASCUNHO: zero importadores.
- `src/components/PartnersGrid.tsx` — GUARDADO: rota monta `PartnerTerminalCards`.
- `src/components/EventsGrid.tsx` — GUARDADO: import comentado; rota monta `EventsSpotlight`.
- `src/components/UnitsMap.tsx` — VIVO: `/contato` importa como `MapaUnidades` em `#onde-estamos`.

Portões: lint 0 erros / 22 warnings; tsc OK; build 27 páginas; diff-check OK; test:copy bloqueado por divergências concorrentes Home/Parceiros (lock não alterado).

### Conferência
Rodada 1: **VEREDITO: REPROVADO** — faltava a tabela `arquivo → vivo / guardado / rascunho` no comentário da issue. Rodada 2: **VEREDITO: APROVADO** após a tabela. Falha de `test:copy` externa à SIS-188.

### Arquivos tocados
- `src/components/Hero.tsx`
- `src/components/ui/PillarsCarousel.tsx`
- `src/components/ui/TrustTicker.tsx`
- `src/components/ui/CompanySignature.tsx`
- `src/components/PartnersGrid.tsx`
- `src/components/EventsGrid.tsx`
- (`UnitsMap.tsx` vivo, intocado)

---

## SIS-187 — Home: emenda visível entre o claro do hero (`#f4f8fc`) e a seção seguinte — decidir se dissolve, unifica ou permanece

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-187/home-emenda-visivel-entre-o-claro-do-hero-f4f8fc-e-a-secao-seguinte

### Pedido
Consequência da SIS-178: aresta visível entre `.hero-sheet` `#f4f8fc` e a grade de marcas `#f5faff` (`#top + *`). Três saídas; portão: decisão registrada **antes** do diff. Aceite: raster 390 e 1440; notas de `page.tsx` e `brand-grid.css` alinhadas; sem regressão no `drop` nem no empilhamento; portões OK.

### O que foi feito
**Decisão (antes do diff):** saída 2, aval da dona do produto. Unificar `#f4f8fc` transformaria o claro do hero na cor da página; deixar manteria degrau de largura cheia.

A emenda é espacial, não de contraste. Antes: 1440 e 390 acima `244,248,252` / abaixo `245,250,255`, maior degrau **3** em `dy = 0` (razão ≈ 1,02). Depois: degradê `#f4f8fc → rgba(244,248,252,0)` em `clamp(56px, 7svh, 96px)` na borda de cima de `.marcas-grade`; maior degrau **1** em `dy = 7` nas duas larguras.

`.marcas-grade` continua `#f5faff`; a rampa é `background-image`. Fade para transparente (não para `#f5faff`) para o navegador misturar com o fundo real. Notas de `page.tsx` e CSS marcadas `ERA:` e refutadas com os números. Sonda `scripts/medir-emenda-hero-grade.mjs` (armadilhas: amostrar no meio atravessa o cartão; clip Playwright em coords de documento). Nada toca geometria do `drop` nem `#top + *`.

Portões: tsc limpo; lint 24 / 0; next build exit 0; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/brand-grid.css`
- `src/app/page.tsx`
- `scripts/medir-emenda-hero-grade.mjs`

---

## SIS-186 — Medição de contraste: o pior pixel em texto miúdo pega franja de antialiasing e condena o que passa

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-186/medicao-de-contraste-o-pior-pixel-em-texto-miudo-pega-franja-de

### Pedido
O instrumento de contraste por raster subestima texto pequeno (SIS-178: traço ~11px 4,20:1 vs cálculo 7,23:1). Documentar o artefato em `COMO-MEDIR-CONTRASTE.md`; instrumentar o par raster + cálculo; não suavizar o pior pixel; nota cruzada na SIS-176; nenhum CSS/TSX de produção.

### O que foi feito
Nenhum CSS/TSX de produção mudou.

- `docs/medidas/COMO-MEDIR-CONTRASTE.md` — §7: artefato, regra do par, limiar, consertos errados.
- `scripts/medir-contraste-hero-pitch.mjs` — emite `razao`, `rasterPior`, `delta`, `miudo`, `veredito`.
- `scripts/medir-contraste-escritorios.mjs` e `scripts/medir-cena-eventos.mjs` — nota: o par **não** se aplica (apagam tinta antes de capturar).
- `docs/medidas/sis186/` — evidência e `regra-de-veredito.mjs`.

**Premissa contradita:** em fundo chapado Δ = 0 de 14,72px a 41,76px; em vídeo, título de 30,4px Δ **4,92**. Causa: fundo variável, não letra pequena. Corte de **16px** é gatilho de relatório.

Regra: raster não condena sozinho; calculada (cobertura ≥ 0,85) é o veredito; Δ > **1,0** assina franja. Vereditos: `reprovado` / `artefato-aa` / `raster-condenaria` / `aprovado`. Pisos WCAG 4,5:1 / 3:1 intactos. Caminho `razao(comA, bg)` descartado (pior saturava em 1,00).

Regressão: `SIS-178, traço 11px: calc 7,23 · raster 4,20 → artefato-aa` (7/7 no script). Nota cruzada na SIS-176.

Portões: tsc limpo; lint 24 / 0; test:copy 1193; `regra-de-veredito.mjs` 7/7. `next build` não rodado (sem alteração em `src/`).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `docs/medidas/COMO-MEDIR-CONTRASTE.md`
- `scripts/medir-contraste-hero-pitch.mjs`
- `scripts/medir-contraste-escritorios.mjs`
- `scripts/medir-cena-eventos.mjs`
- `docs/medidas/sis186/`

---

## SIS-185 — Escritórios BRASIL: divisas SP/PR que leem fechadas no mapa, e o violeta de `BRASIL` como decisão de token

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-185/escritorios-brasil-divisas-sppr-que-leem-fechadas-no-mapa-e-o-violeta

### Pedido
Dois restos no mapa de escritórios: (1) divisas SP/PR que leem como laço — corrigir no gerador `gerar-divisas-brasil.mjs` + `DIVISAS_BRASIL`; pinos PR (347,448) e SP (422,411) sobre terra. (2) violeta `#7c3aed` em `.section-light .text-gradient-brand` — decisão de token **antes** de pintar (manter / trocar global / classe escopada); se 2 ou 3, contraste `BRASIL` ≥ 3:1. Copy-lock OK; lint/tsc/build.

### O que foi feito
**Item 1.** Causa: gerador encadeava arestas sem preservar o par de UFs; 33 polilinhas híbridas. Correção: agrupamento por par de UFs; término em bifurcações; validações topológicas. `DIVISAS_BRASIL` 65/608 → **95 polilinhas / 644 pontos**. Sonda: 0 subpaths fechados, 0 Z, 0 vértices repetidos, 0 arestas duplicadas; pinos sobre terra. PB/SP em 1440×900.

**Item 2 (após aval opção 3).** Classe escopada `.titulo-escritorios-brasil .text-gradient-brand`, última parada `#1479ec` (não `#7c3aed`). `.section-light .text-gradient-brand` intocada. `OfficesScene.tsx` acrescenta a classe no `TituloAceso`. `#0ed8f6` reprova 1,63:1; `#0079CB` apagaria o degradê. Contraste 1440×1200: BRA `#0079cb` 4,24:1; SI `#1885ce` 3,71:1; IL `#1479ec` **3,99:1** nas pontas `pr` e `sp`. Piso 3:1 (65,6px). test:copy **não** cumprido por trabalho concorrente (nenhum delta desta issue). lint 22 / 0; tsc; next build OK.

### Conferência
**ITEM 1 — VEREDITO: APROVADO** (geração por par, 95/644, 0 Z, linhas abertas, pinos, portões). Issue voltou a Todo porque o item 2 pedia decisão de marca. Item 2 implementado após aval da opção 3; **não há comentário de conferência do item 2** no Linear.

### Arquivos tocados
- `scripts/gerar-divisas-brasil.mjs`
- `src/components/ui/BrazilOfficesMap.tsx` (`DIVISAS_BRASIL`)
- `src/app/globals.css`
- `src/components/ui/OfficesScene.tsx`
- `scripts/medir-contraste-brasil-sis185.mjs`

---

## SIS-184 — /esg — rolagem lateral de 7px no celular (390) e 3px no tablet (768)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-184/esg-rolagem-lateral-de-7px-no-celular-390-e-3px-no-tablet-768

### Pedido
Achado da SIS-138: `scrollWidth − innerWidth` = **7px** em 390, **3px** em 768, **0** em ≥1024. Achar o ofensor por medição; corrigir a causa (não `overflow-x: hidden` no `body`); alvo 0 nas três larguras; conteúdo alcançável; portões.

### O que foi feito
Ofensor: `.esg-apoio::before` em `src/app/globals.css` — pluma com `inset: -24px` e `scale` animado, aumentando `scrollWidth` nos cards da coluna direita da seção Social.

Correção: `overflow-x-clip` **somente na seção Social** em `src/app/esg/page.tsx`. Sem overflow global em `html`/`body`/`main`, nem clip no card/pluma.

Medição (`document.documentElement.scrollWidth - innerWidth`): 390 antes 6–8px (fase da animação) → **0px**; 768 3px → **0px**; 1024 0 → **0px**. Foco dos 5 controles visível; modal da galeria em top layer; sem erros de console.

Portões: lint 0 erros; tsc OK; build OK; diff-check OK; test:copy bloqueado por Home/Soluções (nenhuma string ESG no delta).

### Conferência
Sem registro de conferência no Linear. O relatório de entrega declara explicitamente que **não foi realizada conferência independente**; a issue ficou em In Review com `conferir`.

### Arquivos tocados
- `src/app/esg/page.tsx`
- (`src/app/globals.css` citado como origem do ofensor; clip aplicado na page)

---

## SIS-183 — Movimento: auditar o espelho `prefers-reduced-motion` ↔ `html[data-motion="reduce"]` em toda cena que decide layout pelos dois interruptores

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-183/movimento-auditar-o-espelho-prefers-reduced-motion-htmldata

### Pedido
Inventariar todas as `@media (prefers-reduced-motion` em `src/**/*.css`; classificar A/B/C; espelhar regras B/C com `html[data-motion="reduce"]` e `html:not([data-motion='reduce'])` nas positivas; sonda com botão (SO em no-preference); tabela no comentário; portões. Não alargar o reset global; não tocar em `layout.tsx`.

### O que foi feito
Ferramentas: `scripts/auditar-espelho-reduce-sis183.mjs`, `scripts/medir-espelho-reduce-sis183.mjs`.

Inventário: **54** blocos, **196** regras, **137** de layout. 114 já tinham espelho; 23 sem (9 falso positivo); **14 buracos reais**, todos corrigidos.

Buracos (entre outros): `globals.css` `.fundo-contato-laje` / `--longe` / `--perto` ganharam `html:not([data-motion='reduce'])` (animation-timeline); `.esg-apoio::before`, `.esg-selo`, `.esg-turma-foto`, `.esg-pratica-foto img` (medido: selo `matrix(0.999985…)`, fotos 3% ampliadas pelo botão); `.degrau-2/.degrau-3`; mosaico de eventos; `.evento-navegador`; `.pagehero-partida`/`.pagehero-fio`; `.solutions-convite-ponto`; `legacy.css` `.lp-partner:last-child::after` (classe C) e `.lp-partner img`; `events-spotlight.css` duas linhas no espelho existente (`filter` de hover). `partners-track` e `metrics-band-track` conferidos, não reescritos.

Sonda 1440×900, botão via `localStorage` `sistran-motion-preference` (atributo direto é removido por `layout.tsx`): `/esg` 3 divergências → **0**; demais rotas 0. Portões: lint 22 / 0; tsc limpo; build exit 0; test:copy falha baseline SIS-202 (8 perdidos / 3 novos), nada desta issue.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/legacy/legacy.css`
- `src/components/events-spotlight.css`
- `scripts/auditar-espelho-reduce-sis183.mjs`
- `scripts/medir-espelho-reduce-sis183.mjs`

---

## SIS-182 — Lint: trocar `matchMedia` dentro de `useEffect` por `useSyncExternalStore` nos oito componentes que ainda disparam `set-state-in-effect`

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-182/lint-trocar-matchmedia-dentro-de-useeffect-por-usesyncexternalstore

### Pedido
Trocar `matchMedia` + `setState` em `useEffect` por `useSyncExternalStore` (molde de `motion.ts`); string byte a byte igual à `@media`; snapshot de servidor `false`; varredura `rg matchMedia`; lint caindo na família `set-state-in-effect`; tsc/build/copy; visual acima e abaixo de cada limiar.

### O que foi feito
`src/lib/mediaStore.ts` — fábrica `criarConsultaDeMedia(consulta)` com `useSyncExternalStore`; `matchMedia` chamado tarde (`pegarLista`); `getServerSnapshot` → `false`. Desvio declarado: molde uma vez, string literal em cada arquivo.

Dez arquivos (oito + quatro da varredura): `Solutions.tsx`, `ProofJourney.tsx`, `SolutionsStory.tsx`, `BuildingShowcase.tsx`, `Contact.tsx`, `ImpactSequence.tsx`, `ScrollSpy.tsx` `(min-width: 1280px)`, `OfficesScene.tsx` `(min-width: 1280px) and (min-height: 760px)`, `TechnologyShowcase.tsx` `(max-width: 767px)`, `ScrollCue.tsx` `(hover: hover) and (pointer: fine)`. `Metrics.tsx` não reativado (SIS-165). `RecognitionTheater` / `MosaicHandoff` / etc. deixados com motivo.

`Contact.tsx`: só a media foi ao store; `dirigindo = largo && !rm && cabe`; altura no efeito via ResizeObserver.

Lint: **24 → 22**. Saíram dois `set-state-in-effect`: `ImpactSequence.tsx:77` e `ScrollCue.tsx:43`. Premissa da issue desatualizada: os oito originais roteavam por função nomeada e escapavam do aviso. test:copy 1193. Sonda `docs/medidas/sis182/sonda-sis182.mjs` e hidratação 12/12 sem ruído.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/lib/mediaStore.ts`
- `Solutions.tsx`, `ProofJourney.tsx`, `SolutionsStory.tsx`, `Contact.tsx`, `TechnologyShowcase.tsx`
- `ui/ScrollSpy.tsx`, `ui/BuildingShowcase.tsx`, `ui/OfficesScene.tsx`
- `legacy/ImpactSequence.tsx`, `primitives/ScrollCue.tsx`
- `docs/medidas/sis182/sonda-sis182.mjs`, `docs/medidas/sis182/sonda-hidratacao.mjs`

---

## SIS-181 — Indicador lateral de seções: rótulo invisível quando a seção ativa é clara e não usa `.section-light`

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-181/indicador-lateral-de-secoes-rotulo-invisivel-quando-a-secao-ativa-e

### Pedido
Rótulo do `ScrollSpy` branco sobre fundo claro (ex.: hero `#f4f8fc`, contraste ≈ 1,05:1). Detector só conhecia `.section-light`. Caminho: campo `tom` em `pageSections.ts` (margem esquerda); `onLight` = `tom === 'claro' || closest('.section-light')`; varrer rotas; contraste rótulo ativo ≥ 4,5:1, traço ativo ≥ 3:1; anel de foco; sem aplicar `.section-light`; 1440 e 1366; portões. Não resolver pintando seções com `.section-light`.

### O que foi feito
Terceiro estado `tom: 'medio'` (decisão de design após bloqueio: navy/branco não fechavam 4,5:1 em azuis intermediários, pior `rgb(22,129,201)` branco 4,19:1 / navy 3,88:1). Sem backplate.

Classificação: claro `/#top`, `/transformacao-legado#sinais`, `#roadmap`. Médio: várias seções (quem-somos, parceiros, esg, labs, university e derivadas de slug). Ausente = escuro + fallback `.section-light`.

Medições: fundos médios RGB(21,124,194) etc., tinta `#02070e`, 4,52–4,70:1. `/#top` RGB(244,248,252): ativo 15,23; hover 5,95; traço 4,28. `#sinais` ativo 16,08. `#roadmap` ativo 14,88. Escuro RGB(17,42,79): ativo 14,31; traço 8,29. Varredura raster; 1440 e 1366 nas rotas obrigatórias.

Portões: lint 24 / 0; tsc; build; test:copy 1194.

### Conferência
**VEREDITO: APROVADO.** Tons escuro/claro/médio; `tom` precede `.section-light`; observer intacto; nenhuma seção ganhou `.section-light`. Claros 13,52–16,08:1 e traço 3,80–4,52:1; médios `#02070e` 4,52–4,70:1. In Review com `conferido`.

### Arquivos tocados
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-180 — Seção #SomosSistraners: tirar o véu escuro atrás do texto, confinar as luzes do palco e ampliar o título

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-180/secao-somossistraners-tirar-o-veu-escuro-atras-do-texto-confinar-as

### Pedido
Retirar o fundo azul escuro atrás da escrita na seção LinkedIn (véu `.palco-copy::before` da SIS-130), texto branco maior; confinar luzes; contraste parágrafo ≥ 4,5:1 e título ≥ 3:1 em 1440/1024/390 na home e em `/contato` `#timeSISTRAN`; token de título próprio; copy intacta; quatro rotas; portões.

### O que foi feito
Véu comentado; tabela SIS-130 preservada. Confinar luzes sozinho **não** fechava 4,5:1: `text-white/85` sobre `#1273bc` dá **4,08:1** com luzes apagadas. Parágrafos foram a branco cheio; em `/contato` o segundo estava `white/75` (3,52:1). Marca d'água contorno 0,20 → **0,08**. Faixa clara da emenda abaixo de 1024: pior pixel 390 `rgb(116,159,191)` 2,82:1 — faixa 130px vs respiro 11rem. Confinamento por posição ≥1024 (`left: 96%`, teto 52rem) e por intensidade abaixo. Quatro cópias do radial ciano movidas para `88%`.

Token `text-palco` em `tailwind.config.ts`: **83,2px** a 1440 vs 65,6px `section` e 92,8px hero. `/contato` não subiu de degrau.

**Contraste (pior pixel sob linhas):** home `#social` 1440 **5,28:1** rgb(26,112,175); 1024 5,22:1; 390 5,40:1. `/contato` `#timeSISTRAN` 1440 5,10:1; 1024 5,21:1; 390 **4,74:1**.

Portões: lint 24 / 0; tsc 0; next build exit 0; forced-colors CanvasText; reduce = posição de repouso medida.

### Conferência
**Aprovada.** Véu comentado, quatro radiais, máscara 150px sem colisão, isolation órfão comentado, token com os três números. Conferente mediu `#SomosSistraners` `#a5f3fc` contra rgb(26,112,175) = **4,18:1**. Pedido de correção de registro em `contato/page.tsx:366-368` (nota do véu obsoleta) — não bloqueante. Label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`
- `src/app/contato/page.tsx`
- `src/components/ui/PalcoReativo.tsx`
- `tailwind.config.ts`

---

## SIS-179 — Grade de marcas: subir para depois do hero, título centrado e maior, malha aberta com marcas de cruz e célula em destaque azul

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-179/grade-de-marcas-subir-para-depois-do-hero-titulo-centrado-e-maior

### Pedido
Quatro mudanças em `BrandGrid` + `brand-grid.css`: (1) grade imediatamente após o hero; (2) título centrado e maior, `max-width: 34ch` permanece; (3) malha aberta com cruzes; (4) hover em azul da marca. Notas invertidas reescritas, não apagadas. Alinhamento em três larguras; forced-colors; indicadores de números sem regressão; portões.

### O que foi feito
Mount em `page.tsx` irmã direta de `<HeroCinematic />` (`#top + *`). Import/mount em `Metrics.tsx` comentados. `pageSections.ts` sem linha (combinado). Título `clamp(1.75rem, 3.6vw, 3.5rem)`: 51,84px @1440; folgas iguais. Malha: calha de meia célula; desvio pior **0,0169px**. Hover `rgb(0 121 203 / 8%)`, `box-shadow 0 0 0 1px var(--signal-deep)`. Emenda raster delta (1,2,3). LCP 1440 2236ms VIDEO 15,4MB. Sete indicadores 7/7 acesos. `ETAPAS_FIM_PADRAO` 0,94 intacto.

**Consertos pós-conferência:** `--malha-cruz` de `rgb(0 26 61 / 30%)` para tinta opaca `#acb7c5`; cruzamentos 2 e 4 camadas leem `172,183,197`. Nota `.impact-percurso`: razões 1 e 2 **INERTES**.

Portões: tsc 0; lint 24 / 0; build OK; test:copy 1196.

### Conferência
Primeira conferência: **conferido** com dois consertos de acabamento (tinta das cruzes; nota inertes). Após consertos: **os dois estão feitos; SIS-179 pode ir para Done.** Não movida para Done no Linear (permanece In Review com `conferido`).

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/Metrics.tsx`
- `src/components/BrandGrid.tsx`
- `src/components/brand-grid.css`

---

## SIS-178 — Hero: vídeo na metade direita dissolvendo no branco, legendas na coluna esquerda

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-178/hero-video-na-metade-direita-dissolvendo-no-branco-legendas-na-coluna

### Pedido
Layout do hero: vídeo na metade direita dissolvendo à esquerda; legendas escuras à esquerda. Percurso de rolagem inteiro (sticky, ScrollVideo, três legendas, HERO_SLIDES). Mobile em sangria. Contraste medido; vinheta confinada; reduce com legendas visíveis; h1 sr-only; portões. Ponto de quebra a nomear.

### O que foi feito
Ponto de quebra **1024**. `.hero-media` `width: 58%`, máscara `linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 35%) 26%, #000 62%)`. Cores desktop: título `#041b3d`, sobretítulo `#0f5590`, parágrafo `rgb(4 27 61 / 88%)`. Vídeo all-intra `hero-scroll-v2.mp4`: 361 keyframes / 361 quadros, 15,4 MB, raspagem `currentTime` 3,165 → 14,971.

Defeitos achados: reduce deixava legendas em `opacity: 0` (repouso explícito); header cortava a 390 (somar `--header-h`). Dois interruptores iguais (`rmSistema1440` = `rmBotao1440`).

**Rodada 2:** fundo `#f4f8fc` em `.hero-sheet` e `#top` (não `#e2effa`, rejeitado). Contraste sobre `#f4f8fc`: título 16,01; parágrafo 10,15; sobretítulo raster 6,28 @1440 / **4,20** @1024 vs calculado 7,23 (antialiasing). Enquadramento: `quadroScale` beat 2 1,18 → 1,08; `quadroX` `+4%` → `-1.5%`. Pior folga direita **50,2px** (piso 16) em 1024.

Portões: tsc 0; lint 24 / 0; build OK; copy 1196.

### Conferência
**Aprovada**, com correção de método: 4,20 não passa o piso — é artefato de instrumento; o contraste que governa é **7,23**. Achado da emenda `#top + *` (gerou SIS-187). Corte a 390 fora de escopo. Portões conferidos.

### Arquivos tocados
- `src/components/HeroCinematic.tsx`
- `src/components/ui/HeroCaptions.tsx`
- `src/app/globals.css`
- `public/videos/hero-scroll-v2.mp4`
- `public/videos/hero-scroll-v2-poster.webp`

---

## SIS-177 — Conteúdo: aprovar o parágrafo de apoio e a marginália de “Sistran em números”

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-177/conteudo-aprovar-o-paragrafo-de-apoio-e-a-marginalia-de-sistran-em

### Pedido
Issue de conteúdo: decidir, para quatro blocos da referência `numeros.png` (título, apoio, duas marginálias), aprovar / substituir / dispensar. Se aprovado, texto em `00-home.md` e `copy-lock.json` antes do TSX. O título travado era “Escala que transforma o mercado de seguros .”.

### O que foi feito
Decisão mais larga: os quatro blocos **dispensados** e o texto visível da faixa **retirado**. Só os sete números.

Retirados do lock: “Escala que transforma o mercado de seguros .” (`Metrics.tsx:1`); “Sistran em números” visível (`:0`); “ROLE PARA REVELAR” (`:2`). “Sistran em números” permanece como `aria-label` da `<section>`.

Código: sobretítulo, fio, `<h2>` e ROLE comentados em `Metrics.tsx`. `.impact-topo` `padding-block: 0`. CSS das classes permanece para religar. Nenhuma issue de montagem aberta (nada a montar).

Portões: tsc limpo; test:copy OK 1194 após regenerar lock (8 ins / 9 rem); lint **não executável** no momento (plugin `react-hooks` ausente na config) — declarado não cumprido.

### Conferência
**VEREDITO: APROVADO.** Quatro blocos dispensados; título travado retirado; `.impact-topo` altura 0 em 1440/1024/390; lint 24 / 0 na conferência; tsc; test:copy 1194. Sem issue de montagem.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `.claude/conteudo-site/00-home.md`
- `copy-lock.json`

---

## SIS-176 — “Sistran em números”: fundo de imagem, divisórias e trilho de sete pontos que acende na rolagem

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-176/sistran-em-numeros-fundo-de-imagem-divisorias-e-trilho-de-sete-pontos

### Pedido
Alinhar `#resultados` a `numeros.png` no desenho: arte `atrasnumeros` no lugar do navy chapado; divisórias sem fio na primeira célula dos quatro layouts; trilho de sete nós ligado a `acesos`; ordinais fora; remedir rótulo apagado ≥ 4,5:1; notas; emenda de rodapé após SIS-179; portões. Texto novo é da SIS-177.

### O que foi feito
**Rodada 1.** Fundo via `next/image` (`fill`, `sizes="100vw"`, sem `priority`); WebP **38.484 bytes**; PNG preservado; fallback `#041b3d`. Divisórias: 390 `0/0/0/0/0/0/0`; 800 `0/1/0/1/0/1/0`; 1024 `0/1/1/1/0/1/1`; 1440 `0/1/1/1/1/1/1`. Trilho em `acesos`; ordinais comentados. Rótulo apagado 0,56; cálculo **4,51:1** @1440 sobre `rgb(2,61,99)`; **4,65:1** @1024; **4,61:1** @390. Sobretítulo 11,49 / 10,96 / 5,83:1; ROLE 8,63 / 7,85 / 6,84:1. `ETAPAS_FIM_PADRAO` 0,94.

**Rodada 2 (provas).** Alinhamento X título/célula: 390 `20/20/20`; 1440 `162/162/32` (containers, não padding). Emenda 260px: médias RGB contínuas `(0,62,114)` → `(1,36,79)`. Emenda inferior: `rgb(254,254,254)` gap 0; véu até `(0,1,3)` aos 220px.

Portões: lint 24 / 0; tsc; build; copy 1196.

### Conferência
Rodada 1: **VEREDITO: REPROVADO** (faltavam provas de alinhamento e emendas). Rodada 2: **VEREDITO: APROVADO**. Nota cruzada SIS-186 apontando `COMO-MEDIR-CONTRASTE.md` §7.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/components/legacy/legacy.css`
- `public/imagens/atrasnumeros.webp`

---

## SIS-175 — copy-lock: o extrator trava `as React.CSSProperties` como se fosse cópia do site

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-175/copy-lock-o-extrator-trava-as-reactcssproperties-como-se-fosse-copia

### Pedido
`pareceCodigo()` deve descartar casts TypeScript (não exceção nomeada). Acrescentado na conferência da SIS-173: doze entradas técnicas (hex maiúsculo, token único, membro com três segmentos). Autotestes; nenhum texto publicado sai; test:copy OK.

### O que foi feito
Regras gerais em `scripts/copy-lock.mjs`: casts (`as React.CSSProperties`, `as CSSProperties`, `as HTMLElement`, `as const`); Tailwind com hex maiúsculo; utilitário único (`max-w-[22ch]`, `!text-white`); membro qualificado (`labels.text.fill`, `m.RoadmapStopDialog`). Autotestes 21 → **41**, com contraexemplos (`as Sistran`).

Lock: 1678 / 1201 distintos → 1635 / **1184**; 43 registros / 17 valores removidos, todos técnicos; casts 25 → **0**. test:copy ainda exit 1 só pelas 7 perdas / 3 entradas concorrentes Home/Parceiros.

Portões: test:extrator 41; lint 22 / 0; tsc; build 27 páginas; diff-check OK.

### Conferência
Sem registro de conferência no Linear. Entrega declara **não conferência independente**; In Review com `conferir`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`

---

## SIS-174 — Piso de tamanho de texto: subir os 30 pontos abaixo de 11px, e reescrever o documento de tipografia que caducou

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-174/piso-de-tamanho-de-texto-subir-os-30-pontos-abaixo-de-11px-e

### Pedido
Piso 12px corrido / 11px label caixa-alta com tracking. Só sobe o que está abaixo. Reescrever `docs/fontes/tipografia.md` para o estado real (após SIS-155: Geist). Não mexer em família. Exceção `.bm-rotulo .bm-coord`. 16 pontos fora de rota intocados. Portões.

### O que foi feito
19 aumentos em `globals.css` por seletor (valor antigo conferido antes de gravar). 12 labels → `0.6875rem`; `.evento-selo` 10px → 11px; 5 corridos → `0.75rem`; botão filtros 11px → 12px. Zero tracking/weight/family; sem conversão px↔rem.

SIS-176 comentou `.impact-indice` dirigido: linha caiu, regra ficou `0.66rem` com nota. `.bm-rotulo .bm-coord` em **7px** / 9px (SVG). `UnitsMap` voltou à rota (SIS-168): `text-[10px]` → `text-xs`. `PartnersTrail` `0.66rem` → `11px`. `PartnersTrack` saiu da rota (SIS-201): quatro `text-[10px]` da tabela intocados.

`docs/fontes/tipografia.md` reescrito (Geist Sans/Mono; histórico 08/09 e 09/09). Linha de filtros: **imensurável** — `.evento-filtros` ausente (SIS-166). test:copy vermelho por concorrência; lock não atualizado.

Portões: tsc limpo; build exit 0; lint **22 / 0**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/UnitsMap.tsx`
- `src/components/PartnersTrail.tsx`
- `docs/fontes/tipografia.md`
- `scripts/medir-linha-filtros-sis174.mjs`

---

## SIS-173 — copy-lock — o filtro pareceCodigo() descarta texto publicado de verdade; cinco frases estão fora da tranca

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-173/copy-lock-o-filtro-parececodigo-descarta-texto-publicado-de-verdade

### Pedido
Apertar `;` e a regra de tokens Tailwind em `pareceCodigo()` para trancar cinco frases publicadas; autoteste nos dois sentidos; contagem antes/depois; nenhum token técnico novo; build/lint.

### O que foi feito
`;` entre letras + espaço + minúscula vira pontuação. Cadeia de classes exige token utilitário real. Cinco frases trancadas: `legacy.ts:567` (`;`); `acceleratorPages.ts:197`; `esg/page.tsx:116`; `contato/page.tsx:57`; `sistran-university/page.tsx:59`. Cada uma, apagada em memória, faz `test:copy` falhar.

Autoteste 11 → **21**. Lock **1649 → 1654** entradas, **1180 → 1196** distintos; 30 entraram (cópia), 14 saíram (código). Tentativas `+`/`-` espaçados e `:` final descartadas (28 textos reais).

Portões: extrator 21; copy 1196; lint 24 / 0; tsc; build.

### Conferência
**Aprovada.** Conferente: chaves reais **1655** (não 1654); frase sobre `NOMES_TECNICOS` falsa — vai para SIS-175 com 12 entradas técnicas. Critério “entrou” cumprido. Label `conferido`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`

---

## SIS-172 — /relatorio-de-transparencia-salarial — o Portal Emprega Brasil é citado no texto e não é link

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-172/relatorio-de-transparencia-salarial-o-portal-emprega-brasil-e-citado

### Pedido
“Portal Emprega Brasil” vira link com URL verificada no ar; `target`/`rel`; contraste ≥ 4,5:1; decisão Lei/Decreto escrita; texto intacto (ano 2023); 390/768/1440; portões.

### O que foi feito
Arquivo `src/app/relatorio-de-transparencia-salarial/page.tsx`. Destinos: `empregabrasil.mte.gov.br` TLS falha; gov.br 404; **`https://servicos.mte.gov.br/empregador/` 200**, h1 “Portal Emprega Brasil”.

Contraste (raster, `.glass-card` escuro, `text-white/85`): 390 **5,73:1**; 768 **5,61:1**; 1440 **5,53:1**. Lei e Decreto em texto (motivo no arquivo). `identico: true`. copy-lock regenerado por quebra de nó (1195 → 1196).

Portões: lint 24 / 0; tsc; build; test:copy OK.

### Conferência
**APROVADA.** curl confirma 200 / TLS 000 / 404. Premissa de fundo claro da issue estava errada; medição raster correta. Achado `as React.CSSProperties` no copy-lock gerou SIS-175. Label `conferido`.

### Arquivos tocados
- `src/app/relatorio-de-transparencia-salarial/page.tsx`
- `copy-lock.json`

---

## SIS-171 — copy-lock — o extrator confunde comentário de código com texto do site, e o portão parou de valer

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-171/copy-lock-o-extrator-confunde-comentario-de-codigo-com-texto-do-site-e

### Pedido
Extrator deve descartar comentários e extrair por posição (dados, JSX, props de texto). `--check` verde na árvore limpa e vermelho se palavra de página muda. Cabeçalho reescrito. Lock regravado. Frases partidas por `{' '}` entram inteiras.

### O que foi feito
`tiraComentarios` com scanner de estado (`//` em string/regex). Posições: nó JSX, array, propriedade, ternário, atribuição, return; fora: argumentos de chamada e import. Costura `{' '}` / `<br>` / tags inline. Entidades `&ldquo;` resolvidas.

`test:extrator` 11 casos. `--conferir-perdas`: 52 não alcançados, todos técnicos. Lock 2108 → **1649** entradas; copy **1180** distintos. Demonstração: alterar “Ver oportunidades no LinkedIn” falha o portão.

Portões: lint 24 / 0; tsc 0; next build; test:copy 1180; extrator 11.

### Conferência
**Aprovada.** Perdas técnicas conferidas; cobertura no navegador. Achado: cinco frases fora da tranca (`;` e tokens) — vira SIS-173, não devolve. Label `conferido`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`
- `package.json` (`test:extrator`)

---

## SIS-170 — ScrollSpy — a coluna lateral fixa cobre o texto do hero entre 1280 e 1440px

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-170/scrollspy-a-coluna-lateral-fixa-cobre-o-texto-do-hero-entre-1280-e

### Pedido
`ScrollSpy` `fixed` cobre texto entre 1280 e ~1424 (depois corrigido para 1440). Decisão: recolher para traços (saída 2), não esconder. Aceite: 1280, 1366, 1423, 1439 sem sobreposição; 1440 igual a hoje; container centrado; teclado/leitor; um lugar só para limiares; portões.

### O que foi feito
Rótulo `position: absolute; left: 100%` fora de `@layer` (`globals.css`); classe `scrollspy-rotulo`. Limiar **1440** (`max-width: 1439.98px`): caixa de `/quem-somos` 150px → borda 162. Após recolhimento, borda do nav ≈36px; invasão negativa (folga) nas oito larguras.

**Rodada 2 (devolução):** o ativo era `opacity-100` sempre. Acrescentado `.scrollspy-rotulo { opacity: 0 }` no mesmo media, retorno em `a:hover >` e `a:focus-visible >`. 371 amostras, 0 colisões. Nav 24px em repouso e hover. `pageSections.ts` aviso junto de `sectionsForPath`.

Segunda conferência: 766 amostras, 0 colisões; ativo `opacity: 0` vence `opacity-100` da marcação. Sugestão não bloqueante: limiar de tinta **1475**.

Portões: tsc; lint 24 / 0; next build 27 páginas; test:copy 1180.

### Conferência
Rodada 1: **devolvida** — rótulo ativo ainda visível em repouso. Rodada 2: **aprovada**. Label `conferido`. In Review.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/ui/ScrollSpy.tsx`
- `src/data/pageSections.ts`
