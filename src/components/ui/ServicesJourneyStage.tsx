'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { SOLUTIONS } from '@/data/solutions';
import './services-journey-stage.css';

/**
 * Registro em quatro movimentos: vídeo preso ao lado, cards empilhando por baixo.
 *
 * Layout portado da seção "Transição visual | do sinal ao entendimento"
 * (`#registro`) do projeto `apresentação/site`
 * (`components/sections/JourneyStage.tsx`). Aqui ele passa a ser o corpo da
 * seção "Diferenciais / Serviços" de `/solucoes`, no lugar da grade
 * `grid-cols-1 sm:grid-cols-2` de quatro cards que existia antes.
 *
 * Estrutura: grid de duas colunas — à esquerda o vídeo, `position: sticky`, à
 * direita os cards, cada um com a sua altura de tela. O card no topo da pilha é
 * o que recebe a ênfase; os que já passaram recuam, desfocam e ficam atrás.
 *
 * Cada card é um artigo no fluxo, e isso é deliberado: com o JavaScript morto,
 * com movimento reduzido ou numa coluna só, os quatro continuam lidos de cima a
 * baixo sem nenhuma regra extra. O que se perde fora da vez é só a ênfase.
 *
 * Diferenças em relação à origem, todas por causa do contexto desta página:
 *
 *   - São QUATRO cards, não três (`SOLUTIONS`). O empilhamento não tem número
 *     fixo — `--depth` é calculado, então N funciona.
 *   - A seção aqui é ESCURA (navy), e na origem era clara. O vídeo é o mesmo, o
 *     card virou navy opaco. Ver a nota em `.svc-journey-card` em
 *     `services-journey-stage.css`: ele NÃO pode usar `.glass-card`, que é
 *     translúcido, porque os cards se sobrepõem.
 *   - `SOLUTIONS` não tem `tag` nem `meta`, então o cabeçalho do card é só o
 *     número (01–04) e o filete, e não há lista de termos no pé.
 *   - O número usa a `color` de cada solução, como fazia a grade antiga.
 *   - A abertura tem DOIS parágrafos, e não um só como na origem. Ela é mais
 *     alta, e é por isso que a altura dela é MEDIDA (`--svc-intro-h`) em vez de
 *     estimada no CSS: é esse número que os cards usam para saber onde parar sem
 *     cobrir o texto preso acima deles.
 *
 * A cópia vem por prop, de `app/solucoes/page.tsx`: é escrita da página, e o
 * lock de conteúdo (`scripts/copy-lock.mjs`) trata a página como a casa dela.
 */
export default function ServicesJourneyStage({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}) {
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);
  const blocks = useRef<Array<HTMLElement | null>>([]);
  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      blocks.current[index] = node;
    },
    [],
  );
  const cursor = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const steps = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLElement>(null);
  const [hint, setHint] = useState(false);

  /*
   * A altura da abertura, medida e publicada em `--svc-intro-h`.
   *
   * Ela não pode ser um número fixo no CSS: são dois parágrafos que reflui a cada
   * largura de coluna, e é essa altura que define onde os cards travam
   * (`.svc-journey-step { top }`) e quanto respiro o baralho ganha no topo. Errar
   * para baixo faz o primeiro card cobrir o texto; para cima, abre um vão.
   *
   * `document.fonts.ready` não é redundância com o ResizeObserver: a primeira
   * medição acontece com a fonte de fallback ainda no lugar, e a troca para a
   * fonte real muda a altura do bloco sem passar por um resize do elemento.
   */
  useEffect(() => {
    const node = intro.current;
    const host = steps.current;
    if (!node || !host) return;

    const measure = () => {
      host.style.setProperty('--svc-intro-h', `${node.getBoundingClientRect().height}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => observer.disconnect();
  }, []);

  /*
   * O laço.
   *
   * Um vídeo só, com `loop`, e nada por cima da emenda. Ele só roda enquanto está
   * na tela: 15 MB decodificando embaixo do rodapé é gasto de bateria por nada.
   * Em movimento reduzido o vídeo fica no primeiro quadro — é a única imagem que
   * a cena tem, então parar é melhor do que esconder.
   */
  useEffect(() => {
    const node = video.current;
    if (!node) return;

    if (rm) {
      node.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void node.play().catch(() => undefined);
        else node.pause();
      },
      { threshold: 0.1 },
    );
    if (stage.current) observer.observe(stage.current);

    return () => observer.disconnect();
  }, [rm]);

  /*
   * Qual card está em leitura — contando quantos já grudaram no topo.
   *
   * Aqui NÃO serve um IntersectionObserver de faixa central. Ele funciona quando
   * os blocos rolam; estes ficam presos: uma vez grudados, os quatro ocupam a
   * mesma linha e a faixa ao mesmo tempo, e o observador só reage a quem ENTRA
   * nela — subir o scroll nunca devolveria a etapa anterior.
   *
   * `offsetTop` num elemento `sticky` NÃO é a posição de layout: medido no
   * Chrome, ele acompanha o deslocamento do travamento (os blocos travados
   * reportam todos exatamente a linha de travamento, e o valor cresce junto com
   * o scroll). O que faz a conta funcionar é justamente isso: todo bloco já
   * travado satisfaz a comparação, o laço guarda o ÚLTIMO, e esse é o que está
   * por cima da pilha — que é o card em leitura. A conta é idêntica nos dois
   * sentidos do scroll, e é por isso que ela serve onde um IntersectionObserver
   * não serviria.
   *
   * `rAF` porque o evento de scroll dispara muito mais do que uma vez por quadro,
   * e cada `setActive` repintaria a seção. `passive` porque nada aqui cancela o
   * scroll.
   */
  useEffect(() => {
    const host = steps.current;
    if (!host) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const nodes = blocks.current.filter((node): node is HTMLElement => Boolean(node));
      if (!nodes.length) return;

      /* A linha de travamento é o `top` do próprio bloco, resolvido pelo browser:
         ele vem de `calc()` no CSS, e refazer essa conta em JavaScript seria
         manter dois números que precisam concordar. */
      const pin = Number.parseFloat(getComputedStyle(nodes[0]).top);
      if (Number.isNaN(pin)) return;

      const origin = host.getBoundingClientRect().top;
      let current = 0;
      nodes.forEach((node, index) => {
        /* +1px de folga: em zoom fracionário o topo grudado cai em 8.999… e o
           card piscaria entre duas etapas. */
        if (origin + node.offsetTop <= pin + 1) current = index;
      });

      setActive((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /*
   * A dica que segue o ponteiro: "role para seguir".
   *
   * A posição é escrita direto no `style` do nó, e não em estado do React — um
   * `setState` por evento de `pointermove` re-renderiza a seção inteira dezenas
   * de vezes por segundo. Só a visibilidade é estado, porque ela muda uma vez por
   * entrada e uma por saída.
   *
   * `pointerType`: mouse apenas. Num toque não há ponteiro para seguir, e a dica
   * apareceria travada onde o dedo tocou por último.
   */
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    cursor.current?.style.setProperty('--cx', `${event.clientX - box.left}px`);
    cursor.current?.style.setProperty('--cy', `${event.clientY - box.top}px`);
    if (!hint) setHint(true);
  };

  return (
    <div className="svc-journey-body">
      {/* O invólucro existe para o `sticky` ter contra o que se prender: um
          elemento `sticky` só percorre a altura do PAI, e o pai aqui é a coluna,
          não o grid. */}
      <div className="svc-journey-stage-wrap">
        {/* O palco é o vídeo, e nada mais: sem moldura, sem legenda. Quem diz a
            etapa em leitura são os cards ao lado — o vídeo roda igual nos quatro,
            então uma legenda no palco só repetiria o card.
            `muted` é o que autoriza o autoplay, e `playsInline` é o que impede o
            iOS de abrir o vídeo em tela cheia. `aria-hidden`: é ilustração. */}
        <figure ref={stage} className="svc-journey-stage">
          <video
            ref={video}
            className="svc-journey-video"
            src="/videos/jornada.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
          />
        </figure>
      </div>

      <div
        ref={steps}
        className="svc-journey-steps"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHint(false)}
      >
        {/* Só até o penúltimo card: no último não há para onde rolar, e a dica
            viraria promessa falsa. */}
        <span
          ref={cursor}
          className="svc-journey-cursor"
          data-visible={hint && active < SOLUTIONS.length - 1}
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 16">
            <path d="M6 1v12M2 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          Role para seguir
        </span>

        {/* A abertura, presa no topo desta coluna — o título acompanha a pilha
            inteira em vez de ficar para trás no primeiro rolar.

            O trilho por fora existe porque a abertura é mais BAIXA que um card:
            no mesmo bloco continente ela ficaria presa mais TEMPO que todos eles,
            e o último card acabaria passando por cima do título. O trilho termina
            `--svc-tail` antes do fim da coluna, então a abertura solta primeiro e
            a ordem de saída se inverte. */}
        <div className="svc-journey-head">
          <header ref={intro} className="svc-journey-intro">
            <span className="tag-section">{eyebrow}</span>
            <h2>{title}</h2>
            {paragraphs.map((texto) => (
              <p key={texto} className="svc-journey-lead">
                {texto}
              </p>
            ))}
          </header>
        </div>

        <div className="svc-journey-deck">
          {SOLUTIONS.map((s, index) => (
            <article
              key={s.id}
              id={`servico-${s.id}`}
              ref={register(index)}
              data-index={index}
              /* `--depth` é a distância até o card em leitura, e é o que dá
                 profundidade à pilha: quanto mais fundo, mais ele recua e
                 encolhe. Sem isso, dois cards já passados receberiam o mesmo
                 recuo, ficariam exatamente um sobre o outro e a pilha leria como
                 dois cards, não como quatro camadas. */
              style={{ '--depth': Math.max(0, active - index) } as React.CSSProperties}
              className={
                index === active
                  ? 'svc-journey-step is-active'
                  : index < active
                    ? 'svc-journey-step is-before'
                    : 'svc-journey-step is-after'
              }
            >
              <div className="svc-journey-card">
                <p className="svc-journey-number">
                  <span className="tabular-nums" style={{ color: s.color }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </p>
                <h3>{s.title}</h3>
                <p className="svc-journey-text">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
