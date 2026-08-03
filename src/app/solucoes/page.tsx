import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Accelerators from '@/components/Accelerators';
import Solutions from '@/components/Solutions';
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
            <p className="text-[#0ed8f6]">Beyond Technology: é o nosso lema.</p>
          </>
        }
      />

      {/* Anchor nav sticky abaixo do header */}
      <div className="container-lp -mt-6 mb-4">
        <nav
          aria-label="Navegação da página"
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-lg"
        >
          <AnchorPill href="#tecnologia-disruptiva" label="Tecnologia Disruptiva" />
          <AnchorPill href="#servicos" label="Serviços" />
          <AnchorPill href="#consultoria" label="Consultoria" />
        </nav>
      </div>

      {/* 1. Tecnologia Disruptiva — aceleradores em fundo escuro */}
      <Accelerators />

      {/* 2. Serviços — Diferenciais/entrega em fundo claro */}
      <div className="section-light">
        <Solutions />
      </div>

      {/* 3. Consultoria — fundo escuro */}
      <Consulting />

      {/* 4. CTA final */}
      <ContactCTA />
    </PageShell>
  );
}

function AnchorPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-white/10 hover:text-white"
    >
      <span className="h-1 w-1 rounded-full bg-[#0ed8f6]" />
      {label}
    </a>
  );
}
