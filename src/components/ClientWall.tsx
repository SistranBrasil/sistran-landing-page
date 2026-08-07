'use client';

import { CLIENT_NAMES } from '@/data/clients';

export default function ClientWall() {
  const half1 = CLIENT_NAMES.slice(0, Math.ceil(CLIENT_NAMES.length / 2));
  const half2 = CLIENT_NAMES.slice(Math.ceil(CLIENT_NAMES.length / 2));

  return (
    <section id="clientes" aria-labelledby="clientes-titulo" className="relative overflow-hidden py-14 md:py-20">
      <div className="container-lp">
        <div className="mb-8 flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow !text-[#0ed8f6]">Confiam na Sistran</span>
            <h2 id="clientes-titulo" className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Seguradoras e parceiros que atendemos
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Uma trajetória construída em parceria com o mercado segurador brasileiro e global.
          </p>
        </div>
      </div>

      <div
        data-reveal-skip
        className="relative w-full"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <Marquee items={half1} speed={40} direction="left" />
        <div className="h-4" />
        <Marquee items={half2} speed={54} direction="right" />
      </div>
    </section>
  );
}

function Marquee({
  items,
  speed,
  direction,
}: {
  items: string[];
  speed: number;
  direction: 'left' | 'right';
}) {
  // Duas copias identicas: a 2a e aria-hidden para o leitor de tela nao ler
  // a lista duas vezes, e sai de cena em prefers-reduced-motion.
  const copy = (
    <>
      {items.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur transition-all duration-300 hover:border-[#0ed8f6]/50 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_10px_30px_-10px_rgba(14,216,246,0.5)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6]/70" />
          {name}
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee-viewport">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="marquee-copy">{copy}</div>
        <div className="marquee-copy" aria-hidden="true">{copy}</div>
      </div>
    </div>
  );
}
