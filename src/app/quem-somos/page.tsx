import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';

export const metadata = {
  title: 'Quem somos · Sistran',
  description:
    'Conheça a Sistran: tecnologia, serviços e consultoria para o mercado de seguros com alta performance e comprometimento.',
};

export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Quem somos"
        title="Empresas que aderem a tecnologia em seus processos estão sempre"
        highlight="a frente no mercado."
        description={
          <p>
            Entrega com alta performance e comprometimento. Uma trajetória construída em parceria
            com o mercado segurador brasileiro.
          </p>
        }
      />
      <div className="section-light">
        <About />
        <Differentials />
      </div>
      <Metrics />
    </PageShell>
  );
}
