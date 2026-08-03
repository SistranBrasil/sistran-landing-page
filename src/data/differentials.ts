import type { Differential } from './types';

export const DIFFERENTIALS: readonly (Differential & { description: string })[] = [
  {
    id: 'conhecimento-seguros',
    title: 'Conhecimento em Seguros',
    icon: 'Shield',
    color: '#0ed8f6',
    description:
      'Domínio completo dos processos de subscrição, sinistro, resseguro e produtos em todos os ramos, do vida ao P&C.',
  },
  {
    id: 'flexibilidade',
    title: 'Flexibilidade',
    icon: 'Zap',
    color: '#0079CB',
    description:
      'Modelo de entrega adaptável: squads dedicadas, alocações, managed services ou projetos fechados. A operação se molda ao seu momento.',
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    icon: 'Cpu',
    color: '#7c3aed',
    description:
      'Aceleradores próprios, integração de plataformas de mercado e uso pragmático de cloud, IA e APIs para acelerar entregas.',
  },
  {
    id: 'solidez-permanencia',
    title: 'Solidez e permanência',
    icon: 'Building2',
    color: '#a855f7',
    description:
      'Mais de três décadas atendendo seguradoras. Estabilidade, previsibilidade e relacionamento de longo prazo com o mercado.',
  },
] as const;
