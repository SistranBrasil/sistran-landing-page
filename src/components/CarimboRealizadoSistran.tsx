"use client";

/**
 * SIS-235 — CARIMBO «Realizado pela Sistran».
 *
 * Substitui o chip textual (`.eventos-destaque-chip`) nos eventos `kind: "proprio"`.
 * Só neles: `global`, `nacional` e `parceiro` continuam com o chip, e o admin e os
 * filtros continuam com o rótulo em texto — a issue troca a TAG DO CARTÃO, não a
 * taxonomia.
 *
 * ── DE ONDE VEM A ARTE ──
 *
 * `public/images/carimbo-realizado-sistran.webp`, gerado por
 * `scripts/gerar-carimbo-webp.mjs` a partir do `carimbo.png` entregue. NÃO aponte
 * este componente para o PNG: ele tem 2,4 MB e, mais grave, NÃO TEM CANAL ALFA —
 * o xadrez de transparência está achatado nos pixels, então o PNG cru sobre a placa
 * do cartão desenha um retângulo quadriculado. O script reconstrói o alfa por chave
 * de croma; a apuração inteira, inclusive o caminho que foi tentado e reprovado,
 * está no cabeçalho dele.
 *
 * ── A INCLINAÇÃO É DAQUI, NÃO DA ARTE ──
 *
 * A issue previu os dois ramos ("leve rotação se a arte não trouxer"), e o que vale
 * é o segundo: a arte é um oval RETO, medido. O tombo é de −6° (`TOMBO_DEG`), e ele
 * mora em DOIS lugares porque há dois caminhos, os dois terminando no mesmo ângulo:
 * `rotate: -6deg` no CSS para a instância que não anima, e o estado final do tween
 * para a que anima.
 *
 * ⚠️ ESTA DUPLICAÇÃO É NECESSÁRIA, e a primeira versão deste arquivo apostou o
 * contrário — que `rotate` (propriedade separada) COMPÕE com o `transform` do GSAP,
 * então bastaria o CSS. Compõe pela especificação, mas o GSAP não deixa chegar lá:
 * o CSSPlugin escreve, junto do transform, `translate: none; rotate: none; scale:
 * none;` no atributo `style`, justamente para não disputar com as propriedades
 * individuais. Medido no palco em 1440:
 *
 *     style="transform: translate(0px, 0px); translate: none; rotate: none;
 *            scale: none; opacity: 1;"   ·  rotate computado: none
 *
 * O sintoma numérico foi a caixa: 132,5x101,6 no palco (oval RETO) contra
 * 142,4x114,9 com movimento reduzido, onde o GSAP não escreve nada — a diferença é
 * exatamente o retângulo envolvente de um oval tombado 6°. O carimbo do palco
 * assentava reto, e é o palco que a issue mostra em 1440.
 *
 * ── O SENTIDO VAI NO `alt` ──
 *
 * E não num `.sr-only` irmão, embora a issue permita os dois. O motivo é que
 * `.sr-only` depende de a folha global ter carregado para esconder o texto; se ela
 * falhar, aparece «Realizado pela Sistran» solto ao lado do carimbo, dizendo a mesma
 * coisa duas vezes. O `alt` não tem esse modo de falha, e é o mesmo lugar onde o
 * `next/image` já obriga a escrever algo.
 *
 * O texto sai de `EVENT_KIND_META.proprio.label`, não de uma string escrita aqui: as
 * quatro labels são rastreadas pelo portão de cópia da Regra Zero
 * (`npm run test:copy`), e uma segunda cópia no JSX é como as duas divergem.
 *
 * ── A ANIMAÇÃO É OPCIONAL E DE ENTRADA ──
 *
 * `animar` é `false` por padrão porque o carrossel estreito monta os quinze cartões
 * de uma vez: animar todos seria trabalho invisível (a maioria está fora de quadro) e
 * quinze linhas do tempo por render. No palco, onde existe UM cartão que remonta ao
 * trocar de evento, `animar` liga o carimbo batendo.
 *
 * GSAP aqui não viola a regra da rota — «nada aqui é pinado com ScrollTrigger»
 * (`EventsSpotlight.tsx`) proíbe PINAGEM POR ROLAGEM, e isto é uma entrada disparada
 * por montagem, sem `ScrollTrigger` nenhum. Com movimento reduzido a batida não
 * acontece e o carimbo nasce no estado final — não em `opacity: 0`, que é como uma
 * animação morta esconde conteúdo para sempre.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { EVENT_KIND_META } from "@/data/events";
import { prefersReducedMotion } from "@/lib/motion";
import "./carimbo-realizado-sistran.css";

/* Dimensões INTRÍNSECAS do arquivo, conferidas na saída do script (520x399). Elas
   não são o tamanho de exibição — quem manda nisso é o CSS —, servem ao
   `next/image` para reservar a caixa e não causar salto de layout. */
const ARTE_W = 520;
const ARTE_H = 399;

/* Tombo de repouso, em graus. Espelha `rotate: -6deg` na folha do componente — ver
   "A INCLINAÇÃO É DAQUI" para por que o número existe nos dois lugares. Se um mudar,
   o outro tem de mudar: são os dois caminhos para o MESMO estado final. */
const TOMBO_DEG = -6;
/* Quanto o carimbo chega torto ALÉM do repouso, antes de assentar. */
const TOMBO_EXTRA_DEG = -13;

type Props = {
  /** Liga a batida de entrada. Ver "A ANIMAÇÃO É OPCIONAL E DE ENTRADA", acima. */
  animar?: boolean;
  /** `--carimbo-w` desta instância, quando o lugar pede um tamanho próprio. */
  className?: string;
};

export default function CarimboRealizadoSistran({ animar = false, className }: Props) {
  const raiz = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const no = raiz.current;
    if (!no || !animar) return;
    /* Movimento reduzido: nada de `gsap.from`, porque `from` PARTE do estado inicial
       — se a linha do tempo fosse morta por um reset global, o carimbo ficaria preso
       em `opacity: 0`. Aqui simplesmente não há animação e o CSS já é o estado final. */
    if (prefersReducedMotion()) return;

    /* A batida: chega grande e mais torto, e assenta NO TOMBO DE REPOUSO — não em
       zero. Terminar em `rotation: 0` era o defeito medido: como o GSAP anula o
       `rotate` do CSS, o carimbo do palco assentava reto.
       `back.out` dá o repique curto de borracha batendo no papel; `power3.out` sozinho
       assentaria macio demais para leitura de carimbo. */
    const tl = gsap.fromTo(
      no,
      { scale: 1.9, rotation: TOMBO_DEG + TOMBO_EXTRA_DEG, opacity: 0 },
      { scale: 1, rotation: TOMBO_DEG, opacity: 1, duration: 0.42, ease: "back.out(1.7)" },
    );
    return () => {
      tl.kill();
      /* Limpa o `transform` inline que o GSAP deixou: sem isto, o repouso do CSS
         passa a competir com uma matriz congelada no elemento.

         `"all"` e não `"transform,opacity"`, e o motivo é o PORTÃO DE CÓPIA: o
         extrator da Regra Zero colhe literais de objeto e `transform,opacity`
         entrava no lock como se fosse escrita do site (`npm run test:copy`
         reprovando com «Textos novos (1): + transform,opacity»). Travar nome de
         prop do GSAP no lock de conteúdo gasta o diff que protege os textos de
         verdade; `all` cai na regra de token técnico e fica de fora.
         A limpeza é equivalente: este `<span>` não tem estilo inline nenhum além
         do que a linha do tempo acima escreveu. */
      gsap.set(no, { clearProps: "all" });
    };
  }, [animar]);

  return (
    <span ref={raiz} className={["eventos-carimbo", className].filter(Boolean).join(" ")}>
      <Image
        src="/images/carimbo-realizado-sistran.webp"
        alt={EVENT_KIND_META.proprio.label}
        width={ARTE_W}
        height={ARTE_H}
        /* `loading="lazy"`: o carimbo aparece em 3 dos 15 eventos e nunca é o LCP.
           `next.config` está com `images: { unoptimized: true }` (SIS-154), então o
           que baixa é este arquivo do disco — e é por isso que ele já sai do script
           em tamanho de uso, não em 1374px. */
        loading="lazy"
      />
    </span>
  );
}
