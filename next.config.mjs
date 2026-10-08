/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* SIS-154 — decisão de deploy em aberto. Com isto, `sizes` no JSX não escolhe
     resolução (não há `srcset`). Ver `docs/images-unoptimized.md`. */
  images: { unoptimized: true },
  /* SIS-280 — a slug do Luminna AI passou a ter dois n (`/solucoes/lumina-ai` →
     `/solucoes/luminna-ai`). O redirect existe porque o endereço velho circula
     fora do nosso controle: ele esteve no sitemap, e link indexado ou salvo por
     terceiro não se reescreve. Sem isto, todo esse tráfego cai em 404.

     `permanent: true` emite 308 (não 301): o 308 preserva método e corpo, e é o
     que o Next usa para "permanente" — o efeito de cache no navegador é o mesmo
     do 301. Permanente, e não temporário, porque a rota velha não volta.

     Só esta rota, escrita à mão: não é um padrão `/solucoes/:slug` com reescrita
     de grafia, que pegaria slugs futuros por acidente. */
  /* SIS-246 — O CAMPO PROMETIA 5 MB E O SERVIDOR ACEITAVA 1 MB.
     `serverActions.bodySizeLimit` tem padrão de 1 MB
     (`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md:29`),
     e esta chave não existia aqui. O campo de currículo anuncia «PDF, DOC, DOCX
     até 5 MB» ao candidato, então todo arquivo entre 1 e 5 MB passava pela
     validação do navegador e era recusado na requisição da action — currículo com
     foto passa de 1 MB sem esforço.

     6 MB e não 5: o limite é do CORPO INTEIRO da requisição, não do arquivo. Além
     do anexo vão os campos de texto e o envelope `multipart` (fronteiras,
     cabeçalhos de parte, metadados) — a própria doc, na linha 45, recomenda deixar
     folga para isso. 1 MB de folga sobre o limite de 5 MB conferido no servidor
     (`src/lib/curriculo-regras.ts`), que é quem de fato recusa o arquivo grande,
     com mensagem, em vez de derrubar a requisição.

     `experimental` é onde a chave mora nesta versão (Next 16.3.0) — é o que a doc
     acima mostra, apesar de Server Actions serem estáveis desde o 14. */
  experimental: {
    serverActions: { bodySizeLimit: '6mb' },
  },
  async redirects() {
    return [{ source: '/solucoes/lumina-ai', destination: '/solucoes/luminna-ai', permanent: true }];
  },
  /* 07/10/2026 — os quadros do hero (`public/hero/sistran/v1/...`, centenas de AVIF) são
     imutáveis por construção: o caminho carrega a versão, e regenerar a sequência é subir
     uma pasta nova (`v2`). Sem isto a Vercel serve `public/` com `max-age=0, must-revalidate`
     e cada revisita faria ~365 requisições condicionais. */
  async headers() {
    /* Só em produção. Em `next dev` o `immutable` fazia o navegador reaproveitar quadros velhos
       depois de regenerar a sequência (o `fetch()` da fila usa o cache HTTP) — medido em 08/10. */
    if (process.env.NODE_ENV !== 'production') return [];
    return [
      {
        source: '/hero/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};
export default nextConfig;
