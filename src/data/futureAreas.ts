import type { FutureArea } from './types';

// TODO: confirmar conteúdo da seção
export const FUTURE_AREAS: readonly FutureArea[] = [
  { id: 'eventos-inovacao', title: 'Eventos & Inovação', icon: 'Calendar' },
  { id: 'esg', title: 'ESG', icon: 'Leaf' },
  { id: 'trabalhe-conosco', title: 'Trabalhe conosco', icon: 'HeartHandshake' },
] as const;
