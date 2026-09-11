import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import HeroVideoBackdrop from "@/components/ui/HeroVideoBackdrop";
/* SIS-166 — os dois imports saíram junto com o consumo (ver a nota no lugar
   deles, no corpo da página). Comentados, e não removidos: import ativo sem uso
   quebra o lint, e apagar apagaria a pista de como religar.
// import EventsMosaic from '@/components/EventsMosaic';
// import EventsGrid from '@/components/EventsGrid'; */
import EventsSpotlight from "@/components/EventsSpotlight";
import Social from "@/components/Social";
/* SIS-152 — comentado junto com o consumo no fim do arquivo. Import ativo sem uso
   quebra o lint; apagar apagaria a pista de como religar. Mesmo padrão da home
   (`src/app/page.tsx:15`, SIS-54). */
// import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: "Eventos & Inovação · Sistran",
};

/* A pagina do site é so a sequencia dos 15 eventos: nao tem abertura, nem
   introducao, nem heading de pagina. O hero abaixo carrega apenas o titulo do
   menu ("Eventos & Inovação") — sem paragrafo de apoio e sem a faixa de
   numeros que existia aqui ("Eventos mapeados", "24/7 Conhecimento em
   movimento"), que nao estao escritos em lugar nenhum.
   Fonte: .claude/conteudo-site/06-eventos-inovacao.md
   ─────────────────────────────────────────────────────────────────────────────
   Continuidade cinematográfica desta rota. TRÊS capítulos, DUAS passagens, um
   elo por passagem — nunca cor, máscara, zoom e blur juntos na mesma:

     hero -> eventos ..... LINHA. O fio ciano nasce na base do hero e reaparece
                           como o segmento aceso da RÉGUA da cena de eventos —
                           mesma cor, mesma espessura, mesma direção. O elo
                           sobreviveu a duas trocas de apresentação (carrossel ->
                           índice editorial -> cena full-bleed) porque ele é uma
                           regra de cor e forma, não um componente.
                           A cor da passagem é resolvida pelo `.evento-veu-topo`,
                           que é higiene, não elo: a cena é escura como o hero, e
                           o véu existe sobretudo para manter o cabeçalho fixo
                           legível sobre qualquer uma das quinze fotos.
                           SIS-215 — o `.evento-veu-topo` é do `EventsGrid`, que
                           saiu da rota na SIS-166; e a cena que ficou não é mais
                           escura em cima. A passagem continua sendo por LINHA (o
                           fio ciano), agora sobre aresta: hero navy encostando em
                           `#eaf2fb`, como `/parceiros-e-implementacoes` publica.
     eventos -> social ... COR, e agora em AZUL CLARO. Era "a cena escura converge
                           para `#0b4e86`, a primeira parada do degradê da Social".
                           SIS-215: a cena fecha em `#cfe7f7` e a Social passou a
                           `.palco-emenda-de-claro-curta`, que dissolve esse mesmo
                           `#cfe7f7` nos primeiros 150px dela. A convergência
                           mudou de lado da fronteira — quem dissolve agora é quem
                           recebe.
   SIS-152 — a terceira passagem (`social -> contato`, COR: a Social fecha em
   `#1273bc` e o contato recebia aquele azul no topo pela `.emenda-de-azul-medio`)
   deixou de existir junto com o capítulo de contato, que saiu da rota. Não sobrou
   fronteira a tratar no lugar dela: quem encosta na Social agora é o rodapé, que
   já é a mesma cor (ver o comentário no fim do arquivo). Com isso caiu também a
   regra de "redução deliberada de movimento onde está a ação", que era sobre o
   capítulo de conversão — a rota não tem mais um.

   Nada aqui é pinado com ScrollTrigger, e SIS-166 não mudou isso. O capítulo
   dominante continua fixando o palco com `position: sticky`, que é do navegador:
   sem timeline, sem `refresh()` em resize e sem altura fingida. O que rola são
   quinze sentinelas em fluxo normal, e quem diz qual evento está no centro é um
   `IntersectionObserver` — não há fração de progresso a calibrar. Um `pin` de
   biblioteca em cima disso seria um segundo dono da mesma posição.
   (Antes de SIS-166 o que rolava eram quinze blocos de TEXTO em fluxo passando por
   cima do palco. A mecânica é a mesma; o que mudou é que o texto passou a ser lido
   no cartão central, e não em blocos que rolam.) */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-105 — vídeo em laço atrás da abertura, mesmo tratamento de
          `/solucoes` e `/quem-somos` (o componente é o mesmo, inclusive o
          desligamento por `prefers-reduced-motion`, que vive lá dentro).

          O wrapper envolve SÓ o hero, como em `/quem-somos`: o que vem depois é
          a cena de eventos, que abre com o `.evento-veu-topo` e com o palco
          full-bleed das quinze fotos. Levar o vídeo até lá colocaria dois takes
          disputando o mesmo fundo, e a emenda hero -> eventos (o fio ciano da
          base do hero reaparecendo como o realce do navegador lateral) precisa
          nascer sobre o navy chapado para ser vista.

          O arquivo é `eventos-hero-loop.mp4`, no padrão de nome das outras duas
          rotas. Ele foi remontado a partir do take entregue (`evento.mp4`, 4,8
          MB, 1920×1080, 8 s, COM trilha de áudio e com o `moov` no fim do
          arquivo) porque nada disso servia como está:

          • A VOLTA NÃO FECHAVA. Medido por SSIM: último quadro contra o primeiro
            dava 0,46, enquanto um quadro qualquer do meio contra o primeiro dava
            0,50 — ou seja, a emenda do laço era MAIS visível que um corte no
            meio. A cauda de 1,2 s foi dissolvida no próprio começo (o mesmo
            recurso que fez o `-loop` de `/solucoes` existir) e a emenda subiu
            para 0,91 contra 0,63 do par de controle.
          • MARCA D'ÁGUA. O take traz "Veo" no canto inferior direito. Recorte de
            1824×1026 a partir do canto superior esquerdo — proporção 16:9 exata,
            então não há distorção — e volta para 1920×1080.
          • PESO E ÁUDIO. `-an` (vídeo de fundo não tem som, e som impede o
            autoplay) e `-movflags +faststart`, que leva o `moov` para o início
            para o arquivo começar a tocar antes de terminar de baixar. 4,8 MB
            viraram 1,2 MB, na mesma ordem dos outros dois laços (2,5 MB e 3,2
            MB) — o que importa nesta rota, que já é a mais pesada em imagem
            depois da SIS-104.

          O pôster é o primeiro quadro DO LAÇO (não do take original), em WebP de
          36 KB — é ele que aparece antes do vídeo chegar e é ele, parado, que
          fica para quem pede menos movimento. */}
      <HeroVideoBackdrop
        src="/videos/eventos-hero-loop.mp4"
        poster="/videos/eventos-hero-loop-poster.webp"
        className="hero-backdrop--eventos"
        foco="50% 50%"
      >
        <PageHero title="Eventos &" highlight="Inovação" cinematografico />
      </HeroVideoBackdrop>

      {/* SIS-160 — mosaico das quinze fotos como ABERTURA, entre o hero e o
          palco. Ele NÃO substitui o palco: o palco é onde se lê (título,
          descrição e categoria dos eventos não existem em outro lugar da rota), e
          o mosaico é decoração — os quinze cartões são `aria-hidden` e nenhum é
          focável. A justificativa completa está no cabeçalho de
          `src/components/EventsMosaic.tsx`.

          A CONTINUIDADE DA ROTA NÃO GANHOU UMA QUARTA PASSAGEM, e isso foi
          apurado antes de escrever CSS: o mosaico se insere DENTRO da passagem
          `hero -> eventos`, que é por LINHA. O fio ciano da base do hero passa a
          desembocar no mosaico, e o que ele encontra aceso lá é a mesma linha
          continuada (`.eventos-mosaico-fio`, com os valores do `.pagehero-fio`).
          Do outro lado, o mosaico fecha em `#041d37`, que é a primeira parada do
          degradê de `.evento-cena`: cor igual encostando em cor igual, sem emenda
          nova. Os dois elos descritos acima seguem valendo palavra por palavra.

          ── SIS-166: OS DOIS BLOCOS SAÍRAM DAQUI ────────────────────────────
          `<EventsMosaic />` (a abertura decorativa descrita acima) e
          `<EventsGrid />` (o palco de quinze telas, com as sete pílulas de filtro
          e o navegador lateral) foram substituídos por UMA cena:
          `<EventsSpotlight />`, logo abaixo. O desenho é OUTRO, entregue pela
          pessoa que pediu — cartão central que troca com a rolagem, duas colunas
          de miniaturas nas bordas, a vaga do evento em destaque vazia e tracejada,
          fio ciano ligando as duas e o contador `01 / 15`.

          Comentados, e não removidos (regra do projeto): os dois componentes, o
          CSS deles no `globals.css` (`.eventos-mosaico-*`, `.evento-cena`,
          `.evento-palco`, `.evento-filtros`, `.eventos-emenda-base`) e
          `src/data/events.ts` continuam intactos. A SIS-160 é a issue do mosaico
          que esta cena substitui e fica como registro do que existiu — não foi
          reaberta nem editada.

          O QUE SAI DE CIRCULAÇÃO junto, para ninguém descobrir depois: as sete
          pílulas de filtro moravam dentro do `EventsGrid`. A cena nova nasce com
          os quinze na ordem do catálogo, sem filtro — decisão registrada na
          SIS-166, e é ela que deixou SIS-150, SIS-148 e SIS-151 canceladas. Se o
          filtro voltar, ele governa o percurso (o contador passa a ser
          `01 / N do recorte`) e as colunas.

          AS DUAS PASSAGENS DA ROTA CONTINUAM AS MESMAS, e isto foi apurado antes
          de escrever CSS. `hero -> eventos` é por LINHA: o fio ciano da base do
          hero desemboca no `.eventos-destaque-fio`, que tem os valores do
          `.pagehero-fio` — a mesma linha continuada, como era com o mosaico.
          `eventos -> social` é por COR: a cena nova FECHA em `#041d37`, e a
          `<Social className="palco-de-cena-escura">` logo abaixo já espera escuro
          em cima. Nenhuma fronteira nova foi criada: a superfície da cena é clara
          no meio (é lá que se lê a descrição) mas nasce e morre no navy dos dois
          vizinhos, num degradê só — a mesma receita do mosaico.
          ⚠️ SIS-215 — este parágrafo descreve o que a cena ERA. As duas pontas
          navy saíram (a superfície é clara de ponta a ponta) e a Social desta rota
          trocou de classe. O que valia é o que está escrito ao lado de cada um dos
          dois blocos, logo abaixo e no cabeçalho deste arquivo. */}
      <EventsSpotlight />

      {/* SIS-215 — A CLASSE MUDOU: `palco-de-cena-escura` -> `palco-emenda-de-claro-curta`.

          A nota da SIS-107 fica registrada porque a premissa dela era verdadeira
          quando foi escrita, e é ela que explica por que a emenda de claro havia
          sido retirada daqui:

          | SIS-107 — sem `palco-emenda-de-claro`: aqui o que vem acima é a cena
          | ESCURA de eventos, que já entrega o azul por conta própria (ver
          | `.eventos-emenda-base`). O degradê claro que a Social pintava na regra
          | base era, nesta rota, uma faixa clara nascendo do nada sobre navy — o
          | segundo corte da issue.

          A PREMISSA CADUCOU: a cena de eventos NÃO É MAIS ESCURA EM CIMA NEM
          EMBAIXO. A SIS-215 tirou as duas pontas navy dela (ver a nota da
          superfície em `src/components/events-spotlight.css`), e a cena agora
          FECHA em `#cfe7f7`. Com isso a faixa clara da emenda deixa de "nascer do
          nada sobre navy": ela é a continuação da cor que a cena entrega. Manter
          `palco-de-cena-escura` aqui é que passaria a ser o defeito — ela abre em
          `#0b4e86` chapado, e claro encostando em azul médio numa linha reta de
          ponta a ponta é exatamente o corte que a SIS-107 combateu, só do outro
          lado da fronteira (medido antes desta issue: degrau de 79/255 no verde
          entre `#041d37` e `#0b4e86`).

          POR QUE A VARIANTE `curta` e não `.palco-emenda-de-claro`: a curta parte
          de `#cfe7f7` (a longa parte de `#d2e5ed`, a cor com que a home entrega a
          borda) e é a mesma que `/contato` publica. Cor igual encostando em cor
          igual, sem inventar uma quarta variante. Ela traz junto os dois ajustes
          que a rampa exige e que já foram medidos na SIS-130: `padding-top` de
          11/13rem, para o título branco não cair DENTRO dos 150px claros, e as
          máscaras que fazem as duas luzes e o orb ciano entrarem do zero nesses
          mesmos 150px, em vez de nascerem acesos na borda clara. */}
      <Social className="palco-emenda-de-claro-curta" />

      {/* SIS-152 — "Fale com a Gente!" comentado a pedido. Quem fecha a rota agora
          é o `<Social />` acima, e o `<Footer />` vem logo depois.

          A EMENDA NÃO PRECISOU DE RECURSO NOVO, e isto foi apurado antes de
          escrever qualquer coisa (era o risco nomeado na issue). A
          `.emenda-de-azul-medio` existia para o CTA RECEBER no topo o `#1273bc` em
          que a Social termina. Sem o CTA, quem recebe é o rodapé — e o rodapé já é
          `bg-[#1273BC]/85` (`Footer.tsx:18`), a MESMA cor: a última parada do
          degradê de `.palco-de-cena-escura` é `#1273bc 100%` (`globals.css:9543`).
          Ou seja, a junção nova é cor igual encostando em cor igual, e é
          literalmente a junção que a home já publica desde a SIS-54, onde a Social
          também é a última seção. Reaproveitar essa decisão é o que a issue pede;
          inventar uma terceira emenda aqui seria repetir o defeito que a SIS-107
          removeu (duas emendas sobrepostas na mesma fronteira).

          A `.emenda-de-azul-medio` continua no `globals.css`, intacta e agora sem
          consumidor nesta rota — como `.emenda-de-escuro` na home, fica para a
          próxima fronteira azul-médio que aparecer. Não é animação órfã: é regra de
          fundo, não transição, então sem consumo ela simplesmente não pinta.

          Consequência assumida e registrada: a página perde a sua única chamada
          para ação. Quem termina os quinze eventos tem como saída o "Contato" do
          cabeçalho e o do rodapé. Nenhum substituto foi inventado aqui.

          Religar é descomentar a linha abaixo e o import no topo do arquivo.
      <ContactCTA className="emenda-de-azul-medio" />
      */}
    </PageShell>
  );
}
