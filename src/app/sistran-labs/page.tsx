import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { CONTACT_EMAIL } from '@/data/contact';

export const metadata = {
  title: 'Sistran Labs · Sistran',
};

/* Soluções já desenvolvidas, como escritas no site: nome em caixa alta seguido
   da lista de tecnologias. Predição de Churn e Fast Claims aparecem só aqui —
   nao tem pagina propria em /service/. */
const SOLUCOES = [
  {
    name: 'Guru de Seguros',
    description: 'AI, Comandos de voz, Assistente Conversacional (Alexa).',
  },
  {
    name: 'Predição de Churn',
    description: 'Data Science, com ações de Retenção e aumento da renovação.',
  },
  {
    name: 'Fast Claims',
    description: 'Robots (linguagem natural) para otimizar Regulação.',
  },
  {
    name: 'Smart Miner',
    description: 'AI na leitura e tipificação de documentos (inclusive não padrão/formatados).',
  },
] as const;

/* Toda a escrita desta pagina vem de /sistran-labs/.
   A secao "Principais Soluções Sistran Labs" do site é so um PNG sem alt e sem
   texto: nao foi recriada aqui, porque nao ha escrita para ela.
   Fonte: .claude/conteudo-site/02-sistran-labs.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="Sistran Labs:"
        highlight="Laboratório de INOVAÇÃO"
        description={
          <>
            <p>
              Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações
              da Sistran. Aqui, as ideias se transformam em verdadeiras soluções assertivas que
              impulsionam o crescimento das Seguradoras. O Sistran Labs possui foco em INTELIGÊNCIA
              DE NEGÓCIOS EM SEGUROS 100% voltados ao estudo/aplicação das soluções mais eficientes
              para transformação digital, utilizando/criando tecnologia disruptiva (DS/AI/ML/CLOUD/
              No &amp; Low-code).
            </p>
            <p>
              O Sistran Labs com sua expertise tecnológica, é a solução ideal para TESTAR, DESENVOLVER
              E/OU HOMOLOGAR as tecnologias e soluções de negócio mais adequadas com foco em
              automatizar processos, adicionar segurança, melhorar a experiência do usuário.
            </p>
            <p>
              Nosso time de experts, amplia a capacidade da Seguradora &ldquo;Staff
              Augmentation&rdquo;, com custos racionais, eventualmente interligando-se aos Labs de
              referência (da seguradora / internacional), validando e localizando soluções.
              Selecionamos, treinamos e capacitamos recursos para as seguradoras, recebendo
              colaboradores e devolvendo profissionais em outro patamar de competência. Estamos
              falando da excelência operacional certeira de um time especializado em Seguros.
              &ldquo;Innovation that matters!&rdquo;
            </p>
          </>
        }
      />

      <section aria-labelledby="labs-solucoes" className="section-py">
        <div className="container-lp">
          <h2
            id="labs-solucoes"
            className="max-w-2xl font-display text-section font-bold text-white"
          >
            Já desenvolvemos muitas soluções, entre elas:
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SOLUCOES.map((s) => (
              <li key={s.name} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-xl font-bold uppercase leading-tight text-white">
                  {s.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{s.description}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/85">
            Entre em contato conosco através do e-mail:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-bold text-[#A5F0FF] underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            e saiba como podemos orientá-lo na busca pela inovação e transformação digital.
          </p>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
