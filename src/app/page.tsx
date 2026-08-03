import Header from '@/components/Header';
import HeroCinematic from '@/components/HeroCinematic';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import Solutions from '@/components/Solutions';
import ClientWall from '@/components/ClientWall';
import FutureAreas from '@/components/FutureAreas';
import Social from '@/components/Social';
import Contact from '@/components/Contact';
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
        {/* Prova social + faixa fina de áreas futuras */}
        <SectionReveal><ClientWall /></SectionReveal>
        <SectionReveal><FutureAreas /></SectionReveal>
        <SectionReveal><Social /></SectionReveal>
        <div className="section-light">
          <SectionReveal><Contact /></SectionReveal>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
