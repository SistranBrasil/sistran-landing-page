import type { IconName } from '@/lib/icons';

/* Os 16 cards da pagina Parceiros e Implementações, na ordem do DOM do site,
   com os textos verbatim. No site o nome do parceiro existe SÓ dentro da
   imagem do logo (sem alt) — aqui `title` é o nome em texto e `focus` é a
   linha em negrito que alguns cards têm.
   Fonte: .claude/conteudo-site/05-parceiros-e-implementacoes.md */

export type PartnerCategory =
  | 'seguros'
  | 'plataforma'
  | 'cloud'
  | 'gestao'
  | 'dados'
  | 'inteligencia';

export type Partner = {
  id: string;
  /** Nome do parceiro. */
  title: string;
  /** Linha em negrito do card no site, quando existe. */
  focus?: string;
  category: PartnerCategory;
  /** Opcional: o card da Addactis nao tem descricao propria no site. */
  description?: string;
  icon: IconName;
  logo?: string;
  logoAlt?: string;
};

export const PARTNER_CATEGORIES: Record<PartnerCategory, { label: string }> = {
  seguros: { label: 'Especialistas em seguros' },
  plataforma: { label: 'Plataformas e frameworks' },
  cloud: { label: 'Cloud e desenvolvimento' },
  gestao: { label: 'Gestão e ERP' },
  dados: { label: 'Dados e integrações' },
  inteligencia: { label: 'Inteligência artificial' },
};

export const PARTNERS: readonly Partner[] = [
  {
    id: 'samplemed',
    title: 'Samplemed',
    category: 'seguros',
    icon: 'Shield',
    logo: '/images/samplemed-logo-vertical-rgb.png',
    logoAlt: 'Samplemed',
    description:
      'Um dos maiores especialistas no mercado de soluções de subscrição para seguros de pessoas. Oferece ecossistemas de soluções totalmente integráveis para os mais diversos níveis de riscos contribuindo para análises de riscos mais eficientes e democratizando o acesso aos seguros de pessoas.',
  },
  {
    id: 'pega',
    title: 'Pega',
    category: 'plataforma',
    icon: 'Boxes',
    logo: '/images/PNG-LogoPega-Site.png',
    logoAlt: 'Pega',
    description:
      'Plataforma tecnológica de transformação digital presente nas maiores Seguradoras do mundo. Abordagem completa para desenhar e ativar aplicações omnichannel em tempo recorde, com foco em Customer Services, Marketing, Sales dentre outras.',
  },
  {
    id: 'st-it',
    title: 'ST IT',
    focus: 'AI + ML + Analytics',
    category: 'inteligencia',
    icon: 'Cpu',
    logo: '/images/st-it-sombra-branca.png',
    logoAlt: 'ST IT',
    description:
      'Empresa de tecnologia da informação que se destaca por oferecer soluções personalizadas em nuvem, otimizando operações, acelerando a inovação e impulsionando o crescimento sustentável de seus clientes.',
  },
  {
    id: 'microsoft-azure',
    title: 'Microsoft Azure',
    category: 'cloud',
    icon: 'Code2',
    logo: '/images/Microsoft-Azure.png',
    logoAlt: 'Microsoft Azure',
    description:
      'A Sistran Brasil é Microsoft Gold Certified Partner. Desenvolvimento de soluções com tecnologia Microsoft para prover soluções modernas e funcionais.',
  },
  {
    id: 'virtusa',
    title: 'Virtusa',
    category: 'plataforma',
    icon: 'Workflow',
    logo: '/images/Logo-Virtusa-1200x416-1.png',
    logoAlt: 'Virtusa',
    description:
      'Maior fornecedora global de soluções Pega para seguradoras, com clientes na América, Europa, Japão e Oriente. Virtusa não só implanta soluções Pega como também é responsável pelo desenvolvimento de módulos da ferramenta, por encomenda da própria Pega; extensa cobertura de frameworks e aceleradores para Seguros e Life Sciences / Saúde, incluindo PLM (Provider Lifecycle Management) para gestão de profissionais, clínicas e hospitais contratados por planos de Saúde.',
  },
  {
    id: 'aws',
    title: 'AWS',
    category: 'cloud',
    icon: 'Layers',
    logo: '/images/AWS.png',
    logoAlt: 'AWS',
    description:
      'Conheça a nova versão do Connect API na nuvem AWS, com acesso à tecnologia de ponta para alavancar processos e negócios em Seguros. Através de componentes de Inteligência Artificial para tratamento de texto, imagem e fraude, apoiados em Machine Learning, desenhamos as melhores soluções para Vendas e Sinistros, 100% customizadas a cada cliente.',
  },
  {
    id: 'sys4b',
    title: 'Sys4b',
    focus: 'Expertise em Salesforce',
    category: 'plataforma',
    icon: 'Users',
    logo: '/images/Sys4b.png',
    logoAlt: 'Sys4b',
    description:
      'Consultoria especializada em soluções Salesforce, com foco em CRM (Customer Relationship Management) e CX (Customer Experience).',
  },
  {
    id: 'addactis',
    title: 'Addactis',
    focus: 'Plataforma de Soluções Atuariais',
    category: 'seguros',
    icon: 'Briefcase',
    logo: '/images/Addactis-logo.png',
    logoAlt: 'Addactis',
    /* No site este card repete, palavra por palavra, o texto da AWS — inclusive
       "Acesso ao site AWS". Nao ha descricao real da Addactis no site, então o
       card fica apenas com nome e area de atuacao, sem texto emprestado de
       outro parceiro. TODO: pedir a descricao correta da Addactis. */
  },
  {
    id: 'itg',
    title: 'ITG',
    focus: 'Contábil e Tesouraria',
    category: 'gestao',
    icon: 'Building2',
    logo: '/images/itg-logo.png',
    logoAlt: 'ITG',
    description:
      'Soluções tecnológicas e serviços de consultoria para o mercado segurador, auxiliando as seguradoras a melhorar sua eficiência e cumprir as exigências regulatórias.',
  },
  {
    id: 'friss',
    title: 'FRISS',
    focus: 'Prevenção a Fraudes',
    category: 'seguros',
    icon: 'Shield',
    logo: '/images/Friss.png',
    logoAlt: 'FRISS',
    description:
      'Soluções de detecção de fraudes e gerenciamento de riscos para o setor de seguros. Seu foco principal é auxiliar seguradoras a identificar e prevenir fraudes em sinistros, subscrição e investigações especiais.',
  },
  {
    id: 'nuclea',
    title: 'Nuclea',
    focus: 'Conexão e Inteligência com Dados',
    category: 'dados',
    icon: 'Cog',
    description:
      'Atua no setor financeiro, oferecendo soluções inovadoras para o mercado de pagamentos e registros de ativos.',
  },
  {
    id: 'sensedia',
    title: 'Sensedia',
    focus: 'Gestão de APIs',
    category: 'dados',
    icon: 'Code2',
    logo: '/images/Sensedia-logo-website-UPDATED2.png',
    logoAlt: 'Sensedia',
    description:
      'Especializada em soluções de API (Interface de Programação de Aplicativos) e integração de sistemas. Promove a conexão dos seus sistemas, dados e serviços de forma segura e eficiente, impulsionando a transformação digital e a inovação.',
  },
  {
    id: 'sap',
    title: 'SAP',
    focus: 'Gestão empresarial',
    category: 'gestao',
    icon: 'Boxes',
    logo: '/images/SAP.png',
    logoAlt: 'SAP',
    description:
      'Desenvolvimento de soluções de gestão empresarial (ERP - Enterprise Resource Planning). Fundada em 1972, a SAP se tornou uma das maiores empresas de software do mundo, com presença em mais de 180 países.',
  },
  {
    id: 'picsel',
    title: 'Picsel',
    focus: 'Seguro AGRO',
    category: 'seguros',
    icon: 'Leaf',
    logo: '/images/Picsel-logo.png',
    logoAlt: 'Picsel',
    description:
      'A solução mais avançada para Distribuição, Monitoração e Sinistros em Agro, com Integrador de Sistemas.',
  },
  {
    id: 'earnix',
    title: 'Earnix',
    focus: 'Precificação inteligente',
    category: 'inteligencia',
    icon: 'Zap',
    logo: '/images/Earnix_logo.png',
    logoAlt: 'Earnix',
    description:
      'Inteligência artificial para automatizar e aprimorar a precificação e a personalização de seguros em tempo real.',
  },
  {
    id: 'dacadoo',
    title: 'Dacadoo',
    focus: 'Avaliação de risco para Seguro de Vida',
    category: 'inteligencia',
    icon: 'HeartHandshake',
    logo: '/images/Dacadoo-Logo_1.png',
    logoAlt: 'Dacadoo',
    /* Site: "ajudando seguros a promover o bem-estar" — falta a palavra
       "seguradoras"; completada para a frase fazer sentido. */
    description:
      'Inteligência artificial e gamificação para pontuar a saúde dos clientes, ajudando seguradoras a promover o bem-estar e personalizar produtos.',
  },
] as const;
