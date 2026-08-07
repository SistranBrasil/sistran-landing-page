'use client';

/**
 * CompanySignature — painel institucional do lado direito do hero.
 *
 * Representa a Sistran como um sistema: um núcleo (a marca) e os domínios de
 * seguros em que a empresa atua orbitando ao redor. O anel gira por CSS
 * (transform apenas) e cada nó contra-gira para manter o texto na horizontal.
 *
 * Motion: só `transform`/`opacity` são animados. O contador não usa setState —
 * escreve direto no textContent dentro de um rAF, evitando re-render por frame.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DOMAINS } from '@/data/domains';
import { getIcon } from '@/lib/icons';
import { easeExpo, useReducedMotion } from '@/lib/motion';

const ROTATE_MS = 3200;
const RING_SECONDS = 44;

/** Contador que sobe uma vez, escrevendo direto no DOM (sem re-render). */
function CountUp({
  to,
  suffix = '',
  durationMs = 1600,
  disabled,
}: {
  to: number;
  suffix?: string;
  durationMs?: number;
  disabled: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = `${Math.round(to * eased)}${suffix}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, suffix, durationMs, disabled]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export default function CompanySignature() {
  const rm = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (rm || paused) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % DOMAINS.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(t);
  }, [rm, paused]);

  const active = DOMAINS[i];
  const step = 360 / DOMAINS.length;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mx-auto w-full max-w-[520px] px-8 sm:px-12"
      role="region"
      aria-label="Domínios de atuação da Sistran"
    >
      {/* Halo de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${active.color}44, transparent 68%)`,
        }}
      />

      {/* Sistema orbital. O padding lateral dá folga para os chips que ficam
          sobre o anel externo não serem cortados pela coluna do grid. */}
      <div className="relative mx-auto aspect-square w-[min(100%,400px)]">
        {/* Anéis estáticos */}
        {[100, 74, 48].map((size, idx) => (
          <span
            key={size}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: `${size}%`,
              height: `${size}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: `rgba(255,255,255,${0.1 - idx * 0.025})`,
              borderStyle: idx === 1 ? 'dashed' : 'solid',
            }}
          />
        ))}

        {/* Raios do núcleo até cada domínio: mostram que tudo converge na marca.
            Ficam dentro do anel girante, então acompanham a rotação. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={
            rm
              ? undefined
              : {
                  animation: `orbit-spin ${RING_SECONDS}s linear infinite`,
                  animationPlayState: paused ? 'paused' : 'running',
                  willChange: 'transform',
                }
          }
        >
          {DOMAINS.map((d, idx) => {
            const isActive = idx === i;
            return (
              <span
                key={d.id}
                className="absolute left-1/2 top-0 block h-1/2 w-px origin-bottom transition-opacity duration-700"
                style={{
                  transform: `rotate(${idx * step}deg)`,
                  transformOrigin: '50% 100%',
                  background: `linear-gradient(to bottom, ${d.color}00, ${d.color}${isActive ? 'cc' : '33'})`,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
            );
          })}
        </div>

        {/* Ponto luminoso que percorre o anel externo */}
        {!rm && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              animation: `orbit-spin ${RING_SECONDS / 2.4}s linear infinite`,
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            <span
              className="absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: active.color,
                boxShadow: `0 0 16px 4px ${active.color}aa`,
                transition: 'background 700ms ease, box-shadow 700ms ease',
              }}
            />
          </div>
        )}

        {/* Anel orbital com os domínios */}
        <div
          className="absolute inset-0"
          style={
            rm
              ? undefined
              : {
                  animation: `orbit-spin ${RING_SECONDS}s linear infinite`,
                  animationPlayState: paused ? 'paused' : 'running',
                  willChange: 'transform',
                }
          }
        >
          {DOMAINS.map((d, idx) => {
            const angle = idx * step;
            const isActive = idx === i;
            const Icon = getIcon(d.icon);
            return (
              // Camada do tamanho do container rotacionada: o raio da órbita é
              // metade da altura, então acompanha o layout sem px fixo.
              <div
                key={d.id}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                {/* posiciona no topo do círculo e contra-rotaciona para manter
                    o chip legível na horizontal */}
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                  style={
                    rm
                      ? { transform: `translate(-50%, -50%) rotate(${-angle}deg)` }
                      : ({
                          transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                          '--orbit-angle': `${-angle}deg`,
                          animation: `orbit-counter ${RING_SECONDS}s linear infinite`,
                          animationPlayState: paused ? 'paused' : 'running',
                          willChange: 'transform',
                        } as React.CSSProperties)
                  }
                >
                  <button
                    type="button"
                    onClick={() => setI(idx)}
                    aria-label={`Destacar ${d.label}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur transition-[background,border-color,color,box-shadow] duration-500"
                    style={{
                      borderColor: isActive ? `${d.color}99` : 'rgba(255,255,255,0.12)',
                      background: isActive
                        ? `linear-gradient(135deg, ${d.color}2e, ${d.color}0a)`
                        : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                      boxShadow: isActive ? `0 10px 30px -14px ${d.color}` : 'none',
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: isActive ? d.color : 'rgba(255,255,255,0.5)' }}
                      strokeWidth={1.9}
                    />
                    {d.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Núcleo: a marca */}
        <div className="absolute left-1/2 top-1/2 flex w-[46%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center">
          <span
            aria-hidden
            className={`absolute inset-0 -z-10 rounded-full ${rm ? '' : 'halo-pulse'}`}
            style={{
              color: active.color,
              background: `radial-gradient(circle, ${active.color}33, transparent 70%)`,
              transition: 'color 700ms ease, background 700ms ease',
            }}
          />
          {/* Anel interno do núcleo, com a cor do domínio ativo */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[-14%] -z-10 rounded-full border transition-colors duration-700"
            style={{ borderColor: `${active.color}55` }}
          />
          <span className="font-display text-[clamp(1.4rem,2.8vw,2rem)] font-black leading-none tracking-tight text-white">
            SISTRAN
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#B8DDF6]">
            Insurance Tech
          </span>
        </div>
      </div>

      {/* Rodapé institucional. A borda e o glow herdam a cor do domínio ativo,
          então o card deixa de ser um retângulo cinza neutro. */}
      <div
        className="relative mt-2 overflow-hidden rounded-3xl border p-5 backdrop-blur-xl transition-colors duration-700"
        style={{
          borderColor: `${active.color}4d`,
          background: `linear-gradient(150deg, ${active.color}1f, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.02))`,
          boxShadow: `0 24px 60px -34px ${active.color}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Fio de luz no topo, na cor do domínio */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px transition-colors duration-700"
          style={{
            background: `linear-gradient(90deg, transparent, ${active.color}, transparent)`,
          }}
        />
        <div className="min-h-[2.5rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={rm ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: easeExpo }}
              className="text-sm leading-relaxed text-white/70"
            >
              <span
                className="font-bold transition-colors duration-700"
                style={{ color: active.color }}
              >
                {active.label}
              </span>{' '}
              — um dos domínios de seguros que a Sistran opera de ponta a ponta.
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          {[
            { label: 'Desde', value: 1988, suffix: '', tone: '#0ed8f6' },
            { label: 'Anos de mercado', value: 35, suffix: '+', tone: '#57B7EE' },
            { label: 'Especialistas', value: 850, suffix: '+', tone: '#a855f7' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              {/* Cada número puxa um tom distinto da paleta */}
              <span
                className="font-display text-xl font-black leading-none md:text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${s.tone}, #ffffff 85%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                <CountUp to={s.value} suffix={s.suffix} disabled={rm} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
