/**
 * SIS-225 — contraste dos quatro trechos de escrita da abertura de
 * /parceiros-e-implementacoes sobre a capa.
 *
 * Método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`, o mesmo da sonda da SIS-206:
 * fotografa o elemento com a tinta em `transparent` (o FUNDO puro), fotografa
 * duas vezes com tinta — branca e preta — para achar a máscara das letras, e toma
 * o PIOR pixel do fundo dentro da máscara. Média reprova ou aprova pela razão
 * errada; o vão entre linhas não é onde se lê.
 *
 * Quatro trechos, porque nesta abertura eles têm TINTAS diferentes e exigências
 * diferentes:
 *   eyebrow   `#A5F0FF` em 12px maiúsculo  -> exige 4,5:1 (texto pequeno)
 *   título    branco, corpo grande         -> exige 3:1
 *   destaque  `#A5F0FF`, corpo grande      -> exige 3:1
 *   descrição `white/85` em 18px           -> exige 4,5:1
 *
 * A TINTA EFETIVA importa e é o erro que a SIS-137 quase deixou passar: a
 * descrição é branco a 85% COMPOSTO sobre o fundo medido, não branco puro; e o
 * ciano `#A5F0FF` não é branco. Por isso a razão sai contra a cor real de cada
 * trecho, e não contra 1,05 fixo.
 *
 * Uso (com o site no ar):
 *   node scripts/medir-contraste-abertura-parceiros-sis225.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [390, 1024, 1440, 1920];
const TEMP = 'docs/capturas/sis225-contraste';
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
/* Tinta translúcida composta sobre o fundo medido — o que o olho recebe. */
const compor = (tinta, fundo, alfa) => ({
  r: tinta.r * alfa + fundo.r * (1 - alfa),
  g: tinta.g * alfa + fundo.g * (1 - alfa),
  b: tinta.b * alfa + fundo.b * (1 - alfa),
});

const BRANCO = { r: 255, g: 255, b: 255 };
const CIANO = { r: 0xa5, g: 0xf0, b: 0xff };
const RAIZ = '.hero-backdrop--parceiros .pagehero-entrada';
const TRECHOS = [
  { rotulo: 'eyebrow', sel: `${RAIZ} .eyebrow`, tinta: CIANO, alfa: 1, minimo: 4.5 },
  /* O `h1` inteiro inclui o destaque ciano; a máscara é a das letras dos dois, e
     o pior pixel do bloco vale para o branco. O destaque sai separado abaixo. */
  { rotulo: 'título branco', sel: `${RAIZ} h1`, tinta: BRANCO, alfa: 1, minimo: 3 },
  { rotulo: 'destaque ciano', sel: `${RAIZ} h1 span`, tinta: CIANO, alfa: 1, minimo: 3 },
  { rotulo: 'descrição p1', sel: `${RAIZ} h1 + div p:first-child`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
  { rotulo: 'descrição p2', sel: `${RAIZ} h1 + div p:last-child`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
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
  await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector(`${RAIZ} h1`, { timeout: 180_000 });
  /* Espera longa: a entrada tem animação de aparição e no `next dev` a capa ainda
     está sendo baixada no primeiro acesso. Fotografar antes disso mede o fundo
     navy da base da mídia, não a capa. */
  await pagina.waitForTimeout(3000);
  /* O cabeçalho fixo passa POR CIMA do eyebrow em algumas larguras e a sua
     pílula translúcida entraria na foto do fundo como se fosse a capa. Ele é
     escondido, exatamente como na sonda da SIS-206. */
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });
  await pagina.waitForTimeout(200);

  for (const { rotulo, sel, tinta, alfa, minimo } of TRECHOS) {
    const base = `${TEMP}/${w}-${rotulo.replace(/[^a-z0-9]+/gi, '-')}`;
    const pintar = async (cor, saida) => {
      await pagina.evaluate(
        ([s, c]) => {
          document.querySelector('#sis225-tinta')?.remove();
          const st = document.createElement('style');
          st.id = 'sis225-tinta';
          st.textContent = `${s}, ${s} * { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
          document.head.append(st);
        },
        [sel, cor],
      );
      await pagina.waitForTimeout(150);
      await pagina.locator(sel).screenshot({ path: saida });
    };
    /* `transparent` e não `visibility: hidden`: esconder muda o layout e a foto
       sairia de outra caixa. */
    await pintar('transparent', `${base}-fundo.png`);
    await pintar('#fff', `${base}-branco.png`);
    await pintar('#000', `${base}-preto.png`);
    await pagina.evaluate(() => document.querySelector('#sis225-tinta')?.remove());

    const ler = async (p) =>
      sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const fundo = await ler(`${base}-fundo.png`);
    const branco = await ler(`${base}-branco.png`);
    const preto = await ler(`${base}-preto.png`);
    const { width, height, channels } = fundo.info;

    /* DOIS números, e não um: o miolo (divergência > 200 nos três canais) é o que
       se lê; a franja de antialiasing é meio-tom e reprovaria todo rótulo de 11px
       por um pixel que ninguém enxerga. O de franja fica registrado para não
       parecer que foi escondido. */
    const pior = { miolo: { r: Infinity }, franja: { r: Infinity } };
    let pixels = 0;
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
        if (dif >= 200) pixels += 1;
        if (r < pior[alvo].r) pior[alvo] = { r, px, x, y };
      }
    }
    const fmt = (p) =>
      Number.isFinite(p.r)
        ? `${p.r.toFixed(2)}:1 rgb(${p.px.r},${p.px.g},${p.px.b}) em (${p.x},${p.y})`
        : 'sem pixel';
    console.log(
      `${w} · ${rotulo}: miolo ${fmt(pior.miolo)} · franja ${fmt(pior.franja)} · exige ${minimo}:1 · ${
        pior.miolo.r >= minimo ? 'OK' : 'REPROVA'
      } · ${pixels} px de miolo`,
    );
    for (const s of ['fundo', 'branco', 'preto']) await unlink(`${base}-${s}.png`);
  }
  await contexto.close();
}
await navegador.close();
