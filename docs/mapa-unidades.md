# Mapa escuro de unidades — guia para usar em outro projeto

Receita portátil do mapa da seção **Onde Estamos** (`/contato`): cartão escuro, pino ciano, zoom no
canto superior direito, crédito de licença e painel sobreposto com os pontos, endereço, telefone e
botão de rota.

O original vive em `src/components/UnitsMap.tsx` + `src/data/mapaEstiloEscuro.ts` deste repositório.
Aqui está o mesmo mapa descrito como algo que se instala num projeto novo: dependência, arquivos,
código mínimo, e as armadilhas que já custaram medição para achar.

**Não precisa de chave de API, nem de conta, nem de faturamento.** A base é MapLibre GL com tiles
vetoriais do OpenFreeMap.

---

## 1. O que você vai instalar

| Peça | Papel | Custo |
| --- | --- | --- |
| `maplibre-gl` (`^6.7.0`) | motor do mapa, WebGL | livre (BSD-3) |
| OpenFreeMap | tiles vetoriais + glyphs dos rótulos | sem chave, sem cota, sem SLA |
| Um arquivo de estilo seu | a paleta escura | — |
| Google Maps JS API | **opcional**, degrau extra se você tiver chave | cobrado por carregamento |
| Tiles raster do OpenStreetMap | **opcional**, reserva sem WebGL | livre (ODbL) |

Requisitos do projeto de destino: React 18+ e um bundler que sirva `public/` estático. O código abaixo
está em Next.js App Router, mas nada nele é específico do Next além de `'use client'` e da pasta
`public/`.

Se você quiser só o essencial, implemente **a seção 4**. As seções 6 e 7 são degraus de robustez
opcionais.

---

## 2. Instalação

```bash
npm i maplibre-gl
```

### 2.1 O passo que ninguém adivinha: publicar o worker

Copie o worker do MapLibre para dentro da sua origem. Crie `scripts/copiar-worker-maplibre.mjs`:

```js
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'node_modules', 'maplibre-gl', 'dist');
const destino = join(raiz, 'public', 'maplibre');

// O `-shared` vai junto: o worker o importa por caminho relativo.
const ARQUIVOS = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

await mkdir(destino, { recursive: true });
for (const arquivo of ARQUIVOS) {
  await copyFile(join(origem, arquivo), join(destino, arquivo));
}
```

Ligue nos hooks para nunca esquecer:

```json
{
  "scripts": {
    "predev": "node scripts/copiar-worker-maplibre.mjs",
    "prebuild": "node scripts/copiar-worker-maplibre.mjs",
    "dev": "next dev",
    "build": "next build"
  }
}
```

Adicione `public/maplibre/` ao `.gitignore`. Cópia versionada envelhece em silêncio no primeiro
`npm update` e passa a divergir da versão instalada.

**Por que isso é obrigatório.** O MapLibre acha o próprio worker por `import.meta.url`. Quando essa
URL não começa com `http` — o caso no `next dev` e no bundle de produção —, ele devolve string vazia,
`new Worker('')` falha **sem** chegar ao evento `error` do mapa, `isStyleLoaded()` fica preso em
`false`, zero tiles são pedidos e nenhum fallback dispara, porque do ponto de vista do componente nada
falhou. O sintoma é um retângulo com a cor de fundo e console limpo. Medido, não suposto.

---

## 3. Os dados

```ts
// src/data/pontos.ts
export type Ponto = {
  id: string;
  city: string;
  state: string;
  address?: string;   // opcional: sem endereço divulgado, fica sem
  phone?: string;
  lat: number;
  lon: number;
  zoom: number;       // 16 = rua · 12 = município · 11 = região
};

export const PONTOS: readonly Ponto[] = [
  {
    id: 'sp',
    city: 'São Paulo',
    state: 'SP',
    address: 'R. Dr. Geraldo Campos Moreira, 240 – Cidade Monções, São Paulo – SP',
    phone: '+55 (11) 2192 - 4400',
    lat: -23.6013365,
    lon: -46.6934202,
    zoom: 16,
  },
  { id: 'pr', city: 'Pato Branco', state: 'PR', lat: -26.2295984, lon: -52.6712474, zoom: 12 },
  { id: 'rj', city: 'Rio de Janeiro', state: 'RJ', lat: -22.9110137, lon: -43.2093727, zoom: 11 },
] as const;

/** Busca no Google Maps para o botão de rota — endereço quando existe, cidade quando não. */
export function mapsHref(p: Ponto) {
  const alvo = p.address ?? `${p.city} - ${p.state}, Brasil`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alvo)}`;
}
```

Tire coordenadas do [Nominatim](https://nominatim.openstreetmap.org/), não de estimativa. Se o número
do prédio não estiver mapeado no OSM, marque a rua com zoom de rua: é preciso o bastante para achar o
lugar sem fingir precisão de fachada. O primeiro item da lista é o que abre.

---

## 4. O componente mínimo

```tsx
'use client';

// Estático de propósito: são ~4 kB e precisa existir antes do primeiro frame,
// porque é o que posiciona o <canvas> e os controles. Todo seletor é
// `.maplibregl-*`, então não vaza para o resto do projeto.
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapaLibreGL, Marker as MarcadorGL } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { ESTILO_MAPA_ESCURO } from '@/data/mapaEstiloEscuro';
import { PONTOS, type Ponto } from '@/data/pontos';

// O pino da marca como data URI (aqui, o MapPin do lucide recolorido).
const PINO_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
      fill="#0a1f44" stroke="#2AC4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>`,
  );

// A preferência do sistema, consultada direto. Se o seu projeto expõe uma
// escolha do visitante que vence o sistema, leia a preferência RESOLVIDA aqui.
const reduzirMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// WebGL pode simplesmente não existir. Perguntar ANTES é o que evita o quadro
// preto: o MapLibre lança no construtor.
function temWebGL() {
  try {
    const teste = document.createElement('canvas');
    return Boolean(teste.getContext('webgl2') ?? teste.getContext('webgl'));
  } catch {
    return false;
  }
}

export function MapaVetorial({ ponto, aoFalhar }: { ponto: Ponto; aoFalhar?: () => void }) {
  const quadroRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapaLibreGL | null>(null);
  const [pronto, setPronto] = useState(false);

  // O ponto ativo entra por ref, NÃO como dependência do efeito de montagem.
  // Como dependência, cada clique reconstruiria o mapa — que é exatamente o
  // defeito do <iframe> de embed que este desenho existe para evitar.
  const pontoRef = useRef(ponto);
  useEffect(() => {
    pontoRef.current = ponto;
  }, [ponto]);

  useEffect(() => {
    if (!quadroRef.current) return;
    if (!temWebGL()) {
      aoFalhar?.();
      return;
    }

    let vivo = true;
    let mapa: MapaLibreGL | null = null;
    let marcadores: MarcadorGL[] = [];
    // Erro ANTES do primeiro `load` = estilo/TileJSON fora do ar. Depois = tile
    // solto, e derrubar o mapa por um quadrado é pior que o quadrado faltando.
    let carregou = false;

    // import() dinâmico: ~200 kB comprimidos mais glyphs, fora do caminho do LCP.
    import('maplibre-gl')
      .then(({ Map: MapaLibre, Marker, NavigationControl, setWorkerUrl }) => {
        if (!vivo || !quadroRef.current) return;
        setWorkerUrl('/maplibre/maplibre-gl-worker.mjs'); // ver 2.1
        const inicial = pontoRef.current;

        mapa = new MapaLibre({
          container: quadroRef.current,
          style: ESTILO_MAPA_ESCURO,
          center: [inicial.lon, inicial.lat], // [lon, lat] — invertido em relação ao Google
          zoom: inicial.zoom,
          attributionControl: false, // o crédito é HTML nosso; ver seção 5
          // O MapLibre entrega scrollZoom LIGADO. Numa seção no meio de uma
          // página longa, sequestrar a rolagem é hostil.
          cooperativeGestures: true,
          locale: {
            'CooperativeGesturesHandler.WindowsHelpText': 'Use Ctrl + rolagem para dar zoom no mapa',
            'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + rolagem para dar zoom no mapa',
            'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
          },
          dragRotate: false,
          pitchWithRotate: false,
          maplibreLogo: false,
        });
        mapaRef.current = mapa;
        mapa.touchZoomRotate.disableRotation();

        // À direita porque à esquerda fica o painel sobreposto: ali os botões
        // existiriam sob o véu, recebendo foco de teclado sem serem vistos.
        mapa.addControl(new NavigationControl({ showCompass: false }), 'top-right');

        marcadores = PONTOS.map((p) => {
          const pino = document.createElement('img');
          pino.src = PINO_SVG;
          pino.width = 36;
          pino.height = 36;
          pino.alt = '';
          pino.draggable = false;
          return new Marker({ element: pino, anchor: 'bottom' })
            .setLngLat([p.lon, p.lat])
            .addTo(mapa as MapaLibreGL);
        });

        mapa.on('error', () => {
          if (vivo && !carregou) aoFalhar?.();
        });
        mapa.once('load', () => {
          carregou = true;
          if (vivo) setPronto(true);
        });
      })
      .catch(() => {
        if (vivo) aoFalhar?.();
      });

    return () => {
      vivo = false;
      marcadores.forEach((m) => m.remove());
      mapa?.remove();
      mapaRef.current = null;
    };
  }, [aoFalhar]);

  // Trocar de ponto reposiciona a câmera. Nada recarrega.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !pronto) return;
    const destino = { center: [ponto.lon, ponto.lat] as [number, number], zoom: ponto.zoom };
    if (reduzirMovimento()) mapa.jumpTo(destino);
    else mapa.flyTo({ ...destino, speed: 1.4 });
  }, [ponto, pronto]);

  return (
    <div
      ref={quadroRef}
      role="img"
      aria-label={`Mapa de ${ponto.city} – ${ponto.state}`}
      // `h-full w-full` NÃO é redundante com `inset-0` — ver armadilha 8.1.
      className="absolute inset-0 h-full w-full"
    />
  );
}
```

### 4.1 Adiar a carga

Envolva com um `IntersectionObserver` para o mapa só montar quando a seção chegar perto. É o que
mantém o mapa fora do caminho do LCP — e, se algum dia você usar o degrau do Google, é o que evita
pagar por carregamentos que ninguém viu.

```tsx
const [visivel, setVisivel] = useState(false);
const secaoRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const no = secaoRef.current;
  if (!no) return;
  const obs = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        setVisivel(true);
        obs.disconnect(); // uma vez só
      }
    },
    { rootMargin: '200px' },
  );
  obs.observe(no);
  return () => obs.disconnect();
}, []);
```

---

## 5. O estilo escuro

Copie `src/data/mapaEstiloEscuro.ts` do projeto original — são 250 linhas de `StyleSpecification`
comentada, e ela é a metade visual do resultado. O esqueleto:

```ts
import type { StyleSpecification } from 'maplibre-gl';

export const ESTILO_MAPA_ESCURO: StyleSpecification = {
  version: 8,
  name: 'escuro',
  // Sem glyphs, nenhum rótulo desenha — é a diferença entre mapa escuro com
  // nome de rua nítido e mapa cego.
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      // O TileJSON (`/planet`), NUNCA o `{z}/{x}/{y}.pbf` que ele devolve:
      // aquele caminho carrega a data do build do planeta e muda a cada
      // atualização. Fixá-lo congela o mapa numa versão que um dia sai do ar.
      url: 'https://tiles.openfreemap.org/planet',
      attribution: '', // o crédito é o nosso HTML
    },
  },
  layers: [
    { id: 'fundo', type: 'background', paint: { 'background-color': '#0e1b2e' } },
    // parque, água, vias, limites administrativos, rótulos…
  ],
};
```

Paleta: fundo `#0e1b2e` · parque `#102a24` · água `#062036` · rótulo de água `#3d7ba8` · via
`#17293f` · arterial `#1d3350` · rodovia `#25456b` · administrativo `#1f3a5c` · rótulo `#8ab4d8` com
contorno `#0a1526` · rótulo de rua `#7fa6c8` · cidade `#a9cbe6`.

Duas decisões que vale herdar:

- **Estilo no repositório, não hospedado.** `https://tiles.openfreemap.org/styles/dark` (ou um `mapId`
  do Google) vive num painel de terceiro, fora do versionamento e invisível em code review. Aqui a
  paleta é revisável no diff.
- **POI de comércio, ferrovia, aeroway e transporte público apagados.** A seção mostra endereços, não
  um guia da cidade.

Os rótulos usam `['coalesce', ['get', 'name:pt'], ['get', 'name']]` para preferir português e cair no
nome local quando não houver.

### 5.1 Atribuição — é licença, não rodapé decorativo

ODbL do OpenStreetMap mais o crédito que OpenFreeMap e OpenMapTiles pedem. Como o canto de baixo do
mapa fica sob o véu e o painel, o crédito é desenhado por fora, acima deles:

```tsx
<p className="absolute bottom-0 right-0 z-10 bg-[#0a1f44]/70 px-2 py-1 text-[10px]">
  <a href="https://openfreemap.org" target="_blank" rel="noreferrer noopener">OpenFreeMap</a>
  {' · © '}
  <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer noopener">OpenMapTiles</a>
  {' · © '}
  <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">
    OpenStreetMap contributors
  </a>
</p>
```

No degrau do Google ela não aparece — o Google desenha a sua.

---

## 6. O cartão: painel sobreposto sem perder contraste nem arrasto

```css
.mapa-cartao {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 12%);
  background: #0e1b2e;
  /* O painel fica em FLUXO (não `absolute`): é a altura dele que empurra a do
     cartão, e o texto não vaza por baixo da borda arredondada quando a fonte
     cresce ou o endereço quebra em mais linhas. */
  flex-direction: column;
  justify-content: flex-end;
  /* No estreito, esta é a janela por onde o mapa aparece acima do painel. */
  padding-top: 16rem;
  min-height: 34rem;
}

.mapa-cartao-mapa {
  position: absolute;
  inset: 0;
  /* SEM `z-index`, de propósito: com `z-index: 0` este nó viraria contexto de
     empilhamento e prenderia a atribuição (que precisa de z-10 para ficar acima
     do véu) embaixo dele. */
}

.mapa-veu {
  position: absolute;
  inset: 0;
  z-index: 1;
  /* Não intercepta ponteiro: o véu cobre metade do cartão e capturaria o arrasto
     do mapa em toda essa área. */
  pointer-events: none;
  /* Degradê SÓLIDO, não `backdrop-filter`: desfoque não garante contraste — ele
     borra mantendo a luminância média. O que garante AA é opacidade. É preciso
     porque o visitante pode arrastar uma área clara do mapa para cá. */
  background: linear-gradient(
    180deg,
    rgb(3 18 40 / 0%) 0%,
    rgb(3 18 40 / 72%) 26%,
    rgb(3 18 40 / 96%) 38%,
    rgb(3 18 40 / 98%) 100%
  );
}

.mapa-painel {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 1.25rem;
  pointer-events: none; /* sem isto, arrastar sobre o painel não move o mapa */
}
.mapa-painel :is(button, a) {
  pointer-events: auto;
}

@media (min-width: 64rem) {
  .mapa-cartao {
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
    padding-top: 0;
    height: 40rem;
  }
  .mapa-painel {
    width: 24rem;
  }
}
```

Camadas: mapa (sem z-index) → véu (1) → painel (2) → atribuição (10).

No painel, cada ponto é um `<button aria-pressed={p.id === ativo.id}>`. Deliberadamente **não** é
`tablist`, e **não** seleciona por hover: em touch não existe hover, e no mouse trocaria de ponto só
porque o ponteiro passou por cima.

---

## 7. Degraus opcionais de robustez

O original tem três degraus. O 2 é o descrito acima, e é o que roda. Adicione os outros só se o seu
caso pedir.

**Degrau 1 — Google Maps JS API.** Vale se você já tem chave com faturamento habilitado e restrição
por domínio. Script com `?key=…&v=weekly&loading=async&language=pt-BR&region=BR`, uma promessa por
carregamento de página, e falhas **não** cacheadas para que um soluço de rede não condene a sessão.
Diferenças ao portar: coordenadas são `{ lat, lng }`, `panTo`/`setCenter` no lugar de
`flyTo`/`jumpTo`, tema escuro como array `styles` (não `mapId`, que vive no console do Google, fora do
versionamento), e `gestureHandling: 'cooperative'` — mais `mapTypeControl`, `streetViewControl` e
`fullscreenControl` em `false`, `clickableIcons: false` e `zoomControlOptions: { position: RIGHT_CENTER }`.
Script carregado mas `window.google` ausente = chave inválida ou referrer bloqueado: trate como falha.

**Degrau 3 — mosaico raster.** Entra sem WebGL ou se o provedor vetorial cai. Não tem pan nem zoom:
é um mosaico de `<img>` de 256px posicionado por Web Mercator, com o ponto no centro do quadro.
Grade **8×6** (2048×1536): com o ponto centrado sobram 768px na horizontal e 512 na vertical, e uma
grade 4×3 já falhou na vertical num cartão de ~1216×512. Tema escuro por
`filter: invert(1) hue-rotate(180deg) saturate(0.7) brightness(0.85) contrast(1.05)` — o `invert`
sozinho deixa a água laranja e o `hue-rotate` devolve o azul. Duas variáveis de ambiente ajudam:
`NEXT_PUBLIC_MAP_TILES` (padrão `https://tile.openstreetmap.org/{z}/{x}/{y}.png`) e
`NEXT_PUBLIC_MAP_TILES_DARK=1` para desligar o filtro quando o provedor já entrega escuro.

Seleção de degrau no componente-pai, como três estados e não um booleano — cada degrau é descartado
só depois de falhar de verdade:

```ts
const provedor =
  CHAVE_GOOGLE && !googleFalhou ? 'google' : vetorialFalhou ? 'mosaico' : 'vetorial';
```

**Em qualquer degrau, o mapa nunca é o único caminho até o endereço.** Cidade, endereço, telefone e
botão de rota são HTML ao lado dele e sobrevivem com JavaScript desligado.

---

## 8. Armadilhas já pagas

### 8.1 `h-full w-full` não é redundante com `inset-0`
O MapLibre escreve `position: relative` no container (via `.maplibregl-map`; a Maps JS API faz o
mesmo em estilo inline). Com o container `relative`, o `inset-0` **deixa de dimensionar** e a altura
colapsa para 0. Medido: container 1114×0, canvas nos 300px de fallback do MapLibre, mapa invisível,
nenhum tile pedido. Altura em `%` sobrevive à troca de `position` — é o ponto.

### 8.2 CSS global do projeto pintando o texto do painel
No original, `.section-light h3/p/span` pinta texto de azul-marinho com especificidade que vence
utilitário Tailwind: marinho sobre marinho, medido `rgb(10, 31, 68)`. Ao portar, confira a cor
**computada** do texto sobre o mapa, não a classe que você escreveu. No original, links do painel
levam `style={{ color: '#7fdcff' }}` inline, porque a regra que os achata usa `!important` e
`[style*="color"]` é a válvula de escape que ela mesma oferece.

### 8.3 `loading="lazy"` nos tiles do mosaico
Não use. O IntersectionObserver já adia. Com `lazy` por cima, os tiles de borda fora do quadro
`overflow-hidden` nunca eram buscados e o mapa mostrava manchas brancas — verificado a 1440: 12 tiles
no DOM, nenhum baixado. Use `fetchPriority="low"`, `decoding="async"`, `draggable={false}`.

### 8.4 Tiles do mosaico não são `next/image`
Com `images.unoptimized` o wrapper não otimiza nada, e cada tile exigiria o domínio do provedor em
`remotePatterns` para um PNG de 256px já no tamanho exato.

### 8.5 CARTO "dark_all" não serve mais
Era a escolha óbvia de tiles raster escuros e hoje devolve tiles estampados "API KEY REQUIRED"
(verificado em captura). É por isso que o mosaico é tile claro invertido.

### 8.6 Erro depois do `load` não derruba o mapa
A flag `carregou` separa os dois casos. Sem ela, um tile perdido apaga um mapa inteiro que estava
funcionando.

### 8.7 Tipagens do Google
No degrau 1, cinco chamadas bastam — o original declara tipos mínimos à mão em vez de instalar
`@types/google.maps`.

---

## 9. Verificação depois de portar

1. `public/maplibre/maplibre-gl-worker.mjs` e `-shared.mjs` existem e são da versão instalada.
2. Rolar até a seção: aba Network filtrada por `openfreemap` mostra tiles e glyphs sendo pedidos.
3. Rótulos de rua nítidos, inclusive em retina e em zoom intermediário.
4. Clicar nos três pontos: a câmera desloca **sem** nova requisição de estilo.
5. Ler o texto do painel sobre a área mais clara que você conseguir arrastar para trás dele.
6. Atribuição visível, acima do véu, em 390, 1024 e 1440.
7. DevTools → Rendering → `prefers-reduced-motion: reduce`: a troca passa a ser corte seco.
8. Roda do mouse sobre o mapa não rouba a rolagem da página; Ctrl + roda dá zoom.
9. WebGL desligado no navegador: o degrau de reserva aparece — ou, sem ele, o endereço em HTML
   continua legível ao lado.

---

## 10. Arquivos a copiar do projeto original

| Origem | Destino sugerido | Obrigatório |
| --- | --- | --- |
| `src/data/mapaEstiloEscuro.ts` | igual | sim — é a metade visual |
| `src/components/UnitsMap.tsx` | referência para `MapaVetorial`, `Atribuicao` e a seleção de degrau | sim |
| `scripts/copiar-worker-maplibre.mjs` | igual, mais os hooks `predev`/`prebuild` | sim |
| `src/app/globals.css:6061+` (`.mapa-*`) | seu CSS global | sim, se quiser o painel sobreposto |
| `src/data/contact.ts` (`UNITS`, `mapsHref`) | adapte para os seus pontos | sim |
