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
export const AFINACAO_REVEAL = {
  '--reveal-dur': '820ms',
  '--reveal-ease': 'cubic-bezier(0.19, 1, 0.22, 1)',
} as CSSProperties;

/**
 * A cascata dos sete indicadores. 95ms em vez dos 80ms do token: com a duração
 * em 820ms, 80ms deixa os sete quase simultâneos e a cascata deixa de ser
 * legível. 7 × 95 = 665ms, ainda dentro da faixa de 70–120ms que o §4.3
 * recomenda — e o §4.3 é também quem proíbe subir mais: acima de 150ms a fileira
 * passa de 1s e quem rola rápido vê a página se montando atrasada.
 */
export const AFINACAO_INDICADORES = {
  ...AFINACAO_REVEAL,
  '--motion-stagger-reveal': '95ms',
} as CSSProperties;
