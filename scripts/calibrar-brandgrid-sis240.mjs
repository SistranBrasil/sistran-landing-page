/**
 * SIS-240 — CALIBRAÇÃO: qual véu de repouso cada marca aguenta.
 *
 * `node scripts/calibrar-brandgrid-sis240.mjs`
 *
 * A sonda irmã (`medir-brandgrid-sis240.mjs`) mediu o TETO de cada logo — o que ela
 * consegue sem véu nenhum, contra o campo `#f5faff`. DUAS marcas têm teto ABAIXO de
 * 3:1 (addactis 2,62 · dacadoo 2,83). Ou seja: o caminho que a issue sugere primeiro
 * — «subir opacidade e/ou aliviar grayscale» — NÃO fecha essas duas, porque o limite
 * delas não é o véu, é a tinta do arquivo. Trocar arquivo está fora de escopo.
 *
 * ⚠️ Os números acima foram CORRIGIDOS. A primeira leitura dizia quatro tetos abaixo
 * de 3:1 (somando sys4b 2,90 e microsoft-azure 2,93, com earnix 3,01 na linha), e
 * estava errada por defeito de instrumento: a sonda irmã fotografava o teto no meio
 * da `transition` de 400ms da imagem. Com a espera corrigida, sys4b 4,34 ·
 * microsoft-azure 4,33 · earnix 3,45 passam de 3:1 em cor cheia.
 *
 * O que sobra é ESCURECER o desenho por filtro. `brightness(<1)` multiplica os
 * canais de cor e não toca o alfa, então a área transparente da logo continua
 * transparente e só a tinta desce — é a única alavanca que aumenta o contraste sem
 * mexer no arquivo nem no fundo. (`contrast(>1)` faria o oposto no caso que importa:
 * cinza claro está acima do ponto médio, então mais contraste o empurra para o
 * branco.)
 *
 * Esta calibração varre, marca por marca, a combinação `opacity × brightness` e
 * imprime o contraste medido de cada casa. O número que vai para a folha é o MENOR
 * escurecimento que fecha o alvo — não um valor escolhido por gosto.
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const ALVO = 'http://localhost:3000/';
const SAIDA = 'docs/medidas/brandgrid-sis240';
const TEMP = `${SAIDA}/.calibra`;

const OPACIDADES = [0.62, 0.75, 0.85, 1];
const BRILHOS = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function medir(arquivo) {
  const { data, info } = await sharp(arquivo).raw().toBuffer({ resolveWithObject: true });
  const n = info.channels;
  const ls = [];
  for (let i = 0; i < data.length; i += n) ls.push(luminancia(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const p = (q) => ls[Math.round(q * (ls.length - 1))];
  return Number(razao(p(0.05), p(0.95)).toFixed(2));
}

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await contexto.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
const pagina = await contexto.newPage();
await mkdir(TEMP, { recursive: true });

await pagina.goto(ALVO, { waitUntil: 'networkidle' });
await pagina.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 30000 });
await pagina.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 30000 });
const campo = pagina.locator('.marcas-grade-campo');
await campo.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await pagina.waitForFunction(() => {
  const nós = [...document.querySelectorAll('.marcas-grade-logo-reveal')];
  return nós.length > 0 && nós.every((n) => Number(getComputedStyle(n).opacity) > 0.99);
}, null, { timeout: 15000 });
await pagina.waitForTimeout(400);

const celulas = pagina.locator('.marcas-grade-celula');
const total = await celulas.count();
const tabela = [];

for (let i = 0; i < total; i += 1) {
  const celula = celulas.nth(i);
  const slug = await celula.getAttribute('data-marca');
  const img = celula.locator('img');
  const caixa = await img.boundingBox();
  const linha = { slug, casas: {} };

  for (const op of OPACIDADES) {
    for (const br of BRILHOS) {
      await img.evaluate((n, [o, b]) => {
        n.style.opacity = String(o);
        n.style.filter = `grayscale(1) brightness(${b})`;
      }, [op, br]);
      const arquivo = `${TEMP}/${slug}-${op}-${br}.png`;
      await pagina.screenshot({ path: arquivo, clip: caixa });
      linha.casas[`${op}/${br}`] = await medir(arquivo);
    }
  }
  await img.evaluate((n) => n.removeAttribute('style'));
  tabela.push(linha);

  const cols = OPACIDADES.flatMap((o) => BRILHOS.map((b) => String(linha.casas[`${o}/${b}`]).padStart(6)));
  console.log(String(slug).padEnd(17) + cols.join(''));
}

console.log(
  '\ncolunas: ' + OPACIDADES.flatMap((o) => BRILHOS.map((b) => `${o}/${b}`)).join(' '),
);

await writeFile(
  `${SAIDA}/calibracao.json`,
  `${JSON.stringify({ quando: new Date().toISOString(), opacidades: OPACIDADES, brilhos: BRILHOS, tabela }, null, 1)}\n`,
);
console.log(`\n→ ${SAIDA}/calibracao.json`);

await rm(TEMP, { recursive: true, force: true });
await navegador.close();
