import { UserPlus } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PalcoReativo from '@/components/ui/PalcoReativo';
import CartaoDuasFaces from '@/components/ui/CartaoDuasFaces';
import PageHero from '@/components/PageHero';
import PainelContato from '@/components/ContactPanel';
import MapaUnidades from '@/components/UnitsMap';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import { SignalMarquee } from '@/components/legacy/SignalMarquee';
import MetricsBand from '@/components/MetricsBand';

export const metadata = {
  title: 'Contato · Sistran',
};

/* Escrita de /contato/. A secao "Onde Estamos" do site nao tem uma unica
   palavra — so um mapa embutido por script. Aqui ela carrega o endereco em
   texto e a lista de escritorios, para nao ficar vazia sem o mapa nem para
   leitor de tela.
   Fonte: .claude/conteudo-site/09-contato.md */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-126 — a abertura deixa de ser navy chapado e ganha a foto do
          escritório de São Paulo atrás da faixa inteira. É o `HeroImageBackdrop`
          já existente (SIS-113), sem componente novo.

          A foto é `escritoriosp1` (o open space em dia de trabalho), e não
          `escritoriosp` que a issue sugeriu, por duas razões medidas:
          1. `escritoriosp.jpg` já aparece em três lugares (palco da home,
             `MosaicHandoff`, card de `solutions.ts`); esta seria a quarta.
             `escritoriosp1` aparece uma vez só.
          2. `escritoriosp.jpg` é foto POSADA — trinta pessoas olhando para a
             câmera. Atrás de uma manchete ela deixa de ser fundo e vira assunto:
             o texto lê como legenda da foto. O open space em uso é fundo de
             verdade, que é o papel aqui.

          Derivada: `escritoriosp1.jpg` (179 kB, 1600×863) -> WebP q72,
          `contato-hero.webp` com 92 kB — metade do peso, e ela entra no caminho
          crítico do LCP porque o componente marca `priority`. O original NÃO foi
          para `docs/fontes/` como em SIS-109/110: ele continua sendo consumido
          direto por `solutions.ts:28`, então tirá-lo de `public/` quebraria
          aquele card. Ele já é versionado onde está.

          `foco` vertical em 55%: a caixa da abertura é muito mais larga que alta
          e o `cover` corta em cima e embaixo. O terço de cima da foto é laje e
          luminária; as mesas em uso ficam entre 35% e 70% da altura. Centrar em
          50% começaria a comer as cabeças da fileira da frente. */}
      <HeroImageBackdrop
        src="/images/contato/contato-hero.webp"
        alt=""
        foco="50% 55%"
        className="hero-backdrop--contato"
      >
        <PageHero
          title="Preencha o formulário e"
          highlight="fale com a gente!"
          description={
            <p>
              A Inovação e a Transformação Digital começam hoje. Traga a evolução para a sua empresa
              com a <strong className="font-bold text-white">SISTRAN!</strong>
            </p>
          }
        />
      </HeroImageBackdrop>

      {/* SIS-134 — os sete indicadores institucionais entram AQUI, entre a
          abertura e o painel: prova antes do formulário. Faixa chapada, sem palco
          e sem contador, lendo `METRICS` — a mesma fonte da seção "Sistran em
          números" da home, que não é tocada. As razões de desenho (por que 4+3 e
          não sete colunas, por que sem contador, por que escura) estão no próprio
          componente e em `.contato-indicadores` no `globals.css`.

          Ela vem ANTES da faixa de logos, e essa ordem é o que mantém a página
          com DUAS arestas de luminância em vez de três. Medido: o pé do hero
          fecha em ~rgb(15,43,74) e a banda abre exatamente nesse tom, então
          hero -> banda não é aresta nenhuma. Se a faixa clara das logos viesse
          primeiro, a sequência seria escuro -> claro -> escuro -> azul: três
          trocas de superfície em menos de mil pixels. */}
      <MetricsBand />

      {/* SIS-136 — a faixa de parceiros passou para CÁ, entre a abertura e o
          painel do formulário. Antes ela fechava a página, depois de "Onde
          Estamos"; o comentário que justificava aquele lugar fica preservado
          abaixo, porque as duas razões que ele dava são exatamente as que esta
          issue contraria, e saber que a decisão MUDOU vale mais que o texto
          antigo.

          O que a mudança de lugar custou, e como foi pago:
          1. Emenda de cima (escuro -> claro). É a faixa de indicadores da SIS-134
             que encosta aqui, e não o pé do hero. Isso não é detalhe: o pé do
             hero é a FOTO por baixo do véu e varia ~30/255 entre as colunas
             (medido a 1440), então nenhuma emenda fecharia sem listra contra ele.
             A banda fecha em `#071d36` plano de ponta a ponta, e é contra essa
             cor plana que o off-white desta faixa entra e se dissolve — ver
             `.contato-faixa-parceiros` no `globals.css`.
          2. Emenda de baixo (claro -> `#0b4e86`). Mesmo recurso que a home já usa
             na `.palco-emenda-de-claro`: o claro ENTRA no topo da seção escura
             seguinte e se dissolve. Não é `NotchDivider`: o chanfro precisa de
             dois blocos chapados para chanfrar, foi removido da home na SIS-101
             por produzir diagonal terminando no vazio, e `globals.css:5588`
             registra que /contato deliberadamente não o tem. Recurso existente,
             não terceiro recurso.

          O CUSTO DE REDE, que a primeira versão deste comentário negou por dedução
          errada. Ela dizia: "as logos já eram `loading=lazy decoding=async`, então
          subir a faixa não a põe no caminho crítico do LCP". Está invertido —
          `lazy` não é "não baixa", é "baixa quando chega perto da janela", e o
          limiar do Chrome no desktop é da ordem de mil pixels. No fim da página
          isso não custava nada; aqui a faixa abre em y=1017 a 1440×900, ou seja
          logo abaixo da dobra e DENTRO do limiar. Medido: as 30 `<img>` estão
          todas completas no `load`, e as requisições saem todas antes dele.

          O que o custo é, de verdade: **17 a 18 requisições de imagem, ~1,22 MB** —
          o número oscila com o que já está em cache. E NÃO são 30 × `repeats` × 2:
          a segunda `.marquee-copy` repete os MESMOS endereços, então sai uma
          requisição por logo distinta e o cache serve o resto.

          O que foi feito a respeito: as logos ganharam `fetchPriority="low"` no
          `SignalMarquee` (ver a razão lá). Antes disso a foto do hero fechava em
          390ms e a primeira logo em 396ms — mesma rajada, disputando banda.
          Remedido depois: hero em 76ms e a primeira logo em 100ms, com o lote
          inteiro fechando em 295ms, ou seja o hero inteiro à frente da primeira
          logo. As 30 `<img>` continuam completas no `load`.

          Sobra custo, e ele é assumido: 1,22 MB continuam sendo baixados logo
          abaixo da dobra. A troca é a do ponto 2 lá embaixo — prova de terceiros
          antes do formulário — e quem quiser desfazê-la desfaz o custo junto.
          Número de LCP não vai escrito aqui de propósito: o que eu tenho é
          `next dev`, onde ele mede ~4,4s por causa da compilação sob demanda e não
          diz nada sobre produção. Medir em `next start` antes de citar valor. */}
      <div className="contato-faixa-parceiros">
        <SignalMarquee />
      </div>

      {/* SIS-76 — a grade entra nas seções escuras que estavam sem nada. O pedido
          é uma malha única no site inteiro; enquanto só duas seções de
          /quem-somos a tinham, o resto do fundo escuro era caixa vazia. Mesmo
          molde de lá: `relative overflow-hidden` no <section> (a grade é
          `absolute` em `z-index: -1`) e `aria-hidden` no nó. */}
      {/* SIS-83 — o formulário desta página passa a ser o mesmo painel "Entre em
          contato conosco" da home: foto da sede recortada de um lado, campos do
          outro. É o componente já existente (`ContactPanel`), reusado inline —
          `onClose` é opcional justamente para isso. NÃO vem com a `.ct-trilha` /
          `.ct-palco` da home: aquele palco de scroll é encenação da entrada da
          home, e aqui a página já entra pelo hero.
          SIS-127 — o e-mail comercial deixou de ser um parágrafo solto abaixo
          do cartão e passou para DENTRO do destaque do telefone, via
          `mostrarEmail`. Telefone e e-mail são as duas vias diretas de contato;
          separá-los em dois lugares com dois pesos diferentes era o que a issue
          corrige. A prop é opt-in justamente porque a home e o modal do
          cabeçalho usam este mesmo painel e continuam sem o e-mail. */}
      {/* SIS-128 — o fundo atrás do painel deixa de ser o azul do `body` sem
          tratamento. `fundo-contato-cena` é só a âncora de escopo: é ela que
          adensa a `.grade-tecnica` desta seção sem tocar na regra global.

          As camadas ficam AQUI, na seção da página, e não no `ContactPanel` —
          o painel é o mesmo da home e do `<dialog>` do cabeçalho, e tratar o
          fundo dentro dele mudaria três telas de uma vez. Mesma razão da prop
          opt-in da SIS-127.

          Ordem proposital: a `.grade-tecnica` vem DEPOIS de `.fundo-contato`.
          As duas estão em `z-index: -1`, então quem vem depois no documento
          fica por cima — a malha precisa ler sobre os degradês, não sob eles. */}
      <section
        aria-labelledby="contato-titulo"
        className="section-py fundo-contato-cena relative overflow-hidden"
      >
        <div aria-hidden className="fundo-contato">
          <div className="fundo-contato-laje fundo-contato-laje--longe" />
          <div className="fundo-contato-laje fundo-contato-laje--perto" />
        </div>
        <div aria-hidden className="grade-tecnica" />
        {/* SIS-136 — a rampa da emenda de claro. Vem DEPOIS das duas camadas
            decorativas de propósito: as duas estão em `z-index: -1` e esta em
            `z-index: 0`, então ela é a única que pinta por cima delas. Um
            `::after` de `.fundo-contato` não serve — ver `.contato-emenda-clara`
            no `globals.css` para as três tentativas medidas. */}
        <div aria-hidden className="contato-emenda-clara" />
        <div className="contact-inline">
          <div className="contact-dialog-inner">
            <PainelContato
              eyebrow="SAIBA MAIS SOBRE O QUE PODEMOS OFERECER"
              title="Entre em contato conosco"
              description="Contacte-nos para saber que tipo de soluções podemos implementar para o seu negócio!"
              tituloId="contato-titulo"
              mostrarEmail
            />
          </div>
        </div>
      </section>

      {/* Onde Estamos — no site esta secao é so um mapa, sem texto nenhum.
          SIS-84: as três unidades passam a ser selecionáveis, com o mapa
          recentrando na escolhida. O endereço, o telefone e o link de rota são
          texto e continuam legíveis mesmo que o mapa não carregue. */}
      {/* SIS-168 — o mapa deixa de ser cartão DENTRO de uma seção clara e passa a
          ser a SUPERFÍCIE da seção: sangra de borda a borda, e pílula, título,
          seletores e endereço ficam por cima dele, à esquerda.

          O que saiu daqui, e por quê:

          · `section-py` — o respiro vertical era o que separava o cartão das
            seções vizinhas. Sem cartão não há o que separar: a altura da seção
            agora é a altura do mapa, e padding aqui viraria faixa de fundo
            aparecendo acima e abaixo do mapa sangrado.
          · `container-lp` — era ele que dava ao cartão a mesma largura do resto
            da página. Sangrar é justamente não ter essa caixa. O EIXO da leitura
            não se perde: o painel se alinha à mesma goteira por cálculo, em
            `--mapa-eixo` (`globals.css`), e não por herdar o container.
          · `section-light section-light-blue` — a seção clara existia para o
            cartão escuro pousar sobre ela. Agora a superfície é o mapa, e manter
            a classe pintaria claro onde nada aparece; pior, `.section-light
            h2/p/span` (globals.css:565) pinta todo texto de navy #0a1f44, o que
            obrigava o `on-dark` do cartão. Com a classe fora, `text-ink`
            (#f8fafc) volta a valer pelo que ele é e o `on-dark` deixa de ter
            função — foi removido em `UnitsMap.tsx`, com o comentário acertado lá.

          As duas FRONTEIRAS mudaram de natureza, e é o que dispensa chanfro nas
          duas (item 2 da issue, que reabria a pergunta da SIS-75):
          · em cima encosta `fundo-contato-cena`, que é escura;
          · embaixo encosta o palco do `#timeSISTRAN`, que é escuro.
          Ou seja as duas arestas de luminância que existiam aqui DESAPARECERAM —
          antes era escuro -> claro -> escuro. Chanfro precisa de dois blocos
          chapados e serve para quebrar corte reto entre superfícies de brilho
          diferente; entre dois navios não há corte reto a quebrar.

          A pílula e o título entram no mapa por `cabecalho`, e continuam sendo
          desenhados AQUI: quem responde pela escrita da rota é esta página, e o
          `id="onde-estamos"` tem de existir neste JSX porque é ele que o
          `aria-labelledby` da seção resolve. */}
      <section aria-labelledby="onde-estamos">
        <MapaUnidades
          cabecalho={
            <>
              <span className="tag-section">#sistran</span>
              <h2 id="onde-estamos" className="mt-4 font-display text-section text-ink">
                Onde Estamos
              </h2>
            </>
          }
        />
      </section>

      {/* SIS-136 — a faixa de parceiros SAIU DAQUI e subiu para entre a abertura
          e o painel do formulário. O componente e a lista são os mesmos; mudou só
          a posição no JSX. Ver o comentário lá em cima.

          O texto que justificava esta posição fica preservado abaixo, comentado,
          porque as duas razões que ele dá são precisamente as que a issue
          contraria — e um dia alguém vai reler isto e precisar saber que o
          trade-off foi visto, e para que lado foi decidido:

          | Faixa de parceiros: o MESMO componente da home (`legacy/SignalMarquee`),
          | lendo a mesma lista de `src/data/clients.ts`. Nenhuma lista nova e
          | nenhum marquee novo — as três telas que a mostram nunca divergem.
          |
          | O lugar é este, e não depois do painel de contato, por duas razões:
          | 1. Superfície. A faixa traz o próprio off-white (`#f5faff`) e vem depois
          |    de "Onde Estamos", que já é seção clara (`section-light-blue`): claro
          |    encosta em claro e a emenda é só a troca de tom. Entre o painel e o
          |    mapa ela abriria uma ilha clara no meio do azul, com duas arestas de
          |    luminância em vez de nenhuma.
          | 2. Leitura. Prova de terceiros fecha a página, não interrompe o
          |    formulário. Quem está em /contato está a caminho de preencher os
          |    campos; marcas passando entre a manchete e o formulário competem com
          |    a única ação que a página pede.
          |
          | O `#timeSISTRAN` logo abaixo continua recebendo claro em cima, que é a
          | premissa da `.palco-emenda-de-claro-curta` — a faixa não a quebra.
          |
          | Sem wrapper: o componente já é `role="region"` rotulado, traz o próprio
          | fundo e o próprio respiro vertical.

          O que respondeu a cada uma:
          1. Superfície: a razão continua VERDADEIRA — a faixa realmente abre duas
             arestas onde não havia nenhuma. Ela deixou de ser impedimento porque
             as duas arestas passaram a ser tratadas com recurso já existente (a
             emenda de claro), e porque a banda de indicadores da SIS-134 entrega
             uma cor PLANA para a de cima encostar. Sem a banda, esta mudança
             ficaria com uma listra na borda de cima.
          2. Leitura: aqui houve troca de opinião, e é uma decisão de produto, não
             técnica. A prova de terceiros passa a vir ANTES do formulário, para
             sustentar o pedido em vez de fechar a página depois dele. O custo é
             real e continua sendo custo: há movimento entre a manchete e o campo.
             O que o limita já existia no componente e foi conferido aqui, não
             suposto: `:hover`/`:focus-within` param o laço, e com
             `prefers-reduced-motion: reduce` a faixa deixa de se mover e vira
             lista de rolagem nativa — medido a 1440, `overflow-x: auto` com
             2730px de conteúdo alcançável e a cópia duplicada retirada. "Fora do
             DOM" era o que este trecho dizia, e está errado: o que
             `globals.css:924` faz é `display: none !important` na cópia — ela
             CONTINUA no DOM, apenas sai da árvore de renderização e da de
             acessibilidade, que é o que basta para a rolagem não medir o dobro do
             comprimento e o leitor de tela não ler as marcas duas vezes. A
             diferença importa para quem for depurar: a cópia aparece no inspetor. Ou
             seja: quem não quer movimento entre a manchete e o formulário não o
             recebe, e ainda assim alcança as trinta marcas.

          O `#timeSISTRAN` logo abaixo continua recebendo claro em cima: quem
          encosta nele agora é "Onde Estamos" (`section-light-blue`), que também é
          seção clara — a premissa da `.palco-emenda-de-claro-curta` se mantém, só
          troca o claro que a entrega (era o off-white da faixa).

          SIS-168 — ESSA PREMISSA CAIU, e é o defeito mais concreto daquela issue.
          "Onde Estamos" deixou de ser seção clara: o mapa passou a ser a
          superfície e quem encosta no `#timeSISTRAN` agora é navy escuro. A
          `.palco-emenda-de-claro-curta` existe para dissolver claro que ENTRA no
          topo de uma seção escura; sem claro nenhum acima, ela pintaria uma faixa
          #cfe7f7 de 150px no topo do palco vinda do nada — uma listra clara entre
          dois escuros, exatamente o oposto do que a classe faz. Por isso ela saiu
          desta rota (ver o `PalcoReativo` abaixo, com o `className` comentado no
          lugar). A classe CONTINUA em uso na home e não foi tocada. */}

      {/* Este bloco esta na pagina de Contato do site (e o CTA comercial esta em
          Trabalhe conosco — os dois estao trocados na origem). Mantido onde o
          site o publica, com o link apontando para a pagina de carreira. */}
      {/* SIS-130 — o bloco mais magro da página ganha o mesmo palco da seção
          `#SomosSistraners`: marca d'água gigante atrás (aqui `#timeSISTRAN`),
          luzes que seguem o ponteiro, orbs e o deslize da marca d'água por
          scroll. O palco é COMPARTILHADO (`ui/PalcoReativo`), não copiado — a
          palavra da marca d'água é parâmetro.

          A `grade-tecnica` SAIU: palco e malha são duas camadas decorativas
          disputando o mesmo fundo, e a malha é a que menos acrescenta aqui —
          ela existe para preencher seção escura vazia (SIS-76), que é
          exatamente o que esta deixou de ser.

          Escrita: ampliada, e deliberadamente SEM as duas promessas que a issue
          marcou como não verificáveis. "Nós temos a vaga ideal para você" saiu —
          `trabalhe-conosco/page.tsx:30` registra que o site não lista vaga
          alguma nem portal de vagas, e o destino do CTA é um formulário de
          currículo. Nenhum benefício é enumerado: o site diz "diversos
          benefícios" e não lista nenhum; listar aqui seria publicar oferta de
          trabalho não verificada. As três afirmações mantidas ("acolhe o
          colaborador", "diversos benefícios", "apoia o seu desenvolvimento") são
          as que o próprio site publica.

          Fica ABERTO para quem responde por RH/carreira: aprovar esta escrita e
          decidir se `/trabalhe-conosco` passa a ter vagas ou portal. Enquanto
          não tiver, o texto trata o convite pelo que ele é — enviar currículo. */}
      {/* Emenda de claro pelo mesmo motivo da home: acima vem seção CLARA
          (`section-light-blue`) e sem ela o claro encostaria direto no #0b4e86
          numa linha reta de ponta a ponta — o caso para o qual a classe foi
          criada em SIS-107. Aqui na variante CURTA: com a faixa de 220px da home
          o título branco caía dentro do claro (medido 1.43:1). Ver o comentário
          de `.palco-emenda-de-claro-curta` no `globals.css`.

          SIS-168 — A PREMISSA ACIMA NÃO VALE MAIS: "acima vem seção CLARA" era
          verdade enquanto "Onde Estamos" era `section-light-blue`, e agora acima
          vem o mapa sangrado, que é navy escuro. A emenda dissolve claro que
          entra no topo do escuro; sem claro para dissolver ela desenha uma faixa
          #cfe7f7 de 150px surgindo do nada entre duas superfícies escuras.
          Por isso o `className` sai — fica comentado no lugar, com o motivo, e a
          classe segue intacta em `globals.css` porque a home a usa:

            className="palco-emenda-de-claro-curta"

          O que se perde junto, e foi conferido antes de aceitar: (a) o
          `padding-top` de 11/13rem, que existia para o título branco não cair
          dentro da faixa clara — sem faixa, o problema que ele resolvia não
          existe, e o palco volta ao `py-24 md:py-32` do componente; (b) a máscara
          que fazia `.palco-luz` e `.palco-orb-a` entrarem do zero nos primeiros
          150px, que servia para as luzes não nascerem acesas sobre a borda clara
          — sobre navy elas podem nascer acesas, é o mesmo que a seção `#social`
          da home faz.

          SIS-180 — as duas linhas que ficavam aqui diziam que o véu de leitura
          do `.palco-copy` não dependia desta classe e que por isso o contraste
          "continua garantido pelo mesmo mecanismo de antes". Passaram a mentir:
          o véu FOI REMOVIDO. Ficam registradas porque é este bloco que alguém lê
          para decidir se pode devolver a classe a esta rota:

            O véu de leitura do `.palco-copy` NÃO depende desta classe
            (ele é do `.palco-copy`, ver `globals.css`), então o contraste do
            título e do corpo continua garantido pelo mesmo mecanismo de antes.

          O que garante o contraste AGORA são três coisas, nenhuma delas um véu:
          as luzes do palco confinadas (por posição acima de 1024, por
          intensidade abaixo), o contorno da marca d'água a 0.08, e os dois
          parágrafos em branco cheio. Medido nesta rota, pior pixel sob as
          linhas: 5,10:1 a 1440, 5,21:1 a 1024, 4,74:1 a 390. Devolver a classe
          aqui NÃO devolve véu nenhum — se alguém quiser a faixa clara de volta,
          o que precisa reconferir é a máscara dos 150px contra o confinamento
          das luzes, não o contraste do texto. */}
      <PalcoReativo marca="#timeSISTRAN" ariaLabelledby="time-sistran">
        <div className="container-lp relative lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <div className="palco-copy max-w-2xl">
            <span className="tag-section">#sistran</span>
            <h2 id="time-sistran" className="mt-5 font-display text-section text-white">
              Venha Fazer Parte do <span className="text-gradient-brand">#timeSISTRAN!</span>
            </h2>
            {/* SIS-146 — o travessão saiu e a frase foi REPONTUADA, não apenas
                desprovida do caractere: sem pausa nenhuma, "…usa todos os dias e
                de gente que gosta de resolvê-los" lê como se "gente" fosse outro
                item da mesma lista de coisas que o mercado usa, o que muda o
                sentido. Das duas saídas limpas escolhi a VÍRGULA e não o ponto:
                ela conserva a frase única, que é a construção que a SIS-130
                escreveu (uma frase de posicionamento, depois a de benefícios).
                Dividir em duas criaria três frases curtas seguidas e mudaria o
                ritmo do parágrafo, que não é o que a issue pede.
                Antes: "…usa todos os dias — e de gente que gosta de resolvê-los."

                O OUTRO travessão do bloco fica como está: o do verso do cartão
                ("Sem vaga publicada hoje — o formulário de Carreira…"), logo
                abaixo, em `versoTexto`. A issue trata só deste parágrafo, e ali o
                travessão separa duas orações independentes, onde vírgula seria
                emenda — tirar exigiria reescrever a frase, e essa escrita é da
                SIS-130, com aprovação de RH ainda aberta. Se o padrão for tirar
                travessão de toda a rota, é decisão a registrar em issue própria:
                há vários outros no site. */}
            {/* SIS-180 — os dois parágrafos deste bloco saíram de `white/85` e
                `white/75` para branco cheio, pela mesma medição feita na seção
                `#social`: sem o véu, o fundo é o azul da base, e sobre a última
                parada dele (`#1273bc`) branco a 85% dá 4,08:1 e branco a 75% dá
                3,52:1. Este fechamento não foi pedido pela usuária, mas divide
                `.palco-copy` com a seção do LinkedIn — remover o véu lá remove o
                véu aqui, e deixar a tinta translúcida seria trocar um problema
                de contraste por outro em rota diferente. */}
            <p className="mt-6 text-lg leading-relaxed text-white md:text-xl">
              Ser Sistran é trabalhar perto de sistemas que o mercado de seguros usa todos os
              dias, e de gente que gosta de resolvê-los. Aqui você encontra uma empresa que
              acolhe o colaborador, oferece diversos benefícios e apoia o seu desenvolvimento.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white">
              Não mantemos uma lista de vagas publicada nesta página. O convite é direto: envie o
              seu currículo pelo formulário de Carreira e conte o que você faz bem. É por ali que
              começa a conversa.
            </p>
          </div>

          <CartaoDuasFaces
            href="/trabalhe-conosco"
            icone={<UserPlus strokeWidth={1.6} aria-hidden />}
            rotulo="Venha ser Sistran"
            /* O que o cartão faz fica na FRENTE, nunca só no verso: em toque não
               existe hover, e o verso é reforço. */
            destino="Carreira · enviar currículo"
            versoTitulo="Envie o seu currículo"
            versoTexto="Sem vaga publicada hoje — o formulário de Carreira é o caminho para o seu currículo chegar até nós."
            versoCta="Ir para Carreira"
            className="mt-14 lg:mt-0"
          />
        </div>
      </PalcoReativo>
    </PageShell>
  );
}
