import type { Solution } from './types';

export const SOLUTIONS: readonly Solution[] = [
  {
    id: 'apis-projetos',
    title: 'APIs, Projetos, Desenvolvimento, Sustentação e Migrações',
    description: 'Produção confiável, entregas de qualidade, ótima relação custo-benefício.',
    icon: 'Code2',
    // Claro o suficiente para contrastar com o fundo azul (#1273BC).
    // O antigo #0079CB era quase invisivel apos a paleta clarear.
    color: '#57B7EE',
    colorOnLight: '#0067AF',
  },
  {
    id: 'servicos-processos',
    title: 'Serviços e Processos',
    description: 'Amplo domínio de negócios e processos em Seguros em TODOS os ramos.',
    icon: 'Workflow',
    color: '#0ed8f6',
    colorOnLight: '#0193B4',
  },
  {
    id: 'tipos-servico',
    title: 'Tipos de Serviço',
    description: 'Squads/vilas, Managed Services, alocações, projetos fechados.',
    icon: 'Boxes',
    color: '#7c3aed',
    colorOnLight: '#6D28D9',
  },
  {
    id: 'staff-augmentation',
    title: 'Staff Augmentation',
    description: 'A serviço do Delivery.',
    icon: 'UserPlus',
    color: '#a855f7',
    colorOnLight: '#8B32D4',
  },
] as const;
