'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ACCELERATORS, type Accelerator } from '@/data/accelerators';
import { getIcon } from '@/lib/icons';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
import { useTilt } from '@/lib/useTilt';

function AccelCard({ a, index }: { a: Accelerator; index: number }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(a.icon);
  const pos = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Camada externa: entrada via variants (motion controla o transform).
       Camada interna: tilt 3D. Ver nota em useTilt. */
    <motion.div variants={vCard} className="h-full [perspective:1000px]">
    <article
      {...handlers}
      /* SIS-93 — `on-dark` é obrigatório aqui, não decorativo: a seção passou a
         ser `.section-light`, e os overrides dessa classe pintam h3/p/span de
         navy. Sem `on-dark` o texto do card ficaria navy sobre o navy do próprio
         card, ou seja, invisível. A classe devolve os valores claros (ver a nota
         em `.section-light .on-dark` no globals.css). */
      className="on-dark group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 p-7 backdrop-blur-xl"
      style={{
        // Navy escuro: o card precisa contrastar com o fundo da seção — antes o
        // azul médio da página, agora o azul claro de `.section-light-blue`. Nos
        // dois casos é o card mais escuro que carrega o contraste, então o
        // gradiente não muda; o que muda é a sombra abaixo.
        background:
          'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
        transform: tiltTransform({ lift: 8, deg: 7 }),
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'box-shadow .25s ease, border-color .2s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
        willChange: 'transform',
        // Sombra em camadas + halo do tone: da volume real ao card.
        // SIS-93 — a sombra passou de navy quase opaco para o azul da marca em
        // opacidade menor: sobre fundo claro, `rgba(3,26,52,0.5)` lê como uma
        // mancha suja em volta do card em vez de profundidade.
        boxShadow: hover
          ? `0 2px 6px rgba(0,121,203,0.14), 0 20px 40px -16px rgba(0,121,203,0.26), 0 44px 80px -32px rgba(0,121,203,0.30), 0 0 60px -18px ${a.tone}55, inset 0 1px 0 rgba(255,255,255,0.22)`
          : `0 1px 3px rgba(0,121,203,0.12), 0 12px 26px -14px rgba(0,121,203,0.20), 0 30px 60px -30px rgba(0,121,203,0.24), inset 0 1px 0 rgba(255,255,255,0.16)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${a.tone}, transparent 60%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(300px circle at ${pos.x}% ${pos.y}%, ${a.tone}22, transparent 55%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: a.tone }}
      />

      <div
        className="relative flex items-start justify-between gap-3"
        style={{ transform: 'translateZ(34px)' }}
      >
        <div
          className="flex h-13 w-13 items-center justify-center rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${a.tone}33, ${a.tone}10)`,
            border: `1px solid ${a.tone}66`,
            boxShadow: `0 8px 24px -12px ${a.tone}99`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: a.tone }} strokeWidth={1.8} />
        </div>
        <span
          aria-hidden
          className="font-display text-3xl leading-none"
          style={{
            // Branco translucido: o tone em opacity 15% desaparecia no fundo azul.
            color: 'rgba(255,255,255,0.30)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3
        className="relative mt-6 font-display text-xl leading-tight text-white"
        style={{ transform: 'translateZ(24px)' }}
      >
        {a.name}
      </h3>
      {/* Filete no lugar do subtitulo: o site nao escreve tagline nenhuma para
          os aceleradores, então nao ha texto a exibir aqui. */}
      <span
        aria-hidden
        className="relative mt-3 block h-px w-10 rounded-full"
        style={{ background: a.tone, transform: 'translateZ(18px)' }}
      />
      <p
        className="relative mt-4 text-sm leading-relaxed text-white/85"
        style={{ transform: 'translateZ(12px)' }}
      >
        {a.description}
      </p>
      {/* No site cada card leva a pagina do produto; o rotulo do link nao existe
          na origem (o card inteiro é clicavel), então usa o nome do produto. */}
      <Link
        href={`/solucoes/${a.id}`}
        className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        /* A cor vem por `style`, não por utility: `.section-light .on-dark a`
           usa `!important` e atropelaria `text-[#A5F0FF]`, deixando o link com a
           mesma cor do corpo do card. O `:not([style*="color"])` daquela regra
           existe justamente para quem declara cor própria aqui. */
        style={{ transform: 'translateZ(12px)', color: '#A5F0FF' }}
      >
        Conheça o {a.name}
        <span aria-hidden>&rarr;</span>
      </Link>
    </article>
    </motion.div>
  );
}

export default function Accelerators() {
  const rm = useReducedMotion();
  return (
    /* SIS-93 — o fundo azul claro é a MESMA classe que a Consultoria usa
       (`section-light section-light-blue`, definida uma única vez no
       globals.css), não uma cópia dos valores de gradiente. A textura de grade e
       a vinheta de borda vêm de brinde nos pseudo-elementos de `.section-light`,
       que é o que evita linha dura na emenda com as seções escuras vizinhas. */
    <section
      id="tecnologia-disruptiva"
      className="section-light section-light-blue section-py relative overflow-hidden"
    >
      {/* z-0 e não -z-10: `.section-light` traz `isolation: isolate` e o fundo
          agora é desta própria section — um z negativo jogaria os orbs para trás
          dele. Mesmo arranjo da Consultoria. O ciano substitui o violeta
          `#A78BFA`: a paleta da marca é branco + azuis. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-32 h-[380px] w-[380px] rounded-full bg-[#0079CB]/14 blur-[130px]" />
        <div className="absolute right-0 bottom-32 h-[420px] w-[420px] rounded-full bg-[#0ed8f6]/12 blur-[130px]" />
      </div>

      <div className="container-lp relative z-10">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            {/* Sobretitulo e titulo como no site: "Tecnologia Disruptiva" /
                "Soluções". O paragrafo é verbatim. */}
            <motion.span variants={vSubtitle} className="tag-section">
              Tecnologia Disruptiva
            </motion.span>
            <motion.h2
              variants={vTitle}
              className="mt-3 font-display text-section text-ink"
            >
              Soluções
            </motion.h2>
            <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
              Desenvolvemos aceleradores para entregar os melhores resultados,
              &ldquo;ouvimos seu desafio&rdquo;, fazendo Discovery para seu negócio, desenhando uma
              solução personalizada entregando resultados assertivos com excelência.
            </motion.p>
            <motion.p
              variants={vSubtitle}
              className="mt-3 text-lg font-semibold leading-relaxed text-ink"
            >
              Conheça nossos aceleradores:
            </motion.p>
          </div>
          {/* Mesmo selo da Consultoria: sobre azul claro, borda e texto brancos
              sumiriam. */}
          <span className="inline-flex h-fit items-center gap-2 rounded-full border border-[#0079CB]/22 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0060a8]">
            {ACCELERATORS.length} aceleradores
          </span>
        </motion.div>

        <motion.div
          variants={vGrid}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="grid auto-rows-[minmax(300px,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACCELERATORS.map((a, i) => (
            <AccelCard key={a.id} a={a} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
