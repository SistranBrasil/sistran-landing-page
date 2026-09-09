'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * SIS-130 — o palco que era exclusivo da seção `#SomosSistraners` extraído para
 * cá, porque a seção de fechamento de `/contato` passou a querer o mesmo
 * tratamento. Extraído, e não copiado: duas cópias divergiriam na primeira
 * correção, e a mecânica aqui (dois rAF, separação de propriedades da SIS-42,
 * comportamento em movimento reduzido) é exatamente o tipo de coisa que só
 * continua certa num lugar só.
 *
 * O que era `.social-*` no `globals.css` virou `.palco-*` na mesma passada: os
 * nomes descreviam a seção do LinkedIn, não o efeito. Nada de aliases — a folha
 * e os três consumidores (`Social`, `#time-sistran`, e as duas variantes de
 * emenda) foram renomeados juntos.
 *
 * A palavra da marca d'água é parâmetro (`marca`): `#SomosSistraners` na Social,
 * `#timeSISTRAN` no fechamento de `/contato`.
 */

/**
 * Posição do ponteiro publicada na seção como duas custom properties
 * (`--sx`/`--sy`, ambas 0..1), que o CSS consome nas camadas de luz e nos orbs.
 *
 * Escreve no DOM por `ref`, e não por `setState`: um `setState` por
 * `pointermove` re-renderizaria a seção inteira dezenas de vezes por segundo. O
 * evento só guarda o número; quem escreve é um único `requestAnimationFrame`
 * coalescido, então no máximo uma escrita por quadro.
 *
 * O gesto só existe onde há cursor de verdade e movimento é bem-vindo — em toque
 * e em movimento reduzido o listener nem é registrado, e as variáveis ficam no
 * default de repouso (0.5, 0.5) declarado no CSS.
 */
export function usePonteiroNaSecao(alvo: React.RefObject<HTMLElement | null>, ativo: boolean) {
  useEffect(() => {
    const el = alvo.current;
    if (!el || !ativo) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let x = 0.5;
    let y = 0.5;
    let quadro = 0;

    const escrever = () => {
      quadro = 0;
      el.style.setProperty('--sx', x.toFixed(4));
      el.style.setProperty('--sy', y.toFixed(4));
    };
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width;
      y = (e.clientY - r.top) / r.height;
      if (!quadro) quadro = requestAnimationFrame(escrever);
    };
    /* Ao sair, volta ao repouso pelo centro — sem isso a luz ficaria parada na
       borda onde o cursor abandonou a seção. */
    const sair = () => {
      x = 0.5;
      y = 0.5;
      if (!quadro) quadro = requestAnimationFrame(escrever);
    };

    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', sair);
    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', sair);
    };
  }, [alvo, ativo]);
}

/**
 * SIS-58 — progresso da seção publicado como `--sp` (0..1), do momento em que o
 * topo dela entra pela base da janela até o momento em que a base dela sai pelo
 * topo. Quem consome é a marca d'água, que desliza na horizontal numa velocidade
 * diferente da do bloco de texto.
 *
 * Mesmo desenho do `usePonteiroNaSecao` acima e do `MosaicHandoff`: um
 * `requestAnimationFrame` por rajada de scroll, escrita por `ref` no DOM, zero
 * re-render por quadro. Não é um ScrollTrigger novo — a seção não tem nenhum, e
 * uma leitura de `getBoundingClientRect` por quadro resolve.
 *
 * O valor é escrito em `transform` no CSS, e NÃO em `translate`: a propriedade
 * `translate` da marca d'água já carrega o gesto do ponteiro, que é
 * transicionado. Valor por quadro e `transition` na mesma propriedade é
 * exatamente a colisão do SIS-42.
 */
export function useProgressoNaSecao(alvo: React.RefObject<HTMLElement | null>, ativo: boolean) {
  useEffect(() => {
    const el = alvo.current;
    if (!el || !ativo) return;

    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const r = el.getBoundingClientRect();
      const curso = window.innerHeight + r.height;
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / curso));
      el.style.setProperty('--sp', p.toFixed(4));
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      el.style.removeProperty('--sp');
    };
  }, [alvo, ativo]);
}

type Props = {
  /** Palavra da marca d'água gigante ao fundo. */
  marca: string;
  id?: string;
  /** Nome acessível da seção, quando o título dela vive dentro do `children`. */
  ariaLabelledby?: string;
  /**
   * Emendas de borda e outras variantes de cena. Fica no consumidor porque o que
   * está ACIMA da seção muda de página para página — ver `.palco-emenda-de-claro`
   * e `.palco-de-cena-escura` no `globals.css` (SIS-107).
   */
  className?: string;
  children: React.ReactNode;
};

export default function PalcoReativo({ marca, id, ariaLabelledby, className, children }: Props) {
  const rm = useReducedMotion();
  const palcoRef = useRef<HTMLElement>(null);
  usePonteiroNaSecao(palcoRef, !rm);
  useProgressoNaSecao(palcoRef, !rm);

  return (
    <section
      ref={palcoRef}
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`palco-reativo relative overflow-hidden py-24 md:py-32${
        className ? ` ${className}` : ''
      }`}
    >
      {/* Camadas de luz que seguem o ponteiro. Duas, com amplitudes e tempos
          diferentes, para o fundo ganhar profundidade em vez de deslizar em
          bloco. Só `translate` — a posição do gradiente não é animada, o que
          seria repinte a cada quadro. */}
      <div aria-hidden className="palco-luz palco-luz-a" />
      <div aria-hidden className="palco-luz palco-luz-b" />

      {/* Marca d'água. `rgba(255,255,255,0.05)` com contorno ciano a 0.08 —
          calibrada para NÃO competir com o texto que passa por cima dela.

          SIS-180 — o contorno caiu de 0.20 para 0.08, e o número saiu de conta,
          não de gosto. Com o véu removido, o pior pixel sob as linhas passou a
          ser o do CONTORNO dela, não o do fundo: ciano a 0.20 sobre o azul da
          base dá rgb(17,135,200) e 4,43:1 contra branco — reprova em AA por um
          fio, num traço de 1px que cruza as letras. A 0.08 dá rgb(18,123,193) e
          4,55:1. O preenchimento branco a 0.05 FICA: sozinho ele dá 4,60:1, já
          passa, e é ele que carrega a presença da palavra.
          A calibração original era contra o véu escuro que existia por cima do
          fundo; sem o véu, ela precisava ser refeita — é o efeito colateral que
          a issue previa ao mandar reconferir a marca d'água. */}
      <span
        aria-hidden
        className="palco-fantasma pointer-events-none absolute inset-x-0 top-1/2 select-none text-center font-display uppercase leading-none"
        style={{
          fontSize: 'clamp(4rem, 18vw, 18rem)',
          letterSpacing: '-0.05em',
          color: 'rgba(255,255,255,0.05)',
          WebkitTextStroke: '1px rgba(14,216,246,0.08)',
          animation: rm ? undefined : 'gradient-shift 20s ease-in-out infinite',
        }}
      >
        {marca}
      </span>

      {/* Orbs ambientes, reagindo ao ponteiro em sentidos opostos
          (`.palco-orb-a` / `.palco-orb-b`), o que separa os planos.

          SIS-180 — o orb ciano ATRAVESSOU a seção, de `-left-24` para
          `-right-24`. Ele era a quarta camada que clareava o azul sob o texto:
          `rgba(14,216,246,0.45)` com `blur(80px)` a `opacity-40` dá ~0,18 de
          ciano efetivo, e a 480px ancorado em `-left-24 top-0` ele cobria
          exatamente onde ficam o eyebrow e o título. Agora os dois orbs vivem do
          lado direito, junto do cartão, e a metade esquerda — a do texto — ficou
          com a base uniforme.
          O tamanho cai abaixo de `lg`, e isso NÃO é enfeite: com 480px fixos e
          âncora em -96px, numa janela de 390 o orb vai de x≈6 a x≈486, isto é,
          cobre a largura inteira, e a arrumação de mobile empilha o texto em
          largura cheia. Mover não resolve nada num viewport mais estreito que o
          próprio orb — a 390 foi onde o contraste era pior antes
          (`rgb(79,155,192)`). Encolher e baixar o alpha só onde a geometria não
          cabe é o que faz o confinamento valer nas duas arrumações. */}
      <div
        aria-hidden
        className="orb orb-cyan orb-drift-slow palco-orb palco-orb-a pointer-events-none absolute -right-24 top-0 h-[260px] w-[260px] opacity-25 lg:h-[480px] lg:w-[480px] lg:opacity-40"
      />
      <div
        aria-hidden
        className="orb orb-blue orb-drift palco-orb palco-orb-b pointer-events-none absolute -right-24 bottom-0 h-[240px] w-[240px] opacity-20 lg:h-[420px] lg:w-[420px] lg:opacity-30"
      />

      {children}
    </section>
  );
}
