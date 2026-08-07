import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import EventsGrid from '@/components/EventsGrid';
import Social from '@/components/Social';
import ContactCTA from '@/components/ContactCTA';
import { EVENTS, EVENT_KIND_META } from '@/data/events';

export const metadata = {
  title: 'Eventos e Inovação · Sistran',
  description:
    'Eventos, palestras e iniciativas de inovação da Sistran no mercado segurador brasileiro e global.',
};

export default function Page() {
  const total = EVENTS.length;
  const kinds = Object.keys(EVENT_KIND_META).length;
  const proprios = EVENTS.filter((e) => e.kind === 'proprio').length;

  return (
    <PageShell>
      <PageHero
        eyebrow="Eventos e Inovação"
        title="Presença ativa nos principais"
        highlight="palcos do mercado."
        description={
          <p>
            A Sistran participa e realiza os principais eventos do mercado segurador, no Brasil e no
            mundo. Compartilhamos conhecimento, apresentamos aceleradores e construímos novas
            oportunidades ao lado de clientes e parceiros.
          </p>
        }
      />

      {/* Stat strip */}
      <section className="pb-4">
        <div className="container-lp">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:grid-cols-4 md:p-8">
            <Stat value={total} label="Eventos mapeados" />
            <Stat value={proprios} label="Realizados pela Sistran" />
            <Stat value={kinds} label="Frentes de participação" />
            <Stat value="24/7" label="Conhecimento em movimento" plain />
          </div>
        </div>
      </section>

      <EventsGrid />

      <Social />

      <ContactCTA
        eyebrow="Vamos conversar"
        title="Quer conversar com um de nossos especialistas?"
        description="Temos uma equipe qualificada para atender as suas necessidades e apresentar cases dos eventos."
      />
    </PageShell>
  );
}

function Stat({
  value,
  label,
  plain,
}: {
  value: number | string;
  label: string;
  plain?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="font-display text-4xl font-black text-white md:text-5xl"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
        {!plain && typeof value === 'number' && <span className="ml-0.5 text-[#A5F0FF]">+</span>}
      </span>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
        {label}
      </span>
    </div>
  );
}
