'use client';

/**
 * SIS-196 — "Soluções de Negócios" no modelo sticky storytelling.
 *
 * Substitui o teatro anterior (nav, cartão sobre foto e linha SVG medida) pelo
 * modelo de `docs/secao-sticky-storytelling-terminal.md`: os textos das quatro
 * etapas SOBEM no fluxo normal da coluna esquerda, e o painel de mídia à direita
 * fica `position: sticky` trocando de imagem por crossfade.
 *
 * ── Decisão ProofJourney: OPÇÃO 2 (desacoplar) ───────────────────────────────
 * A jornada (`ProofJourney`) tem UM palco `sticky` (`.pj-stage`) e os capítulos
 * são CAMADAS ABSOLUTAS dentro dele. Este modelo é o oposto por construção: o
 * texto tem de ocupar altura real de documento (quatro etapas de 70vh+ com vãos
 * grandes) para poder subir, e a mídia precisa de um `sticky` que se solte no
 * rodapé da PRÓPRIA seção. Camada absoluta não tem altura de documento, então
 * dentro da jornada não há percurso para o texto percorrer — e um segundo palco
 * sticky dentro do palco da jornada é exatamente o "segundo palco sticky
 * paralelo" que a issue proíbe.
 *
 * Então esta seção é IRMÃ da jornada, montada logo antes dela; Números e
 * parceiros seguem sendo a jornada, com os dois capítulos que sobraram.
 *
 * ── Copy: nada inventado ─────────────────────────────────────────────────────
 * Eyebrow e título são verbatim do site. A FRASE progressiva é a `description`
 * de cada solução, e o `title` vira o eyebrow da etapa: o título 01 tem 55
 * caracteres e não caberia nos `14–18ch` que o doc pede para a frase — cortá-lo
 * seria escrever copy novo. O rótulo `Diferenciais` continua sendo o rótulo da
 * lista, agora no cabeçalho sticky.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { SOLUTIONS } from '@/data/solutions';
import { useReducedMotion } from '@/lib/motion';
import { criarConsultaDeMedia } from '@/lib/mediaStore';
import { useRevealTrigger } from '@/components/motion/useRevealTrigger';

/* O mesmo limiar governa a estrutura CSS e o modo dirigido. */
const useHistoriaLarga = criarConsultaDeMedia('(min-width: 1024px)');

const TOTAL = SOLUTIONS.length;

/** Caracteres da frase. Espaços comuns preservam os pontos naturais de quebra. */
function Frase({ texto }: { texto: string }) {
  return (
    /* O parágrafo carrega a frase inteira em `aria-label` e a divisão por
       caractere é `aria-hidden`: leitor de tela lê uma frase, não 60 letras. */
    <p className="story-frase" aria-label={texto}>
      <span aria-hidden="true">
        {Array.from(texto).map((c, i) => (
          <span key={`${c}-${i}`} className="progressive-char" data-char="">
            {c}
          </span>
        ))}
      </span>
    </p>
  );
}

/**
 * Acende os caracteres de cada etapa conforme ela sobe, escrevendo só a
 * DIFERENÇA em relação ao quadro anterior. `acesos[i]` é quantos caracteres da
 * etapa `i` já estão acesos — sem essa memória, cada quadro reescreveria
 * `data-active` em todos eles e reiniciaria a animação de cor de todos, a 60 Hz.
 *
 * Fora do componente porque não depende de render nenhum: recebe a trilha e a
 * memória por parâmetro. É também o que permite ao laço se reagendar chamando a
 * si mesmo, sem a função ler uma versão velha de si.
 */
function acenderCaracteres(trilha: HTMLOListElement, acesos: number[]) {
  const nos = trilha.querySelectorAll<HTMLElement>('[data-step-index]');
  const centro = window.innerHeight * 0.5;
  nos.forEach((no, i) => {
    const caixa = no.getBoundingClientRect();
    /* §9 do doc: a etapa acende do centro da janela para baixo, com uma fração
       de janela de percurso extra (`+ 0.2vh`) — é ela que faz o último caractere
       acender ANTES de a etapa sair de cena. */
    const percurso = caixa.height + window.innerHeight * 0.2;
    const bruto = percurso > 0 ? (centro - caixa.top) / percurso : 0;
    const p = bruto < 0 ? 0 : bruto > 1 ? 1 : bruto;
    const chars = no.querySelectorAll<HTMLElement>('[data-char]');
    const alvo = Math.round(p * chars.length);
    const antes = acesos[i] ?? 0;
    if (alvo === antes) return;
    if (alvo > antes) {
      for (let k = antes; k < alvo; k += 1) chars[k]?.setAttribute('data-active', 'true');
    } else {
      /* Rolagem de volta apaga na ordem inversa: a frase "desacende" pelo fim,
         que é o caminho por onde ela acendeu. */
      for (let k = antes - 1; k >= alvo; k -= 1) chars[k]?.removeAttribute('data-active');
    }
    acesos[i] = alvo;
  });
}

export default function SolutionsStory() {
  const secaoRef = useRef<HTMLElement>(null);
  const trilhaRef = useRef<HTMLOListElement>(null);
  /* Só `activeIndex` é estado (doc §16): ele muda 3 vezes na seção inteira. O
     acender dos caracteres é escrita imperativa no DOM — um `setState` por pixel
     de rolagem reentraria no render a 60 Hz para trocar uma cor. */
  const [ativo, setAtivo] = useState(0);
  const ativoRef = useRef(0);
  const isDesktop = useHistoriaLarga();
  const rm = useReducedMotion();
  /* `useReducedMotion` devolve `false` no servidor e no primeiro render: o modo
     dirigido é uma PROMOÇÃO depois de montar, e a árvore servida é a mesma da
     hidratada (sem `if (rm) return outra coisa`). */
  const dirigindo = isDesktop && !rm;

  /* SIS-197 — o CABEÇALHO da seção era o único bloco estático dela: eyebrow,
     título e rótulo apareciam prontos enquanto tudo abaixo é conduzido pela
     rolagem (frase por caractere, crossfade da mídia, contador). Agora ele entra
     pelos presets do Efeito 4.
     O escopo é o próprio `<header>`, e não um envelope novo: este componente já
     é cliente, então o gatilho entra por `useRevealTrigger` direto no nó — um
     `<div>` a mais aqui viraria ancestral com `transform` DENTRO da coluna que
     hospeda o contador `sticky`, que é exatamente o que a issue proíbe. Como o
     header não contém nada `sticky` nem `fixed`, marcar transform nos FILHOS
     dele é inócuo: só ancestrais do elemento preso contam.
     `umaVez` fica no default (entra uma vez e fica): o report não pede reverse
     para blocos de apoio. */
  const { ref: cabecalhoRef } = useRevealTrigger<HTMLElement>();

  /* ── Frase por caractere ───────────────────────────────────────────────────
     Um laço de quadro só, e apenas enquanto a seção está na tela. Escreve por
     DELTA (`acenderCaracteres`, no escopo do módulo): cada quadro só toca nos
     caracteres que cruzaram a fronteira desde o quadro anterior, então uma
     rolagem parada não escreve nada e o `animation` de `signal-to-ink` não é
     reiniciado no caractere que já acendeu.

     Um listener passivo agenda no máximo um `requestAnimationFrame`; não existe
     render React nem leitura geométrica repetida quando a página está parada. */
  useEffect(() => {
    const secao = secaoRef.current;
    /* Modo lista (mobile, movimento reduzido, sem JS): nenhum laço, e a frase
       nasce na cor final pela regra `:not([data-dirigindo])` do CSS da seção —
       não há atributo cravado no DOM para desfazer depois. */
    if (!secao || !dirigindo) return;

    let quadro = 0;
    let naTela = false;
    const acesos: number[] = [];

    const observador = new IntersectionObserver(
      ([e]) => {
        naTela = e?.isIntersecting ?? false;
        if (naTela) agendar();
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    observador.observe(secao);

    const medirQuadro = () => {
      quadro = 0;
      const trilha = trilhaRef.current;
      if (!trilha || !naTela) return;
      const centro = window.innerHeight / 2;
      const passos = Array.from(trilha.querySelectorAll<HTMLElement>('[data-step-index]'));
      const proximo = passos.reduce(
        (melhor, passo, indice) => {
          const caixa = passo.getBoundingClientRect();
          const distancia = Math.abs(caixa.top + caixa.height / 2 - centro);
          return distancia < melhor.distancia ? { indice, distancia } : melhor;
        },
        { indice: ativoRef.current, distancia: Number.POSITIVE_INFINITY },
      ).indice;
      if (proximo !== ativoRef.current) {
        ativoRef.current = proximo;
        setAtivo(proximo);
      }
      acenderCaracteres(trilha, acesos);
    };
    const agendar = () => {
      if (!naTela || quadro) return;
      quadro = requestAnimationFrame(medirQuadro);
    };
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);

    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      cancelAnimationFrame(quadro);
      secao
        .querySelectorAll<HTMLElement>('[data-char][data-active]')
        .forEach((c) => c.removeAttribute('data-active'));
    };
  }, [dirigindo]);

  return (
    <section
      /* `id` e `aria-labelledby` são os MESMOS do teatro antigo: o `ScrollSpy`
         lista `solucoes` e o hero linka para `#solucoes`. Trocar o id aqui
         apagaria o indicador e o link do hero. */
      id="solucoes"
      ref={secaoRef}
      aria-labelledby="solucoes-titulo"
      className="story-solucoes"
      data-dirigindo={dirigindo ? '' : undefined}
    >
      {/* Atmosfera técnica clara, atrás de tudo e sem captar ponteiro. */}
      <div aria-hidden className="story-solucoes__fundo">
        <span className="story-solucoes__grade" />
        <span className="story-solucoes__brilho" />
      </div>

      <div className="story-solucoes__layout">
        <div className="story-solucoes__copy">
          <header className="story-solucoes__cabecalho" ref={cabecalhoRef}>
            {/* Verbatim do bloco "Soluções de Negócios" da home.
                Fonte: .claude/conteudo-site/00-home.md (seção 5). */}
            {/* SIS-197 — `--reveal-i` é a ordem de leitura, e o atraso entre um
                irmão e o seguinte é o token `--motion-stagger-reveal` (80ms). */}
            <span
              className="story-solucoes__eyebrow"
              data-reveal="fade-up"
              style={{ '--reveal-i': 0 } as CSSProperties}
            >
              <span aria-hidden className="story-solucoes__eyebrow-ponto" />
              Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de
              negócios.
            </span>
            {/* SIS-194 cobre TÍTULOS por `RevealText` (máscara, palavra por
                palavra), e a issue manda não invadir esse território. Ela cobriu
                um título: `marcas-grade-titulo`, na `BrandGrid`. Este `<h2>` não
                estava no lote e não tem `RevealText` — deixá-lo parado entre um
                eyebrow e um rótulo que entram seria a inconsistência que a
                SIS-197 existe para tirar. Se a SIS-194 voltar para ele, o
                `data-reveal` daqui SAI: os dois no mesmo nó seriam duas entradas
                disputando o mesmo elemento. */}
            <h2
              id="solucoes-titulo"
              className="story-solucoes__titulo"
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as CSSProperties}
            >
              Soluções de Negócios
            </h2>
            {/* O rótulo entra só por opacidade e a RÉGUA dele se desenha da
                esquerda (`line-up`), no mesmo tempo: um `fade-up` no `<p>`
                arrastaria a linha junto e o desenho dela não se leria. */}
            <p
              className="story-solucoes__rotulo"
              data-reveal="fade"
              style={{ '--reveal-i': 2 } as CSSProperties}
            >
              <span
                aria-hidden
                className="story-solucoes__rotulo-linha"
                data-reveal="line-up"
                style={{ '--reveal-i': 2 } as CSSProperties}
              />
              Diferenciais
            </p>
          </header>

          {/* Contador corrente próximo às frases. `aria-hidden` porque a ordem e
              o número já constam de cada item da lista. */}
          <p aria-hidden className="story-solucoes__contador">
            <span className="story-solucoes__contador-atual">
              {String(ativo + 1).padStart(2, '0')}
            </span>
            <span className="story-solucoes__contador-total">
              / {String(TOTAL).padStart(2, '0')}
            </span>
          </p>

          <ol ref={trilhaRef} className="story-passos">
            {SOLUTIONS.map((s, i) => (
              <li
                key={s.id}
                className="story-passo"
                data-step-index={i}
                data-ativo={i === ativo ? '' : undefined}
              >
                {/* O título completo continua no DOM e legível — é o eyebrow da
                    etapa, aberto pelo número dela. A frase progressiva é a
                    descrição. */}
                <p className="story-passo__titulo">
                  <span aria-hidden className="story-passo__num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </p>
                {dirigindo ? (
                  <Frase texto={s.description} />
                ) : (
                  <p className="story-frase">{s.description}</p>
                )}
                <figure className="story-passo__midia">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.imageAlt ?? ''}
                      fill
                      sizes="(max-width: 1023px) 92vw, 46vw"
                      preload={i === 0}
                    />
                  ) : null}
                </figure>
              </li>
            ))}
          </ol>
        </div>

        <div className="story-solucoes__midia-col" aria-hidden={!dirigindo}>
          <div className="story-solucoes__midia">
            {/* Nó a mais de propósito, e o mínimo possível: o painel externo
                carrega o `sticky` e a SOMBRA, o interno carrega o recorte, o
                `overflow` e a superfície. Fundidos num nó só, o `clip-path`
                cortaria a própria sombra (ele é aplicado depois do `filter`) — a
                razão está escrita em `solutions-story.css`. O interno é
                `absolute; inset: 0`, então as dimensões do painel, o `sticky` e o
                crossfade das quatro camadas seguem idênticos. */}
            <div className="story-solucoes__midia-recorte">
              {SOLUTIONS.map((s, i) => (
                <div
                  key={s.id}
                  className="story-media__item story-midia__item"
                  data-active={i === ativo ? 'true' : 'false'}
                >
                  {/* `image` é opcional no tipo `Solution` (a página de Soluções
                      reaproveita os mesmos dados sem foto). Sem a guarda, uma
                      solução sem imagem viraria erro de tipo — e em runtime, um
                      `<img>` sem `src`. O painel então fica só com a superfície. */}
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.imageAlt ?? ''}
                      fill
                      sizes="(max-width: 1023px) 100vw, 56vw"
                      /* A primeira já foi pré-carregada pela cópia em fluxo, que
                         também é o fallback SSR/no-JS. Aqui ela só precisa ser
                         descoberta imediatamente quando o palco é promovido. */
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
