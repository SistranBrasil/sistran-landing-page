/**
 * SIS-201 (reparo) — mede o contraste das placas JÁ RENDERIZADAS.
 *
 * POR QUE ESTA SONDA EXISTE ALÉM DA OUTRA
 * `medir-logos-parceiros-sis201.mjs` mede o PNG do logo contra uma cor de fundo
 * SUPOSTA. Isso decide a variante da placa, mas não prova o resultado: a placa
 * de tinta clara tem fundo translúcido (`rgba(4, 29, 51, 0.82)`), então o pixel
 * que a pessoa vê é a composição da placa COM a imagem editorial por baixo — e
 * essa imagem é diferente em cada um dos dezesseis cards. Uma conta com fundo
 * suposto não alcança isso; uma captura, sim.
 *
 * COMO MEDE
 * Para cada placa: pega o `getBoundingClientRect`, recorta a captura nessa caixa
 * e separa os pixels em dois grupos pelo histograma de luminância — o fundo da
 * placa é a MODA (o valor mais frequente, porque fundo é o que mais ocupa área)
 * e a tinta é a média dos pixels que ficam longe dela. O contraste entre os dois
 * é o número que interessa. Alvo 3:1 (WCAG 1.4.11, gráfico essencial).
 *
 * Descarta os 2px da borda do recorte: a borda da placa e o antialiasing dela
 * entrariam como "tinta" e falseariam o número para baixo.
 *
 * `reducedMotion: 'no-preference'` é obrigatório — o padrão do Playwright é
 * `reduce`, e este componente TEM regras sob `prefers-reduced-motion`. Sem isso
 * a sonda mediria um DOM que não é o do visitante comum.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const ALVO = 3;

const canal = (v) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
const pagina = await contexto.newPage();

/* `domcontentloaded`, NÃO `networkidle`: em `next dev` a rede nunca fica ociosa
   (HMR + compilação sob demanda), e a sonda ficava pendurada até o timeout sem
   emitir uma linha. A espera correta é pelo que a medição precisa — o seletor da
   placa e o decode das imagens —, não por um estado de rede que não chega. */
const resposta = await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
  waitUntil: 'domcontentloaded',
  timeout: 120_000,
});
console.log(`HTTP ${resposta?.status()}\n`);

await pagina.waitForSelector('.partner-terminal__placa img', { timeout: 120_000 });
/* next/image decodifica de forma assíncrona: sem esperar, a captura pega a caixa
   antes do traço do logo existir e o contraste sai como o do fundo puro. */
/* ⚠️ O `decode()` TEM DE TER CORRIDA COM TIMEOUT, e isso custou uma sonda
   pendurada: as logos são `lazy` (padrão do next/image) e a trilha é horizontal,
   então a maioria dos dezesseis cards nasce fora da viewport. Numa imagem que o
   navegador ainda não decidiu buscar, `decode()` não rejeita — simplesmente
   nunca assenta. Um `Promise.all` sobre elas espera para sempre. Cada card é
   decodificado de novo depois do `scrollIntoView`, que é quando a imagem
   realmente carrega; esta espera aqui é só para o primeiro card. */
await pagina.evaluate(async () => {
  const comLimite = (p, ms) =>
    Promise.race([p, new Promise((r) => setTimeout(r, ms))]).catch(() => null);
  const imgs = Array.from(document.querySelectorAll('.partner-terminal__placa img'));
  await Promise.all(imgs.map((i) => (i.complete ? null : comLimite(i.decode(), 1500))));
});
await pagina.waitForTimeout(1200);

const placas = await pagina.evaluate(() =>
  Array.from(document.querySelectorAll('.partner-terminal__placa')).map((el) => {
    const r = el.getBoundingClientRect();
    const card = el.closest('.partner-terminal__card');
    return {
      tinta: el.dataset.tinta,
      titulo: card?.querySelector('h3')?.textContent?.trim() ?? '?',
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      visivel: r.width > 0 && r.height > 0,
    };
  }),
);

console.log(`${placas.length} placas no DOM\n`);
console.log(
  'parceiro'.padEnd(18) +
    'placa'.padEnd(9) +
    'caixa'.padEnd(11) +
    'núcleo'.padEnd(9) +
    'média'.padEnd(9) +
    'tinta'.padEnd(7) +
    'veredito',
);
console.log('-'.repeat(72));

const falhas = [];

for (const p of placas) {
  if (!p.visivel) {
    falhas.push(`${p.titulo}: placa sem caixa (largura ou altura zero)`);
    continue;
  }

  /* Rola a placa até a viewport: a trilha é horizontal e só uma parte dos
     dezesseis cards está na tela de cada vez. */
  await pagina.evaluate((titulo) => {
    const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
      (c) => c.querySelector('h3')?.textContent?.trim() === titulo,
    );
    card?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }, p.titulo);
  /* Depois de entrar na viewport a imagem lazy finalmente carrega: esperar o
     decode DESTE card é o que impede medir a placa antes do traço aparecer. */
  await pagina.waitForTimeout(250);
  await pagina.evaluate(async (titulo) => {
    const comLimite = (p, ms) =>
      Promise.race([p, new Promise((r) => setTimeout(r, ms))]).catch(() => null);
    const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
      (c) => c.querySelector('h3')?.textContent?.trim() === titulo,
    );
    const img = card?.querySelector('.partner-terminal__placa img');
    if (img && !img.complete) await comLimite(img.decode(), 4000);
  }, p.titulo);
  await pagina.waitForTimeout(150);

  const caixa = await pagina.evaluate((titulo) => {
    const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
      (c) => c.querySelector('h3')?.textContent?.trim() === titulo,
    );
    const el = card?.querySelector('.partner-terminal__placa');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  }, p.titulo);
  if (!caixa || caixa.w <= 4 || caixa.h <= 4) {
    falhas.push(`${p.titulo}: caixa inutilizável para recorte`);
    continue;
  }

  const buffer = await pagina.screenshot({
    clip: { x: caixa.x + 2, y: caixa.y + 2, width: caixa.w - 4, height: caixa.h - 4 },
  });
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  /* Histograma de luminância em 32 caixas: a moda é o fundo da placa. */
  const caixas = new Array(32).fill(0);
  const luzes = [];
  for (let i = 0; i < data.length; i += info.channels) {
    const L = lum(data[i], data[i + 1], data[i + 2]);
    luzes.push(L);
    caixas[Math.min(31, Math.floor(L * 32))] += 1;
  }
  const modaIdx = caixas.indexOf(Math.max(...caixas));
  const Lfundo = (modaIdx + 0.5) / 32;

  /* Tinta = pixels a mais de 0.15 de distância do fundo. Abaixo disso é
     antialiasing e variação da própria imagem, não traço do logo. */
  const tinta = luzes.filter((L) => Math.abs(L - Lfundo) > 0.15);
  const cobertura = (tinta.length / luzes.length) * 100;

  /* DOIS números, e a diferença entre eles importa.
     A MÉDIA da tinta é o estatístico errado para marca multicolorida: no logo da
     Microsoft Azure ou da AWS entram azul-claro, laranja e cinza junto com o
     traço escuro, e a média sobe até fingir que o traço não contrasta. O que
     sustenta a leitura é o NÚCLEO do traço, então tomo também o quartil extremo
     da tinta — os 25% de pixels mais afastados do fundo. É esse que decide.
     A média fica no relatório porque a divergência entre os dois é justamente o
     que revela marca de várias cores, e esconder isso é esconder a razão. */
  const ordenada = [...tinta].sort((a, b) => a - b);
  const claroSobreEscuro = Lfundo < 0.5;
  const nucleo = claroSobreEscuro
    ? ordenada.slice(Math.floor(ordenada.length * 0.75)) // fundo escuro: traço claro
    : ordenada.slice(0, Math.max(1, Math.ceil(ordenada.length * 0.25))); // fundo claro: traço escuro
  const Lnucleo = nucleo.length ? nucleo.reduce((a, b) => a + b, 0) / nucleo.length : Lfundo;
  const Lmedia = tinta.length ? tinta.reduce((a, b) => a + b, 0) / tinta.length : Lfundo;

  const razao = contraste(Lnucleo, Lfundo);
  const razaoMedia = contraste(Lmedia, Lfundo);

  const ok = razao >= ALVO && cobertura > 1;
  const marca = ok ? 'OK' : 'FALHA';
  console.log(
    p.titulo.padEnd(18) +
      String(p.tinta).padEnd(9) +
      `${caixa.w}x${caixa.h}`.padEnd(11) +
      `${razao.toFixed(2)}:1`.padEnd(9) +
      `${razaoMedia.toFixed(2)}:1`.padEnd(9) +
      `${cobertura.toFixed(0)}%`.padEnd(7) +
      marca,
  );
  if (!ok) {
    falhas.push(
      `${p.titulo}: núcleo ${razao.toFixed(2)}:1 contra alvo ${ALVO}:1 ` +
        `(média ${razaoMedia.toFixed(2)}:1, tinta ocupa ${cobertura.toFixed(0)}%)`,
    );
  }
}

await navegador.close();

console.log('');
if (falhas.length) {
  console.log(`${falhas.length} FALHA(S):`);
  for (const f of falhas) console.log(`  - ${f}`);
  process.exitCode = 1;
} else {
  console.log(`Todas as ${placas.length} placas passam de ${ALVO}:1.`);
}
