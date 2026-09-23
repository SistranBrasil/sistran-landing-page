/**
 * SIS-279 — PORTÕES da capa e da seção de introdução de `/solucoes`.
 *
 * Três critérios, três medições, todas no DOM computado da rota:
 *   1. a CAPA mostra SÓ «Soluções, Serviços e Consultoria» — o `h1` tem esse texto e
 *      as três frases que saíram (a sentença longa, «Seguradora.» e o lema) NÃO
 *      aparecem mais no texto da seção `#topo`;
 *   2. a seção de introdução existe ANTES de `#tecnologia-disruptiva` (ordem no
 *      documento, por `compareDocumentPosition`, não por eu ter escrito na ordem),
 *      leva a imagem DECLARADA com a arte CARREGADA (`naturalWidth > 0` — um `<img>`
 *      com 404 continua no DOM e passaria por um portão de presença) e o arranjo é de
 *      DUAS COLUNAS a partir de `lg` (a imagem está ao LADO, não abaixo: comparo as
 *      caixas dos dois filhos);
 *   3. o LEMA está no tratamento de `docs/fonte2.md`: família Kalam REAL (não a de
 *      reserva — confiro pela métrica do glifo contra a fonte do corpo), peso 400,
 *      `line-height: 0.95`, tamanho dentro de `clamp(30px, 3vw, 50px)`, cor `#123B5D`
 *      com o contraste medido no pixel COMPOSTO contra o plano da faixa, rotação
 *      `-4deg` em `rotate` (e `transform` livre para o reveal), e o risco ciano que
 *      SE DESENHA — `stroke-dashoffset` indo de 1 a 0 ao longo de quadros.
 *
 * A seção nasce abaixo da dobra, então há rampa de rolagem: sem ela o escopo do
 * reveal nunca acende e o risco não teria como ser medido em movimento.
 *
 * Receita de navegador da casa (Playwright do cache do `npx`, :3000, preferência de
 * movimento semeada, canal `reduce` em CONTEXTO NOVO).
 *
 *   node scripts/medir-intro-sis279.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ROTA = 'http://localhost:3000/solucoes';
const ARTE = '/images/consultoria.png';
const FRASE = 'Oferecemos SOLUÇÕES, SERVIÇOS e CONSULTORIA sob medida';

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

async function rampa(page, seletor) {
  const y = await page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.getBoundingClientRect().top + window.scrollY - 200 : 0;
  }, seletor);
  for (let s = 0; s < y; s += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), s);
    await page.waitForTimeout(70);
  }
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1600);
}

/* Pixel COMPOSTO: recorte 1×1 da tela decodificado na própria página. É o único jeito
   de ler a cor que a pessoa vê quando o fundo é o plano ancorado na janela com
   camadas translúcidas por cima — ler `backgroundColor` devolveria `transparent`. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }, buf.toString('base64'));
}

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Number(((x + 0.05) / (y + 0.05)).toFixed(2));
};

const ler = (page, arte, frase) =>
  page.evaluate(
    ([caminho, trecho]) => {
      const capa = document.getElementById('topo');
      const intro = document.getElementById('beyond-technology');
      const cards = document.getElementById('tecnologia-disruptiva');
      if (!capa || !intro || !cards) return null;

      const h1 = capa.querySelector('h1');
      const textoDaCapa = capa.textContent.replace(/\s+/g, ' ');

      const escopo = intro.querySelector('[data-reveal-nome="intro-beyond-technology"]');
      const texto = intro.querySelector('.solucoes-intro-texto');
      const figura = intro.querySelector('.solucoes-intro-arte');
      const img = figura?.querySelector('img') ?? null;
      const lema = intro.querySelector('.solucoes-lema');
      const risco = intro.querySelector('.solucoes-lema-risco');
      const destaque = intro.querySelector('.solucoes-intro-destaque');

      const cx = (n) => {
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };

      /* A FONTE MANUSCRITA É REAL, e não a de reserva: `fontFamily` computado devolve
         a LISTA declarada mesmo quando nenhuma das fontes carregou. O que prova a
         carga é a largura de um mesmo texto medida com a família do lema contra a do
         corpo — cursiva e sans-serif não podem dar a mesma métrica. */
      const regua = (familia) => {
        const s = document.createElement('span');
        s.textContent = 'Beyond Technology';
        s.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:50px;font-weight:400;font-family:${familia}`;
        document.body.appendChild(s);
        const w = Number(s.getBoundingClientRect().width.toFixed(2));
        s.remove();
        return w;
      };

      const eLema = lema ? getComputedStyle(lema) : null;
      const eRisco = risco ? getComputedStyle(risco) : null;

      return {
        /* PORTÃO 1 — a capa */
        h1Texto: h1 ? h1.textContent.trim() : null,
        h1Tamanho: h1 ? Number(parseFloat(getComputedStyle(h1).fontSize).toFixed(1)) : null,
        capaTemAFraseLonga: textoDaCapa.includes(trecho),
        capaTemSeguradora: /Seguradora\./.test(textoDaCapa),
        capaTemOLema: /Beyond Technology/.test(textoDaCapa),
        capaTemEyebrow: capa.querySelectorAll('.tag-section, [class*="eyebrow"]').length,
        capaTextoInteiro: textoDaCapa.trim(),

        /* PORTÃO 2 — a seção, a ordem, a arte e as duas colunas */
        introAntesDosCards:
          !!(intro.compareDocumentPosition(cards) & Node.DOCUMENT_POSITION_FOLLOWING),
        introTemAFraseLonga: intro.textContent.includes(trecho),
        introTemSeguradora: /Seguradora\./.test(intro.textContent),
        introTemOLema: /Beyond Technology/.test(intro.textContent),
        introTemFecho: /é o nosso lema!/.test(intro.textContent),
        escopoMontado: !!escopo,
        escopoAceso: escopo ? escopo.getAttribute('data-in') : null,
        arteEsperada: caminho,
        arteServida: img
          ? decodeURIComponent(img.currentSrc || img.src).replace(location.origin, '')
          : null,
        arteCarregada: img ? img.naturalWidth > 0 : false,
        arteIntrinseca: img ? [img.naturalWidth, img.naturalHeight] : null,
        arteAlt: img ? img.getAttribute('alt') : null,
        colunas: escopo ? getComputedStyle(escopo).gridTemplateColumns : null,
        caixaTexto: cx(texto),
        caixaArte: cx(figura),
        /* «AO LADO» é geometria, não intenção: em duas colunas a arte começa depois
           do fim do texto no eixo X e as duas faixas verticais se sobrepõem. */
        arteAoLado:
          texto && figura
            ? (() => {
                const a = texto.getBoundingClientRect();
                const b = figura.getBoundingClientRect();
                return b.left >= a.right - 1 && b.top < a.bottom && b.bottom > a.top;
              })()
            : null,
        /* Nenhum card: a issue proíbe o cartão genérico, então a figura não pode ter
           fundo pintado nem borda própria. */
        arteFundo: figura ? getComputedStyle(figura).backgroundColor : null,
        arteBorda: figura ? getComputedStyle(figura).borderStyle : null,

        /* PORTÃO 3 — o tratamento de `fonte2` */
        lemaMontado: !!lema,
        lemaFamiliaDeclarada: eLema?.fontFamily ?? null,
        lemaPeso: eLema?.fontWeight ?? null,
        lemaTamanho: eLema ? Number(parseFloat(eLema.fontSize).toFixed(2)) : null,
        lemaEntrelinha: eLema
          ? Number((parseFloat(eLema.lineHeight) / parseFloat(eLema.fontSize)).toFixed(3))
          : null,
        lemaCor: eLema?.color ?? null,
        lemaRotate: eLema?.rotate ?? null,
        lemaTransform: eLema?.transform ?? null,
        lemaLarguraKalam: eLema ? regua(eLema.fontFamily) : null,
        lemaLarguraCorpo: regua(getComputedStyle(document.body).fontFamily),
        caixaLema: cx(lema),
        riscoMontado: !!risco,
        riscoStroke: eRisco?.stroke ?? null,
        riscoLargura: risco ? Math.round(risco.closest('svg').getBoundingClientRect().width) : null,
        riscoAnimacao: eRisco?.animationName ?? null,
        riscoOffset: eRisco ? parseFloat(eRisco.strokeDashoffset) : null,
        destaqueCor: destaque ? getComputedStyle(destaque).color : null,
        destaquePeso: destaque ? getComputedStyle(destaque).fontWeight : null,
      };
    },
    [arte, frase],
  );

/* O DESENHO DO RISCO: quatro quadros na janela da entrada, em CONTEXTO PRÓPRIO e com
   parada seca no alvo, sem a espera final da rampa de leitura. A primeira versão desta
   medição media depois dela e devolvia offset 0 nas quatro amostras — o traço tinha
   terminado (0,35s de atraso + 0,9s de curso) antes do primeiro quadro, e «terminou
   desenhado» passava enquanto «se desenha» não era medido. Curso percorrido passa e
   não se vê: o portão é a QUEDA do valor, então a janela de amostragem tem de estar
   dentro do curso.
   `stroke-dashoffset` com `parseFloat` e não `Number`: o valor computado volta com
   unidade e `Number('1px')` é `NaN`. */
async function desenho(browser, largura) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  const y = await page.evaluate(() => {
    const el = document.getElementById('beyond-technology');
    return el ? el.getBoundingClientRect().top + window.scrollY - 300 : null;
  });
  if (y === null) {
    await ctx.close();
    return null;
  }
  await page.evaluate((v) => window.scrollTo(0, v), y);
  const amostras = [];
  for (const espera of [380, 120, 200, 900]) {
    await page.waitForTimeout(espera);
    amostras.push(
      await page.evaluate(() => {
        const r = document.querySelector('.solucoes-lema-risco');
        if (!r) return { offset: null, animacao: null, aceso: null, ausente: true };
        const e = getComputedStyle(r);
        return {
          offset: parseFloat(e.strokeDashoffset),
          animacao: e.animationName,
          aceso: document
            .querySelector('[data-reveal-nome="intro-beyond-technology"]')
            ?.getAttribute('data-in'),
        };
      }),
    );
  }
  await ctx.close();
  const off = amostras.map((a) => a.offset);
  return {
    amostras,
    valoresDistintos: new Set(off).size,
    caiu: off[0] > off[off.length - 1],
    terminouDesenhado: off[off.length - 1] === 0,
  };
}

const browser = await chromium.launch();
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {}, reduce: {} };

for (const largura of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  const erros = [];
  const faltando = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400) faltando.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);

  /* A CAPTURA DA CAPA antes de rolar: o portão 1 é sobre o que se vê na abertura. */
  mkdirSync('docs/capturas', { recursive: true });
  await page.screenshot({ path: `docs/capturas/sis279-capa-${largura}.png`, fullPage: false });

  await rampa(page, '#beyond-technology');
  const estado = await ler(page, ARTE, FRASE);

  /* CONTRASTE DO LEMA: pixel composto no MIOLO de um glifo contra o plano da faixa
     medido ao lado da coluna de texto. Ler a regra não serve — o fundo desta faixa é
     `transparent` nesta rota (SIS-204) e o que aparece é o plano do `<main>`. */
  let contrasteDoLema = null;
  if (estado?.caixaLema) {
    const c = estado.caixaLema;
    /* O ponto mais escuro numa varredura curta dentro da primeira palavra: um ponto
       fixo pode cair no vão entre letras e mediria fundo contra fundo. */
    let tinta = null;
    for (let dx = 4; dx < 70; dx += 2) {
      const p = await pixel(page, c.x + dx, c.y + Math.round(c.h * 0.55));
      if (!tinta || lum(p) < lum(tinta)) tinta = p;
    }
    const fundo = await pixel(page, c.x + Math.round(c.w * 0.5), c.y - 14);
    contrasteDoLema = { tinta, fundo, razao: contraste(tinta, fundo) };
  }

  await page.screenshot({ path: `docs/capturas/sis279-intro-${largura}.png`, fullPage: false });
  saida.larguras[largura] = {
    estado,
    contrasteDoLema,
    respostas400: faltando,
    errosDeConsole: erros,
  };
  await ctx.close();
}

saida.traco = { 1440: await desenho(browser, 1440), 390: await desenho(browser, 390) };

/* Movimento reduzido nos DOIS canais: o risco não anima, mas tem de nascer DESENHADO
   (`stroke-dashoffset: 0`) — animação de traço morta com offset 1 é traço invisível,
   que é o defeito clássico. E a imagem e o texto continuam visíveis. */
for (const nome of ['sistema', 'chave']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(nome === 'sistema' ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, nome === 'sistema' ? 'reduce' : 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (nome === 'chave')
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(1200);
  await rampa(page, '#beyond-technology');
  saida.reduce[nome] = await page.evaluate(() => {
    const risco = document.querySelector('.solucoes-lema-risco');
    const lema = document.querySelector('.solucoes-lema');
    const img = document.querySelector('.solucoes-intro-arte-img');
    if (!risco || !lema) return null;
    const e = getComputedStyle(risco);
    const rl = lema.getBoundingClientRect();
    const ri = img?.getBoundingClientRect();
    return {
      riscoAnimacao: e.animationName,
      riscoOffset: parseFloat(e.strokeDashoffset),
      riscoVisivel: risco.getBoundingClientRect().width > 0,
      lemaOpacidade: getComputedStyle(lema).opacity,
      lemaVisivel: rl.width > 0 && rl.height > 0,
      lemaRotate: getComputedStyle(lema).rotate,
      imagemVisivel: !!ri && ri.width > 0,
      imagemCarregada: img ? img.naturalWidth > 0 : false,
    };
  });
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis279-intro.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
