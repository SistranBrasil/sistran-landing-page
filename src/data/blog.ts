/* O blog do site tem um unico post, de 5 de marco de 2024. Nada foi acrescentado
   para dar volume a listagem.
   Fonte: .claude/conteudo-site/10-blog-e-post.md */

/* SIS-118 · FORMATO DO CORPO — decidido antes de mover o texto, porque a issue
   avisa que trocar depois custa mais. São BLOCOS ESTRUTURADOS, e não string com
   HTML nem MDX:
   • String com HTML exigiria `dangerouslySetInnerHTML` para renderizar o negrito
     — abrir essa porta num campo de conteúdo é criar superfície de injeção para
     ganhar duas tags. E as entidades (`&ldquo;`) só existem porque o texto vivia
     dentro de JSX; em dado elas viram o caractere tipográfico direto (“ ”).
   • MDX custaria dependência, loader e configuração de build para um post.
   • Blocos tipados dão erro de compilação quando o dado está errado, atravessam
     o Server Component sem serialização especial, e crescem por acréscimo: no dia
     em que um post tiver subtítulo ou lista, entra uma variante em `PostBlock` e
     o `switch` da página passa a não compilar até tratá-la.
   O negrito é `{ strong }` porque é ÊNFASE de conteúdo (a página o renderiza em
   `<strong>`, não em `<b>`): a data do ciclo e o nome da empresa estão em negrito
   no post publicado, e isso é significado, não decoração. */
export type PostRun = string | { readonly strong: string };

export type PostBlock = { readonly kind: 'paragraph'; readonly runs: readonly PostRun[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  /** Data completa, como escrita no post. O card do site mostra so "05 mar". */
  dateLabel: string;
  /** ISO para <time dateTime>. */
  dateISO: string;
  /** Resumo do card, como escrito no site. */
  excerpt: string;
  /**
   * SIS-118 — Corpo do post, POR SLUG. Antes era texto fixo dentro do JSX de
   * `blog/[slug]/page.tsx`, o que servia o mesmo artigo para qualquer slug:
   * com um post só o defeito não aparecia na tela, mas o segundo post a entrar
   * seria publicado com o texto do primeiro. Agora o corpo é dado, e é o `slug`
   * que o escolhe — a página não tem mais texto de artigo nenhum.
   */
  body: readonly PostBlock[];
};

export const POSTS: readonly Post[] = [
  {
    slug: 'webinar-suitability-e-ai-em-seguros-ruptura-ou-inovacao',
    title: 'WEBINAR – Suitability e AI em Seguros – ruptura ou inovação?',
    category: 'Estratégia & Negócio',
    dateLabel: '5 de março de 2024',
    dateISO: '2024-03-05',
    excerpt:
      'O mercado de seguros vive um cenário de transformações e de readequação das ofertas de produtos e serviços, com vistas a uma relação acurada e…',
    /* Texto na íntegra, como estava publicado — transportado do JSX sem uma
       palavra alterada. A quebra em três trechos é só o negrito do post: as
       aspas de “facilidade” eram `&ldquo;`/`&rdquo;` e aqui são o caractere. */
    body: [
      {
        kind: 'paragraph',
        runs: [
          'O mercado de seguros vive um cenário de transformações e de readequação das ofertas de produtos e serviços, com vistas a uma relação acurada e perene com seus clientes. O desafio é como atender demandas de consumidores cada vez mais exigentes: atualizados, acostumados com autosserviços e informações instantâneas, eles esperam um nível mais sofisticado de serviços digitais, que já experimentam em outros setores. Essa “facilidade” traz para o segurado uma expectativa de maior aderência das ofertas às suas necessidades. Esse e outros temas foram discutidos em um ',
          { strong: 'ciclo de webinars nos dias 25 de novembro, 2 e 9 de dezembro' },
          ', por iniciativa da ',
          { strong: 'Sistran Informática' },
          ' – referência em TI do mercado segurador.',
        ],
      },
    ],
  },
] as const;
