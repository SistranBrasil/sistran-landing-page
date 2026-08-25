'use client';

import { useEffect } from 'react';

/**
 * Foco no destino de uma âncora.
 *
 * Clicar num link `#secao` rola a página, mas o foco do teclado continua no
 * link: o Tab seguinte segue a partir do menu, não do conteúdo que acabou de
 * chegar à tela (relatório de UX, p12/p17 — âncoras que movem só a rolagem).
 *
 * O `tabIndex = -1` é aplicado aqui, e não no JSX de cada seção, porque as
 * seções-alvo estão espalhadas por várias rotas e componentes; o atributo só
 * tem efeito no instante do `focus()` e não muda a ordem de tabulação.
 *
 * `preventScroll`: a rolagem já é do navegador (e do Lenis) — sem isso o
 * `focus()` reposiciona e anula o `scroll-margin-top` das seções.
 */
export default function AnchorFocus() {
  useEffect(() => {
    const focar = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const alvo = document.getElementById(id);
      if (!alvo) return;
      if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
    };

    window.addEventListener('hashchange', focar);
    return () => window.removeEventListener('hashchange', focar);
  }, []);

  return null;
}
