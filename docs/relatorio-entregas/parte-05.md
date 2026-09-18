## SIS-213 — Home · Números: retirar a sombra/faixa branca do fundo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-213/home-numeros-retirar-a-sombrafaixa-branca-do-fundo

### Pedido
Na home, na seção Números (`Metrics` / `#resultados` / rótulo ScrollSpy «NÚMEROS»), retirar a faixa/sombra branca forte no meio do fundo (halo horizontal claro sobre o navy + malha) — não só atenuar. Identificar a camada (imagem `atrasnumeros.webp` vs CSS `.impact-*`) e eliminar o flare; manter legibilidade do sobretítulo/números e da malha; se a causa for o asset, ajustar overlay sem inventar arte nova. Fora de escopo: hover/bolinhas da SIS-203, salvo overlap documentado. Aceite: faixa ausente ou residual imperceptível; números e chrome legíveis; capturas 1440 antes/depois + portões OK.

### O que foi feito
A faixa **não** é a arte `atrasnumeros.webp` nem a névoa das células (SIS-203). São dois véus brancos somados na fronteira Números → montagem, herdados de vizinhança que já não existe:

- `.impact-saida` (`globals.css`, SIS-176) — 96px a 1440, `transparent → var(--paper)`, dentro da seção;
- `.sequence::after` (`legacy.css`) — 120px, `var(--paper) → transparent`, no topo da `ImpactSequence`.

Juntos: ~216px de quase branco full-bleed entre o navy dos números e o quadro escuro do vídeo. Isolamento por eliminação (`scripts/isolar-camadas-numeros-sis213.mjs`), perfil de luminância média por linha, 1440:

- trecho 0 %: completo 0,907; sem `::before` 0,907; sem `.impact-saida` 0,037; sem arte 0,907
- 5 %: completo 0,111; sem `::before` **0,038**; sem `.impact-saida` 0,035; sem arte 0,071
- 95 %: ~0,050 em todas as colunas

Emenda medida (`scripts/medir-emenda-numeros-sequencia-sis213.mjs`, coluna central, 1440): a −6px o antes era **rgb(240 243 245)** e o depois **rgb(1 43 92)**; a +6px o antes era **rgb(244 245 246)** e o depois **rgb(7 30 62)**.

**Correção:** `.impact-saida` perde a tinta (continua ocupando 96px e mostra `.impact-fundo` sobre `#041b3d`); `.sequence::after` fica e troca de tinta para `#041b3d → transparent`; em `forced-colors`, `.impact-saida { background: Canvas }` foi comentado. A arte não foi tocada. Sem overlap com SIS-203 (camadas `.impact-track` / névoa das células).

Segundo consumidor: `/quem-somos` também monta `<Metrics />`. Lá o `--paper` era pior (rgb(240 243 245) direto no navy do Teatro, rgb(1 32 75)). Com a correção: rgb(1 43 90) → rgb(1 32 75).

**Critérios:** perfil final no trecho caiu de 0,313 / 0,487 / 0,703 / 0,944 para 0,020 / 0,025 / 0,022 / 0,017; máximos de 0,43 restantes são curvas cianas da arte. Capturas: `docs/capturas/sis213-{antes,depois}-1440.png`, `sis213-{antes,depois}-emenda-base-1440.png`, `sis213-quemsomos-{antes,depois}-1440.png` e série `sis213-camadas/`. Portões: `tsc --noEmit` limpo; `npm run lint` 22 problemas / 0 erros; `npm run test:copy` OK (1178 textos); `npm run test:extrator` OK (41 casos). A emenda de cima (`.impact-scroll::before`, 150px, `--fundo-claro-secao`) **não** foi tocada: a vizinha de cima é Soluções, clara de fato.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`.impact-saida`)
- `src/components/legacy/legacy.css` (`.sequence::after`)
- `scripts/isolar-camadas-numeros-sis213.mjs`
- `scripts/medir-emenda-numeros-sequencia-sis213.mjs`
- `scripts/medir-emenda-numeros-quemsomos-sis213.mjs`

---

## SIS-212 — /contato — negrito em «Preencha o formulário e fale com a gente!»

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-212/contato-negrito-em-preencha-o-formulario-e-fale-com-a-gente

### Pedido
Na abertura de `/contato`, a frase «Preencha o formulário e fale com a gente!» deve aparecer em negrito (peso forte em toda a manchete — título + highlight). Escopo só `/contato` (`.hero-backdrop--contato` ou classe no `PageHero` desta rota); não engrossar as outras 13 rotas. Aceite: frase inteira em negrito (incluindo «fale com a gente!»); copy intacta; outras rotas `PageHero` sem mudança de peso; captura 1440 + portões OK.

### O que foi feito
Uma regra escopada na rota, em `src/app/globals.css`, no bloco já existente desta abertura:

```css
.hero-backdrop--contato .pagehero-entrada h1 {
  font-size: clamp(2.6rem, 5.9vw, 5rem);
  font-weight: 700;
}
```

`PageHero.tsx` e `contato/page.tsx` ficaram com zero diff. Peso **700** (não 600): `layout.tsx` carrega Geist com `weight: ['400','500','600','700']`; a 80px, 600 lê como 400 mais escuro. O `span` do highlight herda o peso (`text-[#A5F0FF]` sem peso próprio). Desvio declarado da SIS-155 (tipo de exibição em 400).

Peso computado do `h1` a 1440: `700`. `node scripts/copy-lock.mjs` → **1631 textos travados**, trava não regerada. Peso nas quatorze rotas com `PageHero`: só `/contato` em **700**; as outras treze em 400 (`/certificacoes` não usa `PageHero`).

Portões: `npx tsc --noEmit` → 0 erros; `npm run lint` → 23 problemas, 0 erros (avisos `react-hooks/static-components` pré-existentes); `npm run build` → sucesso, 14 rotas estáticas + 7 de `/solucoes/[slug]`.

Medição extra (`scripts/medir-negrito-contato-sis212.mjs`): a 1024 a quebra passou de 3 → 4 linhas (`h1` 185px → 247px); 390, 1280, 1440 e 1920 mantêm o número de linhas. `scrollWidth` igual à janela nas cinco larguras. Contraste remedido (`scripts/medir-contraste-negrito-contato-sis212.mjs`, método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`): 390 6,31:1 / 8,70:1; 1024 8,44:1 / 7,21:1; 1280 7,64:1 / 6,97:1; 1440 7,33:1 / 7,18:1; 1920 7,39:1 / 8,20:1 — todas ≥ 4,5:1.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-negrito-contato-sis212.mjs`
- `scripts/medir-contraste-negrito-contato-sis212.mjs`

---

## SIS-211 — /contato — números: fundo azul claro, cards tipo Implementações, seção mais baixa

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-211/contato-numeros-fundo-azul-claro-cards-tipo-implementacoes-secao-mais

### Pedido
Na faixa de números de `/contato` (`MetricsBand` — 850+ Membros, 23+ Prêmios, 130+ Clientes, 650+ Mil horas, 230+ ERPs e demais de `METRICS`): (1) fundo azul bem clarinho (`--fundo-claro-secao` / `section-light-blue` / `#f2f9fe`→`#cfe7f7`, não o navy `#0f2b4a`→`#071d36`); (2) layout dinâmico dos cards no espírito de Implementações (`RoadmapTrail`: etapa/trilha — referência visual, não copy); números e rótulos 100% de `src/data/metrics.ts`; (3) diminuir altura/scroll do percurso sticky (SIS-144 / `PercursoIndicadores` + `metrics-band-track.css`). Tipografia navy/`text-ink` no claro; sticky OK, sem `pin: true`; reduce = sete indicadores alcançáveis; home `Metrics` intocada. Aceite: fundo clarinho com contraste AA; cards tipo etapa/trilha; altura/scroll menor (número no relatório); emenda com hero e parceiros sem listra; reduce/JS off; capturas + portões OK.

### O que foi feito
Medido no Playwright (`next dev` :3999, `deviceScaleFactor: 1`). Sondas: `scripts/medir-banda-indicadores-sis211.mjs`, `scripts/medir-contraste-indicadores-sis211.mjs`, `scripts/medir-estados-indicadores-sis211.mjs`.

**Fundo:** `MetricsBand` passou a `section-light section-light-blue`. Navy `#0f2b4a → #071d36` comentado em `metrics-band-track.css` e `globals.css`. Cartão: superfície branca, número `#0a1f44`, `+` `#024e86`, rótulo navy a 88%.

**Leitura de etapa (sem montar `RoadmapTrail`):** cada cartão ganhou `NN / 07` com nó e fio; acendimento em CSS sobre `--mb-t`: `alc = clamp(0, t × (N−1) − i + 1, 1)`. Sem `useState` por cartão; `MetricsBand` continua Server Component. Copy só de `METRICS`; a palavra «Etapa» ficou de fora.

**Altura:** `PASSO_SVH` em `PercursoIndicadores.tsx` de **30 → 18**. A 1440×900: seção 2520px (2,80×) → **1872px (2,08×)**; espaçador 1620px → **972px**; palco 900px; rolagem presa 1600px → **960px**; documento 6530px → **5882px (−648px)**. Fim do percurso: y=1652, `--mb-t` **1,0000**, `--mb-alc` do 7º **1,0000**, trilha **−1214,4px de 1214,4px**. Sem `pin: true` / sem ScrollTrigger.

**Contraste (máscara de miolo):** número **15,38:1** (tinta rgb(14,35,71)), franja 8,17:1; sufixo `+` 8,23 / 7,46 / 7,78:1; rótulo 10,32–10,41:1; contador aceso 7,75–7,92:1 (franja 4,85:1); não alcançado **8,84–9,17:1** (piso de alfa 55% → 82%). Correção: `.section-light span:not(…)×4` pintava o `CountUp` de `#024e86`. Emenda faixa→logos: 16,16:1 → **1,19–1,20:1**; abertura→faixa **5,25 / 5,80 / 5,26:1**. Reduce/JS-off: espaçador 0px, seção 564px, **7/7** cartões inteiros; sem JS os números saem do servidor `850+ | 23+ | 130+ | 650+ | 230+ | 35+ | 25+`.

Portões: lint 23/0; `test:copy` OK (1177 textos); `tsc --noEmit` limpo.

**Ajuste posterior (menos espaço em cima/embaixo):** palco de `100svh` → `PALCO_SVH = 40` em `PercursoIndicadores.tsx` (`--mb-palco`). A 1024/1440/1920 × 900: palco 900px → **360px**; seção 1872px → **1332px (1,48×)**; documento a 1440 5882px → **5342px (−540px)**. `ESCALA` 1,5556 → 1,9259 → **1,3704**. Cartões ~145px da emenda (antes ~420px) e ~140px das logos (antes ~350px). Emendas reconferidas 5,24 / 5,75 / 5,22:1 e faixa→logos **1,19:1**. Follow-up da usuária (tirar «01 / 07» e estreitar cards) aberto em **SIS-256**, não reabre o fundo claro.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/components/PercursoIndicadores.tsx`
- `src/components/metrics-band-track.css`
- `src/app/globals.css`
- `scripts/medir-banda-indicadores-sis211.mjs`
- `scripts/medir-contraste-indicadores-sis211.mjs`
- `scripts/medir-estados-indicadores-sis211.mjs`

---

## SIS-210 — /esg — GOVERNANCE: cards iguais à captura ENVIRONMENT (sombra + flutuação)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-210/esg-governance-cards-iguais-a-captura-environment-sombra-flutuacao

### Pedido
A seção GOVERNANCE: Ética e Transparência (lead + seis itens) deve usar o mesmo desenho de cards da captura ENVIRONMENT: vidro arredondado, imagem circular + termo/detalhe (copy atual), sombra atrás, flutuação leve cima/baixo defasada entre os seis. Mesma família visual que ENVIRONMENT após SIS-208 (classe compartilhada). Manter `<dl>`/`<dt>`/`<dd>`; reduce parado; TODO do Canal de Denúncia permanece. Aceite: seis cards no vocabulário ENVIRONMENT; sombra + flutuação; copy e `<dl>` intactos; capturas 1440 + portões OK.

### O que foi feito
Entrega implementada sem conferência e sem verificação visual, conforme pedido.

- GOVERNANCE reutiliza o padrão da SIS-208: faixa azul com grade, vidro, retrato circular, pluma e flutuação defasada.
- Nenhuma nova declaração CSS visual foi duplicada.
- Os seis termos, detalhes, imagens e o TODO do Canal de Denúncia foram preservados.
- Para HTML válido com wrapper de dois níveis, cada cartão usa sua própria `<dl>` com um par `<dt>`/`<dd>`, dentro da lista dos seis.
- Reduced motion herdado dos dois canais da SIS-208.
- ESLint direcionado e TypeScript passaram.

Não foram rodados screenshots, Playwright, servidor dev, build ou copy-lock. A issue segue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-209 — /esg — SOCIAL: Huerta Niño e Aguas do mesmo tamanho + flutuação leve

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-209/esg-social-huerta-nino-e-aguas-do-mesmo-tamanho-flutuacao-leve

### Pedido
Nos dois cards da SOCIAL (Fundación Huerta Niño e Fundación Aguas): mesmo tamanho (altura e largura na grade de duas colunas) e movimento leve cima/baixo contínuo. Desktop ≥768: foto com altura fixa/`aspect-ratio` + `items-stretch` / `h-full`. Flutuação em `translateY` (±4–8px sugeridos), ciclo lento, defasada (`--esg-fase`); só `transform`/`opacity`. Hover da SIS-140 não pode brigar com a flutuação. Reduce parado; sem scroll-x (SIS-184). Aceite: mesma caixa em 768+; flutuação defasada; captura 1440 lado a lado + portões OK.

### O que foi feito
Despacho e entrega **sem conferência**. Auditoria: a foto já era igual (`h-52`, 208px); a desigualdade vinha do corpo de texto sem `h-full`. Flutuação no wrapper (não no `<article>`), senão o `scale(1.03)` da SIS-140 seria silenciado. Classe própria só nos dois wrappers de SOCIAL (`.esg-apoio` também embala selo e turmas).

**Mesmo tamanho:** os dois cartões medem **512 × 546px**, delta **0px**, em 1366 e 1440. Grade com `items-stretch`; wrapper e `<article>` com `h-full` (card `flex flex-col`); foto `shrink-0`; texto `flex-1`. Mobile empilhado.

**Flutuação inicial:** classe `esg-social-flutua`, `translateY` ±6px, ciclo 7s `alternate` (ida e volta 14s), fase via `--esg-fase` (segundo cartão 3,5s adiante). Hover: flutuação no wrapper, escala no filho; `animation-play-state: paused` no hover. Reduce (sistema e `html[data-motion='reduce']`): `transform: none`, `animation-name: none`; pluma em opacidade **1**. Sem rolagem lateral: `scrollWidth` 390/390 e 768/768. Evidências em `docs/medidas/sis209/` (`auditar.mjs`, `resultado.json`, `social-1440x900.png`). Portões: lint 0 erros / 23 avisos; `tsc --noEmit` OK; `build` OK; `test:copy` não rodado (copy intacta).

**Ajuste posterior (amplitude aumentada a pedido):** `translateY(±6px)` → `translateY(±12px)`; ciclo 7s → 5s `alternate` (ida e volta 10s); velocidade média ~0,9px/s → ~2,4px/s. **Sai da faixa sugerida na issue (±4–8px).** Teto: `.esg-apoio::before` tem `inset: -24px`. Defasagem `--esg-fase-onda` (`-2.5s`); `--esg-fase` permanece `-3.5s` (pluma 7s / turmas 11s). Remediado: tamanhos 512×546 intactos; em 1440 um cartão +10,82px → +5,38px enquanto o outro −5,27px → −10,77px.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `docs/medidas/sis209/auditar.mjs`
- `docs/medidas/sis209/resultado.json`
- `docs/medidas/sis209/social-1440x900.png`

---

## SIS-208 — /esg — ENVIRONMENT: cards da captura (círculo, sombra, flutuação) + superfície

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-208/esg-environment-cards-da-captura-circulo-sombra-flutuacao-superficie

### Pedido
O bloco ENVIRONMENT: Sustentabilidade Ambiental deve ter a linguagem visual da captura (10/09): fundo azul médio + grade leve, lead branco, cards vidro com imagem circular e legenda branca, grade 3 colunas desktop, sombra atrás, flutuação do card inteiro. Copy em `page.tsx` não muda. Padrão compartilhado pensado para SIS-210 (GOVERNANCE). Foguete não é obrigatório. Aceite: superfície + lead batem com a captura; seis cards vidro/círculo/sombra/flutuação, reduce parado; copy intacta; capturas 1440 + portões OK.

### O que foi feito
Entrega implementada sem conferência e sem verificação visual, conforme pedido.

- ENVIRONMENT ganhou faixa azul média com a grade técnica já existente.
- Os seis cards usam vidro, retrato circular, legenda branca, pluma estática e flutuação defasada do card inteiro.
- Padrão extraído em classes compartilháveis para GOVERNANCE: `esg-faixa-azul`, `esg-cartao-pluma`, `esg-cartao-flutua` e `esg-cartao-retrato`.
- Copy e grade de três colunas preservadas.
- Reduced motion coberto por `prefers-reduced-motion` e `html[data-motion='reduce']`.
- ESLint direcionado, TypeScript e parse do CSS passaram.

Não foram rodados screenshots, Playwright, servidor dev, build ou copy-lock. A issue segue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-207 — /esg — SOCIAL: foguete silhueta branca e trajeto em toda a seção

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-207/esg-social-foguete-silhueta-branca-e-trajeto-em-toda-a-secao

### Pedido
Na SOCIAL, a silhueta de scroll deve ser branca translúcida discreta (não o foguete colorido do selo Gerando Talentos) e seguir a rolagem por toda a seção (Gerando Talentos → turmas → Huerta Niño / Aguas). Recalibrar `offset`/`y`; `aria-hidden`, `pointer-events: none`; progresso sem `setState` por quadro (MotionValue); reduce parado e visível no meio do caminho. Aceite: silhueta visível; acompanha topo→fim; contraste do lead ≥ piso AA no pior ponto; reduce visível; capturas 1440 início/meio/fim + portões OK.

### O que foi feito
Arquivos: `src/components/ui/FogueteScroll.tsx` e `scripts/medir-foguete-social-sis207.mjs`. A sonda varre `offset: ['start end','end start']` em 1440×900, 1366×768, 390×844 e 1440 reduce; mede presença, visibilidade real (diff raster com `display:none` em `[data-foguete]`), confinamento e transforms distintos.

| Medida | antes | depois |
|---|---|---|
| 1440 — passos sem caixa em quadro | 5 / 11 | **0 / 11** |
| 1440 — silhueta invisível (<200px alterados) | 5 | **0** |
| 1366 — sem caixa / invisível | 6 / 6 de 12 | **0 / 0** |
| 390 — sem caixa / invisível | 11 / 12 de 17 | **0 / 0** |
| 1440 reduce — sem caixa / invisível | 4 / 4 de 11 | **0 / 0** |
| pixels fora da seção | 0 | **0** |
| transforms distintos (1440/1366/390) | 12 / 13 / 18 | 12 / 13 / 18 |
| transforms (`reduce`) | 1 | **1** |

Estilo: `fill=rgb(255, 255, 255)`, `fill-opacity=0.78`, rastro `0.46`. Conserto geométrico: `sticky top-0` (âncora altura zero); `overflow-hidden` saiu; `overflow-clip` nos dois eixos (com só `overflow-x-clip` a silhueta pintava acima da seção em 6/11 passos, 178px no ENVIRONMENT). Contraste (`docs/medidas/COMO-MEDIR-CONTRASTE.md`): lead `text-ink-muted` (#3d5a80) **5,45:1 / 5,48:1 / 5,49:1** (1440/1366/390); `h3` `text-ink` (#0a1f44) **12,84:1** a 1440. Reduce: constantes `y=12svh`, `x=0%`, `rotate=8`. Sem `setState` por quadro. Capturas anexas `sis207-depois-{inicio,meio,fim,reduce}-1440.png` e `sis207-antes-meio-1440.png`.

Portões: `tsc --noEmit` OK; lint 23/0 (nenhum aviso em `FogueteScroll.tsx`); `npx next build` compiled successfully in 5.4s.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `scripts/medir-foguete-social-sis207.mjs`

---

## SIS-206 — /esg — reparo: título da abertura quebrado (frase ESG)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-206/esg-reparo-titulo-da-abertura-quebrado-frase-esg

### Pedido
A abertura de `/esg` com «A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis em suas operações e cultura corporativa» está quebrada de novo. Não reabrir o escopo da SIS-138 (duas colunas). Olhar `esg/page.tsx` (`PageHero` + `hero-backdrop--esg`) e `globals.css` (~L17600–17780). Copy travada em `.claude/conteudo-site/07-esg.md`. Aceite: frase legível 390→1440; duas colunas ≥1280; um `h1`; contraste ≥ 4,5:1; outras rotas `PageHero` intactas; capturas + lint/tsc/build OK.

### O que foi feito
Só CSS em `.hero-backdrop--esg` (`src/app/globals.css`). `scrollWidth == innerWidth` a 1280–1920: nada cortado; o defeito era ordem de leitura. A grade da SIS-138 dava esquerda `minmax(0, 52vw)` e a continuação recebia 456px a 1440, fechando em duas linhas **acima** da última linha do título (continuação y=491, título y=509). Causa: SIS-155 trocou `--font-editorial` para Geist, mais larga (manchete 2 → 3 linhas).

**Mudanças:** (1) grade `minmax(0, 1fr) max-content`; continuação com `white-space: nowrap` + `max-width: none` (derruba `max-w-2xl` 672px) em **uma** linha, `align-items: end`; (2) corpo do título `clamp(2rem, 3.6vw, 3.2rem)` → `clamp(2rem, 3.3vw, 3rem)` (`scripts/varrer-titulo-esg-sis206.mjs`; 3,1vw e 2,9vw recusados); (3) véu da rota fechado; (4) regra SIS-113 `h1 { max-width: min(46ch, 52vw) }` substituída por comentário.

Medido (`scripts/medir-abertura-esg-sis206.mjs`): 1440 título 47,52px, caixa 534×205 em (160,365); continuação 1 linha 671×40 em (737, **530**); última linha do título y=513 (Δ 17px). 1280: 42,24px, 453×182; continuação 597×35. 390: bloco abaixo, 24px. Um `h1` nas três larguras. Continuação `clamp(1.5rem, 2.5vw, 2.25rem)` da SIS-138: 36px / 32px / 24px.

Contraste (máscara de miolo). Véu C **74/60/84+28** escolhido (`scripts/varrer-veu-esg-sis206.mjs`): 1280 **7,05:1**, 1440 **6,10:1**, 1920 **8,33:1**, 390 **5,75:1**. Degraus B recusado por margem; D recusado porque apaga a foto. `copy-lock.json` não regerado (1631 textos). Portões: tsc 0 erros; lint 23/0; build compiled successfully, `/esg` estática.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-abertura-esg-sis206.mjs`
- `scripts/varrer-titulo-esg-sis206.mjs`
- `scripts/varrer-veu-esg-sis206.mjs`

---

## SIS-205 — /eventos-inovacao — botão YouTube só em Web Summit AI e Suitability

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-205/eventos-inovacao-botao-youtube-so-em-web-summit-ai-e-suitability

### Pedido
Na cena `EventsSpotlight` de `/eventos-inovacao`, o botão `ASSISTA NO YOUTUBE` só em `web-summit-ai` e `suitability-ai` (`src/data/events.ts`); os outros treze (ex. ITC Vegas) sem botão. Condicionar nos dois layouts (desktop sticky + lista estreita); preferir flag no data. Enquanto não houver URL de vídeo, os dois continuam no canal (`YOUTUBE_URL`). Atualizar nota do cabeçalho (~L97–102). Aceite: botão só nos dois; teclado/`rel` intactos; sem inventar URL; captura 1440 com/sem botão; lint/tsc/build OK.

### O que foi feito
Flag `youtube?: boolean` em `SistranEvent` (`src/data/events.ts`), `true` só em `web-summit-ai` e `suitability-ai`. Os dois blocos de `EventsSpotlight.tsx` renderizam `<a className="eventos-destaque-botao">` sob `{evento.youtube && …}` / `{e.youtube && …}`. Boolean, não `true | string` (URL por vídeo inexistente; literal em `src/data/` entra no copy-lock). Não reaproveitou `featured`.

Sonda `scripts/capturar-botao-youtube-sis205.mjs` (`next dev` 3999): palco 1440 em 15 passos — botão em 2 eventos (Web Summit AI e Suitability), não montou em 12 (FENACOR não caiu no centro: 2+12=14 amostrados). Lista estreita 390: 15 itens, **2** botões, `no-preference` e `reduce`. `href` único: `https://www.youtube.com/channel/UC-4NqY5lFD3e1cNwlUemj2g` (`YOUTUBE_URL`). Nota ~L97 reescrita. `scripts/medir-cena-eventos.mjs` asserção `"13-quinzeBotoes"` → `"13-doisBotoes"` (`=== 2`). `rel="noopener noreferrer"`, `target="_blank"`, `<span class="sr-only">` preservados.

Portões: tsc 0 erros; lint 22/0; build compiled successfully in 8.7s, 20 rotas. `test:copy` não estava na lista e não foi rodado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/events.ts`
- `src/components/EventsSpotlight.tsx`
- `scripts/capturar-botao-youtube-sis205.mjs`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-204 — /eventos-inovacao — título único com scroll + sombra azul clara + rótulos inteiros nas miniaturas

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-204/eventos-inovacao-titulo-unico-com-scroll-sombra-azul-clara-rotulos

### Pedido
Polish da `EventsSpotlight` (não reabrir SIS-166): (1) um só «Eventos & Inovação» no scroll hero→cena (fade/translate; reduce sem duplicata; sem `pin: true`); (2) sombra azul mais clara no cartão e nas miniaturas (família `#0ed8f6`, não navy `rgba(4, 32, 62, …)`); (3) título inteiro em cada miniatura (sem ellipsis de 1 linha), palco ainda cabe em 1366/1440. Aceite: transição documentada; sombras ciano; rótulos completos; capturas 1440; lint/tsc/build OK.

### O que foi feito
Onde: `src/components/EventsSpotlight.tsx`, `src/components/events-spotlight.css` e `scripts/`. `page.tsx`/`PageHero` não mudaram.

**Título único:** `IntersectionObserver` no `#topo h1` escreve `data-titulo="cedido" | "assumido"` em `<section id="eventos">`. Hero em quadro: cabeçalho da cena `opacity: 0` + `translateY(0.75rem)`; hero sai: cena assume em 0,45s. Hierarquia `h1` + `h2` permanece. Medido (opacity efetiva > 0,05): 1440/1366/1024 passaram de **2** títulos em quadro para **1**. Reduce: cessão continua, só a transição morre (`transition: none`, `transform: none`); espelho `html[data-motion="reduce"]`. Fallback sem JS: `data-titulo` null.

**Sombra** (só `box-shadow`, `#0ed8f6`):

- `.eventos-destaque-cartao`: `rgba(4,32,62,.55) 0 30px 60px -40px` → `rgba(14,216,246,.6) 0 18px 44px -28px, rgba(11,127,168,.3) 0 3px 12px -6px`
- `.eventos-vaga-arte`: `rgba(8,33,63,.6) 0 8px 20px -14px` → `rgba(14,216,246,.6) 0 5px 14px -8px, rgba(11,127,168,.28) 0 1px 4px -2px`
- `.eventos-vaga-rotulo`: `none` → `rgba(14,216,246,.55) 0 3px 10px -6px, rgba(11,127,168,.24) 0 1px 3px -2px`
- `.eventos-lista-item` (mobile): navy → `rgba(14,216,246,.6) 0 16px 40px -28px, rgba(11,127,168,.3) 0 3px 12px -6px`

**Rótulos:** elipse de 1 linha saiu; vaga virou linha (`flex-direction: row`); `--evt-vaga-h` passou a PISO (`min-height`). Rótulos cortados: 1440 9→**0**/15; 1366 10→**0**/15; 1024 12→**0**/15. Teto `--evt-rotulo-linhas` **12**. Palco: 1440 soma vagas 448/627 · 463/627, folga faixa→cartão 123px; 1366 454/502 · 470/502, folga 112px; 1024 469/552 · 512/552, folga 19px. Correção 1024: coluna pintava sobre o cartão (contraste descrição **1,02:1**); `.eventos-destaque-coluna--dir .eventos-vaga { margin-left: auto }` + `--evt-prof: 1.06` e `faixa >= vaga × 1,606`; arte 0,34 → 0,30. Contraste descrição depois: **11,60:1** nas cinco larguras. Reaplicou asserção SIS-205 `quinzeBotoes` → `doisBotoes`.

Portões: tsc 0 erros; lint 23/0; next build OK; `medir-cena-eventos.mjs` **77 asserções, 0 falsas**; `medir-cena-eventos-sis204.mjs` verde em 1440/1366/1024.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-cena-eventos.mjs`
- `scripts/medir-cena-eventos-sis204.mjs`

---

## SIS-203 — Home · números: hover fluido nas células, menos névoa branca, bolinhas sob cada métrica

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-203/home-numeros-hover-fluido-nas-celulas-menos-nevoa-branca-bolinhas-sob

### Pedido
Na faixa Sistran em números (sete métricas, `#resultados` / `Metrics.tsx`), depois da SIS-200: hover mais fluido (lift `translateY`/scale; reduce sem hover motion); faixa navy arredondada permanece; diminuir névoa/sombra branca do retângulo; reposicionar o trilho de sete pontos cianos — uma bolinha sob o eixo de cada célula. Copy/valores intactos; sem `pin: true`; não desfazer ícones da SIS-200. Aceite: hover perceptível; retângulo único; névoa mais fraca; 7 pontos sob células em 1440 (± tolerância); capturas 1440; lint/tsc/build/`test:copy` OK.

### O que foi feito
Entrega **sem conferência**. Resultado:

- Painel único navy, 1360px em viewport 1440, raio de 24px, divisórias internas preservadas.
- Hover via `transform`: célula acesa `0 → -6px`; célula apagada `12 → -6px`, opacidade 0,56.
- Reduce: `transform: none` (`prefers-reduced-motion` e `html[data-motion='reduce']`).
- Névoa superior reduzida para 150px e opacidade 0,28; sombra do painel curta e escura.
- Sete bolinhas ligadas por linha; desvio máximo centro da célula ↔ centro do ponto em 1440: **0,01px**.
- Mobile 390: painel 358px, documento 390px/viewport 390px, sem overflow; métricas em coluna; trilho no rodapé do painel.

Evidências: `docs/medidas/sis203/baseline-1440x900.png`, `depois-1440x900.png`, `depois-390x844.png`, `baseline.json`, `depois.json`. Portões: lint 0 erros (22 avisos); TypeScript OK; build OK; `test:copy` mantém 10 divergências concorrentes; `copy-lock.json` não absorvido. Captura baseline com modal de preferência de movimento cobrindo parte da cena; geometria no JSON. Comentário 11/09: banda branca full-bleed segue em SIS-213.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `docs/medidas/sis203/baseline.json`
- `docs/medidas/sis203/depois.json`

---

## SIS-202 — /parceiros-e-implementacoes · etapas: layout RoadmapTrail + textos da timeline antiga

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-202/parceiros-e-implementacoes-etapas-layout-roadmaptrail-textos-da

### Pedido
Em `/parceiros-e-implementacoes`, a seção de etapas (`PartnersTrail` / `#linha-do-tempo`) deve ficar visualmente igual ao `RoadmapTrail` de `/transformacao-legado`. A usuária **reprovou** o default opção 1 (copy Luminna: `roadmapIntro` + `roadmapStops`). Pedido real: **só o layout**; textos dos cards voltam a `TIMELINE_EVENTS` (`timeline.ts` — gerações, Castelo Costa · Zurich, detail, categorias). Cabeçalho da seção **sem** `roadmapIntro`. Preferir reusar `RoadmapTrail`; `/transformacao-legado` sem regressão; `PartnersTrail` preservado e desmontado. Sem `pin: true`. Aceite: layout alinhado (capturas 1440 lado a lado); zero copy de legado/Luminna; cards com company/detail/generation; mobile + reduce; lint/tsc/build/`test:copy` OK.

### O que foi feito
Primeira entrega montou opção 1 (mesmo `roadmapIntro`/`roadmapStops`; palco `.roadmap-stage` **3502px** nas duas rotas a 1440 e **6989px** a 390; `PartnersTrail` desmontada; correção mobile `@media (max-width: 63.99rem)` — a regra de linha vertical **não existia** em `legacy.css`). Portões da 1ª rodada: tsc limpo; build 27/27; lint 22/0; `test:copy` já falhava na linha de base. A usuária devolveu para In Progress (10/09).

**Refeita — opção 2:** `RoadmapTrail` passou a receber `id`, `intro`, `stops` e `traveler` por prop (padrões = legado). Contrato `TrailStop`: `stage` e `detail` opcionais; campos ausentes não renderizam. Paradas em `src/lib/partnersRoadmapStops.ts` derivadas de `TIMELINE_EVENTS`: `generation` → linha de cima; `company` → título; `detail` → apoio; `category` + `TIMELINE_CATEGORY_META` → pílula/cor; iniciais do primeiro nome → monograma (`Castelo Costa · …` → `CC`). `timeline.ts` intocado. Cabeçalho `{ kicker: 'Implementações', title: 'Linha do tempo' }`. `traveler={null}` (logo Luminna só no legado). Geometria `useMemo(() => buildTrail(stops.length))` (24 paradas ≠ palco de 10). Sem chips/checklist/«VER DETALHES»/status CONCLUÍDO. Legado `.roadmap-stage` **3502px** em todas as passagens. Mobile 390: palco 6989px, todas as paradas alcançáveis. Reduce: rota pintada até o fim, paradas 23 e 24 legíveis. Ajustes: `legacy.css` `:has(.roadmap-topics)` para não esconder `.roadmap-text` sem checklist; `NEUTRAL_GRADIENT` exportado. Imperfeição declarada: «ETAPA 12 / 24» quebra em duas linhas (pílula «EMPRESAS GRANDES»). Follow-up viajante: **SIS-220**.

Portões da 2ª rodada: lint 22/0; tsc limpo nos arquivos da issue, **5 erros pré-existentes em `UnitsMap.tsx`**; build bloqueado pelo mesmo arquivo (com só `UnitsMap` em stash, build compila); `test:copy` falha na linha de base. Correção copy-lock: `palavras[0][0] + palavras[1][0]` virou `slice(0,2).map(p => p[0]).join('')`.

### Conferência
Sem registro de conferência no Linear. A primeira entrega foi reprovada pela usuária (copy Luminna indevida) e refeita na opção 2; não há comentário de conferente com VEREDITO.

### Arquivos tocados
- `src/components/legacy/RoadmapTrail.tsx`
- `src/components/legacy/legacy.css`
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/lib/partnersRoadmapStops.ts`
- `src/data/pageSections.ts` (tom da parada; 1ª rodada)
- `scripts/capturar-etapas-sis202.mjs`

---

## SIS-201 — /parceiros-e-implementacoes · cards horizontais estilo Terminal + imagens parceirosimplantações

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-201/parceiros-e-implementacoes-cards-horizontais-estilo-terminal-imagens

### Pedido
Redesenhar a seção Parceiros no estilo Platform do Terminal Industries: cards grandes horizontais + pills de categoria + setas prev/next. Fundos em `public/parceirosimplantações/` (renomear para ASCII `public/parceiros-implementacoes/`). Copy de `partners.ts` / `05-parceiros-e-implementacoes.md`. `PartnersTrack` sai do mount (arquivo preservado). Reparo 10/09: manter `p.logo` / `p.logoAlt` nos cards; logo em destaque; hover com eco da mesma logo atrás + sombra azul (`#0ed8f6`); reduce sem eco. Sem `pin: true`. Aceite: 16 cards + abas + setas; 01/02 documentados (Samplemed/Pega); duplicata SAP e PNG ChatGPT fora; mobile/reduce; lint/tsc/build/`test:copy` OK.

### O que foi feito
**Base (sem conferência):** `PartnersTrack` desmontado, arquivo preservado; 16 cards com scroll-snap, pills de filtro e setas; `next/image`, overlay navy, copy existente; Addactis sem description inventada; pasta ASCII `public/parceiros-implementacoes/` com 16 imagens; `01.png` → Samplemed, `02.png` → Pega; duplicata SAP e ChatGPT excluídos; Playwright 1440×900 / 390×844 / 390 reduce: HTTP 200, 16 cards, setas 48×48. Portões: lint 0 erros; tsc OK; build OK; `test:copy` bloqueado por Home concorrente.

**Reparo 1 — placas:** `PartnerTerminalCards.tsx` + `partner-terminal-cards.css`. Placa via `p.logo`, `margin-bottom: auto`. 16/16 no DOM (1440, 390, 390 reduce). Quatro logos de tinta clara (ST IT, Addactis, SAP, dacadoo) somem no chip branco (2,31 / 2,84 / 1,80 / 2,10:1) e passam no navy (7,36 / 5,98 / 9,42 / 8,08:1); as outras doze o inverso. Duas variantes, mesma geometria. Render 1440: **16/16 passam de 3:1 no núcleo do traço**; mínimo Earnix **3,67:1**. `alt=""` + `aria-hidden` (nome no `<h3>`). Lista `LOGOS_DE_TINTA_CLARA` no componente, não em `partners.ts`. Layout: 1440 card 642px folga 192–332px; 390 card 546px folga 96–335px.

**Reparo 2 — destaque + eco:** placa `max-width: 13rem / max-height: 3.25rem` (imagem 35–52px a 1440, 23–36px a 390). Eco: mesma `partner.logo`, idle `opacity: 0 / scale(0.92)` → hover `opacity: 0.34 / scale(1.45)`, `transform-origin: top left`; `drop-shadow(0 0 1.25rem rgba(14,216,246,.78))` + `drop-shadow(0 0 3rem rgba(9,107,173,.62))`. Reduce: `display: none` no eco (sistema e `html[data-motion='reduce']`). Folga eco→texto 1440 **122–273px**; 390 **80–332px** (`scale(1.28)`). Contraste re-medido: 16/16 > 3:1; mínimo Earnix **3,63:1**. Sonda do eco intermitente corrigida (pausa 400ms após `scrollIntoViewIfNeeded`). Portões dos reparos: tsc limpo; lint 22/0; build OK; `test:copy` falha fora do diff. Follow-up: **SIS-218** (pin + scrub) e **SIS-219** (escala da placa).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/PartnerTerminalCards.tsx`
- `src/components/partner-terminal-cards.css`
- `src/app/parceiros-e-implementacoes/page.tsx`
- `public/parceiros-implementacoes/`
- `scripts/medir-logos-parceiros-sis201.mjs`
- `scripts/medir-placas-render-sis201.mjs`
- `scripts/medir-layout-placas-sis201.mjs`
- `scripts/capturar-placas-sis201.mjs`
- `scripts/medir-eco-hover-sis201.mjs`

---

## SIS-200 — Home · Sistran em números: sete células iguais + ícone dinâmico por métrica

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-200/home-sistran-em-numeros-sete-celulas-iguais-icone-dinamico-por-metrica

### Pedido
Na home, seção Sistran em números (`#resultados` / `Metrics.tsx`): todas as células com a mesma largura/altura; um ícone dinâmico distinto por métrica (não sete iguais). Copy/valores de `metrics.ts` travados. Opção A: reusar `ImpactVisuais` ~40–56px; opção B: Lucide/`getIcon`. Desktop ≥1280: larguras iguais (≤1px). Aceite: células iguais medidas; ícones distintos; ativo com movimento; labels longos não desigualizam; capturas 1440; lint/tsc/build/`test:copy` OK; relatório com opção A ou B.

### O que foi feito
Opção **B** (catálogo da casa). A: desenhos 200×200 com traço 0,8–1 caem abaixo de meio pixel a 52px; vocabulário `.iv*` vive no `@media (min-width: 1024px)` inerte (`dirigindo = false`). Mapa `Record<ImpactVisual, …>` completo em `src/components/ui/impact/ImpactIcones.ts` (não em `src/data/metrics.ts`: `icon: 'Users'` reprovaria o copy-lock). Catálogo não cresceu: Users, Award, Handshake, Clock, Layers, ShieldCheck, Workflow.

Diagnóstico: `1fr` × 7 já era 169,42px; a 1ª célula tinha conteúdo 148,42 vs 128,42 (20px = `1.25rem` de `padding-left` só nela); `.impact-lista` em `align-items: start` desigualizava alturas/fios. Correção: mesmo padding nas sete; `border-left-color: transparent` na primeira (não `width: 0`); `align-items: stretch`.

Medição (`scripts/medir-celulas-numeros-sis200.mjs`): **1440** `169.42px × 7`, conteúdo 148,42, altura **173,58**, 7 ícones; **1280** `149.58 × 7`, conteúdo 128,58, altura 197,58. Espalhamento **0,00px**. Mobile: 390 1 col 350px; 768 2 col 342px; 1024 4 col 223,11px (espalhamento 0,02px); 1279 4 col 282,66px; `scrollWidth == clientWidth`. `hyphens: auto` tentado e retirado («Capa-cidade»); `overflow-wrap: anywhere` fica.

Dinâmico: carona em `data-aceso` e `--impact-i`; entrada `translate3d(0,4px) scale(0.86)` + delay `calc(var(--impact-i) * 60ms + 80ms)`; idle `impact-icone-respira` 6s no anel. Na fileira estática `data-aceso` acumula (sete `sim`). `aria-hidden` no wrapper `.impact-icone`; `strokeWidth={1.6}`. Observação: rótulo ScrollSpy «NÚMEROS» cobre o ícone da 1ª célula a 1440.

Portões: tsc 0; lint 22/0; build OK; `test:copy` reprova por frentes concorrentes (nomes de ícone não aparecem no relatório).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/impact/ImpactIcones.ts`
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/data/types.ts` (comentário)
- `src/data/metrics.ts` (comentário)
- `scripts/medir-celulas-numeros-sis200.mjs`

---

## SIS-199 — Home · backdrop inteiro = azul claro + grade leve (igual Soluções de Negócios)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-199/home-backdrop-inteiro-azul-claro-grade-leve-igual-solucoes-de-negocios

### Pedido
Na home inteira (`src/app/page.tsx`), o backdrop deve ser a mesma superfície de Soluções de Negócios (`SolutionsStory`): `--fundo-claro-secao` + grades leves (`.story-solucoes__grade`, linhas `rgba(4, 58, 99, 0.08)` ~64px, opacidade ~0,32). Isolar em classe no `<main>` (não pintar o site). Relatório obrigatório: opção 1 (canvas claro + palcos navy por cima) ou 2 (home toda clara). Aceite: sem `#1273bc` vazando entre seções (exceto palco declarado); tipografia ink; outras rotas sem regressão; capturas 1440 topo/Soluções/Números/rodapé; lint/tsc/build/`test:copy` OK.

### O que foi feito
**Opção 1.** Raster `scripts/medir-canvas-home-sis199.mjs`, coluna `x=8`: Metrics 525px navy; ImpactSequence 1025px; Social+Footer 1166px — **2716px de 10991px = 24,7%**. Palcos declarados; Social/Footer são chrome de 10+ rotas. Degraus de emenda (média 4px de cada lado): hero→BrandGrid 1→**1**; BrandGrid→Soluções **23→0**; Soluções→Números 6→**4**; Montagem→Contato 0→0; Contato→Social 24→24 (pré-existente).

Mecanismo: `--fundo-claro-secao` + tokens `--grade-fina-linha/modulo/opacidade` (64px); `background-attachment: fixed` (um radial para a página). Nenhum ancestral de `#conteudo` pode ganhar `transform`/`filter`/`perspective`. `.marcas-grade::after`: grade fina repetida na seção opaca (747px sem malha). `.home-canvas .impact-scroll::before`: rampa da Metrics pintava `#e4edf7` à mão (degrau 6→13); corrigida com token `fixed` + `mask-image` (degrau **4**). `.section-light::before` e `.story-solucoes__grade` em `display: none` dentro de `.home-canvas`. Classe `.home-canvas` no `<main>`; 14 rotas conferidas; `body` segue `rgb(18, 115, 188)`.

Contraste (`medir-contraste-hero-pitch.mjs`): 1440 título 14,45 / apoio 9,97 / pilares 15,01–15,31 / realce 3,36; 1024 semelhante; 390 sobre vídeo 6,32 / 5,59 / 5,77–6,28 / 5,55. Portões: lint 22/0; tsc exit 0; build 8.5s 27/27; `test:copy` OK (1189 textos).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (`.home-canvas` no `<main>`)
- `src/app/globals.css`
- `src/components/solutions-story.css` (tokens de grade)
- `scripts/medir-canvas-home-sis199.mjs`

---

## SIS-198 — Home · hero: tamanho fixo (sem scale/drop) + contorno ciano melhorado — ref card

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-198/home-hero-tamanho-fixo-sem-scaledrop-contorno-ciano-melhorado-ref-card

### Pedido
No hero da home, parar de diminuir no scroll (`scale` 1→0,54 em `[0.62, 0.96]`, `drop` 0→20svh em `[0.84, 1]`). Manter tamanho padrão igual a `public/referencia-hero-card-tamanho.png` (card largo, cantos arredondados, margem, moldura ciano). Melhorar o contorno ciano da SIS-190 (glow/peso; skills GSAP/filters/svg-stroke, sem `pin: true`). Preservar layout SIS-178, pitch SIS-192, vídeo SIS-189. Medir emenda com BrandGrid. Aceite: sem scale/drop de recolhimento; tamanho ≈ PNG (valores no relatório); contorno melhor; skills citadas; capturas 1440; lint/tsc/build/`test:copy` OK.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados mostra In Progress em 10/09/2026 das 13h28 às 16h52, e In Review desde então; os únicos comentários são de despacho, sobre a PNG de referência (`public/referencia-hero-card-tamanho.png`, gravada no repo em 10/09).

**A entrega existe no código, apenas não foi relatada.** Conferido em `src/components/HeroCinematic.tsx`, onde o próprio diff se documenta:

- Os três valores de recolhimento foram removidos e ficaram comentados com o motivo de cada um, marcados como SIS-198: `scale` `[0.62, 0.96] → [1, 0.54]` (o fechamento a 54% no fim do percurso), `radius` `[0, 30]` (só existia para acompanhar o `scale`, já que raio em sangria não se vê) e `drop` `[0.84, 1] → ['0svh', '20svh']` (a descida que levava o card fechado até o bloco seguinte).
- No lugar dos três entrou **geometria estática** em `globals.css` (`.hero-scene`, bloco `>= 1024px`): recuo, altura e raio medidos na referência por `scripts/medir-referencia-card-hero.mjs`. A justificativa registrada é que card parado é layout, não animação — como CSS, vale antes da hidratação, sem JS e com movimento reduzido, sem exigir um segundo caminho.
- O raio dos cantos da direita do quadro de vídeo (herdado da SIS-190) deixou de ser interpolado de 20 para 30 e virou fixo, confirmado pela mesma medição da referência do card.
- A `.hero-sheet` permanece e passa a ser o que se vê em volta do card o tempo todo, não só no fim do percurso.

Não há, em lugar nenhum, as medidas contra a referência, as capturas 1440 antes/depois, as skills citadas nem o resultado dos portões que os critérios de aceite exigiam.

### Conferência
Sem registro de conferência no Linear. É o caso mais frágil do lote: `In Review` sem `conferir` nem `conferido`, sem relatório e sem as evidências pedidas no aceite — a entrega só é verificável lendo o código.

### Arquivos tocados
Não declarados no relatório. Identificados por leitura do código:
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css` (`.hero-scene`)
- `scripts/medir-referencia-card-hero.mjs`

---

## SIS-197 — Home · data-reveal: presets fade-up/fade/scale-soft/line-up nos blocos (Efeito 4 — doc Terminal)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-197/home-data-reveal-presets-fade-upfadescale-softline-up-nos-blocos

### Pedido
Aplicar na home os presets `data-reveal` do Efeito 4 (`docs/efeitos-scroll-terminal-industries.md`): `fade-up`, `fade`, `scale-soft`, `line-up`; stagger ~80ms. Fora: wrappers em volta de ProofJourney/sticky, hero video (SIS-189), BrandGrid (SIS-195), títulos da SIS-194. Gatilho típico `top 85%`; reduce no primeiro paint. Sem segunda lib / sem `framer-motion`. Ligar à SIS-71 sem reabrir auditoria. Aceite: presets consistentes; sem `transform` em ancestral sticky; lint/tsc/build OK.

### O que foi feito
Fundação SIS-193 (`useRevealTrigger.ts`, `RevealScope.tsx`) já `conferido`. CSS anima, JS só marca `data-in`. Token `--motion-stagger-reveal: 80ms`. Presets: `fade-up` → opacity 0 + `translate3d(0, var(--motion-distance-sm), 0)`; `fade` → opacity 0; `scale-soft` → opacity 0 + `scale(0.96)`; `line-up` → opacity 0 + `scaleX(0)`, `transform-origin: left center`, duração `--motion-reveal-slow`. Estado escondido exige ancestral `[data-in="false"]`.

Onde entrou: (1) `SolutionsStory.tsx` — header: eyebrow `fade-up` i=0; `h2#solucoes-titulo` i=1; rótulo Diferenciais `fade` i=2; régua `line-up` mesmo índice; escopo no próprio `<header>`. (2) `ImpactSequence.tsx` — kicker / `h2#impacto-title` / `.lp-lead` `fade-up` 0–2; escopo em `.sequence-sticky`. Fora: Hero, BrandGrid, corpo SolutionsStory/ProofJourney/Metrics, Contact, Social/CartaoDuasFaces, Footer.

Desvios: `line-up` desenha da esquerda (`scaleX`), não sobe; stagger via `--reveal-i` × token, não `data-stagger`. Reduce: regras SIS-193 com `!important`. Sonda `docs/medidas/sis197/sonda-presets.mjs`: ao entrar 0,008 / 0,037 / 0,121 / 0,386 no header; depois do percurso 7 nós opacity 1; reduce (sistema e `data-motion`) 7 nós prontos com escopo ainda `data-in="false"`; nenhum ancestral sticky com `transform`/`filter`/`perspective`. Correção lint: `ref={legenda.ref}` → `const { ref: legendaRef } = useRevealTrigger()`. Relatório também em `docs/ENTREGA-EFEITOS-HOME.md`. Portões: tsc 0; lint 22/0; next build 0; `test:copy` OK (1189). Follow-up 15/09: cobertura tipo `docs/scroll.md` em **SIS-275**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/SolutionsStory.tsx`
- `src/components/legacy/ImpactSequence.tsx`
- `docs/medidas/sis197/sonda-presets.mjs`
- `docs/ENTREGA-EFEITOS-HOME.md`

---

## SIS-196 — Home · Soluções de Negócios: redesenhar no sticky storytelling Terminal (layout inteiro)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-196/home-solucoes-de-negocios-redesenhar-no-sticky-storytelling-terminal

### Pedido
Trocar o layout inteiro do bloco Soluções de Negócios pelo modelo de `docs/secao-sticky-storytelling-terminal.md` (duas colunas, mídia sticky, frases progressivas, recorte, mobile sem sticky longo). Copy das quatro etapas de `solutions.ts`. Reparos 10/09: texto não pode passar atrás da imagem; fundo azul claro (`.section-light` / `#f2f9fe`→`#cfe7f7`); sombra atrás das imagens via `filter: drop-shadow` (não `box-shadow` no clip-path). Sem `pin: true`. Relatório com decisão ProofJourney (1 ou 2). Aceite: checklist do doc §18 + emenda; `test:copy`/lint/tsc/build OK.

### O que foi feito
Primeira fatia (09/09) acendeu texto caractere a caractere no teatro antigo (sonda 222 caracteres; pico 66 a 1440 / 48 a 1024; reduce 0 partidos). Escopo ampliado: layout inteiro.

**Opção 2 — desacoplar** da `ProofJourney`: `<SolutionsStory />` irmã, montada antes da jornada. Correções em `ProofJourney.tsx`: `chegadaDe` do 1º capítulo = `topo - SOBREPOSICAO * vh`; capítulo inicial = primeiro inscrito. Arquivos novos: `SolutionsStory.tsx`, `solutions-story.css`. `Solutions.tsx` e `.solutions-*` comentados, não apagados. Grade 46/54; sticky; IO `rootMargin: -45% 0 -45%`; frase por caractere em rAF (estado React só `activeIndex`/`isDesktop`); contador `01 / 04`; mobile scroll-snap-x; reduce nas duas chaves. 1ª implementação: superfície ainda navy (emendas BrandGrid/Metrics). Após reparos da usuária: fundo claro, overlap 0px² em 1440/1280/1024; sticky top 100px; crossfade 500ms; contraste ink 13,36–16,07:1; muted 4,27–5,13:1; ciano transitório 1,35–1,62:1; emenda gap 0; CLS 0,032–0,073.

**Reparo no-JS:** `solutions-story.css` passou a ser servido no HTML inicial; quatro figures 1324,8×522px; painel desktop `display:none` 0×0.

**Sombra (3ª rodada):** desktop `drop-shadow` no wrapper sticky externo; clip/overflow no `.story-solucoes__midia-recorte`; mobile/no-JS/reduce `drop-shadow` nas quatro figures. Computed: navy rgba(...,0.14) 0 10px 22px + azul rgba(...,0.10) 0 2px 6px; figures 0.13 0 8px 12px + 0.09 0 1px 4px. Folga até clips: 35,6px (1440), 19px (1024), 3,6px (390). Raster: escurecimento 16,4 na aresta reta vs 3,4 na baía recortada. Sem `box-shadow`, sem filter em `.story-media__item`, sem `will-change` permanente. Portões finais: lint 0 erros, tsc, `test:copy`, build e `test:solutions-story` verdes.

### Conferência
**VEREDITO: REPROVADO** (1ª conferência): fallback sem JS na build de produção — CSS estrutural ausente do HTML inicial; figures ~1304×0. Reparo do CSS no entry point servidor atendido.

**VEREDITO: REPROVADO** (2ª): no-JS corrigido, mas sem `filter: drop-shadow(...)` no painel (critério novo de sombra). Reparo da 3ª rodada atendido.

**VEREDITO: APROVADO** (3ª e última): sombra navy+ciano via `drop-shadow`; clip no nó interno; raster 16,4 vs 3,4; folgas positivas; grid 46/54; overlap 0; opção 2; emenda gap 0 e CLS 0; portões verdes. Permanece In Review com `conferido`. Sugestões não bloqueantes: folga 3,6px em 390; wrapper interno no mobile se Safari/Firefox recortarem sombra; comentário obsoleto em `page.tsx`; monitorar stacking do filter.

### Arquivos tocados
- `src/components/SolutionsStory.tsx`
- `src/components/solutions-story.css`
- `src/app/page.tsx`
- `src/components/ProofJourney.tsx`
- `copy-lock.json` (regenerado na 1ª montagem da opção 2)

---

## SIS-195 — Home · BrandGrid: cascata fade-up das logos no scroll (Efeito 1 — doc Terminal)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-195/home-brandgrid-cascata-fade-up-das-logos-no-scroll-efeito-1-doc

### Pedido
Efeito 1 de `docs/efeitos-scroll-terminal-industries.md` na `BrandGrid`: cascata fade-up das logos. Estado inicial `opacity: 0; translate3d(0, 24px, 0)` (mobile 16px); duração ~2,4s (`--motion-logo`); stagger 0,10s; gatilho ~20% da seção; `toggleActions: play none none reverse`. Geometria SIS-179 intacta (15 marcas 5×3 / 3×5 — não forçar 10 colunas). Reduce: estado final no primeiro paint. Aceite: cascata na ordem de leitura; reverter ao voltar acima; título antes das logos; object-fit; cleanup GSAP/ST; lint/tsc/build/`test:copy` OK.

### O que foi feito
`BrandGrid.tsx`: campo em `RevealScope umaVez={false}`; cada `<img>` com `data-logo` e `--logo-i`. Movimento (2400ms, expo, 100ms, 24px; ≤640px 1100ms e 60ms) no bloco SIS-193. Recusas: 10 colunas do doc; `scaleX/scaleY` nas linhas (são `background-image`); movimento não é infinito. Sonda `scripts/medir-efeitos-rolagem-home.mjs` (`next start`): 15 logos, 1440/1024/390 × 3 regimes — normal parte de 0 e chega a 1; reduce já 1 antes de rolar. Armadilhas: medir no rodapé dava 0 (reverte ao sair); trava de duas leituras iguais falhava no stagger 1400ms (piso 4200ms).

**2ª implementação (após reprovação):** animação no wrapper (não disputa com `.marcas-grade-celula img`); `RevealScope` com semântica `play none none reverse`. Runtime 1440: translate 24→0px, 2400ms, última delay 1400ms, diferença 1408ms; 390: 16→0, 1100ms, delay 840ms, diferença 835ms; rodapé `data-in=true`, opacidade mín. 1; reverse ao voltar acima (inclusive salto ao topo); hover grayscale(0) + azul preservado.

Portões (ambas as rodadas de entrega): tsc limpo; lint 24/0 depois 0 erros; build e `test:copy` verdes.

### Conferência
**VEREDITO: REPROVADO:** (1) cascata perdia para `img` (runtime só `filter, opacity` 400ms, delay 0, transform saltava); (2) `umaVez={false}` revertia no rodapé e as logos sumiam; (3) sonda insuficiente. Reparos da 2ª rodada atendidos.

**VEREDITO: APROVADO** (2ª): wrapper 2,4s / delay 1,4s / Y 24→0 a 1440; mobile 1,1s / 0,84s / 16→0; hover e geometria SIS-179; reverse só acima; 15 logos; SSR/no-JS e reduces; portões verdes. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/components/BrandGrid.tsx`
- `src/components/motion/RevealScope.tsx`
- `src/app/globals.css` (bloco SIS-193)
- `scripts/medir-efeitos-rolagem-home.mjs`

---

## SIS-194 — Home · títulos: revelação por linha/palavra com máscara (Efeito 2 — doc Terminal)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-194/home-titulos-revelacao-por-linhapalavra-com-mascara-efeito-2-doc

### Pedido
Efeito 2: revelação de títulos da home por linha/palavra com máscara `overflow: clip`. Candidatos: título da BrandGrid, Soluções/Números e demais pós-hero. Fora: parágrafos longos; hero «Alta Performance» se o split quebrar o gradiente (SIS-192). Inicial `opacity: 0; translateY(1.05em)`; 900–1100ms; stagger linhas ~80ms / palavras 45–60ms; gatilho `top 82%`; uma vez; `aria-label` completo; reduce visível no primeiro paint. Aceite: títulos listados no relatório; sem split em parágrafos; leitor de tela ouve o título uma vez; lint/tsc/build/`test:copy` OK.

### O que foi feito
`src/components/motion/RevealText.tsx` + regras `.reveal-line` / `.reveal-line__inner` no bloco SIS-193. Aplicado ao título da parede de marcas (`marcas-grade-titulo`). Palavra, não linha: `text-wrap: balance` muda a contagem de linhas entre 1440 e 320 (nota SIS-155); split de linha medido errado corta o título. `aria-label` no pai; máscaras `aria-hidden`. Exceção: manchete do hero (`Alta Performance`) de fora — `background-clip: text` + `inline-block` vira listras. Correção de lint: contador mutável no `map` → `reduce` puro. Sonda (rodada conjunta das quatro issues de movimento): 10 palavras mascaradas; opacity mín. 0 em repouso e 1 com a seção em cena nas três larguras; 1 já em repouso nos dois reduces. Portões: tsc limpo; lint 24/0; next build verde; `test:copy` OK.

### Conferência
**VEREDITO: APROVADO.** `RevealText` no título da BrandGrid: 10 palavras, máscara `overflow: clip`, 1000ms, stagger 55ms, gatilho equivalente a 82%, frase completa acessível, spans ocultos, no-JS/reduce visíveis. Hero excluído para preservar o gradiente; Soluções já tem movimento próprio; Números não tem mais h2 visível. Permanece In Review com `conferido`. Sugestões: ids dos títulos fora do efeito; não empilhar `data-reveal` da SIS-197 no mesmo h2; sr-only único adicional.

### Arquivos tocados
- `src/components/motion/RevealText.tsx`
- `src/app/globals.css`
- `src/components/BrandGrid.tsx`

---

## SIS-193 — Home · motion Terminal: tokens Sistran + primitiva Reveal (base do doc efeitos-scroll-terminal-industries)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-193/home-motion-terminal-tokens-sistran-primitiva-reveal-base-do-doc

### Pedido
Base da linguagem de movimento na home (`docs/efeitos-scroll-terminal-industries.md`): tokens CSS com cores Sistran (não lime Terminal) e uma primitiva Reveal única para os efeitos 1–4. `--motion-signal` = ciano `#0ed8f6`; `--motion-ink` = navy da casa; durações 300/500/1000 ms (ou alinhar easing a `easeExpo`); primitiva `fade-up`/`fade`/`scale-soft`/`line-up` estendendo `motion.ts`/`SectionReveal`, sem `framer-motion`. Reduce nos dois interruptores. Só fundação — não animar BrandGrid/títulos/Soluções. Aceite: tokens + mapeamento; um caminho Reveal/`data-reveal`; lint/tsc/`next build` OK; doc citado nos arquivos novos.

### O que foi feito
`src/app/globals.css`: tokens `--motion-reveal-*`, `--motion-stagger-*`, `--motion-distance-*`, `--motion-signal/ink/muted` no `:root` + bloco «SIS-193 · fundação dos efeitos de rolagem». `src/components/motion/useRevealTrigger.ts` — IntersectionObserver escreve `data-in`. `src/components/motion/RevealScope.tsx` — envelope cliente para server components.

Desvios: durações como `--motion-reveal-fast/base/slow` (não sobrescrever `--motion-fast/base/slow` já usados: 180/`var(--dur-base)`/900ms e 180/420/650ms). Cores: lime/`#dddddd` → `--color-sky` e cinza `#5a6b80`; tinta `#041b3d`. Mecanismo: JS só marca `data-in`; CSS anula nas duas chaves de reduce; conteúdo visível sem JS (escondido exige `[data-in="false"]`). Sem `pin`. Sonda compartilhada com SIS-195. Ressalva: regeneração de `copy-lock.json` absorveu trabalho alheio (`HeroCinematic.tsx`, `Metrics.tsx`). Portões: tsc limpo; lint 24/0; next build verde; `test:copy` OK (1193 textos).

### Conferência
**VEREDITO: APROVADO.** Tokens Sistran, gatilho único via `data-in`, SSR/no-JS visível, cleanup do IntersectionObserver, ambos os reduces, sem dependências paralelas novas. Portões: tsc, build e `test:copy` verdes; lint 24 avisos / 0 erros. Permanece In Review com `conferido`. Sugestões: consolidar `SectionReveal`/`data-reveal` e `data-in` antes da SIS-197; esconder `.story-media__item` só sob ancestral `data-in="false"`; ciano só como passagem, não texto estático sobre claro.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/motion/useRevealTrigger.ts`
- `src/components/motion/RevealScope.tsx`

---

## SIS-192 — Home: tirar o mosaico e levar “Entrega com Alta Performance…” + quatro pilares para a coluna ao lado do vídeo

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-192/home-tirar-o-mosaico-e-levar-entrega-com-alta-performance-quatro

### Pedido
Na home: tirar a seção do mosaico (`StackScenes variante="home"`) e colocar ao lado do vídeo do hero (layout SIS-178) o título «Entrega com Alta Performance e Comprometimento» (`Alta Performance` em destaque), o apoio «Empresas que aderem a tecnologia…» e os quatro rótulos (Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência) — copy de `mosaicIntroHome` + `DIFFERENTIALS[].title`. Comentar mosaico/`MosaicHandoff` (não apagar); `/transformacao-legado` intacta; `HERO_SLIDES` saem da home; um único heading; sem âncora morta `#sinais`; contraste medido; `test:copy`/lint/tsc/build OK.

### O que foi feito
`page.tsx`: `StackScenes variante="home"`, `MosaicHandoff` e imports órfãos comentados com motivo. Novo `src/components/ui/HeroPitch.tsx`: bloco fixo da coluna, dados de `mosaicIntroHome` e `DIFFERENTIALS` + `getIcon`. `HeroCinematic.tsx`: `HERO_SLIDES`/`HeroCaptions` comentados; notas de mosaico reescritas (vizinha = BrandGrid). `globals.css`: `.hero-pitch-*` reaproveitando `.hero-caption*`; `max-width: 14ch` antigo (legenda 14 caracteres) recalibrado para título de 45; tarja do regime C. Rolagem só governa saída (`opacity` 1→0 entre 0,52 e 0,66). Um único `h1` visível; `h1` sr-only retirado (registrado em `.claude/conteudo-site/00-home.md`). Mobile (<1024): mesmo bloco sobre o vídeo (regime C).

Contraste (`scripts/medir-contraste-hero-pitch.mjs`, letra por diferença): regime A 1440/1024 título **16,01:1**, realce **3,72:1**, apoio **11,36:1**, pilares **16,01:1**. Regime C 390: título corpo **11,34:1**, realce **7,73:1**, apoio **7,17:1**, pilares 8,65–9,80:1. Remediação C: tarja `rgb(3 17 38 / 64%)` (elipses da SIS-178 centradas numa caixa de duas linhas; bloco ~3× mais alto). Realce C é `#a8e0ff` chapado (degradê + fill transparente deixa `text-shadow` passar). Reduce nos dois interruptores: opacity 1 em 1440 e 390. Soluções abre sem handoff (`--carrier-destino` default 1). Sem `#sinais` no ScrollSpy da home. Ressalvas: lock absorveu Metrics alheio; ScrollSpy x=12..104 sobrepõe coluna x=86 (~6px) — pré-existente. Follow-up: **SIS-226** (alternar `HERO_SLIDES` durante o vídeo e manter o bloco no fim).

Portões: `test:copy` OK (1193); tsc OK; lint 24/0 (`HeroPitch` sem avisos); next build OK.

### Conferência
**VEREDITO: APROVADO.** Home sem `StackScenes variante="home"`, sem `MosaicHandoff` e sem `#sinais` morto; BrandGrid irmão de `#top`; um h1 visível com realce, apoio e quatro pilares; mobile sobre a vinheta; sem `HERO_SLIDES`; ícones via `getIcon`; vídeo autoplay muted; `/transformacao-legado` intacta. Contraste conferente: desktop título/pilares 16,01:1, realce 4,28:1; mobile tarja título 5,72:1, realce 4,03:1. Portões: `test:copy` 1193, tsc e build OK. Lint da árvore com 4 erros em `ScrollVideo.tsx` atribuídos à SIS-189. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/HeroPitch.tsx`
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css`
- `scripts/medir-contraste-hero-pitch.mjs`
- `.claude/conteudo-site/00-home.md`
