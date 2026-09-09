'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { vSubtitle, VP, useReducedMotion } from '@/lib/motion';

/* Os dois invólucros animados são criados UMA vez, no módulo: `motion.create()`
   dentro do render devolveria um componente novo por render, e o React
   desmontaria e remontaria o cartão a cada um deles. */
const LinkAnimado = motion.create(Link);

/**
 * SIS-130 — o cartão de duas faces do LinkedIn extraído para cá, para o CTA de
 * carreira de `/contato` usar o mesmo gesto sem uma segunda cópia da geometria.
 * As classes `.linkedin-card*` viraram `.cartao-duas-faces*` no `globals.css`
 * na mesma passada; o efeito nunca foi do LinkedIn, era só de lá que ele nasceu.
 *
 * O cartão é UM link. O nome acessível vem do conteúdo — sem `aria-label`, que
 * faria o leitor de tela ler destino e texto duas vezes. Só o ícone é decorativo.
 *
 * Regra que não pode ser quebrada por quem reusar: **nada essencial na face de
 * trás**. Em toque não existe hover, e o CSS abre as duas metades — mas quem lê
 * a frente primeiro tem de sair sabendo para onde o link leva. Por isso `destino`
 * é obrigatório e mora na frente.
 */
type Props = {
  href: string;
  /** Link para fora do site: ganha `target`/`rel`. */
  externo?: boolean;
  icone: React.ReactNode;
  rotulo: string;
  /** Para onde o cartão leva. Visível já no repouso, na face da frente. */
  destino: string;
  versoTitulo: string;
  versoTexto: string;
  versoCta: string;
  className?: string;
};

export default function CartaoDuasFaces({
  href,
  externo,
  icone,
  rotulo,
  destino,
  versoTitulo,
  versoTexto,
  versoCta,
  className,
}: Props) {
  const rm = useReducedMotion();
  /* Rota interna vai por `Link` (navegação no cliente); destino externo vai por
     âncora crua, que é o que aceita `target`/`rel`. */
  const Componente = externo ? motion.a : LinkAnimado;

  return (
    <Componente
      variants={vSubtitle}
      initial={rm ? false : 'hidden'}
      whileInView="visible"
      viewport={VP}
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      className={`palco-card-reativo cartao-duas-faces${className ? ` ${className}` : ''}`}
    >
      <span className="cartao-duas-faces-face cartao-duas-faces-frente">
        {icone}
        <span className="cartao-duas-faces-frente-rotulo">{rotulo}</span>
        <span className="cartao-duas-faces-frente-destino">{destino}</span>
      </span>
      <span className="cartao-duas-faces-face cartao-duas-faces-verso">
        <span className="cartao-duas-faces-verso-titulo">{versoTitulo}</span>
        <span className="cartao-duas-faces-verso-texto">{versoTexto}</span>
        <span className="cartao-duas-faces-verso-cta">{versoCta}</span>
      </span>
    </Componente>
  );
}
