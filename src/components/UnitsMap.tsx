'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import { UNITS, mapsHref } from '@/data/contact';
import type { Unit } from '@/data/types';
import { ESTILO_MAPA_ESCURO } from '@/data/mapaEstiloEscuro';
import { useRouteLoadGate } from '@/components/loading/RouteLoadGate';
/* CSS do MapLibre. Entra estático de propósito, ao contrário da biblioteca: são
   ~4 kB de folha de estilo, e ela precisa existir ANTES do primeiro quadro do
   mapa — é dela que sai o posicionamento do `<canvas>` e dos controles. Carregar
   por `import()` junto do JS deixaria um lampejo com o canvas fora de lugar.
   Todo seletor dela é `.maplibregl-*`, então não vaza para o resto da página —
   conferido, e não presumido: nenhuma regra sem esse prefixo, e as duas únicas
   animações infinitas do arquivo (`maplibregl-spin` e o pulso do ponto de
   geolocalização) pertencem a controles que este componente nunca instancia. */
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapaLibreGL, Marker as MarcadorGL } from 'maplibre-gl';

/* Mapa das unidades (SIS-84).
 *
 * Decisão do cliente: **Google Maps de verdade** (Maps JavaScript API), e não o
 * `iframe` de embed nem o mosaico de tiles. O que isso compra, e que as outras
 * opções não davam: pan/zoom reais, os POIs do Google, tema escuro configurável
 * por `styles` e — o pedido explícito da issue — troca de unidade **sem
 * recarregar**, porque existe uma única instância de mapa que só recebe
 * `panTo`.
 *
 * A API exige chave com faturamento habilitado e restrição de domínio, e essa
 * chave não existe neste repositório. Por isso o componente tem TRÊS degraus
 * (SIS-132), nesta ordem:
 *
 * 1. `NEXT_PUBLIC_GOOGLE_MAPS_KEY` presente -> Maps JS API.
 * 2. sem chave, ou o script do Google falha (rede, cota estourada, referrer
 *    barrado) -> **MapLibre GL + tiles vetoriais do OpenFreeMap**, sem chave,
 *    sem cota e sem faturamento. É o que roda hoje.
 * 3. sem WebGL, ou o provedor vetorial cai -> mosaico de tiles raster do
 *    OpenStreetMap, a implementação original, que continua aqui inteira.
 *
 * O degrau 3 não é zelo excessivo, e é o mesmo argumento das duas issues: cota
 * de Maps é paga por carregamento e *estoura*, e o OpenFreeMap é serviço público
 * sem SLA contratual — que é exatamente o preço de não ter chave. Sem o último
 * degrau, o dia em que qualquer um dos dois cair é o dia em que a seção "Onde
 * Estamos" fica um retângulo vazio.
 *
 * Em nenhum dos três casos o mapa é a única forma de chegar ao endereço: cidade,
 * endereço, telefone e o botão de rota são HTML ao lado, e continuam de pé com
 * JavaScript desligado.
 */

/* ── Tipagem mínima da Maps JS API ───────────────────────────────────────────
 * Escrita à mão em vez de instalar `@types/google.maps`: são cinco chamadas, e
 * a dependência de tipos traria a superfície inteira da API para o projeto.
 * Cada membro aqui é um que o componente realmente usa. */
type LatLngLiteral = { lat: number; lng: number };
interface GMap {
  panTo(latLng: LatLngLiteral): void;
  setCenter(latLng: LatLngLiteral): void;
  setZoom(zoom: number): void;
}
interface GMarker {
  setMap(map: GMap | null): void;
}
interface GMapsListener {
  remove(): void;
}
interface GoogleMaps {
  maps: {
    Map: new (el: HTMLElement, opcoes: Record<string, unknown>) => GMap;
    Marker: new (opcoes: Record<string, unknown>) => GMarker;
    event: {
      addListenerOnce(instance: GMap, eventName: 'idle', handler: () => void): GMapsListener;
    };
    /* SIS-129 — o controle de zoom precisa sair do canto onde o painel passou a
       ficar, e a posição é uma constante da API. Lida do objeto `google` em vez
       de escrita como número: os valores de `ControlPosition` são detalhe de
       implementação e já mudaram de numeração entre versões. */
    ControlPosition: Record<string, number>;
  };
}
declare global {
  interface Window {
    google?: GoogleMaps;
  }
}

/* SIS-129 pedia decidir e registrar aqui: chave do Google configurada, ou o
   fallback OSM aceito como aparência final da seção.
   Registro: a variável NÃO existe no ambiente do repositório, então o que roda
   hoje — em dev, em captura e em produção — é o mosaico do OpenStreetMap. Ele é
   a aparência final desta seção, e o cartão foi desenhado sobre ele (véu,
   posição do pino, atribuição ODbL, 8x6 tiles). Criar a chave é decisão de
   infraestrutura e cobrança, não de CSS; quando ela existir, o caminho do Google
   assume sozinho sem tocar no layout — o único ajuste que ele já traz pronto é o
   `zoomControlOptions` abaixo. */
const CHAVE_GOOGLE = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const SEM_ACAO = () => undefined;

/* Uma única promessa por carregamento de página. Sem isso, três unidades ou uma
   remontagem do componente injetariam o script várias vezes e a API reclama de
   ser carregada em duplicado. */
let promessaMaps: Promise<GoogleMaps> | null = null;

function carregarMaps(chave: string): Promise<GoogleMaps> {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (promessaMaps) return promessaMaps;

  promessaMaps = new Promise<GoogleMaps>((resolver, rejeitar) => {
    const script = document.createElement('script');
    /* `loading=async` é o que a própria API pede quando o script entra por JS;
       sem ele o console avisa que o carregamento está bloqueando. `v=weekly`
       em vez de `beta`: canal estável, sem surpresa em produção. */
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(chave)}&v=weekly&loading=async&language=pt-BR&region=BR`;
    script.async = true;
    script.onload = () => {
      if (window.google?.maps) resolver(window.google);
      /* Script carregou mas a API não apareceu: é o que acontece quando a chave
         é inválida ou o referrer está barrado. Trata como falha para o fallback
         assumir, em vez de deixar um mapa que nunca desenha. */
      else rejeitar(new Error('Maps carregou sem expor google.maps'));
    };
    script.onerror = () => rejeitar(new Error('Falha ao carregar a Maps JS API'));
    document.head.appendChild(script);
  });
  /* Falha não fica em cache: uma queda de rede não pode condenar a sessão
     inteira ao fallback. */
  promessaMaps.catch(() => {
    promessaMaps = null;
  });
  return promessaMaps;
}

/* Tema escuro da marca. Vai em `styles` e não em `mapId` de propósito: estilo
   por Map ID vive no console do Google Cloud, ou seja, ficaria fora do
   versionamento e invisível em code review. Aqui a paleta é revisável no diff.
   Os POIs comerciais e o transporte saem — a seção mostra três endereços, não
   um guia da cidade. */
const ESTILO_ESCURO = [
  { elementType: 'geometry', stylers: [{ color: '#0e1b2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ab4d8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1526' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1f3a5c' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#102a24' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#17293f' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#1d3350' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#25456b' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7fa6c8' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#062036' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d7ba8' }] },
];

/** Pino desenhado, e não o vermelho padrão: é o mesmo `MapPin` de lucide que a
 *  lista ao lado usa, no ciano da marca. */
const PINO_SVG =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#0a1f44" stroke="#2AC4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  );

function reduzirMovimento() {
  /* `matchMedia` está embrulhado no layout para devolver a preferência
     RESOLVIDA (escolha do visitante > preferência do sistema) — por isso a
     consulta aqui e não `data-motion`. */
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Mapa do Google. Uma instância; a troca de unidade só reposiciona a câmera. */
function MapaGoogle({
  unidade,
  chave,
  aoFalhar,
  aoPronto,
}: {
  unidade: Unit;
  chave: string;
  aoFalhar: () => void;
  aoPronto: () => void;
}) {
  const quadroRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<GMap | null>(null);
  const marcadoresRef = useRef<GMarker[]>([]);
  const [pronto, setPronto] = useState(false);
  /* A unidade ativa entra no efeito de montagem por ref, e não por dependência:
     como dependência, cada clique reconstruiria o mapa do zero — que é
     exatamente o defeito do iframe que esta escolha existe para evitar. O valor
     só é lido no instante em que o mapa nasce, para ele já abrir no lugar certo
     (o script pode levar segundos, e nesse meio-tempo o visitante já pode ter
     trocado de cidade). Reposicionar depois é papel do efeito seguinte. */
  const unidadeRef = useRef(unidade);
  useEffect(() => {
    unidadeRef.current = unidade;
  }, [unidade]);

  // Monta o mapa uma vez.
  useEffect(() => {
    const quadro = quadroRef.current;
    if (!quadro) return;
    let vivo = true;
    let idleListener: GMapsListener | null = null;

    carregarMaps(chave)
      .then((google) => {
        if (!vivo || !quadroRef.current) return;
        const inicial = unidadeRef.current;
        const mapa = new google.maps.Map(quadroRef.current, {
          center: { lat: inicial.lat, lng: inicial.lon },
          zoom: inicial.zoom,
          styles: ESTILO_ESCURO,
          /* Sem os controles de UI padrão, menos o zoom: a seção não é um app de
             navegação, e o `fullscreenControl` abriria um mapa claro por cima do
             site. Rota completa é o botão que já existe ao lado. */
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          /* SIS-129 — o zoom sai do canto esquerdo, que passou a ser o painel
             sobreposto. Sem isto os botões +/- nasceriam POR BAIXO do véu e do
             cartão de endereço: existiriam no DOM, receberiam foco por teclado
             e não seriam vistos. */
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          /* Scroll do mouse NÃO dá zoom: a seção fica no meio de uma página
             longa e sequestrar a rolagem ali é hostil. Ctrl+scroll e os
             controles seguem funcionando. */
          gestureHandling: 'cooperative',
          clickableIcons: false,
        });
        mapaRef.current = mapa;

        marcadoresRef.current = UNITS.map(
          (u) =>
            new google.maps.Marker({
              position: { lat: u.lat, lng: u.lon },
              map: mapa,
              title: `${u.city} – ${u.state}`,
              icon: { url: PINO_SVG, anchor: { x: 18, y: 36 } },
            }),
        );
        idleListener = google.maps.event.addListenerOnce(mapa, 'idle', () => {
          if (!vivo) return;
          setPronto(true);
          aoPronto();
        });
      })
      .catch(() => {
        if (vivo) aoFalhar();
      });

    return () => {
      vivo = false;
      idleListener?.remove();
      marcadoresRef.current.forEach((m) => m.setMap(null));
      marcadoresRef.current = [];
      mapaRef.current = null;
    };
  }, [chave, aoFalhar, aoPronto]);

  // Troca de unidade: reposiciona a câmera, sem recarregar nada.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !pronto) return;
    const destino = { lat: unidade.lat, lng: unidade.lon };
    if (reduzirMovimento()) mapa.setCenter(destino);
    else mapa.panTo(destino);
    mapa.setZoom(unidade.zoom);
  }, [unidade, pronto]);

  return (
    <div
      ref={quadroRef}
      role="img"
      aria-label={`Mapa de ${unidade.city} – ${unidade.state}`}
      /* `h-full w-full` não é redundante com `inset-0`: quem monta o mapa dentro
         deste div escreve `position: relative` no container (a Maps JS API o faz
         em estilo inline; a folha do MapLibre, por `.maplibregl-map`). Com o
         container em `relative`, `inset-0` deixa de dimensionar e a altura colapsa
         para 0 — medido no caminho vetorial: container 1114×0, canvas nos 300px de
         fallback do MapLibre, mapa invisível e nenhum tile pedido. Altura em `%`
         sobrevive à troca de `position`, que é o ponto. */
      className="absolute inset-0 h-full w-full"
    />
  );
}

/* ── Degrau 2: MapLibre GL + tiles vetoriais (SIS-132) ───────────────────────
 * O que esta camada compra sobre o mosaico raster: **rótulo nítido**. O mosaico
 * é um mapa CLARO invertido por filtro (`invert(1) hue-rotate(180deg) …`, mais
 * abaixo), e inverter uma imagem não produz um mapa escuro — produz um mapa
 * lavado, com o halo do texto ao contrário e borrão em retina e em zoom
 * intermediário. Vetorial desenha o texto na hora, na resolução da tela.
 *
 * Contrato idêntico ao do `MapaGoogle` acima, de propósito: instância única,
 * marcadores permanentes, troca de unidade só reposicionando a câmera. O que
 * muda são os nomes — `panTo`/`setCenter` viram `flyTo`/`jumpTo`, e a ordem das
 * coordenadas é `[lon, lat]` e não `{lat, lng}`.
 */

/** WebGL pode simplesmente não existir: máquina sem aceleração, navegador com
 *  WebGL desligado, modo de economia. Perguntar antes de tentar é o que evita o
 *  quadro vazio — sem isto o MapLibre lança no construtor e a seção fica preta. */
function temWebGL() {
  try {
    const teste = document.createElement('canvas');
    return Boolean(teste.getContext('webgl2') ?? teste.getContext('webgl'));
  } catch {
    return false;
  }
}

function MapaVetorial({
  unidade,
  aoFalhar,
  aoPronto,
}: {
  unidade: Unit;
  aoFalhar: () => void;
  aoPronto: () => void;
}) {
  const quadroRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapaLibreGL | null>(null);
  const [pronto, setPronto] = useState(false);
  /* Mesma razão do mapa do Google: a unidade ativa entra por ref, não por
     dependência. Como dependência, cada clique reconstruiria o mapa. */
  const unidadeRef = useRef(unidade);
  useEffect(() => {
    unidadeRef.current = unidade;
  }, [unidade]);

  useEffect(() => {
    const quadro = quadroRef.current;
    if (!quadro) return;
    if (!temWebGL()) {
      aoFalhar();
      return;
    }

    let vivo = true;
    let mapa: MapaLibreGL | null = null;
    let marcadores: MarcadorGL[] = [];
    /* Erro ANTES do primeiro `load` é falha de estilo ou de TileJSON — o
       OpenFreeMap fora do ar, DNS bloqueado, rede corporativa filtrando. Isso cai
       para o mosaico. Erro DEPOIS é tile solto que não veio, e derrubar um mapa
       inteiro por causa de um quadrado é pior que o quadrado faltando. */
    let carregou = false;

    /* `import()` e não import estático: são ~200 kB comprimidos de biblioteca
       mais os glyphs. Ele acontece dentro do gatilho do IntersectionObserver que
       já existia (é o pai quem só monta este componente quando a seção chega),
       então /contato não paga por um mapa que o visitante pode nunca rolar até
       ver — e nada disso entra no caminho do LCP. */
    import('maplibre-gl')
      .then(({ Map: MapaLibre, Marker, NavigationControl, setWorkerUrl }) => {
        if (!vivo || !quadroRef.current) return;
        /* Sem isto o mapa pinta a cor de fundo e mais nada. O MapLibre acha o
           worker por `import.meta.url`; quando essa URL não é `http` — o caso
           aqui, tanto em `next dev` quanto no bundle de produção — ele devolve
           string vazia, e `new Worker('')` falha SEM chegar ao evento `error` do
           mapa: `isStyleLoaded()` fica em `false`, nenhum tile é pedido e nenhum
           degrau de fallback dispara, porque nada "falhou". Medido, não suposto.
           O arquivo servido aqui é cópia da versão instalada — ver
           `scripts/copiar-worker-maplibre.mjs`. */
        setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
        const inicial = unidadeRef.current;

        mapa = new MapaLibre({
          container: quadroRef.current,
          style: ESTILO_MAPA_ESCURO,
          center: [inicial.lon, inicial.lat],
          zoom: inicial.zoom,
          /* Atribuição desenhada por nós, em HTML, fora da tela do mapa: no
             layout da SIS-129 o canto de baixo é território do véu e do painel,
             e a licença exige o crédito VISÍVEL. Ver `<Atribuicao>`. */
          attributionControl: false,
          /* O equivalente ao `gestureHandling: 'cooperative'` do Google, que no
             MapLibre NÃO é o padrão — `scrollZoom` vem ligado. Numa seção no meio
             de uma página longa, sequestrar a rolagem é hostil. Com isto, rolar
             passa a página e Ctrl+rolar dá zoom. O texto da dica vem traduzido
             porque o padrão da biblioteca é em inglês. */
          cooperativeGestures: true,
          locale: {
            'CooperativeGesturesHandler.WindowsHelpText':
              'Use Ctrl + rolagem para dar zoom no mapa',
            'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + rolagem para dar zoom no mapa',
            'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
          },
          /* Nem rotação nem inclinação: a seção mostra três endereços. Um mapa
             torto por acidente de gesto não ajuda ninguém a achar o prédio. */
          dragRotate: false,
          pitchWithRotate: false,
          /* Marca d'água do provedor não existe aqui (o crédito é o nosso HTML). */
          maplibreLogo: false,
        });
        mapaRef.current = mapa;
        mapa.touchZoomRotate.disableRotation();

        /* Zoom no canto de cima à DIREITA: à esquerda fica o painel sobreposto da
           SIS-129, e ali os botões existiriam por baixo do véu — recebendo foco
           por teclado sem serem vistos. Sem bússola, que só serve com rotação. */
        mapa.addControl(new NavigationControl({ showCompass: false }), 'top-right');

        marcadores = UNITS.map((u) => {
          /* O pino da marca, o mesmo `MapPin` de lucide em ciano que a lista ao
             lado usa — `Marker` aceita elemento próprio, então não se volta para
             o alfinete padrão da biblioteca. */
          const pino = document.createElement('img');
          pino.src = PINO_SVG;
          pino.width = 36;
          pino.height = 36;
          pino.alt = '';
          pino.draggable = false;
          return new Marker({ element: pino, anchor: 'bottom' })
            .setLngLat([u.lon, u.lat])
            .addTo(mapa as MapaLibreGL);
        });

        mapa.on('error', () => {
          if (vivo && !carregou) aoFalhar();
        });
        mapa.once('load', () => {
          carregou = true;
          mapa?.once('idle', () => {
            if (!vivo) return;
            setPronto(true);
            aoPronto();
          });
        });
      })
      .catch(() => {
        /* Falha do `import()` (rede) ou do construtor (WebGL que respondeu
           existir e não inicializou). Nos dois casos, degrau 3. */
        if (vivo) aoFalhar();
      });

    return () => {
      vivo = false;
      marcadores.forEach((m) => m.remove());
      marcadores = [];
      mapa?.remove();
      mapaRef.current = null;
    };
  }, [aoFalhar, aoPronto]);

  // Troca de unidade: reposiciona a câmera, sem recarregar nada.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !pronto) return;
    const destino = { center: [unidade.lon, unidade.lat] as [number, number], zoom: unidade.zoom };
    /* `flyTo` é animação de câmera — com movimento reduzido é `jumpTo`, seco,
       exatamente como o `panTo`/`setCenter` do caminho do Google. */
    if (reduzirMovimento()) mapa.jumpTo(destino);
    else mapa.flyTo({ ...destino, speed: 1.4 });
  }, [unidade, pronto]);

  return (
    <div
      ref={quadroRef}
      role="img"
      aria-label={`Mapa de ${unidade.city} – ${unidade.state}`}
      /* `h-full w-full` não é redundante com `inset-0`: quem monta o mapa dentro
         deste div escreve `position: relative` no container (a Maps JS API o faz
         em estilo inline; a folha do MapLibre, por `.maplibregl-map`). Com o
         container em `relative`, `inset-0` deixa de dimensionar e a altura colapsa
         para 0 — medido no caminho vetorial: container 1114×0, canvas nos 300px de
         fallback do MapLibre, mapa invisível e nenhum tile pedido. Altura em `%`
         sobrevive à troca de `position`, que é o ponto. */
      className="absolute inset-0 h-full w-full"
    />
  );
}

/* ── Degrau 3: mosaico de tiles do OpenStreetMap ─────────────────────────────
 * Era a implementação anterior e continua aqui inteira, agora como ÚLTIMO
 * degrau: entra quando não há WebGL ou quando o provedor vetorial cai. Não tem
 * pan nem zoom — é o essencial de um mapa: mosaico raster posicionado por Web
 * Mercator, com o ponto no centro do quadro.
 *
 * A SIS-132 tirou dele o papel de aparência principal, mas NÃO o apagou. O
 * filtro de inversão abaixo é a razão de a issue existir (rótulo borrado, halo ao
 * contrário), e ainda assim um mapa lavado é melhor que um retângulo vazio. Quem
 * for tentado a deletar isto: leia os três degraus no cabeçalho do arquivo. */

const TAMANHO_TILE = 256;
/* 12x6 tiles = 3072x1536px. O que importa é a garantia: com o ponto no centro,
   sobram (N/2-1)*256 px de cada lado — 1280 na horizontal e 512 na vertical.
   Histórico dos números, porque cada degrau aqui foi um defeito visto:
     · 6x4 (512 e 256) — dimensionados para o quadro de 772x434 da grade de duas
       colunas. Antes disso, 4x3 apareceu em captura com faixa vazia.
     · 8x6 (768 e 512) — a SIS-129 fez o mapa virar o cartão inteiro, ~1216x512 no
       container de 1440: 608 de meia-largura e 256 de meia-altura, onde 512x256
       passava raspando na horizontal e FALHAVA na vertical.
     · 12x6 (1280 e 512) — SIS-168. O mapa sangra até a borda da janela, então a
       meia-largura deixou de ser metade de um container de 1180 e passou a ser
       metade da JANELA. Só a horizontal precisou crescer: a meia-altura de 512 já
       cobre janelas de até 1024px de altura, e a seção não passa disso (o
       `min-height` está em `globals.css`). 1280 de meia-largura cobre janela de
       até 2560px.
   O LIMITE fica dito em vez de coberto: acima de 2560px de largura o mosaico
   volta a raspar, e é assumido — cada coluna nova custa 6 tiles por unidade, e
   2560 já é o topo prático de monitor de trabalho. Se um dia aparecer defeito
   nesse tamanho, o número a mexer é este, com esta mesma conta.
   Custa 72 tiles por unidade em vez de 48, e só nas unidades que o visitante
   realmente abre (ver `carregadas`) — este é o ÚLTIMO degrau, o que só roda
   quando o vetorial cai. */
const COLUNAS = 12;
const LINHAS = 6;

/* Fonte dos tiles. Vem de env para poder trocar de provedor sem tocar no
   componente.
 *
 * O padrão é o tile padrão do OpenStreetMap porque é o único que funciona sem
 * chave: o CARTO "dark_all", que era a escolha óbvia por já ser escuro, hoje
 * devolve o tile estampado com "API KEY REQUIRED" (conferido em captura). Como
 * ele vem claro, o tema escuro sai de um filtro — `invert` + `hue-rotate`
 * mantém a água azul e o mapa em tons de carvão.
 *
 * A política de uso dos tiles do OSMF é para volume baixo e desencoraja uso
 * comercial. Como fallback de uma seção que normalmente roda no Google, o
 * volume é justamente o baixo que ela admite. */
const MODELO_TILE =
  process.env.NEXT_PUBLIC_MAP_TILES ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILES_JA_ESCUROS = process.env.NEXT_PUBLIC_MAP_TILES_DARK === '1';

/** Web Mercator: longitude/latitude para coordenada de tile fracionária. */
function paraTile(lat: number, lon: number, z: number) {
  const n = 2 ** z;
  const x = ((lon + 180) / 360) * n;
  const rad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  return { x, y };
}

function Mosaico({
  lat,
  lon,
  zoom,
  aoPronto,
}: {
  lat: number;
  lon: number;
  zoom: number;
  aoPronto?: () => void;
}) {
  const resolvidosRef = useRef(new Set<string>());
  const carregadosRef = useRef(new Set<string>());
  const prontoRef = useRef(false);
  const { x, y } = paraTile(lat, lon, zoom);
  const x0 = Math.floor(x) - (COLUNAS >> 1);
  const y0 = Math.floor(y) - (LINHAS >> 1);
  const url = (z: number, tx: number, ty: number) =>
    MODELO_TILE.replace('{z}', String(z)).replace('{x}', String(tx)).replace('{y}', String(ty));
  const limite = 2 ** zoom;

  const tiles = [];
  for (let dy = 0; dy < LINHAS; dy++) {
    for (let dx = 0; dx < COLUNAS; dx++) {
      const tx = (((x0 + dx) % limite) + limite) % limite;
      const ty = y0 + dy;
      if (ty < 0 || ty >= limite) continue;
      tiles.push({ dx, dy, tx, ty });
    }
  }

  const registrarTile = (chave: string, carregou: boolean) => {
    resolvidosRef.current.add(chave);
    if (carregou) carregadosRef.current.add(chave);

    /* Vinte e quatro tiles resolvidos cobrem o quadro desktop usual (6×4);
       doze carregados impedem que uma rajada de erros seja tratada como mapa
       utilizável. Em telas estreitas esse limiar já excede o quadro visível. */
    if (
      !prontoRef.current &&
      resolvidosRef.current.size >= Math.min(24, tiles.length) &&
      carregadosRef.current.size >= Math.min(12, tiles.length)
    ) {
      prontoRef.current = true;
      aoPronto?.();
    }
  };

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: COLUNAS * TAMANHO_TILE,
        height: LINHAS * TAMANHO_TILE,
        /* Desloca o mosaico para que o ponto exato da unidade caia no centro do
           quadro — é a parte fracionária da coordenada de tile que faz isso. */
        transform: `translate(${-(x - x0) * TAMANHO_TILE}px, ${-(y - y0) * TAMANHO_TILE}px)`,
        /* Tema escuro da marca por filtro, porque o tile de origem é claro.
           `invert` sozinho deixa a água laranja; o `hue-rotate(180deg)` devolve
           o azul. O resto tira o excesso de contraste do mapa invertido. */
        filter: TILES_JA_ESCUROS
          ? undefined
          : 'invert(1) hue-rotate(180deg) saturate(0.7) brightness(0.85) contrast(1.05)',
      }}
    >
      {tiles.map((t) => (
        /* `<img>` e não `next/image`: o projeto roda com
           `images.unoptimized`, então o wrapper não otimizaria nada, e cada
           tile ainda exigiria liberar o domínio do provedor em `remotePatterns`
           para render um PNG de 256px que já vem no tamanho exato. Mesmo
           motivo do `<img>` no ContactPanel. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${t.tx}-${t.ty}`}
          src={url(zoom, t.tx, t.ty)}
          onLoad={() => registrarTile(`${t.tx}-${t.ty}`, true)}
          onError={() => registrarTile(`${t.tx}-${t.ty}`, false)}
          alt=""
          width={TAMANHO_TILE}
          height={TAMANHO_TILE}
          /* Sem `loading="lazy"`: o adiamento já é feito pelo
             IntersectionObserver, que só monta o mosaico quando a seção chega.
             Com `lazy` por cima, os tiles das bordas — que ficam fora do quadro
             por causa do `overflow-hidden` — não eram buscados e o mapa
             aparecia com pedaços em branco. Verificado em 1440: 12 tiles no DOM
             e nenhum baixado. */
          fetchPriority="low"
          decoding="async"
          draggable={false}
          className="absolute select-none"
          style={{ left: t.dx * TAMANHO_TILE, top: t.dy * TAMANHO_TILE }}
        />
      ))}
    </div>
  );
}

/** Crédito exigido pela licença dos dados. Não é rodapé opcional: sem ele o uso
 *  dos tiles está fora da licença — ODbL nos dois provedores livres, mais o
 *  crédito que o OpenFreeMap e o OpenMapTiles pedem no vetorial. Não aparece no
 *  caminho do Google, que desenha a atribuição dele sozinho.
 *
 *  SIS-129: `z-10` porque existe um véu por cima do mapa, e canto de baixo à
 *  DIREITA, do lado oposto ao painel, para nada o cobrir — nem no estreito, onde
 *  o véu vem de baixo mas o painel para antes por causa do `padding`. */
function Atribuicao({ vetorial }: { vetorial: boolean }) {
  /* SIS-174 — o `text-[10px]` daqui virou `text-xs`, e é PONTO NOVO em relação à
     tabela da issue: ela lista este arquivo entre os que não entram em rota, e isso
     caducou — a SIS-168 devolveu o mapa como fundo da seção "Onde Estamos", e
     `/contato` importa e monta `MapaUnidades` (`src/app/contato/page.tsx:7` e
     `:233`). Estando na rota, o piso volta a valer: é texto corrido com links, sem
     caixa-alta e sem tracking, e é a atribuição que a licença ODbL dos tiles exige
     — crédito que ninguém consegue ler não cumpre a licença. */
  return (
    <p className="absolute bottom-0 right-0 z-10 bg-[#0a1f44]/70 px-2 py-1 text-xs leading-none text-white/70">
      {vetorial && (
        <>
          <a
            href="https://openfreemap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            OpenFreeMap
          </a>
          {' · '}
          <a
            href="https://www.openmaptiles.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            © OpenMapTiles
          </a>
          {' · '}
        </>
      )}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        © OpenStreetMap contributors
      </a>
    </p>
  );
}

/** `cabecalho` é a pílula #sistran e o `<h2>` da seção (SIS-168). Eles entraram
 *  para DENTRO do mapa, mas continuam sendo desenhados por `contato/page.tsx`:
 *  a escrita é da rota, e o `id` do título é o alvo do `aria-labelledby` da
 *  seção — trazê-los para cá tiraria as duas coisas do lugar onde elas se
 *  explicam. Opcional porque só a rota que sangra o mapa os manda. */
export default function MapaUnidades({ cabecalho }: { cabecalho?: ReactNode }) {
  const routeGate = useRouteLoadGate();
  const [ativa, setAtiva] = useState(UNITS[0].id);
  /* Mapa só entra depois que a seção aparece: são requisições que não podem
     competir com o LCP da página — e, no caso do Google, cada carregamento é
     cobrado. Rolar até "Onde Estamos" é o gatilho. */
  const [visivel, setVisivel] = useState(() => Boolean(routeGate?.forceMapLoad));
  const [googleFalhou, setGoogleFalhou] = useState(false);
  const [vetorialFalhou, setVetorialFalhou] = useState(false);
  /* Cada unidade já vista continua montada, para a troca ser um crossfade e não
     um recarregamento. As não visitadas nunca baixam tile nenhum.
     Só o mosaico precisa disto: Google e vetorial são instância única. */
  const [carregadas, setCarregadas] = useState<readonly string[]>([UNITS[0].id]);
  const quadroRef = useRef<HTMLDivElement>(null);

  /* SIS-132 — provedor em TRÊS estados, e não no booleano `usarGoogle` de antes.
     A ordem é a do cabeçalho do arquivo: Google se houver chave, senão vetorial,
     e mosaico só quando o vetorial também tiver caído. Cada degrau só é
     descartado depois de falhar de verdade — nada é escolhido por adivinhação. */
  const provedor: 'google' | 'vetorial' | 'mosaico' =
    CHAVE_GOOGLE && !googleFalhou ? 'google' : vetorialFalhou ? 'mosaico' : 'vetorial';
  const aoFalharGoogle = useCallback(() => setGoogleFalhou(true), []);
  const aoFalharVetorial = useCallback(() => setVetorialFalhou(true), []);
  const aoPronto = routeGate?.reportMapReady;

  useEffect(() => {
    if (visivel) return;
    const el = quadroRef.current;
    if (!el) return;
    /* Sem IntersectionObserver (ou com JS desligado) o mapa simplesmente não
       aparece — o endereço e o telefone ao lado são HTML e continuam de pé. */
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visivel]);

  function selecionar(id: string) {
    setAtiva(id);
    setCarregadas((atual) => (atual.includes(id) ? atual : [...atual, id]));
  }

  const unidade = UNITS.find((u) => u.id === ativa) ?? UNITS[0];

  return (
    /* SIS-129 — a seção deixa de ser "lista clara ao lado de um mapa" e passa a
       ser UM cartão escuro cujo fundo é o próprio mapa, com o painel por cima.
       Essa parte continua valendo, e é a base do que veio depois.

       SIS-168 — o cartão deixou de ser cartão: ele é a SUPERFÍCIE da seção,
       sangrando de borda a borda. As duas decisões que a SIS-129 tinha escrito
       aqui foram REVERTIDAS por pedido de desenho, e ficam registradas com o que
       respondeu a cada uma, porque as duas eram argumentos de verdade:

       | A pílula #sistran e o título continuam FORA do cartão, em `container-lp`
       | (quem os desenha é `contato/page.tsx`).

       Resposta: eles entraram, e continuam sendo desenhados por
       `contato/page.tsx` — chegam aqui pela prop `cabecalho` e são impressos no
       topo do painel. Ou seja o que a frase protegia (a escrita e o `id` do
       título morarem na rota) NÃO foi perdido; o que mudou é só onde eles pousam
       na tela.

       | Largura: cheia dentro de `container-lp`, e não sangrando até a borda da
       | janela. O cartão já triplicou de largura ao absorver a coluna do seletor;
       | o alinhamento com o título é o que ainda dá à seção um eixo, e um cartão
       | sangrado passaria por cima do fundo claro da seção sem nada que o
       | ancorasse.

       Resposta, e é o ponto que faz o sangramento funcionar: o EIXO não vinha do
       `container-lp`, vinha do alinhamento com o título — e o título agora está
       DENTRO, na mesma goteira, alinhado ao mesmo eixo por cálculo
       (`--mapa-eixo` em `globals.css`, que reproduz a goteira do `container-lp`
       sem a caixa). E "passaria por cima do fundo claro sem nada que o
       ancorasse" deixou de se aplicar por um motivo objetivo: NÃO HÁ MAIS fundo
       claro. A `section-light section-light-blue` saiu da seção (ver
       `contato/page.tsx`), e o mapa encosta em escuro nas duas pontas.

       Fronteira: a versão anterior deste comentário dizia que a borda
       arredondada era o que separava o cartão da seção, e que por isso o chanfro
       da SIS-75 não se aplicava. A borda saiu junto com o cartão, então o
       argumento caiu — e a conclusão continua a mesma por outra razão: as duas
       fronteiras desta seção passaram a ser escuro contra escuro (acima
       `fundo-contato-cena`, abaixo o palco do `#timeSISTRAN`), e chanfro serve
       para quebrar corte reto entre brilhos diferentes. A justificativa está por
       extenso em `contato/page.tsx`, junto da seção.

       `on-dark` SAIU, e não é limpeza cosmética. Ele era obrigatório enquanto
       este cartão era ilha escura dentro de `section-light`: `.section-light
       h3/p/span` (globals.css:565) pintava todo o texto de navy #0a1f44 com
       especificidade que vence as utilities do Tailwind, e sem `on-dark` o painel
       ficava navy sobre navy — medido na época, `color: rgb(10, 31, 68)` em h3,
       span e p. Com `section-light` fora da seção, `.section-light .on-dark …`
       nunca casa: `on-dark` só existe escopado por `.section-light`
       (globals.css:645-665), então mantê-lo aqui seria classe morta sustentada
       por um comentário falso. O `mt-10` saiu pelo mesmo motivo que o
       `section-py` da seção: não há mais nada acima do que se separar.
       O que NÃO muda: os dois links de telefone e de rota continuam com a cor em
       `style`, porque ela é a cor da marca sobre navy e não uma válvula de escape
       da regra da seção clara — funciona igual com ou sem `section-light`. */
    <div className="mapa-cartao" data-map-provider={visivel ? provedor : 'adiado'}>
      <div ref={quadroRef} className="mapa-cartao-mapa">
        {visivel && provedor === 'google' && (
          <MapaGoogle
            unidade={unidade}
            chave={CHAVE_GOOGLE as string}
            aoFalhar={aoFalharGoogle}
            aoPronto={aoPronto ?? SEM_ACAO}
          />
        )}

        {visivel && provedor === 'vetorial' && (
          <>
            <MapaVetorial
              unidade={unidade}
              aoFalhar={aoFalharVetorial}
              aoPronto={aoPronto ?? SEM_ACAO}
            />
            <Atribuicao vetorial />
          </>
        )}

        {visivel && provedor === 'mosaico' && (
          <div role="img" aria-label={`Mapa de ${unidade.city} – ${unidade.state}`}>
            {UNITS.filter((u) => carregadas.includes(u.id)).map((u) => (
              <div
                key={u.id}
                aria-hidden={u.id !== ativa}
                /* O `scale` é o "recentrar animado": a unidade que entra vem um
                   fio maior e assenta. Com reduced-motion o reset global do
                   globals.css zera a transição e a troca fica seca — o endereço,
                   o telefone e a rota não dependem dela em momento nenhum. */
                className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                  u.id === ativa ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                }`}
              >
                <Mosaico
                  lat={u.lat}
                  lon={u.lon}
                  zoom={u.zoom}
                  aoPronto={u.id === ativa ? aoPronto : undefined}
                />
              </div>
            ))}

            {/* Pino no centro do quadro: o mosaico é posicionado justamente para
                que o centro seja o ponto da unidade. Só o mosaico precisa deste
                truque: nos degraus 1 e 2 (Google e vetorial) cada unidade tem um
                marcador de verdade, ancorado em coordenada e não no centro. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
            >
              <MapPin
                className="h-9 w-9 text-[#2AC4FF] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                strokeWidth={2}
                fill="#0a1f44"
              />
            </span>

            <Atribuicao vetorial={false} />
          </div>
        )}
      </div>

      {/* Véu: é ele, sozinho, que garante o contraste do texto. O visitante pode
          arrastar o mapa e trazer uma área branca para baixo do painel, então o
          contraste não pode depender do que está atrás. Medido no pior caso
          (fundo branco puro sob o painel) — ver comentário em globals.css. */}
      <div aria-hidden className="mapa-veu" />

      <div className="mapa-painel">
        {/* SIS-168 — pílula e título passam a viver DENTRO do painel, por cima do
            mapa. O bloco é `pointer-events: none` herdado do painel (só botões e
            links voltam a receber evento), então texto aqui não rouba o arrasto
            do mapa. Quem os desenha continua sendo `contato/page.tsx`: ver a prop
            `cabecalho`. */}
        {cabecalho && <div className="mapa-painel-cabecalho">{cabecalho}</div>}

        {/* Botões com `aria-pressed`, não um tablist: seleção por hover ficou
            fora de propósito. No toque não existe hover, e no mouse ela troca a
            unidade só porque o ponteiro passou por cima a caminho de outra
            coisa. Clique e teclado bastam. */}
        {/* Paleta invertida: o painel saiu de uma seção clara para cima de um
            mapa escuro. `text-ink`, `bg-white/60` e o azul `#1273BC` (que é
            legível sobre branco, não sobre navy) deram lugar a branco e ao ciano
            da marca. Nenhum `glass-card`: aquele componente é claro por
            definição. */}
        <ul className="space-y-2.5">
          {UNITS.map((u) => {
            const atual = u.id === ativa;
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => selecionar(u.id)}
                  aria-pressed={atual}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                    atual
                      ? 'border-[#2AC4FF]/70 bg-[#2AC4FF]/14 text-white'
                      : 'border-white/15 bg-white/[0.06] text-white/85 hover:border-[#2AC4FF]/50 hover:bg-white/10'
                  }`}
                >
                  <MapPin
                    aria-hidden
                    className={`h-4 w-4 shrink-0 ${atual ? 'text-[#2AC4FF]' : 'text-white/45'}`}
                    strokeWidth={2}
                  />
                  <span className="font-display text-base">
                    {u.city} – {u.state}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Sem fundo próprio nem borda: o véu já é a superfície deste bloco.
            Um segundo painel opaco aqui viraria cartão dentro de cartão. */}
        <div className="mt-6">
          <h3 className="font-display text-lg text-white">
            {unidade.city} – {unidade.state}
          </h3>
          {unidade.address ? (
            <p className="mt-3 text-sm leading-relaxed text-white/80">{unidade.address}</p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Endereço não divulgado. O mapa mostra a cidade, não o escritório.
            </p>
          )}
          {unidade.phone && (
            <a
              href={`tel:${unidade.phone.replace(/\D/g, '')}`}
              /* Cor por `style`, não por utility. A razão ORIGINAL era vencer
                 `.section-light .on-dark a`, que achata todo link em branco 88%
                 com `!important` e prevê `[style*="color"]` como válvula de
                 escape (mesmo caminho de Accelerators.tsx:123).
                 SIS-168 — aquela regra não alcança mais este link: a seção deixou
                 de ser `section-light`. O `style` FICA de propósito, e agora por
                 outro motivo: é o ciano da marca sobre navy, escolhido por
                 contraste e não por briga de especificidade. Trocar por utility
                 daria o mesmo pixel hoje e voltaria a ser frágil se esta seção
                 algum dia voltar a ser clara. */
              style={{ color: '#7fdcff' }}
              className="mt-4 flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              <Phone aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {unidade.phone}
            </a>
          )}
          <a
            href={mapsHref(unidade)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#7fdcff' }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
          >
            <ExternalLink aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            Ver no Google Maps e traçar rota
          </a>
        </div>
      </div>
    </div>
  );
}
