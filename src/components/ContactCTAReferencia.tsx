'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { prefersReducedMotion } from '@/lib/motion';
import RevealScope from '@/components/motion/RevealScope';

/**
 * SIS-253 — o «Fale com a Gente!» de `/esg` no desenho de
 * `public/imagensexemplo/falecomagente.png`.
 *
 * POR QUE É UM ARQUIVO NOVO, e não um `if` dentro de `ContactCTA.tsx`: o bloco de
 * lá é montado por OITO telas (a contagem está no alto daquele arquivo) e o item 1
 * da issue pede que nenhuma delas mude. Um segundo desenho no meio da mesma
 * árvore obrigaria cada `className` e cada `style` do cartão navy a passar por um
 * ternário — é onde a regressão nas outras sete entraria. Aqui a única porta é a
 * prop `layoutReferencia`, que nasce desligada: com ela desligada este módulo não
 * chega a ser renderizado.
 *
 * A ESCRITA É A MESMA (copy-lock): título, parágrafo e rótulo do botão chegam por
 * prop, com os mesmos padrões do componente de origem. Este arquivo não escreve
 * texto novo — o único texto literal é «Fale com a SISTRAN», copiado verbatim do
 * botão de lá.
 *
 * O MOVIMENTO. A issue pede três coisas, e cada uma mora onde consegue ser
 * desligada pelas DUAS vias de movimento reduzido:
 *   1. o ponto aceso percorre o fio ao entrar em quadro → GSAP
 *      (MotionPathPlugin + ScrollTrigger), no `useEffect` abaixo;
 *   2. o botão avança alguns pixels no hover → `transform` em CSS;
 *   3. o círculo ciano gira no mesmo hover → `transform` no `::before` dele.
 * Hover é estado do ponteiro: em CSS ele se desliga com as duas regras espelhadas
 * (`@media (prefers-reduced-motion: reduce)` e `html[data-motion='reduce']`), que
 * é o que o `globals.css` faz no bloco `.cta-ref-*`. Já o percurso do ponto é JS,
 * e aí a regra da skill local vale ao pé da letra: o JS NÃO decide o que existe.
 * O `<circle>` do ponto é servido pelo HTML já POUSADO NO FIM DO FIO (`cx`/`cy` do
 * último vértice do caminho), que é o estado estático que a issue aceita
 * («ponto no fim»); o efeito só entra na frente disso quando há movimento
 * permitido, e desfaz tudo com `ctx.revert()`.
 */

/* A geometria do fio vive num lugar só: o `<path>` é a fonte da verdade tanto do
   traço desenhado quanto do percurso do ponto (o GSAP recebe o próprio elemento,
   não uma cópia da string).

   A CONTA DO `viewBox`, porque ela é o que faz o ponto POUSAR no círculo ciano do
   botão em qualquer largura. O invólucro `.cta-ref-fio` é ancorado por `bottom` e
   `right` exatamente no centro do círculo do botão, e o SVG escala uniforme
   (`width: 100%; height: auto`). Logo o canto inferior direito do `viewBox` cai
   sempre sobre aquele centro — e é ali que o caminho termina (1000, 150). O que
   varia com a largura é a ALTURA do invólucro (0,150 × largura), isto é, o quanto
   o trecho horizontal fica acima do botão; o pouso não varia.
   150/1000 nasceu de ~44°: o trecho diagonal tem 145 de avanço para 141 de queda.
   A RAZÃO FOI DE 228 PARA 150 depois de comparar com o PNG. Com 228 o botão ficava
   no rodapé do cartão e a diagonal atravessava meia altura dele; na referência o
   botão está na MEIA-ALTURA e a diagonal é curta. Como o invólucro é ancorado na
   linha de centro do botão, a altura disponível passou a ser metade do cartão
   (160px a 1440) — e 0,228 × 702 dava exatamente 160, isto é, o trecho horizontal
   encostaria na borda de cima. Com 0,150 ele sobra ~105px e o fio corre a ~17% da
   altura do cartão, que é onde ele corre no PNG. */
/* 5ª VOLTA — A RAZÃO CAIU DE 0,150 PARA 0,105 («coloque essa linha mais para
   baixo»). É esta razão, e não uma coordenada, que decide a altura do trecho
   horizontal: o invólucro é ancorado no CENTRO do círculo do botão e cresce para
   cima 0,105 × largura, então diminuir a razão aproxima o fio do botão, isto é,
   DESCE a linha. Medido a 1440: o trecho horizontal saiu de ~32px do topo do
   painel para ~65px; a 1024 vai a ~101px e a 1920 a ~61px. O pouso NÃO se move —
   ele é o canto inferior direito do `viewBox`, que continua caindo sobre o centro
   do círculo em qualquer largura (é a propriedade inteira desta conta, e é ela que
   deixa a linha descer sem tocar em `dx`/`dy`).

   O `H` ANDOU JUNTO, de 855 para 904, e não é ajuste solto: o trecho diagonal tem
   de conservar os ~45° do PNG. Com a queda passando de 141 para 96, manter o
   avanço em 145 deixaria a diagonal a ~33° — quase deitada. 1000 − 904 = 96 de
   avanço para 96 de queda mantém 45° exatos, e como o SVG escala uniforme o ângulo
   na tela é o do `viewBox`. */
const FIO_ALTURA = 105;
const FIO_CAMINHO = 'M 13 9 H 904 L 1000 105';

type Props = {
  title: string;
  description: string;
  /** `true` → o botão abre o `ContactModal` (é o caso de `/esg`). */
  contatoNoModal: boolean;
  /** Quem abre o modal continua sendo o `ContactCTA`, que é dono do estado. */
  onContato: () => void;
  /**
   * SIS-271 — o calibre do reveal on scroll, vindo da ROTA (hoje só `/esg`, em
   * `src/app/esg/reveal-calibre.ts`). Indefinido, o `RevealScope` não é montado e a
   * árvore é a de sempre: é a mesma porta opt-in de `layoutReferencia`.
   */
  revelar?: { limiar: number; margem: string };
};

export default function ContactCTAReferencia({
  title,
  description,
  contatoNoModal,
  onContato,
  revelar,
}: Props) {
  const cartaoRef = useRef<HTMLDivElement>(null);
  const caminhoRef = useRef<SVGPathElement>(null);
  const pontoRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const cartao = cartaoRef.current;
    const caminho = caminhoRef.current;
    const ponto = pontoRef.current;
    if (!cartao || !caminho || !ponto) return;
    /* Leitura SÍNCRONA da preferência, antes de qualquer `set`: é o que impede o
       quadro de movimento que um `useReducedMotion()` (que nasce `false` e só
       converge depois de montar) deixaria passar. Com movimento reduzido nada é
       tocado, e o ponto fica onde o HTML o pôs — no fim do fio. */
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const ctx = gsap.context(() => {
      const percurso = {
        path: caminho,
        align: caminho,
        alignOrigin: [0.5, 0.5] as [number, number],
      };
      /* Estacionar o ponto no NÓ (início do caminho) e apagá-lo. Sem isto ele
         ficaria no fim do fio até o gatilho disparar e depois saltaria para o
         começo: `gsap.to` não renderiza no instante em que é criado, e a timeline
         abaixo só corre quando a seção entra em quadro. */
      gsap.to(ponto, { duration: 0, motionPath: { ...percurso, start: 0, end: 0 } });
      gsap.set(ponto, { opacity: 0 });

      /* 5ª VOLTA — O PERCURSO PASSOU A SER UM LAÇO («deixe passando uma bolinha
         dinamicamente nessa linha»). O que estava aqui era uma CHEGADA: `once: true`,
         uma passagem só, e o ponto ficava parado no círculo para sempre. A nota
         antiga fica registrada porque a conclusão dela caducou, não o raciocínio:
         | `once`: é uma chegada, não uma rampa. Percurso amarrado ao scroll
         | (`scrub`) faria o ponto voltar atrás junto com a pessoa, e o pedido é
         | que ele "se conecte" ao botão — um destino, não um medidor.
         O argumento contra `scrub` CONTINUA VALENDO — e é por isso que o laço é por
         tempo (`repeat: -1`) e não por rolagem: um pulso que anda e volta com o
         dedo da pessoa não lê como sinal correndo pelo fio.

         `toggleActions` no lugar de `once`, com `end`: o laço é infinito, então
         precisa PARAR quando a seção sai de quadro — senão o RAF do GSAP segue
         acordado o resto da página inteira por causa de um enfeite de 22px.

         A OPACIDADE ENTRA E SAI DENTRO DO CICLO, e é o que evita o defeito clássico
         do laço: sem ela o ponto reapareceria de repente no nó a cada volta, um
         salto no lugar de uma emenda. Ele acende no arranque, apaga ao pousar, e o
         `repeatDelay` é a pausa escura entre pulsos.

         MOVIMENTO REDUZIDO não precisa de linha nova: o `return` síncrono lá acima
         acontece ANTES de qualquer `set`, então com a preferência ligada nada disto
         é criado e o ponto fica onde o HTML o pôs — pousado no fim do fio, que é o
         estado estático que a issue aceita. É também a razão de o laço poder ser
         infinito sem tropeçar na WCAG 2.2.2 pelo caminho do movimento automático. */
      const linha = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.8,
        scrollTrigger: {
          trigger: cartao,
          start: 'top 90%',
          end: 'bottom top',
          toggleActions: 'play pause resume pause',
        },
      });
      linha
        .to(ponto, { opacity: 1, duration: 0.25 })
        .to(
          ponto,
          {
            duration: 1.9,
            ease: 'power1.inOut',
            motionPath: { ...percurso, start: 0, end: 1 },
          },
          0,
        )
        .to(ponto, { opacity: 0, duration: 0.3 }, 1.75);
    }, cartao);

    /* `revert()`, e não `kill()`: é ele que devolve `cx`/`cy` e o `opacity` ao
       que o HTML declarava — o ponto pousado no fim do fio. */
    return () => ctx.revert();
  }, []);

  const dentroDoBotao = (
    <>
      Fale com a SISTRAN
      <span className="cta-ref-botao-circulo">
        <ArrowRight className="relative h-4 w-4" strokeWidth={2.4} />
      </span>
    </>
  );

  return (
    <section className="cta-ref section-py relative overflow-hidden">
      {/* SIS-253 (2ª volta) — AS ONDAS DE TRÁS, que é o que a reprovação nomeia
          («a parte de tras do card tambem»). Elas eram três `radial-gradient` na
          própria seção, e o comentário do `globals.css` registrava a escolha como
          "luz difusa, não uma curva desenhada". Comparado ao PNG isso estava
          errado: na referência há CURVAS — faixas largas atravessando a seção de
          canto a canto, que aparecem sobretudo através do vidro do cartão. Luz
          radial não produz aresta curva nenhuma, então nenhum ajuste de
          porcentagem chegaria lá; precisa de caminho.
          Por que SVG e não `background-image` com máscara: as faixas sangram de
          borda a borda e continuam POR BAIXO do cartão translúcido — com
          `preserveAspectRatio="none"` o mesmo caminho serve 360 e 1920 sem
          recalcular, e a curva não se deforma em "S" porque é aberta e suave.
          Estático: nenhuma `transition`, nenhum `filter`, nenhum RAF — a única
          camada nova não entra em conta de FPS. Decoração pura, daí `aria-hidden`. */}
      <div className="cta-ref-ondas" aria-hidden>
        <svg viewBox="0 0 1440 576" preserveAspectRatio="none">
          {/* Faixas em TRAÇO largo, e não em área preenchida: o desenho da
              referência é uma fita de espessura constante que atravessa o quadro.
              Área preenchida exigiria fechar o caminho no rodapé e a fita viraria
              morro. `stroke-linecap: round` some porque as pontas nascem fora da
              caixa. */}
          <path d="M -120 470 C 240 400 520 560 900 430 C 1180 336 1330 372 1560 300" />
          <path d="M -120 560 C 300 512 600 640 1000 520 C 1260 442 1380 470 1560 410" />
          <path d="M -120 300 C 200 250 420 330 760 214 C 1060 112 1260 148 1560 70" />
          <path d="M 240 -80 C 300 120 200 260 420 470 C 540 588 700 640 820 700" />
          <path d="M 1000 -80 C 1040 140 1180 230 1300 360" />
        </svg>
      </div>
      {/* O PALCO É UM FILHO DO `container-lp`, e não o próprio. Parece detalhe e é
          o que faz o ponto pousar no círculo: o cartão é elemento de fluxo, então
          a largura dele sai da CAIXA DE CONTEÚDO do container (1116px a 1440, já
          descontado o `px-8`); o botão e a arte são absolutos, e porcentagem de
          `right` resolve contra a CAIXA DE PADDING (1180px). Com o palco sendo o
          próprio container, os 74% do cartão e os «100% − 74%» do botão eram
          calculados sobre bases diferentes e o ponto pousava 16px à esquerda do
          círculo — medido em `docs/medidas/cta-referencia-sis253.json`, `dx: -16`.
          Um invólucro sem padding próprio faz as duas contas caírem na mesma base. */}
      <div className="container-lp">
        {/* SIS-271 — o palco é o ESCOPO do reveal quando a rota pede (`revelar`), e
            segue sendo uma `<div>` crua quando não pede: é o `Palco` no fim deste
            arquivo, e ele existe para os filhos serem escritos UMA vez em vez de
            duplicados nos dois ramos de um ternário.
            OS TRÊS NÓS MARCADOS RECEBEM `fade`, nunca `fade-up`, e o motivo é medido no
            próprio arquivo: o `ScrollTrigger` do fio tem o CARTÃO como gatilho
            (`start: 'top 90%'`), e um `translate3d` no nó de gatilho desloca a posição
            que o GSAP mede no `refresh` — o pulso do fio começaria fora de hora. O
            preset `fade` só toca `opacity`. O hover do botão (que é `transform`) fica
            intacto de qualquer modo: o bloco `.cta-ref-*` do `globals.css` vem DEPOIS
            dos presets, então `.cta-ref-botao:hover` tem a última palavra. */}
        <Palco revelar={revelar}>
          <div ref={cartaoRef} className="cta-ref-cartao" data-reveal={revelar ? 'fade' : undefined}>
            {/* O fio é grafismo: não há informação nele que o texto já não dê. */}
            <div className="cta-ref-fio" aria-hidden>
              <svg
                className="cta-ref-fio-svg"
                viewBox={`0 0 1000 ${FIO_ALTURA}`}
                fill="none"
              >
                <path ref={caminhoRef} className="cta-ref-fio-traco" d={FIO_CAMINHO} />
                {/* O nó vazado da ponta esquerda, de onde o ponto parte. */}
                <circle className="cta-ref-fio-no" cx="13" cy="9" r="13" />
                {/* ESTADO SERVIDO = ESTADO FINAL: o ponto nasce no último vértice do
                    caminho. Ver a nota do `useEffect`. */}
                <circle ref={pontoRef} className="cta-ref-fio-ponto" cx="1000" cy="105" r="11" />
              </svg>
            </div>
            <h2 className="cta-ref-titulo font-display text-3xl leading-tight md:text-4xl">
              {title}
            </h2>
            <p className="cta-ref-texto mt-4 text-base leading-relaxed">{description}</p>
          </div>

          {/* O BOTÃO É IRMÃO DO CARTÃO, e não filho dele. Duas razões medidas no
              desenho: na referência ele passa POR CIMA do blob azul, e o blob é
              irmão do cartão com `z-index` maior (é ele que entra pelo canto
              chanfrado); filho do cartão, o botão herdaria o contexto de
              empilhamento do cartão e ficaria enterrado sob o blob. O cartão também
              tem `clip-path` no desktop, que recorta filhos. */}
          {contatoNoModal ? (
            <button
              type="button"
              onClick={onContato}
              className="cta-ref-botao"
              data-reveal={revelar ? 'fade' : undefined}
              style={revelar ? ({ '--reveal-i': 1 } as CSSProperties) : undefined}
            >
              {dentroDoBotao}
            </button>
          ) : (
            <Link
              href="/#contato"
              className="cta-ref-botao"
              data-reveal={revelar ? 'fade' : undefined}
              style={revelar ? ({ '--reveal-i': 1 } as CSSProperties) : undefined}
            >
              {dentroDoBotao}
            </Link>
          )}

          {/* O grafismo da direita: blob, selo, órbitas e os dois balões. Decoração
              inteira, daí `aria-hidden` e o `alt=""` do selo — a marca já está no
              cabeçalho e no rodapé de toda página. */}
          {/* A ORDEM DOS FILHOS É A HIERARQUIA DO §4 do doc — forma azul, órbitas,
              símbolo, balões —, e ela é declarada duas vezes de propósito: aqui pela
              ordem no DOM e no CSS pelos `z-index` explícitos. Só a ordem não bastaria
              porque o `.cta-ref-orbita-b` precisa passar POR CIMA do selo em parte da
              volta na referência, e só o `z-index` não bastaria porque o `::after` da
              aresta do blob herda contexto do irmão anterior. */}
          <div
            className="cta-ref-arte"
            aria-hidden
            data-reveal={revelar ? 'fade' : undefined}
            style={revelar ? ({ '--reveal-i': 2 } as CSSProperties) : undefined}
          >
            {/* A FORMA AZUL É UM `<path>`, não mais um `border-radius` de oito valores.
                É o §3 do doc («não usar imagem rasterizada… criar a forma com um SVG
                incorporado») somado ao §8 («não utilizar `border-radius` aleatório para
                construir a forma principal — isso tende a produzir o volume irregular
                visto no componente atual»). E a crítica está certa contra o que havia:
                `62% 38% 46% 54% / 42% 58% 42% 58%` é um losango de quatro arcos
                elípticos, cada um com tangente vertical ou horizontal nos quatro pontos
                médios das arestas. Não existe combinação desses oito números que produza
                uma silhueta orgânica de curvatura variável: o que se consegue é círculo
                (valores iguais) ou losango de cantos moles (valores desiguais) — foi
                exatamente o par de defeitos que o §2 do doc lista, «quase circular» e
                «silhueta irregular». Com Bézier a curvatura é livre.
                O `d`, o `viewBox` 760×620 e o gradiente de três paradas vêm do §5 do doc
                sem alteração; o `viewBox` mais largo que alto é o item 1 do checklist. */}
            <svg
              className="cta-ref-blob"
              viewBox="0 0 760 620"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="cta-ref-blob-gradiente" x1="0" y1="0" x2="1" y2="1">
                  {/* A rampa do doc (§5) SUBSTITUI a que estava aqui, `#2fa6f2 → #032f60`.
                      O que muda de verdade é a BASE: `#032f60` é navy quase preto, e o
                      item 3 do checklist do doc é «o azul inferior não está
                      excessivamente escuro». `#064C98` é azul médio — continua sendo a
                      base escura da composição sem virar pedra.
                      E são três paradas, não quatro: a nota antiga registrava banding a
                      350px de largura com três, mas ela media um gradiente RADIAL de
                      78% num `<span>` de 350px. Aqui o degradê é linear na diagonal de
                      um SVG de 760 de lado, resolvido em espaço de objeto — a distância
                      entre paradas mais que dobrou. */}
                  <stop offset="0%" stopColor="#129EEA" />
                  <stop offset="48%" stopColor="#0878CC" />
                  <stop offset="100%" stopColor="#064C98" />
                </linearGradient>
                {/* A sombra do doc é `feDropShadow` dentro do SVG, e não `box-shadow`,
                    porque `box-shadow` segue a CAIXA e a caixa aqui é um retângulo — a
                    sombra apareceria nos cantos onde não há forma. */}
                <filter
                  id="cta-ref-blob-sombra"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feDropShadow
                    dx="0"
                    dy="18"
                    stdDeviation="22"
                    floodColor="#0878CC"
                    floodOpacity="0.22"
                  />
                  {/* O HALO CIANO fica, e é a única adição ao filtro do doc: é a regra
                      de glow da marca (ciano, nunca branco frio) e no PNG o blob
                      ilumina o fundo claro em volta. Vinha do `box-shadow` do
                      `.cta-ref-blob`, que morreu junto com a caixa. */}
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="26"
                    floodColor="#0ED8F6"
                    floodOpacity="0.38"
                  />
                </filter>
              </defs>
              <path
                filter="url(#cta-ref-blob-sombra)"
                fill="url(#cta-ref-blob-gradiente)"
                d="M156 164 C245 72 355 20 494 28 C638 36 732 130 738 276 C744 421 671 541 543 588 C416 635 270 597 177 511 C83 423 65 293 112 215 C126 191 141 176 156 164 Z"
              />
              {/* A ARESTA CIANA acesa de um lado só, que era o `::after` mascarado por
                  `conic-gradient` sobre o `border` da caixa. Com a forma em `<path>` ela
                  é o MESMO caminho traçado, e o "de um lado só" vem de um gradiente
                  linear que apaga o traço na saia inferior direita — o que também
                  resolve o que a máscara cônica não resolvia: a aresta acompanha a
                  curvatura real, e não a borda do retângulo. */}
              <defs>
                <linearGradient id="cta-ref-blob-aresta" x1="0.1" y1="0" x2="0.85" y2="1">
                  <stop offset="0%" stopColor="#0ED8F6" stopOpacity="0.95" />
                  <stop offset="42%" stopColor="#0ED8F6" stopOpacity="0.5" />
                  <stop offset="72%" stopColor="#0ED8F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="cta-ref-blob-aresta"
                fill="none"
                stroke="url(#cta-ref-blob-aresta)"
                d="M156 164 C245 72 355 20 494 28 C638 36 732 130 738 276 C744 421 671 541 543 588 C416 635 270 597 177 511 C83 423 65 293 112 215 C126 191 141 176 156 164 Z"
              />
            </svg>
            <span className="cta-ref-orbita cta-ref-orbita-a" />
            <span className="cta-ref-orbita cta-ref-orbita-b" />
            <span className="cta-ref-orbita-ponto" />
            <span className="cta-ref-selo">
              {/* O §5 do doc pede `/images/sistran-symbol.svg` e adverte contra imagem
                  com fundo branco embutido. O SVG não existe no projeto, e a arte de
                  alta definição cumpre a exigência real: o símbolo é BRANCO com canal
                  alfa de verdade (medido na fonte `public/logosistranaltadefinicao.png`,
                  1254×1254: 80,6% dos pixels em alpha=0, cantos e centro inclusos, e
                  zero pixel opaco escuro). O que se vê como "fundo preto" em
                  visualizador que ignora alfa é o RGB 0,0,0 guardado SOB os pixels
                  transparentes — não há caixa preta para recortar, e aplicar threshold
                  destruiria a antisserrilha.
                  A derivada servida é 640×640 (cobre os 288px máximos do selo em DPR 2)
                  e é WebP porque `images.unoptimized` está ligado no `next.config.mjs`:
                  sem ela o PNG cru de 324KB iria pela rede: 27KB contra 324KB. O resize
                  premultiplica o alfa, então aquele RGB preto não vira franja — medido:
                  luminância média dos pixels de borda 251/255, e os poucos escuros
                  restantes têm alfa máximo 2/255. */}
              <Image src="/images/esg/logo-sistran-cta.webp" alt="" width={220} height={220} />
            </span>
            <span className="cta-ref-balao cta-ref-balao-a">
              <i />
              <i />
              <i />
            </span>
            <span className="cta-ref-balao cta-ref-balao-b">
              <i />
              <i />
              <i />
            </span>
          </div>
        </Palco>
      </div>
    </section>
  );
}

/**
 * SIS-271 — o palco, com ou sem escopo de reveal. Existe como componente para os
 * filhos serem escritos UMA vez: num ternário em linha eles apareceriam duplicados,
 * e é aí que os dois ramos passam a divergir sem ninguém notar.
 *
 * Sem `revelar` a saída é exatamente a `<div className="cta-ref-palco">` de antes —
 * o `RevealScope` nem é montado, portanto nenhum `data-in` e nenhum
 * `IntersectionObserver` novo nas outras telas que venham a usar este desenho.
 * Com `revelar`, o `RevealScope` OCUPA O LUGAR dessa `<div>` (mesmo `className`,
 * nenhum nó novo), então o `.cta-ref-palco` continua sendo o pai direto do cartão,
 * do botão e da arte — o que importa porque o posicionamento dos três é relativo a
 * ele.
 */
function Palco({
  revelar,
  children,
}: {
  revelar?: { limiar: number; margem: string };
  children: ReactNode;
}) {
  if (!revelar) return <div className="cta-ref-palco">{children}</div>;
  return (
    <RevealScope className="cta-ref-palco" limiar={revelar.limiar} margem={revelar.margem}>
      {children}
    </RevealScope>
  );
}
