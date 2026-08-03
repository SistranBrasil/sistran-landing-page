import type { Solution } from './types';

export const SOLUTIONS: readonly Solution[] = [
  {
    id: 'apis-projetos',
    title: 'APIs, Projetos, Desenvolvimento, Sustentação e Migrações',
    description: 'Produção confiável, entregas de qualidade, ótima relação custo-benefício.',
    icon: 'Code2',
    color: '#0079CB',
  },
  {
    id: 'servicos-processos',
    title: 'Serviços e Processos',
    description: 'Amplo domínio de negócios e processos em Seguros em TODOS os ramos.',
    icon: 'Workflow',
    color: '#0ed8f6',
  },
  {
    id: 'tipos-servico',
    title: 'Tipos de Serviço',
    description: 'Squads/vilas, Managed Services, alocações, projetos fechados.',
    icon: 'Boxes',
    color: '#7c3aed',
  },
  {
    id: 'staff-augmentation',
    title: 'Staff Augmentation',
    description: 'A serviço do Delivery.',
    icon: 'UserPlus',
    color: '#a855f7',
  },
] as const;
