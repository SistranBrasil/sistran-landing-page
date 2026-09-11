import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    /**
     * SIS-216 — `/admin` sai do índice.
     *
     * O `disallow` é o pedido, não a tranca: rastreador que o ignora ainda bate
     * na senha do proxy, e recebe 401 antes de qualquer HTML. Ele existe para o
     * caso oposto — o rastreador educado que, sem esta linha, publicaria a URL
     * do admin no Google e derrubaria a única coisa que a issue pede além da
     * senha: que o endereço só seja conhecido por quem administra.
     *
     * O `disallow` vem depois do `allow: '/'` de propósito: o mais específico
     * ganha, e o resto do site continua liberado.
     */
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: 'https://www.sistran.com.br/sitemap.xml',
  };
}
