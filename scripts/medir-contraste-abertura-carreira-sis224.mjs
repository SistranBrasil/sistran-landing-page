/**
 * SIS-224 — contraste da escrita da abertura de /trabalhe-conosco sobre o take.
 *
 * Mesmo método de `docs/medidas/COMO-MEDIR-CONTRASTE.md` e da sonda da SIS-225:
 * fotografa o elemento com a tinta `transparent` (o FUNDO puro), depois em branco
 * e em preto para achar a máscara das letras, e toma o PIOR pixel do fundo dentro
 * dela. A tinta comparada é a EFETIVA — `white/85` composto sobre o fundo medido,
 * e o ciano `#A5F0FF` como ele é —, que é o erro que a SIS-137 quase deixou
 * passar.
 *
 * O véu é o de uma rota com VÍDEO: o quadro muda a cada frame e o pior pixel com
 * ele. Por isso o laço é travado num tempo fixo (`currentTime`), o mesmo da sonda
 * de captura, senão duas medições nunca falam do mesmo fundo.
 *
 * Uso (com o site no ar):
 *   node scripts/medir-contraste-abertura-carreira-sis224.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(',').map(Number)
  : [390, 1024, 1440, 1920];
/* Vários instantes do laço, e não um: o pior pixel do quadro 2s não é o do quadro
   5s, e o véu tem de atender ao pior de todos. */
const INSTANTES = process.env.INSTANTES ? process.env.INSTANTES.split(',').map(Number) : [0, 2, 5];
const TEMP = 'docs/capturas/sis224-contraste';
await mkdir(TEMP, { recursive: true });

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05];
  return x > y ? x / y : y / x;
};
const compor = (tinta, fundo, alfa) => ({
  r: tinta.r * alfa + fundo.r * (1 - alfa),
  g: tinta.g * alfa + fundo.g * (1 - alfa),
  b: tinta.b * alfa + fundo.b * (1 - alfa),
});

const BRANCO = { r: 255, g: 255, b: 255 };
const CIANO = { r: 0xa5, g: 0xf0, b: 0xff };
const FAINT = { r: 0xbc, g: 0xd8, b: 0xee };
const RAIZ = '.hero-backdrop--carreira .pagehero-entrada';
const CARTAO = '.hero-backdrop--carreira #curriculo';
const TRECHOS = [
  { rotulo: 'eyebrow', sel: `${RAIZ} .eyebrow`, tinta: CIANO, alfa: 1, minimo: 4.5 },
  /* O `h1` inteiro inclui o destaque ciano; a máscara é a das letras dos dois e o
     pior pixel do bloco vale para o branco. O destaque sai separado abaixo. */
  { rotulo: 'titulo branco', sel: `${RAIZ} h1`, tinta: BRANCO, alfa: 1, minimo: 3 },
  { rotulo: 'destaque ciano', sel: `${RAIZ} h1 span`, tinta: CIANO, alfa: 1, minimo: 3 },
  { rotulo: 'descricao', sel: `${RAIZ} h1 + div p`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
  /* O cartão de vidro: a issue pede que ele siga legível, e ele tem fundo próprio
     (`glass-card`) além do véu. */
  { rotulo: 'cartao titulo', sel: `${CARTAO} h2`, tinta: BRANCO, alfa: 1, minimo: 3 },
  { rotulo: 'cartao paragrafo', sel: `${CARTAO} p:nth-of-type(1)`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
  { rotulo: 'cartao nota', sel: `${CARTAO} p:last-of-type`, tinta: FAINT, alfa: 1, minimo: 4.5 },
];

const navegador = await chromium.launch();
for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/trabalhe-conosco`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector(`${RAIZ} h1`, { timeout: 180_000 });
  /* Espera longa: no `next dev` o laço ainda está sendo baixado no primeiro
     acesso, e medir antes disso mede o pôster. */
  await pagina.waitForTimeout(3500);
  /* O cabeçalho fixo passa por cima do eyebrow em algumas larguras e a pílula
     translúcida dele entraria na foto do fundo como se fosse o take. */
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });

  const pior = new Map();
  for (const t of INSTANTES) {
    await pagina.evaluate((tempo) => {
      const v = document.querySelector('.hero-backdrop--carreira video');
      if (v) {
        v.pause();
        v.currentTime = tempo;
      }
    }, t);
    await pagina.waitForTimeout(500);

    for (const { rotulo, sel, tinta, alfa } of TRECHOS) {
      if ((await pagina.locator(sel).count()) === 0) continue;
      const base = `${TEMP}/${w}-${t}-${rotulo.replace(/[^a-z0-9]+/gi, '-')}`;
      const pintar = async (cor, saida) => {
        await pagina.evaluate(
          ([s, c]) => {
            document.querySelector('#sis224-tinta')?.remove();
            const st = document.createElement('style');
            st.id = 'sis224-tinta';
            st.textContent = `${s}, ${s} * { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
            document.head.append(st);
          },
          [sel, cor],
        );
        await pagina.waitForTimeout(120);
        await pagina.locator(sel).first().screenshot({ path: saida });
      };
      /* `transparent` e não `visibility: hidden`: esconder muda o layout e a foto
         sairia de outra caixa. */
      await pintar('transparent', `${base}-fundo.png`);
      await pintar('#fff', `${base}-branco.png`);
      await pintar('#000', `${base}-preto.png`);
      await pagina.evaluate(() => document.querySelector('#sis224-tinta')?.remove());

      const ler = async (p) =>
        sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const fundo = await ler(`${base}-fundo.png`);
      const branco = await ler(`${base}-branco.png`);
      const preto = await ler(`${base}-preto.png`);
      const { width, height, channels } = fundo.info;

      /* DOIS números: o miolo (divergência ≥ 200) é o que se lê; a franja de
         antialiasing é meio-tom e reprovaria todo rótulo de 11px por um pixel que
         ninguém enxerga. A franja fica registrada para não parecer escondida. */
      const atual = pior.get(rotulo) ?? { miolo: { r: Infinity }, franja: { r: Infinity }, pixels: 0 };
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * channels;
          const dif = Math.min(
            branco.data[i] - preto.data[i],
            branco.data[i + 1] - preto.data[i + 1],
            branco.data[i + 2] - preto.data[i + 2],
          );
          if (dif < 24) continue;
          const px = { r: fundo.data[i], g: fundo.data[i + 1], b: fundo.data[i + 2] };
          const r = razao(compor(tinta, px, alfa), px);
          const alvo = dif >= 200 ? 'miolo' : 'franja';
          if (dif >= 200) atual.pixels += 1;
          if (r < atual[alvo].r) atual[alvo] = { r, px, x, y, t };
        }
      }
      pior.set(rotulo, atual);
      for (const s of ['fundo', 'branco', 'preto']) await unlink(`${base}-${s}.png`);
    }
  }

  for (const { rotulo, minimo } of TRECHOS) {
    const p = pior.get(rotulo);
    if (!p) continue;
    const fmt = (q) =>
      Number.isFinite(q.r)
        ? `${q.r.toFixed(2)}:1 rgb(${q.px.r},${q.px.g},${q.px.b}) em (${q.x},${q.y}) t=${q.t}s`
        : 'sem pixel';
    console.log(
      `${w} · ${rotulo}: miolo ${fmt(p.miolo)} · franja ${fmt(p.franja)} · exige ${minimo}:1 · ${
        p.miolo.r >= minimo ? 'OK' : 'REPROVA'
      }`,
    );
  }
  await contexto.close();
}
await navegador.close();
