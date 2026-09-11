import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import Accelerators from '@/components/Accelerators';
import Consulting from '@/components/Consulting';
import ContactCTA from '@/components/ContactCTA';
import ServicesJourneyStage from '@/components/ui/ServicesJourneyStage';

export const metadata = {
  title: 'Soluções, Serviços e Consultoria · Sistran',
  description:
    'Soluções, serviços e consultoria sob medida para modernização e otimização do desempenho da sua seguradora. Beyond Technology.',
};

export default function Page() {
  return (
    <PageShell>
      {/* SIS-94 — o vídeo cobre a abertura INTEIRA: o hero e a barra "NESTA
          PÁGINA". Elas são irmãs, e um vídeo dentro do `PageHero` deixaria a
          barra abrindo já sobre o navy, com uma emenda no meio da abertura. */}
      {/* O arquivo é o `-loop`, e nao o `-scroll`: aquele foi cortado para ser
          BUSCADO quadro a quadro e a volta dele nao fecha (o ultimo quadro esta
          tao longe do primeiro quanto um quadro qualquer do meio, medido). Este
          tem a cauda dissolvida no proprio comeco, entao o ponto de emenda fica
          abaixo do ruido de compressao entre quadros vizinhos. */}
      <HeroVideoBackdrop
        src="/videos/solucoes-hero-loop.mp4"
        poster="/videos/solucoes-hero-loop-poster.webp"
      >
      {/* Abertura verbatim do site (que ali é texto puro, sem heading). */}
      <PageHero
        eyebrow="Soluções, Serviços e Consultoria"
        title="Oferecemos SOLUÇÕES, SERVIÇOS e CONSULTORIA sob medida para modernização e otimização do desempenho da sua"
        highlight="Seguradora."
        description={<p className="text-[#A5F0FF]">Beyond Technology: é o nosso lema!</p>}
      />

      {/* Anchor nav abaixo do hero.
          Era um bloco quase invisivel (bg branco a 3%, borda a 10%, texto a 80%)
          sobre o azul da pagina. Agora tem base navy opaca, borda ciano e um
          rotulo que explica o que a barra e — sem isso os tres links pareciam
          decoracao, nao navegacao. */}
      {/* SIS-100 — a barra passa a ser SÓ de tela estreita (`xl:hidden`).

          De 1280px para cima quem navega esta página é o navegador lateral de
          seções (montado no `PageShell`), com os mesmos três destinos: manter
          as duas seria a mesma navegação duas vezes na mesma tela, e a barra é a
          que atrapalha, porque ocupa altura logo abaixo do hero.

          Abaixo de 1280 ela FICA, e é por isso que não foi removida: o navegador
          lateral não existe nessas larguras (a coluna disputaria a borda com o
          conteúdo), e sem a barra a página perderia a navegação interna
          justamente onde a rolagem é mais longa. Uma navegação por largura, nunca
          duas ao mesmo tempo — nem zero. */}
      <div className="container-lp -mt-6 mb-6 xl:hidden">
        <nav
          /* Nome próprio, diferente do "Seções desta página" do navegador
             lateral: as duas navs coexistem na árvore (a de cá só está oculta por
             CSS acima de 1280), e dois landmarks de navegação com o MESMO nome
             acessível são indistinguíveis na lista de landmarks do leitor de
             tela. O nome aqui é o rótulo que já está escrito na barra. */
          aria-label="Nesta página"
          className="flex flex-col gap-3 rounded-2xl border border-[#0ed8f6]/30 p-3 backdrop-blur-lg sm:flex-row sm:items-center sm:gap-4"
          style={{
            background:
              'linear-gradient(135deg, rgba(6,38,69,0.72), rgba(4,29,55,0.60))',
            boxShadow:
              '0 18px 40px -24px rgba(3,26,52,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          <span className="shrink-0 pl-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5F0FF]">
            Nesta página
          </span>
          <span
            aria-hidden
            className="hidden h-6 w-px shrink-0 bg-white/15 sm:block"
          />
          <div className="flex flex-wrap items-center gap-2">
            <AnchorPill href="#tecnologia-disruptiva" label="Tecnologia Disruptiva" />
            <AnchorPill href="#servicos-diferenciais" label="Serviços" />
            <AnchorPill href="#consultoria" label="Consultoria" />
          </div>
        </nav>
      </div>
      </HeroVideoBackdrop>

      {/* 1. Tecnologia Disruptiva — SIS-93: passou a usar o mesmo fundo azul
             claro da Consultoria (`section-light section-light-blue`). A
             alternância da página deixou de ser escuro→escuro→claro→escuro e
             virou claro→escuro→claro→escuro→escuro: cada bloco claro fica
             cercado por escuros, que é a leitura que a página já tinha na
             Consultoria. */}
      <Accelerators />

      {/* 2. Serviços — no site esta secao tem sobretitulo "Diferenciais",
             titulo "Serviços", dois paragrafos e os mesmos 4 cards da home,
             fechando com o botao "Quero um serviço exclusivo". */}
      {/* SIS-76 — grade técnica, mesma malha ancorada na janela das demais
          seções escuras do site. Ver a nota em `.grade-tecnica` no globals.css. */}
      {/* `overflow-x-clip`, e NÃO `overflow-hidden`: a pilha de serviços aqui
          dentro depende de `position: sticky`, e `overflow: hidden` em qualquer
          ancestral cria um contêiner de rolagem — o `sticky` passaria a se
          prender a ele em vez de à janela, o que na prática o desliga. `clip`
          num eixo só recorta sem criar esse contêiner, e continua contendo a
          `.grade-tecnica`, que é o motivo do recorte. */}
      <section id="servicos-diferenciais" className="section-py relative overflow-x-clip">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          {/* Os quatro serviços saíram da grade `sm:grid-cols-2` e passaram a ser
              a pilha com vídeo preso ao lado — layout portado da seção
              "Transição visual | do sinal ao entendimento" da apresentação de
              Transformação de Legado. O vídeo é `/videos/jornada.mp4`, o mesmo
              arquivo da origem.

              A abertura (`Diferenciais` / `Serviços` / os dois parágrafos) entra
              DENTRO do componente, como na origem: ela é presa no topo da coluna
              dos cards, ao lado do vídeo, e acompanha a pilha inteira. Solta no
              fluxo acima do grid, o título ficava atrás do header fixo e os
              parágrafos ocupavam a largura toda, desligados da pilha.

              A escrita continua morando aqui, e não no componente: é escrita da
              página. O lock (`scripts/copy-lock.mjs`) compara por valor, então
              passá-la por prop não mexe no conteúdo travado. */}
          <ServicesJourneyStage
            eyebrow="Diferenciais"
            title="Serviços"
            paragraphs={[
              'Dedicada ao mercado segurador, com experiência em todos os ramos, a Sistran atua como integradora de sistemas para clientes com grandes carteiras.',
              'Somos uma empresa de TI 100% focada no segmento de Seguros no Brasil, acumulamos experiências e lições aprendidas em mais de 30 implementações de ERP bem-sucedidas.',
            ]}
          />

          {/* No site cada card leva a uma pagina de servico com Lorem Ipsum em
              ingles; nenhuma delas foi recriada. O botao aponta para o contato,
              que é o destino real da intencao. */}
          <Link href="/contato" className="btn-primary mt-10 inline-flex">
            Quero um serviço exclusivo
          </Link>
        </div>
      </section>

      {/* 3. Consultoria — azul claro (a classe vive no proprio componente) e,
             desde a SIS-93, a MESMA classe usada em Tecnologia Disruptiva. */}
      <Consulting />

      {/* 4. CTA final */}
      <ContactCTA />
    </PageShell>
  );
}

function AnchorPill({ href, label }: { href: string; label: string }) {
  return (
    /* Pill com fundo proprio: o estado de repouso ja precisa ser legivel, o
       hover so intensifica. Antes o link so existia visualmente no hover. */
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.07] px-4 py-2.5 text-sm min-h-[44px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0ed8f6]/60 hover:bg-[#0ed8f6]/12"
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6] transition-transform duration-300 group-hover:scale-150"
        style={{ boxShadow: '0 0 8px rgba(14,216,246,0.9)' }}
      />
      {label}
    </a>
  );
}
