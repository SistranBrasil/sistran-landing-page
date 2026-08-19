import Header from '@/components/Header';
import HeroCinematic from '@/components/HeroCinematic';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import Solutions from '@/components/Solutions';
import Social from '@/components/Social';
import Contact from '@/components/Contact';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ScrollSpy from '@/components/ui/ScrollSpy';
import BackToTop from '@/components/ui/BackToTop';
import SectionReveal from '@/components/ui/SectionReveal';

export default function Page() {
  return (
    <>
      <Header />
      <ScrollSpy />
      <main>
        <HeroCinematic />
        {/* Bloco claro único: sobre + diferenciais + resultados */}
        <div className="section-light">
          <SectionReveal><About /></SectionReveal>
          <SectionReveal><Differentials /></SectionReveal>
          <SectionReveal><Metrics /></SectionReveal>
        </div>
        {/* Bloco escuro de destaque: soluções (CTA-mor) */}
        <SectionReveal><Solutions /></SectionReveal>
        {/* Ordem da home do site: contato -> LinkedIn -> "Fale com a Gente!" */}
        <div className="section-light">
          <SectionReveal><Contact /></SectionReveal>
        </div>
        <SectionReveal><Social /></SectionReveal>
        <SectionReveal><ContactCTA /></SectionReveal>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
