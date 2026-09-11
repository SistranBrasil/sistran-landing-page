/**
 * SIS-190 — confere no navegador a moldura do quadro do vídeo do hero.
 *
 * Três coisas podem falhar sozinhas, e cada uma tem a sua leitura:
 *
 *   1. O traço EXISTE nos lados sólidos (topo / direita / base) e NÃO existe
 *      aresta seca no lado que dissolve. Medido em pixels da captura, com o mesmo
 *      critério de "ciano" de `medir-referencia-moldura-hero.mjs`: se o lado
 *      esquerdo tivesse traço, ele apareceria como pico numa varredura horizontal
 *      no meio do quadro.
 *   2. A moldura ACOMPANHA o card. Em `t≈0`, `t≈0,7` e `t≈1` o raio da `.hero-frame`
 *      e o da `.hero-media` têm de ser IGUAIS entre si (senão sobra lasca clara
 *      dentro do arco) e a caixa da moldura tem de coincidir com a da mídia (senão
 *      sobra 1px de traço fora do card).
 *   3. Abaixo de 1024px a moldura não existe (decisão registrada: a referência é
 *      desktop e o vídeo é sangria).
 *
 * Rodar com o site no ar:
 *   node scripts/medir-moldura-hero.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const SAIDA = 'docs/capturas';
await mkdir(SAIDA, { recursive: true });

const navegador = await chromium.launch();

/**
 * Abre a home JÁ com o hero à vista.
 *
 * Três camadas cobrem a página na primeira visita, e todas as três mediriam a si
 * mesmas em vez do hero — foi o que aconteceu nas duas primeiras rodadas deste
 * script: os pixels vinham da abertura (`OptionalMorphIntro`), primeiro no
 * contador "84%", depois na marca centralizada. Nenhuma espera por tempo fixo
 * resolve isso de forma confiável; o que resolve é desligar as camadas pelas
 * chaves que elas próprias consultam e depois esperar pelo SINAL de saída:
 *
 *   1. `sistran:intro-visto` em `sessionStorage` — `OptionalMorphIntro` não roda
 *      de novo na mesma sessão (`src/components/intro/OptionalMorphIntro.tsx:42`);
 *   2. `sistran-motion-preference-seen` em `localStorage` — sem isso aparece o
 *      convite "Preferências de movimento" (`src/lib/motionPreference.ts`);
 *   3. `html[data-intro]`, que a abertura põe enquanto está em cena: esperar a
 *      AUSÊNCIA dele é o sinal de que o hero está livre.
 */
async function abrir(contexto, preferencia) {
  await contexto.addInitScript(
    ([chaveVista, chavePref, valor, chaveIntro]) => {
      localStorage.setItem(chaveVista, '1');
      if (valor) localStorage.setItem(chavePref, valor);
      sessionStorage.setItem(chaveIntro, '1');
    },
    [
      'sistran-motion-preference-seen',
      'sistran-motion-preference',
      preferencia ?? '',
      'sistran:intro-visto',
    ],
  );
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pagina
    .waitForFunction(() => !document.documentElement.hasAttribute('data-intro'), { timeout: 20000 })
    .catch(() => undefined);
  /* O vídeo precisa de um quadro decodificado para a cena parar de ser navy
     chapado; `readyState >= 2` é "tem quadro atual". Se o codec não existir no
     Chromium desta máquina, segue mesmo assim — a moldura não depende do vídeo. */
  await pagina
    .waitForFunction(
      () => {
        const v = document.querySelector('video.hero-video');
        return !v || v.readyState >= 2;
      },
      { timeout: 10000 },
    )
    .catch(() => undefined);
  await pagina.waitForTimeout(1200);
  return pagina;
}

/** Geometria dos dois nós, do jeito que o navegador realmente calculou. */
const GEOMETRIA = () => {
  const ler = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      display: c.display,
      caixa: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
      raioSupDir: c.borderTopRightRadius,
      raioInfDir: c.borderBottomRightRadius,
      raioSupEsq: c.borderTopLeftRadius,
    };
  };
  return { moldura: ler('.hero-frame'), midia: ler('.hero-media'), y: Math.round(window.scrollY) };
};

/** Pico de ciano numa varredura de pixels da captura. */
async function pico(arquivo, x0, y0, dx, dy, n) {
  const { data, info } = await sharp(arquivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let melhor = { v: -Infinity };
  for (let k = 0; k < n; k += 1) {
    const x = x0 + dx * k;
    const y = y0 + dy * k;
    if (x < 0 || y < 0 || x >= W || y >= H) break;
    const i = (y * W + x) * C;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const v = (g + b) / 2 - r;
    if (v > melhor.v) melhor = { v: Math.round(v), x, y, hex: `#${[r, g, b].map((n2) => n2.toString(16).padStart(2, '0')).join('')}` };
  }
  return melhor;
}

const relatorio = [];

/* ── 1440: os três instantes do percurso ─────────────────────────────────── */
{
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await abrir(contexto);

  /* O percurso do hero é a altura do `#top`; `t` é a fração dele. */
  const altura = await pagina.evaluate(() => {
    const el = document.getElementById('top');
    return el ? el.offsetHeight - window.innerHeight : 0;
  });

  for (const t of [0, 0.7, 1]) {
    await pagina.evaluate((y) => window.scrollTo(0, y), Math.round(altura * t));
    /* O `scrub` do motion tem inércia; 900ms é folga sobre ela. */
    await pagina.waitForTimeout(900);
    const geo = await pagina.evaluate(GEOMETRIA);
    const arq = `${SAIDA}/sis190-1440-t${String(t).replace('.', '')}.png`;
    await pagina.screenshot({ path: arq });

    /* Varreduras: da folha clara para dentro do quadro, em cada lado. */
    const [l, tp, w, h] = geo.midia.caixa;
    const meioY = Math.max(1, Math.round(tp + h / 2));
    const medidas = {
      direita: await pico(arq, Math.min(1439, l + w - 1), meioY, -1, 0, 24),
      /* 93% da largura, e não 75%: o cabeçalho fixo cobre o topo do quadro até
         x≈1340 e a varredura a 75% media o cabeçalho, não a moldura (leu
         `#ffffff` em t=0,7 por isso). */
      topo: await pico(arq, Math.round(l + w * 0.93), Math.max(0, tp), 0, 1, 24),
      base: await pico(arq, Math.round(l + w * 0.93), Math.min(899, tp + h - 1), 0, -1, 24),
      /* Lado que dissolve: 40px para dentro a partir da borda esquerda da caixa.
         Pico alto aqui = aresta seca, que é o defeito. */
      esquerda: await pico(arq, Math.max(0, l), meioY, 1, 0, 40),
    };
    relatorio.push({ cena: `1440 · t=${t}`, geo, medidas, arq });
  }
  await contexto.close();
}

/* ── 390: a moldura não deve existir ─────────────────────────────────────── */
{
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
  const pagina = await abrir(contexto);
  const geo = await pagina.evaluate(GEOMETRIA);
  const arq = `${SAIDA}/sis190-390.png`;
  await pagina.screenshot({ path: arq });
  relatorio.push({ cena: '390', geo, medidas: null, arq });
  await contexto.close();
}

/* ── Movimento reduzido a 1440: a moldura continua visível ───────────────── */
for (const [nome, opcoes] of [
  ['1440 · sistema reduce', { reducedMotion: 'reduce' }],
  ['1440 · data-motion=reduce', { atributo: true }],
]) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: opcoes.reducedMotion ?? 'no-preference',
  });
  const pagina = await abrir(contexto, opcoes.atributo ? 'reduce' : undefined);
  const geo = await pagina.evaluate(GEOMETRIA);
  const arq = `${SAIDA}/sis190-${nome.includes('sistema') ? 'reduce-sistema' : 'reduce-atributo'}.png`;
  await pagina.screenshot({ path: arq });
  const [l, tp, w, h] = geo.midia.caixa;
  relatorio.push({
    cena: nome,
    geo,
    medidas: {
      direita: await pico(arq, Math.min(1439, l + w - 1), Math.round(tp + h / 2), -1, 0, 24),
    },
    arq,
  });
}

await navegador.close();

for (const r of relatorio) {
  console.log(`\n── ${r.cena} ──  (${r.arq})`);
  console.log('  moldura', JSON.stringify(r.geo.moldura));
  console.log('  midia  ', JSON.stringify(r.geo.midia));
  if (r.medidas) {
    for (const [lado, m] of Object.entries(r.medidas)) {
      console.log(`  ${lado.padEnd(9)} ciano ${String(m.v).padStart(4)} ${m.hex ?? ''} @ ${m.x},${m.y}`);
    }
  }
}
