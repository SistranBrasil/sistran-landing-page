import type { MetadataRoute } from 'next';

const BASE = 'https://www.sistran.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/quem-somos', '/solucoes', '/parceiros-e-implementacoes', '/eventos-inovacao'];
  return paths.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }));
}
