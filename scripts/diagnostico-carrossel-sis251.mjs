/**
 * SIS-251 — diagnóstico (não é a sonda de aceite; é o que responde POR QUE o
 * carrossel da SIS-239 não se lê como carrossel em 390px).
 *
 * A issue diz "ainda não lê como intuitivo". Antes de acrescentar affordance
 * nenhuma, isto mede o que uma pessoa em 390px TEM EM QUADRO ao mesmo tempo:
 * se o cartão é mais alto que a janela, tudo o que a SIS-239 pôs para dar a
 * pista — a espiada e as quinze marcas de posição — pode estar fora do quadro
 * no instante em que a pessoa está lendo.
 */
import { chromium } from 'playwright';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
});
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
  localStorage.setItem('sistran-motion-preference', 'full');
});
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/eventos-inovacao`, {
  waitUntil: 'domcontentloaded',
  timeout: 180_000,
});
await pagina.waitForSelector('.eventos-lista-itens', { timeout: 180_000 });
await pagina.waitForTimeout(1500);

/* Alinha o TOPO da faixa ao topo da janela: é a posição em que alguém chega
   rolando e começa a ler o cartão. */
await pagina.evaluate(() => {
  const f = document.querySelector('.eventos-lista-itens');
  window.scrollTo({ top: window.scrollY + f.getBoundingClientRect().top - 8, behavior: 'instant' });
});
await pagina.waitForTimeout(900);

const m = await pagina.evaluate(() => {
  const faixa = document.querySelector('.eventos-lista-itens');
  const bussola = document.querySelector('.eventos-lista-bussola');
  const itens = [...faixa.querySelectorAll('.eventos-lista-item')];
  const cb = itens.map((i) => i.getBoundingClientRect());
  const fb = faixa.getBoundingClientRect();
  const bb = bussola.getBoundingClientRect();
  const emQuadro = (r) => r.top < innerHeight && r.bottom > 0;
  return {
    janela: { l: innerWidth, a: innerHeight },
    faixa: { altura: Math.round(fb.height), topo: Math.round(fb.top) },
    cartao: { largura: Math.round(cb[0].width), altura: Math.round(cb[0].height) },
    /* A pista lateral: quanto do segundo cartão cabe na janela da faixa. */
    espiada: Math.round(Math.max(0, fb.right - cb[1].left)),
    bussola: {
      topo: Math.round(bb.top),
      emQuadro: emQuadro(bb),
      /* Quanto falta rolar para as marcas aparecerem. */
      abaixoDaDobra: Math.round(bb.top - innerHeight),
    },
    /* A parte do cartão que sobra abaixo da dobra: se for grande, a pessoa lê e
       rola VERTICALMENTE, e nunca chega às marcas. */
    sobraVertical: Math.round(cb[0].bottom - innerHeight),
    textoMaisLongo: Math.max(
      ...itens.map(
        (i) => (i.querySelector('.eventos-destaque-cartao-texto')?.textContent ?? '').length,
      ),
    ),
    /* Existe alguma palavra dizendo que se desliza? */
    dicaEscrita: /desliz|arrast|swipe|passe|→/i.test(
      document.querySelector('.eventos-lista')?.innerText ?? '',
    ),
  };
});

console.log(JSON.stringify(m, null, 2));

/* Um passo de autoplay: quanto ele desloca, e o que se vê mudar. */
const antes = await pagina.evaluate(() => document.querySelector('.eventos-lista-itens').scrollLeft);
await pagina.waitForTimeout(8500);
const depois = await pagina.evaluate(
  () => document.querySelector('.eventos-lista-itens').scrollLeft,
);
console.log(`passo do autoplay: ${Math.round(antes)}px -> ${Math.round(depois)}px`);

await pagina.screenshot({ path: 'docs/capturas/sis251-antes-390-topo.png' });
await contexto.close();
await navegador.close();
