'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin } from 'lucide-react';
import { CONTACT_PHONE, UNITS } from '@/data/contact';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
import ContactModal from './ContactModal';

function MagneticButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rm = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rm || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const max = 8;
    const nx = Math.max(-max, Math.min(max, dx * 0.25));
    const ny = Math.max(-max, Math.min(max, dy * 0.25));
    setPos({ x: nx, y: ny });
  };
  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      type="button"
      className="btn-primary"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </button>
  );
}

export default function Contact() {
  const rm = useReducedMotion();
  const [open, setOpen] = useState(false);
  const main = UNITS[0];
  const others = UNITS.slice(1);

  return (
    <section id="contato" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb orb-cyan orb-drift-slow -left-20 top-10 h-[360px] w-[360px] opacity-45" />
        <div className="orb orb-violet orb-drift right-[-6%] bottom-0 h-[400px] w-[400px] opacity-35" />
      </div>

      {/* Linha decorativa conectando ao hero acima */}
      <span aria-hidden className="brand-line pointer-events-none absolute inset-x-0 top-0" />

      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="max-w-4xl"
        >
          {/* Sobretitulo, titulo e texto verbatim do bloco de contato da home.
              Fonte: .claude/conteudo-site/00-home.md (secao 6) */}
          <motion.span variants={vSubtitle} className="tag-section">
            Saiba mais sobre o que podemos oferecer
          </motion.span>
          <motion.h2
            variants={vTitle}
            className="mt-5 font-display text-section font-bold text-ink"
          >
            Entre em <span className="text-gradient-brand">contato</span> conosco
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-6 max-w-xl text-lg text-ink-muted md:text-xl">
            Contacte-nos para saber que tipo de soluções podemos implementar para o seu negócio!
            Nosso telefone é <strong className="font-bold text-ink">{CONTACT_PHONE}</strong>. Ou se
            preferir, deixe uma mensagem abaixo que te retornaremos em breve.
          </motion.p>

          <motion.div variants={vSubtitle} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton onClick={() => setOpen(true)}>
              Deixe uma mensagem
            </MagneticButton>
            <a href={`tel:${CONTACT_PHONE.replace(/\D/g, '')}`} className="btn-ghost">
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              {CONTACT_PHONE}
            </a>
          </motion.div>
        </motion.div>

        {/* Grid de dados */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div
            className="glass-card-hover md:col-span-2 flex flex-col p-8"
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(120,201,248,0.28)' }}
          >
            <div className="mb-3 flex items-center gap-2 text-[#0079CB]">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                {main.city} · {main.state}
              </span>
            </div>
            <p className="text-lg font-medium leading-relaxed text-[#0a1f44]">{main.address}</p>
            {main.phone && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0a1f44]">
                <Phone className="h-4 w-4" strokeWidth={1.8} /> {main.phone}
              </p>
            )}
          </div>

          <div
            className="glass-card-hover flex flex-col p-8"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(120,201,248,0.24)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0079CB]">
              Unidades
            </span>
            {others.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {others.map((u) => (
                  <li key={u.id} className="flex items-baseline gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6]" />
                    <span>
                      <span className="text-sm font-bold text-[#0a1f44]">{u.city}</span>
                      <span className="text-sm text-[#3d5a80]"> · {u.state}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.div>
      </div>

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
