'use client';

import { useMotionValueEvent, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';

type Props = {
  /** Caminho do arquivo em `public`. */
  src: string;
  /** Progresso 0–1 que vira posição no vídeo. */
  progress: MotionValue<number>;
  className?: string;
  poster?: string;
  /**
   * Publica `data-pronto="true"` no `<video>` quando existe quadro decodificado,
   * para o CSS revelar o elemento só a partir daí (`opacity: 0` -> 1).
   *
   * É opt-in de propósito. Quem liga isto assume que o container tem a regra de
   * `opacity` correspondente E as saídas de emergência (movimento reduzido,
   * falha de carregamento) — sem elas o vídeo fica invisível para sempre. O
   * `HeroCinematic` NÃO liga: ele é a primeira coisa da página e abrir vazio
   * enquanto decodifica seria trocar um defeito por outro mais visível.
   */
  revelarQuandoPronto?: boolean;
  /**
   * SIS-189 — liga a FASE A: o vídeo toca sozinho e passa a ser o relógio. Com
   * `true` a raspagem fica SUSPENSA (nenhum `currentTime` é escrito por seek), e
   * é por isso que o modo é um booleano e não dois componentes: o ponto 1 da
   * issue exige um escritor só de `currentTime`, e o jeito de garantir isso é a
   * mesma peça saber dos dois modos e nunca estar nos dois.
   *
   * Default `false` — os outros consumos de `ScrollVideo` continuam só com seek,
   * sem uma linha de diferença.
   */
  reproduzir?: boolean;
  /**
   * Fração do vídeo em que a Fase A para. `1` toca até o fim.
   *
   * Existe porque o vídeo do hero deixa de ser o assunto antes do fim do
   * percurso (ponto 3 da issue): quem chama escreve o teto, esta peça só o
   * respeita.
   */
  tetoReproducao?: number;
  /** Progresso do vídeo durante a Fase A, para quem for o dono do eixo de tempo. */
  onFracao?: (fracao: number) => void;
  /**
   * Fim da Fase A — por ter chegado ao teto OU por `play()` ter sido recusado
   * (iOS/economia de bateria). Os dois casos são o mesmo para quem chama: a
   * rolagem volta a mandar.
   */
  onEntradaEncerrada?: () => void;
};

/**
 * Vídeo em DOIS modos, nunca nos dois ao mesmo tempo.
 *
 * SIS-189 — ERA: "Vídeo cujo tempo é a posição de scroll — não há play nem pause."
 * Deixou de ser verdade: o hero da home precisa que o vídeo comece sozinho ao
 * entrar. O que a frase antiga defendia continua valendo e é o que importa — há
 * UM escritor de `currentTime` por vez:
 *
 *   • modo RASPAGEM (default, `reproduzir: false`) — o tempo é a posição de
 *     scroll, exatamente como antes. Nenhum `play()`.
 *   • modo REPRODUÇÃO (`reproduzir: true`, a Fase A do hero) — o vídeo toca e a
 *     raspagem fica suspensa: `buscar()` sai pela porta da frente sem escrever
 *     nada, e o progresso que chega é só guardado em `alvo`. Quem manda no eixo
 *     de tempo da cena passa a ser `onFracao`.
 *
 * Play e seek ao mesmo tempo é o que entope a fila do decodificador, e é a razão
 * de este componente existir. A troca de modo é a única coisa que garante isso, e
 * por isso ela é síncrona: `reproduzir` vira `false` no mesmo gesto em que a
 * rolagem assume.
 *
 * O scroll dispara muito mais vezes do que o decodificador consegue atender, e
 * escrever `currentTime` a cada disparo entope a fila de seek: o vídeo trava em
 * vez de acompanhar. O acelerador é o próprio `seeking` — enquanto uma busca
 * está em curso só guardamos o alvo, e quando ela termina aplicamos o valor mais
 * recente. Assim o vídeo anda no ritmo que consegue, sem fila.
 *
 * Isto substitui o `driveVideoByScroll` com `requestAnimationFrame` + lerp que
 * ficava comentado em `HeroCinematic`: o lerp escrevia `currentTime` a cada
 * frame, inclusive durante um seek pendente, que é exatamente o que trava.
 *
 * O arquivo precisa ser all-intra (todo quadro é keyframe) para poder ser
 * buscado quadro a quadro:
 *
 *   ffmpeg -i entrada.mp4 -an -c:v libx264 -preset slow -crf 32 -g 1 \
 *     -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart \
 *     hero-scroll.mp4
 */
export function ScrollVideo({
  src,
  progress,
  className,
  poster,
  revelarQuandoPronto = false,
  reproduzir = false,
  tetoReproducao = 1,
  onFracao,
  onEntradaEncerrada,
}: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const alvo = useRef(0);

  /* Espelhos em `ref` de tudo que a Fase A consome. Os ouvintes e o laço de
     quadro são registrados UMA vez (ver o efeito com `[]` adiante); ler a prop
     direto lá dentro congelaria o valor do primeiro render, e pôr as props na
     lista de dependências recriaria os ouvintes a cada render do pai — que, num
     componente cujo pai anima a cada quadro, é a cada quadro. */
  const reproduzindo = useRef(reproduzir);
  const teto = useRef(tetoReproducao);
  const aoFracao = useRef(onFracao);
  const aoEncerrar = useRef(onEntradaEncerrada);

  /* Efeito sem lista de dependências — roda depois de TODO render, que é o que
     "espelho" quer dizer. Escrever em `ref` durante o render é o que o lint da
     casa barra como erro (`react-hooks/set-state-in-render`), e com razão: no
     modo estrito o render pode ser descartado, e o espelho ficaria adiantado em
     relação à árvore. Fica declarado ANTES do efeito da Fase A de propósito:
     efeitos rodam na ordem de declaração, então quando aquele lê `teto.current`
     o valor já é o desta passagem. */
  useEffect(() => {
    reproduzindo.current = reproduzir;
    teto.current = tetoReproducao;
    aoFracao.current = onFracao;
    aoEncerrar.current = onEntradaEncerrada;
  });

  /* Escrito uma vez e nunca desfeito. Reverter faria o vídeo piscar a cada seek
     pendente, que é o estado normal durante uma rolagem rápida.

     Atributo escrito direto no elemento em vez de estado do React: isto muda a
     cada `change` de scroll, e um `setState` aqui reentraria no render a cada
     quadro pelo mesmo motivo que o seek é acelerado. */
  const revelado = useRef(false);
  const revelar = () => {
    if (!revelarQuandoPronto || revelado.current) return;
    const el = video.current;
    if (!el) return;
    revelado.current = true;
    el.dataset.pronto = 'true';
  };

  const buscar = () => {
    const el = video.current;
    // `duration` é NaN até os metadados chegarem, e `readyState < 1` significa
    // que nem isso aconteceu: seek agora seria descartado em silêncio.
    if (!el || el.readyState < 1 || !Number.isFinite(el.duration)) return;
    // `readyState >= 2` (HAVE_CURRENT_DATA) com busca encerrada é a definição de
    // "há quadro pintado" — antes disso o elemento pinta preto, ou o pôster.
    if (el.readyState >= 2 && !el.seeking) revelar();
    // FASE A: o vídeo está tocando e é ele o relógio. Sai antes de escrever
    // `currentTime` — este é o ponto exato em que o segundo escritor apareceria.
    // `alvo` continua atualizado por `useMotionValueEvent`, então o primeiro seek
    // da Fase B já parte da posição certa, sem quadro intermediário.
    if (reproduzindo.current) return;
    // Busca em curso: o alvo já está guardado e `seeked` aplica o mais recente.
    if (el.seeking) return;
    // Nunca a duração exata: no último quadro alguns navegadores disparam
    // `ended` e devolvem o vídeo ao início, o que faria a cena piscar.
    const t = Math.min(Math.max(alvo.current, 0), 1) * (el.duration - 0.05);
    if (Math.abs(el.currentTime - t) > 0.03) el.currentTime = t;
  };

  useMotionValueEvent(progress, 'change', (valor) => {
    alvo.current = valor;
    buscar();
  });

  /* `loadedmetadata`: sem ele o vídeo abriria no quadro zero se a página for
     carregada com a seção já na tela (recarga a partir de um scroll, âncora,
     volta do histórico) — o primeiro seek chega antes de haver duração.
     `seeked`: fecha o acelerador, aplicando o alvo que chegou durante a busca. */
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    alvo.current = progress.get();
    buscar();
    el.addEventListener('loadedmetadata', buscar);
    el.addEventListener('seeked', buscar);
    /* `loadeddata`: a revelação não pode depender de haver scroll. Se a seção
       entra na tela sem que o progresso mude (recarga com a âncora, volta do
       histórico), `buscar` só roda no efeito — antes de existir quadro.
       `error`: sem isto, arquivo que não carrega = elemento invisível para
       sempre. Revelar deixa o pôster aparecer; se ele também falhar, o que fica
       é o fundo da seção, e o texto continua no HTML servido, fora do vídeo. */
    el.addEventListener('loadeddata', revelar);
    el.addEventListener('error', revelar);
    return () => {
      el.removeEventListener('loadedmetadata', buscar);
      el.removeEventListener('seeked', buscar);
      el.removeEventListener('loadeddata', revelar);
      el.removeEventListener('error', revelar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── FASE A: o vídeo toca e publica o próprio relógio ─────────────────────
     Laço de quadro, e NÃO `timeupdate`: o evento dispara ~4 vezes por segundo, e
     esta fração move a rolagem da página (`HeroCinematic`). A 4 Hz a página
     andaria aos degraus. */
  useEffect(() => {
    const el = video.current;
    if (!el || !reproduzir) return;

    let quadro = 0;
    let encerrado = false;

    /* Encerrar é idempotente e faz as duas coisas juntas — pausar e avisar —
       porque os três caminhos de saída (teto, recusa do `play()`, desmontagem)
       têm de deixar o elemento no mesmo estado. */
    const encerrar = () => {
      if (encerrado) return;
      encerrado = true;
      el.pause();
      aoEncerrar.current?.();
    };

    const passo = () => {
      quadro = requestAnimationFrame(passo);
      if (!Number.isFinite(el.duration) || el.duration <= 0) return;
      // O mesmo `- 0.05` da raspagem: no último quadro alguns navegadores
      // disparam `ended` e devolvem o vídeo ao início. Aqui a conta é a inversa
      // da de `buscar`, para que a fração publicada e a fração buscada signifiquem
      // exatamente a mesma posição — senão a passagem para a Fase B daria um
      // salto de quadro.
      const f = Math.min(1, Math.max(0, el.currentTime / (el.duration - 0.05)));
      aoFracao.current?.(f);
      if (f >= teto.current) encerrar();
    };

    /* `play()` devolve promessa e ela pode ser RECUSADA (iOS com economia de
       bateria, aba sem permissão). Recusa não é erro de programa: é a Fase A não
       acontecer, e a rolagem segue sendo o caminho. */
    el.play()
      .then(() => {
        quadro = requestAnimationFrame(passo);
      })
      .catch(() => {
        encerrar();
      });

    return () => {
      cancelAnimationFrame(quadro);
      /* Pausa sem avisar: desmontar ou desligar a Fase A por fora não é "a
         entrada terminou", e chamar `onEntradaEncerrada` aqui reentraria no pai
         durante a limpeza dele. */
      encerrado = true;
      el.pause();
    };
  }, [reproduzir]);

  return (
    <video
      ref={video}
      data-route-critical-media=""
      className={className}
      src={src}
      poster={poster}
      // `muted` e `playsInline` continuam necessários mesmo sem autoplay: sem o
      // segundo, o iOS abre o vídeo em tela cheia ao primeiro toque.
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
