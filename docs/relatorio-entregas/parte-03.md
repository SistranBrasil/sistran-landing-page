## SIS-263 — /contato · reveal on scroll em toda a página (docs/scroll.md)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-263/contato-reveal-on-scroll-em-toda-a-pagina-docsscrollmd

### Pedido
Em `/contato`, aplicar o reveal on scroll de `docs/scroll.md` na página inteira — todos os blocos relevantes revelam ao entrar no viewport. Usar primitivas da casa (`RevealScope` + `useRevealTrigger` + presets `[data-reveal]` em `globals.css`); não inventar segundo sistema nem Framer Motion. Calibrar gatilho (~top 85%), hero acima da dobra sem atraso longo (LCP), reduce e sem JS com conteúdo visível, sem `transform` em wrapper que quebre sticky/fixed. Fora de escopo: redesign, SIS-259/260/256, outras rotas, Lenis. Aceite: revelação da página inteira, stagger nos cards de números (e time se aplicável), hero sem atraso de LCP, reduce + sem JS legíveis, capturas e lint OK.

### O que foi feito
**1ª volta — primitivas da casa.** Mecanismo: `RevealScope` (`src/components/motion/RevealScope.tsx`) escrevendo `data-in` via `useRevealTrigger`, presets `[data-reveal]` da SIS-197 em `globals.css:21241-21306`. Nenhum `reveal.js` paralelo, nenhum `motion/react` novo, nenhum `SectionReveal`/GSAP. Portão permanente: `scripts/medir-reveal-contato-sis263.mjs` → `docs/medidas/reveal-contato-sis263.json`.

**15 nós marcados** (inventário): 1–7 `li.contato-indicador` preset `fade`, `--reveal-i` 0…6, escopo `div.container-lp` (`MetricsBand`); 8 `div.contato-faixa-parceiros` `fade`; 9 `div.contact-dialog-inner` `fade-up`; 10 `span.tag-section` (#sistran) `fade`; 11 `h2#onde-estamos` `fade-up` i=1; 12 `span.tag-section` (palco) `fade`; 13 `h2#time-sistran` `fade-up` i=1; 14 `p.mt-6.text-lg` `fade-up` i=2; 15 `p.mt-4.text-base` `fade-up` i=3. Cinco escopos; três substituem wrappers existentes. Motivo de `fade` nos sete `<li>`: cada um tem `animation-name: contato-indicador-onda` (infinita, dona do `transform`). Faixa de logos em `fade` para não abrir faixa navy nas emendas SIS-136/259. Não marcados de propósito: hero (`PageHero` / `motion/react`, LCP); superfície do mapa (conteúdo desde SIS-168; painel já tem `gsap.from` SIS-245 `UnitsMap.tsx:765-805`); `CartaoDuasFaces` (`whileInView`).

Calibre 1ª volta: `limiar: 0.2`, `margem: '0px 0px -12% 0px'`, `umaVez` (≈ top 85%). Stagger `--motion-stagger-reveal` 80 ms; sete × 80 = 560 ms. Hero com atraso zero de reveal.

Reduce: `@media (prefers-reduced-motion: reduce)` `{ marcados: 15, ruins: [] }`; `html[data-motion="reduce"]` idem. Sem JS: `{ marcados: 15, escoposComDataIn: 0, invisiveis: 0, textoDoPalco: true }`. Espera da sonda de reduce subiu para 1800 ms porque o espelho `!important` (`globals.css:3246-3280`) não zera `transition-duration` (até 980 ms no pior caso). Quatro `fixed` na rota (`a.skip-link`, `header.fixed`, `div.fixed.inset-0`, `nav.fixed.left-3`) com `dentroDeMarcado: false`. Portão SIS-128: `.contact-dialog-inner` `{ position: "relative", preset: "fade-up" }`.

Varredura 1440, degraus 450 px: y=0 todos invisíveis; y=450 10 invisíveis; y=900 6; y=1800 4; y=3417 `presosNoFim: []`. 390: `{ erros: [], scrollWidth: 390, presosNoFim: 0 }`. Capturas `docs/capturas/sis263-contato-1440-{indicadores,logos,painel,mapa,palco}.png` e `sis263-contato-1440-sem-js.png`. `npx tsc --noEmit` silencioso. Lint 1ª volta: 40 avisos / 0 erros (duplicação `.claude/worktrees/`). Tensão declarada: §9 de `scroll.md` desaconselha reveal em toda seção; o pedido foi seguido com marcação por bloco (15 nós).

**2ª volta — «mais fluido» e surgimento após o carregamento.** Correção: a faixa de indicadores começa em y=742 e o escopo vai até y=1000 (janela 900); 61% já na tela na abertura. Com margem −12% a raiz terminava em 792 e o bloco ficava preso em `data-in="false"`. `useRevealTrigger` ganhou `pronto` (padrão `true`); com `pronto: false` escreve `data-in="false"` e sai sem observar. `RevealScope` ganhou `esperarRota` e `style`; lê `useRouteLoadGate()`; fallback `portao?.liberado ?? true`. `globals.css`: `[data-reveal]` usa `var(--reveal-dur, var(--motion-reveal-base))` e `var(--reveal-ease, var(--motion-ease-out))`. Novo `src/app/contato/reveal-calibre.ts`. Calibre: `rootMargin` −12% → **+12%**; `threshold` 0.2 → **0.08**; duração 500 ms → **820 ms**; curva `cubic-bezier(.19,1,.22,1)`; passo da cascata dos indicadores 80 → **95 ms** (6 × 95 = 570 ms). Abertura medida: `tLiberou 3169ms · tAcendeu 3373ms · msDepoisDaCortina 204ms`; `acendeuSobCortina 0 · escondeuComCortinaJaFora 0 · presosNaDobra 0`. Cascata dos sete cartões 3373–4680 ms. Portão `normal1440`: 15 nós, `presosNoFim: []`, `scrollWidth: 1440`; reduce e sem JS 15/0; 390 sem presos. Lint 2ª volta: 79 problemas (31 errors, 48 warnings) idêntico com `git stash` das mudanças; `npx eslint` nos seis arquivos tocados limpo. Captura nova `sis263-contato-1440-abertura.png`.

### Conferência
Sem registro de conferência no Linear. Em 15/09 a usuária registrou que, após o load, o reveal dispara tudo de uma vez (queria surgimento conforme o scroll); reparação aberta em SIS-269 (irmãs SIS-270 a SIS-273).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/components/MetricsBand.tsx`
- `src/components/motion/RevealScope.tsx` / `useRevealTrigger` (2ª volta)
- `src/app/contato/reveal-calibre.ts`
- `src/app/globals.css`
- `scripts/medir-reveal-contato-sis263.mjs`

---

## SIS-262 — /esg · negrito em ENVIRONMENT: / SOCIAL: / GOVERNANCE: nos títulos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-262/esg-negrito-em-environment-social-governance-nos-titulos

### Pedido
Em `/esg`, negritar só os prefixos **ENVIRONMENT:**, **SOCIAL:** e **GOVERNANCE:** (incluindo o `:`); o restante do título permanece no peso atual. SOCIAL precisa separar o prefixo da lista de projetos, sem forçar `text-gradient-brand` no resto se isso mudar a leitura. Não alterar copy nem `TituloAceso` nas outras rotas salvo prop opt-in. Fora de escopo: cards (SIS-252), intro/capa (SIS-257/261), animação de acendimento. Aceite: os três prefixos em negrito; resto não artificialmente bold; SOCIAL só o prefixo; capturas; lint OK.

### O que foi feito
Entrega sem conferência (pedido explícito). Prop opt-in `negritoTexto` em `TituloAceso` (default false). Só os spans de `texto` ficam `font-bold` (peso 700 medido). `destaque` e `resto` seguem 400. ENVIRONMENT: prefixo 700; «Sustentabilidade Ambiental» 400 + ciano. SOCIAL: `texto="SOCIAL:"` + `resto` da lista de projetos — **sem** `text-gradient-brand`. Copy/aria-label intactos. GOVERNANCE: prefixo 700; «Ética e Transparência» 400 + ciano. Outras rotas não passam a prop. Portões: lint 0 erros, tsc OK, build OK, `test:copy` OK após lock do split SOCIAL. Capturas em `docs/medidas/sis262/`. Intro/cards/foguete não tocados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `TituloAceso` e o split SOCIAL no copy-lock; capturas em `docs/medidas/sis262/`.)

---

## SIS-261 — /esg · seção intro: layout da captura + arte esg2.png (sem fundo)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-261/esg-secao-intro-layout-da-captura-arte-esg2png-sem-fundo

### Pedido
Na seção intro de `/esg` (frase «A Sistran demonstra seu forte compromisso com o ESG…»), layout igual à captura: texto à esquerda + arte à direita, usando `public/images/esg/esg2.png` sem fundo (PNG com alfa; sem card branco). Eyebrow traço ciano + **ESG**; fundo claro + grade discreta; não usar mais `esg1` nesta seção. Reparo visual pós-SIS-257. Mobile texto → imagem; contraste AA; capturas 390/1440; lint OK. Fora de escopo: título da capa, ENVIRONMENT/SOCIAL/GOVERNANCE/CTA, redesign da capa `esgcapa`.

### O que foi feito
Portões: `tsc` 0 erros · `npm run lint` 0 erros / 22 avisos · `npm run test:copy` OK, 1207 textos. Medidas `docs/medidas/intro-esg-sis261.json`; sonda `scripts/medir-intro-esg-sis261.mjs`; capturas `docs/capturas/sis261-{390,1440}-{intro,pagina,sem-arte}.png`.

**Transparência de `esg2.png`:** medido com `sharp`: `channels: 3`, `hasAlpha: false` — o xadrez do editor achatado (tabuleiro ~9,2 px, tons ≈198 e ≈139, razão 1,42). Fonte PNG não alterada. Derivada `public/images/esg/esg2.webp` via `scripts/gerar-esg2-alfa.mjs` (`docs/medidas/esg2-alfa.json`): `channels: 4`, `hasAlpha: true`, 54,1% da área vaga, **124 KB** contra 2,1 MB. `src="/images/esg/esg2.webp"`, `width={1613} height={975}`. Prova por pixel (captura com/sem arte): 4 cantos da caixa delta **0, 0, 0, 0** (1440 e 390); centro 171/118; varredura 526 px na faixa vaga **0 transições** > 20, delta máx. 6. `background: rgba(0,0,0,0)`, `box-shadow: none`.

**Layout:** eyebrow «ESG» + traço `.eyebrow--traco` — traço **22×2 px**, gradiente `#0079cb → #0ed8f6 → #7fe6ff`, sem animação. Palavra «ESG» em `#024e86` (ciano como texto em faixa clara ~1,5:1, reprova AA). Superfície `section-light section-light-blue`; malha fina 64 px (período medido: 64 px exatos, 22 colunas a 1440 e 6 a 390). `camadasDeGrade: 1` (`::after` pontilhado 22 px desligado nesta seção — 64 e 22 não múltiplos, moiré). Alt: mosaico de cartões, mãos + globo ESG, folhagem, prédio, turbina, reunião; `altRepeteParagrafo: false`. Mobile: `umaColuna: true`, `textoAntesDaImagem: true`. Contraste: parágrafo `#0a1f44` **12,47** (1440) / **12,10** (390) piso 3,0; eyebrow `#024e86` **6,53** / **6,31** piso 4,5. `esg1NoDom: 0`.

Achados fora de escopo: ScrollSpy branco sobre faixa clara **1,13:1** a 1440 (intro sem âncora no mapa); radial violeta de `.section-light-blue` visível no canto transparente — em `.esg-intro` o violeta foi trocado pelo ciano da marca, mesma posição/alfa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/gerar-esg2-alfa.mjs`
- `scripts/medir-intro-esg-sis261.mjs`
- `public/images/esg/esg2.webp`

---

## SIS-260 — /contato · números: grade de quadradinhos discretos igual à home

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-260/contato-numeros-grade-de-quadradinhos-discretos-igual-a-home

### Pedido
Em `/contato`, atrás dos cards da `MetricsBand`, a mesma malha de quadradinhos discretos da home (grade leve 64 px): tokens `--grade-fina-modulo` (64 px), `--grade-fina-linha` (`rgba(4, 58, 99, 0.08)`), `--grade-fina-opacidade` (0.32); receita de `.home-canvas::before` / `.story-solucoes__grade`. Sem grade dupla com a malha técnica de `.section-light::before` (~96 px). Cards e tipografia legíveis. Capturas 1440; lint OK. Fora de escopo: SIS-256, SIS-259, home/Soluções.

### O que foi feito
Uma alteração de CSS em `src/app/globals.css`. Sem mudança em `MetricsBand.tsx`. A regra `.contato-indicadores.section-light::before` **reescreve** o `::before` herdado de `.section-light` (uma camada, `z-index: -1`, `isolation: isolate`). Tokens `--grade-fina-*` copiados de `.home-canvas::before`.

Estilo computado (1440 e 390): dois `repeating-linear-gradient` com `rgba(4, 58, 99, 0.08) 0 1px, transparent 1px 64px` (90deg e 0deg); `opacity: 0.32`; `background-attachment: fixed, fixed`; `position: absolute`; `z-index: -1`. Período medido por diferença de pixel: passos múltiplos de 64 (vãos 5×/9× onde cartão opaco cobre o fio). Tinta pico 11 níveis por canal (0,32 × 8% alfa). Pixels de malha dentro da superfície dos sete cartões: **0** nas duas larguras (`border-radius: 16 px` descontado). Contraste sobre `#1273bc`: número **5,00** piso 3,0; rótulo **5,00** piso 4,5; `+` **5,00** piso 3,0. Camadas de grade: **1**. `::after` pontilhado SIS-93 permanece (não é grade).

Máscara redimensionada: de `ellipse at 50% 50%, #000 0%, transparent 75%` para `ellipse 120% 130% at 50% 50%, #000 35%, transparent 96%` — a 390 a máscara antiga deixava 1.026 px de malha e um único fio (miolo coberto pelos cartões); depois 3.305 px a 390 e 10.126 a 1440. Capturas `docs/capturas/sis260-{1440,390}-{com,sem}-malha.png`. Portões: lint 0 erros / 22 avisos; tsc limpo. `test:copy` falha nos mesmos quatro deltas alheios. Medidas `docs/medidas/grade-sis260.json`; sonda `scripts/medir-grade-sis260.mjs`. Observação: radial violeta pré-existente em `.section-light-blue`, não mexido.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-grade-sis260.mjs`

---

## SIS-259 — /contato · retirar sombra branca entre logos e «SAIBA MAIS…»

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-259/contato-retirar-sombra-branca-entre-logos-e-saiba-mais

### Pedido
Retirar a rampa/sombra branca entre `SignalMarquee` e o bloco «SAIBA MAIS SOBRE O QUE PODEMOS OFERECER». Origem auditada: `.contato-emenda-clara` (`#f5faff` → transparente, ~140 px) e `padding-top` grande de `.fundo-contato-cena` (`clamp(9.5rem, 11vw, 10.5rem)`). Encurtar o vão após remover a rampa; conferir outras fontes de branco. Aceite: sem rampa; transição off-white → azul; cartão e eyebrow legíveis; capturas; lint OK.

### O que foi feito
Varredura de coluna 1 px fora do cartão, 200 px abaixo da faixa. 1ª linha abaixo da faixa (1440): antes `rgb(243,249,254)`, depois `rgb(0,91,157)`. Linhas claras abaixo da faixa (1440): **132** → 0 na emenda. Excesso máximo canal R (390): **243/255** → **0**. As 8 linhas claras residuais a 1440 estão a 178–185 px (glifos da pílula «CONTATO»), não rampa.

JSX: `<div className="contato-emenda-clara" />` comentado. CSS: regra `.contato-emenda-clara` comentada (não apagada). `.fundo-contato-cena { padding-top }`: `clamp(9.5rem, 11vw, 10.5rem)` → **`clamp(4.5rem, 5.5vw, 6rem)`**. Vão logo → cartão: 390 176 → **96 px** (`padding-top` 152 → 72); 1440 199 → **120 px** (158,4 → 79,2); 1745+ padding 168 → 96. `cenaTopo − faixaPe = 0`. Faixa: `border-bottom` 0, `box-shadow` none, `::before`/`::after` de `.lp-signals` sem conteúdo/imagem.

Portões: lint 22 problemas, 0 erros; console zero erros; capturas `docs/capturas/sis259-contato-emenda-{1440,390}-{antes,depois}.png`; medidas `docs/medidas/emenda-contato-sis259-{antes,depois}.json`; sonda `scripts/medir-emenda-contato-sis259.mjs`. Observação: emenda agora é aresta reta; dissolução curta (24–32 px) oferecida como opção.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `scripts/medir-emenda-contato-sis259.mjs`

---

## SIS-258 — /trabalhe-conosco · abertura igual a exemplotrabalheconosco.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-258/trabalhe-conosco-abertura-igual-a-exemplotrabalheconoscopng

### Pedido
Abertura de `/trabalhe-conosco` igual a `public/images/exemplotrabalheconosco.png`: esquerda (eyebrow CARREIRA, título branco + `#SomosSistraners` ciano, apoio, três linhas de valor, slogan «TECNOLOGIA QUE MOVE O AMANHÃ»); direita card branco «Envie seu currículo». Mover/reusar `CurriculoCard` na abertura; atualizar `08-trabalhe-conosco.md` + copy-lock; manter avisos demo SIS-117/223. Mobile empilhado; contraste AA; capturas 390/1440. Fora de escopo: ATS, portal de vagas, Social LinkedIn do rodapé.

### O que foi feito
Antes da issue (cartão ainda em Todo): `.carreira-cartao .glass-card` deixou de ser transparente — `background: #e6f2fd` opaco, `backdrop-filter: none`, `::before { opacity: 0 }`. Tintas: título `#06275f`, parágrafos `#3a5a7c` (letra miúda de `#4c6c8e` 4,04:1 para `#3a5a7c`). Opacidade: `maxDeltaCanal: 0` entre dois quadros de vídeo. Contraste 1440: título **12,64:1**, parágrafos **6,30/6,21:1**, miúda **4,84:1**. Sonda `scripts/medir-carreira-cartao.mjs`, `docs/medidas/carreira-cartao.json`.

Entrega do escopo: abertura recomposta no espírito da PNG — coluna esquerda (Carreira, manchete, `#SomosSistraners`, apoio, três benefícios, slogan) e `CurriculoCard` branco à direita (`id="curriculo"` no form, sem duplicar). «Como chegar até nós» saiu da abertura. LinkedIn no card; Social no rodapé. Copy extra + `08-trabalhe-conosco.md` e `copy-lock.json` atualizados. Avisos de envio-demonstração mantidos. Portões: lint 0 erros, tsc OK, build OK, `test:copy` OK. Capturas 1440/390 em `docs/capturas/sis224-sis258-final-*.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados de forma completa no relatório curto da entrega. Citados: abertura de `/trabalhe-conosco`, `CurriculoCard`, `.claude/conteudo-site/08-trabalhe-conosco.md`, `copy-lock.json`; na correção prévia, `src/app/trabalhe-conosco/page.tsx` e CSS `.carreira-cartao .glass-card`.

---

## SIS-257 — /esg · capa «ESG - Environment, Social & Governance» + seção intro com esg1.png

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-257/esg-capa-esg-environment-social-and-governance-secao-intro-com-esg1png

### Pedido
Capa de `/esg`: título **ESG - Environment, Social & Governance** na mesma escala da manchete atual; a frase institucional longa sai da capa. Nova seção antes de ENVIRONMENT: esquerda a frase «A Sistran demonstra…»; direita `public/images/esg/esg1.png` (WebP otimizado). Atualizar `07-esg.md` e copy-lock. Mobile empilhado; emenda visual; contraste AA. Fora de escopo: trocar `esgcapa` (SIS-247), cards, foguete/SOCIAL/CTA, reabrir SIS-233 além do necessário.

### O que foi feito
**Capa.** `PageHero` `title="ESG -"` + highlight ciano no restante; sem `description`. Comprimento combinado 38, escala média (mesmo degrau da manchete anterior). Frase institucional saiu da abertura.

**Seção `#esg-introducao`** entre hero e ENVIRONMENT: texto canônico à esquerda; `esg1.webp` à direita (116.224 B, PNG fonte 1.911.417 B). Desktop 2 colunas; mobile texto → imagem. Alt descritivo. Emenda 0 px de gap; fundo contínuo. Contraste do parágrafo **4,77:1**. Docs: `07-esg.md` e entradas ESG do `copy-lock.json`. Sonda SIS-233 ajustada (`#fraseCompleta: true`). Portões: lint 0 erros, tsc OK, build OK. `test:copy` exit 1 por divergências concorrentes (`Sistran University`, `Fale com a SISTRAN`, `xMidYMid meet`). Capturas em `docs/capturas/sis257/`. Follow-up posterior da usuária: arte `esg2` e layout da captura → SIS-261; capa desta issue permanece.

### Conferência
**APROVADO** (rodada 1/3). Capa concatena exatamente «ESG - Environment, Social & Governance». Frase longa só em `#esg-introducao`, à esquerda, verbatim. WebP 116 224 B; seção antes de ENVIRONMENT; mobile texto→imagem; emenda 0 px; parágrafo 4,77:1 (texto grande AA). Copy-lock ESG bate. `esgcapa` e foguete intactos. Sugestões não bloqueantes: hero ainda em grade de 2 colunas da SIS-233 com um filho; `esg1.png` (~1,9 MB) continua em `public/`; `test:copy` vermelho por concorrência; working copy mistura SIS-247/253/254; comentários CSS SIS-138/206 ainda falam da frase partida na capa. Permanece In Review + `conferido`. Done só pela dona do conteúdo.

### Arquivos tocados
Não listados como bloco no relatório. Citados: `src/app/esg/page.tsx` (`PageHero`, `#esg-introducao`, `esg1.webp`), `.claude/conteudo-site/07-esg.md`, `copy-lock.json`, sonda SIS-233.

---

## SIS-256 — /contato · números: cards mais estreitos e sem contador 01 / 07

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-256/contato-numeros-cards-mais-estreitos-e-sem-contador-01-07

### Pedido
Na `MetricsBand` de `/contato`: diminuir a largura de cada card e retirar o contador «01 / 07» e o grafismo de etapa (nó + fio) nos sete cards. Números e rótulos permanecem. Home `Metrics` / `METRICS` intocados. Follow-up da SIS-211 (que havia pedido o contador). Aceite: nenhum «01 / 07»; largura visual menor que o baseline a 1440; sete pares legíveis AA; capturas; lint OK. Pedidos posteriores da usuária (voltas 2–4) alteraram cor, hover, layout mobile em toda largura, tamanho igual e contagem só após o load.

### O que foi feito
Sonda `scripts/medir-indicadores-sis256.mjs`; JSON `docs/medidas/indicadores-sis256-{antes,depois}.json`; viewports 1440×900 e 390×844.

**1ª volta.** DOM: `.contato-indicador-etapa` / `-no` / `-fio` 7 → **0**; padrão `NN / NN` `true` → **`false`**. Bloco comentado em `MetricsBand.tsx` e CSS morto comentado. Larguras 1440: antes 142,3 × 7; depois `133,8 · 133,8 · 119,3 · 133,8 · 133,8 · 133,8 · 133,8` (todas < 142,3). 390: 350 → `227,6 · 210,8 · 164 · …`. Seção 292 → 288 (1440), 882 → 670 (390). Contraste cartão claro: número **15,93** / **15,8**; rótulo **11,14**. Lint 0 erros / 22 avisos. `test:copy` falha por deltas alheios. Decisão aberta: lado a lado a 1440 estouraria o teto de largura.

**2ª volta — cartão já escuro, hover só para frente.** Só CSS. Superfície `linear-gradient(135deg, rgb(10,31,68), rgb(4,27,61))`; número branco; `+` `#0ed8f6`; rótulo `rgba(255,255,255,0.88)`. Hover: `scale` 1,03 (propriedade individual, porque a onda anima `transform`); largura 133,77 → **137,78 px**; reduce nas duas vias `scale: 1`. Contraste número **16,25**; rótulo **12,92–12,93**. Etapas continuam 0.

**3ª volta — layout da referência em toda largura.** Número à esquerda + rótulo ao lado também a 1440; `@media (min-width: 1280px)` empilhado comentado. Critério «menor que 142,3 px» **deixou de ser cumprido de propósito**. Grade `grid-auto-rows: 1fr`; 1440 `264 × 7` / altura 100,6, fileiras `[4, 3]`; 390 `350 × 7` / 86,6, delta 0. Bug `grid-column: span 2` no 5º cartão (122 vs 264) corrigido para `grid-column: 2 / span 2`. `CountUp.tsx`: contagem só após `window.load` **e** portão da rota; sob o véu só `850`; depois nove intermediários; `passa: true`. Seção 288 → **349** (1440), 670 → **782** (390). Consumidores reais de `CountUp`: `MetricsBand` e `legacy/MetricsStrip` (não montado). Contraste número 16,25; rótulo 12,93.

**4ª volta — cartões `#1273bc` chapado.** Degradê navy comentado. Sombra `rgb(9 71 117 / …)`; borda alfa 34% (58% hover). Rótulo 4,25 ❌ → branco cheio **5,00**. `+` ciano 2,90 ❌ → branco **5,00** (perda do acento declarada). `+` virou terceiro alvo permanente da sonda. Geometria idêntica à 3ª volta. Lint 0 erros / 22 avisos; tsc limpo. Capturas `docs/capturas/sis256-depois-{1440,390}.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`
- `src/components/primitives/CountUp.tsx` (3ª volta)
- `scripts/medir-indicadores-sis256.mjs`

---

## SIS-255 — /contato · Onde Estamos: sombra atrás do mapa menos escura e menos quadrada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-255/contato-onde-estamos-sombra-atras-do-mapa-menos-escura-e-menos

### Pedido
Na seção Onde Estamos, suavizar o véu/sombra atrás do mapa: menos escuro/opaco e arestas menos retas. Origem: `.mapa-veu` com `rgb(3 18 40 / …)` até 96–98%. Manter AA do texto do painel e pino legível. Não redesenhar layout nem dados. Capturas 1024/1440; lint OK. Fora de escopo: SIS-245, SIS-222, faixa de números.

### O que foi feito
Entrega sem conferência (pedido explícito). Véu: navy `rgb(3 18 40)` → `#003D70`. Alfas do painel: 97,6% → 91,4% (1440/1024); 96,4% → 90,6% (390). Rampa horizontal 91 px → 138 px, queda rápida após o painel e cauda longa (pino 18,3% → 14,5% a 1024). Máscara vertical: rampa 4 rem → 5,6 rem, perfil não-linear. Contraste: link ciano 14 px 11,40 → **5,46:1** (piso 4,5); título 16,85 → **8,07:1**. Portões: lint 0 erros, tsc OK, build OK. `test:copy` vermelho por concorrência. Ressalva: a 390 o pino aparece um pouco mais como fantasma (90,6% vs 96%). `docs/mapa-unidades.md` ainda descreve o véu antigo.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`.mapa-veu`)
- `scripts/medir-veu-mapa-sis255.mjs`

---

## SIS-253 — /esg · Fale com a Gente! igual à referência falecomagente.png (+ ponto na linha, hover botão)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-253/esg-fale-com-a-gente-igual-a-referencia-falecomagentepng-ponto-na

### Pedido
Seção Fale com a Gente! em `/esg` igual a `public/imagensexemplo/falecomagente.png`: vidro, linha ciano com ponto luminoso no scroll, hover do botão com avanço em X e giro do círculo ciano, blob/logo/órbitas/balões. Opt-in só em `/esg`; copy-lock intacto; `contatoNoModal` permanece; reduce estático. Outras rotas com `ContactCTA` não mudam. Aceite visual + motion + reduce + modal + capturas + lint.

### O que foi feito
**1ª volta.** Prop `layoutReferencia` em `ContactCTA.tsx` (default off); módulo `src/components/ContactCTAReferencia.tsx`. Montagem só em `src/app/esg/page.tsx`. Conferido em `/solucoes`, `/quem-somos`, `/blog`: sem `.cta-ref`, cartão navy intacto. Composição 1440: cartão 826×320; título 49 px; fio 700×105, 58 px acima do título; botão 227×56 meia-altura; círculo 45×45; arte 446×446. Percurso do ponto: 0 px no nó → 698 px; pouso `dx −1, dy 0` (antes `dx −16` por bases de % diferentes — palco sem padding do `container-lp`). Hover: +6 px X, brilho 180°. Reduce duas vias: avanço 0. Contraste título **12,63** piso 3,0; parágrafo **5,47** piso 4,5. Lint 0 erros / 22 avisos. `test:copy` falha (`Fale com a SISTRAN` 2→3 nesta issue). Modal `dialog.contact-dialog` `open: true`. Capturas `sis253-depois-1440-{repouso,hover,percurso,reduce}.png` e `-390.png`. Sonda `scripts/medir-cta-referencia-sis253.mjs`.

**2ª volta — reprovada por fidelidade ao PNG e refeita.** Fundo: SVG `.cta-ref-ondas` (cinco faixas, viewBox 1440×576). Vidro 60%→40%, `blur(22px)`. Blob `#2fa6f2 → #0d78cc → #06508f → #032f60`. Órbitas 2 px / alfa 95%; ponto 16 px. Balões com bico; selo 48%; sombra preta → halo ciano. Pouso `dx −1, dy 0`. Contraste título **16,25:1**, parágrafo **6,68:1**, rótulo (moldura) **5,75:1**, disco ciano **2,41:1** (seta branca deliberada; WCAG 1.4.11 não se aplica). Hover `matrix(1,0,0,1,6,-28)` e 180°. Reduce duas vias. Lint 22/0. Pendência: pouso no círculo vs nó acima do botão no PNG.

**3ª volta A — `docs/orientacoes-componente-fale-com-a-gente.md`.** Forma azul virou `<path>` Bézier (viewBox 760×620), não `border-radius`. Checklist §12: razão 1,121; base `#064C98`; sobreposição 89 px; selo 38%; órbitas 94%; balões 18%; `scrollWidth` 1440/390. Camadas: ondas 0, arte 1, forma 2, órbitas 3, selo 4, balões 5, cartão 2, botão 4. Símbolo `sistran-logo.png` (SVG pedido não existe). Flutuação CSS 6 s / órbitas 4,5 s; reduce `none`. Rótulo por glifos **16,25:1** (método anterior media a pílula inteira). Disco **2,39:1**.

**3ª volta B — override de escala.** Painel `67vw` (1016,6 a 1440); arte `37vw`; botão `left: calc(52.3vw − 50vw + 50%)`, `top: 56%` (753→1048). `botaoSobreEncontro` cumprido. Pouso `dx: -2, dy: 0`. Título `font-weight: 700`, `clamp(3.25rem, 3.9vw, 5rem)`. Chanfro `clip-path` saiu (cortaria o fio). Sobreposição 153 px (3 px acima da faixa 80–150). Órbitas 97,9%. Mobile 390: arte `position: relative` 266×217.

**4ª volta — diminuir tudo.** Margens cresceram para manter sobreposição: `--cta-ref-cartao-w` `min(58vw, 1180px)`; arte `clamp(420px, 32vw, 640px)`; botão `55vw` / `clamp(250px, 18vw, 350px)`; título `clamp(2.625rem, 3.1vw, 3.875rem)`. Sobreposição 86 px a 1440 (dentro de 80–150). Pouso `dx: -2, dy: 0`. Contraste título 13,64; parágrafo 6,68; glifos 16,25; disco 2,41. Lint 23/0.

**5ª volta.** `FIO_ALTURA` 150 → **105**; caminho `M 13 9 H 904 L 1000 105`. Folga fio×título 20–34 px. Botão em px `--cta-ref-botao-y-topo: clamp(150px, 11vw, 175px)`. Ponto em laço `repeat: -1`, `repeatDelay: 0.8`; 8 posições distintas; reduce parado em x 994. Escala menor: cartão `min(52vw, 1060px)`; arte `clamp(380px, 29vw, 600px)`; título `clamp(2.25rem, 2.7vw, 3.25rem)`. Sobreposição 147/89/90/120 px. Painel **opaco** com camadas do hover ESG; `backdropFilter: none`; base `linear-gradient(135deg, rgb(242,247,252), rgb(228,237,247))`. Contraste título **14,35:1**, parágrafo **4,85:1**, rótulo **16,25:1**. Fio `#0079cb` (ciano sobre ciano anulava a bolinha). Hover +6 px; reduce sem avanço; brilho 180°. Lint 22/0. Medidas `docs/medidas/cta-referencia-sis253-depois.json`.

Feedback 15/09: blob/logo baixo e corta no rodapé → SIS-276.

### Conferência
Sem comentário formal de conferente com `VEREDITO: APROVADO` ou `REPROVADO`. A 1ª volta foi **reprovada pela usuária** por fidelidade ao PNG («a parte de trás do card também»); o executor refez nas voltas 2–5. Permanecem perguntas abertas no Linear: seta branca ~2,4:1 vs navy `#04263f`; pouso do fio no disco vs nó acima do botão.

### Arquivos tocados
- `src/components/ContactCTA.tsx`
- `src/components/ContactCTAReferencia.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/medir-cta-referencia-sis253.mjs` / `scripts/medir-cta-sis253.mjs`

---

## SIS-252 — /esg · ENVIRONMENT + GOVERNANCE: cards azul bem clarinho no repouso + troca de cor no hover

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-252/esg-environment-governance-cards-azul-bem-clarinho-no-repouso-troca-de

### Pedido
Os 6 cards ENVIRONMENT e os 6 GOVERNANCE: repouso azul bem clarinho (não navy); hover com troca de cor perceptível, mantendo levantamento/sombra da SIS-237. Texto em tinta escura para AA. Classe compartilhada `.esg-superficie`. Não mexer em copy, fotos, flutuação, SOCIAL, hero. Capturas 1440 rest + hover nas duas grades; lint OK.

### O que foi feito
Sonda `scripts/medir-esg-cartoes-sis252.mjs`; JSON `docs/medidas/esg-cartoes-sis252/`. Os doze em `.esg-superficie` (`globals.css`). Navy saiu; família `#f2f7fc` 96% → `#e4edf7` 90%; borda `#0079cb` 28%. Superfície ENV topo `rgb(9,77,129)` → `rgb(218,235,246)`; vs faixa **1,26–1,45:1** → **4,69–5,77:1**. Hover: gelo `#a5f0ff` 90% + ciano `#0ed8f6`; ΔRGB topo 34,7–37,5 → **75,1–76,2**; base 11,8–13,7 → **70,1–72,2**. Transform hover `matrix(1.02,0,0,1.02,0,-12)` nos doze. Tinta `--esg-tinta: #0a1f44` / `--esg-tinta-suave: #0f2b4a`. Legendas ENV 8,95–9,06:1 rest / 6,46–8,05:1 hover; termos GOV 10,35–10,55 / 7,74–9,05; detalhes 8,81–9,04 / 6,03–7,46. Todos ≥ 4,5:1. Reduce: hover ainda troca fundo/borda; transform `matrix(1,0,0,1,0,-3)`. Capturas `docs/capturas/sis252-{environment,governance}-1440-{repouso,hover}-{antes,depois}.png`. Lint 0 erros / 22 avisos. `test:copy` reprova por outras frentes; SIS-252 não mexeu em string.

Achados: `text-ink` no Tailwind é quase branco (`#f8fafc`); `#3d5a80` reprovou (hover 3,42–3,89:1 com `scale(1.02)`); radiais roxos de `.esg-superficie` e `.glass-card::before` comentados/overridden. Inverte de propósito a conclusão da SIS-237 («branco sobre claro reprova») porque superfície e tinta mudaram juntas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco. Citados: `src/app/globals.css` (`.esg-superficie`), classes `.esg-tinta` / `.esg-tinta-suave` em `src/app/esg/page.tsx`, `scripts/medir-esg-cartoes-sis252.mjs`.

---

## SIS-251 — /eventos-inovacao · mobile: carrossel mais intuitivo (swipe + auto)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-251/eventos-inovacao-mobile-carrossel-mais-intuitivo-swipe-auto

### Pedido
No mobile de `/eventos-inovacao`, o carrossel da SIS-239 precisa ficar óbvio (swipe e/ou autoplay). Reforçar affordances <1024 (peek, setas, hint, dots); calibrar autoplay; pause + reduce; desktop ≥1024 inalterado. Capturas 390; lint OK.

### O que foi feito
Diagnóstico (`scripts/diagnostico-carrossel-sis251.mjs`): espiada **40 px** já existia; marcas em quadro; passo autoplay 0 → 331 px; nenhuma palavra sobre deslizar. Intervalo de 6 s **não** encurtado (descrições até 485 caracteres). Barra `[◀] [quinze marcas] [▶]` + dica «deslize para ver os 15 eventos» (`aria-hidden`); setas **44×44 px**; «anterior» no 1º leva a `scrollLeft 4598`. Marcas 0,45 rem / alfa 0,45; ativa pista 2 rem. Relógio `animation-name: eventos-lista-relogio`, `duration: 6s` via `--evt-autoplay` = `AUTOPLAY_MS`. Preenchimento 16 → 26 → 4 px. Swipe toque: 0 → 245 (dedo) → 331 (snap); `dicaSumiu: true`. Dedo: `data-andando="nao"`, relógio `paused`; retomada após 7 s. Reduce duas vias: animações `none`, autoplay parado, marca ativa **32/32 px** (corrigido `width: 100%` — antes preenchido 0). Desktop 1024/1440: faixa e barra altura **0**. `test:copy` + `copy-lock` (1657 textos; reconferência OK 1194 distintos) com «Evento anterior», «Próximo evento», «deslize para ver os 15 eventos». Lint 22/0; tsc limpo. Capturas `docs/capturas/sis251-*.png`. Ressalvas: WCAG 2.2.2 não fechada (sem botão de pausa dedicado); folga morta dentro dos cartões não tocada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-carrossel-sis251.mjs`
- `scripts/diagnostico-carrossel-sis251.mjs`
- `copy-lock.json`

---

## SIS-250 — /sistran-university · logo University no navbar (só nesta página)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-250/sistran-university-logo-university-no-navbar-so-nesta-pagina

### Pedido
Em `/sistran-university` (e subrotas), o navbar mostra `public/images/university/logouniversity.png`; demais rotas seguem a logo corporativa. WebP/PNG enxuto; caber na pílula (88 px); `alt` adequado; link documentado (preferência `/`); mesmo no menu mobile. Capturas 390/1440 vs outra rota; lint OK. Fora de escopo: capas University, redesign do Header, logo no footer.

### O que foi feito
Entrega sem conferência, a pedido. Único nó de logo em `Header.tsx` deriva do `pathname`. Em `/sistran-university` e subrotas: `/images/university/logo-university-header.webp`, `alt="Sistran University"`. Demais: `/images/sistran-corp-logo.png`, `alt="Sistran"`. Link permanece `/`. Variante University `object-contain`, largura 128/132 px; início do menu desktop no mesmo x (`264,64 px`). PNG fonte 2032×774, 1.746.700 B; derivada recortada da grade, 264×101, **13.698 B** (−99,2%). Confirmado 390 e 1440 na rota University e logo corporativa em `/contato`. `npx tsc --noEmit` OK; ESLint 0 erros no arquivo; `git diff --check` OK. Follow-up 15/09: duas logos + linha vertical (padrão Luminna|Sistran) → SIS-279.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`
- `public/images/university/logo-university-header.webp`

---

## SIS-249 — /sistran-university · seção Formar especialistas: arte + texto sombreado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-249/sistran-university-secao-formar-especialistas-arte-texto-sombreado

### Pedido
Em `#university-programa`, usar `public/images/university/1-Sistran-university.png` como visual de fundo e o texto por cima com sombreado para legibilidade. Copy e h2 intactos. WebP; contraste AA nos piores pixels; mobile com `object-position` se preciso. Fora de escopo: capa (SIS-248), Unidep/números/galeria, reescrever a frase agramatical.

### O que foi feito
Entrega sem conferência. `#university-programa` virou fundo composto: WebP `university-programa.webp` (1672×941, 114 kB; PNG fonte intacto) + véu + pluma + `h2`/`p` por cima. `alt=""`. Copy e título intactos (frase agramatical inclusive). Contraste do parágrafo 8,2–10,2:1 (antes ~3,5:1). h2: 5,8:1 no pior caso (1024–1279, título numa linha cruzando as pessoas) até 14,2:1. Mobile: `object-position` 100%. Emendas com capa (SIS-248) e Unidep: 0 px. Portões: lint 0 erros, `tsc --noEmit` OK. `test:copy` vermelho por SIS-250 e CTA. Capturas `docs/capturas/sis249-programa/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. Citados: seção `#university-programa`, WebP `university-programa.webp`.

---

## SIS-248 — /sistran-university · capa universitycapa.png (padrão HeroImageBackdrop)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-248/sistran-university-capa-universitycapapng-padrao-heroimagebackdrop

### Pedido
Abertura de `/sistran-university` com `universitycapa.png` full-bleed via `HeroImageBackdrop` + WebP + véu escopado, no padrão de `/contato`, parceiros, labs, esg. Copy intacta; `alt=""`; emenda OK; capturas 390/1440; lint OK.

### O que foi feito
Entrega sem conferência. `PageHero` envolvido por `HeroImageBackdrop`, `alt=""`, `.hero-backdrop--university`. PNG fonte 1672×941, 1.993.933 B. LCP: `university-hero.webp` q72 `smartSubsample`, **136.436 B** (6,8% do PNG), via `sharp` transitivo. Desktop: foco `50% 46%`, véu assimétrico; sobreposição h1×assunto **0 px²** em 1440. Mobile: foco `34% 46%`. Copy idêntica. Emenda Programa: degrau de cor 57 níveis → 1 por canal. Contraste: 390 h1 **8,30:1**, descrição **4,99:1**; 1440 h1 **10,62:1**, descrição **7,40:1**. `tsc` limpo; lint sem apontamentos nos tocados; `git diff --check` OK. `test:copy` vermelho por arquivo não rastreado (`CarimboRealizadoSistran.tsx`). `priority` no backdrop deprecado no Next 16 (`preload`); mudança no componente compartilhado ficou fora.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/sistran-university/page.tsx`
- `src/app/globals.css`
- `public/images/university/university-hero.webp`
- `scripts/medir-abertura-university-sis248.mjs`

---

## SIS-247 — /esg · capa de abertura = esgcapa.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-247/esg-capa-de-abertura-esgcapapng

### Pedido
Trocar o fundo da abertura de `/esg` de `esg-hero.webp` para capa derivada de `public/images/esg/esgcapa.png` (WebP; PNG não crua no LCP). Ajustar `object-position`/véu `.hero-backdrop--esg`; copy intacta; emenda OK; capturas 390/1440; lint OK. Fora de escopo: reescrever copy, seções internas, regressão da SIS-233.

### O que foi feito
Entrega sem conferência. PNG fonte preservada (1672×941, 2.235.833 B). Derivada `esgcapa.webp` q82, **224.148 B** (~−90%). `HeroImageBackdrop` aponta para `/images/esg/esgcapa.webp`, `alt=""`, foco `74% 50%`. Véu `.hero-backdrop--esg` assimétrico (fecha tipografia à esquerda, abre assunto, navy no rodapé). Copy/tipografia SIS-233 intactas. Contraste: 390 título **5,54:1** (piso 3), descrição **6,83:1** (piso 4,5); 1440 título **10,44:1**, descrição **5,06:1**. Capturas `docs/capturas/sis247-esg/{antes,depois}-{390,1440}.png` e `medicoes-sis247.json`. TypeScript OK; lint 0 erros, nenhum aviso novo; `git diff --check` OK. `docs/capturas/` ignorada pelo Git.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `public/images/esg/esgcapa.webp`

---

## SIS-243 — / · hero: vídeo só inicia depois do carregamento da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-243/hero-video-so-inicia-depois-do-carregamento-da-pagina

### Pedido
Na home, o vídeo do hero só inicia depois do carregamento da página (Fase A / autoplay de entrada). Não dar `play` enquanto o `RouteLoadGate` estiver visível; preferir adiar a rede de `hero-scroll-v2.mp4` até o gate liberar. Reduce e abertura no meio sem regressão; timeout de 10 s libera o vídeo. Scrub Fase B intacto. Fora de escopo: peso (SIS-241), BrandGrid (SIS-240), gate de `/contato`, legendas SIS-226.

### O que foi feito
Entrega sem conferência. `RouteLoadGate` expõe `liberado = !visible` (depois do overlay e fade de 240 ms). `HeroCinematic` só decide Fase A com esse sinal. `ScrollVideo` ganhou `carregar` (default `true`); no hero recebe `liberado`: durante o gate, `<video>` sem `src`, `preload="none"`, pôster 58 KB; depois `src`, `preload="auto"` e `play()` se topo e sem reduce. Timeout 10 s libera o MP4. Memoriza se a página esteve fora do topo durante o gate (evita Fase A falsa pelo trinco `scrollY=0`).

Sete cenas: hard load com/sem intro, soft nav `/`, reduce sistema, reduce botão, `#contato`, timeout. Em todas: `srcComPortaoDePe: 0`, `playComPortaoDePe: 0`, `mp4PedidoComPortaoDePe: false`. MP4 pedido 6–61 ms depois da última amostra com gate visível. Fase B bidirecional: `currentTime 5,27` → `14,99` → `0,01`. `tsc` limpo; lint 0 erros nos tocados; `npm run build` compilou. Ressalva: o trinco do gate ainda destrói posição de âncora (página termina no topo) — pré-existente; SIS-243 só impede disparar o vídeo.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/loading/RouteLoadGate.tsx`
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-portao-hero-sis243.mjs`

---

## SIS-241 — / · Peso da home: 24 MB entregues + ~163 MB bruto em public/

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-241/peso-da-home-24-mb-entregues-163-mb-bruto-em-public

### Pedido
Home entrega ~24 MB (~21,6 MB nos dois vídeos de scroll: `hero-scroll-v2.mp4` ~14,7 MB e `impacto-assembly-scroll.mp4` ~6,9 MB). `public/` tem ~163 MB de fonte bruta não referenciada no código (ex. `videohero.mp4` 93,5 MB). Tirar fontes sem consumidor do deploy (`.vercelignore` / `docs/fontes/`); reencode dos dois scroll-videos sem quebrar scrub; documentar ffmpeg; medir MB antes/depois. Não apagar derivados em uso. Lint/build OK.

### O que foi feito
Entrega sem conferência. Dez fontes sem consumidor em `src/` saíram de `public/` para `docs/fontes/videos/` (~170,76 MiB). `docs/fontes` entrou no `.vercelignore`. Derivados em uso ficaram. Vídeos de scroll: 21,59 → **12,65 MiB** (−8,93 MiB, −41,4%). Home estimada ~24 → **~15,05 MiB**. `hero-scroll-v2.mp4`: 14,69 → **10,43 MiB** — 1440×1440, 24 fps, all-intra (361/361 keyframes), `Content-Length` 10.936.383. `impacto-assembly-scroll.mp4`: 6,90 → **2,22 MiB** — 1280×720, 24 fps, all-intra (225/225), `Content-Length` 2.332.360. FFmpeg all-intra `-g 1`: CRF 35 (hero a partir de `docs/fontes/videos/videohero.mp4`) e CRF 32 (impacto); `scale` lanczos, `yuv420p`, `+faststart`. Comandos também nos comentários de `HeroCinematic.tsx` e `legacy.ts`. Lint 0 erros (22 warnings); tsc OK; build OK. `test:copy` vermelho por copy concorrente.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco único. Citados: movimentação para `docs/fontes/videos/`, `.vercelignore`, `public/videos/hero-scroll-v2.mp4`, `public/videos/impacto-assembly-scroll.mp4`, comentários em `HeroCinematic.tsx` e `legacy.ts`.

---

## SIS-240 — / · BrandGrid: logos ilegíveis em repouso (7/15 < 3:1)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-240/brandgrid-logos-ilegiveis-em-repouso-715-andlt-31

### Pedido
Na home, `BrandGrid` deixa 7 de 15 logos com contraste de repouso < 3:1 (método p5 tinta × p95 fundo): addactis 1,79; dacadoo 2,09; sys4b 2,34; microsoft-azure 2,41; earnix 2,47; sap 2,95; itg 2,95. Causa: `grayscale(1)` + `opacity: 0.62` sobre campo quase branco. Subir opacidade e/ou aliviar grayscale; remedir as 15; alvo ≥ 3:1; hover continua a devolver cor; reduce sem regressão. Não trocar arquivos de logo. Capturas 1440; lint OK.

### O que foi feito
Sonda `scripts/medir-brandgrid-sis240.mjs`; baseline `docs/medidas/brandgrid-sis240/antes.json` (bate com a issue ±0,03). Tetos sem véu: addactis **2,62:1** e dacadoo **2,83:1** — arquivos não passam de 3:1 só com opacidade. Entrou `brightness(<1)` (não toca alfa). Calibração `scripts/calibrar-brandgrid-sis240.mjs`. CSS: `filter: grayscale(1) brightness(0.8); opacity: 0.85;` (era grayscale 1 + opacity 0,62); exceções `[data-marca='addactis']` brightness 0,6 e `dacadoo` 0,7.

Depois, **0 abaixo de 3:1**; pior sys4b **4,14:1**. Addactis 1,81 → **4,44**; dacadoo 2,10 → **4,53**; azure 2,38 → **4,65**; earnix 2,45 → **4,79**; sap 2,97 → **5,90**; itg 2,92 → **6,09**. Hover das claras piorava (addactis 2,41) — corrigido com brightness 0,7 / 0,75 no hover colorido. Hover final todas ≥ 3:1 (earnix 3,09 o mais apertado). Reduce: `[data-logo]` zera filter da cascata, não da `img` do véu — véu sobrevive. Docblock do peso do hero 10,43 MiB conferido (SIS-241). Lint 22/0. Capturas `docs/capturas/sis240-brandgrid-1440-repouso-{antes,depois}.png` e hover addactis. Correção de instrumento: tetos medidos no meio da `transition: filter` 400 ms; espera pelo `filter: none` real. `test:copy` falhava antes (Celent).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco. Citados: CSS da BrandGrid (`brand-grid.css` / regras `[data-marca]`), `scripts/medir-brandgrid-sis240.mjs`, `scripts/calibrar-brandgrid-sis240.mjs`.

---

## SIS-239 — /eventos-inovacao · mobile: carrossel horizontal automático dos eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-239/eventos-inovacao-mobile-carrossel-horizontal-automatico-dos-eventos

### Pedido
Em `/eventos-inovacao` no mobile, a lista de 15 eventos deve ser carrossel horizontal com avanço automático. Desktop ≥1024 inalterado. Pause em reduce e interação; conteúdo completo; YouTube só onde há gravação (SIS-205). Capturas 390 (+768); lint OK. Feedback 14/09 de intuitividade tratado em SIS-251.

### O que foi feito
Entrega sem conferência, a pedido. <1024: carrossel horizontal, um cartão + espiada (319 px / 40 px em 390). Estado no `scrollLeft` da faixa (não índice React). Laço `% 15`. Intervalo **6 s**. Seis pausas: fora de 1024, reduce, faixa fora de quadro, aba em segundo plano, hover/foco/dedo, rastro 7 s após gesto. Reduce: `useReducedMotion()` + CSS `@media` e `html[data-motion='reduce']`. Conteúdo nó a nó; YouTube só em dois; 15 marcas decorativas. Sonda: 10 asserções reprovam no «antes» e passam no «depois». Percurso 4.988 px (390); altura da faixa 594 px (era 6.413). Autoplay 0 → 331 px; laço 4.598 → 0; parado em reduce e ponteiro. 1024/1440: lista `display: none`, palco intacto. `tsc` limpo; lint sem aviso novo. `test:copy` já reprovava (SIS-238); lock não regenerado. Ressalvas: sem botão de pausa WCAG 2.2.2; volta do laço é rebobinagem; sobra vertical nos cartões curtos; artes `loading="lazy"`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-carrossel-eventos-sis239.mjs`

---

## SIS-237 — /esg · ENVIRONMENT + GOVERNANCE: flutuação e hover bem perceptíveis

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-237/esg-environment-governance-flutuacao-e-hover-bem-perceptiveis

### Pedido
Nos 12 cards ENVIRONMENT + GOVERNANCE de `/esg`: superfície/texto/imagem claros e legíveis; flutuar leve cima↔baixo; hover perceptível (levantar/cor/sombra). Mesmo tratamento nas duas seções. Reparo de percepção sobre SIS-208/210. Reduce parado. Capturas 1440; lint OK. Follow-up de cor de repouso: SIS-252.

### O que foi feito
Entrega concluída sem conferência, conforme solicitado. Nos 12 cards: flutuação compartilhada mais perceptível, percurso de **14 px** e fases distintas; hover compartilhado com levantamento de **12 px**, escala, banho ciano, borda e sombra reforçados; superfície mais escura para separar os cards da faixa. Reduce validado em `prefers-reduced-motion` e `data-motion` (parados, hover suave). Evidências `docs/medidas/sis237/`: contraste mínimo **6,40:1** em repouso e **5,56:1** no hover; 1440, 390 e estados reduzidos. Portões: lint, TypeScript, build e diff-check escopado passaram. `test:copy` vermelho por SIS-238 em `src/data/reconhecimentos.ts`. Issue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-236 — /parceiros-e-implementacoes · tirar tarja azul clara da capa / emenda

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-236/parceiros-e-implementacoes-tirar-tarja-azul-clara-da-capa-emenda

### Pedido
Na capa/abertura de `/parceiros-e-implementacoes`, remover a tarja azul clara entre o bloco escuro e o claro. Identificar origem (vão `mt-14`, véu, `section-light-blue`, emenda linha do tempo, etc.). Sem regressão de contraste do título (SIS-228). Capturas antes/depois 1440 (e 390 se existir); lint OK. Fora de escopo: arte da capa, cards SIS-218/219, viajante SIS-220.

### O que foi feito
Origem: **`mt-14` de `#parceiros`**, não o véu. Varredura x=8 a 1440: pé do hero 0→665 `#012045`→`#092347`; tarja **666→721 (56 px)** `#1b81c7`→`#4d9bd2` (body `#1273bc` + sombra SIS-93 `0 0 54px 18px rgb(227 241 251 / 45%)`); `#parceiros` 722+ `#dfeffa`. Conserto: `mt-14` sai de `#parceiros` em `src/app/parceiros-e-implementacoes/page.tsx`. `pt-16 md:pt-20` e `scroll-mt-32` (128 px) permanecem.

Auditoria APROVADO, 0 falhas (`docs/medidas/sis236/auditar.mjs`). Vão/tarja 56 → **0** em 1440 e 390. Contraste idêntico antes/depois: eyebrow 10,73 / 6,11; título branco 13,11 / 7,28; destaque ciano 10,45 / 5,72; descrição p1 6,80 / 6,16; p2 6,14 / 8,81. Emendas `#implementacoes` / logos / `#linha-do-tempo` sem listra nova (a 390 as mesmas 121/103/19 px, deslocadas 56 px). Capturas `docs/medidas/sis236/{antes,depois}-{emenda,capa}-{1440,390}.png`. Lint 0 erros (22 avisos SIS-182); tsc limpo; `test:copy` falha por textos Celent (SIS-230). Sonda de pixel-a-pixel da capa descartada (animação perpétua do destaque). Guarda geométrico −8 px a 390 na ponta da sombra não veta (contraste idêntico).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `docs/medidas/sis236/diagnostico.mjs`
- `docs/medidas/sis236/auditar.mjs`
