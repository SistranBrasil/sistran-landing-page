/**
 * SIS-238 — contraste da coluna tipográfica do bloco Celent contra a capa.
 *
 * A faixa DEIXOU DE SER navy: `celent-capa.webp` é um render claro, e por isso a
 * tinta do texto inverteu. Nada disso pode ficar em "parece legível". O que este
 * script mede é o pixel RENDERIZADO — capa + véu + tudo o que o navegador
 * compõe —, não a cor que o CSS declara.
 *
 * PROCEDIMENTO, e por que ele é assim:
 *
 * 1. Para cada nó de texto, recorta a caixa dele na captura e separa os pixels
 *    em TINTA (os mais escuros) e FUNDO (os mais claros) por histograma de
 *    luminância. Sem isso a média da caixa mistura os dois e devolve um número
 *    que não corresponde a nenhum contraste real.
 * 2. Reporta DOIS números por nó. O CRITÉRIO é o do percentil: p10 da tinta
 *    contra p90 do fundo, isto é, platô do glifo contra platô do fundo. O
 *    segundo é o TETO (glifo mais escuro contra fundo mais claro), só para a
 *    decisão ser auditável. Extremo de texto pequeno é sempre franja de
 *    antialiasing e subestima o contraste real — por isso nenhum dos dois é
 *    "pior pixel".
 * 3. `deviceScaleFactor: 2`. Em 1x um rótulo de 11–12px tem quase só franja e o
 *    histograma não acha o platô da tinta.
 *
 * Alvos WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande (>=24px, ou
 * >=18.66px em negrito).
 *
 * Uso: URL_BASE=http://localhost:3999 node scripts/medir-contraste-celent-sis238.mjs
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ESCALA = 2;

const ALVOS = [
  ['eyebrow', '.rec-abertura .rec-eyebrow span'],
  ['titulo', '.rec-abertura .rec-titulo'],
  ['linha1', '.rec-celent-linha1'],
  ['linha2', '.rec-celent-linha2'],
];

const canalLinear = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) =>
  0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b);
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const pct = (ordenado, p) => ordenado[Math.min(ordenado.length - 1, Math.floor(p * ordenado.length))];

const navegador = await chromium.launch();

for (const largura of [1440, 390]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 1000 },
    deviceScaleFactor: ESCALA,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/quem-somos`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('#premiacoes', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForTimeout(2500);
  const continuar = pagina.getByRole('button', { name: 'Continuar' });
  if (await continuar.count()) {
    await continuar.first().click();
    await pagina.waitForTimeout(600);
  }

  /* A faixa inteira precisa estar dentro da janela, senão os `boundingBox` de
     alguns nós caem fora da captura. O bloco é centrado, então rolar até o topo
     da abertura menos uma folga basta. */
  const topo = await pagina.evaluate(() => {
    const el = document.querySelector('.rec-abertura');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await pagina.evaluate((y) => window.scrollTo(0, y), Math.max(0, topo - 40));
  await pagina.waitForTimeout(1500);

  const foto = await pagina.screenshot();
  console.log(`\n=== ${largura}px ===`);

  for (const [nome, seletor] of ALVOS) {
    const el = pagina.locator(seletor).first();
    if (!(await el.count())) {
      console.log(`  ${nome}: AUSENTE (${seletor})`);
      continue;
    }
    const caixa = await el.boundingBox();
    const estilo = await el.evaluate((n) => {
      const c = getComputedStyle(n);
      return { fontSize: parseFloat(c.fontSize), peso: c.fontWeight, cor: c.color };
    });
    if (!caixa || caixa.width < 2 || caixa.height < 2) {
      console.log(`  ${nome}: sem caixa visivel`);
      continue;
    }

    const { data, info } = await sharp(foto)
      .extract({
        left: Math.max(0, Math.round(caixa.x * ESCALA)),
        top: Math.max(0, Math.round(caixa.y * ESCALA)),
        width: Math.round(caixa.width * ESCALA),
        height: Math.round(caixa.height * ESCALA),
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const lums = [];
    for (let i = 0; i < info.width * info.height; i += 1) {
      const p = i * info.channels;
      lums.push(lum(data[p], data[p + 1], data[p + 2]));
    }
    lums.sort((a, b) => a - b);

    /* Corte no meio da faixa dinâmica da caixa: acima dele é fundo, abaixo é
       tinta. Simples e estável para texto escuro sobre fundo claro, que é o caso
       desta faixa inteira. */
    const meio = (lums[0] + lums[lums.length - 1]) / 2;
    const tinta = lums.filter((l) => l <= meio);
    const fundo = lums.filter((l) => l > meio);
    if (!tinta.length || !fundo.length) {
      console.log(`  ${nome}: caixa sem separacao tinta/fundo`);
      continue;
    }

    /* p10 da tinta = o platô escuro do glifo; p90 do fundo = o platô claro. */
    const lTinta = pct(tinta, 0.1);
    const lFundo = pct(fundo, 0.9);
    const rPercentil = razao(lTinta, lFundo);
    /* Teto: o glifo mais escuro contra o fundo mais claro da caixa. NÃO é
       "pior pixel" — a primeira versão deste script reportava
       `razao(max(tinta), min(fundo))` e devolvia 1.00:1 em todos os nós, porque
       esses dois valores são, por construção, os dois lados do corte do
       histograma. Aquele número não media nada. */
    const rTeto = razao(tinta[0], fundo[fundo.length - 1]);

    const grande = estilo.fontSize >= 24 || (estilo.fontSize >= 18.66 && Number(estilo.peso) >= 700);
    const alvo = grande ? 3 : 4.5;
    const veredito = rPercentil >= alvo ? 'OK' : 'FALHA';

    console.log(
      `  ${nome.padEnd(8)} ${String(Math.round(estilo.fontSize)).padStart(3)}px/${estilo.peso}` +
        ` alvo ${alvo}:1` +
        ` | percentil ${rPercentil.toFixed(2)}:1 ${veredito}` +
        ` | teto ${rTeto.toFixed(2)}:1`,
    );
  }

  const estouro = await pagina.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  console.log(`  estouro: scrollWidth=${estouro.scrollW} clientWidth=${estouro.clientW}`);
  await contexto.close();
}

await navegador.close();
