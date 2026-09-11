/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* SIS-154 — decisão de deploy em aberto. Com isto, `sizes` no JSX não escolhe
     resolução (não há `srcset`). Ver `docs/images-unoptimized.md`. */
  images: { unoptimized: true },
};
export default nextConfig;
