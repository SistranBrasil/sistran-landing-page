/**
 * SIS-206 — varredura do véu de /esg contra o contraste da manchete.
 *
 * POR QUE ESTA VARREDURA EXISTE. O reparo do arranjo estreitou a coluna do título
 * e o levou para cima de uma faixa mais clara da foto (a área dos rótulos
 * environment/social/governance e da mão que sustenta o globo). Medido com
 * `medir-contraste-abertura-esg-sis206.mjs`: a manchete caiu de 4,70 para 4,03:1
 * a 1280 e de 4,19 para 3,35:1 a 1440 — e a 390 já estava em 3,02:1 ANTES do
 * reparo, ou seja parte da dívida é antiga. O alvo da issue é ≥ 4,5:1.
 *
 * O CAMINHO É O VÉU, e não recuar o texto: `/eventos-inovacao` (SIS-105) e
 * `/contato` (SIS-126) já resolveram exatamente este problema fechando o véu
 * ESCOPADO na própria rota, porque a foto de cada abertura tem brilho diferente.
 * Esta varredura mede quanto de véu compra os 4,5:1 sem apagar o globo.
 *
 * Método de contraste igual ao da sonda: máscara de miolo de letra a partir de
 * duas fotos com tinta (branca e preta), pior pixel do fundo sob a máscara.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const TEMP = 'docs/capturas/sis206-veu';
await mkdir(TEMP, { recursive: true });

/* topo / meio / base do degradê + o chapado que vem embaixo dele. O primeiro é o
   véu BASE (66/34/74 + 16), que é o estado de hoje e serve de régua. */
const CANDIDATOS = [
  { nome: 'A base 66/34/74+16', topo: 66, meio: 34, base: 74, chapado: 16 },
  { nome: 'B 72/52/80+22', topo: 72, meio: 52, base: 80, chapado: 22 },
  { nome: 'C 74/60/84+28', topo: 74, meio: 60, base: 84, chapado: 28 },
  { nome: 'D 76/68/86+34', topo: 76, meio: 68, base: 86, chapado: 34 },
];
const LARGURAS = [1280, 1440, 1920, 390];

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razaoContraBranco = (px) => 1.05 / (luminancia(px) + 0.05);

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
  await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.hero-backdrop--esg h1', { timeout: 180_000 });
  await pagina.waitForTimeout(1500);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });

  for (const cand of CANDIDATOS) {
    await pagina.evaluate((c) => {
      document.querySelector('#sis206-veu')?.remove();
      const st = document.createElement('style');
      st.id = 'sis206-veu';
      st.textContent = `.hero-backdrop--esg .hero-backdrop-veu {
        background:
          linear-gradient(180deg,
            rgb(3 17 38 / ${c.topo}%) 0%,
            rgb(4 27 61 / ${c.meio}%) 45%,
            rgb(4 27 61 / ${c.base}%) 100%),
          rgb(4 27 61 / ${c.chapado}%) !important;
      }`;
      document.head.append(st);
    }, cand);
    await pagina.waitForTimeout(250);

    const linha = [];
    for (const [rotulo, sel] of [
      ['título', '.hero-backdrop--esg .pagehero-entrada h1'],
      ['cont', '.hero-backdrop--esg .pagehero-entrada h1 + div'],
    ]) {
      const base = `${TEMP}/tmp-${w}-${rotulo === 'título' ? 'h1' : 'cont'}`;
      const tinta = async (cor, saida) => {
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
        await pagina.waitForTimeout(120);
        await pagina.locator(sel).screenshot({ path: saida });
      };
      await tinta('transparent', `${base}-fundo.png`);
      await tinta('#fff', `${base}-branco.png`);
      await tinta('#000', `${base}-preto.png`);
      await pagina.evaluate(() => document.querySelector('#sis206-tinta')?.remove());

      const ler = async (p) =>
        sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const fundo = await ler(`${base}-fundo.png`);
      const branco = await ler(`${base}-branco.png`);
      const preto = await ler(`${base}-preto.png`);
      const { width, height, channels } = fundo.info;
      let pior = { razao: Infinity, px: null, x: 0, y: 0 };
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * channels;
          const dif = Math.min(
            branco.data[i] - preto.data[i],
            branco.data[i + 1] - preto.data[i + 1],
            branco.data[i + 2] - preto.data[i + 2],
          );
          if (dif < 200) continue;
          const px = { r: fundo.data[i], g: fundo.data[i + 1], b: fundo.data[i + 2] };
          const razao = razaoContraBranco(px);
          if (razao < pior.razao) pior = { razao, px, x, y };
        }
      }
      linha.push(
        `${rotulo} ${pior.razao.toFixed(2)}:1 rgb(${pior.px.r},${pior.px.g},${pior.px.b}) em (${pior.x},${pior.y}) ${pior.razao >= 4.5 ? 'OK' : 'REPROVA'}`,
      );
      await unlink(`${base}-fundo.png`);
      await unlink(`${base}-branco.png`);
      await unlink(`${base}-preto.png`);
    }
    console.log(`${w} · ${cand.nome} — ${linha.join(' · ')}`);
    /* Captura para julgar o globo: número de contraste não diz se a foto sumiu. */
    await pagina.locator('.hero-backdrop--esg').screenshot({
      path: `${TEMP}/${w}-${cand.nome.split(' ')[0]}.png`,
    });
  }
  await contexto.close();
}
await navegador.close();
