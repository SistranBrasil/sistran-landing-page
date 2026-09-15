import type { NavItem } from '@/data/types';

/**
 * SIS-266 — QUAL ITEM DE `NAV_ITEMS` A ROTA ATUAL ACENDE, num lugar só.
 *
 * As duas funções nasceram dentro de `components/Header.tsx` (SIS-80/81/82) e
 * saíram de lá SEM MUDAR UMA LINHA de lógica — o header importa daqui e continua
 * visualmente idêntico. A mudança de casa é o que a SIS-266 pede por escrito:
 * o rodapé precisa da mesma regra na coluna "Navegação", e copiá-la seria criar
 * duas cópias de uma decisão que já é sutil (prefixo, submenu, âncora da home).
 * Com duas cópias, o primeiro item novo com `children` acenderia no header e não
 * no rodapé, e ninguém veria isso olhando um arquivo só.
 *
 * Módulo SEM `'use client'` e sem import de `next/navigation`: são funções puras
 * que recebem o `pathname` já lido. Quem lê o `pathname` é o componente cliente
 * (`usePathname` só existe em Client Component — `node_modules/next/dist/docs/
 * 01-app/03-api-reference/04-functions/use-pathname.md`), e assim o mesmo módulo
 * serve os dois consumidores sem arrastar fronteira de cliente para nenhum lado.
 */

/**
 * `href` casa com a rota atual? Igualdade OU prefixo de segmento.
 *
 * O `+ '/'` do prefixo não é enfeite: sem ele, `/esg` casaria com uma futura
 * `/esg-relatorio`, que é outra página. E a `/` é comparada só por igualdade,
 * senão ela acenderia em TODAS as rotas.
 *
 * `activeHash` serve às âncoras da home (`/#algo`): a rota é sempre `/`, então
 * o que decide é o pedaço depois do `#`. Quem não rastreia âncora (o rodapé)
 * passa string vazia — nenhum item de `NAV_ITEMS` é âncora hoje, e o parâmetro
 * fica porque o header rastreia e a regra é dele também.
 */
export function matchActive(href: string, pathname: string, activeHash: string) {
  if (href.startsWith('/#')) {
    return pathname === '/' && activeHash === href.slice(1);
  }
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

/* SIS-80/81/82 — um item com submenu acende também quando a rota atual é de um
   FILHO. Sem isto, estar em `/sistran-labs` não marcaria nada no header: a rota
   não aparece na lista de primeiro nível, e o menu inteiro ficaria apagado numa
   página que ele acabou de servir.
   É também o que faz `/transformacao-legado` acender "Soluções, Serviços e
   Consultoria" — ela é filha declarada em `data/nav.ts`, não subcaminho de
   `/solucoes`, então só o prefixo de `matchActive` não a pegaria. */
export function ramoAtivo(item: NavItem, pathname: string, activeHash: string) {
  if (matchActive(item.href, pathname, activeHash)) return true;
  return (item.children ?? []).some((f) => matchActive(f.href, pathname, activeHash));
}
