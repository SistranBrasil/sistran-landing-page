## SIS-24 — Card do LinkedIn: aplicar o efeito de revelação em hover das duas faces

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-24/card-do-linkedin-aplicar-o-efeito-de-revelacao-em-hover-das-duas-faces

### Pedido
Aplicar ao card do LinkedIn o efeito de duas faces da referência: `face1` (ícone colorido) visível no repouso, deslocada para baixo cobrindo `face2` (painel branco com título e descrição); no hover, `face1` sobe à posição neutra e `face2` desliza para cima. Paleta da referência (`#333` → `#ff0057`) não entra: azul da marca no repouso e realce ciano no hover; tipografia, ícone e tokens de sombra/raio do projeto. Só `transform` e `opacity`. O card é um link: conteúdo essencial acessível a leitor de tela e link operável no repouso; o efeito dispara também em `:focus-visible`; sem efeito em toque (`@media (hover: hover) and (pointer: fine)`); em `prefers-reduced-motion` as duas faces ficam legíveis sem movimento; nada cortado nem overflow horizontal. Não alterar texto, link, “Sistran em números”, modal de contato nem seções vizinhas. Validar repouso, hover, teclado, toque, reduced-motion, lint e tipos.

### O que foi feito
Movido para In Review — commit `0a906d3` (`src/app/globals.css`, `src/components/Social.tsx`).

**Onde entrou.** A seção `#SomosSistraners` só tinha copy e botão — não havia card no código. O card foi construído ali, como o link para o LinkedIn, à direita do texto num grid de duas colunas em `lg` (embaixo em telas menores).

**Paleta traduzida.** `#333` → `#ff0057` da referência não entrou. Repouso no azul institucional (`#004D8A` → `#0079CB`), realce no hover em ciano (`#0079CB` → `#0ed8f6`) com o glow ciano da marca (`0 0 60px -18px #0ed8f655`). Verso em branco com navy `#0a1f44` / `#3C5A7A`. Easing `cubic-bezier(0.22, 1, 0.36, 1)`, 620ms.

**Geometria.** Duas linhas de mesma altura; no repouso a frente desce meia linha (`translateY(6.5rem)`) e o verso sobe meia linha. As duas faces ocupam exatamente a mesma faixa central e a frente cobre o verso pelo `z-index` — o card lê como peça única. No hover cada face volta para a sua linha e o card se abre em duas metades. Os deslocamentos são para dentro da caixa, então não há overflow para clipar e nada aparece cortado.

**Restrições atendidas**
- Gesto em CSS, não em Motion: hover e `:focus-visible` são estados do próprio elemento. Só `transform`, `background` e `box-shadow` — nada de layout.
- Dispara também em `:focus-visible`, com o `outline` desenhado nas faces e não na caixa do grid.
- Sem gesto em toque: `@media not all and (hover: hover) and (pointer: fine)` deixa o card aberto.
- Movimento reduzido (`html[data-motion="reduce"]` e `prefers-reduced-motion`): card nasce aberto e imóvel. Sem forçar esse estado final, o reset global mataria a transição e o verso ficaria escondido.
- Destino claro no repouso (“LinkedIn da Sistran”), link operável sem hover.
- Nome acessível vem do conteúdo, sem `aria-label`. Só o ícone é `aria-hidden`.

Texto e link existentes, seção “Sistran em números”, modal de contato e vizinhas: inalterados.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Social.tsx` sem apontamentos; o chunk servido pelo dev server confirma as 17 regras compiladas, inclusive a media query negada de toque.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`

---

## SIS-23 — Siga a Sistran no LinkedIn: fundo dinâmico e componentes reativos ao mouse

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-23/siga-a-sistran-no-linkedin-fundo-dinamico-e-componentes-reativos-ao

### Pedido
Na seção `#SomosSistraners` / “Siga a Sistran no LinkedIn”, o fundo era degradê azul estático com marca-d’água `#SOMOSSISTRANERS` parada. Pedido: fundo dinâmico (luzes que derivam, malha técnica, grafismo da paleta, sem HUD/neon) e componentes reativos ao mouse (marca-d’água, eyebrow, título, parágrafo e botão) com deslocamento em camadas e brilho no cursor, amplitudes contidas. Reação é enriquecimento, não requisito de acesso. Sem reação em toque (`@media (hover: hover) and (pointer: fine)`); respeitar `prefers-reduced-motion`. Posição do ponteiro via CSS custom properties escritas por ref + `requestAnimationFrame`, sem `setState` por evento; cleanup do listener. Animar só `transform`, `opacity` e `filter` leve; sem Canvas/WebGL. Não alterar textos, link do LinkedIn, “Sistran em números”, modal nem vizinhas; sem overflow horizontal.

### O que foi feito
Movido para In Review — commit `c2c9c49` (`src/app/globals.css`, `src/components/Social.tsx`).

**Fundo dinâmico.** Duas camadas de luz novas (`.social-luz-a` / `.social-luz-b`) por gradiente radial — sem `filter: blur()`, o borrão sai do próprio gradiente, então não há custo de filtro numa camada de 68vw. Elas se movem em sentidos opostos e com tempos diferentes. Os dois orbs mantêm a deriva contínua própria (`drift`).

**Reação ao ponteiro, em camadas.** Amplitude decrescente do fundo para o texto: luzes (26vw / 16vw) → orbs (70px / 58px) → marca-d’água (22px) → card (16px) → bloco de copy (10px / 6px).

**Como está implementado**
- `--sx`/`--sy` (0..1) publicadas na própria seção, escritas por `ref` num único `requestAnimationFrame` coalescido — nunca `setState` por evento. Cleanup remove os dois listeners e cancela o quadro pendente.
- `pointerleave` devolve as variáveis ao centro.
- O acompanhamento é `transition` no CSS; o rAF publica o alvo e o CSS suaviza.
- `translate` (a propriedade), não `transform`: os orbs já carregam a animação `drift` e os blocos de conteúdo recebem `transform` inline do Motion na entrada. O `-50%` da marca-d’água saiu do `-translate-y-1/2` do Tailwind e virou parte do `translate`.
- Só `translate` e `transform` são animados. Sem Canvas/WebGL, sem blur pesado.

**Preferências.** Em toque (`(hover: hover) and (pointer: fine)` verificado antes de registrar) e em movimento reduzido o listener nem é criado; o estado neutro também está declarado em CSS (`html[data-motion="reduce"]` e `prefers-reduced-motion`). Todo o conteúdo permanece legível e o link clicável sem mover o cursor.

**De passagem:** o violeta saiu da seção — `rgba(124,58,237,0.30)` no fundo e `orb-violet` no segundo orb não são da marca, viraram azul institucional e ciano.

Textos, link do LinkedIn, “Sistran em números”, modal de contato e vizinhas: inalterados.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint` sem apontamentos, chunk servido confirma as regras compiladas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`

---

## SIS-22 — Sistran em números: aumentar o dinamismo e aproximar da referência

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-22/sistran-em-numeros-aumentar-o-dinamismo-e-aproximar-da-referencia

### Pedido
A seção “Escala que transforma o mercado de seguros.” estava funcionalmente correta após SIS-16, mas visualmente distante da referência: curva como fio simples, nodes pequenos, indicadores laterais quase desaparecendo, lente como anel discreto. Pedido de riqueza visual: nodes como cluster (esfera + satélites), curva ativa com glow ciano/azul e inativa cinza fina, lente com anéis concêntricos, arco de progresso e ticks, indicadores laterais legíveis, régua de ticks na base, movimento sutil de permanência (respiração/deriva). Não alterar a lógica do contador nem os números (SIS-16); `geometria.ts` só se necessário e sem medição de DOM por quadro; não reduzir mais indicadores laterais, não aumentar largura do track, não esconder cortados, sem margens negativas, sem Canvas/WebGL, um único ScrollTrigger. `prefers-reduced-motion`: sem respiração/deriva, números legíveis.

### O que foi feito
Implementado no commit `d4d8e12` (sem PR, como combinado). Arquivos: `src/app/globals.css` e `src/components/Metrics.tsx`.

- **Nodes viraram aglomerados.** `.impact-no` deixou de ser um ponto: agora é a esfera principal (o próprio elemento), um anel de órbita no `::before` e satélites no `::after` — os satélites são as `box-shadow` do pseudo (quatro pontos ao custo de um único nó de layout). A densidade cai com um novo `data-dist` (distância em etapas até o indicador da vez, saturada em 3): perto o aglomerado é completo, longe sobra só a esfera, mais apagada. O atributo vem do render, não do ScrollTrigger — só muda quando a etapa muda.
- **Curva percorrida vs. futura.** A base ficou fina e quase cinza (`rgba(196,216,238,0.16)`, 1.2px); o trecho aceso engrossou para 3px e ganhou dois halos (`drop-shadow` curto para definir a borda + longo para espalhar a luz). Continua um `filter` numa camada só, um path só.
- **Lente.** Terceiro anel contínuo para profundidade, e arco de progresso feito de dois círculos (calha apagada + vivo recortado por `stroke-dashoffset`). O recorte é `calc(578.053 * (1 - var(--impact-etapa) / 6))` — 578.053 é o perímetro de r=92 na caixa 200×200 do `viewBox`. Nenhum ScrollTrigger novo: consome a mesma variável que o trigger único da seção já escrevia.
- **Régua de base.** `repeating-linear-gradient` (um elemento, nenhum nó por traço) com a versão acesa por cima, recortada por `clip-path` em `--impact-p`. Fica no rodapé da cena, com máscara nas pontas.
- **Legibilidade lateral.** Vizinhos de `0.42` para `0.52`, ordinal menor e mais marcado, e sombra separando número e rótulo dos anéis. No número a sombra é `filter: drop-shadow` e não `text-shadow`: o valor é gradiente recortado no texto (`background-clip: text`) e a sombra ficaria atrás do recorte. Nada encolheu, a trilha não ficou mais larga e nenhum indicador cortado foi escondido.
- **Movimento de permanência.** Respiro do anel de órbita e órbita lenta dos satélites, só em `.impact-sticky[data-visivel="1"]` e só em `transform`/`opacity`.

**Restrições respeitadas.** `ImpactNumero` e a lógica do contador não foram tocados (SIS-16). `geometria.ts` não foi alterado. Sem margens negativas novas, sem deslocamento independente por etapa, sem Canvas/WebGL, um único ScrollTrigger. `.impact-regua` entrou nas duas listas de reset de movimento reduzido (`@media` e `html[data-motion="reduce"]`).

**Verificação.** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d` vendorizado) e `npx eslint src/components/Metrics.tsx` limpos. CSS conferido no chunk compilado servido pelo dev server: as regras novas (`.impact-arco-vivo`, `.impact-regua-viva`, `--no-sats`, `@keyframes impact-orbita`) aparecem com os `calc()` preservados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Metrics.tsx`

---

## SIS-21 — Comentar a seção Entrega com Alta Performance e Comprometimento na home

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-21/comentar-a-secao-entrega-com-alta-performance-e-comprometimento-na

### Pedido
Comentar (não apagar) a seção de cards “Entrega com Alta Performance e Comprometimento” na home — cabeçalho, navegação, painel e dados (`conhecimento-seguros` e os quatro temas: Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência). Comentar o consumo, não remover componente/dados do repositório; deixar comentário explicando por que saiu e como reativar, no estilo do bloco “Sobre nós / A Sistran” em `src/app/page.tsx`. Conferir efeitos colaterais: separadores/chanfros, seletores de irmãos no `globals.css`, alternância de fundo, `ScrollSpy` e âncoras. Sem seção órfã, espaço em branco duplicado nem duas faixas da mesma cor emendadas. Não alterar “Sistran em números”, modal de contato nem vizinhas além do necessário para fechar a emenda.

### O que foi feito
Movido para In Review — commit `9f36664`.

- `src/app/page.tsx`: o bloco `<div className="section-light"><SectionReveal><Differentials /></SectionReveal></div>` virou comentário JSX, com nota explicando o que saiu (título, a linha “Empresas que aderem a tecnologia…” e os quatro cards numerados) e como religar. Estilo copiado do comentário de “Sobre nós / A Sistran” já existente no arquivo.
- O `import Differentials` também foi comentado: ativo, quebraria o lint por import não utilizado; apagado, apagaria a pista de como reativar.
- `src/components/ui/ScrollSpy.tsx`: a entrada `{ id: 'diferenciais', label: 'Diferenciais' }` saiu, pela mesma razão documentada ali para `quem-somos` — sem a seção, o indicador apontava para âncora inexistente. Nada mais no projeto linka `#diferenciais` (verificado por grep).

**Efeitos colaterais verificados**
- Componente e dados preservados: `src/components/Differentials.tsx` e `src/data/differentials.ts` intactos.
- Emenda de fundos: antes era `ImpactSequence` (escuro) → faixa `.section-light` → `Metrics`. Sem o bloco, é `ImpactSequence` (escuro) → `Metrics`, que já desenha a própria faixa clara no topo. Nenhuma faixa da mesma cor emendada, nenhum espaço em branco duplicado, nenhuma seção órfã.
- `ScrollSpy` é exclusivo da home (grep), então a remoção não afeta outras páginas.
- Nenhum seletor de irmãos no `globals.css` dependia do bloco.

Seção “Sistran em números”, modal de contato e demais vizinhas: inalteradas.

**Verificação:** `npx tsc --noEmit` limpo e `npx eslint` sem apontamentos nos dois arquivos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-19 — Soluções de Negócios: reconstruir como teatro de soluções guiado por scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-19/solucoes-de-negocios-reconstruir-como-teatro-de-solucoes-guiado-por

### Pedido
Substituir o grid da seção “Soluções de Negócios” por uma cena única guiada por scroll (teatro): navegação editorial à esquerda (label `DIFERENCIAIS`), janela fotográfica à direita em branco (placeholder; `object-fit: cover; object-position: center` em `.solution-image`), fluxo tecnológico sobre a janela, painel translúcido na base, conector luminoso, progresso `01 / 04` a `04 / 04`, identidade azul/branco/ciano. Não voltar ao grid de quatro cards. Dados (títulos e descrições) não alterar. Sticky: `.solutions-scroll` `min-height: 400vh`, `.solutions-sticky` `100svh`. Um único ScrollTrigger; intervalos 0.00–0.25 / 0.25–0.50 / 0.50–0.75 / 0.75–1.00. Em movimento reduzido: sem pin de 400vh, quatro soluções em fluxo natural. Desktop >1024px sticky; tablet grid ~32/68; mobile fluxo natural sem pin/conector. Acessibilidade: `aria-labelledby`, `aria-current="step"`, teclado. Não alterar “Sistran em números” nem o modal de contato.

### O que foi feito
Implementado no commit `d446211`.

**Arquivos alterados**
- `src/components/Solutions.tsx` — reescrito por completo (o baralho de cards brancos saiu).
- `src/app/globals.css` — bloco novo no fim do arquivo, ~690 linhas, com o palco, o fluxo natural e as duas saídas de movimento reduzido.
- `src/app/page.tsx` — `<Solutions />` saiu do `SectionReveal`.

**Estrutura criada.** `section.solutions-scroll[data-dirigindo]` → `.solutions-fundo` (grade, brilho, linhas) + `.solutions-sticky` → `.solutions-caixa` → `.solutions-cabecalho` + `.solutions-layout` (`.solutions-nav` | `.solution-teatro`) + `.solutions-lateral`; irmã do sticky, a `.solutions-trilha` com quatro `.solutions-passo`. Cada solução é uma `.solution-cena` com `.solution-viewport` (janela + overlay) e `.solution-info`.

**Como o scroll controla as etapas.** Um único `ScrollTrigger` na seção (`start: top top`, `end: bottom bottom`). Publica por `ref` duas custom properties em `.solutions-sticky` — `--sol-p` (progresso da seção) e `--sol-passo-p` (progresso dentro da etapa da vez) — e chama `setAtivo` só quando o índice muda de fato. O índice vem de `Math.floor(Math.min(progress, 0.999999) * 4)`. Não há `pin: true`: quem congela é `position: sticky` e a altura vem da trilha, com `margin-top: -100svh` devolvendo a tela consumida — a seção fica com exatamente 400vh. Clique na navegação rola até a fatia correspondente, sem criar estado paralelo.

**Conector.** SVG de 120×40 à esquerda do teatro, com calha estática, linha viva ciano, pulso e nó de destino. Segue o item ativo por `top: calc(50% - 20px + (var(--sol-ativo) - 1.5) * 63px)`. O pulso só corre com `[data-visivel="1"]`.

**Overlays.** Quatro variantes em `CenaOverlay`: esteira de entrega (seis nós em degraus), processo de negócio (seis etapas em arco com guias), módulos de serviço (linha mestra + quatro blocos) e rede de pessoas (constelação em volta de um nó central). Linhas de 1–1.5px, nós circulares, brilho apenas no nó ativo. Todos `aria-hidden`.

**Janelas em branco.** `.solution-image` já está com o enquadramento final (`width/height: 100%`, `object-fit: cover`, `object-position: center`) e um fundo navy neutro. As fotos entram na SIS-20.

**Responsivo.** ≥1280px: colunas 0.36 / 0.64, janela 16/8.7, painel transbordando. 1024–1279px: 0.32 / 0.68 e caixa mais estreita. <1024px ou movimento reduzido: `data-dirigindo` não é aplicado, a trilha some, as cenas viram blocos empilhados com janela 4/3 e painel abaixo dela, e a caixa cai para 20px de margem em telas ≤400px. Sem overflow horizontal.

**Movimento reduzido.** O `useReducedMotion` já desliga o palco (a árvore é a mesma nos dois casos — nenhum `return` antecipado, nenhum mismatch de hidratação). As duas saídas (`html[data-motion="reduce"]` e `@media (prefers-reduced-motion: reduce)`) forçam `animation: none`, `opacity: 1`, `clip-path: none` e `transform: none` nas camadas animadas.

**Comandos**
- `npx tsc --noEmit` (filtrando `sistran-river-park-3d`): sem erros.
- `npx eslint src/components/Solutions.tsx src/app/page.tsx`: sem avisos.
- Chunk CSS servido pelo dev server (`__0gsb2sy._.css`): 27 ocorrências de `solutions-scroll`, `--sol-passo-p` e `solution-conector-pulso` presentes; HTML servido traz as quatro cenas, os quatro passos da trilha e os quatro itens de navegação.

Sem PR, como combinado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-18 — Contato: tratar o fundo por trás do reveal do modal "Fale com a gente"

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-18/contato-tratar-o-fundo-por-tras-do-reveal-do-modal-fale-com-a-gente

### Pedido
Deixar mais bonito o fundo contra o qual o painel de contato surge no scroll (reveal do SIS-5). Enquanto o cartão da foto entra, a área em volta era cinza-azulado liso com o chip `CONTATO` solto à esquerda e metade esquerda vazia. Escopo só do plano de fundo: painel, cartão e modal continuam como estão. Usar grafismo técnico / régua da marca / degradê da paleta já usados na home — sem hex novo e sem asset novo. Ocupar a metade esquerda sem disputar com o cartão. Não alterar o modal nem o comportamento do reveal. Movimento aqui é decoração e deve parar em estado visível. Aceite: profundidade em toda a extensão do reveal, contraste do chip `CONTATO` preservado, sem custo de rolagem perceptível (nada de `blur` grande animado nem repaint por frame).

### O que foi feito
Feito no commit `a4ca260` — só `src/app/globals.css`.

**Abordagem.** Nada de elemento novo, nada de asset e nenhuma linha de `Contact.tsx`: tudo em três regras no bloco `.ct-*`, penduradas no próprio `.ct-inner` — a caixa de `100svh` que fica presa na tela durante todo o percurso. Como o componente não foi tocado, o gatilho, a ordem e o tempo do reveal são os mesmos. O grafismo é estático de propósito: não lê `--ct-surgir`, não entra, não escala.

**O que entrou**
- **Atmosfera (no próprio `.ct-inner`)** — duas luzes largas da paleta: fria, `rgba(14, 216, 246, 0.18)` em `10% 40%` (enche a metade esquerda vazia); azul da marca, `rgba(0, 121, 203, 0.16)` em `66% 60%` (chão sob o ponto onde o cartão pousa). Ficou na regra do elemento e não num pseudo porque os pseudos levam máscara, e `mask-image` vale para o background inteiro.
- **Malha técnica (`::before`)** — grade de 6rem em `rgba(0, 121, 203, 0.1)`, a mesma linguagem de `.grade-tecnica` e do próprio `.section-light`, com máscara elíptica ancorada em `22%` da largura: nasce à esquerda e morre antes do cartão.
- **Régua da marca (`::after`)** — trilho de 1px com marcas curtas a cada `1.5rem` e longas a cada `6rem`, as três camadas saindo do mesmo `x`.

**O chip `CONTATO`.** O chip é o `ScrollSpy` — `fixed left-3 top-1/2`, só a partir de 1440px. A máscara da régua abre um vão entre 40% e 60% da altura: a régua vira dois segmentos que emolduram o chip. O painel continua em `z-index: 1`.

**Ordem de pintura.** Os pseudos são `z-index: 0`, e não `-1`, porque o véu do reveal também é `0`. Com valores iguais a ordem é a do DOM: `::before` fica sob o véu; `::after` fica sobre o véu.

**Custo de rolagem.** Zero. Nenhuma das três regras muda por frame, nenhum `filter: blur()`, nenhum RAF. O `ScrollTrigger` continua escrevendo só `--ct-surgir` e `--ct-p`.

**Movimento reduzido.** Nada aqui se move. Os três seletores exigem `[data-modo="scroll"]`, que o componente só liga com `min-width: 1024px` e sem preferência por menos movimento.

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. CSS servido pelo dev server contém as três regras compiladas (`.ct-inner`, `.ct-inner:before`, `.ct-inner:after`). `curl http://localhost:3000/` → 200. Sem hex novo (só `#0079cb` e `#0ed8f6`) e sem asset novo. Não foram tocados: `Contact.tsx`, `ContactPanel`, o modal, o véu, o painel e o cartão. Falta a conferência visual da composição com rolagem lenta e rápida em 1440px e 1920px — o executor registrou que não conseguiu fazer captura de tela.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-17 — Contato: endereço da sede ilegível dentro do cartão "SEDE · SÃO PAULO"

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-17/contato-endereco-da-sede-ilegivel-dentro-do-cartao-sede-sao-paulo

### Pedido
No cartão “SEDE · SÃO PAULO” da seção de contato, a linha do endereço (R. Dr. Geraldo Campos Moreira, 240 - 2º andar | Cidade Monções | São Paulo - SP | CEP 04571-020) estava praticamente invisível. O rótulo ciano lia; o endereço, navy sobre foto escura/movimentada, não. Mesma classe de defeito do SIS-9, em outro elemento. Escopo: dar contraste ao endereço sobre o cartão translúcido em cima da fotografia; mínimo 4.5:1, sem depender da região da foto; nenhum hex novo fora da paleta. Não alterar o modal de contato nem as demais seções. Aceite: endereço legível em toda a extensão do reveal (trechos claros e escuros da foto) e nas larguras em que o cartão encolhe.

### O que foi feito
Corrigido no commit `0e39884` (`src/app/globals.css`).

**Causa.** Não era navy sobre navy como no SIS-9 — eram três atenuações somadas no mesmo texto: (1) `.contact-dialog-endereco-texto { color: rgba(247, 251, 255, 0.86) }` — branco a 86%; (2) `font-size: 0.7rem` (0.66rem abaixo de 60rem); (3) `.contact-dialog-endereco { background: rgba(3, 24, 47, 0.62) }` — cartão navy a 62% sobre a fachada iluminada. O terceiro item é o principal: o cartão tem `backdrop-filter: blur(10px)`, que desfoca a foto mas não escurece o que passa por baixo. Havia ainda `.section-light .contact-inline .contact-dialog-endereco-texto` repetindo o branco a 86%, então corrigir só a regra base não teria efeito na seção inline da home.

**Correção**
- cartão: `rgba(3, 24, 47, 0.62)` → **`0.92`**. Mesmo navy de `--contact-bg` (`#03182f`), só mais denso.
- texto: `var(--contact-text)` cheio em vez de branco a 86%; `0.78rem` / `line-height: 1.55` (e `0.72rem` em tela estreita, era `0.66rem`).
- removido o override de `.section-light`: a exceção genérica logo acima (`span:not([class*="eyebrow"])`) já devolve `--contact-text`.

**Contraste.** Pior caso: foto branca pura por baixo. Composição = `0.92 × (3, 24, 47) + 0.08 × 255` = `(23, 42, 63)`. Contra `#f7fbff` isso dá **≈ 13:1** — acima de 4.5:1. O rótulo ciano `#14c8f5` sobre o mesmo fundo fica em ≈ 7:1.

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. `curl http://localhost:3000/` → 200. Nenhum hex novo. Não foram tocados: modal de contato, `ContactPanel`, demais seções.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-16 — Sistran em números: corrigir composição (gap único, lente central mascarada, isolamento da seção anterior)

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-16/sistran-em-numeros-corrigir-composicao-gap-unico-lente-central

### Pedido
Continuação do SIS-12: layout, posicionamento, curva, isolamento e proporções — a lógica do contador não deve ser alterada. Problemas: indicadores laterais cortados, espaçamento excessivo, curva atravessando número e lente, lente pequena/alta, vazamento de `DIFERENCIAIS` e barra azul da seção anterior, linha vertical ciano à direita, referências de posicionamento divergentes. Correções pedidas: `calculateStepGap` com `Math.min(360, Math.max(280, viewportWidth * 0.22))` (~338px em 1536px); path e nodes na mesma referência (`pathCenterY = stageHeight * 0.55`); lente fixa fora do track (`left: 50%; top: 55%`, `clamp(380px, 30vw, 460px)`); máscara circular para a curva não atravessar o número; grid vertical `clamp(170px, 24svh, 220px) minmax(0, 1fr)`; `railOffsets`; isolamento da seção anterior; remover linha ciano. Validar etapas 02/03 em ~1536×768 e 1920×1080; lint e tipos.

### O que foi feito
Implementado no commit `4d11816`. Contador **não** foi tocado.

**Causa do espaçamento excessivo.** Três referências de posicionamento na mesma cena: o path numa caixa de `700 × 200` unidades esticada com `preserveAspectRatio="none"` + `non-scaling-stroke`; os indicadores em `%` da trilha (`posicaoDoIndicador` → `(i + 0.5) / 7`); a lente em `%` do próprio `<li>`. O espaçamento era `--impact-w / 7`, com `--impact-w: clamp(3500px, 380vw, 5600px)` — **500 a 800px** entre indicadores.

**Valor final do vão.** `vaoEntreEtapas(largura) = Math.min(360, Math.max(280, largura * 0.22))` → **337,92px em 1536px**. Uma unidade só (pixel do palco) alimentando posição do conteúdo, nodes, largura do SVG, deslocamento das duas trilhas e o `d` do path.

**Como a trilha foi centralizada.** Item `i` mora em `left: calc(var(--impact-centro) + i * var(--impact-vao))`, com `--impact-centro = larguraTela / 2`. As duas trilhas andam com o mesmo `translate3d(calc(-1 * var(--impact-etapa) * var(--impact-vao)), 0, 0)`. Em etapa inteira o ativo cai no centro ao pixel. `--impact-etapa` é contínua (scrub). O recuo de meia largura é `transform`, não margem negativa.

**Como a curva foi mascarada.** Desvio deliberado da spec: em vez do disco opaco `#03142d`, o `.impact-caminho` leva um `mask-image: radial-gradient(circle at var(--impact-centro) 55%, transparent R, #000 calc(R + 1px))`, com `R = clamp(380px, 30vw, 460px) / 2 + 21px`. Razão: o palco tem degradê radial próprio, e um disco de cor fixa apareceria como mancha. O node de chegada (12×12, halo ciano) ficou na borda esquerda da lente.

**Como a lente foi reposicionada.** Saiu do `<li>` ativo e virou elemento estacionário irmão, em `left: var(--impact-centro); top: 55%`, `clamp(380px, 30vw, 460px)`, `z-index: 6`. Segundo desvio deliberado: número, rótulo e legenda continuam no `<li>` — duplicá-los dentro da lente faria o leitor de tela ler cada indicador duas vezes e obrigaria a reescrever o contador. Curva e nodes compartilham a linha-base `alturaDoPalco * 0.55`; cada trecho da onda tem os dois pontos de controle do mesmo lado (`vão * 0.34`, amplitude 70). O pulso é resolvido analiticamente (`pontoNaOnda`).

**Proporção vertical.** `grid-template-rows: clamp(170px, 24svh, 220px) minmax(0, 1fr)`. Número `clamp(5.5rem, 7.5vw, 8rem)` / `line-height: .84` / `letter-spacing: -.045em`, sufixo `.45em`, rótulo `290px`, legenda `320px`. Vizinhos alternam por `DESVIOS_TRILHO = [-135, 125, -140, 135, 125, -135, 130]`.

**Vazamento da seção anterior e linha ciano à direita — mesma causa.** Não há pin envolvido: `SectionReveal` usa só `toggleActions` e `Metrics` usa seção alta + interior `sticky`. O que aparecia era a seção `Differentials` por baixo. A “linha vertical ciano à direita” é `.corner-accent::after` (`globals.css:1279`), um traço de `1.5px × 32px` com `linear-gradient(135deg, #0ed8f6, transparent)`. Correção: `.impact-scroll { z-index: 30; isolation: isolate; background: #041a33 }`, `.impact-sticky { z-index: 1; overflow: clip; background: #041a33 }`. Usei `#041a33` em vez do `#f4f8fc`/`#03142d` da issue para não introduzir hex novo. Removido o `overflow: visible` do `.impact-curva`. Header e `ScrollSpy` continuam (chrome do site, não vazamento).

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. `npx eslint src/components/Metrics.tsx src/components/ui/impact/geometria.ts` → limpo. `curl http://localhost:3000/` → 200, com `impact-cena`/`impact-caminho`/`impact-lente`/`impact-chegada` no HTML (uma ocorrência cada).

**Estados 02 e 03** validados aritmeticamente em 1536px (vão 337,92 · centro 768): etapa 02 — `850+` em 430 · `23+` em 768 · `130+` em 1106 · `650+` em 1444; etapa 03 — `850+` em 92 · `23+` em 430 · `130+` em 768 · `650+` em 1106 · `230+` em 1444. Falta conferência visual em 1536×768 e 1920×1080. Não foram tocados: contador (`ImpactNumero`), modal de contato, `Differentials`, `Solutions`, `SectionReveal`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/components/ui/impact/geometria.ts`
- `src/app/globals.css`

---

## SIS-15 — Home: faixa de sinais deve passar as logos de parceiros de /parceiros-e-implementacoes

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-15/home-faixa-de-sinais-deve-passar-as-logos-de-parceiros-de-parceiros-e

### Pedido
A faixa depois dos Resultados (`src/components/legacy/SignalMarquee.tsx`, criada no SIS-13) mostrava os seis sinais do método em texto. No lugar devem passar as logos de parceiros de `/parceiros-e-implementacoes` (`CLIENTS` em `src/data/clients.ts`, via `ClientWall` — 15 parceiros em `/public/images`). Manter pausa em hover/foco, cópia duplicada com `aria-hidden`, medição de repetições para telas largas e, em movimento reduzido, lista rolável nativa. Nomear parceiros para leitor de tela. Não alterar `/parceiros-e-implementacoes`. Decidir o destino de `marquee` em `src/data/legacy.ts`. Aceite: mesmas logos da página de parceiros, altura uniforme; loop sem salto; com movimento reduzido todas as logos alcançáveis.

### O que foi feito
Implementado — commit `feat(home): faixa em loop passa as logos de parceiros`.

- `src/components/legacy/SignalMarquee.tsx` — passa a consumir `CLIENTS` de `src/data/clients.ts`, a mesma fonte de `/parceiros-e-implementacoes`, filtrando quem tem arquivo de logo (`CLIENTS.filter(c => c.logo)`). Hoje isso dá os 15 parceiros.
- Acessibilidade: o nome da marca vai no `alt`; a faixa ganhou `role="region"` + `aria-label="Parceiros e tecnologias"`. A cópia duplicada segue `aria-hidden`.
- `legacy.css` — `.lp-signal` / `.lp-signal::after` / `.lp-signal-logo` dão lugar a `.lp-partner`. Sem placa branca: a faixa é `--paper` e todas as marcas de `clients.ts` são desenhadas para fundo claro (incluindo `st-it-sombra-branca.png`, navy sobre branco).
- Repouso dessaturado (`grayscale(1)`, `opacity .62`), cor cheia no hover — só em `(hover: hover) and (pointer: fine)`.
- Vão entre itens de `0.75rem` → `clamp(2.4rem, 4.5vw, 4rem)`. O `padding-right` acompanha o `gap`, que é o que mantém o `translate3d(-50%)` valendo uma cópia exata.
- `src/data/legacy.ts` — `marquee` e `type Signal` removidos (ninguém mais consumia), com comentário no lugar apontando a nova fonte. Os arquivos `-trim` seguem em `public/imagens/`.

**Movimento reduzido.** A mecânica de `globals.css` está intacta: a viewport vira lista rolável nativa, a trilha congela e a cópia `aria-hidden` sai de cena. Bloco `@media (prefers-reduced-motion: reduce)` devolve as logos em cor cheia.

**O que NÃO foi tocado.** `/parceiros-e-implementacoes`, `ClientWall`, `PartnersGrid` e as keyframes/`.marquee-*` do `globals.css`.

**Verificação.** `npx tsc --noEmit` limpo (fora do diretório 3D vendorizado) e `npx eslint` limpo nos três arquivos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/SignalMarquee.tsx`
- `legacy.css`
- `src/data/legacy.ts`

---

## SIS-14 — Home: remover a seção "Sobre nós / A Sistran" — o texto institucional fica só em /quem-somos

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-14/home-remover-a-secao-sobre-nos-a-sistran-o-texto-institucional-fica-so

### Pedido
O bloco “Sobre nós | A Sistran” deve existir apenas em `/quem-somos`; sai da home. O mesmo texto estava em `src/app/quem-somos/page.tsx:28` (já com `130 clientes`) e em `src/components/About.tsx:177-208` (com `mais de 150 clientes`, número errado frente à fonte e a `src/data/metrics.ts` `130+`). A régua `1988` / `150+` / `18` no `About` da home repetia “Sistran em números”. Escopo: remover `<About />` em `src/app/page.tsx`; repontar `ScrollSpy` (`quem-somos` → `#quem-somos`); não mexer em `/quem-somos`. Aceite: home sem a seção; `/quem-somos` igual; nenhum link/indicador para âncora inexistente; o `150+` sai do projeto junto com o bloco.

### O que foi feito
Implementado — commit `refactor(home): manter "Sobre nos" apenas em /quem-somos`.

- `src/app/page.tsx` — removido o `<About />` (e o `import`) do bloco `.section-light` entre a faixa de sinais e o `ImpactSequence`. O `SectionReveal` e o `<div className="section-light">` que só embalavam essa seção saíram com ela. Comentário no lugar registrando o motivo.
- `src/components/ui/ScrollSpy.tsx` — removida a entrada `{ id: 'quem-somos', label: 'Quem somos' }`. A página continua alcançável pelo menu do header (`src/data/nav.ts`, `/quem-somos`).

**O que NÃO foi tocado.** `src/components/About.tsx` segue intacto — é o mesmo componente que `/quem-somos` monta (`src/app/quem-somos/page.tsx:4`). O `150+` sai da home junto com o bloco. Ele ainda existe dentro do `About.tsx` (portanto em `/quem-somos`) e em `src/data/aSistran.ts` / `src/data/differentials.ts` — correção de número é outra issue, não estava no escopo desta.

**Verificação.** `npx tsc --noEmit` (sem erros fora do diretório 3D vendorizado) e `npx eslint src/app/page.tsx src/components/ui/ScrollSpy.tsx` — ambos limpos. Nenhuma referência pendente a `#quem-somos` na home.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-13 — Home: mover indicadores de Resultados do hero para depois do Método e adicionar faixa de sinais

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-13/home-mover-indicadores-de-resultados-do-hero-para-depois-do-metodo-e

### Pedido
Substitui a colocação do SIS-10: os indicadores de “Resultados” fechavam o percurso do hero, presos na faixa que o card de vídeo desocupava, e o bloco claro disputava atenção com o vídeo. Pedido: levar os indicadores para depois da seção “Método | quatro movimentos”, com o desenho da apresentação de transformação de legado, e adicionar a faixa de logos passando logo abaixo. A description no Linear já documenta a implementação prevista (`MetricsStrip`, `SignalMarquee`, remoção de `HeroResults`), mas isso não substitui um comentário de entrega.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados registra a issue criada já em In Review em 25/08/2026 (19:31 UTC), sem passagem por Backlog nem In Progress no `stateHistory`; `completedAt` permanece vazio.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-12 — Sistran em números: scrollytelling horizontal com curva, data lens e componentes contextuais

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-12/sistran-em-numeros-scrollytelling-horizontal-com-curva-data-lens-e

### Pedido
Refazer a seção de indicadores como scrollytelling horizontal dirigido por rolagem, no código real (não protótipo). Independente do modal de contato (SIS-5/6/7/8/9). Padrão da casa: seção alta + interior `sticky`, nunca `pin: true`; variáveis CSS por ref; default CSS = estado final; espelhar `prefers-reduced-motion` e `html[data-motion="reduce"]`. Corrigir clientes 150 → **130+**; captions são escrita nova (Copy Lock). Sete indicadores com visual contextual SVG. Sem Canvas/WebGL. Validar eslint, tsc (filtrando river-park), `test:copy` (relatar, já vermelho), 7 etapas, reduced-motion, overflow.

### O que foi feito
Implementado no commit `42ee388` (“SIS-12: reconstruir 'Sistran em numeros' como percurso horizontal”).

**Arquivos.** `src/components/Metrics.tsx` reescrito (seção alta + `.impact-sticky`, um ScrollTrigger, contador próprio); `src/components/ui/impact/geometria.ts` novo (curva e posições, matemática pura); `src/components/ui/impact/ImpactVisuais.tsx` novo (7 contextuais em SVG estático); `src/data/metrics.ts` (130 em Clientes, `caption` e `visual` nos 7 itens); `src/data/types.ts` (`Metric` estendido + união `ImpactVisual`); `src/app/globals.css` (família `.impact-*` / `.iv-*` + os dois espelhos de movimento reduzido); `src/app/page.tsx` (seção fora de `SectionReveal` e de `.section-light`); `src/app/quem-somos/page.tsx` (description de SEO: 150 → 130 clientes).

**Progresso.** Um `ScrollTrigger` (`start: 'top top'`, `end: 'bottom bottom'`, `scrub: 1`), seção `min-height: 520vh`, interior `sticky` — nunca `pin: true`. Dele sai uma grandeza, `etapa` (índice contínuo 0…6). Variáveis (`--impact-p`, `--impact-entrada`, `--impact-pos`, `--impact-aceso`, `--impact-pulso-x/y/op`) escritas no nó do palco; o único estado React é o índice ativo. Cleanup: `kill()`, `removeProperty` de cada variável, listener de resize removido.

**Onde me afastei do spec, e por quê**
1. `clip-path: inset()` em vez de `stroke-dasharray` — com `preserveAspectRatio="none"` e `non-scaling-stroke` o comprimento do dash não corresponde ao desenhado.
2. Tabela de 240 amostras em vez de `getPointAtLength()` — zero medição de DOM, resultado idêntico no servidor e no cliente.
3. O `<li>` ativo *é* a lente — não há cópia do número.
4. Contador próprio, não `CountUp` — o `CountUp` dispara por `useInView` e os 7 números estão todos na viewport ao mesmo tempo. O MotionValue nasce no valor final (SSR / sem JS).
5. Trilha em `clamp(3500px, 380vw, 5600px)`, não `clamp(2200px, 230vw, 3400px)`: na largura do spec os vizinhos encostavam na lente.

**Contextuais.** Sete em SVG estático, caixa 200×200: `people-network`, `award-facets`, `client-network` (14 esferas), `capacity-pulse` (24 barras radiais), `erp-layers`, `insurer-network` (anel de 10), `claims-flow`. Movimento só no item ativo e com `[data-visivel="1"]`. Cascata via `--iv-i` no markup. Nada de `setInterval`/RAF.

**Três tamanhos e movimento reduzido.** O CSS nasce no estado final. O scrollytelling pende de `.impact-scroll[data-dirigindo]` dentro de `@media (min-width: 1024px)`, e `data-dirigindo` só aparece quando `matchMedia('(min-width: 1024px)') && !prefersReducedMotion()`. Resets em `@media (prefers-reduced-motion: reduce)` e `html[data-motion="reduce"]`.

**Dados.** `clientes` 150 → **130**. As 7 `caption` são escrita nova, marcadas com comentário `⚠️` em `src/data/metrics.ts`.

**Validação.** `npx tsc --noEmit` (filtrando `src/app/sistran-river-park-3d/`): limpo. `npx eslint` nos 7 arquivos tocados: limpo. `globals.css` processado com PostCSS + Tailwind: sem erro.

**Limitações reais:** (1) não há build de produção verde — `src/app/sistran-river-park-3d/` quebra `npm run build` desde antes; (2) `npm run test:copy` está vermelho por dívida anterior e não foi regenerado; (3) não houve verificação em navegador. PR não aberto, por instrução.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/components/ui/impact/geometria.ts`
- `src/components/ui/impact/ImpactVisuais.tsx`
- `src/data/metrics.ts`
- `src/data/types.ts`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/quem-somos/page.tsx`

---

## SIS-11 — Abertura da home: saída em cortina dividida, como no projeto de apresentação

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-11/abertura-da-home-saida-em-cortina-dividida-como-no-projeto-de

### Pedido
A abertura da apresentação sai como cortina dividida (dois painéis, emenda luminosa). A home já tem `OptionalMorphIntro.tsx`; duas aberturas não podem coexistir. Fica a atual e troca-se só a saída: substituir a dissolução final de 420ms pela cortina. Morph para a marca do header continua, antes da cortina. Duração alinhada à apresentação (`--intro-exit: 820ms`, `cubic-bezier(0.76, 0, 0.24, 1)`). Cortina esperada (`transitionend` + timeout). Só `transform` nos painéis. Reduced-motion: dissolução ≤500ms, sem cortina. Sem JS: overlay nunca pintado. Uma vez por sessão (`sistran:intro-visto`). Overlay sempre sai, inclusive se a aba perder o foco. Nenhuma escrita nova.

### O que foi feito
Implementado no commit `8b30cbb` (“SIS-11: trocar a saida da abertura por cortina dividida”).

**Arquivos:** `src/app/globals.css` (bloco `.mmi-*`) e `src/components/intro/OptionalMorphIntro.tsx`. Só a saída mudou — progresso honesto, `minimoMs`/`maximoMs`, uma vez por sessão (`sistran:intro-visto`) e o morph para a marca do header seguem como estavam; o morph continua acontecendo **antes** da cortina.

**Duração em um só lugar:** o número vive no CSS (`--mmi-saida: 820ms`, `--mmi-saida-ease: cubic-bezier(0.76, 0, 0.24, 1)`) e o JS o lê com `getComputedStyle` (`lerDuracaoSaida`, com fallback 820ms). O override de movimento reduzido (400ms) encurta automaticamente a rede de segurança do JS.

**A cortina é esperada, não cronometrada:** `transitionend` no `.mmi-painel--topo`, filtrado por `target` e `propertyName`, com timeout de `saidaMs + 160` como rede. `finalizar()` é idempotente (flag `concluido`); o listener entra num array `limpezas`.

**Detalhe visual:** o gradiente full-bleed foi dividido em dois painéis de meia altura (`calc(50% + 1px)`), cada um renderizando uma cópia de `100svh` alinhada pela própria borda; o fade de `.mmi-cena` no estado `morphing` saiu. Os painéis saem só por `transform` (∓101%), com a emenda `.mmi-costura` na linha do corte.

**Preservado:** com movimento reduzido não há cortina (dissolução, `transform: none`, emenda em `display: none`), espelhado nos dois escopos; sem JS o overlay nunca é pintado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/intro/OptionalMorphIntro.tsx`

---

## SIS-10 — Home · hero: indicadores de Resultados surgem no fim do percurso do hero

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-10/home-hero-indicadores-de-resultados-surgem-no-fim-do-percurso-do-hero

### Pedido
Portar o bloco “Resultados | evidências dos casos” da apresentação para a home, ligado ao percurso de rolagem do hero: enquanto o vídeo encolhe em card, os quatro indicadores surgem ainda dentro da seção (não como seção separada). Valores certos 10 / 1 / 2 / 6 (não 100 / 10 / 20 / 60). Só `transform` e `opacity`; hero usa `framer-motion` (`useScroll`/`useTransform`), não GSAP. CSS default = estado final; espelhar reduced-motion nos dois escopos. `h2` para o título (home já tem `h1` sr-only). Copy Lock: escrita nova visível; lock já desatualizado. Aceite: quatro indicadores no fim do percurso com o card reduzido; escrita idêntica à fonte; bloco visível sem JS / tela estreita / movimento reduzido.

### O que foi feito
Implementado no commit `05e22c2` (“SIS-10: fechar o percurso do hero com os indicadores de Resultados”).

**Arquivos:** `src/data/heroResults.ts` (novo, escrita portada de `site.ts` — valores 10 / 1 / 2 / 6, com as quatro notas), `src/components/ui/HeroResults.tsx` (novo), `src/components/HeroCinematic.tsx`, `src/app/globals.css`.

**Como ficou:** o bloco recebe o mesmo `scrollYProgress` do hero (nada de GSAP na seção) e entra em 0.86–0.95, na faixa que o card do vídeo desocupa no alto da tela ao encolher. A partitura foi recalibrada: `cueFade` 0.55→0.78, `scale` 0.62→0.96 (1 → 0.54), `drop` 0.84→1. Só `transform` e `opacity`. O `.hero-results` usa o mesmo truque de `margin-bottom: -100svh` do `.hero-sheet`.

**Acessibilidade:** o CSS nasce no estado final — sem JS, em tela estreita ou com movimento reduzido os quatro indicadores e as quatro notas estão visíveis, espelhado em `@media (prefers-reduced-motion: reduce)` e em `html[data-motion="reduce"]`. Títulos: `h2` para “Resultados que conectam…”, nenhum `h1` novo.

**Limitação:** `npm run test:copy` está vermelho, mas já estava antes desta task — o lock não foi regenerado. A escrita nova desta seção é fiel à fonte.

Comentário posterior no Linear (25/08/2026): **superado pelo SIS-13**. A colocação entregue aqui foi desfeita a pedido. Saíram do repositório `src/components/ui/HeroResults.tsx`, `src/data/heroResults.ts` e as ~150 linhas de `.hero-results*` / `.hero-metric*` do `globals.css`. O conteúdo dos quatro indicadores foi preservado em `src/data/legacy.ts`. Detalhes e commit no SIS-13.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/heroResults.ts`
- `src/components/ui/HeroResults.tsx`
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css`

---

## SIS-9 — Home · contato: textos do painel ficam invisíveis (navy sobre navy) dentro de .section-light

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-9/home-contato-textos-do-painel-ficam-invisiveis-navy-sobre-navy-dentro

### Pedido
Na seção de contato da home (SIS-5), boa parte da escrita ficava escura sobre o fundo navy do painel. Invisíveis: título “Entre em contato conosco”, parágrafo, rótulo/nota do cartão de telefone, “SEDE · SÃO PAULO” e endereço, sobretítulo “SAIBA MAIS…”. Causa: `<Contact />` dentro de `.section-light` em `page.tsx`; `.section-light h3`/`p`/`span`/`label` pintam `#0a1f44` e vencem `.contact-dialog-titulo` (especificidade 0,1,1 vs 0,1,0). Correção sugerida: exceção em `globals.css` para `.section-light .contact-inline`. Não usar `.on-dark` no painel nem tirar `.section-light`. Aceite: textos legíveis como no modal do header; ciano preservado; correção escopada em `.contact-inline` (modal do header não muda); sucesso/erros de campo; contraste AA 4.5:1.

### O que foi feito
Implementado no commit `31f752c`, na branch `feat/escritorios-dinamicos-e-contato`.

Exceção escopada em `src/app/globals.css` para `.section-light .contact-inline`, devolvendo os tokens do painel (`--contact-text`, `--contact-muted`) ao título, à descrição, aos parágrafos, aos `span`, aos `label` e ao cartão de endereço. O `.section-light` continua em volta e o modal do header não foi tocado — nenhuma regra usa `.contact-dialog`.

**Detalhe que quase virou bug:** a regra de `span` precisou de exceções explícitas para `.contact-dialog-enviar-seta` e `.contact-dialog-fone-icone`. Sem elas, os dois ícones ficariam brancos sobre fundo branco.

Também cobertos o estado de sucesso e as mensagens de erro de campo. PR não aberto nesta rodada, por instrução.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-8 — Quem somos / Escritórios BRASIL: ao chegar em SP, surgir prédio 3D com escritório marcado no 2º andar e fotos

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-8/quem-somos-escritorios-brasil-ao-chegar-em-sp-surgir-predio-3d-com

### Pedido
Em `/quem-somos`, seção “Escritórios BRASIL” (`OfficesScene.tsx`): quando o scroll chega em São Paulo, surgir o modelo 3D do prédio, marcar o escritório no segundo andar e, a partir dessa marcação, mostrar as fotos. Continuação da sequência de scroll do mapa — seção alta + `sticky`, não `pin: true`. 3D em Three.js scroll-linked. Não precisa de GLB: `BuildingExplorer.tsx` já constrói a torre proceduralmente com `ExplorerApi.setProgress`. Fotos já existem (`sp-1-1`, `sp-6`, `sp-4`). Performance: cap de `devicePixelRatio`, fallback leve em mobile. `prefers-reduced-motion`: fotos e informação alcançáveis sem a animação 3D.

### O que foi feito
**Feito** — commit `fa0c5da` no branch `feat/escritorios-dinamicos-e-contato`. Também há comentário apontando o PR #1 cobrindo SIS-5, SIS-6, SIS-7 e SIS-8.

O trecho de São Paulo (última fatia da trilha, a partir de ~61% do progresso) deixou de ser só mapa:
1. A torre surge de baixo e de longe (`translate3d` + `scale`, via `--os-predio`) no primeiro terço do trecho, à esquerda — o painel de SP com as fotos fica à direita.
2. O mapa recua para 38% de opacidade enquanto a torre está em cena.
3. O prédio se monta com a rolagem (montagem nos primeiros 55%, órbita depois).
4. O 2º andar acende marcado a partir de 56% do trecho — faixa sobre a laje, contorno, haste em cotovelo e rótulo “2º andar · escritório São Paulo”.
5. As fotos são as que a cena já tinha (`sp-1-1`, `sp-6`, `sp-4`).

**`BuildingExplorer.tsx`.** Novo marcador de andar. Altura das mesmas constantes das esquadrias (`PISO_BASE = 1.45`, `PISO_ALTURA = 0.335`). Entra na fachada frontal e na traseira (`clone()` girado 180°, materiais compartilhados). Rótulo é um `Sprite` com textura de canvas, teste de profundidade ligado. `ExplorerApi` ganhou `setDestaque(0..1)`, separado de `setProgress`. Props novos: `andarDestacado`, `rotuloDestaque`, `mostrarControles`. Limpeza: `Sprite` sai do dispose de geometria compartilhada; `LineSegments` virou `Line` na condição, para a haste entrar.

**`OfficesScene.tsx`.** Explorador entra por `dynamic(..., { ssr: false })` e só é montado quando a rolagem chega perto de SP (6% antes do trecho). Uma vez montado, fica. Progresso por chamada imperativa (`predioApiRef.current?.setProgress`), nunca por estado. `SP_INICIO` calculado da mesma divisão que escolhe a cidade ativa.

**Decisões.** Sem controles próprios no prédio da cena (`mostrarControles={false}`, `controls.enabled = false`, `pointer-events: none`). O explorador 360° continua existindo logo abaixo. Texto novo na tela: “2º andar · escritório São Paulo” — vale Copy Lock quando for regenerado.

**Verificação.** `npx tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`). `npx eslint` limpo nos três arquivos tocados. CSS parseado com PostCSS + Tailwind: OK. `npm run build` continua falhando por `src/app/sistran-river-park-3d/`; Copy Lock também já estava desatualizado (ver SIS-5).

**Acessibilidade.** Sem JS, abaixo de 1024px ou com menos movimento a cena não é montada e o mapa chega inteiro, com as duas cidades acesas e todas as fotos visíveis. Os dois espelhos devolvem a torre ao fluxo, o mapa à opacidade cheia e o andar já marcado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BuildingExplorer.tsx`
- `src/components/ui/OfficesScene.tsx`

---

## SIS-7 — Quem somos / Escritórios BRASIL: mapa deve aparecer de forma mais dinâmica no scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-7/quem-somos-escritorios-brasil-mapa-deve-aparecer-de-forma-mais

### Pedido
Em `/quem-somos`, seção “Escritórios BRASIL” (`BrazilOfficesMap.tsx`, `OfficesScene.tsx`), deixar a entrada do mapa mais dinâmica, guiada pelo scroll. Direção: reveal orquestrado (desenho do contorno / traçado da rota entre cidades, pins em stagger); o avanço do scroll conduz até São Paulo (gancho para o 3D). `prefers-reduced-motion`: mapa e nomes visíveis sem animação. Manter abas/`role="tablist"` funcionais (`OfficesScene.tsx:268`).

### O que foi feito
**Feito** — commit `f587735` (branch `feat/escritorios-dinamicos-e-contato`).

A coreografia foi construída em cima das variáveis que a cena já escrevia (`--os-contorno`, `--os-entrada`, `--os-rota`, `--os-p`), sem novo JavaScript por quadro.

1. **Ponta acesa no contorno** — novo `path.bm-pais-cabeca` (`BrazilOfficesMap.tsx`) com `pathLength="1"` e tracejado de 1,2%, levado pela mesma fração do desenho. Opacidade é a parábola `4p(1-p)`.
2. **Movimento de câmera** — `--os-foco-escala/-x/-y` registrados com `@property`. Quem transiciona é o palco (1,1s), não a `transform`. Pato Branco aproxima 1,14×; São Paulo, 1,22×.
3. **Marcadores pousam com estalo** — anel e núcleo entram de 45% ao tamanho cheio com sobra de mola (`cubic-bezier(0.34, 1.4, 0.64, 1)`). Escala nos círculos (não no `g`) com `transform-box: fill-box`. O halo pulsa animando o próprio `r`.
4. **Linha de chamada se desenha** — os dois `path` de `.bm-chamadas` ganharam `pathLength="1"` e correm do pino até o rótulo, 0,18s depois do pino pousar.
5. **Cascata do relevo** — as 4 curvas entram escalonadas na fração de entrada.
6. **Parallax do continente** — camadas da América do Sul andam ~14px a menos que o país.
7. **Ritmo** — a trilha caiu de `420svh` para `340svh` (três trechos desde a saída do Rio, SIS-6).

Tudo é `transform`/`opacity`. As abas `role="tablist"` seguem intactas — `irPara()` continua levando ao meio do trecho da cidade.

**Movimento reduzido / tela estreita / sem JS:** valores padrão continuam sendo o estado final. Resets nos dois blocos: câmera e parallax zerados, marcadores em escala 1, chamadas com `stroke-dashoffset: 0`, relevo em opacidade 1 e a ponta acesa com `display: none`.

Verificado: `tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`) e `globals.css` compilando pelo PostCSS/Tailwind. `npm run build` continua falhando por `sistran-river-park-3d`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`

---

## SIS-6 — Quem somos / Escritórios BRASIL: remover Rio de Janeiro da seção (por enquanto)

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-6/quem-somos-escritorios-brasil-remover-rio-de-janeiro-da-secao-por

### Pedido
Retirar o Rio de Janeiro da seção “Escritórios BRASIL” em `/quem-somos`, por enquanto — ficam Pato Branco e São Paulo. Onde mexer: `OfficesScene.tsx:85` (item `{ id: 'rj', ... }` e trilha/rota); `BrazilOfficesMap.tsx:53` (copy “São Paulo e Rio de Janeiro”); `src/data/aSistran.ts`. Fora de escopo: Footer, `/contato` e `src/data/contact.ts` continuam listando o RJ.

### O que foi feito
**Feito** — commit `c88c37e` (branch `feat/escritorios-dinamicos-e-contato`).

O Rio saiu da cena inteira, não só da lista de cidades:
- `src/components/ui/OfficesScene.tsx` — removido o item `rj` de `CIDADES` (era o único sem fotos).
- `src/components/ui/BrazilOfficesMap.tsx` — removidos o ponto `rj` de `PONTOS`, a linha de chamada e o grupo de rótulo do Rio; a rota agora vai só de Pato Branco a São Paulo (`M347 448C372 430 394 417 422 411`, antes seguia até o RJ). O `<desc>` e o cabeçalho do arquivo foram atualizados.
- `src/app/globals.css` — retiradas as regras de estado (`data-ativa="rj"`) que acendiam/apagavam o pino do Rio.
- `src/data/aSistran.ts` e `src/app/quem-somos/page.tsx` — comentários atualizados registrando que a saída é **por enquanto**.

Mantido de propósito: o Rio continua no rodapé, em `/contato` e em `src/data/contact.ts`.

Verificado com `tsc --noEmit` (limpo, fora erros pré-existentes de `sistran-river-park-3d`) e busca por `rj`/`Rio` nos arquivos da seção.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/data/aSistran.ts`
- `src/app/quem-somos/page.tsx`

---

## SIS-5 — Contato: substituir seção "Saiba mais sobre o que podemos oferecer" por reveal dinâmico do modal Fale com a gente no scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-5/contato-substituir-secao-saiba-mais-sobre-o-que-podemos-oferecer-por

### Pedido
Em `src/components/Contact.tsx` (headline “Saiba mais sobre o que podemos oferecer”), remover o conteúdo atual da seção e, no lugar, fazer o modal “Fale com a gente” (`ContactModal.tsx`) surgir de forma dinâmica conforme o scroll chega — a aparição do modal passa a ser a própria seção. Animação orquestrada por scroll (ScrollTrigger/pin ou equivalente), não um simples fade. Não quebrar a abertura do modal pelos outros gatilhos (Header / CTAs). `prefers-reduced-motion`: formulário alcançável sem depender da animação. Verificar `copy-lock.json:297`, que registra a copy removida.

### O que foi feito
Feito — commit `6859a35` no branch `feat/escritorios-dinamicos-e-contato`.

1. **`src/components/Contact.tsx` foi reescrito do zero.** Saiu o sobretítulo, o `<h2>`, o parágrafo do telefone, o botão magnético, o botão `tel:` e a grade `md:grid-cols-3` de unidades (`UNITS`). No lugar, a seção **é** o painel de “Fale com a gente”.
2. **O painel saiu de dentro do modal para `src/components/ContactPanel.tsx`.** Foto da sede com recorte em arco (máscara SVG + fio ciano + rede), bloco do telefone e formulário completo (`useActionState` + server action). `ContactModal.tsx` agora é só o comportamento de `<dialog>` e renderiza `<PainelContato />`.
3. **Inline, e não o `<dialog>` abrindo sozinho no scroll.** Decisão registrada: um `<dialog>` aberto por rolagem prende o foco e trava o scroll. O painel surge inline, com o gesto visual de modal abrindo (chega de baixo, de longe e menor, com véu). O modal de verdade continua sendo aberto pelo “Fale com a gente” do header.
4. **Coreografia no padrão da casa:** seção alta (`200svh`) com interior `sticky`, não `pin: true`. `ScrollTrigger` com `scrub: 1` escreve `--ct-surgir` e `--ct-p` num ref.
5. **Só `transform` e `opacity`** no painel. `filter: blur()` descartado (performance).
6. **CSS em `globals.css`:** tokens `--contact-*`/`--cd-*` passaram a valer para `.contact-dialog` e `.contact-inline`; `.contact-inline` zera a moldura com `--cd-altura: none`. Bloco novo `.ct-trilha`/`.ct-inner`/`.ct-palco`/`.ct-veu`/`.ct-painel`.
7. **Acessibilidade — default CSS = estado final.** Sem JS, abaixo de 1024px ou com `prefers-reduced-motion` o painel aparece pronto. Resets nos dois lugares. Botão “Fechar” da tela de sucesso só existe quando há modal (`onClose` opcional).

**Verificação:** `npx tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`) e o CSS passa pelo PostCSS + Tailwind sem erro.

**Dois pontos para o dono do conteúdo.** A copy da seção continua no painel; o que saiu de fato foi a grade de unidades. `npm run test:copy` falha, mas já falhava antes (lock desatualizado); o lock não foi regenerado de propósito.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Contact.tsx`
- `src/components/ContactPanel.tsx`
- `src/components/ContactModal.tsx`
- `src/app/globals.css`
