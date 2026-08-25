'use client';

/**
 * Faixa de sinais que passa em loop, entre os Resultados e o resto da página.
 *
 * Portada da apresentação de legado (`SignalMarquee` de `apresentação/site`), mas
 * sobre a mecânica que já existe aqui: `.marquee-viewport` / `.marquee-track` /
 * `.marquee-copy` e a keyframe `marquee-scroll` de `globals.css`, as mesmas do
 * `ClientWall`. Não há animação nova — só o desenho dos itens, em `legacy.css`.
 *
 * Herdar essa mecânica resolve de graça o ponto de acessibilidade: com movimento
 * reduzido o `globals.css` troca o mecanismo em vez de congelar a faixa (a
 * viewport vira lista rolável e a cópia duplicada sai de cena). Parar o loop sem
 * plano B deixaria os sinais fora da tela INALCANÇÁVEIS — não há setas nem
 * scroll próprio.
 *
 * A cópia visual é `aria-hidden`, então o leitor de tela lê a lista uma vez só.
 */

import './legacy.css';
import { useEffect, useRef, useState } from 'react';
import { marquee } from '@/data/legacy';

export function SignalMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  /* Quantas vezes a lista se repete DENTRO de uma cópia. Mesma razão do
     `ClientWall`: são seis sinais e, em tela larga, uma cópia é mais estreita
     que a viewport — as duas cópias da trilha não cobrem a tela e sobra um vazio
     até o loop reiniciar. Medimos e repetimos até a cópia encher a viewport. */
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
    /* A 1ª medição acontece antes da serifa e das logos chegarem: a largura
       ainda vai mudar, e com ela o número de repetições. */
    document.fonts?.ready.then(measure).catch(() => undefined);
    const logos = Array.from(group.querySelectorAll('img'));
    logos.forEach((img) => img.addEventListener('load', measure));

    return () => {
      ro.disconnect();
      logos.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [repeats]);

  /* A logo é decorativa: a escrita ao lado já nomeia o sinal, então `alt=""` e
     nada de texto duplicado para o leitor de tela. `<img>` simples — são
     arquivos estáticos de proporção variada, exibidos em altura fixa, e o
     otimizador não tem o que fazer aqui. */
  const copia = (
    <>
      {Array.from({ length: repeats }, (_, r) =>
        marquee.map((sinal) => (
          <span className="lp-signal" key={`${sinal.label}-${r}`}>
            {sinal.logo ? (
              <span className="lp-signal-logo" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sinal.logo} alt="" loading="lazy" decoding="async" />
              </span>
            ) : null}
            {sinal.label}
          </span>
        )),
      )}
    </>
  );

  return (
    <div className="lp-signals">
      <div ref={viewportRef} className="marquee-viewport">
        <div className="marquee-track marquee-left">
          <div ref={groupRef} className="marquee-copy lp-signals-copy">
            {copia}
          </div>
          <div className="marquee-copy lp-signals-copy" aria-hidden="true">
            {copia}
          </div>
        </div>
      </div>
    </div>
  );
}
