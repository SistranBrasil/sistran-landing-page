/**
 * SIS-206 — mede a abertura de /esg: geometria da frase e capturas.
 *
 * O defeito relatado ("frase quebrada") tem três formas verificáveis, e é isso
 * que esta sonda separa, em vez de confiar no olho sobre uma captura:
 *  1. a frase está INTEIRA e na ordem (título + continuação, texto concatenado);
 *  2. nenhuma das duas metades está fora da janela nem recortada pelo `overflow`
 *     da caixa da foto (comparo os retângulos com o da seção e com a janela);
 *  3. a continuação NÃO está em corpo de legenda — corpo e família medidos, e a
 *     comparação com o corpo do `h1`;
 *  4. de 1280 para cima o miolo é grade de duas colunas (as duas caixas lado a
 *     lado, sem se sobrepor); abaixo, bloco único empilhado.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3997';
const DESTINO = process.env.DESTINO ?? 'docs/capturas/sis206-antes';
const LARGURAS = [
  { nome: '1440', width: 1440, height: 900 },
  { nome: '1280', width: 1280, height: 800 },
  { nome: '390', width: 390, height: 844 },
];

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();

for (const l of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: l.width, height: l.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  }).catch(() => undefined);
  await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.hero-backdrop--esg h1', { timeout: 180_000 });
  await pagina.waitForTimeout(1600);
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });

  const m = await pagina.evaluate(() => {
    const caixa = document.querySelector('.hero-backdrop--esg');
    const secao = caixa.querySelector('.pagehero-entrada');
    const h1 = secao.querySelector('h1');
    const cont = h1.nextElementSibling;
    const miolo = h1.parentElement;
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: Math.round(b.left),
        y: Math.round(b.top),
        w: Math.round(b.width),
        h: Math.round(b.height),
        dir: Math.round(b.right),
        base: Math.round(b.bottom),
      };
    };
    const est = (el) => {
      const s = getComputedStyle(el);
      return {
        corpo: s.fontSize,
        familia: s.fontFamily.split(',')[0],
        entrelinha: s.lineHeight,
        cor: s.color,
        maxW: s.maxWidth,
      };
    };
    const linhas = (el) => el.getClientRects().length;
    return {
      janela: { w: innerWidth, h: innerHeight },
      overflowCaixa: getComputedStyle(caixa).overflow,
      secao: r(secao),
      mioloDisplay: getComputedStyle(miolo).display,
      mioloColunas: getComputedStyle(miolo).gridTemplateColumns,
      h1: { ...r(h1), ...est(h1), linhas: linhas(h1), texto: h1.textContent.trim() },
      cont: cont
        ? {
            tag: cont.tagName,
            ...r(cont),
            ...est(cont),
            linhas: linhas(cont.firstElementChild ?? cont),
            texto: cont.textContent.trim(),
          }
        : null,
      quantosH1: document.querySelectorAll('h1').length,
      docScrollW: document.documentElement.scrollWidth,
    };
  });

  const frase = `${m.h1.texto} ${m.cont?.texto ?? ''}`;
  const foraDireita = [m.h1.dir, m.cont?.dir ?? 0].filter((x) => x > m.janela.w + 1);
  const recortadoAbaixo = [m.h1.base, m.cont?.base ?? 0].filter((x) => x > m.secao.base + 1);
  const ladoALado = m.cont && m.h1.dir <= m.cont.x + 1 && m.h1.y < m.cont.base;

  console.log(`\n=== ${l.nome} ===`);
  console.log(`frase: ${frase}`);
  console.log(
    `h1  : ${m.h1.corpo} ${m.h1.familia} · ${m.h1.linhas} linhas · caixa ${m.h1.w}x${m.h1.h} em (${m.h1.x},${m.h1.y}) · maxW ${m.h1.maxW}`,
  );
  if (m.cont)
    console.log(
      `cont: ${m.cont.corpo} ${m.cont.familia} lh ${m.cont.entrelinha} ${m.cont.cor} · ${m.cont.linhas} linhas · caixa ${m.cont.w}x${m.cont.h} em (${m.cont.x},${m.cont.y}) · maxW ${m.cont.maxW}`,
    );
  console.log(
    `miolo: ${m.mioloDisplay} ${m.mioloColunas} · lado a lado: ${ladoALado} · h1 na página: ${m.quantosH1}`,
  );
  console.log(
    `fora da janela à direita: ${foraDireita.length ? foraDireita.join(',') : 'nenhum'} · abaixo do fim da seção (${m.secao.base}): ${recortadoAbaixo.length ? recortadoAbaixo.join(',') : 'nenhum'} · overflow da caixa: ${m.overflowCaixa} · scrollWidth ${m.docScrollW}`,
  );

  await pagina
    .locator('.hero-backdrop--esg')
    .screenshot({ path: `${DESTINO}/esg-abertura-${l.nome}.png` });
  await contexto.close();
}

await navegador.close();
