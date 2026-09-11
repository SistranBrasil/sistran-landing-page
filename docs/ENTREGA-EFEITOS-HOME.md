# Entrega — efeitos de rolagem da home (09/09/2026)

Lote pedido: as cinco issues da home. **Todas as cinco entregues** — a SIS-190 esteve travada
por falta de referência, e a premissa caiu quando `public/referenciavideo.png` entrou no
repositório.

| Issue | Assunto | Situação |
|---|---|---|
| SIS-193 | base de movimento: tokens + primitiva de revelação | **In Review** · `conferir` |
| SIS-194 | títulos revelados por palavra, sob máscara | **In Review** · `conferir` |
| SIS-195 | cascata das logos na parede de marcas | **In Review** · `conferir` |
| SIS-196 | sticky storytelling Soluções | **In Progress** · reparos 10/09 (texto atrás da foto; fundo escuro → claro quem-somos) |
| SIS-190 | borda/moldura no quadro do vídeo do hero | **In Review** · `conferir` |

Fonte de desenho das quatro primeiras: `docs/efeitos-scroll-terminal-industries.md`
(Efeitos 1, 2 e 3). O relatório completo de cada uma está no **comentário** da issue
correspondente; aqui fica o resumo e o que vale para quem for conferir.

---

## O que mudou no repositório

**Arquivos novos**
- `src/components/motion/useRevealTrigger.ts` — o gatilho único. IntersectionObserver;
  escreve `data-in` no DOM.
- `src/components/motion/RevealScope.tsx` — envelope cliente, para que seções que são
  server components continuem sendo.
- `src/components/motion/RevealText.tsx` — título revelado palavra por palavra.
- `scripts/medir-efeitos-rolagem-home.mjs` — a sonda de navegador desta entrega.

**Arquivos alterados**
- `src/app/globals.css` — tokens no `:root`, bloco de estados "SIS-193 · fundação dos
  efeitos de rolagem" no fim do arquivo, e a política de `html[data-motion="reduce"]`
  estendida aos seletores novos.
- `src/components/BrandGrid.tsx` — título via `RevealText`, campo da grade em
  `RevealScope`, `data-logo` + `--logo-i` por logo.
- `src/components/Solutions.tsx` — o texto do passo ativo acende caractere a caractere.

## A decisão que atravessa as quatro

**Estado em CSS, marca em JS.** O JavaScript só escreve `data-in`; todo o movimento é
`transition` de CSS. Três consequências, e são elas que justificam a escolha contra uma
timeline em JS:

1. As **duas** chaves de movimento reduzido da casa resolvem no CSS — sem quadro de
   movimento antes de um hook convergir.
2. Nenhuma divergência de hidratação: o HTML do servidor e o primeiro render do cliente
   são iguais.
3. **Sem JavaScript o conteúdo aparece pronto** — o estado escondido exige
   `[data-in="false"]` num ancestral, que só existe depois de montar.

`pin` não é usado em lugar nenhum. `position: sticky` continua sendo o mecanismo.

## Desvios do doc, todos declarados

- **Durações renomeadas** (`--motion-reveal-fast/base/slow`): `--motion-fast/base/slow` já
  existiam **duas vezes** no `globals.css`, consumidos por outros componentes. Sobrescrever
  mudaria movimento alheio em silêncio.
- **Cores da marca** no lugar do lime e do `#dddddd` da referência: sinal `--color-sky`,
  tinta `#041b3d`, apagado `#5a6b80`.
- **"10 colunas"** da parede de logos: recusado. São 15 marcas, e a geometria medida da
  SIS-179 não foi tocada.
- **Manchete do hero fora do efeito de título**: ela usa degradê em
  `background-clip: text`; fatiada em palavras, a rampa de cor recomeça em cada pedaço e o
  efeito da marca vira listras.
- **Carrossel `scroll-snap` em mobile** (SIS-196): omitido de propósito. Fora da cena
  dirigida as quatro cenas já se empilham no fluxo natural — o conteúdo está acessível sem
  movimento nenhum.
- **Linhas da malha sem `scaleX/scaleY`**: são `background-image` em gradiente, não nós do
  DOM.

## Portões

| Portão | Resultado |
|---|---|
| `npx tsc --noEmit` | limpo |
| `npm run lint` | **24 problemas, 0 erros** (a linha de base) |
| `npx next build` | verde, todas as rotas geradas |
| `npm run test:copy` | OK (1193 textos distintos, nada mudou) |
| sonda de navegador | tabela abaixo |

**Sonda** — `node scripts/medir-efeitos-rolagem-home.mjs` contra `npx next start -p 3999`.
15 logos, 10 palavras mascaradas; `opacidade mín.` é o **pior** dos elementos.

| largura | regime | logos em repouso | logos em cena | palavras em cena | pico de caracteres acesos |
|---|---|---|---|---|---|
| 1440 | normal | 0 | **1** | **1** | 66 |
| 1440 | sistema `reduce` | **1** | 1 | 1 | 0 |
| 1440 | `data-motion="reduce"` | **1** | 1 | 1 | 0 |
| 1024 | normal | 0 | **1** | **1** | 48 |
| 1024 | sistema `reduce` | **1** | 1 | 1 | 0 |
| 1024 | `data-motion="reduce"` | **1** | 1 | 1 | 0 |
| 390 | normal | 0 | **1** | **1** | — |
| 390 | sistema `reduce` | **1** | 1 | 1 | 0 |
| 390 | `data-motion="reduce"` | **1** | 1 | 1 | 0 |

O que a tabela prova: com movimento normal tudo parte escondido e **chega a 1**; com
movimento reduzido tudo já está em 1 **antes de qualquer rolagem**, nas duas chaves. Nenhum
conteúdo fica inalcançável em nenhuma das nove combinações.

O pico de caracteres acesos foi colhido em passos de 400px, então é **piso, não teto** — o
que ele demonstra é que a rampa acende e não trava.

## Duas armadilhas que a sonda pegou

Ficam registradas no próprio script, porque as duas parecem defeito e não são:

1. Medir no fim da página dava `opacidade mín. 0` na parede de logos. Ela **reverte de
   propósito** ao sair de cena; a medição vale com a seção em cena.
2. A trava "duas leituras iguais" disparava falso: a última logo só começa a se mover depois
   de `100ms × 14` de atraso, então duas leituras a 150ms davam o mesmo `0`. O script agora
   tem piso de espera de 4200ms (2400ms de transição + 1400ms de escalonamento).

## Ressalva de árvore compartilhada

A regeneração de `copy-lock.json` absorveu trabalho **não comitado de outro agente** na
mesma árvore: remoções em `HeroCinematic.tsx` e renumeração de chaves em `Metrics.tsx`. É a
mesma ressalva registrada na SIS-192, e está escrita no comentário da SIS-193.

## SIS-190 — o bloqueio caiu

Esta seção registrava a issue como **travada por falta de referência**. A premissa caducou:
`public/referenciavideo.png` está no repositório e anexada à issue. A entrega em si está mais
abaixo, em "SIS-190 — moldura do quadro do vídeo do hero".

---

# SIS-196 — "Soluções de Negócios" no sticky storytelling

Substituiu o **layout inteiro** do bloco: saiu o teatro (nav de botões *Diferenciais*, foto
dominante com cartão de vidro, linha SVG de processo medida, contador `01 / 04` do rodapé) e
entrou o modelo de `docs/secao-sticky-storytelling-terminal.md` — textos das quatro etapas
subindo na coluna esquerda, painel de mídia `position: sticky` à direita trocando de foto por
crossfade.

| Arquivo | O quê |
|---|---|
| `src/components/SolutionsStory.tsx` | novo — a seção. `#solucoes` e `aria-labelledby` iguais aos do teatro |
| `src/components/solutions-story.css` | novo — folha por seção, padrão `brand-grid.css` |
| `src/app/page.tsx` | `<SolutionsStory />` fora da jornada; `{/* <Solutions /> */}` comentado com o motivo |
| `src/components/ProofJourney.tsx` | corredor de chegada do 1º capítulo + capítulo inicial = 1º inscrito |
| `copy-lock.json` | regenerado |

## Decisão ProofJourney: opção 2 (desacoplar)

A jornada tem **um** palco sticky (`.pj-stage`) e os capítulos são camadas **absolutas**. Este
modelo exige o contrário: altura real de documento (quatro etapas de ≥70vh com vãos grandes)
para o texto poder subir. Camada absoluta não tem altura de documento — não há percurso — e um
segundo palco sticky dentro do palco é exatamente o que a issue proíbe. Então a seção é **irmã**
da jornada, montada logo antes; a jornada segue com Números + Parceiros.

**Regressão prevista e corrigida junto:** sem Soluções, o primeiro capítulo passou a ser
Números, e ela entra inteira por `--impact-entrada` — que é a fração de *chegada*. O código dava
corredor zero ao primeiro capítulo (nunca aparecia, porque Soluções não usa `chegada`), o que
faria Números chegar pronta no primeiro quadro. Duas correções: `chegadaDe` do primeiro =
`topo − SOBREPOSICAO·vh`, e capítulo inicial = primeiro **inscrito** (não `ORDEM[0]`, que agora
aponta para um capítulo não montado e engoliria o `aoAlternar` de Números).

## Dois desvios, declarados

1. **Superfície navy, não a folha clara do doc (§6).** A seção mantém `--fundo-solucoes` e as
   **mesmas duas emendas** de `.solutions-scroll`: branco 220px no topo (pela `BrandGrid` clara)
   e `#003f73` 260px na base (cor com que "Sistran em números" abre). Repintar de claro moveria
   o degrau para dois seams já medidos por SIS-176/SIS-187 — trocaria pedido de estilo por
   defeito espacial. O que o doc governa é o mecanismo, e esse está seguido à risca.
2. **Copy: frase = `description`, título = eyebrow da etapa.** O título 01 tem 55 caracteres e
   não cabe nos `14–18ch` que o doc pede para a frase; cortá-lo seria escrever copy novo.
   `Diferenciais` continua rótulo da lista.

## Portões

| Portão | Resultado |
|---|---|
| `npx tsc --noEmit` | limpo |
| `npm run lint` | 24 problems / 0 errors (linha de base) |
| `npx next build` | exit 0 |
| `npm run test:copy` | OK — 1193 textos distintos |

O lock ganhou três entradas, **todas duplicata deliberada**: `copy-lock.mjs` varre todo o `src/`
e `Solutions.tsx` continua no repositório com a mesma copy verbatim, então `Diferenciais` (6→7),
`Soluções de Negócios` (1→2) e o eyebrow (1→2) contam duas vezes. Nada de texto novo.

**Ressalva de árvore compartilhada (de novo):** a regeneração também removeu
`src/components/BrandGrid.tsx:1 → "as CSSProperties"` (13x → 12x). Não vem destas alterações;
é entrada obsoleta em relação a uma edição não comitada de outro agente em `BrandGrid.tsx`.
Absorvida em vez de escondida.

---

# SIS-190 — moldura do quadro do vídeo do hero

Traço ciano em volta do quadro do vídeo, a partir de 1024px, para o olho ler onde o vídeo
começa e termina. Referência travada: `public/referenciavideo.png`.

| Arquivo | O quê |
|---|---|
| `src/app/globals.css` | base `.hero-frame { display: none }`; no bloco ≥1024, `.hero-frame` + `::before` (anel) + `::after` (brilho) + fallback `@supports not`; `overflow: hidden` em `.hero-media` |
| `src/components/HeroCinematic.tsx` | `molduraRaio` (20→30px em 0,62–0,96 do percurso) e o `<motion.span className="hero-frame … z-[2]">`, irmão de `.hero-media` |
| `scripts/medir-referencia-moldura-hero.mjs` | novo — mede cor, peso, raio e em que lados há traço na PNG de referência |
| `scripts/medir-moldura-hero.mjs` | novo — confere no navegador em `t≈0 / 0,7 / 1`, a 1440 e 390, e nos dois modos de movimento reduzido |

**Caminho C**, escrito na issue e no CSS: o traço é elemento próprio carregando uma **cópia**
da máscara de `.hero-media`. Não B, porque `border-left: 0` deixa a aresta seca que a SIS-178
proíbe — na referência não há traço à esquerda porque ele *dissolve*. Não A, porque wrapper sem
máscara desenha traço vertical sobre a folha branca onde o vídeo já não existe.

Números medidos (referência): traço `#00defe`, núcleo 2px, arco de 19–20px, matiz azul→ciano
ao longo do topo, nenhum pico à esquerda. Daí o anel usar os tokens da casa `#0079CB → #0ed8f6`
e o raio partir de 20px. **<1024 = sem moldura**, decisão registrada: a referência é desktop e
ali o vídeo é sangria inteira.

Medição no navegador (1440×900): traço à direita 218 / 218 / 174 de ciano em `t = 0 / 0,7 / 1`;
raios iguais entre moldura e mídia nos três instantes; lado que dissolve ≤15 de ciano em 40px
varridos — sem aresta seca e sem retângulo branco. A 390: `display: none`. Nos dois modos de
movimento reduzido a moldura continua visível (218), porque é referência de leitura, não efeito.

**Desvio declarado:** a referência recua o quadro ~51px da borda direita; isso não foi adotado,
porque recuar o vídeo mudaria a geometria aprovada da SIS-178 e a issue pede moldura, não recuo.
Consequência tratada: o brilho é `inset`, e não para fora.

**Armadilha de medição, para quem reconferir:** as duas primeiras rodadas mediram a abertura
(`OptionalMorphIntro`) em vez do hero — os pixels vinham do preloader em 84%. O medidor agora
desliga as camadas de abertura pelas chaves que elas próprias consultam (`sistran:intro-visto`,
`sistran-motion-preference-seen`) e espera pela ausência de `html[data-intro]`.

Portões: `tsc` limpo · `lint` 24/0 · `next build` OK · `test:copy` OK (1193 textos, nada mudou).

---

# SIS-197 — presets `data-reveal` (`fade-up` / `fade` / `scale-soft` / `line-up`)

Efeito 4 de `docs/efeitos-scroll-terminal-industries.md`: vocabulário único de entrada para os
blocos da home que hoje entram sem orquestração. Construído **sobre a fundação da SIS-193**
(entregue e conferida) — nenhuma biblioteca nova, nenhum `framer-motion`, nenhum `pin`.

| Arquivo | O quê |
|---|---|
| `src/app/globals.css` | token `--motion-stagger-reveal: 80ms`; bloco "Efeito 4" com os quatro presets; dois comentários-ponteiro nas duas chaves de movimento reduzido |
| `src/components/SolutionsStory.tsx` | `useRevealTrigger` no `<header>`; eyebrow `fade-up`, `<h2>` `fade-up`, rótulo `fade` + régua `line-up` |
| `src/components/legacy/ImpactSequence.tsx` | `useRevealTrigger` no `.sequence-sticky`; kicker, `<h2 id="impacto-title">` e `.lp-lead` em `fade-up` |
| `docs/medidas/sis197/sonda-presets.mjs` + `medidas.txt` | novo — mede opacidade/transform de todo `[data-reveal]` antes e depois do percurso, nos três modos, e procura ancestral transformado acima de cada `sticky` |

## Onde entrou, e por que só aqui

A home foi enumerada seção por seção. Quase tudo já é conduzido, e a issue proíbe invadir:

| Bloco | Decisão |
|---|---|
| Hero (`HeroCinematic`) | **fora** — scrub de vídeo, SIS-189 |
| `BrandGrid` | **fora** — SIS-195 (logos) e SIS-194 (título); e ela tem de seguir irmã direta do hero por causa de `#top + *` |
| `SolutionsStory` — cabeçalho | **entrou** (o único bloco estático da seção: aparecia pronto enquanto todo o resto abaixo é dirigido) |
| `SolutionsStory` — corpo, `ProofJourney`, `Metrics` | **fora** — sticky/jornada |
| `ImpactSequence` — legenda | **entrou** (a legenda só sabia *sair*: `copyFade` a apaga no `SHRINK` e nada nunca a trouxe) |
| `Contact` | **fora** — tem percurso próprio (`--ct-surgir`) |
| `Social`, `CartaoDuasFaces` | **fora** — já revelam pelas variantes da casa (`vTitle`/`whileInView`); não há lacuna a uniformizar |
| `Footer` | **fora** — compartilhado por todas as rotas, e esta issue é da home |

## Dois desvios declarados

1. **`line-up` desenha da esquerda, não sobe.** O nome do doc diz "up", mas o alvo é uma régua de
   1–2px: um percurso vertical de 24px é maior que a própria linha. O gesto legível é `scaleX(0) → 1`
   com `transform-origin: left`.
2. **A cadência de 80ms sai do token, não de `data-stagger`.** CSS não lê o valor numérico de um
   atributo; um `data-stagger="120"` não listado perderia a cascata em silêncio. Usada a cláusula
   "ou a API equivalente da primitiva" da própria issue: `--reveal-i` (índice inline) × token.

## Movimento reduzido — nenhuma regra nova foi necessária

As duas chaves já traziam, da SIS-193, uma linha genérica `[data-reveal]` com
`opacity: 1 !important; transform: none !important` — `@media (prefers-reduced-motion: reduce)` e
`html[data-motion="reduce"]`. Elas vencem os presets por `!important`, independentemente da ordem.
Só foram anotadas como gêmeas, para ninguém remover uma sem a outra.

Medido (`docs/medidas/sis197/medidas.txt`, 1440×900, `next dev`):

- **sem reduce, ao entrar:** opacidades `0,008 / 0,037 / 0,121 / 0,386` nos quatro nós do cabeçalho —
  a escada de 80ms aparece na medida; `translateY` residual de ~23px nos `fade-up`.
- **depois do percurso:** os 7 nós em `opacity: 1`, `transform: none`, escopo `data-in="true"`.
- **`prefers-reduced-motion: reduce`** e **`html[data-motion="reduce"]`**: os 7 nós já em
  `opacity: 1 / transform: none` no primeiro quadro, com o escopo ainda em `data-in="false"`.
- **`sticky`:** `.sequence-sticky`, a coluna de mídia da `SolutionsStory`, `.pj-stage` e `.ct-inner`
  medidos nos três modos — **nenhum ancestral com `transform`, `filter` ou `perspective`**. Os
  presets marcam só descendentes de contêiner preso, o que é inerte.

## Fronteira com a SIS-194

A SIS-194 cobriu **um** título por `RevealText` (`marcas-grade-titulo`, na `BrandGrid`). Os dois
`<h2>` marcados aqui não estavam no lote e não têm `RevealText`. Se a SIS-194 voltar para eles, o
`data-reveal` sai — os dois no mesmo nó seriam duas entradas disputando o mesmo elemento. Está
escrito nos dois arquivos, junto da marca.

## Relação com a SIS-71 (sem reabrir a auditoria)

A SIS-71 é a auditoria genérica de movimento. Esta issue não a reabre: entrega **vocabulário**, não
varredura. O que ela deixa para a SIS-71 é o inventário acima — a home passa a ter um nome para
"entrada de bloco de apoio", e qualquer bloco novo que precise entrar usa `data-reveal` em vez de
inventar o quinto mecanismo. Também fica registrado que `ui/SectionReveal.tsx` continua com **zero
montagens** e é o outro consumidor histórico do seletor `[data-reveal]`: por isso os presets são
**valores** do atributo, e não o atributo seco — não há colisão hoje, e não haverá se ele voltar.

## Portões

| Portão | Resultado |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | 22 problems / **0 errors** (linha de base) |
| `npx next build` | exit 0 |
| `npm run test:copy` | OK — 1189 textos distintos, nada mudou |

Uma correção de lint durante o trabalho: `ref={legenda.ref}` no JSX era lido pelo
`react-hooks/refs` como acesso a ref durante o render (1 erro). Passou a
`const { ref: legendaRef } = useRevealTrigger()`. O motivo está no comentário, na linha.

**Ressalva de árvore compartilhada:** durante os portões o `lint` acusou por um momento 23/1 erro em
`src/components/ui/PillarsCarousel.tsx:29` (`react-hooks/static-components`) — edição não comitada de
outro agente, em arquivo que esta issue não toca; desapareceu na rodada seguinte. A contagem final
de 22/0 é a da linha de base. `SolutionsStory.tsx` também estava sendo editado em paralelo (observador
de etapa ativa); as três marcas desta issue foram aplicadas **sobre** o estado em disco, sem reverter
nada daquele trabalho.
