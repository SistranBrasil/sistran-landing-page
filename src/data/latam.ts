import type { IconName } from '@/lib/icons';

/* Conteúdo da operação regional, em ESPANHOL — é assim que o site LATAM publica
   e traduzir para português inventaria uma versão que não existe.
   Fonte: https://www.sistran.com/latam/ (SIS-82)

   Fica em `src/data/` como o resto do conteúdo do site, e não dentro do arquivo
   da página, porque a tabela de escritórios é dado de contato e vai ser
   consultada/corrigida por quem não mexe em JSX. */

export type LatamNumero = { value: string; label: string };

/* Os quatro indicadores. `value` é string, não number: são rótulos fixos do site
   regional, não algo que a gente calcule ou anime. */
export const LATAM_NUMEROS: readonly LatamNumero[] = [
  { value: '49', label: 'AÑOS DE EXPERIENCIA' },
  { value: '100', label: 'CLIENTES LATAM' },
  { value: '18', label: 'PAISES CON PRESENCIA REGIONAL' },
  { value: '150', label: 'IMPLEMENTACIONES EXITOSAS' },
] as const;

/* As três notícias como o site regional as lista. Sem `href`: o site LATAM leva
   cada manchete a um post do blog dele, que não existe deste lado — publicar um
   link quebrado seria pior que publicar só a manchete.
   SIS-121 — o texto anterior prometia que "basta acrescentar `href` e a página
   passa a linkar (ver o `?.` na página)", e isso NÃO é verdade: não existe campo
   `href` neste tipo nem `?.` nenhum em `latam/page.tsx`. Quando as URLs vierem,
   o trabalho é: acrescentar `href?: string` ao tipo abaixo, envolver a manchete
   num `<a>` na seção `#latam-noticias` e devolver ao cartão o estado de hover que
   o item 2 tirou justamente para ele não parecer clicável sem ser. */
export type LatamNoticia = { date: string; dateTime: string; title: string };

export const LATAM_NOTICIAS: readonly LatamNoticia[] = [
  {
    date: '23 junio, 2026',
    dateTime: '2026-06-23',
    title: '¿Está tu Core preparado para la era de la IA Agéntica?',
  },
  {
    date: '26 mayo, 2026',
    dateTime: '2026-05-26',
    title:
      'IA en Seguros: el desafío de evolucionar en una industria en constante transformación',
  },
  {
    date: '28 abril, 2026',
    dateTime: '2026-04-28',
    title: 'SISTRAN renueva su certificación ISO 9001:2015',
  },
] as const;

export type LatamSolucion = { id: string; name: string; icon: IconName };

/* Os três cards de solução do site regional. Só o nome é publicado lá — nenhum
   deles tem descrição nem página própria, então o "Más info" aponta para a
   seção de contato desta mesma página em vez de fingir um destino. */
export const LATAM_SOLUCIONES: readonly LatamSolucion[] = [
  { id: 'omnicanal', name: 'Plataforma Omnicanal Configurable', icon: 'Layers' },
  { id: 'integral', name: 'Sistema Integral de Seguros', icon: 'Boxes' },
  { id: 'chatbot', name: 'Plataforma de Chatbot', icon: 'Cpu' },
] as const;

export type LatamCapacidad = { id: string; name: string; icon: IconName };

export const LATAM_CAPACIDADES: readonly LatamCapacidad[] = [
  { id: 'desarrollo', name: 'Desarrollo e Implementación', icon: 'Code2' },
  { id: 'soporte', name: 'Soporte', icon: 'ShieldCheck' },
  { id: 'adicionales', name: 'Adicionales', icon: 'Sparkles' },
] as const;

export type LatamOficina = {
  id: string;
  /** Nome da unidade. Repete entre linhas de propósito: "CONO SUR" opera de dois
   *  países, "CENTROAMÉRICA Y CARIBE" de três — por isso a chave é `id`. */
  unit: string;
  location: string;
  /** Cada número é um item separado para poder virar um `tel:` clicável. O site
   *  regional escreve México como "5536-6419 / 6743 / 6581" e Buenos Aires como
   *  "4373-8011 / 12 / 13"; aqui os ramais estão expandidos ao número completo,
   *  que é o mesmo telefone e o torna discável no celular. */
  phones?: readonly string[];
  email: string;
};

export const LATAM_OFICINAS: readonly LatamOficina[] = [
  {
    id: 'corporativo',
    unit: 'SISTRAN CORPORATIVO',
    location: 'Argentina – Buenos Aires',
    phones: ['+54 11 4129-3300'],
    email: 'sistrancorporate@sistran.com.ar',
  },
  {
    id: 'andina-ec',
    unit: 'SISTRAN ANDINA',
    location: 'Ecuador – Quito',
    phones: ['+593 2 451-3443', 'Cel +593 9 98 451-0588'],
    email: 'sistran@sistran.com.ec',
  },
  {
    id: 'brasil',
    unit: 'SISTRAN BRASIL',
    location: 'Brazil – Rio de Janeiro & São Paulo',
    phones: ['+55 11 2192-4400'],
    email: 'comercial@sistran.com.br',
  },
  {
    id: 'norteamerica',
    unit: 'SISTRAN NORTEAMÉRICA',
    location: 'México – México DF',
    phones: ['+52 55 5536-6419', '+52 55 5536-6743', '+52 55 5536-6581'],
    email: 'sistran@sistran.com.mx',
  },
  {
    id: 'cono-sur-ar',
    unit: 'SISTRAN CONO SUR',
    location: 'Argentina – Buenos Aires',
    phones: [
      '+54 11 4373-8011',
      '+54 11 4373-8012',
      '+54 11 4373-8013',
      'Cel +54 11 4129-3300',
    ],
    email: 'comercial@sistran.com.ar',
  },
  {
    id: 'centroamerica-gt',
    unit: 'SISTRAN CENTROAMÉRICA Y CARIBE',
    location: 'Guatemala – Guatemala',
    phones: ['+502 2376-4644'],
    email: 'sistran@sistran.com.gt',
  },
  {
    id: 'centroamerica-pr',
    unit: 'SISTRAN CENTROAMÉRICA Y CARIBE',
    location: 'Puerto Rico – San Juan',
    phones: ['+1 787 274-1224'],
    email: 'sistran@sistran.com',
  },
  {
    id: 'andina-co',
    unit: 'SISTRAN ANDINA',
    location: 'Colombia – Bogotá',
    phones: ['+57 1 742-1842', '+57 1 742-2273', 'Cel +57 9 322 808-9079'],
    email: 'sistran@sistran.com.co',
  },
  {
    id: 'cono-sur-cl',
    unit: 'SISTRAN CONO SUR',
    location: 'Chile – Santiago de Chile',
    phones: ['+562 222 441-163'],
    email: 'comercial@sistran.com',
  },
  {
    id: 'centroamerica-pa',
    unit: 'SISTRAN CENTROAMÉRICA Y CARIBE',
    location: 'Panamá – Panamá',
    phones: ['+507 279-3220'],
    email: 'sistran@sistran.com.pa',
  },
  /* As duas últimas são áreas corporativas, não escritórios: o site publica
     e-mail e nenhum telefone nem cidade. Ficam na mesma lista porque é assim que
     a fonte as apresenta. */
  { id: 'digital', unit: 'SISTRAN DIGITAL', location: 'Contacto por e-mail', email: 'digital@sistran.com' },
  {
    id: 'rrhh',
    unit: 'RRHH CORPORATIVO',
    location: 'Contacto por e-mail',
    email: 'recursoshumanoscorp@sistran.com',
  },
] as const;

export const LATAM_RRHH_EMAIL = 'recursoshumanoscorp@sistran.com';

/** `tel:` só aceita dígitos e `+`. Serve para "Cel +57 9 322 808-9079" também:
 *  as letras do prefixo caem fora e sobra o número. */
export function telHref(phone: string) {
  const digitos = phone.replace(/[^\d+]/g, '');
  return `tel:${digitos.startsWith('+') ? digitos : `+${digitos}`}`;
}
