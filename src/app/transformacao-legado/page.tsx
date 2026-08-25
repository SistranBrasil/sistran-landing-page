import { Instrument_Serif } from 'next/font/google';
import PageShell from '@/components/PageShell';
import { StackScenes } from '@/components/legacy/StackScenes';
import { RoadmapTrail } from '@/components/legacy/RoadmapTrail';

/* A serifa editorial existe só nesta página — o layout raiz continua com
   Inter + Sora. Exposta como `--font-legacy-serif`, nome que `legacy.css`
   consome em `--font-editorial`. */
const editorial = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-legacy-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Transformação de Legado · Sistran',
  description:
    'Arquitetura, método em quatro movimentos e roadmap do processo de transformação de legado via Luminna AI.',
};

/* Seções portadas da apresentação de legado (`apresentação/site`). A ordem
   importa: o mosaico entrega a peça "microserviços" para o cartão de cena
   dentro de StackScenes, e o roadmap fecha a narrativa. Conteúdo em
   `src/data/legacy.ts` — não inventar número, tecnologia ou estágio. */
export default function Page() {
  return (
    <PageShell>
      <div className={editorial.variable}>
        <StackScenes />
        {/* A montagem (`ImpactSequence`) vive na home, emendada no hero: o mesmo
            texto em duas páginas faria o leitor achar que já leu e pular. */}
        <RoadmapTrail />
      </div>
    </PageShell>
  );
}
