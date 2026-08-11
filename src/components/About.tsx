'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

const HIGHLIGHTS = [
  {
    value: '1988',
    label: 'Ano de fundação',
    detail: 'Três décadas e meia dedicadas ao mercado de seguros.',
    num: 1988,
    suffix: '',
    start: 1900,
    color: '#0ed8f6',
  },
  {
    value: '850+',
    label: 'Profissionais',
    detail: 'Especialistas em negócio e tecnologia atuando no core.',
    num: 850,
    suffix: '+',
    start: 0,
    color: '#0079CB',
  },
  {
    value: '3',
    label: 'Unidades no Brasil',
    detail: 'Presença nacional com alcance também no exterior.',
    num: 3,
    suffix: '',
    start: 0,
    color: '#7c3aed',
  },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Contador crescente. Escreve direto no DOM dentro do rAF em vez de chamar
 * setState por frame — evita ~96 re-renders por número durante a contagem.
 */
function CountUpNumber({
  target,
  start,
  suffix,
  active,
  color,
}: {
  target: number;
  start: number;
  suffix: string;
  active: boolean;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  /* A contagem é a informação em si, não um efeito decorativo: roda também com
     movimento reduzido. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = `${start}${suffix}`;
      return;
    }
    const dur = 1800;
    const t0 = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = `${Math.round(start + (target - start) * easeOut(p))}${suffix}`;
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, start, target, suffix]);

  return (
    <span
      ref={ref}
      aria-hidden
      className="font-display font-black leading-none tabular-nums"
      style={{
        fontSize: 'clamp(3.25rem, 7.5vw, 6rem)',
        letterSpacing: '-0.05em',
        background: `linear-gradient(135deg, ${color} 0%, #0ed8f6 55%, #7c3aed 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {`${start}${suffix}`}
    </span>
  );
}

export default function About() {
  const rm = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [countActive, setCountActive] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setCountActive(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="quem-somos" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb orb-cyan orb-drift-slow -left-24 top-24 h-[380px] w-[380px] opacity-50" />
        <div className="orb orb-violet orb-drift right-[-6%] bottom-10 h-[420px] w-[420px] opacity-40" />
      </div>

      <div className="container-lp">
        {/* Layout editorial assimétrico: título à esquerda, texto deslocado à direita */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
          <motion.div
            variants={vHeader}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="lg:col-span-5 lg:col-start-1"
          >
            <motion.span variants={vSubtitle} className="tag-section">
              Quem somos
            </motion.span>
            <motion.h2
              variants={vTitle}
              className="mt-5 font-display font-bold text-ink"
              style={{
                fontSize: 'clamp(2.25rem, 4.6vw, 4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.032em',
              }}
            >
              Especialistas em <span className="text-gradient-brand">tecnologia</span> para seguradoras
            </motion.h2>
            {/* Régua da marca: fecha o bloco do título e amarra com a coluna de texto */}
            <motion.span
              variants={vSubtitle}
              aria-hidden
              className="mt-8 block h-[3px] w-24 origin-left rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #0ed8f6, #0079CB 55%, #7c3aed)',
                boxShadow: '0 0 18px rgba(14,216,246,0.45)',
              }}
            />
          </motion.div>

          <motion.div
            variants={vHeader}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="lg:col-span-6 lg:col-start-7 lg:pt-4"
          >
            {/* Lead: primeira frase em destaque, cria hierarquia dentro do próprio parágrafo */}
            <motion.p
              variants={vSubtitle}
              className="max-w-xl text-ink-muted"
              style={{
                fontSize: 'clamp(1.125rem, 1.6vw, 1.5rem)',
                lineHeight: 1.55,
                letterSpacing: '-0.011em',
              }}
            >
              <span className="font-semibold text-ink">
                Há mais de três décadas transformando processos, sistemas e operações de seguradoras
              </span>{' '}
              no Brasil e no exterior. Combinamos domínio profundo do negócio com tecnologia
              pragmática para entregar resultados mensuráveis.
            </motion.p>

            {/* Segundo parágrafo com barra lateral: vira citação editorial, não repetição */}
            <motion.p
              variants={vSubtitle}
              className="mt-8 max-w-xl border-l-2 pl-5 text-base leading-relaxed text-ink-muted md:text-lg"
              style={{ borderColor: 'rgba(0,121,203,0.35)' }}
            >
              Da subscrição ao sinistro, do vida ao P&amp;C, da sustentação ao delivery de novos
              produtos: nosso time atua no{' '}
              <span className="font-semibold text-ink">core do negócio</span> das principais
              seguradoras do país.
            </motion.p>
          </motion.div>
        </div>

        {/* Régua horizontal de indicadores */}
        <motion.div
          ref={railRef}
          initial={rm ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 md:mt-28"
        >
          {/* linha gradient horizontal passando por trás (~50% altura) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-[2px] -translate-y-1/2 sm:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(14,216,246,0.55), rgba(0,121,203,0.75), rgba(124,58,237,0.55), transparent)',
              boxShadow: '0 0 20px rgba(14,216,246,0.25)',
            }}
          />
          {/* dots decorativos ao longo da linha */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-around sm:flex">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="block h-1 w-1 rounded-full"
                style={{ background: 'rgba(0,121,203,0.35)' }}
              />
            ))}
          </span>
          <ul className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => {
              const color = h.color;
              return (
                <motion.li
                  key={h.label}
                  initial={rm ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={VP}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                    // cascata: cada card entra depois do anterior
                    delay: rm ? 0 : 0.14 * i,
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#0079CB]/15 bg-white/70 p-7 backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1.5"
                  style={{ boxShadow: `0 20px 40px -30px ${color}66` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 30px 60px -24px ${color}88, 0 0 0 1px ${color}55 inset`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px -30px ${color}66`;
                  }}
                >
                  {/* Wash de cor no canto: dá identidade a cada indicador */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{ background: color }}
                  />
                  {/* corner-accents */}
                  <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 transition-all duration-500 group-hover:h-5 group-hover:w-5" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 transition-all duration-500 group-hover:h-5 group-hover:w-5" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l-2 border-b-2 transition-all duration-500 group-hover:h-5 group-hover:w-5" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 transition-all duration-500 group-hover:h-5 group-hover:w-5" style={{ borderColor: color }} />

                  <div className="relative flex items-start gap-3">
                    <CountUpNumber
                      target={h.num}
                      start={h.start}
                      suffix={h.suffix}
                      active={countActive}
                      color={color}
                    />
                    <span
                      aria-hidden
                      className="mt-4 inline-block h-2 w-2 flex-none rounded-full"
                      style={{
                        background: color,
                        boxShadow: `0 0 12px ${color}`,
                        animation: rm ? 'none' : 'halo-pulse 2.2s ease-in-out infinite',
                      }}
                    />
                    {/* Valor real para leitores de tela — o contador é aria-hidden */}
                    <span className="sr-only">{h.value}</span>
                  </div>

                  <p className="relative mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#3d5a80]">
                    {h.label}
                  </p>

                  {/* Trilha que preenche no hover, reforçando a cor do indicador */}
                  <span aria-hidden className="relative mt-4 block h-[2px] w-full overflow-hidden rounded-full bg-[#0079CB]/10">
                    <span
                      className="block h-full w-full origin-left scale-x-0 rounded-full transition-transform duration-700 group-hover:scale-x-100"
                      style={{ background: `linear-gradient(90deg, ${color}, #7c3aed)` }}
                    />
                  </span>

                  {/* Detalhe e a pista de hover ocupam o MESMO espaço e fazem
                      crossfade: sem a pista, o texto escondido é indescobrível.
                      focus-within replica o comportamento para teclado/touch. */}
                  <div className="mt-3 grid [&>*]:col-start-1 [&>*]:row-start-1">
                    <span
                      aria-hidden
                      className="flex items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d5a80]/70 opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
                    >
                      <span
                        className="inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[13px] leading-none"
                        style={{ background: `${color}22`, color }}
                      >
                        +
                      </span>
                      Passe o mouse
                    </span>
                    <p className="self-start text-sm leading-relaxed text-[#3d5a80] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                      {h.detail}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
