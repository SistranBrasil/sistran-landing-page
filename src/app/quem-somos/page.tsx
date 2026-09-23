import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import About from '@/components/About';
// SIS-42: o ecossistema navegável saiu de cena em favor da arte
// `posicionamentoperfil.png` numa casca (o motivo inteiro está na nota que ocupa
// o lugar do mount, mais abaixo). O import fica comentado porque ativo ele
// quebraria o lint por import não utilizado — e apagado levaria a pista de volta.
// import PositioningEcosystem from '@/components/PositioningEcosystem';
import PerfilPosicionamentoArte from '@/components/PerfilPosicionamentoArte';
import RecognitionTheater from '@/components/RecognitionTheater';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import ContactCTA from '@/components/ContactCTA';
import TechnologiesSection from '@/components/tecnologias/TechnologiesSection';
import EssenceAccordion from '@/components/EssenceAccordion';
import CircularEngagementModel from '@/components/CircularEngagementModel';
/* SIS-69: `BuildingShowcase` saiu da pagina — o import volta junto com o bloco,
   documentado mais abaixo, entre Tecnologias e Diferenciais. */
import OfficesScene from '@/components/ui/OfficesScene';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';
// Import comentado junto com o consumo do trilho de progresso (ver a nota SIS-100
// no lugar dele, no topo do `PageShell` desta página): deixá-lo ativo quebraria o
// lint por import não utilizado, e removê-lo apagaria a pista de como religar.
// import ProgressoLateral from '@/components/ui/ProgressoLateral';
import NotchDivider from '@/components/ui/NotchDivider';
import DiferenciaisSeis from '@/components/DiferenciaisSeis';
import {
  COMO_AGIMOS,
  /* 23/09 — `DIFERENCIAIS_6` deixou de ser lido AQUI: quem percorre a lista agora
     é `DiferenciaisSeis`. Fica comentado e não apagado porque o bloco que a
     consumia está registrado mais abaixo, e ativo o import quebraria o lint por
     não utilizado.
  DIFERENCIAIS_6, */
  ISG,
  POR_QUE_SISTRAN,
  PREMIACOES_NOTAS,
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
   1024px e com movimento reduzido. */
const DEGRAU = ['', 'degrau-2', 'degrau-3', 'degrau-2'] as const;

export default function Page() {
  return (
    <PageShell>
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

      {/* Bloco claro proprio, e nao o mesmo dos Escritorios/Diferenciais acima.
          O fundo de `.section-light` é um radial (`--claro-base`) resolvido
          contra a altura da caixa: num bloco de ~6.500px ele clareia o meio e
          termina antes do fim, e o que aparece embaixo é o azul do `body`. Esta
          secao era a ultima do bloco, ou seja, caia justamente fora do claro —
          era por isso que o titulo `text-ink` (navy) ficava navy sobre azul e
          quase invisivel. Com um bloco proprio o radial é resolvido contra a
          altura DESTA secao e a superficie volta a ser clara. */}
      <div className="section-light">
        <Differentials />
      </div>

      {/* SIS-75: candidata a Modelo A — claro↔claro (`#e4edf7` → branco do
          EssenceAccordion). O chanfro aqui é a unica coisa visivel na junta. */}
      <NotchDivider cor="#e4edf7" />

      {/* Missão · Valores · Pilares.
          Os tres cartoes escuros de largura igual viraram um accordion editorial
          de fundo branco: os conteudos tem tamanhos muito diferentes (um
          paragrafo, uma linha, seis frases), e em tres colunas iguais isso
          deixava duas quase vazias. Os textos sao os mesmos, agora em
          `src/data/essencia.ts`. */}
      <EssenceAccordion />

      {/* SIS-99: era `#f2f9fe`, o azul-gelo da Abordagem. Os Modelos de atuação
          nasceram em fundo branco, e o chanfro é da cor do bloco que avança —
          logo, branco sobre branco: a junta some, o que é o certo aqui. */}
      <NotchDivider cor="#ffffff" invertido />

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
      <CircularEngagementModel />

      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (Modelos → Como Agimos).
          SIS-99: a cor acompanha o fundo branco da seção que avança. */}
      <NotchDivider cor="#ffffff" />

      {/* Como Agimos */}
      <section aria-labelledby="como-agimos" className="section-py relative overflow-hidden">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          <TituloAceso
            id="como-agimos"
            texto="Como"
            destaque="Agimos"
            className="font-display text-section text-white"
          />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Nossos valores são a base da nossa cultura organizacional. Respeitando as
            individualidades, prezamos pela:
          </p>
          <ol className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {COMO_AGIMOS.map((v, i) => (
              <ScrollReveal
                as="li"
                indice={i}
                key={v}
                className={`glass-card-hover notch-card barra-sinal p-6 ${DEGRAU[i % 4]}`}
              >
                <span className="etapa-num num-monumental">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-base text-white">{v}</h3>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <Metrics />

      {/* Premiações, Certificações e Reconhecimentos.
          Os quatro cartões claros iguais deram lugar ao "Teatro de
          Reconhecimentos": o mesmo conteúdo (12 / 3 / 5 / 3 e os quatro assets
          oficiais) num palco navegável. O `h2` da seção passou a viver dentro do
          componente, e é ele que `aria-labelledby` aponta. As duas notas
          continuam aqui, logo abaixo — são escrita existente e com fonte. */}
      <section aria-labelledby="premiacoes">
        <RecognitionTheater />
        <div className="container-lp pb-14 md:pb-20">
          <div className="space-y-4">
            {PREMIACOES_NOTAS.map((n) => (
              <p key={n.slice(0, 24)} className="max-w-3xl text-lg leading-relaxed text-white/85">
                {n}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SIS-75: chanfro mantido por decisao — escuro↔claro (Reconhecimentos → ISG). */}
      <NotchDivider cor="#f2f9fe" invertido />

      {/* ISG Provider Lens */}
      {/* SIS-77 — ISG era a 2ª candidata do issue e foi DESCARTADA por estrutura,
          não por gosto: a grade de citações não é o último item da seção — a nota
          do reprint ISG vem depois dela. Margem negativa na grade encurta a seção
          e sobe a nota 5rem, em cima dos cartões. Para a citação atravessar, a
          nota teria de atravessar junto, e letra miúda de crédito saindo para
          dentro do bloco escuro é ruído, não ênfase.
          A 2ª fronteira virou "Conheça também" → "Fale com a Gente!", onde a
          grade É o último item. */}
      <section aria-labelledby="isg" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <TituloAceso
            id="isg"
            texto="ISG Provider Lens"
            className="font-display text-section text-ink"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* O `Reveal` envolve a citacao em vez de substituir a tag: o
                `blockquote` é semantica do conteudo e continua no lugar. */}
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
            <a
              href="https://isg-one.com/index/isg-index"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Consultores Globais em Gestão de Outsourcing
            </a>
            . Reprint autorizado por ISG Provider Lens ©, Brasil.
          </p>
        </div>
      </section>

      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (ISG → Por que SISTRAN?). */}
      <NotchDivider cor="#cfe7f7" />

      {/* Por que SISTRAN? */}
      <section aria-labelledby="por-que-sistran" className="section-py relative overflow-hidden">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          {/* No site o titulo termina com uma aspa dupla solta; removida. */}
          <TituloAceso
            id="por-que-sistran"
            texto="Por que"
            destaque="SISTRAN?"
            className="font-display text-section text-white"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {POR_QUE_SISTRAN.map((b, i) => (
              <ScrollReveal
                as="article"
                indice={i}
                key={b.title}
                className={`glass-card-hover notch-card barra-sinal relative overflow-hidden p-7 ${
                  i % 2 === 1 ? 'degrau-2' : ''
                }`}
              >
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-lg leading-snug text-white">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{b.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SIS-75: chanfro mantido por decisao — escuro↔claro (Por que SISTRAN? → Conheca tambem). */}
      <NotchDivider cor="#f2f9fe" invertido />

      {/* Caminho para as outras duas paginas do submenu "Quem somos". */}
      {/* SIS-77 — 2ª e última fronteira com sobreposição: os dois cartões de
          "Conheça também" descem para dentro do bloco de "Fale com a Gente!".
          Aqui a grade É o último item da seção, que é o que a técnica exige (ver a
          nota do bloco `.vaza-*` no `globals.css`).
          SIS-268 — «para dentro do CARTÃO AZUL» era a frase, e ela caducou: o fecho
          virou o desenho da referência, que é um campo CLARO com painel de vidro, e
          a saliência agora cai no `padding-top` desse campo. A técnica é a mesma e
          estas duas classes não foram tocadas; o que mudou é o que está embaixo. */}
      <section
        aria-labelledby="mais-quem-somos"
        className="vaza-fonte section-py section-light section-light-blue"
      >
        <div className="container-lp">
          <TituloAceso
            id="mais-quem-somos"
            texto="Conheça também"
            className="font-display text-section text-ink"
          />
          <div className="vaza-cartoes mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <ScrollReveal indice={0}>
              <Link
                href="/sistran-labs"
                className="glass-card notch-card barra-sinal block h-full p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-xl text-ink">
                  Sistran Labs: Laboratório de INOVAÇÃO
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de
                  inovações da Sistran.
                </p>
              </Link>
            </ScrollReveal>
            <ScrollReveal indice={1}>
              <Link
                href="/sistran-university"
                className="glass-card notch-card barra-sinal block h-full p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-xl text-ink">Sistran University</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Autossuficiência em capacitação de recursos: programa de capacitação intensiva da
                  Sistran.
                </p>
              </Link>
            </ScrollReveal>
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
