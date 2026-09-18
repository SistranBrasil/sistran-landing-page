## SIS-114 — /esg · SOCIAL: sombra pulsante atrás dos cards de Fundación Huerta Niño e Fundación Aguas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-114/esg-social-sombra-pulsante-atras-dos-cards-de-fundacion-huerta-nino-e

### Pedido
Nos dois cards da seção SOCIAL de `/esg` (Fundación Huerta Niño e Fundación Aguas, já com as imagens da SIS-110), colocar sombra atrás do card e deixá-la pulsante, para soltá-los do fundo azul claro. Onde: `src/app/esg/page.tsx`, cards do `.map()` de `SOCIAL` (`glass-card relative overflow-hidden` + `.corner-accent`). Não animar `box-shadow` (pseudo atrás do card, `opacity`/`transform`); a sombra não pode ser cortada pelo `overflow: hidden`; com `prefers-reduced-motion: reduce` a pulsação para e a sombra permanece visível; pausa em `hover`/`focus-within` ou amplitude baixa (WCAG 2.2.2); sem `backdrop-filter` nem blur grande; mesmos ritmo/sombra nos dois cards, sem invadir Gerando Talentos nem o rodapé; `corner-accent` preservado. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado: `.esg-apoio` no `globals.css` + um wrapper por cartão em `src/app/esg/page.tsx`.

**Três decisões que não são cosméticas.**
1. A sombra mora num wrapper, não no `<article>`: o `overflow: hidden` dele — que é o que faz a foto sangrar até a borda arredondada — recortaria uma camada de `inset` negativo em nada. Mesmo arranjo da pluma do `.evento-cartao`.
2. Só `opacity` e `transform: scale` animam, nunca `box-shadow`: sombra de verdade não é escalável pela GPU. Daí a sombra ser um `radial-gradient` num `::before` de `inset: -24px`, com `border-radius: calc(var(--radius-card) + 24px)`.
3. Amplitude deliberadamente pequena (opacidade 0,55→1, escala 0,97→1,02, ciclo de 7s `cubic-bezier(0.37,0,0.63,1)`), na convenção do `social-card-flutuar` que já existe. O segundo cartão tem `animation-delay: -3.5s` — negativo, metade do ciclo, para ele já começar no meio da volta; um valor positivo o deixaria parado até lá.

**Acessibilidade.** `animation-play-state: paused` em `:hover` e `:focus-within` é a resposta ao WCAG 2.2.2 (movimento infinito acima de 5s). Em `prefers-reduced-motion: reduce` a animação para em estado visível (`opacity: 1; transform: none`) — sem isso o reset global (`animation-iteration-count: 1`) congelaria no frame 0, a 55% de opacidade. `isolation: isolate` no wrapper porque sem ele o `z-index: -1` da camada a jogaria para trás do fundo da seção.

Verificado a 1920 na seção SOCIAL: halo suave em volta dos dois cartões, defasados entre si, sem invadir o bloco Gerando Talentos acima nem a fronteira com GOVERNANCE abaixo, e o `corner-accent` segue legível sobre o vidro.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
**Aprovada.** Conferido na árvore: `.esg-apoio` no `globals.css` e o wrapper em `esg/page.tsx:268`. Os nove critérios batem. Nada anima `box-shadow`; a camada mora no wrapper, não no `<article>`; `prefers-reduced-motion: reduce` para em estado visível; `animation-play-state: paused` em `:hover` e `:focus-within`; `animation-delay: -3.5s` no `:nth-child(2)`; `inset: -24px` contra o `mt-14` (56px) que separa do Gerando Talentos. Observação não bloqueante: os dois cartões ficam a `gap-6` (24px) e cada pluma avança 24px — as camadas se superpõem no vão, em fases opostas; o conferente não abriu navegador e pediu só confirmação visual a 1920 e 768.

### Arquivos tocados
- `src/app/globals.css`
- `src/app/esg/page.tsx`

---

## SIS-113 — /esg: imagem de fundo atrás do título da abertura, com sombra leve e título deslocado para a esquerda

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-113/esg-imagem-de-fundo-atras-do-titulo-da-abertura-com-sombra-leve-e

### Pedido
Na abertura de `/esg`: colocar `public/images/esg/esg.jpg` (348 KB) como fundo atrás do título; aplicar sombra leve dissolvida (sem aresta reta, risco da SIS-112); deslocar o título mais para a esquerda. Texto inalterado (compromisso ESG / highlight “práticas sustentáveis”). Escopar em `/esg` sem mudar as outras 13 aberturas do `PageHero` compartilhado; reaproveitar o padrão do `HeroVideoBackdrop`. Contraste AA do título, highlight e descrição sobre a foto; `next/image` com `priority` e `sizes` de largura cheia; `id="topo"` preservado; com `prefers-reduced-motion` tudo visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado com um componente novo, `src/components/ui/HeroImageBackdrop.tsx`, e uma linha de uso em `src/app/esg/page.tsx`.

**Por que componente novo e não prop no `HeroVideoBackdrop`.** Ele reaproveita as mesmas classes `.hero-backdrop*`, então o empilhamento fechado, o `-7rem/-9rem` que faz a mídia subir por trás do header, o véu calibrado na SIS-94 e a pluma da SIS-112 vêm de graça. A diferença é só a mídia (`next/image` em vez de `<video>`) — e por ser imagem não há laço, autoplay nem nada a pausar, então o componente é de servidor, sem `'use client'`. Uma prop `tipo` seria dois corpos dentro de um `if` e obrigaria a rota estática a virar cliente sem precisar.

**Peso.** O `esg.jpg` que já estava na pasta (1031×690, JPEG de 348 KB) virou `.webp` de 48 KB nas mesmas medidas, sem redimensionar; o original foi para `docs/fontes/esg/`, fora de `public/`. A foto é pequena para uma faixa de 1920 e o navegador amplia — aceitável porque ela vive sob o véu pesado; os 348 KB não seriam.

**Enquadramento e acessibilidade.** `object-position: 50% 42%` — o `cover` corta em cima e embaixo, e 42% preserva os rótulos e o globo em vez de sobrar a mesa desfocada. `alt=""` de propósito: nada na foto é informação, e os três eixos que ela rotula são exatamente os três títulos de seção logo abaixo.

Verificado a 1920×1080, 1366×768 e 390×844: título e `highlight` em ciano legíveis sobre a terça parte escura da imagem, globo/ESG/mão intactos à direita, sem aresta na pílula do header, ScrollSpy “INÍCIO” no lugar. `id="topo"` e as outras 13 aberturas intocados. Sem movimento novo.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
**Aprovada.** Conferido na árvore: `HeroImageBackdrop.tsx` (70 linhas) e uso em `esg/page.tsx:136-150`. Componente de servidor de fato; reaproveita `.hero-backdrop*`; `fill` + `sizes="100vw"` + `priority`; `esg-hero.webp` = 47.962 B; original 348.203 B em `docs/fontes/esg/`. O deslocamento do título a partir de 1280px (`padding-left: 10rem`) casa com o `matchMedia('(min-width: 1280px)')` do `ScrollSpy`; abaixo de 1280 o recuo cai para o `clamp`. `max-width: none` no `container-lp` desta abertura não solta a medida de leitura (`max-w-[46ch]` / `max-w-2xl`). Portões e as três larguras: relato do executor, não verificação do conferente.

### Arquivos tocados
- `src/components/ui/HeroImageBackdrop.tsx`
- `src/app/esg/page.tsx`
- `public/images/esg/esg-hero.webp`
- `docs/fontes/esg/esg.jpg`

---

## SIS-112 — /solucoes: as sombras do vídeo de abertura estão em arestas retas — deixar a passagem sutil

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-112/solucoes-as-sombras-do-video-de-abertura-estao-em-arestas-retas-deixar

### Pedido
No bloco de abertura de `/solucoes` (`HeroVideoBackdrop`), as sombras terminam em linha reta (laterais e encontro com a barra azul do topo). Fazer as sombras dissolverem, sem aresta perceptível, sem perder o contraste AA do título e do eyebrow (opacidades da SIS-94). Investigar `.hero-backdrop-veu`, `.hero-backdrop-midia`, `.hero-backdrop-video` e o próprio arquivo de vídeo. Conferir `/quem-somos` e `/eventos-inovacao`. Sem `backdrop-filter` nem blur em área grande. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado: a pluma do topo das aberturas com vídeo/foto passou a ser `.hero-backdrop-veu::before` — quatro `linear-gradient` de `rgba(3,20,40,0.5–0.55)` dissolvendo em 56px, mesmo arranjo do `.evento-cartao::after`, que é a “pluma” canônica do projeto. A camada vive fora do nó com `overflow: hidden`, senão seria recortada em nada.

Verificado a 1920×1080 nas quatro aberturas com mídia: a mídia sobe por trás do cabeçalho fixo e some sem aresta — não há mais a linha reta onde a pílula do header cruzava o vídeo. Conferido também a 1366×768 e 390×844 (na largura de celular o header é a pílula compacta e a pluma cobre a mesma faixa). Sem movimento novo, portanto nada a fazer em `prefers-reduced-motion`.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-111 — /eventos-inovacao: centralizar e proporcionar o texto sobre a imagem, e deixar o preview lateral mais discreto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-111/eventos-inovacao-centralizar-e-proporcionar-o-texto-sobre-a-imagem-e

### Pedido
Depois do layout da SIS-106: conter o bloco de texto (eyebrow, número, título, descrição, botão) dentro da imagem, centralizado, com escala proporcional, sem vazar nem cobrir o card seguinte; reduzir o peso visual do preview lateral sem perder acessibilidade. Critérios reescritos em 03/09/2026 após a SIS-115 (barra flutuante na base no lugar do preview lateral). O chip do YouTube saiu para a SIS-131. Aceite de texto: `.evento-texto` com `width: min(62ch, --evento-largura * 0.72)`, `margin-inline: auto`, `text-align: center`; `font-size` ancorado em `--evento-largura`; fatias de `92svh` com `sticky bottom`; contraste AA medido na SIS-115 (pior caso 5.94 / 5.33, evento 01). Pendente: anúncio de estado à tecnologia assistiva e reverificação visual nas três larguras após a SIS-115.

### O que foi feito
Implementado (CSS em `src/app/globals.css`, sem mudança de componente).

**Causa raiz medida, não inspecionada.** A foto (`.evento-cartao`) se posiciona contra a viewport, dentro do palco full-bleed; o quadro de texto (`.evento-quadro`) se posiciona dentro da coluna de grid do `.container-lp`. Dois sistemas de coordenadas. Medido a 1920: foto em x=60..1185, texto em x=402..1198 (vazava 13px à direita e sobrava 342px à esquerda); o quadro terminava 136px abaixo da base da foto, porque o `sticky bottom: 5.5rem` prende à viewport enquanto a base da foto está 224px acima.

**Correção.** Foto e texto passaram a derivar das mesmas variáveis (`--evento-caixa`, `--evento-largura`, `--evento-foto-esq`, `--evento-foto-base`). O texto ficou centralizado na largura da foto (72% dela, `min(62ch, …)`), com título e descrição em `clamp()` proporcional à caixa.

**Verificado com Playwright.** Horizontal, contenção exata: 1920 → foto `[37,1162]` == quadro `[37,1162]`; 1366 → `[27,927]` == `[27,927]`. Vertical (foto t=224 b=856 a 1920): quadros pinados em `[383,767]`, `[558,760]`, `[470,754]` — todos dentro da foto; o quadro seguinte entra em 851–864, folga de 97px. A 1366 (foto t=131 b=637): `[168,524]` e `[242,431]`, folgas de 72px.

**Escrim recalibrado em duas camadas.** Núcleo estreito e forte (44%/122%, 0.95) + queda larga e fraca (72%/150%, 0.5), com máscara vertical. Calibrado no evento 02 (ITC Vegas).

**Painel de navegação** com hierarquia real: itens inativos a 50% de opacidade e miniatura em `saturate(0.35)`; alvo de 44px; `saturate` sem transição em `prefers-reduced-motion`.

**Mobile intocado** — tudo atrás de `@media (min-width: 1024px)`; conferido a 390×844.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline), `copy-lock` 2105 textos.

### Conferência
Não há `VEREDITO: APROVADO`. Há **reavaliação após a SIS-115** (leitura estática, sem navegador): texto sobre a imagem preservado (contenção, escala, sticky, contraste AA). Preview lateral caducou (virou barra na base; espírito atendido com opacidade 0.78 e alvo 44–46px). Foco visível feito (`:focus-visible`, anel de 2px); `aria-current` sem objeto. Achado fora da SIS-115: o chip “Assista no YouTube” é `<span>` sem `href`/`onClick` e `events.ts` não tem URL de vídeo — recomendação de issue própria (depois SIS-131). Verificação nas três larguras precisa ser refeita. Nada alterado no código nem no status.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-110 — /esg · SOCIAL: colocar as imagens de Fundación Huerta Niño e Fundación Aguas nos cards

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-110/esg-social-colocar-as-imagens-de-fundacion-huerta-nino-e-fundacion

### Pedido
Na seção SOCIAL de `/esg`, os dois cards só-texto ganham imagem: Huerta Niño → `public/images/esg/Huerta-Nino.jpg` (228 KB); Aguas → `public/images/esg/Aguas.jpg` (179 KB). Textos e links inalterados. Array `SOCIAL` com campo de imagem; `.map()` desenha os cards. Coordenar com SIS-109 (Gerando Talentos sai do grid); ajustar `lg:grid-cols-3` para duas colunas; `alt` descritivo; grafia exata dos arquivos; `next/image` com `sizes` coerente; mesma forma nos dois; `corner-accent` visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Feito na mesma passada da SIS-109.

**As duas fotos entraram** como campo `image` (`src` + `alt`) no array `SOCIAL`, só estes dois itens:
- Huerta Niño → `/images/esg/Huerta-Nino.jpg` — “Crianças e voluntários em uma horta agroecológica construída pela Fundación Huerta Niño”
- Aguas → `/images/esg/Aguas.jpg` — “Comunidade atendida pelo projeto Fundación Aguas com acesso a água potável”

Sem conversão: já eram JPG 1247×832 de 223 KB e 175 KB; `next/image` serve WebP redimensionado.

**Mesma forma:** foto no topo (`h-52 object-cover`), texto e link abaixo; cartão `p-0`, respiro `p-7` no bloco de texto.

**Grid:** `md:grid-cols-2` em vez de `lg:grid-cols-3`.

**`corner-accent`:** desceu para o bloco de texto (`relative`). No canto do `<article>` cairia em cima da foto.

**`sizes`:** `(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 560px` — medido em 1920: 544px de caixa em cada card.

Grafia exata (`Huerta-Nino.jpg`, `Aguas.jpg`). Textos e os dois links externos inalterados (rótulos “Saiba mais sobre a Fundación Huerta Niño” / “Conheça melhor o projeto Fundación Aguas”).

**Verificação** — 1920×1080, 1366×768 e 390×844: imagens `complete && naturalWidth > 0`, dois `<article>` sem buraco, `overflow-x` 0, 0 erro de console. `tsc --noEmit` limpo, `next build` compila, `eslint src` 0 erros. Capturas em `docs/capturas/sis109-110-esg-social-1920.png` e `-mobile.png`.

### Conferência
**Aprovada.** Conferido na árvore contra `src/app/esg/page.tsx:261-308`. Arquivos no disco 228.261 B e 179.047 B; `md:grid-cols-2`; conta de `sizes` refeita (`container-lp` 1180px → 546px por coluna, degrau 560px correto). Três larguras e gates: relato do executor, não verificação do conferente.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `public/images/esg/Huerta-Nino.jpg`
- `public/images/esg/Aguas.jpg`

---

## SIS-109 — /esg · SOCIAL: dar ao “Projeto Gerando Talentos” um bloco próprio, com logo e as fotos das três turmas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-109/esg-social-dar-ao-projeto-gerando-talentos-um-bloco-proprio-com-logo-e

### Pedido
Na seção SOCIAL de `/esg`, Gerando Talentos deixa de ser um dos três cards iguais e ganha bloco de destaque com logo (`logo-Gerando-Talentos.png`) e fotos das três turmas. Texto dos dois parágrafos inalterado. Sair do array `SOCIAL` ou campos opcionais; fundo claro vs. escuro (seção `section-light-blue`); otimizar assets (~2 MB); grafia exata dos arquivos; `next/image` + `alt` descritivo; fotos alcançáveis com reduced-motion e teclado; Huerta Niño e Aguas preservados sem mídia neste pedido. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Bloco próprio, fora do array.** `GERANDO_TALENTOS` em `src/app/esg/page.tsx`. Layout em duas colunas: logo + título + dois parágrafos à esquerda; três turmas à direita (1ª grande, 2ª e 3ª lado a lado).

**Fundo: claro.** Referências pretas abririam duas fronteiras claro/escuro (dois `NotchDivider`). Contraste escuro veio da logo (placa navy com moldura laranja).

**Galeria estática, não carrossel.** Três fotos no DOM ao mesmo tempo. Cada foto é `<figure>` com `<figcaption>` (`1ª/2ª/3ª TURMA`) e `alt` descritivo.

**Assets: 2,3 MB → 197 KB.** WebP sem redimensionar (turmas 750×422): logo 815 KB → 33 KB (alfa); 1ª turma 163 KB → 41 KB; 2ª 569 KB → 67 KB; 3ª 560 KB → 56 KB. Originais em `docs/fontes/esg/`, fora de `public/`. `public/images/esg` inteira 612 KB (contando os JPG da SIS-110).

**`next/image` com `sizes`:** medido em 1920: logo 240px, 1ª turma 532px, 2ª/3ª 257px. `width`/`height` nas medidas do arquivo.

**ScrollSpy:** o bloco não virou entrada própria. `/esg` segue com os quatro itens da SIS-100.

**Verificação** — 1920×1080, 1366×768 (com `prefers-reduced-motion: reduce`) e 390×844: 3 `<figcaption>`, imagens completas, `overflow-x` 0, 0 erro de console. `tsc --noEmit` limpo, `next build` compila, `eslint src` 0 erros (19 avisos). Capturas: `docs/capturas/sis109-110-esg-social-1920.png` e `-mobile.png`. Texto idêntico; Huerta Niño e Aguas mantidos (mídia na SIS-110).

### Conferência
**Aprovada** na árvore: constante própria, galeria estática, `sizes` 560px/272px, originais 2,40 MB em `docs/fontes/esg/`, WebP 41.938 / 68.448 / 57.666 B e logo 33.714 B. Ponto de atenção (não bloqueia): seis PNG `esg-1.png`…`esg-6.png` em `public/` (~1,56 MB) sem referência — depois **corrigido** pelo conferente: são insumos da SIS-139, mais seis em `public/images/governance/` da SIS-141; condição de fechamento daquelas issues é mover os PNG originais para `docs/fontes/esg/` após conversão. Portões e larguras: relato do executor.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `public/images/esg/` (WebP da logo e das três turmas)
- `docs/fontes/esg/` (originais)

---

## SIS-108 — /parceiros-e-implementacoes: seção “Implementações” — remover o “02”, o mosaico de cards e a parede de logos, e usar a faixa clara de marcas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-108/parceiros-e-implementacoes-secao-implementacoes-remover-o-02-o-mosaico

### Pedido
Na seção Implementações de `/parceiros-e-implementacoes`: remover “02 ·” do eyebrow; remover `ImplementationsMosaic` e `ClientWall`; colocar a faixa clara de marcas (`SignalMarquee`, mesma da home). Resolver fronteira claro/escuro; sem componente órfão; reduced-motion com marcas alcançáveis; `id="implementacoes"` preservado. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
`src/app/parceiros-e-implementacoes/page.tsx`: eyebrow `Implementações`; a seção 01 também perdeu o número (`Parceiros`). `ImplementationsMosaic` e `ClientWall` fora; `SignalMarquee` entre dois chanfros. Arquivos removidos: `src/components/ClientWall.tsx`, `src/components/ImplementationsMosaic.tsx` (únicas montagens). O `id="clientes"` do `ClientWall` não era destino de link.

Mosaico e parede liam a mesma lista `CLIENTS` — troca 1-por-1 com duplicata removida. `SignalMarquee` filtra por `c.logo`; as 15 entradas ativas têm logo: Samplemed, Virtusa, ITG, Microsoft Azure, Pega, AWS, ST-IT, Addactis, Sys4B, FRISS, Sensedia, SAP, Picsel, Earnix, Dacadoo.

Fronteira: `NotchDivider cor="#f5faff"` (invertido acima, normal abaixo). CSS: `.implementacoes-faixa .lp-signals { border-bottom: 0 }` (fio de 1px da home seria terceira linha sobre navy). Eyebrow “PARCEIROS” e linha ciano da base já não existem (SIS-101). Observação: sem o `02 ·`, eyebrow e H2 ficaram idênticos.

Verificações em 1920×1080, 1366×768 e 390×844: `id="implementacoes"`; mosaico/parede ausentes; faixa `background: rgb(245,250,255)` e `border-bottom: 0px`; 15 marcas; 0 overflow; com `prefers-reduced-motion: reduce`, `animation-name: none`, viewport `overflow-x: auto` e `scrollWidth > clientWidth`. `tsc --noEmit` limpo, build compila, lint 25 warnings / 0 erros. Capturas `docs/capturas/sis108-faixa-1440.png` e `sis108-faixa-390.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/components/legacy/SignalMarquee.tsx` (uso)
- `src/components/ClientWall.tsx` (removido)
- `src/components/ImplementationsMosaic.tsx` (removido)
- `src/app/globals.css` (`.implementacoes-faixa`)

---

## SIS-107 — /eventos-inovacao: ajustar a transição da grade de eventos para a seção “Siga a Sistran no LinkedIn”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-107/eventos-inovacao-ajustar-a-transicao-da-grade-de-eventos-para-a-secao

### Pedido
A passagem da grade de eventos para `#sistran` / “Siga a Sistran no LinkedIn” tem corte abrupto, segunda emenda no degradê e vazio acima do título. Uma única transição navy→azul (chanfro/degradê), sem segunda emenda, fechar a grade de propósito, coerente com SIS-103; reduced-motion com tudo visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Causa raiz medida.** Os “dois cortes” eram dois degradês empilhados nos mesmos ~200px: (1) `.eventos-emenda-base` sem `top`/`bottom` pintava fora da seção (a 1440×900, `#eventos` terminava em y=13086 e a faixa ia de 13086 a 13266, 180px da Social); (2) a Social pintava a EMENDA 6 em todas as rotas (`linear-gradient(#d2e5ed 0, transparent 220px)` na regra base de `.social-palco`), só faz sentido na home.

**Correções.** `.eventos-emenda-base` ganhou `bottom: 0`; altura `clamp(140px, 24vh, 280px)`; degradê a partir de `#06304f`. EMENDA 6 virou `.social-emenda-de-claro`, só na home; `Social` ganhou prop `className`. `/eventos-inovacao` recebe `.social-de-cena-escura` (respiro de cima 4rem / 5.5rem ≥768px; seletor `.social-palco.social-de-cena-escura` porque `md:py-32` ganhava por ordem — medido 128px). `/trabalhe-conosco` sem nenhuma das duas.

**Degrau residual.** Radial ciano `at 20% 20%` da Social no primeiro pixel; centro descido para `45%` e máscara de entrada de 300px nas luzes e no orb. Degrau amostrado 4px acima/abaixo: 1920 pior 1/6/9; 1440 0/6/10; 1366 1/7/5; 390 0/1/2. ≤ 4% no pior ponto.

**Verificações.** `emBot === socTop` nas quatro larguras; 0 overflow; reduced-motion: eyebrow e H1 `opacity: 1`, `transform: none`, vídeo do hero pausado em `currentTime: 0`; home com EMENDA 6. `tsc --noEmit` limpo, `npm run build` passa, `npm run lint` 25 warnings / 0 erros. Captura `docs/capturas/sis107-emenda-1440.png`.

### Conferência
Não há `VEREDITO: APROVADO`. **Reavaliação após a SIS-115:** `FATIA` continua `92svh`; `.eventos-emenda-base` em `bottom: 0`. Risco novo: barra flutuante `position: fixed` com `IntersectionObserver` em `isIntersecting` cru sobre a seção inteira (quinze telas) — a pílula pode pairar sobre a emenda na saída. Deduzido do código, precisa de confirmação visual. Os oito critérios da transição em si não foram reinspecionados visualmente. Nada alterado no código nem no status.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/EventsGrid.tsx` (comentários)
- componente `Social` (prop `className`; classes `.social-emenda-de-claro`, `.social-de-cena-escura`)
- `src/app/eventos-inovacao/page.tsx`
- `src/app/trabalhe-conosco/page.tsx` (ausência da emenda de claro)

---

## SIS-106 — /eventos-inovacao: controle lateral com preview dos eventos, cantos arredondados e sombra contínua

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-106/eventos-inovacao-controle-lateral-com-preview-dos-eventos-cantos

### Pedido
Ajustes no `EventsGrid` de `/eventos-inovacao`: (1) controle na lateral com preview (miniatura, número, título), filtros com contagens; (2) `border-radius` do card na imagem (token, overflow no container); (3) sombra contínua além da imagem, sem linha de corte. Mobile: controle horizontal. Miniaturas com `sizes` próprio; teclado/`aria-current`; reduced-motion. Critérios reescritos após SIS-115: lista vertical de quinze caducou (barra anterior/próximo); arredondamento, sombra, thumbs e remoção da régua 01…15 permanecem. Aberto: anúncio de estado (`aria-current` / `aria-live`) e reverificação visual.

### O que foi feito
`src/components/EventsGrid.tsx`, `src/app/globals.css`, `src/data/events.ts`, `public/images/EVENTOS/thumb/`.

**Controle na lateral.** Painel à direita (`.evento-navegador`), `position: sticky`: filtros + lista de quinze (miniatura, número, título). Direita porque o texto vive no canto inferior esquerdo. Painel filho do `container-lp`/`z-10` da trilha, não do palco (palco interceptava clique). Régua 01…15 removida.

**Arredondamento.** `.evento-cartao` sem recorte (sombra/pluma); `.evento-moldura` `inset: 0`, `overflow: hidden`, raio e fio de 1px. Token `--radius-card` (24px), inclusive no mobile (antes `rounded-2xl` 16px).

**“Quebra na sombra”.** Não era `box-shadow` (`0 40px 120px -40px`, spread negativo). Linha vertical = degrau de luminância (foto nítida 1125px × mesma foto `brightness(0.42)`). Pluma `.evento-cartao::after` `inset: -28px`, quatro degradês laterais em 56px; sombra em duas camadas com spread positivo (`0 40px 110px -10px` + `0 0 90px 30px`). Sem `filter`/`drop-shadow`. `.evento-cartao` desconta largura do painel e goteira do `.container-lp` (`width: auto` + `max-width`). Medido 1920: descontar só o painel deixava a foto até 1346 com painel a partir de 1214.

**Miniaturas.** 15 × 240px WebP q74, 124 KB no total, campo `thumb?`. `next.config` tem `images: { unoptimized: true }` — `sizes` sozinho não encolheria; reaproveitar `image` puxaria ~2,7 MB.

**Numeração sob filtro:** preserva `ordemNoCatalogo(e) = EVENTS.indexOf(e) + 1` (Insurtech Brasil continua 05).

**Acessibilidade.** `<button type="button">` em `<ol>`; `aria-current="true"` no ativo; `:focus-visible` anel 2px; inativos `opacity: 0.62`; miniatura `aria-hidden`.

**Mobile.** `.evento-preview` `display: none` abaixo de 1024px; filtros horizontais com `flex-wrap`.

**`prefers-reduced-motion`.** `.evento-preview-item` e `.evento-preview-fio` com `transition: none`; acompanhamento `behavior: 'auto'`.

**Outros.** `scrollTop` manual no `<ol>` (não `scrollIntoView`); padding da fatia `clamp(4.5rem,9vh,7rem)`; quadro `bottom` 5.5rem; `margin-top` do painel 1.5rem (com o valor grande, bottom 1160 numa tela de 1080).

**Validação.** `tsc --noEmit` limpo; `npm run build` ok; lint 25 problemas (0 erros). Playwright 1920×1080, 1366×768, 390×844: 0 overflow; painel sticky (eventos 01, 06, 10, 15); `clientHeight` 664 / `scrollHeight` 842; 1920 foto até 1162, painel a partir de 1214; 1366: 927 / 968.

### Conferência
Não há `VEREDITO: APROVADO`. **Reavaliação após a SIS-115:** a entrega de arredondamento, sombra, thumbs e remoção da régua sobreviveu; o artefato central (lista vertical de 15) foi substituído por `.evento-navegador` `position: fixed` com anterior/próximo. `aria-current` desapareceu do componente; o contador `03 / 15` é `aria-hidden`. Recomendação: backlog com critérios reescritos, rotulada como escopo substituído pela SIS-115, não como “não entregue”. Nada alterado no código nem no status.

### Arquivos tocados
- `src/components/EventsGrid.tsx`
- `src/app/globals.css`
- `src/data/events.ts`
- `public/images/EVENTOS/thumb/`

---

## SIS-105 — /eventos-inovacao: vídeo de fundo no hero “Eventos & Inovação”, no mesmo padrão de /solucoes

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-105/eventos-inovacao-video-de-fundo-no-hero-eventos-andamp-inovacao-no

### Pedido
Colocar `public/videos/evento.mp4` (4,8 MB) como fundo do hero de `/eventos-inovacao` via `HeroVideoBackdrop`, só em volta do hero. Gerar poster `.webp`; renomear no padrão do projeto; `-an` e `faststart`; loop sem salto; texto legível; reduced-motion mostra poster; vídeo não vaza no header nem no chanfro. Desktop e mobile, atenção ao peso.

### O que foi feito
Vídeo em laço com o `HeroVideoBackdrop` existente — lógica de reduced-motion não duplicada.

**Arquivos.** `public/videos/eventos-hero-loop.mp4` — 1,2 MB (take 4,8 MB); `public/videos/eventos-hero-loop-poster.webp` — 36 KB, primeiro quadro do laço; `evento.mp4` removido.

**Loop.** SSIM último vs. primeiro = 0,46 (corte no meio 0,50). Cauda de 1,2 s dissolvida no começo: emenda 0,91 (controle 0,63). Duração 6,83 s.

**Marca d’água “Veo”.** Recorte 1824×1026 a partir do canto superior esquerdo, de volta a 1920×1080.

**Encode.** `-an`, `-movflags +faststart` (`moov` estava no fim), CRF 28, `preset slow`, `yuv420p`.

Wrapper só no hero. DOM: `.hero-backdrop--eventos .pagehero-entrada` existe; `.hero-backdrop--eventos .evento-sangria` não.

**Componente.** Prop `foco` (`object-position`): esta rota `50% 50%` (padrão 50% 62% cortaria o palco). Classe `.hero-backdrop--eventos`: meio do véu 34% → 56%, chapado 16% → 22% (telão de LED atrás do título).

**Playwright.** 1920×1080 e 390×844: `currentSrc` = `eventos-hero-loop.mp4`, poster correto, `paused: false`, `objectPosition: 50% 50%`, 0 erros, 0 overflow. Reduced-motion 1440×900: `paused: true`, `currentTime: 0`, sem `autoplay`. `#social` e `ContactCTA` no lugar. `tsc --noEmit` limpo, `npm run build` ok, lint 25 avisos / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/videos/eventos-hero-loop.mp4`
- `public/videos/eventos-hero-loop-poster.webp`
- `public/videos/evento.mp4` (removido)
- `src/components/ui/HeroVideoBackdrop.tsx`
- `src/app/eventos-inovacao/page.tsx`
- `src/app/globals.css` (`.hero-backdrop--eventos`)

---

## SIS-104 — /eventos-inovacao: substituir as imagens dos eventos pelas versões de alta qualidade

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-104/eventos-inovacao-substituir-as-imagens-dos-eventos-pelas-versoes-de

### Pedido
Atualizar imagens de `/eventos-inovacao` (`src/data/events.ts`, `EventsGrid`) da pasta `EVENTOS/` (~1,2 MB JPG) para `Eventosaltaqualidade/` (PNG ~2 MB). Web Summit AI e SPIW sem PNG novo. Converter para WebP; sem órfãs; caixa exata dos nomes; sem recorte por proporção; sem regressão de LCP. Desktop e mobile.

### O que foi feito
**13 das 15 artes** em WebP q82, 1672×941: 28 MB → 2,28 MB (111–223 KB por arte). Arquivos em `public/images/EVENTOS/`; pasta `Eventosaltaqualidade/` removida. Nomes atuais mantidos, só extensão `.jpg` → `.webp`. Validação byte-a-byte vs. `readdir`: 15/15. Proporção 1,777 vs. 1,779.

`sizes="1125px"` passou de upscale 1,25× (fontes 900px) para downscale 0,67×; comentário do `EventsGrid` corrigido. `alt=""` nas duas camadas desktop; mobile `alt={e.title}`.

**Web Summit AI e SPIW:** inconsistência aceita — seguem `.jpg`; nota no array de `events.ts` + comentários inline. LCP: `images: { unoptimized: true }`; primeiro card (priority) não mudou (JPG 77 KB); demais ~80 KB → ~180 KB fora do caminho crítico.

`npx tsc --noEmit` limpo · `npm run build` ok · `npm run lint` 25 problems (0 errors, 25 warnings).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/images/EVENTOS/` (13 `.webp` novos, 13 `.jpg` antigos removidos)
- `public/images/Eventosaltaqualidade/` (removida)
- `src/data/events.ts`
- `src/components/EventsGrid.tsx`

---

## SIS-103 — Transição “Sobre o Luminna AI” → Contato: eliminar a quebra e encadear o card do Luminna com a entrada do card de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-103/transicao-sobre-o-luminna-ai-contato-eliminar-a-quebra-e-encadear-o

### Pedido
Eliminar faixa clara vazia e linha dura entre Luminna e Contato; linha-sinal ciano ligando os cards; card do Luminna evolui no scroll (`scrub`); card de contato entra sobrepondo a saída; timeline única sem pin aninhado; formulário intacto; FPS; reduced-motion; mobile sem comprimir a timeline. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Arquivos.** `src/components/Contact.tsx`; `src/app/globals.css` (`.ct-trilha[data-modo="scroll"]::before`, contorno do painel, `.section-light.emenda-luminna`); `src/app/page.tsx` (`emenda-luminna`).

A faixa vazia era o gatilho `start: 'top top'` com painel em `opacity: 0` e 12vh abaixo. Agora `start: 'top 60%'`. Trilha 110svh; `SURGIR_FIM = 0.34` consome ~24% do curso.

Linha dura = `inset 0 1px 0 rgba(255,255,255,0.75)` de `.section-light`. `.emenda-luminna` remove o fio e traz `--cream` (`#e2effa`) dissolvido em 26svh.

Linha-sinal: pseudo da trilha, nasce 18svh acima, desce 34svh, `scaleY` em `--ct-surgir`. Sem `z-index` (pseudo atrás do painel). Anel do card de `rgba(20,200,245,0.06)` para 0.34 + halo estático.

Item 2 já atendido: `ScrollVideo` + `enquadramento` 1.04 → 1.10 e `SHRINK` 0.72–0.97. Formulário: `--ct-p` satura em `SURGIR_FIM`; `travadoRef` no `focusin`; `--ct-vida` zera em `:focus-within`. Sem pin. Reduced-motion: reset da linha em `@media` e `html[data-motion="reduce"]`. Mobile: abaixo de 1024px modo lista; linha só em `[data-modo="scroll"]`.

`tsc --noEmit` limpo, `next build` compila, lint 0 erros (25 avisos).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Contact.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-102 — Faixa de logos: adicionar ponto azul separador entre as logos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-102/faixa-de-logos-adicionar-ponto-azul-separador-entre-as-logos

### Pedido
Inserir bullet azul claro entre logos na faixa de parceiros (mesmo ponto do site), sem sobrar no início/fim, presente na emenda do loop, largura remedida, `aria-hidden`, espaçamento consistente. Desktop e mobile.

### O que foi feito
**Arquivos.** `src/components/legacy/legacy.css` (`.lp-partner::after`); `src/components/legacy/SignalMarquee.tsx` (documentação).

O separador é `::after` absoluto de cada `.lp-partner`, não um nó: não entra na largura medida da cópia (`translate3d(-50%)`); o ponto do último item cai no vão da emenda; `content: ''` não é anunciado; escondido em `:last-child` no modo reduced-motion.

`filter: grayscale(1)` saiu de `.lp-partner` para `.lp-partner img` (não dessaturar o ponto nem criar containing block). Vão `--lp-signals-vao: clamp(3rem, 5.5vw, 5.5rem)`; ponto `margin-left: calc(var(--lp-signals-vao) / 2 - 3px)`.

Cor: token `#0ed8f6` (`.solutions-eyebrow-ponto`, 6px) rende ~2:1 sobre `#f5faff`; usado `color-mix(in srgb, #0ed8f6 55%, #003f73)`. Mobile: ponto permanece. `forced-colors`: ponto escondido.

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/legacy.css`
- `src/components/legacy/SignalMarquee.tsx`

---

## SIS-101 — Faixa de logos: remover a linha azul e os cantos soltos, e integrá-la ao rodapé da seção “Escala que transforma o mercado de seguros.”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-101/faixa-de-logos-remover-a-linha-azul-e-os-cantos-soltos-e-integra-la-ao

### Pedido
Remover linha ciano sobre as logos, cantos/chanfros soltos, e mover a faixa para dentro da seção de métricas como rodapé. Contraste das logos; loop sem salto; reduced-motion alcançável; pin/altura recalculados. Desktop largo, notebook e mobile.

### O que foi feito
**Arquivos.** `SignalMarquee.tsx` (`<span className="lp-signals-base" />` removido); `legacy.css` (`.lp-signals-base` removido); `Metrics.tsx` (faixa último filho após `.impact-percurso`); `globals.css` (`min-height: 340vh` saiu da seção para `.impact-percurso`); `page.tsx` (consumo da faixa e `NotchDivider` saíram).

Linha ciano = `lp-signals-base` (2px, `top: -1px`). Cantos = `NotchDivider` (sem dois blocos). Caixa `.impact-percurso` dona dos 340vh, faixa depois; palco solta nos últimos ~130px onde `ATERRAR_INICIO = 0.94`. ScrollTrigger inalterado (`start: 'top top'` / `end: 'bottom bottom'`). Faixa mantém `#f5faff` próprio. Reduced-motion: viewport vira lista rolável. Faixa some do inventário da home (SIS-100).

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/SignalMarquee.tsx`
- `src/components/legacy/legacy.css`
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-100 — Navegador lateral de seções (ScrollSpy) em todas as páginas — mapa de seções por tela

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-100/navegador-lateral-de-secoes-scrollspy-em-todas-as-paginas-mapa-de

### Pedido
Estender o ScrollSpy (`src/components/ui/ScrollSpy.tsx`) para todas as páginas, configurável (`id` + rótulo), mapa centralizado, ids no DOM, detecção claro/escuro, breakpoint ~1280px. Decidir `ProgressoLateral` em `/quem-somos` e nav “NESTA PÁGINA” em `/solucoes`. Acessibilidade, Lenis, reduced-motion instantâneo. Verificado em 1920px, 1440px, 1280px e mobile.

### O que foi feito
`src/data/pageSections.ts`: `PAGE_SECTIONS` e `sectionsForPath(pathname)`. Dez rotas, 44 itens: `/` 5 · `/quem-somos` 8 · `/solucoes` 5 · `/parceiros-e-implementacoes` 4 · `/latam` 8 (espanhol) · `/contato` 4 · `/esg` 4 · `/sistran-labs` 3 · `/eventos-inovacao` 3 · `/trabalhe-conosco` 3. Fora (<3): `/transformacao-legado`, `/blog`, `/sistran-university`, páginas legais e dinâmicas. `ContactCTA` nunca entra.

Ids existentes no `<h2>` não foram movidos; o componente sobe para `el.closest('section')`. Criados: `PageHero` → `id="topo"`; `/trabalhe-conosco` → `id="curriculo"`. 44/44 no DOM.

Observer: conjunto de quem cruza + ordem de documento (não “último `entry`”). Breakpoint 1280px.

`ProgressoLateral`: consumo removido. Nav “NESTA PÁGINA” e lista de `/latam`: `xl:hidden`. `aria-label` da barra de `/solucoes` → “Nesta página”.

`<nav aria-label="Seções desta página">`, `aria-current="true"`, alvo 44px, clique via `window.__lenis.scrollTo` descontando `--header-h + 24px`, reduced-motion `duration: 0`, foco na seção com `preventScroll`.

**Verificações.** Visível 1920 / 1440 / 1280; oculto 1279 / 1024 / 390. Contraste claro `#0079CB`, escuro `#0ed8f6`. Clique: topo a 104px (header 88 + 24). Reduced-motion: scrollY 0 → 2415 em 120ms. `tsc --noEmit` limpo, `next build` ok, lint 19 avisos / 0 erros (eram 25). Capturas `docs/capturas/sis100-scrollspy-1440.png` e `sis100-scrollspy-1280.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`
- `src/components/PageHero.tsx`
- consumo de `ProgressoLateral` em `/quem-somos`
- nav “NESTA PÁGINA” em `/solucoes` e lista equivalente em `/latam`

---

## SIS-99 — “Desafios no desenvolvimento de software”: remover as três etapas e manter só o bloco sobre o Luminna AI

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-99/desafios-no-desenvolvimento-de-software-remover-as-tres-etapas-e

### Pedido
Remover as etapas Compreender, Transformar e Validar e evoluir (dados, indicadores, pin, animações, ícones). Manter o título da seção e o bloco “Sobre o Luminna AI”. Recalcular pin/altura; sem órfãos; hierarquia de títulos. Desktop e mobile.

### O que foi feito
**Arquivos.** `src/data/legacy.ts` (`chapters` removido de `impactSequence`); `ImpactSequence.tsx` (`SequenceChapter`, `CAP_PASSO`/`CAP_BORDA`, `clipPath`, portão de opacidade, `.sequence-chapters`); `legacy.css` (dez blocos `.sequence-chapter*`; altura reajustada).

Altura 216svh → 200svh (piso do seek do vídeo da montagem, não respiro). `data-dirigindo` permanece (portão da escala do título). Enquadramento: aproximação 1.04 → 1.10, sem `quadroX` de 3%. Removido, não comentado. Sem salto h2→h4 (capítulos eram os únicos h3). Sem assets órfãos. SIS-92 fica obsoleta (sobreposição na troca de capítulos).

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`
- `src/components/legacy/ImpactSequence.tsx`
- `src/components/legacy/legacy.css`

---

## SIS-97 — “Escritórios BRASIL”: unificar o fundo do mapa com o fundo claro do título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-97/escritorios-brasil-unificar-o-fundo-do-mapa-com-o-fundo-claro-do

### Pedido
Estender o fundo claro da faixa do título por toda a seção do mapa, sem emenda. Reajustar contorno, preenchimento, chips, pins e legenda para contraste AA sobre claro. Token compartilhado. Desktop largo, notebook e mobile.

### O que foi feito
Três camadas extraídas para `--fundo-claro-secao` no `:root` (`--claro-brilho-a/b`, `--claro-base`); `.section-light` e `.os-palco[data-modo="scroll"]` consomem o token.

Arte invertida (entre outros): `.bm-pais` `rgba(2,29,67,.85)`; `.bm-pais-contorno` `rgba(2,29,67,.88)`; `.bm-pais-cabeca` `#0079cb`; América do Sul navy `.10`/`.24`/`.22`; `.bm-pais-brilho` `rgba(3,45,103,.22)`; linhas `rgba(0,121,203,.6)`; rótulos `#032d67` (~13:1); coordenadas `#3d6285` (~6:1). Preenchimento `#0a4489/#135fae/#073a76` já calibrado na SIS-78.

Chips invertidos: `rgba(255,255,255,.82)`, borda `rgba(0,121,203,.32)`, texto `#0b3f75` (~11:1); ativo azul chapado (~4.7:1). Painéis de cidade seguem vidro escuro.

Bug: chips atrás do header a 1440×900. `top: calc(var(--header-h) + clamp(.75rem, 2vh, 1.5rem))`. Medido: chips 196.5px, header 104px.

Playwright 1440 / 1366 / 390, `mouse.wheel`. Reduced-motion: modo `lista`; `stroke-dashoffset: 0`; `.bm-halo` / `.bm-rota-pulso` `animation-name: none`. `tsc --noEmit` limpo · `npm run build` ok · `npm run lint` 25 warnings / 0 errors.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- mapa / cena de escritórios (classes `.bm-*`, `.os-palco`; chips)

---

## SIS-96 — Seção “Escritórios BRASIL”: revelar o mapa progressivamente com efeitos das skills de scroll motion

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-96/secao-escritorios-brasil-revelar-o-mapa-progressivamente-com-efeitos

### Pedido
Revelar o mapa com o scroll: contorno (`stroke-dashoffset`) → preenchimento → divisas em stagger → pins → legenda tipo SplitText; emenda com a faixa do título; título sem passar sob o header; 60fps; reduced-motion com mapa completo; estratégia mobile. Skills titan-editorial e sistran-cinematic.

### O que foi feito
Boa parte da revelação já existia. Lacunas:

1. Preenchimento depois do contorno (`OfficesScene.tsx`): `PREENCHE_INICIO = ENTRADA_FIM` (0.20), `PREENCHE_FIM = 0.34`. Em 0.2 o contorno vale 1 e o preenchimento ainda 0.34.
2. Divisas: um único `path` quebrado nos `M` (`DIVISAS`, 19 peças), `--os-divisas` 0.30 → 0.52.
3. Legenda: `clip-path: inset`, nome 0.42s, coordenada 0.62s; ordem pin → linha → nome → coordenada. Não por caractere (leitor de tela / `text-anchor: end`).
4. Título sob o header: palco `top: calc(var(--header-h) + 1rem)`; `innerTop = headerBottom = 104`. Chips perderam a soma extra da SIS-97.

Defeitos expostos: chamada de Pato Branco (`L152 162`, rótulo y=156/179); SP recuada para x=596. Reduced-motion a 1440: `scrollWidth` 1483; reset de `left`/`right` nas regras `[data-cidade="pr"]`; depois `scrollWidth = 1440`.

Verificação: partitura a 1440×900; mobile 390 modo lista; 60fps **não medido** (rAF headless p95 ≈100ms). Propriedades: `transform`, `opacity`, `stroke-dashoffset`, `clip-path`. `tsc --noEmit` limpo · build ok · lint 25 avisos / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/OfficesScene.tsx` (ou equivalente da cena; relatório cita `OfficesScene.tsx`)
- CSS das classes `--os-*` / `.bm-*` / palco sticky

---

## SIS-95 — Diagrama “Onde seguros, negócio e tecnologia convergem”: núcleo mais 3D, logo maior e fios dinâmicos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-95/diagrama-onde-seguros-negocio-e-tecnologia-convergem-nucleo-mais-3d

### Pedido
Núcleo “Falamos segurês!” com volume 3D (luz, inset, sombra, anéis); logo maior; fios com pulso (`stroke-dashoffset`), nós que acendem, hover destacando o ramo; 60fps; reduced-motion com fios completos; legível em desktop, notebook e mobile. Verificar recorte “CON…” à direita.

### O que foi feito
`src/components/PositioningEcosystem.tsx` e `src/components/positioning-ecosystem.css`.

Núcleo: luz em `34% 24%`; terceiro anel; órbitas `rotateX`/`rotateZ` 26s e 38s; `perspective: 760px`; tilt 5°/4° em `.eco-nucleo-tilt` (não no `.eco-nucleo`, colisão SIS-42 / `key={pulso}`).

Logo: `.eco-simbolo` era 42%/42% → caixa 84×36 (~35px num disco de 199px). Agora largura 40% + `aspect-ratio`. Medido: 1440 núcleo 263×263, símbolo 80×82 (antes 84×36); 1366 79×81; 390 54×56.

Fios: dash 14+620 no trilho, 12+128 nos ramos; atrasos 0 / 0,9 / 1,8s e 0,45 / 1,35s; sentido sempre ao núcleo. Hover `:has()`: fio ativo `opacity: 1` `rgb(32,215,242)`, outros 0.26, ramo esmaecido ainda desenhado.

Reduced-motion (`@media` e `html[data-motion="reduce"]`): fluxos `animation: none` e `opacity: 0`; base `stroke-dashoffset: 0`; nós `opacity: 1`. “CON…”: `estouraDireita: false`, `scrollWidth ===` janela. 60fps não medido de forma confiável. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; `npm run build` ok. Mobile ≤767px: SVGs do trilho ocultos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/PositioningEcosystem.tsx`
- `src/components/positioning-ecosystem.css`

---

## SIS-86 — Preloader: fundo da tela de entrada deve ser azul (logo branca desaparece no fundo branco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-86/preloader-fundo-da-tela-de-entrada-deve-ser-azul-logo-branca

### Pedido
Trocar o fundo do preloader para o azul da marca (logo branca), desde o primeiro frame (html/body/`theme-color`), sem flash branco nem branco na saída para o hero. Desktop e mobile, throttling de rede.

### O que foi feito
Diagnóstico: o `body` já era `#1273bc` e `.mmi-painel::before` já era `var(--palco-marca)` `#032d67`. O branco estava só em `.mmi-cartao` (`#f4f8fc`) com `sistran-corp-logo.png` branco. Decisão: fundo azul + logo branca (não há PNG azul da marca).

`.mmi-cartao`: `linear-gradient(158deg, #1273bc, #0e5893 58%, #073f6e)` + `inset 0 0 0 1px rgba(255,255,255,.16)`. `.mmi-leitura`: `rgba(255,255,255,.86)`. `.mmi-peca`: `rgba(255,255,255,.2)`. Morfagem já zerava `background` e `box-shadow`.

Verificação (produção, sessão limpa): 1440×900, 390×844, reduced-motion; rede 1,5 Mbps / 150ms, quadros 100ms a 6s: nenhum quadro branco; `theme-color` já `#004D8A`. Saída: cartão dissolve sobre cena azul. 0 erros de console; `tsc --noEmit` limpo; build ok; lint 26 advertências pré-existentes / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-85 — Métricas: corrigir alinhamento e transição entre os números (deslocados à direita)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-85/metricas-corrigir-alinhamento-e-transicao-entre-os-numeros-deslocados

### Pedido
Na seção “Escala que transforma o mercado de seguros.”, recentrar o número em foco nos 7 estados, alinhar número/rótulo/descrição, métrica que sai sem corte seco, transições mais ágeis, reduced-motion. Desktop largo, notebook e mobile.

### O que foi feito
Três defeitos independentes (produção): (1) `justify-content: center` em `.impact-valor` — a 1440, rótulo x=110 e glifo x=220; passou a `flex-start`. (2) Reserva em `ch` com `text-align: right` (~45px): `ch` ~145px vs. dígito ~87px; gabarito `visibility: hidden` + `aria-hidden` na mesma célula, `justify-self: start`. (3) `opacity: 0.52` chapada nos vizinhos anulava `data-dist` (0.14 / 0.1); item ativo saltava de ~0 para 0.52 e era decepado pelo `overflow: clip`. Regra removida.

`translateX` de 20% para ±10%. `mask-image` em `.impact-cena`, largura `(100% - --impact-lente) * 0.4`.

Verificação produção: 1440 estados 0, ~4.24 e 6 — `indice.left == rotulo.left == caption.left == glifo.left` (130 em repouso, 128 em transição); 1920 estado 6 os quatro em x=296. Reduced-motion e mobile 390: modo lista, `numLeft == rotLeft`. Eixo: rótulo 110 → 130, número 220 → 130. `tsc --noEmit` limpo, build ok, lint 26 advertências / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`

---

## SIS-84 — /contato: seção “Onde Estamos” com mapa dinâmico das unidades

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-84/contato-secao-onde-estamos-com-mapa-dinamico-das-unidades

### Pedido
Reformular “Onde Estamos” em `/contato` com mapa dinâmico das três unidades (SP com endereço e telefone; PR e RJ não divulgados). Seleção recentra o mapa sem recarregar iframe; `tel:` e rota; tema escuro; lazy load; reduced-motion. Corrigir no site antigo: erro de carregamento, mapa estourando, ícone Waze.

### O que foi feito
Duas entregas no Linear.

**Primeira (mosaico OSM).** A LP não tinha mapa (só três cartões); os bugs do site antigo não existiam neste código. `src/components/UnitsMap.tsx`: tiles raster Web Mercator 6×4, sem biblioteca. CARTO `dark_all` devolvia “API KEY REQUIRED”; ficou OSM + filtro `invert` + `hue-rotate(180deg)`. Env `NEXT_PUBLIC_MAP_TILES` / `NEXT_PUBLIC_MAP_TILES_DARK`. Coordenadas em `src/data/contact.ts` (Nominatim): SP `-23.6013, -46.6934` zoom 16 (nº 240 não mapeado no OSM); Pato Branco `-26.2296, -52.6712` zoom 12; Rio `-22.9110, -43.2094` zoom 11. Seleção só clique/teclado (`aria-pressed`). Lazy: IntersectionObserver 200px; `loading="lazy"` nos tiles saiu (bordas em branco). Playwright 1440 e 390: 24/24 tiles; reduced-motion troca seca. `tsc --noEmit` limpo; lint 26 warnings / 0 erros; `○ /contato` estático.

**Segunda (substitui a anterior): Maps JavaScript API.** Script único (`v=weekly`, `loading=async`, `language=pt-BR`, `region=BR`). Uma instância; `panTo` + `setZoom`. Tema escuro: 13 regras em `styles` (não `mapId`). `google.maps.Marker` clássico, pino ciano. `gestureHandling: 'cooperative'`. Reduced-motion: `setCenter`. Observer mantido. Tipagem manual (5 membros). Sem `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (ou falha do script): fallback no mosaico OSM. **Bloqueio go-live:** faturamento Google Cloud, chave restrita ao domínio, variável no Vercel/`.env.local`. Verificação com dublê da API: Map 1× após trocar unidade; 3 marcadores; `panTo` Pato Branco e zoom 16→12; reduced-motion só `setCenter`; script abortado → 24 tiles OSM. `tsc --noEmit` limpo, build ok, lint 26 warnings / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/UnitsMap.tsx`
- `src/data/contact.ts`
