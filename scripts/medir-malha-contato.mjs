/**
 * «coloque os quadradinhos iguais ao ENVIRONMENT» em `/contato`.
 *
 * `node scripts/medir-malha-contato.mjs`
 *
 * O pedido é sobre uma malha VISÍVEL, então o portão é amplitude de pixel, não a
 * existência da regra: a densificação anterior existia na folha e não pintava um
 * único pixel. O que se mede:
 *
 *  1. AMPLITUDE DA LINHA. Uma tira horizontal de 1px numa faixa FORA do cartão.
 *     Como `background-attachment: fixed` alinha o tile à JANELA, a linha vertical
 *     cai em múltiplos do módulo contados da borda esquerda da janela — a 96px, em
 *     x = 96. Compara-se o pixel da linha com os vizinhos imediatos; se a diferença
 *     for ~0, não há malha.
 *  2. O MESMO NÚMERO EM `/esg`, porque o pedido é «igual ao ENVIRONMENT»: a
 *     amplitude aqui tem de ficar na mesma ordem de grandeza da de lá.
 *  3. A MALHA NÃO COBRE O CARTÃO. Ela é `z-index: 0`, acima do fundo — o que a
 *     mantém sob o conteúdo é o cartão ser `position: relative`. Se ele deixar de
 *     ser, a malha atravessa o painel, e é isso que este número vigia: a linha
 *     vertical medida DENTRO da caixa do cartão tem de ter amplitude ~0.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';
const T = 'docs/medidas/.tmpmalha';
await mkdir(T, { recursive: true });
await mkdir('docs/capturas', { recursive: true });

const nav = await chromium.launch();
const res = {};

/* Amplitude da linha em `xLinha`: |pixel da linha − média dos vizinhos|, somada
   nos três canais. Devolve também as cores cruas, porque um número só esconde de
   qual lado veio a diferença. */
async function amplitude(p, y, xLinha) {
  const x0 = xLinha - 4;
  const f = `${T}/tira-${y}-${xLinha}.png`;
  await p.screenshot({ path: f, clip: { x: x0, y, width: 9, height: 1 } });
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  const n = info.channels;
  const px = [];
  for (let i = 0; i < data.length; i += n) px.push([data[i], data[i + 1], data[i + 2]]);
  const linha = px[4];
  const viz = [px[2], px[6]];
  const media = [0, 1, 2].map((c) => (viz[0][c] + viz[1][c]) / 2);
  return {
    x: xLinha,
    linha: `rgb(${linha.join(',')})`,
    vizinhos: viz.map((c) => `rgb(${c.join(',')})`),
    amplitude: Number([0, 1, 2].reduce((s, c) => s + Math.abs(linha[c] - media[c]), 0).toFixed(1)),
  };
}

async function abrir(p, rota, sel) {
  await p.goto(`http://localhost:3000${rota}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 30000 });
  await p.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 30000 });
  await p.locator(sel).first().evaluate((n) => n.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await p.waitForTimeout(1500);
}

for (const largura of [1440, 390]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: largura === 1440 ? 900 : 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  const erros = [];
  p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  const chave = `w${largura}`;
  res[chave] = { erros };

  await abrir(p, '/contato', '.fundo-contato-cena');
  res[chave].estilo = await p.evaluate(() => {
    const g = document.querySelector('.fundo-contato-cena .grade-tecnica');
    const c = getComputedStyle(g);
    const cartao = document.querySelector('.contact-dialog-inner');
    const cc = getComputedStyle(cartao);
    const b = cartao.getBoundingClientRect();
    return {
      zIndex: c.zIndex, modulo: c.backgroundSize.split(',')[0].trim(),
      mascara: (c.maskImage || '').slice(0, 90),
      cartaoPosition: cc.position,
      cartao: { esq: Math.round(b.left), dir: Math.round(b.right), topo: Math.round(b.top) },
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  const g = res[chave].estilo;
  const modulo = parseFloat(g.modulo);
  /* Uma linha FORA do cartão (à esquerda dele) e uma DENTRO.
     ⚠️ Em tela estreita NÃO EXISTE coluna fora do cartão: a 390 ele vai de 20 a
     371, e a primeira linha do tile (x = 96) cai sobre a foto da sede. A primeira
     versão desta sonda arredondava para 96 de qualquer jeito e devolvia amplitude
     360 — que é o contraste da FOTO, não da malha, e leria como "malha ótima no
     mobile" quando ali não há malha visível nenhuma para medir. Só se mede fora do
     cartão quando cabe uma linha inteira fora dele. */
  const yFora = 520;
  /* O maior múltiplo do módulo estritamente à ESQUERDA da borda do cartão. A folga
     é de 2px só (e não de 8): a 1440 o cartão começa em 100 e a linha útil é a de
     96 — uma folga maior descartaria a única coluna que existe. */
  const xFora = modulo * Math.floor((g.cartao.esq - 2) / modulo);
  res[chave].foraDoCartao = xFora >= modulo
    ? await amplitude(p, yFora, xFora)
    : `sem coluna fora do cartão nesta largura (cartão em ${g.cartao.esq}..${g.cartao.dir}, módulo ${modulo}px): a malha só aparece acima e abaixo do painel`;
  const xDentro = modulo * Math.ceil((g.cartao.esq + 24) / modulo);
  res[chave].dentroDoCartao = xDentro < g.cartao.dir - 8
    ? await amplitude(p, g.cartao.topo + 120, xDentro)
    : 'cartão estreito demais nesta largura para uma linha inteira cair dentro';
  await p.screenshot({ path: `docs/capturas/malha-contato-${largura}.png`, clip: { x: 0, y: 0, width: largura, height: Math.min(900, largura === 1440 ? 900 : 844) } });

  /* A referência: o ENVIRONMENT de `/esg`. Só a 1440 — a 390 os cartões de lá
     também ocupam a largura toda, e a mesma coluna cairia sobre a foto de um
     cartão, devolvendo o contraste dele como se fosse o da malha. */
  if (largura === 1440) {
    await abrir(p, '/esg', '.esg-faixa-azul');
    res[chave].referenciaEsg = await amplitude(p, yFora, modulo);
  }
  await ctx.close();
}
await writeFile('docs/medidas/malha-contato.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
await rm(T, { recursive: true, force: true });
await nav.close();
