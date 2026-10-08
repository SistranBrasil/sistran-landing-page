'use client';

/**
 * useHeroFrameSequence — liga a rolagem ao Canvas do hero.
 *
 *   GSAP ScrollTrigger ─► destino ─► tique() [seguidor amortecido] ─► playhead.frame
 *                                        │                               │
 *                                        └─► render() ─► FrameRenderer.desenhar(bitmap)
 *                                                           │
 *                                      FrameLoader.focar ◄──┴──► DecodeWindow.atualizar
 *
 * O ScrollTrigger não anima nada: publica só o DESTINO (progresso × quadros). Entre o destino e o
 * quadro desenhado há um seguidor com constante de tempo e teto de quadros/s — é ele que torna o
 * avanço contínuo quando a rolagem pede 15 quadros de uma vez. Ver `SUAVIZACAO_MS` no config.
 *
 * O ScrollTrigger mede o MESMO elemento e os MESMOS limites que o `useScroll` do `motion/react`
 * em `HeroCinematic` (`#top`, `top top` → `bottom bottom`): os dois relógios lêem a mesma
 * geometria e por isso concordam. O GSAP entra só para o playhead; as legendas, a manchete e
 * os beats continuam no `motion`.
 *
 * NUNCA `pin: true`: a cena é `position: sticky` no CSS. O pin-spacer que o GSAP injetaria
 * quebraria o contrato `#top + *` do `globals.css` e a `.hero-sheet` com `margin-bottom: -100svh`.
 *
 * Caminhos em que o hook NÃO monta a sequência (o pôster `<img>` fica, e é isso o fallback):
 *   • movimento reduzido (sistema OU botão da interface, `html[data-motion="reduce"]`) — sem
 *     percurso de rolagem não há o que raspar, e 44 MiB de quadros não são baixados;
 *   • navegador sem AVIF — descoberto sem request extra: o `<picture>` já escolheu a fonte, e
 *     `img.currentSrc` conta qual foi;
 *   • sem `createImageBitmap`.
 *
 * `carregar` (o portão da rota, `RouteLoadGate.liberado`) só decide QUANDO a fila de rede
 * começa, nunca SE — mesma regra que valia para o `<video>`.
 */
import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import { consultaCombina } from '@/lib/mediaStore';
import {
  CONCORRENCIA_DOWNLOAD,
  EPSILON_QUADRO,
  JANELA_INICIAL,
  PONTO_DE_QUEBRA_DESKTOP,
  PREFETCH,
  SALTO_MS,
  SUAVIZACAO_MS,
  VELOCIDADE_MAX_QUADROS_S,
  ehHd,
  escolherTier,
  janelaDeDecode,
  urlDoQuadro,
} from './heroFrameConfig';
import { FrameLoader } from './frameLoader';
import { DecodeWindow } from './decodeWindow';
import { FrameRenderer } from './frameRenderer';

export type EstadoDoHero = 'inicial' | 'ativo' | 'reduzido' | 'sem-avif' | 'sem-bitmap' | 'sem-tier';

type Params = {
  /** O `#top`: quem o ScrollTrigger mede. Só é lido. */
  gatilho: RefObject<HTMLElement | null>;
  carregar: boolean;
};

/**
 * Os três nós que o hook ESCREVE (atributos `data-*`, backing do canvas) são refs criadas aqui e
 * devolvidas ao componente, não recebidas dele: a regra `react-hooks/immutability` do React
 * Compiler barra escrever em argumento de hook, e com razão — o dono da escrita é quem a declara.
 */
export type RefsDoHero = {
  /** A caixa cuja medida CSS vira o backing do canvas. */
  caixa: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  /** O `<img>` do pôster: fallback visual e detector de AVIF. */
  poster: RefObject<HTMLImageElement | null>;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function useHeroFrameSequence({ gatilho, carregar }: Params): RefsDoHero {
  const caixa = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const loaderRef = useRef<FrameLoader | null>(null);
  const carregarRef = useRef(carregar);

  useEffect(() => {
    const el = canvas.current;
    const box = caixa.current;
    const trig = gatilho.current;
    const img = poster.current;
    if (!el || !box || !trig || !img) return;

    const marcar = (estado: EstadoDoHero) => {
      el.dataset.estado = estado;
    };

    if (prefersReducedMotion() || document.documentElement.dataset.motion === 'reduce') {
      marcar('reduzido');
      return;
    }
    if (typeof createImageBitmap !== 'function') {
      marcar('sem-bitmap');
      return;
    }

    let cancelado = false;
    let ctx: gsap.Context | null = null;
    let loader: FrameLoader | null = null;
    let decoder: DecodeWindow | null = null;
    let renderer: FrameRenderer | null = null;
    let observador: ResizeObserver | null = null;
    let medir: (() => void) | null = null;
    let raf = 0;

    const montar = () => {
      if (cancelado) return;
      if (!/\.avif(\?|$)/i.test(img.currentSrc)) {
        marcar('sem-avif');
        return;
      }
      const desktop = consultaCombina(PONTO_DE_QUEBRA_DESKTOP);
      const t = escolherTier({ desktop, hd: ehHd() });
      if (!t) {
        marcar('sem-tier');
        return;
      }
      const total = t.quadros;
      const janela = janelaDeDecode(t, desktop);
      /* `destino` é onde a rolagem está; `playhead.frame` é onde o desenho está. O seguidor
         amortecido do loop abaixo é o que separa os dois — ver `SUAVIZACAO_MS` no config. */
      const playhead = { frame: 0 };
      let destino = 0;
      let direcao: 1 | -1 = 1;
      let ultimoTique = 0;

      renderer = new FrameRenderer(el);
      /* Para a medição (`scripts/medir-hero-quadros.mjs`): tier e total escolhidos. */
      el.dataset.tier = t.id;
      el.dataset.total = String(total);

      const render = () => {
        if (!renderer || !decoder || !loader) return;
        const alvo = clamp(Math.round(playhead.frame), 0, total - 1);
        const alvoDaRolagem = clamp(Math.round(destino), 0, total - 1);
        /* Alvo do playhead (antes do fallback para o decodificado mais próximo): a diferença
           entre `data-alvo` e `data-quadro` é o atraso de decode, medido pela sonda. */
        el.dataset.alvo = String(alvo);
        /* A FILA E O DECODE MIRAM A ROLAGEM, NÃO O DESENHO. O seguidor amortecido anda alguns
           quadros atrás de propósito; se a mira da rede e do decode andasse atrasada com ele, o
           pipeline buscaria sempre o que já passou. Medido em 08/10/2026: mirar no desenho levou
           o atraso de decode p90 de 45–52 para 185 quadros, com 5 quadros distintos em 76 rAF
           (a cena praticamente congelada). O desenho é amortecido; a mira é crua. */
        loader.focar(alvoDaRolagem, direcao);
        decoder.atualizar(alvo, alvoDaRolagem, direcao);
        /* O quadro certo se já está decodificado; senão o decodificado mais próximo. Nunca um
           canvas vazio, nunca decode síncrono no caminho do frame. */
        const i = decoder.maisProximoDecodificado(alvo);
        if (i < 0) return;
        const bm = decoder.pegar(i);
        if (!bm) return;
        renderer.desenhar(bm, i);
        /* Legível no DOM para a medição (`scripts/medir-hero-quadros.mjs`), como o
           `data-scrub` do `ScrubScope`. Nenhum seletor de CSS depende disto. */
        if (renderer.ultimoDesenhado === i) el.dataset.quadro = String(i);
        if (el.dataset.estado !== 'ativo') marcar('ativo');
      };
      /* Um tique: aproxima o playhead do destino e desenha. Enquanto sobrar distância, reagenda —
         é por isso que a cena continua andando (e suavizando) depois de o gesto de rolagem acabar. */
      const tique = (agora: number) => {
        raf = 0;
        const bruto = ultimoTique ? agora - ultimoTique : 16;
        const dt = Math.min(64, bruto);
        ultimoTique = agora;
        const falta = destino - playhead.frame;
        /* Quando a tela não está entregando quadros (aba que volta do segundo plano, CPU tomada:
           medido a ~1 fps com o antivírus varrendo), amortecer não suaviza nada — só acumula
           atraso, porque o seguidor só pode andar uma vez por quadro de animação. Acima de
           `SALTO_MS` o playhead vai direto para a posição da rolagem: nessas condições o olho vê
           um corte seco de qualquer forma, e é melhor que ele mostre o quadro certo. */
        if (bruto > SALTO_MS) {
          playhead.frame = destino;
        } else if (Math.abs(falta) <= EPSILON_QUADRO) {
          playhead.frame = destino;
        } else {
          /* Decaimento exponencial: mesma constante de tempo a 60 Hz e a 120 Hz. */
          const k = 1 - Math.exp(-dt / SUAVIZACAO_MS);
          const teto = (VELOCIDADE_MAX_QUADROS_S * dt) / 1000;
          const avanco = clamp(falta * k, -teto, teto);
          playhead.frame += avanco;
          direcao = avanco < 0 ? -1 : 1;
          agendarRender();
        }
        render();
      };
      const agendarRender = () => {
        if (!raf) raf = requestAnimationFrame(tique);
      };

      loader = new FrameLoader({
        total,
        url: (i) => urlDoQuadro(t, i),
        concorrencia: CONCORRENCIA_DOWNLOAD,
        janelaInicial: JANELA_INICIAL,
        atras: PREFETCH.atras,
        frente: PREFETCH.frente,
        onQuadro: (i) => decoder?.chegou(i),
        onErro: (i, erro) => console.warn('[hero] quadro não carregou', i, erro),
      });
      decoder = new DecodeWindow({
        total,
        atras: janela.atras,
        frente: janela.frente,
        paralelo: janela.paralelo,
        pegarBlob: (i) => loader?.blob(i),
        onPronto: agendarRender,
        onErro: (i, erro) => console.warn('[hero] quadro não decodificou', i, erro),
      });
      loaderRef.current = loader;
      if (carregarRef.current) loader.iniciar();

      medir = () => {
        if (!renderer) return;
        /* Medida de LAYOUT, não `getBoundingClientRect`: a camada `.hero-media` escala por beat
           (1,03–1,08) e o rect viria com a escala do instante — o backing deve ser estável. */
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (w <= 0 || h <= 0) return;
        if (renderer.redimensionar(w, h, window.devicePixelRatio)) {
          /* `canvas.width=` apaga o conteúdo; redesenha no mesmo quadro para não piscar. */
          render();
        }
      };
      medir();
      observador = new ResizeObserver(() => medir?.());
      observador.observe(box);
      /* Zoom do navegador muda o DPR sem mudar a caixa CSS: o ResizeObserver não vê. */
      window.addEventListener('resize', medir);

      const publicarDestino = (self: ScrollTrigger) => {
        if (self.end <= self.start) return;
        destino = clamp(self.progress, 0, 1) * (total - 1);
        agendarRender();
      };

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        /* ScrollTrigger sem tween: ele só publica o DESTINO. Quem anda até lá é o seguidor
           amortecido em `tique` — um `gsap.to` escreveria `playhead.frame` por cima dele. */
        ScrollTrigger.create({
          trigger: trig,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => publicarDestino(self),
          /* Um refresh pode cair com o `#top` ainda sem altura medida (`end === start`): o
             ScrollTrigger então reporta `progress = 1`, o destino saltaria para o último quadro e
             o seguidor sairia andando para lá — foi o que fez a sonda ler o quadro 360 na posição
             0 do percurso. `publicarDestino` descarta esse caso. */
          onRefresh: (self) => publicarDestino(self),
        });
      });
      agendarRender();
    };

    /* O `<picture>` só revela a fonte escolhida depois de carregar. */
    const aoCarregarPoster = () => montar();
    if (img.complete && img.naturalWidth > 0) montar();
    else {
      img.addEventListener('load', aoCarregarPoster, { once: true });
      img.addEventListener('error', aoCarregarPoster, { once: true });
    }

    return () => {
      cancelado = true;
      img.removeEventListener('load', aoCarregarPoster);
      img.removeEventListener('error', aoCarregarPoster);
      if (raf) cancelAnimationFrame(raf);
      if (medir) window.removeEventListener('resize', medir);
      observador?.disconnect();
      /* Só o que ESTE hook criou. Nunca `ScrollTrigger.killAll()`. */
      ctx?.revert();
      loader?.parar();
      decoder?.limpar();
      loaderRef.current = null;
    };
  }, [gatilho]);

  useEffect(() => {
    carregarRef.current = carregar;
    if (carregar) loaderRef.current?.iniciar();
  }, [carregar]);

  return { caixa, canvas, poster };
}
