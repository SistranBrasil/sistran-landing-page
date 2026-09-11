/**
 * ⚠️ SONDA PARADA DESDE 11/09 — O PERCURSO SAIU DA FAIXA.
 * `.mb-percurso`, `.mb-palco` e `.mb-espaco` não existem mais no DOM de
 * `/contato`: o mount de `PercursoIndicadores` está comentado em
 * `MetricsBand.tsx` e os sete voltaram a ser uma grade que cabe numa tela. Rodar
 * isto hoje estoura em `null` na primeira medida, e o conserto NÃO é proteger a
 * leitura com `?.` — o que a sonda mede deixou de existir. Ela fica inteira
 * porque é o par do código comentado: religado o percurso, ela volta a valer sem
 * uma linha de diferença. A régua da forma atual é
 * `docs/medidas/faixa-numeros-compacta/auditar.mjs`.
 *
 * SIS-211 — a régua da banda de indicadores de /contato: ANTES e DEPOIS.
 *
 * POR QUE ESTA SONDA EXISTE. A issue pede a seção "mais baixa" e cobra o número no
 * relatório ("Altura/scroll da seção menor que o baseline atual"). A altura desta
 * banda não está escrita em lugar nenhum: ela é derivada de `PASSO_SVH = 30` e de
 * `TOTAL = METRICS.length` em `PercursoIndicadores.tsx` — o espaçador mede
 * `(N-1) × 30svh` e o palco preso mede 100svh. Estimar daria ~280svh, mas `svh`
 * não é `innerHeight` em todo lugar e o `padding-block` da seção é zerado só
 * quando o percurso liga. Então mede-se no navegador.
 *
 * O que se mede, por largura:
 *   - altura da `.contato-indicadores` (px e em múltiplos da janela);
 *   - altura do `.mb-espaco` (o espaçador que compra o scroll do percurso);
 *   - o TRECHO DE SCROLL em que o `.mb-palco` fica realmente preso — varrendo a
 *     página de 40 em 40px e olhando o `top` do palco, porque é esse trecho, e não
 *     a altura da seção, que o visitante sente como "seção longa";
 *   - a altura do documento inteiro, para dimensionar o ganho no todo;
 *   - os pixels das duas emendas (abertura→banda e banda→faixa de logos), que a
 *     issue manda refazer: a cor de um pixel acima e abaixo de cada fronteira diz
 *     se a aresta é um degrau de luminância ou uma passagem.
 *
 * Roda igual antes e depois da mudança — o arquivo é a régua, não o resultado.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const LARGURAS = (process.env.LARGURAS ?? '1024,1440,1920').split(',').map(Number);

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return x / y;
};

const navegador = await chromium.launch();
for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.contato-indicadores', { timeout: 180_000 });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(1500);

  const geo = await pagina.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores');
    const espaco = document.querySelector('.mb-espaco');
    const palco = document.querySelector('.mb-palco');
    const topoDoc = window.scrollY;
    const r = (el) => (el ? el.getBoundingClientRect() : null);
    return {
      secaoAltura: r(secao)?.height ?? 0,
      secaoTopoDoc: (r(secao)?.top ?? 0) + topoDoc,
      espacoAltura: r(espaco)?.height ?? 0,
      palcoAltura: r(palco)?.height ?? 0,
      percurso: palco?.closest('.mb-percurso')?.dataset.percurso ?? '(desligado)',
      doc: document.documentElement.scrollHeight,
      janela: window.innerHeight,
      paddingSecao: secao ? getComputedStyle(secao).paddingBlock : '',
    };
  });

  /* Trecho preso: varre a página e conta por quanto scroll o palco fica com o topo
     na borda de cima. Tolerância de 2px cobre arredondamento de subpixel. */
  const preso = await pagina.evaluate(async () => {
    const palco = document.querySelector('.mb-palco');
    if (!palco) return null;
    const PASSO = 40;
    let inicio = null;
    let fim = null;
    for (let y = 0; y <= document.documentElement.scrollHeight; y += PASSO) {
      window.scrollTo(0, y);
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      const top = palco.getBoundingClientRect().top;
      if (Math.abs(top) <= 2) {
        if (inicio === null) inicio = y;
        fim = y;
      }
    }
    window.scrollTo(0, 0);
    return inicio === null ? { inicio: null, fim: null, trecho: 0 } : { inicio, fim, trecho: fim - inicio };
  });

  /* Emendas: um pixel logo acima e logo abaixo de cada fronteira. Tira o cromo do
     dev antes, senão o balão do Next entra na foto. */
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });
  const emendas = [];
  for (const [nome, alvo, borda] of [
    ['abertura→banda', '.contato-indicadores', 'topo'],
    ['banda→logos', '.contato-indicadores', 'base'],
  ]) {
    const y = await pagina.evaluate(
      ([sel, qual]) => {
        const el = document.querySelector(sel);
        const cx = el.getBoundingClientRect();
        const absoluto = (qual === 'topo' ? cx.top : cx.bottom) + window.scrollY;
        window.scrollTo(0, Math.max(0, absoluto - window.innerHeight / 2));
        return absoluto - window.scrollY;
      },
      [alvo, borda],
    );
    await pagina.waitForTimeout(700);
    const foto = await pagina.screenshot();
    const sharp = (await import('sharp')).default;
    const { data, info } = await sharp(foto).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const px = (yy) => {
      const i = (Math.round(yy) * info.width + Math.round(info.width / 2)) * info.channels;
      return { r: data[i], g: data[i + 1], b: data[i + 2] };
    };
    const acima = px(Math.max(0, y - 4));
    const abaixo = px(Math.min(info.height - 1, y + 4));
    emendas.push(
      `${nome}: acima rgb(${acima.r},${acima.g},${acima.b}) · abaixo rgb(${abaixo.r},${abaixo.g},${abaixo.b}) · degrau ${razao(acima, abaixo).toFixed(2)}:1`,
    );
  }

  console.log(`\n${w}×900 — percurso ${geo.percurso} · padding "${geo.paddingSecao}"`);
  console.log(
    `  seção ${Math.round(geo.secaoAltura)}px (${(geo.secaoAltura / geo.janela).toFixed(2)}× janela) · espaçador ${Math.round(geo.espacoAltura)}px · palco ${Math.round(geo.palcoAltura)}px`,
  );
  console.log(
    `  preso de ${preso.inicio} a ${preso.fim} = ${preso.trecho}px de scroll (${(preso.trecho / geo.janela).toFixed(2)}× janela)`,
  );
  console.log(`  documento ${geo.doc}px`);
  for (const e of emendas) console.log(`  ${e}`);
  await contexto.close();
}
await navegador.close();
