import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: 'ESG · Sistran',
};

/* "continuo" (item 4) recebeu o acento que falta no site: contínuo. */
const ENVIRONMENT = [
  'Instalação de postos de coleta seletiva',
  'Uso consciente da água e da energia elétrica',
  'Reciclagem de 100% da borra de café como fertilizante para plantas',
  'Doação para uso contínuo e/ou Descarte correto do lixo eletrônico',
  'Redução do consumo de descartáveis/plásticos (vs alumínio e vidro)',
  'Diminuição do uso de papéis e adoção de documentação eletrônica',
] as const;

const GOVERNANCE = [
  {
    term: 'Transparência',
    detail: 'sócios somente atuam através de um conselho estruturado',
  },
  { term: 'Isenção/Autonomia', detail: 'Administração Legal independente do CEO' },
  { term: 'Formalidade', detail: 'Contabilidade externa por empresa registrada na CVM' },
  { term: 'Código de Ética e Normas de Conduta', detail: 'cumpridos pelos colaboradores' },
  { term: 'Comitê Interno', detail: 'para monitoramento e controle dos serviços executados' },
  {
    term: 'Canal de Denúncia',
    detail: 'idôneo para detecção de irregularidades e/ou condutas inapropriadas',
  },
] as const;

/* Os tres projetos sociais, com os links como o site os publica. O titulo da
   secao SOCIAL no site escreve "Funcación Aguas" e o corpo do card escreve
   "Fundación Aguas": aqui vale a grafia correta nos dois lugares. */
const SOCIAL = [
  {
    name: 'Projeto Gerando Talentos',
    paragraphs: [
      /* "tem o objetivo preparar" no original; "de" acrescentado. */
      'Idealizado pela Sistran, o Projeto Gerando Talentos/Sistran University tem o objetivo de preparar e capacitar profissionais para a carreira de TI. Apoiada pela Unidep (Centro Universitário de Pato Branco), a Sistran oferece bolsas a estudantes de curso superior na área de tecnologia, proporcionando intensa capacitação e vivência na área com índices de certificações técnicas acima de 90%.',
      'O intuito é capacitação teórica e prática dessas tecnologias para que jovens entrantes na TI e profissionais em transição de carreira, possam ingressar no promissor universo da tecnologia.',
    ],
  },
  {
    name: 'Fundación Huerta Niño',
    paragraphs: [
      'Apoiado pelo Grupo Sistran, um sócio idealizou o Projeto Social Fundación Huerta Niño que trabalha para combater a desnutrição infantil, melhorar a qualidade da alimentação e promover hábitos saudáveis em crianças, através da construção e implementação de hortas agroecológicas em escolas rurais e urbanas carentes.',
    ],
    link: { label: 'Saiba mais sobre a Fundación Huerta Niño', href: 'https://www.mihuerta.org.ar/' },
  },
  {
    name: 'Fundación Aguas',
    paragraphs: [
      'Iniciativa surgida no ano de 2015, o projeto solidário Fundación Aguas tem também o apoio do Grupo Sistran. O objetivo desse projeto é proporcionar que comunidades carentes tenham acesso à água potável, trabalhando em conjunto com elas e capacitando-as através de educação e ferramentas que lhes permitam sustentar o processo ensinado.',
    ],
    link: { label: 'Conheça melhor o projeto Fundación Aguas', href: 'https://fundacionaguas.org/' },
  },
] as const;

/* Toda a escrita vem de /esg/. As galerias de imagens do site nao foram
   recriadas (nao tem texto).
   Fonte: .claude/conteudo-site/07-esg.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="A Sistran demonstra seu forte compromisso com o ESG, integrando"
        highlight="práticas sustentáveis"
        description={<p>em suas operações e cultura corporativa.</p>}
      />

      {/* ENVIRONMENT */}
      <section aria-labelledby="esg-environment" className="section-py">
        <div className="container-lp">
          <h2 id="esg-environment" className="font-display text-section font-bold text-white">
            ENVIRONMENT: <span className="text-gradient-brand">Sustentabilidade Ambiental</span>
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
            A Sistran tem um compromisso com a sustentabilidade ambiental e adota práticas para
            minimizar o impacto negativo no meio ambiente. Realizamos ações internas e campanhas de
            conscientização para que nossos colaboradores desenvolvam o hábito de um comportamento
            consciente.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ENVIRONMENT.map((item) => (
              <li key={item} className="glass-card-hover p-6 text-sm leading-relaxed text-white/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOCIAL */}
      <section aria-labelledby="esg-social" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <h2 id="esg-social" className="font-display text-section font-bold text-ink">
            SOCIAL: Projeto Gerando Talentos / Fundación Huerta Niño / Fundación Aguas
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SOCIAL.map((p) => (
              <article key={p.name} className="glass-card relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-xl font-bold leading-tight text-ink">{p.name}</h3>
                {p.paragraphs.map((t) => (
                  <p key={t.slice(0, 24)} className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {t}
                  </p>
                ))}
                {'link' in p && p.link && (
                  <a
                    href={p.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-sm font-semibold text-[#1273BC] underline underline-offset-4"
                  >
                    {/* No site o texto do link é a URL crua; aqui o rotulo é descritivo. */}
                    {p.link.label}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE */}
      <section aria-labelledby="esg-governance" className="section-py">
        <div className="container-lp">
          <h2 id="esg-governance" className="font-display text-section font-bold text-white">
            GOVERNANCE: <span className="text-gradient-brand">Ética e Transparência</span>
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
            A Sistran faz questão de seguir práticas éticas na gestão empresarial em busca de uma
            governança pautada em compliance.
          </p>
          {/* TODO: o item "Canal de Denúncia" nao tem canal nenhum no site — sem
              link, e-mail ou telefone. Assim que o canal oficial existir, ele
              precisa ser publicado aqui. */}
          <dl className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOVERNANCE.map((g) => (
              <div key={g.term} className="glass-card-hover p-6">
                <dt className="font-display text-base font-bold text-white">{g.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/85">{g.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
