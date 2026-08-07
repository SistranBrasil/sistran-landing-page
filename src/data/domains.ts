import type { IconName } from '@/lib/icons';

/**
 * Domínios de negócio em que a Sistran atua. Usado no painel institucional do
 * hero (CompanySignature) — cada domínio ocupa uma posição na órbita.
 */
export type Domain = {
  id: string;
  label: string;
  icon: IconName;
  color: string;
};

export const DOMAINS: readonly Domain[] = [
  { id: 'subscricao', label: 'Subscrição', icon: 'ShieldCheck', color: '#0ed8f6' },
  { id: 'sinistro', label: 'Sinistro', icon: 'Workflow', color: '#57B7EE' },
  { id: 'resseguro', label: 'Resseguro', icon: 'Layers', color: '#57B7EE' },
  { id: 'vida', label: 'Vida', icon: 'HeartHandshake', color: '#A78BFA' },
  { id: 'p-and-c', label: 'P&C', icon: 'Boxes', color: '#C4A0FB' },
] as const;
