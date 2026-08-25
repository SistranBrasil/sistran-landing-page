# Baseline — Fase 0 (relatório de UX, roadmap p20)

Registro do estado do projeto ANTES das fases de implementação. Gate da Fase 0:
"nenhum texto mudou; baseline versionado".

Data: 19/08/2026 · Next 16.3.0 · React 19.2 · Tailwind 3.4.13

## Copy Lock (Regra Zero, p3)

- `copy-lock.json` na raiz — 1272 entradas, 1027 textos distintos.
- Gerador/verificador: `scripts/copy-lock.mjs`, sem dependência nova.
  - `npm run copy-lock` grava o lock (uso deliberado, exige aprovação de conteúdo)
  - `npm run test:copy` verifica; sai com código 1 e lista o que mudou
- Comparação por **valor**, não por ID: mover texto entre arquivos é refatoração
  permitida; alterar, resumir ou apagar escrita quebra o teste.
- Espaço de renderização (indentação de JSX, quebras de linha) é normalizado —
  a exceção que o próprio relatório abre.
- **Limite conhecido:** números que vivem como `number` nos dados
  (`METRICS[].value`) não entram no lock, porque o extrator só captura strings.
  Rótulos, títulos, parágrafos e CTAs entram.

## Rotas publicadas (confirmadas no build)

`/` · `/quem-somos` · `/solucoes` · `/solucoes/[slug]` (7 aceleradores) ·
`/transformacao-legado` · `/parceiros-e-implementacoes` · `/eventos-inovacao` ·
`/esg` · `/trabalhe-conosco` · `/contato` · `/sistran-labs` ·
`/sistran-university` · `/blog` · `/blog/[slug]` (1 post) ·
`/politica-de-privacidade` · `/relatorio-de-transparencia-salarial` ·
`/sitemap.xml` · `/robots.txt`

Todas estáticas (○) ou SSG (●). Saída completa em `docs/baseline/build.txt`.

Divergência com o relatório (p4): o relatório inventariou 8 rotas; o projeto
publica 16 + 2 arquivos. As páginas legais, `/blog`, `/sistran-labs`,
`/sistran-university` e `/transformacao-legado` não estavam no inventário dele.

## Lint (`docs/baseline/lint.txt`)

21 problemas: **3 erros** e 18 avisos, todos anteriores a estas fases.

- 3 erros, mesmo padrão em três diálogos — "Cannot access refs during render":
  `src/components/ContactModal.tsx:35`,
  `src/components/layout/MotionPreferenceDialog.tsx:35`,
  `src/components/legacy/RoadmapStopDialog.tsx:48`.
  Serão resolvidos na Fase 1, junto com a devolução de foco ao gatilho.
- 18 avisos `react-hooks/static-components`, todos do padrão `getIcon()` chamado
  durante o render (`PillarsCarousel`, grids de ícones). Não é P0 no relatório.

## Não capturado nesta fase

- **Screenshots das rotas** em wide / 1024 / 768 / 360×800 e **medição de
  LCP/INP/CLS**: exigem navegador headless (Playwright ou Lighthouse CI), que
  seria dependência nova. A regra em vigor é preservar a stack, então o registro
  visual fica pendente de decisão: ou se adiciona Playwright como
  `devDependency`, ou a comparação antes/depois é feita manualmente no navegador
  a cada gate.
- Sem esse registro, o gate visual de cada fase passa a ser revisão manual em
  360×800, 768, 1024 e wide — foi assim que a Fase 1 será verificada.

## Pendências de conteúdo (não são código)

- `35+ Total de Seguradoras` (`src/data/metrics.ts`) — o relatório (p10) tratou
  esse número como divergente de "45+ anos", mas são grandezas diferentes
  (seguradoras × anos). Sem conflito real no projeto; aguarda confirmação do
  dono do conteúdo se o total de seguradoras mudou.
- "mais de 30 implementações de ERP" (`/solucoes`) × "mais de 40 implementações"
  (A Sistran) — divergência registrada em `.claude/conteudo-site/_index.md:89`,
  ainda sem decisão.

## Decisões de conteúdo já aplicadas (autorizadas em 19/08/2026)

- Clientes: **130+ → 150+** (`metrics.ts`, `About.tsx`, `quem-somos/page.tsx`,
  `TrustTicker.tsx`).
- História: "mais de 30 anos de vida" → "mais de 45 anos de vida"
  (`aSistran.ts`), alinhado ao "45+ anos Latam" que já existia.
- Footer YouTube: `'#'` → canal oficial (`contact.ts`).
- Hero: removido o `setInterval` de 8s; os 3 slides passaram a ser capítulos do
  scroll (`HeroCinematic.tsx`).

O `copy-lock.json` foi gerado **depois** dessas quatro decisões — ele trava o
estado aprovado, não o anterior.

---

## Fase 1 — P0 de acessibilidade e privacidade (concluida)

Arquivos alterados:

- `src/app/layout.tsx` — skip link `Pular para o conteudo` como primeiro foco; monta `AnchorFocus`.
- `src/app/page.tsx`, `src/components/PageShell.tsx` — `<main id="conteudo" tabIndex={-1}>` (nao criamos um segundo `<main>` no layout).
- `src/app/globals.css` — `.skip-link`, `main:focus { outline: none }`, `--header-h: 88px`, `scroll-margin-top` das seccoes ancoraveis, utilitario `.touch-44`.
- `src/app/actions/contato.ts` (novo) — `enviarContato` e `enviarFormulario`; POST sempre, nada persistido enquanto a LGPD nao for revista.
- `src/components/ContactModal.tsx`, `src/components/forms/DemoForm.tsx` — `useActionState` + `action=`, `role="status" aria-live="polite"`, `aria-invalid`, botao desabilitado durante o envio. Nenhuma string visivel alterada.
- `src/components/legacy/RoadmapStopDialog.tsx`, `src/components/layout/MotionPreferenceDialog.tsx` — foco devolvido ao gatilho depois do `close()`.
- `src/components/ui/AnchorFocus.tsx` (novo) — foco no destino da ancora em `hashchange`.
- Alvos de toque para 44px: `Footer.tsx` (2x), `EventsGrid.tsx` (3x), `Header.tsx` (menu), `ui/ScrollSpy.tsx` (area de 44px com o ponto visual intacto), `solucoes/page.tsx` (`AnchorPill`, `min-h-[44px]`), `ContactModal.tsx` (fechar).
- `scripts/copy-lock.mjs` — filtro passou a ignorar strings de classe com `!`; `copy-lock.json` regenerado (1288 entradas, 1036 distintas).

Gate: `npx tsc --noEmit` limpo; `npx next build` verde (16 rotas + sitemap/robots); `npx eslint src --ext .ts,.tsx` = **0 erros**, 18 avisos pre-existentes; `npm run test:copy` OK.

Pendencia consciente: auditoria axe automatizada continua fora (exigiria dependencia nova) — a verificacao de teclado e responsividade segue manual por gate.

---

## Fase 2 — cabecalho, hero e politica de movimento (concluida)

- `src/components/Header.tsx` — dois limiares de scroll: 40px intensifica o fundo, 80px compacta (88px -> 68px, 72px -> 64px no mobile) e reduz o logo; `--header-h` passa a ser escrita pelo proprio header, para o `scroll-margin-top` das ancoras acompanhar a altura real; scrim atras do drawer; `inert` em `#conteudo` e `footer` com o menu aberto (o Tab passava pelos links atras do menu).
- `src/app/globals.css` — percurso do hero de 200vh/320vh para 170vh/260vh; tokens `--motion-fast/base/scene/ease`; regra de aba oculta (`html[data-hidden]`) pausando marquee, orbs e linhas tracejadas.
- `src/components/HeroCinematic.tsx` — indicadores de capitulo 01/02/03 abaixo da barra de progresso: dizem o ponto do percurso e levam direto ao capitulo (`irParaCapitulo`, via Lenis quando disponivel). Alvo de 44px, `aria-current`, texto `sr-only` "Capitulo X de Y".
- `src/components/layout/MotionPolicyProvider.tsx` (novo) + `src/app/layout.tsx` — `MotionConfig reducedMotion="user"` com duracao/easing dos tokens, e `data-hidden` em `<html>` com pausa de video em `visibilitychange` (so retoma o que estava tocando).

Decisoes tomadas de proposito, divergindo do texto do relatorio:

- **Sem botao Pausar/Continuar no hero.** O relatorio pediu isso porque o hero girava por temporizador. O temporizador foi removido na fase anterior por decisao do usuario ("deixa so do scroll"): nao ha o que pausar. Os indicadores de capitulo entregam o que faltava — saber onde se esta e chegar a qualquer capitulo.
- **Mobile continua sticky, nao virou cartoes empilhados.** Reestruturar a arvore por breakpoint remontaria a cena e faria GSAP/ScrollTrigger perderem medida — o mesmo motivo pelo qual reduced-motion e resolvido em CSS neste projeto. O acesso aos tres capitulos, que era o objetivo, esta garantido pelos botoes de capitulo, e o percurso caiu de 200vh para 170vh.
- **`gsap.globalTimeline` nao e pausado** em aba oculta: congela o site todo e nao volta se o componente desmontar oculto (ja documentado no proprio HeroCinematic).

Gate: `npx tsc --noEmit` limpo; `npx next build` verde (26 paginas); `npx eslint src` 0 erros / 18 avisos; `npm run test:copy` OK (lock atualizado: um rotulo novo, "Capitulos do hero", nada perdido).

---

## Fase 3 — cenas sticky (Diferenciais e Solucoes) (concluida)

`src/components/Differentials.tsx`

- A cena sticky passou a encostar em `calc(var(--header-h) + 1.5rem)`, nao no topo da viewport: o titulo ficava atras do cabecalho fixo e o card tinha sido encurtado (52vh) para compensar — voltou a 58vh.
- Estado intermediario dos cards de 750/500ms para `--motion-base` (420ms) / 260ms, conforme p15.
- Blur do card de baixo de 6px para 4px.
- Os pontos de progresso (antes `aria-hidden`, sem teclado) viraram botoes 01-04 com `aria-current`, rotulo `sr-only` com o titulo do passo e area de 44px; `irParaPasso` rola direto ao passo (Lenis quando disponivel).

`src/components/Solutions.tsx`

- Par tablist/tabpanel fechado: `id`/`aria-controls` nas abas, `role="tabpanel"` + `aria-labelledby` + `aria-hidden` nos paineis. A tablist ja era a fonte da verdade e o scroll ja so chamava `setActive`.
- Deslocamento do baralho de 34px/40px para 18px, escala de 0.055 para 0.04 por camada, transicao de .7s para os tokens de movimento (p16: 12-20px).

Mobile de ambas as seccoes continua em fluxo normal (grade de cards e acordeao) — era o que o relatorio pedia; nada a mudar.

Gate: `tsc` limpo, `next build` verde, `eslint src` 0 erros / 18 avisos, `test:copy` OK (novo rotulo "Passos dos diferenciais").

---

## Fase 4 — transicao entre rotas e orcamento de render (concluida)

`src/components/ui/PageTransition.tsx` — nao mudou de comportamento, ganhou o registro da decisao.

- **Desvio consciente do relatorio (p18): View Transitions nativa nao entra.** O componente de view transition do React so existe nas builds canary — verificado no React instalado (19.2.8), que nao o exporta em nenhuma das duas grafias, nem a estavel nem a prefixada com `unstable_`. Adotar exigiria trocar de React, e a regra do pedido e preservar stack e dependencias. Fica o cross-fade que ja existia: 400ms com o easing dos tokens, dentro da faixa de 400-600ms que o proprio relatorio aceita como fallback.
- `src/app/globals.css` — em `prefers-reduced-motion` e em `html[data-motion='reduce']`, as pseudo-classes de transicao de view sao neutralizadas. Nao e contradicao com o paragrafo acima: o navegador pode animar uma navegacao de historico por conta propria, sem o React pedir.

Orcamento de render:

- `.cv-auto` (`content-visibility: auto` + `contain-intrinsic-size: auto 900px`) aplicado **por seccao, nunca global**: `PartnersGrid` e `EventsGrid`. Seccao com pin/sticky nao pode receber a classe — o conteudo nao renderizado mede zero e o GSAP calcula o percurso errado. O `contain-intrinsic-size` evita o salto de layout que a classe causaria sem ele.
- `PartnersGrid` — logos com `loading="lazy"` e `sizes="(max-width: 640px) 60vw, 320px"`. Sao 76 marcas na pagina; sem o `sizes` o Next servia a variante larga para todas.
- `RoadmapStopMedia.tsx` e `RoadmapStopDialog.tsx` — `loading="lazy"` nas marcas dos clientes (`<img>` legado, com dimensao ja definida em CSS).
- **Preload segue seletivo.** Unica imagem com `priority` e o logo do cabecalho; o hero usa video/canvas. Marcar mais imagens como prioritarias competiria com o LCP em vez de ajuda-lo.

Orcamento por rota adotado como criterio de aceite (p20): LCP < 2,5s, INP < 200ms, CLS < 0,1.

Pendencia consciente: medicao de CWV continua manual (Lighthouse local). Automatizar exigiria Playwright — dependencia nova, fora do permitido.

Gate: `npx tsc --noEmit` limpo; `npx next build` verde (26 paginas); `npx eslint src --ext .ts,.tsx` 0 erros / 18 avisos pre-existentes; `npm run test:copy` OK, lock intacto (1040 textos distintos) — nenhuma escrita do site foi tocada nesta fase.

---

## Fase 5 — abertura opcional da home (concluida)

`src/components/intro/OptionalMorphIntro.tsx` (novo), estilos no fim de `src/app/globals.css`, montagem em `src/app/page.tsx`, marca de medicao em `src/components/Header.tsx`.

Como funciona: cena escura, bloco modular claro com a marca da Sistran e um percentual, quatro geometrias (uma por quarto do progresso) e, no fim, o bloco assume o retangulo medido do logo do cabecalho e o overlay se remove.

Parametros do relatorio (p19), aplicados como pedido:

- `minimumMs` = 1400 (faixa 1.200-1.600) — em cache quente a sequencia ainda e percebida.
- `maximumMs` = 4000 (teto 3.500-4.500) — nenhuma midia segura a pagina alem disso.
- morfagem 900ms; saida 420ms.
- `once: session` — `sessionStorage`, uma vez por aba.
- Reduced motion: sem geometria, sem morfagem, so a marca e uma dissolucao de 420ms (limite pedido: 500ms).

Decisoes:

- **Nenhuma escrita nova.** O bloco usa o logo que ja existe e um numero. Nada de slogan de abertura — seria copy inventada, o que o pedido proibe. O lock subiu de 1293 para 1296 apenas com strings tecnicas (chave de sessao, nome de evento, seletor de atributo).
- **Comeca com `hidden`; o script revela.** Se o JavaScript falhar ou for desabilitado, o overlay nunca aparece e a home fica visivel — o oposto do preloader classico, que cobre a pagina justamente quando o JS quebra.
- **Overlay decorativo:** `aria-hidden`, `pointer-events: none`, nao rouba foco. O percentual e um `output` real, mas fica dentro da regiao oculta para leitores de tela — prontidao nao e conteudo.
- **Progresso e composicao de sinais, nao cronometro:** inicio 8, DOM 18, `load` 22, fontes 20, marca critica 20 = 88. Os 12 finais so saem quando tudo resolve (respeitando o minimo) ou quando o teto vence. Sinal que falha tambem resolve: fonte indisponivel ou imagem com erro nao trava a abertura.
- **Toda a coreografia em CSS**, nao no React: e o que permite o reduced-motion do projeto (resolvido em `html[data-motion='reduce']` + media query) atuar sem ramificar a arvore por preferencia — a regra que ja vale para o resto do site.
- **Scroll restaurado pelo valor inline anterior**, nao por `''`, e restaurado tambem no cleanup: desmontar no meio (navegacao antes do fim) nao pode deixar a pagina sem rolagem.
- **Timer de seguranca** em vez de confiar em `transitionend`: a transicao pode ser cortada (aba oculta, reduced motion) e o overlay nunca sairia.
- **Sem alvo medivel** (`width` zero, logo ainda nao layoutado), a abertura dissolve em vez de morfar.

Pendencia consciente: o QA de rede lenta, midia 404, JS desabilitado, segunda visita na sessao e resize durante o carregamento e manual — automatizar exigiria Playwright, dependencia nova.

Gate: `npx tsc --noEmit` limpo; `npx next build` verde; `npx eslint src --ext .ts,.tsx` 0 erros / 18 avisos pre-existentes; `npm run test:copy` OK apos relock (1296 textos travados, nenhuma escrita do site alterada).

## Passada de refino visual

Nenhum texto, cor de marca ou fonte mudou. O que mudou foi hierarquia, ritmo e
contraste — as tres coisas que faziam as fases estruturais parecerem invisiveis.

- **Um tamanho por nivel de hierarquia.** O token `text-section`
  (`tailwind.config.ts`) virou o teto real dos titulos de secao:
  `clamp(2.2rem, 4.6vw, 4.1rem)`, entrelinha 1.04, `letter-spacing` -0.03em.
  Antes cada secao escolhia o seu proprio `clamp` inline (de 3.6rem a 5rem para
  o MESMO nivel), e o olho lia isso como desalinho, nao como enfase.
  `About`, `Social` e `Contact` passaram a usar o token, com `mt-5` entre
  sobrelinha e titulo.
- **Uma marca de canto, nao quatro.** Nos cards de indicador de `About` as
  quatro molduras em L disputavam atencao com o numero, que e a informacao.
  Ficou uma, no canto superior esquerdo, que cresce no hover. Card com
  `rounded-[26px]`, `bg-white/75` e `p-8`.
- **Ritmo em `Differentials`.** Cabecalho `mb-14` (era `mb-12`) e apoio `mt-6`
  (era `mt-4`): o bloco de titulo estava colado na grade de cards.
- **Contraste.** `.section-light .text-ink-faint` de `#5c7a9e` para `#4c6a8e`,
  para o texto pequeno das faixas claras passar de 4.5:1.
- **Emenda entre faixas.** `.section-light` recebeu `box-shadow` inset: linha de
  luz no topo e sombra azul da marca na base. O corte entre faixa clara e fundo
  navy era um degrau seco.

### Correcao no extrator do Copy Lock (achado durante a passada)

`textoJsx` exigia que o texto terminasse em `<`, entao **titulo partido** —
`Siga a Sistran no LinkedIn{' '}<span>...` — nunca entrava na Regra Zero. O
regex passou a `/[>}]([^<>{}]+)(?=[<{])/g`, e a heuristica `pareceCodigo`
ganhou as regras necessarias para o material extra (comentario vazado, resto de
objeto/array, condicao, especificador de import).

Dois cuidados que custaram tempo e ficam registrados:

- `` NAO serve de fronteira aqui: para o JS `const` acaba antes do `a`
  acentuado, logo `const` casa dentro de "constancia" e descartava escrita
  real. A regra usa `uma classe de letras que inclui os acentuados como fronteira negativa`.
- Nao existe regra por pontuacao inicial: frase que continua depois de um trecho
  em destaque comeca com virgula (", programa de capacitacao intensiva da
  Sistran...") e e escrita legitima.

Saldo: 15 textos reais entraram no lock (entre eles "Siga a Sistran no
LinkedIn", o paragrafo do relatorio de transparencia salarial e o bloco de
contato por e-mail) e 43 strings tecnicas (seletores `[data-*]`, `showModal()`,
`rotate(45deg)`, fragmentos de comentario) sairam. Lock em 1246 entradas,
1010 textos distintos.

## Digitacao do CTA "Fale com a Gente!"

Efeito opt-in (`<ContactCTA motionShowcase />`, so na home): o mesmo bloco fecha
outras nove paginas e elas continuam identicas.

- `TypewriterOnView` usa tres camadas no mesmo espaco — `sr-only` com o texto
  completo (nunca `display: none`), espelho `visibility: hidden` reservando as
  medidas finais e camada `aria-hidden` com um `<span>` por grafema. A digitacao
  acende opacidade, entao paragrafo e botao nao se movem. Sem `aria-live` e sem
  anuncio caractere a caractere.
- O gatilho é um `IntersectionObserver` de limiar 0.30 na SECAO, com
  `disconnect()` no primeiro disparo: sair e voltar a entrar na viewport nao
  reinicia nada.
- A quebra de linha da camada tem de coincidir com a do espelho, por isso os
  grafemas sao agrupados em `.tw-palavra` (`white-space: nowrap`) e o espaco é o
  unico `.tw-char` quebravel. O cursor é criado no efeito (ele CAMINHA pelo DOM)
  e tem margem lateral negativa para nao empurrar grafema.
- O encadeamento paragrafo/botao vive num `data-cta-etapa` no cartao, nao em
  estado do React: o SSR sai sem o atributo (tudo visivel) e armar depois nao
  custa render — tambem evita o aviso `react-hooks/set-state-in-effect`.
- `TechnicalCursorReveal`: SVG estatico sempre presente; o canvas 2D so entra em
  `(hover: hover) and (pointer: fine)`. A revelacao ESCAVA furos de uma mascara
  opaca com `destination-out`, por isso nao existe veu retangular sobre o
  degrade. RAF so com ponto vivo, DPR <= 2, e nada roda fora da viewport.

### Copy Lock — tres filtros novos

`pareceCodigo()` passou a descartar dado de path SVG, locale BCP47 e tag citada
em comentario. O filtro de path exige que a string INTEIRA seja comando +
coordenada: checar apenas o inicio derrubava escrita real, porque
"A Sistran ..." tambem comeca com um comando de path valido seguido de espaco.
Relock: 1221 entradas / 989 textos distintos (as saidas foram todas ruido
tecnico ja travado, nenhuma escrita).

## Explorador arquitetonico 360° em /quem-somos

Os tres arquivos entregues na raiz (`BuildingExplorer.tsx`, `BuildingHero.tsx`,
`INTEGRATION.md`) foram movidos para `.claude/importados/hero-3d/` — nao apagados
— e `.claude` entrou no `exclude` do `tsconfig.json`. Enquanto estavam na raiz,
`next build` falhava com `TS2307: Cannot find module 'three'`.

Do material veio **apenas o explorador 3D**. `BuildingHero` trazia cabecalho,
rodape, CTAs e metricas proprias ("850+", "18") que nao estao confirmadas pelo
dono do conteudo; nada disso foi para o site.

- `src/components/ui/BuildingExplorer.tsx` — cena Three.js portada. Quatro
  adaptacoes: (1) `prefersReducedMotion()` de `@/lib/motion` no lugar de
  `window.matchMedia` cru, para o controle "Preferencias de movimento" do site
  valer; (2) RAF pausado por `IntersectionObserver` (`rootMargin: 120px`) quando
  a cena sai da tela, com um quadro imediato no inicio para nunca aparecer em
  branco; (3) sem WebGL, um paragrafo `hidden` no DOM perde o atributo em vez de
  apontar para uma imagem inexistente (`public/images/...` nao existe neste
  projeto, que usa `public/imagens/`); (4) shadow map 1024 abaixo de 900px.
- `src/components/ui/BuildingShowcase.tsx` — moldura: seletor tower/campus,
  cartao de local, rotulo vertical e o "35+ / Anos de mercado" que ja existia em
  `CompanySignature`. `next/dynamic` com `ssr: false` + IntersectionObserver
  (`rootMargin: 300px`): o `three` (~600 kB) só desce quando a secao aproxima.
- Altura reservada em `.three-explorer-shell` (`clamp(360px, 62svh, 640px)`), com
  placeholder do mesmo tamanho antes do 3D montar: zero layout shift.
- CSS proprio no fim de `globals.css` (o `globals.css` que veio no material era
  de outro projeto e nao foi copiado). Pulso do cartao de local desligado em
  `prefers-reduced-motion` e em `html[data-motion='reduce']`.

Dependencia nova: `three` + `@types/three`. **Quebra a regra de "preservar a
stack, sem dependencia nova"** — inevitavel para 3D em tempo real, e o pedido foi
explicito.

Copy lock relockado: 1259 entradas / 1019 textos distintos. Nenhum texto
removido; os novos sao rotulos do explorador ("Vista atual", "Frente",
"Traseira", "Torre River Park", "Complexo Modular", "River Park · Cidade
Monções", "BR · 23°33′S" e o aviso de WebGL).

## Mapa dos escritorios do Brasil em /quem-somos

`mapa-conexoes-azul.html` foi portado para `src/components/ui/BrazilOfficesMap.tsx`
e montado dentro da secao "Escritórios BRASIL", antes dos cartoes — é ali que a
pagina fala de onde estao os escritorios. O HTML original foi movido para
`.claude/importados/`.

- Entrou só o mapa: barra de marca, titulo proprio, rodape e cartao de status da
  pagina original ficaram fora.
- Componente de servidor (sem `use client`): SVG estatico com animacao em CSS,
  zero JavaScript no cliente.
- Classes e ids ganharam prefixo `bm-`. Os nomes originais (`.card`, `.map`,
  `.label`, `.ring`, `.core`, `.route`) colidiriam com o CSS global do site.
- `prefers-reduced-motion` e `html[data-motion='reduce']` param o pulso da rota e
  o halo dos pontos; o traco de base e os tres pontos continuam visiveis, entao
  nenhuma cidade depende de animacao para aparecer.
- Rotulos sobem de 12px para 15px abaixo de 768px, senao ficam ilegiveis na
  escala reduzida do viewBox.

Copy lock: 1269 entradas / 1029 distintos. Novos textos: os nomes das tres
cidades, as coordenadas e o `title`/`desc` do SVG.
