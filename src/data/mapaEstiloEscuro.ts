import type { StyleSpecification } from 'maplibre-gl';

/* Estilo vetorial escuro da marca (SIS-132).
 *
 * Porte do `ESTILO_ESCURO` que vivia em `UnitsMap.tsx` como `styles` da Maps JS
 * API. As cores são as MESMAS, uma a uma — o que muda é a gramática: no Google
 * se pinta `featureType`/`elementType`, aqui se pinta camada do tile vetorial.
 *
 * Por que um arquivo de estilo nosso e não `https://tiles.openfreemap.org/styles/dark`:
 * é a mesma razão registrada no componente para não usar `mapId` do Google. Um
 * estilo hospedado fora vive num painel de terceiro, fora do versionamento e
 * invisível em code review — e neste caso ele também não é a paleta da Sistran.
 * Aqui a paleta é revisável no diff.
 *
 * O que este estilo NÃO desenha, de propósito, seguindo o que o estilo do Google
 * já apagava: `poi` (comércio), `aeroway`, ferrovia e transporte público. A seção
 * mostra três endereços, não um guia da cidade.
 *
 * Fonte dos dados: OpenFreeMap, tiles no esquema OpenMapTiles. A URL do `source`
 * é o TileJSON (`/planet`), NUNCA o `{z}/{x}/{y}.pbf` que ele devolve: aquele
 * caminho carrega a data do build do planeta (`20260830_080001_pt`) e muda a cada
 * atualização. Fixá-lo aqui seria congelar o mapa numa versão que um dia sai do ar.
 *
 * Atribuição: `attribution` fica vazio nas fontes de propósito. O crédito é
 * desenhado como HTML pelo componente, fora da tela do mapa, porque no layout da
 * SIS-129 o canto de baixo do mapa é território do véu e do painel — e a licença
 * exige que ele esteja VISÍVEL. Ver o `<p>` de atribuição em `UnitsMap.tsx`.
 */

/* SIS-245 — O AZUL CLAREOU, E ENTROU UM TOQUE DE BRANCO.
 *
 * O pedido é "mapa azul mais claro", e a restrição escrita na issue é não
 * abandonar a linguagem dark da seção. Então o que mudou foi o DEGRAU de cada
 * tom, não a família: todo valor abaixo é o antigo com mais luz e um pouco menos
 * de saturação, e nenhum deles vira cinza-claro nem azul-de-dia.
 *
 * O "toque de branco" está onde ele é lido como acabamento e não como fundo
 * lavado: nos RÓTULOS (cidade, bairro, rua) e no realce dos prédios. Clarear o
 * fundo até o branco apagaria as vias, que são desenhadas por diferença de tom
 * contra ele — o mapa ficaria mais claro e menos legível, o oposto do pedido.
 *
 * O contorno escuro do rótulo (`CONTORNO_ROTULO`) clareou o mínimo: ele é o que
 * garante a leitura do texto sobre qualquer cor do mapa, e é justamente com o
 * fundo mais claro que ele passa a trabalhar mais.
 *
 * As cores continuam espelhando o `ESTILO_ESCURO` de `UnitsMap.tsx`, uma a uma —
 * aquele é o degrau da Maps JS API, que hoje não roda (não há
 * `NEXT_PUBLIC_GOOGLE_MAPS_KEY` no repositório) mas volta a valer no dia em que
 * houver chave. Quem mexer aqui mexe lá; é o único jeito de os dois degraus não
 * virarem dois mapas diferentes.
 * Valores anteriores, para poder voltar atrás em um diff:
 * | fundo #0e1b2e · água #062036 · rótulo d'água #3d7ba8 · prédio #16273e
 * | via local #17293f · arterial #1d3350 · expressa #25456b · limite #1f3a5c
 * | parque/mata #102a24 · rótulo #8ab4d8 · contorno #0a1526 · rua #7fa6c8
 * | cidade #a9cbe6
 */

/** Rótulo em português quando o dado tem, com queda para o nome local. */
const NOME = ['coalesce', ['get', 'name:pt'], ['get', 'name']] as unknown;

const TINTA_ROTULO = '#c9def0';
const CONTORNO_ROTULO = '#0b1b2c';
const TINTA_RUA = '#aecbe2';

export const ESTILO_MAPA_ESCURO: StyleSpecification = {
  version: 8,
  name: 'Sistran escuro',
  /* Os glyphs são servidos pelo próprio OpenFreeMap. Sem eles nenhum rótulo
     desenha — é a diferença entre "mapa escuro com nome de rua nítido", que é o
     ganho desta issue, e um mapa cego. */
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
      attribution: '',
    },
  },
  layers: [
    { id: 'fundo', type: 'background', paint: { 'background-color': '#16304d' } },

    /* Verde de parque: é o `poi.park` do estilo antigo (#102a24). Vem antes da
       água para um parque de beira de rio não cobrir o rio. */
    {
      id: 'parque',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'park',
      paint: { 'fill-color': '#173d33', 'fill-opacity': 0.6 },
    },
    {
      id: 'mata',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      filter: ['in', 'class', 'wood', 'grass'],
      paint: { 'fill-color': '#173d33', 'fill-opacity': 0.45 },
    },

    {
      id: 'agua',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': '#0e3a5c' },
    },
    {
      id: 'curso-de-agua',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      paint: {
        'line-color': '#0e3a5c',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 16, 3],
      },
    },

    /* Prédios: o estilo do Google não os tratava, então eles herdavam o
       `geometry` do fundo e simplesmente não existiam. Aqui ganham um tom
       imperceptivelmente mais claro e só de z14 para cima. É o que dá textura de
       quadra à Vila Olímpia no zoom 16 da unidade de SP, que é o enquadramento
       em que a seção abre. Opacidade baixa para não competir com os rótulos. */
    {
      id: 'predio',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 14,
      paint: {
        'fill-color': '#254a6e',
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 16, 0.7],
      },
    },

    /* Vias em três níveis, como no estilo antigo: local #17293f, arterial
       #1d3350, expressa #25456b. A largura cresce com o zoom em vez de ser fixa
       — é o que um mapa vetorial faz melhor que o mosaico e parte do motivo desta
       issue. */
    {
      id: 'via-local',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'minor', 'service', 'track', 'path'],
      minzoom: 12,
      paint: {
        'line-color': '#24425f',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 16, 4, 19, 14],
      },
    },
    {
      id: 'via-arterial',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'secondary', 'tertiary', 'trunk', 'primary'],
      paint: {
        'line-color': '#2e5175',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 2.5, 16, 8, 19, 20],
      },
    },
    {
      id: 'via-expressa',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'motorway'],
      paint: {
        'line-color': '#3d6b96',
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 12, 4, 16, 11, 19, 24],
      },
    },

    /* Limite administrativo: o `administrative geometry #1f3a5c` do estilo antigo.
       Tracejado para não ser lido como via. */
    {
      id: 'limite',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['<=', 'admin_level', 6],
      paint: {
        'line-color': '#325a85',
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 12, 1.6],
        'line-dasharray': [3, 2],
      },
    },

    /* Nome de rua ao longo da via. É o rótulo que o mosaico invertido entregava
       borrado e com o halo ao contrário; aqui ele é texto de verdade, com
       contorno escuro por baixo — que é o que garante a leitura sobre qualquer
       cor de fundo do mapa. */
    {
      id: 'rotulo-via',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 13,
      layout: {
        'text-field': NOME as never,
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 10, 18, 13],
        'symbol-placement': 'line',
        'text-rotation-alignment': 'map',
        'text-padding': 2,
      },
      paint: {
        'text-color': TINTA_RUA,
        'text-halo-color': CONTORNO_ROTULO,
        'text-halo-width': 1.4,
      },
    },

    {
      id: 'rotulo-agua',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'water_name',
      layout: {
        'text-field': NOME as never,
        'text-font': ['Noto Sans Regular'],
        'text-size': 11,
        'symbol-placement': 'line',
      },
      paint: {
        'text-color': '#79aed6',
        'text-halo-color': CONTORNO_ROTULO,
        'text-halo-width': 1.2,
      },
    },

    /* Bairro/vila: o nome que situa o visitante no zoom 16 de São Paulo
       ("Cidade Monções", "Vila Olímpia"), que é justamente o endereço que o
       painel ao lado mostra em texto. */
    {
      id: 'rotulo-bairro',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['in', 'class', 'suburb', 'neighbourhood', 'quarter'],
      minzoom: 12,
      layout: {
        'text-field': NOME as never,
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 17, 13],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.08,
        'text-max-width': 8,
      },
      paint: {
        'text-color': TINTA_ROTULO,
        'text-halo-color': CONTORNO_ROTULO,
        'text-halo-width': 1.4,
      },
    },

    /* Cidade e vila: é o rótulo que carrega as unidades de Pato Branco e do Rio,
       que abrem em zoom 12 e 11 — nelas o mapa mostra município, não rua. */
    {
      id: 'rotulo-cidade',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['in', 'class', 'city', 'town', 'village'],
      layout: {
        'text-field': NOME as never,
        'text-font': ['Noto Sans Bold'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 6, 11, 12, 16, 16, 18],
        'text-max-width': 9,
      },
      paint: {
        'text-color': '#e6f2fc',
        'text-halo-color': CONTORNO_ROTULO,
        'text-halo-width': 1.6,
      },
    },
  ],
};
