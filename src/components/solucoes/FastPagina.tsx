'use client';

/**
 * SIS-286 — O CORPO DA `/solucoes/fast`, na estrutura de seções de
 * `public/imagensexemplo/exemplofast.png`.
 *
 * POR QUE UM COMPONENTE DEDICADO, e não props novas no template de
 * `/solucoes/[slug]`: é a mesma razão já escrita em `MatchAiPagina.tsx`, e esta
 * issue é irmã daquela (SIS-292). O template renderiza `page.blocks.map(...)` —
 * um título e um corpo por bloco, no mesmo molde para as sete slugs. A mock não é
 * um molde de bloco: é hero dividido, fileira de quatro cards, faixa escura com
 * diagrama de hub, três colunas de métrica separadas por régua e um bloco de
 * dashboard com CTA. Expressar isso como variação de `Block`/`ItemList` mudaria o
 * molde das SETE, e o item 1 da issue proíbe literalmente redesenhar as outras.
 *
 * TODA A ESCRITA VEM DE `src/data/acceleratorPages.ts` — os cinco blocos do
 * `fast`, letra por letra. O que a mock acrescenta são RÓTULOS de número que já
 * estão no dado (ver `METRICAS`). Nenhuma afirmação nova sobre o produto entrou
 * aqui.
 *
 * OS SLOTS DE IMAGEM SÃO PLACEHOLDER, por pedido explícito da issue: o hero e o
 * visual do dashboard usam a MESMA capa do Fast (`CAPAS_DE_ABERTURA.fast`) até
 * existir arte definitiva. O tablet com a interface e a UI de dashboard da mock
 * estão declarados fora de escopo lá. EXCEÇÃO, e é a identidade desta rota: a
 * seção «Integração sem Fronteiras» tem arte própria desde a SIS-280 — ver lá.
 *
 * ── SIS-280: A ARQUITETURA PASSA A SER A DO MATCH AI ─────────────────────────
 *
 * Pedido: «em `/solucoes/fast`, evoluir a página para a mesma estrutura e
 * componentes de `/solucoes/match-ai`, com identidade própria», e o destaque de
 * identidade é a arte `integracaosemfronteira.png` no lugar do diagrama CSS.
 *
 * O CORPO DE SEÇÕES JÁ BATIA — hero dividido, cards, faixa escura, métricas,
 * bloco de CTA, fecho de irmãs — e é por isso que esta volta NÃO mexeu no arranjo
 * (o «estado atual» do corpo da issue descrevia a página antes do polish da
 * SIS-286). O que faltava era o nível de acabamento que o Match AI ganhou depois,
 * e são quatro coisas, todas reaproveitadas e nenhuma reescrita:
 *
 *   1. REVEAL. Era `variants` de `@/lib/motion` com `initial={rm ? false :
 *      'hidden'}` + `whileInView`; passa a ser `RevealScope` + `data-reveal`, com
 *      o calibre de `./reveal-calibre.ts`. O argumento de TROCAR e não somar está
 *      escrito inteiro no docblock do Match AI: `variants` escreve `transform` e
 *      `opacity` INLINE no nó, os presets do Efeito 4 escrevem `transform` pela
 *      cascata, e dois donos do mesmo `transform` é a colisão em que o inline
 *      vence e o hover de escala dos cards morre. Ganho colateral igual ao de lá:
 *      o corpo volta a nascer VISÍVEL no HTML do servidor.
 *   2. GRAFISMOS. `AcentosClaros` nas faixas claras e `.grade-tecnica` +
 *      `CircuitoCanto` nas escuras, de `./GrafismosTecnicos.tsx` — o arquivo que
 *      esta issue criou justamente para não haver duas cópias do mesmo SVG.
 *   3. MOVIMENTO EM LAÇO E HOVER. `.matchai-cartao`/`.matchai-halo` nos quatro
 *      cards, `.matchai-ficha` na ficha flutuante, `.matchai-coluna` nas três
 *      métricas, `.matchai-midia`/`.matchai-midia-arte` nas fotos. É TODO CSS já
 *      existente, com os dois canais de movimento reduzido já tratados lá; aqui
 *      ficam só as classes-gancho. Nenhuma regra nova de CSS entrou nesta issue.
 *   4. NEGRITOS. Os títulos de seção passam a `font-bold`, como os do Match AI.
 *
 * O QUE **NÃO** VEIO, e por quê: o carimbo/letreiro de marca do hero do Match AI
 * (o Fast não tem arte de logo equivalente em `public/images/logos/` — a capa dele
 * já traz o letreiro desenhado), a capa SANGRADA atrás do navbar (a arte do Fast é
 * foto de coluna, não fundo de faixa desenhado para o arranjo, e sangrá-la poria
 * texto branco sobre a parte acesa dela) e o `ScrubScope` da faixa de campanha
 * (scrub bidirecional está declarado FORA DE ESCOPO no corpo desta issue).
 *
 * `rm` SOBREVIVEU À SAÍDA DO `motion/react` porque a `Contagem` precisa dele — é o
 * único movimento desta página que não é CSS, e tem de haver onde desligá-lo.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/* `animate` FICA, `motion` SAI: o que colidia com os presets de reveal era o
   componente (que inlina `transform`/`opacity` no nó). `animate` é imperativo e
   escreve `textContent`, não estilo — ver `Contagem`. */
import { animate } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Clock,
  Coins,
  FileSearch,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
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
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
import { AcentosClaros, CircuitoCanto } from './GrafismosTecnicos';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';
import { easeExpo, useReducedMotion } from '@/lib/motion';

const CAPA = CAPAS_DE_ABERTURA.fast.src;

/* ── SIS-280 — A ARTE DA «INTEGRAÇÃO SEM FRONTEIRAS» ──────────────────────────
   Pedido, e é o destaque de identidade da issue: «na seção Integração sem
   Fronteiras, usar a arte `public/integracaosemfronteira.png` (no lugar do
   diagrama CSS/markup atual)».

   É `.webp` E NÃO `.png`, e a própria issue autoriza («\~1 MB — otimizar WebP se o
   peso for problema (reportar)»). O peso ERA problema, medido: 1.002 KB no PNG
   contra 210 KB no WebP q82 — 79% menos —, e com `images: { unoptimized: true }`
   no `next.config.mjs` o que baixa é o arquivo do disco, sem `srcset` nenhum para
   salvar o visitante. As duas artes são o mesmo pixel em 1873×840 e a
   TRANSPARÊNCIA sobrevive (`hasAlpha: true` conferido no arquivo gerado), que é
   condição para a arte compor sobre o navy da faixa em vez de trazer um retângulo
   branco. O PNG original FICA no repositório: é a fonte, e apagá-la deixaria a
   conversão sem de onde ser refeita. Está reportado no comentário da issue.

   1873×840 são as dimensões INTRÍNSECAS medidas, e servem para a razão de aspecto
   — não são tamanho de uso. */
const ARTE_INTEGRACAO = {
  src: '/integracaosemfronteira.webp',
  largura: 1873,
  altura: 840,
};

/* ── SIS-279 — A CÁPSULA DO HERO ──────────────────────────────────────────────
   Pedido: o carimbo desta rota «no lugar do eyebrow "Tecnologia Disruptiva"». O
   comentário que este arquivo trazia dizia que a arte não tinha vindo; ela veio.

   O ARQUIVO DESCEU DA RAIZ para `public/images/solucoes/`, junto das irmãs. Não é
   arrumação gratuita: o docblock do Smart Miner registra que ter a MESMA FAMÍLIA de
   cápsula em duas pastas foi o que produziu o defeito da 5ª volta do Match AI — a
   cópia da raiz escrevia «MACH AI» e foi ela que subiu para a tela. Com as cinco na
   mesma pasta não há segunda cópia para divergir.

   MEDIDA ANTES DE MONTAR (`scripts/medir-carimbos-sis279.mjs` →
   `docs/medidas/sis279-carimbos.json`), nos três portões que `CarimboBatida` impõe —
   os mesmos que a 1ª volta do Smart Miner estabeleceu, e nenhum presumido:

   1. TOMBO DE REPOUSO **−3,07°** (topo da tinta cai de y=33 em x=110 para y=12 em
      x=502). O componente assenta em `rotation: 0` porque as artes que ele serve já
      vêm tombadas dentro do arquivo (−3,05° / −3,03° / −3,04° / −4,97°): esta cai na
      mesma família, então NÃO é preciso o `tomboRepouso` que o docblock dele diz que
      uma arte reta exigiria. Era o portão que podia reprovar a arte.
   2. TINTA CLARA SOBRE TRANSPARÊNCIA: média `rgb(255, 255, 255)` nos 19.823 pixels
      opacos, canto com alfa 0. Cápsula branca só se lê em faixa escura — e é esta, o
      hero navy, a única faixa desta página onde ela pode entrar.
   3. GRAFIA conferida em captura composta sobre `#001A3D`: a arte diz «SISTRAN |
      Fast». É a conferência que a 5ª volta do Match AI teve de fazer DEPOIS de a
      arte errada já estar no ar.

   612×279 no arquivo (razão 2,194:1). São as dimensões INTRÍNSECAS, não tamanho de
   uso: elas montam `--carimbo-batida-ar` dentro do componente para a cápsula não
   achatar. O tamanho sai de `--carimbo-batida-w` em `.fast-carimbo`, no
   `globals.css`, calibrado pela ALTURA e não pela largura — a razão desta arte é a
   mais estreita das cinco (a palavra é curta), e copiar a largura da irmã daria uma
   cápsula visivelmente mais alta que as outras. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-fast-ticket-outline-ffffff.png',
  largura: 612,
  altura: 279,
};

/* Blocos achados POR TÍTULO, e não por índice — mesmo critério do Match AI:
   índice é dependência invisível, e acrescentar um bloco no dado reordenaria
   silenciosamente as seções desta página. Bloco ausente devolve `undefined` e a
   seção não monta, em vez de estourar a rota. */
function bloco(page: AcceleratorPage, heading: string) {
  return page.blocks.find((b) => b.heading === heading);
}
function itens(b: AccelBlock | undefined) {
  return b && b.kind === 'list' ? b.items : [];
}

/* O índice da cascata do Efeito 4 vive em `--reveal-i`, e o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Helper para não repetir
   o cast de CSS custom property em vinte pontos — é a única razão dele existir, e
   é o mesmo do Match AI (função de três linhas, copiada em vez de exportada: um
   módulo compartilhado para um cast seria mais indireção do que economia). */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* Ícones por posição, e não por texto: são decoração de card (`aria-hidden`), e o
   que identifica cada item é o título ao lado. A ordem espelha a da mock. */
const ICONES_OFERECE = [Zap, ShieldCheck, ClipboardList, Coins];
const ICONES_BENEFICIO = [Gauge, ShieldCheck, Clock];

/* OS NÚMEROS GRANDES DA MOCK, e cada um é CITAÇÃO do dado — não há número novo:
   · «95%»  → «Processos até 95% mais rápidos.» (bloco «O que o Fast oferece?»);
   · «0%»   → «De 20% no processo manual para 0% com o Fast.» (bloco «Benefícios»);
   · «450»  → «450 horas economizadas para cada 1.000 processos.» (idem).
   Ficam numa constante, e não interpolados por regex a partir do texto: extrair
   número de frase por expressão regular quebra calado quando a escrita muda uma
   vírgula, e aqui o que a mock pede é justamente o RECORTE editorial de cada
   frase. A frase inteira continua impressa embaixo do número, então o leitor tem
   os dois — o destaque e a afirmação completa que o sustenta. */
/* Os valores passaram de STRING para número + sufixo porque agora eles CONTAM ao
   entrar em cena (pedido do turno de hoje). Era:

     const METRICAS = [
       { valor: '95%', rotulo: 'mais rápido' },
       { valor: '0%',  rotulo: 'de falhas' },
       { valor: '450', rotulo: 'horas economizadas' },
     ];

   `de` é a ORIGEM de cada contagem, e o caso do meio é o que justifica o campo
   existir: contar «0%» de zero a zero não é contagem nenhuma, e a frase do dado
   diz literalmente «DE 20% no processo manual PARA 0% com o Fast» — então a
   animação desce 20 → 0, que é o número que a própria escrita já publica. As
   outras duas sobem de 0. Nenhum valor novo entrou. */
const METRICAS = [
  { de: 0, para: 95, sufixo: '%', rotulo: 'mais rápido' },
  { de: 20, para: 0, sufixo: '%', rotulo: 'de falhas' },
  { de: 0, para: 450, sufixo: '', rotulo: 'horas economizadas' },
];

/* ── SIS-280 — O DIAGRAMA DE HUB SAIU DE CENA ─────────────────────────────────
   A arte de `ARTE_INTEGRACAO` ocupa o lugar dele, que é literalmente o que a issue
   pede. O que sai fica COMENTADO com o motivo, pela regra da casa, porque estas
   três constantes e as duas funções do fim do arquivo (`CaixaHub`, `Trilho`) só
   existiam para ele — e o argumento de por que os rótulos NÃO eram invenção é o
   que se perderia se o bloco fosse apagado:

     // AS CAIXAS DO DIAGRAMA saem do texto do bloco «Integração sem Fronteiras»,
     // que diz «se integra com os sistemas existentes da seguradora» e «pronta
     // para funcionar com ERPs, sistemas de OCR, e outros». Os rótulos de apoio
     // são a redução daquelas duas frases, na divisão que a mock desenha — nenhum
     // sistema, número ou capacidade a mais. O centro é o próprio produto.
     const HUB_ORIGEM = {
       Icone: ServerCog,
       titulo: 'Sistemas da seguradora',
       apoio: 'Os sistemas existentes, já em operação',
     };
     const HUB_DESTINOS = [
       { Icone: ScanText, titulo: 'Sistemas de OCR', apoio: 'Leitura e extração de documentos' },
       { Icone: Network, titulo: 'ERPs e outros', apoio: 'Integração pronta para funcionar' },
     ];

   Com eles saíram os `import`s de `Network`, `ScanText` e `ServerCog` do
   `lucide-react`: ícone importado e não montado é aviso de lint, e o portão desta
   issue é a linha de base. A INFORMAÇÃO que o diagrama carregava não se perdeu —
   ela está nos parágrafos do dado, que continuam impressos na seção, ACIMA da
   arte, e sempre foram a fonte dos rótulos. */

export default function FastPagina({ page }: { page: AcceleratorPage }) {
  const rm = useReducedMotion();

  const oQueE = bloco(page, 'O que é o Fast?');
  const oferece = bloco(page, 'O que o Fast oferece?');
  const integracao = bloco(page, 'Integração sem Fronteiras');
  const beneficios = bloco(page, 'Benefícios');
  const monitore = bloco(page, 'Monitore e Aprimore seus Processos');

  return (
    <>
      {/* ── 1. HERO DIVIDIDO «O QUE É O FAST?» ───────────────────────────────
          A abertura desta slug deixa de ser `PageHero` + `HeroImageBackdrop`: a
          mock põe título e parágrafo numa coluna e a foto na outra, e a capa que
          já existia continua em cena — migra de fundo da abertura para foto da
          direita. Nada da arte foi descartado.

          DUAS ÂNCORAS, e as duas obrigatórias. `id="topo"` é o que o item
          "Início" do indicador lateral usa, e vinha do `PageHero`, que esta slug
          não monta mais. O `id` do `h1` é `idDoBloco('O que é o Fast?')`, porque
          `pageSections.ts` deriva as paradas de TODO bloco com título — este
          bloco virou o hero, e sem a âncora aqui a bolinha dele apontaria para
          um id que a página não tem.

          O fundo segue o NAVY da rota, e essa é a divergência consciente em
          relação à mock (clara de cima a baixo): o cabeçalho fixo do site é
          desenhado para tinta clara, e abrir esta rota em fundo claro deixaria a
          navegação sem contraste — problema de outra issue. As faixas claras da
          mock vêm abaixo, em `.section-light`, que é como as outras rotas da casa
          alternam. É a mesma decisão da irmã SIS-292, e está reportada no
          comentário da issue.

          SIS-280 — `overflow-clip` E NÃO `overflow-hidden`, pela razão que a
          SIS-76 mediu e o Match AI repete em todas as faixas: `hidden` cria
          contêiner de rolagem e desancora o `background-attachment: fixed` da
          malha de `.grade-tecnica`. Aqui isso deixou de ser teórico no momento em
          que a grade entrou nesta seção. */}
      {/* SIS-280 — `bg-[#001A3D]` DECLARADO, e isto é correção de um defeito MEDIDO,
          não estilo: a seção dizia «o fundo segue o navy da rota» e não declarava
          fundo nenhum — herdava o `body`, que é `#1273bc`, azul MÉDIO. A sonda leu
          o link «Saiba mais sobre o Fast» (`#A5F0FF`) em **3,93:1** sobre ele,
          abaixo do piso de 4,5. Sobre o navy o mesmo par dá 15,7:1. É o mesmo
          defeito que a sonda da SIS-292 pegou na faixa equivalente do Match AI, e
          a razão de ele ter sobrevivido aqui é que a herança PARECE navy enquanto
          não se mede. */}
      {/* E O NAVY SOBE ATRÁS DO NAVBAR, pela aritmética e não por gosto: declarar o
          fundo só na seção criou uma EMENDA horizontal visível na captura de 1440 —
          acima dela ficava a faixa de `pt-28 md:pt-36` que o `PageShell` põe no
          `<main id="conteudo">`, ainda pintada com o `#1273bc` herdado do `body`.
          `-mt-28 md:-mt-36` são EXATAMENTE aquele padding (7rem e 9rem), o mesmo
          par que o hero do Match AI usa para sangrar a capa e que o `/esg` já
          media em `.hero-backdrop-midia`; o `pt` recomposto (`4rem`/`6rem` do
          `py` original MAIS o puxão) devolve o conteúdo à altura em que ele
          estava, então nada se move — só o fundo passa a cobrir a faixa.
          O `overflow-clip` continua servindo: tudo que sobe está DENTRO da seção
          agora, ao contrário do Match AI, que precisou abrir mão do recorte porque
          lá é a arte que estoura a caixa por cima. E é o mesmo fato medido lá que
          garante a ordem: `Header.tsx` é `fixed … z-50` e esta faixa nasce em
          `z-index: auto`, então o cabeçalho fica NA FRENTE. */}
      <section
        id="topo"
        className="relative -mt-28 overflow-clip bg-[#001A3D] pb-16 pt-[11rem] md:-mt-36 md:pb-24 md:pt-[15rem]"
      >
        {/* `z-0` E NÃO `-z-10`, consequência direta da linha acima: a seção agora
            tem `background` chapado próprio e não cria contexto de empilhamento, e
            é justamente aí que filho de z negativo desce para trás do fundo do
            PRÓPRIO pai e desaparece. As manchas ficam em 0 e o conteúdo em 10 —
            ordem de documento, não z negativo. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-[#57B7EE]/25 blur-[130px]" />
          <div className="absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-[#0ed8f6]/15 blur-[130px]" />
        </div>
        {/* SIS-280 — O FUNDO TÉCNICO (item 2), COM `.matchai-grade`. A primeira
            versão desta linha deixava a grade no `z-index: -1` nativo dela,
            argumentando que esta seção não tinha `background` chapado próprio — o
            que era verdade e deixou de ser na correção de contraste acima. Com o
            navy declarado, o negativo jogaria a grade para trás do fundo da
            própria seção: é a mesma armadilha da faixa de «Integração», e agora
            pela mesma causa. `.matchai-grade` reescreve o z para 0. */}
        <div aria-hidden className="grade-tecnica matchai-grade" />
        <CircuitoCanto className="matchai-circuito--trilho" />
        {/* `esperarRota` porque este é o escopo DA DOBRA: o contrato da SIS-269 é
            que só ele espera a cortina do `RouteLoadGate` subir — os de baixo
            nascem a milhares de px do topo e acendem por viewport. */}
        <RevealScope
          className="container-lp relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="fast-hero"
        >
          <div>
            {/* SIS-279 — A CÁPSULA ENTRA NO LUGAR DA TAG TEXTUAL. O que estava
                escrito aqui era:

                  <span data-reveal="fade-up" className="eyebrow !text-[#A5F0FF]">
                    Tecnologia Disruptiva
                  </span>

                As duas juntas não ficam: seriam a mesma função — etiqueta acima da
                manchete — dita duas vezes na mesma linha, e é o mesmo par de razões
                que o `eyebrowArte` do `PageHero` já registra («arte OU tag textual,
                nunca as duas»). É também o que o Match AI decidiu na 7ª volta dele
                para esta mesma rota-irmã, com a mock mostrando a tag: a cápsula diz
                «SISTRAN | Fast», que é MAIS específico do que «Tecnologia
                Disruptiva», genérico das sete slugs.

                `alt=""` é obrigatório e não estilo: a cápsula é ETIQUETA, e o nome
                acessível da seção é o conteúdo do `h1` logo abaixo, que já diz
                «Fast». Com as duas nomeadas o leitor de tela diria «Fast … Fast».

                `gatilho="rota"` porque a peça vive ACIMA da dobra, onde liberar o
                portão do `RouteLoadGate` e entrar em quadro são o mesmo instante —
                o gatilho de viewport existe para quem nasce a milhares de px do
                topo (SIS-188). A batida, a espera do portão e os DOIS canais de
                movimento reduzido já vivem no componente; refazer isso à mão aqui
                seria GSAP ad hoc num hero acima da dobra.

                DUAS CLASSES no nó, e é o componente que as concatena
                (`['carimbo-batida', className]`): `carimbo-batida.css` é importado
                por ele e entra DEPOIS do `globals.css`, então `.fast-carimbo`
                sozinha empataria em especificidade e perderia por ordem.

                A cápsula NÃO é `data-reveal` — quem a faz entrar é a própria
                batida —, então ela sai da cascata e os índices do texto DESCEM UM:
                o `h1` passa a ser o índice 0 (sem `cascata`), como o do Smart
                Miner. Deixar o buraco faria a manchete esperar uma batida de
                stagger por um nó que não existe mais. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="fast-carimbo"
              gatilho="rota"
            />
            {/* O `h1` é o TÍTULO DO BLOCO, que é o que a mock põe aqui. O nome do
                produto já está dentro dele («Fast»), então não há `sr-only` a
                acrescentar — diferente do Match AI, cujo `h1` de mock era uma
                frase de campanha que servia para qualquer uma das sete. */}
            <h1
              data-reveal="fade-up"
              id={idDoBloco('O que é o Fast?')}
              className="mt-4 font-display text-pagehero-medio font-bold tracking-tight text-white"
            >
              O que é o Fast?
            </h1>
            {oQueE?.kind === 'paragraphs' &&
              oQueE.paragraphs.map((p, i) => (
                <p
                  key={p.slice(0, 32)}
                  data-reveal="fade-up"
                  style={cascata(i + 1)}
                  className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85"
                >
                  {p}
                </p>
              ))}
            {/* «SAIBA MAIS SOBRE O FAST» — o link sublinhado da mock. O destino é
                a PRÓPRIA seção seguinte, e não uma página externa: não existe
                rota "sobre o Fast" no site, e um link de aparência para lugar
                nenhum é pior do que não ter link. Levar para «O que o Fast
                oferece?» é literalmente o que "saber mais" significa nesta
                página, e a âncora é a mesma que o indicador lateral usa. */}
            {/* SIS-279 — índice 3 e não 4: a cápsula tirou um nó da cascata
                (ver o mount dela). Os dois parágrafos do dado ocupam 1 e 2.
                SIS-280 — a nota vive AQUI, fora do `&&`: dentro dele, o comentário
                é um segundo filho da expressão e o arquivo não compila («')' expected»
                na linha do `<p>`). Não é preferência de estilo: chave de comentário
                colada logo depois do `&& (` é erro de sintaxe. */}
            {oferece && (
              <p data-reveal="fade-up" style={cascata(3)} className="mt-6">
                <Link
                  href={`#${idDoBloco(oferece.heading!)}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#A5F0FF] underline underline-offset-4"
                >
                  Saiba mais sobre o Fast
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
                </Link>
              </p>
            )}
          </div>

          {/* A FOTO. `alt=""` + `aria-hidden` pelo critério que o template já
              registra para as seis capas: a arte desenha o que o título nomeia e
              o parágrafo explica, e o letreiro «FAST» que ela traz é desenho, não
              texto a publicar. `data-route-critical-media` porque é a maior
              imagem acima da dobra e o portão de rota espera por ela
              (`loading/RouteLoadGate.tsx`) — era o `HeroImageBackdrop` que
              carregava essa marca nesta rota.

              A FICHA FLUTUANTE ENTRA — pedida no turno de hoje, com a escrita da
              mock. O que estava escrito aqui, para o registro, era:

                «PLACEHOLDER: a ficha flutuante da mock («Mais agilidade para o
                 seu negócio») NÃO entra — é escrita de campanha que o site não
                 publica em lugar nenhum, e a issue declara as sobreposições
                 opcionais "sem assets".»

              A premissa caiu por decisão de quem responde pelo conteúdo: a frase
              passa a ser escrita desta página. Ela é TEXTO DE VERDADE, não parte
              da arte — fica fora do `aria-hidden` da foto, num nó próprio, e por
              isso sobrevive a troca de capa e é lida por leitor de tela uma única
              vez. O ícone dela é decoração (`aria-hidden`).

              A ficha é branca sobre faixa NAVY, então a tinta é declarada em hex e
              não herdada: `.section-light` não alcança esta seção, e `text-ink`
              aqui dependeria do token global em vez do fundo real do cartão.

              SIS-280 — `matchai-midia` no envelope e `matchai-midia-arte` na
              imagem (item 3): é o par de nós que a University estabeleceu, QUADRO
              que recorta e ARTE que se move. Um nó só seria dono do `transform`
              duas vezes. */}
          <div data-reveal="scale-soft" style={cascata(2)} className="matchai-midia relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[12%] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.75)]">
              <Image
                data-route-critical-media=""
                src={CAPA}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1180px) 548px, 100vw"
                priority
                className="matchai-midia-arte object-cover"
              />
            </div>
            {/* DENTRO da caixa da foto em telas estreitas e transbordando um
                pouco à direita do `lg` para cima, que é como a mock desenha. Sem
                `overflow-hidden` no pai desta ficha — é o motivo de ela ser irmã
                do recorte da imagem, e não filha dele.
                SIS-280 — `matchai-ficha` põe a flutuação em laço e o realce sob o
                ponteiro nela (item 3). A classe também devolve `pointer-events`,
                que aqui não precisava ser retirado: ao contrário das duas fichas
                do Match AI, esta não vive dentro de um envelope
                `pointer-events-none`, porque é uma só e não há vão entre duas a
                preservar. */}
            <div className="absolute bottom-5 left-4 right-4 sm:left-auto sm:right-5 lg:-right-6">
              <div className="matchai-ficha flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-[0_22px_50px_-24px_rgba(0,20,50,0.55)] backdrop-blur-sm">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0079CB]/[12%]"
                >
                  <FileSearch className="h-5 w-5 text-[#0060A8]" strokeWidth={1.8} />
                </span>
                <span className="block leading-tight">
                  <span className="block font-display text-sm font-semibold text-[#0a1f44]">
                    Mais agilidade
                  </span>
                  <span className="block text-xs text-[#3c5a80]">para o seu negócio</span>
                </span>
              </div>
            </div>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. O QUE O FAST OFERECE? ─────────────────────────────────────────
          Quatro cards numa fileira em faixa clara, como a mock. `.section-light`
          pinta título e texto de navy sozinho — é por isso que estes cards NÃO
          levam `on-dark`.
          A lista é `<ol>` porque o dado declara `ordered: true` para este bloco;
          o ORDINAL VISÍVEL, porém, não entra: a mock desenha disco de ícone no
          lugar dele, e a ordem continua dita pelo elemento. */}
      {oferece && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(oferece.heading!)}
        >
          {/* As manchas de ponto fino e os quadrados pálidos. A grade discreta de
              96px e o pontilhado largo já vêm dos dois pseudo-elementos de
              `.section-light` — daí estes serem um nó, e não um terceiro pseudo
              que não existe. */}
          <AcentosClaros />
          <CircuitoCanto className="matchai-circuito--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="fast-oferece"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(oferece.heading!)}
              className="font-display text-section font-bold text-ink"
            >
              {oferece.heading}
            </h2>
            <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {itens(oferece).map((item, i) => {
                const Icone = ICONES_OFERECE[i] ?? Sparkles;
                return (
                  <li
                    key={item.term ?? item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    /* SIS-280 — `matchai-cartao` é o COMPORTAMENTO (flutuação em
                       laço + realce sob o ponteiro) e `matchai-halo` é o anel que
                       acende; a receita e os dois canais de movimento reduzido
                       estão no `globals.css`, ao lado da original.
                       `relative` porque o halo é `absolute` sobre a borda, e o
                       fundo passou de `bg-white/80` a `bg-white` CHAPADO pela
                       razão medida lá: o cartão sobe e escala sobre a folha, e com
                       fundo translúcido o vizinho aparecia por baixo no instante
                       da sobreposição. */
                    className="matchai-cartao relative h-full rounded-2xl border border-[#0079CB]/[18%] bg-white p-6 shadow-[0_18px_44px_-30px_rgba(0,55,100,0.45)]"
                  >
                    <span aria-hidden className="matchai-halo" />
                    <span
                      aria-hidden
                      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0079CB]/[12%]"
                    >
                      <Icone className="h-6 w-6 text-[#0079CB]" strokeWidth={1.6} />
                    </span>
                    {/* `font-bold` no título, como nos cards do Match AI: é o
                        item 4 desta volta, e engrossar o título inteiro é o que
                        evita marcar palavra por palavra com `<strong>` dentro de
                        texto que vem do dado. */}
                    <h3 className="relative mt-4 font-display text-base font-bold leading-snug text-ink">
                      {item.term}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </RevealScope>
        </section>
      )}

      {/* ── 3. INTEGRAÇÃO SEM FRONTEIRAS ─────────────────────────────────────
          Faixa ESCURA, como na mock, e o fundo é DECLARADO aqui: o `body` deste
          site é `#1273bc` (`globals.css`), azul MÉDIO, e herdá-lo reprovaria a
          tinta branca no piso de 4,5 — foi o defeito que a sonda da SIS-292 pegou
          na seção equivalente do Match AI. `#001A3D` é o navy profundo da marca;
          nenhum hex novo entrou.

          SIS-280 — É AQUI QUE A IDENTIDADE DESTA ROTA MORA. O diagrama de
          caixa–linha–caixa em markup SAIU e a arte
          `integracaosemfronteira.webp` ocupou o lugar dele, que é o destaque
          pedido pela issue. O texto do dado continua ACIMA da arte, como a issue
          descreve («título + texto do dado + imagem»), e é ele que carrega a
          informação — a arte é ilustração do fluxo (documentos → motor →
          validações → apólice aprovada), sem uma palavra escrita dentro dela, daí
          `alt=""` + `aria-hidden` pelo mesmo critério das capas.

          A ARTE TEM FUNDO TRANSPARENTE, e isso decide duas coisas: ela compõe
          sobre o navy da faixa sem moldura nem recorte (não há `overflow-hidden`
          nem `rounded` em volta — seria uma caixa em volta de nada), e não leva
          véu, porque não há texto por cima dela.
          `sizes="100vw"` e largura de container: a arte é 2,23:1, larga e baixa,
          e é como faixa que ela lê — encaixotá-la numa coluna de 4/3 a reduziria
          a uma tira no meio de vazio. */}
      {integracao && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(integracao.heading!)}
        >
          {/* `.matchai-grade` reescreve o `z-index: -1` nativo de
              `.grade-tecnica` para 0, e aqui isso é OBRIGAÇÃO e não estilo: esta
              seção tem `bg-[#001A3D]` chapado, e o negativo jogaria a grade para
              trás do fundo da própria seção — o defeito que a foto da faixa
              equivalente do Match AI já cometeu e que está descrito lá. */}
          <div aria-hidden className="grade-tecnica matchai-grade" />
          <CircuitoCanto className="matchai-circuito--trilho" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="fast-integracao"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(integracao.heading!)}
              className="max-w-3xl font-display text-section font-bold text-white"
            >
              {integracao.heading}
            </h2>
            <div className="mt-4 max-w-3xl space-y-2">
              {itens(integracao).map((item, i) => (
                <p
                  key={item.text}
                  data-reveal="fade-up"
                  style={cascata(i + 1)}
                  className="text-lg leading-relaxed text-white/85"
                >
                  {item.text}
                </p>
              ))}
            </div>

            {/* A ARTE. `scale-soft` e não `fade-up`: é uma peça larga e única, e
                subir 24px uma faixa desta largura lê como salto — o mesmo
                critério com que a mídia do hero entra.
                `matchai-midia`/`matchai-midia-arte` NÃO entram: aquele par é
                quadro-que-recorta + arte-que-desliza sob o ponteiro, e aqui não há
                recorte (fundo transparente, sem moldura) nem alvo de hover — a
                arte não é link nem cartão. */}
            <div
              data-reveal="scale-soft"
              style={cascata(itens(integracao).length + 1)}
              className="mt-12"
            >
              <Image
                src={ARTE_INTEGRACAO.src}
                alt=""
                aria-hidden
                width={ARTE_INTEGRACAO.largura}
                height={ARTE_INTEGRACAO.altura}
                sizes="100vw"
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 4. BENEFÍCIOS ────────────────────────────────────────────────────
          Três colunas em faixa clara, separadas por RÉGUA VERTICAL — e a régua é
          `border-l` da coluna a partir da segunda, não um `<div>` separador:
          assim ela desaparece sozinha quando a grade empilha a uma coluna, em vez
          de virar um traço solto entre dois blocos. */}
      {beneficios && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(beneficios.heading!)}
        >
          <AcentosClaros />
          <CircuitoCanto className="matchai-circuito--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="fast-beneficios"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(beneficios.heading!)}
              className="font-display text-section font-bold text-ink"
            >
              {beneficios.heading}
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {itens(beneficios).map((item, i) => {
                const Icone = ICONES_BENEFICIO[i] ?? Sparkles;
                const metrica = METRICAS[i];
                return (
                  <li
                    key={item.term}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    /* ALINHAMENTO À ESQUERDA, ícone na MESMA LINHA do número:
                       era `text-center` com o ícone solto e centralizado
                       (`mx-auto h-9 w-9`) acima do número. A referência de hoje
                       põe disco de ícone e número lado a lado, e o texto todo
                       alinhado pela esquerda da coluna.
                       SIS-280 — `matchai-coluna` é a flutuação defasada por
                       posição (`:nth-child`) e o realce sob o ponteiro, a mesma
                       que as três colunas do Posicionamento do Match AI usam.
                       Coluna e não cartão: ela não tem fundo nem borda, então o
                       gesto é só o deslocamento — e é por isso que a classe daqui
                       é `coluna` e não `cartao`, que arrastaria o halo junto. */
                    className={
                      'matchai-coluna ' +
                      (i === 0
                        ? 'px-0 text-left sm:pr-6'
                        : 'border-t border-[#0079CB]/[18%] px-0 pt-8 text-left sm:border-l sm:border-t-0 sm:px-6 sm:pt-0')
                    }
                  >
                    {metrica && (
                      <>
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0079CB]/[12%]"
                          >
                            <Icone className="h-5 w-5 text-[#0060A8]" strokeWidth={1.8} />
                          </span>
                          {/* O número é METADADO — `font-mono`, com o peso 600
                              declarado porque é o único corte da Mono carregado
                              (SIS-155). `tabular-nums` para as três colunas
                              alinharem os dígitos, e aqui ele passou a valer
                              também DURANTE a contagem: sem largura tabular o
                              rótulo ao lado escorregaria a cada quadro. */}
                          <span
                            className="font-mono text-[2.75rem] font-semibold leading-none tabular-nums text-ink"
                            style={{ fontFeatureSettings: '"tnum" 1' }}
                          >
                            <Contagem
                              de={metrica.de}
                              para={metrica.para}
                              sufixo={metrica.sufixo}
                              rm={rm}
                            />
                          </span>
                        </span>
                        <span className="mt-2 block font-display text-base font-semibold text-ink">
                          {metrica.rotulo}
                        </span>
                      </>
                    )}
                    {/* A afirmação completa do dado fica abaixo do destaque: é
                        ela que sustenta o número, e é a escrita do site. O
                        `term` entra como rótulo do `<p>` em negrito na mesma
                        linha, como a mock desenha. */}
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      <strong className="font-semibold text-ink">{item.term}:</strong> {item.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 5. MONITORE E APRIMORE SEUS PROCESSOS ────────────────────────────
          Texto e CTA à esquerda, o visual do dashboard à direita — que é a CAPA,
          por pedido da issue («todo slot de imagem = capa Fast até haver arte
          definitiva»). A UI de dashboard da mock está declarada fora de escopo
          lá. */}
      {monitore && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(monitore.heading!)}
        >
          <AcentosClaros />
          <CircuitoCanto className="matchai-circuito--claro" />
          <RevealScope
            className="container-lp relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="fast-monitore"
          >
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(monitore.heading!)}
                className="font-display text-section font-bold text-ink"
              >
                {monitore.heading}
              </h2>
              <div className="mt-6 space-y-4">
                {itens(monitore).map((item, i) => (
                  <p
                    key={item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    className="max-w-2xl text-lg leading-relaxed text-ink-muted"
                  >
                    {item.text}
                  </p>
                ))}
              </div>
              {/* «CONHEÇA O DASHBOARD» — a pílula azul cheia da mock. O DESTINO É
                  `/contato`, e é a única resposta honesta: não existe rota de
                  dashboard no site nem produto navegável para onde apontar, e o
                  dashboard é do cliente, não uma demo pública. O `sr-only` diz
                  para onde o clique leva — sem ele o rótulo prometeria abrir o
                  dashboard. Está reportado no comentário da issue.

                  `on-dark` É OBRIGATÓRIO, não decoração: é pílula de fundo cheio
                  DENTRO de `.section-light`, e os overrides daquela classe pintam
                  de navy tudo que traga `text-white` (a sonda da SIS-292 mediu
                  3,56:1 no equivalente). O fundo é `#0060A8` e não `#0079CB` pelo
                  mesmo motivo medido lá: branco 0,88 sobre o azul primário dá
                  ~4,2:1, abaixo do piso; sobre o azul de hover da paleta passa. */}
              <p data-reveal="fade-up" style={cascata(itens(monitore).length + 1)}>
                <Link
                  href="/contato"
                  className="on-dark mt-8 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004D8A]"
                >
                  Conheça o dashboard
                  <span className="sr-only"> — fale com a gente</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                </Link>
              </p>
            </div>
            <div data-reveal="scale-soft" style={cascata(2)} className="matchai-midia relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#0079CB]/[18%] shadow-[0_24px_60px_-36px_rgba(0,55,100,0.55)]">
                <Image
                  src={CAPA}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1180px) 520px, 100vw"
                  loading="lazy"
                  className="matchai-midia-arte object-cover"
                />
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 6. OUTRAS SOLUÇÕES ───────────────────────────────────────────────
          É o `<nav>` «Outras soluções» do template, com a cara clara da mock e
          MESMA escrita: as fichas em pílula (a atual como `<span
          aria-current="page">`, fora da ordem de tabulação, exatamente como lá) e
          a volta «Ver todas as soluções e serviços».

          SIS-280 — A FILEIRA DE CARTÕES COM ARTE ENTRA, e isto REVERTE o que
          estava escrito aqui. Era:

            «NÃO entra aqui a fileira de cartões com arte que o Match AI tem: a
             mock do Fast desenha só as pílulas, e a issue pede o layout desta
             mock.»

          A premissa continua verdadeira — a mock do Fast não tem os cartões — e
          deixou de ser decisiva: o item 6 da SIS-280 nomeia esta seção como
          «"Conheça também" / Outras soluções + CTA», e o fecho do Match AI é
          pílulas MAIS seis cartões MAIS a pílula de volta. Alinhar a arquitetura e
          parar antes do fecho deixaria de fora justamente a seção que a issue
          enumera. O TÍTULO CONTINUA «Outras soluções», que é a escrita desta
          página: a issue pede a mesma arquitetura com identidade própria, e
          renomear para «Conheça também» trocaria a escrita do Fast pela do Match
          AI — o oposto do pedido.

          O VÉU NAVY SOBRE CADA CAPA não é estética, e a razão é a mesma medida no
          Match AI: as logos de `accelerators.ts` são de tinta CLARA, e as capas
          têm regiões claras, então sem o véu elas desapareceriam. O `alt` do logo
          é o NOME (e não vazio, ao contrário de todas as outras imagens desta
          página) porque o logo é a única coisa que identifica o destino do link —
          sem texto acessível seriam seis links indistinguíveis (WCAG 2.4.4). */}
      <nav
        aria-labelledby="outras-solucoes"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        {/* Só os pontos, SEM o circuito: esta é a faixa mais baixa da página
            (`py-12`), e uma trilha de 320px de lado num miolo de ~176px seria
            recortada em quase tudo — o mesmo critério do fecho do Match AI. */}
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="fast-outras"
        >
          <h2
            id="outras-solucoes"
            data-reveal="fade-up"
            className="font-display text-xl font-bold text-ink"
          >
            Outras soluções
          </h2>
          <ul data-reveal="fade-up" style={cascata(1)} className="mt-5 flex flex-wrap gap-2.5">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#0079CB]/70 bg-[#0079CB]/[12%] px-4 py-2 text-sm font-semibold text-[#0a1f44]"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-[#0079CB]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#0a1f44] transition-colors hover:border-[#0079CB]/60 hover:bg-white"
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
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado (e não
                        um par inventado), e o tamanho de uso sai das utilitárias —
                        com `images: { unoptimized: true }` o que baixa é o arquivo
                        do disco, então o par serve para reservar a caixa e não
                        distorcer a marca. */}
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

          {/* `text-[#0060A8]` e não o `#A5F0FF` do template: aqui a seção é
              clara, e o ciano gelo daquele link só existe porque lá o fundo é
              navy. É o mesmo azul medido da pílula da seção acima. */}
          <Link
            href="/solucoes"
            data-reveal="fade-up"
            style={cascata(ACCELERATORS.length + 2)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0060A8] underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Ver todas as soluções e serviços
          </Link>
        </RevealScope>
      </nav>
    </>
  );
}

/* ── SIS-280 — `CaixaHub` E `Trilho` SAÍRAM COM O DIAGRAMA ────────────────────
   As duas eram usadas SÓ pela seção «Integração sem Fronteiras», que agora mostra
   a arte `integracaosemfronteira.webp` (ver a nota em `ARTE_INTEGRACAO` e a da
   própria seção). Ficam comentadas pela regra da casa, e porque o argumento de
   desenho de cada uma é o que se perderia — em particular a conta da ramificação,
   que uma sonda já reprovou uma vez:

     // A caixa do diagrama, igual nos três lugares em que aparece. Função local e
     // não componente exportado: só esta seção a usa, e exportá-la convidaria
     // outra rota a herdar um desenho calibrado para o navy `#001A3D` desta faixa.
     function CaixaHub({ Icone, titulo, apoio }: {
       Icone: typeof ServerCog; titulo: string; apoio: string;
     }) {
       // ÍCONE AO LADO DO TÍTULO, e não acima dele: é o desenho da referência.
       // O ícone tem disco arredondado e o texto desceu um passo de escala,
       // porque com a caixa mais estreita — a grade deu 1,05fr ao centro —
       // «Sistemas da seguradora» quebrava em três linhas em `text-base`.
       // `shrink-0` no disco: sem ele o flex comprime o ícone quando o título
       // quebra.
       return (
         <div className="flex h-full w-full items-center gap-3.5 rounded-2xl border border-white/[14%] bg-white/[0.06] p-4">
           <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#0ed8f6]/25 bg-[#0ed8f6]/10">
             <Icone className="h-5 w-5 text-[#A5F0FF]" strokeWidth={1.7} />
           </span>
           <span className="block">
             <span className="block font-display text-sm font-semibold leading-snug text-white">{titulo}</span>
             <span className="mt-1 block text-xs leading-relaxed text-white/75">{apoio}</span>
           </span>
         </div>
       );
     }

     // O conector: linha fina com um ponto em CADA PONTA, como a referência
     // desenha (nela os pontos marcam onde a linha encosta na caixa e no centro).
     // `aria-hidden` ficava no chamador, porque é desenho.
     function Trilho() {
       return (
         <span className="relative flex h-px w-full items-center bg-[#0ed8f6]/40">
           <span className="absolute left-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#0ed8f6]" />
           <span className="absolute right-0 h-1.5 w-1.5 translate-x-1/2 rounded-full bg-[#0ed8f6]" />
         </span>
       );
     }

   E a grade que as montava, com a conta do tronco ramificado — o número que a
   sonda corrigiu: o tronco eram DUAS METADES, uma por fileira, e não uma barra de
   `top-1/4` a `bottom-1/4` na coluna toda, porque a coluna dos destinos tem
   `gap-5` e a barra ignorava o vão (caía em 25%/75% da altura enquanto os centros
   das caixas ficavam em 22%/78%). Com meia barra por fileira, usando o MESMO
   `gap-5`, as pontas encontravam os centros em qualquer altura. Os conectores
   sumiam abaixo de `lg`, onde as caixas empilham: régua horizontal sobre pilha
   vertical vira risco atravessando o vazio. */

/**
 * A CONTAGEM dos números de «Benefícios», pedida para disparar «quando chega na
 * seção».
 *
 * O TEXTO FINAL É O QUE O SERVIDOR ENTREGA e o que a árvore de acessibilidade lê:
 * o `<span>` nasce com `para + sufixo` e a animação só reescreve o `textContent`.
 * É o padrão de `Metrics.tsx` nesta casa, e existe por dois motivos concretos —
 * sem JavaScript, ou com movimento reduzido, o número correto já está na tela; e
 * não há divergência de hidratação, porque servidor e primeiro render do cliente
 * escrevem a mesma string (o `useReducedMotion` da casa nasce `false` nos dois).
 *
 * ── SIS-280 — O GATILHO TROCOU DE MECANISMO ─────────────────────────────────
 *
 * Era `onViewportEnter` do `motion/react`, no `motion.span` que este nó usava. Com
 * o `motion/react` fora desta página (ver o docblock do topo), não há mais
 * `motion.span` onde pendurar o evento — e somar o pacote de volta só por ele
 * seria manter uma segunda máquina de viewport viva para um nó.
 *
 * O que entra é `IntersectionObserver` direto, com `LIMIAR_REVEAL`/`MARGEM_REVEAL`
 * — o MESMO par que os `RevealScope` desta página usam, de `./reveal-calibre.ts`:
 * a contagem passa a acender na mesma cadência de rolagem que o bloco em volta,
 * em vez de ter um segundo momento de ignição. Ele NÃO é o `useInView` do pacote,
 * que foi a primeira tentativa da SIS-286 e nunca virou `true` nesta árvore —
 * medido lá, com um `IntersectionObserver` de controle no MESMO nó disparando
 * normalmente. É esse controle que agora é o mecanismo.
 *
 * `once`: o observador se desliga na primeira entrada (`unobserve`), que é o que
 * `viewport={{ once: true }}` fazia — conta uma vez, não a cada passagem.
 *
 * `rm` vem por prop, do hook já chamado no componente de cima — um segundo
 * `useReducedMotion()` aqui daria três assinaturas do mesmo `matchMedia` na mesma
 * seção, e o valor é o mesmo para as três.
 */
function Contagem({
  de,
  para,
  sufixo,
  rm,
}: {
  de: number;
  para: number;
  sufixo: string;
  rm: boolean;
}) {
  const alvo = useRef<HTMLSpanElement>(null);
  const [naTela, setNaTela] = useState(false);

  /* O OBSERVADOR, em efeito próprio: ele não depende de `rm` nem dos números, e
     juntá-lo ao efeito da animação o faria ser desmontado e remontado a cada
     mudança daquelas dependências. */
  useEffect(() => {
    const no = alvo.current;
    if (!no) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setNaTela(true);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: LIMIAR_REVEAL, rootMargin: MARGEM_REVEAL },
    );
    obs.observe(no);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const no = alvo.current;
    if (!no) return;
    /* MOVIMENTO REDUZIDO MARCA `fim`, e não ausência de atributo. Antes o efeito
       voltava antes disto e o nó ficava SEM `data-contagem` — a sonda lia uma
       lista vazia, que é indistinguível de «o componente não montou». O valor na
       tela já estava certo (é o que o servidor escreveu); o que faltava era poder
       PROVAR isso. Nada se anima aqui: só se declara o estado que já vigora. */
    if (rm) {
      no.dataset.contagem = 'fim';
      return;
    }
    if (!naTela) return;
    /* `data-contagem` é ESTADO DISCRETO para medição, e não enfeite: perseguir
       quadros com `requestAnimationFrame` numa sonda é corrida — ou se pega o
       meio da curva, ou não, e um «não pegou» é indistinguível de «não contou».
       Com o atributo, a sonda lê `ativa`/`fim` a qualquer instante. */
    no.dataset.contagem = 'ativa';
    const controle = animate(de, para, {
      duration: 1.4,
      ease: [...easeExpo],
      onUpdate: (v) => {
        no.textContent = `${Math.round(v)}${sufixo}`;
      },
      /* Fecha exatamente no valor: `Math.round` de um quadro a meio dígito do
         alvo pode descansar em 449. */
      onComplete: () => {
        no.textContent = `${para}${sufixo}`;
        no.dataset.contagem = 'fim';
      },
    });
    /* Se a seção desmontar no meio da contagem, o que fica é o valor certo. */
    return () => {
      controle.stop();
      no.textContent = `${para}${sufixo}`;
      no.dataset.contagem = 'fim';
    };
  }, [naTela, rm, de, para, sufixo]);

  /* Sem `data-reveal` neste nó: ele só AVISA que entrou. A revelação da coluna
     inteira é do `<li>` acima, e um segundo estado de opacidade aqui piscaria o
     número dentro do card que já faz o fade-in. */
  return (
    <span ref={alvo} className="inline-block">
      {para}
      {sufixo}
    </span>
  );
}
