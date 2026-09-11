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

/**
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
 */
const LOGOS_DE_TINTA_CLARA: ReadonlySet<string> = new Set([
  'st-it',
  'addactis',
  'sap',
  'dacadoo',
]);

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

            {/* SIS-201 — o eco da logo, que aparece no hover ATRÁS da placa.

                É a mesma imagem de `partner.logo`, não um asset novo: é
                literalmente uma segunda leitura da marca, ampliada e rebaixada
                em opacidade, com a sombra ciano por volta.

                Fica fora de `.partner-terminal__content` de propósito. Dentro da
                coluna de texto ele entraria no fluxo e empurraria a copy; aqui é
                absoluto, com `z-index` entre o overlay e o conteúdo, então passa
                por cima da imagem de fundo e por baixo do texto — o que é o
                único jeito de a copy continuar legível com o eco aceso.

                `aria-hidden` e `alt=""`: é decoração pura, e a marca já é
                publicada em texto pelo `<h3>`. */}
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
            <div className="partner-terminal__content">
              {/* SIS-201 (reparo) — a placa oficial do parceiro, que a primeira
                  versão destes cards tinha deixado de fora: o `title` em
                  tipografia grande não substitui a marca.

                  `alt=""` + `aria-hidden` é deliberado, e NÃO muda `partners.ts`:
                  o `logoAlt` continua preenchido no data e serve o
                  `PartnersGrid`. Aqui a placa é redundante para leitor de tela,
                  porque o `<h3>` logo abaixo publica o mesmo nome em texto — com
                  o alt preenchido, a marca seria lida duas vezes em sequência
                  (WCAG H67 pede alt vazio em imagem redundante). Se a decisão for
                  outra, o ajuste é trocar por `alt={partner.logoAlt ?? ''}` e
                  remover o `aria-hidden`.

                  O `partner.logo &&` fica mesmo com os dezesseis tendo logo hoje:
                  o campo é opcional no tipo, e parceiro novo sem placa não deve
                  render uma caixa vazia. */}
              {partner.logo && (
                <div
                  className="partner-terminal__placa"
                  data-tinta={LOGOS_DE_TINTA_CLARA.has(partner.id) ? 'clara' : 'escura'}
                  aria-hidden="true"
                >
                  <Image
                    src={partner.logo}
                    alt=""
                    width={320}
                    height={96}
                    /* SIS-219 — 200px era o teto antigo da placa (13rem = 208px).
                       Com a img a 20rem o `sizes` tem de acompanhar, senão o
                       navegador escolhe a candidata para uma caixa 37% menor do
                       que a desenhada e a logo grande sai borrada. */
                    sizes="320px"
                    className="partner-terminal__placa-img"
                  />
                </div>
              )}

              <p className="partner-terminal__eyebrow">
                {PARTNER_CATEGORIES[partner.category].label}
              </p>
              <h3>{partner.title}</h3>
              {partner.focus && <p className="partner-terminal__focus">{partner.focus}</p>}
              {partner.description && (
                <p className="partner-terminal__description">{partner.description}</p>
              )}
            </div>
          </article>
        ))}
        </div>

        <p className="container-lp partner-terminal__status">
          <span aria-hidden="true">
            {visiblePartners[activeIndex]?.title} · {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(visiblePartners.length).padStart(2, '0')}
          </span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Parceiro em destaque: {visiblePartners[announcedIndex]?.title}
          </span>
        </p>
      </div>
    </div>
  );
}
