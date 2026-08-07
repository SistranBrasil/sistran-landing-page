import type { IconName } from '@/lib/icons';

export type ConsultingArea = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tone: string;
};

export const CONSULTING_AREAS: readonly ConsultingArea[] = [
  {
    id: 'bancassurance-embedded',
    title: 'Bancassurance: Benchmarking e Embedded Insurance / Digital',
    description:
      'Exploramos as melhores práticas do mercado e as adaptamos à sua realidade, identificando oportunidades para o crescimento do seu negócio. Ajudamos a implementar soluções de embedded insurance e digitais, otimizando a experiência do cliente e expandindo seus canais de distribuição.',
    icon: 'Boxes',
    tone: '#0ed8f6',
  },
  {
    id: 'bancassurance-excelencia',
    title: 'Bancassurance: Excelência Operacional e Tecnológica',
    description:
      'Consultoria especializada para otimizar processos, implementar tecnologias de ponta e garantir a máxima eficiência em suas operações.',
    icon: 'Cog',
    tone: '#57B7EE',
  },
  {
    id: 'politica-ai',
    title: 'Política de IA · Governança e Gestão',
    description:
      'Auxiliamos na formulação e implementação de políticas de inteligência artificial robustas e eficazes, garantindo a governança adequada e a gestão responsável dessa tecnologia em sua empresa.',
    icon: 'ShieldCheck',
    tone: '#A78BFA',
  },
  {
    id: 'analises-mercado',
    title: 'Análises e Estudos Econômicos para o Mercado Segurador',
    description:
      'Fornecemos análises e estudos econômicos detalhados que permitem tomar decisões estratégicas embasadas em dados e informações precisas sobre o mercado segurador.',
    icon: 'Briefcase',
    tone: '#C4A0FB',
  },
];
