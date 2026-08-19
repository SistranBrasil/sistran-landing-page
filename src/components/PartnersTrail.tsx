'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [progress, setProgress] = useState(0);
  const [traveler, setTraveler] = useState({ x: 0, y: 0 });

  const rm = useReducedMotion();

  const update = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    /* A rota avança conforme a metade inferior da tela varre o palco: 0 quando
       o topo do palco cruza esse ponto, 1 quando o fim dele cruza. */
    const anchor = window.innerHeight * 0.65;
    const raw = (anchor - rect.top) / Math.max(rect.height, 1);
    setProgress(Math.min(1, Math.max(0, raw)));
  }, []);

  useEffect(() => {
    if (rm) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [rm, update]);

  // Posição do viajante sobre a curva de verdade (getPointAtLength), não uma
  // interpolação linear entre as paradas.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    if (!total) return;
    const point = path.getPointAtLength(total * progress);
    setTraveler({
      x: (point.x / trail.width) * 100,
      y: (point.y / trail.height) * 100,
    });
  }, [progress, trail.width, trail.height]);

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
            style={{ strokeDashoffset: 1 - progress }}
          />
        </svg>

        <span
          className="trail-traveler"
          style={{ '--x': `${traveler.x}%`, '--y': `${traveler.y}%` } as React.CSSProperties}
          aria-hidden
        />

        {/* A lista real fica aqui: o SVG é decoração, as paradas são HTML. */}
        <ol className="contents">
          {events.map((e, i) => {
            const point = trail.points[i];
            const meta = TIMELINE_CATEGORY_META[e.category];
            // Progresso aproximado da parada pelo seu índice: a curva tem
            // passos iguais, então o índice normalizado acompanha o viajante.
            const at = i / Math.max(events.length - 1, 1);
            const reached = progress >= at - 0.02;

            return (
              <li
                key={e.id}
                className="trail-stop"
                data-side={i % 2 === 0 ? 'left' : 'right'}
                data-reached={reached ? 'true' : 'false'}
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
              <strong className="mt-1 block font-display text-base font-bold leading-snug text-white">
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
