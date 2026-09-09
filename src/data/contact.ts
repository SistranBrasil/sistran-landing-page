import type { Unit } from './types';

/* Dados de contato conforme o site: telefone e endereco da matriz na pagina
   Contato, os 3 escritorios no footer. Pato Branco e Rio de Janeiro aparecem
   no footer do site sem endereco nem telefone — aqui tambem ficam sem, em vez
   de receberem dados inventados.
   Fonte: .claude/conteudo-site/09-contato.md e _index.md ("Footer") */

export const CONTACT_PHONE = '+55 11 2192-4400';
export const CONTACT_EMAIL = 'comercial@sistran.com.br';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/sistran/';
/* Canal oficial confirmado pela Sistran. Antes era '#': o icone do footer era
   um link morto (relatorio de UX, p12). O `?view_as=subscriber` do link enviado
   é parametro de pre-visualizacao do proprio YouTube e nao faz parte do
   endereco publico — fica fora. */
export const YOUTUBE_URL = 'https://www.youtube.com/channel/UC-4NqY5lFD3e1cNwlUemj2g';

/** Endereco completo da matriz, como escrito na pagina Contato. */
export const HQ_ADDRESS =
  'R. Dr. Geraldo Campos Moreira, 240 - 2º andar | Cidade Monções | São Paulo - SP | CEP 04571-020';

/* As coordenadas (SIS-84) vêm do OpenStreetMap/Nominatim, não de estimativa:
   - SP: centroide da Rua Dr. Geraldo Campos Moreira (Vila Olímpia). O número 240
     não está mapeado no OSM, então o pino marca a rua, com zoom de rua — é
     preciso o suficiente para achar o prédio e não finge precisão de fachada.
   - Pato Branco e Rio: centro do município, em zoom de cidade. Essas duas não
     têm endereço divulgado; aproximar mais sugeriria um ponto que a Sistran não
     publica. O enquadramento acompanha o que o site conta. */
export const UNITS: readonly Unit[] = [
  {
    id: 'sp',
    city: 'São Paulo',
    state: 'SP',
    address: 'R. Dr. Geraldo Campos Moreira, 240 – Cidade Monções, São Paulo – SP',
    phone: '+55 (11) 2192 - 4400',
    lat: -23.6013365,
    lon: -46.6934202,
    zoom: 16,
  },
  { id: 'pr', city: 'Pato Branco', state: 'PR', lat: -26.2295984, lon: -52.6712474, zoom: 12 },
  { id: 'rj', city: 'Rio de Janeiro', state: 'RJ', lat: -22.9110137, lon: -43.2093727, zoom: 11 },
] as const;

/** Busca no Google Maps, que é o que o botão de rota precisa. Endereço quando
 *  existe; cidade quando não — assim PR e RJ ainda levam a algum lugar útil sem
 *  publicar um endereço que a Sistran não divulga. */
export function mapsHref(unit: Unit) {
  const alvo = unit.address ?? `${unit.city} - ${unit.state}, Brasil`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alvo)}`;
}
