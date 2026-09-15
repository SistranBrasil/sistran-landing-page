import type { Unit } from './types';

/* Dados de contato conforme o site: telefone e endereco da matriz na pagina
   Contato, os 3 escritorios no footer.
   | Pato Branco e Rio de Janeiro aparecem no footer do site sem endereco nem
   | telefone — aqui tambem ficam sem, em vez de receberem dados inventados.
   Fonte: .claude/conteudo-site/09-contato.md e _index.md ("Footer")

   SIS-245 — a frase acima fica registrada porque METADE dela caducou, e é
   importante que se saiba qual metade.
   • PATO BRANCO passou a ter endereço: «R. Tamôio, 1495 - Centro, Pato Branco -
     PR, 85501-031». Ele NÃO veio do site (o conteúdo-site continua registrando a
     ausência em `09-contato.md:25`) — veio da própria Sistran, escrito na issue
     como pedido explícito. Ou seja: não é dado inventado, é dado que o site ainda
     não publica e que passou a ser publicado por aqui. Quando o conteúdo-site for
     regravado, esta é a linha a conferir.
   • RIO DE JANEIRO continua sem endereço e sem telefone, e continua por decisão:
     nada foi divulgado. A consequência disso no painel está em `UnitsMap.tsx` —
     lá o link "Ver no Google Maps e traçar rota" deixou de existir para quem não
     tem endereço, porque traçar rota para o centro de uma cidade de 6 milhões de
     habitantes não é rota para escritório nenhum. */

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
     publica. O enquadramento acompanha o que o site conta.

   SIS-245 — PATO BRANCO saiu dessa regra, porque a premissa dela ("não tem
   endereço divulgado") deixou de valer para essa unidade. As coordenadas novas
   continuam MEDIDAS, e não estimadas a olho; o método, para poder ser refeito:
   1. Nominatim devolve a Rua Tamoio de Pato Branco partida em vários trechos
      (CEPs 85501-051, -080, -090, -250), e nenhum deles é o -031 da issue — o
      número 1495 não existe como ponto no OSM, exatamente como o 240 de São Paulo
      não existe.
   2. Overpass, então, pelos números que ESTÃO mapeados na via: 584 em
      (-26.2287966, -52.6739046) e 1706 em (-26.2200085, -52.6802556). A numeração
      cresce para noroeste.
   3. Interpolando 1495 entre esses dois: (-26.2217, -52.6791) — o que também cai
      no trecho que o Nominatim classifica como Centro, coerente com o endereço.
   O zoom é 16, o MESMO de São Paulo, e por idêntica razão: é zoom de rua, que
   acha a quadra, e não zoom de fachada, que fingiria precisão de porta. Se um dia
   o número for mapeado no OSM, troca-se por ele.
   Valores anteriores, de quando a unidade não tinha endereço:
   | { id: 'pr', city: 'Pato Branco', state: 'PR', lat: -26.2295984, lon: -52.6712474, zoom: 12 }, */
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
  {
    id: 'pr',
    city: 'Pato Branco',
    state: 'PR',
    /* Texto exato do pedido da issue, inclusive o circunflexo de «Tamôio» (o OSM
       grafa «Tamoio») e o CEP. Quem escreve o endereço da unidade é a Sistran,
       não o geocodificador. */
    address: 'R. Tamôio, 1495 - Centro, Pato Branco - PR, 85501-031',
    lat: -26.2217,
    lon: -52.6791,
    zoom: 16,
  },
  { id: 'rj', city: 'Rio de Janeiro', state: 'RJ', lat: -22.9110137, lon: -43.2093727, zoom: 11 },
] as const;

/** Busca no Google Maps, que é o que o botão de rota precisa. Endereço quando
 *  existe; cidade quando não.
 *
 *  SIS-245 — a queda para a cidade FICA na função, mas deixou de ser usada pelo
 *  painel: quem não tem `address` não ganha mais o link (ver `UnitsMap.tsx`). O
 *  raciocínio antigo era "ainda levam a algum lugar útil"; para o Rio isso não se
 *  sustenta — «Rio de Janeiro - RJ, Brasil» abre o mapa da cidade e a rota
 *  termina em qualquer lugar, o que é pior que não oferecer rota.
 *  A queda continua aqui porque a função é usada com unidade já filtrada e
 *  precisa ser total; remover o `??` a tornaria capaz de gerar uma busca por
 *  `undefined`. */
export function mapsHref(unit: Unit) {
  const alvo = unit.address ?? `${unit.city} - ${unit.state}, Brasil`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alvo)}`;
}
