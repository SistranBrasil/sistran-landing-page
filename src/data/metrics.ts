import type { Metric } from './types';

export const METRICS: readonly Metric[] = [
  { id: 'membros', value: 850, suffix: '+', label: 'Membros do Grupo Sistran' },
  { id: 'premios', value: 23, suffix: '+', label: 'Prêmios e Reconhecimentos' },
  { id: 'clientes', value: 150, suffix: '+', label: 'Clientes' },
  { id: 'horas', value: 650, suffix: '+', label: 'Mil horas de Capacidade Produtiva no Brasil' },
  { id: 'erps', value: 230, suffix: '+', label: 'Implementação de ERPs' },
  { id: 'seguradoras', value: 35, suffix: '+', label: 'Total de Seguradoras' },
  { id: 'sinistro', value: 25, suffix: '+', label: 'Implantações de Sinistro' },
] as const;
