'use client';

/**
 * Faixa de parceiros que passa em loop, entre os Resultados e o resto da página.
 *
 * Antes esta faixa passava os seis sinais do método em serifa grande
 * ("Diagnóstico do legado", "Conhecimento navegável", ...). Saíram a pedido: o
 * texto repetia o que os quatro movimentos do Método já dizem logo acima, e o
 * lugar depois das evidências pede prova de terceiros. Agora passam as marcas de
 * `/parceiros-e-implementacoes` — a MESMA lista (`CLIENTS`), para as duas páginas
 * nunca divergirem.
 *
 * A mecânica de rolagem vem de `globals.css` (`.marquee-viewport` /
 * `.marquee-track` / `.marquee-copy` e a keyframe `marquee-scroll`), a mesma do
 * `ClientWall`. Não há animação nova — só o desenho dos itens, em `legacy.css`.
 *
 * Herdar essa mecânica resolve de graça o ponto de acessibilidade: com movimento
 * reduzido o `globals.css` troca o mecanismo em vez de congelar a faixa (a
 * viewport vira lista rolável e a cópia duplicada sai de cena). Parar o loop sem
 * plano B deixaria as marcas fora da tela INALCANÇÁVEIS — não há setas nem
 * scroll próprio.
 *
 * A cópia visual é `aria-hidden`, então o leitor de tela lê a lista uma vez só.
 */

import './legacy.css';
import { useEffect, useRef, useState } from 'react';
import { CLIENTS } from '@/data/clients';

/* Só as marcas COM arquivo de logo. A faixa é puramente visual: um chip textual
   no meio de placas gráficas (o fallback do `ClientWall`) quebraria o ritmo do
   loop. Hoje as seguradoras sem asset estão comentadas em `clients.ts`, mas o
   filtro garante que descomentar uma lá não desenhe um item torto aqui. */
const PARCEIROS = CLIENTS.filter((c) => c.logo);

export function SignalMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  /* Quantas vezes a lista se repete DENTRO de uma cópia. Mesma razão do
     `ClientWall`: em tela larga uma cópia pode ser mais estreita que a viewport
     — as duas cópias da trilha não cobrem a tela e sobra um vazio até o loop
     reiniciar. Medimos e repetimos até a cópia encher a viewport. */
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
    /* A 1ª medição acontece antes das logos chegarem: a largura ainda vai
       mudar, e com ela o número de repetições. */
    document.fonts?.ready.then(measure).catch(() => undefined);
    const logos = Array.from(group.querySelectorAll('img'));
    logos.forEach((img) => img.addEventListener('load', measure));

    return () => {
      ro.disconnect();
      logos.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [repeats]);

  /* A logo é o conteúdo do item — não há mais texto ao lado nomeando a marca —,
     então o `alt` carrega o nome. Na cópia `aria-hidden` ele é ignorado, e é
     assim que o leitor de tela ouve a lista uma vez só.

     `<img>` simples: são arquivos estáticos de proporção variada, exibidos em
     altura fixa, e o otimizador não tem o que fazer aqui. */
  const copia = (
    <>
      {Array.from({ length: repeats }, (_, r) =>
        PARCEIROS.map((parceiro) => (
          <span className="lp-partner" key={`${parceiro.name}-${r}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={parceiro.logo} alt={parceiro.name} loading="lazy" decoding="async" />
          </span>
        )),
      )}
    </>
  );

  return (
    /* `aria-label` na região: sem ele a faixa é uma sequência de imagens sem
       contexto — quem ouve não sabe do que é essa lista de nomes. */
    <div className="lp-signals" role="region" aria-label="Parceiros e tecnologias">
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
