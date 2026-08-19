/* O blog do site tem um unico post, de 5 de marco de 2024. Nada foi acrescentado
   para dar volume a listagem.
   Fonte: .claude/conteudo-site/10-blog-e-post.md */

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
  },
] as const;
