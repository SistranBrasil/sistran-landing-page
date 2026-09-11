/**
 * SIS-213 — de qual camada vem o clarão? Diagnóstico por eliminação.
 *
 * Fotografa a seção quatro vezes, desligando uma camada candidata por vez, e
 * reporta o perfil de luminância por linha em cada caso. A camada culpada é a
 * que, ao sair, apaga o trecho claro do perfil; as demais mudam pouco. É a única
 * forma de escolher entre a arte (`atrasnumeros.webp`) e o CSS sem chutar.
 *
 * Uso: URL_BASE=http://localhost:3999 node scripts/isolar-camadas-numeros-sis213.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const PASTA = 'docs/capturas/sis213-camadas';
await mkdir(PASTA, { recursive: true });

const CASOS = [
  { nome: 'completo', css: '' },
  { nome: 'sem-emenda-topo', css: '.impact-scroll::before{display:none!important}' },
  { nome: 'sem-saida', css: '.impact-saida{display:none!important}' },
  { nome: 'sem-vinheta', css: '.impact-vinheta{display:none!important}' },
  { nome: 'sem-arte', css: '.impact-fundo{display:none!important}' },
  { nome: 'sem-track', css: '.impact-track{background:none!important}' },
];

const luminancia = (r, g, b) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const navegador = await chromium.launch();
const perfis = {};
for (const caso of CASOS) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#resultados', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}
      ${caso.css}`,
  });
  await pagina.waitForTimeout(2500);
  const alvo = pagina.locator('#resultados');
  await alvo.scrollIntoViewIfNeeded();
  await pagina.waitForTimeout(500);
  const buffer = await alvo.screenshot({ path: `${PASTA}/${caso.nome}.png` });
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const linhas = [];
  for (let y = 0; y < height; y += 1) {
    let soma = 0;
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      soma += luminancia(data[i], data[i + 1], data[i + 2]);
    }
    linhas.push(soma / width);
  }
  perfis[caso.nome] = { linhas, height };
  console.log(`${caso.nome}: ${width}x${height}`);
  await contexto.close();
}
await navegador.close();

/* Tabela comparativa em 20 fatias da altura: a coluna que despenca em relação a
   `completo` denuncia a camada. */
const alturas = Object.values(perfis).map((p) => p.height);
const H = Math.min(...alturas);
const nomes = CASOS.map((c) => c.nome);
console.log(`\ny%\t${nomes.join('\t')}`);
for (let f = 0; f <= 20; f += 1) {
  const y = Math.min(H - 1, Math.round((f / 20) * H));
  const cols = nomes.map((n) => perfis[n].linhas[y].toFixed(3));
  console.log(`${(f * 5).toString().padStart(3)}\t${cols.join('\t')}`);
}
