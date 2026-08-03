"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "grandes" | "pme" | "solucoes";

type TimelineEvent = {
  id: number;
  company: string;
  detail: string;
  category: Category;
  generation: string;
  accent?: boolean;
};

const events: TimelineEvent[] = [
  { id: 1, company: "Castelo Costa · Coplaven · Zurich Brasil", detail: "Auto, resseguros e vida", category: "solucoes", generation: "1ª geração" },
  { id: 2, company: "Commercial Union · Gente Seguradora", detail: "Auto, resseguros e vida", category: "pme", generation: "1ª geração" },
  { id: 3, company: "Total Life · Santander · SBF · Swiss Re", detail: "Auto e resseguros", category: "pme", generation: "1ª geração" },
  { id: 4, company: "BCN · Bradesco · Real Seguros", detail: "Resseguros e vida", category: "pme", generation: "2ª geração" },
  { id: 5, company: "AGF Allianz · GNP", detail: "Auto e resseguros", category: "pme", generation: "2ª geração" },
  { id: 6, company: "QBE Brasil (BMC) · United", detail: "Auto, resseguros e vida", category: "pme", generation: "2ª geração" },
  { id: 7, company: "Aliança do Brasil · Brasil Seguradora · Winterthur", detail: "Resseguros e vida", category: "pme", generation: "2ª geração" },
  { id: 8, company: "Cia Excelsior · Áurea Seguradora", detail: "Life, P&C e Auto", category: "pme", generation: "2ª geração" },
  { id: 9, company: "Notre Dame · Royal & Sun Alliance", detail: "Life e P&C", category: "solucoes", generation: "2ª geração" },
  { id: 10, company: "ECC Embraer · Mapfre", detail: "Resseguros e vida", category: "solucoes", generation: "3ª geração" },
  { id: 11, company: "Combined · Generali", detail: "Auto, resseguros e vida", category: "pme", generation: "2ª geração" },
  { id: 12, company: "Bradesco Vida e Previdência · Conapp · Cia Mutual", detail: "Life, Auto, resseguros e vida", category: "grandes", generation: "3ª geração" },
  { id: 13, company: "Marítima · Sompo · Orbital · MBM", detail: "Vida, resseguros e proteção", category: "grandes", generation: "3ª geração" },
  { id: 14, company: "AIG", detail: "Resseguros", category: "grandes", generation: "3ª geração" },
  { id: 15, company: "Bradesco Seguros · BTG/Too Seguros", detail: "Plataformas de vida", category: "solucoes", generation: "4ª geração", accent: true },
  { id: 16, company: "ENS", detail: "Escola de Negócios e Seguros", category: "solucoes", generation: "Ecossistema" },
  { id: 17, company: "Mapfre", detail: "Evolução contínua de soluções", category: "grandes", generation: "Nova geração" },
  { id: 18, company: "Seguros Unimed · Núclea", detail: "Integração e escala", category: "solucoes", generation: "Nova geração" },
  { id: 19, company: "EY", detail: "Governança e transformação", category: "grandes", generation: "Parceria" },
  { id: 20, company: "Pega", detail: "Aceleração de processos", category: "grandes", generation: "Plataforma" },
  { id: 21, company: "G8Seg", detail: "Operação de seguros", category: "grandes", generation: "Implantação" },
  { id: 22, company: "IRB (Seg)", detail: "Resseguros em escala", category: "grandes", generation: "Implantação" },
  { id: 23, company: "Redion", detail: "Tecnologia para seguros", category: "grandes", generation: "Implantação" },
  { id: 24, company: "Assurant", detail: "Experiência conectada", category: "grandes", generation: "Implantação" },
];

const categoryMeta: Record<Category, { label: string; color: string }> = {
  grandes: { label: "Empresas grandes", color: "#9fc5ff" },
  pme: { label: "Empresas PME", color: "#ff8a3d" },
  solucoes: { label: "Soluções", color: "#7ad450" },
};

const rows = [
  events.slice(0, 6),
  events.slice(6, 12),
  events.slice(12, 18),
  events.slice(18, 24),
];

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "right" ? "M5 12h14m-5-5 5 5-5 5" : "M19 12H5m5 5-5-5 5-5"} />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2L10 9l2-6.5Z" />
    </svg>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"todos" | Category>("todos");
  const [selectedId, setSelectedId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const visibleEvents = useMemo(
    () =>
      activeFilter === "todos"
        ? events
        : events.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  const selected = events.find((item) => item.id === selectedId) ?? events[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSelectedId((current) => (current >= events.length ? 1 : current + 1));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function step(direction: -1 | 1) {
    const currentIndex = visibleEvents.findIndex((item) => item.id === selectedId);
    const safeIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex =
      (safeIndex + direction + visibleEvents.length) % visibleEvents.length;
    setSelectedId(visibleEvents[nextIndex].id);
  }

  function chooseFilter(filter: "todos" | Category) {
    setActiveFilter(filter);
    if (filter !== "todos") {
      setSelectedId(events.find((item) => item.category === filter)?.id ?? 1);
    }
  }

  return (
    <main className="experience-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Sistran — início">
          <span className="brand-mark">S</span>
          <span>SISTRAN</span>
        </a>
        <div className="header-context">
          <span className="live-dot" />
          Linha do tempo interativa
        </div>
        <span className="edition">1988 — 2026</span>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">
            <SparkIcon /> Uma história construída em movimento
          </p>
          <h1>
            Transformando o mercado
            <span> de seguros há quase quatro décadas.</span>
          </h1>
          <p className="hero-description">
            Explore uma jornada de evolução, parcerias e tecnologia. Cada ponto
            representa um novo capítulo criado junto ao mercado.
          </p>
        </div>

        <div className="metrics" aria-label="Indicadores históricos">
          <article>
            <span className="metric-value">40</span>
            <span className="metric-label">seguradoras</span>
            <small>relacionamentos construídos</small>
          </article>
          <article>
            <span className="metric-value">26</span>
            <span className="metric-label">implantações</span>
            <small>jornadas entregues</small>
          </article>
        </div>
      </section>

      <section className="timeline-section" aria-labelledby="timeline-title">
        <div className="timeline-toolbar">
          <div>
            <span className="section-index">01</span>
            <div>
              <p className="section-kicker">Nossa trajetória</p>
              <h2 id="timeline-title">Uma jornada que não para</h2>
            </div>
          </div>

          <div className="filters" aria-label="Filtrar linha do tempo">
            <button
              className={activeFilter === "todos" ? "active" : ""}
              onClick={() => chooseFilter("todos")}
            >
              Todos
              <span>{events.length}</span>
            </button>
            {(Object.keys(categoryMeta) as Category[]).map((category) => (
              <button
                key={category}
                className={activeFilter === category ? "active" : ""}
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
              <div
                className={`track-row ${rowIndex % 2 ? "reverse" : ""}`}
                key={rowIndex}
              >
                <div className="track-line" />
                {row.map((item, itemIndex) => {
                  const isVisible =
                    activeFilter === "todos" || activeFilter === item.category;
                  const isSelected = item.id === selectedId;
                  return (
                    <button
                      className={`timeline-node ${isSelected ? "selected" : ""} ${
                        isVisible ? "" : "muted"
                      }`}
                      style={
                        {
                          "--node-position": `${8 + itemIndex * 17}%`,
                          "--node-color": categoryMeta[item.category].color,
                          "--delay": `${item.id * 24}ms`,
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
              const isVisible =
                activeFilter === "todos" || activeFilter === item.category;
              return (
                <button
                  key={item.id}
                  className={`mobile-event ${
                    selectedId === item.id ? "selected" : ""
                  } ${isVisible ? "" : "muted"}`}
                  onClick={() => setSelectedId(item.id)}
                  style={
                    { "--node-color": categoryMeta[item.category].color } as React.CSSProperties
                  }
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
              <p>
                Novas parcerias, soluções e histórias já estão sendo construídas.
              </p>
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
          <div className="detail-number">
            {String(selected.id).padStart(2, "0")}
          </div>
          <div className="detail-copy">
            <span
              className="detail-category"
              style={{ color: categoryMeta[selected.category].color }}
            >
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
              onClick={() => setIsPlaying((current) => !current)}
              aria-label={isPlaying ? "Pausar apresentação" : "Reproduzir apresentação"}
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

      <section className="pillars">
        <div className="pillars-heading">
          <span className="section-index">02</span>
          <div>
            <p className="section-kicker">O que nos trouxe até aqui</p>
            <h2>Conhecimento que vira resultado</h2>
          </div>
        </div>
        <div className="pillar-grid">
          {[
            ["01", "Expertise em seguros", "Conhecimento profundo do negócio e de suas transformações."],
            ["02", "Aceleradores escaláveis", "Tecnologia preparada para evoluir com cada operação."],
            ["03", "Transformação digital e TI", "Estratégia e execução conectadas do início ao fim."],
            ["04", "Governança, metodologia e gestão", "Entregas consistentes, mensuráveis e sustentáveis."],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="pillar-arrow">
                <ArrowIcon />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <span className="brand-mark">S</span>
          <span>SISTRAN</span>
        </div>
        <p>Beyond Technology.</p>
      </footer>
    </main>
  );
}
