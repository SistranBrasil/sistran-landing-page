import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: 'Sistran University · Sistran',
};

/* A pagina do site tem apenas dois paragrafos e uma galeria — nenhum heading.
   Aqui o titulo do bloco ("Autossuficiência em capacitação de recursos") virou
   h1, que é onde ele deveria estar. A galeria nao foi recriada: sao imagens sem
   texto. Nada foi acrescentado.
   Fonte: .claude/conteudo-site/03-sistran-university.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="Autossuficiência em"
        highlight="capacitação de recursos"
        description={
          <>
            <p>
              {/* Frase sem verbo principal no original; mantida como escrita. */}
              O <strong className="font-bold text-white">Sistran University</strong>, programa de
              capacitação intensiva da Sistran, dedicado a formar especialistas em tecnologia de
              ponta e desenvolvimento de sistemas. Em parceria com o Unidep (Centro Universitário de
              Pato Branco), treinamos nossos próprios talentos, alinhados com as últimas tendências e
              exigências do setor tecnológico. Com isso, contamos com um time de profissionais
              nativos digitais, altamente qualificados e com excelente custo-benefício para o
              mercado. Somos um verdadeiro banco de talentos de primeira linha, prontos para atender
              às demandas específicas da sua seguradora com as mais avançadas tecnologias.
            </p>
            <p>
              Desde 2022, já formamos mais de 60 especialistas com mentalidade inovadora, que
              aprendem na prática e acumulam experiência em mais de 17 projetos reais para o mercado
              de seguros.
            </p>
          </>
        }
      />

      <ContactCTA />
    </PageShell>
  );
}
