'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Fio condutor da home.
 *
 * Uma linha vertical que nasce no hero, é desenhada conforme o scroll avança e
 * acende um nó ao entrar em cada seção. É ela que dá à página a leitura de UM
 * percurso, em vez de seções empilhadas sem relação entre si.
 *
 * Duas decisões carregam o componente:
 *
 * 1. **Zero JavaScript por quadro.** O desenho consome `--scroll-p`, que o
 *    `SmoothScroll` já publica no `<html>` a cada quadro (uma escrita, nenhum
 *    re-render). O `stroke-dashoffset` sai de um `calc()` em CSS. Abrir aqui um
 *    segundo observador de scroll seria pagar duas vezes pela mesma informação.
 * 2. **Nada aqui é conteúdo.** `aria-hidden`, sem captura de ponteiro. Se o
 *    componente não renderizar, a página não perde uma palavra.
 *
 * O nó ativo é a única coisa que usa estado, e vem de um `IntersectionObserver`
 * com a zona central da viewport — o mesmo critério do `ScrollSpy`.
 */

/* Paradas do fio, na ordem da página. Os ids têm de existir no DOM: `#top`
   (HeroCinematic), `#sinais` (mosaico), `#solucoes` (teatro de Soluções),
   `#resultados` (ImpactSequence) e `#contato`. */
const PARADAS = ['top', 'sinais', 'solucoes', 'resultados', 'contato'] as const;

/* O caminho vive num sistema de coordenadas fixo (o `viewBox` abaixo), e não em
   pixels de tela. Por isso o comprimento e os pontos dos nós são medidos UMA
   vez: eles não mudam com resize nem depois das fontes carregarem — o que muda
   é só a escala com que o navegador pinta o mesmo desenho. */
const CAIXA = { largura: 60, altura: 1000 };

/* Serpentina suave: desce encostada à esquerda, abre para a direita no meio do
   percurso e volta. A curvatura é o que diferencia um fio de uma régua. */
const CAMINHO =
  'M 14 0 C 14 120, 46 200, 46 320 S 14 460, 14 560 C 14 680, 46 760, 46 880 S 20 960, 20 1000';

type No = { x: number; y: number };

export default function ScrollSpine() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [nos, setNos] = useState<No[]>([]);
  const [ativo, setAtivo] = useState(0);
  const reduced = useReducedMotion();

  /* Medição do caminho. `getTotalLength()` e `getPointAtLength()` só funcionam
     com o SVG já no DOM — daí o efeito, e não um cálculo no corpo. */
  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const total = path.getTotalLength();
    svg.style.setProperty('--spine-len', total.toFixed(2));

    /* Os nós ficam distribuídos em frações IGUAIS do caminho, não na altura real
       de cada seção. O fio é uma metáfora de percurso, não um mapa em escala:
       espaçar pela altura faria o mosaico (curto) e Soluções (400vh de trilha)
       ficarem visualmente absurdos um ao lado do outro. */
    const passo = 1 / (PARADAS.length - 1);
    setNos(
      PARADAS.map((_, i) => {
        const p = path.getPointAtLength(total * passo * i);
        return { x: (p.x / CAIXA.largura) * 100, y: (p.y / CAIXA.altura) * 100 };
      }),
    );
  }, []);

  /* Seção ativa pela zona central da viewport. Um observador só, para as cinco
     paradas; o índice vem do `id`, não da ordem das entries — o observer não
     garante ordem. */
  useEffect(() => {
    const alvos = PARADAS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!alvos.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = PARADAS.indexOf(e.target.id as (typeof PARADAS)[number]);
          if (i >= 0) setAtivo((prev) => (prev === i ? prev : i));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    /* Fora de qualquer wrapper que anime: `position: fixed` morre sob ancestral
       com `transform`/`filter`/`clip`, e a home tem vários. Montado como irmão
       das seções em `page.tsx`.

       `data-rm` desliga o desenho progressivo sob movimento reduzido — o fio
       aparece inteiro, com o nó da vez aceso. Note que o atributo muda depois da
       hidratação (o `useReducedMotion` da casa nasce em `false` e converge no
       efeito): a árvore de DOM é a MESMA nos dois modos, só o atributo troca. */
    <div aria-hidden className="spine" data-rm={reduced ? '' : undefined}>
      <svg
        ref={svgRef}
        className="spine-svg"
        viewBox={`0 0 ${CAIXA.largura} ${CAIXA.altura}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Calha e linha viva compartilham o mesmo `d`: é o que faz a linha
            parecer preencher um trilho já existente, em vez de surgir do nada.
            `vector-effect` mantém a espessura constante — sem ele o
            `preserveAspectRatio: none` esticaria o traço junto com o desenho. */}
        <path
          ref={pathRef}
          className="spine-calha"
          d={CAMINHO}
          vectorEffect="non-scaling-stroke"
        />
        <path className="spine-viva" d={CAMINHO} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Nós em HTML, e não em `<circle>`: com `preserveAspectRatio: none` um
          círculo do SVG viraria elipse. Posicionados em % a partir dos pontos
          medidos no caminho, ficam exatamente sobre a linha em qualquer altura
          de tela. */}
      {nos.map((no, i) => (
        <span
          key={PARADAS[i]}
          className="spine-no"
          data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
          style={{ left: `${no.x}%`, top: `${no.y}%` }}
        />
      ))}
    </div>
  );
}
