'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTIONS } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

/**
 * Card branco com profundidade 3D. Segue a receita de tilt do MetricCard
 * (.claude/skills/sistran-labs-pattern/reference/dynamic-components.md):
 * perspective + rotateX/rotateY pelo cursor, orb de luz seguindo o mouse e
 * sombra em camadas para dar volume real.
 */
function useTilt(enabled: boolean) {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handlers = enabled
    ? {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setMouse({ x: 0.5, y: 0.5 });
        },
        onMouseMove: (e: React.MouseEvent) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        },
      }
    : {};

  return { hover, mouse, handlers };
}

function SolutionPanel({
  s,
  index,
  rm,
}: {
  s: (typeof SOLUTIONS)[number];
  index: number;
  rm: boolean;
}) {
  const Icon = getIcon(s.icon);
  const { hover, mouse, handlers } = useTilt(!rm);
  // Accent escurecido: o card e branco, tons claros perderiam contraste.
  const accent = s.colorOnLight;
  const num = String(index + 1).padStart(2, '0');

  return (
    /* Duas camadas: a externa faz a animacao de entrada (motion controla
       transform), a interna faz o tilt. Num unico elemento o style.transform do
       tilt sobrescreveria o `y` do motion. */
    <motion.div
      initial={rm ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
    <article
      {...handlers}
      className="relative w-full overflow-hidden rounded-3xl bg-white p-10"
      style={{
        transform:
          hover && !rm
            ? `translateY(-8px) perspective(900px) rotateX(${(mouse.y - 0.5) * -6}deg) rotateY(${
                (mouse.x - 0.5) * 8
              }deg)`
            : 'translateY(0) perspective(900px)',
        transition: hover
          ? 'box-shadow .25s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        // Sombra em camadas: contato curto + difusa longa + halo do accent.
        // E um brilho interno no topo que sugere a face iluminada do card.
        boxShadow: hover
          ? `0 2px 4px rgba(4,32,64,0.10), 0 18px 32px -12px rgba(4,32,64,0.28), 0 46px 80px -30px rgba(4,32,64,0.38), 0 0 60px -18px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 1px 2px rgba(4,32,64,0.08), 0 10px 20px -10px rgba(4,32,64,0.20), 0 30px 60px -26px rgba(4,32,64,0.30), inset 0 1px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {/* Orb de luz seguindo o cursor (receita MetricCard) */}
      {!rm && (
        <div
          aria-hidden
          className="pointer-events-none absolute h-[180px] w-[180px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            top: `calc(${mouse.y * 100}% - 90px)`,
            left: `calc(${mouse.x * 100}% - 90px)`,
            opacity: hover ? 1 : 0,
            transition: 'opacity .3s ease',
          }}
        />
      )}

      {/* Linha de acento no topo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: hover ? 1 : 0.5,
          transition: 'opacity .35s ease',
        }}
      />

      {/* Numero fantasma */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-8 select-none font-display font-black leading-none"
        style={{
          color: `${accent}1f`,
          fontSize: 'clamp(6rem, 10vw, 9rem)',
        }}
      >
        {num}
      </span>

      <div
        className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent}1f, ${accent}0a)`,
          border: `1px solid ${accent}40`,
          boxShadow: `0 10px 24px -12px ${accent}80`,
          transform: 'translateZ(30px)',
        }}
      >
        <Icon className="h-8 w-8" style={{ color: accent }} strokeWidth={1.6} />
      </div>
      <h3
        className="relative max-w-2xl font-display text-2xl font-bold leading-tight text-[#062B52] md:text-3xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        {s.title}
      </h3>
      <p
        className="relative mt-4 max-w-2xl text-base leading-relaxed text-[#3C5A7A] md:text-lg"
        style={{ transform: 'translateZ(12px)' }}
      >
        {s.description}
      </p>
    </article>
    </motion.div>
  );
}

export default function Solutions() {
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          // Faixa larga o bastante para cobrir blocos de 58vh sem deixar
          // intervalo morto entre um card e o proximo.
          start: 'top 70%',
          end: 'bottom 30%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        }),
      );
    });
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isDesktop]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActive((v) => Math.min(SOLUTIONS.length - 1, v + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      }
    },
    [],
  );

  return (
    <section id="servicos" className="section-py relative">
      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-14 max-w-3xl"
        >
          <motion.span variants={vSubtitle} className="eyebrow">Serviços</motion.span>
          <motion.h2 variants={vTitle} className="mt-3 font-display text-section font-bold text-ink">
            Integradora de sistemas <span className="text-gradient-brand">100% focada em Seguros</span>
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
            Dedicada ao mercado segurador, com experiência em todos os ramos. A Sistran atua como
            integradora de sistemas para clientes com grandes carteiras. Somos uma empresa de TI
            100% focada no segmento de Seguros no Brasil, com mais de 30 implementações de ERP
            bem-sucedidas.
          </motion.p>
        </motion.div>

        {/* Desktop: sticky list + panel */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-16">
          <div className="relative">
            {/* Centraliza a lista na viewport para acompanhar o painel ativo
                (antes: top-32, que a colava sob o header e deixava um vazio
                grande embaixo). */}
            <div className="sticky top-0 flex min-h-screen flex-col justify-center py-24">
              <ol
                ref={listRef}
                role="tablist"
                aria-orientation="vertical"
                onKeyDown={onKey}
                className="flex flex-col gap-1"
              >
                {SOLUTIONS.map((s, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const isActive = i === active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActive(i);
                          itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`group relative flex w-full items-baseline gap-4 rounded-lg py-3 pl-4 pr-3 text-left transition-colors ${
                          isActive ? 'text-ink' : 'text-ink/75'
                        }`}
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full transition-all duration-500"
                          style={{
                            background: isActive ? s.color : 'rgba(255,255,255,0.22)',
                            boxShadow: isActive ? `0 0 12px ${s.color}88` : 'none',
                            height: isActive ? '2.5rem' : '1rem',
                          }}
                        />
                        <span
                          className="font-display text-sm font-bold tabular-nums"
                          style={{ color: isActive ? s.color : 'rgba(255,255,255,0.72)' }}
                        >
                          {num}
                        </span>
                        <span className="flex-1 font-display text-lg font-bold leading-tight">
                          {s.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {/* Barra de progresso */}
              <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-[#0079CB]/10">
                <div
                  aria-hidden
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((active + 1) / SOLUTIONS.length) * 100}%`,
                    background: 'linear-gradient(90deg, #0079CB, #0ed8f6, #7c3aed)',
                  }}
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {String(active + 1).padStart(2, '0')} / {String(SOLUTIONS.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* O card fica sticky e centrado na viewport, igual a lista. Quem
              consome o scroll sao os espacadores abaixo, que tambem servem de
              trigger para trocar o card ativo. O -mt-[100vh] sobrepoe a trilha
              de espacadores ao container sticky, para que a coluna nao fique
              com uma tela extra de altura. */}
          <div className="relative">
            <div className="sticky top-0 flex h-screen items-center">
              {/* key = remonta o painel a cada troca, refazendo a animacao de
                  entrada. */}
              <SolutionPanel
                key={SOLUTIONS[active].id}
                s={SOLUTIONS[active]}
                index={active}
                rm={rm}
              />
            </div>

            <div aria-hidden className="-mt-[100vh]">
              {SOLUTIONS.map((s, i) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-idx={i}
                  /* Altura = quanto scroll cada card consome. */
                  className="min-h-[58vh]"
                />
              ))}
            </div>
          </div>
        </div>


        {/* Mobile: acordeão */}
        <ol className="flex flex-col gap-3 lg:hidden">
          {SOLUTIONS.map((s, i) => {
            const Icon = getIcon(s.icon);
            const num = String(i + 1).padStart(2, '0');
            const isOpen = openMobile === i;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`solution-panel-${s.id}`}
                  onClick={() => setOpenMobile(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white p-5 text-left transition-shadow"
                  style={{
                    boxShadow: isOpen
                      ? `0 2px 4px rgba(4,32,64,0.10), 0 16px 30px -14px rgba(4,32,64,0.30), 0 0 40px -16px ${s.color}66, inset 0 1px 0 rgba(255,255,255,0.9)`
                      : '0 1px 2px rgba(4,32,64,0.08), 0 10px 20px -12px rgba(4,32,64,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="font-display text-sm font-bold tabular-nums"
                      style={{ color: s.colorOnLight }}
                    >
                      {num}
                    </span>
                    <span className="font-display text-base font-bold leading-tight text-[#062B52]">
                      {s.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-2 flex h-8 w-8 flex-none items-center justify-center rounded-full transition-transform"
                    style={{
                      background: `${s.colorOnLight}1a`,
                      color: s.colorOnLight,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`solution-panel-${s.id}`}
                    className="mt-2 rounded-2xl bg-white p-5"
                    style={{
                      boxShadow:
                        '0 1px 2px rgba(4,32,64,0.08), 0 12px 24px -14px rgba(4,32,64,0.24), inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${s.colorOnLight}1f, ${s.colorOnLight}0a)`,
                          border: `1px solid ${s.colorOnLight}40`,
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: s.colorOnLight }} strokeWidth={1.8} />
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#3C5A7A]">{s.description}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
