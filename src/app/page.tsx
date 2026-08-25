import { Instrument_Serif } from 'next/font/google';
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
import OptionalMorphIntro from '@/components/intro/OptionalMorphIntro';
import NotchDivider from '@/components/ui/NotchDivider';
import { StackScenes } from '@/components/legacy/StackScenes';
import { MetricsStrip } from '@/components/legacy/MetricsStrip';
import { SignalMarquee } from '@/components/legacy/SignalMarquee';
import { ImpactSequence } from '@/components/legacy/ImpactSequence';

/* A serifa editorial existe só para o mosaico (e para /transformacao-legado) —
   o layout raiz continua com Inter + Sora. Exposta como `--font-legacy-serif`,
   nome que `legacy.css` consome em `--font-editorial`. */
const editorial = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-legacy-serif',
  display: 'swap',
});

export default function Page() {
  return (
    <>
      {/* Abertura opcional: so na home, so uma vez por sessao, e sempre por
          cima de uma pagina que ja terminou de renderizar por baixo. */}
      <OptionalMorphIntro />
      <Header />
      <ScrollSpy />
      {/* A serifa editorial é declarada no `main`, e não num wrapper em volta do
          hero: um `<div>` ali quebraria `#top + *` no `globals.css` — a seção
          seguinte deixaria de ser irmã do hero e perderia o `z-index` que a faz
          subir por cima dele. */}
      <main id="conteudo" tabIndex={-1} className={editorial.variable}>
        <HeroCinematic />
        {/* Sem separador aqui: o hero encolhe em card sobre fundo claro e já
            entrega a cor do mosaico.

            Mosaico e Método num bloco só, e não em duas seções: o tile
            "Arquitetura modular e escalável" sai do mosaico, desce e se expande
            até virar a caixa de vídeo do Método. Separar cortaria o percurso na
            emenda. Conteúdo em `src/data/legacy.ts`. */}
        <div className={editorial.variable}>
          <StackScenes />
        </div>
        {/* Resultados logo DEPOIS do método, como na apresentação de legado:
            primeiro os quatro movimentos, depois as evidências que os comprovam.
            Antes eles fechavam o percurso do hero, e saíram de lá a pedido.

            O chanfro leva o navy da seção para dentro da faixa clara de sinais,
            que encerra o bloco. Conteúdo em `src/data/legacy.ts`. */}
        <div className={editorial.variable}>
          <MetricsStrip />
          {/* `--deep` é declarada em `:root` pelo `legacy.css`, importado pelo
              próprio `MetricsStrip` acima. */}
          <NotchDivider cor="var(--deep)" />
          <SignalMarquee />
        </div>
        {/* O bloco claro era um só (sobre + diferenciais + resultados) e agora é
            dois, porque a montagem entra no meio: ela é full bleed e tem fundo
            próprio, e dentro de `.section-light` (que tem `isolation: isolate` e
            degradê) o degradê pintaria por cima dela. Cada bloco desenha o seu
            próprio degradê, então há uma emenda de tom entre eles. */}
        <div className="section-light">
          <SectionReveal><About /></SectionReveal>
        </div>
        {/* Montagem presa ao scroll, logo abaixo de "Sobre nós". Portada da
            apresentação de legado junto com o vídeo; o wrapper da serifa é o que
            fornece `--font-legacy-serif`, que o `legacy.css` consome no título.
            Conteúdo em `src/data/legacy.ts` (`impactSequence`). Fora do
            `SectionReveal`: a seção já tem o próprio percurso de scroll. */}
        <div className={editorial.variable}>
          <ImpactSequence />
        </div>
        <div className="section-light">
          <SectionReveal><Differentials /></SectionReveal>
        </div>
        {/* "Sistran em números" saiu do `SectionReveal` e do `.section-light`
            pelas mesmas duas razões da montagem acima: ela tem percurso de
            scroll próprio (o reveal do wrapper brigaria com o sticky) e desenha
            os dois fundos que precisa — faixa clara em cima, palco escuro
            embaixo. Dentro do `.section-light` o degradê do bloco pintaria por
            cima do palco e o repinte de texto navy apagaria os números. */}
        <Metrics />
        {/* Bloco escuro de destaque: soluções (CTA-mor) */}
        <SectionReveal><Solutions /></SectionReveal>
        {/* Ordem da home do site: contato -> LinkedIn -> "Fale com a Gente!" */}
        <div className="section-light">
          <SectionReveal><Contact /></SectionReveal>
        </div>
        <SectionReveal><Social /></SectionReveal>
        {/* `motionShowcase`: digitacao do titulo, entrada encadeada e grafismo
            tecnico. Só aqui — o mesmo ContactCTA fecha outras nove paginas e
            elas continuam como estavam. */}
        <SectionReveal><ContactCTA motionShowcase /></SectionReveal>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
