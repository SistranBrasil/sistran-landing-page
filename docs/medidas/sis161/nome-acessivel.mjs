/* SIS-161 (conferencia) — os outros dois achados.
   1) A tooltip nativa do `<title>` do SVG deixou de existir?
   2) O nome acessivel do mapa continua o mesmo depois de o texto mudar de casa?
   3) A palavra "Escritórios" deixou de ser anunciada duas vezes?
   `page.accessibility.snapshot()` nao existe nesta build do Playwright, entao a
   verificacao é pelo contrato: presenca de `<title>`, resolucao de
   `aria-labelledby` e `innerText` (que respeita `aria-hidden`... nao respeita, e
   por isso o teste do olho é pelo atributo, nao pelo texto). */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const nav = await chromium.launch();
for (const reduzido of [false, true]) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    ...(reduzido ? { reducedMotion: 'reduce' } : {}),
  });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:3000/quem-somos', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(2500);
  const r = await pg.evaluate(() => {
    const svg = document.querySelector('.bm-mapa');
    const secao = document.querySelector('section[aria-labelledby="escritorios"]');
    const olho = document.querySelector('.os-olho');
    const nomeDe = (el) =>
      (el?.getAttribute('aria-labelledby') || '')
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent?.trim().replace(/\s+/g, ' ') ?? `⚠ id ausente: ${id}`)
        .join(' | ');
    return {
      /* Se voltar > 0, a tooltip amarela voltou. */
      titlesNoSvg: svg ? svg.querySelectorAll('title').length : '(sem svg)',
      descNoSvg: svg ? svg.querySelectorAll('desc').length : '(sem svg)',
      nomeDoMapa: nomeDe(svg),
      nomeDaSecao: nomeDe(secao),
      olhoAriaHidden: olho?.getAttribute('aria-hidden'),
      olhoTexto: olho?.textContent?.trim(),
      /* O `id` do titulo tem de existir uma unica vez no documento. */
      idsBmTitulo: document.querySelectorAll('#bm-titulo').length,
      idsEscritorios: document.querySelectorAll('#escritorios').length,
      cidadesVisiveis: [...document.querySelectorAll('.os-painel')].map((p) => ({
        cidade: p.id,
        visivel: getComputedStyle(p).visibility !== 'hidden' && getComputedStyle(p).display !== 'none',
      })),
      fotos: document.querySelectorAll('.os-painel img').length,
    };
  });
  console.log(reduzido ? 'MOVIMENTO REDUZIDO' : 'PADRAO', JSON.stringify(r, null, 1));
  await ctx.close();
}
await nav.close();
