/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* 02/10 · SIS-241 — O OTIMIZADOR FOI LIGADO, e o que destravou foi uma MEDIDA,
     não uma mudança de opinião.
     A nota que estava aqui dizia «decisão de deploy em aberto», e
     `docs/images-unoptimized.md` fixou o portão para fechar o assunto: «só
     reabrir quando existir resposta explícita de publicação — estático/sem
     otimizador → desfecho A; `next start` ou CDN com loader → desfecho B».
     A resposta foi medida em 02/10, com sonda de navegador contra
     `sistran-landing-page.vercel.app`: a LP é publicada na VERCEL, que tem
     runtime Node. Logo é o desfecho B («é resíduo»), e não o A que o documento
     supunha por analogia com a frente AWS da vitrine (S3 + CloudFront + OAC).
     Essa analogia era a única base da hipótese, e estava errada SOBRE ESTA LP.

     O que a flag custava, medido na mesma passada: 20,6 MB de imagem entregues
     na home em 31 arquivos, todos começando a baixar no mesmo instante (~752ms)
     e disputando a conexão; 388 MB em `public/`, 278 MB só de PNG — com uma
     FOTOGRAFIA de 9,2 MB codificada em PNG (`images/escritoriosp/sp5.png`).
     Com `unoptimized` os 60 arquivos que importam `next/image` serviam o byte
     original, em resolução cheia e sem `srcset`: os 106 `sizes=` do projeto
     eram decorativos, como o título do documento já dizia.

     ⚠️ TIRAR A FLAG ACENDE OS 106 `sizes=` DE UMA VEZ. O documento avisa que
     errar o `sizes` para BAIXO é o lado ruim — o navegador serve candidato menor
     que a caixa e a foto sai borrada em produção sem ninguém ter tocado naquela
     linha (precedente SIS-139: a trilha da grade não era a caixa da foto). Por
     isso a varredura dos `sizes` foi feita ANTES, comparando o candidato que o
     navegador escolhe com a caixa medida em três larguras; o resultado está no
     comentário da SIS-241.
     O que NÃO foi feito, por restrição em vigor («não teste, não faça build»):
     a medida de peso e LCP em `next start` que o documento pede no item 3. Ela
     fica para quem puder rodar build. */
  images: {},
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
};
export default nextConfig;
