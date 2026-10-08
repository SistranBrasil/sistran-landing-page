/**
 * SdsPagina — `/solucoes/sds`. SIS-120 (29/09), reabertura de 29/09.
 *
 * ── O QUE A ISSUE PEDE, E O QUE ESTA PASSADA MUDA ───────────────────────────
 * O enunciado é «ajustar TODA a estrutura visual ao mesmo padrão de layout de
 * `/solucoes/match-ai`», e diz na mesma frase o que NÃO muda: «Não reescrever a
 * copy — textos de `acceleratorPages` / `docs/sds.md` permanecem; o que muda é
 * casca, hierarquia, ícones, mídia e fundo».
 *
 * ⚠️ A ARQUITETURA DE SEÇÕES NÃO FOI REESCRITA, E ISSO É DELIBERADO. Conferido
 * seção por seção contra `MatchAiPagina.tsx`: o padrão que a issue nomeia — «hero
 * sangrado com marca/capa, lead, grades de ícones, faixa escura de processo/jornada,
 * posicionamento/fecho, "Conheça também" + CTA» — JÁ estava montado aqui em oito
 * blocos, com `RevealScope` + `data-reveal` + a cascata `--reveal-i` e o mesmo
 * calibre (`reveal-calibre.ts`) da rota irmã. Reescrever o que já casa trocaria
 * marcação por marcação sem mover um pixel de hierarquia, e poria em risco a copy
 * que a issue manda preservar. O QUE FALTAVA era o resto da lista, e é isso que
 * entrou:
 *
 *   item 2 · fundo sequencial de `/quem-somos` → `classeDoMain="sds-canvas"` +
 *            `AtmosferaQuadrados classe="sds-atmosfera"`, montados em
 *            `src/app/solucoes/[slug]/page.tsx`; o CSS é o bloco `SIS-120` do fim de
 *            `globals.css`. É ele que tira o degrau entre faixas claras vizinhas.
 *   item 3 · o bloco explícito da página oficial: preview com miniatura + a pílula
 *            «Abrir demonstração» para `https://sds-landing-page-six.vercel.app/`.
 *   item 4 · ícones Lucide nas etapas, pilares, benefícios e agentes — já existiam
 *            (`ICONES_ETAPAS`, `ICONES_BENEFICIOS`, os três dos pilares) e seguem.
 *   item 5 · a frase manuscrita de `docs/fonte2.md`, em UM ponto editorial.
 *   item 6 · `public/videos/tile-sdsapres.mp4` como tile de produto + os slots 3D.
 *   item 1 · «Conheça também» + CTA, que era o único pedaço do molde do Match AI
 *            ausente da árvore (ver o ⚠️ do fecho).
 *
 * ⚠️ POR QUE «Conheça também» TEM DE VIVER AQUI DENTRO: esta é a única das sete
 * slugs excluída do fecho compartilhado — `src/app/solucoes/[slug]/page.tsx` monta
 * `{!ehSds && <ContactCTA …>}`. Sem o bloco dentro do corpo, a rota terminava sem
 * vitrine e sem a pílula de «Ver todas as soluções», que é justamente o fim do
 * padrão do Match AI.
 *
 * ⚠️ NENHUMA FRASE DA PÁGINA FOI REESCRITA. Os oito blocos continuam sendo lidos de
 * `page.blocks` pelo `heading` exato. As ÚNICAS escritas novas são rótulos de
 * interface dos blocos que a issue mandou criar e que não existiam em dado nenhum
 * («Abrir demonstração», que é o literal da própria issue, «Demonstração oficial», o
 * endereço do ar e as legendas dos slots) — e a frase manuscrita, que é o literal de
 * `docs/fonte2.md`. Copy institucional: intacta.
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileCheck2,
  FileSearch,
  GitBranch,
  Handshake,
  MessagesSquare,
  /* `MonitorPlay` COMENTADO, não apagado: ele era a legenda «SDS em operação» do tile
     de vídeo, que saiu do bloco de demonstração no pedido «deixe só o preview». O
     vídeo em «Uma plataforma…» segue sem legenda sobreposta — uma tarja cobriria o quadro.
  MonitorPlay, */
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
} from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import {
  ACCELERATOR_PAGES,
  idDoBloco,
  type AccelBlock,
  type AcceleratorPage,
} from '@/data/acceleratorPages';
import { useReducedMotion } from '@/lib/motion';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

const HERO_HIGHLIGHTS = [
  'Rastreabilidade ponta a ponta',
  'Governança humana',
  'Agentes especializados',
  'Integração com o ecossistema da seguradora',
] as const;

/* IHDR de `public/carimbo-sds-ticket-outline-ffffff.png`. O par alimenta
   `--carimbo-batida-ar`; um número redondo achata a cápsula. */
const CARIMBO_CAPA = { largura: 735, altura: 336 } as const;

/* Logo 3D da marca (`public/sds3d2.png`, 1707×921). Substitui `logo-sds.png`
   no hero (papel de manchete, como `.matchai-marca-hero`) e nos dados do card. */
const MARCA_SDS = {
  src: '/sds3d2.png',
  largura: 1707,
  altura: 921,
} as const;

/* Título local: o nav lateral sai dos blocos de `acceleratorPages`, então este
   `h2` não vira parada. */
const TITULO_ABERTURA = 'O que é o SDS';

const ICONES_ETAPAS = [
  Sparkles,
  FileCheck2,
  FileSearch,
  ScanSearch,
  ShieldCheck,
  Workflow,
  GitBranch,
  UserCheck,
] as const;

const ICONES_BENEFICIOS = [
  Workflow,
  Sparkles,
  FileCheck2,
  GitBranch,
  ShieldCheck,
  Handshake,
  Network,
  UserCheck,
] as const;

/* ── PEDIDO (item «mude a estrutura e coloque mais ícones») — OS SEIS DOMÍNIOS DO
   HUB DE INTEGRAÇÃO. Sobem para uma constante em vez de ficarem num literal dentro
   do JSX porque agora cada rótulo carrega um ícone: um array de strings mapeado com
   `index` para escolher ícone é o arranjo que sai de sincronia na primeira
   reordenação — o par fica atado no mesmo objeto.
   Os SEIS RÓTULOS SÃO OS QUE JÁ ESTAVAM na página, letra por letra e na mesma ordem.
   A escolha de cada ícone é literal ao domínio (contrato → `FileCheck2`, sinistro →
   `ShieldCheck`, documento → `FileSearch`, pagamento → `CreditCard`, comunicação →
   `MessagesSquare`, sistema → `Box`) — ícone que não é leitura direta do rótulo vira
   adivinhação, e é por isso que nenhum deles é decorativo genérico. */
const INTEGRACAO_DOMINIOS = [
  { rotulo: 'Apólices', Icone: FileCheck2 },
  { rotulo: 'Sinistros', Icone: ShieldCheck },
  { rotulo: 'Documentos', Icone: FileSearch },
  { rotulo: 'Pagamentos', Icone: CreditCard },
  { rotulo: 'Comunicação', Icone: MessagesSquare },
  { rotulo: 'Sistemas corporativos', Icone: Box },
] as const;

/* SIS-120 · item 3 — O ENDEREÇO DA PÁGINA OFICIAL, numa constante e não repetido em
   dois `href`. Ele já aparecia no fecho como CTA secundário («Explore a demonstração
   do SDS») e agora aparece também no bloco de preview: dois literais iguais em
   arquivos vivos é o tipo de coisa que sai de sincronia na primeira troca de domínio.
   O ROTULO SEM `https://` existe porque é ele que vai na barra do navegador desenhada
   no preview — mostrar o esquema ali seria escrever o que nenhum navegador mostra. */
const SDS_DEMO_URL = 'https://sds-landing-page-six.vercel.app/';
const SDS_DEMO_HOST = 'sds-landing-page-six.vercel.app';

/* SIS-120 · item 6 — OS SLOTS 3D. São dois, e a escolha é de composição: a coluna da
   direita do bloco de demonstração tem o tile de vídeo em 9:16 ao lado, e três slots
   de 4/3 ali dentro cairiam para ~150px de largura a 1440, pequenos demais para
   receber render. O `titulo` NÃO é texto visível — vai para um `sr-only` dentro do
   slot, porque o que o leitor de tela precisa saber é que existe uma vaga de arte
   naquele ponto, e o que a tela mostra é a hachura.

   ⚠️ A ARTE NÃO EXISTE AINDA, e é a própria issue que autoriza o vazio
   («placeholders medidos até a arte existir»). O que está medido é a CAIXA: 4/3 e o
   vão do CSS (`.sds-slot3d`), então trocar cada slot por um `<Image>` no dia em que a
   arte chegar não move nada de lugar.

   ── PEDIDO «aqui deixe só o preview»: FORA DE CENA ──────────────────────────────
   Os dois slots saíram do bloco de demonstração nesta volta. A constante fica
   comentada, e não apagada, porque ela é a especificação das duas vagas: os títulos
   são o que diz QUAL render falta em cada uma. O CSS `.sds-slot3d` fica junto, no
   `globals.css`, pelo mesmo motivo.

const SLOTS_3D = [
  { id: 'jornada', titulo: 'Vaga para render 3D da jornada do sinistro' },
  { id: 'agentes', titulo: 'Vaga para render 3D dos agentes especializados' },
] as const;
*/

const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

function bloco(page: AcceleratorPage, heading: string) {
  return page.blocks.find((item) => item.heading === heading);
}

function itens(item: AccelBlock | undefined) {
  return item?.kind === 'list' ? item.items : [];
}

function paragrafos(item: AccelBlock | undefined) {
  return item?.kind === 'paragraphs' ? item.paragraphs : [];
}

function TituloSecao({
  heading,
  claro = false,
}: {
  heading: string;
  claro?: boolean;
}) {
  return (
    <h2
      id={idDoBloco(heading)}
      data-reveal="fade-up"
      className={`max-w-4xl font-display text-section font-bold ${claro ? 'text-ink' : 'text-white'}`}
    >
      {heading}
    </h2>
  );
}

function indiceMaisProximo(trilho: HTMLElement) {
  const slides = [...trilho.querySelectorAll<HTMLElement>(':scope > li')];
  const origem = trilho.getBoundingClientRect().left;
  let melhor = 0;
  let dist = Infinity;
  slides.forEach((slide, i) => {
    const d = Math.abs(slide.getBoundingClientRect().left - origem);
    if (d < dist) {
      dist = d;
      melhor = i;
    }
  });
  return melhor;
}

function CarrosselBeneficios({
  itens,
  rotuloId,
}: {
  itens: readonly { term?: string; text: string }[];
  rotuloId: string;
}) {
  const movimentoReduzido = useReducedMotion();
  const trilho = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);
  const [noInicio, setNoInicio] = useState(true);
  const [noFim, setNoFim] = useState(false);

  useEffect(() => {
    const no = trilho.current;
    if (!no) return;
    const aoRolar = () => {
      const max = no.scrollWidth - no.clientWidth;
      setIndice(indiceMaisProximo(no));
      setNoInicio(no.scrollLeft <= 1);
      setNoFim(max <= 1 || no.scrollLeft >= max - 1);
    };
    no.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      no.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, []);

  function ir(destino: number) {
    const no = trilho.current;
    if (!no) return;
    const slides = [...no.querySelectorAll<HTMLElement>(':scope > li')];
    const i = Math.max(0, Math.min(destino, slides.length - 1));
    const alvo = slides[i];
    if (!alvo) return;
    const esquerda = alvo.getBoundingClientRect().left - no.getBoundingClientRect().left + no.scrollLeft;
    const max = no.scrollWidth - no.clientWidth;
    const left = Math.max(0, Math.min(esquerda, max));
    no.scrollTo({
      left,
      behavior: movimentoReduzido ? 'auto' : 'smooth',
    });
    setIndice(i);
    setNoInicio(left <= 1);
    setNoFim(max <= 1 || left >= max - 1);
  }

  function aoTeclado(evento: React.KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'ArrowRight' && !noFim) {
      evento.preventDefault();
      ir(indice + 1);
    }
    if (evento.key === 'ArrowLeft' && !noInicio) {
      evento.preventDefault();
      ir(indice - 1);
    }
  }

  return (
    <div
      className="sds-beneficios-carrossel mt-10"
      role="region"
      aria-roledescription="carrossel"
      aria-labelledby={rotuloId}
      onKeyDown={aoTeclado}
    >
      <ul ref={trilho} className="sds-beneficios-trilho">
        {itens.map((item, index) => {
          const Icone = ICONES_BENEFICIOS[index] ?? Sparkles;
          return (
            <li
              key={item.term}
              data-reveal="fade-up"
              style={{ ...cascata(index + 1), '--sds-ben-i': index } as React.CSSProperties}
              className="sds-beneficio"
            >
              <span aria-hidden className="sds-beneficio-fio" />
              <span className="sds-beneficio-topo">
                <span aria-hidden className="sds-beneficio-selo">
                  <Icone strokeWidth={1.8} />
                </span>
                <span aria-hidden className="sds-beneficio-indice">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{item.term}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
            </li>
          );
        })}
      </ul>
      <div className="sds-beneficios-controles">
        <button
          type="button"
          className="sds-beneficios-seta"
          onClick={() => ir(indice - 1)}
          disabled={noInicio}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
          <span className="sr-only">Benefício anterior</span>
        </button>
        <div className="sds-beneficios-pontos" role="group" aria-label="Benefícios">
          {itens.map((item, index) => (
            <button
              key={item.term}
              type="button"
              className="sds-beneficios-ponto"
              aria-label={item.term ?? `Benefício ${index + 1}`}
              aria-current={index === indice ? 'true' : undefined}
              onClick={() => ir(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="sds-beneficios-seta"
          onClick={() => ir(indice + 1)}
          disabled={noFim}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
          <span className="sr-only">Próximo benefício</span>
        </button>
      </div>
    </div>
  );
}

export default function SdsPagina({ page }: { page: AcceleratorPage }) {
  /* SIS-120 — faixa «Uma plataforma…». O HTML do `<video>` sai SEM `autoplay`.
     `useReducedMotion()` nasce `false` no servidor e na hidratação, então
     `autoPlay={!movimentoReduzido}` gravava o atributo: o navegador começava a
     tocar (o arquivo também tem `loop`) e tirar o atributo depois que o hook vira
     `true` não pausa o que já começou. O CSS desta rota declara que não mexe nesse
     atributo. O play fica para depois da hidratação, lendo os dois canais da casa. */
  const videoPlataforma = useRef<HTMLVideoElement>(null);
  /* ⚠️ VOLTOU A SER UM `<video>` SÓ na rota. Houve um segundo nó com a mesma fonte
     (o cartão da «Demonstração oficial»), e a faixa saiu por pedido — o `ref` dele
     saiu junto, senão ficaria um `ref` que nunca aponta para nada.
     Fica o número medido enquanto os dois existiram, porque ele CORRIGE uma nota
     antiga do arquivo que dizia que dois `<video>` com a mesma fonte seriam «dois
     downloads do mesmo arquivo»: pelo CDP
     (`Network.loadingFinished.encodedDataLength`, o byte que de fato cruza a rede),
     com os dois tocando, foram 2 requisições somando 512.421 bytes — UMA vez o
     arquivo (511.843). A primeira é a sondagem de `preload="metadata"`, que fecha a
     conexão depois do cabeçalho; a segunda traz o arquivo, e o outro nó é servido sem
     tráfego novo. O que se paga duas vezes é decode e composição, não rede.
     ⚠️ E NÃO MEDIR ISSO PELA PERFORMANCE API: `getEntriesByType('resource')` devolveu
     UMA entrada só para as duas requisições (faixas de mídia são coalescidas), e o log
     de respostas do Playwright mostra dois corpos cheios porque o próprio
     `response.body()` busca de novo. As duas leituras levam a conclusões opostas; a do
     CDP é a que conta bytes. */

  useEffect(() => {
    const video = videoPlataforma.current;
    if (!video) return;
    /* COM ESCUTA, e não leitura única: a versão anterior lia os dois canais UMA vez só
       — ligar «reduzir movimento» depois do carregamento não parava o laço que já
       estava rodando, e desligar não o religava. */
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      const reduzido = consulta.matches || document.documentElement.dataset.motion === 'reduce';
      if (reduzido) {
        video.pause();
        /* Volta ao quadro 0 para casar com o pôster, que é o estado parado que a
           preferência pede. */
        video.currentTime = 0;
      } else {
        /* Pode ser rejeitado por política de autoplay (aba sem gesto do usuário);
           nesse caso fica o pôster, que é o fallback desejado. */
        void video.play().catch(() => undefined);
      }
    };
    aplicar();
    consulta.addEventListener('change', aplicar);
    const vigia = new MutationObserver(aplicar);
    vigia.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      consulta.removeEventListener('change', aplicar);
      vigia.disconnect();
    };
  }, []);

  const oQueE = bloco(page, 'Uma plataforma para toda a jornada de sinistros');
  const jornada = bloco(page, 'Do comunicado à regulação em oito etapas');
  const pilares = bloco(page, 'Três pilares');
  const agentes = bloco(page, 'Um agente especializado para cada momento da jornada');
  const governanca = bloco(page, 'A inteligência artificial apoia. A decisão permanece humana.');
  const beneficios = bloco(page, 'Impacto em toda a operação de sinistros');
  const integracao = bloco(page, 'Integração com o ecossistema da seguradora');
  const fecho = bloco(page, 'Sinistros mais inteligentes começam com uma jornada melhor estruturada');

  return (
    <>
      {/* ── SIS-120 (reparo 30/09): A CAPA É A ARTE SANGRADA ────────────────────
          Pedido: «a capa deve ficar igual às outras (Match AI / ESG), com fundo
          `public/images/capasds.png`». O molde é o do hero de `MatchAiPagina`, e a
          receita foi copiada de lá em vez de reinventada — ver as notas longas
          naquele arquivo, que é onde cada número foi medido.

          SAÍRAM TRÊS COISAS DESTA ABERTURA, e nenhuma por gosto:

            className="relative -mt-28 overflow-clip bg-[#001A3D] pb-20
                       pt-[10.5rem] md:-mt-36 md:pb-28 md:pt-[14rem]"

          1. O `-mt-28 md:-mt-36` DA SEÇÃO. Eram duas receitas para o mesmo
             problema: esta puxava a seção inteira para debaixo do cabeçalho, e o
             molde do Match AI deixa a seção no lugar e faz a ARTE estourar para
             cima (`-top-28 md:-top-36` no embrulho, abaixo). Manter as duas
             sangraria 7rem duas vezes e a arte subiria para fora da janela.
          2. O `overflow-clip`. É exigência do molde, não escolha: a arte estoura a
             caixa por cima de propósito, e qualquer recorte nesta seção corta
             exatamente o pedaço que o pedido manda mostrar. Pela CSS Overflow 3,
             `overflow-x-clip` não serve de meio-termo — com um eixo em `clip` o
             outro computa `clip` também. Aqui nada mais precisa ser recortado: a
             grade e os dois orbes saíram, e a arte é `fill`/`object-cover`, que não
             vaza do próprio embrulho.
          3. A GRADE + OS DOIS ORBES de `blur(150px)`:

               <div aria-hidden className="absolute inset-0">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(165,240,255,.055)_1px,transparent_1px),…]" />
                 <div className="absolute -left-40 top-8 … bg-[#0079CB]/25 blur-[150px]" />
                 <div className="absolute -right-32 bottom-0 … bg-[#0ed8f6]/15 blur-[140px]" />
               </div>

             Existiam para dar relevo a um fundo CHAPADO. Sobre foto, a grade vira
             linha riscada na cara das pessoas e os orbes viram névoa azul por cima
             da arte — é a mesma retirada que o Match AI fez na 6ª volta, pelo mesmo
             motivo e com o pedido escrito.

          A ALTURA MÍNIMA é o que garante que a arte apareça como arte: sem ela a
          faixa passa a ter a altura do texto. Os dois valores são os do Match AI
          (26rem / 33rem), que por sua vez são a capa de `/esg` MEDIDA — reaproveitar
          o número em vez de inventar um é o que dá a «paridade visual» que o aceite
          pede. `min-h` em `rem` e não `svh`: esta faixa é um BANNER, e em `svh` o
          recorte de `cover` mudaria de enquadramento com a barra de URL do celular
          no meio da rolagem. */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* Os `-top-28 md:-top-36` NÃO são escolha estética: são o `pt-28 md:pt-36`
            que o `PageShell` põe no `<main id="conteudo">` — 7rem e 9rem —, ou seja
            exatamente a distância entre o topo da janela e o começo do conteúdo. É
            essa tira, pintada com o navy da rota, que aparece como «faixa azul atrás
            do navbar»; cobri-la é o «incl. atrás do header» do aceite. Sobrar 1px
            devolve a linha dura.
            A sombra fica no EMBRULHO e só para BAIXO: com espalhamento para cima ela
            cairia justamente na tira atrás do cabeçalho, pintando de novo uma faixa
            escura ali. `box-shadow` e não `filter: drop-shadow`, porque `filter` cria
            contexto de empilhamento e prenderia o `position: fixed` do cabeçalho ao
            nó filtrado (está na habilidade de `filters`).
            O cabeçalho continua NA FRENTE da arte por medida, não por sorte:
            `Header.tsx` é `fixed … z-50` e a arte nasce em `z-index: auto`. */}
        <div
          aria-hidden
          className="absolute -top-28 right-0 bottom-0 left-0 shadow-[0_18px_44px_-18px_rgba(0,12,30,0.55)] md:-top-36"
        >
          {/* `data-route-critical-media` MIGROU PARA CÁ da placa do logo, que saiu:
              o portão de rota (`loading/RouteLoadGate.tsx`) tem de esperar a maior
              imagem acima da dobra, e agora é esta.
              `object-[72%_center]` abaixo de `lg`: o recorte de `cover` em tela
              estreita comeria o lado direito, que em `capasds.png` (1672×941, medido
              do PNG) é onde estão as mãos, o tablet e o fluxo — o lado esquerdo é a
              região mais limpa da arte e não perde nada ao ser cortado. De `lg` para
              cima a faixa é larga o bastante para mostrar a composição inteira. */}
          <Image
            data-route-critical-media=""
            src="/images/capasds.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[72%_center] lg:object-center"
          />
          {/* Dois véus, um por eixo. O texto da dobra é curto (carimbo, título,
              uma frase, dois botões) e fica à esquerda de `lg` para cima, então o
              véu horizontal abre a partir da metade: a arte da direita de
              `capasds.png` continua visível e o branco do texto segue sobre navy.
              Abaixo de `lg` o texto cai sobre a foto, e o véu vertical só alivia
              no pé da faixa. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.93)_0%,rgba(0,26,61,0.88)_62%,rgba(0,26,61,0.62)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.94)_30%,rgba(0,26,61,0.88)_48%,rgba(0,26,61,0.72)_64%,rgba(0,26,61,0.22)_78%,rgba(0,26,61,0)_90%)]" />
        </div>
        {/* UMA COLUNA SÓ, e é o molde: a grade de duas colunas saiu junto com a placa
            do logo (ver a nota onde ela estava). O teto de leitura desce para os nós
            de TEXTO — pôr `max-w` aqui encolheria o `.container-lp`, que é
            `max-width` + `mx-auto`, e container estreito centrado fica no meio da
            tela por definição: é o defeito que o Match AI mediu na 5ª volta. */}
        <RevealScope
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="sds-hero"
          className="container-lp relative z-10"
        >
          <div>
            <CarimboBatida
              src="/carimbo-sds-ticket-outline-ffffff.png"
              alt=""
              larguraIntrinseca={CARIMBO_CAPA.largura}
              alturaIntrinseca={CARIMBO_CAPA.altura}
              className="sds-carimbo"
              gatilho="rota"
            />
            <h1 data-reveal="fade-up" style={cascata(1)} className="mt-4 font-display">
              <Image
                src={MARCA_SDS.src}
                alt="SDS — Sistema Digital de Sinistros"
                width={MARCA_SDS.largura}
                height={MARCA_SDS.altura}
                priority
                className="sds-marca-hero"
              />
            </h1>
            <p
              data-reveal="fade-up"
              style={cascata(2)}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/85"
            >
              Do comunicado à decisão, uma jornada de sinistros mais inteligente
            </p>
            <div data-reveal="fade-up" style={cascata(3)} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`#${idDoBloco('Do comunicado à regulação em oito etapas')}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0ed8f6] px-5 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#A5F0FF]"
              >
                Conheça a jornada
                <ArrowDown className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white transition-colors hover:border-[#A5F0FF]/70 hover:bg-white/10"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* ── ⚠️ A PLACA CLARA DO LOGO SAIU, E ISSO DESFAZ UM PEDIDO ANTERIOR ───
              Ela era a segunda coluna deste hero e existia por pedido explícito
              («deixe o fundo claro para aparecer bem a logo da SDS»). Sai agora
              porque o reparo de 30/09 diz, com estas palavras, «Não inventar segunda
              capa» — e uma placa clara de 32rem sobre a foto é exatamente uma segunda
              capa disputando a atenção com a primeira. Com a arte no fundo, o lado
              direito é onde a composição de `capasds.png` vive; cobri-lo com uma
              chapa branca apaga justamente o que o pedido novo manda mostrar.

              O QUE NÃO SE PERDEU: o nome do produto é o `h1` («SDS — Sistema Digital
              de Sinistros»), lido por leitor de tela, ao contrário do logo, que
              estava `aria-hidden`. As quatro fichas (Relato · Dados · Análise · Decisão)
              eram decorativas e repetiam, em 10px, a jornada que a seção «Do
              comunicado à regulação em oito etapas» conta por extenso adiante.

              ⚠️ DECISÃO REVERSÍVEL, E O CAMINHO DE VOLTA NÃO É DESCOMENTAR ISTO:
              devolver a placa ao hero traz a segunda capa de novo. Se a área quiser o
              logo visível, o lugar é uma faixa CLARA própria (a seção «O que é SDS»
              logo abaixo já é `section-light-blue`), porque o problema medido continua
              valendo: a logo antiga (`logo-sds.png`) era azul sobre transparente e
              no navy ficava perto de 2:1. A marca atual é `public/sds3d2.png`
              (faces brancas + contorno azul) e mora no `h1` do hero.

              O `data-route-critical-media` que estava no `<Image>` do logo migrou para
              a arte da capa: o portão de rota tem de esperar a maior imagem acima da
              dobra, e agora é ela.

          <div data-reveal="scale-soft" style={cascata(2)} className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-6 rounded-full bg-[#2F91F7]/30 blur-3xl" aria-hidden />
            ── PEDIDO: «deixe o fundo claro para aparecer bem a logo da SDS» ───
                Era vidro escuro sobre o navy do hero:

                  <div className="relative rounded-3xl border border-white/15 bg-white/[0.06]
                       p-7 shadow-[0_32px_90px_-40px_rgba(0,153,230,.7)] backdrop-blur-md sm:p-10">

                E o defeito é de MEDIDA, não de gosto: `public/imagens/logo-sds.png`
                é azul (#2F7FE0 → #1D63C8) sobre transparente, sem contorno claro.
                Azul médio sobre `rgba(255,255,255,.06)` composto em `#001A3D` fica
                perto de 2:1 — a arte lê como manchado escuro, que é o que a captura
                do pedido mostra. Superfície clara é o que devolve a tinta da marca;
                não há variante branca do logo no repositório para a alternativa.

                O MOLDE É O DE `/mach-ai` («seguindo esse como parâmetro»): placa
                clara com letra escura, borda ciano de baixa opacidade e RELEVO só
                para baixo — o mesmo `box-shadow` de deslocamento vertical positivo
                que o hero do Match AI usa no embrulho da capa, e pela mesma razão
                escrita lá: `filter: drop-shadow` criaria contexto de empilhamento e
                prenderia o `position: fixed` do cabeçalho ao nó filtrado.
                `backdrop-blur` SAI junto com o vidro: sobre placa opaca ele não tem
                o que desfocar e continua custando camada de compositor.
            <div className="relative rounded-3xl border border-[#0079CB]/20 bg-[linear-gradient(170deg,#FFFFFF_0%,#EAF4FE_55%,#DCEDFC_100%)] p-7 shadow-[0_26px_60px_-24px_rgba(0,12,30,.55)] sm:p-10">
              <Image
                data-route-critical-media=""
                src="/sds3d2.png"
                alt=""
                aria-hidden
                width={1707}
                height={921}
                priority
                (`drop-shadow` azulado SAIU: sobre superfície clara ele virava
                 halo sujo em volta do glifo em vez de relevo.)
                className="mx-auto h-auto w-full max-w-[22rem]"
              />
              <div className="mt-8 flex items-center justify-between gap-2" aria-hidden>
                {['Relato', 'Dados', 'Análise', 'Decisão'].map((label, index) => (
                  <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
                    AS QUATRO FICHAS VIRAM DE TINTA junto com a placa: era ciano
                        `#A5F0FF` sobre `rgba(0,121,203,.20)`, combinação calibrada
                        para fundo navy. Sobre a placa clara o ciano cai para ~1,4:1 e
                        o rótulo de 10px desaparece. O par que entra é o já medido da
                        casa para faixa clara: selo `#0079CB`/12% com ícone `#0B5FA5`
                        e rótulo em `#0B2E52`.
                    <span className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/25 bg-[#0079CB]/10">
                        {index === 3 ? (
                          <UserCheck className="h-5 w-5 text-[#0B5FA5]" />
                        ) : (
                          <FileCheck2 className="h-5 w-5 text-[#0B5FA5]" />
                        )}
                      </span>
                      <span className="text-[10px] font-semibold text-[#0B2E52]">{label}</span>
                    </span>
                    {index < 3 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#0B5FA5]/60" />}
                  </div>
                ))}
              </div>
              A PÍLULA vira navy chapado com letra branca, e não tinta escura sobre
                  fundo claro: ela é o remate do card e é a única peça que ainda tem
                  de LER COMO DESTAQUE dentro de uma placa já clara. Navy `#062748`
                  com branco é o par de 12,9:1 que esta rota usa no botão «Conheça a
                  jornada» invertido — número já da casa, não escolha nova.
              <p className="mt-7 rounded-full bg-[#062748] px-4 py-2 text-center text-xs font-bold tracking-wide text-white">
                Decisão humana preservada
              </p>
            </div>
          </div>
          */}
        </RevealScope>
      </section>

      <section
        className="section-light section-light-blue section-py relative overflow-clip"
        aria-labelledby={idDoBloco(TITULO_ABERTURA)}
      >
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="sds-abertura"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_ABERTURA)}
                className="font-display text-section font-bold text-ink"
              >
                {TITULO_ABERTURA}
              </h2>
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
              >
                {page.lead}
              </p>
              <ul
                data-reveal="fade-up"
                style={cascata(2)}
                className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2"
              >
                {HERO_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0079CB]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Diagrama 1448×1086 (4/3, IHDR), PNG com alfa: sem placa nem borda, o desenho
                pousa direto na faixa. `object-contain`: cortar comeria a borda do desenho. */}
            <div
              data-reveal="scale-soft"
              style={cascata(3)}
              className="relative aspect-[4/3]"
            >
              <Image
                src="/sdsprimeirasessao.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                loading="lazy"
                className="object-contain"
              />
            </div>
          </div>
        </RevealScope>
      </section>

      {oQueE && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(oQueE.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-o-que-e"
          >
            {/* ── PEDIDO: «pegar esse título … em cima dos cards do lado esquerdo e
                deixar o de clicar do lado direito de todos» ──────────────────────
                O `h2` SAIU daqui (onde era largura inteira da faixa, acima da grade)
                e entrou na COLUNA ESQUERDA da `.sds-oque-composicao`, junto do fio e
                da escada de placas. Com isso a coluna direita — o cartão de link —
                passa a ter como par vertical o conjunto «título + fio + cards», e não
                só os cards: é o que o pedido chama de «do lado direito de todos».

                O `<TituloSecao>` continua sendo o mesmo componente, então o `id` do
                bloco (que a `ScrollSpy` e o `aria-labelledby` da `<section>` usam)
                não muda de valor nem de dono. O que muda é só onde ele é renderizado.

                ERA:
                  <TituloSecao heading={oQueE.heading!} claro />
                  … fio …
                  <div className="sds-oque-composicao">
                    <ol className="sds-oque-escada">…</ol>
                    <a …>…</a>
                  </div> */}

              {/* SIS-120 · item 5 — A FRASE MANUSCRITA DE `docs/fonte2.md`, em UM
                  ponto editorial e não em dois. A issue admite «1–2»; este é o
                  lugar onde ela cumpre a especificação sem concessão: o documento
                  manda pousá-la «sobre a área clara ou envidraçada», com tinta
                  `#123B5D`, e esta faixa é clara.

                  ⚠️ POR QUE NÃO NO HERO, que é o lugar que o documento cita: o hero
                  desta página é navy `#001A3D` de ponta a ponta. `#123B5D` sobre
                  navy reprova em contraste, e a saída usada na `/solucoes/luminna-ai`
                  (uma placa branca translúcida sob a frase) só existe lá porque a
                  capa é FOTO — aqui ela seria um cartão a mais colado no cartão da
                  marca que já ocupa a coluna direita do hero. A régua da própria
                  issue é «sem cobrir CTAs»: aqui a frase fica embaixo do `h2`, na
                  coluna de texto, e não há CTA nesta faixa.

                  A frase é o LITERAL do documento, nas quatro linhas que ele fixa.
                  `aria-hidden`: é assinatura editorial, não informação — e lida em
                  voz alta no meio de um `h2` e de dois parágrafos ela entraria como
                  frase solta sem antecedente. */}
              {/* ── PEDIDO: «retire essa escrita "Grandes ideias constroem amanhã."» ──
                  ⚠️ A JUSTIFICATIVA ACIMA (SIS-120 · item 5) FICA, MAS ESTÁ SUPERADA:
                  ela explica por que a frase pousou AQUI e não no hero, o que continua
                  correto como histórico — e não é a pergunta que este pedido faz. O
                  pedido é editorial e anterior: a frase não fica em lugar nenhum desta
                  rota. Quem religar tem de resolver primeiro o item 5 da SIS-120 com o
                  dono do conteúdo, não só descomentar.

                  Comentada e não apagada, pela regra da casa. O CSS `.sds-frase*` fica
                  no `globals.css` de propósito, dormente, pela mesma razão pela qual
                  `.matchai-carimbo` ficou: é o caminho de volta, e apagá-lo obrigaria
                  a reinventar a tinta `#123B5D` e o traço de `docs/fonte2.md`.

              <p aria-hidden data-reveal="fade-up" style={cascata(1)} className="sds-frase mt-8">
                <span className="sds-frase-linha">Grandes</span>
                <span className="sds-frase-linha">ideias</span>
                <span className="sds-frase-linha">constroem</span>
                <span className="sds-frase-linha">amanhã.</span>
                <svg aria-hidden className="sds-frase-traco" viewBox="0 0 45 8">
                  <line className="sds-frase-risco" pathLength="1" x1="1.5" y1="6.4" x2="43.5" y2="1.6" />
                </svg>
              </p>
              */}
              {/* O QUE ENTRA NO LUGAR («essa também quero que deixe mais inovador»):
                  o fio vertical com pulso que desce, que é o grafismo da casa para
                  marcar começo de jornada — mesmo mecanismo do `.matchai-fio` e do
                  trilho de `/qa-integrado`, aqui na tinta clara da faixa. É decoração
                  declarada (`aria-hidden`) e morre nos dois canais de movimento
                  reduzido pelo CSS, não por hook: sem `useEffect` não há quadro de
                  movimento antes do hook convergir. */}
              {/* Os dois parágrafos continuam em `paragrafos(oQueE)`. O vídeo é o
                  mesmo `/videos/tile-sdsapres.mp4`. `autoPlay` fica `false` no
                  markup — o efeito acima chama `play()` só sem movimento reduzido. */}
              <div className="sds-oque-composicao">
                {/* A COLUNA ESQUERDA: título, fio e escada num só filho da grade. O
                    embrulho existe para que a grade continue com DUAS colunas — se as
                    três peças fossem filhas diretas, o `h2` cairia numa célula e o
                    cartão desceria para a linha de baixo. */}
                <div className="sds-oque-coluna">
                  <TituloSecao heading={oQueE.heading!} claro />
                  <span aria-hidden data-reveal="fade-up" style={cascata(1)} className="sds-oque-fio">
                    <span className="sds-oque-fio-pulso" />
                  </span>
                  <ol className="sds-oque-escada">
                  {paragrafos(oQueE).map((texto, index) => (
                    <li
                      key={texto}
                      data-reveal="fade-up"
                      style={{ ...cascata(index + 1), '--sds-oque-i': index } as React.CSSProperties}
                      className="sds-oque-placa"
                    >
                      <span aria-hidden className="sds-oque-selo">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm leading-relaxed text-ink-muted">{texto}</p>
                    </li>
                  ))}
                  </ol>
                </div>
                {/* ── O TILE VIROU O LINK DA DEMONSTRAÇÃO ─────────────────────
                    PEDIDO: «colocar aqui o link e deixar desse tamanho mesmo» — então
                    o destino que morava no cartão da faixa «Demonstração oficial»
                    (removida, ver a nota lá embaixo) passa a ser ESTE tile, e a caixa
                    não muda: `width: min(100%, 12rem)` e `aspect-ratio: 9/16` seguem
                    vindo de `.sds-oque-video` em `globals.css`, intactos.

                    ERA UM `<div aria-hidden>` E AGORA É UM `<a>`, e a troca não é só
                    de tag:
                      · o `aria-hidden` SAI do embrulho. Link escondido do leitor de
                        tela é link que não existe para quem navega por teclado — e
                        pior, `aria-hidden` num nó focável é violação de ARIA (o foco
                        entra num elemento que a árvore de acessibilidade não tem). Ele
                        fica no `<video>`, que continua sendo decoração.
                      · o nome acessível vem do `<span class="sr-only">`: é a única
                        coisa que identifica o destino, porque o tile é só imagem em
                        movimento (WCAG 2.4.4).
                      · `block` e `relative` como utilitários porque `.sds-oque-video`
                        nasceu para um `<div>` e não declara `display` — `<a>` é inline
                        por padrão, e aí `width`/`aspect-ratio` não valeriam nada. O
                        `relative` é o que ancora o selo do canto.
                      · `matchai-midia`/`matchai-midia-arte` são as classes do avanço de
                        escala no hover e dos dois canais de movimento reduzido, as
                        mesmas dos outros previews da casa (casam por CLASSE, então
                        valem para `<video>`). */}
                {/* ── O LINK PASSA A SEGUIR O CARTÃO DO «DESCUBRA» DA LUMINNA ─────
                    PEDIDO: «deixe ser mais parecido com o link de clicar do Luminna,
                    pois aqui no SDS está ficando muito apagado». A versão anterior
                    (selo de 32px no canto + legenda em texto azul claro) era FRACA
                    porque nada ali tinha preenchimento sólido: sobre a faixa clara,
                    texto `#0060A8` a 13px e um selo translúcido no canto somam pouco
                    peso e o olho passa reto.

                    O padrão que funciona nesta casa já existe em `LuminnaAiPagina`
                    (o cartão do `descubra.luminna…`) e é copiado aqui PEÇA POR PEÇA:
                      1. cartão BRANCO com borda e sombra envolvendo a mídia — é ele
                         que recorta a página e diz «objeto», não «fundo»;
                      2. selo circular CENTRADO sobre o take, não no canto — centro é
                         onde o olho já está, e é a convenção universal de «abre»;
                      3. rodapé com o HOST e uma PÍLULA SÓLIDA `#0060A8` com texto
                         branco. A pílula é o que resolve o «apagado»: é a única peça
                         com fundo cheio, e é ela que lê como botão.
                    A diferença é só de empilhamento: lá o rodapé é `justify-between`
                    numa linha, aqui a caixa tem 12rem e host + pílula lado a lado
                    quebrariam feio — então vão em duas linhas, pílula ocupando a
                    largura toda.

                    A CAIXA DA MÍDIA NÃO MUDOU: `.sds-oque-video` segue com
                    `min(100%, 12rem)` × 9/16, como o pedido original fixou. O que
                    mudou é que ela agora vive DENTRO da âncora, porque legenda e
                    rodapé não cabem sob `overflow: hidden` + proporção fixa.

                    O `sr-only` continua sendo o nome acessível completo: o visível diz
                    «Abrir demonstração» e o host, e é a legenda que diz que abre em
                    outra aba (WCAG 2.4.4). */}
                <a
                  href={SDS_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal="fade-up"
                  style={cascata(2)}
                  className="sds-oque-demo matchai-midia group"
                >
                  <span className="sds-oque-video block">
                    <video
                      ref={videoPlataforma}
                      aria-hidden
                      className="sds-tile-video matchai-midia-arte"
                      src="/videos/tile-sdsapres.mp4"
                      poster="/videos/tile-sdsapres-poster.webp"
                      autoPlay={false}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                    {/* O SELO, CENTRADO como no Luminna. Glifo de link externo e não
                        triângulo de «play»: o vídeo já está em laço e o clique não
                        toca nada — ele abre a demonstração. `aria-hidden` e
                        `pointer-events-none`: o nome do link está no `sr-only` e o
                        alvo de clique é a âncora inteira. */}
                    <span aria-hidden className="sds-oque-selo-saida">
                      <ExternalLink className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                  </span>
                  {/* O RODAPÉ. Host em cima, pílula sólida embaixo — a pílula carrega
                      `on-dark` porque é fundo escuro dentro de faixa clara, e é essa
                      classe que a casa usa para reger a tinta dos filhos ali. */}
                  <span aria-hidden className="sds-oque-demo-rodape">
                    <span className="sds-oque-demo-host">{SDS_DEMO_HOST}</span>
                    <span className="on-dark sds-oque-demo-pilula">
                      Abrir demonstração
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    </span>
                  </span>
                  <span className="sr-only">
                    Abrir a demonstração oficial do SDS em {SDS_DEMO_HOST}, em uma nova aba.
                  </span>
                </a>
              </div>
          </RevealScope>
        </section>
      )}

      {jornada && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(jornada.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-jornada"
          >
            {/* ── PEDIDO: «deixe sem a tag "Como funciona"» ────────────────────────
                Era:

                  <p data-reveal="fade-up" className="eyebrow !text-[#A5F0FF]">
                    Como funciona
                  </p>

                Sai sem consequência de acessibilidade: o nome da seção nunca veio
                daqui — o `<section>` acima aponta `aria-labelledby` para o `id` do
                `<h2>`, que fica.
                A CASCATA DO REVEAL NÃO SE MEXE: os índices desta faixa são escritos a
                dedo por `cascata(index + 1)` nas etapas, e nunca dependeram de haver
                um sobretítulo com índice 0 antes deles. */}
            <TituloSecao heading={jornada.heading!} />
            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {itens(jornada).map((item, index) => {
                const Icone = ICONES_ETAPAS[index] ?? Sparkles;
                return (
                  <li
                    key={item.term}
                    data-reveal="fade-up"
                    style={cascata(index + 1)}
                    className="relative rounded-2xl border border-white/[12%] bg-white/[0.055] p-6"
                  >
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#A5F0FF]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0079CB]/20">
                      <Icone className="h-5 w-5 text-[#A5F0FF]" strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-white">{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
                  </li>
                );
              })}
            </ol>
          </RevealScope>
        </section>
      )}

      {pilares && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(pilares.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-pilares"
          >
            <TituloSecao heading={pilares.heading!} claro />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {itens(pilares).map((item, index) => (
                /* ── PEDIDO: «por uma imagem de cada card e deixe os cards indo para
                   cima e para baixo» ──────────────────────────────────────────────
                   Era `className="rounded-3xl border … bg-white p-7 shadow-…"` com o
                   `p-7` no próprio `<article>`. O padding DESCE para um embrulho
                   interno porque a faixa de imagem tem de sangrar até a borda do
                   card — com `p-7` no pai ela ficaria com uma moldura branca de 28px
                   em volta, que é exatamente o que uma capa não deve ter.

                   A FLUTUAÇÃO é CSS (`.sds-pilar`), não hook e não GSAP, por três
                   razões: (a) é `transform: translate3d` em laço infinito, o caso em
                   que o compositor resolve sozinho e JavaScript só acrescenta risco;
                   (b) morre nos dois canais de movimento reduzido por `@media` e por
                   `html[data-motion='reduce']`, sem `useEffect` — logo sem um quadro
                   de movimento antes de o hook convergir; (c) `data-reveal` é o dono
                   do `transform` na ENTRADA e o laço só assume depois, o que está
                   resolvido no CSS com `animation-delay` e não disputando a mesma
                   propriedade em dois donos ao mesmo tempo.
                   `--sds-pilar-i` desencontra as três fases: com os três em fase a
                   fileira sobe e desce em bloco, que lê como a página tremendo, não
                   como cards flutuando. */
                <article
                  key={item.term}
                  data-reveal="fade-up"
                  style={{ ...cascata(index + 1), '--sds-pilar-i': index } as React.CSSProperties}
                  className="sds-pilar overflow-hidden rounded-3xl border border-[#0079CB]/[18%] bg-white shadow-[0_20px_55px_-40px_rgba(0,55,100,.55)]"
                >
                  {/* A CAPA. `alt=""` + `aria-hidden`: é ambientação — a foto é do
                      conjunto genérico da casa (`/images/solucoes/1.png`…`4.png`, o
                      mesmo que `servicosDiferenciais.ts` usa), não um retrato do que o
                      pilar descreve, então nomeá-la seria descrever ao leitor de tela
                      uma sala de reunião que nada informa sobre o pilar.
                      ⚠️ ARTE PRÓPRIA DO SDS NÃO EXISTE no repositório; quando existir,
                      trocar as três fontes aqui é a única alteração necessária.
                      `width/height` são os do arquivo (1672x941): com
                      `images.unoptimized` (SIS-154) é o arquivo em disco que vai ao ar,
                      e é a razão declarada que reserva a caixa sem achatar.
                      `sizes` é a largura real da célula (três colunas no `lg`,
                      `container-lp` ~1200px → ~380px), inerte hoje mas verdadeira. */}
                  <Image
                    src={`/images/solucoes/${index + 1}.png`}
                    alt=""
                    aria-hidden
                    width={1672}
                    height={941}
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="sds-pilar-capa"
                  />
                  <div className="p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0079CB]/[12%]">
                    {index === 0 ? (
                      <FileCheck2 className="h-6 w-6 text-[#0060A8]" aria-hidden />
                    ) : index === 1 ? (
                      <Bot className="h-6 w-6 text-[#0060A8]" aria-hidden />
                    ) : (
                      <ScanSearch className="h-6 w-6 text-[#0060A8]" aria-hidden />
                    )}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink">{item.term}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {item.highlights?.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0079CB]" aria-hidden />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              ))}
            </div>
          </RevealScope>
        </section>
      )}

      {agentes && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(agentes.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-agentes"
          >
            <TituloSecao heading={agentes.heading!} />
            {agentes.kind === 'list' && agentes.intro && (
              <p data-reveal="fade-up" style={cascata(1)} className="mt-5 max-w-4xl text-lg leading-relaxed text-white/80">
                {agentes.intro}
              </p>
            )}
            <div data-reveal="scale-soft" style={cascata(2)} className="mt-12 rounded-3xl border border-white/[12%] bg-white/[0.045] p-5 sm:p-8">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
                {/* ── PEDIDO: «deixa dinâmico e pulsando e mudando de cor; a parte
                    azul atrás do fundo deve ter o mesmo layout» ────────────────────
                    A SEGUNDA METADE DO PEDIDO É UMA RESTRIÇÃO, e é ela que decide o
                    que NÃO se mexe: a grade `lg:grid-cols-[1fr_auto_1fr]`, as duas
                    colunas de fichas, o placar central e o `rounded-3xl` da placa
                    azul ficam letra por letra. Nada de estrutura muda nesta volta —
                    só entram classes de movimento.

                    As fichas ganham `.sds-agente-ficha`, que é o pulso de borda e
                    tinta com `--sds-agente-i` desencontrando as fases (a mesma razão
                    dos pilares: em fase, oito fichas piscando juntas leem como
                    defeito de renderização). O que pulsa é `box-shadow` e
                    `border-color`, não `opacity` do texto — texto que perde opacidade
                    em laço é ilegibilidade intermitente, e a régua de reduced-motion
                    da casa é explícita: se o movimento morrer, o estado final tem de
                    ser legível. Aqui o estado final é a ficha acesa. */}
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {itens(agentes).slice(1, 5).map((item, i) => (
                    <li
                      key={item.term}
                      style={{ '--sds-agente-i': i } as React.CSSProperties}
                      className="sds-agente-ficha rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white/85"
                    >
                      <h3>{item.term}</h3>
                    </li>
                  ))}
                </ul>
                {/* O NÚCLEO. «Pulsando e mudando de cor» é o par de laços de
                    `.sds-orquestrador`: o halo respira (escala + raio de sombra) e a
                    tinta percorre ciano → azul institucional → violeta e volta.
                    A cor percorre `--sds-orq-cor`, uma custom property usada em
                    `border-color` e `box-shadow` — e NÃO em `background` chapado atrás
                    do texto: o `<h3>` branco tem de manter o piso de contraste no
                    quadro MAIS CLARO do ciclo, não só na média. O fundo fica no
                    `#0079CB`/20 já medido; o que muda de cor é a auréola.
                    Dois anéis concêntricos e não um: o tracejado interno gira em
                    `rotate` (o giro de anel já usado no selo de `/qa-integrado`), e é o
                    giro que dá a leitura de «orquestrando» — pulso sozinho lê como
                    aviso, pulso com giro lê como processo. */}
                <div className="sds-orquestrador relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border bg-[#0079CB]/20 text-center">
                  <span aria-hidden className="sds-orquestrador-anel absolute inset-4 rounded-full border border-dashed" />
                  <h3 className="relative max-w-[7rem] font-display text-base font-bold text-white">
                    {itens(agentes)[0]?.term}
                  </h3>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {itens(agentes).slice(5).map((item, i) => (
                    <li
                      key={item.term}
                      /* +4 continua a série da coluna da esquerda: as fases são de
                         todas as oito fichas, não de cada coluna. */
                      style={{ '--sds-agente-i': i + 4 } as React.CSSProperties}
                      className="sds-agente-ficha rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white/85"
                    >
                      <h3>{item.term}</h3>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-7 text-center text-sm font-semibold text-[#A5F0FF]">
                Os agentes apoiam o fluxo e não substituem os profissionais responsáveis.
              </p>
            </div>
          </RevealScope>
        </section>
      )}

      {governanca && (
        /* ── PEDIDO: «o layout dos números que tem na home, deixe todos os cards
           dinâmicos, e com o fundo claro» ─────────────────────────────────────────
           Eram TRÊS camadas de azul empilhadas, e é esse empilhamento que o pedido
           desfaz:

             <section className="section-py … bg-[#087CC3]">
               <div aria-hidden className="absolute inset-0
                    bg-[radial-gradient(circle_at_80%_20%,rgba(165,240,255,.24),transparent_35%)]" />
               …
                 <div className="rounded-3xl border border-white/[22%] bg-[#001A3D]/[82%] p-7
                      shadow-… backdrop-blur-md sm:p-10 lg:p-14">

           `#087CC3` era a ÚNICA faixa de azul saturado da rota, e dentro dela havia um
           cartão navy quase opaco — ou seja, o azul existia só para emoldurar um cartão
           escuro. Com fundo claro a moldura perde a função e as duas camadas saem
           juntas: a faixa passa a `.section-light`, que nesta rota é transparente por
           regra (`.sds-canvas .section-light`, no `globals.css`) e herda o plano
           contínuo do `<main>` — é o que tira o degrau de cor com as faixas vizinhas.
           O `backdrop-blur-md` sai com o cartão: sem vidro não há o que desfocar.

           O LAYOUT É O DOS NÚMEROS DA HOME (`Metrics.tsx` → `.impact-lista` /
           `.impact-item`): `<ol>` de células que começam por um SELO QUADRADO de ~52px
           com anel, seguido do ordinal e do texto em corpo de rótulo. Reproduzi a
           geometria em classes `sds-gov-*` em vez de reusar `.impact-*`, e a razão é
           dura: as regras de `.impact-*` são calibradas para fundo navy (tinta
           `#9fe6ff` sobre `rgba(8,60,110,.35)`) e vêm atadas ao scrollytelling —
           `min-height: 340vh`, `[data-dirigindo]`, `ImpactNumero`. Importar a classe
           traria a máquina inteira para uma faixa de três itens sem contador. O que se
           reusa é o DESENHO, que é o que o pedido nomeia.

           `<ol>` e não `<ul>`: a home usa `<ol>` pelo mesmo motivo — o ordinal visível
           afirma ordem, e afirmá-la só no desenho é o defeito do WCAG 1.3.2. O ordinal
           é `aria-hidden` porque a `<ol>` nativa já o anuncia. */
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(governanca.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-governanca"
          >
            <p data-reveal="fade-up" className="eyebrow">
              Governança humana
            </p>
            <TituloSecao heading={governanca.heading!} claro />
            {governanca.kind === 'list' && governanca.intro && (
              <p data-reveal="fade-up" style={cascata(1)} className="mt-6 max-w-4xl text-lg leading-relaxed text-ink-muted">
                {governanca.intro}
              </p>
            )}
            {/* «TODOS OS CARDS DINÂMICOS»: `.sds-gov-item` é o selo que respira e o
                anel que acende em laço, com `--sds-gov-i` desencontrando as fases.
                Movimento em `transform`/`opacity` do SELO e do ANEL, nunca no texto —
                o rótulo é o conteúdo da célula e não pode oscilar. Os dois canais de
                movimento reduzido matam o laço no CSS, e o estado final é o selo aceso
                com o anel visível: nada fica invisível para sempre, que é a armadilha
                que a habilidade de reduced-motion descreve. */}
            <ol className="sds-gov-lista mt-10">
              {itens(governanca).map((item, index) => (
                <li
                  key={item.text}
                  data-reveal="fade-up"
                  style={{ ...cascata(index + 2), '--sds-gov-i': index } as React.CSSProperties}
                  className="sds-gov-item"
                >
                  <span aria-hidden className="sds-gov-selo">
                    <span className="sds-gov-anel" />
                    <UserCheck strokeWidth={1.6} />
                  </span>
                  <span aria-hidden className="sds-gov-indice">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="sds-gov-rotulo">{item.text}</p>
                </li>
              ))}
            </ol>
          </RevealScope>
        </section>
      )}

      {beneficios && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(beneficios.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-beneficios"
          >
            <TituloSecao heading={beneficios.heading!} claro />
            <CarrosselBeneficios
              itens={itens(beneficios)}
              rotuloId={idDoBloco(beneficios.heading!)}
            />
          </RevealScope>
        </section>
      )}

      {integracao && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(integracao.heading!)}
        >
          <RevealScope
            className="container-lp relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_.8fr]"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-integracao"
          >
            <div>
              <TituloSecao heading={integracao.heading!} />
              <div className="mt-6 space-y-4">
                {paragrafos(integracao).map((texto, index) => (
                  <p key={texto} data-reveal="fade-up" style={cascata(index + 1)} className="text-lg leading-relaxed text-white/80">
                    {texto}
                  </p>
                ))}
              </div>
            </div>
            {/* ── PEDIDO: «mude a estrutura também e coloque mais ícones» ──────────
                Era uma grade 2x3 de rótulos SEM ícone nenhum:

                  <div data-reveal="scale-soft" style={cascata(2)}
                       className="grid grid-cols-2 gap-3 rounded-3xl border border-white/[12%]
                                  bg-white/[0.045] p-5 sm:p-7">
                    {['Apólices', …].map((item) => (
                      <div key={item} className="rounded-xl border border-white/10
                           bg-white/[0.05] p-4 text-center text-xs font-semibold text-white/80">
                        {item}
                      </div>
                    ))}
                  </div>

                A ESTRUTURA QUE ENTRA é o hub radial: os seis domínios em volta de um
                núcleo, ligados por raios — é o que a seção diz em texto («integração
                com o ecossistema»), e uma grade 2x3 diz o contrário, que são seis
                caixas sem relação. O desenho é o do hub de `/qa-integrado` e de
                `/smart-miner` (os blocos `SIS-279`/`SIS-292` do `globals.css`),
                reaproveitado aqui em classes próprias porque a tinta é a desta rota.

                OS SEIS ÍCONES são o «mais ícones» do pedido, um por domínio, do mesmo
                conjunto Lucide que a rota inteira já usa (dois nomes novos entram no
                `import`; a dependência é a mesma). Os rótulos são os mesmos seis,
                palavra por palavra.
                ⚠️ A LISTA CONTINUA LITERAL AQUI, e não subiu para
                `acceleratorPages.ts`: ela já era literal antes desta volta, e mover
                copy entre arquivos no mesmo commit que muda o desenho mistura duas
                mudanças que precisam ser revisadas em separado. Fica anotado como o
                próximo passo natural.
                `<ul>`/`<li>`: são seis itens irmãos sem ordem — o raio desenhado não
                afirma sequência, afirma ligação. O núcleo é `aria-hidden`: ele não
                acrescenta palavra que o `<h2>` e os parágrafos ao lado não digam. */}
            {/* ── ⚠️ O HUB RADIAL SAIU, E O DEFEITO ERA MEDÍVEL ────────────────────
                Pedido de 30/09: «tudo quebrado», «muito disnexo». Não era gosto — era
                um erro de semântica de CSS, e vale escrever qual, porque é a armadilha
                mais fácil de repetir. A casca anterior era:

                  <div className="sds-hub">
                    <span className="sds-hub-nucleo">…</span>
                    <ul className="sds-hub-anel">
                      <li className="sds-hub-item" style={{ '--sds-hub-i': index }}>…</li>
                    </ul>
                  </div>

                  .sds-hub-item {
                    position: absolute; inset-block-start: 50%; inset-inline-start: 50%;
                    transform: rotate(calc(var(--sds-hub-i) * 60deg)) translate(0, -38%)
                               rotate(calc(var(--sds-hub-i) * -60deg)) translate(-50%,-50%);
                  }

                ⚠️ `translate(0, -38%)` RESOLVE A PORCENTAGEM CONTRA A CAIXA DO PRÓPRIO
                ELEMENTO, NUNCA CONTRA O CONTAINER. Os −38% foram escritos querendo
                dizer «38% do raio do hub»; o navegador leu «38% da altura desta
                pílula». Medido a 1440px: caixa do hub 393×393px, as seis pílulas com
                raio MÉDIO de 20px e 15 colisões de 15 pares possíveis — ou seja, os
                seis domínios empilhados uns sobre os outros em cima do núcleo, dentro
                de uma caixa de 393px vazia. É exatamente a imagem de «quebrado».

                A CORREÇÃO NÃO É TROCAR O NÚMERO. Um raio em `px` faria as seis pílulas
                pararem no lugar, mas a composição continuaria sendo seis chips
                orbitando sem hierarquia — o que o alvo do reparo descarta com estas
                palavras. O que entra é uma ESPINHA: um painel de vidro com o núcleo no
                topo, um trilho descendo e os seis domínios como cards ligados ao
                trilho por um toco curto. Cada card tem ícone + rótulo e uma caixa de
                verdade, com fundo e borda, então lê como peça de um sistema e não como
                etiqueta solta.

                ⚠️ E A GEOMETRIA PASSA A SER SÓ GRADE: nenhuma rotação, nenhum
                `translate` em porcentagem, nenhum raio. Quem posiciona é
                `grid-template-columns` e `grid-column`, que resolvem contra o
                CONTAINER por definição — a armadilha acima deixa de existir em vez de
                ser contornada. `--sds-eco-i` continua saindo do índice, mas agora só
                escalona a entrada (atraso da cascata); se ele vier vazio, os cards
                aparecem juntos, e não fora do lugar.

                `data-lado` alterna o flanco a partir de `lg`; abaixo disso todos caem
                à direita de um trilho na lateral, que é a leitura que caberia em 390px
                de qualquer forma. O rótulo mais longo («Sistemas corporativos») é o que
                dimensiona o card, e é por isso que o texto não é truncado em nenhuma
                das três larguras do aceite.

                OS SEIS RÓTULOS SÃO OS MESMOS, palavra por palavra, e continuam vindo de
                `INTEGRACAO_DOMINIOS` — o reparo diz «manter rótulos; redesenhar só a
                casca», e a lista não foi tocada. `<ul>`/`<li>` porque são seis irmãos
                sem ordem: o toco desenhado afirma ligação, não sequência. O núcleo
                segue `aria-hidden` (não acrescenta palavra ao `<h2>` e aos parágrafos
                ao lado).

                ⚠️ O NÚCLEO NÃO GANHOU RÓTULO, e a tentação era grande — uma espinha
                com o topo escrito lê melhor. Cheguei a pôr um rótulo ali e DESFIZ: o
                reparo diz «não inventar copy», e a frase entraria no `copy-lock` como
                texto novo sem dono — que é precisamente o que a Regra Zero existe para
                impedir. Ela seria, ainda por cima, a repetição do `<h2>` logo à
                esquerda. Quem nomeia a composição é o cabeçalho da seção.

                ⚠️ E ESTE COMENTÁRIO TAMBÉM NÃO PODE CITAR A FRASE. Medido: com o rótulo
                citado aqui, em comentário, o `test:copy` passou de `1x -> 2x` para
                `1x -> 3x` numa das palavras. O coletor lê o arquivo inteiro, comentário
                incluído, e não só os nós renderizados — então escrever a copy descartada
                dentro da justificativa a reintroduz no portão. Fica anotado como
                limitação do coletor (ele não distingue comentário de conteúdo), e é por
                isso que a nota acima descreve o rótulo em vez de reproduzi-lo. */}
            <div data-reveal="scale-soft" style={cascata(2)} className="sds-eco">
              <span aria-hidden className="sds-eco-nucleo">
                <Network strokeWidth={1.6} />
              </span>
              <ul className="sds-eco-lista">
                {INTEGRACAO_DOMINIOS.map(({ rotulo, Icone }, index) => (
                  <li
                    key={rotulo}
                    style={{ '--sds-eco-i': index } as React.CSSProperties}
                    data-lado={index % 2 === 0 ? 'esq' : 'dir'}
                    className="sds-eco-item"
                  >
                    <span aria-hidden className="sds-eco-selo">
                      <Icone strokeWidth={1.8} />
                    </span>
                    <span className="sds-eco-rotulo">{rotulo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          A FAIXA «DEMONSTRAÇÃO OFICIAL» SAIU DE CENA (pedido: «remover a sessão de
          demonstração»), e o DESTINO NÃO SE PERDEU: o link para
          `sds-landing-page-six.vercel.app` passou a ser o TILE DE VÍDEO da faixa «Uma
          plataforma para toda a jornada de sinistros» — ver a nota em cima dele. Então
          a rota continua tendo um caminho para a demonstração, no tamanho que o pedido
          fixou (`.sds-oque-video`, 12rem), e deixou de ter uma faixa inteira só para
          isso. `SDS_DEMO_URL`/`SDS_DEMO_HOST` seguem em uso por aquele link.

          ⚠️ O MARKUP VAI ABAIXO, COMENTADO, mas SEM o bloco dos slots 3D + tile que já
          estava fora de cena dentro dele: era código morto dentro de código morto, e
          comentário de bloco NÃO ANINHA — o fechamento dele encerraria este comentário
          e despejaria JSX solto no arquivo (armadilha que esta mesma seção já pagou uma
          vez). Os slots e aquela variante do tile estão no histórico do git, no commit
          que introduziu a faixa; `SLOTS_3D` continua comentado no topo do arquivo.
          ⚠️ TODO comentário interno aqui está como `//` pela mesma razão.

          A razão de ESTAR AQUI, que vale se a faixa voltar: a ordem era «entenda → veja
          rodando → fale com o time», e pôr o preview depois do CTA faria o leitor sair
          da página antes de chegar nele. E preview por MINIATURA, nunca `iframe`: (1) um
          `iframe` de página inteira injeta uma segunda árvore navegável por teclado
          dentro de uma caixa de ~500px, (2) a landing de fora baixa inteira para quem
          só rolou até aqui, (3) é outro domínio — uma troca de `X-Frame-Options` lá
          derrubaria o bloco daqui, calado.

      <section
        className="section-light section-py relative overflow-clip"
        aria-labelledby="sds-demonstracao"
      >
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="sds-demonstracao"
        >
          <p data-reveal="fade-up" className="eyebrow">
            No ar
          </p>
          <h2
            id="sds-demonstracao"
            data-reveal="fade-up"
            style={cascata(1)}
            className="mt-3 max-w-4xl font-display text-section font-bold text-ink"
          >
            Demonstração oficial
          </h2>

          <div className="mt-10">
            // O cartão: moldura com barra de navegador, âncora única e legenda em
            // `sr-only`. `max-w-md` era a forma da mídia depois da troca do screenshot
            // (1962×801) pelo vídeo retrato 360×640; com `max-w-4xl` o vídeo só caberia
            // cortado numa fatia horizontal ou como tira estreita numa janela vazia.
            // `matchai-midia`/`matchai-midia-arte`: as classes do avanço de escala no
            // hover e dos dois canais de movimento reduzido, casando por CLASSE (então
            // valem para `<video>`), reusadas com o nome do Match AI de propósito.
            <figure data-reveal="scale-soft" style={cascata(2)} className="m-0 mx-auto max-w-md">
              <a
                href={SDS_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="matchai-midia group block overflow-hidden rounded-2xl border border-[#0079CB]/20 bg-white shadow-[0_24px_70px_-45px_rgba(0,55,100,.6)] transition-colors hover:border-[#0079CB]/55"
              >
                // A barra do navegador, `aria-hidden` inteira: os três pontos são
                // desenho e o endereço já está no nome acessível do link.
                <span aria-hidden className="flex items-center gap-2 border-b border-[#0079CB]/[12%] bg-[#F2F8FD] px-4 py-2.5">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ink-muted">
                    {SDS_DEMO_HOST}
                  </span>
                </span>
                // `aspect-[9/16]` é a proporção do arquivo, então `cover` não recorta.
                // `autoPlay={false}` + `play()` no efeito: `autoPlay` é gatilho de
                // partida, não estado. Pôster = quadro 0, que é o estado parado sob
                // movimento reduzido.
                <span className="relative block aspect-[9/16] overflow-hidden bg-[#001A3D]">
                  <video
                    ref={videoPreview}
                    aria-hidden
                    src="/videos/tile-sdsapres.mp4"
                    poster="/videos/tile-sdsapres-poster.webp"
                    autoPlay={false}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="matchai-midia-arte h-full w-full object-cover"
                  />
                </span>
                <span className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <span className="text-sm font-semibold text-ink">{SDS_DEMO_HOST}</span>
                  // A pílula é `<span>` e não um segundo link: o cartão inteiro já é a
                  // âncora, e link dentro de link é marcação inválida.
                  <span className="on-dark inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#004D8A]">
                    Abrir demonstração
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </span>
              </a>
              <figcaption className="sr-only">
                Abrir a demonstração oficial do SDS em {SDS_DEMO_HOST}, em uma nova aba.
              </figcaption>
            </figure>
          </div>
        </RevealScope>
      </section>
          ══════════════════════════════════════════════════════════════════════ */}

      {fecho && (
        <section className="section-light section-py relative overflow-clip" aria-labelledby={idDoBloco(fecho.heading!)}>
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="sds-fecho"
          >
            <div className="rounded-3xl border border-[#0079CB]/20 bg-white p-8 text-center shadow-[0_28px_80px_-50px_rgba(0,55,100,.55)] sm:p-12 lg:p-16">
              <TituloSecao heading={fecho.heading!} claro />
              {paragrafos(fecho).map((texto) => (
                <p key={texto} data-reveal="fade-up" style={cascata(1)} className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-ink-muted">
                  {texto}
                </p>
              ))}
              <div data-reveal="fade-up" style={cascata(2)} className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#004D8A]"
                >
                  Fale com nosso time
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href="https://sds-landing-page-six.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0079CB]/[28%] bg-[#0079CB]/[0.06] px-5 py-3 text-sm font-bold text-[#0060A8] transition-colors hover:bg-[#0079CB]/10"
                >
                  Explore a demonstração do SDS
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SIS-120 · item 1 — «Conheça também» + CTA, o fim do padrão do Match AI.
          A marcação é a de `MatchAiPagina.tsx` (bloco homônimo, linha 1424 em
          diante), literal: `<nav>` em faixa clara baixa, `h2` em `text-xl font-bold`,
          a fileira de pílulas com `aria-current` na slug atual, a grade de seis
          mídias e a pílula `on-dark` de fecho.

          ⚠️ ESTE BLOCO É O QUE FALTAVA PARA A ROTA TER FECHO, e não um extra: das sete
          slugs, `sds` é a ÚNICA excluída do `ContactCTA` compartilhado em
          `src/app/solucoes/[slug]/page.tsx`. Sem ele a página acabava no cartão de
          fecho, sem vitrine e sem caminho de volta para `/solucoes`.

          ⚠️ O VÉU `#001A3D/55` NÃO É ESTÉTICA, e a razão é a que está escrita no Match
          AI: as marcas das seis soluções são de tinta clara e as capas têm regiões
          claras — o véu tira a legibilidade da dependência de qual pedaço da arte caiu
          atrás do logo.

          ⚠️ `on-dark` NA PÍLULA É OBRIGATÓRIO, não decoração: ela é de fundo cheio
          DENTRO de `.section-light`, e os overrides daquela classe pintam de navy tudo
          que traga `text-white` — a medida está no Match AI (3,56:1, reprovado, sem
          ela). O fundo `#0060A8` em vez de `#0079CB` sai do mesmo número.
          ══════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-labelledby="sds-conheca-tambem"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="sds-conheca"
        >
          <h2
            id="sds-conheca-tambem"
            data-reveal="fade-up"
            className="font-display text-xl font-bold text-ink"
          >
            Conheça também
          </h2>

          <ul data-reveal="fade-up" style={cascata(1)} className="mt-5 flex flex-wrap gap-2">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#0079CB]/70 bg-[#0079CB]/[12%] px-3 py-1.5 text-xs font-semibold text-[#0a1f44]"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-[#0079CB]/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0a1f44] transition-colors hover:border-[#0079CB]/60 hover:bg-white"
                    >
                      {p.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ACCELERATORS.filter((a) => a.id !== page.id).map((a, i) => (
              <li key={a.id} data-reveal="fade-up" style={cascata(i + 2)}>
                {/* O cartão INTEIRO é o link: alvo grande e um único destino. */}
                <Link
                  href={`/solucoes/${a.id}`}
                  className="matchai-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="matchai-midia-arte object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado (e não um
                        par inventado): com `images: { unoptimized: true }` o que baixa
                        é o arquivo do disco, então o par serve para reservar a caixa e
                        não distorcer a marca. O `alt` carrega o nome porque aqui a
                        marca é a ÚNICA coisa que identifica o destino. */}
                    <Image
                      src={a.logo}
                      alt={a.name}
                      width={a.logoWidth}
                      height={a.logoHeight}
                      loading="lazy"
                      className="h-auto max-h-[62%] w-auto max-w-[78%] object-contain"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/solucoes"
            data-reveal="fade-up"
            style={cascata(8)}
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
    </>
  );
}
