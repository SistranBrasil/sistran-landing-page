'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import CarimboBatida from '@/components/CarimboBatida';
import { PARTNERS, PARTNER_CATEGORIES, type PartnerCategory } from '@/data/partners';
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';
import { useProgressoDeSecao } from '@/lib/scrollProgress';
import './partner-terminal-cards.css';

type Filter = 'todos' | PartnerCategory;
const DESKTOP_QUERY = '(min-width: 1024px)';

let desktopMedia: MediaQueryList | null = null;
function getDesktopMedia() {
  desktopMedia ??= window.matchMedia(DESKTOP_QUERY);
  return desktopMedia;
}
function subscribeDesktop(notify: () => void) {
  const media = getDesktopMedia();
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}
function getDesktopSnapshot() {
  return getDesktopMedia().matches;
}

/* SIS-219 — A PLACA PASSOU A SER BRANCA NOS DEZESSEIS, e com isso esta lista
   saiu de uso. O pedido da issue é literal: «placa branca» em todos os cards, e
   o critério de aceite repete «placa sempre branca nos 16».

   REGRESSÃO MEDIDA, DECLARADA AQUI PARA NÃO SE PERDER: as quatro logos abaixo
   ficam abaixo do alvo 3:1 da WCAG 1.4.11 sobre branco — st-it 2,31:1,
   addactis 2,84:1, sap 1,80:1, dacadoo 2,10:1 (números da tabela original,
   preservada logo abaixo). Sobre a placa navy que elas tinham, iam de 5,98:1 a
   9,42:1. Quem for reverter precisa reverter também a regra
   `[data-tinta='clara']` em `partner-terminal-cards.css`, comentada lá pelo
   mesmo motivo — e trocar as ARTES por versões de tinta escura é a saída que
   resolve o contraste SEM desobedecer o pedido.

   O bloco original, verbatim:

 * SIS-201 (reparo) — os quatro parceiros cuja LOGO É DESENHADA EM TINTA CLARA.
 * Eles recebem a placa com preenchimento invertido (navy), não a branca.
 *
 * Não é preferência estética: num chip branco essas quatro logos desaparecem.
 * Medido por `scripts/medir-logos-parceiros-sis201.mjs`, que decodifica o PNG,
 * descarta o transparente e calcula o contraste da tinta contra os dois fundos.
 * O alvo é 3:1 — WCAG 1.4.11, porque logo é gráfico essencial, não texto:
 *
 *   | parceiro | contra #fff | contra navy |
 *   | st-it    | 2,31:1 ✗    | 7,36:1 ✓    |
 *   | addactis | 2,84:1 ✗    | 5,98:1 ✓    |
 *   | sap      | 1,80:1 ✗    | 9,42:1 ✓    |
 *   | dacadoo  | 2,10:1 ✗    | 8,08:1 ✓    |
 *
 * Os outros doze vão ao contrário: no branco ficam entre 3,41:1 (Microsoft
 * Azure, o mais apertado) e 21:1 (Núclea), e no navy cairiam para 1,24:1.
 *
 * A lista mora AQUI e não em `partners.ts` de propósito: sob `src/data/` o
 * `copy-lock` conta todo literal de string como cópia publicada, e um campo
 * novo com valor em texto entraria no lock como se fosse conteúdo do site.
 * Isto é atributo de renderização, não cópia.
 * (aqui fechava o bloco de doc do SIS-201)

   const LOGOS_DE_TINTA_CLARA: ReadonlySet<string> = new Set([
     'st-it',
     'addactis',
     'sap',
     'dacadoo',
   ]); */

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...(Object.entries(PARTNER_CATEGORIES) as [PartnerCategory, { label: string }][]).map(
    ([value, { label }]) => ({ value, label }),
  ),
];

export default function PartnerTerminalCards() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcedIndex, setAnnouncedIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const frameRef = useRef<number | null>(null);
  const sceneFrameRef = useRef<number | null>(null);
  const travelRef = useRef(0);
  const resetAfterFilterRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, () => false);
  const pinned = desktop && !reducedMotion;

  const visiblePartners = useMemo(
    () => PARTNERS.filter((partner) => filter === 'todos' || partner.category === filter),
    [filter],
  );

  useProgressoDeSecao(sectionRef, '--partner-progress', pinned, 'saida');

  /* SIS-218 — a altura é 100svh + o percurso horizontal medido. Assim, cada
     pixel vertical do trecho sticky corresponde a um pixel de translateX.
     O percurso é `offsetLeft(último) - offsetLeft(primeiro)`: como todos os
     cards têm a mesma largura, isso leva centro a centro sem depender da forma
     como cada navegador inclui o padding final no `scrollWidth`.
     ResizeObserver cobre viewport, fontes, imagens e a fila filtrada; o cleanup
     remove toda variável publicada para o fallback nativo não herdar estado. */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !pinned) return;

    let measureFrame = 0;
    const measure = () => {
      window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(() => {
        const cards = track.querySelectorAll<HTMLElement>('.partner-terminal__card');
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];
        const travel =
          firstCard && lastCard ? Math.max(0, lastCard.offsetLeft - firstCard.offsetLeft) : 0;
        travelRef.current = travel;
        section.style.setProperty('--partner-travel', `${travel}px`);
        const sectionHeight = section.getBoundingClientRect().height;
        section.style.setProperty(
          '--partner-progress-scale',
          travel > 0 ? (sectionHeight / travel).toFixed(6) : '1',
        );

        if (resetAfterFilterRef.current) {
          resetAfterFilterRef.current = false;
          const sectionTop = window.scrollY + section.getBoundingClientRect().top;
          window.scrollTo({ top: Math.max(0, Math.round(sectionTop)), behavior: 'auto' });
        }
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(track);
    return () => {
      window.cancelAnimationFrame(measureFrame);
      observer.disconnect();
      travelRef.current = 0;
      section.style.removeProperty('--partner-travel');
      section.style.removeProperty('--partner-progress-scale');
    };
  }, [pinned, visiblePartners]);

  /* O destaque visual acompanha o mesmo percurso usado pelo CSS. Estado React
     serve apenas para contador/setas; o movimento por quadro fica na variável
     CSS do hook e não rerenderiza os cards. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !pinned) return;

    const update = () => {
      sceneFrameRef.current = null;
      const travel = travelRef.current;
      const progress =
        travel > 0
          ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel))
          : 0;
      setActiveIndex(Math.round(progress * Math.max(0, visiblePartners.length - 1)));
    };
    const schedule = () => {
      if (sceneFrameRef.current !== null) return;
      sceneFrameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (sceneFrameRef.current !== null) window.cancelAnimationFrame(sceneFrameRef.current);
      sceneFrameRef.current = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pinned, visiblePartners.length]);

  /* Não enfileira um anúncio por card durante scrub: só publica o parceiro onde
     a rolagem assentou por 350ms. */
  useEffect(() => {
    const timeout = window.setTimeout(() => setAnnouncedIndex(activeIndex), 350);
    return () => window.clearTimeout(timeout);
  }, [activeIndex]);

  const updateActiveFromScroll = useCallback(() => {
    if (pinned) return;
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const track = trackRef.current;
      if (!track) return;

      const center = track.getBoundingClientRect().left + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      visiblePartners.forEach((partner, index) => {
        const card = cardRefs.current.get(partner.id);
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - center);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    });
  }, [pinned, visiblePartners]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const boundedIndex = Math.max(0, Math.min(index, visiblePartners.length - 1));
      if (pinned) {
        const section = sectionRef.current;
        if (!section) return;
        const progress =
          visiblePartners.length > 1 ? boundedIndex / (visiblePartners.length - 1) : 0;
        const sectionTop = window.scrollY + section.getBoundingClientRect().top;
        window.scrollTo({
          top: Math.max(0, Math.round(sectionTop + progress * travelRef.current)),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
        setActiveIndex(boundedIndex);
        return;
      }

      const partner = visiblePartners[boundedIndex];
      const card = partner ? cardRefs.current.get(partner.id) : undefined;
      if (!card) return;
      card.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIndex(boundedIndex);
    },
    [pinned, reducedMotion, visiblePartners],
  );

  const selectFilter = (nextFilter: Filter) => {
    resetAfterFilterRef.current = pinned;
    setFilter(nextFilter);
    setActiveIndex(0);
    setAnnouncedIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

  return (
    <div
      ref={sectionRef}
      className="partner-terminal"
      data-pinned={pinned ? 'true' : 'false'}
      data-visible-count={visiblePartners.length}
    >
      <div className="partner-terminal__stage">
        {/* SIS-201 (3ª volta) — itens 1 e 2: O CARIMBO ENTROU NO PALCO.

            Ele era montado em `src/app/parceiros-e-implementacoes/page.tsx`, IRMÃO
            de `<PartnerTerminalCards />` e fora deste componente (o JSX antigo ficou
            comentado lá, com o motivo).

            POR QUE MOVER ERA A ÚNICA SAÍDA, e não mais uma volta de padding: no
            desktop `.partner-terminal__stage` é `position: sticky; top: 0` e o
            `.partner-terminal` tem a altura do curso do pin. Com o carimbo FORA, ele
            rolava para fora da tela no instante em que o palco grudava — e o que
            sobrava sob o header era o `padding-top` do palco, uma faixa vazia de
            ~96px. Daí as duas queixas da issue serem a MESMA queixa vista de dois
            ângulos: «cards colados sob o header» e «vão grande entre carimbo e
            cards». Nenhum padding fecha um vão cujo lado de cima não está lá; e as
            duas seriam contraditórias se ambos os nós ficassem fixos — descer os
            cards afastaria mais o carimbo. Dentro do palco eles grudam e descem
            juntos, porque agora são um só bloco sticky.

            `id="parceiros-titulo"` VIAJA COM ELE, e não é enfeite: a
            `<section id="parceiros">` tem `aria-labelledby="parceiros-titulo"`, então
            o nome acessível da seção é o `alt` deste carimbo (decisão da SIS-225).
            O id continua DENTRO da mesma section, num nó anterior na leitura, então a
            referência segue resolvendo. Se este nó sair daqui, a seção perde o nome.

            As props repetem as de lá verbatim — inclusive `gatilho="viewport"`,
            porque a batida tem de disparar quando a faixa aparece, não na entrada da
            rota. */}
        <div id="parceiros-titulo" className="container-lp partner-terminal__carimbo">
          <CarimboBatida
            src="/images/parceiros/carimbo-parcerias-0757c7.webp"
            alt="Parceiros"
            larguraIntrinseca={640}
            alturaIntrinseca={200}
            gatilho="viewport"
          />

          {/* Pedido de 30/09 (chat) — «está ficando escondido em qual está» +
              «coloque isso ao lado do carimbo». O indicador de posição («SAMPLEMED
              · 12 / 16») era o ÚLTIMO nó do palco, abaixo dos controles, e no
              desktop o palco é `height: 100svh; overflow: clip`: a pilha
              header + carimbo + card + controles + status não cabia, e quem estava
              no fim da fila era justamente o texto que diz em que card você está.
              Ele subiu para esta linha, ao lado do carimbo.

              Isto resolve as duas metades do mesmo pedido de uma vez: o indicador
              sai da zona cortada (o topo do palco nunca é cortado — é ele que está
              grudado sob o cabeçalho) e passa a ler ao lado do carimbo. E, de
              quebra, devolve ~24px de orçamento vertical à pilha de baixo, que é o
              que estava cortando também a fileira de filtros.

              NÃO É `position: absolute` NEM `order`: o nó mudou de lugar no DOM, então
              a ordem de leitura e a de foco acompanham a visual. E a linha só tem a
              altura do carimbo (~87,5px), muito maior que os ~15px do texto — ou
              seja, ocupar esta linha custa ZERO altura nova.

              `container-lp` saiu do `<p>`: ele agora vive DENTRO do invólucro que já
              tem essa classe, e repeti-la dobraria o recuo lateral.

              A região `aria-live` continua aqui dentro, no mesmo `<p>`, e segue
              anunciando a troca de card — mudar de lugar no DOM não afeta isso. */}
          <p className="partner-terminal__status">
            <span aria-hidden="true">
              {visiblePartners[activeIndex]?.title} · {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(visiblePartners.length).padStart(2, '0')}
            </span>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Parceiro em destaque: {visiblePartners[announcedIndex]?.title}
            </span>
          </p>
        </div>

        {/* SIS-201 (2ª volta) — O BLOCO DE CONTROLES DESCEU: ele ficava AQUI,
            antes da trilha, e agora está depois dela (logo abaixo, antes do
            status). «Filtros abaixo dos cards» é o item 3, e o aceite confere
            «Abas TODOS / ESPECIALISTAS… abaixo dos cards».

            AS SETAS DESCERAM JUNTO, e não por comodidade: a issue autoriza («+
            setas se fizerem parte do mesmo controle») e elas são o MESMO
            `.partner-terminal__controls`, um flex com `justify-content:
            space-between` que existe para alinhar os dois nas pontas da mesma
            linha. Separar os dois exigiria um segundo invólucro e deixaria as
            setas sozinhas acima dos cards, que é o vão que o item 4 manda
            justamente fechar.

            É MUDANÇA DE DOM, NÃO DE `order`: o aceite fala de posição na tela, e
            `order` de flex move o pintado sem mover a ordem de foco do teclado —
            o Tab continuaria indo aos filtros antes da trilha, contra a ordem
            visual (WCAG 2.4.3 Focus Order). Movendo o nó, os dois coincidem.

            ⚠️ CONSEQUÊNCIA DE A11Y QUE MELHOROU DE GRAÇA: `aria-controls` nos
            filtros aponta para `#partner-terminal-track`, que agora vem ANTES no
            documento. Continua válido — `aria-controls` não exige ordem — e o
            foco passa a seguir a leitura. */}
        <div
          id="partner-terminal-track"
          ref={trackRef}
          className="partner-terminal__track"
          tabIndex={0}
          role="region"
          aria-label={`${visiblePartners.length} parceiros. Lista horizontal rolável.`}
          onScroll={updateActiveFromScroll}
          onKeyDown={(event) => {
            if (!pinned) return;
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              scrollToIndex(activeIndex - 1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              scrollToIndex(activeIndex + 1);
            }
          }}
        >
        {visiblePartners.map((partner, index) => (
          <article
            key={partner.id}
            ref={(node) => {
              if (node) cardRefs.current.set(partner.id, node);
              else cardRefs.current.delete(partner.id);
            }}
            className="partner-terminal__card on-dark"
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <Image
              src={partner.cardImage}
              alt={partner.cardImageAlt}
              fill
              sizes="(max-width: 639px) 88vw, (max-width: 1023px) 78vw, 68vw"
              className="partner-terminal__image"
            />
            <div className="partner-terminal__overlay" aria-hidden="true" />

            {/* SIS-201 (2ª volta) — O ECO DA LOGO SAIU DOS DEZESSEIS CARDS.
                «Retirar o eco atrás no hover … de TODOS os cards» é o item 2, e o
                aceite repete «Zero eco/silhueta no hover (placa OK)».

                NADA DE CONTEÚDO SE PERDE, e é isto que autoriza apagar em vez de
                esconder: o nó era `aria-hidden` com `alt=""`, decoração pura, e a
                imagem que ele mostrava é a MESMA de `partner.logo` que a placa
                logo abaixo continua exibindo — agora com o nome da marca no `alt`
                (SIS-219). Para leitor de tela o card não muda em nada.

                O que ele fazia visualmente: uma segunda leitura da marca, ampliada
                e a 34% de opacidade, com halo ciano, acesa no `:hover`/
                `:focus-within`. As regras de CSS que o desenhavam estão comentadas
                em `partner-terminal-cards.css`, nos três lugares onde moravam
                (base, `@media (max-width: 639px)` e os dois ramos de movimento
                reduzido) — a volta é descomentar lá e aqui.

                O bloco original, verbatim:

                // SIS-201 — o eco da logo, que aparece no hover ATRÁS da placa.
                //
                // É a mesma imagem de `partner.logo`, não um asset novo: é
                // literalmente uma segunda leitura da marca, ampliada e rebaixada
                // em opacidade, com a sombra ciano por volta.
                //
                // Fica fora de `.partner-terminal__content` de propósito. Dentro da
                // coluna de texto ele entraria no fluxo e empurraria a copy; aqui é
                // absoluto, com `z-index` entre o overlay e o conteúdo, então passa
                // por cima da imagem de fundo e por baixo do texto — o que é o
                // único jeito de a copy continuar legível com o eco aceso.
                //
                // `aria-hidden` e `alt=""`: é decoração pura — é a MESMA imagem da
                // placa ao lado, que desde a SIS-219 leva o nome no `alt`. Descrever
                // as duas faria o leitor anunciar a marca em dobro.
                {partner.logo && (
                  <div className="partner-terminal__eco" aria-hidden="true">
                    <Image
                      src={partner.logo}
                      alt=""
                      width={320}
                      height={96}
                      sizes="320px"
                      className="partner-terminal__eco-img"
                    />
                  </div>
                )}

                ⚠️ EFEITO COLATERAL MEDIDO, e que o card ganha de volta: com o eco
                fora, o `:hover` do card não acende NADA. O único sinal de destaque
                que sobra é o anel ciano de `[aria-current='true']`, que segue a
                rolagem e não o ponteiro. Quem quiser um afago de hover precisa de
                um efeito novo — não é o eco de volta. */}
            <div className="partner-terminal__content">
              {/* SIS-201 (reparo) — a placa oficial do parceiro, que a primeira
                  versão destes cards tinha deixado de fora: o `title` em
                  tipografia grande não substitui a marca.

                  SIS-219 — A PLACA VIROU O ÚNICO PORTADOR DO NOME, e por isso o
                  `alt` deixou de ser vazio. Era:

                      data-tinta={LOGOS_DE_TINTA_CLARA.has(partner.id) ? 'clara' : 'escura'}
                      aria-hidden="true"
                      … alt=""

                  com a justificativa de então, que caducou com o `<h3>`:
                  «`alt=""` + `aria-hidden` é deliberado … a placa é redundante
                  para leitor de tela, porque o `<h3>` logo abaixo publica o mesmo
                  nome em texto — com o alt preenchido, a marca seria lida duas
                  vezes em sequência (WCAG H67 pede alt vazio em imagem
                  redundante). Se a decisão for outra, o ajuste é trocar por
                  `alt={partner.logoAlt ?? ''}` e remover o `aria-hidden`.»

                  É exatamente esse ajuste, e agora ele é obrigatório: sem o
                  `<h3>` e com a imagem escondida, o card não diria de quem é.
                  `data-tinta` saiu junto — as dezesseis placas são brancas, ver o
                  bloco no alto deste arquivo.

                  O `partner.logo &&` fica mesmo com os dezesseis tendo logo hoje:
                  o campo é opcional no tipo, e parceiro novo sem placa não deve
                  render uma caixa vazia. */}
              {partner.logo && (
                <div className="partner-terminal__placa">
                  <Image
                    src={partner.logo}
                    alt={partner.logoAlt ?? partner.title}
                    width={320}
                    height={96}
                    /* SIS-219 — 200px era o teto antigo da placa (13rem = 208px).
                       Com a img a 20rem o `sizes` tem de acompanhar, senão o
                       navegador escolhe a candidata para uma caixa 37% menor do
                       que a desenhada e a logo grande sai borrada.

                       Agora o teto é a caixa do HOVER trazida para o repouso —
                       600x193 medidos a 1440 —, então `sizes` sobe para 600px.
                       Com `images: { unoptimized: true }` (SIS-154) isto não
                       muda o byte servido hoje; fica declarando a caixa real. */
                    sizes="600px"
                    className="partner-terminal__placa-img"
                  />
                </div>
              )}

              <p className="partner-terminal__eyebrow">
                {PARTNER_CATEGORIES[partner.category].label}
              </p>
              {/* SIS-219 — O NOME EM TIPOGRAFIA GRANDE SAIU. Era, aqui:

                      <h3>{partner.title}</h3>

                  «retirar o título … apenas as logos como sinal de marca» é o
                  pedido da issue. O nome não se perdeu do documento: passou para
                  o `alt` da placa (acima), que é o que o leitor de tela anuncia
                  agora. As duas regras de CSS que o formatavam
                  (`.partner-terminal__content h3`, uma no desktop e uma no
                  `@media (max-width: 639px)`) estão comentadas em
                  `partner-terminal-cards.css`, no lugar onde moravam.

                  Consequências que ficam registradas porque não são óbvias:
                  • o `<article>` do card deixa de ter cabeçalho próprio — a seção
                    continua nomeada pelo `<h2>` do cabeçalho de `.partner-terminal`;
                  • `scripts/medir-eco-hover-sis201.mjs` localizava os cards por
                    `.partner-terminal__card h3` e passou a não achar nada; a sonda
                    nova (`medir-placa-idle-sis219.mjs`) usa índice e o `alt`;
                  • a linha de status logo abaixo da trilha segue publicando o
                    nome do parceiro ativo em texto, então a marca continua
                    existindo em cópia na página. */}
              {partner.focus && <p className="partner-terminal__focus">{partner.focus}</p>}
              {partner.description && (
                <p className="partner-terminal__description">{partner.description}</p>
              )}

              {/* SIS-219 — o «saiba mais», em apenas quatro cards.

                  «intuitivo mas leve, não um botão gigante chamativo»: é um link
                  de texto com uma seta, sublinhado no hover — o peso visual de
                  uma legenda, não de um CTA de conversão. O desenho está em
                  `.partner-terminal__saiba-mais`.

                  NÃO é o card inteiro que vira link, e isso é ordem da issue («se
                  o card inteiro virar link atrapalhar o scroll/pin, prefira um
                  link interno»): o card é o alvo do pin lateral e do hover que
                  acende o eco; envolvê-lo num `<a>` daria arraste-para-navegar no
                  meio da trilha.

                  `target="_blank"` + `rel="noopener noreferrer"` porque é destino
                  externo. O `aria-label` repete o nome do parceiro: são quatro
                  links com o mesmo texto visível na mesma página, e sem ele a
                  lista de links do leitor de tela traria «Saiba mais» quatro
                  vezes, indistinguíveis — e hoje os quatro destinos são
                  DIFERENTES (só a AWS vai para o Partner Central; Addactis,
                  FRISS e Sensedia vão para os próprios sites), o que torna o
                  `aria-label` ainda mais necessário do que quando eram iguais. */}
              {partner.saibaMaisUrl && (
                <a
                  className="partner-terminal__saiba-mais"
                  href={partner.saibaMaisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Saiba mais sobre a parceria com ${partner.title} (abre em nova aba)`}
                >
                  Saiba mais
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </article>
        ))}
        </div>

        {/* SIS-201 (2ª volta) — os controles, agora DEPOIS da trilha. Ver o bloco
            no alto do palco, onde eles ficavam. */}
        <div className="container-lp partner-terminal__controls">
          <div
            className="partner-terminal__filters"
            role="group"
            aria-label="Filtrar parceiros por categoria"
          >
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className="partner-terminal__filter"
                aria-pressed={filter === item.value}
                aria-controls="partner-terminal-track"
                onClick={() => selectFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="partner-terminal__arrows" aria-label="Navegar pelos parceiros">
            <button
              type="button"
              className="partner-terminal__arrow"
              aria-label="Parceiro anterior"
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(activeIndex - 1)}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="partner-terminal__arrow"
              aria-label="Próximo parceiro"
              disabled={activeIndex === visiblePartners.length - 1}
              onClick={() => scrollToIndex(activeIndex + 1)}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Pedido de 30/09 (chat) — o indicador de posição estava AQUI, no pé do
            palco, e era o que ficava escondido. Subiu para a linha do carimbo; ver
            o comentário no alto. */}
      </div>
    </div>
  );
}
