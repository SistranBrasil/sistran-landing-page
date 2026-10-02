import type { CSSProperties } from 'react';

/**
 * SIS-263 (2ª volta) — O CALIBRE DE `/contato`: afinação local + reexport do
 * par canônico.
 *
 * O pedido da 2ª volta foi «mais fluido» e «as coisas começam a surgir após o
 * carregamento». Os dois são calibre, não mecânica: as primitivas continuam
 * `RevealScope` + `useRevealTrigger` + presets `[data-reveal]`, como a issue
 * prescreve.
 *
 * ── SIS-275 — o par margem/limiar saiu daqui ───────────────────────────────
 * `MARGEM_REVEAL` e `LIMIAR_REVEAL` agora moram em `src/lib/reveal-calibre.ts`
 * (calibre canônico pós-SIS-269) e são reexportados abaixo SEM mudar os
 * valores. Esta pasta continua sendo o lugar onde `/contato` e `MetricsBand`
 * importam — um import só por rota —, e a afinação de duração/curva
 * (`AFINACAO_*`) segue local porque a 2ª volta pediu «mais fluido» POR ESCRITO
 * só nesta rota.
 *
 * A razão de cada número do par canônico (margem `-12%`, limiar `0.15`) e o
 * contrato de `esperarRota` («espera = estou na dobra e a cortina me
 * esconderia») estão no docblock de `src/lib/reveal-calibre.ts` e na medida
 * `docs/medidas/sis269-depois.json`.
 *
 * `DUR: '820ms'` e `EASE` expo-out — §4.2 e §4.4 de `docs/scroll.md`. Vão como
 * custom properties do ESCOPO (`--reveal-dur`/`--reveal-ease`): mexer em
 * `--motion-reveal-base` no `:root` arrastaria a home e as outras rotas.
 */
export { MARGEM_REVEAL, LIMIAR_REVEAL } from '@/lib/reveal-calibre';

/**
 * Duração e curva do reveal desta rota. Espalhar num `style` de `RevealScope`.
 * O cast existe porque `CSSProperties` do React não tipa custom property.
 */
/* 02/10 · SIS-307 — 820ms VIROU 520ms, E A CURVA FICOU.
   Os 820ms existiam por um pedido escrito (2ª volta da SIS-263: «mais fluido»).
   Agora há um pedido escrito mais recente e mais amplo — «os efeitos tão rápidos
   conforme o scroll» — e `/contato` era a rota MAIS LENTA do site: a sonda mediu
   mediana de 578px de rolagem entre o bloco entrar na tela e terminar, com o
   diálogo de contato em 662px. Entre dois pedidos que se contradizem vale o
   último.
   O que NÃO se desfaz é a curva: expo-out é a metade «fluido» daquele pedido, e
   ela não custa tempo nenhum — custa distribuição do tempo. Por isso aqui ficou
   `520ms` (o novo `--motion-reveal-slow`, e não o `base`): a rota continua
   deliberadamente a mais demorada da casa, só deixou de ser 2,4× o resto. */
export const AFINACAO_REVEAL = {
  '--reveal-dur': '520ms',
  '--reveal-ease': 'cubic-bezier(0.19, 1, 0.22, 1)',
} as CSSProperties;

/**
 * A cascata dos sete indicadores. 95ms em vez dos 80ms do token: com a duração
 * em 820ms, 80ms deixa os sete quase simultâneos e a cascata deixa de ser
 * legível. 7 × 95 = 665ms, ainda dentro da faixa de 70–120ms que o §4.3
 * recomenda — e o §4.3 é também quem proíbe subir mais: acima de 150ms a fileira
 * passa de 1s e quem rola rápido vê a página se montando atrasada.
 */
/* 02/10 · SIS-307 — 95ms viraram 52ms, pela mesma aritmética da nota original,
   recalculada na duração nova: o que sustentava 95ms era a razão entre passo e
   duração (95/820 ≈ 0,116) — abaixo disso os sete indicadores leem como
   simultâneos. Com 520ms a mesma razão dá 60ms, e 52ms é o valor que mantém a
   cascata legível e põe os sete em 7 × 52 = 364ms, contra 665ms antes. Continua
   acima do token global (45ms) pela razão original: aqui são sete irmãos numa
   fileira, e é a cascata que se quer ver. */
export const AFINACAO_INDICADORES = {
  ...AFINACAO_REVEAL,
  '--motion-stagger-reveal': '52ms',
} as CSSProperties;
