/**
 * SIS-215 — as BANDAS AZUIS ESCURAS do início e do fim da cena de `/eventos-inovacao`.
 *
 * Mede duas coisas e captura as provas que o critério de aceite pede:
 *
 *  1. O PERFIL DE COR DO FUNDO da cena, amostrado ao longo da própria altura do
 *     bloco (`.eventos-destaque` no desktop, `.eventos-lista` no mobile) numa
 *     coluna sem conteúdo por cima. Sai a luminância relativa de cada amostra —
 *     é ela que diz se a ponta é "escura" ou "azul claro", e não olho em captura.
 *     A banda existe quando as amostras das pontas caem muito abaixo do miolo.
 *  2. AS DUAS EMENDAS (hero -> cena e cena -> Social), lendo dois pixels de cada
 *     lado da fronteira. Aqui o número que importa é o DEGRAU: fronteira boa é
 *     degrau pequeno; listra nova é degrau grande.
 *
 * Capturas: viewport inteiro no INÍCIO e no FIM do percurso da cena, em 1440
 * (critério de aceite (c)) e também em 390, onde quem pinta é `.eventos-lista`.
 *
 *   node scripts/medir-bandas-eventos-sis215.mjs
 *   MARCA=depois node scripts/medir-bandas-eventos-sis215.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const ALTURA = 900;
const DESTINO = 'docs/capturas/sis215-eventos';

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}/eventos-inovacao`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  const alvo = largura >= 1024 ? '.eventos-destaque' : '.eventos-lista';
  await pagina.waitForSelector(alvo, { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  await pagina.waitForTimeout(1200);

  const caixa = await pagina.evaluate((sel) => {
    const e = document.querySelector(sel);
    const r = e.getBoundingClientRect();
    return { topo: Math.round(r.top + window.scrollY), altura: Math.round(r.height) };
  }, alvo);

  const bloco = { '#alvo': alvo, '#caixa': caixa };

  /* ── 1. Perfil de cor do fundo ao longo da cena ─────────────────────────────
     A amostra é tirada de uma captura de PÁGINA INTEIRA da faixa: rolar até cada
     ponto e ler um pixel dá o mesmo resultado com muito mais idas e voltas, e
     aqui o fundo é `background` do bloco (não depende de rolagem). A coluna
     escolhida é a do meio-esquerda a 4% da largura, fora das duas colunas de
     miniaturas e fora do cartão central. */
  const perfil = [];
  const FRACOES = [0, 0.01, 0.02, 0.04, 0.06, 0.1, 0.25, 0.5, 0.75, 0.9, 0.94, 0.96, 0.98, 1];
  for (const f of FRACOES) {
    const y = Math.min(caixa.altura - 1, Math.round(f * caixa.altura));
    /* Rola de modo que a linha `caixa.topo + y` fique no meio da tela e lê o
       pixel — assim o que se mede é exatamente o que o navegador pinta ali,
       inclusive as camadas que são elemento e não fundo. */
    const meio = Math.max(0, caixa.topo + y - Math.round(ALTURA / 2));
    await pagina.evaluate(([t]) => {
      window.scrollTo({ top: t, behavior: 'auto' });
      window.__lenis?.scrollTo(t, { immediate: true, force: true });
    }, [meio]);
    await pagina.waitForTimeout(260);
    const linhaNaTela = caixa.topo + y - (await pagina.evaluate(() => Math.round(window.scrollY)));
    if (linhaNaTela < 0 || linhaNaTela >= ALTURA) continue;
    const tiro = await pagina.screenshot({
      clip: { x: Math.round(largura * 0.04), y: linhaNaTela, width: 2, height: 1 },
    });
    const { data } = await sharp(tiro).raw().toBuffer({ resolveWithObject: true });
    const cor = [data[0], data[1], data[2]];
    perfil.push({
      f,
      y,
      cor: hex(cor),
      lum: Math.round(lum(cor) * 10000) / 10000,
    });
  }
  bloco['#perfil'] = perfil;
  /* O miolo claro é a referência: a banda é o quanto a ponta se afasta dele. */
  const miolo = perfil.find((p) => p.f === 0.5);
  bloco['#contrasteDaPontaContraOMiolo'] = {
    topo: perfil.length ? Math.round(razaoHex(perfil[0].cor, miolo.cor) * 100) / 100 : null,
    base: perfil.length
      ? Math.round(razaoHex(perfil[perfil.length - 1].cor, miolo.cor) * 100) / 100
      : null,
  };

  /* ── 2. As duas emendas ─────────────────────────────────────────────────────
     Dois pixels acima e dois abaixo de cada fronteira, na mesma coluna. */
  const emendas = {};
  for (const [nome, yFronteira] of [
    ['hero->cena', caixa.topo],
    ['cena->social', caixa.topo + caixa.altura],
  ]) {
    const meio = Math.max(0, yFronteira - Math.round(ALTURA / 2));
    await pagina.evaluate(([t]) => {
      window.scrollTo({ top: t, behavior: 'auto' });
      window.__lenis?.scrollTo(t, { immediate: true, force: true });
    }, [meio]);
    await pagina.waitForTimeout(300);
    const naTela = yFronteira - (await pagina.evaluate(() => Math.round(window.scrollY)));
    const tiro = await pagina.screenshot({
      clip: { x: Math.round(largura * 0.04), y: naTela - 3, width: 2, height: 6 },
    });
    const { data, info } = await sharp(tiro).raw().toBuffer({ resolveWithObject: true });
    const cores = [];
    for (let i = 0; i < 6; i += 1) {
      const k = i * info.width * info.channels;
      cores.push([data[k], data[k + 1], data[k + 2]]);
    }
    emendas[nome] = {
      acima: cores.slice(0, 3).map(hex),
      abaixo: cores.slice(3).map(hex),
      degrauRGB: Math.max(
        ...[0, 1, 2].map((c) => Math.abs(cores[2][c] - cores[3][c])),
      ),
      razao: Math.round(razao(cores[2], cores[3]) * 100) / 100,
    };
  }
  bloco['#emendas'] = emendas;

  /* ── Capturas: início e fim do percurso ─────────────────────────────────── */
  for (const [rotulo, y] of [
    ['inicio', caixa.topo],
    ['fim', caixa.topo + caixa.altura - ALTURA],
  ]) {
    /* EM DEGRAUS, e não num salto: quem diz qual evento está no centro é um
       `IntersectionObserver` (ver o cabeçalho de `EventsSpotlight.tsx`), e ele não
       observa quadros que não aconteceram — num `scrollTo` instantâneo até o fim, o
       contador fica em `01 / 15` e a captura mostraria o percurso terminado com o
       primeiro evento no cartão. A rolagem em degraus dá ao observador os quadros
       intermediários, então o que a captura prova é o estado real daquela posição. */
    const partida = await pagina.evaluate(() => Math.round(window.scrollY));
    const destino = Math.max(0, y);
    const degraus = 10;
    for (let d = 1; d <= degraus; d += 1) {
      const t = Math.round(partida + ((destino - partida) * d) / degraus);
      await pagina.evaluate(([v]) => {
        window.scrollTo({ top: v, behavior: 'auto' });
        window.__lenis?.scrollTo(v, { immediate: true, force: true });
      }, [t]);
      await pagina.waitForTimeout(180);
    }
    await pagina.waitForTimeout(700);
    await pagina.screenshot({ path: `${DESTINO}/${MARCA}-${largura}-${rotulo}.png` });
    /* A posição EFETIVA, e não a pedida: se a captura vier do lugar errado, o
       número aparece aqui em vez de virar prova visual falsa. */
    bloco[`#capturaEm-${rotulo}`] = {
      pedido: Math.max(0, y),
      real: await pagina.evaluate(() => Math.round(window.scrollY)),
      contador: await pagina
        .locator('.eventos-destaque-contador-numero, .eventos-lista-cabecalho')
        .first()
        .textContent()
        .catch(() => null),
    };
  }

  saida[largura] = bloco;
  await pagina.close();
}

function razaoHex(a, b) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return razao(p(a), p(b));
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
