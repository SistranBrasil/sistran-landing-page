import type { Unit } from './types';

export const CONTACT_PHONE = '+55 (11) 2192-4400';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/sistran/';
// TODO: confirmar URL oficial do YouTube
export const YOUTUBE_URL = '#';

export const UNITS: readonly Unit[] = [
  {
    id: 'sp',
    city: 'São Paulo',
    state: 'SP',
    address: 'R. Dr. Geraldo Campos Moreira, 240, Cidade Monções, São Paulo, SP',
    phone: '+55 (11) 2192-4400',
  },
  // TODO: confirmar endereço/telefone
  { id: 'pr', city: 'Pato Branco', state: 'PR' },
  // TODO: confirmar endereço/telefone
  { id: 'rj', city: 'Rio de Janeiro', state: 'RJ' },
] as const;
