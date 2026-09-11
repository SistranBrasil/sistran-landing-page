/**
 * SIS-212 — contraste da manchete de /contato depois do negrito, e a captura.
 *
 * POR QUE REMEDIR. A foto de /contato é a mais clara das aberturas com mídia (foi
 * ela que exigiu o véu mais fechado de todas na SIS-126: 74/70/84 + 32%), e o
 * negrito muda QUAIS pixels do fundo ficam sob letra: a haste engorda e o miolo
 * cobre área nova. O número da SIS-126 foi medido com peso 400 e não vale mais.
 *
 * Método de `docs/medidas/COMO-MEDIR-CONTRASTE.md` com a máscara de miolo de
 * letra: três fotos do mesmo elemento (tinta transparente = o fundo puro, tinta
 * branca e tinta preta), pixel de letra é onde branco e preto divergem por mais de
 * 200 nos três canais (a franja de antialiasing fica fora, ela é meio-tom), e o
 * veredito é o PIOR pixel do fundo sob essa máscara. Medir a caixa inteira
 * reprovaria por um pixel claro no VÃO entre linhas, onde não há letra.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const DESTINO = 'docs/capturas';
await mkdir(DESTINO, { recursive: true });

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razaoContraBranco = (px) => 1.05 / (luminancia(px) + 0.05);

const navegador = await chromium.launch();
for (const w of [390, 1024, 1280, 1440, 1920]) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.hero-backdrop--contato h1', { timeout: 180_000 });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(1200);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });

  /* Captura antes de mexer na tinta: é ela que o revisor olha. */
  await pagina
    .locator('.hero-backdrop--contato')
    .screenshot({ path: `${DESTINO}/sis212-contato-abertura-${w}.png` });

  for (const [rotulo, sel] of [
    ['manchete', '.hero-backdrop--contato .pagehero-entrada h1'],
    ['continuação', '.hero-backdrop--contato .pagehero-entrada h1 + div'],
  ]) {
    const base = `${DESTINO}/tmp-sis212-${w}-${rotulo === 'manchete' ? 'h1' : 'cont'}`;
    const pintar = async (cor, saida) => {
      await pagina.evaluate(
        ([s, c]) => {
          document.querySelector('#sis212-tinta')?.remove();
          const st = document.createElement('style');
          st.id = 'sis212-tinta';
          st.textContent = `${s}, ${s} *, ${s} span { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
          document.head.append(st);
        },
        [sel, cor],
      );
      await pagina.waitForTimeout(150);
      await pagina.locator(sel).screenshot({ path: saida });
    };
    await pintar('transparent', `${base}-fundo.png`);
    await pintar('#fff', `${base}-branco.png`);
    await pintar('#000', `${base}-preto.png`);
    await pagina.evaluate(() => document.querySelector('#sis212-tinta')?.remove());

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
    /* O texto grande (≥ 24px em negrito, ≥ 18.66px sem) tem alvo AA de 3:1, mas
       aqui se cobra 4,5:1 do mesmo jeito: é o alvo que as outras aberturas desta
       casa usam, e afrouxar por causa do tamanho seria mudar a régua no meio. */
    console.log(
      `${w} · ${rotulo}: pior pixel SOB LETRA ${pior.razao.toFixed(2)}:1 — rgb(${pior.px.r},${pior.px.g},${pior.px.b}) em (${pior.x},${pior.y}) · ${pixelsDeLetra} pixels de letra · ${pior.razao >= 4.5 ? 'OK' : 'REPROVA'}`,
    );
    await unlink(`${base}-fundo.png`);
    await unlink(`${base}-branco.png`);
    await unlink(`${base}-preto.png`);
  }
  await contexto.close();
}
await navegador.close();
