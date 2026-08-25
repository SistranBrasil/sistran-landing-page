'use client';

import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { LINKEDIN_URL } from '@/data/contact';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

export default function Social() {
  const rm = useReducedMotion();
  return (
    <section
      id="social"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          // Faixa mais profunda que o resto da pagina: o titulo usa gradiente
          // claro (a5f3fc -> branco -> e9d5ff) e sobre #2A9BE0 ele sumia.
          'radial-gradient(70% 60% at 20% 20%, rgba(14,216,246,0.22), transparent 65%), radial-gradient(60% 60% at 80% 80%, rgba(124,58,237,0.30), transparent 65%), linear-gradient(180deg, #0B4E86 0%, #0F63A8 55%, #0B4E86 100%)',
      }}
    >
      {/* Ghost background text */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display font-black uppercase leading-none"
        style={{
          fontSize: 'clamp(4rem, 18vw, 18rem)',
          letterSpacing: '-0.05em',
          // Sem mix-blend-screen (que apagava tudo no fundo claro) e com
          // contorno: o texto fantasma volta a ser legivel como marca d'agua.
          color: 'rgba(255,255,255,0.05)',
          WebkitTextStroke: '1px rgba(14,216,246,0.20)',
          animation: rm ? undefined : 'gradient-shift 20s ease-in-out infinite',
        }}
      >
        #SomosSistraners
      </span>

      {/* Orbs ambientes */}
      <div
        aria-hidden
        className="orb orb-cyan orb-drift-slow pointer-events-none absolute -left-24 top-0 h-[480px] w-[480px] opacity-40"
      />
      <div
        aria-hidden
        className="orb orb-violet orb-drift pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] opacity-30"
      />

      <div className="container-lp relative">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="max-w-3xl"
        >
          {/* .tag-section (chip com moldura), igual Serviços e Clientes */}
          <motion.span variants={vSubtitle} className="tag-section">
            #sistran
          </motion.span>
          <motion.h2
            variants={vTitle}
            className="mt-5 font-display text-section font-bold text-white"
          >
            Siga a Sistran no LinkedIn{' '}
            <span className="text-gradient-brand">#SomosSistraners</span>
          </motion.h2>
          <motion.p
            variants={vSubtitle}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
          >
            Conecte-se ao futuro! Siga nossa página no LinkedIn e fique por dentro das últimas
            tendências e oportunidades do mercado.
          </motion.p>
          <motion.div variants={vSubtitle} className="mt-8">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.8} />
              {/* Rotulo do botao como escrito no site. */}
              Siga nossa página no Linkedin
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
