import type { MetadataRoute } from 'next';
import { POSTS } from '@/data/blog';
import { ACCELERATOR_PAGES } from '@/data/acceleratorPages';

const BASE = 'https://www.sistran.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  /* Mesmas rotas que o site publica, incluindo as legais do rodape e o unico
     post do blog. */
  const paths = [
    '/',
    '/quem-somos',
    '/sistran-labs',
    '/sistran-university',
    '/solucoes',
    ...ACCELERATOR_PAGES.map((p) => `/solucoes/${p.id}`),
    '/transformacao-legado',
    '/parceiros-e-implementacoes',
    '/eventos-inovacao',
    '/esg',
    '/trabalhe-conosco',
    '/contato',
    '/blog',
    ...POSTS.map((p) => `/blog/${p.slug}`),
    '/politica-de-privacidade',
    '/relatorio-de-transparencia-salarial',
  ];
  return paths.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }));
}
