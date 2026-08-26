import { Instrument_Serif } from 'next/font/google';
import Header from '@/components/Header';
import HeroCinematic from '@/components/HeroCinematic';
// Import comentado junto com o consumo da seção logo abaixo (ver o comentário
// em volta de `<Differentials />`): deixá-lo ativo quebraria o lint por import
// não utilizado, e removê-lo apagaria a pista de como religar a seção.
// import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import Solutions from '@/components/Solutions';
import Social from '@/components/Social';
import Contact from '@/components/Contact';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ScrollSpy from '@/components/ui/ScrollSpy';
// Import comentado junto com o consumo do fio condutor logo abaixo (ver o
// comentário em volta de `<ScrollSpine />`): deixá-lo ativo quebraria o lint por
// import não utilizado, e removê-lo apagaria a pista de como religar o fio.
// import ScrollSpine from '@/components/ui/ScrollSpine';
import BackToTop from '@/components/ui/BackToTop';
import MosaicHandoff from '@/components/ui/MosaicHandoff';
// Import comentado junto com os wrappers que saíram da home (ver a nota acima de
// `<Contact />`): o componente continua no projeto, mas a home não o consome mais
// — deixá-lo importado quebraria o lint por import não utilizado.
// import SectionReveal from '@/components/ui/SectionReveal';
import OptionalMorphIntro from '@/components/intro/OptionalMorphIntro';
import NotchDivider from '@/components/ui/NotchDivider';
import { StackScenes } from '@/components/legacy/StackScenes';
import { MetricsStrip } from '@/components/legacy/MetricsStrip';
import { SignalMarquee } from '@/components/legacy/SignalMarquee';
import { ImpactSequence } from '@/components/legacy/ImpactSequence';

/* A serifa editorial existe só para o mosaico (e para /transformacao-legado) —
   o layout raiz continua com Inter + Sora. Exposta como `--font-legacy-serif`,
   nome que `legacy.css` consome em `--font-editorial`. */
const editorial = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-legacy-serif',
  display: 'swap',
});

export default function Page() {
  return (
    <>
      {/* Abertura opcional: so na home, so uma vez por sessao, e sempre por
          cima de uma pagina que ja terminou de renderizar por baixo. */}
      <OptionalMorphIntro />
      <Header />
      <ScrollSpy />
      {/* A serifa editorial é declarada no `main`, e não num wrapper em volta do
          hero: um `<div>` ali quebraria `#top + *` no `globals.css` — a seção
          seguinte deixaria de ser irmã do hero e perderia o `z-index` que a faz
          subir por cima dele. */}
      <main id="conteudo" tabIndex={-1} className={editorial.variable}>
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
        <div className={editorial.variable}>
          <StackScenes />
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
        <Solutions />
        {/* Travessia do tile "Arquitetura modular e escalável" até a foto do card
            01 de Soluções. Fica DEPOIS das duas seções, e é irmão direto delas:
            o viajante é `position: fixed`, que morre sob ancestral com
            `transform`/`filter`, e a ordem na árvore é o que o faz pintar por
            cima do fundo de Soluções sem disputa de `z-index`. Decorativo e
            `aria-hidden` — sem ele o tile fica no mosaico e a foto no palco. */}
        <MosaicHandoff />
        {/* Resultados logo DEPOIS do método, como na apresentação de legado:
            primeiro os quatro movimentos, depois as evidências que os comprovam.
            Antes eles fechavam o percurso do hero, e saíram de lá a pedido.

            O chanfro leva o navy da seção para dentro da faixa clara de
            parceiros, que encerra o bloco — as evidências dos casos emendam na
            prova de terceiros. Números em `src/data/legacy.ts`, marcas em
            `src/data/clients.ts`. */}
        <div className={editorial.variable}>
          <MetricsStrip />
          {/* `--deep` é declarada em `:root` pelo `legacy.css`, importado pelo
              próprio `MetricsStrip` acima. */}
          <NotchDivider cor="var(--deep)" />
          <SignalMarquee />
        </div>
        {/* "Sobre nós / A Sistran" saiu da home a pedido: o texto institucional
            agora vive só em `/quem-somos`, que já monta o mesmo `<About />`.
            Duplicá-lo aqui repetia a apresentação da empresa duas vezes no
            mesmo funil — e era a cópia da home que ainda dizia "150 clientes"
            em vez de 130. Componente preservado; só o consumo daqui saiu. */}
        {/* Montagem presa ao scroll. Portada da
            apresentação de legado junto com o vídeo; o wrapper da serifa é o que
            fornece `--font-legacy-serif`, que o `legacy.css` consome no título.
            Conteúdo em `src/data/legacy.ts` (`impactSequence`). Fora do
            `SectionReveal`: a seção já tem o próprio percurso de scroll. */}
        <div className={editorial.variable}>
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
        {/* "Sistran em números" saiu do `SectionReveal` e do `.section-light`
            pelas mesmas duas razões da montagem acima: ela tem percurso de
            scroll próprio (o reveal do wrapper brigaria com o sticky) e desenha
            os dois fundos que precisa — faixa clara em cima, palco escuro
            embaixo. Dentro do `.section-light` o degradê do bloco pintaria por
            cima do palco e o repinte de texto navy apagaria os números. */}
        <Metrics />
        {/* `<Solutions />` saía daqui: subiu para o lugar do Método, logo depois
            do mosaico. "Sistran em números" emenda direto no bloco claro de
            Contato — as duas já resolvem a própria costura de cor (a Metrics
            desenha faixa clara em cima e palco escuro embaixo). */}
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
        {/* `emenda-de-escuro`: "Sistran em números" fecha em palco escuro
            (`#041a33`) e o Contato abre em branco — era corte reto. A classe
            pinta o navy da seção anterior na borda de cima deste bloco e o
            dissolve para baixo, então a cor de saída de uma é a cor de entrada
            da outra. Fica do lado do Contato, e não no fim da Metrics, porque
            lá embaixo há números claros sobre o escuro: clarear aquele fundo
            arruinaria o contraste do texto. */}
        <div className="section-light emenda-de-escuro">
          <Contact />
        </div>
        <Social />
        {/* `motionShowcase`: digitacao do titulo, entrada encadeada e grafismo
            tecnico. Só aqui — o mesmo ContactCTA fecha outras nove paginas e
            elas continuam como estavam. */}
        <ContactCTA motionShowcase />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
