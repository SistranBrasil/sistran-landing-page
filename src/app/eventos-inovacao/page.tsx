import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import EventsGrid from '@/components/EventsGrid';
import Social from '@/components/Social';
import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: 'Eventos & Inovação · Sistran',
};

/* A pagina do site é so a sequencia dos 15 eventos: nao tem abertura, nem
   introducao, nem heading de pagina. O hero abaixo carrega apenas o titulo do
   menu ("Eventos & Inovação") — sem paragrafo de apoio e sem a faixa de
   numeros que existia aqui ("Eventos mapeados", "24/7 Conhecimento em
   movimento"), que nao estao escritos em lugar nenhum.
   Fonte: .claude/conteudo-site/06-eventos-inovacao.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero title="Eventos &" highlight="Inovação" />

      <EventsGrid />

      <Social />

      <ContactCTA />
    </PageShell>
  );
}
