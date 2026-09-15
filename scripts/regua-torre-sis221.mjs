/**
 * SIS-221 — régua sobre a arte da torre.
 *
 * Antes de escolher qualquer `top`, é preciso saber ONDE na imagem está o 2º
 * andar. As porcentagens do `.os-torre-balao` são contadas contra a caixa da
 * torre, que tem a proporção do recorte do render (1200x1209) — então uma régua
 * horizontal em % sobre a própria imagem já dá o número que o CSS usa.
 *
 * Ela desenha uma linha a cada 5% da ALTURA da imagem, rotulada, e salva a
 * captura. Não mede o site: mede o desenho. O pouso do ponto no site é medido
 * pela sonda `medir-torre-sis221.mjs`.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
await mkdir('docs/capturas', { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 900, height: 1000 },
  /* 3x só na régua: o rótulo do andar é uma faixa de poucos pixels na arte em
     352px, e a 1x não se distingue o vidro do lobby do vidro do 2º andar. */
  deviceScaleFactor: 3,
});
const pagina = await contexto.newPage();
/* A largura da caixa é a mesma do site (`width: min(100%, 22rem)` = 352px) para
   a régua cair sobre a arte no mesmo tamanho em que ela é vista. */
await pagina.setContent(`
  <body style="margin:0;background:#0a1f44;display:grid;place-items:center;height:100vh">
    <div id="cx" style="position:relative;width:352px">
      <img src="${URL_BASE}/images/escritorios/torre-sp-1200.webp"
           style="display:block;width:100%;height:auto">
    </div>
  </body>
`);
await pagina.waitForFunction(() => {
  const i = document.querySelector('img');
  return i && i.complete && i.naturalWidth > 0;
});
await pagina.evaluate(() => {
  const cx = document.getElementById('cx');
  for (let p = 0; p <= 100; p += 5) {
    const l = document.createElement('div');
    l.style.cssText = `position:absolute;left:0;right:0;top:${p}%;height:1px;background:${
      p % 10 === 0 ? 'rgba(255,60,60,0.95)' : 'rgba(14,216,246,0.7)'
    }`;
    const r = document.createElement('span');
    r.textContent = `${p}%`;
    r.style.cssText =
      'position:absolute;left:100%;top:-7px;font:11px monospace;color:#fff;padding-left:4px';
    l.appendChild(r);
    cx.appendChild(l);
  }
});
const caixa = await pagina.locator('#cx').boundingBox();
console.log('caixa da torre', caixa);
await pagina.screenshot({ path: 'docs/capturas/sis221-regua-torre.png' });
/* E um recorte da metade de baixo, onde mora a entrada e os primeiros andares. */
await pagina.screenshot({
  path: 'docs/capturas/sis221-regua-torre-base.png',
  clip: {
    x: caixa.x - 4,
    y: caixa.y + caixa.height * 0.55,
    width: caixa.width + 44,
    height: caixa.height * 0.45,
  },
});
await contexto.close();
await navegador.close();
