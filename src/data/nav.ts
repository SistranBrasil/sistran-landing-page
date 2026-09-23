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
      /* SIS-280 — «Sistran Latam» sai do app e vai para o site LATAM oficial. A
         linha anterior era exatamente esta:
           { label: 'Sistran Latam', href: '/latam' },
         A rota interna `/latam` CONTINUA existindo (sitemap, legado, links de
         dentro do conteúdo) — a issue mexe neste clique do menu e em mais nada.
         O tipo não mudou: `NavItem.href` é `string` e sempre aceitou endereço
         absoluto; quem passou a ler o esquema é `ehLinkExterno` em
         `src/lib/navAtivo.ts`, e é o Header que decide `<a>` em vez de `<Link>`.
         A barra final faz parte do endereço publicado pelo próprio site. */
      { label: 'Sistran Latam', href: 'https://www.sistran.com/latam/' },
    ],
  },
  /* SIS-279 — «Soluções, Serviços e Consultoria» volta a ser item SIMPLES, sem
     submenu, e isto é consequência direta de apagar `/transformacao-legado`.

     O submenu era da SIS-119, e existia por uma razão só: a rota do legado não
     tinha porta de entrada além de um botão no fim de uma seção de `/solucoes`,
     então ela foi declarada FILHA aqui em vez de virar oitavo item de primeiro
     nível (oitavo item empurraria a largura do header; submenu não custa
     largura). O primeiro filho repetia o próprio `/solucoes` para que a página
     do pai continuasse alcançável pelo teclado com o submenu aberto.

     Apagada a rota, o que sobraria é um submenu de UM item que só repete o pai:
     duas maneiras de clicar no mesmo lugar, mais um chevron que promete lista e
     não entrega. Então o submenu inteiro sai, e o pai fica sendo o link que
     sempre foi. `ramoAtivo` em `src/lib/navAtivo.ts` já trata `children`
     ausente (`item.children ?? []`), e `/solucoes/[slug]` continua acendendo
     por prefixo em `matchActive`. */
  { label: 'Soluções, Serviços e Consultoria', href: '/solucoes' },
  { label: 'Parceiros e Implementações', href: '/parceiros-e-implementacoes' },
  { label: 'Eventos & Inovação', href: '/eventos-inovacao' },
  { label: 'ESG', href: '/esg' },
  { label: 'Trabalhe conosco', href: '/trabalhe-conosco' },
  { label: 'Contato', href: '/contato' },
] as const;
