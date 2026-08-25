'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { METRICS } from '@/data/metrics';
import { CountUp } from '@/components/primitives/CountUp';
import { useReducedMotion } from '@/lib/motion';

function MetricBig({ m, index }: { m: (typeof METRICS)[number]; index: number }) {
  const rm = useReducedMotion();
  const liRef = useRef<HTMLLIElement>(null);

  // Alternância em torno do eixo central: ímpares encostam o número no eixo
  // pela direita, pares pela esquerda. O número nunca vai para a borda da tela.
  const even = index % 2 === 0;


  return (
    <motion.li
      ref={liRef}
      initial={rm ? false : { opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px 0px -80px 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-b border-[#0079CB]/12 py-3.5 last:border-b-0 md:py-4"
    >
      {/* Nó no eixo central, na altura do número: costura a métrica à linha
          vertical e cresce no hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500 group-hover:scale-150 md:block"
        style={{
          background: 'linear-gradient(135deg, #0ed8f6, #a5f0ff)',
          boxShadow: '0 0 12px rgba(14,216,246,0.7)',
        }}
      />
      <div
        className={`flex flex-col gap-1.5 md:w-1/2 ${
          even
            ? 'items-start text-left md:items-end md:pr-8 md:text-right'
            : 'items-start text-left md:ml-auto md:pl-8'
        }`}
      >
        <div className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0079CB] ${even ? 'md:flex-row-reverse' : ''}`}>
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span aria-hidden className={`h-px w-16 bg-gradient-to-r ${even ? 'md:bg-gradient-to-l' : ''} from-[#0079CB] to-transparent`} />
        </div>

        <div
          className="font-display font-black leading-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(2.25rem, 4.6vw, 4rem)',
            letterSpacing: '-0.055em',
            background: 'linear-gradient(135deg, #0079CB 0%, #0ed8f6 55%, #a5f0ff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            transformOrigin: even ? 'right center' : 'left center',
          }}
        >
          {/* Contagem num MotionValue: o Motion escreve no nó a cada frame, sem
              re-render da lista inteira. O valor acessível completo (número +
              sufixo) fica no `.sr-only` abaixo, e a parte que corre é
              `aria-hidden`. */}
          <CountUp value={String(m.value)} srText={null} />
          <span aria-hidden className="text-[#0ed8f6]">{m.suffix}</span>
          <span className="sr-only">{m.value}{m.suffix}</span>
        </div>

        <p className="max-w-md text-base font-medium leading-relaxed text-[#3d5a80] md:text-lg">{m.label}</p>
      </div>
    </motion.li>
  );
}

export default function Metrics() {
  return (
    /* Na home do site esta secao sao SO os 7 contadores: nao ha sobretitulo,
       titulo nem paragrafo. O cabecalho que existia aqui ("Resultados
       acumulados" / "Números que traduzem nossa entrega" / "Métricas acumuladas
       ao longo da trajetória...") era texto inventado e saiu; o nome acessivel
       da secao fica no aria-label.
       Fonte: .claude/conteudo-site/00-home.md (secao 4) */
    <section
      id="resultados"
      aria-label="Sistran em números"
      className="section-py relative overflow-hidden"
    >
      <div className="container-lp">

        <div className="relative">
          {/* Linha técnica vertical conectando */}
          {/* Eixo central com gradiente em movimento (utility .progress-line-v),
              mascarado nas pontas para não terminar em corte seco. */}
          <span
            aria-hidden
            className="progress-line-v pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 opacity-60 md:block"
            style={{
              maskImage:
                'linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
            }}
          />
          <ul className="relative">
            {METRICS.map((m, i) => (
              <MetricBig key={m.id} m={m} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
