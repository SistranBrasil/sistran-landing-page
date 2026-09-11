'use client';

import type { ReactNode } from 'react';
import { useRevealTrigger } from './useRevealTrigger';

/**
 * SIS-193 — a única fiação entre um trecho de página e os estados de movimento
 * do bloco "SIS-193 · fundação" do `globals.css`. Escreve `data-in` num
 * envelope e sai da frente.
 *
 * Existe para que uma seção que é SERVER COMPONENT continue sendo: os filhos
 * chegam já renderizados no servidor, e o que passa a ser cliente é só o
 * observador. É assim que a grade de marcas (SIS-195) ganha a cascata sem
 * virar componente de estado — o argumento do docblock do `BrandGrid`.
 */
type Props = {
  children: ReactNode;
  className?: string;
  /** `false` reverte ao sair de cena — o comportamento da parede de logos. */
  umaVez?: boolean;
  /** Reverte apenas ao voltar acima, como `play none none reverse`. */
  reverterSomenteAcima?: boolean;
  /** Fração visível para acender. */
  limiar?: number;
  margem?: string;
};

export default function RevealScope({
  children,
  className,
  umaVez = true,
  reverterSomenteAcima = false,
  limiar = 0.2,
  margem = '0px 0px -12% 0px',
}: Props) {
  /* `data-in` é escrito no DOM pelo próprio gatilho — ver o docblock de
     `useRevealTrigger`. Aqui só entra a `ref`. */
  const { ref } = useRevealTrigger<HTMLDivElement>({
    limiar,
    umaVez,
    reverterSomenteAcima,
    margem,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
