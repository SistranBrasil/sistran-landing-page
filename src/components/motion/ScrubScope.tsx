'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * SIS-216 — o irmão BIDIRECIONAL do `RevealScope`.
 *
 * `RevealScope` resolve entrada de uma vez: escreve `data-in` e sai de cena — o
 * bloco acende e fica aceso. É o que `docs/scroll.md` chama de reveal e é o
 * sistema canônico do site; esta primitiva NÃO o substitui. Ela cobre o que o
 * §6 do mesmo documento diz que o reveal por CSS não alcança: animação amarrada
 * à POSIÇÃO da barra, que desfaz o caminho ao rolar para cima.
 *
 * ── O CONTRATO, e por que ele é uma custom property e não uma animação ──────
 * O escopo não anima nada. Ele publica no PRÓPRIO nó:
 *   • `--scrub-p`  — 0..1, progresso do trecho na janela, um valor por quadro;
 *   • `data-scrub` — `'1'` enquanto o trecho está na janela (estado discreto);
 *   • `data-scrub-dir` — `'baixo'`/`'cima'`, o sentido da última rolagem.
 * Quem decide o que isso move é o CSS, como em `ProofJourney`/`PalcoReativo`.
 * Três consequências, e as três são o motivo do desenho:
 *   1. ZERO re-render por quadro. `el.style.setProperty` não passa pelo React.
 *   2. Custom property HERDA, então o alvo do movimento não precisa ser o nó do
 *      gatilho — é o que permite pôr o gatilho na seção e mover só um filho que
 *      não tem dono de movimento, sem violar a regra do §6 («não misture os
 *      dois no mesmo elemento: ou o elemento é reveal por CSS, ou é timeline do
 *      GSAP»). Nesta rota essa regra é quase tudo: quase todo bloco de
 *      `/contato` já tem dono (reveal, `motion/react`, `whileInView`, `gsap.from`
 *      do mapa, o relógio rAF do `PalcoReativo`).
 *   3. MOVIMENTO REDUZIDO SE RESOLVE EM CSS, nos dois canais, sem que este
 *      arquivo tenha de acertar o canal do atributo em JS — quem não consome
 *      `--scrub-p` não se move. O `var(--scrub-p, …)` do consumidor tem de ter
 *      fallback igual ao ESTADO FINAL VISÍVEL, nunca a um estado escondido.
 *
 * ── DESVIO DECLARADO DA REFERÊNCIA ─────────────────────────────────────────
 * O §6 prescreve `useGSAP` do `@gsap/react` para o cleanup de desmontagem («o
 * erro mais comum de quem usa GSAP em SPA»). `@gsap/react` NÃO é dependência
 * deste projeto (só `gsap`), e acrescentá-lo para um wrapper de `useEffect`
 * seria pacote novo para resolver problema já resolvido: o padrão da casa é
 * `useEffect` + `gatilho.kill()` no cleanup, matando SÓ o próprio gatilho —
 * nunca `ScrollTrigger.killAll()`, que levaria embora os gatilhos das outras
 * seções. É o mesmo cleanup que `ProofJourney` usa. O que o `useGSAP` garantia
 * (desmontar sem deixar gatilho órfão) está garantido; o que muda é só de quem é
 * o `return`.
 */
type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Quem mede o percurso. `'proprio'`: a caixa deste nó. `'pai'`: a caixa do
   * elemento pai — para quando o escopo é uma camada `absolute` colada na seção
   * (caixa correta para pintar, altura inútil para medir rolagem).
   */
  gatilho?: 'proprio' | 'pai';
  /** `start` do ScrollTrigger. Padrão: o trecho entrando pela base da janela. */
  de?: string;
  /** `end` do ScrollTrigger. Padrão: o trecho saindo pelo topo. */
  ate?: string;
  /**
   * `scrub` do ScrollTrigger — segundos de inércia. Número, e não `true`: 1:1
   * cru amarra o movimento ao pixel da roda e fica duro; ~0,6s dá peso sem
   * atrasar a leitura de que o gesto é reversível.
   */
  suavidade?: number;
  /** Rótulo só para MEDIÇÃO, como o `data-reveal-nome` do `RevealScope`. */
  nome?: string;
};

export default function ScrubScope({
  children,
  className,
  style,
  gatilho = 'proprio',
  de = 'top bottom',
  ate = 'bottom top',
  suavidade = 0.6,
  nome,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alvo = gatilho === 'pai' ? el.parentElement : el;
    if (!alvo) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: alvo,
      start: de,
      end: ate,
      scrub: suavidade,
      /* `onUpdate` roda em TODA rolagem dentro do percurso, nos dois sentidos —
         é literalmente daqui que vem a bidirecionalidade: o progresso é função
         da posição, então rolar para cima devolve os valores de volta. */
      onUpdate: (self) => {
        el.style.setProperty('--scrub-p', self.progress.toFixed(4));
        el.dataset.scrubDir = self.direction === -1 ? 'cima' : 'baixo';
      },
      onToggle: (self) => {
        /* String vazia em vez de `delete`: mantém o atributo no DOM (a sonda
           consegue distinguir «fora do percurso» de «escopo inexistente»). */
        el.dataset.scrub = self.isActive ? '1' : '';
      },
    });

    /* `refresh()` porque as posições medidas na montagem não são as finais nesta
       rota: o mapa do MapLibre e as fotos entram depois e mudam a altura do
       documento, e fonte que chega atrasada reflui os títulos. É a ressalva
       literal do §6 («chame `ScrollTrigger.refresh()` se as posições saírem
       erradas»). */
    /* SEMEADURA do valor inicial. Sem ela, o escopo ficava no fallback do CSS
       (repouso composto) até a PRIMEIRA rolagem dentro do percurso, e o trecho
       tinha dois estados diferentes para a mesma posição da barra: um antes de
       ter sido visitado, outro na volta. A sonda pegou isso no topo da rota
       (malha em opacidade 1 na primeira leitura e 0,4 na volta, no mesmo
       `scrollY`) — invisível, porque a seção está fora da janela lá, e errado do
       mesmo jeito: o contrato desta primitiva é que o valor seja função da
       POSIÇÃO, e função não tem duas imagens para a mesma entrada. */
    el.style.setProperty('--scrub-p', st.progress.toFixed(4));

    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => {
      /* Só o gatilho DESTE escopo. Nunca `ScrollTrigger.killAll()`. */
      st.kill();
      /* E só as propriedades que este escopo escreveu. */
      el.style.removeProperty('--scrub-p');
    };
  }, [gatilho, de, ate, suavidade]);

  return (
    <div ref={ref} className={className} style={style} data-scrub-nome={nome}>
      {children}
    </div>
  );
}
