/**
 * SIS-49 — malha fina atrás dos sete cartões de `/contato`.
 * Roda contra o dev de pé: node scripts/medir-grade-sis49.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
];
const SEM_MALHA = '.contato-indicadores.section-light::before{display:none!important}';
const LIMPEZA = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
  header.fixed{display:none!important}`;

async function liberarRota(page) {
  await page.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 });
  await page.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 180_000 });
}
async function assentar(page, seletor) {
  await page.locator(seletor).scrollIntoViewIfNeeded();
  let anterior = null;
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const topo = await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      return Math.round(el.getBoundingClientRect().top);
    }, seletor);
    if (topo !== null && topo === anterior) return true;
    anterior = topo;
    await page.waitForTimeout(120);
  }
  return false;
}

const cru = async (buf) => {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, info };
};

const lerPseudo = `(sel, pseudo) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const s = getComputedStyle(el, pseudo);
  return {
    content: s.content,
    backgroundImage: s.backgroundImage,
    backgroundSize: s.backgroundSize,
    backgroundAttachment: s.backgroundAttachment,
    opacity: s.opacity,
    zIndex: s.zIndex,
    position: s.position,
    maskImage: s.maskImage,
    webkitMaskImage: s.webkitMaskImage,
    pointerEvents: s.pointerEvents,
    display: s.display,
    inset: [s.top, s.right, s.bottom, s.left].join(' '),
  };
}`;

const periodo = (soma, moduloEsperado) => {
  const maximo = Math.max(...soma);
  if (maximo === 0) return { fios: 0, passos: [], multiplos: [], confere: false };
  const posicoes = [];
  soma.forEach((v, i) => {
    if (v >= maximo * 0.5) posicoes.push(i);
  });
  const grupos = [];
  for (const v of posicoes) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && v - ultimo[ultimo.length - 1] <= 2) ultimo.push(v);
    else grupos.push([v]);
  }
  const centros = grupos.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
  const passos = centros.slice(1).map((c, i) => Number((c - centros[i]).toFixed(1)));
  const multiplos = passos.map((p) => Number((p / moduloEsperado).toFixed(2)));
  return {
    fios: centros.length,
    passos,
    multiplos,
    confere:
      passos.length > 0 &&
      multiplos.every((m) => m >= 0.97 && Math.abs(m - Math.round(m)) <= 0.05),
  };
};

mkdirSync('docs/capturas', { recursive: true });
mkdirSync('docs/medidas', { recursive: true });

const navegador = await chromium.launch();
const relatorio = { issue: 'SIS-49', base: BASE, quando: new Date().toISOString(), viewports: {} };

for (const { w, h } of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', 'true');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
  });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.waitForSelector('.contato-indicador', { timeout: 180_000 });
  await liberarRota(page);
  await page.addStyleTag({ content: LIMPEZA });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await assentar(page, '.contato-indicadores');
  await page.waitForTimeout(700);

  const contato = await page.evaluate((lerPseudoSrc) => {
    const lerPseudo = eval(lerPseudoSrc);
    const secao = document.querySelector('.contato-indicadores');
    const raiz = getComputedStyle(document.documentElement);
    const antes = getComputedStyle(secao, '::before');
    const depois = getComputedStyle(secao, '::after');
    const eGrade = (s) =>
      /repeating-linear-gradient/.test(s) ||
      (/linear-gradient/.test(s) && !/radial-gradient/.test(s) && /1px/.test(s));
    const descendentes = [...secao.querySelectorAll('*')].filter((el) => {
      const bi = getComputedStyle(el).backgroundImage;
      return bi !== 'none' && eGrade(bi);
    }).length;
    const cartoes = [...document.querySelectorAll('.contato-indicador')].map((c) => {
      const cs = getComputedStyle(c);
      return {
        rotulo: c.querySelector('.contato-indicador-rotulo')?.textContent?.trim() ?? '',
        valorSr: c.querySelector('.sr-only')?.textContent?.trim() ?? '',
        zIndex: cs.zIndex,
        animationName: cs.animationName,
        backgroundColor: cs.backgroundColor,
      };
    });
    return {
      tokens: {
        modulo: raiz.getPropertyValue('--grade-fina-modulo').trim(),
        linha: raiz.getPropertyValue('--grade-fina-linha').trim(),
        opacidade: raiz.getPropertyValue('--grade-fina-opacidade').trim(),
        moduloTecnico: raiz.getPropertyValue('--grade-modulo').trim(),
      },
      before: lerPseudo('.contato-indicadores', '::before'),
      after: {
        backgroundImage: depois.backgroundImage.slice(0, 180),
        eGrade: depois.backgroundImage !== 'none' && eGrade(depois.backgroundImage),
        zIndex: depois.zIndex,
      },
      isolation: getComputedStyle(secao).isolation,
      overflowX: getComputedStyle(secao).overflowX,
      clientWidth: secao.clientWidth,
      scrollWidth: secao.scrollWidth,
      overflowDelta: secao.scrollWidth - secao.clientWidth,
      altura: Math.round(secao.getBoundingClientRect().height),
      camadasDeGrade:
        (antes.backgroundImage !== 'none' && eGrade(antes.backgroundImage) ? 1 : 0) +
        (depois.backgroundImage !== 'none' && eGrade(depois.backgroundImage) ? 1 : 0) +
        descendentes,
      cartoes,
      nCartoes: cartoes.length,
    };
  }, lerPseudo);

  const caixas = await page.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores').getBoundingClientRect();
    const cartoes = [...document.querySelectorAll('.contato-indicador')].map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    return { secao: { x: secao.x, y: secao.y, w: secao.width, h: secao.height }, cartoes };
  });
  const clipSecao = {
    x: Math.max(0, Math.floor(caixas.secao.x)),
    y: Math.max(0, Math.floor(caixas.secao.y)),
    width: Math.min(Math.ceil(caixas.secao.w), w),
    height: Math.min(Math.ceil(caixas.secao.h), h - Math.max(0, Math.floor(caixas.secao.y))),
  };

  const fotoComMalha = await page.screenshot({ clip: clipSecao });
  const desligar = await page.addStyleTag({ content: SEM_MALHA });
  await page.waitForTimeout(400);
  const fotoSemMalha = await page.screenshot({ clip: clipSecao });
  await desligar.evaluate((el) => el.remove());
  await page.waitForTimeout(400);
  const fotoComMalha2 = await page.screenshot({ clip: clipSecao });

  writeFileSync(`docs/capturas/sis49-${w}-com-malha.png`, fotoComMalha);
  writeFileSync(`docs/capturas/sis49-${w}-sem-malha.png`, fotoSemMalha);

  const { data: dCom, info } = await cru(fotoComMalha);
  const { data: dSem } = await cru(fotoSemMalha);
  const { data: dCom2 } = await cru(fotoComMalha2);
  const mudou = new Uint8Array(info.width * info.height);
  let totalMudou = 0;
  let maiorDelta = 0;
  const delta = (a, b, i) =>
    Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
  for (let p = 0; p < info.width * info.height; p += 1) {
    const i = p * info.channels;
    const d1 = delta(dCom, dSem, i);
    const d2 = delta(dCom2, dSem, i);
    if (delta(dCom, dCom2, i) >= 1) continue;
    if (d1 >= 1 && d2 >= 1) {
      mudou[p] = 1;
      totalMudou += 1;
      if (d1 > maiorDelta) maiorDelta = d1;
    }
  }

  const raio = await page.evaluate(() =>
    Number.parseFloat(
      getComputedStyle(document.querySelector('.contato-indicador')).borderTopLeftRadius,
    ),
  );
  const dentroDeCartao = caixas.cartoes.map((c, indice) => {
    const x0 = Math.max(0, Math.round(c.x - clipSecao.x) + 2);
    const y0 = Math.max(0, Math.round(c.y - clipSecao.y) + 2);
    const x1 = Math.min(info.width, Math.round(c.x - clipSecao.x + c.w) - 2);
    const y1 = Math.min(info.height, Math.round(c.y - clipSecao.y + c.h) - 2);
    let n = 0;
    let area = 0;
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const cxArco = x < x0 + raio ? x0 + raio : x > x1 - 1 - raio ? x1 - 1 - raio : x;
        const cyArco = y < y0 + raio ? y0 + raio : y > y1 - 1 - raio ? y1 - 1 - raio : y;
        if (Math.hypot(x - cxArco, y - cyArco) > raio) continue;
        area += 1;
        if (mudou[y * info.width + x] === 1) n += 1;
      }
    }
    return { cartao: indice + 1, area, pixeisAlterados: n };
  });

  const foraDeCartao = new Uint8Array(info.width * info.height).fill(1);
  for (const c of caixas.cartoes) {
    const x0 = Math.max(0, Math.round(c.x - clipSecao.x));
    const y0 = Math.max(0, Math.round(c.y - clipSecao.y));
    const x1 = Math.min(info.width, Math.round(c.x - clipSecao.x + c.w));
    const y1 = Math.min(info.height, Math.round(c.y - clipSecao.y + c.h));
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) foraDeCartao[y * info.width + x] = 0;
    }
  }
  const somaColuna = new Array(info.width).fill(0);
  const somaLinha = new Array(info.height).fill(0);
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const p = y * info.width + x;
      if (mudou[p] && foraDeCartao[p]) {
        somaColuna[x] += 1;
        somaLinha[y] += 1;
      }
    }
  }
  const moduloEsperado = Number.parseFloat(contato.tokens.modulo);
  const horizontal = periodo(somaColuna, moduloEsperado);
  const vertical = periodo(somaLinha, moduloEsperado);

  /* Home: mesma receita de tokens no canvas. */
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await liberarRota(page);
  await page.addStyleTag({ content: LIMPEZA });
  const home = await page.evaluate((lerPseudoSrc) => {
    const lerPseudo = eval(lerPseudoSrc);
    const canvas = document.querySelector('.home-canvas');
    const sl = document.querySelector('.home-canvas .section-light');
    return {
      canvasBefore: lerPseudo('.home-canvas', '::before'),
      sectionLightBeforeDisplay: sl
        ? getComputedStyle(sl, '::before').display
        : null,
    };
  }, lerPseudo);

  /* Outra section-light: /quem-somos, a primeira que não é ISG. */
  await page.goto(`${BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.waitForSelector('.section-light', { timeout: 180_000 });
  await liberarRota(page);
  const outra = await page.evaluate(() => {
    const el = [...document.querySelectorAll('.section-light')].find(
      (n) =>
        !n.classList.contains('contato-indicadores') &&
        !n.classList.contains('esg-intro') &&
        !n.classList.contains('isg-secao'),
    );
    if (!el) return null;
    const s = getComputedStyle(el, '::before');
    return {
      seletorAprox: `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`,
      backgroundImage: s.backgroundImage,
      backgroundSize: s.backgroundSize,
      opacity: s.opacity,
      usaMalhaTecnica: /121,\s*203/.test(s.backgroundImage),
      usaRepeating: /repeating-linear-gradient/.test(s.backgroundImage),
    };
  });

  relatorio.viewports[`${w}x${h}`] = {
    contato,
    malha: {
      pixeisAlterados: totalMudou,
      maiorDeltaPorCanal: maiorDelta,
      malhaAparece: totalMudou > 0,
      moduloEsperado,
      fiosVerticais: horizontal,
      fiosHorizontais: vertical,
      periodoConfere: horizontal.confere && vertical.confere,
    },
    atrasDosCartoes: {
      raioDoCartao: raio,
      porCartao: dentroDeCartao,
      totalDentroDeCartoes: dentroDeCartao.reduce((a, c) => a + c.pixeisAlterados, 0),
      limpoSobreOsCartoes: dentroDeCartao.every((c) => c.pixeisAlterados === 0),
    },
    home,
    outraSectionLight: outra,
  };
  await ctx.close();
}

const veredito = Object.entries(relatorio.viewports).map(([vp, d]) => {
  const bi = d.contato.before.backgroundImage;
  return {
    vp,
    doisRepeating: (bi.match(/repeating-linear-gradient/g) ?? []).length === 2,
    semMalhaTecnica: !/121,\s*203/.test(bi),
    opacity: d.contato.before.opacity,
    backgroundSize: d.contato.before.backgroundSize,
    zIndex: d.contato.before.zIndex,
    overflowDelta: d.contato.overflowDelta,
    camadas: d.contato.camadasDeGrade,
    nCartoes: d.contato.nCartoes,
    periodoConfere: d.malha.periodoConfere,
    malhaAparece: d.malha.malhaAparece,
    limpoSobreOsCartoes: d.atrasDosCartoes.limpoSobreOsCartoes,
    homeOpacity: d.home.canvasBefore?.opacity,
    homeRepeating: (d.home.canvasBefore?.backgroundImage.match(/repeating-linear-gradient/g) ?? [])
      .length,
    homeSectionLightBeforeDisplay: d.home.sectionLightBeforeDisplay,
    outraTecnica: d.outraSectionLight?.usaMalhaTecnica,
    outraSize: d.outraSectionLight?.backgroundSize,
  };
});
relatorio.resumo = veredito;

writeFileSync('docs/medidas/grade-sis49.json', JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify({ resumo: veredito, tokens1440: relatorio.viewports['1440x900']?.contato.tokens }, null, 2));
await navegador.close();
