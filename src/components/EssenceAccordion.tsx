'use client';

/**
 * Nossa essência — Missão, Valores e Pilares em três faixas horizontais.
 *
 * ── O que o React controla, e o que ele não controla ────────────────────────
 * O React guarda UMA coisa: qual faixa está aberta. Todo o resto — altura do
 * painel, degradê azul-gelo, rotação do chevron, cascata do texto, desenho dos
 * SVGs, linha lateral — é CSS reagindo a `data-aberta` / `data-open`. Não há
 * medição de altura, nem `requestAnimationFrame`, nem `setInterval`: esta seção
 * não tem autoplay.
 *
 * ── Dois donos de `ativa`, sem disputa (SIS-79) ─────────────────────────────
 * Além do clique, a ROLAGEM avança as faixas: um ScrollTrigger deriva um índice
 * de 0 a 2 e só escreve quando ele muda. Os dois donos não empatam porque a
 * rolagem cede — ao primeiro clique ou tecla `comandadoRef` vira `true` e o
 * `onUpdate` passa a ser um no-op, para sempre. E o modo dirigido só existe em
 * `(min-width: 1024px)` sem movimento reduzido: abaixo disso a seção continua o
 * accordion de clique de sempre.
 *
 * ── Por que não `height: auto` ──────────────────────────────────────────────
 * `grid-template-rows: 0fr → 1fr` anima até a altura do conteúdo sem que ninguém
 * precise saber quanto ele mede. Ver o comentário em `essence-accordion.css`.
 *
 * ── Desenho progressivo sem medir path ─────────────────────────────────────
 * Cada traço leva `pathLength={1}`: o navegador reescala o comprimento do traçado
 * para 1, então `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` desenha
 * qualquer forma — círculo, linha ou path — com a mesma regra de CSS e sem um
 * `getTotalLength()` em JavaScript.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import { ESSENCIA, ESSENCIA_INICIAL, type ItemEssencia, type VisualEssencia } from '@/data/essencia';
import './essence-accordion.css';

/* ── Partitura da rolagem (SIS-79) ───────────────────────────────────────────
   Fracoes do percurso da secao. A folga nas duas pontas existe para a Missão
   continuar aberta enquanto o cabecalho entra, e para os Pilares nao trocarem no
   ultimo pixel — a faixa precisa de tempo de leitura depois de aberta. */
const ETAPAS_INICIO = 0.18;
const ETAPAS_FIM = 0.82;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ── Visuais ──────────────────────────────────────────────────────────────────
   Tudo em SVG, sem imagem gerada e sem Canvas. Traços de 1–1.5px, azul médio e
   ciano, `vector-effect="non-scaling-stroke"` para a espessura não engordar
   junto com a escala, e `aria-hidden` porque nenhum deles carrega informação que
   não esteja no texto ao lado. */

const TRACO = {
  fill: 'none',
  vectorEffect: 'non-scaling-stroke' as const,
  strokeLinecap: 'round' as const,
};

/** Grade discreta, comum aos três visuais. */
function Grade() {
  return (
    <g stroke="#087fc7" strokeWidth={1} opacity={0.12} {...TRACO}>
      {[40, 80, 120, 160].map((p) => (
        <line key={`v${p}`} x1={p} y1={16} x2={p} y2={184} />
      ))}
      {[40, 80, 120, 160].map((p) => (
        <line key={`h${p}`} x1={16} y1={p} x2={184} y2={p} />
      ))}
    </g>
  );
}

/** Missão: bússola tecnológica — rosa dos ventos, anéis e quatro nós. */
function Bussola() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden focusable="false">
      <Grade />
      <g stroke="#087fc7" strokeWidth={1.2} opacity={0.55} {...TRACO}>
        <circle cx={100} cy={100} r={74} pathLength={1} data-traco />
        <circle cx={100} cy={100} r={54} pathLength={1} data-traco />
        <circle cx={100} cy={100} r={30} pathLength={1} data-traco />
      </g>
      {/* Rosa dos ventos: dois losangos cruzados, sem letra de direção. */}
      <g stroke="#0ed8f6" strokeWidth={1.4} {...TRACO}>
        <path d="M100 34 L114 100 L100 166 L86 100 Z" pathLength={1} data-traco />
        <path d="M34 100 L100 114 L166 100 L100 86 Z" pathLength={1} data-traco />
      </g>
      <g fill="#0ed8f6" data-node>
        <circle cx={100} cy={26} r={3.5} />
        <circle cx={174} cy={100} r={3.5} />
        <circle cx={100} cy={174} r={3.5} />
        <circle cx={26} cy={100} r={3.5} />
      </g>
      <circle cx={100} cy={100} r={5} fill="#087fc7" data-node />
    </svg>
  );
}

/** Valores: conexão e equilíbrio — composição circular assimétrica. */
function Orbita() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden focusable="false">
      <Grade />
      {/* Órbitas finas, deslocadas: o centro de gravidade não é o centro do
          quadro, e é isso que evita o ar de diagrama de arquitetura. */}
      <g stroke="#087fc7" strokeWidth={1.1} opacity={0.5} {...TRACO}>
        <circle cx={92} cy={104} r={68} pathLength={1} data-traco />
        <ellipse cx={92} cy={104} rx={68} ry={34} pathLength={1} data-traco />
        <ellipse
          cx={92}
          cy={104}
          rx={34}
          ry={68}
          transform="rotate(24 92 104)"
          pathLength={1}
          data-traco
        />
      </g>
      {/* Ligações do nó central aos secundários. */}
      <g stroke="#0ed8f6" strokeWidth={1.3} opacity={0.8} {...TRACO}>
        <line x1={92} y1={104} x2={150} y2={58} pathLength={1} data-traco />
        <line x1={92} y1={104} x2={38} y2={76} pathLength={1} data-traco />
        <line x1={92} y1={104} x2={64} y2={168} pathLength={1} data-traco />
        <line x1={92} y1={104} x2={158} y2={140} pathLength={1} data-traco />
        <line x1={92} y1={104} x2={116} y2={32} pathLength={1} data-traco />
      </g>
      <g fill="#0ed8f6" data-node>
        <circle cx={150} cy={58} r={4} />
        <circle cx={38} cy={76} r={3.2} />
        <circle cx={64} cy={168} r={3.6} />
        <circle cx={158} cy={140} r={3.2} />
        <circle cx={116} cy={32} r={2.8} />
      </g>
      <circle cx={92} cy={104} r={6.5} fill="#087fc7" data-node />
    </svg>
  );
}

/** Pilares: sustentação — verticais, base horizontal e pontos de conexão. */
function Estrutura() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden focusable="false">
      <Grade />
      {/* Seis verticais, uma por pilar, com alturas escalonadas: abstrato, não é
          um prédio. */}
      <g stroke="#087fc7" strokeWidth={1.3} opacity={0.6} {...TRACO}>
        {[
          [38, 74],
          [62, 48],
          [86, 62],
          [110, 34],
          [134, 56],
          [158, 80],
        ].map(([x, y]) => (
          <line key={x} x1={x} y1={y} x2={x} y2={156} pathLength={1} data-traco />
        ))}
      </g>
      {/* Travessas: a base e duas linhas de amarração. */}
      <g stroke="#0ed8f6" strokeWidth={1.4} {...TRACO}>
        <line x1={26} y1={156} x2={172} y2={156} pathLength={1} data-traco />
        <line x1={38} y1={118} x2={158} y2={118} pathLength={1} data-traco opacity={0.6} />
        <line x1={62} y1={86} x2={134} y2={86} pathLength={1} data-traco opacity={0.45} />
      </g>
      <g fill="#0ed8f6" data-node>
        {[
          [38, 74],
          [62, 48],
          [86, 62],
          [110, 34],
          [134, 56],
          [158, 80],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={3.4} />
        ))}
      </g>
    </svg>
  );
}

const VISUAIS: Record<VisualEssencia, () => React.ReactElement> = {
  bussola: Bussola,
  orbita: Orbita,
  estrutura: Estrutura,
};

function EssenceVisual({ visual }: { visual: VisualEssencia }) {
  const Desenho = VISUAIS[visual];
  return (
    <div className="essence-visual" aria-hidden>
      <Desenho />
    </div>
  );
}

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
            <div className="essence-copy">
              <h3>{item.titulo}</h3>
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
            <EssenceVisual visual={item.visual} />
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
  /** Só em tela larga e sem movimento reduzido a rolagem avança as faixas. */
  const [dirigindo, setDirigindo] = useState(false);
  /**
   * `ativa` passa a ter dois donos — clique e rolagem — e eles não podem
   * disputar. Quem cede é a rolagem: ao primeiro clique (ou tecla) este ref vira
   * `true` e não volta. Quem escolheu uma faixa não quer que ela troque sozinha
   * 200px depois.
   */
  const comandadoRef = useRef(false);
  /** Espelho de `ativa` para a guarda do `onUpdate`, que roda fora do render. */
  const ativaRef = useRef<ItemEssencia['id']>(ESSENCIA_INICIAL);

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

  /* Mesmo portão da Metrics: rolagem dirigida é de tela larga e sem movimento
     reduzido. Abaixo disso o accordion é exatamente o que era — clique e
     teclado. A avaliação vive num efeito porque no render o valor tem de ser o
     do servidor. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);

  /**
   * A rolagem avança a faixa (SIS-79).
   *
   * Um ScrollTrigger só, sem `pin` — padrão da casa: `pin: true` remonta o nó e
   * dessincroniza com o Lenis. Do progresso sai um índice de 0 a 2, e `setAtiva`
   * roda **apenas na troca**: sem essa guarda ele dispararia a 60 Hz e a
   * transição de 560ms nunca fecharia, deixando a faixa presa meio-aberta.
   */
  useEffect(() => {
    if (!dirigindo) return;
    const alvo = secaoRef.current;
    if (!alvo) return;

    gsap.registerPlugin(ScrollTrigger);

    const ultimo = ESSENCIA.length - 1;
    const gatilho = ScrollTrigger.create({
      trigger: alvo,
      start: 'top 70%',
      end: 'bottom 60%',
      onUpdate: ({ progress }) => {
        if (comandadoRef.current) return;
        const etapa =
          clamp01((progress - ETAPAS_INICIO) / (ETAPAS_FIM - ETAPAS_INICIO)) * ultimo;
        const id = ESSENCIA[Math.min(ultimo, Math.round(etapa))].id;
        if (id === ativaRef.current) return;
        ativaRef.current = id;
        setAtiva(id);
      },
    });

    /* Só o gatilho DESTA seção: as outras da página têm os seus e sobrevivem a
       este desmonte. */
    return () => gatilho.kill();
  }, [dirigindo]);

  /**
   * Teclado entre as faixas. Move o foco e abre — é o comportamento esperado de
   * um accordion de faixa única, e mantém a ordem Missão → Valores → Pilares.
   */
  const navegar = useCallback((indice: number, tecla: string) => {
    const ultimo = ESSENCIA.length - 1;
    const destino =
      tecla === 'Home'
        ? 0
        : tecla === 'End'
          ? ultimo
          : tecla === 'ArrowDown'
            ? Math.min(indice + 1, ultimo)
            : Math.max(indice - 1, 0);

    /* Escolha explícita: a rolagem para de escrever daqui em diante. */
    comandadoRef.current = true;
    ativaRef.current = ESSENCIA[destino].id;
    setAtiva(ESSENCIA[destino].id);
    botoesRef.current[destino]?.focus();
  }, []);

  /**
   * Abrir uma faixa não rola a página no desktop. No celular a faixa aberta pode
   * empurrar o próprio título para fora do quadro; só nesse caso o título volta
   * para a tela — e nunca durante a rolagem, apenas na ação do usuário.
   */
  const ativar = useCallback((id: ItemEssencia['id'], indice: number) => {
    comandadoRef.current = true;
    ativaRef.current = id;
    setAtiva(id);
    /* O `scrollIntoView` é do caminho do CLIQUE. Se a troca viesse da rolagem,
       ele seria a página brigando com o dedo do usuário — e por isso ele nunca
       aparece no `onUpdate` do ScrollTrigger. */
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    const botao = botoesRef.current[indice];
    if (!botao) return;
    requestAnimationFrame(() => {
      const { top } = botao.getBoundingClientRect();
      if (top < 88 || top > window.innerHeight * 0.6) {
        botao.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
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
