import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import PartnersGrid from '@/components/PartnersGrid';
import PartnersTimeline from '@/components/PartnersTimeline';
import { PARTNERS, PARTNER_CATEGORIES } from '@/data/partners';
import { TIMELINE_EVENTS } from '@/data/timeline';

export const metadata = {
  title: 'Parceiros e Implementações · Sistran',
  description:
    'A Sistran Brasil oferece soluções inovadoras em colaboração com líderes globais em tecnologia da informação para o mercado de seguros.',
};

const CATEGORIES = Object.keys(PARTNER_CATEGORIES).length;

export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Parceiros e Implementações"
        title="Parceiros e"
        highlight="Implementações"
        description={
          <>
            <p>
              A Sistran Brasil, em colaboração com líderes globais em tecnologia da informação,
              oferece às seguradoras soluções inovadoras e de ponta.
            </p>
            <p>
              Explore nosso portfólio de produtos e soluções, resultado de parcerias de excelência.
            </p>
          </>
        }
      />

      {/* Stat strip */}
      <section aria-hidden="false" className="pb-4">
        <div className="container-lp">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:grid-cols-4 md:p-8">
            <Stat value={PARTNERS.length} label="Parcerias ativas" />
            <Stat value={CATEGORIES} label="Categorias de atuação" />
            <Stat value={TIMELINE_EVENTS.length} label="Implementações mapeadas" suffix="" />
            <Stat value={1988} label="Início da trajetória" format="year" />
          </div>
        </div>
      </section>

      {/* Section: Parceiros */}
      <section id="parceiros" aria-labelledby="parceiros-titulo">
        <div className="container-lp mt-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow !text-[#A5F0FF]">01 · Parceiros</span>
            <h2
              id="parceiros-titulo"
              className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl"
            >
              Ecossistema de parcerias
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/85">
            Filtre por especialidade para navegar pelos parceiros por área de atuação.
          </p>
        </div>
        <PartnersGrid />
      </section>

      {/* Divider */}
      <div aria-hidden className="container-lp">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Section: Implementações */}
      <section id="implementacoes" aria-labelledby="implementacoes-titulo" className="pt-16 md:pt-20">
        <div className="container-lp mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow !text-[#A5F0FF]">02 · Implementações</span>
            <h2
              id="implementacoes-titulo"
              className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl"
            >
              Uma jornada que não para
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/85">
            Explore parceiros e implantações ao longo do tempo. Use os filtros para focar em uma
            categoria específica.
          </p>
        </div>
        <PartnersTimeline id="linha-do-tempo" />
      </section>
    </PageShell>
  );
}

function Stat({
  value,
  label,
  suffix = '+',
  format,
}: {
  value: number;
  label: string;
  suffix?: string;
  format?: 'year';
}) {
  return (
    <div className="flex flex-col">
      <span
        className="font-display text-4xl font-black text-white md:text-5xl"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
        {format === 'year' ? null : <span className="ml-0.5 text-[#A5F0FF]">{suffix}</span>}
      </span>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
        {label}
      </span>
    </div>
  );
}
