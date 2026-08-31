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
import { prefersReducedMotion } from '@/lib/motion';

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
  const regiaoRef = useRef<HTMLDivElement>(null);

  /**
   * Chegada da faixa: a linha-base se desenha e as marcas sobem dela uma vez, na
   * entrada. Um `IntersectionObserver` só, desconectado depois do primeiro
   * disparo — não é um efeito que reaja à rolagem, é uma chegada.
   *
   * `data-chegou` em vez de estado React porque o CSS é o único interessado, e
   * porque um re-render aqui remontaria a trilha do marquee no meio do loop.
   *
   * O atributo vale `"0"` (estado de entrada) e depois some. Escrito ASSIM, e não
   * ao contrário: o CSS tem o estado final como default e é o JavaScript que pede
   * o estado de entrada. Sem JS, com movimento reduzido ou se o observador nunca
   * disparar, a faixa está inteira na tela — nunca presa em `opacity: 0`.
   *
   * Por que a subida é do GRUPO e não de cada marca, em cascata: os itens da
   * faixa existem em duas cópias e se repetem `repeats` vezes dentro de cada uma,
   * e a trilha já está em translação contínua. Um `animation-delay` por item
   * escalonaria também as duplicatas — a mesma marca subiria duas vezes, em
   * momentos diferentes, enquanto atravessa a tela. A sequência que a
   * especificação pede é o que a própria translação do loop já produz: as marcas
   * entram uma depois da outra pela borda.
   */
  useEffect(() => {
    const regiao = regiaoRef.current;
    if (!regiao) return;

    if (prefersReducedMotion()) return;

    /* Pede o estado de entrada. Num quadro seguinte, para o navegador ter o
       estado final registrado antes — sem isso a transição não teria de onde
       partir e a faixa apareceria de uma vez. */
    regiao.dataset.chegou = '0';

    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          delete regiao.dataset.chegou;
          io.disconnect();
        }
      },
      /* 25% da faixa: a linha-base tem de começar a se desenhar quando ela ainda
         está entrando, para o traço parecer vindo da seção de cima. */
      { threshold: 0.25 },
    );
    io.observe(regiao);
    return () => {
      io.disconnect();
      /* Se a seção desmontar antes de a faixa chegar, o que fica é o estado
         final — não o de entrada congelado. */
      delete regiao.dataset.chegou;
    };
  }, []);

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
    <div
      ref={regiaoRef}
      className="lp-signals"
      role="region"
      aria-label="Parceiros e tecnologias"
    >
      {/* Linha-base da passagem Números → Parceiros (orquestração visual,
          Prioridade 1). A curva de "Sistran em números" perde amplitude e vira
          uma reta horizontal no fim daquele percurso (`--impact-aterrar`); esta
          é a continuação dela — o mesmo traço, agora carregando as marcas.

          Ela se desenha da esquerda para a direita quando a faixa entra na tela,
          e as marcas sobem dela. Decorativa: `aria-hidden`, e a faixa funciona
          exatamente igual sem ela. */}
      <span aria-hidden className="lp-signals-base" />
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
