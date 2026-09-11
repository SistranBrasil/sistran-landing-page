/**
 * SIS-205 — captura 1440 de um cartão COM botão e um SEM, e conta os botões.
 *
 * O critério da issue pede as duas capturas no comentário, e a contagem existe
 * porque captura sozinha não prova o negativo: um cartão sem botão na foto pode
 * ser um cartão que não rolou o suficiente. Contar `a.eventos-destaque-botao` no
 * palco e na lista estreita é o que fecha "só esses dois, nos dois blocos".
 *
 * O palco é `sticky` e troca o destaque por `IntersectionObserver`, então não dá
 * para "pegar o cartão do Web Summit": é preciso ROLAR até a sentinela do evento
 * e fotografar o palco. Uso a miniatura clicável da coluna, que existe justamente
 * para levar a leitura a um evento sem depender da rolagem.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const DESTINO = 'docs/capturas/sis205-botao';

await mkdir(DESTINO, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/eventos-inovacao`, {
  waitUntil: 'domcontentloaded',
  timeout: 120_000,
});
await pagina.waitForSelector('.eventos-destaque-cartao', { timeout: 120_000 });
await pagina.waitForTimeout(1500);

/* Contagem primeiro, com a página inteira em mão. */
const contagem = await pagina.evaluate(() => {
  const palco = document.querySelector('.eventos-destaque');
  const lista = document.querySelector('.eventos-lista');
  const titulosComBotao = Array.from(
    lista.querySelectorAll('.eventos-lista-item'),
  )
    .filter((li) => li.querySelector('a.eventos-destaque-botao'))
    .map((li) => li.querySelector('h3').textContent.trim());
  return {
    itensNaLista: lista.querySelectorAll('.eventos-lista-item').length,
    botoesNaLista: lista.querySelectorAll('a.eventos-destaque-botao').length,
    titulosComBotao,
    sentinelasNoPalco: palco.querySelectorAll('[data-evento-sentinela]').length,
  };
});
console.log(JSON.stringify(contagem, null, 2));

/* Palco: percorre as sentinelas e registra, para cada evento em destaque, se o
   botão está montado. É a contagem do palco — o outro bloco do critério. */
const alturaSecao = await pagina.evaluate(() => {
  const s = document.querySelector('.eventos-destaque');
  return { top: s.offsetTop, altura: s.offsetHeight };
});
const comBotaoNoPalco = [];
const semBotaoNoPalco = [];
const capturados = new Map();
const passos = 15;
for (let i = 0; i < passos; i += 1) {
  const y = alturaSecao.top + (alturaSecao.altura * (i + 0.5)) / passos - 450;
  await pagina.evaluate((v) => window.scrollTo({ top: v, behavior: 'auto' }), y);
  await pagina.waitForTimeout(500);
  const estado = await pagina.evaluate(() => {
    const cartao = document.querySelector('.eventos-destaque-cartao');
    return {
      titulo: cartao.querySelector('h3, .eventos-destaque-cartao-titulo')?.textContent?.trim(),
      botao: Boolean(cartao.querySelector('a.eventos-destaque-botao')),
    };
  });
  const lista = estado.botao ? comBotaoNoPalco : semBotaoNoPalco;
  if (!lista.includes(estado.titulo)) lista.push(estado.titulo);
  /* Fotografa o primeiro com botão; o "sem" é o ITC Vegas, que é o cartão da
     captura do pedido. */
  const alvo = estado.botao
    ? 'com-botao'
    : /ITC/i.test(estado.titulo ?? '')
      ? 'sem-botao'
      : null;
  if (alvo && !capturados.has(alvo)) {
    capturados.set(alvo, estado.titulo);
    await pagina
      .locator('.eventos-destaque-cartao')
      .screenshot({ path: `${DESTINO}/${alvo}-1440.png` });
    console.log(`${alvo}: ${estado.titulo}`);
  }
}
console.log('palco · COM botão:', comBotaoNoPalco);
console.log('palco · SEM botão:', semBotaoNoPalco.length, semBotaoNoPalco);

await navegador.close();
