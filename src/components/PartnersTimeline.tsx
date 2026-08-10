'use client';

import { useEffect, useMemo, useState } from 'react';
import './partners-timeline.css';
import {
  TIMELINE_EVENTS as events,
  TIMELINE_CATEGORY_META as categoryMeta,
  type TimelineCategory,
} from '@/data/timeline';

const rows = [events.slice(0, 6), events.slice(6, 12), events.slice(12, 18), events.slice(18, 24)];

function ArrowIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === 'right' ? 'M5 12h14m-5-5 5 5-5 5' : 'M19 12H5m5 5-5-5 5-5'} />
    </svg>
  );
}

export default function PartnersTimeline({ id = 'implementacoes' }: { id?: string }) {
  const [activeFilter, setActiveFilter] = useState<'todos' | TimelineCategory>('todos');
  const [selectedId, setSelectedId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const visibleEvents = useMemo(
    () => (activeFilter === 'todos' ? events : events.filter((i) => i.category === activeFilter)),
    [activeFilter],
  );

  const selected = events.find((i) => i.id === selectedId) ?? events[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSelectedId((current) => (current >= events.length ? 1 : current + 1));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function step(direction: -1 | 1) {
    const currentIndex = visibleEvents.findIndex((i) => i.id === selectedId);
    const safeIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = (safeIndex + direction + visibleEvents.length) % visibleEvents.length;
    setSelectedId(visibleEvents[nextIndex].id);
  }

  function chooseFilter(filter: 'todos' | TimelineCategory) {
    setActiveFilter(filter);
    if (filter !== 'todos') {
      setSelectedId(events.find((i) => i.category === filter)?.id ?? 1);
    }
  }

  return (
    <section id={id} className="partners-timeline-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="timeline-section" aria-labelledby="implementacoes-titulo">
        {/* Sem cabecalho interno: a pagina ja imprime "02 · Implementacoes /
            Uma jornada que nao para" logo acima, e o bloco interno repetia
            titulo e numeracao ("01") em conflito com ela. Sobra a toolbar so
            com os filtros. O aria-labelledby aponta para o titulo da pagina. */}
        <div className="timeline-toolbar toolbar-filters-only">
          {/* data-lenis-prevent: sem isto o Lenis captura o wheel/trackpad e a
              barra de filtros nao rola na horizontal. */}
          <div className="filters" data-lenis-prevent aria-label="Filtrar linha do tempo">
            <button
              className={activeFilter === 'todos' ? 'active' : ''}
              onClick={() => chooseFilter('todos')}
            >
              Todos
              <span>{events.length}</span>
            </button>
            {(Object.keys(categoryMeta) as TimelineCategory[]).map((category) => (
              <button
                key={category}
                className={activeFilter === category ? 'active' : ''}
                onClick={() => chooseFilter(category)}
              >
                <i style={{ background: categoryMeta[category].color }} />
                {categoryMeta[category].label}
              </button>
            ))}
          </div>
        </div>

        <div className="timeline-stage">
          <div className="start-badge">
            <small>Começo</small>
            <strong>1988</strong>
          </div>

          <div className="timeline-desktop">
            {rows.map((row, rowIndex) => (
              <div className={`track-row ${rowIndex % 2 ? 'reverse' : ''}`} key={rowIndex}>
                <div className="track-line" />
                {row.map((item, itemIndex) => {
                  const isVisible = activeFilter === 'todos' || activeFilter === item.category;
                  const isSelected = item.id === selectedId;
                  return (
                    <button
                      className={`timeline-node ${isSelected ? 'selected' : ''} ${isVisible ? '' : 'muted'}`}
                      style={
                        {
                          '--node-position': `${8 + itemIndex * 17}%`,
                          '--node-color': categoryMeta[item.category].color,
                          '--delay': `${item.id * 24}ms`,
                        } as React.CSSProperties
                      }
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setIsPlaying(false);
                      }}
                      aria-label={`${item.company}: ${item.detail}`}
                      aria-pressed={isSelected}
                    >
                      <span className="node-halo" />
                      <span className="node-core" />
                      <span className="node-label">
                        <small>{item.generation}</small>
                        <strong>{item.company}</strong>
                      </span>
                    </button>
                  );
                })}
                {rowIndex < rows.length - 1 && <span className="track-turn" />}
              </div>
            ))}
          </div>

          <div className="timeline-mobile">
            {events.map((item) => {
              const isVisible = activeFilter === 'todos' || activeFilter === item.category;
              return (
                <button
                  key={item.id}
                  className={`mobile-event ${selectedId === item.id ? 'selected' : ''} ${isVisible ? '' : 'muted'}`}
                  onClick={() => setSelectedId(item.id)}
                  style={{ '--node-color': categoryMeta[item.category].color } as React.CSSProperties}
                >
                  <span className="mobile-dot" />
                  <span>
                    <small>{item.generation}</small>
                    <strong>{item.company}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="future-horizon">
            <div className="future-glow" aria-hidden="true" />
            <div className="future-copy">
              <span className="future-kicker">
                <i />
                Em movimento
              </span>
              <h3>A jornada continua.</h3>
              <p>Novas parcerias, soluções e histórias já estão sendo construídas.</p>
            </div>

            <div className="future-route" aria-hidden="true">
              <span className="future-route-line" />
              <span className="future-route-dot dot-one" />
              <span className="future-route-dot dot-two" />
              <span className="future-route-dot dot-three" />
              <span className="future-route-beam" />
            </div>

            <div className="future-year">
              <span>Próximo capítulo</span>
              <strong>2026</strong>
              <small>e além</small>
            </div>
          </div>
        </div>

        <div className="detail-dock" aria-live="polite">
          <div className="detail-number">{String(selected.id).padStart(2, '0')}</div>
          <div className="detail-copy">
            <span className="detail-category" style={{ color: categoryMeta[selected.category].color }}>
              {categoryMeta[selected.category].label} · {selected.generation}
            </span>
            <h3>{selected.company}</h3>
            <p>{selected.detail}</p>
          </div>
          <div className="detail-controls">
            <button onClick={() => step(-1)} aria-label="Evento anterior">
              <ArrowIcon direction="left" />
            </button>
            <button
              className="play-button"
              onClick={() => setIsPlaying((c) => !c)}
              aria-label={isPlaying ? 'Pausar apresentação' : 'Reproduzir apresentação'}
            >
              {isPlaying ? <span className="pause-icon">Ⅱ</span> : <span className="play-icon">▶</span>}
            </button>
            <button onClick={() => step(1)} aria-label="Próximo evento">
              <ArrowIcon />
            </button>
          </div>
          <div className="detail-progress">
            <span style={{ width: `${(selected.id / events.length) * 100}%` }} />
          </div>
        </div>
      </section>
    </section>
  );
}
