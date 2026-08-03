import type { IconName } from '@/lib/icons';

export type PartnerCategory =
  | 'seguros'
  | 'plataforma'
  | 'cloud'
  | 'gestao'
  | 'dados'
  | 'inteligencia';

export type Partner = {
  id: string;
  title: string;
  category: PartnerCategory;
  description: string;
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
    id: 'subscricao-seguros-pessoas',
    title: 'Especialista em subscrição para seguros de pessoas',
    category: 'seguros',
    icon: 'Shield',
    logo: '/images/samplemed-logo-vertical-rgb.png',
    logoAlt: 'Samplemed',
    description:
      'Um dos maiores especialistas no mercado de soluções de subscrição para seguros de pessoas. Oferece ecossistemas de soluções totalmente integráveis para diferentes níveis de risco, contribuindo para análises mais eficientes e democratizando o acesso aos seguros de pessoas.',
  },
  {
    id: 'transformacao-digital',
    title: 'Transformação digital para seguradoras',
    category: 'plataforma',
    icon: 'Workflow',
    logo: '/images/Logo-Virtusa-1200x416-1.png',
    logoAlt: 'Virtusa',
    description:
      'Plataforma tecnológica de transformação digital presente nas maiores seguradoras do mundo. Oferece uma abordagem completa para desenhar e ativar aplicações omnichannel em tempo recorde, com foco em Customer Service, Marketing, Sales e outras áreas.',
  },
  {
    id: 'ai-ml-analytics',
    title: 'AI, Machine Learning e Analytics',
    category: 'inteligencia',
    icon: 'Cpu',
    logo: '/images/itg-logo.png',
    logoAlt: 'ITG',
    description:
      'Empresa de tecnologia da informação que oferece soluções personalizadas em nuvem para otimizar operações, acelerar a inovação e impulsionar o crescimento sustentável de seus clientes.',
  },
  {
    id: 'microsoft',
    title: 'Tecnologia Microsoft',
    category: 'cloud',
    icon: 'Code2',
    logo: '/images/Microsoft-Azure.png',
    logoAlt: 'Microsoft Azure',
    description:
      'A Sistran Brasil é Microsoft Gold Certified Partner. Desenvolve soluções com tecnologia Microsoft para entregar aplicações modernas, funcionais e alinhadas às necessidades do mercado segurador.',
  },
  {
    id: 'pega',
    title: 'Soluções Pega para seguradoras',
    category: 'plataforma',
    icon: 'Boxes',
    logo: '/images/PNG-LogoPega-Site.png',
    logoAlt: 'Pega',
    description:
      'Uma das maiores fornecedoras globais de soluções Pega para seguradoras, com clientes na América, Europa, Japão e Oriente Médio. Além de implantar soluções Pega, participa do desenvolvimento de módulos da própria plataforma e oferece ampla cobertura de frameworks e aceleradores para Seguros, Life Sciences e Saúde, incluindo PLM, Provider Lifecycle Management, para gestão de profissionais, clínicas e hospitais contratados por planos de saúde.',
  },
  {
    id: 'connect-api-aws',
    title: 'Connect API na AWS',
    category: 'cloud',
    icon: 'Layers',
    logo: '/images/AWS.png',
    logoAlt: 'AWS',
    description:
      'Conheça a nova versão do Connect API na nuvem AWS, com acesso a tecnologias avançadas para potencializar processos e negócios no mercado de seguros. Por meio de componentes de inteligência artificial para tratamento de texto, imagens e prevenção a fraudes, apoiados por Machine Learning, são desenvolvidas soluções para Vendas e Sinistros totalmente adaptadas às necessidades de cada cliente.',
  },
  {
    id: 'salesforce',
    title: 'Expertise em Salesforce',
    category: 'plataforma',
    icon: 'Users',
    logo: '/images/st-it-sombra-branca.png',
    logoAlt: 'ST-IT',
    description:
      'Consultoria especializada em soluções Salesforce, com foco em CRM, Customer Relationship Management, e CX, Customer Experience.',
  },
  {
    id: 'atuarial',
    title: 'Plataforma de soluções atuariais',
    category: 'seguros',
    icon: 'Briefcase',
    logo: '/images/Addactis-logo.png',
    logoAlt: 'Addactis',
    description:
      'Soluções tecnológicas voltadas à modernização de processos atuariais, análise de dados, automação e apoio à tomada de decisão.',
  },
  {
    id: 'contabil-tesouraria',
    title: 'Contábil e Tesouraria',
    category: 'gestao',
    icon: 'Building2',
    logo: '/images/Sys4b.png',
    logoAlt: 'Sys4B',
    description:
      'Soluções tecnológicas e serviços de consultoria para o mercado segurador, auxiliando seguradoras a melhorar sua eficiência operacional e cumprir exigências regulatórias.',
  },
  {
    id: 'prevencao-fraudes',
    title: 'Prevenção a Fraudes',
    category: 'seguros',
    icon: 'Shield',
    logo: '/images/Friss.png',
    logoAlt: 'FRISS',
    description:
      'Soluções de detecção de fraudes e gerenciamento de riscos para o setor de seguros, auxiliando seguradoras a identificar e prevenir irregularidades em sinistros, subscrição e investigações especiais.',
  },
  {
    id: 'conexao-dados',
    title: 'Conexão e Inteligência com Dados',
    category: 'dados',
    icon: 'Cog',
    description:
      'Soluções inovadoras para o mercado financeiro, incluindo pagamentos, registros de ativos, conexão de informações e inteligência de dados.',
  },
  {
    id: 'gestao-apis',
    title: 'Gestão de APIs',
    category: 'dados',
    icon: 'Code2',
    logo: '/images/Sensedia-logo-website-UPDATED2.png',
    logoAlt: 'Sensedia',
    description:
      'Soluções de APIs e integração de sistemas para conectar aplicações, dados e serviços com segurança e eficiência, impulsionando a transformação digital.',
  },
  {
    id: 'sap',
    title: 'Gestão Empresarial',
    category: 'gestao',
    icon: 'Boxes',
    logo: '/images/SAP.png',
    logoAlt: 'SAP',
    description:
      'Soluções de ERP, Enterprise Resource Planning, voltadas à gestão empresarial. A SAP, fundada em 1972, está entre as maiores empresas de software do mundo e possui presença em mais de 180 países.',
  },
  {
    id: 'seguro-agro',
    title: 'Seguro Agro',
    category: 'seguros',
    icon: 'Leaf',
    logo: '/images/Picsel-logo.png',
    logoAlt: 'Picsel',
    description:
      'Solução avançada para distribuição, monitoração e gestão de sinistros no segmento de seguros agrícolas, com integração entre sistemas.',
  },
  {
    id: 'precificacao',
    title: 'Precificação Inteligente',
    category: 'inteligencia',
    icon: 'Zap',
    logo: '/images/Earnix_logo.png',
    logoAlt: 'Earnix',
    description:
      'Inteligência artificial para automatizar e aprimorar a precificação e a personalização de seguros em tempo real.',
  },
  {
    id: 'avaliacao-risco-vida',
    title: 'Avaliação de Risco para Seguro de Vida',
    category: 'inteligencia',
    icon: 'HeartHandshake',
    logo: '/images/Dacadoo-Logo_1.png',
    logoAlt: 'Dacadoo',
    description:
      'Uso de inteligência artificial e gamificação para avaliar indicadores de saúde, apoiar a análise de risco e permitir a personalização de produtos de seguro de vida.',
  },
] as const;
