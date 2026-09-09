'use client';

/**
 * HeroVideoBackdrop — vídeo de fundo em loop solto, atrás de um bloco de
 * abertura.
 *
 * Envolve o conteúdo em vez de morar dentro do `PageHero` porque o que precisa
 * ficar sobre o vídeo é mais que o hero: em `/solucoes` é o hero E a barra
 * "NESTA PÁGINA", que é irmã dele na página. Um vídeo dentro do `PageHero`
 * cobriria apenas o primeiro e a barra abriria já sobre o navy, com uma emenda
 * visível no meio da abertura.
 *
 * ── Loop, e não scroll ────────────────────────────────────────────────────────
 * A primeira versão tinha o TEMPO do vídeo preso à posição de rolagem (via
 * `ScrollVideo`), o que significava que a abertura ficava congelada no primeiro
 * quadro para quem não rolava — e que em telas estreitas ela nunca era vídeo, só
 * pôster, porque buscar quadro a quadro engasga nos decodificadores de
 * iOS/Android. Agora o vídeo simplesmente toca em laço: aparece sozinho, sem
 * depender de gesto nenhum, e por isso vale em qualquer largura.
 *
 * Trocar o seek pelo laço é o que dispensa o `useScroll` e o corte de 1024px que
 * existiam aqui: playback contínuo é o caso fácil do decodificador, não o difícil.
 *
 * `muted` é obrigatório para o autoplay (nenhum navegador toca vídeo com som sem
 * gesto do usuário) e `playsInline` impede o fullscreen forçado no iOS. O
 * `poster` cobre o intervalo até o primeiro quadro chegar, então não há retângulo
 * preto no primeiro paint — e é ele, parado, que fica para quem pede menos
 * movimento: um laço infinito é movimento decorativo e contínuo, exatamente o que
 * essa preferência existe para desligar. Nenhuma informação vive no vídeo, então
 * parar não custa conteúdo.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/motion';

type Props = {
  src: string;
  /** Primeiro quadro do próprio vídeo. É ele que aparece antes e no fallback. */
  poster: string;
  /**
   * SIS-105 — `object-position` da mídia, porque o assunto do take não fica no
   * mesmo lugar do quadro em toda página: o de `/solucoes` e `/quem-somos` são
   * mãos sobre teclado na metade de baixo (daí o padrão `50% 62%`, que evita
   * cortar justamente elas), e o de `/eventos-inovacao` é um auditório com o
   * palco no centro — descer o foco ali cortaria o palco fora e sobraria só a
   * plateia desfocada. Prop, e não classe por página, porque é UM valor: quem
   * monta o vídeo é quem sabe onde está o assunto dele.
   */
  foco?: string;
  /** Classe extra no wrapper, para ajustes de véu específicos de uma página. */
  className?: string;
  children: ReactNode;
};

export default function HeroVideoBackdrop({
  src,
  poster,
  foco,
  className,
  children,
}: Props) {
  const rm = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  /* `autoPlay` sozinho nao basta, e a razao é sutil: ele é um GATILHO DE PARTIDA,
     nao um estado. O snapshot do servidor de `useReducedMotion` é sempre `false`
     (tem de ser, senao a hidratacao diverge), entao o HTML servido sai COM o
     atributo e o navegador ja comeca a tocar; quando o valor real chega e o React
     apaga o atributo, o video esta em movimento e nada o para. Medido: com a
     preferencia ligada o laco seguia rodando.
     Daqui em diante o comando é imperativo — pausar é uma acao, e é ela que
     precisa acontecer. Volta para o primeiro quadro para casar com o poster, que
     é o estado parado que a preferencia pede. */
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (rm) {
      v.pause();
      v.currentTime = 0;
      return;
    }
    /* Retomar quando a preferencia é desligada no meio da sessao. A promessa pode
       ser rejeitada por politica de autoplay (aba sem gesto do usuario); nesse
       caso fica o poster, que é exatamente o fallback desejado. */
    void v.play().catch(() => undefined);
  }, [rm]);

  return (
    <div className={className ? `hero-backdrop ${className}` : 'hero-backdrop'}>
      <div aria-hidden className="hero-backdrop-midia">
        {/* Um só nó nos dois casos — a preferência muda ATRIBUTO, não árvore:
            trocar `<video>` por `<img>` conforme uma medida que só existe no
            cliente é divergência de hidratação garantida. Mesmo padrão do
            mosaico em `StackScenes`. */}
        <video
          ref={video}
          className="hero-backdrop-video"
          src={src}
          poster={poster}
          autoPlay={!rm}
          loop
          muted
          playsInline
          preload="metadata"
          /* Inline, e não classe: é o enquadramento de UM take, e o valor chega
             por prop. O padrão continua na folha, então quem não passa `foco`
             não muda de comportamento. */
          style={foco ? { objectPosition: foco } : undefined}
        />
      </div>
      {/* Duas camadas de escurecimento, e as duas são necessárias por motivos
          diferentes: o gradiente vertical segura o contraste do título contra os
          trechos claros do take (a mesa e o teclado sob luz), e o véu navy chapado
          devolve a COR do hero — sem ele a abertura deixaria de ser reconhecível
          como a página navy que era. */}
      <div aria-hidden className="hero-backdrop-veu" />
      <div className="hero-backdrop-conteudo">{children}</div>
    </div>
  );
}
