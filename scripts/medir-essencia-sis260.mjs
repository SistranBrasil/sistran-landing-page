/**
 * SIS-260 — sonda de navegador da seção «Nossa Essência» em `/quem-somos`.
 *
 * Mede o que a issue cobra e o chat não prova: qual estado acende em cada terço
 * da trilha, a geometria do painel e das colunas, se as três artes carregaram,
 * se «Continue rolando» desaparece nos Pilares, a ausência do título antigo,
 * overflow horizontal, erros de console e respostas >= 400.
 *
 * Roda contra o `next dev` já de pé em :3000. Escreve `docs/medidas/essencia-sis260.json`
 * e as capturas em `docs/capturas/` (apagadas no turno de fechamento da issue).
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const URL_BASE = 'http://localhost:3000/quem-somos';
const TELAS = [
  { nome: '1440x900', width: 1440, height: 900 },
  { nome: '1280x800', width: 1280, height: 800 },
  { nome: '768x1024', width: 768, height: 1024 },
  { nome: '390x844', width: 390, height: 844 },
];

const num = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v);

const navegador = await chromium.launch();
const relatorio = { url: URL_BASE, quando: new Date().toISOString(), telas: {} };

await mkdir('docs/medidas', { recursive: true });
await mkdir('docs/capturas', { recursive: true });

for (const tela of TELAS) {
  const ctx = await navegador.newContext({ viewport: { width: tela.width, height: tela.height } });
  const pag = await ctx.newPage();
  const erros = [];
  const respostas = [];
  pag.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  pag.on('pageerror', (e) => erros.push(`pageerror: ${e.message}`));
  pag.on('response', (r) => { if (r.status() >= 400) respostas.push(`${r.status()} ${r.url()}`); });

  await pag.goto(URL_BASE, { waitUntil: 'load', timeout: 90000 });
  await pag.waitForTimeout(2500);

  const secao = pag.locator('.ne-secao');
  await secao.scrollIntoViewIfNeeded();
  await pag.waitForTimeout(1200);

  const sticky = tela.width >= 1024;

  /* Estado ativo em cada terço da trilha. */
  const estados = [];
  for (const fracao of [0.16, 0.5, 0.84]) {
    await pag.evaluate((f) => {
      const t = document.querySelector('.ne-trilha');
      const r = t.getBoundingClientRect();
      const topo = r.top + window.scrollY;
      const destino = topo + r.height * f - window.innerHeight / 2;
      const l = window.__lenis;
      if (l) l.scrollTo(destino, { immediate: true });
      else window.scrollTo({ top: destino, behavior: 'auto' });
    }, fracao);
    await pag.waitForTimeout(1000);
    const ativo = await pag.evaluate(() => {
      const c = document.querySelector('.ne-camada[data-ativo="true"]');
      return c ? c.querySelector('.ne-titulo')?.textContent : null;
    });
    const rolarOculto = await pag.evaluate(() => {
      const el = document.querySelector('.ne-rolar');
      if (!el) return null;
      return { oculto: el.dataset.oculto, opacidade: getComputedStyle(el).opacity };
    });
    estados.push({ fracaoDaTrilha: fracao, ativo, rolar: rolarOculto });
  }

  /* Geometria, com o estado do meio na tela. */
  const geo = await pag.evaluate(() => {
    const cx = (s) => document.querySelector(s)?.getBoundingClientRect() ?? null;
    const palco = document.querySelector('.ne-palco');
    const painel = document.querySelector('.ne-painel');
    const nav = cx('.ne-nav');
    const cp = cx('.ne-painel-caixa');
    const grade = cx('.ne-grade');
    const camada = document.querySelector('.ne-camada[data-ativo="true"]');
    const texto = camada?.querySelector('.ne-texto')?.getBoundingClientRect() ?? null;
    const visual = camada?.querySelector('.ne-visual')?.getBoundingClientRect() ?? null;
    const abas = cx('.ne-abas');
    const pr = painel?.getBoundingClientRect() ?? null;
    const es = painel ? getComputedStyle(painel) : null;
    return {
      palcoPosicao: palco ? getComputedStyle(palco).position : null,
      trilhaAltura: document.querySelector('.ne-trilha')?.getBoundingClientRect().height ?? null,
      painel: pr ? { largura: pr.width, altura: pr.height, padding: es.paddingTop, raio: es.borderTopLeftRadius } : null,
      navLargura: nav?.width ?? null,
      painelCaixaLargura: cp?.width ?? null,
      gradeLargura: grade?.width ?? null,
      fracaoNav: nav && grade ? nav.width / grade.width : null,
      textoLargura: texto?.width ?? null,
      visualLargura: visual?.width ?? null,
      fracaoTexto: texto && camada ? texto.width / camada.getBoundingClientRect().width : null,
      abas: abas && pr ? { visivel: getComputedStyle(document.querySelector('.ne-abas')).display !== 'none', baseRelativaAoPainel: abas.bottom - pr.bottom, itens: document.querySelectorAll('.ne-aba').length } : { visivel: false },
      artes: Array.from(document.querySelectorAll('.ne-visual-img')).map((i) => ({
        src: i.getAttribute('src'), completa: i.complete, larguraNatural: i.naturalWidth, larguraRenderizada: i.getBoundingClientRect().width,
      })),
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tituloAntigo: document.body.innerText.includes('O que sustenta nossa forma de atuar'),
      h2DaSecao: Array.from(document.querySelectorAll('.ne-secao h2')).map((h) => h.textContent),
      outrasSecoes: {
        tecnologias: Boolean(document.querySelector('[class*="tecnolog"], #tecnologias')),
        escritorios: document.body.innerText.includes('Escritórios') || document.body.innerText.includes('escritórios'),
      },
      camadasNoDom: document.querySelectorAll('.ne-camada').length,
      inertAplicado: Array.from(document.querySelectorAll('.ne-camada')).map((c) => c.hasAttribute('inert')),
    };
  });

  await pag.screenshot({ path: `docs/capturas/sis260-essencia-${tela.nome}.png` });

  relatorio.telas[tela.nome] = {
    sticky,
    estados,
    geometria: JSON.parse(JSON.stringify(geo, (k, v) => (typeof v === 'number' ? num(v) : v))),
    errosConsole: erros,
    respostasRuins: respostas,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/essencia-sis260.json', `${JSON.stringify(relatorio, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(relatorio, null, 2));
