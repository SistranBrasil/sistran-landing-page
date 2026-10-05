import Link from 'next/link';
/* SIS-253 — `Image` e `ArrowRight` entram para o bloco «Conheça também» no molde
   do Match AI: os cartões viraram mídia (capa + véu + marca) e o fecho é a pílula
   com seta, como a de lá. */
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
import PageHero from '@/components/PageHero';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import About from '@/components/About';
// SIS-42: o ecossistema navegável saiu de cena em favor da arte
// `posicionamentoperfil.png` numa casca (o motivo inteiro está na nota que ocupa
// o lugar do mount, mais abaixo). O import fica comentado porque ativo ele
// quebraria o lint por import não utilizado — e apagado levaria a pista de volta.
// import PositioningEcosystem from '@/components/PositioningEcosystem';
import PerfilPosicionamentoArte from '@/components/PerfilPosicionamentoArte';
/* SIS-238 (24/09) — o «Teatro de Reconhecimentos» saiu de cena para a galeria
   editorial expansível. O motivo inteiro está na nota que ocupa o lugar do mount,
   mais abaixo. O import fica comentado porque ativo ele quebraria o lint por
   import não utilizado, e apagado levaria a pista de como religar.
   import RecognitionTheater from '@/components/RecognitionTheater'; */
import RecognitionGallery from '@/components/recognition-gallery/RecognitionGallery';
import CelentSpotlight from '@/components/CelentSpotlight';
// 23/09 — «Entrega com Alta Performance e Comprometimento» saiu de cena por pedido
// direto; a montagem que saiu, e o chanfro que saiu com ela, estão registrados no
// lugar onde viviam. O componente continua intacto no repositório e agora sem
// nenhum consumidor (na home ele já estava comentado, `src/app/page.tsx:9`). O
// import fica comentado porque ativo ele quebraria o lint por import não utilizado,
// e apagado levaria a pista de como religar.
// import Differentials from '@/components/Differentials';
/* SIS-165 (29/09) — `Metrics` SAI DESTA ROTA, e com isso o scrollytelling de sete
   células fica SEM NENHUM CONSUMIDOR no projeto: a home já o havia trocado pela
   faixa na SIS-272 (`src/app/page.tsx:9`), e esta era a última montagem. O arquivo
   (`Metrics.tsx`, 1672 linhas) segue íntegro no repositório; religar é descomentar
   este import e a linha `<Metrics />` comentada mais abaixo.
   O import fica comentado porque ativo ele quebraria o lint por import não
   utilizado, e apagado levaria a pista de como religar.
// import Metrics from '@/components/Metrics'; */
/* Quem desenha os números agora, nas DUAS rotas. `About.tsx` já monta esta mesma
   peça nesta mesma página com o default de três (1988 / 150+ / 18) e com aresta —
   são dois nós da mesma peça na rota, em conjuntos diferentes, que é exatamente o
   que o item 4 da issue manda não misturar. */
import FaixaIndicadores from '@/components/FaixaIndicadores';
import ContactCTA from '@/components/ContactCTA';
import TechnologiesSection from '@/components/tecnologias/TechnologiesSection';
/* SIS-260 — era `import EssenceAccordion from '@/components/EssenceAccordion';`.
   O motivo da troca está escrito na montagem, mais abaixo. */
import NossaEssenciaSection from '@/components/NossaEssenciaSection';
/* SIS-165 (29/09) — a órbita saiu da rota; quem monta Modelos agora é
   `ModelosFluxo` (fluxo horizontal de anéis, mock 1). O import fica comentado, e
   não apagado, porque é metade do par que religa a composição anterior — a outra
   metade é o `<CircularEngagementModel />` comentado mais abaixo. Os dois arquivos
   dela (`CircularEngagementModel.tsx` e `circular-engagement-model.css`) seguem
   íntegros no repositório.

   import CircularEngagementModel from '@/components/CircularEngagementModel'; */
import ModelosFluxo from '@/components/ModelosFluxo';
/* SIS-69: `BuildingShowcase` saiu da pagina — o import volta junto com o bloco,
   documentado mais abaixo, entre Tecnologias e Diferenciais. */
import OfficesScene from '@/components/ui/OfficesScene';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';
// Import comentado junto com o consumo do trilho de progresso (ver a nota SIS-100
// no lugar dele, no topo do `PageShell` desta página): deixá-lo ativo quebraria o
// lint por import não utilizado, e removê-lo apagaria a pista de como religar.
// import ProgressoLateral from '@/components/ui/ProgressoLateral';
// Comentado no mesmo movimento que retirou os três últimos chanfros da rota
// (`Metrics` → Reconhecimentos, Essência → Modelos, Modelos → Como Agimos): sem
// nenhum uso montado, o import quebraria o lint, e apagá-lo apagaria a pista de
// como religar. Mesmo tratamento do `ProgressoLateral` acima. O componente segue
// intacto em `src/components/ui/NotchDivider.tsx` e em uso em outras rotas.
// import NotchDivider from '@/components/ui/NotchDivider';
import DiferenciaisSeis from '@/components/DiferenciaisSeis';
import IsgProviderLens from '@/components/isg/IsgProviderLens';
import ComoAgimos from '@/components/como-agimos/ComoAgimos';
import PorQueSistran from '@/components/PorQueSistran';
import {
  /* `COMO_AGIMOS` deixou de ser lido AQUI: quem percorre os oito valores agora é
     `ComoAgimos`. Mesmo motivo dos dois abaixo — o bloco que o consumia está
     registrado no próprio componente, e ativo o import quebraria o lint por não
     utilizado.
  COMO_AGIMOS, */
  /* 23/09 — `DIFERENCIAIS_6` deixou de ser lido AQUI: quem percorre a lista agora
     é `DiferenciaisSeis`. Fica comentado e não apagado porque o bloco que a
     consumia está registrado mais abaixo, e ativo o import quebraria o lint por
     não utilizado.
  DIFERENCIAIS_6, */
  /* SIS-87 — `ISG` deixou de ser lido AQUI: quem percorre os três itens agora é
     `IsgProviderLens`, junto com `ISG_SELO`, `ISG_EYEBROW` e `ISG_CREDITOS`. O
     nome fica comentado pelo mesmo motivo de `DIFERENCIAIS_6` acima — o bloco que
     o consumia está registrado mais abaixo, e ativo o import quebraria o lint.
  ISG, */
  /* SIS-199 — `POR_QUE_SISTRAN` deixou de ser lido AQUI: quem percorre os dez blocos
     agora é `PorQueSistran`. Comentado e não apagado, pelo mesmo motivo dos nomes
     acima — o bloco que o consumia está registrado no próprio componente, e ativo o
     import quebraria o lint por não utilizado.
  POR_QUE_SISTRAN, */
  /* SIS-238 — a nota de premiações deixou de ser lida AQUI: ela entrou na
     `RecognitionGallery`, junto da faixa a que pertence (o motivo está na
     montagem, mais abaixo). O nome fica comentado pelo mesmo motivo dos dois
     acima — ativo, o import quebraria o lint por não ser usado.
  PREMIACOES_NOTAS, */
} from '@/data/aSistran';

export const metadata = {
  title: 'Quem somos · Sistran',
  description:
    'Com ampla presença na América do Sul, contando com mais de 130 clientes e 850 colaboradores, a Sistran é referência em soluções tecnológicas para o setor de Seguros.',
};

/* Esta pagina reune toda a escrita de /a-sistran/. O sobretitulo e o titulo sao
   os do site ("Sobre nós" / "A Sistran"); as secoes seguem a ordem da origem:
   escritorios, diferenciais, missao/valores/pilares, abordagem, como agimos,
   numeros, premiacoes, ISG e "Por que SISTRAN?". As secoes que no site sao
   apenas imagem (Tecnologias, carrosseis dos escritorios) nao foram recriadas.
   Os links para Sistran Labs e Sistran University estao aqui porque é por dentro
   de Quem somos que o menu do site chega nelas.
   Fonte: .claude/conteudo-site/01-a-sistran.md

   A dinamica de rolagem da pagina segue as skills de scroll: cada grade entra em
   cascata com `ScrollReveal` (entrada por `whileInView` com `once`, so opacidade e
   deslocamento), os cartoes usam o chanfro `.notch-card` e a barra de sinal
   `.barra-sinal`, e duas secoes escuras recebem a grade tecnica de fundo. Nada
   disso mexe na escrita: os textos, a ordem e as tags de titulo continuam os
   mesmos, e sem JavaScript ou com movimento reduzido a pagina é a lista
   completa que ja era. */
/* Degraus da grade de quatro colunas: cada coluna comeca um pouco mais abaixo
   que a vizinha, o que quebra a linha reta e faz a cascata de entrada ser
   percebida. É `transform`, entao nao move layout, e o CSS zera tudo abaixo de
   1024px e com movimento reduzido.
   COMENTADO, e não apagado: o único consumidor era a grade de «Como Agimos», que
   deixou de ser grade — virou um bilhete picotado em `ComoAgimos.tsx`, e ali o
   degrau desalinharia a costura de um talão com a do vizinho, que é justamente o
   que dá a leitura de bilhete único. Ativa e sem consumidor ela quebraria o lint
   por variável não utilizada; apagada, levaria embora a pista de como religar o
   escalonamento se alguma grade de quatro colunas voltar a esta página.
const DEGRAU = ['', 'degrau-2', 'degrau-3', 'degrau-2'] as const; */

/* SIS-253 — os dois destinos de «Conheça também», no molde de mídia do Match AI.
   Título e apoio são os LITERAIS que estavam no JSX antigo, sem uma palavra
   mudada; o que a tabela acrescenta é a arte.

   AS CAPAS SÃO A ARTE DA PRÓPRIA ROTA DE DESTINO, e não uma foto inventada:
     · University → `university-hero.webp`, que é a abertura de
       `/sistran-university` (`page.tsx:189`). 1672×941, luminância média 52 —
       escura, então a marca clara sobrevive sobre ela com o véu do molde.
     · Labs → `3-aba-sistran-labs.webp` (o piso do laboratório), e NÃO
       `labs-hero.webp`, que é a abertura de `/sistran-labs` (`page.tsx:207`) e
       seria a escolha simétrica. Medido antes de decidir: aquele arquivo já traz
       a marca «SISTRAN LABS · Technology First!» GRAVADA no centro-direita da
       foto, e o corte 16/10 não a tira (a fonte é 16/9). A marca do molde por
       cima dava duas assinaturas no mesmo cartão. As outras candidatas
       (`principais-solucoes.webp`, `1-aba`, `sistran-labs-5.png`) foram
       descartadas por trazerem texto legível no fundo, que competiria com a
       marca.
   As marcas são as do `Header` (`Header.tsx:144` e `:173`) — os derivados já
   recortados na tinta, o que faz `object-contain` dimensionar o que se vê e não o
   vazio do arquivo. As medidas abaixo são as intrínsecas, lidas com `sharp`. */
const MAIS_QUEM_SOMOS = [
  {
    href: '/sistran-labs',
    titulo: 'Sistran Labs: Laboratório de INOVAÇÃO',
    apoio:
      'Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações da Sistran.',
    capa: '/images/sistran-labs/3-aba-sistran-labs.webp',
    marca: { src: '/images/sistran-labs/logo-labs-header.webp', largura: 421, altura: 96 },
  },
  {
    href: '/sistran-university',
    titulo: 'Sistran University',
    apoio:
      'Autossuficiência em capacitação de recursos: programa de capacitação intensiva da Sistran.',
    capa: '/images/university/university-hero.webp',
    marca: { src: '/images/university/logo-university-header.webp', largura: 291, altura: 96 },
  },
] as const;

export default function Page() {
  return (
    /* 24/09 (chat) — O FUNDO DA ROTA INTEIRA VIVE NO `<main>`, como em `/solucoes`:
       `quem-somos-canvas` (o claro ancorado na janela + a malha no `::before`) e a
       camada de geometria abaixo. O pedido é «todos os backgrounds que não sejam
       azul escuro seguem o mesmo padrão que o /solucoes», e o padrão de lá é um
       PLANO DE ROTA, não uma cor copiada para dentro de cada seção — o inventário
       das treze faixas, o que virou transparente e o que continua escuro estão no
       bloco `/quem-somos` do fim do `globals.css`. */
    <PageShell classeDoMain="quem-somos-canvas">
      {/* A terceira camada do fundo: quadrados arredondados translúcidos e o arco
          azul, que gradiente não desenha. Primeiro nó do `<main>` porque é fundo —
          e é `position: fixed` com `z-index: -1`, então a posição na árvore não muda
          o que se vê; o que ela faz é deixar a leitura do arquivo na mesma ordem das
          camadas. A classe é própria da rota: a folha de `/solucoes` é da SIS-204 e
          reusar o seletor dela faria a próxima passada lá mexer aqui sem saber. */}
      <AtmosferaQuadrados classe="quem-somos-atmosfera" />

      {/* SIS-100 — `<ProgressoLateral />` saiu daqui. Ele é `position: fixed` na
          MESMA borda esquerda que o navegador lateral de seções, que a partir de
          agora existe nesta rota (montado no `PageShell`): dois fixos na mesma
          borda se sobrepõem, e o trilho de 2px passaria por trás dos traços do
          navegador.

          A escolha entre os dois não é de gosto: o trilho era decoração
          (`aria-hidden`, sem ponteiro) e dizia só QUANTO falta; o navegador diz
          ONDE se está, com o nome da seção, e leva até ela. Ele contém a
          informação do outro e acrescenta a que faltava.

          Removido o consumo, não o componente: `ui/ProgressoLateral.tsx` e o
          bloco `.progresso-lateral` do `globals.css` continuam intactos. Religar
          é descomentar esta linha e o import no topo — mas só faz sentido em
          rota que NÃO tenha navegador lateral, e hoje as duas coisas se excluem
          nesta borda.
      <ProgressoLateral />
      */}

      {/* Vídeo em laço atrás da abertura, mesmo tratamento de /solucoes.
          Aqui o `HeroVideoBackdrop` envolve SÓ o hero: diferente de /solucoes,
          esta página nao tem barra "NESTA PÁGINA" — o que vem depois é o chanfro
          para o bloco claro, e ele precisa nascer sobre o navy chapado, nao
          sobre o take. */}
      <HeroVideoBackdrop
        src="/videos/quem-somos-hero-loop.mp4"
        poster="/videos/quem-somos-hero-loop-poster.webp"
      >
        {/* SIS-280 (2ª passada, a pedido): o `eyebrow="Sobre nós"` SAIU. A capa
            fica com a manchete «A Sistran» sozinha — e ela é agora o ÚNICO lugar
            da rota que diz esse nome, porque o `h2` homônimo da seção abaixo saiu
            na mesma passada. A tag dizia o que o próprio menu «Quem somos» e a
            URL já dizem, e com o `h2` fora ela passaria a ser a terceira repetição
            numa página só. Para religar: `eyebrow="Sobre nós"`. */}
        <PageHero title="A" highlight="Sistran" />
      </HeroVideoBackdrop>

      {/* Fronteiras claro/escuro em chanfro: o separador fica FORA do bloco
          claro, porque `.section-light` tem `isolation: isolate` e pintaria o
          proprio degrade sobre ele. A cor é a do bloco que avanca. */}
      {/* ── SIS-75 · mapa de fronteiras desta pagina ───────────────────────────
          Contagem, e nao impressao: os 10 `NotchDivider` desta pagina se dividem
          em 8 fronteiras claro↔escuro e 2 claro↔claro.
          SIS-268 — SÃO NOVE AGORA, 7 claro↔escuro e as mesmas 2 claro↔claro: o
          chanfro de "Conheça também" → "Fale com a Gente!" saiu quando o fecho
          virou o desenho claro da referência (o motivo está no lugar dele, no fim
          do arquivo). A contagem acima fica porque é ela que a SIS-75 mediu.
          SIS-280 — SÃO OITO AGORA, 6 claro↔escuro e as mesmas 2 claro↔claro: o
          chanfro de "Sobre nós" → "Posicionamento" saiu porque a seção passou a
          terminar na faixa navy e a fronteira virou escuro↔escuro (o motivo está no
          lugar dele, comentado na linha do próprio separador).
          SIS-280, 2ª passada — SÃO SETE, 5 claro↔escuro e as mesmas 2 claro↔claro:
          o chanfro de "hero navy" → "Sobre nós" saiu a pedido, por decisão de arte e
          não por premissa caducada (o motivo está comentado na linha dele). As DUAS
          fronteiras da seção «Sobre nós» são agora juntas retas.
          SIS-42, 2ª passada — SÃO SEIS, 4 claro↔escuro e as mesmas 2 claro↔claro: o
          chanfro de "Posicionamento" → "Escritórios" saiu a pedido. E a fronteira
          escuro↔escuro que a nota abaixo conta virou algo mais forte que uma junta
          seca: as duas seções pintam agora o MESMO degradê (o de `.sobre-metricas`),
          então não há junta nenhuma para tratar — é um campo só, medido na emenda.
          CONTAGEM CONFERIDA HOJE, a pedido em chat («entre os numeros … e
          RECONHECIMENTOS … retire isso»): o chanfro de `Metrics` →
          `RecognitionGallery` saiu, e sobravam DOIS `NotchDivider` VIVOS na rota —
          os dois de `#ffffff` em volta de «Modelos de atuação», isto é, justamente
          as 2 fronteiras claro↔claro do Modelo A. As claro↔escuro chegaram a
          ZERO. A contagem foi medida (stripping dos blocos de comentário e
          contagem das tags restantes), não estimada: as linhas de «SEIS/SETE/
          OITO» acima descrevem fronteiras de desenho e já estavam à frente do
          número de separadores realmente montados.
          SEGUNDO PEDIDO DO MESMO DIA — ZERO. Os dois claro↔claro também saíram
          («retire tambem a mesma coisa … entre Nossa Essência … e Modelos de
          atuação», «tambem … dessa sessao para Como Agimos»). NÃO EXISTE MAIS
          NENHUM `NotchDivider` MONTADO NESTA ROTA, e o `import` dele está
          comentado no alto do arquivo. Todo o mapa acima é agora registro
          histórico: ele diz onde as juntas ficavam e por quê, para quem precisar
          religar uma delas — nenhuma linha dele descreve o que a página renderiza
          hoje. Quem for reintroduzir um chanfro aqui tem de reler a regra da casa
          (o chanfro tem a cor do bloco que AVANÇA) em `ui/NotchDivider.tsx`, e não
          copiar uma cor daqui sem conferir o tom atual das duas seções — vários
          fundos desta rota mudaram depois que estas notas foram escritas.
          Fronteira escuro↔escuro:
          ZERO CHANFRADA — a página ganhou UMA (About → Posicionamento, pela faixa
          navy da SIS-280), e ela é junta seca, sem separador. O padrao real do resto
          da pagina segue escuro → claro alternando, porque
          entre "Como Agimos" e "Por que SISTRAN?" existem Metrics,
          RecognitionTheater e o bloco claro do ISG. (A outra escuro↔escuro do
          site esta na home, `page.tsx:179`.)

          Decisao por tipo:
          • claro ↔ escuro (8) — MANTEM o Modelo B (chanfro). O contraste é alto,
            o chanfro é identidade da marca aqui e dissolver navy em branco por
            gradiente pede uma faixa de ~200px de tom intermediario: é
            exatamente o remendo que a nota de `globals.css:7793` proibe
            ("remendo visivel é pior que o corte que ele tapa").
          • claro ↔ claro (2 — as duas em volta do `EssenceAccordion`, marcadas
            abaixo) — vira Modelo A. Ali o chanfro
            separa `#e4edf7` de `#ffffff` e `#ffffff` de `#f2f9fe`: tons quase
            iguais, entao o SVG é a UNICA coisa visivel na junta. Sem contraste
            para justificar corte, e sem risco de faixa intermediaria — a
            dissolucao é entre vizinhos.

          As duas linhas marcadas abaixo com "SIS-75: candidata a Modelo A" sao o
          escopo de implementacao; todas as outras estao marcadas "SIS-75: chanfro
          mantido por decisao" para nao serem removidas na proxima passada. */}
      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (hero navy → About).
          SIS-280: a cor deixou de ser `#ffffff`. O chanfro é da cor do bloco que
          AVANÇA, e o bloco que avança aqui é a área clara de «Sobre nós», que
          passou a pintar o próprio degradê azul-gelo do `docs/sobrenos.md` — a
          primeira parada dele é `#f7fcff`. Branco puro imprimiria uma seta 3 tons
          mais clara que a seção que ela anuncia.
          SIS-280 (2ª passada, a pedido): O CHANFRO SAIU — fica comentado, não
          apagado. Era a peça da captura do chat: uma cunha azul-clara de 48px com
          duas abas nos cantos, entre o fim do vídeo do hero e o começo da área
          clara. Com a capa agora terminando em navy chapado e a área clara abrindo
          direto, a junta é reta e de contraste alto — que é a fronteira que o
          desenho da marca já sabe fazer sem peça intermediária. Para religar:
          descomentar a linha.
          <NotchDivider cor="#f7fcff" invertido /> */}

      <div className="section-light">
        <About />
      </div>

      {/* Perfil & Posicionamento vem logo depois de "Sobre nós": é a leitura
          natural — primeiro quem a Sistran é, depois onde ela se posiciona. O
          bloco claro fecha aqui porque a secao é azul-marinho profundo.
          SIS-280: só a fronteira DE CIMA recebe chanfro. A de baixo não tem mais
          contraste para anunciar — o motivo está logo abaixo. */}
      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (About → Posicionamento).
          SIS-280: A PREMISSA CADUCOU e o chanfro SAIU — fica comentado, não apagado.
          A seção «Sobre nós» não termina mais em bloco claro: ela termina na FAIXA
          INSTITUCIONAL NAVY (`.sobre-metricas` fecha em `#0a3e70`), e o
          `PositioningEcosystem` abaixo abre no escuro da marca
          (`positioning-ecosystem.css:16`, `--palco-fundo`/`--palco-marca`). Ou seja,
          esta fronteira virou escuro↔escuro — o tipo que o mapa acima registrava
          como inexistente nesta página, e que a amenda da SIS-280 lá já anota.
          E aqui o `NotchDivider` não «muda de cor»: ele pinta UM `<path fill>`
          dentro de um SVG transparente (`ui/NotchDivider.tsx`), então o que sobra em
          volta da seta mostra o fundo da PÁGINA. Medido na captura
          `sis280-sobrenos-depois-1440-navy.png`: uma faixa clara de 48px cruzando
          dois campos navy — exatamente o «remendo visível pior que o corte que ele
          tapa» que a nota de `globals.css:7793` proíbe. Sem contraste entre os dois
          lados não há corte a anunciar, então a junta certa é junta nenhuma.
          Para religar: basta descomentar — mas antes devolver um bloco claro ao fim
          de «Sobre nós», senão o defeito volta com ele.
          <NotchDivider cor="#e4edf7" /> */}

      {/* SIS-42 — a revisão de 22/09 cancelou o escopo anterior desta seção: o
          «Perfil & posicionamento» deixa de ser remontado peça por peça em HTML
          (cabeçalho, trilhos, Venn de três círculos, ícones e as duas listagens)
          e passa a ser a ARTE `public/posicionamentoperfil.png` dentro de uma
          casca arredondada, na linguagem do «Fale com a Gente!» da home.

          `PositioningEcosystem` NÃO foi apagado — o arquivo dele e o
          `positioning-ecosystem.css` continuam inteiros, e o mount é este
          comentário. Para voltar ao ecossistema navegável: trocar a linha de
          baixo por `<PositioningEcosystem />` e recomentar esta nota. O import lá
          no topo também está comentado, por causa do lint de import não usado.
          O que a peça nova preserva de propósito: o `id="posicionamento"` (âncora
          do `ScrollSpy` e do menu lateral), o nome acessível pelo mesmo
          `posicionamento-titulo`, o navy de `--palco-fundo`/`--palco-marca` (as
          duas fronteiras vizinhas foram decididas contra ELE, acima nesta nota e
          no chanfro logo abaixo) e TODA a escrita de `src/data/posicionamento.ts`,
          agora como transcrição `sr-only` do que a arte desenha.
          <PositioningEcosystem /> */}
      <PerfilPosicionamentoArte />

      {/* SIS-42, 2ª passada — o chanfro daqui SAIU a pedido: «retire isso que tem
          entre essa sessão e os escritórios». Era `<NotchDivider cor="#ffffff"
          invertido />`, a fronteira escuro↔claro (Posicionamento → Escritórios),
          e a SIS-75 o mantinha «por decisão».

          Não é premissa caducada, é decisão de arte nova: com a seção do Perfil
          agora pintando o MESMO navy da faixa dos indicadores, a página desce em
          um único campo escuro contínuo desde «Sobre nós», e a seta branca de 48px
          cortava esse campo uma tela antes do bloco claro realmente começar —
          anunciava uma junta que o olho já lia como uma só descida.

          A junta virou reta: navy → `.section-light`, sem separador. Para religar:
          descomentar a linha abaixo. O mapa de fronteiras no topo deste arquivo foi
          emendado junto (são SEIS chanfros agora, não sete).
          <NotchDivider cor="#ffffff" invertido /> */}

      <div className="section-light">
        {/* Escritórios BRASIL */}
        {/* SIS-191 — `section-py` saiu apenas daqui. O espaçamento equivalente
            do modo lista passou para `.offices-section`; no modo scroll a cena
            já reserva, dentro do palco, a folga do header, e somar os 8rem do
            wrapper criava uma faixa clara vazia antes do primeiro quadro útil. */}
        <section aria-labelledby="escritorios" className="offices-section">
          {/* SIS-161 — O TITULO DESTA SECAO MUDOU DE CASA, e nao de palavras: ele
              agora é impresso DENTRO de `OfficesScene`, na coluna de leitura a
              esquerda do mapa, pelo mesmo `TituloAceso` com o mesmo `id` e o
              mesmo texto. Foi a composicao de uma tela que pediu isso — titulo
              fora e mapa dentro dariam dois blocos empilhados, e a referencia tem
              titulo e mapa lado a lado.
              O `aria-labelledby` acima continua resolvendo porque o `id`
              `escritorios` continua existindo, só que um nivel mais para dentro.

          <div className="container-lp">
            <TituloAceso
              id="escritorios"
              texto="Escritórios"
              destaque="BRASIL"
              className="font-display text-section text-ink"
            />
          </div>
          */}
          {/* Mapa e fotos dos escritorios, Pato Branco e Sao Paulo, com as
              descricoes que o site ja tinha. O Rio de Janeiro saiu da cena por
              ora — continua no rodape e na pagina de contato.
              Fica fora do container de proposito: em telas largas a cena toma a
              largura inteira da janela. Em tela estreita ela volta a ser lista, e
              por isso ela mesma reaplica a margem lateral.
              SIS-169 — "telas largas" passou a querer dizer 1280px e 760px de
              altura: abaixo de qualquer um dos dois o percurso nao cabe e a cena é
              lista. A conta esta no `matchMedia` de `OfficesScene.tsx`. */}
          <OfficesScene />
        </section>

        {/* Tecnologias. Pinta o proprio fundo (agora CLARO: o degrade azul-gelo
            `#F8FCFF` → `#EEF8FF` → `#E5F4FF` que `docs/tecnologia.md` exige, no
            lugar do azul-marinho que a SIS-280 apontou como divergencia do mock)
            e sangra na largura inteira, entao entra sem `container-lp` e sem
            NotchDivider — este ultimo nao pode viver dentro de `.section-light`,
            que tem `isolation: isolate`.

            SIS-280 — o componente montado aqui deixou de ser
            `TechnologyShowcase` e passou a ser `TechnologiesSection`
            (`src/components/tecnologias/`). O anterior continua no repositorio
            sem consumidor, como o `BuildingShowcase` logo abaixo: religar seria
            trocar a linha de volta, mas ele carrega justamente o que a issue
            rejeita (fundo navy, titulo textual "Tecnologias", palco de sete
            itens, setas e barra de progresso). */}
        <TechnologiesSection />

        {/* SIS-69: o explorador 3D 360° (cartao azul com "01 Torre River Park" /
            "02 Complexo Modular", bussola de vistas, "35+ Anos de mercado") saiu
            da pagina a pedido. `BuildingShowcase` continua no repositorio, sem
            consumidor — para religar, basta reimportar e devolver aqui:

              <section aria-label="Explorador arquitetônico 360°" className="section-py pt-0">
                <div className="container-lp"><BuildingShowcase /></div>
              </section>

            SIS-161 — A TORRE TAMBEM SAIU. O paragrafo que estava aqui dizia que
            `OfficesScene` montava o mesmo `BuildingExplorer` no trecho de Sao
            Paulo com o 2º andar marcado, e que por isso "o `three` agora tem um
            consumidor em vez de dois". As duas frases ficaram falsas quando a
            cena virou uma tela só: sem percurso de rolagem nao havia trecho
            final, e a torre passou a estar comentada dentro de
            `OfficesScene.tsx`, com o motivo escrito la.

            SIS-169 — E O PERCURSO VOLTOU, mas isto NAO reabilita o WebGL. A cena
            é outra vez presa (`sticky`) com um trecho esfregado de transito, entao
            a frase acima sobre "nao ha trecho final" deixou de valer como estado
            atual — fica registrada porque é a razao de a torre 3D ter saido. O que
            ocupa o trecho final hoje é a IMAGEM da torre, como a SIS-163 deixou:
            `BuildingExplorer` continua intacto e sem nenhum consumidor, e `three`
            continua fora do que esta rota baixa.
            O que isso quer dizer para esta rota: `BuildingExplorer` esta INTACTO
            no repositorio e sem NENHUM consumidor — os dois entravam por
            `dynamic()`, entao `three` e `OrbitControls` deixaram de ser baixados
            aqui. Nao ha mais nem a disputa de "só uma delas desenha por vez", nem
            uma delas desenhando.

            SIS-163 — E CONTINUA SEM CONSUMIDOR, mesmo com a torre de volta na
            tela. A cena voltou a mostrar o predio de Sao Paulo, mas como IMAGEM
            (`/images/escritorios/torre-sp-*.webp`), nao como WebGL: `three` e
            `OrbitControls` seguem fora do pacote desta rota, e `BuildingExplorer`
            e `BuildingShowcase` seguem os dois intactos e sem ninguem que os
            importe. Vale registrar porque a frase acima — "sem NENHUM consumidor"
            — parece contradita por quem ve a torre na pagina, e nao esta. */}
        {/* Diferenciais — os 6 itens, so titulo, como no site.
            23/09 — A SEÇÃO SAIU DESTE ARQUIVO e virou `DiferenciaisSeis`. Mudou de
            casa porque passou a ter fundo próprio: o pedido é que ela continue o
            azul-gelo de Tecnologias, logo acima, e continuidade de degradê é coisa
            que se mede na emenda — não cabe inline. O JSX que estava aqui, e o que
            cada peça dele virou, ficam registrados:

              <section aria-labelledby="diferenciais-6" className="section-py">
                <div className="container-lp">
                  <TituloAceso id="diferenciais-6" texto="Diferenciais"
                    className="font-display text-section text-ink" />
                  <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {DIFERENCIAIS_6.map((d, i) => (
                      <ScrollReveal as="li" indice={i} key={d}
                        className="glass-card notch-card barra-sinal p-6 font-display text-base leading-snug text-ink">
                        {d}
                      </ScrollReveal>
                    ))}
                  </ul>
                </div>
              </section>

            O título, a lista `ul`/`li`, o `aria-labelledby`, o `id` e a cascata do
            `ScrollReveal` são os MESMOS no componente — nada de semântica mudou.
            O que mudou é o cartão: chanfro e vidro escuro saíram para dar lugar ao
            canto arredondado com sombra e ao selo do ícone que o pedido descreve
            (o porquê de cada remoção está no docblock de `DiferenciaisSeis.tsx`).
            Note o `key={d}` acima: a lista deixou de ser de strings, então lá ele
            é `key={d.texto}`. */}
        <DiferenciaisSeis />

      </div>

      {/* 23/09 — «Entrega com Alta Performance e Comprometimento» SAIU DE CENA, e
          com ela o chanfro que vinha depois. Pedido direto: «retire essa sessao
          inteira» (a seção) «entre essa sessao e a proxima isso» (o chanfro).

          O QUE ERA. As duas montagens vinham cada uma com a sua nota, e o texto
          delas está reproduzido abaixo SEM os delimitadores de comentário: um
          `*` seguido de `/` aqui dentro fecharia este bloco no meio da frase, que
          foi o defeito que esta linha existe para não repetir.

            NOTA DA SEÇÃO — Bloco claro proprio, e nao o mesmo dos
                Escritorios/Diferenciais acima. O fundo de `.section-light` é um
                radial (`--claro-base`) resolvido contra a altura da caixa: num
                bloco de ~6.500px ele clareia o meio e termina antes do fim, e o
                que aparece embaixo é o azul do `body`. Esta secao era a ultima do
                bloco, ou seja, caia justamente fora do claro — era por isso que o
                titulo `text-ink` (navy) ficava navy sobre azul e quase invisivel.
                Com um bloco proprio o radial é resolvido contra a altura DESTA
                secao e a superficie volta a ser clara.

            <div className="section-light">
              <Differentials />
            </div>

            NOTA DO CHANFRO — SIS-75: candidata a Modelo A, claro↔claro
                (`#e4edf7` → branco do EssenceAccordion). O chanfro aqui é a unica
                coisa visivel na junta.

            <NotchDivider cor="#e4edf7" />

          O `.section-light` saiu JUNTO com a seção, e não fica órfão: ele existia
          só para dar superfície clara a esta seção — era essa a conta do
          comentário acima. Uma `div` vazia com `.section-light` ainda resolveria o
          radial contra a própria altura e pintaria uma faixa clara de nada.

          O CHANFRO SAIU E NÃO FOI SUBSTITUÍDO, e é isto que o pedido mostra na
          segunda imagem: `NotchDivider` pinta UM `<path fill>` dentro de um SVG
          transparente, então os dois cantos que o caminho recua ficam vazados e
          quem aparece por eles é o azul do `body` — as duas cunhas azuis
          apontando para dentro. Sem a seção que avançava, `#e4edf7` não era mais a
          cor de bloco nenhum: o chanfro pintaria uma cor que deixou de existir na
          página, o que é pior que junta reta.

          `Differentials.tsx` continua INTACTO no repositório, e agora sem nenhum
          consumidor — na home ele já estava comentado (`src/app/page.tsx:9`). O
          import ficou comentado no alto deste arquivo, com a razão.
          O ScrollSpy não perde nada: a lista de `/quem-somos` aponta para
          `diferenciais-6` (`DiferenciaisSeis`, que FICA), e nunca para o
          `id="diferenciais"` desta seção — `pageSections.ts:27-30` registra que
          âncora inexistente foi justamente o defeito que tirou `diferenciais` da
          lista antiga. */}

      {/* Missão · Valores · Pilares.
          Os tres cartoes escuros de largura igual viraram um accordion editorial
          de fundo branco: os conteudos tem tamanhos muito diferentes (um
          paragrafo, uma linha, seis frases), e em tres colunas iguais isso
          deixava duas quase vazias. Os textos sao os mesmos, agora em
          `src/data/essencia.ts`.

          SIS-260 — O ACCORDION SAIU DE CENA. A linha anterior era:

            <EssenceAccordion />

          e o import correspondente, no alto do arquivo. A issue pede a composição
          da mock `public/ms.png`, especificada em `docs/missao,valores.md`: fundo
          claro, navegação vertical à esquerda, UM painel navy pregado à direita e
          o conteúdo trocando dentro dele conforme a rolagem. Não é o mesmo
          desenho com outro acabamento — no accordion o painel nasce e morre a cada
          faixa, e a spec exige o contrário («o painel não deve desaparecer entre
          os estados»).

          `EssenceAccordion.tsx`, `essence-accordion.css` e `ui/EssenceHologram`
          continuam no repositório e intactos: são ~35 kB de mecanismo medido (a
          âncora de rolagem manual do SIS-98, a troca por cabeçalho que corrigiu o
          SIS-79) que não cabe em comentário e que volta a valer se a decisão de
          arte voltar atrás. O que esta issue reverte é a MONTAGEM, e é aqui que
          ela está escrita. Os textos seguem em `src/data/essencia.ts`, a mesma
          fonte única de antes — o que mudou ali foram as artes e as etiquetas. */}
      <NossaEssenciaSection />

      {/* O CHANFRO ENTRE «NOSSA ESSÊNCIA» E «MODELOS DE ATUAÇÃO» SAIU, a pedido em
          chat («retire tambem a mesma coisa que foi feito anteriormente entre
          Nossa Essência … Pilares … e Modelos de atuação»), na mesma passada em
          que saiu o de `Metrics` → Reconhecimentos. Era:

              <NotchDivider cor="#ffffff" invertido />

          e a razão de existir era esta: «SIS-99: era `#f2f9fe`, o azul-gelo da
          Abordagem. Os Modelos de atuação nasceram em fundo branco, e o chanfro é
          da cor do bloco que avança — logo, branco sobre branco: a junta some, o
          que é o certo aqui.»

          Note que essa nota já registrava que a peça era INVISÍVEL por desenho
          (branco sobre branco): ela era uma das duas fronteiras claro↔claro do
          «Modelo A» da SIS-75, onde o SVG era a única coisa a se ver na junta.
          Retirá-la não muda tom nenhum — tira do caminho os 48px de altura que o
          separador reservava. Medido em
          `docs/medidas/junta-essencia-modelos-agimos.json`: vão 0px, nenhuma linha
          fora do claro na emenda, e respiro de 200px a 1440 / 152px a 768 / 120px
          a 390 — o `section-py` das duas seções paga o ar sozinho. Para religar,
          basta descomentar a linha acima. */}

      {/* Modelos de atuação (SIS-99).
          Era "Abordagem de projetos": quatro `glass-card` numerados de 01 a 04
          dentro de uma `<ol>`. A numeração dizia que havia ordem, e não há —
          Consultoria não vem antes de Outsourcing. Agora são quatro modelos de
          engajamento em órbita de um núcleo, sem início nem fim. O título é o
          mesmo, palavra por palavra.

          A sobreposição do SIS-77 saiu junto: `vaza-fonte`/`vaza-cartoes`
          existiam para os cartões numerados atravessarem o chanfro, e o
          `num-monumental` que justificava aquela escolha não existe mais nesta
          seção. Sem ela, `recebe-vazamento` em "Como Agimos" abaixo passaria a
          reservar um respiro que ninguém ocupa — por isso ele também saiu. A
          outra fronteira com vazamento na página continua intacta. */}
      {/* SIS-165 (29/09) — TROCA DE COMPOSIÇÃO, por pedido: «refazer mais parecido
          com a imagem 1 — série horizontal de anéis, não cards soltos / não
          bilhete». A órbita elíptica (hub manuscrito, quatro estações em
          quadrante, rodízio de destaque, painel `role="status"`) sai da rota
          inteira: a geometria dela é de quadrante e um fluxo em linha não tem
          quadrante. Ela NÃO foi apagada — `CircularEngagementModel.tsx` e
          `circular-engagement-model.css` continuam no repositório, íntegros, e
          religar é descomentar a linha abaixo e o import no topo deste arquivo:

              <CircularEngagementModel />

          O que muda aqui é só quem monta. As notas do SIS-99/SIS-77 acima seguem
          valendo: a numeração 01..04 não voltou, e o vazamento continua fora. */}
      <ModelosFluxo />

      {/* O CHANFRO ENTRE «MODELOS DE ATUAÇÃO» E «COMO AGIMOS» SAIU, pelo mesmo
          pedido e na mesma passada («tambem deve ser e dessa sessao para Como
          Agimos / Nossos valores são a base da nossa cultura organizacional»).
          Era:

              <NotchDivider cor="#ffffff" />

          com a nota: «SIS-75: chanfro mantido por decisao — claro↔escuro (Modelos
          → Como Agimos). SIS-99: a cor acompanha o fundo branco da seção que
          avança.»

          A etiqueta «claro↔escuro» da SIS-75 está CERTA, e medi-la evitou eu
          escrever o contrário aqui: `ComoAgimos` abre ESCURA (azul), e a sonda
          conta 13 das 25 linhas abaixo da emenda em tom escuro nas três larguras.
          Quem era branco era só o SEPARADOR — a cor do bloco que avança, pela
          regra da casa, seria a da seção de baixo, e a SIS-99 tinha posto branco
          por causa do fundo dos Modelos, que é o bloco de CIMA. Ou seja: a peça
          que saiu era uma cunha branca descendo sobre o azul. Com ela fora, a
          junta é um corte reto branco→azul, de alto contraste, que é a fronteira
          que o desenho da marca faz sem peça intermediária (o mesmo movimento da
          junta `Metrics` → Reconhecimentos, nesta mesma passada).
          Medido em `docs/medidas/junta-essencia-modelos-agimos.json`: vão 0px,
          degrau sem faixa de meio-tom, respiro de 128px a 1440 / 112px a 768 /
          80px a 390. Para religar, basta descomentar a linha acima.

          CONSEQUÊNCIA PARA O MAPA DE FRONTEIRAS no alto do arquivo: eram estes os
          dois últimos `NotchDivider` montados na rota. A página fica SEM NENHUM
          chanfro — o mapa da SIS-75 passa a descrever só história. */}

      {/* Como Agimos — a seção virou `ComoAgimos`: o carimbo
          `carimbo-agimos-ticket-outline-ffffff.png` como `<h2>` (a arte já traz
          escrito «COMO / Agimos», então manter um `TituloAceso` daria o nome da
          seção duas vezes), a primeira frase à mão na tipografia de
          `docs/fonte2.md`, e os oito valores como os oito talões de um bilhete
          picotado em vez de oito cartões de vidro. O `<h2 id="como-agimos">` mudou
          de casa mas continua sendo `h2` com o mesmo texto acessível, agora pelo
          `alt`, então `aria-labelledby` e o ScrollSpy seguem resolvendo — é o mesmo
          movimento que a SIS-87 fez com o logo da ISG nesta página. O motivo de
          cada peça que saiu de cena está no docblock do componente, junto do JSX
          antigo comentado. */}
      <ComoAgimos />

      {/* SIS-165 (29/09) — OS NÚMEROS DESTA ROTA PASSAM A SER A FAIXA DA HOME.
          Era:

              <Metrics />

          O nó abaixo é CÓPIA LITERAL do da home (`src/app/page.tsx:300`) nas três
          props, e é isso que cumpre «lê como a home»: mesmo componente, mesmo
          conjunto, mesma escala. Nada de layout se escreve aqui.

          `fonte="metricas"` troca os três indicadores pelos sete. A escrita sai de
          `src/data/metrics.ts` DENTRO do componente — nenhum dos sete rótulos é
          escrito nesta página, que é o que mantém a fonte única do item 2 e o
          copy-lock calado (uma segunda cópia fora de `src/data/` entraria no
          relatório como sete textos novos).

          `sobre-metricas--sete` é só ESCALA (número, ícone, recuo, e a régua que
          muda de lugar quando os sete caem em 4+3 abaixo de 90rem).

          `aresta={false}` pelo mesmo motivo GEOMÉTRICO da home, e repare que ele
          vale aqui apesar de estarmos em `/quem-somos`: o degrau em `clip-path` e
          os três pontos ciano acompanham a coluna da foto da faixa do About
          (`sobre-nos.css:454`), e acima DESTE nó não há foto — acima há
          «Como Agimos». Os 22px vazados abririam um talho sem origem sobre o azul
          dela. A faixa do About continua com `aresta` no default, onde a foto
          existe.

          ⚠️ PARIDADE DE SEÇÕES PRESERVADA: `Metrics` tinha uma `<section>` na
          raiz, e a `<section>` abaixo entra no lugar dela — uma por uma. Trocar
          por um nó sem `<section>` mudaria a contagem de `main > section:nth-of-type(even)`
          e viraria o fundo de tudo o que vem depois nesta `main` (foi assim que
          «Por que SISTRAN?» apagou uma vez; ver a nota em `globals.css`).

          SEM `id="resultados"`. O `id` era do `Metrics` (`Metrics.tsx:807`) e nesta
          rota ninguém o consome: a lista de `/quem-somos` em
          `src/data/pageSections.ts:125` não tem a parada `resultados` (ela é da
          home, e lá a `<section>` já a declara à mão). Declarar um `id` aqui seria
          inventar âncora — o item 5 da issue condiciona a preservação a «se a
          âncora existir nesta rota». O `aria-label` fica, porque a região continua
          precisando de nome acessível, e é o mesmo texto que o `Metrics` usava
          (`Metrics.tsx:818`), não escrita nova.

          EMENDA DE ENTRADA: o `Metrics` abria em FAIXA CLARA e trazia a
          `.impact-emenda` — um degradê de navy na borda de cima — exatamente para
          tratar o degrau escuro→claro contra a seção anterior. Com a faixa navy a
          emenda deixa de ter o que tratar: `.agimos-secao` fecha em `#063d73`
          (`como-agimos.css:507`) e a faixa abre em `#041d37`, escuro→escuro. Não é
          perda de peça, é uma junta que deixou de existir.

          EMENDA DE SAÍDA: inalterada. O que vem depois continua sendo o papel
          claro da galeria, e a faixa continua fechando em navy — é a mesma junta
          reta que o comentário abaixo descreve, com a mesma cor de cima. */}
      <section aria-label="Sistran em números">
        <FaixaIndicadores
          aresta={false}
          fonte="metricas"
          className="sobre-metricas--avulsa sobre-metricas--sete"
        />
      </section>

      {/* O CHANFRO ENTRE OS NÚMEROS E RECONHECIMENTOS SAIU, a pedido em chat
          («na pagina /quem-somos entre os numeros … e RECONHECIMENTOS … retire
          isso», com a captura da faixa). Era:

              <NotchDivider cor="#f7fbfe" invertido />

          e a razão de existir, do dia anterior, era esta:

          «SIS-238 — A SEÇÃO INVERTEU DE TOM, E POR ISSO GANHOU CHANFRO AQUI.
           Reconhecimentos era uma seção ESCURA e nascia direto no navy da rota,
           encostada em `Metrics` sem nenhuma junta. A galeria é CLARA (papel
           `#f7fbfe`), então o limite Metrics → Reconhecimentos passou a ser um
           corte navy↔claro sem tratamento. A regra da casa é que o chanfro tem a
           cor do bloco que AVANÇA: aqui quem avança é a galeria, vinda de baixo —
           logo `cor` é o papel dela e `invertido`, que enche a base e recua os
           cantos do topo, deixando o navy de cima aparecer nas duas cunhas.»

          ⚠️ SIS-165 (29/09) — «navy de `Metrics`» abaixo passou a ser HISTÓRIA: quem
          está acima desta junta agora é a faixa dos sete (ver o comentário da
          montagem). A conclusão não muda, e é por isso que ela fica: a faixa
          fecha em navy pelo mesmo `background` de `sobre-nos.css:477`, então o
          degrau que esta nota descreve continua sendo navy↔papel, com a mesma cor
          em cima. Só o nome de quem a pinta é outro.

          A junta volta a ser RETA: navy de `Metrics` direto no papel da galeria,
          o mesmo movimento que a junta «essa sessão → escritórios» já tinha feito
          nesta rota (ver o comentário acima, «A junta virou reta»). Não fica vão
          nem faixa de cor intermediária — medido em
          `docs/medidas/junta-metrics-reconhecimentos.json`. Para religar, basta
          descomentar a linha acima no lugar onde ela estava. */}

      {/* Premiações, Certificações e Reconhecimentos — SIS-238 (24/09).
          A seção virou `RecognitionGallery`, a composição da mock
          `public/imagensexemplo/trofeis.png`: cabeçalho editorial à esquerda com
          o decorativo «NOSSA TRAJETÓRIA» em contorno à direita, e abaixo uma
          faixa de quatro painéis verticais encostados — um aberto em ~50% da
          largura, três fechados dividindo o resto — que troca de painel por
          rolagem, hover, clique e teclado.

          O «Teatro de Reconhecimentos» saiu INTEIRO. A issue foi reaberta hoje
          com o corpo reescrito e nomeia um por um o que tinha de desaparecer:
          menu lateral, numeração, o «12» monumental, as linhas de ligação, o
          cartão central arredondado, os cartões empilhados, a coluna de
          miniaturas, as setas, a paginação e a aparência de dashboard. Ela
          também declara a entrega anterior desta MESMA issue — a capa Celent, de
          11/09 — «supersedida por esta galeria», e é por isso que `REC_CELENT`
          deixa a tela junto: não é perda silenciosa, é o que a issue pede por
          escrito. O componente e o CSS do teatro continuam intactos no
          repositório e agora sem nenhum consumidor; 531 + 1873 linhas não cabem
          em comentário, então o que se comenta é a montagem e o import, como já
          foi feito com `EssenceAccordion` e com `Differentials` nesta rota.

          O `<h2 id="premiacoes">` mudou de casa mas continua sendo `h2`, com
          `id` e `aria-labelledby` iguais — só o texto é outro, o da issue. O
          ScrollSpy (`src/data/pageSections.ts`) segue resolvendo.

          A `PREMIACOES_NOTAS` foi PARA DENTRO do componente. Ela não é texto novo
          e não estava na especificação: é a nota que já vivia aqui, e apagá-la
          seria perda de conteúdo que ninguém pediu. Mudou só a cor — era
          `text-white/85` sobre seção escura e agora é tinta navy sobre papel. */}
      <RecognitionGallery />

      {/* SIS-177 — A FAIXA CELENT, entre Premiações e ISG, no arranjo de
          `docs/celen.md` + `public/exemplocele.png`.
          ⚠️ TERCEIRA PASSADA, E ELA DESFAZ AS DUAS PRIMEIRAS. O que estava na tela
          era a arte como FUNDO da seção com a tipografia por cima — exatamente o
          defeito que `docs/celen.md` abre descrevendo e fecha proibindo por nome
          («Não utilizar a imagem como fundo de toda a seção»). Entrou no lugar uma
          composição editorial de duas colunas: texto à esquerda (40%), `cele.png`
          como ELEMENTO (`next/image`) dentro de moldura própria à direita (60%),
          nenhum texto da página sobre a imagem. O CSS do arranjo antigo, com as
          medidas que o justificavam, está comentado no fim de
          `src/components/celent-spotlight.css`.
          Seção PRÓPRIA, como a issue manda («não embutir de novo na galeria»): a
          galeria acima não foi redesenhada e o ISG abaixo não foi tocado. A única
          mudança fora deste nó é a que o aceite exige — `REC_GAL_TOP5` saiu da
          galeria, porque virou o título desta faixa e a frase tem de aparecer uma
          vez só na rota.
          SEM item novo em `src/data/pageSections.ts`: é o default escrito na issue
          («considerar entrada no ScrollSpy só se a usuária pedir»). O `h2` existe e
          é o `aria-labelledby` da seção, então ela entra no sumário do documento
          mesmo sem estar no navegador lateral.
          O MARCADOR LATERAL «PREMIAÇÕES» não é remontado: ele já existe como
          parada `{ id: 'premiacoes' }` em `src/data/pageSections.ts:142`, da galeria
          acima, e o documento manda preservá-lo sem duplicá-lo no conteúdo.
          OS TRÊS ARQUIVOS, com os papéis que `docs/celen.md` fechou:
          `public/cele.png` é a ARTE da coluna direita, `public/exemplocele.png` é só
          REFERÊNCIA DE LAYOUT — não está em nenhum `src` — e
          `public/logo-Celent.png` é a marca do bloco de premiação, que já traz
          «CELENT» e «Technology Standout 2023» desenhados (daí não haver tipografia
          HTML repetindo as palavras: o documento proíbe duplicar a logo).
          A ÚNICA escrita nova é o eyebrow «RECONHECIMENTO INTERNACIONAL», em
          `src/data/reconhecimentos.ts` (`REC_CELENT_EYEBROW`).
          A troca do PNG pela WebP de 81 KB que a passada anterior fez está DESFEITA:
          a issue reaberta nomeia `cele.png` no corpo e no aceite. O custo medido da
          volta (1.495.225 B contra 81.054 B, com `images.unoptimized` ligado) e a
          linha que a refaz estão no docblock do componente, junto com o motivo de
          cada escolha — a proporção 1672/941 da moldura (que é o que impede `cover`
          de recortar o balão), a máscara no nó de dentro em vez de na moldura, e a
          divergência de um caractere entre `docs/celen.md` e `REC_CELENT.linha2`. */}
      <CelentSpotlight />

      {/* SIS-238 — O CHANFRO QUE HAVIA AQUI SAIU, E NÃO FOI SUBSTITUÍDO.
          Era `<NotchDivider cor="#f7fbff" invertido />`, escolhido pela SIS-75 e
          retocado pela SIS-87 para um limite escuro↔claro: Reconhecimentos era
          navy e ISG é `#f7fbff`. Agora as duas seções são claras e praticamente
          da mesma cor — `#f7fbfe` acima contra `#f7fbff` abaixo, um de diferença
          em um canal. Não há degrau para esconder.
          E manter o chanfro seria PIOR que inútil. O `path` invertido enche a
          base e recua os dois cantos do topo, deixando-os vazados para o `body`
          aparecer — que nesta rota é navy. Com navy acima isso era invisível;
          com papel acima as duas cunhas escuras apareceriam do nada entre duas
          seções claras. É exatamente o artefato que a remoção do chanfro de
          «Entrega com Alta Performance» eliminou em 23/09, e reintroduzi-lo aqui
          desfaria aquela correção.
          A nota da SIS-87 fica registrada, com a premissa dela que caducou:
          a COR mudou de `#f2f9fe` para `#f7fbff` porque o chanfro imita o topo da
          seção seguinte, e ISG deixou de usar a base de `.section-light-blue`
          (que começava em `#f2f9fe`) para usar o fundo que `docs/isg.md`
          prescreve — `#f7fbff` com duas manchas radiais fraquíssimas. Sem
          retocar, a ponta do chanfro ficaria 5 de RGB mais escura que o que vem
          abaixo dela. Se Reconhecimentos algum dia voltar a ser escura, é este
          o valor a religar. */}

      {/* ISG Provider Lens — SIS-87: a seção virou `IsgProviderLens`, a composição
          da mock `public/isg.png` (fotografia + selo à esquerda; sobretítulo, logo
          oficial, dois diferenciais, comentário do analista e créditos à direita).
          O `<h2 id="isg">` mudou de casa e agora é o logo, com `alt="ISG Provider
          Lens"`, então `aria-labelledby="isg"` continua resolvendo para a mesma
          frase. O motivo de cada troca está no docblock do componente.
          O JSX antigo fica abaixo, comentado: eram três `blockquote.glass-card`
          sobre um `TituloAceso`, o que o critério de aceite da issue proíbe em
          duas linhas («não 3 cards glass» e logo nunca em tipografia HTML).
          Nenhum texto foi perdido — os três de `ISG` e o crédito do reprint
          seguem na tela, os dois últimos agora vindos de `ISG_CREDITOS`. */}
      <IsgProviderLens />

      {/* SIS-77 — ISG era a 2ª candidata do issue e foi DESCARTADA por estrutura,
          não por gosto: a grade de citações não é o último item da seção — a nota
          do reprint ISG vem depois dela. Margem negativa na grade encurta a seção
          e sobe a nota 5rem, em cima dos cartões. Para a citação atravessar, a
          nota teria de atravessar junto, e letra miúda de crédito saindo para
          dentro do bloco escuro é ruído, não ênfase.
          A 2ª fronteira virou "Conheça também" → "Fale com a Gente!", onde a
          grade É o último item. */}
      {/* SIS-87 — O BLOCO ANTIGO DE ISG, comentado e não apagado. Os comentários
          internos viraram prosa porque `*(/)` aninhado fecharia este bloco antes
          da hora. Fica aqui como registro da forma que a issue substituiu:

      <section aria-labelledby="isg" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <TituloAceso
            id="isg"
            texto="ISG Provider Lens"
            className="font-display text-section text-ink"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            (O Reveal envolvia a citacao em vez de substituir a tag: o blockquote
            é semantica do conteudo e continuava no lugar — no componente novo
            essa mesma regra vale, e é por ela que existe a casca da citação.)
            {ISG.map((i, ordem) => (
              <ScrollReveal indice={ordem} key={i.term}>
                <blockquote className="glass-card notch-card barra-sinal h-full p-7">
                  <p className="font-display text-base text-ink">{i.term}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    &ldquo;{i.quote}&rdquo;
                  </p>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-faint">
            (*) ISG —{' '}
            <a href="https://isg-one.com/index/isg-index" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Consultores Globais em Gestão de Outsourcing
            </a>
            . Reprint autorizado por ISG Provider Lens ©, Brasil.
          </p>
        </div>
      </section>

      */}

      {/* 24/09 — o chanfro entre ISG e «Por que SISTRAN?» saiu a pedido.
          Era `<NotchDivider cor="#f7fbff" />`: uma faixa clara de 48px avançando
          sobre o navy. A transição agora é direta, sem a peça intermediária que
          aparecia como uma sobra branca/azul entre as duas seções. */}

      {/* Por que SISTRAN? — SIS-199 levou a seção para `PorQueSistran.tsx`, junto com
          o negrito do destaque, os cards flutuantes e o medalhão 3D. O JSX que estava
          aqui ficou comentado ao pé daquele arquivo, com o motivo de cada peça que saiu
          de cena. A POSIÇÃO no `main` é a mesma de antes, e é o que mantém o navy: o
          fundo desta seção vem da alternância de paridade entre irmãs. */}
      <PorQueSistran />

      {/* O CHANFRO SAIU DAQUI (pedido: «tire esse pedaço que ficou sobrando»). Era:

            (comentário «SIS-75: chanfro mantido por decisao — escuro↔claro
             (Por que SISTRAN? → Conheca tambem)», que não pode ser reproduzido
             fechado aqui dentro sem encerrar este bloco)
            <NotchDivider cor="#f2f9fe" invertido />

          POR QUE ELE LIA COMO SOBRA, E NÃO COMO CHANFRO. `invertido` desenha
          `M0 48H1440V26L1344 0H96L0 26Z`: a base é cheia de ponta a ponta e o topo
          só recua nos 96px de cada canto. Medido a 1440: 48px de altura, e o topo
          plano por 1248px dos 1440 — ou seja 87% da largura é uma FAIXA reta de
          `#f2f9fe` sobre o navy, com dois biseis minúsculos nas pontas. Lido na
          tela isso não é uma seta entrando na seção escura, é uma tira clara
          esquecida entre os dois blocos, e a captura mostrava exatamente isso.

          O QUE COSTURA A FRONTEIRA SEM ELE: a seção de baixo é
          `section-light section-light-blue`, que traz a emenda da SIS-93
          (`box-shadow: 0 0 54px 18px rgb(227 241 251 / 45%)`) — espalha o próprio
          azul-gelo ~54px para fora e dissolve o corte contra o navy. Foi inventada
          para «bloco claro sobre o navy da página», que é este caso; é também o que
          já segura a junta seguinte, onde o chanfro caiu na SIS-268 pelo mesmo tipo
          de razão. Os outros cinco chanfros da página não foram tocados: os que
          ficam cortam contra fundos CHAPADOS (`#f7fbff`, por exemplo), onde a seta
          coincide com a cor do bloco inteiro e por isso não sobra tira nenhuma. */}

      {/* Caminho para as outras duas paginas do submenu "Quem somos". */}
      {/* SIS-77 — 2ª e última fronteira com sobreposição: os dois cartões de
          "Conheça também" descem para dentro do bloco de "Fale com a Gente!".
          A técnica exige que quem leva `vaza-cartoes` seja o ÚLTIMO item da seção
          (ver a nota do bloco `.vaza-*` no `globals.css`) — margem negativa no meio
          da pilha puxaria os irmãos de baixo para cima de quem vaza.
          SIS-253 — e por isso a classe SAIU DA GRADE e passou ao invólucro que
          embrulha a grade MAIS a pílula do molde Match AI. A grade deixou de ser o
          último item quando a pílula entrou; com `vaza-cartoes` nela, os −5rem
          teriam subido a pílula por cima dos cartões. No invólucro, o que atravessa
          a fronteira continua sendo a tinta mais baixa da seção, que é o que a
          técnica quer, e os dois valores dos dois lados da emenda não foram tocados.
          SIS-268 — «para dentro do CARTÃO AZUL» era a frase, e ela caducou: o fecho
          virou o desenho da referência, que é um campo CLARO com painel de vidro, e
          a saliência agora cai no `padding-top` desse campo. A técnica é a mesma e
          estas duas classes não foram tocadas; o que mudou é o que está embaixo. */}
      {/* O VAZAMENTO SAIU (pedido: o bloco «Fale com a Gente!» «ficou cortada nessa
          sessao»). A classe da seção era:

            className="vaza-fonte section-py section-light section-light-blue"

          O QUE `vaza-fonte` FAZ, e por que era ele o corte. A regra em
          `globals.css:10352` zera o `padding-bottom` desta seção e `vaza-cartoes`
          aplica `margin-bottom: -5rem` no invólucro dos cartões: os cartões descem
          80px para dentro do bloco de baixo. Como a SIS-268 registrou, quem absorve
          esses 80px é o `padding-top` do próprio `.cta-ref` (8rem = 128px a partir de
          1024px) — não há sobreposição, mas sobram 48px. Medido a 1440: o topo do
          `.cta-ref` cai em y=20911 e o topo do painel de vidro em y=20959, 48px de
          respiro, contra os 128px que o MESMO componente tem em `/esg` (medido na
          mesma sonda: geometria interna idêntica pixel a pixel nas duas rotas, o que
          muda é só o que lhe come o respiro de cima). O painel encostando na borda de
          cima do campo claro é o que se vê como faixa cortada — o defeito não está
          dentro do `ContactCTA`, está no que ocupa o respiro dele.

          POR QUE REMOVER O VAZAMENTO E NÃO REPOR O RESPIRO. Somar 5rem ao `.cta-ref`
          só nesta rota seria mexer num componente que fecha outras nove páginas, ou
          ressuscitar o `div.recebe-vazamento` que a SIS-268 derrubou (e cuja nota
          explica por que ele reaparece como faixa de fundo exposto). A saliência
          existia para fazer os cartões avançarem sobre um bloco ESCURO; hoje os dois
          lados da junta são a mesma família de azul-gelo, então ela não cria mais
          contraste nenhum — só consome o respiro do bloco de baixo. As regras
          `.vaza-fonte`/`.vaza-cartoes` do `globals.css` NÃO foram tocadas: continuam
          valendo para quem tiver escuro embaixo.

          O `pt` MENOR é o outro pedido da mesma captura (o vão claro vazio acima do
          título). `section-py` dá `py-32` = 128px no desktop, e com o chanfro de 48px
          que saiu acima eram 176px de nada antes de «Conheça também». As utilitárias
          de `pt` vencem `.section-py` sem `!important` porque ela vive em
          `@layer components` (`globals.css:543`) e camada perde para `@layer
          utilities`. A base de baixo segue a da casa. */}
      <section
        aria-labelledby="mais-quem-somos"
        className="section-py section-light section-light-blue pt-12 md:pt-14 lg:pt-16"
      >
        <div className="container-lp">
          {/* SIS-253 — `TituloAceso` FICA, e só a tipografia veio do molde
              (`text-xl font-bold` em lugar de `text-section`, que é o corpo do
              `h2` de «Conheça também» do Match AI). A issue pede a tipografia do
              bloco de lá, não a troca do mecanismo: o Match AI monta um `h2`
              cru porque aquela rota inteira anima por `data-reveal`, e aqui o
              acendimento por rolagem é o padrão das sete seções desta página —
              trocá-lo faria ESTA perder o efeito que as vizinhas têm. O `id`
              continua no `h2`, que é o que o trilho de seções lê
              (`pageSections.ts:82`). */}
          <TituloAceso
            id="mais-quem-somos"
            texto="Conheça também"
            className="font-display text-xl font-bold text-ink"
          />
          {/* SIS-253 — O QUE HAVIA AQUI eram dois `Link` em `glass-card notch-card
              barra-sinal`, cada um com `h3` + `p` sobre o vidro da casa:

                <div className="vaza-cartoes mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ScrollReveal indice={0}>
                    <Link href="/sistran-labs"
                      className="glass-card notch-card barra-sinal block h-full p-7 transition-transform hover:-translate-y-1">
                      <h3 …>Sistran Labs: Laboratório de INOVAÇÃO</h3>
                      <p  …>Formado por uma equipe de nativos digitais, …</p>
                    </Link>
                  </ScrollReveal>
                  … idem para /sistran-university …
                </div>

              Fica registrado porque o que substitui não é uma variação do mesmo
              cartão: o molde do Match AI (`MatchAiPagina.tsx`, bloco «Conheça
              também») é MÍDIA — capa da rota de destino, véu navy e a marca por
              cima — e o vidro chanfrado não tem como virar isso por ajuste de
              classe.

              NENHUMA FRASE FOI REESCRITA: título e apoio dos dois destinos são os
              mesmos literais de antes, movidos para a legenda sob a mídia.

              O VÉU NÃO É ESTÉTICA, e a razão é a mesma que está escrita no Match
              AI: as duas marcas são de tinta clara (`logo-labs-header.webp` mede
              luminância 255 em toda a tinta; a da University é gradiente
              ciano/magenta com o nome em branco, p50 147) e as duas capas têm
              regiões claras. O `/55` de `#001A3D` tira a legibilidade da
              dependência de qual pedaço da foto caiu atrás.

              AS CLASSES `matchai-midia` / `matchai-midia-arte` SÃO REUSADAS COM O
              NOME DE LÁ, de propósito. Elas são a regra global
              (`globals.css:28527-28590`) que dá o avanço de escala da arte no
              hover E os dois canais de movimento reduzido. Duplicá-la com nome
              novo seriam duas verdades para o mesmo gesto, e renomeá-la obrigaria
              a editar o Match AI, que a issue põe fora de escopo. */}
          {/* O invólucro perdeu `vaza-cartoes` — ver a nota da classe da seção, acima.
              A GRADE GANHOU TETO DE LARGURA (pedido: «diminua bastante o tamanho
              desses cards»). Medido antes, a 1440: cada mídia tinha 530x331px, metade
              do container de 1180px menos o vão. Com `max-w-[720px]` cada uma cai para
              ~348x196px — 61% da área de antes —, e a proporção passa de 16/10 para
              16/9 porque é a das duas capas em si (`3-aba-sistran-labs.webp` e
              `university-hero.webp` são 16/9): em 16/10 o `object-cover` estava
              cortando faixa da foto de graça. Os dois cartões continuam lado a lado a
              partir de 768px, e o `sizes` foi refeito para a caixa nova — ele é inerte
              hoje (`images: { unoptimized: true }`, SIS-154) mas mentir nele é o que
              faz a otimização voltar errada no dia em que for religada. */}
          <div className="mt-6">
            <ul className="grid max-w-[720px] grid-cols-1 gap-6 md:grid-cols-2">
              {MAIS_QUEM_SOMOS.map((p, ordem) => (
                <li key={p.href}>
                  <ScrollReveal indice={ordem}>
                    {/* O cartão INTEIRO é o link: alvo grande e um destino só. */}
                    <Link href={p.href} className="group block">
                      <figure className="m-0">
                        <span className="matchai-midia relative block aspect-[16/9] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors group-hover:border-[#0079CB]/55">
                          <Image
                            src={p.capa}
                            alt=""
                            aria-hidden
                            fill
                            sizes="(min-width: 768px) 348px, 92vw"
                            loading="lazy"
                            className="matchai-midia-arte object-cover"
                          />
                          <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                          <span className="absolute inset-0 flex items-center justify-center p-6">
                            {/* `width`/`height` são as medidas INTRÍNSECAS do
                                arquivo (lidas com `sharp`, não estimadas); o
                                tamanho de uso sai das utilitárias. A marca é
                                decorativa aqui porque o nome do destino está
                                escrito no `h3` logo abaixo, dentro do mesmo link —
                                ao contrário do Match AI, onde o logo é a ÚNICA
                                coisa que identifica o destino e por isso carrega o
                                `alt`. */}
                            <Image
                              src={p.marca.src}
                              alt=""
                              aria-hidden
                              width={p.marca.largura}
                              height={p.marca.altura}
                              loading="lazy"
                              className="h-auto max-h-[46%] w-auto max-w-[72%] object-contain"
                            />
                          </span>
                        </span>
                        {/* A LEGENDA é a resposta ao item 3 da issue. O molde do
                            Match AI é «só o logo na mídia» porque lá são seis
                            cartões numa fileira e o pedido de origem foi encurtar;
                            aqui são DOIS, com o dobro da largura, e a escrita da
                            página não pode sumir. Então a mídia é a do molde e o
                            texto desce para a legenda, visível — não escondida num
                            `alt`, que é o outro caminho que a issue admitia. */}
                        <figcaption>
                          {/* `text-base` e não `text-lg`: numa mídia de 348px o corpo
                              de antes quebrava o título dos dois destinos em três
                              linhas, e a legenda ficava mais alta que a imagem que
                              ela legenda. */}
                          <h3 className="mt-4 font-display text-base leading-snug text-ink">
                            {p.titulo}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.apoio}</p>
                        </figcaption>
                      </figure>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
            {/* A PÍLULA DO MOLDE. Destino `/solucoes` e não `/sistran-labs`: os
                dois destinos da seção já são os dois cartões acima, e repetir um
                deles numa pílula é o mesmo link duas vezes. `/solucoes` é o que
                falta — esta página não linka a rota em lugar nenhum (conferido), e
                é a continuação natural de «quem somos» para «o que entregamos».
                O rótulo é o literal que já existe no Match AI, palavra por
                palavra: nenhuma escrita nova entrou na página.

                `on-dark` É OBRIGATÓRIO, não decoração, e a razão é a medida no
                Match AI: pílula de fundo cheio dentro de `.section-light`, cujos
                overrides pintam de navy tudo que traga `text-white`. O par de
                azuis (`#0060A8`, hover `#004D8A`) é o de lá pelo mesmo motivo —
                branco 0,88 sobre `#0079CB` fica abaixo do piso. */}
            <Link
              href="/solucoes"
              className="on-dark mt-8 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
            >
              Ver todas as soluções e serviços
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* SIS-268 — O CHANFRO E O `<div className="recebe-vazamento">` SAÍRAM DAQUI, e
          os dois pelo mesmo fato: o fecho deixou de ser escuro. As linhas anteriores
          eram, na ordem:

            NotchDivider cor="#cfe7f7"           (marcado «SIS-75: chanfro mantido
                                                  por decisao — claro↔escuro»)
            div.recebe-vazamento  >  ContactCTA   (sem props)

          O CHANFRO: ele existe para cortar claro contra escuro, e a cor que recebe é
          a do bloco que AVANÇA. Com `layoutReferencia` o bloco de baixo é `.cta-ref`,
          que pinta o próprio campo claro (`#f3f9fe → #e4f1fb → #cfe7f7`) contra o
          `section-light section-light-blue` de cima. Claro contra claro, e nas duas
          pontas a MESMA família de azul-gelo — é exatamente a fronteira de
          `/solucoes`, onde `Consulting` encosta neste bloco sem separador nenhum. O
          que costura é o `box-shadow: 0 0 54px 18px` que `.cta-ref` já traz (a emenda
          da SIS-93). Manter o chanfro aqui seria imprimir uma seta de `#cfe7f7`
          atravessando dois campos que já são dessa cor: não separa nada e o
          comentário que o acompanhava («claro↔escuro») passou a ser falso.

          O `<div>` RECEPTOR: ele reservava 5rem para a saliência dos cartões de
          «Conheça também» não pousar no conteúdo do CTA, e podia ser transparente
          porque o CTA de antes NÃO pintava fundo (o navy era o da página) — está
          escrito assim na nota que ele carregava. Essa premissa caiu: `.cta-ref` pinta
          o fundo DELA, então os 5rem do `<div>` viravam uma faixa de navy exposto
          entre dois blocos claros. A conta é a de `docs/medidas/sis268-quem-somos-
          antes.json`, a 1440: a base dos cartões que vazam cai em y=19362 e o topo
          do bloco de baixo em y=19409 — a geometria acima da junta não muda com a
          troca de props, então seriam 47px de navy à mostra de ponta a ponta da
          janela, com o chanfro claro por cima da metade de cima deles. Foi assim que
          a primeira passada desta issue saiu, e foi por isso que o `<div>` caiu.
          Sem ele, a saliência é absorvida pelo `padding-top` do próprio `.cta-ref`
          (8rem a partir de 1024px): medido em
          `docs/medidas/sis268-quem-somos-depois.json`, sobram 48px da base dos
          cartões até o painel de vidro e 21px até a caixa da arte — nenhuma
          sobreposição, e a faixa de navy deixou de existir.

          O VAZAMENTO EM SI FICA: `vaza-fonte`/`vaza-cartoes` continuam na seção acima,
          intocados. Os cartões seguem descendo os mesmos 5rem — agora sobre o campo
          claro da referência em vez de sobre o navy. As regras `div.recebe-vazamento`
          e `section.recebe-vazamento` do `globals.css` não foram tocadas; a primeira
          ficou sem consumidor e a nota de lá registra isso. */}
      <ContactCTA layoutReferencia contatoNoModal />
    </PageShell>
  );
}
