/**
 * SIS-221 — sonda do pouso do marcador «2º andar» na fachada da torre de SP.
 *
 * A régua (`regua-torre-sis221.mjs`) mediu na ARTE onde está o 2º andar. Esta
 * mede no SITE onde o ponto aceso pousa, e devolve o número na única unidade que
 * serve para comparar com a régua: a posição do centro do ponto em % da caixa da
 * torre (que tem a proporção do recorte do render, então % da caixa = % da arte).
 *
 * Mede nos DOIS modos que a issue pede — o modo lista e o modo scroll (pouso de
 * São Paulo) — e nas duas larguras do aceite (1440 e 390).
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const ROTULO = process.env.ROTULO ?? 'depois';
const navegador = await chromium.launch();
const relatorio = {};

async function abrir({ largura, altura, toque = false, escala = 1 }) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: escala,
    hasTouch: toque,
  });
  /* Preferência de movimento semeada antes do primeiro pintar: sem isto o
     diálogo cobre a seção e a cena de scroll não corre. */
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/quem-somos`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForSelector('.os-torre', { timeout: 180_000 });
  await pagina.waitForTimeout(1500);
  return { contexto, pagina };
}

/**
 * Leitura da geometria do marcador. O ponto aceso é um `::after` com
 * `transform`, e `getComputedStyle` de pseudo-elemento NÃO dá posição — então o
 * centro dele é calculado a partir da origem declarada (canto inferior direito
 * do balão) mais o vetor do `transform`, lido do próprio computed style. É a
 * mesma conta que o navegador faz, com os números que ele resolveu.
 */
function leitura() {
  const torre = document.querySelector('.os-torre');
  const img = document.querySelector('.os-torre-render');
  const balao = document.querySelector('.os-torre-balao');
  if (!torre || !balao) return null;
  const t = torre.getBoundingClientRect();
  const i = img.getBoundingClientRect();
  const b = balao.getBoundingClientRect();
  const dep = getComputedStyle(balao, '::after');
  /* matrix(a,b,c,d,e,f) — o deslocamento resolvido do ponto em relação à origem
     (`left:100%; top:100%` do balão, já com o `margin` de meia largura). */
  const m = dep.transform.match(/matrix\(([^)]+)\)/);
  const n = m ? m[1].split(',').map(Number) : [1, 0, 0, 1, 0, 0];
  const desloc = { x: n[4], y: n[5] };
  const raio = parseFloat(dep.width) / 2 || 3.5;
  /* Origem: canto inferior direito do balão. O `margin: -3.5px 0 0 -3.5px`
     centra o ponto nessa origem antes do `transform`. */
  const ponto = { x: b.right + desloc.x, y: b.bottom + desloc.y };
  const pct = (v, ini, tam) => Math.round(((v - ini) / tam) * 1000) / 10;
  return {
    caixaTorre: { largura: Math.round(t.width), altura: Math.round(t.height) },
    imagem: { largura: Math.round(i.width), altura: Math.round(i.height) },
    balaoLargura: Math.round(b.width),
    balaoTopoPct: pct(b.top, t.top, t.height),
    rotulo: balao.textContent.trim(),
    fio: { comprimento: dep.width, transform: dep.transform },
    /* O NÚMERO DO ACEITE: onde o centro do ponto cai, em % da arte. */
    pontoPct: { x: pct(ponto.x, i.left, i.width), y: pct(ponto.y, i.top, i.height) },
    pontoRaio: raio,
    /* O ponto tem de estar DENTRO da caixa da imagem — fora dela pousa no céu. */
    dentroDaImagem:
      ponto.x > i.left && ponto.x < i.right && ponto.y > i.top && ponto.y < i.bottom,
    modo: document.querySelector('.os-palco')?.dataset.modo ?? null,
    balaoOpacidade: getComputedStyle(balao).opacity,
  };
}

/** Traz a torre inteira para o quadro, centrada. */
async function enquadrar(pagina) {
  await pagina.evaluate(() => {
    const t = document.querySelector('.os-torre');
    const r = t.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + r.top - (innerHeight - r.height) / 2,
      behavior: 'instant',
    });
  });
  await pagina.waitForTimeout(1200);
}

for (const [nome, alvo] of [
  ['1440', { largura: 1440, altura: 900 }],
  ['390', { largura: 390, altura: 844, toque: true }],
  /* A terceira passada é a MESMA janela de 390 a 3x, só para a foto: o ponto tem
     7px e o fio 1px, e a 1x nao se distingue "pousado no vidro do 2º andar" de
     "pousado na copa da arvore ao lado". Os numeros dela sao iguais aos de 390. */
  ['390-zoom', { largura: 390, altura: 844, toque: true, escala: 3 }],
]) {
  const { contexto, pagina } = await abrir(alvo);
  await enquadrar(pagina);
  relatorio[nome] = await pagina.evaluate(leitura);
  const caixa = await pagina.locator('.os-torre').boundingBox();
  console.log(nome, 'caixa da torre na janela', caixa);
  /* O recorte é CLAMPADO à janela: numa rodada anterior a torre ficou com o topo
     acima de 0 depois do enquadramento e o `clip` caiu fora da imagem. */
  /* No modo scroll o balao entra na CAUDA do transito (SIS-169: só a partir de
     0,7 ele tem fundo opaco). Enquadrar a torre nao garante o fim da travessia, e
     numa foto com `opacity: 0` nao se confere pouso nenhum — a variavel é fixada
     no estado de CHEGADA, que é onde o marcador é lido. Isto vale só para a foto:
     os numeros acima foram lidos antes, sem tocar em nada. */
  if (relatorio[nome]?.modo === 'scroll') {
    await pagina.evaluate(() => {
      document.querySelector('.os-palco')?.style.setProperty('--os-transito', '1');
    });
    await pagina.waitForTimeout(400);
  }
  const x = Math.max(0, Math.min(caixa.x - 8, alvo.largura - 1));
  /* O zoom recorta só a metade de baixo: é onde estao a entrada, a laje do terreo
     e o ponto. */
  const zoom = nome.endsWith('zoom');
  const y = Math.max(0, Math.min(caixa.y - 8 + (zoom ? caixa.height * 0.45 : 0), alvo.altura - 1));
  await pagina.screenshot({
    path: `docs/capturas/sis221-${ROTULO}-${nome}-torre.png`,
    clip: {
      x,
      y,
      width: Math.min(caixa.width + 16, alvo.largura - x),
      height: Math.min(caixa.height * (zoom ? 0.6 : 1) + 16, alvo.altura - y),
    },
  });
  await contexto.close();
}

await navegador.close();
const saida = 'docs/medidas/torre-sis221.json';
await writeFile(saida, JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\nmedidas em ${saida}`);
