/**
 * SIS-216 — as medidas da arte dos eventos, num lugar só.
 *
 * Os números não são escolha do admin: são os que `EventsSpotlight` passa para o
 * `next/image` (`width={1672} height={941}` no palco, `240×135` na miniatura da
 * coluna) e os que as artes já publicadas têm em disco — medidas com `sharp`:
 * `Agile2025.webp` é 1676×938, `apix-julho-26.webp` é 1672×940, e os dois thumbs
 * são 240×134/135. Ou seja, 16:9 na prática.
 *
 * Ficam aqui porque três lugares precisam concordar: o redimensionamento no
 * navegador, a conferência no servidor e a moldura da prévia. Se `EventsSpotlight`
 * mudar de proporção, muda aqui.
 */

export const ARTE_LARGURA = 1672;
export const ARTE_ALTURA = 941;
export const THUMB_LARGURA = 240;
export const THUMB_ALTURA = 135;

/** `1672/941` — a moldura da prévia usa isto para mostrar o corte de verdade. */
export const PROPORCAO = `${ARTE_LARGURA} / ${ARTE_ALTURA}`;

export const PASTA_ARTE_URL = '/images/EVENTOS';
export const PASTA_THUMB_URL = '/images/EVENTOS/thumb';

/**
 * Onde cada imagem aparece no site. Escrito por leitura de
 * `src/components/EventsSpotlight.tsx`, não de memória:
 *
 * - `thumb` → `src={e.thumb ?? e.image}` no botão `.eventos-vaga` (linha ~304),
 *   que são as colunas de miniaturas dos dois lados da cena, em desktop.
 * - `image` → `src={evento.image ?? evento.thumb}` no `.eventos-destaque-arte`
 *   do palco central (linha ~417) e no cartão da lista estreita (linha ~510),
 *   que é a ÚNICA leitura do conteúdo abaixo de 1024 px.
 */
export const ONDE_APARECE = {
  arte: 'Palco central da cena de /eventos-inovacao (desktop) e cartão único no celular.',
  thumb: 'Miniaturas das colunas laterais da mesma cena — o botão que leva ao palco.',
} as const;
