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
};

/**
 * Vídeo cujo tempo é a posição de scroll — não há play nem pause.
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
export function ScrollVideo({ src, progress, className, poster }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const alvo = useRef(0);

  const buscar = () => {
    const el = video.current;
    // `duration` é NaN até os metadados chegarem, e `readyState < 1` significa
    // que nem isso aconteceu: seek agora seria descartado em silêncio.
    if (!el || el.readyState < 1 || !Number.isFinite(el.duration)) return;
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
    return () => {
      el.removeEventListener('loadedmetadata', buscar);
      el.removeEventListener('seeked', buscar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      ref={video}
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
