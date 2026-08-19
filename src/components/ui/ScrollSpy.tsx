'use client';

import { useEffect, useState } from 'react';

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: 'top', label: 'Início' },
  { id: 'quem-somos', label: 'Quem somos' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'solucoes', label: 'Soluções' },
  { id: 'contato', label: 'Contato' },
];

export default function ScrollSpy() {
  const [active, setActive] = useState('top');
  const [wide, setWide] = useState(false);
  /** A seção ativa está sobre fundo claro? O nav é `fixed` (fora de
   *  `.section-light`), então a cascata do CSS não o alcança. */
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1440px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!wide) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActive(e.target.id);
          setOnLight(!!e.target.closest('.section-light'));
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [wide]);

  if (!wide) return null;

  return (
    <nav
      aria-label="Navegação da página"
      className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 2xl:left-5 [@media(min-width:1440px)]:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`Ir para ${s.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex h-6 items-center"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? onLight
                    ? 'w-6 bg-[#0079CB]'
                    : 'w-6 bg-[#0ed8f6]'
                  : onLight
                    ? 'w-1.5 bg-[#0a1f44]/30 group-hover:w-3 group-hover:bg-[#0a1f44]/60'
                    : 'w-1.5 bg-white/25 group-hover:w-3 group-hover:bg-white/60'
              }`}
              style={
                isActive
                  ? { boxShadow: onLight ? '0 0 12px rgba(0,121,203,0.55)' : '0 0 12px #0ed8f6' }
                  : undefined
              }
            />
            <span
              className={`ml-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity ${
                isActive
                  ? onLight
                    ? 'text-[#0a1f44] opacity-100'
                    : 'text-white opacity-100'
                  : onLight
                    ? 'text-[#0a1f44]/70 opacity-0 group-hover:opacity-100'
                    : 'text-white/60 opacity-0 group-hover:opacity-100'
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
