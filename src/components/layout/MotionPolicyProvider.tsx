'use client';

import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { easeExpo } from '@/lib/motion';

/**
 * Política de movimento em um lugar só.
 *
 * Duas responsabilidades, ambas pedidas pelo relatório de UX (p14, p19):
 *
 * 1. `MotionConfig reducedMotion="user"` — toda animação do `motion` passa a
 *    consultar a preferência. Aqui isso vale mais que o normal: o script inline
 *    de `layout.tsx` embrulha `matchMedia`, então "user" já é a preferência
 *    RESOLVIDA (sistema + escolha do visitante), não só a do sistema.
 *    A duração/easing padrão vem dos tokens de movimento, para que componentes
 *    sem `transition` explícito não inventem um tempo próprio.
 *
 * 2. `data-hidden` em `<html>` quando a aba sai de vista — o CSS usa isso para
 *    parar marquee e afins, e o efeito pausa vídeo. O navegador reduz o
 *    `requestAnimationFrame` de abas ocultas, mas não para vídeo nem animação
 *    CSS: sem isso o site continua decodificando quadros em segundo plano.
 *
 * O que este componente NÃO faz é pausar `gsap.globalTimeline`: isso congela o
 * site inteiro e, se a aba for fechada/desmontada oculta, nunca volta.
 */
export default function MotionPolicyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const raiz = document.documentElement;

    /* Só os vídeos que ESTAVAM tocando voltam a tocar. Retomar todos ligaria
       vídeo que o visitante havia pausado de propósito. */
    let retomar: HTMLVideoElement[] = [];

    const aplicar = () => {
      const oculta = document.visibilityState === 'hidden';
      if (oculta) raiz.setAttribute('data-hidden', '');
      else raiz.removeAttribute('data-hidden');

      const videos = Array.from(document.querySelectorAll('video'));
      if (oculta) {
        retomar = videos.filter((v) => !v.paused && !v.ended);
        retomar.forEach((v) => v.pause());
      } else {
        retomar.forEach((v) => {
          // `catch`: autoplay bloqueado devolve rejeição, não é erro nosso.
          void v.play().catch(() => undefined);
        });
        retomar = [];
      }
    };

    aplicar();
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      document.removeEventListener('visibilitychange', aplicar);
      raiz.removeAttribute('data-hidden');
    };
  }, []);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.42, ease: easeExpo }}
    >
      {children}
    </MotionConfig>
  );
}
