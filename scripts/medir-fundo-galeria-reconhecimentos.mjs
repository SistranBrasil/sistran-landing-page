/* Mede o FUNDO ATRÁS DO TROFÉU da galeria de reconhecimentos (/quem-somos) depois
   do pedido de 24/09: fitas de luz, malha de quadrados e malha interativa.

   O que este script prova, e por quê:

   1. CONTRASTE DO SELO. As camadas novas entram ABAIXO da base elíptica, então não
      podem roubar contraste. A prova não é ler o CSS: é medir o pior pixel de
      tinta do selo contra o papel mais claro sob ele, nos três painéis de
      `tintaEscura`, e comparar com o piso de 5,6:1 registrado no CSS. Raster
      subestima tinta fina, então saem MÉDIA e PIOR PIXEL.

   2. EFEITO DO PONTEIRO. Portão de efeito é Δvalor por rolagem/curso, não «existe
      listener»: movo o ponteiro por um curso conhecido dentro do painel e leio
      quanto a máscara andou (`--sx`) E quanto o pixel mudou de valor no ponto que
      passou a ficar sob a luz. Curso percorrido sem mudança de pixel não passa.

   3. GEOMETRIA em 1440/768/390, sem transbordo horizontal.

   4. MOVIMENTO REDUZIDO nos dois canais: nada preso invisível e máscara no centro.
*/
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ALVO = 'http://localhost:3000/quem-somos';

const nav = await chromium.launch({ executablePath: EXE });

async function abrir({ largura, altura = 900, escala = 2, motion = 'full', midia = null }) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: escala,
    ...(midia ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (m) => {
      localStorage.setItem('sistran-motion-preference', m);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    motion,
  );
  const pag = await ctx.newPage();
  await pag.goto(ALVO, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[href="#conteudo"]{display:none!important}',
  });
  return { ctx, pag };
}

/* Leva a rampa à etapa pedida. O quadro é `sticky` e NÃO está colado no topo
   absoluto da rampa — a amostra nunca fica antes de uma janela rolada dentro
   dela, senão o painel nasce meio fora da janela (erro medido: top -220). */
async function irParaEtapa(pag, etapa) {
  const rampa = await pag.evaluate(() => {
    const r = document.querySelector('.rgal-rampa');
    if (!r) throw new Error('.rgal-rampa não existe');
    const b = r.getBoundingClientRect();
    return { topo: b.top + window.scrollY, altura: b.height };
  });
  const h = await pag.evaluate(() => window.innerHeight);
  const y = Math.min(
    Math.max(rampa.topo + rampa.altura * ((etapa + 0.5) / 4), rampa.topo + h),
    rampa.topo + rampa.altura - h,
  );
  await pag.evaluate((v) => window.scrollTo(0, v), y);
  await pag.waitForTimeout(1400);
  return pag.evaluate(() => {
    const el = document.querySelector('.rgal-painel[data-ativo="true"]');
    if (!el) throw new Error('nenhum painel ativo');
    const b = el.getBoundingClientRect();
    if (b.top < 0 || b.bottom > window.innerHeight) {
      throw new Error(`painel fora da janela: top ${Math.round(b.top)} bottom ${Math.round(b.bottom)}`);
    }
    return {
      x: Math.round(b.x),
      y: Math.round(b.y),
      w: Math.round(b.width),
      h: Math.round(b.height),
      titulo: el.querySelector('.rgal-titulo').textContent.trim(),
      tinta: el.dataset.tinta,
    };
  });
}

function lum([r, g, b]) {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function razao(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const sharp = (await import('sharp')).default;

/* Liga/desliga as três camadas novas. É assim que a medição fica sendo ANTES e
   DEPOIS na mesma página: número absoluto de contraste sobre raster não se compara
   com o 5,6:1 que foi medido no asset com `sharp`; o que prova que o fundo novo
   não roubou contraste é a diferença entre estes dois estados. */
const DESLIGAR = '.rgal-fitas,.rgal-malha,.rgal-malha-luz{display:none!important}';
async function comCamadas(pag, ligadas, fn) {
  const marca = await pag.evaluate((css) => {
    const s = document.createElement('style');
    s.id = 'sonda-desliga-fundo';
    s.textContent = css;
    document.head.append(s);
    return true;
  }, ligadas ? '' : DESLIGAR);
  if (!marca) throw new Error('não injetou a folha da sonda');
  await pag.waitForTimeout(250);
  const r = await fn();
  await pag.evaluate(() => document.getElementById('sonda-desliga-fundo')?.remove());
  await pag.waitForTimeout(250);
  return r;
}

/* Recorta a ARTE do painel ativo e separa tinta de papel pela luminância. O
   limiar 0,35 é o que já separa os dois grupos nestes assets (o selo da ABNT tem
   100% da tinta abaixo de 0,18; o papel da base está acima de 0,85). */
async function contrasteDoSelo(pag) {
  const caixa = await pag.evaluate(() => {
    const el = document.querySelector('.rgal-painel[data-ativo="true"] .rgal-arte');
    const b = el.getBoundingClientRect();
    if (b.top < 0 || b.bottom > window.innerHeight) throw new Error('arte fora da janela');
    return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
  });
  const buf = await pag.screenshot({ clip: caixa });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const tinta = [];
  const papel = [];
  let fundoMarinho = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const p = [data[i], data[i + 1], data[i + 2]];
    /* O retângulo da arte é maior que o papel: as quinas caem no MARINHO do
       painel, que também é escuro e entraria como «tinta», puxando a média para
       baixo e medindo o contraste errado (o do fundo, não o do selo). Marinho
       tem azul muito acima do vermelho; a tinta dos selos é neutra ou quente. */
    if (p[2] - p[0] > 30 && lum(p) < 0.2) {
      fundoMarinho++;
      continue;
    }
    (lum(p) < 0.35 ? tinta : papel).push(p);
  }
  if (!tinta.length || !papel.length) throw new Error('não separou tinta de papel');
  const papelMaisClaro = papel.reduce((a, b) => (lum(b) > lum(a) ? b : a));
  const piorTinta = tinta.reduce((a, b) => (lum(b) > lum(a) ? b : a));
  const media = tinta
    .reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0])
    .map((v) => Math.round(v / tinta.length));
  return {
    pixelsDeTinta: tinta.length,
    pixelsDeFundoMarinhoDescartados: fundoMarinho,
    papelMaisClaro: papelMaisClaro.join(','),
    razaoMedia: +razao(media, papelMaisClaro).toFixed(2),
    razaoPiorPixel: +razao(piorTinta, papelMaisClaro).toFixed(2),
  };
}

const saida = {};

/* ── 1440: as camadas novas, o contraste dos selos e o efeito do ponteiro ──── */
{
  const { ctx, pag } = await abrir({ largura: 1440 });
  mkdirSync('docs/capturas', { recursive: true });

  const etapas = [];
  for (let e = 0; e < 4; e++) {
    const caixa = await irParaEtapa(pag, e);
    const camadas = await pag.evaluate(() => {
      const painel = document.querySelector('.rgal-painel[data-ativo="true"]');
      const ler = (sel) => {
        const el = painel.querySelector(sel);
        if (!el) throw new Error(`camada ausente: ${sel}`);
        const s = getComputedStyle(el);
        return {
          zIndex: s.zIndex,
          opacidade: +(+s.opacity).toFixed(3),
          ariaHidden: el.getAttribute('aria-hidden') !== null,
        };
      };
      return {
        fitas: ler('.rgal-fitas'),
        malha: ler('.rgal-malha'),
        malhaLuz: ler('.rgal-malha-luz'),
        base: ler('.rgal-base'),
        aro3: ler('.rgal-aro-3'),
        arteZ: getComputedStyle(painel.querySelector('.rgal-arte')).zIndex,
      };
    });
    const contraste =
      caixa.tinta === 'escura'
        ? {
            comFundoNovo: await comCamadas(pag, true, () => contrasteDoSelo(pag)),
            semFundoNovo: await comCamadas(pag, false, () => contrasteDoSelo(pag)),
          }
        : null;
    if (contraste) {
      contraste.deltaRazaoMedia = +(
        contraste.comFundoNovo.razaoMedia - contraste.semFundoNovo.razaoMedia
      ).toFixed(2);
      contraste.deltaRazaoPiorPixel = +(
        contraste.comFundoNovo.razaoPiorPixel - contraste.semFundoNovo.razaoPiorPixel
      ).toFixed(2);
    }
    etapas.push({ etapa: e, ...caixa, camadas, contraste });
    await pag.screenshot({
      path: `docs/capturas/rgal-fundo-etapa-${e}.png`,
      clip: { x: caixa.x, y: caixa.y, width: caixa.w, height: caixa.h },
    });
  }
  saida.etapas1440 = etapas;

  /* PORTÃO DE EFEITO — Δvalor por curso do ponteiro. Levo o cursor a 25% e a 75%
     da largura do painel, na mesma altura, e leio `--sx` e o pixel num ponto
     FIXO perto do destino: se a máscara anda, o pixel daquele ponto tem de
     clarear ao passar a ficar sob a luz. */
  const caixa = await irParaEtapa(pag, 1);
  const alvoX = Math.round(caixa.x + caixa.w * 0.72);
  const alvoY = Math.round(caixa.y + caixa.h * 0.42);
  const lerEstado = async () => {
    const sx = await pag.evaluate(() => {
      const el = document.querySelector('.rgal-painel[data-ativo="true"]');
      return {
        sx: el.style.getPropertyValue('--sx') || null,
        sy: el.style.getPropertyValue('--sy') || null,
      };
    });
    /* BLOCO de 64px, não um pixel: a malha tem passo de 44px e fio de 1px, então
       um ponto cai quase sempre entre as linhas e leria «não mudou nada» mesmo com
       a luz por cima. O que muda com o ponteiro é a média do bloco. */
    const buf = await pag.screenshot({
      clip: { x: alvoX - 32, y: alvoY - 32, width: 64, height: 64 },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    let n = 0;
    const soma = [0, 0, 0];
    let maisClaro = [0, 0, 0];
    for (let i = 0; i < data.length; i += info.channels) {
      const p = [data[i], data[i + 1], data[i + 2]];
      soma[0] += p[0];
      soma[1] += p[1];
      soma[2] += p[2];
      if (lum(p) > lum(maisClaro)) maisClaro = p;
      n++;
    }
    /* Dois números porque eles respondem a perguntas diferentes: a MÉDIA do bloco
       diz quanto o campo clareou (pouco, por construção — a malha cobre 2 de 44px
       em cada eixo), e o PIXEL MAIS CLARO diz quanto o fio da malha acendeu, que é
       o que o olho segue. Fundo é média; efeito é o fio. */
    return {
      ...sx,
      pixelMedio: soma.map((v) => +(v / n).toFixed(2)),
      pixelMaisClaro: maisClaro,
    };
  };
  await pag.mouse.move(Math.round(caixa.x + caixa.w * 0.25), alvoY);
  await pag.waitForTimeout(260);
  const longe = await lerEstado();
  await pag.mouse.move(alvoX, alvoY);
  await pag.waitForTimeout(260);
  const perto = await lerEstado();
  await pag.mouse.move(Math.round(caixa.x + caixa.w / 2), Math.round(caixa.y - 40));
  await pag.waitForTimeout(260);
  const saiu = await lerEstado();
  const cursoPx = alvoX - Math.round(caixa.x + caixa.w * 0.25);
  const ver = (e) => ({
    sx: e.sx,
    sy: e.sy,
    pixelMedio: e.pixelMedio.join(','),
    pixelMaisClaro: e.pixelMaisClaro.join(','),
    luminanciaMedia: +lum(e.pixelMedio).toFixed(4),
    luminanciaDoFio: +lum(e.pixelMaisClaro).toFixed(4),
  });
  saida.efeitoPonteiro1440 = {
    cursoDoPonteiroPx: cursoPx,
    longe: ver(longe),
    perto: ver(perto),
    deltaSx: +(Number(perto.sx) - Number(longe.sx)).toFixed(4),
    deltaLuminanciaMedia: +(lum(perto.pixelMedio) - lum(longe.pixelMedio)).toFixed(4),
    deltaLuminanciaDoFio: +(lum(perto.pixelMaisClaro) - lum(longe.pixelMaisClaro)).toFixed(4),
    deltaDoFioPor100px: +(
      ((lum(perto.pixelMaisClaro) - lum(longe.pixelMaisClaro)) / cursoPx) *
      100
    ).toFixed(5),
    razaoDoFioContraOCampo: +razao(perto.pixelMaisClaro, perto.pixelMedio).toFixed(2),
    aoSairVoltaAoCentro: saiu.sx === '0.5000' && saiu.sy === '0.5000',
    sxAoSair: saiu.sx,
  };
  await ctx.close();
}

/* ── Geometria em 768 e 390: nada transborda ───────────────────────────────── */
for (const largura of [768, 390]) {
  const { ctx, pag } = await abrir({ largura, altura: 844, escala: 2 });
  await pag.evaluate(() => {
    document.querySelector('.rgal-secao').scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await pag.waitForTimeout(900);
  const medirGeometria = () => pag.evaluate(() => {
    const doc = document.documentElement;
    const painel = document.querySelector('.rgal-painel');
    const janela = painel.querySelector('.rgal-janela');
    const b = janela.getBoundingClientRect();
    const camadas = ['.rgal-fitas', '.rgal-malha', '.rgal-malha-luz'].map((sel) => {
      const c = painel.querySelector(sel).getBoundingClientRect();
      /* No estado «sem fundo novo» a sonda desliga as camadas por `display:none`
         e o retângulo delas é 0×0 — comparar isso com a janela acusaria um
         transbordo que não existe. Nesse estado a resposta é `null`. */
      if (!c.width && !c.height) return { sel, transbordaAJanelaDeMascara: null };
      return {
        sel,
        transbordaAJanelaDeMascara:
          +(c.left < b.left - 0.5 || c.right > b.right + 0.5 || c.top < b.top - 0.5 || c.bottom > b.bottom + 0.5),
      };
    });
    return {
      transbordoHorizontalDaPagina: +(doc.scrollWidth - doc.clientWidth).toFixed(3),
      overflowDaJanela: getComputedStyle(janela).overflow,
      camadas,
    };
  });
  saida[`geometria${largura}`] = {
    comFundoNovo: await comCamadas(pag, true, medirGeometria),
    /* O transbordo desta rota em telas estreitas é ANTERIOR ao pedido (vem de
       outra seção). Medir nos dois estados é o que separa «já era» de «eu
       causei»: só o par de números autoriza a conclusão. */
    semFundoNovo: await comCamadas(pag, false, medirGeometria),
  };
  await ctx.close();
}

/* ── Movimento reduzido, os dois canais ───────────────────────────────────── */
for (const caso of [
  { nome: 'movimentoReduzido_consultaDeMidia', midia: true, motion: 'full' },
  { nome: 'movimentoReduzido_alternadorDoSite', midia: false, motion: 'reduce' },
]) {
  const { ctx, pag } = await abrir({ largura: 1440, midia: caso.midia, motion: caso.motion });
  await pag.evaluate(() => {
    document.querySelector('.rgal-secao').scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await pag.waitForTimeout(900);
  /* Passo o ponteiro por dentro de um painel: neste estado a máscara TEM de ficar
     no centro, venha o `--sx` de onde vier. */
  const cx = await pag.evaluate(() => {
    const b = document.querySelector('.rgal-painel').getBoundingClientRect();
    return [Math.round(b.x + b.width * 0.8), Math.round(b.y + b.height * 0.3)];
  });
  await pag.mouse.move(cx[0], cx[1]);
  await pag.waitForTimeout(300);
  saida[caso.nome] = await pag.evaluate(() => {
    const painéis = [...document.querySelectorAll('.rgal-painel')];
    const camadas = painéis.flatMap((p) =>
      ['.rgal-fitas', '.rgal-malha', '.rgal-malha-luz'].map((sel) => {
        const s = getComputedStyle(p.querySelector(sel));
        return { sel, opacidade: +(+s.opacity).toFixed(3), duracao: s.transitionDuration };
      }),
    );
    const luz = getComputedStyle(painéis[0].querySelector('.rgal-malha-luz'));
    return {
      paineis: painéis.length,
      nenhumPresoInvisivel: camadas.every((c) => c.opacidade > 0),
      opacidadesDistintas: [...new Set(camadas.map((c) => c.opacidade))].sort(),
      duracoesDistintas: [...new Set(camadas.map((c) => c.duracao))],
      sxNaCamadaDeLuz: luz.getPropertyValue('--sx'),
      syNaCamadaDeLuz: luz.getPropertyValue('--sy'),
      mascaraNoCentro:
        Number(luz.getPropertyValue('--sx')) === 0.5 && Number(luz.getPropertyValue('--sy')) === 0.5,
      sxHerdadoNoPainel: painéis[0].style.getPropertyValue('--sx') || null,
    };
  });
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(
  'docs/medidas/fundo-galeria-reconhecimentos.json',
  JSON.stringify(saida, null, 2) + '\n',
);
console.log(JSON.stringify(saida, null, 2));
