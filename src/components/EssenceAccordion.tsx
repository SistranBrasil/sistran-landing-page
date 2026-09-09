'use client';

/**
 * Nossa essência — Missão, Valores e Pilares em três faixas horizontais.
 *
 * ── O que o React controla, e o que ele não controla ────────────────────────
 * O React guarda UMA coisa: qual faixa está aberta. Todo o resto — altura do
 * painel, degradê azul-gelo, rotação do chevron, cascata do texto, linha lateral
 * — é CSS reagindo a `data-aberta` / `data-open`. Não há medição de altura, nem
 * `requestAnimationFrame`, nem `setInterval` em lugar nenhum: o único movimento
 * contínuo da seção são `@keyframes` dentro do palco 3D.
 *
 * ── A rolagem abre a próxima faixa, mas não do jeito do SIS-79 ─────────────
 * O SIS-79 derivava um índice de 0 a 2 do PROGRESSO da rolagem sobre a seção. O
 * defeito era estrutural: a seção mede mais de uma tela, então qualquer trecho de
 * rolagem gasto lendo a Missão era trecho que avançava para Valores, e o texto era
 * arrancado no meio da leitura. O SIS-98 removeu aquilo.
 *
 * O que existe agora não é o mesmo mecanismo. Quem decide é a POSIÇÃO do
 * cabeçalho de cada faixa: um observador com a raiz reduzida a uma linha no meio
 * da janela abre a faixa cujo cabeçalho cruza aquela linha. Enquanto o painel
 * aberto está sendo lido, o cabeçalho seguinte está abaixo da linha e nada
 * acontece; ele só cruza depois que o painel inteiro passou. Ler nunca troca a
 * faixa — passar dela troca.
 *
 * ── E a rolagem não pula quando a troca acontece ────────────────────────────
 * Trocar a faixa fecha um painel de ~490px ACIMA do ponto que a pessoa está
 * olhando, e sem compensar isso a página salta essa distância inteira. Então a
 * troca por rolagem mede o cabeçalho antes e depois e desconta a diferença do
 * scroll, no mesmo quadro — âncora de rolagem feita à mão, porque a nativa não
 * cobre transições de altura.
 *
 * ── Por que não `height: auto` ──────────────────────────────────────────────
 * `grid-template-rows: 0fr → 1fr` anima até a altura do conteúdo sem que ninguém
 * precise saber quanto ele mede. Ver o comentário em `essence-accordion.css`.
 *
 * ── O visual é uma peça 3D, não mais um desenho em SVG ─────────────────────
 * Os três SVGs (bússola, órbita, estrutura) saíram. No lugar entra
 * `EssenceHologram`: um render por faixa (Missão, Valores, Pilares têm arte
 * própria) num palco com perspectiva, que o visitante gira arrastando ou com as
 * setas. Ele é o ÚNICO pedaço desta seção com
 * movimento próprio — o pulso do halo e a flutuação —, e é ele também que carrega
 * a única interação de ponteiro que não é o clique nas faixas.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import EssenceHologram from '@/components/ui/EssenceHologram';
import { ESSENCIA, ESSENCIA_INICIAL, type ItemEssencia } from '@/data/essencia';
import './essence-accordion.css';

/* Folga do cabeçalho fixo, para o painel recém-aberto não nascer atrás dele. */
const FOLGA_CABECALHO = 96;

/* Quanto tempo a troca por rolagem fica surda depois de uma troca por clique. O
   clique rola a página por conta própria (600ms de espera + 700ms de animação), e
   durante essa viagem os cabeçalhos atravessam a linha do meio — sem a trava, o
   clique em "Pilares" abriria "Valores" no caminho. */
const TRAVA_APOS_CLIQUE = 1700;

/* ── Cabeçalho ───────────────────────────────────────────────────────────── */
function EssenceHeader({ tituloId }: { tituloId: string }) {
  return (
    <header>
      <span className="essence-eyebrow">Nossa essência</span>
      <div className="essence-risco" aria-hidden />
      <h2 id={tituloId} className="essence-title">
        O que sustenta nossa forma de atuar
      </h2>
    </header>
  );
}

function ChevronIcon() {
  return (
    <span className="essence-chevron" aria-hidden>
      <svg width={22} height={22} viewBox="0 0 24 24" focusable="false">
        <path
          d="M5 9 L12 16 L19 9"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/* ── Faixa ───────────────────────────────────────────────────────────────── */
function EssenceAccordionItem({
  item,
  active,
  onActivate,
  onNavegar,
  refBotao,
}: {
  item: ItemEssencia;
  active: boolean;
  onActivate: () => void;
  onNavegar: (tecla: string) => void;
  refBotao: (el: HTMLButtonElement | null) => void;
}) {
  const painelId = `essence-panel-${item.id}`;
  const botaoId = `essence-trigger-${item.id}`;
  const lista = Array.isArray(item.conteudo);

  return (
    <article className="essence-item" data-aberta={active}>
      <button
        ref={refBotao}
        id={botaoId}
        type="button"
        className="essence-trigger"
        aria-expanded={active}
        aria-controls={painelId}
        /* Clicar na faixa já aberta não fecha tudo: sempre há uma aberta. */
        onClick={onActivate}
        onKeyDown={(e) => {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
            e.preventDefault();
            onNavegar(e.key);
          }
        }}
      >
        <span className="essence-item-title">{item.titulo}</span>
        <span className="essence-item-line" aria-hidden />
        <ChevronIcon />
      </button>

      <div
        className="essence-content"
        id={painelId}
        role="region"
        aria-labelledby={botaoId}
        data-open={active}
        /* Fechado não recebe foco nem leitura: `inert` cobre os dois de uma vez,
           e ao contrário de `hidden` ele deixa a transição de altura acontecer. */
        inert={!active}
      >
        <div className="essence-content-clip">
          <div className="essence-content-inner">
            <div className="essence-active-line" aria-hidden />
            {/* Sem `h3` aqui (SIS-98): o título já é o cabeçalho da faixa, ao
                lado da linha e do chevron, e repeti-lo em corpo grande dentro do
                painel dizia "Missão" duas vezes na mesma tela — inclusive para o
                leitor de tela, que já recebe o painel rotulado por aquele botão
                via `aria-labelledby`. */}
            <div className="essence-copy">
              {lista ? (
                <ul className="essence-pillars">
                  {(item.conteudo as readonly string[]).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.conteudo as string}</p>
              )}
              {item.nota ? <p className="essence-footnote">{item.nota}</p> : null}
            </div>
            <EssenceHologram
              arte={item.arte}
              alt={item.arteAlt}
              largura={item.largura}
              altura={item.altura}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Seção ───────────────────────────────────────────────────────────────── */
export default function EssenceAccordion() {
  const tituloId = useId();
  const secaoRef = useRef<HTMLElement | null>(null);
  const botoesRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [ativa, setAtiva] = useState<ItemEssencia['id']>(ESSENCIA_INICIAL);
  const [entrou, setEntrou] = useState(false);

  /* Entrada uma vez só, a ~25% de visibilidade. O observador se desliga assim
     que dispara — nada é reavaliado na volta da rolagem. */
  useEffect(() => {
    const alvo = secaoRef.current;
    if (!alvo) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.intersectionRatio >= 0.25) {
          setEntrou(true);
          obs.disconnect();
        }
      },
      { threshold: [0.25] },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  /* Até quando ignorar a troca por rolagem. Ref e não estado: mudar isto não pode
     re-renderizar nada, e ninguém o lê durante a renderização. */
  const travadaAte = useRef(0);
  /* O que compensar depois da próxima troca por rolagem: o botão que cruzou a
     linha e onde ele estava na janela ANTES do painel fechar. */
  const ancora = useRef<{ el: HTMLButtonElement; top: number } | null>(null);

  /**
   * A rolagem abre a próxima faixa. A raiz do observador é reduzida a UMA LINHA no
   * meio da janela por `rootMargin: -50% 0 -50% 0`, então "intersecta" quer dizer
   * "este cabeçalho está passando pelo meio da tela" — não "está visível". É essa
   * troca de pergunta que separa isto do SIS-79: ver o cabeçalho do arquivo.
   */
  useEffect(() => {
    const botoes = botoesRef.current.filter((b): b is HTMLButtonElement => Boolean(b));
    if (botoes.length !== ESSENCIA.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        if (Date.now() < travadaAte.current) return;
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = botoes.indexOf(entrada.target as HTMLButtonElement);
          if (i < 0) continue;
          const id = ESSENCIA[i].id;
          setAtiva((atual) => {
            if (atual === id) return atual;
            /* Guarda a posição ANTES da troca. O `useLayoutEffect` abaixo mede de
               novo depois e desconta a diferença — é essa dupla que impede o salto
               de quando o painel de cima fecha. */
            ancora.current = { el: botoes[i], top: entrada.boundingClientRect.top };
            return id;
          });
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    botoes.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, []);

  /**
   * Desconta o deslocamento causado pela troca por rolagem. `useLayoutEffect` e não
   * `useEffect`: precisa acontecer ANTES do navegador pintar, senão o salto aparece
   * por um quadro — e um quadro de salto de 490px é bem visível.
   *
   * Corrige a posição imediata, medida na hora. A transição de altura continua
   * rodando depois disto e ainda move o conteúdo, mas devagar e por 560ms, que é
   * movimento de acordeão abrindo — não é o salto.
   */
  useLayoutEffect(() => {
    const a = ancora.current;
    ancora.current = null;
    if (!a) return;
    const delta = a.el.getBoundingClientRect().top - a.top;
    if (Math.abs(delta) < 1) return;
    const destino = window.scrollY + delta;
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }
    ).__lenis;
    /* `immediate` porque isto é correção, não navegação: animar a compensação seria
       exatamente o movimento que ela existe para cancelar. */
    if (lenis) lenis.scrollTo(destino, { immediate: true });
    else window.scrollTo({ top: destino, behavior: 'auto' });
  }, [ativa]);

  /**
   * Teclado entre as faixas. Move o foco e abre — é o comportamento esperado de
   * um accordion de faixa única, e mantém a ordem Missão → Valores → Pilares.
   */
  const navegar = useCallback((indice: number, tecla: string) => {
    /* Mesma trava do clique: o `focus()` abaixo rola a página até o botão, e essa
       rolagem cruzaria a linha do meio. */
    travadaAte.current = Date.now() + TRAVA_APOS_CLIQUE;
    const ultimo = ESSENCIA.length - 1;
    const destino =
      tecla === 'Home'
        ? 0
        : tecla === 'End'
          ? ultimo
          : tecla === 'ArrowDown'
            ? Math.min(indice + 1, ultimo)
            : Math.max(indice - 1, 0);

    setAtiva(ESSENCIA[destino].id);
    botoesRef.current[destino]?.focus();
  }, []);

  /**
   * Abrir uma faixa TRAZ a faixa para a tela — em qualquer largura, e não só no
   * celular como antes (SIS-98). A seção mede mais de uma tela: clicar em
   * "Valores" com a página no cabeçalho abria um painel inteiramente abaixo da
   * dobra, e nada indicava que ele havia aberto. O destino é o próprio botão
   * logo abaixo do cabeçalho fixo, o que deixa o painel inteiro na tela.
   *
   * Só age quando precisa: se a faixa já está numa posição de leitura, a página
   * fica onde está — rolar sem motivo é tão desorientador quanto não rolar.
   */
  const ativar = useCallback((id: ItemEssencia['id'], indice: number) => {
    travadaAte.current = Date.now() + TRAVA_APOS_CLIQUE;
    /* Sem âncora aqui: o clique QUER que a página se mova, e compensar o
       deslocamento anularia a rolagem logo abaixo. */
    ancora.current = null;
    setAtiva(id);
    const botao = botoesRef.current[indice];
    if (!botao) return;
    const rmAgora = prefersReducedMotion();
    /* A medição espera a faixa anterior FECHAR. Num `requestAnimationFrame` ela
       ainda está aberta, e o botão de destino está ~490px mais abaixo do que
       ficará: medido, a página passava exatamente essa distância e o painel dos
       Pilares parava em `top: -393`, com o começo da lista acima da dobra. O
       prazo é a transição de altura do CSS (560ms; 140ms sob movimento
       reduzido). */
    window.setTimeout(
      () => {
        const { top } = botao.getBoundingClientRect();
        if (top >= FOLGA_CABECALHO * 0.6 && top <= window.innerHeight * 0.35) return;
        const destino = Math.max(0, top + window.scrollY - FOLGA_CABECALHO);
        const rm = rmAgora;
        /* Lenis primeiro, `window.scrollTo` como reserva — mesmo par do
         `Metrics.irParaIndicador`. O Lenis guarda a própria posição animada e
         ignora um `window.scrollTo` feito por fora: medido, o painel dos Pilares
         parava em `top: -295` (o começo da lista acima da dobra) porque a página
         não saía do lugar. */
        const lenis = (
          window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }
        ).__lenis;
        if (lenis) lenis.scrollTo(destino, { duration: rm ? 0 : 0.7 });
        else window.scrollTo({ top: destino, behavior: rm ? 'auto' : 'smooth' });
      },
      rmAgora ? 160 : 600,
    );
  }, []);

  return (
    <section
      ref={secaoRef}
      className="essence-section"
      aria-labelledby={tituloId}
      data-entrou={entrou ? '1' : '0'}
    >
      <div className="essence-container">
        <EssenceHeader tituloId={tituloId} />
      </div>

      {/* Fora do container de propósito: são as linhas das faixas que atravessam
          a janela. O texto volta ao alinhamento da página pelo padding interno. */}
      <div className="essence-accordion">
        {ESSENCIA.map((item, i) => (
          <EssenceAccordionItem
            key={item.id}
            item={item}
            active={ativa === item.id}
            onActivate={() => ativar(item.id, i)}
            onNavegar={(tecla) => navegar(i, tecla)}
            refBotao={(el) => {
              botoesRef.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
