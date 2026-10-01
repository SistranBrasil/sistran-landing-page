/* SIS-238 — a galeria editorial expansível de `/quem-somos`.
   O que se mede, e por que cada número existe:

   1. GEOMETRIA contra a mock. Largura do painel ativo em % da faixa (a mock dá
      50,1%; a issue aceita 48–52%), largura dos três fechados, altura da faixa.
   2. AS QUATRO ETAPAS. O índice ativo em cada quarto da rampa — a issue prescreve
      a sequência Gaivotas → Cobertura → internacionais → certificações, e o
      portão da casa para efeito de rolagem é Δvalor por rolagem, não «passa e não
      se vê». Aqui o valor é a largura do painel 1, medida em cinco pontos.
   3. CONTRASTE da tinta de cada asset sobre a superfície REAL em que ele acaba —
      é o defeito que a mock esconde (o painel ativo desenhado é o único asset
      claro). Lido em pixel, com o painel efetivamente aberto.
   4. A JUNTA de cima (chanfro novo) e a de baixo (chanfro retirado).
   5. O `tom` do ScrollSpy: a cor sob o rótulo do indicador `fixed left-3`, nas
      duas fases da seção — cabeçalho claro e faixa com painel navy na margem.
   6. Ausência do teatro: nenhum `.rec-*` na rota.

   Armadilhas herdadas: `sharp` resolve só da raiz do repositório; `page.evaluate`
   aceita UM argumento; o `clip` de `page.screenshot` é da JANELA, não do
   documento; e seletor de medição NUNCA tem plano B silencioso — se o alvo não
   existe, lança.

     node scripts/medir-galeria-reconhecimentos-sis238.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';
const LARGURAS = [1440, 768, 390];
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {} };

const nav = await chromium.launch({ executablePath: EXE });
mkdirSync('docs/capturas', { recursive: true });
const sharp = (await import('sharp')).default;

/** Luminância relativa WCAG. */
const relLum = (c) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const razao = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

for (const largura of LARGURAS) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[href="#conteudo"]{display:none!important}',
  });

  const existe = async (sel) => pag.evaluate((s) => !!document.querySelector(s), sel);
  if (!(await existe('.rgal-secao'))) {
    throw new Error('a galeria não está montada na rota — nada a medir');
  }

  const bloco = { largura };
  /* O teatro tem de ter saído. `.rec-palco` e `.rec-nav` eram a espinha dele. */
  bloco.teatroNaRota = await pag.evaluate(() => ({
    palco: document.querySelectorAll('.rec-palco, .rec-nav, .rec-mini').length,
    numeroGigante: document.body.innerText.includes('12'),
  }));
  bloco.h2 = await pag.evaluate(() => {
    const h = document.getElementById('premiacoes');
    return h ? { tag: h.tagName, texto: h.textContent } : null;
  });

  /* ── A RAMPA E AS QUATRO ETAPAS ─────────────────────────────────────────── */
  const rampa = await pag.evaluate(() => {
    const r = document.querySelector('.rgal-rampa');
    const b = r.getBoundingClientRect();
    return { topoDoc: b.top + window.scrollY, altura: b.height };
  });
  bloco.rampa = rampa;

  const etapas = [];
  /* Cinco pontos do percurso, inclusive as bordas de etapa, para pegar tanto o
     índice quanto o Δlargura entre eles. */
  for (const frac of [0.02, 0.26, 0.51, 0.76, 0.98]) {
    const alvoY = rampa.topoDoc + (rampa.altura - 900) * frac;
    await pag.evaluate((y) => window.scrollTo(0, y), Math.max(0, alvoY));
    await pag.waitForTimeout(900);
    const leitura = await pag.evaluate(() => {
      const paineis = [...document.querySelectorAll('.rgal-painel')];
      const faixa = document.querySelector('.rgal-lista').getBoundingClientRect();
      return {
        faixa: { largura: Math.round(faixa.width), altura: Math.round(faixa.height) },
        ativo: paineis.findIndex((p) => p.dataset.ativo === 'true'),
        expandido: paineis.map((p) => p.querySelector('.rgal-botao').getAttribute('aria-expanded')),
        larguras: paineis.map((p) => +(100 * (p.getBoundingClientRect().width / faixa.width)).toFixed(1)),
        titulos: paineis.map((p) => p.querySelector('.rgal-titulo').textContent),
      };
    });
    etapas.push({ frac, ...leitura });
  }
  bloco.etapas = etapas;
  /* O portão de efeito: quanto a largura do painel 1 varia no percurso. */
  const l1 = etapas.map((e) => e.larguras[0]);
  bloco.deltaLarguraPainel1 = +(Math.max(...l1) - Math.min(...l1)).toFixed(1);

  /* ── CONTRASTE DE CADA TINTA SOBRE A SUPERFÍCIE REAL ────────────────────── */
  /* Abre cada painel por CLIQUE (o caminho que não depende de rolagem, e que
     funciona igual nas três larguras) e lê os pixels do asset e do entorno. */
  const contrastes = [];
  for (let i = 0; i < 4; i++) {
    await pag.evaluate((idx) => {
      document.querySelectorAll('.rgal-botao')[idx].click();
    }, i);
    await pag.waitForTimeout(800);
    const caixa = await pag.evaluate((idx) => {
      const p = document.querySelectorAll('.rgal-painel')[idx];
      const img = p.querySelector('.rgal-arte');
      p.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
      const b = img.getBoundingClientRect();
      return {
        x: Math.round(b.x),
        y: Math.round(b.y),
        w: Math.round(b.width),
        h: Math.round(b.height),
        ativo: p.dataset.ativo === 'true',
        tinta: p.dataset.tinta,
      };
    }, i);
    await pag.waitForTimeout(400);
    const png = await pag.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const k = (y * info.width + x) * info.channels;
      return [data[k], data[k + 1], data[k + 2]];
    };
    /* A caixa da arte, amostrada em grade. O pior par é o que decide: o pixel de
       tinta mais escuro contra o pixel de papel mais claro DENTRO da mesma caixa
       — é a mesma tinta sobre o mesmo fundo, então a razão é a real. */
    let maisEscuro = null;
    let maisClaro = null;
    for (let dy = 2; dy < caixa.h - 2; dy += 2) {
      for (let dx = 2; dx < caixa.w - 2; dx += 2) {
        const x = caixa.x + dx;
        const y = caixa.y + dy;
        if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
        const c = px(x, y);
        const L = relLum(c);
        if (!maisEscuro || L < relLum(maisEscuro)) maisEscuro = c;
        if (!maisClaro || L > relLum(maisClaro)) maisClaro = c;
      }
    }
    contrastes.push({
      indice: i,
      ...caixa,
      tintaMaisEscura: maisEscuro?.join(','),
      papelMaisClaro: maisClaro?.join(','),
      razao: maisEscuro && maisClaro ? +razao(maisEscuro, maisClaro).toFixed(2) : null,
    });
    if (i === 3) {
      await pag.screenshot({ path: `docs/capturas/sis238-painel4-${largura}.png` });
    }
  }
  bloco.contrastes = contrastes;

  /* ── AS DUAS JUNTAS ─────────────────────────────────────────────────────── */
  /* Cima: o chanfro novo. Baixo: o chanfro retirado — é onde a galeria clara
     encosta em ISG clara, e o que se prova é que não há degrau. */
  const juntas = {};
  for (const [nome, sel, lado] of [
    ['topo', '.rgal-secao', 'antes'],
    ['base', '#isg', 'antes'],
  ]) {
    if (!(await existe(sel))) throw new Error(`alvo ${sel} não existe na rota`);
    for (let k = 0; k < 3; k++) {
      await pag.$eval(sel, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await pag.waitForTimeout(600);
    }
    const topo = await pag.evaluate(
      (s) => {
        const el = document.querySelector(s);
        window.scrollBy(0, el.getBoundingClientRect().top - 300);
        return Math.round(document.querySelector(s).getBoundingClientRect().top);
      },
      sel,
    );
    await pag.waitForTimeout(800);
    const alvoTopo = await pag.evaluate(
      (s) => Math.round(document.querySelector(s).getBoundingClientRect().top),
      sel,
    );
    const png = await pag.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const k = (y * info.width + x) * info.channels;
      return [data[k], data[k + 1], data[k + 2]];
    };
    const colunas = { esquerda: 4, meio: Math.round(info.width / 2), direita: info.width - 5 };
    const perfil = {};
    let saltoMax = 0;
    for (const [col, x] of Object.entries(colunas)) {
      const tira = [];
      for (let dy = -14; dy <= 14; dy++) {
        const y = alvoTopo + dy;
        if (y < 0 || y >= info.height) continue;
        tira.push({ dy, cor: px(x, y).join(',') });
      }
      let salto = 0;
      for (let t = 1; t < tira.length; t++) {
        const a = tira[t - 1].cor.split(',').map(Number);
        const b = tira[t].cor.split(',').map(Number);
        salto = Math.max(salto, ...a.map((v, m) => Math.abs(v - b[m])));
      }
      if (salto > saltoMax) saltoMax = salto;
      perfil[col] = { salto, tira };
    }
    juntas[nome] = { seletor: sel, lado, topoNaJanela: topo, saltoMaximo: saltoMax, perfil };
    await pag.screenshot({
      path: `docs/capturas/sis238-junta-${nome}-${largura}.png`,
      clip: { x: 0, y: Math.max(0, alvoTopo - 90), width: info.width, height: 180 },
    });
  }
  bloco.juntas = juntas;

  /* ── O `tom` DO SCROLLSPY ───────────────────────────────────────────────── */
  /* O indicador é `fixed left-3`. O que decide o `tom` é a cor sob o RÓTULO, e a
     seção tem duas fases: cabeçalho (papel claro na margem) e faixa (painel navy
     encostado em x=0). `tom` não sabe expressar isso — o número escolhe qual das
     duas é maioria do percurso. */
  const tom = [];
  if (largura >= 1024) {
    for (const frac of [0.05, 0.2, 0.4, 0.6, 0.8, 0.95]) {
      const alvoY = rampa.topoDoc + (rampa.altura - 900) * frac;
      await pag.evaluate((y) => window.scrollTo(0, y), Math.max(0, alvoY));
      await pag.waitForTimeout(600);
      const png = await pag.screenshot();
      const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
      const k = (Math.round(info.height / 2) * info.width + 18) * info.channels;
      const cor = [data[k], data[k + 1], data[k + 2]];
      tom.push({ frac, cor: cor.join(','), luminancia: +relLum(cor).toFixed(3) });
    }
  }
  bloco.tomScrollSpy = tom;

  saida.larguras[largura] = bloco;
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/galeria-reconhecimentos-sis238.json', JSON.stringify(saida, null, 2));
console.log('gravado docs/medidas/galeria-reconhecimentos-sis238.json');
