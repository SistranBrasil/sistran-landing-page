import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import About from '@/components/About';
import PositioningEcosystem from '@/components/PositioningEcosystem';
import RecognitionTheater from '@/components/RecognitionTheater';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import ContactCTA from '@/components/ContactCTA';
import TechnologyShowcase from '@/components/TechnologyShowcase';
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
import {
  COMO_AGIMOS,
  DIFERENCIAIS_6,
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
        <PageHero eyebrow="Sobre nós" title="A" highlight="Sistran" />
      </HeroVideoBackdrop>

      {/* Fronteiras claro/escuro em chanfro: o separador fica FORA do bloco
          claro, porque `.section-light` tem `isolation: isolate` e pintaria o
          proprio degrade sobre ele. A cor é a do bloco que avanca. */}
      {/* ── SIS-75 · mapa de fronteiras desta pagina ───────────────────────────
          Contagem, e nao impressao: os 10 `NotchDivider` desta pagina se dividem
          em 8 fronteiras claro↔escuro e 2 claro↔claro. Fronteira escuro↔escuro:
          ZERO aqui — o padrao real da pagina é escuro → claro alternando, porque
          entre "Como Agimos" e "Por que SISTRAN?" existem Metrics,
          RecognitionTheater e o bloco claro do ISG. (A unica escuro↔escuro do
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
      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (hero navy → About). */}
      <NotchDivider cor="#ffffff" invertido />

      <div className="section-light">
        <About />
      </div>

      {/* Perfil & Posicionamento vem logo depois de "Sobre nós": é a leitura
          natural — primeiro quem a Sistran é, depois onde ela se posiciona. O
          bloco claro fecha aqui porque a secao é azul-marinho profundo, e as duas
          fronteiras recebem o chanfro de sempre (a cor é a do bloco que avanca). */}
      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (About → Posicionamento). */}
      <NotchDivider cor="#e4edf7" />

      <PositioningEcosystem />

      {/* SIS-75: chanfro mantido por decisao — escuro↔claro (Posicionamento → Escritorios). */}
      <NotchDivider cor="#ffffff" invertido />

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

        {/* Tecnologias. Pinta o proprio fundo azul-marinho e sangra na largura
            inteira, entao entra sem `container-lp` e sem NotchDivider — este
            ultimo nao pode viver dentro de `.section-light`, que tem
            `isolation: isolate`. */}
        <TechnologyShowcase />

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
        {/* Diferenciais — os 6 itens, so titulo, como no site */}
        <section aria-labelledby="diferenciais-6" className="section-py">
          <div className="container-lp">
            <TituloAceso
              id="diferenciais-6"
              texto="Diferenciais"
              className="font-display text-section text-ink"
            />
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DIFERENCIAIS_6.map((d, i) => (
                <ScrollReveal
                  as="li"
                  indice={i}
                  key={d}
                  className="glass-card notch-card barra-sinal p-6 font-display text-base leading-snug text-ink"
                >
                  {d}
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

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
          "Conheça também" descem para dentro do cartão azul de "Fale com a
          Gente!". Aqui a grade É o último item da seção, que é o que a técnica
          exige (ver a nota do bloco `.vaza-*` no `globals.css`). */}
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

      {/* SIS-75: chanfro mantido por decisao — claro↔escuro (Conheca tambem → ContactCTA). */}
      <NotchDivider cor="#cfe7f7" />

      {/* SIS-77 — a compensação do vazamento entra num `<div>` em volta, e não
          dentro do `ContactCTA`: o componente fecha outras nove páginas, e nelas
          não há cartão descendo para dentro dele. O `<div>` é transparente e o
          `ContactCTA` não pinta fundo próprio (o navy é o da página), então a
          faixa de folga não cria banda de cor nenhuma. */}
      <div className="recebe-vazamento">
        <ContactCTA />
      </div>
    </PageShell>
  );
}
