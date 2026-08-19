import type { Unit } from './types';

/* Dados de contato conforme o site: telefone e endereco da matriz na pagina
   Contato, os 3 escritorios no footer. Pato Branco e Rio de Janeiro aparecem
   no footer do site sem endereco nem telefone — aqui tambem ficam sem, em vez
   de receberem dados inventados.
   Fonte: .claude/conteudo-site/09-contato.md e _index.md ("Footer") */

export const CONTACT_PHONE = '+55 11 2192-4400';
export const CONTACT_EMAIL = 'comercial@sistran.com.br';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/sistran/';
// TODO: confirmar URL oficial do YouTube (o site linka "Youtube" no footer)
export const YOUTUBE_URL = '#';

/** Endereco completo da matriz, como escrito na pagina Contato. */
export const HQ_ADDRESS =
  'R. Dr. Geraldo Campos Moreira, 240 - 2º andar | Cidade Monções | São Paulo - SP | CEP 04571-020';

export const UNITS: readonly Unit[] = [
  {
    id: 'sp',
    city: 'São Paulo',
    state: 'SP',
    address: 'R. Dr. Geraldo Campos Moreira, 240 – Cidade Monções, São Paulo – SP',
    phone: '+55 (11) 2192 - 4400',
  },
  { id: 'pr', city: 'Pato Branco', state: 'PR' },
  { id: 'rj', city: 'Rio de Janeiro', state: 'RJ' },
] as const;
