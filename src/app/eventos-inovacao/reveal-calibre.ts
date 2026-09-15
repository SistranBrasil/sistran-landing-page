/**
 * SIS-272 — O CALIBRE DO REVEAL DE `/eventos-inovacao`, num lugar só.
 *
 * Mora aqui, e não dentro de `src/components/EventsSpotlight.tsx`, pelo mesmo
 * arranjo que `src/components/MetricsBand.tsx` já usa com
 * `src/app/contato/reveal-calibre.ts`: a cena é montada EXCLUSIVAMENTE por esta
 * rota (conferido — `EventsSpotlight` tem um único `import` no projeto, em
 * `./page.tsx`), então o calibre pode viver na pasta da rota, que é onde alguém
 * o procura. Calibre solto no componente é a duplicação que os dois gêmeos
 * (`/contato` e `/esg`) registram: a primeira correção deixa metade da rota numa
 * cadência e a outra metade noutra.
 *
 * ── OS DOIS PRIMEIROS NÚMEROS SÃO OS DA SIS-269, LITERALMENTE ──────────────
 *
 * `MARGEM_REVEAL` e `LIMIAR_REVEAL` são byte por byte o que `/contato`
 * (SIS-269) e `/esg` (SIS-271) publicam, e a razão é a mesma que o gêmeo de
 * `/esg` escreve: a medida da SIS-269 não é sobre aquela rota, é sobre a
 * geometria da dobra. Margem NEGATIVA porque positiva estende a raiz abaixo da
 * dobra e faz o bloco terminar a animação fora da tela (8 dos 15 nós de
 * `/contato`, o pior a 450px abaixo dela); limiar 0.15 porque 0.2 é espera
 * diferente demais entre um bloco alto e um rótulo, e 0.08 é «encostou».
 * Escrito explícito, e não deixado no `default` do `RevealScope`, para o dia em
 * que o padrão mudar sem esta rota ser relida — a régua do gêmeo de `/esg`.
 *
 * ── E POR QUE HÁ UM TERCEIRO, MEDIDO NESTA ROTA ───────────────────────────
 *
 * `MARGEM_REVEAL_NO_PALCO` existe porque esta rota tem uma geometria que nem
 * `/contato` nem `/esg` têm: o capítulo dominante é um `position: sticky` de
 * 8.100px (1440×900; 6.912px em 768 de altura), e TUDO que se lê mora dentro
 * dele. Um nó preso num palco `sticky` não rola — o palco rola, e o nó fica
 * parado na janela. Com isso o `IntersectionObserver` do reveal deixa de medir
 * a posição do NÓ e passa a medir a do PALCO, que é constante enquanto ele está
 * grudado.
 *
 * A conta, medida e não deduzida (`docs/medidas/reveal-eventos-sis272.json`,
 * corrida com a margem negativa): o contador fica a 827px do topo do palco numa
 * janela de 900. Assim que o palco gruda (`scrollY 558`), o contador congela em
 * y=827 na janela. A margem de `-12%` encolhe a raiz para 792px de altura —
 * 827 > 792, então o contador NUNCA cruza a raiz enquanto o palco está preso.
 * Ele só acendeu quando o palco SOLTOU, no fim da cena: **`scrollY` 7800**, com
 * a rota inteira já rolada. Na prática isso esconderia o «01 / 15» e o «ROLE
 * PARA EXPLORAR» — o indicador de posição e a instrução da cena — durante os
 * 8.100px em que eles são úteis, para revelá-los na saída.
 *
 * `'0px 0px 0px 0px'` é a linha de cima da tabela do §4.1 de `docs/scroll.md`
 * («dispara exatamente na borda inferior»). Com ela a raiz volta a ter a altura
 * da janela, e o contador cruza a borda ANTES de o palco grudar: acende em
 * `scrollY` ~497 contra os 558 da grudada, ou seja no gesto em que a cena chega.
 * NÃO é a margem positiva que a SIS-269 condenou — positiva estende a raiz para
 * FORA da janela e faz a animação terminar onde ninguém vê; esta apenas devolve
 * a raiz ao tamanho da janela, e o nó acende dentro dela.
 *
 * A janela entre acender e grudar é estreita por construção e não por sorte: ela
 * vale `altura da janela − distância do contador ao topo do palco − limiar × altura
 * do contador`, e os dois primeiros termos saem do mesmo `100svh` do palco. Medida
 * em 58px a 1440×900 e 54px a 1366×768 — o mesmo gesto nas duas.
 *
 * ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ────────────────────────────────────────
 *
 * DURAÇÃO E CURVA não estão. `/contato` as afinou (820ms, expo-out) porque a 2ª
 * volta da SIS-263 pediu «mais fluido» POR ESCRITO; a SIS-272 não pede, e os
 * blocos desta rota são os pequenos para os quais os 500ms de
 * `--motion-reveal-base` já são calibrados (§4.2: quanto maior o elemento, maior
 * a duração — aqui o maior tem 77px). Inventar uma terceira cadência sem pedido é
 * o que faz a próxima issue ter três lugares para corrigir.
 *
 * `esperarRota` não é constante porque não é calibre, é contrato de POSIÇÃO:
 * «espera = estou na dobra e a cortina do `RouteLoadGate` me esconderia». Qual
 * escopo está na dobra é medida desta rota e está anotada ao lado de cada um, no
 * JSX de `EventsSpotlight.tsx`.
 */
export const MARGEM_REVEAL = '0px 0px -12% 0px';
export const LIMIAR_REVEAL = 0.15;

/**
 * Para o único escopo que vive DENTRO do palco `sticky` (o contador). Ver a
 * apuração acima: com a margem negativa ele acende em `scrollY` 7800, no fim da
 * cena, em vez de 497.
 */
export const MARGEM_REVEAL_NO_PALCO = '0px 0px 0px 0px';
