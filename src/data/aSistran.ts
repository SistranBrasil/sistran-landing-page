/* Conteudo da pagina /a-sistran/ que ainda nao tinha lugar no projeto. Tudo
   verbatim; as unicas mudancas estao comentadas.
   Fonte: .claude/conteudo-site/01-a-sistran.md */

/** Secao 2 — Escritórios BRASIL. O site nao descreve o Rio de Janeiro. */
export const OFFICES = [
  {
    id: 'sp',
    name: 'São Paulo',
    text: 'Nosso escritório em SÃO PAULO-SP é um espaço moderno e integrado, projetado para inspirar colaboração e bem-estar.',
  },
  {
    id: 'pr',
    name: 'Pato Branco',
    text: 'O escritório da Sistran em PATO BRANCO-PR é mais do que um local de trabalho, é um ecossistema de inovação. Aqui, as ideias são cultivadas, aprimoradas e a tecnologia é usada para criar soluções disruptivas.',
  },
] as const;

/** Secao 4 — Diferenciais: no site sao 6 itens, so titulo, sem descricao. */
export const DIFERENCIAIS_6 = [
  'Especialização em Seguradoras',
  'Atendimento de nível global, custo local',
  'Estrutura sólida e perene: mais de 30 anos de vida',
  'Clientes Sistran processam 1/3 dos prêmios de Seguro de Vida no Brasil',
  'Conhecimento de regulações da Susep',
  'Metodologias e frameworks mundiais',
] as const;

/** Secao 7 — Pilares. */
export const PILARES = [
  'Compromisso em ter a melhor relação custo benefício do mercado.',
  'Foco em minimizar o risco de insucesso do projeto.',
  'Busca pela eficiência e eficácia em gestão.',
  'Capacidade de entender os requisitos do cliente e agregar valor ao seu negócio, por meio dos nossos especialistas.',
  'Transparência e ética no relacionamento com clientes, fornecedores, parceiros, colaboradores e acionistas.',
  'Aprimoramento contínuo de visão de negócios de nossos consultores colaboradores.',
] as const;

/** Secao 8 — Abordagem de projetos: apenas os 4 rotulos das etapas. */
export const ABORDAGEM = [
  'Consultoria',
  'Projetos',
  'Alocação de Especialistas',
  'Outsourcing',
] as const;

/** Secao 9 — Como Agimos. No HTML do site a lista aparece duplicada (clone de
    carrossel sem aria-hidden); aqui aparece uma vez. */
export const COMO_AGIMOS = [
  'Ética',
  'Transparência',
  'Valorização Humana',
  'Integração',
  'Inovação',
  'Qualidade',
  'Comprometimento',
  'Profissionalismo',
] as const;

/** Secao 11 — Premiações. "Qualidadade" corrigido para "Qualidade". */
export const PREMIACOES = [
  { value: '12', label: 'Gaivotas de Ouro' },
  { value: '3', label: 'Prêmios Cobertura Performance' },
  { value: '5', label: 'Reconhecimentos internacionais' },
  { value: '3', label: 'Certificações Qualidade e Métricas' },
] as const;

export const PREMIACOES_NOTAS = [
  'Seguradora americana Top 5 no mundo nos elege como Melhor Projeto nas Américas.',
  /* Espacos duplos do original ("Celent  com o  Technology") normalizados. */
  'A Sistran foi reconhecida pela Celent com o Technology Standout 2023. A mais alta categoria no quesito tecnologia.',
] as const;

/** Secao 12 — ISG Provider Lens. A pagina promete "(texto original abaixo)" e
    nao tem versao em ingles: a promessa nao foi reproduzida. */
export const ISG = [
  {
    term: 'Conhecimento e experiência:',
    quote:
      'expertise é inquestionável, possuindo mais de 40 implementações, migrações e modernizações de aplicações no Brasil; fornece serviço de consultoria em práticas de negócio de seguros e soluções "end-to-end", para seguradoras relevantes no mercado brasileiro',
  },
  {
    term: 'Portfólio robusto:',
    quote:
      'Possui aceleradores para melhorar o "time to market" dos clientes. Essas soluções e aceleradores atendem às regulações brasileiras e às melhores práticas de negócio em seguros',
  },
  {
    term: 'Comentário do Analista',
    quote:
      'A parceria única da Sistran com Pegasystems permite que ela oriente seus clientes companhias de seguros através da desafiadora transformação digital em seus negócios.',
  },
] as const;

/** Secao 13 — Por que SISTRAN? Nove blocos, nas duas colunas do site. */
export const POR_QUE_SISTRAN = [
  {
    title: 'Continuidade/Confiabilidade ("Future Proof")',
    text: 'Nossa história de 45+ anos Latam comprova a seriedade e competência através de mais de 150 clientes…',
  },
  {
    title: 'Especialistas em Seguridade (BRASIL)',
    text: 'Foco é Solução de Seguridade: melhor "blend" entre consultoria e desenvolvedor de aplicações. Conhecemos a realidade deste mercado local e seus detalhes: Ofertas, Jornadas completas, Gestão de Contratos, Aspectos Regulatórios/legais, Financeiros e Contábeis',
  },
  {
    title: 'Tecnologia / Solução sob medida / produtos',
    text: 'Especialistas em Tecnologia e Negócios, com o uso de aceleradores escaláveis e comprovados, desenvolvidos e mantidos por nós; a partir deles construiremos solução específica, isto se traduz em menor risco, valor agregado, timing!!!',
  },
  {
    title: 'Sem amarras: Flexibilidade',
    /* A oracao "A Sistran nao escraviza seus clientes" ficou fora: vocabulario
       improprio para institucional. O resto é verbatim. */
    text: 'A Sistran não prende seus clientes a contratos e códigos fechados, a tecnologia é aberta e padrão de mercado, além de possibilidades de aquisição do código fonte',
  },
  {
    title: 'Jornada do Usuário',
    text: 'O cliente no centro sempre, especialista no desenho da melhor jornada dos usuários (Colaboradores, Rede de distribuidores, Clientes), com UX/UI conectados às bases e com foco na usabilidade',
  },
  {
    title: 'Escalabilidade',
    text: 'Somos experientes em operações de grande porte: só quem desenvolve soluções que processam a maior seguradora de Vida do Brasil pode dar esta garantia – crescimento sem receio!',
  },
  {
    title: 'Qualidade',
    text: 'A Sistran possui as Certificações ISO 9001, CMMI, Microsoft partner gold; temos colaboradores certificados Cobit, Itil, Scrum, CFPS, PSPI, contamos ainda com célula independente de Quality Assurance',
  },
  {
    title: 'Contingência e Segurança',
    text: 'São 3 escritórios no Brasil, isto habilita nosso plano de contingenciamento e continuidade de negócios, sempre teremos alternativas a quaisquer situações adversas que possam ocorrer',
  },
  {
    title: 'Gerenciamento e Metodologia',
    text: 'Metodologia comprovada e auditada com selos de garantia de qualidade, gerenciamento de projeto auditado e medido por PMO independente e mantido em sistema próprio de gestão de projetos',
  },
  {
    title: 'Sócios e não grupo controlador',
    text: 'Não temos grupo controlador com desafios de resultados e EBITDA acima de tudo, estudamos cada negócio com foco nos resultados e satisfação de nossos clientes',
  },
] as const;
