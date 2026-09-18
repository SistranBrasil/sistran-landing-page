/**
 * SIS-293 — O CALIBRE DO REVEAL DE `/sistran-labs`.
 *
 * A rota NÃO TINHA este arquivo, e a nota do `ContactCTA` da `page.tsx` registrava
 * isso ao explicar por que o fecho não recebia `revelar`: sem calibre da rota,
 * inventar um par de números no ponto de uso faria o trabalho da issue de reveal
 * desta página. Ele nasce aqui porque a SIS-293 é a primeira issue da rota que
 * PEDE entrada por scroll — e nasce com o par canônico, não com números novos.
 *
 * Um arquivo por rota é o padrão de `/contato` (SIS-263 + SIS-269), `/esg`
 * (SIS-271), `/solucoes` (SIS-273) e `/sistran-university` (SIS-289).
 *
 * ── O PAR É REEXPORTADO, NÃO REESCRITO ────────────────────────────────────
 *
 * `MARGEM_REVEAL` (`0px 0px -12% 0px`) e `LIMIAR_REVEAL` (`0.15`) vêm de
 * `src/lib/reveal-calibre.ts`, o canônico pós-SIS-269, e a razão de cada número
 * está no docblock de lá: a margem é NEGATIVA porque positivo estende a raiz
 * abaixo da dobra e é assim que se produz o defeito que a SIS-269 nomeia (o bloco
 * termina a animação fora da tela e, quando a pessoa chega, já está parado), e
 * 0.15 é o limiar com que os escopos medidos em `/contato` acendiam com o topo
 * entre 72% e 84% da viewport. É o item 3 da SIS-293 por escrito («não dispara
 * tudo no load; calibre -12% / 0.15»).
 *
 * ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ────────────────────────────────────────
 *
 * NÃO HÁ SEGUNDO LIMIAR de bloco alto (o `LIMIAR_REVEAL_BLOCO` de `/esg`), e não
 * é esquecimento: ele existe lá porque três escopos passavam de 550px de altura e
 * 15% deles acendia a fileira de baixo já fora da tela. Aqui a galeria resolve o
 * mesmo problema por OUTRO caminho — cada foto é o seu próprio escopo (ver a nota
 * na `page.tsx`), então nenhum escopo tem mais de uma figura e 15% de cada um é
 * uma fração da tela, medida na sonda.
 *
 * DURAÇÃO E CURVA não são afinadas em escopo. A galeria pede duração maior por
 * ser mídia grande (§4.2 de `docs/scroll.md`), e isso está resolvido onde é do
 * elemento: `--reveal-dur` na regra `.labs-ambiente-figura` do `globals.css`, com
 * o token `--motion-reveal-slow` que o projeto já tem. Pôr o número aqui o
 * aplicaria a qualquer escopo futuro da rota, inclusive a blocos de texto.
 *
 * `esperarRota` NÃO É USADO. O contrato que a SIS-269 fixou é «espera = estou na
 * dobra e a cortina do `RouteLoadGate` me esconderia». A dobra desta rota é a capa
 * (`HeroImageBackdrop` + `PageHero`), que não recebe reveal por ser o LCP (§3 de
 * `docs/scroll.md`); a galeria é a terceira seção e nasce mais de uma tela abaixo.
 */
export { MARGEM_REVEAL, LIMIAR_REVEAL } from '@/lib/reveal-calibre';
