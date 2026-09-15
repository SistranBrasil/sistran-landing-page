'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/data/nav';
import { matchActive, ramoAtivo } from '@/lib/navAtivo';

/**
 * SIS-266 — a coluna "Navegação" do rodapé, com o item da página atual SELECIONADO.
 *
 * Existe como componente separado por causa da fronteira: `usePathname` só roda em
 * Client Component (`node_modules/next/dist/docs/01-app/03-api-reference/
 * 04-functions/use-pathname.md`), e `components/Footer.tsx` é Server Component.
 * Virar o rodapé inteiro em cliente mandaria para o bundle os três escritórios, os
 * links institucionais, a logo e o `MotionPreferenceTrigger` — a issue pede o
 * contrário («virar client só o necessário»). O necessário é ESTA lista.
 *
 * A regra de casamento NÃO está aqui: é `matchActive`/`ramoAtivo` de `@/lib/navAtivo`,
 * as mesmas funções que o header usa. Ver o cabeçalho do módulo para o porquê de
 * não haver duas cópias.
 *
 * `activeHash` vai como `''` de propósito: âncora da home (`/#algo`) é coisa que o
 * header rastreia rolando, e nenhum item de `NAV_ITEMS` é âncora hoje. Se um dia
 * for, o rodapé mostraria esse item apagado na home — não errado, só sem o realce —,
 * e a correção é passar a âncora, não duplicar a regra.
 *
 * Na HOME nenhum item acende, e isso é o comportamento pedido: `/` não está na
 * lista, e `matchActive` compara `/` só por igualdade, então ela não vira prefixo de
 * todo mundo. `/blog` (coluna Institucional, fora de escopo) também não acende nada
 * aqui — não é `href` nem filho de nenhum item de `NAV_ITEMS`.
 */
export default function RodapeNav() {
  const pathname = usePathname();

  return (
    <ul className="lp-rodape-nav space-y-2">
      {NAV_ITEMS.map((n) => {
        /* Duas perguntas diferentes, e é por isso que são duas chamadas:
           - `ativo` (ramo) é o que RECEBE O REALCE — inclui estar numa filha, como
             `/transformacao-legado` acendendo "Soluções, Serviços e Consultoria";
           - `atual` (rota exata) é o que recebe `aria-current="page"`, porque
             `page` significa literalmente "este link aponta para a página em que
             você está". Dizer isso num link para `/solucoes` estando em
             `/transformacao-legado` seria informação falsa para o leitor de tela.
           É a mesma separação que o header já faz (`ramoAtivo` para a cor,
           `matchActive` para o `aria-current`). */
        const ativo = ramoAtivo(n, pathname, '');
        const atual = matchActive(n.href, pathname, '');
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={atual ? 'page' : undefined}
              /* `data-ativo` e não uma classe nova: o realce é CSS de `globals.css`
                 no bloco do rodapé (SIS-59 + SIS-266), e um atributo de estado é o
                 que o resto da folha já usa para isso (`data-in`, `data-motion`).
                 Não pode ser seletor por `[aria-current]` porque o realce vale
                 também para o item ativo POR FILHA, que não tem `aria-current`.
                 Peso e cor vão no Tailwind junto do estado de repouso para o
                 contraste ficar legível no mesmo lugar onde ele é declarado; o
                 sublinhado ciano e a seta ficam no CSS, que é quem os desenha. */
              data-ativo={ativo ? 'true' : undefined}
              className={
                ativo
                  ? 'text-sm font-semibold text-white transition-colors'
                  : 'text-sm text-ink-muted transition-colors hover:text-white'
              }
            >
              {n.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
