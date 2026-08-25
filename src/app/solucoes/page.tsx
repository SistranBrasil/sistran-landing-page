import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Accelerators from '@/components/Accelerators';
import Consulting from '@/components/Consulting';
import ContactCTA from '@/components/ContactCTA';
import { SOLUTIONS } from '@/data/solutions';
import { scenesIntro, mosaicIntro } from '@/data/legacy';

export const metadata = {
  title: 'Soluções, Serviços e Consultoria · Sistran',
  description:
    'Soluções, serviços e consultoria sob medida para modernização e otimização do desempenho da sua seguradora. Beyond Technology.',
};

export default function Page() {
  return (
    <PageShell>
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
      <div className="container-lp -mt-6 mb-6">
        <nav
          aria-label="Navegação da página"
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
            <AnchorPill href="#transformacao-legado" label="Transformação de Legado" />
          </div>
        </nav>
      </div>

      {/* 1. Tecnologia Disruptiva — aceleradores em fundo escuro */}
      <Accelerators />

      {/* 2. Serviços — no site esta secao tem sobretitulo "Diferenciais",
             titulo "Serviços", dois paragrafos e os mesmos 4 cards da home,
             fechando com o botao "Quero um serviço exclusivo". */}
      <section id="servicos-diferenciais" className="section-py">
        <div className="container-lp">
          <span className="tag-section">Diferenciais</span>
          <h2 className="mt-4 font-display text-section font-bold text-white">Serviços</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
            Dedicada ao mercado segurador, com experiência em todos os ramos, a Sistran atua como
            integradora de sistemas para clientes com grandes carteiras.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
            Somos uma empresa de TI 100% focada no segmento de Seguros no Brasil, acumulamos
            experiências e lições aprendidas em mais de 30 implementações de ERP bem-sucedidas.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SOLUTIONS.map((s, i) => (
              <li key={s.id} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <span
                  aria-hidden
                  className="font-display text-sm font-bold tabular-nums"
                  style={{ color: s.color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{s.description}</p>
              </li>
            ))}
          </ul>

          {/* No site cada card leva a uma pagina de servico com Lorem Ipsum em
              ingles; nenhuma delas foi recriada. O botao aponta para o contato,
              que é o destino real da intencao. */}
          <Link href="/contato" className="btn-primary mt-10 inline-flex">
            Quero um serviço exclusivo
          </Link>
        </div>
      </section>

      {/* 3. Consultoria — azul claro (a classe vive no proprio componente).
             Fecha a alternancia da pagina: hero/nav escuro -> Accelerators
             escuro -> Consultoria clara -> CTA escuro. */}
      <Consulting />

      {/* 4. Transformação de Legado — a pagina /transformacao-legado existia sem
             nenhum link de entrada. Este é o ponto de acesso: o texto do card é
             o proprio conteudo da pagina (scenesIntro/mosaicIntro em
             src/data/legacy.ts), sem copy nova. */}
      <section id="transformacao-legado" className="section-py scroll-mt-32">
        <div className="container-lp">
          <span className="tag-section">{scenesIntro.kicker}</span>
          <h2 className="mt-4 max-w-3xl font-display text-section font-bold text-white">
            Transformação de Legado
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
            {scenesIntro.text}
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
            {mosaicIntro.text}
          </p>
          <Link href="/transformacao-legado" className="btn-primary mt-10 inline-flex">
            Ver o método, a arquitetura e o roadmap
          </Link>
        </div>
      </section>

      {/* 5. CTA final */}
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
