/**
 * Capturas de validação das rotas internas.
 *
 * Duas por rota e por viewport: a ENTRADA (onde a proporção do título e a
 * superfície de abertura se veem) e a primeira EMENDA de superfície (onde se vê
 * se a alternância de painel lê como decisão ou como corte).
 *
 * O número diz que a superfície existe; só a captura diz se ela está legível.
 * Foi o que pegou o bug do quadro `01 / 07`: as medidas estavam plausíveis e a
 * imagem mostrava o texto fora do quadro.
 *
 * Uso: node scripts/capturar-rotas.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const ROTAS = [
  'quem-somos',
  'solucoes',
  'solucoes/match-ai',
  'transformacao-legado',
  'parceiros-e-implementacoes',
  'sistran-labs',
  'sistran-university',
  'latam',
  'esg',
  'eventos-inovacao',
  'blog',
  'contato',
  'trabalhe-conosco',
  'politica-de-privacidade',
  'relatorio-de-transparencia-salarial',
];

const VIEWPORTS = [
  { nome: '1440x900', width: 1440, height: 900 },
  { nome: '390x844', width: 390, height: 844 },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const dir = 'docs/capturas/rotas';
await mkdir(dir, { recursive: true });

const navegador = await chromium.launch();
const erros = [];
let n = 0;

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(`[${vp.nome}] ${m.text().slice(0, 140)}`);
  });
  page.on('pageerror', (e) => erros.push(`[${vp.nome}] ${e.message.slice(0, 140)}`));

  for (const rota of ROTAS) {
    await page.goto(`${BASE_URL}/${rota}`, { waitUntil: 'load' });
    await dormir(900);

    const arq = rota.replace(/\//g, '_');
    await page.screenshot({ path: `${dir}/${vp.nome}-${arq}-entrada.png` });
    n++;

    /* Segunda captura: a base da PRIMEIRA seção par, que é onde a emenda entre o
       painel e o fundo do body aparece. Resolvida no navegador porque a altura
       da entrada varia por rota — número fixo cairia no lugar errado em metade
       delas. */
    const y = await page.evaluate(() => {
      /* Duas formas porque `/latam` envolve as seções num `<div lang="es">` —
         mesma exceção que a regra de superfícies alternadas em globals.css já
         reconhece. Sem o segundo seletor a rota perderia a captura de emenda,
         que é justamente a que se quer ver. */
      const par =
        document.querySelector('main > section:nth-of-type(2)') ??
        document.querySelector('main > div > section:nth-of-type(2)');
      if (!par) return null;
      const r = par.getBoundingClientRect();
      return r.top + window.scrollY - window.innerHeight * 0.3;
    });
    if (y === null) continue;
    await page.evaluate((d) => {
      const l = window.__lenis;
      if (l?.scrollTo) l.scrollTo(d, { immediate: true });
      else window.scrollTo(0, d);
    }, Math.max(0, y));
    await dormir(900);
    await page.screenshot({ path: `${dir}/${vp.nome}-${arq}-emenda.png` });
    n++;
  }

  await ctx.close();
}

await navegador.close();

console.log(`capturas: ${n} em ${dir}`);
console.log(`erros de console: ${erros.length}`);
for (const e of [...new Set(erros)].slice(0, 20)) console.log('  ' + e);
