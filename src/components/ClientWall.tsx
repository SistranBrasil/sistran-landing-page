'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CLIENTS, type Client } from '@/data/clients';

export default function ClientWall() {
  /* Distribui alternando (pares/impares) em vez de cortar ao meio: a lista
     comeca com os parceiros que tem logo e termina nas seguradoras sem logo,
     então um slice deixaria a 1a fileira toda de placas e a 2a toda de chips. */
  const half1 = CLIENTS.filter((_, i) => i % 2 === 0);
  const half2 = CLIENTS.filter((_, i) => i % 2 === 1);

  return (
    /* pb maior que pt: o marquee terminava colado na faixa escura de #sistran.
       O respiro extra embaixo separa as duas seções e deixa claro que ha mais
       conteudo adiante. */
    <section
      id="clientes"
      aria-labelledby="clientes-titulo"
      className="relative overflow-hidden pb-24 pt-14 md:pb-36 md:pt-20"
    >
      <div className="container-lp">
        <div className="mb-8 flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            {/* .tag-section (chip com moldura), igual Serviços e #sistran */}
            <span className="tag-section">Confiam na Sistran</span>
            <h2 id="clientes-titulo" className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Seguradoras e parceiros que atendemos
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Uma trajetória construída em parceria com o mercado segurador brasileiro e global.
          </p>
        </div>
      </div>

      {/* Fade lateral generoso (14%) e com parada intermediaria: as placas
          BRANCAS têm muito mais contraste que os chips translucidos de antes,
          então um fade curto de 6% terminava em corte seco na borda. O stop em
          6%/94% com 45% de alfa faz a marca desaparecer progressivamente em vez
          de ser cortada ao meio. */}
      <div
        data-reveal-skip
        className="relative w-full"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 6%, black 14%, black 86%, rgba(0,0,0,0.45) 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 6%, black 14%, black 86%, rgba(0,0,0,0.45) 94%, transparent 100%)',
        }}
      >
        <Marquee items={half1} speed={40} direction="left" />
        <div className="h-4" />
        <Marquee items={half2} speed={54} direction="right" />

        {/* Sombras de borda: reforcam o limite da area de rolagem por cima do
            mask. Ficam FORA dos .marquee-viewport (que tem overflow hidden) e
            nao captam ponteiro, para nao bloquear o hover que pausa o loop. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,32,66,0.55), rgba(4,32,66,0.18) 45%, transparent)',
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28"
          style={{
            background:
              'linear-gradient(270deg, rgba(4,32,66,0.55), rgba(4,32,66,0.18) 45%, transparent)',
          }}
        />
      </div>
    </section>
  );
}

/**
 * Card do marquee. Com `logo`, a placa branca (mesma receita do PartnersGrid)
 * dá contraste para logos coloridas sobre o fundo azul; sem `logo`, mantém o
 * chip textual anterior — nenhum cliente fica de fora por falta de asset.
 */
function ClientCard({ c }: { c: Client }) {
  const base =
    'inline-flex flex-none items-center justify-center whitespace-nowrap rounded-2xl border transition-all duration-300';

  if (c.logo) {
    return (
      <span
        className={`${base} h-[68px] w-[168px] border-white/40 bg-white px-5 py-3 shadow-[0_10px_30px_-14px_rgba(4,32,64,0.45)] hover:-translate-y-1 hover:border-[#0ed8f6]/60 hover:shadow-[0_16px_36px_-12px_rgba(14,216,246,0.55)]`}
      >
        <Image
          src={c.logo}
          alt={c.name}
          width={280}
          height={96}
          /* object-contain + max-h: logos vêm em proporções muito diferentes,
             a placa de tamanho fixo mantém o ritmo do marquee. */
          className="max-h-11 w-auto object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={`${base} gap-2 border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur hover:border-[#0ed8f6]/50 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_10px_30px_-10px_rgba(14,216,246,0.5)]`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6]/70" />
      {c.name}
    </span>
  );
}

function Marquee({
  items,
  speed,
  direction,
}: {
  items: readonly Client[];
  speed: number;
  direction: 'left' | 'right';
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  /* Quantas vezes a lista se repete DENTRO de uma copia. Com ~7 cards por
     fileira, uma copia e mais estreita que a viewport em telas grandes: as
     duas copias da trilha nao cobrem a tela e sobra um vazio ate o loop
     reiniciar. Medimos e repetimos ate a copia encher a viewport. */
  const [repeats, setRepeats] = useState(1);

  useEffect(() => {
    const vp = viewportRef.current;
    const group = groupRef.current;
    if (!vp || !group) return;

    const measure = () => {
      const groupW = group.getBoundingClientRect().width / repeats;
      const vpW = vp.getBoundingClientRect().width;
      if (groupW < 1 || vpW < 1) return;
      const needed = Math.max(1, Math.ceil(vpW / groupW));
      setRepeats((prev) => (prev === needed ? prev : needed));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    // A 1a medicao acontece antes de fontes/imagens: a largura ainda muda.
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => ro.disconnect();
  }, [repeats, items]);

  // Duas copias identicas: a 2a e aria-hidden para o leitor de tela nao ler
  // a lista duas vezes, e sai de cena em prefers-reduced-motion. O translate de
  // -50% da keyframe corresponde a exatamente UMA copia, logo o loop fecha sem
  // salto independentemente de quantos repeats a copia contenha.
  const copy = (
    <>
      {Array.from({ length: repeats }, (_, r) =>
        items.map((c, i) => <ClientCard key={`${c.name}-${r}-${i}`} c={c} />),
      )}
    </>
  );

  return (
    <div ref={viewportRef} className="marquee-viewport">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ '--mq-duration': `${speed}s` } as React.CSSProperties}
      >
        <div ref={groupRef} className="marquee-copy">{copy}</div>
        <div className="marquee-copy" aria-hidden="true">{copy}</div>
      </div>
    </div>
  );
}
