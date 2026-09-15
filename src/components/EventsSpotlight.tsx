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
 *   constante única, decisão registrada na issue. Ele aparecia nos QUINZE, todos
 *   para o mesmo lugar; SIS-205 fechou isso: o botão só aparece onde há GRAVAÇÃO
 *   publicada, hoje `web-summit-ai` e `suitability-ai`, pela flag `youtube` de
 *   `src/data/events.ts`. Quem manda é o data, não uma lista de ids aqui, porque
 *   este mesmo botão é renderizado em DOIS lugares — o palco e a lista estreita.
 *   O destino dos dois continua sendo o canal: URL por vídeo ainda não existe
 *   (ex-SIS-131; `DECISOES-PENDENTES.md`). Quando existir, `youtube` pode se
 *   alargar para `true | string` e o botão usa a específica quando houver.
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
/* SIS-251 — só para a asserção da variável CSS `--evt-autoplay` no `style`: o
   tipo de `style` não aceita chave arbitrária, e o `React` global não está
   importado como namespace neste arquivo.
   SIS-272 — o mesmo cast serve ao `--reveal-i` da cascata do cabeçalho estreito;
   é o molde que `/trabalhe-conosco` já usa. */
import type { CSSProperties } from "react";
/* SIS-272 — a primitiva de reveal da casa, a mesma de `/contato` (SIS-269) e
   `/trabalhe-conosco` (SIS-270). Ela escreve `data-in` num envelope e sai da
   frente; quem anima são os presets `[data-reveal]` do `globals.css`. */
import RevealScope from "./motion/RevealScope";
/* SIS-272 — o calibre mora na pasta da ROTA, e não aqui, porque esta cena é
   montada só por ela (o mesmo arranjo de `MetricsBand` com
   `src/app/contato/reveal-calibre.ts`). O porquê de cada número está lá. */
import {
  LIMIAR_REVEAL,
  MARGEM_REVEAL,
  MARGEM_REVEAL_NO_PALCO,
} from "@/app/eventos-inovacao/reveal-calibre";
import { ChevronLeft, ChevronRight, ImageIcon, PlayCircle } from "lucide-react";
/* SIS-235 — o carimbo dos eventos `proprio`. Componente próprio, e não markup
   inline, porque ele nasce em DOIS lugares desta mesma cena (palco e lista estreita)
   e a issue pede um só reutilizável. */
import CarimboRealizadoSistran from "./CarimboRealizadoSistran";
import { EVENTS, EVENT_KIND_META } from "@/data/events";
import { YOUTUBE_URL } from "@/data/contact";
import { prefersReducedMotion, useReducedMotion } from "@/lib/motion";
import { criarConsultaDeMedia } from "@/lib/mediaStore";

/* Contagem em UM lugar só, derivada do catálogo: o contador, o `aria-valuemax` e
   a divisão das colunas leem daqui. Escrever "15" à mão em três lugares é como as
   contagens divergem sem ninguém notar. */
const TOTAL = EVENTS.length;

/**
 * SIS-239 — ESPELHO EXATO da `@media (min-width: 1024px)` que, em
 * `events-spotlight.css`, troca `.eventos-lista` pelo palco. A string fica
 * literal aqui de propósito (é a doutrina de `src/lib/mediaStore.ts`): o que
 * precisa ser conferido contra o CSS é a MEDIDA, e um nome no meio a esconderia.
 *
 * `1023.98px` e não `1023px`: larguras de janela são fracionárias (zoom, barra de
 * rolagem overlay), e `max-width: 1023px` deixaria a faixa de 1023,5px sem dono —
 * o CSS já mostraria a lista e o JS ainda a trataria como desktop, ou seja
 * carrossel montado e autoplay desligado.
 *
 * Ele governa SÓ o comportamento (autoplay, ouvintes, teclado). Quem monta ou
 * esconde cada versão continua sendo o `display: none` do CSS — o hook nasce
 * `false` no servidor e converge depois de hidratar, então decidir QUAIS NÓS
 * EXISTEM por ele desmontaria a subárvore na convergência.
 */
const useListaEstreita = criarConsultaDeMedia("(max-width: 1023.98px)");

/**
 * Intervalo do laço automático. É MAIOR que os 3.600ms do carrossel de
 * `TechnologyShowcase` porque o que passa aqui não é uma logo: são descrições de
 * 130 a 485 caracteres, que em 390px chegam a onze linhas. 3,6s não dá para ler
 * a mais curta, e um carrossel que troca antes da leitura terminar é pior que
 * nenhum — obriga a esperar o laço inteiro para reencontrar o cartão.
 *
 * SIS-251 — O INTERVALO NÃO FOI ENCURTADO, e a issue autoriza encurtá-lo ("se o
 * auto estiver muito sutil/lento demais, calibrar intervalo"). O diagnóstico em
 * 390px (`scripts/diagnostico-carrossel-sis251.mjs`) mostrou que o passo já
 * anda e anda um cartão inteiro (0px -> 331px): o que faltava não era
 * VELOCIDADE, era AVISO. Um cartão que fica parado 6s e depois salta é
 * indistinguível de um cartão estático até o instante do salto — quem lê e sai
 * antes disso nunca descobre que ele anda.
 * Encurtar para 3s tornaria o movimento perceptível ao custo da leitura, que é
 * justamente o que este número protege (descrições de até 485 caracteres, onze
 * linhas em 390px). Em vez disso, o tempo passou a ser MOSTRADO: a marca do
 * cartão em quadro preenche ao longo destes 6s (`--evt-autoplay`, escrito no
 * DOM a partir desta constante para não haver um "6000" no CSS a divergir).
 */
const AUTOPLAY_MS = 6000;
/** Quanto o autoplay espera depois de um gesto antes de voltar a andar. */
const RETOMADA_MS = 7000;
/**
 * Janela em que a rolagem em curso é considerada NOSSA (autoplay/teclado) e não
 * do dedo. Existe porque a rolagem suave do navegador emite os mesmos eventos de
 * `scroll` que um swipe, e sem distinguir os dois o autoplay pausaria a si mesmo
 * a cada passo. É só a rede de segurança: quem solta a marca é o `scrollend`, e
 * este prazo cobre os navegadores que ainda não o emitem.
 */
const ROLAGEM_NOSSA_MS = 1400;

export default function EventsSpotlight() {
  const [ativo, setAtivo] = useState(0);
  const trilhaRef = useRef<HTMLDivElement>(null);

  /**
   * SIS-204 (item 1) — A CESSÃO DO TÍTULO.
   *
   * A rota tem DUAS leituras do mesmo «Eventos & Inovação»: o `h1` do hero
   * (`PageHero title="Eventos &" highlight="Inovação"`) e o `h2` desta cena. Na
   * rolagem do hero para o palco `sticky` os dois ficavam em quadro ao mesmo
   * tempo — a sonda mediu isso em 1440, 1366 e 1024, em todos os passos em que a
   * base do hero ainda estava na janela.
   *
   * O gatilho é LITERALMENTE o critério de aceite: não mais de um título dominante
   * em quadro. Em vez de derivar um progresso de rolagem e calibrar onde um apaga
   * e o outro acende — dois números a envelhecer, e uma segunda medida a divergir
   * da primeira, que é a armadilha da SIS-156 —, o observador assiste ao PRÓPRIO
   * `h1` do hero: enquanto ele intersecta a janela, o hero é quem lê o título e o
   * `h2` desta cena está cedido; quando ele sai, a cena assume. Não existe
   * instante com os dois acesos porque a condição do gatilho é a negação do
   * defeito.
   *
   * NADA SAI DO DOM E NADA VIRA `aria-hidden`: a cessão é `opacity` mais um
   * deslocamento. O `h2` continua sendo o heading da seção e o alvo do
   * `aria-labelledby`, então a hierarquia e o nome acessível não mudam em nenhum
   * dos dois estados — o que muda é qual dos dois títulos está VISÍVEL.
   *
   * `null` como estado inicial é deliberado: sem atributo, o CSS não aplica cessão
   * nenhuma e o `h2` aparece — é o estado de hoje, e é o que fica de pé para quem
   * não tem JavaScript. Nascer em `'cedido'` deixaria o título invisível para
   * sempre nesse caso, que é conteúdo fora do alcance. `transicao` só liga um
   * quadro depois da primeira resolução: assim a PRIMEIRA aplicação é instantânea
   * (sem o título piscando no carregamento no topo da página) e as seguintes, as
   * da rolagem, são as que atravessam.
   *
   * O seletor `#topo h1` acopla esta cena ao `PageHero`, e o acoplamento está
   * assumido em vez de escondido: `#topo` é a âncora fixa que o `PageHero` sempre
   * escreve. Se um dia a abertura desta rota não tiver `h1`, o `else` abaixo faz a
   * cena ASSUMIR o título — nunca ceder para um dono que não existe.
   */
  const [cessao, setCessao] = useState<"cedido" | "assumido" | null>(null);
  const [transicao, setTransicao] = useState(false);

  useEffect(() => {
    const heroTitulo = document.querySelector<HTMLElement>("#topo h1");
    if (!heroTitulo) {
      setCessao("assumido");
      return;
    }
    const io = new IntersectionObserver(
      ([entrada]) => setCessao(entrada.isIntersecting ? "cedido" : "assumido"),
      { threshold: 0 },
    );
    io.observe(heroTitulo);
    const relogio = window.setTimeout(() => setTransicao(true), 120);
    return () => {
      io.disconnect();
      window.clearTimeout(relogio);
    };
  }, []);

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

  /* ══ SIS-239 · O CARROSSEL DA LISTA ESTREITA ══════════════════════════════
     Daqui até o fim do bloco é só a versão de baixo de 1024px. Nada deste
     trecho toca o palco: o palco troca de destaque por ROLAGEM DA PÁGINA
     (`ativo`, `trilhaRef`, `irPara`, acima), e a faixa troca de cartão por
     ROLAGEM DELA MESMA (`emFoco`, `faixaRef`, `irParaCartao`). Os dois estados
     nunca se cruzam, e é isso que mantém o desktop inalterado.

     ── POR QUE `scrollLeft` É O DONO DO ESTADO ───────────────────────────────
     O carrossel é uma faixa com `overflow-x: auto` e `scroll-snap`: quem manda
     na posição é o navegador, e o dedo do visitante escreve nela direto, sem
     passar por nós. Então `emFoco` não é a verdade — é a LEITURA da verdade,
     derivada da posição de rolagem por um ouvinte. O autoplay não "avança um
     índice", ele ROLA a faixa; o que confirma o avanço é a posição nova.
     A alternativa (um índice em estado dirigindo `transform: translateX`) teria
     de reimplementar swipe, inércia, snap e acessibilidade de rolagem — e
     brigaria com o gesto nativo em vez de usá-lo.

     ── AS SEIS PAUSAS, E POR QUE CADA UMA ────────────────────────────────────
     `autoplayPausado` é uma disjunção, e cada termo responde a um pedido:
     • `!estreito` — acima de 1024px o carrossel não está em cena.
     • `semMovimento` — as DUAS vias de movimento reduzido do projeto, numa
       leitura só: `useReducedMotion()` consulta `matchMedia`, e `matchMedia`
       está embrulhado pelo script inline de `app/layout.tsx` para devolver a
       preferência RESOLVIDA (escolha em `html[data-motion]` > preferência do
       SO). É a mesma razão pela qual `UnitsMap` consulta `matchMedia` e não o
       atributo. O CSS, que não tem esse embrulho, precisa dos dois blocos — e
       os tem, no fim de `events-spotlight.css`.
     • `!emQuadro` — faixa fora da janela não anima para ninguém, só gasta
       bateria e desalinha o cartão para quem volta.
     • `abaOculta` — mesmo motivo, com a aba em segundo plano.
     • `sobre` / `comFoco` / `apoiado` — hover de mouse, foco de teclado e dedo
       apoiado. São três entradas diferentes e cada uma é um estado próprio:
       quem lê com o mouse parado sobre o cartão não tem foco, e quem chega pelo
       Tab não tem ponteiro.
     • `esperandoRetomada` — o rastro de qualquer gesto (swipe, seta, roda). O
       autoplay não retoma no instante em que o dedo sai; espera `RETOMADA_MS`.

     Nenhuma delas remove conteúdo: com o autoplay parado a faixa continua
     rolável à mão e os quinze seguem alcançáveis — a régua de
     `reduced-motion-conteudo` que o cabeçalho deste arquivo já aplica às
     miniaturas do palco. */
  const faixaRef = useRef<HTMLUListElement>(null);
  const listaRef = useRef<HTMLElement>(null);
  const [emFoco, setEmFoco] = useState(0);
  const [emQuadro, setEmQuadro] = useState(false);
  const [sobre, setSobre] = useState(false);
  const [comFoco, setComFoco] = useState(false);
  const [apoiado, setApoiado] = useState(false);
  const [esperandoRetomada, setEsperandoRetomada] = useState(false);
  /* Instantâneo do servidor é `false` e nada no HTML depende deste valor — ele
     só liga e desliga um relógio. Ler no inicializador evita o `setState`
     síncrono dentro do efeito (a cascata que a SIS-182 removeu). */
  const [abaOculta, setAbaOculta] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );

  const estreito = useListaEstreita();
  const semMovimento = useReducedMotion();

  /* `true` enquanto a rolagem em curso é a NOSSA — ver `ROLAGEM_NOSSA_MS`. Ref,
     e não estado: é lido dentro do ouvinte de `scroll`, que roda a cada quadro,
     e um re-render por quadro para uma bandeira interna seria desperdício. */
  const rolagemNossaRef = useRef(false);
  const soltarRef = useRef<number | null>(null);
  const retomadaRef = useRef<number | null>(null);

  /**
   * SIS-251 — «já mexeu aqui?». É o interruptor da dica «deslize»: uma
   * instrução de gesto só serve a quem ainda não fez o gesto, e deixá-la em
   * quadro depois disso é a poluição que a issue manda evitar ("sem poluir a
   * leitura").
   *
   * Mora aqui, e não num ouvinte novo, porque `segurarAutoplay` JÁ é o funil por
   * onde passa toda entrada de interação da faixa — swipe, dedo apoiado, seta do
   * teclado, roda, e agora os botões. Um segundo detector seria uma segunda
   * definição de "interagiu", a envelhecer separado desta.
   */
  const [interagiu, setInteragiu] = useState(false);

  /** Segura o autoplay por `RETOMADA_MS`. Todo gesto passa por aqui. */
  const segurarAutoplay = useCallback(() => {
    setInteragiu(true);
    setEsperandoRetomada(true);
    if (retomadaRef.current) window.clearTimeout(retomadaRef.current);
    retomadaRef.current = window.setTimeout(
      () => setEsperandoRetomada(false),
      RETOMADA_MS,
    );
  }, []);

  /**
   * Rola a faixa até o cartão N, com laço nas duas pontas.
   *
   * O alvo é `alvo.offsetLeft - primeiro.offsetLeft`, e a subtração não é
   * enfeite: `offsetLeft` é medido a partir da borda do contêiner, então o do
   * primeiro cartão VALE o `padding-inline` da faixa. Subtraí-lo dá a posição de
   * rolagem em que o cartão encosta exatamente onde o primeiro encosta com
   * `scrollLeft: 0` — o mesmo ponto que o `scroll-padding-inline` do CSS declara
   * como início do snapport. Mirar `offsetLeft` cru deslocaria tudo pela margem.
   *
   * `scrollTo` da FAIXA, e não `scrollIntoView`: o segundo arrastaria a PÁGINA
   * na vertical para trazer o cartão inteiro em quadro (os cartões são mais
   * altos que a janela em 390px), e a página tem rolagem suave por biblioteca,
   * que intercepta essa chamada — a mesma apuração de `irPara`, acima.
   */
  const irParaCartao = useCallback(
    (indice: number, porGesto = false) => {
      const faixa = faixaRef.current;
      if (!faixa) return;
      const cartoes =
        faixa.querySelectorAll<HTMLElement>(".eventos-lista-item");
      const primeiro = cartoes[0];
      const alvo = cartoes[((indice % TOTAL) + TOTAL) % TOTAL];
      if (!primeiro || !alvo) return;

      rolagemNossaRef.current = true;
      if (soltarRef.current) window.clearTimeout(soltarRef.current);
      /* A função é NOMEADA e o `setTimeout` fica numa linha só por causa do
         extrator da Regra Zero (`scripts/copy-lock.mjs`): a forma
         `}, CONSTANTE)` — chave de fechamento de arrow, vírgula, identificador —
         é lida por ele como nó de texto de JSX, e entrava no lock como se fosse
         escrita do site. Bug do extrator, não deste arquivo; a saída é escrever
         o mesmo código na forma que não o confunde. */
      const soltarRolagemNossa = () => {
        rolagemNossaRef.current = false;
      };
      soltarRef.current = window.setTimeout(soltarRolagemNossa, ROLAGEM_NOSSA_MS);

      faixa.scrollTo({
        left: alvo.offsetLeft - primeiro.offsetLeft,
        /* Com movimento reduzido o passo é instantâneo — é a mesma decisão do
           pulo das miniaturas do palco, e o que garante que os botões de teclado
           continuem levando aos quinze sem animar nada. */
        behavior: semMovimento ? "auto" : "smooth",
      });
      if (porGesto) segurarAutoplay();
    },
    [semMovimento, segurarAutoplay],
  );

  /**
   * Qual cartão está no início da faixa, lido da posição de rolagem.
   *
   * Vale para os DOIS caminhos (autoplay e swipe), porque os dois terminam em
   * `scrollLeft`. O que distingue um do outro é `rolagemNossaRef`: só a rolagem
   * que NÃO é nossa segura o autoplay. Sem essa distinção, a rolagem suave do
   * próprio passo se pareceria com um gesto e o autoplay pausaria a si mesmo.
   *
   * `requestAnimationFrame` como estrangulador: `scroll` dispara muito mais que
   * uma vez por quadro durante um swipe, e o cálculo é uma varredura de quinze
   * caixas. `setEmFoco` com o mesmo valor não re-renderiza (o React aborta), então
   * na prática há um render por TROCA de cartão, não por evento.
   */
  useEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa || !estreito) return;

    let quadro = 0;
    const ler = () => {
      quadro = 0;
      const cartoes =
        faixa.querySelectorAll<HTMLElement>(".eventos-lista-item");
      const primeiro = cartoes[0];
      if (!primeiro) return;
      const posicao = faixa.scrollLeft;
      let melhor = 0;
      let menor = Number.POSITIVE_INFINITY;
      cartoes.forEach((cartao, i) => {
        const distancia = Math.abs(
          cartao.offsetLeft - primeiro.offsetLeft - posicao,
        );
        if (distancia < menor) {
          menor = distancia;
          melhor = i;
        }
      });
      setEmFoco(melhor);
      if (!rolagemNossaRef.current) segurarAutoplay();
    };

    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(ler);
    };
    /* `scrollend` é quem solta a marca de "rolagem nossa" na hora certa; o prazo
       de `ROLAGEM_NOSSA_MS` fica como rede para quem não o emite. */
    const aoTerminar = () => {
      rolagemNossaRef.current = false;
    };

    faixa.addEventListener("scroll", aoRolar, { passive: true });
    faixa.addEventListener("scrollend", aoTerminar);
    return () => {
      faixa.removeEventListener("scroll", aoRolar);
      faixa.removeEventListener("scrollend", aoTerminar);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [estreito, segurarAutoplay]);

  /* A faixa em quadro. `threshold: 0` porque a pergunta é binária — encostou na
     janela ou não —, e a faixa é mais alta que a janela em 390px, de modo que
     pedir fração visível nunca se cumpriria. */
  useEffect(() => {
    const alvo = listaRef.current;
    if (!alvo) return;
    const io = new IntersectionObserver(
      ([entrada]) => setEmQuadro(entrada.isIntersecting),
      { threshold: 0 },
    );
    io.observe(alvo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ler = () => setAbaOculta(document.hidden);
    document.addEventListener("visibilitychange", ler);
    return () => document.removeEventListener("visibilitychange", ler);
  }, []);

  useEffect(
    () => () => {
      if (soltarRef.current) window.clearTimeout(soltarRef.current);
      if (retomadaRef.current) window.clearTimeout(retomadaRef.current);
    },
    [],
  );

  const autoplayPausado =
    !estreito ||
    semMovimento ||
    !emQuadro ||
    abaOculta ||
    sobre ||
    comFoco ||
    apoiado ||
    esperandoRetomada;

  /* Um timeout só, reagendado a cada troca — o molde de `TechnologyShowcase`. O
     `% TOTAL` de `irParaCartao` é o laço: depois do décimo quinto o passo pede o
     zero, e a faixa volta ao começo pelo mesmo caminho que fez para chegar lá. */
  useEffect(() => {
    if (autoplayPausado) return;
    const relogio = window.setTimeout(
      () => irParaCartao(emFoco + 1),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(relogio);
  }, [autoplayPausado, emFoco, irParaCartao]);

  /* Setas do teclado. A faixa é um contêiner de rolagem focável, então o
     navegador já responderia a elas — mas rolando por PIXELS, o que com
     `scroll-snap: mandatory` vira um pulo de volta ao cartão de onde saiu.
     `preventDefault` troca isso por um passo de um cartão. */
  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      irParaCartao(emFoco - 1, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      irParaCartao(emFoco + 1, true);
    }
  };

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
          {/* SIS-204 (item 3): o `(em destaque)` saiu do texto VISÍVEL e virou
              `.sr-only` IRMÃO da placa. Duas razões, as duas medidas:
              • o texto visível da vaga em destaque ficou igual ao do botão, e é
                daí que sai a altura igual entre os dois estados (mesmo texto e
                mesma largura de quebra dão o mesmo número de linhas). É a
                invariante da SIS-167 — "a faixa não se reorganiza na troca" —
                agora por construção, e não por aritmética de alturas fixas;
              • fora da placa, e não dentro: `.sr-only` é `position: absolute` com
                `clip`, e dentro da placa o retângulo dele entrava nas caixas de
                linha que a guarda da SIS-167 usa para ver se alguma linha escapa
                (`Range.getClientRects()`) — o item 15 reprovava nas cinco larguras
                por causa de um retângulo sem tinta.
              Continua LIDO, e na mesma ordem: quem ouve segue sabendo qual vaga
              está no cartão. */}
          <span className="eventos-vaga-rotulo">{e.title}</span>
          <span className="sr-only"> (em destaque)</span>
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
      {/* SIS-204 (item 1): `data-titulo` e `data-titulo-transicao` são os dois
          atributos da cessão do título (o gatilho está no `useEffect` acima, o
          efeito no CSS). Ficam na SEÇÃO DESKTOP, então a lista estreita — que tem
          `h2` próprio e nunca convive com o hero em quadro — segue intocada.
          `undefined` remove o atributo, que é o estado "sem cessão". */}
      <section
        id="eventos"
        className="eventos-destaque"
        aria-labelledby="eventos-titulo"
        data-titulo={cessao ?? undefined}
        data-titulo-transicao={transicao ? "ligada" : undefined}
      >
        {/* A linha ciano que o fio do hero encontra aceso na entrada: é o elo
            `hero -> eventos` da rota, que é por LINHA. Mesmos valores do
            `.pagehero-fio` — a nota está no CSS.

            SIS-272 — PRIMEIRO MOMENTO DO REVEAL DESTA ROTA. É o nó marcado que
            está MAIS ALTO na seção (`inset: 0 0 auto 0`), então é o primeiro a
            cruzar a raiz do observador quando a cena entra — e é o que separa
            esta entrada da do contador, ~100svh abaixo dele dentro do palco
            `sticky`. Os dois `scrollY` medidos estão em
            `docs/medidas/reveal-eventos-sis272.json`.

            `line-up`, e não `fade-up`: a régua tem 3px de altura, e o §4.2 de
            `docs/scroll.md` (e a própria regra do preset no `globals.css`) diz
            que num traço dessa espessura um deslocamento vertical de 24px é
            maior que a própria linha — lê como salto. `line-up` DESENHA da
            esquerda, que é a direção em que o degradê da régua já vai do ciano
            cheio para o transparente.

            O ELO NÃO MUDOU DE NATUREZA: a passagem `hero -> eventos` continua
            sendo por LINHA, e continua sendo esta linha. O que a issue
            acrescenta é QUANDO ela acende — antes ela já estava acesa quando a
            cena chegava, agora ela se desenha no gesto em que a cena chega.

            O ESCOPO É QUE CARREGA A CAIXA (`.eventos-destaque-fio-escopo`), e
            isso não é organização: `RevealScope` monta uma `div` em fluxo, e com
            a régua `absolute` lá dentro essa `div` teria altura ZERO. Alvo de
            `IntersectionObserver` com área zero é o caso em que
            `intersectionRatio` deixa de ser fração e vira 1/0 por regra de
            borda da especificação — um limiar de 0.2 passaria a significar outra
            coisa. Com a caixa no escopo o alvo mede 3px de altura e o limiar
            volta a ser o que diz ser. A régua dentro dele fica com a MESMA
            geometria, porque o escopo herda o `inset` que ela tinha.

            `esperarRota` PORQUE ESTA RÉGUA ESTÁ NA PRIMEIRA DOBRA, e isso é
            medida desta rota, não suposição: a abertura daqui é curta — o `#topo`
            mede 414px numa janela de 900 e 353px numa de 768 —, então a seção
            começa em `scrollY` 558 (1440×900) e 497 (1366 e 1024×768), sempre
            acima da borda da janela. É exatamente a condição do contrato que a
            SIS-269 fixou: «espera = estou na dobra e a cortina do `RouteLoadGate`
            me esconderia». Sem a espera, a régua se desenha ATRÁS da cortina e já
            está parada quando ela levanta — a entrada existe e ninguém vê.
            E a espera não reproduz a «cascata global no `liberado`» que a SIS-269
            nomeia, porque ela é de UM escopo só: o contador, logo abaixo, é
            observado desde a montagem. */}
        <RevealScope
          className="eventos-destaque-fio-escopo"
          data-reveal-nome="eventos-fio"
          esperarRota
          margem={MARGEM_REVEAL}
          limiar={LIMIAR_REVEAL}
        >
          <span
            className="eventos-destaque-fio"
            data-reveal="line-up"
            aria-hidden="true"
          />
        </RevealScope>

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
              {/* SIS-235 — nos eventos `proprio` a tag textual vira CARIMBO. Os
                  outros três `kind` seguem no chip, e o admin e os filtros seguem
                  com o rótulo em texto: a issue troca a tag do CARTÃO, não a
                  taxonomia.

                  O chip NÃO foi apagado — ele continua sendo o caminho dos outros
                  três kinds, e este é o mesmo ramo, só com a condição na frente.
                  `animar` ligado aqui e desligado na lista estreita porque o palco
                  tem UM cartão, que remonta ao trocar de evento; a lista monta os
                  quinze de uma vez (o porquê está no componente do carimbo). */}
              {evento.kind === "proprio" ? (
                <CarimboRealizadoSistran animar />
              ) : (
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
              )}
              <h3 className="eventos-destaque-cartao-titulo">{evento.title}</h3>
              <p className="eventos-destaque-cartao-texto">
                {evento.description}
              </p>
              {/* SIS-205 — botão SÓ nos eventos com gravação publicada (hoje
                  `web-summit-ai` e `suitability-ai`). Quem decide é a flag
                  `youtube` do data, não uma lista de ids aqui: este mesmo botão
                  existe no bloco da lista estreita, mais abaixo, e ids no JSX
                  fariam a próxima gravação depender de lembrar dos dois lugares.
                  O destino continua sendo o CANAL — URL por vídeo não existe
                  ainda (ex-SIS-131). */}
              {evento.youtube && (
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
              )}
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

          {/* SIS-272 — O MOMENTO ACIONADO PELO SCROLL desta rota, e o único que
              ela tem: o contador é o último nó do palco `sticky` (terceira linha
              do `grid-template-rows: auto 1fr auto`), quase uma tela abaixo da
              régua marcada lá em cima, e é o único bloco estático da cena que
              nasce FORA da primeira dobra — topo absoluto medido em 1385
              (1440×900) e 1196/1201 (1366 e 1024×768), contra janelas de 900 e
              768. Ele acende em `scrollY` ~497; a régua acende em 0.

              `MARGEM_REVEAL_NO_PALCO`, E NÃO O CALIBRE DOS OUTROS DOIS. Não é
              preferência: com a margem de `-12%` este bloco acendeu, MEDIDO, em
              `scrollY` 7800 — no fim da cena, com a rota inteira já rolada. A
              causa é o `sticky`: preso ao palco, o contador congela a 827px do
              topo da janela, e a raiz encolhida para 792px nunca o alcança. A
              apuração inteira, com a conta da janela entre acender e grudar, está
              em `../app/eventos-inovacao/reveal-calibre.ts`.

              UM `data-reveal` NO BLOCO INTEIRO, e não um por filho: o §3 de
              `docs/scroll.md` manda marcar blocos, e régua, número e rótulo são
              uma leitura só («01 / 15 · ROLE PARA EXPLORAR»). Escalonar três nós
              que ocupam 56px de altura seria a cascata que o §4.3 chama de
              página se montando atrasada.

              O ESCOPO ENVOLVE o `<footer>` em vez de substituí-lo: a `div` do
              `RevealScope` vira a terceira linha do grid, que é `auto` — mesma
              altura, mesma largura esticada, e o `<footer>` continua sendo
              `footer` da seção. Trocar um pelo outro custaria a semântica para
              economizar um nó.

              O CONTEÚDO DO CONTADOR CONTINUA VIVO DURANTE A ENTRADA: `ativo` é
              estado do `IntersectionObserver` das sentinelas e não passa por
              aqui — o reveal mexe em `opacity`/`transform`, nunca em `display`,
              então o número já está trocando enquanto o bloco entra. */}
          <RevealScope
            data-reveal-nome="eventos-contador"
            margem={MARGEM_REVEAL_NO_PALCO}
            limiar={LIMIAR_REVEAL}
          >
            <footer
              className="eventos-destaque-contador"
              data-reveal="fade-up"
            >
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
          </RevealScope>
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

      {/* ── ABAIXO DE 1024px: os quinze em CARROSSEL ──────────────────────────
          Sem colunas, sem fios, sem contador — nada disso caberia em 390px. O que
          não pode faltar é o conteúdo: chip, título, descrição, arte e botão.

          SIS-239 — era uma PILHA VERTICAL: quinze cartões empilhados, 6.413px de
          rolagem medidos em 390px (`scripts/medir-carrossel-eventos-sis239.mjs`,
          corrida "antes"). Agora é uma faixa horizontal com laço automático.

          O QUE NÃO MUDOU, e isto é o ponto: o conteúdo de cada cartão é o MESMO,
          nó por nó — chip, `h3`, descrição inteira (nada de `line-clamp`), arte e
          o botão só onde há gravação. A troca é de EIXO e de navegação, não de
          escrita; nenhum texto foi encurtado para caber no cartão.

          ── UM CARTÃO POR VEZ, COM ESPIADA ───────────────────────────────────
          A issue deixa a escolha entre "um por vez" e "um com espiada do
          próximo", pela legibilidade em 390px. É a segunda, e a conta está no
          CSS (`--evt-faixa-espiada`): a espiada custa 2rem da largura do cartão
          — de 351px para ~319px, 9% —, e em troca resolve o que a pilha
          entregava de graça e uma faixa não entrega: a informação de que existe
          mais coisa PARA O LADO. Sem ela, uma faixa com `scroll-snap` e sem
          barra de rolagem parece um cartão único e estático. As marcas de
          posição logo abaixo dizem QUANTOS; a espiada diz PARA ONDE.

          ── SEM CONTROLES DE TEXTO, E POR QUE ────────────────────────────────
          | A issue permite "controles/dots/contador". Entram as MARCAS de
          | posição, que são decorativas (`aria-hidden`) e não escrevem uma
          | palavra (...). Não entram setas nem contador em texto: os dois
          | precisariam de rótulo acessível, isto é, de ESCRITA NOVA, e escrita
          | nova nesta rota passa pelo portão da Regra Zero (`npm run test:copy`)
          | e pelo dono do conteúdo (...). É a decisão a rever se a issue de
          | conteúdo autorizar o texto.

          ⚠️ SIS-251 É ESSA ISSUE, e ela autorizou: pede "setas/chevrons, hint
          «deslize», dots mais claros, ou combinação" com todas as palavras. A
          nota de cima fica registrada porque ela explica por que os controles
          NÃO existiam — não foi esquecimento, foi um portão —, e o que mudou é
          quem tem a chave: a dona do conteúdo pediu o texto na issue.
          O que entrou está adiante, no bloco `.eventos-lista-controles`; o que
          continua fora é o CONTADOR em texto («03 / 15»), que a issue lista como
          alternativa e não como requisito — as marcas já dizem quantos e onde, e
          um número ao lado delas seria a mesma informação duas vezes.

          ⚠️ RESSALVA DA SIS-239, AGORA MENOR — MAS NÃO FECHADA (WCAG 2.2.2,
          "Pause, Stop, Hide"). O que as setas acrescentam é CONTROLE EXPLÍCITO
          do avanço: clicar em uma delas passa por `segurarAutoplay` e segura o
          laço por `RETOMADA_MS`. Isso não é uma PAUSA — é um adiamento, e depois
          de 7s o laço volta. Quem para de vez continua sendo o interruptor de
          movimento do rodapé (as duas vias de `semMovimento`), que é o mecanismo
          que a norma pede e que já existia.
          Um botão dedicado de pausa continua de fora, e agora por outra razão
          que não a do rótulo: ele seria um QUARTO controle na mesma barra de
          390px, e a issue manda não poluir. Fica anotado como o próximo passo se
          alguém medir que o interruptor do rodapé não é achado. */}
      <section
        ref={listaRef}
        className="eventos-lista"
        aria-labelledby="eventos-lista-titulo"
      >
        {/* SIS-272 — O REVEAL DA VERSÃO ESTREITA, e ele é UM só.
            Abaixo de 1024px a rota tem três blocos: este cabeçalho, a faixa dos
            quinze e a barra de controles. Os dois últimos estão fora por
            construção, não por esquecimento — a faixa É o carrossel (`scrollLeft`
            é o dono do estado dela, e um `transform` de entrada no contêiner de
            rolagem mexeria na caixa que o `offsetLeft` do passo mede), e a barra
            de controles carrega o relógio do laço (`eventos-lista-relogio`, no
            `::after` da marca ativa), que é animação própria: somar reveal ali é
            o «não misture os dois no mesmo elemento» do §6 de `docs/scroll.md`.
            Sobra o cabeçalho, que é escrita estática e nada mais.

            DOIS NÓS MARCADOS, com a cascata do token (`--reveal-i` × 80ms): o
            sobretítulo e o `h2`. É a relação pontual que o §4.3 descreve —
            rótulo e título no mesmo gesto, o segundo um passo atrás.

            NADA AQUI DUPLICA ENTRADA: `.eventos-lista-cabecalho` só tem
            alinhamento e respiro no CSS, e a cessão de título da SIS-204 é
            `.eventos-destaque[data-titulo="cedido"] .eventos-destaque-cabecalho`
            — outro seletor, outra seção, e ela nunca convive com esta (as duas
            versões se excluem por `display: none`).

            `esperarRota` PELA MESMA MEDIDA DA RÉGUA, do outro lado da fronteira:
            a abertura estreita mede 388px numa janela de 844 e 471px numa de
            1024, então este cabeçalho nasce em 540 e 676 — dentro da dobra nas
            duas. É o contrato da SIS-269, e é o único escopo com caixa abaixo de
            1024px (os dois de cima estão sob o `display: none` da cena), de modo
            que não há cascata a criar no `liberado`. */}
        <RevealScope
          data-reveal-nome="eventos-lista-cabecalho"
          esperarRota
          margem={MARGEM_REVEAL}
          limiar={LIMIAR_REVEAL}
        >
          <header className="eventos-lista-cabecalho">
            <p
              className="eventos-destaque-sobretitulo"
              data-reveal="fade-up"
              style={{ "--reveal-i": 0 } as CSSProperties}
            >
              <span className="eventos-destaque-traco" aria-hidden="true" />
              EVENTOS
              <span className="eventos-destaque-traco" aria-hidden="true" />
            </p>
            <h2
              id="eventos-lista-titulo"
              className="eventos-destaque-titulo"
              data-reveal="fade-up"
              style={{ "--reveal-i": 1 } as CSSProperties}
            >
              Eventos &amp; Inovação
            </h2>
          </header>
        </RevealScope>
        {/* `<ul>`/`<li>` PRESERVADOS, sem `role="group"` nem
            `aria-roledescription`: a semântica de lista é o que anuncia "quinze
            itens" e dá a navegação por item do leitor de tela, e trocá-la por
            "carrossel" custaria as duas coisas em troca de uma palavra.

            `tabIndex={0}` + `aria-labelledby` porque a faixa É um contêiner de
            rolagem: sem foco, quem navega por teclado não teria como percorrê-la
            (WCAG 2.1.1), e um contêiner focável sem nome é um destino de Tab que
            o leitor de tela anuncia sem dizer o que é. O nome é o `h2` que já
            está acima — sem escrita nova.

            `data-lenis-prevent` é o que faz a rolagem desta faixa existir: a
            página é rolada por biblioteca (Lenis), que intercepta a roda no
            `window`. O atributo é o mesmo recurso que a faixa de chips do
            `Hero` usa, e o `globals.css` já lhe dá `overscroll-behavior:
            contain`.

            NADA AQUI DEPENDE DE JAVASCRIPT PARA SER LIDO: o eixo, o snap e a
            rolagem são CSS, e o JS só acrescenta o laço automático e o passo por
            teclado. Sem ele a faixa continua sendo quinze cartões roláveis com o
            dedo. */}
        <ul
          ref={faixaRef}
          className="eventos-lista-itens"
          tabIndex={0}
          aria-labelledby="eventos-lista-titulo"
          data-lenis-prevent
          onKeyDown={aoTeclar}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setSobre(true);
          }}
          onPointerLeave={() => {
            setSobre(false);
            setApoiado(false);
          }}
          onPointerDown={() => setApoiado(true)}
          onPointerUp={() => {
            setApoiado(false);
            segurarAutoplay();
          }}
          onPointerCancel={() => {
            setApoiado(false);
            segurarAutoplay();
          }}
          /* `onFocus`/`onBlur` do React são `focusin`/`focusout`: eles sobem dos
             filhos, então o foco no botão do YouTube de um cartão também pausa. */
          onFocus={() => setComFoco(true)}
          onBlur={() => setComFoco(false)}
        >
          {EVENTS.map((e) => {
            const m = EVENT_KIND_META[e.kind];
            return (
              <li key={e.id} className="eventos-lista-item">
                {/* SIS-235 — o MESMO ramo do palco, repetido porque este bloco é a
                    lista estreita (carrossel da SIS-239) e tem markup próprio.
                    Sem `animar`: aqui os quinze cartões montam de uma vez. */}
                {e.kind === "proprio" ? (
                  <CarimboRealizadoSistran />
                ) : (
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
                )}
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
                {/* SIS-205 — mesma regra do palco: botão só com gravação
                    publicada. A lista estreita é a ÚNICA leitura do conteúdo
                    abaixo de 1024px, então esquecer este bloco deixaria treze
                    botões vivos no celular. */}
                {e.youtube && (
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
                )}
              </li>
            );
          })}
        </ul>

        {/* ── SIS-251 · A BARRA DE CONTROLES ────────────────────────────────
            Seta, marcas, seta. As duas coisas que a issue quer óbvias ficam em
            UMA linha, logo abaixo da faixa:

            • QUE SE PASSA PARA O LADO — as setas. Elas são o idioma que se
              reconhece sem instrução, e ficam ABAIXO da faixa em vez de
              flutuando sobre as bordas dela: em 390px o cartão tem 319px de
              largura e um botão sobreposto cobriria a arte ou o texto, que é o
              conteúdo. Uma barra de controles debaixo do palco é a forma que
              não disputa espaço com nada.
            • QUE ANDA SOZINHO — as marcas, que agora contam o tempo (ver
              `--evt-autoplay`, adiante). É a parte que faltava: o passo de 6s já
              acontecia, mas nada o anunciava ANTES de acontecer.

            As setas não desabilitam nas pontas de propósito: `irParaCartao` tem
            `% TOTAL` nas duas direções, então o percurso é um laço e não existe
            "fim" onde um botão morto faria sentido. Um botão desabilitado no
            primeiro cartão diria que não há nada à esquerda, e há — o
            décimo quinto.

            `porGesto = true` nas duas chamadas: um clique é interação como o
            swipe, e tem de segurar o laço. Sem isso o autoplay poderia avançar
            0,3s depois do clique, levando embora o cartão que a pessoa acabou de
            pedir. */}
        <div className="eventos-lista-controles">
          <button
            type="button"
            className="eventos-lista-seta"
            data-lado="antes"
            onClick={() => irParaCartao(emFoco - 1, true)}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Evento anterior</span>
          </button>

          {/* MARCAS DE POSIÇÃO — quinze, uma por cartão, a do cartão em quadro
              alongada. `aria-hidden` e sem texto nenhum: é exatamente o que
              `.tech-progresso` faz em `TechnologyShowcase`, e é o que permite dar
              posição sem inventar escrita (ver a nota da seção, acima).
              Quem ouve não perde nada — a posição, para quem navega por leitor de
              tela, é o "item 3 de 15" que a semântica do `<ul>` já anuncia.

              SIS-251 — dois atributos novos, e os dois existem para o RELÓGIO:
              • `--evt-autoplay` vem de `AUTOPLAY_MS`, a constante deste arquivo.
                Escrito no DOM em vez de repetido no CSS porque o preenchimento
                tem de durar EXATAMENTE o intervalo do laço; um `6s` no CSS seria
                um segundo número a divergir do primeiro no dia em que alguém
                calibrar o tempo.
              • `data-andando` congela o preenchimento quando o laço está parado,
                por qualquer uma das oito razões de `autoplayPausado`. Congelar, e
                não zerar: uma barra que para no meio diz "o tempo parou porque
                você está aqui", que é a resposta honesta ao dedo apoiado. */}
          <div
            className="eventos-lista-bussola"
            aria-hidden="true"
            data-andando={autoplayPausado ? "nao" : "sim"}
            style={{ "--evt-autoplay": `${AUTOPLAY_MS}ms` } as CSSProperties}
          >
            {EVENTS.map((e, i) => (
              <span
                key={e.id}
                className="eventos-lista-bussola-marca"
                data-estado={i === emFoco ? "ativo" : "inativo"}
              />
            ))}
          </div>

          <button
            type="button"
            className="eventos-lista-seta"
            data-lado="depois"
            onClick={() => irParaCartao(emFoco + 1, true)}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Próximo evento</span>
          </button>
        </div>

        {/* A DICA, e ela é o único texto VISÍVEL que esta issue acrescenta.
            Some na primeira interação e some assim que a faixa sai do primeiro
            cartão (inclusive se quem saiu foi o autoplay) — instrução de gesto
            depois do gesto é ruído, e o pedido da issue é reforçar a affordance
            "sem poluir a leitura".

            `aria-hidden`, e isto é decisão, não descuido: a frase instrui um
            GESTO DE TELA para quem vê a faixa. Quem navega por leitor de tela não
            chega aqui deslizando — chega pela lista de quinze itens e pelos dois
            botões ao lado, que têm nome próprio. Anunciar "deslize" a essa pessoa
            descreveria uma interação que não é a dela.

            O texto é `sr-only`-invertido de propósito: nada aqui repete conteúdo
            de evento nenhum, então não há risco de leitura dupla. */}
        {!interagiu && emFoco === 0 ? (
          <p className="eventos-lista-dica" aria-hidden="true">
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            deslize para ver os 15 eventos
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </p>
        ) : null}
      </section>
    </>
  );
}
