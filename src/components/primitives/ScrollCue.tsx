'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { criarConsultaDeMedia } from '@/lib/mediaStore';

/* SIS-182 — achada pela varredura: não é limiar de layout, é CAPACIDADE de
   ponteiro, mas o defeito era o mesmo (`setAwake(true)` síncrono dentro do efeito,
   que o lint acusava em `ScrollCue.tsx:43`). Sem cursor para seguir, a pastilha
   nasce acordada e o listener nem entra. */
const usePonteiroFino = criarConsultaDeMedia('(hover: hover) and (pointer: fine)');

/**
 * Convite de scroll que acompanha o ponteiro.
 *
 * Decisões que não são livres:
 *
 *  - `position: fixed` só funciona se nenhum ancestral tiver `transform` ou
 *    `filter` — viraria contexto de contenção. Por isso o componente é irmão da
 *    cena do hero, nunca filho do bloco que o GSAP anima em `scale`/`blur`.
 *  - `pointer-events: none` sempre: a pastilha fica sob o cursor e, sem isso,
 *    engoliria todo clique do hero.
 *  - `aria-hidden`: é decoração redundante. Quem navega por teclado ou leitor de
 *    tela não tem cursor, e o conteúdo do hero não depende do gesto.
 *  - Em ponteiro grosso (toque) não há cursor a seguir: o CSS ancora a pastilha
 *    na base da tela em vez de esconder o aviso.
 */
export function ScrollCue({ label = 'Role para explorar' }: { label?: string }) {
  const reduced = useReducedMotion();

  // Nasce fora de tela: sem isso a pastilha apareceria no canto superior
  // esquerdo antes do primeiro movimento do ponteiro.
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [seguiu, setSeguiu] = useState(false);
  const ponteiroFino = usePonteiroFino();
  /* SIS-182 — `awake` deixou de ser estado escrito pelo efeito e passou a ser
     derivado: sem ponteiro fino ela já nasce acordada, com ponteiro fino ela
     acorda no primeiro `pointermove`. Antes o mesmo resultado vinha de um
     `setAwake(true)` síncrono dentro do efeito, que é o defeito da issue. */
  const awake = !ponteiroFino || seguiu;

  /* Mola curta: o rastro atrasa o suficiente para o aviso parecer preso ao
     cursor sem grudar nele. Sob movimento reduzido a mola é rígida — a pastilha
     acompanha, mas não faz o gesto elástico. */
  const config = reduced
    ? { stiffness: 1200, damping: 90, mass: 0.1 }
    : { stiffness: 320, damping: 30, mass: 0.4 };
  const smoothX = useSpring(x, config);
  const smoothY = useSpring(y, config);

  useEffect(() => {
    // Ponteiro grosso não tem cursor para seguir: o listener nem entra. A leitura
    // vem do store (`ponteiroFino`), e não de `matchMedia` aqui dentro — SIS-182.
    if (!ponteiroFino) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setSeguiu(true);
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y, ponteiroFino]);

  return (
    <motion.div
      className="scroll-cue"
      aria-hidden="true"
      data-awake={awake ? 'true' : 'false'}
      style={{ x: smoothX, y: smoothY }}
    >
      <span className="scroll-cue-arrow" />
      <span className="scroll-cue-label">{label}</span>
    </motion.div>
  );
}
