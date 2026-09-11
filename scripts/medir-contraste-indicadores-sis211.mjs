/**
 * SIS-211 — contraste dos quatro textos do cartão de indicador DEPOIS de a faixa
 * ficar clara, e as capturas da banda.
 *
 * POR QUE REMEDIR. Os números da SIS-143 (9,67:1 no número, 11,98:1 no rótulo)
 * foram medidos com tinta BRANCA sobre cartão navy. O cartão virou branco e a
 * tinta virou navy: nenhum daqueles dois números vale mais, e a issue cobra AA
 * tanto no número quanto no rótulo.
 *
 * Método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`, máscara de miolo de letra:
 * três fotos do mesmo elemento (tinta transparente = fundo puro, tinta branca,
 * tinta preta); pixel de letra é onde branco e preto divergem por mais de 200 nos
 * três canais (a franja de antialiasing fica fora); o veredito é o PIOR pixel do
 * fundo sob essa máscara.
 *
 * ── UMA DIFERENÇA EM RELAÇÃO ÀS SONDAS DAS ABERTURAS ────────────────────────
 * Lá a tinta é branca e a razão se calcula contra `#fff` fixo. Aqui cada texto tem
 * a SUA tinta (número `#0a1f44`, `+` `#024e86`, rótulo navy a 88%, contador
 * `color-mix`), e o `+` e o contador não são navy cheio. Então há uma QUARTA foto,
 * com a tinta de verdade, e a razão é entre o pixel de letra e o pixel de fundo na
 * mesma coordenada. O motivo de não ler `getComputedStyle().color` está no corpo,
 * junto da foto — e é um erro que esta sonda cometeu antes de medir assim.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const LARGURAS = (process.env.LARGURAS ?? '1024,1440,1920').split(',').map(Number);
const DESTINO = 'docs/capturas';
await mkdir(DESTINO, { recursive: true });

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
const ALVOS = [
  /* O `<span>` do `CountUp`, e não o `<p>` inteiro: o `+` é irmão dentro do mesmo
     parágrafo, e medir o parágrafo devolvia o pior pixel DO `+` como se fosse o do
     número — os dois relatórios saíam com o mesmo valor, que foi o que denunciou. */
  ['número', '.contato-indicador:nth-child(1) .contato-indicador-valor > span:not(.contato-indicador-mais)'],
  ['sufixo +', '.contato-indicador:nth-child(1) .contato-indicador-mais'],
  ['rótulo', '.contato-indicador:nth-child(1) .contato-indicador-rotulo'],
  ['contador', '.contato-indicador:nth-child(1) .contato-indicador-etapa'],
  /* O PIOR CASO do contador não é o cartão aceso: é o que a trilha ainda não
     alcançou (`--mb-alc: 0`), onde a tinta é a mais fraca da cena. Um número só do
     cartão 1 esconderia exatamente o estado que pode reprovar.
     O estado é FORÇADO no cartão 1 (ver `APAGAR` abaixo) em vez de medido no
     cartão 7: o 7 está fora do recorte do palco quando a trilha está no começo, e
     `element.screenshot()` de nó recortado devolve quadro vazio — zero pixel de
     letra, nenhum veredito. */
  ['contador apagado', '.contato-indicador:nth-child(1) .contato-indicador-etapa'],
];
/* Escrito no cartão, não no elemento do contador: é assim que a cascata da cena
   entrega o valor (o `--mb-alc` mora em `.contato-indicador`). */
const APAGAR = `.contato-indicador:nth-child(1) { --mb-alc: 0 !important; }`;

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
  await pagina.waitForSelector('.contato-indicador', { timeout: 180_000 });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(1200);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });

  /* Rola até o palco estar preso: é aí que o cartão está na cena real. */
  await pagina.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores');
    window.scrollTo(0, secao.getBoundingClientRect().top + window.scrollY + 40);
  });
  await pagina.waitForTimeout(900);
  await pagina
    .locator('.mb-palco, .contato-indicadores')
    .first()
    .screenshot({ path: `${DESTINO}/sis211-banda-${w}.png` });

  for (const [rotulo, sel] of ALVOS) {
    const chave = rotulo.replace(/[^a-z]/gi, '');
    await pagina.evaluate(
      ([css, ligar]) => {
        document.querySelector('#sis211-apagar')?.remove();
        if (!ligar) return;
        const st = document.createElement('style');
        st.id = 'sis211-apagar';
        st.textContent = css;
        document.head.append(st);
      },
      [APAGAR, rotulo === 'contador apagado'],
    );
    const base = `${DESTINO}/tmp-sis211-${w}-${chave}`;
    const pintar = async (cor, saida) => {
      await pagina.evaluate(
        ([s, c]) => {
          document.querySelector('#sis211-tinta')?.remove();
          const st = document.createElement('style');
          st.id = 'sis211-tinta';
          st.textContent = `${s}, ${s} * { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
          document.head.append(st);
        },
        [sel, cor],
      );
      await pagina.waitForTimeout(150);
      await pagina.locator(sel).screenshot({ path: saida });
    };
    await pintar('transparent', `${base}-fundo.png`);
    await pintar('#fff', `${base}-branco.png`);
    await pintar('#000', `${base}-preto.png`);
    /* A QUARTA FOTO É A TINTA DE VERDADE, e ela substitui a leitura de
       `getComputedStyle().color`. Motivo medido: `color-mix()` não computa para
       `rgb()` — o navegador devolve `color(srgb 0.039 0.12 0.27 / 0.55)` no cartão
       apagado e `oklab(0.415 -0.041 -0.106)` no intermediário. Parsear esses dois
       textos como `rgb()` produziu 20,59:1 e −3,07:1 nas primeiras versões desta
       sonda: números inventados, um deles impossível.
       Com a foto, a razão é entre o pixel que o olho recebe e o pixel do fundo na
       MESMA coordenada — alfa, `color-mix` e espaço de cor já resolvidos pelo
       compositor, sem formato de CSS para reconhecer. */
    await pagina.evaluate(() => document.querySelector('#sis211-tinta')?.remove());
    await pagina.waitForTimeout(150);
    await pagina.locator(sel).screenshot({ path: `${base}-tinta.png` });

    const ler = async (p) =>
      sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const fundo = await ler(`${base}-fundo.png`);
    const branco = await ler(`${base}-branco.png`);
    const preto = await ler(`${base}-preto.png`);
    const real = await ler(`${base}-tinta.png`);
    const { width, height, channels } = fundo.info;
    /* DOIS NÚMEROS, e o motivo é o raster. A máscara de 200 ainda admite pixel de
       cobertura parcial (0,8 de cobertura já diverge mais de 200), e num tipo de
       0,72rem como o contador quase todo pixel é franja: o pior pixel sai mais
       claro que a tinta declarada. Então mede-se o pior pixel da máscara larga
       (pessimista, é o piso) E o pior pixel do MIOLO (divergência ≥ 250, tinta
       cheia), que é a cor que a folha de estilo pediu. Reprovar por franja
       condenaria toda tipografia pequena desta base. */
    let pior = { razao: Infinity, px: null, tinta: null, x: 0, y: 0 };
    let miolo = { razao: Infinity, px: null, tinta: null };
    let pixels = 0;
    let pixelsMiolo = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * channels;
        const dif = Math.min(
          branco.data[i] - preto.data[i],
          branco.data[i + 1] - preto.data[i + 1],
          branco.data[i + 2] - preto.data[i + 2],
        );
        if (dif < 200) continue;
        pixels += 1;
        const px = { r: fundo.data[i], g: fundo.data[i + 1], b: fundo.data[i + 2] };
        const tinta = { r: real.data[i], g: real.data[i + 1], b: real.data[i + 2] };
        const r = razao(tinta, px);
        if (r < pior.razao) pior = { razao: r, px, tinta, x, y };
        if (dif >= 250) {
          pixelsMiolo += 1;
          if (r < miolo.razao) miolo = { razao: r, px, tinta };
        }
      }
    }
    console.log(
      `${w} · ${rotulo}: miolo ${miolo.razao === Infinity ? 'sem pixel cheio' : `${miolo.razao.toFixed(2)}:1 (tinta rgb(${miolo.tinta.r},${miolo.tinta.g},${miolo.tinta.b}))`} · franja ${pior.razao.toFixed(2)}:1 (tinta rgb(${pior.tinta.r},${pior.tinta.g},${pior.tinta.b}) sobre rgb(${pior.px.r},${pior.px.g},${pior.px.b}) em ${pior.x},${pior.y}) · ${pixelsMiolo}/${pixels} pixels · ${miolo.razao >= 4.5 ? 'OK' : 'REPROVA'}`,
    );
    await unlink(`${base}-fundo.png`);
    await unlink(`${base}-branco.png`);
    await unlink(`${base}-preto.png`);
    await unlink(`${base}-tinta.png`);
  }
  await contexto.close();
}
await navegador.close();
