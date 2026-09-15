/**
 * SIS-271 — O CALIBRE DO REVEAL DE `/esg`, num lugar só.
 *
 * Mora aqui, e não repetido nos três arquivos que a rota toca (`page.tsx`, e o
 * par `ContactCTA`/`ContactCTAReferencia`, que recebe estes valores por prop),
 * pela razão que o gêmeo de `/contato` registra: calibre duplicado é a classe de
 * defeito em que a primeira correção deixa metade da página numa cadência e a
 * outra metade noutra, e ninguém percebe olhando um arquivo só.
 *
 * ── OS NÚMEROS SÃO OS MESMOS DE `/contato`, E ISSO É DELIBERADO ────────────
 *
 * A SIS-271 pede o padrão da SIS-263 «com calibre por scroll (SIS-269)». Os dois
 * valores abaixo são exatamente o que a SIS-269 MEDIU em `/contato`
 * (`docs/medidas/sis269-antes.json` / `-depois.json`), e a medida não é sobre
 * aquela rota — é sobre a geometria da dobra:
 *
 * `MARGEM: '0px 0px -12% 0px'` — NEGATIVO. Positivo estende a raiz ABAIXO da
 * dobra, e foi assim que 8 dos 15 nós de `/contato` terminavam a animação fora
 * da tela (o pior a 450px abaixo dela): quando a pessoa chega ali o bloco já
 * está parado, e é isso que se descreve como «surgiu tudo depois do
 * carregamento». O §4.1 de `docs/scroll.md` chama o negativo de «discreto,
 * dispara depois de entrar» — é o que se quer quando o defeito é surgir cedo.
 * É também o padrão do `RevealScope`; escrever explícito serve para o dia em que
 * o padrão mudar sem esta rota ser relida.
 *
 * `LIMIAR: 0.15` — e não os 0.2 do padrão nem os 0.08 da 2ª volta da SIS-263. O
 * limiar é fração DO ELEMENTO, então a mesma fração é espera de rolagem muito
 * diferente para um `<ul>` de seis cartões e para um parágrafo de três linhas.
 * Com 0.15 os escopos medidos em `/contato` acendiam com o topo entre 72% e 84%
 * da viewport (963px → 72%; 221px → 84%): faixa estreita o bastante para ler
 * como uma cadência só, e toda ela DENTRO da tela.
 *
 * ── E POR QUE HÁ UM SEGUNDO LIMIAR, MEDIDO NESTA ROTA ─────────────────────
 *
 * `LIMIAR_REVEAL_BLOCO: 0.35` vale nos TRÊS ESCOPOS ALTOS de `/esg` (as duas
 * `<ul>` de seis cartões, 598px e 646px, e a grade do Gerando Talentos, 552px).
 * Não é gosto: é a consequência aritmética de o limiar ser fração DO ELEMENTO.
 *
 * A 1ª volta desta issue rodou tudo com 0.15 e a sonda (`sonda-sis271.mjs`)
 * mediu 9 dos 26 nós marcados TERMINANDO a animação abaixo da dobra, pior caso
 * 283px. Os nove não estavam espalhados — eram a SEGUNDA FILEIRA de cada grade
 * (+89/88/84 na ENVIRONMENT, +125/125/125 na GOVERNANCE) e a cauda da coluna de
 * texto do Gerando Talentos (+47 no `<h3>`, +107 e +283 nos parágrafos). Em
 * escopo de 600px, 15% são 90px de cruzamento: a `<ul>` acende com o topo dela
 * ainda alto, e a fileira de baixo — que fica ~295px abaixo desse topo — nasce
 * fora da tela e já está parada quando a pessoa chega nela. É exatamente o
 * defeito que a SIS-269 nomeia, em versão pequena.
 *
 * 0.35 desloca a ignição desses escopos em `(0.35 − 0.15) × altura` ≈ 110–129px,
 * o bastante para trazer as duas fileiras de baixo para dentro da tela sem que a
 * fileira de cima passe a acender no meio do quadro (ela sai de ~686px da
 * viewport para ~566px — ainda na metade de baixo, que é onde o reveal deve
 * começar). Medido depois em `docs/medidas/sis271-depois.json`.
 *
 * Fica UM resíduo declarado: o último parágrafo do Gerando Talentos ainda termina
 * 165px abaixo da dobra. É granularidade de escopo, não calibre — a coluna de
 * texto é mais alta que o passo de ignição de qualquer limiar único, e o preço de
 * consertar por calibre seria acender o selo e o `<h3>` no meio da tela. Dar um
 * escopo a cada parágrafo (cinco observadores para uma cascata só) é o custo que
 * a nota do escopo 3 justifica não pagar.
 *
 * ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ────────────────────────────────────────
 *
 * `esperarRota` NÃO É USADO EM NENHUM ESCOPO desta rota. O contrato que a
 * SIS-269 fixou é «espera = estou na dobra e a cortina do `RouteLoadGate` me
 * esconderia», e em `/esg` o bloco da dobra é a CAPA — que não recebe reveal
 * nenhum, por ser o LCP (a issue pede isso explicitamente). Todo escopo marcado
 * aqui nasce abaixo da dobra, com a rota travada no topo
 * (`data-route-scroll-locked`) enquanto a cortina está no ar: nenhum deles chega
 * perto da raiz antes de a pessoa rolar, então a espera custaria os cinco
 * observadores nascendo no mesmo instante sem proteger nada.
 *
 * Duração e curva também não estão: `/contato` as afinou (820ms, expo-out)
 * porque a 2ª volta da SIS-263 pediu «mais fluido» POR ESCRITO. A SIS-271 não
 * pede, e os 500ms de `--motion-reveal-base` mais os 80ms de
 * `--motion-stagger-reveal` são os tokens do projeto. Inventar uma terceira
 * cadência sem pedido é o que faz a próxima issue ter três lugares para corrigir.
 */
export const MARGEM_REVEAL = '0px 0px -12% 0px';
export const LIMIAR_REVEAL = 0.15;
/** Escopos altos (as duas grades de seis cartões e a grade do Gerando Talentos). */
export const LIMIAR_REVEAL_BLOCO = 0.35;
