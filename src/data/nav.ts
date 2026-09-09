import type { NavItem } from './types';

/* Mesmo menu do site atual.
   Fonte: .claude/conteudo-site/_index.md ("Header")

   SIS-80/81/82 — as quatro páginas de "Quem somos" (A Sistran, Sistran Labs,
   Sistran University, Sistran Latam) passam a ser alcançáveis PELO MENU. Antes o
   comentário aqui dizia que elas eram "alcançadas por dentro de /quem-somos", e
   era verdade: as rotas existiam, mas o único caminho até elas era um link no
   corpo daquela página. Três tasks abertas para o mesmo sintoma — o item do menu
   não é selecionável — são um só defeito, e a correção é uma só: o item ganha
   `children` e o Header aprende a desenhar submenu.

   O pai continua sendo um link para `/quem-somos`, e não um botão inerte que só
   abre a lista: quem clica em "Quem somos" espera a página institucional, e
   deixá-la inalcançável para caber num padrão de menu seria trocar um defeito
   por outro. "A Sistran" repete essa rota dentro do submenu porque é o nome que
   o site dá a ela — o destino igual é intencional. */
export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Quem somos',
    href: '/quem-somos',
    children: [
      { label: 'A Sistran', href: '/quem-somos' },
      { label: 'Sistran Labs', href: '/sistran-labs' },
      { label: 'Sistran University', href: '/sistran-university' },
      { label: 'Sistran Latam', href: '/latam' },
    ],
  },
  /* SIS-119 · item 2 — `/transformacao-legado` entra no menu como FILHA de
     "Soluções, Serviços e Consultoria", e não como oitavo item de primeiro nível.
     Duas razões, nesta ordem:
     • É de facto uma sub-página de Soluções: o único link de entrada que existe
       hoje é o botão no fim da seção "Transformação de Legado" DAQUELA página
       (`src/app/solucoes/page.tsx`), e quem não rola até lá nunca soube que a
       rota existia — que é o defeito relatado.
     • Oitavo item de primeiro nível empurraria a largura do header, e a própria
       issue avisa disso. Submenu não custa largura nenhuma.
     O padrão é o mesmo já estabelecido em "Quem somos" acima: o pai continua
     sendo LINK para `/solucoes` (quem clica espera a página, não uma lista), e o
     primeiro filho repete essa rota com o nome que o site dá a ela — destino
     igual é intencional, e sem ele a página do pai ficaria inalcançável pelo
     teclado em quem abre o submenu. */
  {
    label: 'Soluções, Serviços e Consultoria',
    href: '/solucoes',
    children: [
      { label: 'Soluções, Serviços e Consultoria', href: '/solucoes' },
      { label: 'Transformação de Legado', href: '/transformacao-legado' },
    ],
  },
  { label: 'Parceiros e Implementações', href: '/parceiros-e-implementacoes' },
  { label: 'Eventos & Inovação', href: '/eventos-inovacao' },
  { label: 'ESG', href: '/esg' },
  { label: 'Trabalhe conosco', href: '/trabalhe-conosco' },
  { label: 'Contato', href: '/contato' },
] as const;
