'use client';

import { useEffect, useMemo, useRef } from 'react';
import { TIMELINE_EVENTS, TIMELINE_CATEGORY_META } from '@/data/timeline';
import { buildTrail } from '@/lib/trail';
import { useReducedMotion } from '@/lib/motion';
import './partners-trail.css';

/**
 * Trilha serpenteante das implementações.
 *
 * O scroll pinta a rota (um único path SVG) e cada parada aparece quando o
 * viajante chega nela — é o percurso das implementações se revelando conforme
 * a pessoa desce a página.
 *
 * Desktop apenas (`.trail-stage` só existe a partir de 900px). Abaixo disso a
 * mesma lista sai em cards empilhados, sem SVG e sem scroll-listener: a
 * informação é a mesma, só o desenho muda.
 *
 * Movimento reduzido: progresso travado em 1 — a rota nasce inteira, todas as
 * paradas visíveis e o viajante escondido pelo CSS. Nenhum conteúdo depende
 * do movimento para existir.
 */
export default function PartnersTrail({ id }: { id?: string }) {
  const events = TIMELINE_EVENTS;
  const trail = useMemo(() => buildTrail(events.length), [events.length]);

  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<HTMLSpanElement>(null);

  const rm = useReducedMotion();

  /**
   * O progresso NÃO mora em estado do React, e isso é a correção de um bug real,
   * não preferência de estilo.
   *
   * A versão anterior fazia `setProgress` no scroll e, num segundo `useEffect`
   * dependente de `progress`, fazia `setTraveler`. Cada quadro virava uma cadeia
   * commit → efeito → commit, ou seja, um update ANINHADO. O contador de updates
   * aninhados do React só zera quando um commit não vem de dentro de outro — com
   * a cadeia se repetindo a cada quadro ele nunca zerava, e depois de ~50 quadros
   * de rolagem contínua (cerca de um segundo) estourava em
   * "Maximum update depth exceeded". Medido: em repouso a página é estável (um
   * único evento de scroll, altura constante), então não havia realimentação de
   * layout — o laço era só essa cadeia de estado.
   *
   * Escrevendo direto no DOM, o scroll deixa de renderizar o componente: são
   * zero commits por quadro em vez de dois, o erro fica estruturalmente
   * impossível e as 15 paradas param de re-renderizar a cada pixel rolado.
   */
  useEffect(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    const traveler = travelerRef.current;
    if (!stage || !path || !traveler) return;

    const stops = Array.from(stage.querySelectorAll<HTMLElement>('.trail-stop'));
    const passos = Math.max(stops.length - 1, 1);
    /* Comprimento da curva em unidades do viewBox: não muda quando o palco
       redimensiona, então basta medir uma vez. */
    const total = path.getTotalLength();
    let ultimo = -1;

    const aplicar = (valor: number) => {
      // Faixa morta: sem ela, o mesmo valor reescreveria o DOM a cada quadro.
      if (Math.abs(valor - ultimo) < 0.0005) return;
      ultimo = valor;

      path.style.strokeDashoffset = `${1 - valor}`;

      if (total) {
        // Posição sobre a curva de verdade (getPointAtLength), não uma
        // interpolação linear entre as paradas.
        const ponto = path.getPointAtLength(total * valor);
        traveler.style.setProperty('--x', `${(ponto.x / trail.width) * 100}%`);
        traveler.style.setProperty('--y', `${(ponto.y / trail.height) * 100}%`);
      }

      stops.forEach((stop, i) => {
        const at = i / passos;
        stop.dataset.reached = valor >= at - 0.02 ? 'true' : 'false';
      });
    };

    if (rm) {
      // Rota inteira, todas as paradas visíveis, viajante escondido pelo CSS.
      aplicar(1);
      return;
    }

    const medir = () => {
      const rect = stage.getBoundingClientRect();
      /* A rota avança conforme a metade inferior da tela varre o palco: 0 quando
         o topo do palco cruza esse ponto, 1 quando o fim dele cruza. */
      const anchor = window.innerHeight * 0.65;
      const raw = (anchor - rect.top) / Math.max(rect.height, 1);
      aplicar(Math.min(1, Math.max(0, raw)));
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        medir();
      });
    };

    medir();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [rm, trail.width, trail.height]);

  return (
    <div id={id} className="container-lp scroll-mt-32">
      {/* Desktop: a trilha */}
      <div ref={stageRef} className="trail-stage">
        <svg className="trail-svg" viewBox={trail.viewBox} aria-hidden>
          <defs>
            <linearGradient id="trail-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0079cb" />
              <stop offset="100%" stopColor="#0ed8f6" />
            </linearGradient>
          </defs>
          <path className="trail-route-base" d={trail.d} />
          <path
            ref={pathRef}
            className="trail-route-live"
            d={trail.d}
            pathLength={1}
          />
        </svg>

        {/* Sem estilo inline: o estado inicial (rota apagada, viajante no
            começo) vem dos valores padrão do CSS, e o efeito assume daí. */}
        <span ref={travelerRef} className="trail-traveler" aria-hidden />

        {/* A lista real fica aqui: o SVG é decoração, as paradas são HTML. */}
        <ol className="contents">
          {events.map((e, i) => {
            const point = trail.points[i];
            const meta = TIMELINE_CATEGORY_META[e.category];

            return (
              <li
                key={e.id}
                className="trail-stop"
                data-side={i % 2 === 0 ? 'left' : 'right'}
                /* `data-reached` passa a ser escrito pelo efeito. O valor inicial
                   é o do servidor, para não haver divergência na hidratação: a
                   parada nasce oculta e o primeiro quadro já a corrige. O limiar
                   por índice mora no efeito, porque a curva tem passos iguais. */
                data-reached="false"
                style={
                  {
                    '--x': `${(point.x / trail.width) * 100}%`,
                    '--y': `${(point.y / trail.height) * 100}%`,
                    '--node-color': meta.color,
                  } as React.CSSProperties
                }
              >
                <span aria-hidden className="trail-dot" />
                <div className="trail-card">
                  <small>{e.generation}</small>
                  <strong>{e.company}</strong>
                  <span>{e.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: mesma lista, sem trilha. */}
      <ol className="mt-10 space-y-3 min-[900px]:hidden">
        {events.map((e) => {
          const meta = TIMELINE_CATEGORY_META[e.category];
          return (
            <li key={e.id} className="glass-card p-5">
              <span
                className="text-[0.66rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: meta.color }}
              >
                {e.generation}
              </span>
              <strong className="mt-1 block font-display text-base leading-snug text-white">
                {e.company}
              </strong>
              <span className="mt-1 block text-sm leading-relaxed text-white/70">{e.detail}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
