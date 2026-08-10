import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Accelerators from '@/components/Accelerators';
import Consulting from '@/components/Consulting';
import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: 'Soluções, Serviços e Consultoria · Sistran',
  description:
    'Soluções, serviços e consultoria sob medida para modernização e otimização do desempenho da sua seguradora. Beyond Technology.',
};

export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Soluções, Serviços e Consultoria"
        title="Sob medida para modernizar sua"
        highlight="seguradora."
        description={
          <>
            <p>
              Oferecemos <strong className="text-white">soluções, serviços e consultoria</strong>{' '}
              sob medida para modernização e otimização do desempenho da sua seguradora.
            </p>
            <p className="text-[#A5F0FF]">Beyond Technology: é o nosso lema.</p>
          </>
        }
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
            {/* "Serviços" saiu junto com a secao <Solutions />: uma ancora para
                um id que nao existe mais nao levaria a lugar nenhum.
                A secao segue viva na home (src/app/page.tsx). */}
            <AnchorPill href="#tecnologia-disruptiva" label="Tecnologia Disruptiva" />
            <AnchorPill href="#consultoria" label="Consultoria" />
          </div>
        </nav>
      </div>

      {/* 1. Tecnologia Disruptiva — aceleradores em fundo escuro */}
      <Accelerators />

      {/* 2. Consultoria — azul claro (a classe vive no proprio componente).
             Fecha a alternancia da pagina: hero/nav escuro -> Accelerators
             escuro -> Consultoria clara -> CTA escuro. */}
      <Consulting />

      {/* 3. CTA final */}
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
      className="group inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0ed8f6]/60 hover:bg-[#0ed8f6]/12"
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6] transition-transform duration-300 group-hover:scale-150"
        style={{ boxShadow: '0 0 8px rgba(14,216,246,0.9)' }}
      />
      {label}
    </a>
  );
}
