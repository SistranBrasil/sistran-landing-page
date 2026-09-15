/**
 * SIS-255 — mede o véu de "Onde Estamos" (`.mapa-veu`) em /contato.
 *
 * A issue é sobre DUAS propriedades do véu, e as duas são número:
 *   1. "muito escuro"  -> alfa efetivo do véu, ponto a ponto;
 *   2. "muito quadrado" -> comprimento das rampas e degrau entre linhas/colunas
 *      vizinhas (é a rampa curta que lê como bloco, não a cor).
 * O piso que não pode cair é o contraste do texto do painel, que só o véu garante
 * (o visitante arrasta o mapa e pode trazer área branca para debaixo do texto).
 *
 * ── Método ─────────────────────────────────────────────────────────────────
 * BRANCO FORÇADO atrás do véu, e painel OCULTO. Os dois vêm do comentário de
 * medição da SIS-135/168 em `globals.css` e cada um resolve um problema:
 *  · Branco atrás = pior caso. É o que o arrasto do mapa pode colocar ali, e é
 *    também o fundo que transforma pixel em alfa por uma conta só:
 *    `P = 255(1-a) + C*a`, logo `a = (255 - P) / (255 - C)`, com `C` = canal
 *    vermelho da cor-base do véu LIDA do `background-image` computado (ela muda
 *    nesta issue, então não pode ser constante escrita à mão).
 *  · Painel oculto por `visibility: hidden` (não `display: none`): sem isto a
 *    sonda mede o botão branco em cima do véu e devolve ~1:1, que foi o erro
 *    registrado na 2ª passagem da SIS-135. `visibility` preserva a altura do
 *    painel, e é ela que dimensiona o cartão — com `display: none` o cartão
 *    encolheria e o véu medido não seria o véu do site.
 * O contraste é o do PIOR pixel (o mais claro) dentro dos retângulos de GLIFO de
 * cada texto do painel, obtidos por `Range`; a caixa do elemento inclui folga
 * onde o véu já está mais claro e o pior pixel iria buscar lá.
 *
 * A foto do render REAL sai antes de qualquer forçagem, para o antes/depois ser
 * do que o visitante vê.
 *
 * Uso:
 *   $env:MARCA='antes'; node scripts/medir-veu-mapa-sis255.mjs
 *   $env:MARCA='depois'; $env:LARGURAS='1440,1024,390'; node ...
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'medida';
const LARGURAS = (process.env.LARGURAS ?? '1440,1024,390')
  .split(',')
  .map((n) => Number(n.trim()))
  .filter(Boolean);
const PASTA = 'docs/medidas/veu-mapa-sis255';
await mkdir(PASTA, { recursive: true });

/* `VEU=antes` repinta o véu com as declarações ANTERIORES à SIS-255 por cima do
   CSS do site. Não é enfeite: sem isto o "antes" só poderia ser remedido
   desfazendo a mudança no `globals.css`, e qualquer número do relatório deixaria
   de ser reproduzível no dia seguinte. As duas regras vão com a MESMA media
   query do arquivo (o estreito abaixo de 64rem, o largo acima) e com
   `!important`, que é o que vence a regra em camada sem depender de ordem. */
const VEU_ANTES = `
@media (max-width: 63.999rem) {
  .mapa-veu {
    background: linear-gradient(
      180deg,
      rgb(3 18 40 / 0%) 0rem,
      rgb(3 18 40 / 72%) 10.8rem,
      rgb(3 18 40 / 96%) 16rem,
      rgb(3 18 40 / 98%) 100%
    ) !important;
  }
}
@media (min-width: 64rem) {
  .mapa-veu {
    background: linear-gradient(
      90deg,
      rgb(3 18 40 / 98%) 0%,
      rgb(3 18 40 / 97%) calc(var(--mapa-eixo) + 24rem),
      rgb(3 18 40 / 78%) calc(var(--mapa-eixo) + 26.8rem),
      rgb(3 18 40 / 40%) calc(var(--mapa-eixo) + 28.9rem),
      rgb(3 18 40 / 0%) calc(var(--mapa-eixo) + 31rem)
    ) !important;
    -webkit-mask-image: linear-gradient(
      180deg,
      transparent calc(50% - 23rem),
      #000 calc(50% - 19rem),
      #000 calc(50% + 19rem),
      transparent calc(50% + 23rem)
    ) !important;
    mask-image: linear-gradient(
      180deg,
      transparent calc(50% - 23rem),
      #000 calc(50% - 19rem),
      #000 calc(50% + 19rem),
      transparent calc(50% + 23rem)
    ) !important;
  }
}`;

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const trio = (txt) => (txt.match(/-?[\d.]+/g) || []).map(Number).slice(0, 3);
const arred = (n, casas = 1) => Math.round(n * 10 ** casas) / 10 ** casas;

const navegador = await chromium.launch();
const relatorio = {};

for (const largura of LARGURAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    /* Movimento normal: é o estado que a seção tem no site. O diálogo de
       preferência é fechado abaixo; o `addInitScript` evita que ele apareça de
       novo depois da hidratação e cubra o cartão. */
    reducedMotion: 'no-preference',
  });
  await pagina.addInitScript(() =>
    localStorage.setItem('sistran-motion-preference-seen', '1'),
  );
  await pagina.goto(`${URL_BASE}/contato`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('#onde-estamos', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'header.fixed{display:none!important}' +
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  if (process.env.VEU === 'antes') await pagina.addStyleTag({ content: VEU_ANTES });
  const continuar = pagina.getByRole('button', { name: 'Continuar' });
  if (await continuar.count()) {
    await continuar.first().click().catch(() => {});
    await pagina.waitForTimeout(400);
  }

  /* O mapa só começa a carregar quando a seção entra na tela
     (`IntersectionObserver`), e são tiles de rede: sem rolar até lá a foto do
     render real sairia com o quadro vazio. */
  const topo = await pagina.evaluate(
    () =>
      document.querySelector('#onde-estamos').getBoundingClientRect().top +
      window.scrollY,
  );
  await pagina.evaluate((y) => window.scrollTo(0, Math.max(0, y - 60)), topo);
  await pagina.waitForTimeout(7000);
  if (await continuar.count()) {
    await continuar.first().click().catch(() => {});
    await pagina.waitForTimeout(600);
  }

  const cartao = await pagina.evaluate(() => {
    const c = document.querySelector('.mapa-cartao');
    const r = c.getBoundingClientRect();
    return {
      x: Math.round(r.x + window.scrollX),
      y: Math.round(r.y + window.scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });

  /* Foto do render real, antes de forçar qualquer coisa. */
  await pagina.screenshot({
    path: `${PASTA}/${MARCA}-${largura}.png`,
    clip: cartao,
    fullPage: true,
  });

  /* Pixel do mapa REAL no pino, para saber o custo da rampa em níveis de cinza
     sobre o mapa escuro — que é o número que importa quando se pergunta "o véu
     cobre o pino?". */
  /* Coordenada de DOCUMENTO com `fullPage: true`, igual à foto do cartão: em
     coordenada de janela o recorte de 1px cai fora do quadro quando o cartão é
     mais alto que a viewport, e o Playwright responde "clipped area is either
     empty or outside the resulting image". */
  const pinoReal = {
    x: cartao.x + Math.floor(cartao.width / 2),
    y: cartao.y + Math.floor(cartao.height / 2),
  };
  const bufPinoReal = await pagina.screenshot({
    clip: { x: pinoReal.x, y: pinoReal.y, width: 1, height: 1 },
    fullPage: true,
  });
  const pxPinoReal = [
    ...(await sharp(bufPinoReal).ensureAlpha().raw().toBuffer()),
  ].slice(0, 3);

  /* ── Pior caso: branco atrás, painel invisível ─────────────────────────── */
  const alvos = await pagina.evaluate(() => {
    const veu = document.querySelector('.mapa-veu');
    const cs = getComputedStyle(veu);
    const painel = document.querySelector('.mapa-painel');
    const cartao = document.querySelector('.mapa-cartao');
    const rc = cartao.getBoundingClientRect();
    const rel = (r) => ({
      x: Math.round(r.left - rc.left),
      y: Math.round(r.top - rc.top),
      width: Math.max(1, Math.round(r.width)),
      height: Math.max(1, Math.round(r.height)),
    });

    /* Retângulos de glifo de cada bloco de texto do painel. O título grande e o
       corpo têm pisos diferentes na WCAG, então cada um vai com o próprio
       `font-size`/peso em vez de um piso presumido. */
    const textos = [];
    const nos = [
      ...painel.querySelectorAll('h2, p, span, a, .tag-section'),
    ].filter((e) => (e.textContent || '').trim().length > 2);
    for (const e of nos) {
      /* Só folhas: um `<p>` que contém `<span>` apareceria duas vezes e a
         medida do pai incluiria o filho. */
      if ([...e.children].some((f) => (f.textContent || '').trim().length > 2)) continue;
      const faixa = document.createRange();
      faixa.selectNodeContents(e);
      const caixas = [...faixa.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
      if (!caixas.length) continue;
      const c = getComputedStyle(e);
      textos.push({
        texto: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 42),
        tag: e.tagName.toLowerCase(),
        cor: c.color,
        px: parseFloat(c.fontSize),
        peso: Number(c.fontWeight),
        caixas: caixas.map(rel),
      });
    }

    return {
      cartaoLargura: Math.round(rc.width),
      cartaoAltura: Math.round(rc.height),
      gradiente: cs.backgroundImage,
      mascara: cs.maskImage || cs.webkitMaskImage,
      painel: rel(painel.getBoundingClientRect()),
      textos,
    };
  });

  await pagina.addStyleTag({
    content:
      /* Branco no lugar do mapa: fundo branco no quadro e tiles/pino ocultos. */
      '.mapa-cartao-mapa{background:#fff!important}' +
      '.mapa-cartao-mapa > *{visibility:hidden!important}' +
      /* Painel invisível, mas ocupando a mesma altura (ver nota do cabeçalho). */
      '.mapa-painel{visibility:hidden!important}',
  });
  await pagina.waitForTimeout(500);

  const buf = await pagina.screenshot({ clip: cartao, fullPage: true });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const R = (x, y) => data[(y * info.width + x) * info.channels];
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };

  /* Cor-base do véu lida do CSS computado (muda nesta issue). */
  const base = trio(alvos.gradiente.match(/rgba?\([^)]*\)/)?.[0] ?? 'rgb(3,18,40)');
  const alfa = (x, y) => arred(((255 - R(x, y)) / (255 - base[0])) * 100, 1);

  /* ── "muito escuro": alfa nos pontos que a issue nomeia ──────────────── */
  const meioY = Math.floor(info.height / 2);
  const meioX = Math.floor(info.width / 2);
  const amostras = {
    esquerda_meio: alfa(2, meioY),
    painel_centro: alfa(
      Math.min(info.width - 1, Math.max(0, alvos.painel.x + Math.floor(alvos.painel.width / 2))),
      meioY,
    ),
    pino_centro: alfa(meioX, meioY),
    canto_superior_esquerdo: alfa(2, 2),
    canto_inferior_esquerdo: alfa(2, info.height - 3),
    direita_meio: alfa(info.width - 3, meioY),
  };

  /* ── "muito quadrado": onde a rampa começa e acaba, e degrau vizinho ──── */
  const perfilX = [];
  for (let x = 0; x < info.width; x++) perfilX.push(alfa(x, meioY));
  const perfilY = [];
  const colunaSonda = Math.min(40, info.width - 1);
  for (let y = 0; y < info.height; y++) perfilY.push(alfa(colunaSonda, y));

  const limiar = (perfil, alvoAlfa, deCima) => {
    const seq = deCima ? perfil.map((v, i) => [i, v]) : perfil.map((v, i) => [i, v]).reverse();
    for (const [i, v] of seq) if (v <= alvoAlfa) return i;
    return null;
  };
  /* Rampa = do último ponto ainda "cheio" (>= 90% do alfa máximo do perfil) ao
     primeiro ponto praticamente limpo (<= 2%). */
  const maxX = Math.max(...perfilX);
  const fimOpacoX = (() => {
    let ultimo = 0;
    for (let x = 0; x < perfilX.length; x++) if (perfilX[x] >= maxX * 0.9) ultimo = x;
    return ultimo;
  })();
  const fimRampaX = limiar(perfilX, 2, true) ?? info.width - 1;

  /* As 4 primeiras e as 4 últimas linhas/colunas do recorte ficam FORA da conta
     de banda, e o motivo é medido: ali o degrau não é do véu, é a borda do
     cartão encontrando o que está atrás dele (no estreito deu 9/255 na última
     linha, contra 92% de alfa declarado no último stop — ou seja o pixel lido
     nem era véu). A nota da SIS-135 já fazia o mesmo descarte, com 32 linhas. */
  const BORDA = 4;
  const degrauMax = (perfil) => {
    let maior = 0;
    let onde = 0;
    for (let i = 1 + BORDA; i < perfil.length - BORDA; i++) {
      const d = Math.abs(perfil[i] - perfil[i - 1]);
      if (d > maior) {
        maior = d;
        onde = i;
      }
    }
    return { pontosDeAlfa: arred(maior, 1), em: onde };
  };
  /* Degrau em NÍVEIS DE CINZA (0-255) é o que lê como banda; o de alfa é só a
     leitura da rampa. Os dois vão no relatório. */
  const degrauCinza = (eixoFixo, vertical) => {
    let maior = 0;
    let onde = 0;
    const n = vertical ? info.height : info.width;
    for (let i = 1 + BORDA; i < n - BORDA; i++) {
      const a = vertical ? R(eixoFixo, i) : R(i, eixoFixo);
      const b = vertical ? R(eixoFixo, i - 1) : R(i - 1, eixoFixo);
      const d = Math.abs(a - b);
      if (d > maior) {
        maior = d;
        onde = i;
      }
    }
    return { niveis: maior, em: onde };
  };

  /* ── O piso: contraste do texto do painel sobre o véu ─────────────────── */
  const contrastes = alvos.textos.map((t) => {
    let pior = null;
    for (const c of t.caixas) {
      for (let y = Math.max(0, c.y); y < Math.min(info.height, c.y + c.height); y++) {
        for (let x = Math.max(0, c.x); x < Math.min(info.width, c.x + c.width); x++) {
          const p = px(x, y);
          if (!pior || lum(p) > lum(pior)) pior = p;
        }
      }
    }
    if (!pior) return { ...t, caixas: undefined, erro: 'sem pixel' };
    const tinta = trio(t.cor);
    const grande = t.px >= 24 || (t.px >= 18.66 && t.peso >= 700);
    const r = razao(tinta, pior);
    return {
      texto: t.texto,
      tag: t.tag,
      px: t.px,
      peso: t.peso,
      cor: t.cor,
      grande,
      piso: grande ? 3 : 4.5,
      fundoPior: pior,
      alfaNoPior: alfa(0, 0) === null ? null : arred(((255 - pior[0]) / (255 - base[0])) * 100, 1),
      razao: r,
      passa: r >= (grande ? 3 : 4.5),
    };
  });

  relatorio[largura] = {
    marca: MARCA,
    cartao: { largura: alvos.cartaoLargura, altura: alvos.cartaoAltura },
    /* Caixa do painel em coordenada do CARTÃO: é ela que a banda opaca da
       máscara vertical tem de cobrir inteira, e por isso vai no relatório em vez
       de ficar presumida ("o painel mede 431px" envelheceu duas vezes). */
    painel: alvos.painel,
    corBaseVeu: `rgb(${base.join(' ')})`,
    gradiente: alvos.gradiente,
    mascara: alvos.mascara,
    alfaPorcento: amostras,
    rampaHorizontal: {
      fimDoOpaco_px: fimOpacoX,
      fimDaRampa_px: fimRampaX,
      comprimento_px: fimRampaX - fimOpacoX,
      pinoEm_px: meioX,
      pinoDentroDaRampa: meioX < fimRampaX,
      alfaNoPino_porcento: amostras.pino_centro,
      pixelDoMapaRealNoPino: pxPinoReal,
      degrauMaximo: degrauMax(perfilX),
      degrauMaximoCinza: degrauCinza(meioY, false),
    },
    rampaVertical: {
      colunaSonda,
      alfaTopo: perfilY[0],
      alfaMeio: perfilY[meioY],
      alfaBase: perfilY[perfilY.length - 1],
      /* Alfa a N rem ACIMA do centro, que é onde a máscara vertical trabalha.
         Vai ponto a ponto porque a pergunta "a rampa nova cobre mais ou menos
         que a antiga?" não se responde pelo comprimento: os dois perfis se
         cruzam, e sem os pontos a afirmação seria chute. */
      alfaPorRemDoCentro: Object.fromEntries(
        [19, 20, 21, 22, 23, 24].map((rem) => {
          const y = meioY - rem * 16;
          return [`${rem}rem`, y >= 0 ? alfa(colunaSonda, y) : null];
        }),
      ),
      degrauMaximo: degrauMax(perfilY),
      degrauMaximoCinza: degrauCinza(colunaSonda, true),
    },
    textoDoPainel: contrastes,
    piorContraste: contrastes.reduce(
      (a, b) => (a === null || (b.razao ?? 99) < a ? Math.min(a ?? 99, b.razao ?? 99) : a),
      null,
    ),
    foto: `${PASTA}/${MARCA}-${largura}.png`,
  };

  await pagina.close();
}

await navegador.close();
console.log(JSON.stringify(relatorio, null, 2));
