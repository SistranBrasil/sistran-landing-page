'use client';

/**
 * SIS-277 — CARIMBO COM BATIDA DE ENTRADA, genérico.
 *
 * Uma arte de carimbo que assenta na tela quando entra em cena. Consumidores:
 * a abertura de `/parceiros-e-implementacoes`, onde ele substitui a tag textual
 * «Parceiros e Implementações» (prop `eyebrowArte` do `PageHero`), e a seção
 * «Principais Soluções Sistran Labs» de `/sistran-labs` (SIS-188).
 *
 * ── POR QUE UM COMPONENTE NOVO E NÃO O `CarimboRealizadoSistran` ──
 *
 * A issue pede para «reusar o padrão (componente novo ou genérico com src/alt) em
 * vez de copiar GSAP ad hoc sem reduce», e este arquivo é o ramo "componente
 * novo". O da SIS-235 não serve como está: ele tem o caminho da arte fixo, tira o
 * texto do `alt` de `EVENT_KIND_META.proprio.label` (rastreado pelo portão de
 * cópia da Regra Zero) e carrega o tombo de −6° que a arte DAQUELA issue não
 * trazia. Nada disso é parametrizável sem editá-lo — e «Eventos / outros
 * carimbos» está FORA DE ESCOPO nesta issue, então unificar os dois num só
 * componente ficaria por conta de uma issue própria, com medição da rota de
 * eventos. O que se repete aqui é o PADRÃO (batida por `fromTo`, reduce nascendo
 * no estado final, `clearProps` no desmonte), não o arquivo.
 *
 * ── A ARTE JÁ VEM TOMBADA — E ISSO SIMPLIFICA TUDO ──
 *
 * Medido em `public/carimbo/carimbo-parcerias.png` (borda superior da cápsula em
 * x=400 → y=70 e em x=1300 → y=22): **−3,05°**, a cápsula sobe para a direita
 * dentro do próprio arquivo. Então o repouso desta arte é `rotate` NENHUM, e o
 * estado final do tween é `rotation: 0`.
 *
 * SIS-188 — a segunda arte foi medida antes de reusar, e não depois: o topo da
 * tinta de `carimbo-sistran-labs.png` cai de y=52 em x=149 para y=15 em x=847,
 * ou seja **−3,03°**. As duas artes vêm tombadas praticamente no mesmo ângulo, e
 * por isso o «repouso é giro zero» deste componente vale para as duas sem
 * parâmetro novo. Se um dia entrar uma arte RETA, é aqui que um `tomboRepouso`
 * precisará nascer — junto com a nota da folha sobre o CSSPlugin escrever
 * `rotate: none`, que é o que tornou aquele valor indivisível na SIS-235.
 *
 * ── A RAZÃO DE ASPECTO VEM DAS PROPS, NÃO DA FOLHA (SIS-188) ──
 *
 * `--carimbo-batida-ar` nasceu chapado em `carimbo-batida.css` como `640 / 200`,
 * a medida da arte de `/parceiros`. A arte de `/sistran-labs` é `640 / 224`, e
 * com o valor da folha o desenho sairia ACHATADO — exatamente o modo de falha que
 * o docblock daquela folha diz querer evitar («escrito como razão, não como altura
 * em px, para a cápsula não achatar»). A razão passa a ser montada aqui, a partir
 * de `larguraIntrinseca`/`alturaIntrinseca`, que já eram obrigatórias e já são as
 * dimensões reais do arquivo. Uma fonte só, impossível de divergir.
 *
 * ── DUAS FORMAS DE ENTRAR EM CENA ──
 *
 * `gatilho="rota"` (padrão) é o caso de `/parceiros`: a arte vive ACIMA da dobra,
 * e ali liberar o portão e entrar em quadro são o mesmo instante.
 *
 * `gatilho="viewport"` existe porque em `/sistran-labs` a arte está a ~3.070px do
 * topo do documento (medido). Bater na montagem ali significaria bater com a peça
 * fora de quadro: quem rolasse até a seção encontraria o carimbo já assentado e
 * nunca veria a batida — o mesmo defeito que a SIS-243 nomeou para o portão da
 * rota, com outra causa. O item 2 da SIS-188 pede isso por escrito («ao entrar na
 * seção / viewport; não atrás do `RouteLoadGate`»).
 *
 * O calibre do observador é o CANÔNICO da casa (`src/lib/reveal-calibre.ts`), não
 * um par novo: `-12%` de margem e limiar `0.15`. A margem é NEGATIVA de propósito
 * — positiva estenderia a raiz abaixo da dobra e produziria de novo o defeito de
 * animar fora da tela (apuração no docblock de lá).
 *
 * É a diferença que evita, aqui, a duplicação que a SIS-235 teve de aceitar: lá a
 * arte era reta, o tombo tinha de ser dado por CSS, e o CSSPlugin do GSAP escreve
 * `rotate: none` no `style` junto do transform — o que obrigou o mesmo −6° a
 * existir no CSS e no tween. Sem tombo de repouso, não há valor para duplicar
 * nem para divergir.
 *
 * O `TOMBO_EXTRA_DEG` é só overshoot de entrada: o carimbo chega mais torto e
 * mais largo e assenta no zero. Ele não é estado de repouso de ninguém.
 *
 * ── A BATIDA ESPERA O PORTÃO DA ROTA ──
 *
 * `RouteLoadGate` cobre esta rota, e uma batida disparada na MONTAGEM aconteceria
 * atrás do véu: quem abrisse a página veria o carimbo já assentado e nunca a
 * batida. É o defeito que a SIS-243 nomeou e o mesmo motivo pelo qual o `CountUp`
 * espera `portao.liberado`. `useRouteLoadGate()` devolve `null` fora do portão, e
 * nesse caso a batida acontece na montagem — assim o componente serve em qualquer
 * lugar sem depender do portão existir.
 *
 * Não há `ScrollTrigger` nem pinagem: a issue pede «montagem / IO na abertura —
 * não pin/ScrollTrigger sticky», e esta arte vive acima da dobra, onde liberar o
 * portão e entrar em quadro são o mesmo instante.
 */

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouteLoadGate } from '@/components/loading/RouteLoadGate';
import { prefersReducedMotion } from '@/lib/motion';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from '@/lib/reveal-calibre';
import './carimbo-batida.css';

/** Quanto o carimbo chega mais largo que o repouso, antes de assentar. */
const ESCALA_ENTRADA = 1.85;
/** Graus de tombo ALÉM do repouso na chegada. Ver "A ARTE JÁ VEM TOMBADA". */
const TOMBO_EXTRA_DEG = -7;
const DURACAO = 0.42;

type Props = {
  src: string;
  /** O sentido da peça. Vazio só se houver um equivalente textual ao lado. */
  alt: string;
  /** Dimensões INTRÍNSECAS do arquivo — reservam a caixa, não definem o tamanho. */
  larguraIntrinseca: number;
  alturaIntrinseca: number;
  /** Para quem precisa de um `--carimbo-batida-w` próprio. */
  className?: string;
  /**
   * Quando bater. `'rota'` (padrão) = na abertura, esperando o `RouteLoadGate`;
   * serve a quem vive acima da dobra. `'viewport'` = quando a peça entra em
   * quadro; obrigatório para quem vive abaixo dela. Ver "DUAS FORMAS DE ENTRAR
   * EM CENA".
   */
  gatilho?: 'rota' | 'viewport';
};

export default function CarimboBatida({
  src,
  alt,
  larguraIntrinseca,
  alturaIntrinseca,
  className,
  gatilho = 'rota',
}: Props) {
  const raiz = useRef<HTMLSpanElement>(null);
  const portao = useRouteLoadGate();
  const [paginaCarregada, setPaginaCarregada] = useState(false);
  const [emQuadro, setEmQuadro] = useState(false);

  /* O estado nasce `false` no servidor e no primeiro render do cliente, e a
     ÁRVORE NÃO DEPENDE DELE — só o momento de animar. É a regra de hidratação da
     casa (ver o docblock de `useReducedMotion` em `src/lib/motion.ts`). */
  useEffect(() => {
    if (document.readyState === 'complete') {
      const quadro = requestAnimationFrame(() => setPaginaCarregada(true));
      return () => cancelAnimationFrame(quadro);
    }
    const aoCarregar = () => setPaginaCarregada(true);
    window.addEventListener('load', aoCarregar);
    return () => window.removeEventListener('load', aoCarregar);
  }, []);

  /* O observador só existe no gatilho de viewport, e ele se DESLIGA na primeira
     entrada: um carimbo assenta uma vez. Reagir a cada reentrada faria a peça
     bater de novo a cada rolagem para cima e para baixo, que é ruído, não
     motion — e no canal de movimento reduzido o `emQuadro` fica irrelevante
     porque a linha do tempo não é montada de todo jeito. */
  useEffect(() => {
    if (gatilho !== 'viewport') return;
    const no = raiz.current;
    if (!no) return;
    /* Sem `IntersectionObserver` (navegador antigo, ou ambiente de teste sem a
       API) o carimbo não pode ficar esperando para sempre um sinal que nunca vem:
       cai no comportamento da montagem, que ao menos deixa a peça no estado
       final. Falha visível como «não vi a batida», nunca como «a peça sumiu». */
    if (typeof IntersectionObserver !== 'function') {
      /* Num QUADRO, e não em linha reta. Chamar `setEmQuadro` de forma síncrona no
         corpo do efeito é exatamente o que o `react-hooks` reporta como render em
         cascata (foi a 80ª linha do lint, uma acima da base de 79 — e a regra da
         casa é a base intacta). O `requestAnimationFrame` é o MESMO recurso que o
         efeito de `paginaCarregada` logo acima já usa, e não muda o
         comportamento: este ramo só existe onde não há observador, e ali «assim
         que possível» é a resposta certa de todo jeito. */
      const quadro = requestAnimationFrame(() => setEmQuadro(true));
      return () => cancelAnimationFrame(quadro);
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setEmQuadro(true);
          observador.disconnect();
        }
      },
      { rootMargin: MARGEM_REVEAL, threshold: LIMIAR_REVEAL },
    );
    observador.observe(no);
    return () => observador.disconnect();
  }, [gatilho]);

  const pronto =
    paginaCarregada &&
    (portao === null || portao.liberado) &&
    (gatilho === 'rota' || emQuadro);

  useEffect(() => {
    const no = raiz.current;
    if (!no || !pronto) return;
    /* Movimento reduzido: nada de `gsap.from`/`fromTo`, porque os dois PARTEM do
       estado inicial — se a linha do tempo fosse morta por um reset global, o
       carimbo ficaria preso em `opacity: 0`, que é como uma animação morta
       esconde conteúdo para sempre. Aqui simplesmente não há animação, e o CSS já
       é o estado final.

       SÃO OS DOIS CANAIS DA CASA, e é preciso ler os dois AQUI: o
       `prefersReducedMotion()` só olha a media query, e o seletor de movimento do
       site grava a escolha explícita em `<html data-motion>` (mesmo par de fontes
       de `useInViewCanvas` e do `RouteLoadGate`). O CSS da folha cobre os dois com
       `!important`, então no canal do atributo o resultado visível já seria o
       estado final — mas a linha do tempo rodaria inteira por baixo dele, gastando
       quadros para nada. Melhor não montá-la. */
    if (prefersReducedMotion() || document.documentElement.dataset.motion === 'reduce') return;

    /* A batida: chega grande e torto e assenta no repouso da arte (giro zero — a
       inclinação já está no arquivo). `back.out` dá o repique curto de borracha
       batendo no papel; `power3.out` sozinho assentaria macio demais para ler
       como carimbo. */
    const tl = gsap.fromTo(
      no,
      { scale: ESCALA_ENTRADA, rotation: TOMBO_EXTRA_DEG, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: DURACAO, ease: 'back.out(1.7)' },
    );
    return () => {
      tl.kill();
      /* Limpa o `transform` inline que o GSAP deixou: sem isto o repouso do CSS
         passaria a competir com uma matriz congelada no elemento. `"all"` e não
         `"transform,opacity"` — a string com nome de prop entrava no lock do
         portão de cópia da Regra Zero como se fosse texto do site (apuração no
         `CarimboRealizadoSistran`). */
      gsap.set(no, { clearProps: 'all' });
    };
  }, [pronto]);

  return (
    <span
      ref={raiz}
      className={['carimbo-batida', className].filter(Boolean).join(' ')}
      /* A razão de aspecto do ARQUIVO, e não um número da folha — ver "A RAZÃO DE
         ASPECTO VEM DAS PROPS". Escrita como razão e não como altura em px para a
         cápsula não achatar se só a largura mudar. */
      style={
        { '--carimbo-batida-ar': `${larguraIntrinseca} / ${alturaIntrinseca}` } as CSSProperties
      }
    >
      <Image
        src={src}
        alt={alt}
        width={larguraIntrinseca}
        height={alturaIntrinseca}
        /* `priority` SÓ no gatilho de rota, e a distinção é medida: lá a arte
           está acima da dobra e entra no lugar de uma tag que era texto, então
           chegar depois seria um salto na abertura. No gatilho de viewport a peça
           está a milhares de px do topo — pedir prioridade ali roubaria banda do
           que está em quadro e o próprio Next avisa disso. A caixa já está
           reservada pelo `aspect-ratio`, então o carregamento tardio não desloca
           nada. Com `images: { unoptimized: true }` (SIS-154) o que baixa é o
           arquivo do disco, e é por isso que ele já sai do script em tamanho de
           uso (640px) e não no tamanho da fonte. */
        priority={gatilho === 'rota'}
        loading={gatilho === 'rota' ? undefined : 'lazy'}
      />
    </span>
  );
}
