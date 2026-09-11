"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/lib/motion";
import { criarConsultaDeMedia } from "@/lib/mediaStore";
import { OFFICES } from "@/data/aSistran";
import TituloAceso from "./TituloAceso";
import BrazilOfficesMap from "./BrazilOfficesMap";

/* SIS-163 (adendo a esta nota, que a issue contradiz em parte) — O QUE SAIU FOI
   O WEBGL, NAO A TORRE. A nota da SIS-161 abaixo continua valendo inteira sobre o
   `BuildingExplorer`: ele segue comentado, o `three` segue sem consumidor nesta
   rota e nada aqui volta a baixar GPU. O que a SIS-163 mudou é que o ASSUNTO
   "torre de Sao Paulo" voltou, como imagem parada de 97 kB — ver
   `TorreSaoPaulo()` mais abaixo. Onde esta nota diz "a torre passaria a disputar
   a mesma caixa do mapa", o argumento se mantem e é a razao de a imagem NAO ter
   ido para cima do mapa: ela mora dentro da ficha de Sao Paulo, na coluna de
   leitura.
   Religar o explorador continua sendo o que esta escrito abaixo — e, se for
   religado, a imagem sai: os dois sao a mesma informacao.

   SIS-161 — A TORRE 3D SAIU DE CENA, comentada e nao removida.
   MOTIVO: a composicao pedida é de UMA tela, com o mapa a direita e a coluna de
   leitura a esquerda. A torre existia porque a cena era um percurso de 340svh:
   ela ocupava o trecho final, quando o mapa se apagava. Sem percurso nao existe
   trecho final, e a torre passaria a disputar a mesma caixa do mapa — dois
   assuntos no mesmo lugar, que é justamente o que a arte de referencia arruma.

   O QUE ISSO GANHA, e é medivel: os DOIS consumidores de `BuildingExplorer`
   entravam por `dynamic()`, entao o pacote do `three` e do `OrbitControls`
   deixa de ser baixado nesta rota — nao é divida de dependencia orfa, é peso
   que sai. `BuildingExplorer` continua no repositorio, intacto; quem o
   mantinha vivo em `/quem-somos` era esta cena e o `BuildingShowcase`
   (comentado na SIS-69), e o comentario de la foi corrigido junto com isto,
   porque afirmava "o `three` agora tem um consumidor em vez de dois".

   Religar é descomentar o import de tipo, o `dynamic()` abaixo, o estado
   `predio` com os tres refs, as escritas de `--os-predio` na partitura e o no
   `.os-predio` no JSX — todos marcados com esta mesma sigla.

import dynamic from 'next/dynamic';
import type { ExplorerApi } from './BuildingExplorer';

const ExploradorPredio = dynamic(
  () => import('./BuildingExplorer').then((m) => m.BuildingExplorer),
  { ssr: false },
);
*/

/**
 * Cena dos escritorios: UMA tela larga, com a coluna de leitura a esquerda
 * (sobretitulo, titulo em dois tons com o risco, as abas e o cartao da cidade) e
 * o mapa a direita. Pato Branco e Sao Paulo; quem troca de cidade é a ABA.
 *
 * O Rio de Janeiro saiu da cena por ora: continua no rodape e na pagina de
 * contato, que sao as suas outras aparicoes no site.
 *
 * SIS-169 — A ROLAGEM VOLTOU A DIRIGIR, E ISTO REESCREVE A NOTA DA SIS-161 QUE
 * VINHA AQUI. A frase antiga dizia que a partitura "deixou de ser esfregada e
 * virou entrada", que a secao "tem a altura do proprio conteudo" e que a rolagem
 * "nao dirige mais". As tres passaram a ser falsas e por isso foram reescritas,
 * nao mantidas ao lado. O que ficou de pe da SIS-161 é o que continua verdade: as
 * fracoes da entrada sao as mesmas de sempre, nenhuma constante foi apagada e as
 * que perderam consumidor seguem comentadas no lugar com o motivo.
 *
 * SAO DOIS EIXOS DE TEMPO, E ESTA É A DECISAO CENTRAL DESTA ISSUE — nao um
 * progresso só, como era antes da SIS-161:
 *
 *   · A ENTRADA continua `once` e continua sendo ENTRADA. Ela monta o mapa —
 *     contorno, corpo do pais, divisas, rota — e isso se assiste uma vez: mapa
 *     pronto é o estado normal desta secao, nao um quadro de animacao. Subir e
 *     descer a pagina nao remonta o desenho.
 *   · O TRANSITO Pato Branco -> Sao Paulo é ESFREGADO e REVERSIVEL, porque ele
 *     nao é revelacao, é NAVEGACAO: rolar de volta tem de devolver Pato Branco,
 *     senao a rolagem seria um caminho de mao unica ate Sao Paulo.
 *
 * Por que os dois nao podem ser o mesmo progresso: uma entrada reversivel
 * desmontaria o mapa ao subir, e um transito `once` prenderia quem rola de volta
 * em Sao Paulo. Cada um precisa do comportamento que o outro nao pode ter.
 *
 * QUEM É O DONO DA CIDADE ATIVA: a ROLAGEM, e ela sozinha. `ativa` tem UM
 * escritor — o `onUpdate` do gatilho do transito. A aba voltou a ser ATALHO: o
 * clique nao escreve `ativa`, ele leva a janela ate a fracao daquela cidade, e a
 * cidade troca porque a rolagem passou pela metade do transito. Isto é o oposto
 * do que a SIS-161 fez (la o clique era o dono e a rolagem nao opinava), e a
 * troca é deliberada: com a rolagem dirigindo, dois escritores para o mesmo
 * estado dariam a briga que a propria SIS-161 nomeia.
 * O que se perde e fica registrado: quem clica na aba É transportado de novo — o
 * cartao nao troca mais no lugar. É o preco de a cena ser percurso, e é o mesmo
 * comportamento de antes da SIS-161.
 *
 * Continua sem `pin: true`, mesmo com a cena presa outra vez: quem prende é
 * `position: sticky` no `.os-inner`, dentro de uma `.os-trilha` de altura
 * declarada. Pin remonta o no no DOM e desalinha com o scroll suave do Lenis.
 *
 * E O GATILHO DO TRANSITO MEDE A MESMA CAIXA QUE O STICKY PERCORRE — é este o
 * cuidado que a SIS-156 cobrou e que o `EventsSpotlight` ja resolve do mesmo
 * jeito. O curso do sticky é `trilha.offsetHeight - inner.offsetHeight`, e o
 * gatilho usa exatamente essa expressao no `end`, com `start: "top top"`. Nao ha
 * duas medidas para calibrar: se a altura da trilha mudar, o `end` muda junto,
 * porque ele É a altura da trilha menos o painel. Por isso o `.os-inner` cola em
 * `top: 0` e a folga do cabecalho virou padding do palco: com `top` diferente de
 * zero, o sticky comecaria a colar antes de `"top top"` e as duas medidas
 * divergiriam pelo tamanho do cabecalho.
 *
 * O que muda por quadro viaja por variavel CSS escrita num ref — nao por estado
 * — para nao re-renderizar a 60 Hz. De estado sobra só a cidade ativa, que é
 * discreta (0 ou 1) e muda uma vez por travessia, na metade do transito.
 *
 * Nada aqui depende de animacao para existir: abaixo de 1280px e com preferencia
 * por menos movimento a cena vira lista, com as duas cidades acesas no mapa, a
 * rota inteira desenhada e as duas fichas visiveis, uma embaixo da outra.
 *
 * Os textos sao os que o site ja tem: as descricoes de Sao Paulo e Pato Branco de
 * `OFFICES`, os rotulos do proprio mapa e o titulo da secao, que veio de
 * `quem-somos/page.tsx` para dentro da cena sem trocar uma palavra.
 */

const clamp01 = (valor: number) => Math.min(1, Math.max(0, valor));

type Foto = { base: string; largura: number; altura: number; alt: string };
type Cidade = { id: string; nome: string; texto?: string; fotos: Foto[] };

const textoDe = (id: string) => OFFICES.find((o) => o.id === id)?.text;

/* As tres fotos por cidade: uma de fachada e duas do interior. Cada arquivo tem
   duas larguras geradas por `scripts/otimizar-fotos-escritorios.mjs`; o `srcSet`
   deixa o navegador escolher, o que o `next/image` nao faria aqui porque o
   projeto roda com `images: { unoptimized: true }`. */
const CIDADES: Cidade[] = [
  {
    id: "pr",
    nome: "Pato Branco",
    texto: textoDe("pr"),
    fotos: [
      {
        base: "pb-0",
        largura: 1600,
        altura: 1201,
        alt: "Fachada da Sistran em Pato Branco",
      },
      {
        base: "pb-3",
        largura: 1280,
        altura: 960,
        alt: "Área de trabalho da Sistran em Pato Branco",
      },
      {
        base: "pb-2",
        largura: 1024,
        altura: 768,
        alt: "Equipe da Sistran em Pato Branco",
      },
    ],
  },
  {
    id: "sp",
    nome: "São Paulo",
    texto: textoDe("sp"),
    fotos: [
      {
        base: "sp-1-1",
        largura: 1600,
        altura: 2133,
        alt: "Fachada do escritório da Sistran em São Paulo",
      },
      {
        base: "sp-6",
        largura: 1600,
        altura: 2133,
        alt: "Área de trabalho do escritório da Sistran em São Paulo",
      },
      {
        base: "sp-4",
        largura: 960,
        altura: 1280,
        alt: "Área de convivência do escritório da Sistran em São Paulo",
      },
    ],
  },
];

function Fotos({ fotos }: { fotos: Foto[] }) {
  if (!fotos.length) return null;
  return (
    <div className="os-fotos">
      {fotos.map((f, i) => (
        <figure className="os-foto" data-ordem={i} key={f.base}>
          {/* Tag simples de proposito: como as imagens do projeto rodam sem
              otimizacao, o componente do framework nao geraria variante alguma,
              e o srcSet escrito a mao é o que de fato entrega a foto menor no
              celular. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/escritorios/${f.base}-1600.webp`}
            srcSet={`/images/escritorios/${f.base}-960.webp 960w, /images/escritorios/${f.base}-1600.webp ${f.largura}w`}
            sizes="(min-width: 1024px) 40vw, 100vw"
            width={f.largura}
            height={f.altura}
            alt={f.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}

/* SIS-163 — A TORRE VOLTOU A CENA, E VOLTOU COMO IMAGEM PARADA.
   O explorador WebGL continua comentado no topo deste arquivo e no `.os-predio`
   do `globals.css`: o que a issue troca nao é a moldura, é o MEIO. Onde havia
   `three`, `OrbitControls`, contexto de GPU e uma torre que se montava, ha um
   `<img>` de 97 kB.

   POR QUE NAO HA `ARRASTE PARA GIRAR 360°` NEM ICONE DE GIRAR, que a arte de
   referencia mostra: o arquivo entregue é UM quadro, nao uma sequencia. Rotulo
   de arraste sobre imagem parada promete uma interacao que nao existe — e quem
   tenta arrastar e nada acontece nao conclui "isto é estatico", conclui "isto
   esta quebrado". A decisao de manter o render estatico e tirar o rotulo é de
   quem mantem o conteudo, e esta registrada nos comentarios da SIS-163.

   O `alt` descreve o PREDIO, e nao "render 3D": a informacao que a imagem
   carrega é como é o escritorio, nao com que ferramenta ela foi feita.

   O ANDAR É O 2º, E A REFERENCIA ESTA ERRADA NESSE PONTO — ver o balao abaixo.

   SIS-169 — `escondida` entrou porque a torre saiu de dentro da ficha de Sao
   Paulo e deixou de herdar o `inert` + `aria-hidden` dela (o motivo completo esta
   no ponto de uso, na `.os-coluna`). É so isto que a prop faz: ela NAO decide se
   a torre existe — a torre esta sempre no DOM — nem cuida dos olhos, que é
   trabalho do `opacity` no CSS. Ela cuida de quem ouve e de quem navega por
   teclado, exatamente como o painel fazia. */
function TorreSaoPaulo({ escondida }: { escondida?: boolean }) {
  return (
    <div
      className="os-torre"
      inert={escondida || undefined}
      aria-hidden={escondida || undefined}
    >
      {/* Tag simples pelo mesmo motivo das fotos logo acima: o projeto roda com
          `images: { unoptimized: true }`, entao o componente do framework nao
          geraria variante alguma e o `srcSet` escrito a mao é o que de fato
          entrega o arquivo menor em tela estreita. As duas larguras saem de
          `scripts/preparar-render-torre.mjs`, que tambem é onde o canal alfa
          desta imagem foi reconstruido — a origem tem o xadrez de transparencia
          PINTADO, e o motivo esta escrito la. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="os-torre-render"
        src="/images/escritorios/torre-sp-1200.webp"
        srcSet="/images/escritorios/torre-sp-720.webp 720w, /images/escritorios/torre-sp-1200.webp 1200w"
        sizes="(min-width: 1024px) 22rem, 60vw"
        width={1200}
        height={1209}
        alt="Torre de escritórios de fachada envidraçada azul, com um corpo cilíndrico prateado ao centro, sobre uma base circular iluminada e cercada de árvores."
        /* SIS-169 — `lazy` CONTINUA, e agora tem um segundo motivo. A torre esta
           sempre no DOM e comeca invisivel por `opacity`, nao por `display`: para
           o navegador ela É uma imagem dentro do painel preso, entao ele a busca
           quando a secao se aproxima da janela — antes de o transito comecar, nao
           no meio dele. Trocar por `eager` adiantaria 97 kB para o comeco da
           pagina sem ganhar quadro nenhum; `display: none` até o transito é que
           seria o erro, porque aí ela chegaria durante o movimento. */
        loading="lazy"
        decoding="async"
      />
      {/* O BALAO DO ANDAR. O texto é o MESMO que o explorador comentado
          carregava em `rotuloDestaque` — nao é redacao nova, é a mesma
          informacao mudando de suporte.

          ⚠️ O 2º É O NUMERO CONFIRMADO, e a arte de referencia
          (`public/imagensexemplo/mapasescritorio1.png`) diz "8º andar": ela esta
          ERRADA nesse ponto. Isto é informacao sobre a Sistran, nao desenho, e
          por isso a referencia nao ganha por ser a referencia. A divergencia é
          deliberada e esta escrita aqui para ninguem "corrigir" o codigo para o
          8º na proxima conferencia com a arte ao lado.

          O fio fino e o ponto aceso na fachada sao DESENHO e vivem nos
          pseudo-elementos deste paragrafo (`.os-torre-balao` no `globals.css`):
          nao carregam informacao, e nao devem virar nos na arvore de quem ouve. */}
      <p className="os-torre-balao">2º andar · escritório São Paulo</p>

      {/* SIS-169 — O FEIXE, do pino de Sao Paulo no mapa ate a fachada. Decoracao
          pura, como o `.os-elo`: `aria-hidden`, e nenhuma informacao depende dele
          — qual escritorio é aquela torre esta escrito no balao logo acima.

          POR QUE ELE MORA AQUI DENTRO, e nao ao lado do mapa: a ponta da esquerda
          é a fachada, entao ancorar na torre da a metade da geometria de graca
          (`left: 100%` da caixa dela) e faz o feixe herdar o `opacity` do
          transito — ele nao pode existir num quadro em que a torre nao existe. Se
          morasse no mapa, a ponta esquerda teria de ser medida tambem, e seriam
          duas medidas onde uma basta. A outra metade — comprimento e altura — é o
          par `--os-feixe-larg`/`--os-feixe-topo`, medido no componente.

          `inert` NAO é preciso aqui, ao contrario do resto da torre: `span` vazio
          nao recebe foco e nao tem conteudo a ler. O `aria-hidden` fica pelo
          mesmo motivo do `.os-elo` — tirar da arvore um no que é risco na tela. */}
      <span aria-hidden className="os-feixe" />
    </div>
  );
}

/* Partitura da ENTRADA, em constantes nomeadas — nao em numeros soltos no meio
   do codigo. O mapa nasce vazio e se desenha; a cidade só acende depois.
   SIS-161: as fracoes sao as MESMAS de quando a rolagem as esfregava. O que
   mudou é o eixo: antes `p` era o progresso do gatilho, agora é o progresso de
   uma animacao de `ENTRADA_DURACAO` segundos que roda uma vez. */
const ENTRADA_FIM = 0.2; // o contorno acaba de se desenhar
/* SIS-96 — o preenchimento comecava em 0.08, ou seja, ANTES de o contorno fechar:
   os dois terminavam juntos e a leitura era de uma coisa só aparecendo. Agora ele
   parte de onde o contorno acaba. A ordem passa a ser visivel: primeiro o risco do
   pais, depois o corpo dele, depois as fronteiras do continente em volta. */
const PREENCHE_INICIO = ENTRADA_FIM;
const PREENCHE_FIM = 0.34;
/* Divisas do continente em cascata, ja com o pais cheio por baixo. */
const DIVISAS_INICIO = 0.3;
const DIVISAS_FIM = 0.52;
const ROTA_INICIO = 0.36;
const ROTA_FIM = 0.86;
/* Empurrado de 0.22 para depois do preenchimento: nenhum pin pousa sobre um mapa
   que ainda esta se montando. */
const CIDADES_INICIO = 0.4; // antes disso nenhuma cidade esta acesa

/* Quanto dura a entrada inteira, em segundos. O numero vem das fases que ela
   contem, nao do gosto: a rota, que é o gesto mais longo, ocupa de ROTA_INICIO a
   ROTA_FIM, ou seja meio percurso — com 3,2s ela leva ~1,6s, que é o tempo dos
   outros tracados desta pagina (o `--os-contorno` do contorno, 0,64s aqui, ficou
   na ordem dos 0,6s dos reveals do projeto). */
const ENTRADA_DURACAO = 3.2;

/* SIS-169 — O PERCURSO, E A CONTA DELE POR INTEIRO.

   A trilha tem 300svh. Deste total o painel preso ocupa 100svh — ele é o que se
   ve —, e por isso o CURSO do sticky, que é o que a rolagem esfrega, sao os
   200svh que sobram: 300 - 100. Nao é numero escolhido; é a altura menos o painel,
   e é a mesma expressao que o gatilho usa no `end`.

   Esses 200svh se dividem em tres trechos, e a divisao tem motivo:

     ·   0 -> 0.25   POUSO em Pato Branco — 50svh de leitura parada. A primeira
                     ficha nao pode comecar a ir embora no primeiro pixel de
                     rolagem, senao ninguem a le.
     · 0.25 -> 0.75  TRANSITO — 100svh, metade do curso. É o unico trecho com
                     movimento, e é o mais longo porque é o unico que pede tempo:
                     o cartao cruza a tela e o mapa fecha o zoom.
     · 0.75 -> 1     POUSO em Sao Paulo — 50svh, simetrico ao primeiro, para a
                     segunda ficha tambem ter leitura parada antes da secao sair.

   A TROCA da cidade ativa é a METADE do transito, nao a borda dele: trocar em
   0.25 acenderia Sao Paulo no primeiro quadro do movimento, e trocar em 0.75
   deixaria Pato Branco aceso durante a viagem inteira. No meio, cada cidade
   fica acesa exatamente enquanto o cartao dela esta na frente. */
const PERCURSO_SVH = 300;
const TRANSITO_INICIO = 0.25;
const TRANSITO_FIM = 0.75;
const TROCA = (TRANSITO_INICIO + TRANSITO_FIM) / 2; // 0.5

/* Centro de cada pouso — para onde a aba leva a janela quando é usada como
   atalho. Sao os pontos mais longe do transito em cada ponta, ou seja onde a
   ficha esta inteira e imovel. */
const POUSO = [TRANSITO_INICIO / 2, (TRANSITO_FIM + 1) / 2] as const; // 0.125 e 0.875

/* SIS-169 — o feixe pino->torre só existe com o transito INTEIRO, e o numero é 1
   por medicao, nao por simetria.

   A primeira versao acendia numa rampa de 0,92 a 1, e a sonda mostrou o defeito:
   o feixe passava 12,9px ADIANTE do nucleo do pino em 1280x800 (14 em 1440,
   13,9 em 1800 e 2560). A causa nao é a camera assentando, é o `--os-desliza` do
   `globals.css`, que vale `transito * -34%`: o pino CONTINUA andando dentro dessa
   rampa — 706,9px em 0,94 contra 693,9px em 1,0 na mesma janela. Medir na entrada
   da rampa congela o comprimento de um quadro que ja passou, e o fio fica com uma
   farpa saindo do outro lado do pino.

   Com a soleira em 1 as duas pontas estao paradas: a mesma medicao repetida ao
   longo de todo o pouso (f de 0,76 a 1,0 do curso, passo de 0,02) devolveu o
   mesmo pixel em seis larguras. A saida usa 0,995, e nao 1: com o mesmo numero nos
   dois lados, parar a rolagem exatamente na soleira ligaria e desligaria o feixe a
   cada quadro.

   O par vive aqui e é lido pelo CSS pelo `data-pousado` do palco — o desenho nao
   repete a conta. */
const FEIXE_ACENDE = 1;
const FEIXE_APAGA = 0.995;

/* SIS-161 — AS QUATRO FASES DA TORRE PERDERAM CONSUMIDOR e ficam comentadas com
   os valores que tinham, junto do `dynamic()` no topo do arquivo.

   SIS-169 — a rolagem voltou a dirigir, e mesmo assim `SP_INICIO` NAO voltou: o
   transito é um eixo proprio, com `TRANSITO_INICIO`/`TRANSITO_FIM` acima, e nao
   uma fatia do progresso da entrada. Ressuscitar `SP_INICIO` recriaria o
   progresso unico que estas constantes existem para separar. A conta fica
   registrada porque ela é a receita de derivar um trecho de cidade a partir de
   `CIDADES_INICIO` — util se a cena voltar a ter mais de duas cidades.

const SP_INICIO =
  CIDADES_INICIO + (1 - CIDADES_INICIO) * ((CIDADES.length - 1) / CIDADES.length);
const PREDIO_SURGIR = 0.3;
const MARCADOR_INICIO = 0.56;
const PREDIO_MONTAR = 0.06;
*/

/* SIS-182 — a consulta desta cena, no formato da casa. Achada pela varredura
   obrigatória (não estava entre os oito). É a única do conjunto com DUAS
   condições, e por isso a única que um hook de breakpoint por nome não saberia
   representar: a altura pesa tanto quanto a largura aqui.
   ⚠️ Idêntica ao `@media` do bloco `modo scroll` em `globals.css`; as duas mudam
   juntas. A conta (1152px úteis a 1280, faixa livre de 288px) está no comentário
   do efeito substituído, mais abaixo. */
const useCenaCabe = criarConsultaDeMedia(
  "(min-width: 1280px) and (min-height: 760px)",
);

export default function OfficesScene() {
  /* SIS-182 — era `useState(false)` + efeito com `matchMedia`. Como em
     `BuildingShowcase`, a preferência de movimento passou a vir do store
     (`useReducedMotion`), de modo que trocar a escolha na página desliga a cena
     sem depender de um `change` de largura para reavaliar. */
  const cenaCabe = useCenaCabe();
  const rm = useReducedMotion();
  const dirigindo = cenaCabe && !rm;
  /* SIS-161 — a cidade ativa nasce em 0 (Pato Branco), e nao mais em -1. O -1
     valia enquanto a rolagem escolhia: existia um trecho ANTES da primeira
     cidade. Agora quem escolhe é a aba, e uma lista de abas sem nenhuma
     selecionada nao existe — `aria-selected="false"` nas duas seria um
     `tablist` sem painel corrente. Quem esconde o cartao durante a entrada é o
     `revelado` abaixo, que é assunto de tempo, nao de selecao. */
  const [ativa, setAtiva] = useState(0);
  /* Vira `true` quando a entrada passa de `CIDADES_INICIO` — ou de saida, se a
     entrada nem roda (sem JavaScript, movimento reduzido, modo lista). */
  const [revelado, setRevelado] = useState(false);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const reveladoRef = useRef(false);
  /* SIS-169 — espelho de `ativa` para o `onUpdate` do transito comparar sem
     entrar nas dependencias do efeito: o gatilho é criado uma vez, e ler o
     estado direto ali congelaria o valor do render em que ele nasceu. */
  const ativaRef = useRef(0);

  /* SIS-169 — "o feixe ja foi medido nesta chegada?". Ref, e nao estado: quem lê e
     escreve é o `onUpdate` do gatilho, uma vez por quadro, e um `setState` ali
     religaria o efeito que criou o proprio gatilho. */
  const feixeMedidoRef = useRef(false);

  /* SIS-161 — o estado e os tres refs da torre saem com ela (ver o topo do
     arquivo). Ficam registrados porque a razao de `predio` ser estado UMA vez e
     nunca voltar a `false` continua valendo se a torre for religada: montar e
     desmontar WebGL na fronteira custaria contexto novo, shader novo e um quadro
     branco.

  const [predio, setPredio] = useState(false);
  const predioRef = useRef(false);
  const predioApiRef = useRef<ExplorerApi | null>(null);
  const predioProgressoRef = useRef(0);
  */

  // SIS-182 — substituído por `useCenaCabe()` + `useReducedMotion()` no topo do
  // componente. Comentado com `//`, e não com `/* */`: o texto do SIS-169 abaixo já é
  // um bloco, e aninhar fecharia o comentário externo na linha do ⚠️.
  //
  // useEffect(() => {
  // /* SIS-169 — ENTROU `min-height: 760px`, E O MOTIVO É MEDIDO. Com a cena presa
  //    em 100svh, a coluna de leitura tem de CABER na tela; antes da SIS-161 nao
  //    tinha, e antes desta issue a secao crescia com o conteudo. Medido em 1024
  //    de largura por 700 de altura: a coluna dava 801px contra 539px de area util
  //    (a altura menos a folga do cabecalho e o respiro de baixo) — 262px de
  //    cartao cortados pelo `overflow: clip` do palco. As fotos encolheram em
  //    `svh` no CSS e resolveram as janelas de 768 para cima; abaixo disso nao ha
  //    encolhimento que salve, e cortar o cartao seria pior do que nao ter
  //    percurso.
  //    E O PISO DE LARGURA SUBIU DE 1024 PARA 1280 POR ARITMETICA, nao por
  //    preferencia. O percurso pede TRES faixas na horizontal: o cartao parado a
  //    esquerda, o mapa no meio e o cartao pousado a direita. O cartao mede 27rem
  //    = 432px, e ele aparece duas vezes na conta (sai de uma borda e chega na
  //    outra): 864px só de cartao. Em 1024 a area util é 922px — sobravam 58px
  //    para o mapa, e medido a p=1 o desenho ficava inteiro debaixo do cartao. Nao
  //    é ajuste de escala: nao cabe. Em 1280 a area util vai a 1152px e a faixa
  //    livre passa a 288px, que é onde o pais recuado pousa (medido: 532..766).
  //    Janela baixa OU estreita cai no modo LISTA, que é completo: as duas fichas,
  //    a torre e o mapa inteiro, empilhados e roláveis. Nao se perde conteudo
  //    nenhum.
  //    ⚠️ Esta consulta é a MESMA do `@media` do bloco `modo scroll` no
  //    `globals.css`, e as duas tem de mudar juntas: JavaScript nao le o breakpoint
  //    do CSS, e se elas divergirem a cena fica presa sem a grade de duas colunas
  //    (ou o contrario). */
  // const mq = window.matchMedia("(min-width: 1280px) and (min-height: 760px)");
  // const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
  // avaliar();
  // mq.addEventListener("change", avaliar);
  // return () => mq.removeEventListener("change", avaliar);
  // }, []);

  useEffect(() => {
    if (!dirigindo) return;
    const trilha = trilhaRef.current;
    const palco = palcoRef.current;
    if (!trilha || !palco) return;

    gsap.registerPlugin(ScrollTrigger);

    /* A entrada anima um OBJETO, e o objeto escreve as variaveis. Nao é rodeio:
       animar as cinco variaveis direto no elemento seriam cinco tweens com a
       mesma duracao a serem mantidos em fase, e as fases sao recortes de um
       progresso só — do jeito que estao escritas nas constantes. */
    const alvo = { p: 0 };
    const escrever = (p: number) => {
      /* Revelacao em tres tempos: o contorno se desenha, o corpo do pais entra
         depois de ele fechar, e as fronteiras do continente vem por ultimo. */
      palco.style.setProperty(
        "--os-contorno",
        String(clamp01(p / ENTRADA_FIM)),
      );
      palco.style.setProperty(
        "--os-entrada",
        String(
          clamp01((p - PREENCHE_INICIO) / (PREENCHE_FIM - PREENCHE_INICIO)),
        ),
      );
      palco.style.setProperty(
        "--os-divisas",
        String(clamp01((p - DIVISAS_INICIO) / (DIVISAS_FIM - DIVISAS_INICIO))),
      );
      /* A rota comeca depois de a primeira cidade se apresentar e termina antes
         do fim, para Sao Paulo nao acender no ultimo quadro. */
      palco.style.setProperty(
        "--os-rota",
        String(clamp01((p - ROTA_INICIO) / (ROTA_FIM - ROTA_INICIO))),
      );
      palco.style.setProperty("--os-p", String(p));

      if (!reveladoRef.current && p >= CIDADES_INICIO) {
        reveladoRef.current = true;
        setRevelado(true);
      }
    };

    escrever(0);
    const entrada = gsap.to(alvo, {
      p: 1,
      duration: ENTRADA_DURACAO,
      ease: "none",
      paused: true,
      onUpdate: () => escrever(alvo.p),
      /* O ultimo quadro é escrito a mao: `onUpdate` nao garante ter passado por
         `p === 1`, e o estado final da cena nao pode depender de sorte de
         amostragem. */
      onComplete: () => escrever(1),
    });

    /* `once`: a entrada é entrada. Sem isso, subir e descer a pagina remontaria a
       revelacao do mapa a cada passagem, e o mapa pronto é o estado normal desta
       secao — nao um quadro de uma animacao. */
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: "top 78%",
      once: true,
      onEnter: () => entrada.play(),
    });

    /* Se a secao JA esta na tela (ou acima dela) quando o efeito monta, a entrada
       parte na hora. Isto nao é redundancia com o `onEnter`: `escrever(0)` acima
       deixa o mapa em branco, entao qualquer caminho em que o gatilho nao dispare
       — chegar na pagina por uma ancora, voltar com a rolagem restaurada, a
       preferencia de largura mudar depois da rolagem — entregaria a secao vazia. É
       o mesmo cuidado de sempre: nada da cena pode depender de um gatilho ter
       acontecido. Mandar tocar duas vezes nao custa nada; o `play()` de um tween
       ja em curso é inerte. */
    if (trilha.getBoundingClientRect().top < window.innerHeight * 0.78)
      entrada.play();

    return () => {
      gatilho.kill();
      entrada.kill();
      for (const nome of [
        "--os-contorno",
        "--os-entrada",
        "--os-divisas",
        "--os-rota",
        "--os-p",
      ]) {
        palco.style.removeProperty(nome);
      }
    };
  }, [dirigindo]);

  /* SIS-169 — O TRANSITO. Segundo gatilho, segundo trabalho: este é ESFREGADO e
     REVERSIVEL, ao contrario da entrada logo acima, que é `once`. Os dois nao se
     estorvam porque escrevem variaveis diferentes — a entrada monta o mapa
     (`--os-contorno`, `--os-entrada`, `--os-divisas`, `--os-rota`), o transito
     move a cena (`--os-transito`) — e porque o `--os-p` da entrada é a unica
     variavel dos dois lados: ela pertence à entrada, e o transito nao a toca.

     O `end` É o curso do sticky, medido na hora e recalculado a cada `refresh`
     (por isso é funcao, nao string): `trilha.offsetHeight - inner.offsetHeight`.
     Com `start: "top top"` e o `.os-inner` colando em `top: 0`, progresso 0 é o
     instante em que o painel prende e progresso 1 é o instante em que ele
     descola. Uma medida só, derivada das caixas reais. */
  useEffect(() => {
    if (!dirigindo) return;
    const trilha = trilhaRef.current;
    const inner = innerRef.current;
    const palco = palcoRef.current;
    if (!trilha || !inner || !palco) return;

    gsap.registerPlugin(ScrollTrigger);

    /* A VIAGEM DO CARTAO É MEDIDA, NUNCA CHUTADA. O cartao vai da coluna de
       leitura, a esquerda, ate encostar na borda interna direita do palco — e essa
       distancia depende da largura da janela, do `clamp()` do padding e da largura
       da propria caixa. Um `translateX(60%)` escolhido a olho acertaria numa
       largura e erraria em todas as outras.

       QUEM É MEDIDO É `.os-baixo`, E NAO `.os-cidades`. A caixa dos cartoes é
       justamente quem recebe o `translate`, entao medi-la devolveria a posicao JA
       deslocada e a conta realimentaria o proprio resultado a cada `refresh`. O
       invólucro em volta nao se move e tem a mesma largura (o cartao é item de
       grade esticado nele), entao ele é a origem parada da viagem.

       Primeira tentativa desta issue, e o defeito que ela deu (MEDIDO, em 1800px):
       usar `offsetLeft`/`offsetWidth` do cartao contra o `clientWidth` do palco.
       `offsetLeft` é relativo ao `offsetParent`, que aqui é a `.os-coluna` —
       posicionada — e nao o palco: ele valia 0, a viagem saiu 1288px em vez de
       1208px e o cartao ultrapassava a borda interna direita em 80px, exatamente o
       padding. Misturar dois sistemas de coordenadas foi o erro; agora tudo é
       `getBoundingClientRect`, um sistema só.

       O deslocamento é a UNICA coisa que muda de lugar na cena, e muda por
       `transform` — nenhuma faixa de grade é animada. */
    const medirViagem = () => {
      const base = palco.querySelector<HTMLElement>(".os-baixo");
      if (!base) return;
      const estilo = getComputedStyle(palco);
      const bordaInterna =
        palco.getBoundingClientRect().right -
        (parseFloat(estilo.paddingRight) || 0);
      palco.style.setProperty(
        "--os-viagem",
        `${Math.max(0, bordaInterna - base.getBoundingClientRect().right)}px`,
      );
    };

    /* SIS-169 — O FEIXE PINO->TORRE, E POR QUE ELE É MEDIDO EM JAVASCRIPT.
       As duas pontas do feixe vivem em sistemas de coordenadas diferentes: a
       esquerda é a fachada da torre, na coluna de leitura, e a direita é o nucleo
       do pino de Sao Paulo DENTRO do SVG do mapa, que a camera aproxima e desloca
       (`--os-foco-escala/x/y`, mais o `--os-desliza` que corre com o transito).
       Nenhuma conta de CSS liga os dois: o pino nao tem posicao fixa em px, ela
       cai de uma cadeia de `transform` sobre um `viewBox`. Ou se mede, ou o feixe
       aponta para o lugar errado — e o mesmo argumento do `--os-viagem` logo
       acima vale aqui, agravado: um comprimento escolhido a olho erraria em toda
       largura menos uma. MEDIDO, no pouso assentado: 238px em 1280x800, 247 em
       1280x760, 286 em 1366, 292 em 1440, 473 em 1800, 853 em 2560.

       O feixe SÓ existe com o transito em 1, e isso nao é economia — é o que o
       torna possivel. Enquanto o transito corre o pino anda (56px medidos entre
       0,8 e 1 em 1440, por causa do `--os-desliza`), e acompanha-lo pediria
       remedir a cada quadro, com o `getBoundingClientRect` forcando layout dentro
       do `onUpdate`. Parado, uma medida basta — e é so parado que ela vale: ver a
       farpa de 13px que a rampa de 0,92 produzia, registrada em `FEIXE_ACENDE`.

       O `setTimeout` de 1,2s nao é folclore: a camera do mapa tem transicao de
       1,1s (`--os-foco-*` no `globals.css`), disparada pela troca de aba em
       p=0,5. Em rolagem rapida a chegada em 0,92 pode cair com a camera ainda em
       curso, e a primeira medida sairia alguns pixels adiantada; a segunda pega o
       quadro parado. Enquanto isso o feixe fica alguns px curto por menos de um
       segundo, o que é o pior caso e é aceitavel.

       Se o pino ou a torre nao estiverem no DOM as variaveis nao sao escritas, e
       o CSS nao desenha nada: o feixe é decoracao (`aria-hidden`), e a relacao
       Sao Paulo->torre continua dita pelo balao do andar. */
    let remedir: ReturnType<typeof setTimeout> | undefined;
    const medirFeixe = () => {
      const torre = palco.querySelector<HTMLElement>(".os-torre");
      const nucleo = palco.querySelector<SVGElement>(
        'g[data-cidade="sp"] .bm-nucleo',
      );
      if (!torre || !nucleo) return;
      const t = torre.getBoundingClientRect();
      const n = nucleo.getBoundingClientRect();
      palco.style.setProperty(
        "--os-feixe-larg",
        `${Math.max(0, (n.left + n.right) / 2 - t.right)}px`,
      );
      palco.style.setProperty(
        "--os-feixe-topo",
        `${(n.top + n.bottom) / 2 - t.top}px`,
      );
    };

    const escrever = (p: number) => {
      const transito = clamp01(
        (p - TRANSITO_INICIO) / (TRANSITO_FIM - TRANSITO_INICIO),
      );
      palco.style.setProperty("--os-transito", String(transito));
      /* Uma medicao por chegada, e nao uma por quadro. `data-pousado` é o que o
         CSS le para acender o feixe: ele nasce JUNTO com a medida, no mesmo
         instante, entao nao ha um quadro com o fio aceso e o comprimento velho. */
      const pousado =
        transito >= (feixeMedidoRef.current ? FEIXE_APAGA : FEIXE_ACENDE);
      if (pousado !== feixeMedidoRef.current) {
        feixeMedidoRef.current = pousado;
        if (pousado) {
          medirFeixe();
          remedir = setTimeout(medirFeixe, 1200);
          palco.dataset.pousado = "sp";
        } else {
          if (remedir) clearTimeout(remedir);
          delete palco.dataset.pousado;
        }
      }
      /* UNICO escritor de `ativa` em toda a cena quando a rolagem dirige. O
         estado é discreto e muda uma vez por travessia, entao a comparacao com o
         ref evita um `setState` por quadro. */
      const indice = p >= TROCA ? 1 : 0;
      if (indice !== ativaRef.current) {
        ativaRef.current = indice;
        setAtiva(indice);
      }
    };

    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: "top top",
      end: () => `+=${Math.max(1, trilha.offsetHeight - inner.offsetHeight)}`,
      /* `onRefreshInit` nao serve aqui: quem precisa reescrever é o estado
         DEPOIS de remedir, e é o que `onRefresh` faz. */
      onUpdate: (self) => escrever(self.progress),
      onRefresh: (self) => {
        medirViagem();
        /* Remedir o feixe TAMBEM no refresh, e a bandeira baixada é o que faz
           isso acontecer: o `escrever` logo abaixo é quem mede, e ele só mede na
           chegada. Sem esta linha, redimensionar a janela com o pouso de Sao Paulo
           na tela deixaria o feixe com o comprimento da largura anterior. */
        feixeMedidoRef.current = false;
        delete palco.dataset.pousado;
        escrever(self.progress);
      },
    });

    medirViagem();
    escrever(gatilho.progress);

    return () => {
      gatilho.kill();
      if (remedir) clearTimeout(remedir);
      palco.style.removeProperty("--os-transito");
      palco.style.removeProperty("--os-viagem");
      palco.style.removeProperty("--os-feixe-larg");
      palco.style.removeProperty("--os-feixe-topo");
      delete palco.dataset.pousado;
    };
  }, [dirigindo]);

  /* Modo lista (abaixo de 1280px, ou janela baixa): sem tela cheia e sem sticky, mas o mapa
     continua surgindo com a rolagem — se desenha enquanto a secao atravessa a
     janela. É a mesma partitura do modo scroll, só sem o ciclo das cidades: em
     tela estreita as duas ficam acesas, porque nao ha trecho por cidade.

     Nada aqui é requisito: se este efeito nao rodar (sem JavaScript, ou com
     movimento reduzido), as variaveis nao existem e o CSS usa 1 em todas — o
     mapa aparece pronto. */
  useEffect(() => {
    if (dirigindo || prefersReducedMotion()) return;
    const trilha = trilhaRef.current;
    const palco = palcoRef.current;
    if (!trilha || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: "top 88%",
      end: "bottom 55%",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        palco.style.setProperty("--os-contorno", String(clamp01(p / 0.55)));
        palco.style.setProperty(
          "--os-entrada",
          String(clamp01((p - 0.1) / 0.45)),
        );
        palco.style.setProperty("--os-rota", String(clamp01((p - 0.4) / 0.5)));
      },
    });

    return () => {
      gatilho.kill();
      for (const nome of ["--os-contorno", "--os-entrada", "--os-rota"]) {
        palco.style.removeProperty(nome);
      }
    };
  }, [dirigindo]);

  /* SIS-169 — A ABA VOLTOU A SER ATALHO DE ROLAGEM, e esta nota substitui a da
     SIS-161 que dizia o contrario. A frase de la — "a aba troca a cidade, e nao
     mais a posicao da janela", "o clique é o dono do estado, e a rolagem nao
     opina" — descrevia uma cena sem trecho por cidade. Com a rolagem dirigindo
     outra vez existe trecho, e manter o clique como dono do estado poria DOIS
     escritores em `ativa`: o clique acenderia Sao Paulo e o primeiro quadro de
     rolagem, ainda no pouso de Pato Branco, apagaria de volta.
     O que se perde, e é o mesmo preco de antes da SIS-161: quem clica É
     transportado — o cartao nao troca no lugar. Fica registrado porque a SIS-161
     tratou isso como ganho, e voltar atras é decisao, nao esquecimento.

     A conta é a que ficou guardada la, adaptada: o percurso é o CURSO DO STICKY
     (a mesma expressao do `end` do gatilho, para os dois nunca divergirem) e a
     fracao é o centro do pouso daquela cidade, nao o meio do trecho. */
  const irPara = useCallback(
    (indice: number) => {
      const trilha = trilhaRef.current;
      const inner = innerRef.current;

      /* Modo lista: nao ha percurso para onde rolar, e aí o clique continua
         sendo o dono — as duas fichas ja estao visiveis, e o `ativa` só decide
         qual aba fica marcada. Nao ha briga porque nao ha gatilho de transito. */
      if (!dirigindo || !trilha || !inner) {
        setAtiva(indice);
        ativaRef.current = indice;
        reveladoRef.current = true;
        setRevelado(true);
        return;
      }

      const percurso = Math.max(1, trilha.offsetHeight - inner.offsetHeight);
      const topo =
        trilha.getBoundingClientRect().top +
        window.scrollY +
        percurso * POUSO[indice];
      /* `window.scrollTo` e nao `scrollIntoView`: o Lenis governa a rolagem
         desta pagina e intercepta o primeiro, nao o segundo. */
      window.scrollTo({
        top: topo,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      /* `ativa` NAO é escrito aqui — quem escreve é o `onUpdate` do transito,
         quando a rolagem passar de `TROCA`. Escrever nos dois lugares é
         exatamente o defeito que esta issue veio corrigir. */
      reveladoRef.current = true;
      setRevelado(true);
    },
    [dirigindo],
  );

  const modo = dirigindo ? "scroll" : "lista";

  return (
    /* SIS-169 — a altura do percurso vem de `PERCURSO_SVH`, escrita aqui como
       variavel e consumida pelo `height` no CSS. Um numero só: o TypeScript
       precisa dele para a conta do atalho da aba e o CSS precisa dele para a
       caixa do sticky, e escrever "300svh" nos dois lugares seria a duplicata
       que primeiro se desencontra. */
    <div
      className="os-trilha"
      data-modo={modo}
      ref={trilhaRef}
      style={{ "--os-percurso": `${PERCURSO_SVH}svh` } as CSSProperties}
    >
      <div className="os-inner" ref={innerRef}>
        {/* `data-ativa` diz qual cidade esta acesa no mapa e qual cartao esta na
            frente; `data-revelado` diz se a entrada ja liberou o cartao. Sao
            duas coisas distintas de proposito — a primeira é selecao, a segunda é
            tempo. Sem rolagem dirigindo (modo lista) NENHUM dos dois existe, e aí
            nada apaga e nada esconde: as duas cidades acesas, as duas fichas. */}
        <div
          className="os-palco"
          data-modo={modo}
          data-ativa={dirigindo ? CIDADES[ativa].id : undefined}
          data-revelado={dirigindo ? (revelado ? "sim" : "nao") : undefined}
          ref={palcoRef}
        >
          {/* SIS-161 — a camada de fundo da arte de referencia: curvas de
              contorno e aneis concentricos pontilhados, atras de tudo. É
              `aria-hidden` e é `span`: nao carrega informacao nenhuma, e desenho
              sem conteudo nao deve virar no de estrutura para o leitor de tela.
              Formas em CSS, sem arquivo novo — ver `.os-fundo` no `globals.css`. */}
          <span aria-hidden className="os-fundo" />

          {/* COLUNA DE LEITURA, sempre a esquerda: sobretitulo, titulo, abas, o
              fio de ligacao e o cartao da cidade. A ordem no DOM é a ordem de
              leitura, e é a mesma em qualquer largura — em tela estreita a coluna
              simplesmente passa a ocupar a largura inteira e o mapa vai para
              baixo dela. */}
          <div className="os-coluna">
            {/* O sobretitulo NAO é redacao nova: é a mesma palavra do titulo
                logo abaixo, que é o rotulo desta secao desde a SIS-69. O travessao
                é do desenho, nao do texto — por isso vive no `::before` do CSS e
                nao aqui dentro.

                SIS-161 (conferencia) — E É JUSTAMENTE POR SER A MESMA PALAVRA que
                ele passou a `aria-hidden`: em tela, "— ESCRITÓRIOS" acima de
                "Escritórios BRASIL" é hierarquia, e a referencia mostra os dois;
                lido em voz alta, viravam "Escritórios. Escritórios BRASIL." — a
                palavra duas vezes seguidas, sem nenhuma informacao nova na
                segunda. Foi isso que a conferencia apontou como olho duplicado.
                Some da arvore de acessibilidade e continua identico em tela, que é
                o que a referencia pede. O nome da secao nao se perde: ele vem do
                `aria-labelledby="escritorios"` da `<section>`, que aponta para o
                `TituloAceso` abaixo — e la a palavra continua sendo lida uma vez.
                Nao foi apagado: apagar tiraria da tela um elemento que a
                referencia tem. */}
            <p aria-hidden className="os-olho">
              Escritórios
            </p>

            {/* O titulo VEIO DE `quem-somos/page.tsx` para dentro da cena, com as
                mesmas palavras e o mesmo `id`, entao o `aria-labelledby` da secao
                continua resolvendo. Ele ja entrega dois dos elementos da
                referencia — o titulo em DOIS TONS (`destaque` no gradiente da
                marca) e o RISCO fino que cresce embaixo — e por isso nao houve
                componente novo para nenhum dos dois. */}
            {/* SIS-185 item 2 — `titulo-escritorios-brasil` escopa o gradiente de
                `BRASIL` NESTA cena: mesma marca, última parada em azul (`#1479ec`)
                em vez do violeta `#7c3aed`. A decisão, os números medidos e a razão
                de ser escopada em vez de global estão na regra em `globals.css`
                (procurar por SIS-185). A classe vai no `<h2>` porque o `<span>` do
                gradiente é montado dentro do `TituloAceso`: mexer lá mudaria os sete
                chamadores por causa de um. */}
            <TituloAceso
              id="escritorios"
              texto="Escritórios"
              destaque="BRASIL"
              /* `titulo-escritorios-brasil`: ver a nota da SIS-185 acima. */
              className="font-display text-section text-ink titulo-escritorios-brasil"
            />

            {dirigindo && (
              <div
                className="os-abas"
                role="tablist"
                aria-label="Escritórios no Brasil"
              >
                {CIDADES.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`os-aba-${c.id}`}
                    aria-selected={i === ativa}
                    aria-controls={`os-painel-${c.id}`}
                    className={i === ativa ? "active" : ""}
                    onClick={() => irPara(i)}
                  >
                    {c.nome}
                  </button>
                ))}
              </div>
            )}

            {/* O FIO com o ponto ciano, ligando a aba acesa ao cartao. Decoracao
                pura: quem informa a relacao aba->cartao é o par
                `aria-controls`/`aria-selected` acima, que ja existia. */}
            <span aria-hidden className="os-elo" />

            {/* SIS-161 (adendo) — O PADRAO DE ABAS FECHADO, E O PAINEL ESCONDIDO
                SAINDO DA ARVORE DE ACESSIBILIDADE.
                Enquanto a rolagem escolhia a cidade, a aba era um atalho e o
                cartao inativo apagado por `opacity` bastava aos olhos. Agora a
                aba é o UNICO jeito de trocar de cidade em desktop, e `opacity: 0`
                nao esconde de quem ouve: as duas cidades eram anunciadas juntas —
                nome, texto e os seis `alt` de foto — e durante a entrada
                (`data-revelado="nao"`) as duas eram lidas com NENHUMA na tela.

                `role="tabpanel"` + `aria-labelledby` apontando de volta para
                `os-aba-…` fecham o par que `aria-controls`/`aria-selected` ja
                comecava. Os dois atributos sao condicionais em `dirigindo`: no
                modo lista nao existe `tablist`, e painel de aba sem lista de abas
                seria pior do que nao ter papel nenhum.

                `inert` + `aria-hidden`, e NAO `hidden`: `hidden` é
                `display: none`, e os dois cartoes ocupam a MESMA celula de grade
                justamente para a caixa ter a altura do mais alto e nada abaixo
                dela se mexer na troca (esta a razao esta escrita no
                `globals.css`). Tirar o inativo do fluxo recriaria o salto de
                layout que aquele arranjo existe para evitar — e mataria a
                transicao de saida de 0,55s. `inert` tira do alcance de foco e da
                arvore preservando a caixa. O `opacity` do CSS continua sendo quem
                cuida dos olhos; aqui se cuida de quem ouve. */}
            {/* SIS-169 — `.os-baixo` existe por UM motivo estrutural: a torre e a
                caixa dos cartoes tem de dividir a mesma celula de grade, para a
                torre aparecer exatamente de onde o cartao saiu (é o que a arte de
                referencia mostra) sem que nenhuma das duas empurre a outra
                verticalmente. Sem este invólucro, dividir a celula dependeria de
                contar as linhas da `.os-coluna` a mao (`grid-row: 5`), e essa
                conta se quebra no dia em que alguem inserir um elemento acima.
                No modo lista ele é um `div` comum e nao faz nada: a torre desce
                para depois das duas fichas, empilhada, como qualquer bloco. */}
            <div className="os-baixo">
            <div className="os-cidades">
              {CIDADES.map((c, i) => {
                /* Escondido = a rolagem esta dirigindo E (a entrada ainda nao
                   liberou o cartao OU esta nao é a cidade da aba acesa). No modo
                   lista os dois cartoes estao na tela e nenhum se esconde. */
                const escondido = dirigindo && (!revelado || i !== ativa);
                return (
                  <article
                    className="os-painel"
                    data-cidade={c.id}
                    id={`os-painel-${c.id}`}
                    key={c.id}
                    role={dirigindo ? "tabpanel" : undefined}
                    aria-labelledby={dirigindo ? `os-aba-${c.id}` : undefined}
                    inert={escondido || undefined}
                    aria-hidden={escondido || undefined}
                  >
                    <h3 className="os-cidade-nome">{c.nome}</h3>
                    {c.texto ? (
                      <p className="os-cidade-texto">{c.texto}</p>
                    ) : null}
                    <Fotos fotos={c.fotos} />
                  </article>
                );
              })}
            </div>

            {/* SIS-169 — A TORRE SAIU DE DENTRO DA FICHA DE SAO PAULO, e este
                comentario REESCREVE o da SIS-163 que justificava ela morar la.
                O texto antigo dizia que ela estava dentro do painel para herdar
                de graca o `inert` + `aria-hidden` e para nao ser montada e
                desmontada a cada troca. Os dois argumentos continuam corretos —
                e é por isso que eles nao foram apagados, foram atendidos de
                outro jeito aqui embaixo. O que os venceu é novo: nesta issue o
                cartao VIAJA para a coluna da direita, e a torre dentro dele
                viajaria junto. Na arte de referencia ela fica na esquerda, sob
                as abas, exatamente de onde o cartao saiu.

                Como os dois argumentos ficam atendidos fora do painel:
                  · nao ha montar/desmontar — a torre esta SEMPRE no DOM, nos dois
                    pousos; quem a apaga é `opacity` no CSS, dirigida pelo
                    `--os-transito`. Nada entra ou sai de fluxo no meio da
                    rolagem, que era o salto que a SIS-163 queria evitar.
                  · o `inert` + `aria-hidden` deixou de ser heranca e virou
                    explicito, na mesma condicao da ficha de Sao Paulo: enquanto
                    Pato Branco é a cidade acesa, a torre sai do alcance de foco e
                    da arvore. Duas linhas, e nao uma heranca — é o custo da
                    mudanca, e é pequeno.

                No modo lista `dirigindo` é falso: a torre fica visivel e
                alcancavel junto das duas fichas, depois delas, e o balao diz de
                qual escritorio ela é — o mesmo argumento de contexto da SIS-163,
                que segue valendo. */}
            <TorreSaoPaulo
              escondida={dirigindo && (!revelado || CIDADES[ativa].id !== "sp")}
            />
            </div>
          </div>

          {/* O mapa, a direita. Deixou de ser o fundo da cena inteira: agora ele
              é uma coluna, e é por isso que as linhas de chamada dele encurtaram
              (ver `BrazilOfficesMap.tsx`) — o cartao nao pousa mais em cima dele. */}
          <div className="os-mapa">
            <BrazilOfficesMap />
          </div>

          {/* SIS-161 — a torre 3D ficava aqui, sobre o mapa que se apagava no
              trecho de Sao Paulo, com o 2º andar aceso. Ver o motivo completo no
              topo do arquivo.

          {predio && (
            <div className="os-predio">
              <ExploradorPredio
                model="tower"
                apiRef={predioApiRef}
                progressRef={predioProgressoRef}
                andarDestacado={2}
                rotuloDestaque="2º andar · escritório São Paulo"
                mostrarControles={false}
              />
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
