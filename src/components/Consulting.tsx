'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CONSULTING_AREAS } from '@/data/consulting';
import { getIcon } from '@/lib/icons';
import { vHeader, vTitle, vSubtitle, VP, easeExpo, useReducedMotion } from '@/lib/motion';
import type { ConsultingArea } from '@/data/consulting';

/**
 * Layout em linhas numeradas, nao em grid de cards.
 *
 * Consultoria ficava logo abaixo de Accelerators usando a mesma receita
 * (card navy + tilt 3D + grid de 2 colunas), e as duas secoes se liam como
 * uma repeticao. Aqui a leitura e horizontal: indice, titulo e descricao numa
 * linha larga, com a linha ativa se destacando. O contraste entre as secoes
 * passa a vir da estrutura, nao da cor.
 */
/* Acentos proprios da secao, nao o `tone` de consulting.ts. Aqueles tons
   (#0ed8f6, #C4A0FB) foram escolhidos para fundo navy e desaparecem sobre
   azul claro. Estes tem luminancia suficiente para contrastar com o fundo. */
const ROW_ACCENTS = ['#0079CB', '#0060A8', '#6D28D9', '#7c3aed'] as const;

function accentOf(index: number) {
  return ROW_ACCENTS[index % ROW_ACCENTS.length];
}

function ConsultRow({
  c,
  index,
  total,
  active,
  onActivate,
}: {
  c: ConsultingArea;
  index: number;
  total: number;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = getIcon(c.icon);
  const accent = accentOf(index);

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easeExpo }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      /* group/row, nao group: o wrapper de secao tambem usa group-hover e o
         nome sem escopo faria as duas linhas reagirem ao mesmo hover. */
      className="group/row relative border-t border-[#0079CB]/18 last:border-b"
    >
      {/* Preenchimento do fundo na linha ativa: entra da esquerda em scaleX,
          que e composto na GPU — animar `width` causaria reflow por frame.
          Base branca, nao o tone: sobre fundo azul claro o tone diluido nao
          gera diferenca visivel, o branco sim. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left transition-transform duration-500"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.15))`,
          transform: `scaleX(${active ? 1 : 0})`,
          transitionTimingFunction: 'var(--ease-out)',
          boxShadow: active ? '0 14px 34px -22px rgba(0,121,203,0.55)' : 'none',
        }}
      />
      {/* Barra de acento na borda esquerda */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] origin-top transition-transform duration-500"
        style={{
          background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
          transform: `scaleY(${active ? 1 : 0})`,
          transitionTimingFunction: 'var(--ease-out)',
        }}
      />

      <div className="relative flex flex-col gap-4 px-4 py-7 md:flex-row md:items-start md:gap-8 md:px-8 md:py-9">
        {/* Indice + icone */}
        <div className="flex shrink-0 items-center gap-4 md:w-32 md:flex-col md:items-start md:gap-4">
          <span
            aria-hidden
            className="font-display text-3xl font-black leading-none transition-colors duration-500 md:text-4xl"
            style={{
              color: active ? accent : 'rgba(6,43,82,0.32)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500"
            style={{
              background: active
                ? `linear-gradient(135deg, ${accent}22, ${accent}0a)`
                : 'rgba(255,255,255,0.70)',
              border: `1px solid ${active ? `${accent}55` : 'rgba(0,121,203,0.18)'}`,
              boxShadow: active
                ? `0 10px 26px -14px ${accent}88`
                : '0 6px 18px -14px rgba(0,121,203,0.45)',
            }}
          >
            <Icon
              className="h-6 w-6 transition-colors duration-500"
              style={{ color: active ? accent : 'rgba(60,90,122,0.75)' }}
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Texto */}
        <div className="min-w-0 flex-1">
          <h3
            className="font-display text-xl font-bold leading-snug transition-transform duration-500 md:text-2xl"
            style={{ color: '#062B52', transform: active ? 'translateX(6px)' : 'none' }}
          >
            {c.title}
          </h3>
          <p
            className="mt-3 max-w-3xl text-sm leading-relaxed md:text-base"
            style={{ color: '#3C5A7A' }}
          >
            {c.description}
          </p>
        </div>

        {/* Contador de posicao, alinhado a direita no desktop */}
        <span
          aria-hidden
          className="hidden shrink-0 self-center text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 lg:block"
          style={{ color: active ? accent : 'rgba(6,43,82,0.35)' }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </motion.li>
  );
}

export default function Consulting() {
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    /* section-light-blue: fundo azul claro. A classe traz junto os overrides de
       .section-light (texto para navy, .text-gradient para #0079CB, dot da
       tag-section para azul), entao o cabecalho se ajusta sozinho. */
    <section
      id="consultoria"
      className="section-light section-light-blue section-py relative overflow-hidden"
    >
      {/* z-0, nao -z-10: .section-light traz `isolation: isolate` e o fundo agora
          esta nesta propria section — um z negativo jogaria os orbs para tras do
          background e eles nao apareceriam. O conteudo sobe com z-10. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[-8%] top-24 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/10 blur-[130px]" />
        <div className="absolute bottom-16 left-[-6%] h-[380px] w-[380px] rounded-full bg-[#0079CB]/14 blur-[130px]" />
      </div>

      {/* Grid assimetrico: cabecalho fica sticky na coluna estreita enquanto as
          linhas rolam ao lado — reforca que sao itens de um mesmo conjunto. */}
      <div className="container-lp relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <motion.span variants={vSubtitle} className="tag-section">
            Consultoria
          </motion.span>
          <motion.h2
            variants={vTitle}
            className="mt-3 font-display text-section font-bold text-ink"
          >
            <span className="text-gradient-brand">Consultoria</span>
          </motion.h2>
          {/* Abertura e fechamento verbatim da secao Consultoria do site. */}
          <motion.p variants={vSubtitle} className="mt-4 text-base leading-relaxed text-ink-muted">
            Nossa expertise abrange consultoria personalizada, projetada para impulsionar o
            crescimento e a eficiência de sua empresa:
          </motion.p>
          <motion.p variants={vSubtitle} className="mt-4 text-base leading-relaxed text-ink-muted">
            Nosso time de consultores está preparado para entender as necessidades e desafios do seu
            negócio, para oferecer soluções personalizadas que impulsionam a inovação, a eficiência e
            o crescimento da sua empresa.
          </motion.p>
          <motion.span
            variants={vSubtitle}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0079CB]/22 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0060a8]"
          >
            {CONSULTING_AREAS.length} frentes de atuação
          </motion.span>
        </motion.div>

        <ul className="relative">
          {CONSULTING_AREAS.map((c, i) => (
            <ConsultRow
              key={c.id}
              c={c}
              index={i}
              total={CONSULTING_AREAS.length}
              active={i === active}
              onActivate={() => setActive(i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
