'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Titulo de secao que acende palavra por palavra conforme a rolagem, com um
 * risco de sinal que se desenha embaixo.
 *
 * Vem de `ProgressiveText` (skill `scroll-orchestrated-lp`), com duas diferencas
 * necessarias aqui: o titulo desta pagina tem uma parte em destaque — a mesma
 * palavra que o site ja destaca — e por isso o texto chega em duas partes, e o
 * risco usa `scaleX` para nao animar layout.
 *
 * As palavras sao exatamente as que ja estavam no JSX: `texto` e `destaque`
 * recebem os mesmos literais de antes. Nenhuma escrita nova.
 *
 * O texto inteiro fica no DOM na ordem de leitura e o `aria-label` no heading
 * entrega a frase completa ao leitor de tela; as palavras animadas sao
 * `aria-hidden`. Com movimento reduzido o intervalo do `useTransform` vira
 * constante: as palavras nascem opacas e o risco nasce inteiro, sem trocar a
 * arvore renderizada.
 */

type Props = {
  id?: string;
  texto: string;
  /** Parte final destacada, como o site destaca. */
  destaque?: string;
  className?: string;
};

const OPACIDADE_INICIAL = 0.18;

export default function TituloAceso({ id, texto, destaque, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'end 55%'] });

  const palavras = texto.split(' ');
  const destacadas = destaque ? destaque.split(' ') : [];
  const total = palavras.length + destacadas.length;
  const risco = useTransform(scrollYProgress, [0, 0.9], reduzido ? [1, 1] : [0, 1]);

  return (
    <div className="titulo-aceso">
      <h2
        id={id}
        ref={ref}
        className={className}
        aria-label={destaque ? `${texto} ${destaque}` : texto}
      >
        {palavras.map((palavra, i) => (
          <span key={`${palavra}-${i}`}>
            <Palavra
              palavra={palavra}
              indice={i}
              total={total}
              progresso={scrollYProgress}
              reduzido={reduzido}
            />
            {i < total - 1 ? ' ' : null}
          </span>
        ))}
        {destacadas.map((palavra, i) => (
          <span className="text-gradient-brand" key={`d-${palavra}-${i}`}>
            <Palavra
              palavra={palavra}
              indice={palavras.length + i}
              total={total}
              progresso={scrollYProgress}
              reduzido={reduzido}
            />
            {palavras.length + i < total - 1 ? ' ' : null}
          </span>
        ))}
      </h2>
      {/* Risco de sinal: decoracao, entao fora da arvore acessivel. */}
      <motion.span aria-hidden className="titulo-risco" style={{ scaleX: risco }} />
    </div>
  );
}

function Palavra({
  palavra,
  indice,
  total,
  progresso,
  reduzido,
}: {
  palavra: string;
  indice: number;
  total: number;
  progresso: MotionValue<number>;
  reduzido: boolean;
}) {
  const inicio = (indice / total) * 0.8;
  const fim = Math.min(inicio + 0.24, 1);
  const opacity = useTransform(
    progresso,
    [inicio, fim],
    reduzido ? [1, 1] : [OPACIDADE_INICIAL, 1],
  );

  return (
    <motion.span aria-hidden="true" style={{ opacity, display: 'inline-block' }}>
      {palavra}
    </motion.span>
  );
}
