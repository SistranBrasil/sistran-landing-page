/**
 * SIS-280 (2ª volta) — SONDA DOS ITENS 3 E 4 da `/solucoes/luminna-ai`.
 *
 * ARQUIVO NOVO, e de propósito: `medir-luminna-sis280-estrutura.mjs` mede a TROCA DE
 * SLUG e a arquitetura de faixas (rotas, vazamento de classe, cópia, tons, âncoras) e
 * já está verde. Os dois itens que o corpo da issue acrescentou depois — o arranjo de
 * integrações no layout da mock e a frase manuscrita do hero — pedem portões de outra
 * natureza (tipografia computada, carregamento de PNG de terceiro, sobreposição
 * geométrica). Reescrever a sonda anterior apagaria os números já publicados no
 * comentário da issue.
 *
 * A receita de navegador é a da casa: Playwright do cache do `npx`, servidor de
 * desenvolvimento em :3000, preferência de movimento semeada por `addInitScript` para
 * a cortina de rota não comer a medição, e o canal `reduce` em CONTEXTO NOVO (a
 * preferência é do contexto, não da página).
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const BASE = 'http://localhost:3000';
const ROTA = `${BASE}/solucoes/luminna-ai`;
const FRASE = 'Grandes ideias constroem amanhã.';
const LINHAS = ['Grandes', 'ideias', 'constroem', 'amanhã.'];

/* As nove pílulas que a página deve publicar — o inventário de
   `public/images/solucoes/luminna/` menos os dois extras de linguagem. GitHub e OpenAI
   NÃO estão aqui porque não estão na pasta: é a lacuna que a issue manda reportar. */
const MARCAS = [
  'azure-logo-hd-transparente.png',
  'bitbucket-logo-hd-transparente.png',
  'fortify-logo-hd-transparente.png',
  'sonarqube-logo-hd-transparente.png',
  'aws-logo-hd-transparente.png',
  'github-copilot-logo-hd-transparente.png',
  'microsoft-copilot-logo-hd-transparente.png',
  'azure-devops-logo-hd-transparente.png',
  'jira-logo-hd-transparente.png',
];

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

async function abrir(browser, { largura, altura = 900, reduce = false }) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, reduce ? 'reduce' : 'full');
  const page = await ctx.newPage();
  const erros = [];
  const faltando = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().includes('/images/solucoes/luminna/')) faltando.push(r.url());
  });
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  return { ctx, page, erros, faltando };
}

/* Rampa curta de rolagem: o arranjo de integrações é a 5ª faixa e nasce fora da dobra,
   então sem rolar o `data-reveal` dele nunca dispara e tudo mediria estado inicial. */
async function rampa(page, alvo) {
  const y = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.getBoundingClientRect().top + window.scrollY - 200 : 0;
  }, alvo);
  for (let s = 0; s < y; s += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), s);
    await page.waitForTimeout(70);
  }
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1200);
}

/* O PIXEL COMPOSTO: recorta 1×1 da tela e lê o canal — é o único jeito de saber a cor
   que a pessoa vê quando há placa translúcida, véu e foto embaixo. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  const b64 = buf.toString('base64');
  return page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    c.getContext('2d').drawImage(img, 0, 0);
    const [r, g, bl] = c.getContext('2d').getImageData(0, 0, 1, 1).data;
    return [r, g, bl];
  }, b64);
}

const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Number(((x + 0.05) / (y + 0.05)).toFixed(2));
};

/* Estado da frase e do arranjo, lido do DOM COMPUTADO — nenhum número vem do CSS que
   escrevi: vem do que o navegador resolveu. */
const lerFrase = (page) =>
  page.evaluate((linhas) => {
    const p = document.querySelector('.luminna-frase');
    if (!p) return null;
    const e = getComputedStyle(p);
    const spans = [...p.querySelectorAll('.luminna-frase-linha')];
    const topos = [...new Set(spans.map((s) => Math.round(s.getBoundingClientRect().top)))];
    const risco = document.querySelector('.luminna-frase-risco');
    const traco = document.querySelector('.luminna-frase-traco');
    const er = risco ? getComputedStyle(risco) : null;
    const caixa = p.getBoundingClientRect();
    const colide = (sel) => {
      const o = document.querySelector(sel)?.getBoundingClientRect();
      if (!o) return null;
      return !(
        caixa.right < o.left ||
        caixa.left > o.right ||
        caixa.bottom < o.top ||
        caixa.top > o.bottom
      );
    };
    return {
      texto: spans.map((s) => s.textContent).join(' '),
      textoEsperado: linhas.join(' '),
      nosDeLinha: spans.length,
      linhasVisuais: topos.length,
      familia: e.fontFamily,
      peso: e.fontWeight,
      cor: e.color,
      tamanho: parseFloat(e.fontSize),
      entrelinha: parseFloat(e.lineHeight),
      rotacao: e.rotate,
      posicao: e.position,
      largura: Math.round(caixa.width),
      caixa: {
        x: Math.round(caixa.x),
        y: Math.round(caixa.y),
        w: Math.round(caixa.width),
        h: Math.round(caixa.height),
      },
      tracoLargura: traco ? Math.round(traco.getBoundingClientRect().width) : null,
      riscoCor: er?.stroke ?? null,
      riscoOffset: er ? parseFloat(er.strokeDashoffset) : null,
      riscoAnimacao: er?.animationName ?? null,
      riscoInclinado: risco
        ? risco.getAttribute('y1') !== risco.getAttribute('y2')
        : null,
      colideLetreiro: colide('.luminna-letreiro'),
      colideBotao: colide('#topo button'),
      colideSubtitulo: colide('#topo p.mt-5'),
    };
  }, LINHAS);

const lerArranjo = (page) =>
  page.evaluate((marcas) => {
    const hub = document.querySelector('.luminna-hub');
    const cartoes = [...document.querySelectorAll('.luminna-ecossistema .luminna-cartao')];
    const chips = [...document.querySelectorAll('.luminna-ecossistema img')];
    const pulsos = [...document.querySelectorAll('.luminna-elo-pulso')];
    const pontas = [...document.querySelectorAll('.luminna-elo-ponta')];
    const svg = document.querySelector('.luminna-elos');
    return {
      hub: hub?.textContent?.trim() ?? null,
      cartoes: cartoes.length,
      titulos: cartoes.map((c) => c.querySelector('p')?.textContent ?? ''),
      chips: chips.length,
      chipsCarregados: chips.filter((i) => i.naturalWidth > 0).length,
      chipsSemAlt: chips.filter((i) => !i.alt).length,
      arquivos: chips.map((i) => decodeURIComponent(i.currentSrc || i.src).split('/').pop()),
      arquivosEsperados: marcas,
      elosVisiveis: svg ? getComputedStyle(svg).display !== 'none' : false,
      pontasVisiveis: pontas.filter((p) => getComputedStyle(p).display !== 'none').length,
      pulsos: pulsos.length,
      pulsoAnimacao: pulsos[0] ? getComputedStyle(pulsos[0]).animationName : null,
      pulsoOffsets: pulsos.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)),
      anelAnimacao: document.querySelector('.luminna-hub-anel')
        ? getComputedStyle(document.querySelector('.luminna-hub-anel')).animationName
        : null,
      colunasDaGrade: getComputedStyle(document.querySelector('.luminna-ecossistema')).gridTemplateColumns.split(' ').length,
    };
  }, MARCAS);

/* MOVIMENTO: dois quadros afastados o suficiente para o laço ter andado. O valor é
   `strokeDashoffset`, que vem em «0px» — daí `parseFloat` e não `Number`. */
async function moveu(page, seletor, espera = 900) {
  const ler = () =>
    page.evaluate(
      (s) => [...document.querySelectorAll(s)].map((e) => parseFloat(getComputedStyle(e).strokeDashoffset)),
      seletor,
    );
  const a = await ler();
  await page.waitForTimeout(espera);
  const b = await ler();
  return { antes: a, depois: b, mudaram: a.filter((v, i) => v !== b[i]).length, de: a.length };
}

/* O PIXEL DA PLACA, sob a frase. Duas correções de método em relação à primeira
   passada, e as duas mudaram o número:
   1. O ponto é o CENTRO da caixa e não um canto — a frase é ROTACIONADA, e o canto do
      retângulo delimitador cai FORA da placa (o primeiro valor medido a 390px, 1,24,
      era o navy da capa, não a placa).
   2. Os glifos e o traço são escondidos por `visibility` antes do recorte: o que se
      quer é a cor DO FUNDO sob o texto, e um pixel em cima de uma letra mediria a
      tinta contra ela mesma. `visibility: hidden` não muda geometria nenhuma. */
async function pixelDaPlaca(page) {
  const caixa = await page.evaluate(() => {
    const p = document.querySelector('.luminna-frase');
    if (!p) return null;
    p.querySelectorAll('.luminna-frase-linha, .luminna-frase-traco').forEach((n) => {
      n.style.visibility = 'hidden';
    });
    const r = p.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  if (!caixa) return null;
  const cor = await pixel(page, caixa.x, caixa.y);
  await page.evaluate(() => {
    document
      .querySelectorAll('.luminna-frase-linha, .luminna-frase-traco')
      .forEach((n) => {
        n.style.visibility = '';
      });
  });
  return cor;
}

/* O DESENHO DO RISCO da esquerda para a direita. Ele é `forwards` com 0,55s de atraso
   e 0,9s de duração: numa página já assentada há 2,5s ele JÁ TERMINOU, e dois quadros
   iguais em 0 não são laço morto — são o estado final correto. Para provar o curso é
   preciso amostrar DENTRO da janela, então esta função abre uma página nova e lê em
   três instantes. `> 0` no começo e `0` no fim é o traço nascendo e fechando. */
async function desenhoDoRisco(browser, largura) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  const ler = () =>
    page.evaluate(() => {
      const r = document.querySelector('.luminna-frase-risco');
      return r ? parseFloat(getComputedStyle(r).strokeDashoffset) : null;
    });
  const amostras = [];
  for (const espera of [250, 450, 450, 1200]) {
    await page.waitForTimeout(espera);
    amostras.push(await ler());
  }
  await ctx.close();
  const validos = amostras.filter((v) => v !== null);
  return {
    amostras,
    distintos: new Set(validos).size,
    fechou: validos[validos.length - 1] === 0,
  };
}

const browser = await chromium.launch();
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {}, reduce: {} };

for (const largura of [390, 1440]) {
  const { ctx, page, erros, faltando } = await abrir(browser, { largura });
  const frase = await lerFrase(page);
  const movimentoRisco = await desenhoDoRisco(browser, largura);
  const tinta = [18, 59, 93];
  const alvo = frase ? await pixelDaPlaca(page) : null;
  await rampa(page, '.luminna-ecossistema');
  const arranjo = await lerArranjo(page);
  const movimentoElos = await moveu(page, '.luminna-elo-pulso');
  mkdirSync('docs/capturas', { recursive: true });
  await page.screenshot({ path: `docs/capturas/sis280-luminna-mock-${largura}.png`, fullPage: true });
  saida.larguras[largura] = {
    frase,
    contrasteDaFrase: alvo ? contraste(tinta, alvo) : null,
    pixelDaPlaca: alvo,
    movimentoRisco,
    arranjo,
    movimentoElos,
    logos404: faltando,
    errosDeConsole: erros,
  };
  await ctx.close();
}

for (const canal of ['sistema', 'chave']) {
  const { ctx, page } = await abrir(browser, {
    largura: 1440,
    reduce: canal === 'sistema',
  });
  if (canal === 'chave') await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(600);
  const frase = await lerFrase(page);
  await rampa(page, '.luminna-ecossistema');
  const arranjo = await lerArranjo(page);
  saida.reduce[canal] = {
    riscoAnimacao: frase?.riscoAnimacao,
    riscoOffset: frase?.riscoOffset,
    pulsoAnimacao: arranjo.pulsoAnimacao,
    pulsoOffsets: arranjo.pulsoOffsets,
    anelAnimacao: arranjo.anelAnimacao,
    movimentoElos: await moveu(page, '.luminna-elo-pulso'),
  };
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis280-luminna-mock-frase.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
