"use client";

/**
 * SIS-235 — CARIMBO DE `kind` dos eventos, para os QUATRO kinds.
 *
 * Substitui o chip textual (`.eventos-destaque-chip`) na tag do cartão, em
 * `proprio`, `global`, `nacional` e `parceiro`. O admin e os filtros continuam
 * com o rótulo em texto: a issue troca a TAG DO CARTÃO, não a taxonomia.
 *
 * ── DE ONDE VEIO ESTE ARQUIVO ──
 *
 * É o `CarimboRealizadoSistran.tsx` generalizado, e o arquivo foi RENOMEADO em
 * vez de duplicado: o nome antigo descrevia um dos quatro carimbos, e um
 * componente chamado «RealizadoSistran» desenhando «EVENTO GLOBAL» é uma
 * mentira que o próximo leitor paga. Nada foi perdido na mudança — toda a
 * apuração do arquivo antigo (o tombo em dois lugares, o `alt` em vez de
 * `.sr-only`, o `clearProps`) segue abaixo, porque continua valendo.
 *
 * O único ramo que mudou: antes havia UM `src` fixo e uma condição
 * `kind === "proprio"` em quem chamava; agora o `src` sai do `kind` por regra e
 * quem chama não decide nada.
 *
 * ── DE ONDE VEM A ARTE ──
 *
 * `public/images/EVENTOS/carimbos/carimbo-evento-<kind>.webp`, as quatro geradas
 * por `scripts/gerar-carimbos-kind-sis235.mjs`.
 *
 * ⚠️ A ARTE NÃO É DE DESIGN — é derivada. A issue travava o despacho até as
 * artes chegarem na pasta; a pasta foi conferida vazia duas vezes e o pedido foi
 * reafirmado, então o script deriva quatro peças coerentes com a única arte
 * aprovada que existia (`carimbo-realizado-sistran.webp`), medindo a tinta e o
 * acento dela. Quando as artes reais chegarem, basta sobrescrever os quatro
 * arquivos com os mesmos nomes e a mesma proporção (520x399): este componente e
 * a folha não mudam. O cabeçalho do script tem a apuração das cores.
 *
 * O caminho é MONTADO a partir do `kind` e não lido de um mapa escrito à mão,
 * porque um mapa é uma segunda lista para manter em sincronia com `EVENT_KINDS`
 * — e a que fica velha é sempre a segunda. Kind novo no data ganha carimbo só
 * criando o arquivo com o nome da regra.
 *
 * ── POR QUE O `carimbo.png` / `carimbo-realizado-sistran.webp` SAIU DO CARTÃO ──
 *
 * Pedido explícito da issue («não manter o antigo no card»). Os dois arquivos
 * FICAM no disco: o `.webp` é a referência visual de onde a família foi medida, e
 * o `.png` é a fonte para regerar. O que saiu é a referência a eles AQUI.
 *
 * Fica registrado o que aquele arquivo ensinou, porque vale para a próxima arte
 * entregue: NÃO aponte um componente para o `carimbo.png`. Ele tem 2,4 MB e, mais
 * grave, NÃO TEM CANAL ALFA — o xadrez de transparência está achatado nos pixels,
 * então o PNG cru sobre a placa do cartão desenha um retângulo quadriculado.
 * `scripts/gerar-carimbo-webp.mjs` reconstruía o alfa por chave de croma; a
 * apuração inteira está no cabeçalho dele.
 *
 * ── A INCLINAÇÃO É DAQUI, NÃO DA ARTE ──
 *
 * A issue previu os dois ramos ("leve rotação se a arte não trouxer"), e o que
 * vale é o segundo: as artes são ovais RETOS, medidos. O tombo é de −6°
 * (`TOMBO_DEG`), e ele mora em DOIS lugares porque há dois caminhos, os dois
 * terminando no mesmo ângulo: `rotate: -6deg` no CSS para a instância que não
 * anima, e o estado final do tween para a que anima.
 *
 * ⚠️ ESTA DUPLICAÇÃO É NECESSÁRIA, e a primeira versão deste arquivo apostou o
 * contrário — que `rotate` (propriedade separada) COMPÕE com o `transform` do
 * GSAP, então bastaria o CSS. Compõe pela especificação, mas o GSAP não deixa
 * chegar lá: o CSSPlugin escreve, junto do transform, `translate: none; rotate:
 * none; scale: none;` no atributo `style`, justamente para não disputar com as
 * propriedades individuais. Medido no palco em 1440:
 *
 *     style="transform: translate(0px, 0px); translate: none; rotate: none;
 *            scale: none; opacity: 1;"   ·  rotate computado: none
 *
 * O sintoma numérico foi a caixa: 132,5x101,6 no palco (oval RETO) contra
 * 142,4x114,9 com movimento reduzido, onde o GSAP não escreve nada — a diferença
 * é exatamente o retângulo envolvente de um oval tombado 6°. O carimbo do palco
 * assentava reto, e é o palco que a issue mostra em 1440.
 *
 * ── O SENTIDO VAI NO `alt` ──
 *
 * E não num `.sr-only` irmão, embora a issue permita os dois. O motivo é que
 * `.sr-only` depende de a folha global ter carregado para esconder o texto; se
 * ela falhar, aparece «Evento nacional» solto ao lado do carimbo, dizendo a mesma
 * coisa duas vezes. O `alt` não tem esse modo de falha, e é o mesmo lugar onde o
 * `next/image` já obriga a escrever algo.
 *
 * O texto sai de `EVENT_KIND_META[kind].label`, não de uma string escrita aqui:
 * as quatro labels são rastreadas pelo portão de cópia da Regra Zero
 * (`npm run test:copy`), e uma segunda cópia no JSX é como as duas divergem.
 * É também por isso que a PALAVRA DESENHADA na arte pode divergir do rótulo
 * («EVENTO / NACIONAL» na arte, «Evento nacional» no `alt`): a arte é desenho, o
 * `alt` é o conteúdo travado.
 *
 * ── A ANIMAÇÃO É OPCIONAL E DE ENTRADA ──
 *
 * `animar` é `false` por padrão porque o carrossel estreito monta os quinze
 * cartões de uma vez: animar todos seria trabalho invisível (a maioria está fora
 * de quadro) e quinze linhas do tempo por render. No palco, onde existe UM cartão
 * que remonta ao trocar de evento, `animar` liga o carimbo batendo.
 *
 * ⚠️ Com os quatro kinds virando carimbo, `animar` passou a valer para TODOS os
 * eventos do palco, não só os três `proprio` — antes era uma linha do tempo em 3
 * de 15 trocas, agora é em 15 de 15. Segue sendo uma linha por troca de destaque,
 * disparada por montagem, então a conta não mudou de ordem.
 *
 * GSAP aqui não viola a regra da rota — «nada aqui é pinado com ScrollTrigger»
 * (`EventsSpotlight.tsx`) proíbe PINAGEM POR ROLAGEM, e isto é uma entrada
 * disparada por montagem, sem `ScrollTrigger` nenhum. Com movimento reduzido a
 * batida não acontece e o carimbo nasce no estado final — não em `opacity: 0`,
 * que é como uma animação morta esconde conteúdo para sempre.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { EVENT_KIND_META, type EventKind } from "@/data/events";
import { prefersReducedMotion } from "@/lib/motion";
import "./carimbo-kind-evento.css";

/* Dimensões INTRÍNSECAS dos arquivos, conferidas na saída do script (520x399, as
   quatro iguais — é o mesmo desenho com a palavra trocada). Elas não são o
   tamanho de exibição — quem manda nisso é o CSS —, servem ao `next/image` para
   reservar a caixa e não causar salto de layout. */
const ARTE_W = 520;
const ARTE_H = 399;

/* Tombo de repouso, em graus. Espelha `rotate: -6deg` na folha do componente —
   ver "A INCLINAÇÃO É DAQUI" para por que o número existe nos dois lugares. Se um
   mudar, o outro tem de mudar: são os dois caminhos para o MESMO estado final. */
const TOMBO_DEG = -6;
/* Quanto o carimbo chega torto ALÉM do repouso, antes de assentar. */
const TOMBO_EXTRA_DEG = -13;

type Props = {
  /** Qual dos quatro carimbos. Decide a arte e o `alt`. */
  kind: EventKind;
  /** Liga a batida de entrada. Ver "A ANIMAÇÃO É OPCIONAL E DE ENTRADA", acima. */
  animar?: boolean;
  /** `--carimbo-w` desta instância, quando o lugar pede um tamanho próprio. */
  className?: string;
};

export default function CarimboKindEvento({ kind, animar = false, className }: Props) {
  const raiz = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const no = raiz.current;
    if (!no || !animar) return;
    /* Movimento reduzido: nada de `gsap.from`, porque `from` PARTE do estado
       inicial — se a linha do tempo fosse morta por um reset global, o carimbo
       ficaria preso em `opacity: 0`. Aqui simplesmente não há animação e o CSS já
       é o estado final. */
    if (prefersReducedMotion()) return;

    /* A batida: chega grande e mais torto, e assenta NO TOMBO DE REPOUSO — não em
       zero. Terminar em `rotation: 0` era o defeito medido: como o GSAP anula o
       `rotate` do CSS, o carimbo do palco assentava reto.
       `back.out` dá o repique curto de borracha batendo no papel; `power3.out`
       sozinho assentaria macio demais para leitura de carimbo. */
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
    /* `kind` entra nas dependências: no palco o cartão troca de evento, e a
       batida tem de acontecer de novo quando o carimbo muda de arte. Sem isto, um
       evento `global` sucedendo um `nacional` trocaria a imagem sem bater. */
  }, [animar, kind]);

  return (
    <span ref={raiz} className={["eventos-carimbo", className].filter(Boolean).join(" ")}>
      <Image
        src={`/images/EVENTOS/carimbos/carimbo-evento-${kind}.webp`}
        alt={EVENT_KIND_META[kind].label}
        width={ARTE_W}
        height={ARTE_H}
        /* `loading="lazy"`: a tag nunca é o LCP do cartão — a foto do evento é.
           `next.config` está com `images: { unoptimized: true }` (SIS-154), então o
           que baixa é este arquivo do disco, e é por isso que ele já sai do script
           em tamanho de uso. */
        loading="lazy"
      />
    </span>
  );
}
