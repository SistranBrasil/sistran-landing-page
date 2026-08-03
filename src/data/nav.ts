import type { NavItem } from './types';

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Quem somos', href: '/quem-somos' },
  { label: 'Soluções, Serviços e Consultoria', href: '/solucoes' },
  { label: 'Parceiros e Implementações', href: '/parceiros-e-implementacoes' },
  { label: 'Eventos & Inovação', href: '/eventos-inovacao' },
  { label: 'ESG', href: '/#esg' },
  { label: 'Trabalhe conosco', href: '/#trabalhe-conosco' },
  { label: 'Contato', href: '/#contato' },
] as const;
