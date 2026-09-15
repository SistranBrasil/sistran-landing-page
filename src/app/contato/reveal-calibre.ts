import type { CSSProperties } from 'react';

/**
 * SIS-263 (2ª volta) — O CALIBRE ÚNICO DO REVEAL DE `/contato`, num lugar só.
 *
 * O pedido da 2ª volta foi «mais fluido» e «as coisas começam a surgir após o
 * carregamento». Os dois são calibre, não mecânica: as primitivas continuam
 * `RevealScope` + `useRevealTrigger` + presets `[data-reveal]`, como a issue
 * prescreve.
 *
 * Mora aqui, e não repetido nos dois arquivos que montam a rota
 * (`page.tsx` e `components/MetricsBand.tsx`), porque calibre duplicado é a mesma
 * classe de defeito que o cabeçalho de `data/metrics.ts` registra: com dois
 * literais, a primeira correção deixa metade da página numa cadência e a outra
 * metade noutra, e ninguém percebe olhando um arquivo só. `MetricsBand` é montado
 * EXCLUSIVAMENTE nesta rota (conferido), então o módulo pode viver na pasta dela.
 *
 * ── Por que cada número é este ────────────────────────────────────────────
 *
 * `MARGEM: '0px 0px 12% 0px'` — POSITIVO, e é a inversão do calibre da 1ª volta
 * (`-12%`). A tabela do §4.1 de `docs/scroll.md` chama valor positivo de "já vai
 * surgindo antes de chegar" e sugere começar em 15%; negativo é "discreto,
 * dispara depois de entrar". A sensação de página travada que sobrou da 1ª volta
 * vinha daí: o bloco só começava a aparecer depois de já estar na tela, então a
 * pessoa via o vazio primeiro e o conteúdo depois. Com 12% ele já está em
 * movimento quando entra no campo de visão. 12 e não 15 porque a rota é curta
 * (3417px a 1440) e 15% acenderia dois blocos no mesmo gesto.
 *
 * `LIMIAR: 0.08` — o 0.2 do padrão é fração DO ELEMENTO, então ele pune bloco
 * alto: o cartão do painel tem ~700px, e 20% dele são 140px de rolagem a mais de
 * espera do que num rótulo de 24px. Com 0.08 os blocos alto e baixo acendem no
 * mesmo ponto da tela, que é o que faz a página inteira ter uma cadência só.
 *
 * `DUR: '820ms'` e `EASE` expo-out — §4.2 ("quanto maior o elemento, maior a
 * duração"; os 500ms do token são calibrados para cartão pequeno) e §4.4 (a curva
 * `cubic-bezier(.19, 1, .22, 1)` "sai rápido e assenta devagar", que é
 * literalmente o pedido de fluidez). Vão como custom properties do ESCOPO
 * (`--reveal-dur`/`--reveal-ease`, ganchos criados em `globals.css` com fallback
 * nos tokens): mexer em `--motion-reveal-base` no `:root` arrastaria a home e as
 * outras rotas, que a issue põe fora de escopo, e redefinir `--motion-ease-out`
 * aqui mudaria também os hovers dos cartões que vivem dentro do escopo.
 *
 * `ESPERAR_ROTA` — o «após o carregamento». Ver o defeito medido no docblock de
 * `useRevealTrigger`: sem isso, o bloco que está na primeira dobra acende ATRÁS
 * da cortina do `RouteLoadGate` e já está parado quando ela levanta.
 */
export const MARGEM_REVEAL = '0px 0px 12% 0px';
export const LIMIAR_REVEAL = 0.08;

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
