import type { Solution } from './types';

/* Os 4 cards de "Soluções de Negócios" da home, tambem repetidos na pagina
   Soluções, Serviços e Consultoria (secao "Serviços — Diferenciais").
   Titulo e descricao verbatim; o card 2 nao tem ponto final no site.
   Fonte: .claude/conteudo-site/00-home.md e 04-solucoes-servicos-e-consultoria.md */

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
    description: 'Amplo domínio de negócios e processos em Seguros em TODOS os ramos',
    icon: 'Workflow',
    color: '#0ed8f6',
    colorOnLight: '#0193B4',
  },
  {
    id: 'tipos-servico',
    title: 'Tipos de Serviço',
    description: 'Squads/vilas, Managed Services, alocações, projetos fechados.',
    icon: 'Boxes',
    // Paleta 100% azul da marca: o violeta/roxo antigo destoava dos cards.
    color: '#38BDF8',
    colorOnLight: '#0369A1',
  },
  {
    id: 'staff-augmentation',
    title: 'Staff Augmentation',
    description: 'A serviço do Delivery.',
    icon: 'UserPlus',
    color: '#7DD3FC',
    colorOnLight: '#075985',
  },
] as const;
