## SIS-45 — Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card

### Pedido
A linha de processo tinha seis nós enquanto as soluções são quatro; o nó aceso usava `ativo + 1`, compensação porque a contagem não fechava. Pedido: reduzir para quatro nós (um por card), acender exatamente a etapa ativa (`i === ativo`) e marcar anteriores como percorridos. Em `src/components/Solutions.tsx`: `ICONES_NO` com os ícones das próprias soluções via `getIcon(s.icon)`; recalcular a distribuição `0.135 + i * 0.146` (feita para seis); eliminar `noAtivo`; vocabulário `ativo` / `feito` / `proximo`; ajustar o fim do caminho SVG a partir do último nó. Posições em % da caixa medida (`geo`), nunca px. Validação: nas quatro etapas, quatro nós, exatamente um aceso e correspondente ao cartão, em desktop largo e estreito.

### O que foi feito
Feito no commit `82670e4`.

A linha passou de seis nós para `total` (quatro), um por solução, e o nó aceso é o próprio `ativo`. A correção `noAtivo = ativo + 1` saiu — ela só existia porque com seis nós a cabeça do percurso caía no nó errado; com um nó por etapa não há índice a corrigir.

**Ícones:** cada nó carrega o ícone da **sua** solução, via `getIcon(s.icon)` — o mesmo que o cartão descritivo mostra. A lista `ICONES_NO` e os seis imports do lucide (`Boxes`, `Check`, `Code2`, `ShieldCheck`, `UserPlus`, `Workflow`) saíram. Enquanto os nós eram seis e decorativos, um ícone qualquer servia; agora que cada nó representa uma etapa nomeada, um ícone alheio confundiria.

**Distribuição:** de 0.14 a 0.86 da largura medida da foto, com o passo **derivado de `total`** em vez do `0.135 + i * 0.146` escrito na mão. As margens de 14% em cada ponta impedem que o primeiro e o último encostem na borda da janela. Se um dia entrar ou sair uma solução, a linha continua distribuída sozinha.

O fim do caminho passou de `nos[5]` para `nos[nos.length - 1]`, e a chave do `map` de índice para `SOLUTIONS[i].id`.

Segue `aria-hidden`: a informação de etapa continua no `01 / 04` da navegação e no `aria-current="step"`. `tsc` e `eslint` limpos, servidor em 200.

Destrava SIS-46 e SIS-47, que dependiam desta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`

---

## SIS-44 — Soluções de Negócios: o convite ao scroll não está visível

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-44/solucoes-de-negocios-o-convite-ao-scroll-nao-esta-visivel

### Pedido
O convite ao scroll da SIS-41 não aparece. Hipóteses: posição no fim da `.solutions-caixa` (pode cair fora da viewport no palco preso); opacidade `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)` que se apaga com 12% do percurso (se `--sol-p` já não é 0 na entrada); contraste `rgba(226, 245, 255, 0.62)` sobre o degradê. Descobrir a causa (valor computado de `--sol-p` e retângulo) e corrigir para o convite aparecer na entrada e se apagar ao rolar. Sem estado novo e sem listener novo; opacidade continua de `--sol-p`. Decorativo e `aria-hidden`. Validação: entrar rolando de cima, convite legível; ao rolar, desaparece; na volta, reaparece sem piscar.

### O que foi feito
Feito no commit `2bed7aa`. Era a primeira das três hipóteses da task, com a segunda somada por cima.

**Causa:** o convite era o último item da `.solutions-caixa`. A caixa é mais alta que a tela — a foto sozinha vai a 620px, mais cabeçalho e navegação — e o sticky recorta com `overflow: clip`. O convite caía na parte recortada. Nunca foi a opacidade: `clamp(0, calc(1 - var(--sol-p) * 8), 1)` vale 1 em `p = 0` e estava correto.

**Correção:** saiu de dentro da caixa e passou a ser irmão dela, absoluto no rodapé do próprio `.solutions-sticky`, que já é elemento posicionado. Fica sempre dentro do recorte, independente da altura do conteúdo. Também virou coluna em vez de linha: texto em cima, calha embaixo.

**Contraste (terceira hipótese, também real):** o texto estava em `rgba(226, 245, 255, 0.62)` sobre o azul do palco e não se lia. Subiu para alfa 0.92 e ganhou placa de vidro discreta (borda de 1px + fundo navy translúcido + blur), porque o degradê do fundo varia atrás dele ao longo do percurso.

Continua decorativo e `aria-hidden`, continua se apagando pelos primeiros ~12% do percurso via `--sol-p`, e continua renderizado só no palco dirigido — nenhum estado novo, nenhum listener novo. `tsc` e `eslint` limpos, servidor em 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-43 — Soluções de Negócios: retirar o botão "Veja mais" do rodapé da seção

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-43/solucoes-de-negocios-retirar-o-botao-veja-mais-do-rodape-da-secao

### Pedido
Remover o botão **«Veja mais»** do rodapé da seção: o `.solutions-rodape` (`<Link href="/solucoes#servicos-diferenciais" className="btn-primary">`) de `src/components/Solutions.tsx` e as regras de `.solutions-rodape` em `src/app/globals.css`, inclusive a variação em `@media (min-width: 1024px)`. Comentar em vez de apagar só se reaproveitável; senão remover e deixar nota de religar. Atenção ao `import Link from 'next/link'` órfão. A página `/solucoes#servicos-diferenciais` continua pelo menu. Validação: lint (import não utilizado), tipos, e fim da seção emenda na próxima sem espaço vazio.

### O que foi feito
Feito no commit `d1cfded`.

Saíram os três pedaços que só existiam por causa do botão:

1. `.solutions-rodape` com o `<Link href="/solucoes#servicos-diferenciais">` no fim do JSX de `Solutions.tsx`;
2. o bloco de CSS que o alinhava (`globals.css`, ~7031) — sem o botão sobrava uma caixa vazia reservando altura no fim do palco;
3. a menção a `.solutions-rodape` na media query de 400px, que agora vale só para `.solutions-caixa`.

O import `import Link from 'next/link'` saiu junto: era o único consumo no arquivo. A rota continua alcançável pelo menu.

Comentário no lugar de cada bloco removido explicando como religar. `tsc --noEmit` e `eslint src/components/Solutions.tsx` limpos; um `grep` por `solutions-rodape` só encontra os comentários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-42 — Soluções de Negócios: tirar os "pulinhos" na troca de cena durante o scroll

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-42/solucoes-de-negocios-tirar-os-pulinhos-na-troca-de-cena-durante-o

### Pedido
Rolando o palco, a cena/cartão «pula» em vez de trocar limpo. Suspeitos a confirmar: `key={ativo}` no fio (`.solutions-fio`) remontando animações; `transition` de layout (`.solution-viewport` 680ms) brigando com o scroll; `medir()`/`setGeo` no meio da transição. Investigar primeiro, registrar a causa real, depois corrigir. Scroll continua o relógio: um `ScrollTrigger`, sem segundo trigger nem `setInterval`, nenhuma dependência nova. Validação: rolar devagar e rápido, cima e baixo, nas quatro etapas, sem salto; exatamente um item ativo.

### O que foi feito
Feito no commit `8aa143d`. Investiguei antes de corrigir — **os três suspeitos eram reais**, somados. Nenhum deles era a transição de 680ms da `.solution-viewport`, que ficou como estava.

**1. O parallax era um dente de serra — causa principal.** `--sol-passo-p` era `(p * total) % 1`, caindo de 1 para 0 na fronteira de cada etapa. O parallax da foto consumia isso com amplitude de 14px, então a cada quarto do percurso a imagem levava um tranco de 14px — e a `transition: transform 850ms` transformava o tranco num balanço.

Agora a fase é por cena: `var(--sol-p) * var(--sol-total) - var(--sol-i)`. Para a cena da vez isso percorre 0..1 igual a antes, mas nunca retorna. A transição saiu: o relógio é o scroll, o valor é reescrito a cada quadro.

**2. `key={ativo}` estava no container do fio**, então remontava também os seis nós a cada etapa. Eles voltavam do zero com a cascata de entrada, até 785ms de atraso no último nó. A chave passou para o `<path className="solutions-fio-vivo">`. Os nós agora persistem e trocam de estado por `transition`.

**3. O pulso do nó ativo reiniciava a animação de entrada.** A regra do estado ativo redeclarava a shorthand `animation` com dois itens, reiniciando `solutions-no-entra` (360ms+ de atraso). O pulso foi para o anel `::after`. As keyframes perderam o `translate(-50%, -50%)`, que servia ao nó (centrado por translação) e não ao anel (`inset`).

**Bônus:** o parallax de 4px do `.solution-info` saiu. Além do dente de serra, disputava a **mesma** `transform` dos deslocamentos de estado (−10px ao sair, 22px ao entrar), transição de 460ms.

`--sol-passo-p` ficou sem consumidor e deixou de ser publicada; `--sol-total` entrou no lugar. `tsc` e `eslint` limpos, servidor em 200.

Falta a conferência no navegador: descer devagar pelas quatro etapas procurando tranco na fronteira, subir e descer rápido, e confirmar que a cascata dos nós roda uma vez só (ao entrar na seção).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-41 — Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-41/solucoes-de-negocios-linha-de-processo-mais-baixa-e-um-convite-ao

### Pedido
Duas coisas no palco preso: (1) a linha de processo desce de 44% para **56%** da altura da foto (fração medida, nunca px); (2) convite «Role para percorrer as 04 soluções» com ponto descendo numa calha, opacidade de `--sol-p` via `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)`, sem estado novo. Só no palco dirigido (`dirigindo`); decorativo e `aria-hidden`. Sem dependência nova; não alterar textos nem o modal. Validação: lint, tipos, linha não encosta no cartão nas quatro etapas, convite desaparece ao rolar.

### O que foi feito
Movida de Backlog para **Done** no commit `1e6ed65`.

**1. Linha de processo mais baixa:** `linhaY` passou de `geo.ph * 0.44` para `geo.ph * 0.56` em `Solutions.tsx`. Continua fração da altura **medida**, nunca px. O teto é o cartão descritivo (terço inferior): abaixo de ~0.6 a linha começaria a passar por trás dele.

**2. Convite ao scroll:** novo `<p className="solutions-convite">` no fim da `.solutions-caixa` — «Role para percorrer as 04 soluções» com um ponto descendo numa calha fina.
- Opacidade por `clamp(0, calc(1 - var(--sol-p) * 8), 1)`: `--sol-p` é o progresso que o `ScrollTrigger` já escreve em `.solutions-sticky`. O convite se apaga nos primeiros ~12% do percurso. **Nenhum estado novo, nenhum listener novo, nenhum re-render.**
- O ponto anima apenas `transform` e `opacity` (`translate3d`), compositor.
- Renderizado só quando `dirigindo` é verdadeiro. Há um bloco `prefers-reduced-motion` que para o ponto no meio da calha.
- `aria-hidden` e `pointer-events: none`. O caminho real continua sendo a navegação lateral e as setas do teclado.

**Validação:** `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado) e `eslint` limpo; home em 200. O convite não aparece no HTML servido — correto: `dirigindo` depende de `matchMedia`, só no cliente, evitando divergência de hidratação.

**Pendente de olho humano:** linha não encostar no cartão nas quatro etapas e convite desaparecer ao começar a rolar.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`

---

## SIS-40 — Soluções de Negócios: limpar o cartão — tirar o selo "Ativo" e o número pequeno acima do título

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-40/solucoes-de-negocios-limpar-o-cartao-tirar-o-selo-ativo-e-o-numero

### Pedido
Remover o selo **«ATIVO»** (`solution-info-estado`) e o número pequeno acima do título (`solution-info-indice`) em `src/components/Solutions.tsx` e o CSS correspondente em `src/app/globals.css`. A barrinha em degradê (`solution-info-linha`) fica. Compensar `margin-top` do título (0.45rem → 0.95rem). Reaproximar atrasos da cascata de entrada. Só esta seção; nenhum texto de conteúdo muda. Validação: lint, tipos, quatro cartões alinhados, cascata sem pausa.

### O que foi feito
Movida de Backlog para **Done** no commit `e90729d`.

- `src/components/Solutions.tsx`: fora `<span className="solution-info-indice">` e `<span className="solution-info-estado">Ativo</span>`.
- `src/app/globals.css`: as duas regras de tipografia saíram junto. No lugar, comentário do que foi removido, por quê e como religar.
- `margin-top` do título 0.45rem → **0.95rem**.
- Cascata de entrada: atrasos reaproximados — ícone 160ms, título 225ms, texto 290ms, remate 350ms. Antes o último degrau era em 380ms com dois vãos no meio.
- A barrinha em degradê (`solution-info-linha`) ficou como remate inferior e entrou na cascata no lugar do selo.

O cartão só é renderizado na cena ativa, então o selo «ATIVO» não informava estado; a etapa já é dita pelo número grande à direita e pelo «03 / 04» da navegação.

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`) e `eslint` limpo; home em 200. Grep: `solution-info-indice` e `solution-info-estado` não aparecem mais em seletor nem no markup — só na nota explicativa.

**Pendente de olho humano:** alinhamento dos quatro cartões e cascata sem pausa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-39 — Soluções de Negócios: diminuir o cartão descritivo sobre a foto

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-39/solucoes-de-negocios-diminuir-o-cartao-descritivo-sobre-a-foto

### Pedido
Reduzir o cartão de vidro (estava em 78% da largura, 210px de altura mínima, até 40px de padding). Desktop: 78% → 62%, min-height 210px → 176px, padding até 32px, `left` −6% → −4%, `bottom` −24px → −20px. Tablet (1024–1279px): 88% → 76%, 190px → 168px, padding 22px. Internos: ícone 44px → 38px, título `clamp(1.05rem, 1.24vw, 1.34rem)`, texto 0.92rem, número `clamp(2.8rem, 5vw, 5.4rem)`. Título com `min(40ch, 72%)`. Só CSS, só esta seção. Validação: lint, tipos, quatro títulos cabem, número e texto não se sobrepõem.

### O que foi feito
Movida de Backlog para **Done** no commit `de793bb`. Só CSS, em `src/app/globals.css`.

**Desktop** (`.solutions-scroll[data-dirigindo] .solution-info`): largura 78% → **62%**, altura mínima 210px → **176px**, padding `clamp(32px, 2.4vw, 40px)` → **`clamp(24px, 1.9vw, 32px)`**, `left` −6% → **−4%**, `bottom` −24px → **−20px**.

**Tablet** (1024–1279px): 88% → **76%**, 190px → **168px**, padding 26px → **22px**. Deliberadamente mais largo que no desktop: a coluna do palco é mais estreita e em 62% o título do card 01 quebraria em quatro linhas — registrado em comentário no CSS, com os valores antigos.

**Internos:** ícone 44 → 38px (svg 22 → 19px), título `clamp(1.15rem, 1.5vw, 1.6rem)` → `clamp(1.05rem, 1.24vw, 1.34rem)` com `line-height` 1.24, texto 0.98 → 0.92rem (`line-height` 1.55), número decorativo `clamp(3.4rem, 7vw, 7.4rem)` → `clamp(2.8rem, 5vw, 5.4rem)`.

O título continua com largura máxima reservada (`min(40ch, 72%)`, texto `min(50ch, 76%)`).

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`) e `eslint` limpo; home em 200. Nenhum texto mudou, nenhuma outra seção tocada.

**Limitação:** conferência visual dos quatro títulos (caso mais longo: card 01) ainda pelo navegador, desktop e tablet.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-38 — Home: o tile "Arquitetura modular e escalável" atravessa o scroll até virar a foto do card 01 de Soluções

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-38/home-o-tile-arquitetura-modular-e-escalavel-atravessa-o-scroll-ate

### Pedido
O tile «Arquitetura modular e escalável» e a foto do card 01 já são a mesma imagem (`/images/home/escritoriosp.jpg`, SIS-36), mas a passagem é um corte. Fazer o tile descer com o scroll e pousar sobre a janela da foto do card 01. Novo `src/components/ui/MosaicHandoff.tsx` em `src/app/page.tsx` depois de `<Solutions />`. Elemento `position: fixed`, deslocado por `transform`, largura/altura em px (proporção muda; `scale` esmagaria). Origem/destino medidos: `data-carrier-origem` e `data-carrier-alvo`. Relógio = seção `#solucoes`. Sem biblioteca nova; só a partir de 1024px e com movimento permitido; `aria-hidden`. Validação: lint, tipos, tile sai do mosaico, desce e pousa alinhado, sem salto e sem passar por baixo do fundo de Soluções.

### O que foi feito
Movida de Backlog para **Done** no commit `e55649f`.

- `src/components/ui/MosaicHandoff.tsx` (novo): o viajante. `position: fixed`, deslocado por `translate3d`, com largura/altura em px — a proporção muda no caminho (tile retrato → janela 16/9); só a mudança real de caixa deixa o `object-fit: cover` reenquadrar.
- `src/app/page.tsx`: montado **depois** de `<Solutions />` e irmão direto das duas seções. `position: fixed` morre sob ancestral com `transform`/`filter`; ordem na árvore faz o viajante pintar por cima do fundo de Soluções (`z-index: 30`, abaixo do cabeçalho em `z-50`).
- Marcas: `data-carrier-origem` na face do tile (`legacy/StackScenes.tsx`) e `data-carrier-alvo` na janela do card 01 (`Solutions.tsx`). Nenhuma coordenada estimada.
- `src/app/globals.css`: bloco `.mosaic-handoff` / `-img` / `-rotulo`, mais `[data-carrier-origem] { opacity: var(--carrier-fonte, 1) }`.
- Relógio = seção de destino: foto dentro de `sticky`, topo final `alvo.top − max(secao.top, 0)`, progresso = quanto falta de `secao.top` para zero, janela de 1,25 tela.
- Troca no fim invisível porque é a mesma imagem (`escritoriosp.jpg`). Tratamento de cor viaja igual (`saturate(.88) contrast(1.04) brightness(.78)`).

**Restrições:** nenhuma dependência nova; um `requestAnimationFrame` por rajada de scroll, sem `setInterval`, sem re-render; decorativo e `aria-hidden`; desligado abaixo de 1024px e com `prefers-reduced-motion`.

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`), `eslint` limpo nos quatro arquivos, home em 200, HTML servido com exatamente uma marca `data-carrier-origem` e uma `data-carrier-alvo`.

**Limitação:** validação estática; conferência no navegador pendente. **Nota:** fotos em `public/images/home/` não estavam versionadas (fora de `9141420`) — corrigido em `bd30d61`.

**Ajuste posterior** (commit `48a2c42`, issue continua em Done): durante a descida a foto do card 01 já estava visível — a mesma imagem duas vezes. O efeito passou a escrever `--carrier-destino` no `<html>`. A foto de destino fica apagada durante o percurso e acende nos últimos 6%, no intervalo em que o viajante se apaga. Opacidade em `[data-carrier-alvo] .solution-image` e `.solution-veu`, **nunca** na `.solution-viewport`. `desligar()` devolve as duas pontas a 1. `tsc` e `eslint` limpos, home em 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/MosaicHandoff.tsx`
- `src/app/page.tsx`
- `src/components/legacy/StackScenes.tsx`
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-37 — Soluções de Negócios: aproximar a composição da referência (palco, linha de processo e cartão)

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-37/solucoes-de-negocios-aproximar-a-composicao-da-referencia-palco-linha

### Pedido
Aproximar a seção da referência sem trocar conceito, texto ou outras seções. Correções descritas: caixa `min(92vw, 1640px)`, colunas 29/71 (34/66 no tablet), gap 48–72px; título `white-space: nowrap` a partir de 1280px; cartão `width: 78%; left: -6%; bottom: -24px; min-height: 210px`; conector único SVG medido (`ResizeObserver`), `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`; seis nós de 52px em %; fundo (focos radiais + degradê `115deg #0875c5 → #075aab → #032d67`, grade 64px opacidade 0.05); emendas SIS-32 preservadas; um `ScrollTrigger`, sticky 100svh sobre 400vh, índice `floor(progress * 4)`; acessibilidade (`<button>`, `aria-current="step"`, teclado, mobile trilho, reduced-motion).

### O que foi feito
Backlog → Done no commit `9398cae`.

**Arquivos:** `src/components/Solutions.tsx` (reescrito) e `src/app/globals.css` (bloco da seção, 704 linhas → 873).

- Composição: caixa `min(92vw, 1640px)`, colunas 29/71 (34/66 no tablet), gap `clamp(32px, 4vw, 72px)`, título com `white-space: nowrap` a partir de 1280px, cartão em 78% cobrindo só o terço inferior da foto, molduras recuadas 22px/42px só com borda.
- Linha de processo: as quatro ilustrações por índice (`CenaOverlay`) e o `.solution-conector` posicionado por `(indice - 1.5) * 63px` saíram. Agora é **um** caminho SVG com coordenadas medidas por `ResizeObserver` (guarda de 0.5px no `setState`, senão floats de `getBoundingClientRect` fazem render infinito) e seis nós. Nós são spans HTML em %: sob `preserveAspectRatio="none"` um `<circle>` viraria elipse.
- `key={ativo}` no invólucro do fio: desenho e cascata uma vez por etapa; mudança de geometria não remonta.
- Fundo, movimento e acessibilidade conforme a descrição. Nenhuma dependência nova — GSAP/ScrollTrigger já usado, um `ScrollTrigger` só, sticky sobre trilha de 400vh.

**Verificação**
- `tsc --noEmit` limpo e `eslint` limpo. Aviso `react-hooks/set-state-in-effect` no `setGeo(null)` do ramo `!dirigindo` — o reset saiu (a renderização já exige `dirigindo && geo`).
- `grep` confirma zero referências restantes a `solution-overlay`, `solution-conector`, `CenaOverlay` e `solution-pulso`.
- Home responde 200 e o HTML servido traz a composição nova.

**Limitações reais**
1. Validação até aqui é estática. As quatro etapas de scroll, scroll rápido, cliques, três tamanhos de tela e `prefers-reduced-motion` precisam de conferência no navegador.
2. A linha de processo só é desenhada no palco dirigido (`dirigindo && geo`). No mobile e em movimento reduzido ela está **ausente**, não «restrita ao interior da foto». É decoração `aria-hidden`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-36 — Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-36/solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico

### Pedido
A janela de imagem das quatro soluções na home era um retângulo navy vazio: `Solutions.tsx` renderizava `<div className="solution-image" role="presentation" />`, nunca um elemento de imagem. Escopo: campos opcionais `image`/`imageAlt` em `Solution`; quatro fotos de `public/images/home/` (`escritoriosp.jpg`, `escritoriosp1.jpg`, `sistransphist2.jpg`, `sistransphist3.jpg`) com `alt`; `next/image` com `fill` em `.solution-viewport` + véu navy nas bordas; `escritoriosp.jpg` também no tile «Arquitetura modular e escalável» do mosaico. Nenhum texto visível muda; nenhuma imagem nova gerada. A SIS-20 nunca foi implementada.

### O que foi feito
Backlog → Done no commit `9141420` (dados) + `9398cae` (componente).

- `src/data/types.ts`: `image?`/`imageAlt?` no tipo `Solution`. Opcionais de propósito — `/solucoes` consome os mesmos dados sem palco de imagem.
- `src/data/solutions.ts`: `escritoriosp.jpg` no card 01, `escritoriosp1.jpg` no 02, `sistransphist2.jpg` no 03, `sistransphist3.jpg` no 04, cada uma com `alt` descritivo.
- `src/components/Solutions.tsx`: o `<div className="solution-image" role="presentation" />` deu lugar a `next/image` com `fill` dentro de `.solution-viewport` (`position: relative; overflow: hidden`), mais véu navy só nas bordas.
- `src/data/legacy.ts`: `escritoriosp.jpg` também no tile «Arquitetura modular e escalável». É a MESMA foto do card 01 de propósito. Comentário no arquivo registra que trocar uma sem a outra quebra a emenda.

**Verificação**
- `tsc --noEmit` limpo (ignorando `src/app/sistran-river-park-3d/`) e `eslint` limpo nos quatro arquivos.
- As quatro `/images/home/*.jpg` respondem 200; o HTML servido da home traz quatro `<img class="solution-image">` com `alt` real, e `escritoriosp.jpg` aparece duas vezes (tile + card 01).
- `next.config.mjs` tem `images: { unoptimized: true }`, então o `next/image` emite o `src` cru e `/_next/image?url=...` responde 404 por definição — não é defeito.

Causa confirmada: não era caminho nem carregamento — não existia elemento de imagem. A SIS-20 fica superada por esta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/types.ts`
- `src/data/solutions.ts`
- `src/components/Solutions.tsx`
- `src/data/legacy.ts`

---

## SIS-33 — Hero: nascer do fio condutor e entregar o movimento para o mosaico

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-33/hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o-mosaico

### Pedido
O `HeroCinematic` (`src/components/HeroCinematic.tsx`, `id="top"`) já encolhe e vira card; falta ser o início do fio condutor (SIS-30) e o convite a rolar. O fio ancora no hero e começa no primeiro gesto de scroll. Cue de rolagem irmã do bloco sticky, nunca filha do que anima em `scale` (`position: fixed` morre sob ancestral com `transform`). Conferir emenda hero → mosaico e que o fio atravessa (`overflow: hidden` corta; usar `clip`). Não redesenhar o hero nem mexer no modal/botão. Cue decorativo sob `prefers-reduced-motion`. Validação: sem rolar, título e cue visíveis; primeiro scroll desenha o fio e o cue sai; emenda sem piscar; `npx tsc --noEmit` (filtrando `sistran-river-park-3d`) e `npx eslint`.

### O que foi feito
**Sem alteração de código — verificada como já satisfeita.** Registro do que foi conferido, item por item:

- **O fio nasce no hero.** A primeira parada do `ScrollSpine` é `#top`, e a linha viva começa a ser desenhada a partir de `--scroll-p = 0` — do primeiro pixel de scroll, dentro do hero. Entregue em SIS-30 (`c2b1d63`).
- **A dica de scroll (`.hero-cue`) já está correta.** Ela é **irmã** da cena sticky, nunca filha do nó que sofre `scale`. Já desaparece sozinha, por `useScrollOpacity`.
- **A emenda hero → mosaico foi deixada intocada de propósito** em SIS-32: o hero encolhe em card sobre fundo claro e entrega a cor do mosaico por conta própria. Pôr camada de costura ali seria pintar por cima de uma emenda que já funciona.

Nada a implementar. Fechando para não deixar uma task aberta sugerindo trabalho pendente onde não há.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-277 — /parceiros · tag da abertura vira carimbo-parcerias.png (efeito ao entrar)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-277/parceiros-tag-da-abertura-vira-carimbo-parceriaspng-efeito-ao-entrar

### Pedido
Em `/parceiros-e-implementacoes`, substituir o eyebrow «Parceiros e Implementações» do `PageHero` pelo carimbo `public/carimbo/carimbo-parcerias.png` com efeito de batida ao entrar (viewport/load), sem pin/ScrollTrigger. Manter o h1 salvo redundância demais (reportar, não apagar sem aval). Reusar o padrão de `CarimboRealizadoSistran` (SIS-235): GSAP batida + tombo; `animar` + reduce = estado final. Critérios: tag textual some e o carimbo aparece; efeito perceptível e reduce OK; h1 acessível; capturas 1440; lint OK. Fora de escopo: tags das seções abaixo, capa SIS-225/228, eventos.

### O que foi feito
Sonda: `scripts/medir-carimbo-parcerias-sis277.mjs [antes|depois]` → `docs/medidas/sis277-{antes,depois}.json`. Larguras 1440 e 1024, e os dois canais de movimento reduzido.

**1. Trocar o eyebrow textual pelo PNG do carimbo.** `eyebrow="Parceiros e Implementações"` saiu de `src/app/parceiros-e-implementacoes/page.tsx` e no lugar entra `<CarimboBatida>` pela prop nova `eyebrowArte` do `PageHero`.
- antes @1440: `tagTextual` = «Parceiros e Implementações», caixa **273×16**, `font-size: 12px`; `carimbo: null`.
- depois @1440: `tagTextual: null`, `textoDaTagForaDoH1: []` — a tag saiu do DOM. `carimbo` **273,6×85,5** em topo 240, `img.naturalWidth: 640`.
- depois @1024: carimbo **240×75**, `vaza: false` nas duas larguras.

Perfil de tinta do PNG (1524×476): «PARCEIROS E» ~11,8% da altura e «Implementações» ~22%. H=85px → 10,0px e «Implementações» com 18,8px. Daí `--carimbo-batida-w: clamp(15rem, 19vw, 17.5rem)`. A 1440 dá 273,6px — a mesma largura da tag que saiu (273px) e **55% da largura do `h1`** (500,4px, fonte 70,4px). Aritmética no cabeçalho de `src/components/carimbo-batida.css`.

**2. Efeito de carimbo ao entrar** — montagem, sem pin/ScrollTrigger. Amostrado por `requestAnimationFrame` em `DOMMatrixReadOnly`:

| | 1440 | 1024 |
|---|---|---|
| `liberadoEm` (portão) | 2678 ms | 2493 ms |
| 1º quadro em movimento | **2683 ms** (`liberado: "true"`) | **2497 ms** (`liberado: "true"`) |
| `escalaMax` → `escalaMin` → repouso | 1,85 → 0,919 → 1 | 1,85 → 0,915 → 1 |
| `opacidadeMin` | 0 | 0 |
| `giroMax` | 7° | 7° |
| `quadrosEmMovimento` | 3 | 7 |

O ricochete (0,919 abaixo de 1) é o `back.out(1.7)`. A batida espera o portão da rota (`RouteLoadGate`): `pronto = paginaCarregada && (portao === null || portao.liberado)` — precedente do `CountUp` / defeito da SIS-243.

**3. Acessível** — `alt="Parceiros e Implementações"`. `h1` intacto: «Parceiros e Implementações», caixa 500,4×135,2, `quantosH1NaPagina: 1`.

**4. Peso** — PNG tem alfa real (RGBA, extremos 0/255). Derivada: `scripts/gerar-carimbo-parcerias-sis277.mjs` gera `public/images/parceiros/carimbo-parcerias.webp` a 640px → **640×200, alfa preservado, 38 kB contra 189 kB (−80%)**. Com `images: { unoptimized: true }` (SIS-154) o arquivo do disco é o que chega. Achado: modo com perda é o mais pesado (q92+aq100 = 57 kB; lossless = 46 kB; `nearLossless(q80)` = **38 kB**).

**5. Reduce — nasce no estado final** — `prefers-reduced-motion: reduce` e `html[data-motion="reduce"]`: opacidade **1**, caixa 273,6×85,5, `transform: none`. Folha força estado final com `!important`.

**Console:** `erros: []` nas duas larguras. **Lint:** linha de base `✖ 79 problems (31 errors, 48 warnings)`, exit 0; depois igual. `npx tsc --noEmit` limpo.

**Pontos relatados, não resolvidos sozinhos:** redundância arte + `h1` continua (a tag textual já dizia a mesma frase; arte 85px vs 16px da tag). Unificar `CarimboBatida` com `CarimboRealizadoSistran` pede issue própria (caminho fixo, `alt` de `EVENT_KIND_META`, tombo −6°; cápsula daqui já vem tombada −3,05° no arquivo). Fora de escopo não tocado: tags das seções de baixo, capa SIS-225/228, carimbos de eventos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/components/PageHero.tsx`
- `src/components/CarimboBatida.tsx`
- `src/components/carimbo-batida.css`
- `scripts/medir-carimbo-parcerias-sis277.mjs`
- `scripts/gerar-carimbo-parcerias-sis277.mjs`
- `public/images/parceiros/carimbo-parcerias.webp`
- `docs/medidas/sis277-antes.json`
- `docs/medidas/sis277-depois.json`

---

## SIS-276 — /esg · Fale com a Gente!: grafismo cortado/baixo demais no rodapé

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-276/esg-fale-com-a-gente-grafismo-cortadobaixo-demais-no-rodape

### Pedido
Em `/esg`, no bloco **Fale com a Gente!** (`ContactCTA` + `layoutReferencia`), o grafismo da direita (blob + logo + órbitas + botão) fica baixo demais e encosta/corta no rodapé. Medir a 1440 (bbox da arte vs fundo da seção vs topo do footer); subir o conjunto / aumentar respiro / overflow visível na arte sem vazar scroll horizontal. Não regressar motion SIS-253 nem logo HD SIS-265. Capturas 1440 (e 1024 se o piso mudar). Fora: redesign, outras rotas `ContactCTA`, reveal SIS-271.

### O que foi feito
**1. Medição a 1440: a causa não é nenhuma das três hipóteses da issue.** `docs/medidas/sis276-antes.json`, coordenadas de documento: seção `.cta-ref` 5174–**5716** (`overflow: hidden`, padding 128/128); `.cta-ref-palco` 5302–5588 (h 286); `.cta-ref-arte` 5445–**5786** (h 341); região de filtro do blob 5343–**5888**; `footer` em **5716**. `arteAlemDoFundoDaSecao: 70` · `filtroAlemDoFundoDaSecao: 172` · `arteAlemDoTopoDoRodape: 70`. A 1024: 27 e 120.

Não é `padding-bottom` insuficiente (128px; palco termina 128px antes do fim), não é «posição final baixa» de desenho; o `overflow: hidden` só transforma o deslocamento em **corte**. Causa medida: computado da arte **`transform: "none"`**, `top: "143.047px"`. A centragem `transform: translateY(-50%)` foi **cancelada pelo preset de reveal**: SIS-271 pôs `data-reveal="fade"` neste nó, e o estado final `[data-in='true'] [data-reveal] { opacity: 1; transform: none }` tem especificidade (0,2,0) contra (0,1,0) da classe. Sem a subida de 170px (metade de 341), a arte desce 170px. Os dois espelhos de reduced-motion declaram o mesmo `transform: none !important`. A arte precisa estar centrada: `aspect-ratio: 760/620` → 341px contra palco 286px (`arteMenosPalco: 55`).

**2. Correção: `transform` → `translate`, duas linhas.** `transform` e `translate` são independentes; o UA compõe `translate` antes de `transform`, então `transform: none` do reveal não apaga um `translate`. Nada de `!important`, nada no reveal da SIS-271, nada no SVG.
- `.cta-ref-arte` (desktop, `globals.css`): `transform: translateY(-50%)` → `translate: 0 -50%`.
- `.cta-ref-botao` (base): `transform: translate3d(var(--cta-ref-botao-x), var(--cta-ref-botao-y), 0)` → `translate: var(--cta-ref-botao-x) var(--cta-ref-botao-y)`; `transition` de `transform 420ms` para `translate 420ms`.

**3. «Botão afundado» — mesma causa.** Também tem `data-reveal="fade"`. Antes: terminava em `transform: none`, 24px abaixo (topo 5437 servido → 5461 no estado final); hover de 6px não acontecia. Depois: topo estável em 5437, hover 792 → 798 e volta.

**4. Depois (1440 / 1024).** Arte 5275→5616 a 1440: `arteAlemDoFundoDaSecao: -100`, `arteAlemDoTopoDoRodape: -100` (era +70). A 1024: −128 e −35. Região de filtro: excedente inferior 172px → 2px (no topo, `feDropShadow` `y="-30%" height="160%"`). `rolagemHorizontal.vaza: false`. `overflow-hidden` da seção **mantido**. Reduce nos dois canais: `translate: "0px -50%"`, `transform: "none"`, `opacity: 1`. SIS-253: `animation-name: cta-ref-flutua` / `cta-ref-orbita-pulsa`. SIS-265: `seloNaturalWidth: 640`. `pousoDoPonto` a 1440 `{dx: -7.6, dy: -3.5}` — o `dx: -7.6` é pré-existente (SIS-253), fora de escopo. `erros: []`; `tsc --noEmit` limpo.

**Portão de lint:** linha de base `✖ 79 problems (31 errors, 48 warnings)`; depois igual, exit 0.

**Artefatos:** `scripts/medir-cta-arte-sis276.mjs`, `docs/medidas/sis276-antes.json`, `docs/medidas/sis276-depois.json`. Capturas conferidas e apagadas neste turno.

**Observação:** qualquer nó que dependa de `transform` para posição de layout e receba `data-reveal` perde essa posição no estado final; remédio: declarar em `translate`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-cta-arte-sis276.mjs`
- `docs/medidas/sis276-antes.json`
- `docs/medidas/sis276-depois.json`

---

## SIS-275 — Home · reveal on scroll em toda a página (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-275/home-reveal-on-scroll-em-toda-a-pagina-docsscrollmd

### Pedido
Na home (`/`), aplicar o reveal on scroll de `docs/scroll.md` (`RevealScope` + `[data-reveal]`), blocos surgindo conforme a rolagem, não em massa após o load — padrão SIS-263 + calibre SIS-269. Não duplicar SIS-197/195/194/189. Sticky (`ProofJourney` etc.) sem wrapper com `transform`. Calibre canônico: `MARGEM = 0px 0px -12% 0px`, `LIMIAR = 0.15`. Sem `esperarRota` em massa. Ordem em `page.tsx` auditada no despacho (hero/BrandGrid/sticky/Contact/Social fora de segundo reveal). Critérios: blocos revelam na vez; sem massa no load; sticky intacto; reduce OK; capturas 1440; lint OK; nota vs SIS-197.

### O que foi feito
Calibre canônico `-12%` / `0.15` em `src/lib/reveal-calibre.ts`; Soluções + Impacto recalibrados. Medido 1440: acendem em scrollY 2480 e 6400, não no load. Sticky intacto. lint/tsc/build OK nos arquivos tocados.

### Conferência
Conferência dispensada a pedido da usuária («não confira»). Issue em In Review **sem** label `conferir` / **sem** `conferido`. Sem comentário de conferente com VEREDITO.

### Arquivos tocados
- `src/lib/reveal-calibre.ts`

---

## SIS-274 — RouteLoadGate · fundo #1273bc + logo HD no lugar de SISTRAN

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-274/routeloadgate-fundo-1273bc-logo-hd-no-lugar-de-sistran

### Pedido
No carregamento de troca de página (`RouteLoadGate`): fundo `#1273bc` (hoje degradê navy `#041b3d` → `#071d36` → `#0a3156` + glow ciano); no lugar de «SISTRAN» (`.wordmark`), a logo `/logosistranaltadefinicao.png`. Cuidado com fundo preto do PNG (mask/blend/alfa). Manter `.signal` se legível. `alt=""` + status «Carregando…». Reduce sem regressão. Fora: outros loaders, favicon, header/footer, SIS-265.

### O que foi feito
Portão: `scripts/medir-portao-sis274.mjs` → `docs/medidas/portao-sis274.json`. Asset: `scripts/gerar-logo-portao-sis274.mjs` → `docs/medidas/logo-portao-sis274.json`.

A premissa do «fundo preto» não se confirmou (mesma constatação da SIS-265). Medido em `public/logosistranaltadefinicao.png`: `hasAlpha` true; pixels em `alpha = 0` **80,6%**; cantos e centro `[0, 0, 0, 0]`; pixels opacos escuros **0**; luminância média dos opacos **254,8 / 255**. Aplicado: só reamostragem premultiplicada + WebP.

**1. Overlay = `#1273bc`.** Medido nos dois caminhos (`key={usePathname()}`): primeiro carregamento (`/`) e clique → `/trabalhe-conosco`: `backgroundColor` `rgb(18, 115, 188)`, `backgroundImage: none` (saiu degradê navy e `radial-gradient` ciano a 14%).

**2. Centro = logo HD, sem texto «SISTRAN».** `textoVisivelDoOverlay: "Carregando…"`. `<img src="/images/loading/logo-sistran-portao.webp">`, `naturalWidth: 320`. A regra `.wordmark` saiu inteira do CSS. O PNG HD é só o símbolo (anel + swoosh), sem letreiro.

**3. Sem caixa preta.** Arquivo derivado achatado sobre `#1273bc`: `cantosTodosIguaisAoFundo: true`, `perimetroForaDoFundo: 0`. Na tela, moldura de 12 px ao redor da caixa 128×128: `pixelMaisEscuroDaMoldura` **`[18, 115, 188]`**; `pixelsForaDoAzul` 144 (grade de 48 px); `piorDesvioPorCanal` 16 (todos clareando).

**4. Nitidez.** DPR 1: arquivo 320 / CSS 128 / razão **2,50**. DPR 2: 256 px de dispositivo, razão **1,25**. `clamp(4.5rem, 16vw, 8rem)`; teto 8 rem = 128 px → lado 320 do asset. Peso: **324.169 → 11.154 bytes (−96,6%)**. `<img>` cru com `eslint-disable` documentado, `width`/`height` intrínsecos. `images: { unoptimized: true }` (SIS-154).

**5. Sinal.** Contraste WCAG 1.4.11 (3:1): `#2ac4ff` **2,48:1** reprova; `#0ed8f6` **2,90:1** reprova; `#fff` **5,00:1** passa. Sinal virou branco: `corDaBarra: rgb(255, 255, 255)`, trilha `rgb(255 255 255 / 0.28)`, halo branco. Grade `::before` de ciano 6% para branco 8%.

**6. Acessível.** `altVazio: true`; `status: { texto: "Carregando…", ariaLive: "polite" }`; `marcaAriaHidden: true`. `backgroundColor: rgba(0,0,0,0)` e `mixBlendMode: normal` no `<img>`.

**7. Reduce.** Media query `reduce` e `html[data-motion="reduce"]`: `animationName` do sinal `none`; largura da barra **240 px**; `transitionDuration` do overlay `1e-05s`; logo 128 px visível. Capturas: `sis274-portao-1440-carregamento.png`, `-troca-de-rota.png`, `-reduce.png`.

**8. Lint.** `npm run lint` → **79 problemas (31 erros, 48 avisos)** — linha de base; zero problemas nos arquivos tocados.

Fora de escopo respeitado. Não resolve: erro TS pré-existente em `src/app/esg/page.tsx` (`TS17008: JSX element 'RevealScope' has no corresponding closing tag`, SIS-271).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/loading/RouteLoadGate.tsx`
- `src/components/loading/RouteLoadGate.module.css`
- `scripts/medir-portao-sis274.mjs`
- `scripts/gerar-logo-portao-sis274.mjs`
- `docs/medidas/portao-sis274.json`
- `docs/medidas/logo-portao-sis274.json`
- `public/images/loading/logo-sistran-portao.webp`

---

## SIS-273 — /solucoes · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-273/solucoes-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll (`docs/scroll.md` / `RevealScope` + `data-reveal`) em `/solucoes`, alinhado a `/contato`, calibre por scroll (SIS-269). Proibido wrapper com `transform` em volta de sticky. Aplicar em blocos estáticos (hero, grades, CTA) sem orquestração. Subrotas `/solucoes/[slug]` fora, salvo se o pedido for só o índice — reportar. Critérios: índice revela ao rolar sem massa no load; sticky intacto; capturas; lint OK.

### O que foi feito
Tudo **medido** (`docs/medidas/sis273-depois.json`, Playwright 1440×900 e 390×844, `window.scrollY` por causa da interpolação do Lenis).

**Índice revela ao rolar, sem massa no load.** 6 nós marcados, em 3 escopos. `animaramForaDaTela: 0` · `piorDistancia: 0` · `semAcender: 0`. 1440×900: `servicos-abertura` acende em `scrollY 1797`, topo a **566px = 63%**; `servicos-cta` em `scrollY 4353`, topo a **757px = 84%**. Pior resíduo dos filhos: −25px. 390×844: `nav-ancoras` em `scrollY 0` (nasce na dobra → `esperarRota`); `servicos-abertura` em `scrollY 3638` (59%); `servicos-cta` em `scrollY 4477` (82%). `invisiveis: 0`.

**Sticky intacto.** 12 amostras: `.svc-journey-stage` e `.svc-journey-intro` presos em `top = 108` enquanto o card avança **0 → 1 → 2 → 3** (`scrollY` 2502 / 2975 / 3434 / 3922). `getComputedStyle().position` = `sticky` nas 12. Nenhum `RevealScope` / `[data-reveal]` é ancestral de um `sticky`. O escopo é o trilho (`.svc-journey-head`), só escreve `data-in`.

**Capturas; lint.** 7 capturas anexadas. `npm run lint` = **79 problems (31 errors, 48 warnings)** — linha de base. `npx eslint` nos três arquivos tocados → **0 problemas**. `npx tsc --noEmit` → exit 0. `npx next build` → exit 0.

**Os três escopos:** `nav-ancoras` (barra «Nesta página», `src/app/solucoes/page.tsx`, padrão + `esperarRota`); `servicos-abertura` (trilho sticky, `src/components/ui/ServicesJourneyStage.tsx`, par do trilho); `servicos-cta` («Quero um serviço exclusivo», padrão). Calibre: `src/app/solucoes/reveal-calibre.ts` — `MARGEM_REVEAL '0px 0px -12% 0px'` / `LIMIAR_REVEAL 0.15`, mais `LIMIAR_REVEAL_TRILHO 0` + `MARGEM_REVEAL_TRILHO '0px 0px -36% 0px'` (trilho ~2.200px; 15% viraria ponto arbitrário). 1ª volta −28% deixou 2º parágrafo 39px abaixo da dobra; −36% dá resíduo **0**.

**Não marcados:** `PageHero` (LCP, 14 rotas); `Accelerators` (`whileInView`); `Consulting` (`whileInView`); `ContactCTA` (`vFadeUp` + `whileInView`); os 4 cards da pilha (`sticky` / `is-active`). Subrotas `/solucoes/[slug]` (7) **fora**. Reduce: 6 marcados, **0 invisíveis**, pior opacidade **1**. Sem JS: idem.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/solucoes/reveal-calibre.ts`
- `src/app/solucoes/page.tsx`
- `src/components/ui/ServicesJourneyStage.tsx`

---

## SIS-271 — /esg · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-271/esg-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll em toda `/esg`, padrão `/contato` (SIS-263), calibre por scroll (SIS-269). Blocos típicos: hero/capa (LCP sem reveal longo), intro ESG, ENVIRONMENT / SOCIAL / GOVERNANCE (stagger leve; não quebrar SIS-237/252), Fale com a Gente!. Não envolver sticky/`fixed` com `transform`. Reduce OK. Critérios: revela conforme o scroll; sem regressão nos cards/foguete; capturas; lint OK.

### O que foi feito
Medido no Chromium 1440×900. JSON em `docs/medidas/sis271-depois.json`.

**Página revela conforme o scroll.** Oito escopos: Intro ESG `scrollY` 79 (332px); ENVIRONMENT parágrafo 787 (130px); ENVIRONMENT 6 cartões 1144 (598px); SOCIAL Gerando Talentos 2229 (552px); SOCIAL 2 projetos 2719 (512px); GOVERNANCE parágrafo 3514 (65px); GOVERNANCE 6 cartões 3848 (646px); Fale com a Gente! 4585 (286px). `semAcender: 0` (26 nós).

Dos 26 nós, **1** ainda TERMINA a animação abaixo da dobra, a **165px** (último parágrafo do Gerando Talentos). 1ª volta com limiar 0.15: **9 de 26**, pior caso 283px (segunda fileira das grades + cauda da coluna). Correção: `LIMIAR_REVEAL_BLOCO = 0.35` nos três escopos altos (desloca ignição 110–129px). Conta no docblock de `src/app/esg/reveal-calibre.ts`. Comparação: `/contato` pós-SIS-269 ficou em 2 de 15, pior 207px.

**Sem regressão nos cards / foguete.** Flutuação (SIS-252): seis amostras a 260ms, `translateY` 6.87 → 5.95 → 4.53 → 2.76 → 0.74 → −1.59px. Hover (SIS-237): `.esg-superficie` `transform: none` sem ponteiro e `matrix(1.02, 0, 0, 1.02, 0, -12)` com ele. `data-reveal` no WRAPPER, nunca na `.esg-superficie`; preset `fade`, nunca `fade-up`. Foguete SOCIAL irmão anterior do `.container-lp`, nunca descendente de `[data-reveal]`.

**Capturas; lint.** Três anexadas (ENVIRONMENT meio/fim + Fale com a Gente!). `npx tsc --noEmit` sem saída. `npx eslint src/app/esg src/components/ContactCTA.tsx src/components/ContactCTAReferencia.tsx` sem saída. `npm run lint` do projeto: **80 problemas (31 erros, 49 avisos)** — linha de base de antes; nenhum nos arquivos desta issue.

**Reduce / sem JS:** `prefers-reduced-motion: reduce` → 26 nós, **0 com `opacity < 0.99`**. JS desligado → 26 marcados, **0 invisíveis**.

**Não marcados:** capa (LCP); três `TituloAceso`; `GaleriaTurmas` + `FogueteScroll`. `ContactCTA` / `ContactCTAReferencia`: prop opt-in `revelar`.

**Ressalva fora de escopo:** `scripts/medir-intro-esg-sis261.mjs` mira nós que agora nascem com `opacity: 0` e espera 400ms enquanto o reveal leva 500ms + cascata.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/reveal-calibre.ts`
- `src/app/esg/page.tsx`
- `src/components/ContactCTA.tsx`
- `src/components/ContactCTAReferencia.tsx`

---

## SIS-270 — /trabalhe-conosco · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-270/trabalhe-conosco-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar `RevealScope` + `[data-reveal]` em toda `/trabalhe-conosco`, espírito da SIS-263. Não copiar o calibre quebrado da 2ª volta de `/contato` (`+12%` + limiar `0.08` + `esperarRota` em todos). Preferir calibre SIS-269. Auditar abertura (LCP), `CurriculoCard` (já tem cortina GSAP), `Social`. Marcar blocos, não palavras. Reduce / sem JS = visível. Critérios: seções revelam ao rolar, não em massa; sem colisão com form/hero; capturas; lint OK.

### O que foi feito
Portão: `scripts/medir-reveal-carreira-sis270.mjs` → `docs/medidas/reveal-carreira-sis270.json`. 1440×900.

A rota tem **1970px** (2,2 janelas). `.cv-secao` topo 240, altura 456, já tem cortina GSAP `clip-path` (`ScrollTrigger`, `top 82%`); `.carreira-beneficios` 577 / 55, **nenhuma** entrada; `.carreira-slogan` 671 / 18, **nenhuma**; `#social` 792 / 736, `whileInView`. Três dos quatro já animavam; os dois sem animação somam 73px, ambos na primeira dobra. §6 de `docs/scroll.md` proíbe marcar o resto.

Um único escopo, `RevealScope esperarRota data-reveal-nome="abertura"`, sobre a lista de benefícios (3 `<li>` em `fade-up`, `--reveal-i` 0–2) e o slogan (`fade-up` + `line-up`, `--reveal-i` 3). `esperarRota` porque o bloco está na primeira dobra (topo 577 numa janela de 900).

**Critérios:** `semSegundoReveal: { curriculo: 0, social: 0, tituloDoHero: 0 }`. `ordemCortina: { msCortinaLevantou: 2671, msEscopoAcendeu: 2796, acendeuDepoisDaCortina: true }`. Reduce: 5 nós em `opacity 1 / transform none` com `html[data-motion="reduce"]`; `semJsMarcados: 5`. `npm run lint` = **79 problems (31 errors, 48 warnings)**, linha de base. Capturas `docs/capturas/sis270-carreira-1440-topo.png` e `…-abertura.png`. «Seções revelam ao rolar»: `linhaDoTempo: [{ nome: 'abertura', scrollY: 0 }]` — o escopo marcado acende em `scrollY: 0` (primeira dobra). O fecho acende em `scrollY: 500` (não é obra desta issue). Não há bloco fora da dobra sem entrada própria.

Calibre da casa: `margem: '0px 0px -12% 0px'`, `limiar: 0.2`. `/contato` não tocado.

**Correções ao próprio rascunho:** (1) `VP_SCROLL` / `entradaPorScroll` em `Social`/`CartaoDuasFaces` removidos — hipótese falsa (`scrollYQuandoAcendeu` = 400 com e sem). (2) Defeito pré-existente: `reduceFecho: "0"` — com reduce, o `<h2>` do fecho fica invisível; medido com `git stash` igual; pede issue própria.

`npx tsc --noEmit`: um erro em `src/app/esg/page.tsx(550,12)` (`RevealScope` sem closing tag) — SIS-271, não tocado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/lib/motion.ts`
- `scripts/medir-reveal-carreira-sis270.mjs`
- `docs/medidas/reveal-carreira-sis270.json`

---

## SIS-269 — /contato · reveal deve acompanhar o scroll (não tudo após o load)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-269/contato-reveal-deve-acompanhar-o-scroll-nao-tudo-apos-o-load

### Pedido
Em `/contato` o reveal (SIS-263) dispara quase tudo de uma vez após o load (cortina do `RouteLoadGate`). Desejado: cada bloco só surge quando a rolagem o aproxima. Diagnóstico: `MARGEM_REVEAL = '0px 0px 12% 0px'` positiva, `LIMIAR_REVEAL = 0.08`, `esperarRota` em todos. Recalibrar (margem negativa ~−8% a −12%, limiar ~0.15–0.2) ou `esperarRota` só no 1º bloco. Provar timeline. Atualizar `reveal-calibre.ts` + docblocks. Reduce + sem JS; LCP do hero sem segundo reveal. Fora: outras rotas, redesign.

### O que foi feito
Medido a **1440×900**, `MutationObserver` em `data-in` antes da cortina, `data-route-liberado="true"`, `mouse.wheel` em passos de **60px**. Rota 4280px; 5 escopos `RevealScope`, 15 nós `[data-reveal]`.

O diagnóstico da issue estava certo no mecanismo e errado no sintoma: não era cascata global no `liberado`. Escopos em `scrollY≈0`: **1** de 5 antes e depois. Nós que animam **abaixo da dobra**: **8** de 15 → **2** de 15. Pior distância: **450px** → **207px**. No load só a faixa de indicadores acendia (61% na tela). Com margem positiva 12% (raiz +108px abaixo da dobra) e limiar 0.08, oito nós terminavam a animação antes de entrar na tela.

`src/app/contato/reveal-calibre.ts`: `MARGEM_REVEAL` `'0px 0px 12% 0px'` → **`'0px 0px -12% 0px'`** (≈ `top 88%`). `LIMIAR_REVEAL` `0.08` → **`0.15`** (não 0.2). Cinco escopos acendem com o topo entre **72% e 84%** (963px→72%, 784px→75%, 480px→80%, 221px→84%). `esperarRota` só no 1º bloco da dobra (`MetricsBand`). Duração 820ms, curva expo-out e cascata de 95ms intactas.

Timeline depois: indicadores `scrollY` **0**; faixa de parceiros 257 (era 32); painel 584 (era 298); mapa **1650** (era 1387); `#timeSISTRAN` **2513** (era 2277).

Portões: 1 de 5 em `scrollY 0`; medidas em `docs/medidas/sis269-antes.json` e `sis269-depois.json`; reduce e sem JS: **0** de 15 com opacidade < 0.99; LCP do hero sem segundo reveal; `npx eslint src/app/contato src/components/MetricsBand.tsx` e `npx tsc --noEmit` limpos; `npm run lint` **79 problemas (31 erros, 48 avisos)** pré-existentes. Docblocks «3ª volta» em `page.tsx` e `MetricsBand.tsx`.

**Não resolvido:** 2 nós animando abaixo da dobra (79px e 207px) — 3º e 4º parágrafo de `#timeSISTRAN`, granularidade de escopo. Nenhuma outra rota tocada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/reveal-calibre.ts`
- `src/app/contato/page.tsx`
- `src/components/MetricsBand.tsx`
- `docs/medidas/sis269-antes.json`
- `docs/medidas/sis269-depois.json`

---

## SIS-266 — Footer · item ativo na coluna Navegação conforme a página

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-266/footer-item-ativo-na-coluna-navegacao-conforme-a-pagina

### Pedido
Na coluna **Navegação** do footer, o item da página atual deve aparecer selecionado. Hoje todos os `Link` em `Footer.tsx` usam a mesma classe, sem `usePathname` / `aria-current`. Match: pathname igual ao `href` ou prefixo (`/solucoes/...` acende Soluções; `/blog` não). Visual: contraste no azul (branco + `font-semibold` e/ou underline / ciano `#0ed8f6`). `aria-current="page"`. Preferir extrair `matchActive` compartilhado com o header. Home (`/`): nenhum item acende. Critérios: cada rota da lista com o link certo; subrotas de Soluções acendem «Soluções…»; contraste OK no `#1273BC`; capturas 1440 em ≥2 rotas; lint OK.

### O que foi feito
Portão: `scripts/medir-rodape-ativo-sis266.mjs` → `docs/medidas/rodape-ativo-sis266.json`. Sete rotas da lista + `/transformacao-legado`, `/sistran-labs`, `/`, `/blog` a 1440×900.

**1. Detectar e marcar.** `src/components/layout/RodapeNav.tsx` (`usePathname`). Em cada uma das sete rotas exatamente **1** item aceso e o certo (`confere: true` nas 11 rotas). `/transformacao-legado` acende Soluções sem `aria-current`; `/sistran-labs` acende Quem somos sem `aria-current`; `/` e `/blog` nenhum.

**2. Match.** `matchActive`: `pathname === href || pathname.startsWith(href + '/')`. `/` só por igualdade. `institucionalComEstado: 0` nas 11 rotas. Subrota `/transformacao-legado` é filha declarada em `data/nav.ts`, não prefixo de `/solucoes` — `ramoAtivo` resolve.

**3. Visual.** Estado de hover fixado: seta ciana `→` + sublinhado `#0ed8f6` (bloco SIS-59), mais branco + `font-semibold`. Fundo composto `rgb(18, 115, 188)`: **ativo 5,00:1**, inativo 4,27:1. Correção de estimativa: `--ink-muted` do rodapé é `#E2EFFA`; 5,00 vs 4,27 não se lê pela cor — quem carrega o estado é sublinhado + seta + peso. Exceção a `.lp-rodape-nav:hover li:not(:hover) a { opacity: .55 }` em 0.8 para o ativo.

**4. `aria-current="page"`** só no ativo das sete rotas da lista. Nas rotas-filhas o pai acende **sem** `aria-current` (mesma separação do header).

**5. Extração.** `src/lib/navAtivo.ts` com `matchActive` + `ramoAtivo`, lógica inalterada. `Header.tsx` importa daqui. Módulo sem `'use client'`. `Footer.tsx` **continua Server Component**; só a lista de sete links é cliente.

**Portões:** capturas `docs/capturas/sis266-rodape-1440-esg.png` e `…-contato.png`. `npx tsc --noEmit` limpo. `npx eslint` nos tocados: 0 erros (3 avisos pré-existentes em `Header.tsx`). `npm run lint`: **79 problemas (31 erros, 48 avisos)** — mesmo número da árvore limpa.

Fora de escopo: coluna Institucional, redesenho, logo HD, home.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/lib/navAtivo.ts`
- `src/components/layout/RodapeNav.tsx`
- `scripts/medir-rodape-ativo-sis266.mjs`
- `src/components/Footer.tsx`
- `src/components/Header.tsx`
- `src/app/globals.css`

---

## SIS-265 — /esg · Fale com a Gente!: logo HD logosistranaltadefinicao.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-265/esg-fale-com-a-gente-logo-hd-logosistranaltadefinicaopng

### Pedido
Em `/esg`, na seção **Fale com a Gente!** (`ContactCTA` com `layoutReferencia`), trocar `/images/sistran-logo.png` por `/logosistranaltadefinicao.png` em `ContactCTAReferencia.tsx`. Conferir `width`/`height` / fundo preto (não deixar caixa preta no cartão claro). Follow-up da SIS-253; não reabrir motion/layout. Fora: favicon, `CompanySignature`, BrandGrid, substituição global. Critérios: símbolo usa o HD; sem caixa/preto; nitidez melhor em 1440; demais rotas intactas; lint OK.

### O que foi feito
Entrega sem conferência (pedido explícito).

**Selo `/esg` Fale com a Gente!** `src` = `/images/esg/logo-sistran-cta.webp` (640×640, 27,8 KB). Fonte HD `public/logosistranaltadefinicao.png` (1254×1254) **já tem alfa** — o «fundo preto» é RGB 0,0,0 sob pixels transparentes. Sem threshold (estragaria antisserrilha). `width`/`height` 220×220.

Medido a 1440 no recorte do selo: 0% pixels escuros, símbolo branco no blob azul. Outras rotas seguem com `sistran-logo.png`.

**Portões.** tsc/build OK. lint/`test:copy` vermelhos por arquivos concorrentes (`RevealScope`, etc.); arquivos desta issue limpos. Não conferida.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ContactCTAReferencia.tsx`

---

## SIS-264 — /trabalhe-conosco · tipografia maior + limpar copy do form e faixas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-264/trabalhe-conosco-tipografia-maior-limpar-copy-do-form-e-faixas

### Pedido
Em `/trabalhe-conosco`: (1) aumentar tipografia da abertura (eyebrow Carreira, título/highlight, description, `.carreira-beneficios`, `.carreira-slogan`) em `page.tsx` + `.hero-backdrop--carreira` / `.carreira-*` em `globals.css`; (2) remover faixas verticais `.carreira-vertical--meio` e `--direita`; (3) no `CurriculoCard`: título «Trabalhe conosco» em negrito; tirar «Leva menos de 2 minutos»; tirar checkbox de Política de Privacidade; botão «Enviar». Formulário ainda envia (demo) sem o checkbox. Fora: SIS-258, redesign do card, Contato/Social. Critérios: escritas maiores em desktop e legíveis no mobile; faixas ausentes; copy do form conforme pedido; lint OK; captura 1440.

### O que foi feito
Entrega sem conferência (pedido explícito).

**Tipografia (1440).** Eyebrow 12→14px; h1 teto 48→55px; descrição 20→22px; benefícios 12→14px; slogan 10→12px. Escala só na rota (`.hero-backdrop--carreira` / `.carreira-*`); `PageHero` global intacto. Mobile: h1 42px, sem estouro da manchete.

**Faixas.** `.carreira-vertical*` removidas do JSX e CSS.

**Form.** Título «Trabalhe conosco» peso 700; sem «Leva menos de 2 minutos»; sem checkbox de Política; CTA «Enviar». `privacyNote` de demonstração no pé permanece. Envio demo não exige `privacidade`.

**Portões.** lint 0 erros, tsc/build/`test:copy` OK.

Captura: `docs/medidas/sis264/1440.png`.

Ressalva: a 1440 o botão Enviar pode nascer com opacity 0 no primeiro frame da timeline GSAP do card (SIS-223/258) — fora deste pedido. Não conferida.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/app/globals.css`
- `src/components/CurriculoCard.tsx`
