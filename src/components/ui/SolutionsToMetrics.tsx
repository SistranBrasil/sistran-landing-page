'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Travessia do fio de "Soluções de Negócios" até a onda de "Sistran em números".
 *
 * Não é um separador decorativo no meio do caminho: é um condutor ancorado nas
 * DUAS pontas. A origem é a ponta onde o fio de Soluções se dissipa
 * (`[data-fio-saida]`, marcada em `Solutions.tsx` sobre a geometria que só aquele
 * componente conhece) e o destino é a boca de entrada da onda, na beira esquerda
 * do palco da Metrics (`[data-fio-chegada]`). O efeito existe para que os dois
 * traços leiam como UM, atravessando a emenda entre as seções.
 *
 * Arquitetura copiada do `MosaicHandoff`, e pelos mesmos motivos:
 *
 * - `position: fixed` e irmão direto das duas seções em `page.tsx`. Um absoluto
 *   nascido dentro de Soluções passaria por baixo do fundo opaco da Metrics; e
 *   `fixed` morre sob qualquer ancestral com `transform`/`filter`/`clip` — a home
 *   tem vários.
 * - O relógio é a SEÇÃO DE DESTINO, medida por `getBoundingClientRect`: o
 *   progresso é o quanto falta de `secao.top` para zero. Nada de estimativa e
 *   nenhum ScrollTrigger novo — a Metrics já tem o seu, único, e um segundo
 *   gatilho sobre a mesma seção disputaria a mesma emenda.
 * - Um `requestAnimationFrame` por rajada de scroll. O estado vive no DOM, por
 *   `style`, então não há re-render.
 * - `aria-hidden` + `pointer-events: none`, e nada de conteúdo depende dele.
 *
 * Abaixo de 1024px ou com movimento reduzido o efeito NÃO EXISTE: sem palco
 * dirigido não há fio em Soluções para continuar, e o traço viraria um risco
 * solto sobre a página.
 */

/* Antecipação do percurso, em telas: o fio começa a se estender quando
   `#resultados` ainda está 0,9 tela abaixo do topo. Mais curto e ele aparece já
   pronto; mais longo e ele cruza a tela antes de a emenda estar em vista. */
const ANTECIPACAO = 0.9;

export default function SolutionsToMetrics() {
  const rm = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const calhaRef = useRef<SVGPathElement>(null);
  const vivoRef = useRef<SVGPathElement>(null);
  const cabecaRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (rm) return;

    const svg = svgRef.current;
    const calha = calhaRef.current;
    const vivo = vivoRef.current;
    const cabeca = cabecaRef.current;
    if (!svg || !calha || !vivo || !cabeca) return;

    let quadro = 0;
    let dAnterior = '';

    const desligar = () => {
      svg.style.opacity = '0';
      svg.style.visibility = 'hidden';
    };

    const medir = () => {
      quadro = 0;

      const secao = document.getElementById('resultados');
      const origem = document.querySelector<HTMLElement>('[data-fio-saida]');
      const destino = document.querySelector<HTMLElement>('[data-fio-chegada]');
      /* Mesmo limiar dos dois palcos dirigidos (1024px). */
      const largo = window.matchMedia('(min-width: 1024px)').matches;
      if (!secao || !origem || !destino || !largo) {
        desligar();
        return;
      }

      const janela = window.innerHeight * ANTECIPACAO;
      const topoSecao = secao.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (janela - topoSecao) / janela));

      // Fora do percurso não há travessia: o fio ainda está inteiro em Soluções
      // (p = 0) ou a onda da Metrics já assumiu (p = 1).
      if (p <= 0.001 || p >= 0.999) {
        desligar();
        return;
      }

      const o = origem.getBoundingClientRect();
      const d = destino.getBoundingClientRect();

      const x1 = o.left + o.width / 2;
      const y1 = o.top + o.height / 2;
      const x2 = d.left + d.width / 2;
      const y2 = d.top + d.height / 2;

      /* Cúbica com os dois pontos de controle na HORIZONTAL das pontas: a
         tangente sai e chega horizontal, do mesmo jeito que o fio de Soluções
         morre na horizontal e que a onda da Metrics nasce na horizontal. É isso
         que faz a emenda desaparecer — não a cor. */
      const c = Math.max(120, Math.abs(x2 - x1) * 0.45);
      const novo =
        `M ${x1.toFixed(1)} ${y1.toFixed(1)}` +
        ` C ${(x1 + c).toFixed(1)} ${y1.toFixed(1)},` +
        ` ${(x2 - c).toFixed(1)} ${y2.toFixed(1)},` +
        ` ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      if (novo !== dAnterior) {
        dAnterior = novo;
        calha.setAttribute('d', novo);
        vivo.setAttribute('d', novo);
      }

      svg.style.visibility = 'visible';
      /* Aparece nos primeiros 6% e se apaga nos últimos 8%, quando a onda da
         Metrics já está em quadro fazendo o mesmo papel. */
      svg.style.opacity =
        p < 0.06 ? (p / 0.06).toFixed(3) : p > 0.92 ? ((1 - p) / 0.08).toFixed(3) : '1';

      /* O traço aceso se estende com o scroll. `pathLength=1` está no atributo,
         então o offset é fração — sem `getTotalLength()` por quadro. */
      vivo.style.strokeDashoffset = (1 - p).toFixed(4);

      /* Cabeça do traço: o ponto onde ele está agora. `getPointAtLength` sobre o
         path já montado é exato e barato (uma chamada por quadro). */
      const total = vivo.getTotalLength();
      const ponta = vivo.getPointAtLength(total * p);
      cabeca.setAttribute('cx', ponta.x.toFixed(1));
      cabeca.setAttribute('cy', ponta.y.toFixed(1));
    };

    const agendar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);

    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      desligar();
    };
  }, [rm]);

  return (
    <svg ref={svgRef} aria-hidden className="fio-travessia" focusable="false">
      <defs>
        {/* Azul da marca na saída, ciano na chegada: o fio de Soluções é ciano e a
            onda da Metrics também, então a travessia não introduz cor nova. */}
        <linearGradient id="fio-travessia-cor" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0079cb" />
          <stop offset="1" stopColor="#0ed8f6" />
        </linearGradient>
      </defs>
      <path ref={calhaRef} className="fio-travessia-calha" d="" pathLength={1} />
      <path ref={vivoRef} className="fio-travessia-vivo" d="" pathLength={1} />
      <circle ref={cabecaRef} className="fio-travessia-cabeca" r="4" cx="-10" cy="-10" />
    </svg>
  );
}
