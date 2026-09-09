/**
 * Mede a geometria real das seções da home em 1440x900 e 390x844.
 *
 * Existe porque o prompt de refatoração proporcional (docs/PROMPT-SISTRAN-
 * PROPORCAO-VISUAL-V2.md) exige registrar as medidas ANTES de editar e
 * comparar depois — e "parece pequeno" não é medida. Roda contra o dev server.
 *
 *   node scripts/medir-visual.mjs > docs/medidas-antes.json
 *   node scripts/medir-visual.mjs --tag depois
 *
 * Nada aqui entra no bundle: é ferramenta de bancada.
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const tagIdx = process.argv.indexOf('--tag');
const TAG = tagIdx > -1 ? process.argv[tagIdx + 1] : 'antes';

/* Seletores que o prompt cita por nome, mais os containers de cada capítulo.
   Chave = rótulo legível; valor = seletor. Ausentes são reportados como null em
   vez de derrubar a medição: durante a refatoração alguns deixam de existir, e é
   justamente isso que queremos ver no diff. */
const ALVOS = {
  // Hero
  'hero:secao': '#top, .hero-cinematic, [data-hero]',
  /* NÃO usar `#top h1`: o h1 da home é `sr-only` (1×1px) e mascarava a medida
     do título que de facto se vê, que é a legenda do beat. */
  'hero:titulo': '.hero-caption-title',
  'hero:apoio': '.hero-caption-lead',
  'hero:video': '#top video, .hero-cinematic video',
  // Mosaico
  'mosaico:secao': '.stack-scenes, [data-stack-scenes]',
  'mosaico:card': '[data-carrier-origem]',
  // Soluções
  'solucoes:secao': '#solucoes',
  'solucoes:sticky': '.solutions-sticky',
  'solucoes:titulo': '.solutions-titulo',
  'solucoes:midia': '.solution-cena[data-estado="ativo"] .solution-viewport',
  'solucoes:info-titulo': '.solution-cena[data-estado="ativo"] .solution-info-titulo',
  // Números
  'numeros:secao': '#resultados',
  'numeros:sticky': '.impact-sticky',
  'numeros:titulo': '.impact-titulo',
  'numeros:item-ativo': '.impact-item[data-estado="ativo"]',
  'numeros:numero': '.impact-item[data-estado="ativo"] .impact-numero',
  'numeros:lente': '.impact-lente',
  'numeros:contextual': '.impact-contextual',
  // Parceiros / marquee
  'parceiros:secao': '.lp-signals',
  'parceiros:logo': '.lp-partner',
  // Luminna
  'luminna:secao': '#impacto',
  'luminna:sticky': '.sequence-sticky',
  'luminna:titulo': '#impacto-title',
  'luminna:capitulos': '.sequence-chapters',
  'luminna:cap-titulo': '.sequence-chapter-title',
  // Contato
  'contato:secao': '#contato',
  'contato:palco': '.ct-palco',
  'contato:painel': '.ct-painel',
  'contato:titulo': '#contato-titulo',
  'contato:grid': '.contact-dialog-grid',
};

/** Roda no browser: devolve caixa + tipografia de cada alvo. */
function coletar(alvos) {
  const px = (v) => (v ? Math.round(parseFloat(v) * 10) / 10 : null);
  const out = {};
  for (const [nome, sel] of Object.entries(alvos)) {
    const el = document.querySelector(sel);
    if (!el) {
      out[nome] = null;
      continue;
    }
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out[nome] = {
      seletor: sel,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      // Altura de trilha só faz sentido para as seções: é o scrollHeight dela.
      alturaTrilha: el.scrollHeight,
      fontSize: px(cs.fontSize),
      lineHeight: cs.lineHeight,
      maxWidth: cs.maxWidth,
      // Fração da largura útil da janela — o critério de aceite do prompt.
      fracaoLargura: Math.round((r.width / window.innerWidth) * 1000) / 1000,
      fracaoAltura: Math.round((r.height / window.innerHeight) * 1000) / 1000,
    };
  }
  out['_pagina'] = {
    alturaTotal: document.documentElement.scrollHeight,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    telas: Math.round((document.documentElement.scrollHeight / window.innerHeight) * 10) / 10,
  };
  return out;
}

const VIEWPORTS = [
  { nome: '1440x900', width: 1440, height: 900 },
  { nome: '390x844', width: 390, height: 844 },
];

const navegador = await chromium.launch();
const relatorio = { tag: TAG, quando: new Date().toISOString(), viewports: {} };
const erros = [];

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(`[${vp.nome}] ${m.text()}`);
  });
  page.on('pageerror', (e) => erros.push(`[${vp.nome}] pageerror: ${e.message}`));

  // Pula a abertura opcional: ela cobre a página e falsearia toda a medição.
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('sistran:intro-visto', '1');
    } catch {}
  });

  /* `networkidle` nunca acontece nesta página: o vídeo do hero e o do Luminna
     mantêm requisição aberta. Espera-se o DOM e depois as fontes, que é o que
     de facto move as medidas. */
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1200);

  // Percorre a página inteira antes de medir: as seções dirigidas só publicam
  // geometria depois de o ScrollTrigger ter passado por elas.
  await page.evaluate(async () => {
    const passo = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  relatorio.viewports[vp.nome] = await page.evaluate(coletar, ALVOS);
  await ctx.close();
}

await navegador.close();
relatorio.errosConsole = erros;

mkdirSync('docs/medidas', { recursive: true });
const destino = `docs/medidas/medidas-${TAG}.json`;
writeFileSync(destino, JSON.stringify(relatorio, null, 2));
console.log(`ok -> ${destino}`);
console.log(`erros de console: ${erros.length}`);
for (const e of erros.slice(0, 20)) console.log('  ' + e);
