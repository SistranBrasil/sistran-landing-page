/**
 * SIS-206 — contraste do texto da abertura de /esg sobre a foto.
 *
 * Obrigatório remedir: o reparo MOVEU a continuação para a direita (a 1440 ela
 * ia de x=952 a 1408 e agora vai de 737 a 1408) e para baixo, ou seja para cima
 * da MÃO, que é a faixa mais clara do quadro. O número de 5,43:1 registrado pela
 * SIS-138 foi medido no lugar antigo e não vale mais.
 *
 * Método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`: apaga a tinta com
 * `color: transparent` (nunca `visibility: hidden`, que muda o layout),
 * fotografa o próprio elemento, e toma o PIOR pixel do fundo, não a média.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const TEMP = 'docs/capturas/sis206-contraste';
await mkdir(TEMP, { recursive: true });

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razaoContraBranco = (px) => 1.05 / (luminancia(px) + 0.05);

const navegador = await chromium.launch();
for (const w of [1280, 1440, 1920, 390]) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.hero-backdrop--esg h1', { timeout: 180_000 });
  await pagina.waitForTimeout(1500);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}
      .hero-backdrop--esg .pagehero-entrada h1,
      .hero-backdrop--esg .pagehero-entrada h1 span,
      .hero-backdrop--esg .pagehero-entrada h1 + div,
      .hero-backdrop--esg .pagehero-entrada h1 + div * {
        color: transparent !important;
        -webkit-text-fill-color: transparent !important;
      }`,
  });
  await pagina.waitForTimeout(300);

  /* `ANTES=1` remonta o arranjo ANTERIOR ao reparo, para o contraste do título
     poder ser comparado nas duas versões. Sem essa comparação não se sabe se um
     número abaixo de 4,5:1 é dívida antiga desta abertura ou estrago novo. */
  if (process.env.ANTES) {
    await pagina.addStyleTag({
      content: `@media (min-width: 1280px) {
        .hero-backdrop--esg .pagehero-entrada > .container-lp > div {
          grid-template-columns: minmax(0, 52vw) minmax(0, 1fr) !important;
        }
        .hero-backdrop--esg .pagehero-entrada h1 { max-width: min(46ch, 52vw) !important; }
        .hero-backdrop--esg .pagehero-entrada h1 + div {
          max-width: 42rem !important;
          white-space: normal !important;
        }
      }
      .hero-backdrop--esg .pagehero-entrada h1 { font-size: clamp(2rem, 3.6vw, 3.2rem) !important; }`,
    });
    await pagina.waitForTimeout(300);
  }

  for (const [rotulo, sel] of [
    ['título', '.hero-backdrop--esg .pagehero-entrada h1'],
    ['continuação', '.hero-backdrop--esg .pagehero-entrada h1 + div'],
  ]) {
    const base = `${TEMP}/${w}-${rotulo === 'título' ? 'h1' : 'cont'}`;
    /* Duas fotos do MESMO elemento: uma com a tinta apagada (o fundo puro) e uma
       com a tinta no lugar. A diferença entre as duas é a máscara das letras — e
       é só dentro dela que o contraste importa. Medir a caixa inteira reprova
       por um pixel claro que está no VÃO entre linhas, onde não há letra: foi o
       que a primeira versão desta sonda fez (título "3,17:1" com o pior pixel em
       y=0, a borda de cima da caixa). */
    await pagina.locator(sel).screenshot({ path: `${base}-fundo.png` });
    /* A máscara sai de DUAS fotos com tinta, uma branca e uma preta, e não da
       diferença entre "com tinta" e "sem tinta". Motivo: sobre a mão, que é a
       faixa CLARA da foto, letra branca difere pouco do fundo — o teste por
       diferença descartaria justamente os pixels de risco. Branco contra preto
       difere ao máximo em qualquer fundo. */
    const pintar = async (cor, saida) => {
      await pagina.evaluate(
        ([s, c]) => {
          document.querySelector('#sis206-tinta')?.remove();
          const st = document.createElement('style');
          st.id = 'sis206-tinta';
          st.textContent = `${s}, ${s} *, ${s} span { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
          document.head.append(st);
        },
        [sel, cor],
      );
      await pagina.waitForTimeout(150);
      await pagina.locator(sel).screenshot({ path: saida });
    };
    await pintar('#fff', `${base}-branco.png`);
    await pintar('#000', `${base}-preto.png`);
    await pagina.evaluate(() => document.querySelector('#sis206-tinta')?.remove());
    await pagina.waitForTimeout(120);

    const ler = async (p) =>
      sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const fundo = await ler(`${base}-fundo.png`);
    const branco = await ler(`${base}-branco.png`);
    const preto = await ler(`${base}-preto.png`);
    const { width, height, channels } = fundo.info;
    let pior = { razao: Infinity, px: null, x: 0, y: 0 };
    let pixelsDeLetra = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * channels;
        /* Só pixel de MIOLO de letra: onde a foto branca e a preta divergem por
           mais de 200 nos três canais. A franja de antialiasing diverge menos e
           fica fora — ela é meio-tom e não é o que se lê. */
        const dif = Math.min(
          branco.data[i] - preto.data[i],
          branco.data[i + 1] - preto.data[i + 1],
          branco.data[i + 2] - preto.data[i + 2],
        );
        if (dif < 200) continue;
        pixelsDeLetra += 1;
        const px = { r: fundo.data[i], g: fundo.data[i + 1], b: fundo.data[i + 2] };
        const razao = razaoContraBranco(px);
        if (razao < pior.razao) pior = { razao, px, x, y };
      }
    }
    console.log(
      `${w} · ${rotulo}: pior pixel SOB LETRA ${pior.razao.toFixed(2)}:1 — rgb(${pior.px.r},${pior.px.g},${pior.px.b}) em (${pior.x},${pior.y}) da caixa · ${pixelsDeLetra} pixels de letra · ${pior.razao >= 4.5 ? 'OK' : 'REPROVA'}`,
    );
    await unlink(`${base}-fundo.png`);
    await unlink(`${base}-branco.png`);
    await unlink(`${base}-preto.png`);

  }
  await contexto.close();
}
await navegador.close();
