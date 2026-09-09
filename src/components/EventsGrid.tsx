'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { EVENTS, EVENT_KIND_META, type EventKind, type SistranEvent } from '@/data/events';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';

type Filter = 'todos' | EventKind;

/* ============================================================================
   Cena de eventos — palco full-bleed + régua numerada (referência AVATR)
   ----------------------------------------------------------------------------
   A imagem sangra de ponta a ponta da tela, o texto do evento passa sobre ela no
   canto inferior esquerdo, e uma régua de segmentos numerados na base marca em
   qual dos quinze eventos a leitura está. Foi a apresentação escolhida entre as
   duas referências (a outra era o cartão sobreposto da Waabi).

   O PROBLEMA DE ASSET, e o que foi feito com ele.

   SIS-104 RESOLVEU A ORIGEM DESTE PROBLEMA — a estrutura abaixo continua, e o
   motivo dela mudou. Treze das quinze fotos agora são 1672x941 em WebP (eram
   todas 900x506), então `min(100%, 1125px)` deixou de ser ampliação de 1,25x e
   passou a ser REDUÇÃO de 0,67x: a camada nítida é servida com folga de pixels
   inclusive num display de 2x. A contenção que se segue não foi desfeita porque
   ela nunca dependeu só do tamanho do arquivo — 1125px é também a largura em que
   uma foto documental cheia de cartaz e crachá ainda se lê como fotografia e não
   como plano de fundo.

   Duas fotos seguem em 900x506, e para elas o parágrafo original vale ainda:
   Web Summit AI e SPIW não receberam versão nova (a nota longa está em
   `src/data/events.ts`). São as duas em que a contenção continua sendo o que
   evita ampliação destrutiva — e o Web Summit é justamente o primeiro card.

   A estrutura, então:

     - a foto nítida ocupa `min(100%, 1125px)`;
     - o resto da largura da tela é preenchido por uma SEGUNDA cópia da mesma
       foto, essa sim esticada, mas desfocada e escurecida — extensão de moldura,
       não conteúdo. Ninguém lê nitidez em algo desfocado de propósito.

   E isso não custa rede: `next.config` está com `images: { unoptimized: true }`,
   logo as duas `<Image>` apontam para o mesmo arquivo e o navegador faz UMA
   requisição.

   COMO A CENA É CONDUZIDA. O palco é `position: sticky` com a altura da janela;
   embaixo dele, os quinze blocos de texto reais ficam em fluxo normal, cada um
   ocupando uma fatia de tela, subindo por cima do palco. Não há pin de
   biblioteca, não há timeline, não há altura fingida: o que rola é o conteúdo.

   E é isso que preserva a acessibilidade da versão anterior. Os quinze títulos e
   descrições continuam TODOS no DOM, em ordem de leitura, visíveis — nenhum
   depende de interação, nenhum vive em `opacity: 0` esperando virar ativo. Cada
   um está numa fatia própria, então dois nunca se sobrepõem, e por consequência
   o modo de movimento reduzido não precisa de tratamento especial no texto: já
   está tudo legível.

   MOBILE não é esta cena estreitada, de propósito. Um retrato de 390x844 com
   `cover` sobre uma foto 16:9 mostraria uma tira central de ~30% da largura —
   exatamente o recorte destrutivo que esta seção foi refeita para eliminar.
   Abaixo de `lg` a cena não existe: cada evento é a foto inteira em 16:9 com o
   texto embaixo dela.
   ========================================================================== */

/* Fatia de scroll por evento. Não é 100svh: com quinze eventos isso somaria
   treze mil pixels, e a dose de rolagem por evento ficaria maior que a leitura
   que ele exige. 92svh é o acerto: a fatia tem de ser mais alta que o quadro de
   texto, senão o `sticky bottom` do quadro não tem folga para segurar — a folga é
   exatamente `altura da fatia - altura do quadro`. Com 74svh sobravam 146px, e o
   bloco atravessava a tela inteira até bater no cabeçalho. */
/* A fatia é uma medida do PALCO: só existe onde o palco existe. No mobile ela
   viraria 92svh de vazio embaixo de cada foto. */
const FATIA = 'min-h-0 lg:min-h-[92svh]';

/* Banda no meio da janela. O bloco de texto que a cruza é o evento ativo. */
const BANDA_ATIVA = '-34% 0px -34% 0px';

/* Teto de nitidez: 1125 = 1,25x os 900px da fonte. Ver a nota do cabeçalho. */
const LARGURA_NITIDA = 1125;

/* ----------------------------------------------------------------------------
   SIS-115 · A FOTO NO CENTRO, E O NAVEGADOR FORA DA GRADE
   ----------------------------------------------------------------------------
   O que a issue relata como "cartão vazando" foi medido antes de mexer, e o
   diagnóstico dela está certo — a causa é a RESERVA DE LARGURA, não um valor
   desafinado. A 1920 o cartão ia de x=37 a x=1162 (centro em 599, contra 960 da
   janela: 360px fora de centro) e o painel de 1214 a 1518 — sobrando **402px de
   navy morto** entre o painel e a borda direita. O motivo é estrutural: o palco é
   full-bleed e se mede contra a JANELA, o painel vive dentro do `.container-lp`
   (máx. 1180px, centrado), então descontar a coluna do painel da largura da foto
   empurrava a foto para a esquerda para abrir espaço a um painel que nem chega na
   borda.

   Então a reserva SAIU inteira (`--evento-painel` e `--evento-caixa` não existem
   mais) e o navegador deixou de ser coluna de grade: virou uma barra flutuante na
   base da janela, que é o "controle sobreposto" que a própria issue sugere. A
   `.evento-layout` deixa de ser grade — a trilha ocupa a largura do container.

   O CARTÃO PASSA A CABER NOS DOIS EIXOS. Antes a largura só olhava a horizontal;
   agora o teto também vem da altura disponível (`--evento-alt-disp`), que é a
   janela menos o cabeçalho fixo em cima e a faixa da barra embaixo. É isso que
   garante "visível por inteiro" quando a janela é baixa: num 1366×768 a foto
   passa de 900×506 para ~983×553 — maior E centrada, porque a largura que ela
   cedia ao painel voltou.

   O PREVIEW DE QUINZE VIROU ANTERIOR/PRÓXIMO, e as consequências foram tratadas
   uma a uma, porque tirar a lista tira navegação direta:

     - ALCANCE: os quinze eventos continuam todos no documento, em fluxo normal,
       cada um na sua fatia — a rolagem passa por todos, e anterior/próximo
       encadeiam a sequência inteira. Nada ficou inalcançável; o que se perde é o
       salto do 01 para o 12, e é a issue que pede essa troca.
     - POSIÇÃO: sem a lista, some a noção de "onde estou". Entra o contador
       `03 / 15`, com o mesmo papel que os quinze tracinhos da régua tinham.
     - RÓTULO: cada controle diz o NOME do evento de destino no `aria-label` — a
       miniatura é o preview visual, não o rótulo. Miniatura sozinha não é
       controle, e chevron sozinho não diz para onde vai.
     - PONTAS: no primeiro não há anterior, no último não há próximo. `aria-disabled`
       + `tabIndex` mantido, e NÃO `disabled`: o botão continua focável e é
       anunciado como indisponível, em vez de desaparecer da ordem de foco no
       meio de uma sequência. Circular foi descartado — numa cena conduzida por
       ROLAGEM, "próximo" no evento 15 jogaria a página de volta ao topo, que é
       desorientação, não navegação.
   ---------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------
   SIS-106 · NAVEGADOR LATERAL — o que ele substituiu, e por quê
   (histórico: a lista vertical de quinze itens descrita abaixo foi reduzida a
   anterior/próximo pela SIS-115, logo acima. O que segue explica por que a
   RÉGUA horizontal 01…15 saiu, e isso continua valendo.)
   ----------------------------------------------------------------------------
   Havia DUAS navegações para a mesma coisa, em cantos opostos da tela: a barra
   de filtros horizontal acima da imagem e a régua numerada 01…15 colada na base.
   A régua foi REMOVIDA e as duas viraram um painel só, na lateral direita, ao
   lado da foto.

   O motivo de remover em vez de conviver não é só "duas navegações competem": a
   régua tinha quinze segmentos de ~90px a 1440, largura em que nome de evento não
   cabe — ela só conseguia mostrar o NÚMERO, e o número sozinho não diz o que vem
   a seguir. Era navegação sem preview. Na vertical cabem miniatura, número e
   título, que é exatamente o que a issue pede: ver de relance o que existe na
   sequência em vez de descobrir avançando.

   ONDE ELE MORA NA ÁRVORE importa, e a régua já tinha aprendido isso na marra: o
   palco está debaixo do `z-10` da trilha de texto, então botão colocado lá dentro
   existia mas não recebia clique — a trilha interceptava o ponteiro inteiro. O
   painel é filho do MESMO invólucro da trilha (`container-lp`, `z-10`): fica na
   camada que recebe ponteiro por construção, sem depender de ordem de irmãos.
   Continua valendo depois da SIS-115 — a barra ficou `fixed`, mas não saiu desse
   invólucro justamente para não reabrir esse problema.

   E vem ANTES da trilha no DOM, aparecendo à direita por colocação de grade. São
   controles: quem navega por teclado os encontra antes do conteúdo que eles
   comandam, e não depois de quinze descrições longas.

   MOBILE não recebe o painel. Uma coluna de 19rem ao lado da foto não existe em
   390px, e comprimir o desktop era o que a issue proibia: abaixo de `lg` só os
   filtros ficam, na horizontal, como já eram. A lista de miniaturas sai de cena —
   ali a página já é a foto inteira de cada evento, em sequência, então a preview
   seria uma segunda cópia da mesma informação logo acima dela. */

/* Numeração: a POSIÇÃO NO CATÁLOGO, e não a posição na lista filtrada.
   O número era `i + 1` sobre a lista visível, então filtrar por "Evento nacional"
   renumerava o Insurtech Brasil de 05 para 03 — o rótulo mudava de significado
   conforme o filtro, e o mesmo evento tinha dois números diferentes em duas
   telas. Sendo o índice no catálogo completo ele é identidade estável: 05 é o
   Insurtech Brasil em qualquer filtro, e os saltos na sequência (05, 08, 09…) são
   a informação de que há eventos fora do filtro atual, não um defeito. */
const ordemNoCatalogo = (e: SistranEvent) => EVENTS.indexOf(e) + 1;

function BlocoDeEvento({
  e,
  // SIS-153 — `ordem` sai junto com o `<span className="evento-ordem">`, que era o
  // ÚNICO uso dela dentro da fatia (conferido: nenhuma âncora, `id` ou `aria-label`
  // a consumia). Mantê-la só para não apagar quebraria o lint por parâmetro não
  // utilizado. `ordemNoCatalogo` continua no arquivo, porque as miniaturas usam.
  // ordem,
  // SIS-149 — `rm` sai da assinatura junto com o `<span hidden data-rm>` mais
  // abaixo, que era o único uso dela aqui dentro. Mantê-la só para não a apagar
  // quebraria o lint por parâmetro não utilizado.
  // rm,
  aoRegistrar,
}: {
  e: SistranEvent;
  // ordem: number;
  // rm: boolean;
  aoRegistrar: (el: HTMLLIElement | null) => void;
}) {
  const Icon = getIcon(e.icon);
  const tone = EVENT_KIND_META[e.kind].tone;
  const temVideo = e.id === 'web-summit-ai' || e.id === 'suitability-ai';

  return (
    <li
      ref={aoRegistrar}
      className={clsx('evento-fatia relative flex flex-col justify-end', FATIA)}
      style={{ '--tone': tone } as CSSProperties}
    >
      {/* MOBILE: a foto inteira, em 16:9, acima do texto. No desktop sai de cena
          porque o palco full-bleed assume — e como está em `display: none` com
          `loading="lazy"`, o arquivo nem é baixado ali: nunca intersecta a
          janela, então não há download em duplicidade.

          SIS-106 — o raio vem do token `--radius-card`, o mesmo do cartão do
          desktop, e não de um `rounded-2xl` solto que era 16px contra 24px. */}
      {e.image && (
        <div className="relative mb-6 aspect-[900/506] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/12 lg:hidden">
          <Image
            src={e.image}
            alt={e.title}
            fill
            sizes="(max-width: 1023px) 92vw, 0px"
            loading="lazy"
            className="object-cover"
          />
        </div>
      )}

      {/* O quadro de texto para no canto inferior esquerdo — como na referência —
          em vez de atravessar a tela de baixo a cima. Sem isso, o bloco subia até
          o topo da janela e o título terminava atrás do cabeçalho fixo, branco
          sobre a parte clara da foto (capturado: o título do evento 06 ilegível,
          cortado pela barra de navegação).
          `sticky bottom` deixa o bloco preso perto da base enquanto a fatia dele
          passa, e o solta quando a fatia acaba. (Até SIS-106 a referência dessa
          parada era a régua na base da tela; agora é a própria borda da foto — o
          `bottom` do `.evento-quadro` caiu de 9.5rem para 5.5rem por isso.) */}
      <div className="evento-quadro relative lg:sticky">
        {/* Escurecimento local, que anda junto com o quadro: a proteção fica onde o
            texto está, e o resto da foto segue limpo. */}
        <div aria-hidden className="evento-escrim hidden lg:block" />

        <div className="evento-texto relative max-w-[52ch]">
          <span className="evento-selo inline-flex items-center gap-2">
            <Icon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: tone }} />
            <span style={{ color: tone }}>{EVENT_KIND_META[e.kind].label}</span>
          </span>

          {/* SIS-153 — o "01"/"02" saiu do JSX, e não do CSS: `display: none` no
              `.evento-ordem` deixaria o número no HTML servido e no leitor de tela,
              que é justamente o que a issue proíbe. Saindo daqui, ele não é
              renderizado no servidor nem no cliente, em nenhuma largura — o `<h3>`
              é o mesmo em desktop e em mobile.
              A NUMERAÇÃO DO COMPONENTE NÃO SAIU: `ordemNoCatalogo` continua viva,
              chamada como `ordemNoCatalogo(alvo)` para o número das miniaturas de
              anterior/próximo no painel. Quem informa "onde estou nos quinze" agora
              é só o contador do painel — o par `activeIdx + 1` e
              `.evento-posicao-total` — e sem ele e sem este número não sobraria
              nenhuma pista de posição.
              As duas referências acima são por NOME e não por número de linha de
              propósito: a primeira versão desta nota citava "linhas 565-566" e
              "linha ~607" e já nasceu errada em ~16 linhas, que é o tamanho deste
              próprio bloco comentado. Nome não envelhece na próxima inserção; grep
              acha, e número de linha só mente.
          <h3 className="evento-titulo font-display">
            <span className="evento-ordem tabular-nums" style={{ color: tone }}>
              {String(ordem).padStart(2, '0')}
            </span>
            {e.title}
          </h3>
          */}
          <h3 className="evento-titulo font-display">{e.title}</h3>

          <p className="evento-descricao">{e.description}</p>

          {temVideo && (
            <span
              className="evento-chip mt-5 inline-flex w-fit items-center gap-2"
              style={{ borderColor: `${tone}66`, background: `${tone}1f` }}
            >
              <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: tone }} />
              <span style={{ color: '#eaf6ff' }}>Assista no YouTube</span>
            </span>
          )}
        </div>
      </div>

      {/* SIS-149 — este `<span>` saiu de cena porque o comentário dele afirmava um
          propósito que o CSS desmente. Conferido: os únicos `[data-rm]` do
          `globals.css` são `.spine[data-rm] .spine-viva` e
          `.spine[data-rm] .spine-no` (do `ScrollSpine`, achável por
          `grep -n "data-rm" src/app/globals.css`), ambos exigindo `.spine` no MESMO
          elemento — nunca alcançariam um span solto aqui. E "anular a transição do
          escrim" não existe para anular: nenhuma das duas regras de
          `.evento-escrim` (a base e a de >=1024) declara `transition`. Ou seja, o
          atributo não tinha leitor e a transição não tinha existência.
          O primeiro parágrafo da nota antiga continua verdadeiro e é a razão de
          nada faltar com a saída dele: os blocos nunca se sobrepõem, então não há
          animação de entrada para desligar por aqui. Quem cuida de movimento nesta
          cena é a classe `evento-camada-anima`, que só é aplicada quando `rm` é
          falso — e essa continua sendo a leitura viva do `rm` neste arquivo, junto
          com o `behavior` do `scrollTo` da trilha. (Citadas por nome, e não por
          linha, pelo mesmo motivo escrito na nota da SIS-153 acima.)
          Se algum dia o escrim ganhar `transition`, o gancho volta — e aí com regra
          de CSS escrita junto, não antes dela.
      <span hidden data-rm={rm ? 'true' : undefined} />
      */}
    </li>
  );
}

export default function EventsGrid() {
  const rm = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('todos');
  const [activeIdx, setActiveIdx] = useState(0);
  const itens = useRef<(HTMLLIElement | null)[]>([]);

  const visible = useMemo(
    () => (filter === 'todos' ? [...EVENTS] : EVENTS.filter((e) => e.kind === filter)),
    [filter],
  );

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: EVENTS.length },
    ...(Object.keys(EVENT_KIND_META) as EventKind[]).map((k) => ({
      key: k as Filter,
      label: EVENT_KIND_META[k].label,
      count: EVENTS.filter((e) => e.kind === k).length,
    })),
  ];

  /* Quando nenhum bloco cruza a banda (a folga entre duas fatias) o valor
     ANTERIOR permanece: limpar faria o palco piscar de volta ao evento 1 no meio
     da leitura. */
  useEffect(() => {
    const nos = itens.current.filter(Boolean) as HTMLLIElement[];
    if (!nos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nos.indexOf(entry.target as HTMLLIElement);
          if (idx >= 0) setActiveIdx((atual) => (atual === idx ? atual : idx));
        }
      },
      { rootMargin: BANDA_ATIVA, threshold: 0 },
    );
    nos.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [visible]);

  /* Os controles são navegáveis: cada um leva à fatia do evento de destino.
     Rolagem por `window.scrollTo` e não `scrollIntoView` porque o Lenis intercepta
     a segunda; o alvo é a BASE da fatia, que é onde o texto dela está. */
  const irParaEvento = useCallback(
    (i: number) => {
      const el = itens.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const destino = r.bottom + window.scrollY - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, destino),
        behavior: rm ? 'auto' : 'smooth',
      });
    },
    [rm],
  );

  /* SIS-115 — aqui vivia o efeito que rolava a lista de quinze itens por dentro
     para manter o aceso à vista. Sem lista, não há o que acompanhar; o que entrou
     no lugar é o oposto — a barra ficou `fixed` e precisa saber quando NÃO existir.

     Um observer sobre a própria seção resolve isso sem `scroll` handler: o preço
     do `fixed` (não fazer ideia de onde a seção acaba) se paga com quatro linhas,
     e não pagá-lo deixaria os controles pairando sobre o rodapé. `isIntersecting`
     cru serve porque a seção tem quinze telas de altura: enquanto qualquer parte
     dela estiver na janela, os controles fazem sentido. */
  const secao = useRef<HTMLElement | null>(null);
  const [naCena, setNaCena] = useState(false);
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entrada]) => setNaCena(entrada.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* A faixa que a foto reserva na base é a ALTURA REAL da barra, publicada aqui em
     `--evento-barra`. Não é medição por gosto: a barra embrulha conforme a largura
     da janela (a 1366 os seis filtros vão para duas linhas), e o `clamp()` fixo que
     havia no CSS errou por 60px — a barra foi a 145px e cobriu 75px da foto.

     Escrito no nó da SEÇÃO, não no `:root`: o token só existe dentro desta cena, e
     sujar o documento inteiro faria uma variável de um componente virar global.
     Vai por `style.setProperty` em vez de estado do React porque isto é geometria
     de layout — passar por render devolveria o valor um quadro depois, com a foto
     saltando de tamanho a cada resize. */
  const barra = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = barra.current;
    const alvo = secao.current;
    if (!el || !alvo) return;
    const medir = () => {
      alvo.style.setProperty('--evento-barra', `${Math.ceil(el.getBoundingClientRect().height)}px`);
    };
    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ativo = visible[activeIdx] ?? visible[0];
  const toneAtivo = ativo ? EVENT_KIND_META[ativo.kind].tone : '#0ed8f6';

  /* Os dois destinos. Ponta é `undefined`, não um índice circular: no evento 15,
     "próximo" voltando ao 01 jogaria a página do fim ao topo — numa cena conduzida
     por ROLAGEM isso é desorientação, não navegação. */
  const anterior = activeIdx > 0 ? visible[activeIdx - 1] : undefined;
  const proximo = activeIdx < visible.length - 1 ? visible[activeIdx + 1] : undefined;

  return (
    /* Sem `overflow-hidden` e sem `cv-auto`: os dois quebram `position: sticky`
       do palco — `overflow` faz desta seção o scrollport, e
       `content-visibility: auto` implica `contain: paint`, que cria bloco de
       contenção e recorta. A restrição já está registrada no `.cv-auto` do
       globals.css. */
    <section id="eventos" ref={secao} className="evento-cena relative">
      {/* --- Palco (desktop) -------------------------------------------------
          `aria-hidden`: a foto, o título e a posição que aparecem aqui são os
          mesmos que a lista abaixo já anuncia em texto. Nada aqui é informação
          nova, então não deve ser lido duas vezes. */}
      {/* O `sticky` mora NESTE invólucro, e não no palco lá dentro. Um elemento
          sticky só se move dentro da caixa do PAI: com `sticky` no palco, o pai era
          este invólucro de uma tela de altura, a faixa de deslizamento media zero e
          o palco simplesmente rolava embora. Medido: a moldura em `top: -600`,
          `-3400`, `-6800` — o quadro saía de cena e sobrava o navy do fundo.
          Sendo filho direto da seção, a faixa passa a ser a seção inteira. */}
      <div aria-hidden className="hidden sticky top-0 h-[100svh] lg:block">
        <div className="evento-palco relative h-full w-full overflow-hidden">
          {visible.map((e, i) =>
            e.image && Math.abs(i - activeIdx) <= 1 ? (
              /* Só a camada ativa e as duas vizinhas ficam montadas. A seguinte
                 existe para JÁ ESTAR CARREGADA quando entrar — sem ela a
                 travessia dissolveria para o vazio; a anterior existe para ter de
                 onde dissolver. As quinze empilhadas baixariam quinze fotos de
                 uma vez, sem que nenhuma fosse vista. */
              <div
                key={e.id}
                className={clsx('evento-camada', !rm && 'evento-camada-anima')}
                data-ativo={i === activeIdx ? 'true' : undefined}
              >
                {/* Extensão de moldura: mesma foto, esticada até a borda, mas
                    desfocada e escurecida. É o que leva a cena ao full-bleed sem
                    fingir resolução que o arquivo não tem. */}
                {/* `loading="eager"` explícito: o `next/image` é LAZY por padrão
                    quando não tem `priority`, e aqui isso adiava duas vezes. A camada só existe no
                    DOM quando é a ativa ou uma vizinha, então a janela de três já
                    É o adiamento — e `lazy` em cima disso adiava DUAS vezes: as
                    camadas nascem em `visibility: hidden` e o navegador não
                    considerava a imagem intersectando, então ela nunca começava a
                    baixar. Medido: `complete: false` e `naturalWidth: 0` em todas
                    as camadas a partir da 9ª, isto é, palco vazio da metade da
                    seção em diante. */}
                <Image
                  src={e.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  loading="eager"
                  className="evento-sangria object-cover"
                />
                {/* Foto nítida, no teto de 1,25x.
                    SIS-106 — DOIS nós, e não um: `.evento-cartao` é a caixa SEM
                    recorte, que carrega a sombra e a pluma que dissolvem a borda
                    no fundo desfocado; `.evento-moldura` é a caixa COM recorte,
                    que arredonda o canto. Precisam ser separados porque o
                    `overflow: hidden` que o raio exige é o mesmo que cortaria a
                    dissolução — o conflito está anotado em detalhe no
                    `globals.css`. */}
                <div className="evento-cartao">
                  <div className="evento-moldura">
                    <Image
                      src={e.image}
                      alt=""
                      fill
                      sizes={`${LARGURA_NITIDA}px`}
                      priority={i === 0}
                      loading="eager"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : null,
          )}

          {/* Véu no topo: recebe o navy do hero e garante o cabeçalho legível
              sobre qualquer foto. Faz o trabalho que a emenda de cor fazia
              quando esta seção era clara. */}
          <span aria-hidden className="evento-veu-topo" />
        </div>
      </div>

      {/* --- Trilha de texto -------------------------------------------------
          `-mt-[100svh]` no desktop: os blocos sobem POR CIMA do palco fixo, que é
          o que faz a cena. No mobile o palco não existe, então a margem também
          não — a trilha é a página. */}
      <div className="container-lp relative z-10 lg:-mt-[100svh]">
        {/* SIS-115 — sem grade. O navegador continua PRIMEIRO no DOM (são
            controles: quem navega por teclado os encontra antes das quinze
            descrições que eles comandam), mas no desktop ele sai do fluxo e vira
            barra na base da janela, então a trilha ocupa o container inteiro. */}
        <div className="evento-layout">
        <aside
          ref={barra}
          className="evento-navegador"
          aria-label="Navegação pelos eventos"
          /* Escrito pelo observer da seção: a barra é `fixed` e por si só não
             saberia que a cena acabou. */
          data-visivel={naCena ? 'true' : 'false'}
        >
        {/* Filtros. Sem play/pause e sem pontos: não há carrossel a controlar —
            os quinze eventos estão no fluxo do documento, e a navegação é a
            rolagem, o par anterior/próximo e o teclado. */}
        <div className="evento-filtros">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                /* O reinício acontece AQUI, no evento, e não num `useEffect` que
                   observa `filter`: o efeito seria um segundo render em cascata
                   para chegar a um estado já conhecido no clique. */
                onClick={() => {
                  if (f.key === filter) return;
                  itens.current = [];
                  setActiveIdx(0);
                  setFilter(f.key);
                }}
                className={clsx(
                  'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
                  active ? '!text-white' : '!text-[#B8DDF6] hover:!text-white',
                )}
                aria-pressed={active}
              >
                {active && (
                  <motion.span
                    layoutId="events-filter-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#0079CB] to-[#0060A8] ring-1 ring-inset ring-white/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                {/* SIS-155 — contagem do filtro: camada técnica, e 10px → 11px, que é
                    o piso da issue (o degrau de 10px é proibido por nome). O chip tem
                    `px-2 py-0.5` e cresce com o texto, então o pixel a mais não
                    aperta nada. */}
                <span
                  style={{ fontFeatureSettings: '"tnum" 1' }}
                  className={clsx(
                    'relative z-10 rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums',
                    active ? 'bg-white/25 !text-white' : 'bg-white/10 !text-[#B8DDF6]',
                  )}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

          {/* --- Preview: anterior · posição · próximo ------------------------
              Só desktop (ver a nota do topo). Era uma lista de quinze; virou um
              par, e por isso deixou de ser `<ol>`: dois controles de direção não
              são uma lista ordenada de conteúdo, são um grupo de comandos —
              anunciar "item 1 de 2" ali não informaria nada.

              O que se perdeu com a lista foi tratado: a ORDEM da sequência
              continua no `<ol>` da trilha (que é onde o conteúdo está de verdade,
              e onde o leitor de tela anuncia "item 3 de 15"), a POSIÇÃO virou o
              contador no meio, e o DESTINO está no `aria-label` de cada botão.
              Miniatura é preview visual, não rótulo: sozinha ela não diz para
              onde leva, e chevron sozinho diz a direção mas não o destino. */}
          <div className="evento-preview" role="group" aria-label="Evento anterior e próximo">
            {([
              { dir: 'anterior', alvo: anterior, idx: activeIdx - 1 },
              { dir: 'proximo', alvo: proximo, idx: activeIdx + 1 },
            ] as const).map(({ dir, alvo, idx }, ordemNaBarra) => {
              const tone = alvo ? EVENT_KIND_META[alvo.kind].tone : '#0ed8f6';
              const rotulo = dir === 'anterior' ? 'Evento anterior' : 'Próximo evento';
              const Seta = dir === 'anterior' ? ChevronLeft : ChevronRight;
              return (
                <div key={dir} className="contents">
                  {/* O contador entra entre os dois controles, e não numa ponta:
                      é o "onde estou" que separa o "de onde vim" do "para onde
                      vou". `aria-hidden` porque é a mesma informação que a trilha
                      já dá em texto — repeti-la aqui obrigaria a uma região viva
                      que anunciaria um número novo a cada rolagem. */}
                  {ordemNaBarra === 1 && (
                    <p aria-hidden className="evento-posicao">
                      <span>{String(activeIdx + 1).padStart(2, '0')}</span>
                      <span className="evento-posicao-total">/ {visible.length}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => alvo && irParaEvento(idx)}
                    /* `aria-disabled` e não `disabled`: ver a nota da regra
                       correspondente no globals.css. O rótulo diz o motivo, não
                       só o estado — "não há evento anterior" é mais útil que um
                       botão apagado sem explicação. */
                    aria-disabled={alvo ? undefined : true}
                    aria-label={
                      alvo
                        ? `${rotulo}: ${alvo.title}`
                        : dir === 'anterior'
                          ? 'Não há evento anterior — este é o primeiro'
                          : 'Não há próximo evento — este é o último'
                    }
                    data-direcao={dir}
                    className="evento-preview-item"
                    style={{ '--tone': tone } as CSSProperties}
                  >
                    <Seta aria-hidden size={16} className="evento-preview-seta" />
                    {alvo?.thumb && (
                      <span aria-hidden className="evento-preview-foto">
                        {/* Miniatura de 240px, arquivo próprio: `sizes` casado com
                            a largura real do slot para o navegador não pedir nada
                            maior. `loading="lazy"` — a barra só mostra duas, e
                            elas trocam conforme a leitura avança. */}
                        <Image
                          src={alvo.thumb}
                          alt=""
                          fill
                          sizes="56px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="evento-preview-texto">
                      {/* SIS-155 — ordinal do preview: camada técnica. */}
                      <span
                        /* SIS-155 — `font-semibold` NÃO é ênfase: a utilitária `font-mono` só troca a
                           família, e sem peso declarado este nó pedia 400 — peso que o único corte
                           carregado da Geist Mono (600) não tem. O navegador servia o 600 e o código
                           dizia 400: se um dia entrar um corte 400 na Mono, oito pontos como este
                           mudariam de aparência calados. Medido em 600 computado pela sonda. */
                        className="evento-preview-num font-mono font-semibold tabular-nums"
                        style={{ color: tone, fontFeatureSettings: '"tnum" 1' }}
                      >
                        {alvo ? String(ordemNoCatalogo(alvo)).padStart(2, '0') : '—'}
                      </span>
                      <span className="evento-preview-titulo">{alvo?.title ?? rotulo}</span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        <ol className="evento-trilha" style={{ '--tone-ativo': toneAtivo } as CSSProperties}>
          {visible.map((e, i) => (
            /* SIS-149 — o `rm={rm}` saiu daqui junto com o `<span hidden data-rm>`
               lá dentro, que era o único consumidor da prop. O `rm` desta função
               CONTINUA vivo e usado em dois lugares que nada têm a ver com isto: o
               `behavior` do scroll da trilha e o `.evento-camada-anima`. */
            <BlocoDeEvento
              key={e.id}
              e={e}
              /* SIS-153 — `ordem={ordemNoCatalogo(e)}` saiu daqui junto com o
                 número sobre a foto. A função em si NÃO saiu: as miniaturas de
                 anterior/próximo continuam chamando `ordemNoCatalogo(alvo)`, e é
                 dela que vem a identidade estável do evento no catálogo. */
              aoRegistrar={(el) => {
                itens.current[i] = el;
              }}
            />
          ))}
        </ol>
        </div>
      </div>

      {/* SIS-106 — A RÉGUA NUMERADA 01…15 FICAVA AQUI, e foi REMOVIDA.
          Quem faz o trabalho dela agora é o `.evento-preview` do navegador
          lateral, que dá a mesma navegação direta com o que a régua não conseguia
          mostrar: miniatura e título. A justificativa completa está na nota do
          topo do arquivo.

          REMOVIDA, e não comentada — diferente dos blocos comentados desta base,
          aqui não há nada a religar: a régua e a lista lateral são a MESMA função,
          e ter as duas de volta reproduz exatamente a competição entre navegações
          que a issue mandou resolver. O markup e o CSS (`.evento-regua*`, que saiu
          junto do `globals.css`) estão no histórico do git, neste commit.

          Duas decisões dela sobreviveram e migraram para o painel, porque foram
          aprendidas na marra e continuam valendo:

          1. Botão de navegação NÃO PODE morar dentro do palco. O palco está
             debaixo do `z-10` da trilha de texto, que intercepta o ponteiro
             inteiro — lá dentro os botões existiam e não recebiam clique (medido:
             o clique no segmento 10 expirava em 30s). O painel é filho do mesmo
             invólucro da trilha, que é a camada que recebe ponteiro.
          2. O acento do item ativo é o degradê `#0079cb → tone`, o mesmo do
             `.pagehero-fio`. */}

      {/* Emenda de saída: a cena escura converge para o `#0b4e86` que é a
          primeira parada do degradê da Social, logo abaixo.

          SIS-107 — a convergência acontece DENTRO desta seção, ancorada na base
          dela (`bottom: 0` em `.eventos-emenda-base`, que antes não existia — sem
          isso o absoluto caía na posição estática e pintava já em cima da Social,
          somando-se à emenda de claro dela: eram os dois cortes em sequência
          relatados na issue). É ela que fecha a cena de propósito, agora que a
          SIS-106 tirou a régua 01…15 que era o último elemento daqui. */}
      <span aria-hidden className="eventos-emenda-base z-[1]" />
    </section>
  );
}
