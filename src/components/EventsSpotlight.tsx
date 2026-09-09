"use client";

/**
 * SIS-166 — CENA ÚNICA DE DESTAQUE de `/eventos-inovacao`.
 *
 * Substitui DOIS blocos: o `EventsMosaic` (abertura decorativa) e o `EventsGrid`
 * (o palco de quinze telas com filtros). Os dois continuam no projeto, comentados
 * no `page.tsx` com o motivo — a SIS-160 fica como registro do mosaico que existiu.
 *
 * O desenho: sobretítulo `EVENTOS` entre traços, `Eventos & Inovação` em serifa,
 * um CARTÃO CENTRAL com o evento em destaque (chip do tipo, título, descrição,
 * botão do YouTube e a arte), duas colunas de miniaturas nas bordas, a vaga do
 * evento em destaque VAZIA e tracejada na coluna, fio ciano ligando essa vaga ao
 * cartão, e o contador `01 / 15` com `ROLE PARA EXPLORAR`. A rolagem troca o
 * destaque.
 *
 * ── O QUE MUDA DE NATUREZA COM A SUBSTITUIÇÃO ─────────────────────────────
 * Com o palco fora, a descrição de cada evento passa a ser lida SÓ aqui: a cena
 * deixa de ser decoração e vira o conteúdo da rota. Daí três coisas que o mosaico
 * podia fazer e esta cena não pode:
 *
 * 1. NADA é `aria-hidden`. O mosaico escondia os quinze cartões do leitor de tela
 *    porque o palco anunciava tudo logo abaixo; sem o palco esse argumento morre.
 *    O cartão tem `aria-live="polite"`, o título é heading, e cada miniatura é um
 *    `<button>` de verdade.
 *    SEM `aria-current`, e não por esquecimento: pela construção de `miniatura`, a
 *    vaga em destaque é um `<div>` e os `<button>` são exactamente os que NÃO estão
 *    em destaque — não existe botão em que o atributo fosse verdadeiro. Quem
 *    comunica o estado é o `{e.title} (em destaque)` da vaga, que é texto lido.
 * 2. MOBILE TEM VERSÃO PRÓPRIA. O mosaico era `display: none` abaixo de 1024px
 *    porque era decoração; conteúdo não pode desaparecer em 390px. Abaixo de `lg`
 *    entra a lista dos quinze empilhada (chip, título, descrição, arte, botão),
 *    sem colunas e sem fios.
 *    As duas versões estão na árvore e o CSS liga uma OU outra com `display:
 *    none` — que é o que mantém a escondida FORA da árvore de acessibilidade.
 *    Nada é lido duas vezes, e nenhuma delas é `aria-hidden` (o atributo
 *    esconderia do leitor a versão que está visível na largura errada).
 * 3. `prefers-reduced-motion` NÃO PODE TIRAR O CONTEÚDO DO ALCANCE. A régua de
 *    `~/.claude/skills/reduced-motion-conteudo`: movimento que revela conteúdo é
 *    essencial. Quem resolve não é uma exceção de `@media` — é a MINIATURA
 *    CLICÁVEL, que existiria de qualquer jeito: com movimento reduzido o pulo é
 *    instantâneo (`behavior: 'auto'`) e todos os quinze continuam alcançáveis sem
 *    rolar nada. A troca por rolagem continua ligada porque ela não anima nada:
 *    é um `IntersectionObserver` trocando qual evento está montado.
 *
 * ── POR QUE `IntersectionObserver` E NÃO ScrollTrigger ────────────────────────
 * A regra do repositório proíbe `pin: true` (só `sticky`), e o cabeçalho desta
 * rota diz, palavra por palavra, "nada aqui é pinado com ScrollTrigger". A cena
 * não precisa de fração de progresso: precisa saber QUAL dos quinze está no
 * centro. Quinze sentinelas em fluxo + um observador com
 * `rootMargin: -50% 0 -50%` respondem exatamente isso, e o palco fica preso por
 * `position: sticky`.
 *
 * A armadilha que isso evita de graça é a da SIS-156: quando o gatilho é ancorado
 * na SEÇÃO mas o `sticky` percorre uma caixa INTERNA, as duas medidas divergem e
 * a última etapa é alcançada fora de quadro. Aqui não há duas medidas — a trilha
 * de sentinelas É a caixa do sticky (ela sobe `-100svh` para ocupar a seção
 * inteira), então a décima quinta chega com o palco ainda preso.
 *
 * ── DEFEITOS DO MOSAICO, E O QUE A SIS-167 MUDOU NESTA NOTA ──────────────────
 * O mosaico tinha dois: a coluna da esquerda encostava na borda e a placa da
 * legenda saía cortada no `overflow: clip`; e a pílula `INÍCIO` do `ScrollSpy`
 * colidia com o cartão. O `ScrollSpy` é `fixed left-3` (0.75rem) com rótulo que
 * abre no hover — por isso a folga das faixas é medida contra ele e contra a
 * borda, e não um `clamp(2rem, …)` como lá. O valor e a medida moram num lugar
 * só, no bloco de `.eventos-destaque-coluna` em `events-spotlight.css`; repetir o
 * número aqui foi como ele envelheceu em dois lugares de uma vez.
 *
 * ⚠️ A SIS-166 escrevia aqui que os dois defeitos "não foram reimportados", e a
 * garantia era a AUSÊNCIA de movimento: as colunas não flutuavam nem giravam,
 * então não havia deslocamento nem projeção de rotação para estourar a caixa.
 * A SIS-167 REINTRODUZIU essa condição de propósito — catorze vagas agora flutuam
 * e giram. A afirmação antiga passou a ser falsa e foi reescrita, não mantida.
 * O que substitui a ausência de movimento são quatro coisas medidas, todas no CSS:
 * amplitude PRÓPRIA e menor que a do mosaico (`--evt-float-x: 9px` contra 12px,
 * `--evt-float-rot: 2deg` contra 2,6deg); a flutuação SEM eixo vertical
 * (`--evt-float-y: 0px`, porque a folga vertical entre vagas medida em repouso é de
 * ~10px em 1670 e ~1,6px em 1366 — não cabe deslocamento nenhum ali, e a segunda
 * profundidade continua vindo do X e do tempo de ciclo); recuo mínimo de 4% da faixa
 * e nunca 0%; e a folga passando a ser "recuo MENOS excursão da flutuação MENOS
 * projeção da rotação". É o que `scripts/medir-cena-eventos.mjs` afere, em 1024,
 * 1280, 1366, 1440 e 1670 — e mede também as duas coisas que o espalhamento pode
 * quebrar e nenhuma asserção olhava: vaga cobrindo vaga (asserção 20) e a faixa se
 * reorganizando quando o destaque troca (asserção 21). Enquanto houver flutuação
 * aqui, aquela sonda deixa de ser conferência de entrega e passa a ser a única
 * guarda deste defeito.
 *
 * ── DECISÕES DE CONTEÚDO (fechadas na issue, não reabrir) ────────────────────
 * • QUINZE no percurso, não nove: o catálogo tem quinze e um recorte exigiria
 *   critério editorial. Contador `01 / 15`. As vagas se dividem por índice do
 *   catálogo — pares à esquerda (oito), ímpares à direita (sete). Divisão por
 *   índice, e não "os catorze restantes": assim a posição de cada miniatura NÃO
 *   muda quando o destaque troca. Se a lista se reorganizasse a cada troca, as
 *   catorze saltariam de lugar quinze vezes ao rolar.
 * • SEM LOGOS de patrocinador: `SistranEvent` não tem o campo, e o par
 *   evento↔marca não existe no catálogo. As marcas já aparecem DENTRO da arte.
 * • O BOTÃO aponta para o CANAL, de `YOUTUBE_URL` (`src/data/contact.ts`) —
 *   constante única, decisão registrada na issue. Ele aparece nos QUINZE porque a
 *   URL existe para os quinze: "sem URL, não mostra o botão" governa o dia em que
 *   `src/data/events.ts` ganhar um campo `youtube` por evento, e aí o botão usa a
 *   específica quando houver e cai no canal quando não. Nenhum link morto hoje.
 *   Custo assumido e escrito na issue: os quinze levam ao mesmo lugar.
 * • SEM FILTRO nesta issue. As sete pílulas moravam no `EventsGrid` e saem com
 *   ele; se o filtro voltar, ele governa o percurso e o contador passa a ser
 *   `01 / N do recorte`.
 *
 * As colunas usam `thumb`, NUNCA `image`: `next.config` está com
 * `images: { unoptimized: true }` (SIS-154), então o arquivo do disco é o que
 * baixa — quinze artes de ~180 KB para quinze quadradinhos seriam ~2,7 MB. A
 * apuração completa está em `src/data/events.ts`.
 */

import "./events-spotlight.css";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, PlayCircle } from "lucide-react";
import { EVENTS, EVENT_KIND_META } from "@/data/events";
import { YOUTUBE_URL } from "@/data/contact";
import { prefersReducedMotion } from "@/lib/motion";

/* Contagem em UM lugar só, derivada do catálogo: o contador, o `aria-valuemax` e
   a divisão das colunas leem daqui. Escrever "15" à mão em três lugares é como as
   contagens divergem sem ninguém notar. */
const TOTAL = EVENTS.length;

export default function EventsSpotlight() {
  const [ativo, setAtivo] = useState(0);
  const trilhaRef = useRef<HTMLDivElement>(null);

  /* Pares à esquerda, ímpares à direita — ver a nota do cabeçalho sobre por que a
     divisão é por índice do catálogo e não "o destaque sai da lista". */
  const [esquerda, direita] = useMemo(
    () => [
      EVENTS.map((e, i) => ({ e, i })).filter(({ i }) => i % 2 === 0),
      EVENTS.map((e, i) => ({ e, i })).filter(({ i }) => i % 2 === 1),
    ],
    [],
  );

  /**
   * Qual sentinela está cruzando o centro da janela. `rootMargin` de
   * `-50% 0 -50%` reduz a área de observação a UMA LINHA no meio da tela: só
   * intersecta a sentinela que está passando por ela, e é essa a definição de
   * "evento em destaque".
   *
   * `threshold: 0` de propósito: a área observada tem altura zero, então pedir
   * fração visível nunca dispararia.
   */
  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const sentinelas = Array.from(
      trilha.querySelectorAll<HTMLElement>("[data-evento-i]"),
    );
    if (!sentinelas.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = Number((entrada.target as HTMLElement).dataset.eventoI);
          if (Number.isFinite(i)) setAtivo(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sentinelas.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /**
   * Pular para o evento N. `window.scrollTo`, e NÃO `scrollIntoView`: a rota usa
   * rolagem suave por biblioteca (Lenis), que intercepta a segunda — a apuração
   * está registrada na SIS-151 (`irParaEvento`, no `EventsGrid` que sai de cena).
   *
   * O alvo é o CENTRO da sentinela alinhado ao centro da janela, que é o mesmo
   * critério do observador acima. Mirar o topo faria o clique cair meia sentinela
   * antes do ponto em que aquele evento passa a ser o destaque.
   */
  const irPara = useCallback((i: number) => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const alvo = trilha.querySelector<HTMLElement>(`[data-evento-i="${i}"]`);
    if (!alvo) return;
    const caixa = alvo.getBoundingClientRect();
    const y =
      window.scrollY + caixa.top + caixa.height / 2 - window.innerHeight / 2;
    window.scrollTo({
      top: Math.max(0, Math.round(y)),
      /* Com movimento reduzido o pulo é instantâneo. É aqui que a régua de
         acessibilidade se cumpre: o conteúdo continua alcançável sem movimento. */
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const evento = EVENTS[ativo];
  const meta = EVENT_KIND_META[evento.kind];

  /* A miniatura, em dois estados: a vaga VAZIA e tracejada quando aquele evento é
     o destaque (é o que amarra coluna e centro), e o botão com `thumb` + título
     quando não é. Os dois ocupam a MESMA vaga, então a coluna não se reorganiza. */
  const miniatura = ({ e, i }: { e: (typeof EVENTS)[number]; i: number }) => {
    const emDestaque = i === ativo;
    if (emDestaque) {
      return (
        <div key={e.id} className="eventos-vaga eventos-vaga--destaque">
          <span className="eventos-vaga-icone" aria-hidden="true">
            <ImageIcon className="h-4 w-4" strokeWidth={1.6} />
          </span>
          {/* Legível, não `aria-hidden`: quem ouve precisa saber que a vaga da
              coluna é a do evento que está no cartão — sem isso a lista lateral
              perde um item sem explicação. */}
          <span className="eventos-vaga-rotulo">{e.title} (em destaque)</span>
          {/* Fio ciano da vaga até o cartão, com nó aceso na ponta. Decorativo:
              a relação que ele desenha já está dita no rótulo acima. */}
          <span className="eventos-vaga-fio" aria-hidden="true" />
        </div>
      );
    }
    return (
      <button
        key={e.id}
        type="button"
        className="eventos-vaga eventos-vaga--botao"
        onClick={() => irPara(i)}
      >
        <span className="eventos-vaga-arte">
          <Image
            src={e.thumb ?? e.image ?? ""}
            alt=""
            width={240}
            height={135}
            loading="lazy"
            /* Miniatura de coluna não disputa o primeiro paint com a abertura em
               vídeo da rota — mesma disciplina da faixa de logos (SIS-136). */
            fetchPriority="low"
          />
        </span>
        <span className="eventos-vaga-rotulo">{e.title}</span>
      </button>
    );
  };

  return (
    <>
      {/* ── DESKTOP: a cena ────────────────────────────────────────────────── */}
      <section
        id="eventos"
        className="eventos-destaque"
        aria-labelledby="eventos-titulo"
      >
        {/* A linha ciano que o fio do hero encontra aceso na entrada: é o elo
            `hero -> eventos` da rota, que é por LINHA. Mesmos valores do
            `.pagehero-fio` — a nota está no CSS. */}
        <span className="eventos-destaque-fio" aria-hidden="true" />

        <div className="eventos-destaque-palco">
          <header className="eventos-destaque-cabecalho">
            <p className="eventos-destaque-sobretitulo">
              <span className="eventos-destaque-traco" aria-hidden="true" />
              EVENTOS
              <span className="eventos-destaque-traco" aria-hidden="true" />
            </p>
            {/* Serifa por `--font-display`, do layout raiz (TIPOGRAFIA.md): não se
                declara fonte por rota. Texto igual ao `h2` que o mosaico imprimia
                — nenhuma escrita nova nesta cena. */}
            <h2 id="eventos-titulo" className="eventos-destaque-titulo">
              Eventos &amp; Inovação
            </h2>
          </header>

          <div className="eventos-destaque-corpo">
            <div className="eventos-destaque-coluna eventos-destaque-coluna--esq">
              {esquerda.map(miniatura)}
            </div>

            {/* `aria-live="polite"`: a troca de destaque é percebida por quem
                ouve. `polite`, e não `assertive`, porque a troca acompanha a
                rolagem — interromper a leitura quinze vezes seria pior que o
                silêncio de hoje. */}
            <article
              className="eventos-destaque-cartao"
              aria-live="polite"
              aria-atomic="true"
            >
              <span
                className="eventos-destaque-chip"
                style={{
                  borderColor: `${meta.tone}66`,
                  background: `${meta.tone}1f`,
                  color: "#0b3a5c",
                }}
              >
                <span
                  className="eventos-destaque-chip-no"
                  style={{ background: meta.tone }}
                  aria-hidden="true"
                />
                {meta.label}
              </span>
              <h3 className="eventos-destaque-cartao-titulo">{evento.title}</h3>
              <p className="eventos-destaque-cartao-texto">
                {evento.description}
              </p>
              <a
                className="eventos-destaque-botao"
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayCircle
                  className="h-4 w-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                ASSISTA NO YOUTUBE
                <span className="sr-only">
                  {" "}
                  (abre o canal da Sistran em nova aba)
                </span>
              </a>
              <div className="eventos-destaque-arte">
                {/* `alt` com o nome do evento: aqui a arte é conteúdo, não
                    decoração — não há um palco ao lado repetindo o título. */}
                <Image
                  src={evento.image ?? evento.thumb ?? ""}
                  alt={`Arte do evento ${evento.title}`}
                  width={1672}
                  height={941}
                  priority={false}
                />
              </div>
            </article>

            <div className="eventos-destaque-coluna eventos-destaque-coluna--dir">
              {direita.map(miniatura)}
            </div>
          </div>

          <footer className="eventos-destaque-contador">
            <span
              className="eventos-destaque-contador-fio"
              aria-hidden="true"
            />
            <p className="eventos-destaque-contador-numero">
              {String(ativo + 1).padStart(2, "0")}
              <span aria-hidden="true"> / </span>
              <span className="sr-only">de</span>
              <span className="eventos-destaque-contador-total">
                {String(TOTAL).padStart(2, "0")}
              </span>
            </p>
            <p className="eventos-destaque-contador-rotulo">
              ROLE PARA EXPLORAR
            </p>
          </footer>
        </div>

        {/* A TRILHA. Quinze sentinelas em fluxo, uma por evento: são elas que dão
            altura à seção e é nelas que o observador se prende. `-100svh` para a
            trilha começar no topo da seção, e não depois do palco — assim o
            percurso do `sticky` e o da trilha são a MESMA caixa (ver a nota da
            SIS-156 no cabeçalho).
            `aria-hidden` aqui é o único do arquivo e é legítimo: são caixas vazias
            de medição, sem uma palavra dentro. */}
        <div
          ref={trilhaRef}
          className="eventos-destaque-trilha"
          aria-hidden="true"
        >
          {EVENTS.map((e, i) => (
            <span
              key={e.id}
              data-evento-i={i}
              className="eventos-destaque-sentinela"
            />
          ))}
        </div>
      </section>

      {/* ── ABAIXO DE 1024px: a lista dos quinze ───────────────────────────────
          Sem colunas, sem fios, sem contador — nada disso caberia em 390px. O que
          não pode faltar é o conteúdo: chip, título, descrição, arte e botão. */}
      <section className="eventos-lista" aria-labelledby="eventos-lista-titulo">
        <header className="eventos-lista-cabecalho">
          <p className="eventos-destaque-sobretitulo">
            <span className="eventos-destaque-traco" aria-hidden="true" />
            EVENTOS
            <span className="eventos-destaque-traco" aria-hidden="true" />
          </p>
          <h2 id="eventos-lista-titulo" className="eventos-destaque-titulo">
            Eventos &amp; Inovação
          </h2>
        </header>
        <ul className="eventos-lista-itens">
          {EVENTS.map((e) => {
            const m = EVENT_KIND_META[e.kind];
            return (
              <li key={e.id} className="eventos-lista-item">
                <span
                  className="eventos-destaque-chip"
                  style={{
                    borderColor: `${m.tone}66`,
                    background: `${m.tone}1f`,
                    color: "#0b3a5c",
                  }}
                >
                  <span
                    className="eventos-destaque-chip-no"
                    style={{ background: m.tone }}
                    aria-hidden="true"
                  />
                  {m.label}
                </span>
                <h3 className="eventos-destaque-cartao-titulo">{e.title}</h3>
                <p className="eventos-destaque-cartao-texto">{e.description}</p>
                <div className="eventos-destaque-arte">
                  <Image
                    src={e.image ?? e.thumb ?? ""}
                    alt={`Arte do evento ${e.title}`}
                    width={1672}
                    height={941}
                    loading="lazy"
                  />
                </div>
                <a
                  className="eventos-destaque-botao"
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayCircle
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  ASSISTA NO YOUTUBE
                  <span className="sr-only">
                    {" "}
                    (abre o canal da Sistran em nova aba)
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
