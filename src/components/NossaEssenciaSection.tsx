'use client';

/**
 * Nossa Essência — Missão · Valores · Pilares, num campo claro onde o conteúdo
 * troca conforme a rolagem.
 *
 * MOCK VIGENTE: `public/valores.png`, do pedido em chat «na sessao valores pilares
 * e missao deve ser feita exatamente assim … com os componente». Ela substitui
 * `public/ms.png` (SIS-260) e, com ela, a parte de COMPOSIÇÃO de
 * `docs/missao,valores.md` — o que daquele documento continua valendo está citado
 * onde vale.
 *
 * ── O que saiu do arranjo anterior, e por quê ───────────────────────────────
 * Saiu o PAINEL NAVY, e com ele tudo que existia para morar dentro dele:
 *
 *   • `EssenciaPreviewTabs` — as duas abas claras que espiavam por baixo da base
 *     do painel, com «02 Valores» / «03 Pilares». Sem painel não há base por onde
 *     espiar, e a mock nova não as tem. A navegação pelo trilho faz o mesmo
 *     trabalho (e sempre fez: `irPara` era compartilhado pelos dois).
 *   • O SELO — o quadradinho arredondado com o ícone do estado (bússola, gema,
 *     colunas) acima do título. Ele era desenhado para ler sobre navy; num campo
 *     claro voltaria a ser uma caixinha escura, a silhueta que este arranjo tira.
 *     O `createElement(getIcon(item.selo), …)` que o montava saiu com ele — junto
 *     com o motivo de ser `createElement` e não `const Selo = getIcon(...)`, que
 *     era a regra `react-hooks/static-components`. O campo `selo` segue em
 *     `src/data/essencia.ts` e os ícones seguem registrados em `src/lib/icons.ts`.
 *   • As ETIQUETAS EM PÍLULA (`EssenciaTags`) — viraram uma fileira corrida
 *     separada por pontos ciano, que é como a mock imprime os cinco valores.
 *   • A DECORAÇÃO de oito nós (grade pontilhada, duas linhas finas, três pontos,
 *     dois quartos de arco) — a mock nova tem UM arco só, enorme e pálido, à
 *     direita.
 *
 * ── O que NÃO saiu: o mecanismo ─────────────────────────────────────────────
 * O índice ativo continua a NÃO ser progresso de rolagem. A trilha mede 300vh e
 * abriga TRÊS SENTINELAS de 100vh, empilhadas, invisíveis e sem conteúdo. Um
 * `IntersectionObserver` com `rootMargin: -50% 0 -50% 0` reduz a raiz a uma LINHA
 * no meio da janela: «intersecta» passa a significar «esta sentinela está cruzando
 * o meio da tela». Como as três cobrem a trilha inteira sem vão nem sobreposição,
 * existe sempre exatamente UMA cruzando a linha — o estado nunca fica indefinido.
 *
 * Isso é deliberadamente diferente de derivar um índice de `scrollTop / altura`,
 * que foi o defeito do SIS-79 (e que o SIS-98 removeu): ler um percentual a cada
 * pixel obriga a recalcular em todo quadro e dá o índice errado na borda entre
 * dois estados. Aqui o navegador faz a conta, e ela é discreta.
 *
 * ── Por que há uma trava de tempo ───────────────────────────────────────────
 * Clicar em «Pilares» rola até a terceira sentinela, e no caminho a linha do meio
 * atravessa a segunda. Sem a trava, o clique em Pilares acenderia Valores no meio
 * da viagem e o conteúdo trocaria duas vezes.
 *
 * ── Uma árvore de DOM só, para desktop e celular ────────────────────────────
 * O celular não usa sticky: os três estados aparecem em sequência vertical. Isso
 * NÃO é uma segunda árvore de JSX — as três camadas já existem no DOM (é o que
 * permite o crossfade sem remontar imagem). Renderizar duas versões daria conteúdo
 * duplicado para o leitor de tela e para o `copy-lock`.
 *
 * ── `inert` só existe no modo sticky ────────────────────────────────────────
 * Sobrepostas, as duas camadas inativas estão na tela mas invisíveis: precisam
 * sair do foco e da leitura. Empilhadas no celular, as três são conteúdo visível e
 * `inert` esconderia dois terços da seção. Como só o cliente sabe qual é o caso,
 * `sticky` nasce `false` e converge depois de montar — o servidor e o primeiro
 * quadro do cliente renderizam a mesma árvore, sem divergência de hidratação
 * (mesma receita de `useReducedMotion`, em `src/lib/motion.ts`).
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { ESSENCIA, ESSENCIA_INICIAL, type ItemEssencia } from '@/data/essencia';
import './nossa-essencia.css';

type IdEssencia = ItemEssencia['id'];

/* A largura a partir da qual a seção é sticky. É o MESMO valor do `@media` de
   `nossa-essencia.css` — se um dos dois mudar sozinho, o `inert` passa a valer
   para um arranjo que não é o da tela. */
const LARGURA_STICKY = 1024;

/* Folga do cabeçalho fixo, para a sentinela de destino não parar atrás dele. */
const FOLGA_CABECALHO = 96;

/* Quanto tempo a troca por rolagem fica surda depois de um clique no trilho.
   Cobre a animação do Lenis (0,7s) com margem para a inércia do fim. */
const TRAVA_APOS_CLIQUE = 1100;

/* ── Trilho ──────────────────────────────────────────────────────────────── */
function EssenciaNavigation({ ativo, onIr }: { ativo: IdEssencia; onIr: (i: number) => void }) {
  return (
    <nav className="ne-nav" aria-label="Nossa Essência">
      <ul className="ne-passos">
        {ESSENCIA.map((item, i) => (
          <li key={item.id} className="ne-passo" data-ativo={item.id === ativo}>
            <button
              type="button"
              className="ne-passo-botao"
              /* `aria-current` e não `aria-pressed`: não é um interruptor, é o
                 item vigente de uma navegação. */
              aria-current={item.id === ativo ? 'true' : undefined}
              onClick={() => onIr(i)}
            >
              {item.titulo}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Visual ──────────────────────────────────────────────────────────────── */
function EssenciaVisual({ item, primeiro }: { item: ItemEssencia; primeiro: boolean }) {
  return (
    <div className="ne-visual">
      <Image
        src={item.arte}
        /* Decorativa: o texto do estado já diz tudo o que a arte ilustra. Ver a
           nota de `arteAlt` em `src/data/essencia.ts`. */
        alt=""
        aria-hidden
        width={item.largura}
        height={item.altura}
        /* Só a Missão é `priority`: é a única que aparece sem rolar dentro da
           seção. As outras duas são as camadas de trás do crossfade. */
        priority={primeiro}
        loading={primeiro ? undefined : 'lazy'}
        /* Com `images: { unoptimized: true }` (SIS-154) o `sizes` não gera
           `srcset` e não muda o que é baixado hoje; fica declarado porque é a
           caixa real — 400px, e 440px acima de 1440 — e volta a valer no dia em
           que a otimização for religada. */
        sizes="(min-width: 1440px) 440px, (min-width: 1024px) 400px, 70vw"
        className="ne-visual-img"
      />
    </div>
  );
}

/* ── Conteúdo de um estado ───────────────────────────────────────────────── */
function EssenciaContent({
  item,
  indice,
  ativo,
  sticky,
}: {
  item: ItemEssencia;
  indice: number;
  ativo: boolean;
  sticky: boolean;
}) {
  const pilares = Array.isArray(item.conteudo) ? (item.conteudo as readonly string[]) : null;
  /* A linha de apoio: `subtitulo` quando existe, senão o próprio `conteudo` se ele
     for frase única. Quem tem `subtitulo` não repete o `conteudo` aqui — em
     Valores ele são os cinco valores, que já aparecem na fileira de pontos. */
  const frase = item.subtitulo ?? (pilares ? null : (item.conteudo as string));

  return (
    <article
      className="ne-camada"
      data-ativo={ativo}
      /* Ver o cabeçalho: `inert` vale só sobreposto. Empilhado, as três camadas
         são o conteúdo da seção. */
      inert={sticky && !ativo}
    >
      <div className="ne-texto">
        <h3 className="ne-titulo">{item.titulo}</h3>

        {frase ? <p className="ne-frase">{frase}</p> : null}

        {item.nota ? <p className="ne-nota">{item.nota}</p> : null}

        {pilares ? (
          <ul className="ne-pilares">
            {pilares.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}

        {item.tags ? (
          <ul className="ne-pontos">
            {item.tags.map((t) => (
              <li key={t} className="ne-ponto">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <EssenciaVisual item={item} primeiro={indice === 0} />
    </article>
  );
}

/* ── Seção ───────────────────────────────────────────────────────────────── */
export default function NossaEssenciaSection() {
  const tituloId = useId();
  const sentinelasRef = useRef<(HTMLDivElement | null)[]>([]);
  const travadaAte = useRef(0);

  const [ativo, setAtivo] = useState<IdEssencia>(ESSENCIA_INICIAL);
  const [sticky, setSticky] = useState(false);

  const ultimo = ESSENCIA[ESSENCIA.length - 1].id;

  /* Nasce `false` no servidor e no primeiro quadro; converge depois de montar. */
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LARGURA_STICKY}px)`);
    const aplicar = () => setSticky(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  /* Quem cruza a linha do meio da janela manda. Ver o cabeçalho. */
  useEffect(() => {
    const sentinelas = sentinelasRef.current.filter((s): s is HTMLDivElement => Boolean(s));
    if (sentinelas.length !== ESSENCIA.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        if (Date.now() < travadaAte.current) return;
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = sentinelas.indexOf(entrada.target as HTMLDivElement);
          if (i < 0) continue;
          setAtivo(ESSENCIA[i].id);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    sentinelas.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /**
   * Clique no trilho: rola até o MEIO da sentinela do estado, que é o ponto em que
   * o observador o reconhece. Levar até o topo dela pararia a página exatamente na
   * borda entre dois estados, onde meio pixel decide qual acende.
   */
  const irPara = useCallback((indice: number) => {
    travadaAte.current = Date.now() + TRAVA_APOS_CLIQUE;
    /* Acende na hora: a viagem demora 0,7s e a trava deixa o observador surdo
       durante ela, então sem isto o conteúdo só trocaria ao chegar. */
    setAtivo(ESSENCIA[indice].id);

    const sentinela = sentinelasRef.current[indice];
    if (!sentinela) return;
    const caixa = sentinela.getBoundingClientRect();
    /* Sem sticky (celular) a sentinela tem altura zero: aí o destino é ela mesma,
       logo abaixo do cabeçalho. */
    const meio = caixa.height > 0 ? caixa.height / 2 - window.innerHeight / 2 : -FOLGA_CABECALHO;
    const destino = Math.max(0, caixa.top + window.scrollY + meio);

    /* Lenis primeiro, `window.scrollTo` como reserva — o Lenis guarda a própria
       posição animada e ignora um `window.scrollTo` feito por fora (medido no
       SIS-98, mesmo par em `Metrics.irParaIndicador`). */
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }
    ).__lenis;
    if (lenis) lenis.scrollTo(destino, { duration: 0.7 });
    else window.scrollTo({ top: destino, behavior: 'smooth' });
  }, []);

  return (
    <section className="ne-secao" aria-labelledby={tituloId}>
      {/* O arco ciano pálido do lado direito — o único elemento decorativo da mock
          nova. Em CSS, sem imagem. */}
      <div className="ne-decor" aria-hidden>
        <span className="ne-decor-arco" />
      </div>

      <div className="ne-trilha">
        {/* As três sentinelas. Sem conteúdo e sem tamanho próprio no celular: são
            só régua para o observador. */}
        {ESSENCIA.map((item, i) => (
          <div
            key={item.id}
            className="ne-sentinela"
            aria-hidden
            ref={(el) => {
              sentinelasRef.current[i] = el;
            }}
          />
        ))}

        <div className="ne-palco">
          <div className="ne-grade">
            {/* «— NOSSA ESSÊNCIA» É o cabeçalho da seção, e não um rótulo
                decorativo: sem `h2` a seção ficaria sem nome no esqueleto de
                cabeçalhos, e um `sr-only` extra faria a mesma palavra existir duas
                vezes. O traço ciano é `aria-hidden` porque é tinta. */}
            <h2 id={tituloId} className="ne-rotulo">
              <span className="ne-rotulo-traco" aria-hidden />
              Nossa Essência
            </h2>

            <EssenciaNavigation ativo={ativo} onIr={irPara} />

            <div className="ne-palco-conteudo">
              {ESSENCIA.map((item, i) => (
                <EssenciaContent
                  key={item.id}
                  item={item}
                  indice={i}
                  ativo={item.id === ativo}
                  sticky={sticky}
                />
              ))}
            </div>

            {/* Some no último estado: depois dele não há mais para onde rolar
                dentro da seção, e o aviso viraria instrução falsa. `aria-hidden`
                porque é dica visual — quem navega por teclado usa o trilho. */}
            <p className="ne-rolar" data-oculto={ativo === ultimo} aria-hidden>
              <svg width={18} height={18} viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 5 L12 19 M6 13 L12 19 L18 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              Continue rolando
            </p>

            {/* A assinatura manuscrita do canto. Duas linhas por `display: block`
                num `span`: continua UMA frase para leitor de tela. */}
            <p className="ne-assinatura">
              <span className="ne-assinatura-linha">CONHECEMOS</span>
              <span className="ne-assinatura-linha">SEGUROS.</span>
              <svg aria-hidden className="ne-assinatura-traco" viewBox="0 0 45 8" focusable="false">
                <path d="M1 6.2C9 3.6 24 2.2 44 1.8" />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
