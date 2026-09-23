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
  async redirects() {
    return [{ source: '/solucoes/lumina-ai', destination: '/solucoes/luminna-ai', permanent: true }];
  },
};
export default nextConfig;
