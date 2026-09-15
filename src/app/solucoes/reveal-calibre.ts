/**
 * SIS-273 — O CALIBRE DO REVEAL DE `/solucoes`, num lugar só.
 *
 * Mesmo argumento dos gêmeos de `/contato` (SIS-263/269) e `/esg` (SIS-271):
 * calibre duplicado é a classe de defeito em que a primeira correção deixa
 * metade da página numa cadência e a outra metade noutra, e ninguém percebe
 * olhando um arquivo só. Aqui os dois consumidores são `page.tsx` e
 * `ui/ServicesJourneyStage.tsx`.
 *
 * ── O PAR PADRÃO É O MESMO DAS OUTRAS DUAS ROTAS, DELIBERADAMENTE ──────────
 *
 * `MARGEM_REVEAL: '0px 0px -12% 0px'` — NEGATIVO. Positivo estende a raiz
 * ABAIXO da dobra e é assim que se produz o defeito que a SIS-269 nomeia: o
 * bloco termina a animação fora da tela e, quando a pessoa chega, já está
 * parado. O §4.1 de `docs/scroll.md` chama o negativo de «discreto, dispara
 * depois de entrar».
 *
 * `LIMIAR_REVEAL: 0.15` — o limiar é fração DO ELEMENTO, e com 0.15 os escopos
 * medidos em `/contato` acendiam com o topo entre 72% e 84% da viewport. É a
 * faixa que lê como uma cadência só, e toda ela DENTRO da tela.
 *
 * ── E POR QUE HÁ UM PAR SÓ PARA O TRILHO DA PILHA DE SERVIÇOS ─────────────
 *
 * O escopo da abertura de «Serviços» não é um bloco de página: é o TRILHO da
 * pilha `sticky` (`.svc-journey-head`, `position: absolute` com `inset: 0 0
 * calc(--svc-tail + --svc-gap) 0`), e a altura dele é a coluna inteira dos
 * quatro cards — vários viewports. Nessa geometria o limiar como fração deixa
 * de significar algo: 15% de uma caixa de ~3.000px são 450px de cruzamento, e
 * qualquer número entre 0.05 e 0.9 vira um ponto de ignição arbitrário que
 * ninguém consegue justificar lendo o CSS.
 *
 * Então este par troca de eixo: `LIMIAR_REVEAL_TRILHO = 0` faz o gatilho
 * depender só do CRUZAMENTO da borda, e `MARGEM_REVEAL_TRILHO = '0px 0px -36%
 * 0px'` encolhe a raiz por baixo, o que traduz o disparo para uma frase
 * geométrica e independente da altura: «acende quando o topo do trilho alcança
 * 64% da janela» — medido em 63% a 1440×900 e 59% a 390×844 (o `%` de
 * `rootMargin` é fração da RAIZ, e a rolagem do Lenis para em passos, então a
 * medida cai um ou dois pontos acima do nominal).
 *
 * OS 64% SÃO MEDIDOS, e não a faixa de 72%–84% de `/contato`. A 1ª volta usou
 * −28% (topo a 70%) e a sonda mostrou o SEGUNDO parágrafo da abertura terminando
 * 39px abaixo da dobra: o bloco de quatro nós é mais alto que os 30% de janela
 * que sobravam. −36% dá 324px de folga para os ~309px do bloco, e o resíduo foi a
 * zero nas duas larguras (`docs/medidas/sis273-depois.json`). Acender um pouco
 * mais tarde não custa nada AQUI justamente porque o alvo é um título `sticky`:
 * ele fica na tela pelo resto da seção, então o que importa é ele não nascer com
 * a última linha já fora do quadro.
 *
 * Por que não usar simplesmente um escopo próprio, mais baixo, em volta do
 * `<header>`: porque o `<header>` é o `sticky`, e o curso de um `sticky` é a
 * altura do PAI. Um `RevealScope` entre o trilho e ele passaria a ser esse pai
 * — com altura de conteúdo — e o título deixaria de acompanhar a pilha. É o
 * mesmo motivo pelo qual o escopo NÃO pode ser um invólucro em volta do trilho:
 * ali ele ficaria fora do fluxo, com altura ZERO, e um `IntersectionObserver`
 * com limiar > 0 sobre um alvo de área zero nunca dispara (razão sempre 0). O
 * escopo é o próprio trilho, e é por isso que o par de calibre existe.
 *
 * ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ───────────────────────────────────────
 *
 * `esperarRota` não é calibre de rota, e por isso não mora aqui: é decisão POR
 * ESCOPO, escrita onde o escopo está. O contrato da SIS-269 é «espera = estou na
 * dobra e a cortina do `RouteLoadGate` me esconderia», e nesta rota isso vale
 * para exatamente UM escopo — a barra de âncoras, cujo topo foi medido a 582px do
 * documento numa janela de 844 (`/solucoes` a 390px de largura), ou seja dentro
 * da dobra. Os outros dois nascem abaixo dela, com a rota presa no topo
 * (`data-route-scroll-locked`) enquanto a cortina está no ar, e não esperam nada.
 * O `PageHero` da dobra não recebe reveal nenhum: é o LCP e já tem entrada
 * própria por `variants`.
 *
 * Duração e curva também não: `/contato` as afinou (820ms, expo-out) porque a 2ª
 * volta da SIS-263 pediu «mais fluido» POR ESCRITO. A SIS-273 não pede, e os
 * 500ms de `--motion-reveal-base` com os 80ms de `--motion-stagger-reveal` são
 * os tokens do projeto. Inventar uma terceira cadência sem pedido é o que faz a
 * próxima issue ter três lugares para corrigir.
 */
export const MARGEM_REVEAL = '0px 0px -12% 0px';
export const LIMIAR_REVEAL = 0.15;

/** O trilho da pilha `sticky` de serviços — ver a seção do docblock acima. */
export const MARGEM_REVEAL_TRILHO = '0px 0px -36% 0px';
export const LIMIAR_REVEAL_TRILHO = 0;
