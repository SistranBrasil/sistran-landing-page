/**
 * SIS-216 — portões medidos dos cards de `/solucoes` § Tecnologia Disruptiva.
 *
 * O que ele mede, um item da issue por vez:
 *  2. a Lumina AI ocupa a LARGURA INTEIRA da grade e é a primeira; os outros seis
 *     ficam em duas colunas a 1440 e empilhados a 390;
 *  3. nenhum ordinal «01…07» sobrou no texto da seção;
 *  5. o hover ergue o card em 6px EXATOS e faz a capa a `scale(1.06)`;
 *     nos dois canais de movimento reduzido não há erguida nem zoom, e a borda,
 *     a sombra e o botão preenchido permanecem;
 *  + a legibilidade sobre a foto: luminância do COMPOSTO sob o texto e sob a
 *    logo, amostrada do pixel já pintado (é o único jeito de saber o que o olho
 *    recebe — o véu é alfa sobre foto, não cor chapada).
 *
 * POR QUE RAMPA DE SCROLL E NÃO `scrollIntoView`
 * A seção entra por variants do `motion/react`. Um salto único deixa os cards no
 * transform inicial com `opacity: 0`, e toda geometria lida ali é lixo silencioso.
 * A rampa em passos de 300px dá quadros para o observer disparar.
 *
 * Uso: node scripts/medir-cards-solucoes-sis216.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';

/** Luminância relativa da WCAG a partir de «rgb(r, g, b)». */
const luminancia = (css) => {
  const [r, g, b] = css.match(/\d+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

const navegador = await chromium.launch();

/** Amostra o pixel COMPOSTO: recorta 1x1 do print da página e lê o RGB. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({
    animations: 'disabled',
    clip: { x, y, width: 1, height: 1 },
  });
  // PNG 1x1: decodifica pelo próprio navegador, que já tem o decoder.
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, bl] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${bl})`;
  }, buf.toString('base64'));
}

async function abrir({ largura, reduce }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}/solucoes`, { waitUntil: 'load', timeout: 90000 });
  await rampa(page);
  return { ctx, page, erros };
}

/** Caixas dos sete cards, na ordem do DOM, com a coluna deduzida do `left`. */
const lerGrade = (page) =>
  page.evaluate(() => {
    const grade = document.querySelector('#tecnologia-disruptiva .accel-grade');
    const gb = grade.getBoundingClientRect();
    const itens = [...grade.querySelectorAll('.accel-item')].map((it) => {
      const r = it.getBoundingClientRect();
      const logo = it.querySelector('.accel-logo__img')?.getBoundingClientRect();
      return {
        nome: it.querySelector('h3')?.textContent,
        destaque: it.classList.contains('accel-item--destaque'),
        left: Math.round(r.left),
        largura: Math.round(r.width),
        altura: Math.round(r.height),
        logoAltura: logo ? Math.round(logo.height) : null,
        cta: it.querySelector('.accel-card__cta')?.textContent,
      };
    });
    return { gradeLargura: Math.round(gb.width), itens };
  });

const resultado = {};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });
  const grade = await lerGrade(page);

  /* Ordinais: a issue pede remoção COMPLETA. Procuro o padrão no texto renderizado
     da seção inteira, não só nos cards — um resto no cabeçalho também contaria. */
  const ordinais = await page.evaluate(() =>
    (document.querySelector('#tecnologia-disruptiva').innerText.match(/\b0[1-7]\b/g) ?? []),
  );

  /* HOVER no Guru (último card), que é o que a issue manda capturar. */
  const alvo = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')];
    const guru = cards.find((c) => c.querySelector('h3')?.textContent?.includes('Guru'));
    guru.scrollIntoView({ block: 'center' });
    return null;
  });
  void alvo;
  await page.waitForTimeout(1200);

  const medirHover = async () => {
    const box = await page.evaluate(() => {
      const guru = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')].find((c) =>
        c.querySelector('h3')?.textContent?.includes('Guru'),
      );
      const r = guru.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, topo: r.top };
    });
    const repouso = box.topo;
    await page.mouse.move(box.x, box.y);
    await page.waitForTimeout(900);
    return page.evaluate(
      ({ repouso }) => {
        const guru = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')].find((c) =>
          c.querySelector('h3')?.textContent?.includes('Guru'),
        );
        const card = guru.querySelector('.accel-card');
        const foto = guru.querySelector('.accel-card__foto');
        const cta = guru.querySelector('.accel-card__cta');
        const sc = getComputedStyle(card);
        const sf = getComputedStyle(foto);
        const st = getComputedStyle(cta);
        const escala = (t) => (t === 'none' ? 1 : Number(new DOMMatrixReadOnly(t).a.toFixed(4)));
        return {
          erguidaPx: Number((repouso - card.getBoundingClientRect().top).toFixed(2)),
          zoomFoto: escala(sf.transform),
          borda: sc.borderTopColor,
          sombraAcesa: sc.boxShadow.includes('14, 216, 246'),
          ctaFundo: st.backgroundColor,
          ctaTinta: st.color,
        };
      },
      { repouso },
    );
  };

  const hover = await medirHover();

  /* LEGIBILIDADE no composto. Amostro dentro da caixa do parágrafo e da logo do
     card de destaque (o pior caso: é lá que o véu abre mais cedo, em 48%). */
  const pontos = await page.evaluate(() => {
    const d = document.querySelector('.accel-item--destaque');
    d.scrollIntoView({ block: 'center' });
    const p = d.querySelector('.accel-card__texto').getBoundingClientRect();
    const l = d.querySelector('.accel-logo__img').getBoundingClientRect();
    return {
      textoEsq: { x: Math.round(p.left + 4), y: Math.round(p.top + p.height - 3) },
      textoDir: { x: Math.round(p.right - 4), y: Math.round(p.top + 4) },
      logoDir: { x: Math.round(l.right - 3), y: Math.round(l.top + l.height / 2) },
    };
  });
  await page.waitForTimeout(600);

  const fundo = {};
  for (const [nome, pt] of Object.entries(pontos)) {
    const css = await pixel(page, pt.x, pt.y);
    const L = luminancia(css);
    fundo[nome] = {
      css,
      luminancia: Number(L.toFixed(4)),
      /* Contra o branco 0,88 que `.section-light .on-dark p` pinta, e contra a
         tinta mais escura das sete logos (o cinza do Guru, medido na SIS-217). */
      contrasteTextoBranco088: Number(contraste(L, luminancia('rgb(224, 224, 224)')).toFixed(2)),
    };
  }

  await page.screenshot({
    path: `docs/capturas/sis216-solucoes-${largura}-hover-guru.png`,
    fullPage: false,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { ...grade, ordinais, hover, fundo, erros };
  await ctx.close();
}

/* MOVIMENTO REDUZIDO — os dois canais, medidos separadamente e com hover ativo. */
for (const canal of ['media', 'atributo']) {
  const { ctx, page, erros } = await abrir({ largura: 1440, reduce: canal === 'media' });
  if (canal === 'atributo') {
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
    await page.waitForTimeout(300);
  }
  const box = await page.evaluate(() => {
    const guru = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')].find((c) =>
      c.querySelector('h3')?.textContent?.includes('Guru'),
    );
    guru.scrollIntoView({ block: 'center' });
    return null;
  });
  void box;
  await page.waitForTimeout(1000);
  const p = await page.evaluate(() => {
    const guru = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')].find((c) =>
      c.querySelector('h3')?.textContent?.includes('Guru'),
    );
    const r = guru.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, topo: r.top };
  });
  await page.mouse.move(p.x, p.y);
  await page.waitForTimeout(900);
  resultado[`reduce-${canal}`] = {
    ...(await page.evaluate(
      ({ repouso }) => {
        const guru = [...document.querySelectorAll('#tecnologia-disruptiva .accel-item')].find((c) =>
          c.querySelector('h3')?.textContent?.includes('Guru'),
        );
        const card = guru.querySelector('.accel-card');
        const sc = getComputedStyle(card);
        const sf = getComputedStyle(guru.querySelector('.accel-card__foto'));
        const st = getComputedStyle(guru.querySelector('.accel-card__cta'));
        const escala = (t) => (t === 'none' ? 1 : Number(new DOMMatrixReadOnly(t).a.toFixed(4)));
        return {
          erguidaPx: Number((repouso - card.getBoundingClientRect().top).toFixed(2)),
          zoomFoto: escala(sf.transform),
          borda: sc.borderTopColor,
          sombraAcesa: sc.boxShadow.includes('14, 216, 246'),
          ctaFundo: st.backgroundColor,
          ctaTinta: st.color,
        };
      },
      { repouso: p.topo },
    )),
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis216-depois.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
