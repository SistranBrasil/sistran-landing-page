import Header from '@/components/Header';
import HeroCinematic from '@/components/HeroCinematic';
// Import comentado junto com o consumo da seção logo abaixo (ver o comentário
// em volta de `<Differentials />`): deixá-lo ativo quebraria o lint por import
// não utilizado, e removê-lo apagaria a pista de como religar a seção.
// import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import Solutions from '@/components/Solutions';
import ProofJourney from '@/components/ProofJourney';
import Social from '@/components/Social';
import Contact from '@/components/Contact';
// Import comentado junto com o consumo do bloco "Fale com a Gente!" no fim do
// `main` (ver o comentário no lugar dele): deixá-lo ativo quebraria o lint por
// import não utilizado, e removê-lo apagaria a pista de como religar.
// import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ScrollSpy from '@/components/ui/ScrollSpy';
// Import comentado junto com o consumo do fio condutor logo abaixo (ver o
// comentário em volta de `<ScrollSpine />`): deixá-lo ativo quebraria o lint por
// import não utilizado, e removê-lo apagaria a pista de como religar o fio.
// import ScrollSpine from '@/components/ui/ScrollSpine';
import BackToTop from '@/components/ui/BackToTop';
import MosaicHandoff from '@/components/ui/MosaicHandoff';
// Import comentado junto com o consumo do condutor Soluções -> Números (ver o
// comentário no lugar dele, depois de `<Metrics />`): deixá-lo ativo quebraria o
// lint por import não utilizado, e removê-lo apagaria a pista de como religar.
// import SolutionsToMetrics from '@/components/ui/SolutionsToMetrics';
// Import comentado junto com os wrappers que saíram da home (ver a nota acima de
// `<Contact />`): o componente continua no projeto, mas a home não o consome mais
// — deixá-lo importado quebraria o lint por import não utilizado.
// import SectionReveal from '@/components/ui/SectionReveal';
import OptionalMorphIntro from '@/components/intro/OptionalMorphIntro';
// Imports comentados junto com a saída do chanfro e da faixa de logos daqui (ver
// a nota SIS-101 dentro do `<ProofJourney>`): deixá-los ativos quebraria o lint
// por import não utilizado, e removê-los apagaria a pista do que havia ali.
// import NotchDivider from '@/components/ui/NotchDivider';
import { StackScenes } from '@/components/legacy/StackScenes';
// Import comentado junto com o consumo da faixa logo abaixo (ver o comentário em
// volta de `<MetricsStrip />`): deixá-lo ativo quebraria o lint por import não
// utilizado, e removê-lo apagaria a pista de como religar a faixa.
// import { MetricsStrip } from '@/components/legacy/MetricsStrip';
// SIS-101 — a faixa de logos agora é montada por `Metrics.tsx`, como rodapé da
// seção dos números. A home não a consome mais diretamente.
// SIS-156 — e na home ela deixou de ser faixa: o rodapé daquela seção agora é a
// grade estática `BrandGrid`, montada no mesmo lugar. A faixa rolante segue viva
// em `/contato` e `/parceiros-e-implementacoes`; a home não a consome de nenhuma
// forma.
// import { SignalMarquee } from '@/components/legacy/SignalMarquee';
import { ImpactSequence } from '@/components/legacy/ImpactSequence';

export default function Page() {
  return (
    <>
      {/* Abertura opcional: so na home, so uma vez por sessao, e sempre por
          cima de uma pagina que ja terminou de renderizar por baixo. */}
      <OptionalMorphIntro />
      <Header />
      <ScrollSpy />
      {/* TIPOGRAFIA.md — a serifa editorial saiu daqui: ela é do layout raiz
          agora, para o site inteiro, e não mais uma fonte declarada por rota. O
          `<main>` continua sendo irmão direto das seções por outro motivo, que
          segue valendo: um `<div>` em volta do hero quebraria `#top + *` no
          `globals.css` — a seção seguinte deixaria de ser irmã do hero e perderia
          o `z-index` que a faz subir por cima dele. */}
      <main id="conteudo" tabIndex={-1}>
        {/* Fio condutor comentado a pedido: a linha lateral que costurava hero
            -> contato e acendia um nó por seção passava por cima do conteúdo e
            incomodava mais do que orientava.

            Comentado, e não removido: `src/components/ui/ScrollSpine.tsx` e o
            bloco `.spine` do `globals.css` continuam intactos, então religar é
            descomentar esta linha e o import no topo do arquivo. Se voltar,
            precisa continuar aqui — irmão direto das seções, nunca dentro de um
            wrapper animado: `position: fixed` morre sob ancestral com
            `transform`/`filter`/`clip`, e a home tem vários.

            Nada de conteúdo se perde com a saída: o fio era decorativo e
            `aria-hidden`.
        <ScrollSpine />
        */}
        <HeroCinematic />
        {/* Sem separador aqui: o hero encolhe em card sobre fundo claro e já
            entrega a cor do mosaico.

            O `StackScenes` era mosaico e Método num bloco só, porque o tile
            "Arquitetura modular e escalável" saía do mosaico, descia e se
            expandia até virar a caixa de vídeo do Método — separar cortaria o
            percurso na emenda. Com o Método comentado (texto, quatro movimentos
            e vídeo saíram a pedido), sobrou só o mosaico, e a travessia foi
            comentada junto: sem caixa de destino ela não tinha onde pousar.
            Conteúdo em `src/data/legacy.ts`. */}
        <div>
          {/* SIS-68: variante da home — abertura "Entrega com Alta Performance
              e Comprometimento" e os quatro pilares dentro do bloco de texto.
              `/transformacao-legado` monta o mesmo componente sem a prop e
              continua com a abertura "Arquitetura". */}
          <StackScenes variante="home" />
        </div>
        {/* Soluções ocupa agora o lugar do Método, a pedido: é o teatro preso ao
            scroll com a pílula "Veja como a Sistran pode ajudar sua Seguradora
            nos mais variados desafios de negócios." e o título "Soluções de
            Negócios". Só esse cabeçalho fica — o kicker "Método | quatro
            movimentos" foi embora com o `SectionIntro`, então não há título
            duplicado no lugar.

            Fora do wrapper da serifa editorial e fora do `SectionReveal`, pelo
            mesmo motivo de "Sistran em números": a seção é palco preso ao scroll
            (sticky + trilha de 400vh), e um ancestral com `transform` cria
            contexto e faz o sticky perder a referência da viewport. */}
        {/* ── Jornada de prova: UM percurso, UM relógio ──────────────────────
            Soluções, o handoff, "Sistran em números" e os parceiros eram três
            seções independentes em sequência, cada uma com o seu ScrollTrigger.
            Agora são capítulos de um percurso só: o `ProofJourney` mede a faixa
            de rolagem de cada um e entrega a fração local a quem se inscreveu.
            Nenhum capítulo tem gatilho próprio enquanto está aqui dentro — e
            todos continuam funcionando sozinhos fora daqui, porque sem a jornada
            em volta o `useJornada` devolve `dirigindo: false` e cada um recria o
            gatilho dele.

            O wrapper não pode ganhar `transform`, `filter`, `contain` nem
            `overflow`: os três primeiros matariam o `position: fixed` dos
            condutores decorativos e o último viraria scrollport, matando os
            `sticky` internos dos capítulos. A nota está também no `globals.css`,
            em `.proof-journey`. */}
        <ProofJourney>
          <Solutions />
        {/* "Sistran em números" subiu para cá, a pedido: passa a ocupar o lugar
            que era do bloco "Resultados | evidências dos casos", logo depois do
            mosaico e de Soluções.

            Fora do wrapper da serifa, fora do `SectionReveal` e fora do
            `.section-light`: ela tem percurso de scroll próprio (seção alta +
            `sticky`) e um ancestral com `transform` faria o `sticky` perder a
            referência da viewport. Ela também desenha os próprios dois fundos —
            faixa clara em cima, palco escuro embaixo.

            Emenda de entrada: Soluções fecha em palco escuro e a faixa clara da
            Metrics abria em corte reto. Quem resolve é `.impact-emenda`, dentro
            do próprio componente — um degradê do navy na borda de cima da faixa,
            que se dissipa conforme a seção entra (`--impact-entrada`, variável
            que o único ScrollTrigger da seção já escreve). */}
          <Metrics />
        {/* Condutor da emenda Soluções -> Números: o fio que se dissipa à direita
            do último nó de Soluções se estende com o scroll até a boca de entrada
            da onda da Metrics, para os dois traços lerem como um só.

            Fica DEPOIS das duas seções e é irmão direto delas, pelo mesmo motivo
            do `MosaicHandoff` logo acima: o condutor é `position: fixed`, que
            morre sob ancestral com `transform`/`filter`, e a ordem na árvore é o
            que o faz pintar por cima dos dois fundos sem disputa de `z-index`.
            Decorativo e `aria-hidden` — sem ele o fio de Soluções termina onde
            terminava e a onda começa onde começava.

            COMENTADO: o condutor não tem como ficar discreto, e o motivo é
            geométrico, não de calibragem. A saída do fio de Soluções fica na
            DIREITA da tela e a boca de entrada da onda da Metrics na ESQUERDA,
            então o traço precisa cruzar a largura inteira da janela — e com
            `stroke` ciano e `drop-shadow` ele lê como uma diagonal acesa por
            cima do título "Sistran em números", que é exatamente a parte que
            ficou feia. Religar sem mudar as duas âncoras traz a diagonal de
            volta.

            Comentado, e não removido: `ui/SolutionsToMetrics.tsx`, as marcas
            `[data-fio-saida]` (em `Solutions.tsx`) e `[data-fio-chegada]` (em
            `Metrics.tsx`) e o bloco `.fio-travessia` do `globals.css` continuam
            intactos — religar é descomentar a linha abaixo e o import no topo.
            Se voltar, precisa continuar aqui: irmão direto das duas seções,
            nunca dentro de um wrapper animado.
        <SolutionsToMetrics />
        */}
        {/* Evidências de terceiros fecham o bloco de números: o chanfro leva o
            navy do palco da Metrics para dentro da faixa clara de parceiros.
            Marcas em `src/data/clients.ts`.

            `<MetricsStrip />` comentado a pedido: com a Metrics aqui em cima, as
            duas faixas de indicadores numéricos ficariam coladas e repetiriam a
            mesma figura retórica duas vezes seguidas — e a Metrics já traz os
            sete indicadores institucionais. Comentado, e não removido: o
            componente `src/components/legacy/MetricsStrip.tsx` e os dados em
            `src/data/legacy.ts` (`metrics`, `metricsIntro`) continuam intactos,
            então religar é descomentar a linha abaixo e o import no topo.
            <MetricsStrip />
        */}
        {/* SIS-101 — o `<NotchDivider cor="#f5faff" invertido />` e o
            `<SignalMarquee />` ficavam aqui, num wrapper de serifa editorial.
            Os dois saíram deste lugar, por motivos diferentes:

            O CHANFRO foi REMOVIDO. Ele existia para negociar a fronteira entre o
            palco da Metrics e a faixa de logos, e já vinha sendo recalibrado duas
            vezes (SIS-75 o pintava de `--deep`, para uma fronteira escuro↔escuro;
            SIS-91 o inverteu e o pintou de `#f5faff`, quando a faixa virou
            off-white). SIS-101 corta a premissa em vez de recalibrar de novo: com
            a faixa dentro da seção dos números, não há duas seções para chanfrar.
            Um chanfro precisa de dois blocos; com um só, a diagonal termina no
            vazio — que é exatamente o defeito relatado.

            A FAIXA foi MOVIDA para dentro de `Metrics.tsx`, depois do percurso do
            palco, como rodapé da seção "Escala que transforma o mercado de
            seguros." A nota longa está lá. O wrapper da serifa não foi com ela: a
            faixa é só logos, não tem uma palavra de texto.

            O componente `ui/NotchDivider.tsx` continua no projeto e é usado por
            outras páginas — só este consumo saiu. */}
        </ProofJourney>
        {/* Travessia do tile "Arquitetura modular e escalável" até a foto do card
            01 de Soluções. Fica DEPOIS da jornada inteira, e é irmão direto dela:
            o viajante é `position: fixed`, que morre sob ancestral com
            `transform`/`filter`, e a ordem na árvore é o que o faz pintar por
            cima do fundo de Soluções sem disputa de `z-index`. Decorativo e
            `aria-hidden` — sem ele o tile fica no mosaico e a foto no palco. */}
        <MosaicHandoff />
        {/* "Sobre nós / A Sistran" saiu da home a pedido: o texto institucional
            agora vive só em `/quem-somos`, que já monta o mesmo `<About />`.
            Duplicá-lo aqui repetia a apresentação da empresa duas vezes no
            mesmo funil — e era a cópia da home que ainda dizia "150 clientes"
            em vez de 130. Componente preservado; só o consumo daqui saiu. */}
        {/* Montagem presa ao scroll. Portada da apresentação de legado junto com
            o vídeo. O wrapper existia para gravar `--font-legacy-serif`; com a
            serifa no layout raiz (TIPOGRAFIA.md) ele não carrega mais nada, e
            ficou só como o `<div>` que já delimitava a seção. Conteúdo em
            `src/data/legacy.ts` (`impactSequence`). Fora do `SectionReveal`: a
            seção já tem o próprio percurso de scroll. */}
        <div>
          <ImpactSequence />
        </div>
        {/* "Entrega com Alta Performance e Comprometimento" comentada a pedido —
            os quatro cards numerados (01 Conhecimento em Seguros, 02
            Flexibilidade, 03 Tecnologia, 04 Solidez e permanência) e a linha
            "Empresas que aderem a tecnologia em seus processos estão sempre a
            frente no mercado!". Comentada, e não removida: o componente
            `src/components/Differentials.tsx` e os dados em
            `src/data/differentials.ts` continuam intactos, então religar é
            descomentar este bloco e o import no topo do arquivo.
        <div className="section-light">
          <SectionReveal><Differentials /></SectionReveal>
        </div>
        */}
        {/* `<Metrics />` saía daqui: subiu para o lugar do bloco "Resultados |
            evidências dos casos", logo depois do `MosaicHandoff`. `<Solutions />`
            também já não é daqui — foi para o lugar do Método. */}
        {/* Ordem da home do site: contato -> LinkedIn -> "Fale com a Gente!"

            Os três `SectionReveal` que envolviam Contato, Social e ContactCTA
            saíram: eles não faziam nada. O wrapper anima só os nós marcados com
            `data-reveal`, e esse atributo não existia em NENHUM lugar do projeto
            — era um invólucro inerte. Pior: as três seções já se encenam
            sozinhas, cada uma do seu jeito (o Contato pelo `--ct-surgir` do
            próprio percurso sticky, o Social e o ContactCTA por `whileInView` do
            Motion, mais a digitação do título no último). Marcar `data-reveal`
            dentro delas criaria DUAS animações de entrada disputando o mesmo
            elemento. O componente `ui/SectionReveal.tsx` fica no lugar, intacto,
            para quem precisar de reveal em bloco numa seção que não tenha o
            próprio. */}
        {/* `emenda-de-escuro` saiu daqui junto com a subida da Metrics: a classe
            existia porque "Sistran em números" fechava em palco escuro
            (`#041a33`) e o Contato abria em branco. Quem encosta no Contato
            agora é a montagem (`lp-section--cream`), que já é clara — manter o
            navy pintado na borda de cima deste bloco criaria uma faixa escura
            onde não há nada de escuro para emendar.

            A regra `.emenda-de-escuro` continua no `globals.css`, intacta, para
            a próxima emenda escuro -> claro que aparecer. */}
        {/* SIS-103 — `emenda-luminna` é o que resolve a fronteira com a montagem
            logo acima: tira o fio branco de 1px que `.section-light` pinta no topo
            (feito para bloco claro sobre navy, e aqui em cima não há navy) e traz
            o `--cream` da montagem como primeira camada do fundo, dissolvido em
            26svh. Regra e justificativa completas em `globals.css`.

            A classe é só desta emenda: se a montagem sair daqui ou deixar de ser
            a vizinha de cima, ela sai com ela. */}
        <div className="section-light emenda-luminna">
          <Contact />
        </div>
        {/* SIS-107 — a EMENDA 6 (o `#d2e5ed` do fim do contato dissolvido em
            220px) saiu da regra base de `.palco-reativo` e virou esta classe: ela
            só faz sentido onde a vizinha de cima é clara, e isso só acontece na
            home. Nas outras duas rotas que montam a Social o que vem acima é
            escuro, e lá o degradê era uma faixa clara sobre navy. */}
        <Social className="palco-emenda-de-claro" />
        {/* "Fale com a Gente!" comentado a pedido — o cartão azul com o título,
            as duas linhas ("Quer conversar com um de nossos especialistas?..." /
            "Temos uma equipe qualificada...") e o botão "Fale com a SISTRAN".
            Quem fecha a página agora é o `<Social />`, e o `<Footer />` vem logo
            depois.

            Comentado, e não removido: `src/components/ContactCTA.tsx` continua
            intacto e fecha OUTRAS OITO páginas (`/blog`, `/blog/[slug]`, `/esg`,
            `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`,
            `/solucoes/[slug]`) — todas seguem como estavam. Religar é descomentar
            a linha abaixo e o import no topo do arquivo.

            Eram nove, e `/eventos-inovacao` estava na lista: a SIS-152 comentou o
            bloco lá também, pelo mesmo motivo e do mesmo jeito. Contagem conferida
            uma a uma (`grep '<ContactCTA' src/app`): dez chamadas no repositório,
            duas comentadas — esta e a de `/eventos-inovacao`.

            A prop `motionShowcase` (digitação do título, entrada encadeada e
            grafismo técnico) só era usada aqui, então é a única coisa que sai de
            circulação junto: quem religar precisa saber que esse modo existe.
        <ContactCTA motionShowcase />
        */}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
