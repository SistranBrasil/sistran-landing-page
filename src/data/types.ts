import type { IconName } from '@/lib/icons';

export type NavItem = { label: string; href: string };
export type Differential = { id: string; title: string; icon: IconName; color: string; description?: string };
/** Componente contextual de cada indicador na secao "Sistran em numeros". A
 *  chave escolhe o desenho em `src/components/ui/impact/ImpactVisuais.tsx`. */
export type ImpactVisual =
  | 'people-network'
  | 'award-facets'
  | 'client-network'
  | 'capacity-pulse'
  | 'erp-layers'
  | 'insurer-network'
  | 'claims-flow';
export type Metric = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  /** Uma frase de contexto, mostrada so no indicador ativo. */
  caption: string;
  visual: ImpactVisual;
};
/** `color` = accent sobre fundo azul (lista lateral). `colorOnLight` = mesmo
 *  accent escurecido para uso dentro dos cards brancos, onde os tons claros
 *  perdem contraste. */
export type Solution = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  colorOnLight: string;
};
export type FutureArea = { id: string; title: string; icon: IconName };
export type Unit = { id: string; city: string; state: string; address?: string; phone?: string };
