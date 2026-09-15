/**
 * SIS-240 — sonda de contraste de repouso das 15 logos da `BrandGrid` (home).
 *
 * `node scripts/medir-brandgrid-sis240.mjs --modo=antes`
 * `node scripts/medir-brandgrid-sis240.mjs --modo=depois`
 *
 * ── O MÉTODO É O DA ISSUE, DE PROPÓSITO
 *
 * A issue traz os números de produção medidos como «contraste p5 tinta × p95 fundo,
 * `deviceScaleFactor: 2`». Reimplementar OUTRO método daria números incomparáveis
 * com a evidência que abriu a issue, e o critério de aceite diz «no mesmo método».
 * Então: recorta a janela da logo, ordena a luminância relativa dos pixels, toma o
 * percentil 5 como TINTA (os 5% mais escuros) e o 95 como FUNDO (os 5% mais claros),
 * e devolve a razão de contraste entre os dois.
 *
 * Percentil e não mínimo/máximo porque logo tem antialiasing em toda borda: o pixel
 * extremo é quase sempre uma franja de um pixel só, e o veredito passaria a descrever
 * o raster em vez do desenho. É a mesma armadilha registrada em
 * `docs/medidas/COMO-MEDIR-CONTRASTE.md`, e aqui a defesa é o percentil, não a
 * máscara de miolo: numa logo não há "glifo" a isolar — o desenho INTEIRO é a tinta.
 *
 * ⚠️ NÃO usa `locator.screenshot()`. Ele chama `scrollIntoViewIfNeeded`, e a grade
 * abre a página logo depois de um `#top` de 200–320svh: qualquer rolagem no meio da
 * sessão de fotos muda o que está em cena e a cascata de entrada (`RevealScope`)
 * pode reverter. Rola-se UMA vez, com `behavior:'instant'` porque a rota usa Lenis
 * (SIS-151), e depois todo recorte é `page.screenshot({ clip })` — que é
 * relativo à VIEWPORT, não ao documento.
 *
 * ── O TETO TAMBÉM É MEDIDO, E É ELE QUE DECIDE O REMÉDIO
 *
 * Cada marca é medida três vezes:
 *   1. `repouso`  — como a página entrega (o número que a issue cobra).
 *   2. `teto`     — com `filter: none; opacity: 1` forçados no `style` inline.
 *   3. `hover`    — para provar que o hover continua diferenciando.
 *
 * O teto é o que a logo consegue SEM nenhum véu, contra o campo `#f5faff`. Se o teto
 * de uma marca já é menor que 3:1, subir opacidade e afrouxar `grayscale` não a
 * salva — o problema é a tinta do arquivo, e a saída tem de ser outra (escurecer o
 * desenho com `contrast`/`brightness`, que é filtro e não troca de arquivo). Medir o
 * teto ANTES de escolher número evita gastar duas rodadas descobrindo isso.
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const MODO = (process.argv.find((a) => a.startsWith('--modo=')) ?? '--modo=antes').split('=')[1];
const ALVO = 'http://localhost:3000/';
const SAIDA = 'docs/medidas/brandgrid-sis240';
const TEMP = `${SAIDA}/.recortes`;
const CAPTURAS = 'docs/capturas';

/* `deviceScaleFactor: 2` é parte do método da issue: em 1x o antialiasing come uma
   fatia grande de um lockup fino e o percentil 5 passa a ler franja. */
const JANELA = { width: 1440, height: 900 };

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

/** p5 da luminância = tinta; p95 = fundo. Devolve também as cores para o relatório. */
async function medirRecorte(arquivo) {
  const { data, info } = await sharp(arquivo).raw().toBuffer({ resolveWithObject: true });
  const n = info.channels;
  const amostras = [];
  for (let i = 0; i < data.length; i += n) {
    amostras.push({ l: luminancia(data[i], data[i + 1], data[i + 2]), r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  amostras.sort((a, b) => a.l - b.l);
  const p = (q) => amostras[Math.min(amostras.length - 1, Math.max(0, Math.round(q * (amostras.length - 1))))];
  const tinta = p(0.05);
  const fundo = p(0.95);
  return {
    razao: Number(razao(tinta.l, fundo.l).toFixed(2)),
    tinta: `rgb(${tinta.r},${tinta.g},${tinta.b})`,
    fundo: `rgb(${fundo.r},${fundo.g},${fundo.b})`,
    pixels: amostras.length,
  };
}

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: JANELA, deviceScaleFactor: 2 });
/* O diálogo «Preferências de movimento» monta DEPOIS do `networkidle` e tranca a
   rolagem; sem isto a grade nunca chega em cena. */
await contexto.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
const pagina = await contexto.newPage();

await mkdir(SAIDA, { recursive: true });
await mkdir(TEMP, { recursive: true });
await mkdir(CAPTURAS, { recursive: true });

await pagina.goto(ALVO, { waitUntil: 'networkidle' });

/* ⚠️ O `RouteLoadGate` COBRE A PÁGINA DEPOIS do `networkidle`, e a primeira versão
   desta sonda mediu através dele: a Samplemed (primeira célula, primeira foto da
   sessão) devolveu 1,04:1 com tinta `rgb(5,31,59)` sobre `rgb(7,35,63)` — dois
   navies, ou seja, o recorte não continha logo nenhuma. As 14 seguintes saíram
   certas porque o véu já tinha ido embora. Um número desses não parece defeito de
   instrumento, parece marca ilegível: seria "resolvido" com filtro em cima do nada.
   Então espera-se o portão explicitamente, pelos atributos que ele próprio publica. */
await pagina.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 30000 });
await pagina.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 30000 });

const campo = pagina.locator('.marcas-grade-campo');
/* UMA rolagem, instantânea (Lenis intercepta `scrollIntoView` suave — SIS-151). */
await campo.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
/* A cascata do `RevealScope` acende com 20% do campo em cena; espera-se o fim dela
   pela opacidade do ÚLTIMO envelope, não por tempo fixo. */
await pagina.waitForFunction(() => {
  const nós = [...document.querySelectorAll('.marcas-grade-logo-reveal')];
  return nós.length > 0 && nós.every((n) => Number(getComputedStyle(n).opacity) > 0.99);
}, null, { timeout: 15000 });
await pagina.waitForTimeout(500);

/* GUARDA DE CENA: o campo é `#f5faff`, quase branco. Se o p95 do próprio campo não
   for claro, alguma coisa está por cima (véu de rota, diálogo, transição) e todo
   número desta rodada descreveria o véu. Falha alto em vez de gravar JSON errado. */
{
  const caixaCampo = await campo.boundingBox();
  const prova = `${TEMP}/_guarda-campo.png`;
  await pagina.screenshot({ path: prova, clip: caixaCampo });
  const { fundo } = await medirRecorte(prova);
  const claro = fundo.match(/\d+/g).map(Number).every((v) => v > 200);
  if (!claro) throw new Error(`cena obstruída: p95 do campo é ${fundo}, esperado ~rgb(245,250,255)`);
}

const celulas = pagina.locator('.marcas-grade-celula');
const total = await celulas.count();

const marcas = [];
for (let i = 0; i < total; i += 1) {
  const celula = celulas.nth(i);
  const slug = await celula.getAttribute('data-marca');
  const img = celula.locator('img');
  const caixa = await img.boundingBox();
  const arquivo = (etapa) => `${TEMP}/${slug}-${etapa}.png`;

  const estilo = await img.evaluate((n) => {
    const c = getComputedStyle(n);
    return { filter: c.filter, opacity: c.opacity };
  });

  await pagina.screenshot({ path: arquivo('repouso'), clip: caixa });
  const repouso = await medirRecorte(arquivo('repouso'));

  /* TETO: sem véu nenhum. Escrito no `style` inline e desfeito em seguida — a folha
     não é tocada, então a medição seguinte não herda nada.
     ⚠️ ESPERAR A TRANSIÇÃO É PARTE DA MEDIÇÃO, NÃO CAUTELA. A imagem tem
     `transition: filter var(--base)`, e `--base` é 400ms (`legacy.css:46`). A
     primeira versão desta sonda fotografava no quadro seguinte à escrita do estilo,
     ou seja, no MEIO da transição — e o valor lido dependia de onde o repouso
     estava partindo. Foi o que produziu dois "tetos" incompatíveis para a mesma
     addactis: 2,64:1 na rodada `antes` (partindo de `grayscale(1)`, ainda cinza no
     instante da foto) e 3,80:1 na rodada `depois` (partindo de `brightness(0.6)`,
     ainda escura). Nenhum dos dois era o teto: eram dois pontos de caminhos
     diferentes. Espera-se o `filter` computado chegar em `none`. */
  await img.evaluate((n) => {
    n.dataset.sondaEstiloAntigo = n.getAttribute('style') ?? '';
    n.style.filter = 'none';
    n.style.opacity = '1';
  });
  await img.evaluate((n) => new Promise((ok) => {
    const pronto = () => getComputedStyle(n).filter === 'none' && getComputedStyle(n).opacity === '1';
    if (pronto()) return ok();
    const t0 = performance.now();
    const bate = () => (pronto() || performance.now() - t0 > 1500 ? ok() : requestAnimationFrame(bate));
    bate();
  }));
  await pagina.waitForTimeout(80);
  await pagina.screenshot({ path: arquivo('teto'), clip: caixa });
  const teto = await medirRecorte(arquivo('teto'));
  await img.evaluate((n) => {
    if (n.dataset.sondaEstiloAntigo) n.setAttribute('style', n.dataset.sondaEstiloAntigo);
    else n.removeAttribute('style');
    delete n.dataset.sondaEstiloAntigo;
  });

  /* HOVER: a caixa pode mudar (a célula acende, a imagem não transforma) — relê-se
     por segurança, e confere-se que o hover PEGOU pelo `filter` computado. */
  await celula.hover();
  await pagina.waitForTimeout(450);
  const caixaHover = (await img.boundingBox()) ?? caixa;
  await pagina.screenshot({ path: arquivo('hover'), clip: caixaHover });
  const hover = await medirRecorte(arquivo('hover'));
  const filtroHover = await img.evaluate((n) => getComputedStyle(n).filter);
  /* Sai de cima da célula para não deixar hover preso na próxima medição. */
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(250);

  marcas.push({
    slug,
    nome: await img.getAttribute('alt'),
    caixa: `${Math.round(caixa.width)}x${Math.round(caixa.height)}`,
    repousoEstilo: estilo,
    repouso,
    teto,
    hover,
    filtroHover,
    hoverPegou: filtroHover !== estilo.filter,
    passa: repouso.razao >= 3,
  });

  console.log(
    `${String(slug).padEnd(18)} repouso ${String(repouso.razao).padStart(5)}:1 ` +
      `${repouso.passa === false ? '' : ''}${repouso.razao >= 3 ? 'OK     ' : 'REPROVA'} ` +
      `· teto ${String(teto.razao).padStart(5)}:1 · hover ${String(hover.razao).padStart(5)}:1 ` +
      `${marcas[marcas.length - 1].hoverPegou ? '(hover pegou)' : '(HOVER NÃO PEGOU)'}` +
      ` · tinta ${repouso.tinta} sobre ${repouso.fundo}`,
  );
}

const reprovadas = marcas.filter((m) => !m.passa);
console.log(`\n${marcas.length} marcas · ${reprovadas.length} abaixo de 3:1` +
  (reprovadas.length ? `: ${reprovadas.map((m) => `${m.slug} ${m.repouso.razao}`).join(', ')}` : ''));

/* Capturas de aceite: a grade inteira em 1440, repouso, e uma com hover na pior
   marca — que é o que o critério «Addactis claramente legível sem hover» pede
   comparar. */
const capturaCampo = async (nome) => {
  const caixa = await campo.boundingBox();
  await pagina.screenshot({ path: `${CAPTURAS}/${nome}.png`, clip: caixa });
};
await capturaCampo(`sis240-brandgrid-1440-repouso-${MODO}`);

/* ⚠️ A FOTO DE HOVER É SEMPRE NA ADDACTIS, E NÃO NA "PIOR DO MOMENTO".
   A primeira versão hoverava a marca de menor contraste da rodada — o que produziu
   `hover-addactis-antes` contra `hover-sys4b-depois`, duas fotos de marcas
   diferentes, imprestáveis como antes/depois. A addactis é a marca que o critério de
   aceite nomeia («Addactis, o pior caso, claramente legível sem hover»), então é ela
   que tem de aparecer nas duas rodadas. A pior da rodada continua sendo fotografada,
   com o slug no nome, para o caso de ser outra. */
const foto = async (m) => {
  await celulas.nth(marcas.indexOf(m)).hover();
  await pagina.waitForTimeout(450);
  await capturaCampo(`sis240-brandgrid-1440-hover-${m.slug}-${MODO}`);
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(250);
};
const addactis = marcas.find((m) => m.slug === 'addactis');
if (addactis) await foto(addactis);
const pior = marcas.reduce((a, b) => (a.repouso.razao <= b.repouso.razao ? a : b));
if (pior.slug !== 'addactis') await foto(pior);

await writeFile(
  `${SAIDA}/${MODO}.json`,
  `${JSON.stringify({ modo: MODO, quando: new Date().toISOString(), janela: JANELA, deviceScaleFactor: 2, alvo: ALVO, marcas }, null, 1)}\n`,
);
console.log(`\n→ ${SAIDA}/${MODO}.json`);

await rm(TEMP, { recursive: true, force: true });
await navegador.close();
