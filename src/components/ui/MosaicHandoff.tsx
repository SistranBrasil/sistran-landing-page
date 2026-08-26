'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Travessia do tile "Arquitetura modular e escalável" até a foto do card 01 de
 * "Soluções de Negócios".
 *
 * O tile sai do mosaico, desce com o scroll e pousa exatamente sobre a janela da
 * foto — que é a MESMA imagem (`escritoriosp.jpg`, ver o comentário em
 * `src/data/legacy.ts`). É isso que torna a emenda invisível: no fim do percurso
 * o viajante e a foto real mostram o mesmo conteúdo na mesma caixa, então basta
 * apagar o viajante para a foto assumir. Nenhuma opacidade da seção precisa ser
 * mexida.
 *
 * Por que um elemento `position: fixed` e não um clone dentro do mosaico: origem
 * e destino vivem em componentes irmãos (`StackScenes` e `Solutions`), com fundo
 * próprio e contexto de empilhamento próprio. Um absoluto nascido no mosaico
 * passaria por baixo do fundo de Soluções assim que cruzasse a emenda.
 *
 * O relógio é a própria seção de destino, e por um motivo mecânico: a foto está
 * dentro de um `position: sticky`. Enquanto `#solucoes` não encosta no topo da
 * janela, a foto desce junto com a página; quando encosta, ela trava. Logo o topo
 * final da foto é `retânguloAtual.top - secao.top`, medido, sem estimativa — e o
 * progresso é o quanto falta de `secao.top` para zero. No instante em que o
 * sticky engata, o viajante já está sobre a caixa definitiva.
 *
 * Decoração: `aria-hidden`, `pointer-events: none`, e nada de conteúdo depende
 * dela. Sem largura de desktop ou com movimento reduzido o efeito não existe — o
 * tile fica parado no mosaico e a foto aparece no palco, como antes.
 */

/** Mesma foto do tile e do card 01. Trocar aqui exige trocar nos dois lugares. */
const IMAGEM = '/images/home/escritoriosp.jpg';
const ROTULO = 'Arquitetura modular e escalável';

/* Antecipação do percurso, em telas: a viagem começa quando `#solucoes` ainda
   está 1,25 tela abaixo do topo. Mais curto que isso e o tile parece pular a
   emenda; mais longo e ele já sai do mosaico antes de o mosaico ter sido lido. */
const ANTECIPACAO = 1.25;

/** Suaviza o percurso sem soltar do scroll: p continua monotônico com a rolagem. */
const suavizar = (p: number) => 1 - Math.pow(1 - p, 3);
const entre = (de: number, para: number, e: number) => de + (para - de) * e;

export default function MosaicHandoff() {
  const rm = useReducedMotion();
  const caixaRef = useRef<HTMLDivElement>(null);
  const rotuloRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (rm) return;

    const caixa = caixaRef.current;
    const rotulo = rotuloRef.current;
    if (!caixa) return;

    let quadro = 0;
    /* Última opacidade escrita na origem. Guardada para escrever no DOM só
       quando o valor muda de fato, em vez de a cada quadro. */
    let fonteAnterior = -1;

    const esconderOrigem = (valor: number) => {
      if (valor === fonteAnterior) return;
      fonteAnterior = valor;
      document.documentElement.style.setProperty('--carrier-fonte', String(valor));
    };

    const desligar = () => {
      caixa.style.opacity = '0';
      caixa.style.visibility = 'hidden';
      esconderOrigem(1);
    };

    const medir = () => {
      quadro = 0;

      const secao = document.getElementById('solucoes');
      const alvo = document.querySelector<HTMLElement>('[data-carrier-alvo]');
      const origem = document.querySelector<HTMLElement>('[data-carrier-origem]');
      /* Mesmo limiar do palco dirigido em `Solutions` (1024px): fora dele a foto
         não tem caixa fixa para receber o pouso. */
      const largo = window.matchMedia('(min-width: 1024px)').matches;
      if (!secao || !alvo || !origem || !largo || origem.offsetWidth === 0) {
        desligar();
        return;
      }

      const janela = window.innerHeight * ANTECIPACAO;
      const topoSecao = secao.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (janela - topoSecao) / janela));

      // Fora do percurso o viajante não existe: o tile fica no mosaico (p = 0) ou
      // a foto real já está no lugar (p = 1).
      if (p <= 0.001 || p >= 0.999) {
        desligar();
        return;
      }

      const o = origem.getBoundingClientRect();
      const a = alvo.getBoundingClientRect();
      if (o.width === 0 || a.width === 0) {
        desligar();
        return;
      }

      /* Quanto a foto ainda vai subir antes de o sticky travar. Depois de travado
         `topoSecao` é negativo e o deslocamento é zero — o alvo já está no lugar
         definitivo. */
      const resto = Math.max(topoSecao, 0);
      const e = suavizar(p);

      const left = entre(o.left, a.left, e);
      const top = entre(o.top, a.top - resto, e);
      const width = entre(o.width, a.width, e);
      const height = entre(o.height, a.height, e);

      caixa.style.visibility = 'visible';
      caixa.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
      caixa.style.width = `${width.toFixed(1)}px`;
      caixa.style.height = `${height.toFixed(1)}px`;
      /* Raio do tile (18px) até o raio da janela da foto (24px). */
      caixa.style.borderRadius = `${entre(18, 24, e).toFixed(1)}px`;
      /* Aparece nos primeiros 4% e se apaga nos últimos 6%, quando a foto real
         já está debaixo dele mostrando a mesma imagem. */
      caixa.style.opacity =
        p < 0.04 ? (p / 0.04).toFixed(3) : p > 0.94 ? ((1 - p) / 0.06).toFixed(3) : '1';

      // O rótulo sai cedo: a caixa muda de proporção e o texto ficaria à deriva.
      if (rotulo) rotulo.style.opacity = Math.max(0, 1 - p / 0.22).toFixed(3);

      // A origem só desaparece depois que o viajante está por cima dela.
      esconderOrigem(p > 0.05 ? 0 : 1);
    };

    /* Um `requestAnimationFrame` por rajada de scroll, nunca uma medição por
       pixel — e nada de `setInterval`. O estado do efeito vive no DOM (estilo do
       viajante), então não há re-render envolvido. */
    const agendar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    document.fonts?.ready.then(agendar).catch(() => {});

    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      desligar();
    };
  }, [rm]);

  return (
    <div ref={caixaRef} aria-hidden className="mosaic-handoff">
      <Image
        className="mosaic-handoff-img"
        src={IMAGEM}
        alt=""
        fill
        sizes="(max-width: 1023px) 45vw, 68vw"
      />
      <span ref={rotuloRef} className="mosaic-handoff-rotulo">
        {ROTULO}
      </span>
    </div>
  );
}
