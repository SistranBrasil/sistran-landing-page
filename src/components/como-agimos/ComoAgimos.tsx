import Image from 'next/image';
import RevealScope from '@/components/motion/RevealScope';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { COMO_AGIMOS } from '@/data/aSistran';
import { ICONS, type IconName } from '@/lib/icons';
import './como-agimos.css';

/**
 * «Como Agimos» de `/quem-somos`, refeita sobre duas peças que a casa passou a ter:
 * o carimbo `public/carimbo-agimos-ticket-outline-ffffff.png` e a tipografia
 * manuscrita de `docs/fonte2.md`.
 *
 * O QUE ESTA SEÇÃO ERA: um `TituloAceso` escrito «Como / Agimos» e, embaixo, oito
 * `glass-card-hover notch-card barra-sinal` numa grade de 2/4 colunas, cada um com
 * um `num-monumental` e um `degrau-*`. O JSX antigo fica comentado ao pé deste
 * arquivo. Três coisas o substituíram, e nenhuma é enfeite:
 *
 * 1. O CARIMBO JÁ É O TÍTULO. Ele não é um selo que se pousa ao lado de um `h2` —
 *    a arte entregue traz escrito «COMO / Agimos» dentro do bilhete, junto da marca
 *    Sistran. Mantido o `TituloAceso`, a seção teria o próprio nome duas vezes, uma
 *    em tipografia e outra em tinta. Então o `<h2 id="como-agimos">` passou a ser o
 *    carimbo, com `alt="Como Agimos"` — exatamente o que a SIS-87 fez nesta mesma
 *    página com o logo da ISG (`IsgProviderLens.tsx:132-143`), e pela mesma razão:
 *    o texto acessível do heading é o `alt`, `aria-labelledby="como-agimos"`
 *    continua resolvendo para a mesma frase, o índice de cabeçalhos não perde um
 *    nível, e o ScrollSpy de `src/data/pageSections.ts:75` continua achando a
 *    âncora. Foi por isso que `TituloAceso` saiu daqui, e SÓ daqui: o efeito de
 *    acender palavra por palavra pressupõe texto, e aqui não há.
 * 2. OS OITO CARTÕES VIRARAM UM BILHETE PICOTADO. O carimbo é um `ticket-outline`
 *    (é o nome do formato no gerador, `src/app/admin/carimbo/GeradorCarimbo.tsx`):
 *    borda arredondada, fio interno tracejado, canto recortado. A casa diz que
 *    «carimbo é tinta NO papel, não peça sobre ele» (`globals.css:22493-22580`), e
 *    a consequência honesta disso é o papel ter a silhueta da tinta. Os oito
 *    valores são os oito talões de UM bilhete, separados por costura picotada, com
 *    dois furos de destaque nas laterais. É a mesma troca que a SIS-87 fez na ISG:
 *    oito cartões iguais lado a lado não dizem nada sobre o conteúdo, e o conteúdo
 *    aqui é uma lista de valores que se sustentam juntos.
 * 3. A PRIMEIRA FRASE É MANUSCRITA. `docs/fonte2.md` pede Kalam, peso 400,
 *    `line-height: 0.95`, `clamp(30px, 3vw, 50px)`, tombo -4deg e um traço ciano de
 *    ~45px desenhado da esquerda para a direita na entrada — e exige que seja TEXTO
 *    HTML editável, nunca embutido em imagem. É o que está abaixo. A fonte já vem
 *    carregada em `src/app/layout.tsx:236` com `variable: '--font-kalam'`; esta é a
 *    quarta consumidora, e nenhuma fonte nova entrou no projeto.
 *
 * ── SIS-277 · O BILHETE PICOTADO SAIU; SÃO OITO CARDS INDEPENDENTES ────────────
 * Os itens 2 e 3 do bloco acima ficam como HISTÓRICO: a metáfora do bilhete único
 * era invenção desta casa, e a spec fechada da seção (`docs/comagimos.md` + o mock
 * `public/imagensexemplo/exemplocomoagimos.png`) pede o contrário dela, item por
 * item. O que o documento manda, e o que agora está aqui:
 *   · §3 «Substitua a tabela atual por oito cards INDEPENDENTES», «os cards não
 *     podem parecer células de uma tabela», «manter espaçamento visível entre os
 *     cards». O rolo picotado era exatamente o proibido: `gap: 0`, costura tracejada
 *     entre talões e uma borda só em volta dos oito — ou seja, uma tabela com a
 *     silhueta de bilhete. Saíram as costuras, a máscara dos dois furos laterais e a
 *     borda do rolo; cada card passou a ter borda, raio e sombra próprios, com `gap`
 *     entre eles (as medidas estão no CSS, todas do §4 e do §8).
 *   · §1 «Remova completamente os números 01–08. Não deixe espaços vazios ou
 *     elementos decorativos que pareçam numeração.» O `<span className="agimos-serie">`
 *     saiu junto com o fio curto do `::after` dele — o fio era decoração DA série, e
 *     mantê-lo sozinho deixaria no card justamente o «elemento decorativo que parece
 *     numeração» que a frase proíbe. Restam duas peças por card, as do §3: o selo do
 *     ícone à esquerda e o nome do valor à direita, nada mais.
 *   · §5 «Integração: pessoas ou nós conectados» → `Network`, no lugar de `Boxes`
 *     (caixas de estoque). É o glifo que o mock desenha ali. `Network` entrou no
 *     registro `src/lib/icons.ts` nesta passada; nenhuma dependência nova.
 *   · §9 entrada entre 450ms e 600ms → `duracao={0.55}` e `distancia={20}` (o teto de
 *     deslocamento do documento; o padrão do componente era 22px).
 * O QUE NÃO MUDOU, e é de propósito: o carimbo continua sendo o `<h2 id="como-agimos">`
 * (item 1 acima segue valendo — o mock também desenha o carimbo como o título da
 * coluna esquerda), a frase manuscrita continua sendo TEXTO HTML com o traço ciano do
 * `docs/fonte2.md`, a grade de duas colunas continua, e a ordem dos oito valores
 * continua a de `COMO_AGIMOS` — que, numa grade de duas colunas por linha, produz
 * exatamente o arranjo do mock (Ética | Transparência, depois Valorização Humana |
 * Integração, e assim por diante).
 *
 * NENHUMA PALAVRA FOI REESCRITA. O texto é o mesmo de sempre, e os oito valores
 * continuam vindo de `COMO_AGIMOS` (`src/data/aSistran.ts:86`). O único ajuste é
 * onde as duas frases do parágrafo de abertura são repartidas — ver `ABERTURA`.
 *
 * ── 24/09 · O DESENHO DA SEÇÃO, REFEITO (a pedido: «faça um design para a seção») ─
 * A forma anterior empilhava tudo numa coluna: carimbo, frase manuscrita, prosa e,
 * embaixo, o bilhete de oito talões em quatro colunas. Medido na captura a 1440
 * (`.tmp-agimos/antes-1440.png`, o retrato que abriu esta passada), era isso que
 * havia de errado, e nada disso é gosto:
 *   · o bilhete media 790px dos 1180px do `container-lp` e parava na metade da
 *     altura da seção — sobrava um terço da largura e uma faixa inteira de navy
 *     vazio à direita dos oito valores;
 *   · cada talão tinha ~197px de largura e 118px de altura, com número de 12px e
 *     nome de 17px: o CONTEÚDO da seção (os oito valores) lia como rodapé de uma
 *     tabela, enquanto a decoração (carimbo + manuscrito) ocupava o dobro da área;
 *   · a 390 a frase manuscrita saía dos dois lados da tela. A causa está no CSS
 *     (`width: max-content` numa frase de 52 caracteres, mais o tombo de -4deg), e
 *     é lá que foi corrigida.
 * O que este arquivo muda: a seção passa a ser DE DUAS COLUNAS — a abertura
 * (carimbo, frase à mão, prosa) num trilho à esquerda e o bilhete inteiro ao lado,
 * em duas colunas de quatro talões. O bilhete deixa de ser um apêndice embaixo do
 * título e passa a ser a metade direita da composição, que é onde havia vazio.
 * Continua sendo UM bilhete picotado, com as mesmas costuras e as mesmas duas
 * perfurações laterais — a metáfora do carimbo `ticket-outline` não mudou, mudou
 * onde ela se apoia.
 *
 * E CADA TALÃO GANHOU UM SELO DE ÍCONE, pela razão que os Diferenciais desta mesma
 * página já registram: oito linhas de texto em corpo pequeno, todas com a mesma
 * silhueta, não se distinguem à vista — o glifo é o que dá a cada valor um ponto de
 * entrada. Os ícones vêm do registro fechado `src/lib/icons.ts` (nada importado
 * solto aqui) e são `aria-hidden`: repetem o que o nome do valor já diz, e
 * anunciados viriam antes de cada item como ruído.
 */

/* As duas frases da abertura, repartidas no PONTO que já as separava. A primeira é
 * a que vai à mão; a segunda é a que entrega a lista, e por isso continua em prosa
 * do corpo — uma frase que termina em dois pontos tem de ficar colada no que ela
 * anuncia.
 * ESTÃO ESCRITAS AQUI, e não em `aSistran.ts`, pelo mesmo motivo do `semDoisPontos`
 * da ISG: o corte é de RENDERIZAÇÃO, não de dado. Mas com uma diferença que vale
 * dizer — o parágrafo antigo era literal no JSX da página, não vinha de `aSistran`,
 * então não há dado a preservar; o que se preserva é o texto travado em
 * `copy-lock.json`, e ele é a concatenação exata das duas linhas abaixo, com um
 * espaço entre elas. */
const ABERTURA = {
  mao: 'Nossos valores são a base da nossa cultura organizacional.',
  prosa: 'Respeitando as individualidades, prezamos pela:',
} as const;

/* O SELO DE CADA VALOR.
   MORA AQUI, e não em `COMO_AGIMOS`, ao contrário do que a casa fez com
   `DIFERENCIAIS_6` — a exceção é medida e tem prazo. `copy-lock.json` trava todo
   literal de `src/data/**`, nomes de ícone incluídos (`"PieChart"` está lá, linha
   966), e hoje `npm run test:copy` JÁ reprova por copy pendente de outras entregas
   (a galeria de reconhecimentos, `Gem`, `Columns3`). Levar oito nomes de ícone ao
   dado obrigaria a regravar o lock nesta passada, e regravá-lo com o portão vermelho
   absorveria em silêncio a escrita pendente de outra pessoa — que é justamente o que
   o portão existe para impedir. Quando o lock voltar ao verde, mover isto para
   `aSistran.ts` com `satisfies` é a forma preferida da casa.
   E O VALOR É O PRÓPRIO COMPONENTE, vindo de `ICONS`, em vez do nome dele passado a
   `getIcon`. Medido, e não preferência: com os oito nomes escritos como string o
   extrator os colheu deste arquivo (`Scale`, `Eye`, `BadgeCheck`, `Handshake` entram
   como copy nova; `Boxes`, `Sparkles` e `HeartHandshake` sobem de contagem) — ou
   seja, o mapa vazava para o portão de escrita mesmo fora de `src/data`. Referência
   ao registro não é literal nenhum, então o lock não vê nada. `ICONS` continua sendo
   a lista fechada do site: nada é importado solto de `lucide-react` aqui.
   A CHAVE é o texto do valor, e o tipo garante os oito: renomeie ou remova um item
   de `COMO_AGIMOS` e isto para de compilar em vez de chegar à tela sem selo. */
const SELO: Record<(typeof COMO_AGIMOS)[number], (typeof ICONS)[IconName]> = {
  Ética: ICONS.Scale,
  Transparência: ICONS.Eye,
  'Valorização Humana': ICONS.HeartHandshake,
  /* SIS-277 — era `ICONS.Boxes`. O §5 do documento pede «pessoas ou nós conectados»
     para Integração e nomeia `Network`; `Boxes` é caixa empilhada, que conta outra
     história. O mock desenha figuras ligadas neste card. */
  Integração: ICONS.Network,
  Inovação: ICONS.Sparkles,
  Qualidade: ICONS.BadgeCheck,
  Comprometimento: ICONS.Handshake,
  Profissionalismo: ICONS.BriefcaseBusiness,
};

/* Medidas do arquivo, para o `<Image>` reservar a caixa e não haver salto de layout
   enquanto ele baixa. Lidas com `sharp`, não estimadas: 801×339, com alfa, e a
   tinta ocupando 779×313 a partir de (10,13) — o arquivo já é a caixa da tinta,
   então não há janela de recorte (a conta está no CSS). */
const CARIMBO = { largura: 801, altura: 339 };

export default function ComoAgimos() {
  return (
    <section
      aria-labelledby="como-agimos"
      className="section-py agimos-secao relative overflow-hidden"
    >
      {/* A grade técnica da casa, como antes — a seção era a consumidora dela e
          continua sendo. Não se trocou nada no fundo. */}
      <div aria-hidden className="grade-tecnica" />
      {/* A GRADE DE DUAS COLUNAS (24/09). O `container-lp` continua sendo a caixa de
          leitura da página — a grade é ele mesmo, e não um `div` extra dentro dele,
          para o trilho da esquerda nascer na mesma margem que todas as outras
          seções da rota. O empilhamento em uma coluna, abaixo de 72rem (SIS-277: era
          64rem; o §6 fecha os trilhos em 320px + 620px e a 1024 a soma deles com o
          `gap` transbordava o container — a conta está no CSS), é o que o
          CSS faz por padrão: a ordem do DOM é abertura → bilhete, que é a ordem de
          leitura em tela estreita. */}
      <div className="container-lp agimos-grade">
        {/* `RevealScope` é quem escreve `data-in`, e é o gatilho do traço ciano.
            Reaproveitado e não reescrito: ele já serve a cinco rotas, e é
            exatamente o mecanismo que o risco de `/solucoes` usa
            (`globals.css:31776-31800`). `/quem-somos` não o usava ainda — usa
            `ScrollReveal`, que anima opacidade e `transform` mas não expõe
            atributo nenhum, então não há por onde um `@keyframes` saber que a
            seção acendeu. Duplicar o observador só para esta frase seriam dois
            gatilhos para o mesmo gesto. */}
        <RevealScope className="agimos-abertura">
          <h2 id="como-agimos" className="agimos-carimbo">
            <Image
              src="/carimbo-agimos-ticket-outline-ffffff.png"
              alt="Como Agimos"
              width={CARIMBO.largura}
              height={CARIMBO.altura}
              /* Refeito junto com o clamp do CSS (24/09): era `30rem`/`32vw`, a
                 medida de quando o carimbo tinha o container inteiro. Hoje o clamp é
                 `clamp(17rem, 26vw, 23rem)`, e as três paradas abaixo o traduzem —
                 23rem só a partir de 90rem de janela, onde o `vw` passa o teto;
                 abaixo de 64rem a conta bate sempre no piso. O atributo é inerte
                 enquanto `images.unoptimized` estiver ligado (SIS-154), e é por isso
                 mesmo que ele tem de ficar verdadeiro: mentira aqui só aparece no dia
                 em que a otimização voltar. SIS-277 — a parada do meio passou de
                 64rem para 72rem junto com o breakpoint da grade; o clamp em si não
                 mudou (a conta do trilho novo está no CSS). */
              sizes="(min-width: 90rem) 23rem, (min-width: 72rem) 26vw, 17rem"
            />
          </h2>

          <p className="agimos-manuscrito">
            {ABERTURA.mao}
            {/* O traço do documento. `aria-hidden` porque é pontuação visual, não
                conteúdo, e `viewBox` de 45×8 para os números do CSS serem os do
                documento sem conversão. */}
            <svg
              aria-hidden
              className="agimos-risco"
              viewBox="0 0 45 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path className="agimos-risco-traco" pathLength="1" d="M1.5 6.4C12 2.6 30 5.6 43.5 2" />
            </svg>
          </p>

          <p className="agimos-prosa">{ABERTURA.prosa}</p>
        </RevealScope>

        {/* `cortina={false}` continua, e agora por uma razão mais forte do que a
            antiga (o recorte sobre a costura do bilhete, que já não existe): a
            cortina é um `clip-path` no próprio nó animado, e `inset(0% 0% 0% 0%)` —
            o estado FINAL dela — segue recortando na borda da caixa, o que apaga a
            sombra projetada do card. Os cards do §4 têm `box-shadow` como token
            obrigatório, então cortina aqui entregaria a sombra no CSS e nada na
            tela. O §9 também não pede cortina: pede opacidade, ≤20px de
            deslocamento e stagger, que é o que resta ligado.
            `distancia={20}` é o teto do §9 (o padrão do componente é 22px) e
            `duracao={0.55}` fica no meio da faixa de 450–600ms que o §9 fecha. O
            stagger é o `indice`, 70ms entre vizinhos, com teto de 420ms — «pequeno
            stagger» do documento, e o último dos oito não chega tarde. Movimento
            reduzido é tratado dentro do próprio `ScrollReveal` (variantes iguais,
            duração 0), que é o §9 e o §11 na mesma peça. */}
        <ol className="agimos-cards">
          {COMO_AGIMOS.map((valor, ordem) => {
            const Icone = SELO[valor];
            return (
              <ScrollReveal
                as="li"
                indice={ordem}
                key={valor}
                cortina={false}
                distancia={20}
                duracao={0.55}
                className="agimos-card"
              >
                {/* §11 — o selo é `aria-hidden`: o glifo repete o nome do valor que
                    vem ao lado, e anunciado viria como ruído antes de cada item. O
                    card NÃO é botão nem link, porque não há ação (§3 «nenhuma seta
                    ou botão», §11 «não transformar os cards em botões ou links se
                    não houver ação»). */}
                <span aria-hidden className="agimos-selo">
                  <Icone strokeWidth={1.6} />
                </span>
                {/* §1 — A SÉRIE 01–08 SAIU DAQUI. Era
                    `<span className="agimos-serie">{String(ordem + 1).padStart(2, '0')}</span>`,
                    dentro de um `<div className="agimos-talao-texto">` que existia só
                    para empilhar número e nome. Sem o número não há o que empilhar: o
                    `h3` é o único texto do card e vira filho direto do flex, o que
                    também é o que centra o nome verticalmente contra o selo (§3
                    «título centralizado verticalmente»). O `ordem` continua sendo
                    usado — no `indice` do reveal, que é cascata e não numeração. */}
                <h3 className="agimos-valor">{valor}</h3>
              </ScrollReveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* O BLOCO ANTIGO, comentado e não apagado. Vivia em
   `src/app/quem-somos/page.tsx:479-506`. Fica aqui como registro da forma que esta
   substituiu — e junto dele o motivo de cada peça que saiu de cena:
   · `TituloAceso` — o carimbo já escreve «Como Agimos»; ver o item 1 do docblock.
   · `DEGRAU` — a grade de quatro colunas escalonava as colunas em `transform` para
     a cascata de entrada ser percebida. Num rolo picotado o degrau desalinharia a
     costura de um talão com a do vizinho, que é justamente o que dá a leitura de
     bilhete único. A constante ficou comentada na página, onde era declarada.
   · `glass-card-hover` / `notch-card` / `barra-sinal` — as três são a gramática do
     CARTÃO, e aqui não há cartão. O hover virou preenchimento do talão (a razão
     medida está no CSS), o chanfro virou o canto do bilhete e a barra de sinal deu
     lugar ao fio curto ao lado do número de série.
   · `num-monumental` — o número passou a ser série de bilhete, em corpo pequeno e
     ciano cheio. O motivo, com o contraste, está no CSS.

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
*/
