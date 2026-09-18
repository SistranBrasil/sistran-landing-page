## SIS-278 — Site · barra de progresso de scroll no topo (ciano, acima do navbar)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-278/site-barra-de-progresso-de-scroll-no-topo-ciano-acima-do-navbar

### Pedido
Colocar uma barra de acompanhamento do scroll no topo da viewport, acima do navbar, no espírito de raul-strombeck-lp.vercel.app (lá laranja; aqui ciano ou outra cor menos dominante da paleta Sistran). Faixa fina fixa em `top: 0`, preenchendo da esquerda para a direita. Preferência `#0ed8f6` / token de acento, não o azul `#1273bc` chapado. Uma barra global no layout, `position: fixed`, altura ~2–3px, z-index acima do header (`fixed` + `top-4` + `z-50`). Progresso `scrollY / (scrollHeight - innerHeight)` (ou Lenis, SIS-29); preferir `transform: scaleX`. Decorativa (`aria-hidden`) ou `role="progressbar"`. Reduce: barra pode continuar ou sumir — declarar. Fora de escopo: ScrollSpy/ScrollSpine, layout do navbar, laranja da referência. Aceite: qualquer rota 0→100%; acima do navbar; cor discreta em hero claro e escuro; capturas 1440 (topo + meio + fim); lint OK.

### O que foi feito
Relatório de entrega: fechada sem conferência, a pedido da usuária. Implementada uma única barra global de progresso no topo absoluto da viewport.

**Arquitetura**
- Novo componente estático `src/components/ui/ScrollProgressBar.tsx`, sem `'use client'`, estado, hook, listener, Motion ou GSAP.
- Montado diretamente no `RootLayout`, como irmão global, fora do `Header`, `PageTransition` e `RouteLoadGate`.
- Consome em CSS o `--scroll-p` que `SmoothScroll` já publica pelo relógio único do site.
- `transform-origin: left` + `scaleX(var(--scroll-p, 0))`; largura nunca é animada.
- Decorativa: `aria-hidden`, sem texto, foco ou eventos de ponteiro.

**Visual**
- Ciano Sistran `#0ed8f6`, altura 3px, `top: 0`, `z-index: 60` contra 50 do navbar.
- Halo/borda navy discreta dá contraste medido acima de 3:1 em heroes claros; o ciano fica perto de 10:1 nos heroes escuros.
- Sem trilho permanente: em progresso zero o topo fica limpo.

**Medidas reais — 1440×900**
- Topo: `--scroll-p: 0`, escala 0, largura pintada 0px.
- Meio: `--scroll-p: 0.5`, escala 0.5, largura pintada 720px.
- Fim: `--scroll-p: 1`, escala 1, largura pintada 1440px.

O mesmo casamento exato foi medido no mobile 390px: 0 / 195 / 390px. Uma rota sem curso (`scrollHeight <= innerHeight`) permanece em 0 sem NaN.

**Navegação e movimento reduzido**
Navegação client-side home longa → política curta → home reinicia a barra em 0 e volta a acompanhar normalmente; nenhum reparo em `SmoothScroll` ou `PageTransition` foi necessário. Em `data-motion="reduce"`, Lenis não é criado e a barra continua acompanhando o scroll nativo — deliberadamente, porque é indicador informativo e não ornamento. Não há transition nem animation própria.

**Portões**
- `npx tsc --noEmit`: verde.
- `npm run build`: verde, 28 páginas.
- `npx eslint src scripts`: 0 erros; 16 avisos preexistentes.
- Copy-lock segue vermelho somente pelos dois fragmentos técnicos preexistentes de `ContactCTA*` e `RevealScope`; não foi atualizado.

A auditoria pré-despacho registrou o contrato: zero novo listener de scroll, zero estado React, zero Motion/GSAP; elemento `aria-hidden`; consumo de `--scroll-p` já publicado por `SmoothScroll`; Header em `fixed`, `top: 1rem`, `z-index: 50`.

### Conferência
Sem registro de conferência no Linear. A entrega declara fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/ui/ScrollProgressBar.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `scripts/medir-barra-progresso-sis278.mjs`
- `docs/medidas/barra-progresso-sis278/`

---

## SIS-272 — /eventos-inovacao · reveal on scroll (docs/scroll.md)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-272/eventos-inovacao-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll (`docs/scroll.md` / `RevealScope` + `data-reveal`) em `/eventos-inovacao`, alinhado a `/contato`, com calibre por scroll (SIS-269). `EventsSpotlight` já é cena sticky/IO própria — não pôr `transform`/reveal no wrapper do palco sticky; revelar cabeçalho, CTA, blocos fora do percurso sticky, ou filhos que não quebrem o sticky. Mobile carrossel (SIS-239/251): não duplicar entrada. Calibre: não disparar tudo no load. Aceite: blocos estáticos revelam ao rolar; Spotlight sticky intacto (sem regressão SIS-166/232/268); capturas; lint OK.

### O que foi feito
Relatório de entrega: fechada sem conferência, a pedido da usuária. Implementação validada ponta a ponta na página real.

**Marcação aplicada**
- `EventsSpotlight.tsx`: três `RevealScope` e quatro alvos `[data-reveal]`.
- Régua ciano no topo da cena: `line-up`.
- Contador `01 / 15 · ROLE PARA EXPLORAR`: `fade-up`.
- Cabeçalho da versão estreita: dois filhos `fade-up` escalonados.
- Calibre isolado em `src/app/eventos-inovacao/reveal-calibre.ts`.

Ficaram deliberadamente fora: wrapper sticky, palco, previews, cartão central e faixa do carrossel mobile. Assim não há segundo dono de `transform` nem entrada duplicada.

**Evidência por scroll**
Em 1440×900:
- cortina liberada em 1611ms;
- régua acendeu em 1661ms, no `scrollY: 0`;
- contador permaneceu oculto no load e acendeu somente em `scrollY: 500`;
- palco ficou preso por 7200px de rolagem e percorreu `01` a `15` normalmente.

No mobile, os escopos desktop não têm caixa (`display: none`) e o carrossel segue autônomo: `scrollLeft` avançou de 0 para 331 em 8s, sem `[data-reveal]` dentro da faixa ou dos controles.

**Segurança**
- `position: sticky` preservado;
- zero ancestrais transformados;
- geometria da SIS-268 preservada, sem previews sobrepostas;
- `prefers-reduced-motion` e `html[data-motion="reduce"]`: opacidade 1 e `transform: none` em todos os alvos.

**Portões**
- `npx tsc --noEmit`: verde.
- `npm run build`: verde; rota continua estática.
- `npx eslint src scripts`: 0 erros (16 avisos preexistentes).
- O lint global continua encontrando 31 erros somente em `.claude/worktrees/.../.next/**`, artefatos de outra frente.
- Copy-lock continua vermelho por literais de `ContactCTA*.tsx` e `RevealScope.tsx`, de outras frentes; nenhum arquivo desta issue adicionou copy.

A auditoria pré-despacho corrigiu duas premissas: o bloqueio da SIS-269 já caiu (`src/app/contato/reveal-calibre.ts` com `rootMargin: 0px 0px -12% 0px`, limiar `0.15`); a rota não tem CTA estático ativo, então “revelar CTA” não se aplica. Contrato: jamais reveal/transform no wrapper sticky; não dar segunda entrada a previews, cartão central ou carrossel mobile; não revelar o hero/LCP de novo; comprovar cadência por `scrollY`.

### Conferência
Sem registro de conferência no Linear. A entrega declara fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/app/eventos-inovacao/reveal-calibre.ts`
- `src/app/eventos-inovacao/page.tsx`
- `src/components/events-spotlight.css` (bloco aditivo)
- `scripts/medir-reveal-eventos-sis272.mjs`
- `docs/medidas/reveal-eventos-sis272.json`

---

## SIS-268 — /eventos-inovacao · aproximar ainda mais as previews do card central

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-268/eventos-inovacao-aproximar-ainda-mais-as-previews-do-card-central

### Pedido
Em `/eventos-inovacao` (`EventsSpotlight`), aproximar ainda mais as miniaturas laterais da imagem/cartão principal. A SIS-232 estreitou a banda de recuo `left`/`right` das vagas (14–26%) sem mexer em `--evt-faixa-w` nem nos insets das colunas; esta issue é só o vão coluna ↔ card. Onde mexer: `src/components/events-spotlight.css` — `.eventos-destaque-coluna--esq` / `--dir` (`left`/`right: clamp(7.5rem, 8.5vw, 10rem)`), banda `%` das `.eventos-vaga`, eventualmente miolo do cartão. Revalidar com sonda: zero sobreposição vaga↔cartão / vaga↔vaga; fio ciano `--destaque` coerente; 1024 e 1366. Em 1440, o vão deve cair de forma óbvia vs. o print pós-232. Fora de escopo: copy/YouTube, bandas navy, carrossel mobile, reabrir “maiores” como meta. Aceite: previews claramente mais perto; sem sobreposição; rótulos inteiros; fio OK; capturas antes/depois 1440 (+ 1024 se mexer no piso); lint OK.

### O que foi feito
Várias passagens no Linear, todas em `src/components/events-spotlight.css`.

**Primeira entrega (fechada sem conferência, a pedido da usuária).** A aproximação não veio de estreitar mais a banda de recuo (a SIS-232 já tinha chegado ao fio dela), mas de inverter a âncora das vagas: as duas colunas passam a encostar na borda da faixa virada para o cartão, e o recuo do `nth-child` só sabe afastar. Com isso a largura da miniatura sai da conta da distância — antes a vaga ímpar (`--evt-prof: .86`, ~37px mais estreita em 1440) somava recuo maior com largura menor e ficava a 101px do cartão enquanto a par estava a 26px.

1. **Âncora invertida.** `margin-left: auto` saiu de `--dir` e foi para `--esq`; a banda passou de `left/right: 14–26%` (borda externa) para `right/left: 1–9%` (borda interna). O defeito da SIS-204 — recuo empurrando a miniatura para cima do cartão — deixa de ser aritmética e passa a ser impossível por construção.
2. **Faixa transladada, não alargada.** Inset `clamp(7.5rem, 8.5vw, 10rem)` → `clamp(7.5rem, 8.9vw, 10.5rem)`. A folga contra o `ScrollSpy` sobe de 30 para 36px em 1440. Em 1024 e 1280 nada se move — governa a perna mínima de 7,5rem.
3. **Piso da banda em 1% e não 2%**, porque em 1366 com 2% a vaga mais próxima ficava 2,5px mais longe do que antes da issue.
4. **Ritmo irregular preservado**, espelhado dentro de cada paridade (16/14/17/14 → 8/9/7/9 · 25/26/24/26 → 2/1/3/1). Amplitude do zigue-zague de ~69px para ~19px em 1440.

Medido pela sonda, seis janelas (1024 · 1280 · 1366 · 1440 · 1600 · 1670): em 1440 esq o vão da vaga mais distante 101,5 → **44,0** px; mais próxima em repouso 25,8 → 12,6; no pior quadro da flutuação 16,8 → **3,6**. 1440 dir: 99,9 → **41,9**; 29,3 → 18,8; 20,3 → **9,8**. 1024 esq: 75,2 → **35,0**; 27,6 → 11,5; 18,6 → **2,5**. 1366 esq: 98,8 → **55,5**; 26,9 → 26,4; 17,9 → 17,4. Zero `vagasCobrindoCartao`, `rotulosCortados` ou `paresApertados`. Transbordo externo negativo (folga) maior que antes (−34,5 → −64,3 em 1440). `tsc --noEmit` limpo. `eslint .` sem achado novo (79: 31 erros / 48 avisos pré-existentes). `npm run test:copy` falha por literal de `RevealScope.tsx:59` (`portao?.liberado ?? true`, commit `13224ec` / SIS-263), fora desta issue.

Sugestões não executadas na primeira passagem: folga mínima fina na flutuação (3,6px em 1440 e 2,5px em 1024); nota CSS com número velho (21,4px vs. 12,6 medidos); 1366 mal se moveu na vaga mais próxima.

**Reparo visual após retorno da usuária — sem conferência.** Pedido: manter previews horizontalmente próximas; espalhá-las mais verticalmente; zero sobreposição; validar 1024/1366/1440. Aplicado: colunas ancoradas na largura do cartão; faixa vertical ampliada; fio ciano corrigido para terminar antes da borda do cartão. Folga faixa↔cartão: **18,3–18,4px** em todas as janelas de 1024 a 1920 (antes 79,1px em 1600 e 95,7px em 1670). Vão vertical médio à esquerda: 1024 16,2 → **25,5px**; 1366 7,6 → **16,5px**; 1440 10,1 → **21,7px**; 1600 8,0 → **20,6px**; 1670 11,1 → **23,3px**. Sobreposição preview↔preview e preview↔cartão: **0**. No pior quadro da flutuação restam ~**11px** até o cartão. `npm run build` verde. Pasta `.tmp-sis268/` apagada a pedido da usuária.

**3º ajuste — afastar levemente e dar contraste perto/longe.** Pedido da usuária: “afaste levemente os preview mas levemente e deixe um mais perto um mais longe levemente”. `--evt-folga-cartao`: `1.15rem` → **`1.45rem`** (18,4 → 23,2px). Banda de recuo: pares (`--evt-prof: 1.06`) de `0.01–0.03` para `0.02–0.04`; ímpares (`0.86`) de `0.07–0.09` para `0.10–0.12`. `--evt-faixa-estiro` e `--evt-passo` intactos. Medido perto–longe / amplitude: 1024×768 20,0–32,6 → **26,3–42,1** (12,6 → **15,8**); 1366×768 20,8–40,1 → **28,0–52,2** (19,3 → **24,2**); 1440×900 21,1–42,8 → **28,6–55,7** (21,7 → **27,1**); 1600×900 21,1–43,1 → **28,7–56,1** (22,0 → **27,5**); 1670×940 21,3–44,2 → **28,9–57,6** (22,9 → **28,7**). Piso subiu 6,3–7,6px. Margem no pior quadro: 1024 10,1px → **16,5px**; 1440 11,0px → **18,5px**. Recuo máximo 0,12 contra teto 0,263 em 1366. Folga contra o `ScrollSpy`: 87,6px em 1440, 142px em 1366, 157,9px em 1600, 183,7px em 1670. Fio ciano continua morrendo 1px antes da borda do cartão. `npx tsc --noEmit` verde; `npm run build` verde; `npx eslint src scripts` 0 erros (16 avisos preexistentes). Evidência em `docs/medidas/sis268-calibre-{antes,depois}.json` e dez capturas `docs/capturas/sis268-calibre-*`.

### Conferência
Sem registro de conferência no Linear. As entregas declaram fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `docs/medidas/sis268-calibre-antes.json`
- `docs/medidas/sis268-calibre-depois.json`
- `docs/capturas/sis268-calibre-*`

---

## SIS-267 — Arte · logo Picsel em alta qualidade (PNG + transparente)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-267/arte-logo-picsel-em-alta-qualidade-png-transparente

### Pedido
Backlog da Maria — conteúdo/arte. Não despachar ao executor até existirem PNGs HD no repo. Obter a logo Picsel em alta qualidade e substituir `public/images/Picsel-logo.png` (card parceiro, `src/data/partners.ts`) e `public/images/Picsel-logo-transparente.png` (BrandGrid / `src/data/clients.ts`, variante da SIS-91). Entregar PNG vetorial-nítido (ou export HD ≥2×), variante com fundo transparente de verdade, trocar os dois caminhos, conferir contraste no BrandGrid e no card. Os dois PNGs já existem mas estão pixelados; a transparente foi derivada do opaco, não é arte oficial HD. Fora de escopo: redesign do card / outras logos. Aceite: arquivos HD no lugar; transparente sem caixa de fundo; nítida a 1440; lint OK.

### O que foi feito
Sem relatório de entrega no Linear.
O histórico de estados só registra passagem de Backlog (desde 15/09/2026 13:32 UTC) direto para Done em 15/09/2026 18:39 UTC, sem In Progress, In Review nem comentários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-254 — /esg SOCIAL · foguete do scroll = foguete.png (substitui SVG atual)

**Status:** Done · **Labels:** — · **Fechada em:** 14/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-254/esg-social-foguete-do-scroll-foguetepng-substitui-svg-atual

### Pedido
Na seção SOCIAL de `/esg`, o foguete que acompanha o scroll (`FogueteScroll`) deve substituir o SVG interno por `public/images/esg/foguete.png`. Manter trajeto, sticky/progresso e reduced-motion. Componente em `src/components/ui/FogueteScroll.tsx`; montado em `src/app/esg/page.tsx`. Preferir `next/image`; preservar wrapper de scroll, `aria-hidden`, `pointer-events-none`, z-index atrás do texto. Ajustar tamanho/aspecto; medir contraste AA do texto SOCIAL no pior ponto (390 / 1024 / 1440). Se 1,7 MB for pesado, servir WebP. Reduce: foguete parado e visível no meio do trajeto. Pedido extra (14/09/2026): movimentar-se mais pela seção (curso vertical e, se couber, lateral), ainda confinado a SOCIAL (SIS-207). Fora de escopo: selo Gerando Talentos, fotos/cards SOCIAL, ENVIRONMENT / GOVERNANCE. Aceite: arte visível é `foguete.png`; acompanha o scroll; trajeto no miolo; texto AA; reduce parado e visível; capturas; lint OK.

### O que foi feito
Comentário de entrega (sem heading `## Entrega`): SVG saiu. Scroll serve `public/images/esg/foguete-scroll.webp` (360×1044, 57.128 B, alfa). PNG fonte (~1,68 MB) não vai no request.

**Trajeto (pedido extra).** Curso `[-34, 28, -6]svh` → 6 pontos / 112svh: `[-60, -22, 52, 18, -18, 18]svh`. Lateral máx. 4% → 22vw. Presença medida 11/11 passos em 390/1024/1440 (começo, miolo, fim). Recorte `overflow-clip`; 0 px nas seções vizinhas.

**Contraste sob a arte.** 4,56:1 / 4,63:1 / 4,64:1. Opacidade 0,14 (PNG 3D opaco).

**Reduce.** Parado visível no miolo (`18svh`, `-12vw`).

**Portões.** tsc OK. Lint dos arquivos da issue OK. `npm run lint` vermelho por `scripts/medir-indicadores-sis256.mjs` (concorrente, fora de escopo). Build não rodado para não disputar `.next`.

Capturas: `docs/capturas/sis254-final-{390,1440}-p{2,5,8}.png`.

Após a conferência reprovada (arte ilegível em `opacity-[0.14]`), a usuária pediu opacidade maior em comentários sucessivos: camada de volume `0,08` → `0,28` (cor segue `0,95`); depois “levemente opaco” `0,28` → **`0,18`**; depois “subir um pouco” para **`0,24`**. Fechamento: WebP no scroll (não o SVG); trajeto pelo miolo da SOCIAL; reduce parado; camada de cor `0,95` + volume **`0,24`**. Contraste em `0,24` não foi re-medido nesta última passada.

### Conferência
**VEREDITO: REPROVADO** (rodada 1/3). A troca de arquivo está feita (WebP, sem SVG, curso no miolo, AA ≥ 4,5:1, reduce parado, sem vazamento). O que falha é a leitura da arte: em 0,14 o shuttle 3D some no miolo (capturas p5 390/1440: mancha pastel). Reparo pedido em `src/components/ui/FogueteScroll.tsx` (`opacity-[0.14]`): parecer o `foguete.png` (nariz laranja, boosters azuis, chamas) e manter ≥ 4,5:1 sob glifo. Prova: capturas 390/1440 no passo do miolo com arte reconhecível; script de contraste ainda ≥ 4,5:1 nas três larguras. Não é reparo: vaivém do `y` (3 inversões) atende o extra “mais curso”; lint global de `medir-indicadores-sis256.mjs`; 3,78:1 nos cards Huerta/Aguas. Não há segundo comentário de conferência após os ajustes de opacidade; a usuária validou o visual (“ficou bom”) e pediu para fechar, sem nova conferência.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `public/images/esg/foguete-scroll.webp`
- `docs/capturas/sis254-final-{390,1440}-p{2,5,8}.png`

---

## SIS-245 — /contato · Onde Estamos: endereço Pato Branco, sem link RJ, mapa azul mais claro

**Status:** Done · **Labels:** conferir · **Fechada em:** 14/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-245/contato-onde-estamos-endereco-pato-branco-sem-link-rj-mapa-azul-mais

### Pedido
Em `/contato` → Onde Estamos (`UnitsMap` + lista): (1) Pato Branco com endereço «R. Tamôio, 1495 - Centro, Pato Branco - PR, 85501-031» e Maps (pin/centro/zoom) nesse local; (2) Rio de Janeiro: remover o link para o Maps no card (SP e PB podem manter o CTA); (3) estilo do mapa: azul um pouco mais claro e um pouco de branco (`UnitsMap` + `mapaEstiloEscuro.ts`). Dados em `src/data/contact.ts`. Copy-lock: endereço PB é pedido explícito da usuária. Fora de escopo: SIS-222, trocar provider, redesign. Aceite: PB com Tamôio e mapa apontando para lá; RJ sem link; mapa mais claro e ainda legível; SP inalterado no essencial; capturas; lint OK.

### O que foi feito
Relatório item por item (comentário de entrega).

**1. Pato Branco com endereço e pino no lugar** — `src/data/contact.ts`. Unidade `pr` recebeu `address: 'R. Tamôio, 1495 - Centro, Pato Branco - PR, 85501-031'` (circunflexo de «Tamôio», que o OSM grafa sem). Coordenadas medidas via Nominatim/Overpass: o 1495 não existe como ponto no OSM; interpolação entre 584 (−26.2287966, −52.6739046) e 1706 (−26.2200085, −52.6802556) → **lat −26.2217 / lon −52.6791**. `zoom: 12` → **`zoom: 16`**, o mesmo de São Paulo (zoom de rua, não de fachada). Valores antigos comentados. Cabeçalho do arquivo que dizia que PB e RJ ficam sem endereço foi comentado e anotado: o endereço de PB veio da Sistran nesta issue, não de `.claude/conteudo-site/09-contato.md:25`.

**2. Rio sem link de rota** — `src/components/UnitsMap.tsx`. O CTA passou a depender de `unidade.address`. Queda para a cidade permanece em `mapsHref` (função total). Medido por `getByRole('link')`: São Paulo 1 link; Pato Branco 1 link; Rio de Janeiro 0 links, texto «Endereço não divulgado. O mapa mostra a cidade, não o escritório.»

**3. Azul mais claro com toque de branco.** Degrau ativo é MapLibre + OpenFreeMap (não há `NEXT_PUBLIC_GOOGLE_MAPS_KEY`). Principal em `src/data/mapaEstiloEscuro.ts`; três degraus em sincronia. Valores: fundo `#0e1b2e` → `#16304d`; água `#062036` → `#0e3a5c`; via local `#17293f` → `#24425f`; arterial `#1d3350` → `#2e5175`; expressa `#25456b` → `#3d6b96`; limite `#1f3a5c` → `#325a85`; prédio `#16273e` → `#254a6e`; parque/mata `#102a24` → `#173d33`; rótulo `#8ab4d8` → `#c9def0`; rua `#7fa6c8` → `#aecbe2`; cidade `#a9cbe6` → `#e6f2fc`; rótulo d'água `#3d7ba8` → `#79aed6`; contorno do rótulo `#0a1526` → `#0b1b2c`. `ESTILO_ESCURO` em `UnitsMap.tsx` (Google, dormente): os mesmos treze valores. Mosaico raster: `brightness(0.85)` → `brightness(1)`. Toque de branco nos rótulos e no realce dos prédios, não no fundo.

**4. Extra: troca de unidade com gesto GSAP.** `gsap.from`, `stagger: 0.06`, 0.42s, sem `ScrollTrigger`/`pin`. Com movimento reduzido a animação não é criada; painel aparece pronto inclusive sem JS. `clearProps` no fim.

**Portões.** `npm run lint` → 22 problemas, 0 erros (avisos pré-existentes, nenhum nos arquivos desta issue). `npx tsc --noEmit` limpo. `npm run test:copy` acusou 2 textos novos (endereço de PB e ruído `opacity,transform` de `clearProps`); `npm run copy-lock` → 1654 textos travados; `test:copy` de novo → OK (1193 distintos).

**Capturas.** Script `scripts/capturar-onde-estamos-sis245.mjs`; imagens em `docs/capturas/sis245-{paulo,branco,janeiro}-1440.png` (1440×900). Espera do script subiu de 4,5s para 9s porque o `flyTo` para zoom 16 terminava antes dos tiles.

Fora de escopo: SIS-222, provedor, redesenho.

### Conferência
Sem registro de conferência no Linear. A issue permanece com a label `conferir`.

### Arquivos tocados
- `src/data/contact.ts`
- `src/components/UnitsMap.tsx`
- `src/data/mapaEstiloEscuro.ts`
- `scripts/capturar-onde-estamos-sis245.mjs`
- `docs/capturas/sis245-{paulo,branco,janeiro}-1440.png`

---

## SIS-238 — /quem-somos · Premiações: fundo cele.png + layout escritas/logo (exemplcelent)

**Status:** Done · **Labels:** conferir · **Fechada em:** 11/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-238/quem-somos-premiacoes-fundo-celepng-layout-escritaslogo-exemplcelent

### Pedido
Em `/quem-somos` → Premiações (`RecognitionTheater` / `#premiacoes`), retirar as imagens atuais do bloco Celent (troféu + arte LATAM da SIS-230) e montar: fundo `public/cele.png`; logo `public/logo-Celent.png`; formato das escritas como `public/exemplcelent.png`. Copy: «A Sistran foi reconhecida pela Celent com o Technology Standout 2023.» e «A mais alta categoria no quesito tecnologia». Derivar WebP; não publicar «TECNOLOGIA QUE IMPULSIONA O AMANHÃ» se só existir na mock. Teatro sticky dos quatro reconhecimentos continua; mobile legível; contraste e reduce OK. Fora de escopo: percurso 01–04; SIS-221. Aceite: bloco Celent com `cele.png` + logo + textos no formato da referência; troféu/LATAM da SIS-230 não aparecem; copy intacta; peso razoável; mobile + contraste; teatro intacto; capturas; lint OK.

### O que foi feito
Relatório item por item.

**1. Parar de montar `trofeu.webp` / `celentlatam.webp`.** Saíram do TSX os nós `.rec-celent-trofeu`, `.rec-latam`, `.rec-celent-texto`, `.rec-celent-chip` e o fundo navy `.rec-abertura-fundo`. Arquivos continuam no repo; `alt` comentados em `REC_CELENT`. Grep só devolve comentários.

**2. `cele.png` como fundo + WebP derivado.** `scripts/otimizar-capa-celent-sis238.mjs` (sharp, `quality: 80, smartSubsample`). `public/cele.png` → `public/images/quem-somos/celent-capa.webp`: 1672×941, **1460 kB → 79 kB (−95%)**. Capa `object-fit: cover` em toda a faixa a partir de 1024px.

**3. Arranjo de `exemplcelent.png`.** Coluna tipográfica à esquerda: eyebrow, h2, fio vertical + `logo-Celent.png`, as duas frases. Faixa invertida para clara, tinta navy (fatia 0–26% da largura mede rgb(222 240 253), luminância 0.85; texto branco ~1.2:1). Emenda com `.rec-capa-emenda`, degradê até `--palco-fundo`.

**4. `alt` da capa** descritivo. `logoAlt` de `'Celent'` para `'Celent — Technology Standout 2023'`.

**5. «TECNOLOGIA QUE IMPULSIONA O AMANHÃ»** não publicada — não está queimada em `cele.png` nem em conteúdo-site.

**6. Teatro, mobile, contraste, reduce.** Teatro intacto (captura 390: «NOSSA TRAJETÓRIA» e 01–04). Abaixo de 1024px a capa não cobre: tira no fluxo (`contain`, `aspect-ratio: 1672/941`). Contraste (`scripts/medir-contraste-celent-sis238.mjs`, Playwright `deviceScaleFactor: 2`): eyebrow 9.38:1 / 6.34:1; título 11.96:1 / 11.24:1; linha1 11.92:1 / 11.23:1; linha2 7.44:1 / 7.07:1 (1440 / 390). Oito medições OK. `scrollWidth == clientWidth` em 1440 e 390. Reduce: cinco nós da coluna com `opacity: 1` e `transform: none` nas duas fontes de preferência.

**7. Capturas e lint.** Capturas 1440 e 390, antes e depois, em `docs/capturas/`. `npm run lint`: 22 warnings, 0 errors. `npx tsc --noEmit` sem saída.

Bugs corrigidos no caminho: `inset: 0` em filho `absolute` de container `grid` não resolve contra a faixa — só `grid-row: auto` devolve os 806px; `padding-block` do desktop desceu para `.rec-wrap`. Altura da faixa derivada da arte: `min-height: clamp(540px, 56vw, 880px)`; `object-position: 62% 22%`.

Fora de escopo registrado: `ScrollSpy` com `tom` por seção não expressa faixa metade clara / teatro navy; sugerida issue própria.

### Conferência
Sem registro de conferência no Linear. A issue permanece com a label `conferir`.

### Arquivos tocados
- `src/components/RecognitionTheater.tsx` (implícito no relatório: nós `.rec-*` e `REC_CELENT`)
- `scripts/otimizar-capa-celent-sis238.mjs`
- `scripts/medir-contraste-celent-sis238.mjs`
- `public/images/quem-somos/celent-capa.webp`
- `docs/capturas/`

---

## SIS-165 — Números: refazer a seção "Sistran em números" exatamente como numeros.png

**Status:** Done · **Labels:** — · **Fechada em:** 07/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-165/numeros-refazer-a-secao-sistran-em-numeros-exatamente-como-numerospng

### Pedido
Refazer a seção dos sete indicadores exatamente como `public/imagensexemplo/numeros.png`: sobretítulo `SISTRAN EM NÚMEROS`; título serifado “Resultados que constroem nossa história” com `história` em ciano; parágrafo de apoio; sete indicadores numa linha com fios, número serifado, `+` ciano, halo, rótulo; eixo com sete pontos (seis acesos, último vazado); três microrrótulos; fundo navy com foto, curvas e malha. Onde: `Metrics.tsx`, `metrics.ts`, `globals.css`, `ProofJourney.tsx`. Pontos críticos: decidir se desliga o modo dirigido (340vh) em desktop; comentar o que sair; possível revelação vs. composição fixa; duplicata `23+23+` no DOM; conflito de serifa com SIS-155; remedir contraste vs. SIS-61; `caption` comentadas, não apagadas; textos novos precisam de origem (Regra Zero); layout 320–1670; reduce com valor final, nunca 0. Aceite inclui decisão do item 1 registrada; contraste anotado; `npm run build` limpo; o que sair comentado no lugar.

### O que foi feito
**Decisão do item 1 (registrada):** os sete indicadores ficam numa fileira única, sempre no mesmo lugar, e se acendem conforme a rolagem sobre essa linha estática (leitura (b) do item 3). O modo dirigido saiu de desktop: 340vh, interior `sticky`, trilha horizontal, lente, onda, nós, faixa de atalhos e marcador `03 / 07` — tudo comentado no lugar, com motivo e valores, no TSX e no CSS. O gate virou `const dirigindo: boolean = false;` em `Metrics.tsx`.

**Contraste** — medido com `docs/medidas/sis165/contraste.mjs`, sobre o navy `#041b3d`. Sobretítulo `SISTRAN EM NÚMEROS` **12,55:1** (piso 4,5); `seguros.` serifada ciano **8,77:1**; `ROLE PARA REVELAR` **9,24:1**; rótulo **11,52:1**; número **11,20:1** (piso 3,0); `+` ciano **11,93:1**; estado apagado (0.55) **5,69:1 / 4,59:1**. O piso de opacidade é 0.55 e não 0.45 — em 0.45 dá 4,21:1 / 3,58:1 e reprova. Armadilhas documentadas no CSS: `ROLE PARA REVELAR` lia 2,32:1 por causa de `.impact-role-fio` no rect; número e `+` liam 1,00:1 por `background-clip: text`.

**Layout** — `docs/medidas/sis165/probe.mjs`. Colunas **1 / 2 / 4 / 7 / 7 / 7** em 320 / 768 / 1024 / 1280 / 1440 / 1670. Sem rolagem horizontal. Rótulo nunca abaixo de **16px** (`0.95rem` → `1rem`). Em 1280+ quem cede é o número: `clamp(2rem, 4.2cqi + 1.4rem, 3rem)` via container query. Pior caso “Mil horas de Capacidade Produtiva no Brasil”: 4 linhas em 1280, 2 linhas em 320.

**Acessibilidade e movimento** — `docs/medidas/sis165/comportamento.mjs`. `data-observando` só é escrito depois da primeira conferência de rect; sem JS / reduce os sete ficam acesos com o valor final. O `Set` só cresce. Pulo por cima da seção: zero indicadores apagados e zero valores em 0. `IntersectionObserver` trocado por `getBoundingClientRect` no `scroll` (passivo; o ouvinte se remove quando o sétimo acende).

**Item 4.** Duplicação `23+23+` não é defeito: gabarito de largura. `textContent` dá `"919850"`, `innerText` dá `"850"`, gabarito em `visibility: hidden` + `aria-hidden`. AT anuncia um número.

**Item 12.** `geometria.ts` continua com consumidor vivo: `coord` usado por `ImpactVisuais.tsx` também no modo lista.

**Regra Zero (item 8).** Parágrafo de apoio e os três microrrótulos não entraram; lugar reservado em `Metrics.tsx:927-945`. Título segue “Escala que transforma o mercado de seguros.” com a última palavra em ciano. `ROLE PARA REVELAR` entrou como instrução de interface. Sete `caption` comentadas em `metrics.ts:32,40,48,56,64,72,80`. Sem foto de prédio: curvas e malha são CSS/SVG `aria-hidden`. Serifada peso real 400 e `font-synthesis: none` (`Instrument Serif`).

**Portões.** `tsc --noEmit` silencioso · `eslint` 18 avisos / 0 erros · `next build` exit 0 · dev `/` 200.

Decisões pré-despacho (comentários na issue): item 8 estacionado; item 11 sem foto do prédio; item 5 serifa fica por precedente da SIS-155 estacionada; `ATERRAR_INICIO` não existe mais (`ETAPAS_FIM_PADRAO = 0.94` + medição); rodapé da home é `BrandGrid`, não `SignalMarquee`.

### Conferência
Aprovada. Construção verificada na árvore. `conferir` removido, **Done**. Confere: captions comentadas; alcançabilidade por construção (`.impact-lista[data-observando]`); piso 0,55 justificado (5,69:1 / 4,59:1); colunas 1/2/4/7; item 4 encerrado; `geometria.ts` com consumidor. Adendos: `SmoothScroll.tsx:103-104` registra que `window.scrollY` fica atrasado no Lenis — `getBoundingClientRect` é imune; gabarito de 23 rende **25**, não 23. Nenhuma pendência funcional. Estacionado com quem pede: cinco escritas do item 8 e a decisão de o modo dirigido de 340vh ficar fora para sempre ou voltar.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/data/metrics.ts`
- `src/app/globals.css`
- `src/components/ImpactVisuais.tsx`
- `docs/medidas/sis165/contraste.mjs`
- `docs/medidas/sis165/probe.mjs`
- `docs/medidas/sis165/comportamento.mjs`

---

## SIS-161 — /quem-somos — deixar a seção de escritórios exatamente igual à referência mapaescritorio.png

**Status:** Done · **Labels:** — · **Fechada em:** 07/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-161/quem-somos-deixar-a-secao-de-escritorios-exatamente-igual-a-referencia

### Pedido
A seção “Escritórios BRASIL” de `/quem-somos` deve ficar exatamente igual a `public/imagensexemplo/mapaescritorio.png`: coluna esquerda (olho, título, régua, abas em pílula, linha com ponto, cartão); direita mapa do Brasil com divisas, dois pinos, rota pontilhada, legenda `PATO BRANCO – PR / 26.229° S · 52.671° W`; fundo claro com curvas e anéis; sem prédio 3D. Onde: `OfficesScene.tsx`, `BrazilOfficesMap.tsx`, `globals.css` (`.bm-*`, `.os-*`), `quem-somos/page.tsx`. Decidir destino da partitura de rolagem e da torre 3D. Divisas no mesmo `viewBox="0 0 720 640"`. Abas com `role="tablist"`, `aria-selected`, alvo 44px. Abaixo de 1024px e reduce: seção completa. Contraste AA. O que sair comentado no lugar. Aceite: composição de uma tela em largo; divisas alinhadas; fundo decorativo `aria-hidden`; rota pontilhada; legenda junto ao pino sem regressão SIS-96; cartão à esquerda; teclado; `npm run build` e `npm run lint`.

### O que foi feito
Cena refeita em `OfficesScene.tsx` / `BrazilOfficesMap.tsx` / `globals.css`.

**Decisões (pontos 1, 2 e 9).** A partitura virou só a ENTRADA: `ENTRADA_DURACAO = 3.2` escreve `--os-contorno`, `--os-entrada`, `--os-divisas`, `--os-rota` e `--os-p`; termina em `escrever(1)` e a troca é por aba. Guarda: se a seção já está na tela, a entrada parte na hora (`escrever(0)` deixaria o mapa em branco). Torre 3D saiu, comentada. Rota pontilhada; pulso removido.

**Divisas (ponto 3).** `scripts/gerar-divisas-brasil.mjs`, mesmo `viewBox` 0 0 720 640 — `escalaX 12,45` / `escalaY 13,113`, caixa geográfica `lon −73,99…−34,79` / `lat −33,75…5,27`. Só fronteiras compartilhadas, nunca a costa. 65 polilinhas, 608 pontos, `d` de 7 050 caracteres (`TOLERANCIA = 0,9`, `MINIMO = 4`). Curvas de relevo comentadas (eram o substituto).

**Bugs de layout achados pela sonda.** (1) `.bm-palco` ainda `position: absolute; inset: 0` — `.os-mapa` colapsava para 806×0 e o mapa pintava 1642×730 a partir de x = −74; corrigido com `position: relative; inset: auto`. (2) Câmera vazava 42px para dentro do texto; `.os-mapa` passou a `overflow: clip`.

**Contraste AA** — `scripts/medir-contraste-escritorios.mjs`. Zero reprovações finais: 11 alvos × 4 larguras (1024/1366/1440/1728) × 2 abas. Aba ativa 5,01–5,16; inativa 10,30–10,38; olho 13,17–13,26; título `Escritórios` 13,24; `BRASIL` 3,24 (piso 3,0); nome no cartão 15,37–15,56; texto 9,30–9,43; rótulo PR / coordenada 10,87–11,29 / 5,26–5,86. Três reprovações reais corrigidas: rótulo PB a 1,02:1 (letras sobre navy; `H392` → `H412`, x=396 → x=416); `BRASIL` a 2,95:1 (máscara `linear-gradient(90deg, transparent 0 44%, #000 62%)`); etiqueta PR a 1,65:1 no trecho SP (recuo `g[data-cidade="pr"]:not(.bm-rotulo)`). SIS-96: rótulo não nasce atrás do cartão. Pinos: ativa tríade halo/anel/nucleo; inativa `bm-gota`. Abas `min-height: 44px`; `:focus-visible { outline: 2px solid #0ed8f6; outline-offset: 3px }`. Título mudou de casa sem mudar `id` (`aria-labelledby="escritorios"`). `.section-light .text-gradient-brand` termina em `#7c3aed` — não mexido (global).

**Portões da primeira entrega.** `npx tsc --noEmit` limpo · eslint 18 avisos / 0 erros · `npx next build` exit 0 · `/quem-somos` 200. Aviso: build passou com comentário CSS aninhado que fazia o `next dev` devolver 500.

**Adendo após conferência (padrão de abas).** Abas ganharam `id={`os-aba-${c.id}`}`; painéis `role="tabpanel"` + `aria-labelledby`. `inert` + `aria-hidden` no escondido, não `hidden` (mesma célula de grade, altura do mais alto). Medido 1440×900: ambos painéis 604px; 390×844 modo lista: zero `role="tab"`, cidades empilhadas 538 e 489.

**Reparo após devolução (mapa cortado).** Duas causas: (A) câmera na `transform` de `.bm-mapa` — passou para `<g class="bm-camera">` dentro do SVG; folga coluna 41 / 54,6 / 57,6 / 66,8px em 1024 / 1366 / 1440 / 1670. (B) `--os-foco-y`: `pr` −5% → −1%; `sp` −2% → +3%. `paisCortado: false` nas oito combinações; respiro topo 5,1–11,7px, embaixo 34,6–81,9px. Olho `ESCRITÓRIOS` passou a `aria-hidden`. Texto do `<title>` do SVG mudou para `<span id="bm-titulo" className="sr-only">` fora do SVG (tooltip nativa = 0). Reduce: `.bm-camera` não recebe `transform` porque a regra é `[data-modo="scroll"]`. Portões do reparo: tsc silencioso · eslint 18/0 · `next build` exit 0 · `/quem-somos` 200.

### Conferência
Primeira conferência: **APROVADA, com UM adendo** — padrão de abas incompleto (`tabpanel` ausente; inativo só com `opacity: 0`, as duas cidades anunciadas). Etiqueta `conferir` retirada; ficou In Review até o adendo. Adendo implementado (ver acima). Depois, devolução por quem pediu: mapa cortado em cima e embaixo (escala efetiva 1,14 / 1,22 em repouso + `overflow: clip`); olho duplicado; tooltip nativa — **não era a conferência completa**. Após o reparo: **aprovada, com um adendo de comentário** (`globals.css:5656-5658` ainda diz que o bloco zera a câmera, mas a câmera não mora mais em `.bm-mapa`; não é defeito funcional). `conferir` removido, **Done**. Folgas e portões citados são relato do agente; sondas em `docs/medidas/sis161/`.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/app/quem-somos/page.tsx`
- `scripts/gerar-divisas-brasil.mjs`
- `scripts/medir-contraste-escritorios.mjs`
- `docs/medidas/sis161-contraste.json`
- `docs/medidas/sis161/` (`nome-acessivel.mjs`, `recorte.mjs`, `recorte-pais.mjs`)

---

## SIS-98 — Seção “Nossa essência”: só dá para ler parte da Missão — o scroll já abre o próximo item

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-98/secao-nossa-essencia-so-da-para-ler-parte-da-missao-o-scroll-ja-abre-o

### Pedido
Na seção Nossa essência, o item Missão não pode ser lido por inteiro: o texto é cortado no rodapé e, ao rolar para continuar, o próximo item já abre (gesto de “ler mais” vira “avançar”). Comportamento desejado: ler o item do começo ao fim e só depois avançar; painel cabe na viewport ou rola internamente; alternativa: acordeão por clique. Título “Missão” duplicado (faixa + painel) — definir qual permanece. Testar 1366×768 e menores; repetir em Visão/Valores; reduce e teclado. Aceite: Missão inteira sem abrir o próximo; painel cabe ou rola; troca só após o fim; título não duplicado; 1920×1080, 1366×768 e mobile; reduce; teclado.

### O que foi feito
Resolvido em `src/components/EssenceAccordion.tsx` e `src/components/essence-accordion.css`.

**Causa raiz:** `ativa` tinha dois donos. Além do clique, um ScrollTrigger derivava a faixa aberta da posição de rolagem (SIS-79). Como a seção mede mais de uma tela, o painel aberto fica abaixo da dobra — e o gesto de “continuar lendo a Missão” era o mesmo que trocava para Valores. O avanço por rolagem saiu; o dono de `ativa` volta a ser só o clique/teclado.

**Causas secundárias:** `min-height: 430px` fixo + até 172px de padding passava de 600px de painel. Num 1366×768, com as três faixas (~350px) e o cabeçalho fixo, a Missão terminava cortada. Agora `min(430px, 43vh)`, mais `@media (min-width: 768px) and (max-height: 860px)` que encolhe só o respiro. O `h3` dentro do painel (título duplicado) foi removido.

Abrir uma faixa agora traz a faixa para a tela via `__lenis.scrollTo` (Lenis ignora `window.scrollTo` feito por fora — medido, a página não saía do lugar e os Pilares paravam em `top: -295`). A medição espera a transição de altura do CSS; num `requestAnimationFrame` o botão estava ~490px mais abaixo.

**Medido em build de produção, 1366×768:** Missão texto 230→324, nota termina em 415 (janela 768). Pilares após clique: painel 254→743, último pilar em 675. Faixa não troca sozinha em 10 passos de roda — em 1920×1080, 1366×768, 390×844 e 1366×768 com movimento reduzido. 0 `h3` nos painéis, ArrowDown abre Valores, os três conteúdos alcançáveis, 0 erro de console. `tsc --noEmit` limpo; lint 25 avisos / 0 erros (baseline).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EssenceAccordion.tsx`
- `src/components/essence-accordion.css`

---

## SIS-94 — Hero de Soluções, Serviços e Consultoria: vídeo de fundo controlado pelo scroll

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-94/hero-de-solucoes-servicos-e-consultoria-video-de-fundo-controlado-pelo

### Pedido
Vídeo atrás do hero de Soluções, Serviços e Consultoria, controlado pelo scroll (`currentTime`, não autoplay em loop). Asset: `public/videos/Hands_typing_on_keyboard,_digita…_202609011608.mp4` (~6,3 MB); existe variação ~11,8 MB — escolher um, remover o outro, renomear para slug limpo. Overlay para legibilidade; reaproveitar padrão do `hero-scroll.mp4` da home; `muted`, `playsinline`, `preload="auto"`, poster WebP; seek só após metadados. Atenção a peso (CRF ~28, `-an`, `+faststart`), mobile, reduced-motion, z-index vs. header e barra “NESTA PÁGINA”. Aceite: vídeo avança/retrocede com o scroll; slug limpo e duplicado removido; comprimido com poster e faststart; título/lema/barra legíveis; fallback mobile e reduce; sem tela preta no primeiro paint.

### O que foi feito
**Asset.** Escolhido o take citado (6,6 MB) em vez da variação (11,8 MB) — ambos 1920×1080, 24 fps, 10 s. Reencodado all-intra a 1280 de largura, CRF 32, `-an`, `+faststart` → `public/videos/solucoes-hero-scroll.mp4`, **2,8 MB**. Pôster `solucoes-hero-scroll-poster.webp`, **48 KB**. Originais de nome longo removidos.

**Implementação.** Novo `src/components/ui/HeroVideoBackdrop.tsx`: envolve a abertura (hero + barra “NESTA PÁGINA” são irmãs). Relógio: `scrollYProgress` do wrapper (`start start` → `end start`); busca no `ScrollVideo`. Primeiro render (servidor e cliente) só pôster `<img>`; vídeo só depois de montar, só se janela larga e movimento permitido. Corte em 1024px (mesmo do `ProofJourney`). CSS `.hero-backdrop*` no `globals.css`: base navy, véu em duas camadas, `z-index` explícito.

**Correções na medição.** Véu inicial (82/62/88% + 46% chapado) deixava o take invisível → 66/34/74% + 16%. Camadas passam a subir atrás do header na distância do `pt` do `<main>` (`-7rem`, `-9rem` em md+).

**Medições (produção).** 1440×900 e 1366×768: `<video>` readyState 4, 10 s, `currentTime` 0 no topo e 9,95 após ~1000 px. 390×844 e reduced-motion 1440×900: `<img>` (pôster). Contraste do título branco contra fundo amostrado: **11,0:1** no topo e **8,9:1** no meio. Véu z-index 1, conteúdo 2. Primeiro paint: azul da página, sem retângulo preto. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; build ok.

Ressalva: vídeo discreto de propósito — véu mais fraco cairia o contraste abaixo das outras aberturas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/HeroVideoBackdrop.tsx`
- `src/app/globals.css`
- `public/videos/solucoes-hero-scroll.mp4`
- `public/videos/solucoes-hero-scroll-poster.webp`

---

## SIS-93 — Soluções / “Tecnologia Disruptiva”: aplicar o mesmo fundo azul claro da seção Consultoria

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-93/solucoes-tecnologia-disruptiva-aplicar-o-mesmo-fundo-azul-claro-da

### Pedido
Na seção Soluções — “Tecnologia Disruptiva”, trocar o fundo pelo mesmo azul claro da Consultoria (gradiente suave, quase branco no centro, saturado nas bordas, textura de grid). Extrair para token/classe compartilhada; reavaliar contraste AA; emendas sem linha dura. Aceite: mesmo gradiente e textura; fundo num único lugar; contraste verificado; emendas; desktop largo, notebook e mobile.

### O que foi feito
“Tecnologia Disruptiva” (`src/components/Accelerators.tsx`) passou a usar a mesma classe da Consultoria, `section-light section-light-blue`, já definida uma vez em `src/app/globals.css`. Textura de grade (`.section-light::before`, `--grade-modulo`) e pontilhado (`::after`) vêm de brinde. Computed style: `backgroundImage` idêntico ao de `#consultoria`.

O fundo sozinho quebraria a seção: `.section-light` pinta `h3`/`p`/`span` de navy. Cada card ganhou `on-dark`. Link “Conheça o …” com cor por `style` (a regra `.section-light .on-dark a` usa `!important`). Sombra dos cards de `rgba(3,26,52,0.5)` para azul da marca em opacidade menor. Cabeçalho `text-ink` / `text-ink-muted`; selo “7 aceleradores” com borda `#0079CB/22`, base branca, texto `#0060a8`. Orbs de `-z-10` para `z-0` com conteúdo em `z-10` (`isolation: isolate`). Violeta `#A78BFA` virou ciano da marca.

**Contraste** (fundo #e3f1fb): título “Soluções” 14,50:1 · lead 6,30:1 · selo 14,50:1. Dentro do card navy (#083156): h3 branco ≈ 12,6:1, corpo 88% ≈ 11:1, link `#A5F0FF` ≈ 10:1. Idêntico em 1440×900, 1366×768 e 390×844.

**Emendas.** `box-shadow: 0 0 54px 18px rgb(227 241 251 / 45%)` na variante azul-claro, para as duas seções. Emenda de cima suave; a de baixo melhorou menos (seção seguinte opaca pinta por cima). Efeito colateral: alternância de `/solucoes` deixou de ser escuro→escuro→claro→escuro.

`tsc --noEmit` limpo, `npm run build` ok, `npm run lint` no baseline (25 warnings, 0 erros).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Accelerators.tsx`
- `src/app/globals.css`

---

## SIS-92 — Seção “Desafios no desenvolvimento de software”: textos sobrepostos entre etapas

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-92/secao-desafios-no-desenvolvimento-de-software-textos-sobrepostos-entre

### Pedido
Na seção “Desafios no desenvolvimento de software”, textos das etapas ficam sobrepostos. Em “Validar e evoluir”, o parágrafo embaralha com o da etapa anterior. Causa provável: crossfade com dois blocos `position: absolute` legíveis ao mesmo tempo. Garantir `opacity: 0` + `visibility: hidden` / `pointer-events: none` na etapa que sai; conferir todas as etapas e scroll reverso; linha divisória não deve atravessar o texto; reduce alcançável. Aceite: um texto legível por vez; sem resíduo; linha não atravessa; frente e verso; reduce.

### O que foi feito
Corrigido em `src/components/legacy/ImpactSequence.tsx`.

Causa: cada capítulo entrava em `[at - 0.07, at]` e saía em `[at + 0.24 - 0.07, at + 0.24]`. A janela de saída de um é idêntica à de entrada do próximo — no modo dirigido os três dividem `grid-area: cap` em `legacy.css`. Nesses 0.07 havia dois parágrafos meio opacos; o `border-top` do que saía cruzava o texto do que entrava. Acontecia nas duas transições; a última chamava mais atenção por ser o parágrafo mais longo.

A troca passou a ser encadeada: `fimSaida = at + CAP_PASSO - CAP_BORDA`. `0.24` virou `CAP_PASSO`. Capítulo fora de cena recebe `visibility: hidden` (`useVisibilityGate`). Em fluxo (sem JS, abaixo de 1024px, reduce) nada mudou: três colunas, piso de opacidade 0.28.

Validado no build de produção, `/` a 1600×900, 260 amostras em cada sentido: **0 quadros com dois capítulos legíveis ao mesmo tempo**; cada um chega a `opacity: 1`. Com reduce e 900px de largura, modo fluxo, os três legíveis. 0 erros de console. `tsc --noEmit` limpo, lint 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/ImpactSequence.tsx`

---

## SIS-91 — Faixa de logos de parceiros: reduzir a altura (está muito grossa)

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-91/faixa-de-logos-de-parceiros-reduzir-a-altura-esta-muito-grossa

### Pedido
A faixa clara de logos de parceiros está muito grossa. Reduzir padding vertical; padronizar altura dos logos (Picsel com caixa cinza — remover fundo); reavaliar espaçamento com seções vizinhas; emenda de cor com a seção azul; eyebrow “RESULTADOS” colado/cortado no rodapé da faixa — reposicionar. Aceite: altura proporcional; logos padronizados sem caixa; espaçamento consistente; emenda resolvida; eyebrow reposicionado; desktop largo e mobile.

### O que foi feito
Medições em produção (Chromium).

**1440×900.** `.lp-signals` altura **255px → 122px**; padding vertical **100.8px → 40.32px** por lado (`padding-block: clamp(1.5rem, 2.8vw, 2.75rem)`); logo **52px → 40.3px** (`clamp(2.25rem, 2.8vw, 3.5rem)`, `max-width: 11rem`).

**390×844.** Altura **162px → 85px**; padding **56px → 24px**; logo **48px → 36px**.

- **Vazio excessivo** — era 100.8px de padding para logos de 52px.
- **Caixa cinza do Picsel** — `Picsel-logo.png` sem canal alfa, retângulo `rgb(72,108,85)`. Gerado `Picsel-logo-transparente.png`; `src/data/clients.ts` aponta para o novo; original permanece como fonte.
- **Emenda** — `border-block` virou `border-bottom`; chanfro deixou `--deep` (SIS-75, fronteira escuro↔escuro) por `<NotchDivider cor="#f5faff" invertido />`.
- **Eyebrow “RESULTADOS”** — não é da faixa: chip do `ScrollSpy`, `fixed`, a partir de 1440px, sobre a seção escura seguinte (y≈421). Nada a reposicionar.

`tsc --noEmit` limpo, `npm run lint` baseline (25 warnings / 0 errors), `npm run build` ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/legacy.css`
- `src/app/page.tsx`
- `src/data/clients.ts`
- `public/images/Picsel-logo-transparente.png`

---

## SIS-90 — Seção “Alta Performance e Comprometimento”: mover imagem para a esquerda do texto, reduzir o texto e transicionar

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-90/secao-alta-performance-e-comprometimento-mover-imagem-para-a-esquerda

### Pedido
Na seção “…Alta Performance e Comprometimento”, a foto do time está centralizada e sobreposta ao texto. Reposicionar à esquerda (duas colunas); reduzir título/texto; transicionar (entrada suave + troca ao longo do scroll); cards flutuantes sem colisão. Mobile: imagem acima do texto. Reduce: imagem visível, sem movimento. Aceite: imagem esquerda / texto direita, sem sobreposição; escala reduzida; transição; cards sem colisão; empilhamento mobile; estado final em reduce.

### O que foi feito
Diagnóstico: a foto era o tile dominante do mosaico (`left: 50%; top: 56%; width: clamp(18rem, 32vw, 34rem)`). `.mosaic-copy` é `sticky` e ficou mais alta depois da SIS-68.

**O que mudou.** `src/components/legacy/StackScenes.tsx`: linha `.mosaic-duo` (foto à esquerda, texto à direita). `sticky` saiu do texto e foi para a linha. Tile dominante escondido na home. Palco com três imagens no DOM (`sistransphist.jpg`, `sistransphist1.jpg`, `escritoriosp.jpg`), troca por `opacity` no mesmo relógio `data-grupo-ativo`. Entrada via keyframe CSS atrás de `data-em-cena`, só acima de 64rem e fora de reduce. `legacy.css`: título e lead menores; nove tiles periféricos encolhidos e fixados às goteiras (`12rem` de cada lado), por lista explícita (não `:nth-child`). `data-carrier-origem` migrou do tile para o palco (`escritoriosp.jpg` é o último quadro de propósito). `/transformacao-legado` sem `variante` permanece idêntico.

**Medições.** 1440×900: palco `left 224 / w 474`, texto `left 742 / w 474`; colisão foto↔texto **false**; tiles invadindo a linha **0**; h2 41,76px, lead 16,56px; `carrierOrigem: mosaic-palco`. Grupo 0 → 2 esq / 1 dir; grupo 1 → 1/2. 1366×768: palco `left 192 / w 471`, texto `left 703`, h2 39,6px. 390×844: coluna única 351px, `position: static`, foto acima. Reduce: `grupo: null`, `emCena: false`, três quadros `opacity: 1`.

`tsc --noEmit` limpo, `npm run build` ok, lint baseline (25 warnings, 0 erros).

Ressalva: em mobile os tiles periféricos ainda passam por trás do bloco foto+texto (pré-existente).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`
- `src/components/legacy/legacy.css`

---

## SIS-89 — Tornar mais fluida a transição de “Staff Augmentation” para a seção dos números

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-89/tornar-mais-fluida-a-transicao-de-staff-augmentation-para-a-secao-dos

### Pedido
A passagem de Staff Augmentation (trilha horizontal, “A serviço do Delivery.”) para a seção de números (“Escala que transforma o mercado de seguros.”) está abrupta. Suavizar: sobrepor saída e entrada; revisar `end` vs. `start`; pin/`pinSpacing`; elemento de continuidade; `anticipatePin: 1` se aplicável; `ease: none` em scrub. Relacionado: SIS-85. Aceite: transição contínua; sem flicker de pin; sem scroll morto; fluida em desktop/notebook; reduce legível.

### O que foi feito
Causa geométrica, medida em 1440×900, produção. Capítulos da mesma `ProofJourney` (`top top` → `bottom bottom`): Soluções 3888 → 5724; Números começa em 6624. Sobram **900px** entre 5724 e 6624. Nesse trecho `--sol-p` cravado em `1` e `--impact-p` em `0`.

**Correção.** (1) `ProofJourney` mede a fração de aproximação `--pj-chegada-<capítulo>` no segundo argumento de `aplicar`. (2) Aproximação começa dentro da saída do anterior: `SOBREPOSICAO = 0.35` de janela (315px a 900px de altura), cerca dos dois últimos terços de `--sol-saida` (~54vh). (3) `Metrics`: `--impact-entrada` veio da chegada, não de `p / ENTRADA_FIM`. Nenhum gatilho novo, pin nem altura alterada. `ease: none` implícito.

**Varredura da emenda (100px por amostra).** y 5330: `--sol-p` 0.785, chegada 0; 5432: 0.841 / 0.019; 5721: 0.998 / 0.257; 6027: 1.000 / 0.509; 6333: 1.000 / 0.761; 6622: 1.000 / 0.998; 6724: 1.000 / 1.000 (`--impact-p` 0.046). Nenhum y entre 5212 e 6826 com as duas frações saturadas ao mesmo tempo. Sem pin (é `sticky` por causa do Lenis). Reduce/mobile: `data-dirigindo` ausente, título com `opacity: 1`, `clip-path: none`, `transform: none`.

`tsc --noEmit` limpo, lint baseline, `npm run build` ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ProofJourney.tsx`
- `src/components/Metrics.tsx`

---

## SIS-88 — Seção de contato na home: layout quebrado (título cortado pelo header, bloco estourando a seção)

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-88/secao-de-contato-na-home-layout-quebrado-titulo-cortado-pelo-header

### Pedido
Na seção de contato da home, “Entre em contato conosco” está quebrado: título e eyebrow atrás do header; bloco estoura a seção; card “SEDE · SÃO PAULO” cortado na base; marcador “CONTATO” sobreposto. Reservar espaço do header; conter no grid; ajustar altura; revisar z-index. Relacionado: SIS-83. Aceite: título e eyebrow visíveis; bloco no grid; card completo; sem sobreposição do marcador; desktop, notebook e mobile.

### O que foi feito
Causa medida: modo dirigido com caixa `sticky` de `height: 100svh` e `overflow: clip`. (1) A caixa media a tela inteira, mas o topo fica atrás da pílula fixa (borda inferior a 104px). (2) Painel maior que a tela útil: **1000px** em 1920×1080, **877px** em 1440×900, **866px** em 1366×768.

`globals.css`: modo dirigido reserva o cabeçalho (`padding-top: calc(var(--header-h,88px) + 1.5rem)` + `padding-bottom: 1.5rem`); `.ct-trilha` ganhou `scroll-margin-top` (`#contato` é âncora). `Contact.tsx`: só dirige se `painelRef.offsetHeight + 136 <= innerHeight` (`offsetHeight` imune ao `scale()`). Não cabendo, modo lista. `ResizeObserver` + `resize`.

Consequência registrada: com painel 866–1000px, o modo dirigido só se ativa acima de ~1136px de altura de janela. Preferido a manter conteúdo cortado.

Validado em produção: 1920×1080, 1440×900, 1366×768 e 390×844, com e sem reduce. ScrollSpy (a partir de 1440px) a 12–20px da esquerda; borda do painel em 100px a 1440 e 340px a 1920. `tsc --noEmit` limpo, lint 0 erros, build ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Contact.tsx`

---

## SIS-87 — Menu “Quem somos”: dropdown desaparece ao tentar clicar nos itens

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-87/menu-quem-somos-dropdown-desaparece-ao-tentar-clicar-nos-itens

### Pedido
Ao abrir o dropdown Quem somos e mover o mouse para clicar (A Sistran, Sistran Labs, Sistran University, Sistran Latam), o menu fecha antes do clique. Causa provável: espaço morto entre trigger e painel (`mouseleave` no gap). Tratar trigger + painel como uma área de hover; delay de fechamento ~150–200ms; fechar em clique fora, Esc e outro item; teclado (Enter/Espaço, setas, Tab); touch por clique. Aceite: clique nos 4 itens; fecha fora e Esc; teclado com foco visível; touch; sem flicker.

### O que foi feito
Resolvido em `src/components/Header.tsx`.

**Causa:** painel em `top: calc(100% + 10px)`. Os 10px de vão não pertenciam nem ao invólucro nem à lista.

**O que mudou.** Afastamento virou `padding-top: 10px` de um invólucro em `top-full`. Fechamento com atraso de 180ms (`fecharSubmenuComAtraso`), cancelado ao reentrar. Clique/toque fora via `pointerdown` no documento (não `click`, para não fechar no mesmo toque que abre). Teclado: `ArrowDown` abre e foca o primeiro item; setas em ciclo; `Escape` fecha e devolve o foco ao botão; `Tab` não fecha (`onBlur` só quando o foco sai do invólucro).

**Medido em produção, 1600×900.** Os 4 itens permanecem visíveis no trajeto; cliques: A Sistran → `/quem-somos`, Sistran Labs → `/sistran-labs`, Sistran University → `/sistran-university`, Sistran Latam → `/latam`. Clique fora, Esc, ArrowDown, Tab e touch (`hasTouch`) conferidos. 0 erro de console. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; build passa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`

---

## SIS-49 — Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-49/solucoes-de-negocios-retirar-a-legenda-numerada-de-baixo-dos-nos-da

### Pedido
Os `01`–`04` que ficaram como legenda sob cada nó da linha de processo saem. Remover `<span className="solutions-fio-no-num">` em `src/components/Solutions.tsx` e o bloco `.solutions-fio-no-num` (e `[data-estado="ativo"]`) do `globals.css`, com comentário de religação. Vieram da SIS-46; sob a foto ficaram ruído. A linha é `aria-hidden`; a etapa continua no `01 / 04` de `.solutions-progresso` e em `aria-current="step"`. Não reintroduzir números na navegação. Validação: lint, tipos, anel de pulso sem espaço sobrando.

### O que foi feito
Done — commit `96e0e67`. Saíram o `<span className="solutions-fio-no-num">` em `Solutions.tsx` e o bloco `.solutions-fio-no-num` (com `[data-estado="ativo"]`) no `globals.css`. Comentário de religação nos dois lugares; o do CSS guarda posicionamento, tamanho e os dois tons. Nós ficaram só com o ícone. Marcação da etapa: círculo aceso, borda `rgba(165,240,255,0.85)`, halo ciano e anel `::after` — nenhum tocado. O anel é `::after` com `inset: -10px`; o número era irmão absoluto fora dele — sair não mexeu na geometria. Acessibilidade intacta (SIS-46): linha `aria-hidden`; contador e `aria-current="step"`; números não voltaram à navegação. `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência de `solutions-fio-no-num` fora dos comentários, servidor 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-48 — Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-48/solucoes-de-negocios-a-pilula-do-cabecalho-fica-escondida-atras-do

### Pedido
No palco dirigido (≥ 1024px) a pílula “Veja como a Sistran pode ajudar…” nasce colada no topo e o header fixo passa por cima. `.solutions-scroll[data-dirigindo] .solutions-sticky` tem `position: sticky; top: 0; height: 100svh; justify-content: center`. Correção: `padding-top: var(--header-h)` (`globals.css:908`, 88px; Header compacta para 68px). Não usar `top: var(--header-h)`. Verificar pílula inteira com header normal e compacto; palco tela inteira sem salto; quatro etapas centradas; abaixo de 1024px nada muda.

### O que foi feito
Feito no commit `05b8c7b` — um único arquivo, `src/app/globals.css`. `padding-top: var(--header-h)` em `.solutions-scroll[data-dirigindo] .solutions-sticky`. Com `box-sizing: border-box` (preflight Tailwind) a altura do palco não cresceu; a trilha de 400vh e o `margin-top: -100svh` continuam válidos. Padding e não `top` para não abrir faixa do fundo do documento. Variável e não número: Header reescreve `--header-h` ao compactar (88px → 68px, `Header.tsx:55`). Nada abaixo de 1024px. Servidor 200. A entrega registra que faltava conferência no navegador: cápsula inteira nos dois estados do header e nenhum salto no sticky.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-47 — Soluções de Negócios: melhorar o remate final da linha de processo

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-47/solucoes-de-negocios-melhorar-o-remate-final-da-linha-de-processo

### Pedido
O fim da linha corta reto no meio da foto, sem remate; o último nó (check) fica com traço dos dois lados. Dar um fecho: terminar no último nó; ou dissolver com máscara/degradê; ou curva de saída simétrica à entrada. Caminho em `Solutions.tsx` (`caminho`) termina em `nos[5] + geo.pw * 0.05`. Depende de SIS-45 (quatro nós). Decoração `aria-hidden`; coordenadas medidas; paleta azuis e ciano. Validação nas quatro etapas, desktop largo e estreito: sem corte, sem invadir o cartão, sem passar no rosto da foto.

### O que foi feito
Done — commit `995ad2c`. Direção: dissolver, combinada com terminar no último nó. O caminho principal passou a terminar exactamente em `nos[nos.length - 1]` — sem a sobra de 5%. O cap redondo do `stroke-linecap` fica escondido debaixo do círculo (52px). Curva de saída simétrica descartada: sugeriria quinta etapa.

Remate: path próprio `.solutions-fio-remate`, sobe (`-7.5%` e depois `-11%` da altura da foto) até 99.5% da largura, `url(#solutions-fio-fim)` — degradê `#0ed8f6` a 0.55 de alfa na emenda, `#66caf4` a 0.22 no meio, alfa zero na ponta. `gradientUnits="userSpaceOnUse"`. Sem `stroke-linecap: round` neste traço. Path separado para o degradê não pintar o fio inteiro e o `stroke-dashoffset` / `pathLength={1}` não medir o remate como etapa. `opacity: 0.4`, acende em cheio quando `ativo === total - 1` via `data-fim` (520ms). Frações de `geo.pw`/`geo.ph`; dentro de `.solutions-fio` (`aria-hidden`, `pointer-events: none`). `tsc --noEmit` limpo, eslint limpo, servidor 200. A entrega registra que faltava passagem no navegador das quatro etapas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css` (implícito no bloco do fio / remate)

---

## SIS-46 — Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los

### Pedido
Os números `01`–`04` saem da lista lateral e passam a marcar os nós da linha. Remover `<span className="solutions-nav-num">` e a regra CSS; a lista fica com título e seta; o contador `03 / 04` do rodapé fica. Cada nó ganha o número da solução (dentro do círculo ou como legenda). Depende de SIS-45. A linha é `aria-hidden`; números nos nós não podem ser a única forma de saber a etapa. Validação: lint, tipos, títulos alinhados sem o número à esquerda.

### O que foi feito
Done — commit `8310c19`.

**Navegação.** `<span className="solutions-nav-num">` saiu de cada item e o bloco `.solutions-nav-num` (mais `[data-estado="ativo"]`) saiu do `globals.css`, substituído por comentário de religação. Item ficou com título + seta; barra ciano, placa de vidro e `min-height: 72px` continuam. Número era primeiro filho de flex com `gap: 1rem`; tirá-lo devolveu largura ao título.

**Nós.** Cada nó ganhou `.solutions-fio-no-num`, mesma tipografia da navegação (display, 700, `tabular-nums`, `rgba(165,240,255,0.62)` → `#0ed8f6` aceso, halo de 12px). Legenda 7px abaixo do círculo, não dentro (ícone nos 52px). Transição 380ms `cubic-bezier(0.22, 1, 0.36, 1)`. `left: 50%` + `translateX(-50%)` no filho; fora do anel (`inset: -10px`).

**Acessibilidade.** Linha `aria-hidden`. Canal real: contador `01 / 04` em `.solutions-progresso` e `aria-current="step"`. `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência órfã de `solutions-nav-num` fora do comentário, servidor 200. Conferência no navegador ficou para o fim da SIS-47.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`
