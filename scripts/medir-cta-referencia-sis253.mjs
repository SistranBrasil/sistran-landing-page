/**
 * SIS-253 — sonda de aceite do «Fale com a Gente!» de `/esg` no desenho de
 * `public/imagensexemplo/falecomagente.png`. Uma medida por linha do aceite:
 *
 *   1. composição: cartão de vidro, fio com o nó, arte (blob/selo/órbitas/balões)
 *      e botão com o círculo ciano em quadro — e o botão NÃO enterrado sob o blob
 *      (`elementFromPoint` no centro dele);
 *   2. o ponto PERCORRE o fio ao entrar em quadro: lido no nó antes de a seção
 *      entrar, lido no centro do círculo ciano depois — com o erro de pouso em px;
 *   3. hover: `transform` do botão e do brilho do círculo, em repouso e durante;
 *   4. movimento reduzido pelas DUAS vias (`reducedMotion` do sistema e
 *      `sistran-motion-preference=reduce`): ponto já no fim sem percurso, hover
 *      sem deslocamento nem giro, bloco legível;
 *   5. contraste do texto escuro sobre o vidro pela regra do par de
 *      `docs/medidas/COMO-MEDIR-CONTRASTE.md`, com a implementação madura da
 *      SIS-252: quatro fotos por alvo (fundo/branco/preto/tinta), máscara de
 *      letra por limiar RELATIVO, `pior` (franja inclusa) ao lado e `miolo`
 *      (cobertura cheia) como veredito;
 *   6. as outras rotas com `ContactCTA` intactas: o cartão navy continua lá e
 *      nenhum `.cta-ref-*` aparece;
 *   7. o modal de contato de `/esg` continua abrindo.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-cta-referencia-sis253.mjs
 */
import { chromium } from 'playwright';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(CAPTURAS, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

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
const rgb = (p) => (p ? `rgb(${p.r},${p.g},${p.b})` : '—');
const n2 = (v) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 100) / 100);

const ler = async (p) =>
  sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const navegador = await chromium.launch();
const relatorio = { quando: new Date().toISOString() };

const ESCONDER = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
                  header.fixed{display:none!important}`;

async function abrir({
  rota = '/esg',
  largura = 1440,
  altura = 900,
  motion = 'system',
  reduceSO = false,
}) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: reduceSO ? 'reduce' : 'no-preference',
  });
  /* Preferência semeada ANTES do primeiro pintar: o diálogo «Preferências de
     movimento» monta depois e prende a rolagem, cobrindo o alvo. */
  await contexto.addInitScript(
    ([m]) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      localStorage.setItem('sistran-motion-preference', m);
    },
    [motion],
  );
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await pagina.addStyleTag({ content: ESCONDER });
  return { contexto, pagina };
}

/** Traz a seção do CTA para o quadro e espera o assentamento (item 6 do método).
    Sem `scrollIntoView`: a rota usa Lenis, que intercepta o método (SIS-151). */
async function enquadrar(pagina, seletor = '.cta-ref') {
  await pagina.waitForSelector(seletor, { timeout: 240_000 });
  await pagina.evaluate(() => document.fonts.ready);
  /* A ROLAGEM É TENTADA ATÉ PEGAR, e não uma vez só. Medido na primeira passada:
     nas janelas de movimento reduzido e em 390 o alvo saiu com `emQuadro: false` e
     `elementFromPoint` nulo — um único `scrollTo` disparado antes de a rota
     hidratar não sobrevive (a página ainda cresce, e o Lenis assume o eixo depois).
     Cada volta remede a caixa e para quando o cartão está de fato no quadro. */
  const alvo = '.cta-ref-cartao';
  for (let volta = 0; volta < 8; volta += 1) {
    const dentro = await pagina.evaluate(
      ([s, a]) => {
        const el = document.querySelector(a) ?? document.querySelector(s);
        const r = el.getBoundingClientRect();
        const folga = Math.max(0, (innerHeight - r.height) / 2);
        if (r.top > 8 || r.bottom > innerHeight) {
          window.scrollTo({ top: Math.max(0, window.scrollY + r.top - folga), behavior: 'instant' });
          return false;
        }
        return r.top >= 0 && r.bottom <= innerHeight;
      },
      [seletor, alvo],
    );
    if (dentro) break;
    await pagina.waitForTimeout(500);
  }
  /* Assentamento antes de qualquer leitura (item 6 do método de contraste). */
  await pagina.waitForTimeout(3500);
}

/**
 * Leitura da geometria. O ponto é um `<circle>` deslocado por `transform` do
 * GSAP, e `getBoundingClientRect()` de elemento SVG já devolve a caixa DEPOIS do
 * transform — o centro sai da caixa, sem reconstruir matriz como na SIS-221 (lá o
 * alvo era pseudo-elemento, que não tem caixa).
 */
function leitura() {
  const q = (s) => document.querySelector(s);
  const caixa = (alvo) => {
    const el = typeof alvo === 'string' ? q(alvo) : alvo;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      largura: Math.round(r.width),
      altura: Math.round(r.height),
      centro: { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) },
      emQuadro: r.top < innerHeight && r.bottom > 0,
    };
  };
  const botao = q('.cta-ref-botao');
  const circulo = q('.cta-ref-botao-circulo');
  const ponto = q('.cta-ref-fio-ponto');
  const no = q('.cta-ref-fio-no');
  const cCirculo = circulo ? caixa(circulo).centro : null;
  const cPonto = ponto ? caixa(ponto).centro : null;
  const cNo = no ? caixa(no).centro : null;
  const cCartao = caixa('.cta-ref-cartao');
  const cTitulo = caixa('.cta-ref-titulo');
  const cFio = caixa('.cta-ref-fio');
  return {
    cartao: cCartao,
    titulo: cTitulo,
    texto: caixa('.cta-ref-texto'),
    fio: cFio,
    no: no ? caixa(no) : null,
    ponto: ponto ? caixa(ponto) : null,
    botao: botao ? caixa(botao) : null,
    circulo: circulo ? caixa(circulo) : null,
    arte: caixa('.cta-ref-arte'),
    selo: caixa('.cta-ref-selo'),
    blob: caixa('.cta-ref-blob'),
    orbitas: document.querySelectorAll('.cta-ref-orbita').length,
    baloes: document.querySelectorAll('.cta-ref-balao').length,
    /* O nó fica na ponta ESQUERDA e o ponto pousa à direita: é a leitura de "o fio
       vai do nó até o botão". */
    noNaEsquerda: cNo && cPonto ? cNo.x < cPonto.x : null,
    pontoOpacidade: ponto ? getComputedStyle(ponto).opacity : null,
    /* ERRO DE POUSO: distância do centro do ponto ao centro do círculo ciano. */
    erroDePouso:
      cPonto && cCirculo
        ? {
            dx: cPonto.x - cCirculo.x,
            dy: cPonto.y - cCirculo.y,
            px: Math.round(Math.hypot(cPonto.x - cCirculo.x, cPonto.y - cCirculo.y) * 10) / 10,
          }
        : null,
    distanciaDoNo:
      cPonto && cNo
        ? Math.round(Math.hypot(cPonto.x - cNo.x, cPonto.y - cNo.y))
        : null,
    /* O botão não pode estar enterrado sob o blob. */
    quemEstaNoBotao: (() => {
      if (!botao) return null;
      const c = caixa(botao).centro;
      const alvo = document.elementFromPoint(c.x, c.y);
      return alvo
        ? { tag: alvo.tagName, classe: alvo.className?.toString?.() ?? '', dentroDoBotao: botao.contains(alvo) }
        : null;
    })(),
    /* O trecho horizontal do fio passa ACIMA do título. */
    fioAcimaDoTituloPx: cFio && cTitulo ? Math.round(cTitulo.y - cFio.y) : null,
    transformBotao: botao ? getComputedStyle(botao).transform : null,
    transformBrilho: circulo ? getComputedStyle(circulo, '::before').transform : null,
    transicaoBotao: botao ? getComputedStyle(botao).transitionDuration : null,
  };
}

/* ── 1440 · percurso, composição, hover, quadro do percurso, modal ─────────── */
{
  const { contexto, pagina } = await abrir({});
  await pagina.waitForSelector('.cta-ref', { timeout: 240_000 });

  /* O PERCURSO. Com a seção ainda ABAIXO da dobra o ScrollTrigger não disparou e o
     ponto está estacionado no nó, apagado. É essa leitura que separa "percorre" de
     "nasce no fim". */
  await pagina.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await pagina.waitForTimeout(2500);
  const antes = await pagina.evaluate(leitura);

  await enquadrar(pagina);
  const depois = await pagina.evaluate(leitura);

  relatorio['1440-percurso'] = {
    pontoAntesDeEntrar: antes.ponto?.centro,
    noAntesDeEntrar: antes.no?.centro,
    distanciaDoNoAntes: antes.distanciaDoNo,
    opacidadeDoPontoAntes: antes.pontoOpacidade,
    pontoDepoisDeEntrar: depois.ponto?.centro,
    centroDoCirculo: depois.circulo?.centro,
    erroDePousoPx: depois.erroDePouso,
    opacidadeDoPontoDepois: depois.pontoOpacidade,
    distanciaDoNoDepois: depois.distanciaDoNo,
  };

  relatorio['1440-composicao'] = {
    cartao: depois.cartao,
    titulo: depois.titulo,
    texto: depois.texto,
    fio: depois.fio,
    noNaEsquerda: depois.noNaEsquerda,
    fioAcimaDoTituloPx: depois.fioAcimaDoTituloPx,
    botao: depois.botao,
    circulo: depois.circulo,
    arte: depois.arte,
    blob: depois.blob,
    selo: depois.selo,
    orbitas: depois.orbitas,
    baloes: depois.baloes,
    quemEstaNoBotao: depois.quemEstaNoBotao,
  };

  await pagina.screenshot({ path: `${CAPTURAS}/sis253-depois-1440-repouso.png` });

  /* HOVER: os dois movimentos pedidos, na tinta resolvida. */
  const semHover = await pagina.evaluate(leitura);
  await pagina.locator('.cta-ref-botao').hover();
  await pagina.waitForTimeout(1400);
  const comHover = await pagina.evaluate(leitura);
  relatorio['1440-hover'] = {
    transicaoBotao: semHover.transicaoBotao,
    transformBotaoRepouso: semHover.transformBotao,
    transformBotaoHover: comHover.transformBotao,
    avancoDoBotaoPx: (comHover.botao?.x ?? 0) - (semHover.botao?.x ?? 0),
    transformBrilhoRepouso: semHover.transformBrilho,
    transformBrilhoHover: comHover.transformBrilho,
  };
  await pagina.screenshot({ path: `${CAPTURAS}/sis253-depois-1440-hover.png` });

  /* Uma foto NO MEIO do percurso: recarrega, enquadra e fotografa antes de ele
     terminar (o percurso dura 1,6s). */
  await pagina.reload({ waitUntil: 'domcontentloaded' });
  await pagina.addStyleTag({ content: ESCONDER });
  await pagina.waitForSelector('.cta-ref-cartao', { timeout: 240_000 });
  /* Duas etapas, porque o gatilho é `top 78%`: primeiro o cartão é levado para
     LOGO ABAIXO da linha (com voltas, pela mesma razão do `enquadrar`), e só então
     um empurrão o cruza. A foto sai 700ms depois, com o percurso (1,6s) em curso. */
  for (let volta = 0; volta < 8; volta += 1) {
    const posto = await pagina.evaluate(() => {
      const r = document.querySelector('.cta-ref-cartao').getBoundingClientRect();
      const desejado = innerHeight * 0.85;
      if (Math.abs(r.top - desejado) < 12) return true;
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - desejado), behavior: 'instant' });
      return false;
    });
    if (posto) break;
    await pagina.waitForTimeout(400);
  }
  await pagina.waitForTimeout(600);
  await pagina.evaluate(() => window.scrollBy({ top: 220, behavior: 'instant' }));
  await pagina.waitForTimeout(700);
  const meio = await pagina.evaluate(leitura);
  relatorio['1440-quadro-do-percurso'] = {
    pontoNoQuadro: meio.ponto?.centro,
    centroDoCirculo: meio.circulo?.centro,
    erroDePousoPx: meio.erroDePouso,
    aindaNaoChegou: meio.erroDePouso ? meio.erroDePouso.px > 12 : null,
  };
  await pagina.screenshot({ path: `${CAPTURAS}/sis253-depois-1440-percurso.png` });

  /* O MODAL continua abrindo (item 4 da SIS-142, que esta issue manda preservar). */
  await enquadrar(pagina);
  await pagina.locator('.cta-ref-botao').click();
  await pagina.waitForTimeout(900);
  /* `dialog.contact-dialog`, e não `dialog`: a rota tem OUTRO `<dialog>` (o de
     preferências de movimento), e a primeira passada leu esse — devolveu
     «existe, fechado, sem formulário», que não é o painel de contato. O
     `ContactModal` só entra no DOM quando abre (`if (!montado || !open) return
     null`), então a própria presença do seletor já é a prova. */
  relatorio['1440-modal'] = await pagina.evaluate(() => {
    const d = document.querySelector('dialog.contact-dialog');
    return {
      painelDeContatoNoDom: !!d,
      aberto: d?.open ?? null,
      temFormulario: !!d?.querySelector('form'),
      quantosDialogosNaRota: document.querySelectorAll('dialog').length,
    };
  });

  await contexto.close();
}

/* ── 1440 · contraste do texto escuro sobre o vidro ────────────────────────────
   As duas tintas são OPACAS (`#0a1f44` no título, `#3c5a7a` no parágrafo), então
   não há alfa a compor — mas o FUNDO é translúcido (`backdrop-filter` sobre o
   degradê da seção), e é por isso que ele precisa ser amostrado do raster com a
   tinta apagada, e não presumido do CSS. */
{
  const { contexto, pagina } = await abrir({});
  await enquadrar(pagina);

  /* Apaga/pinta a tinta do CARTÃO INTEIRO, não a do alvo: ocultar só o medido
     deixa o irmão desenhado dentro do mesmo retângulo (armadilha 1). */
  const pintar = async (cor) => {
    await pagina.evaluate((c) => {
      document.querySelector('#sis253-tinta')?.remove();
      if (!c) return;
      const st = document.createElement('style');
      st.id = 'sis253-tinta';
      st.textContent = `.cta-ref-cartao h2, .cta-ref-cartao p {
        color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
      document.head.append(st);
    }, cor);
    await pagina.waitForTimeout(150);
  };

  const alvos = [
    { nome: 'titulo', seletor: '.cta-ref-titulo', piso: 3.0, nota: '49px display a 1440 = texto grande' },
    { nome: 'paragrafo', seletor: '.cta-ref-texto', piso: 4.5, nota: '16px = texto normal' },
  ];
  relatorio['1440-contraste'] = {};

  for (const alvo of alvos) {
    /* O alvo é trazido para o MEIO da janela antes de o recorte ser calculado, e a
       caixa é aparada na janela: `clip` é em coordenadas de janela (item 4 do
       método) e o Playwright falha com "Clipped area is either empty or outside the
       resulting image" se um pixel escapar — foi o que aconteceu na primeira
       passada, porque a seção é mais alta que 900 e centrá-la deixava o parágrafo
       abaixo da dobra. */
    const caixa = await pagina.locator(alvo.seletor).evaluate((e) => {
      const r0 = e.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r0.top - innerHeight / 2, behavior: 'instant' });
      const r = e.getBoundingClientRect();
      const x = Math.max(0, Math.round(r.x));
      const y = Math.max(0, Math.round(r.y));
      return {
        x,
        y,
        width: Math.min(Math.round(r.width), innerWidth - x),
        height: Math.min(Math.round(r.height), innerHeight - y),
      };
    });
    await pagina.waitForTimeout(1200);
    const tintaDeclarada = await pagina.locator(alvo.seletor).evaluate((e) => getComputedStyle(e).color);
    const base = `${CAPTURAS}/tmp-sis253-${alvo.nome}`;
    /* `page.screenshot({ clip })` e nunca `locator.screenshot()`: o segundo chama
       `scrollIntoViewIfNeeded` e as quatro fotos sairiam de posições diferentes,
       quebrando a máscara pixel a pixel (medido na SIS-252). */
    const foto = async (cor, sufixo) => {
      await pintar(cor);
      await pagina.screenshot({ path: `${base}-${sufixo}.png`, clip: caixa });
    };
    await foto('transparent', 'fundo');
    await foto('#fff', 'branco');
    await foto('#000', 'preto');
    await pintar(null);
    await pagina.screenshot({ path: `${base}-tinta.png`, clip: caixa });

    const fundo = await ler(`${base}-fundo.png`);
    const branco = await ler(`${base}-branco.png`);
    const preto = await ler(`${base}-preto.png`);
    const real = await ler(`${base}-tinta.png`);
    const { width, height, channels } = fundo.info;

    /* LIMIAR RELATIVO da máscara (SIS-252): o mais cheio que existe no recorte
       define o miolo (92%) e a franja (50%). Limiar fixo devolve «sem pixel cheio»
       quando o alvo é composto numa camada reamostrada. */
    let difMax = 0;
    for (let k = 0; k < width * height * channels; k += channels) {
      const d = Math.min(
        branco.data[k] - preto.data[k],
        branco.data[k + 1] - preto.data[k + 1],
        branco.data[k + 2] - preto.data[k + 2],
      );
      if (d > difMax) difMax = d;
    }
    const limiarMiolo = Math.max(200, Math.round(difMax * 0.92));
    const limiarFranja = Math.max(60, Math.round(difMax * 0.5));

    let pior = { razao: Infinity };
    let miolo = { razao: Infinity };
    let nFranja = 0;
    let nMiolo = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const k = (y * width + x) * channels;
        const dif = Math.min(
          branco.data[k] - preto.data[k],
          branco.data[k + 1] - preto.data[k + 1],
          branco.data[k + 2] - preto.data[k + 2],
        );
        if (dif < limiarFranja) continue;
        nFranja += 1;
        const bg = { r: fundo.data[k], g: fundo.data[k + 1], b: fundo.data[k + 2] };
        const tinta = { r: real.data[k], g: real.data[k + 1], b: real.data[k + 2] };
        const r = razao(tinta, bg);
        if (r < pior.razao) pior = { razao: r, bg, tinta, x, y };
        if (dif >= limiarMiolo) {
          nMiolo += 1;
          if (r < miolo.razao) miolo = { razao: r, bg, tinta, x, y };
        }
      }
    }
    for (const s of ['fundo', 'branco', 'preto', 'tinta']) await unlink(`${base}-${s}.png`);

    const vereditoRazao = Number.isFinite(miolo.razao) ? miolo.razao : pior.razao;
    relatorio['1440-contraste'][alvo.nome] = {
      nota: alvo.nota,
      piso: alvo.piso,
      tintaDeclarada,
      recorte: caixa,
      ocultado: 'toda a tinta de h2 e p dentro de .cta-ref-cartao',
      raster: { razao: n2(pior.razao), tinta: rgb(pior.tinta), fundo: rgb(pior.bg), pixels: nFranja },
      calculada: { razao: n2(vereditoRazao), tinta: rgb(miolo.tinta), fundo: rgb(miolo.bg), pixels: nMiolo },
      delta: n2(vereditoRazao - pior.razao),
      passa: vereditoRazao >= alvo.piso,
    };
  }
  await contexto.close();
}

/* ── movimento reduzido, pelas DUAS vias ──────────────────────────────────── */
for (const via of ['sistema', 'interruptor']) {
  const { contexto, pagina } = await abrir({
    reduceSO: via === 'sistema',
    motion: via === 'interruptor' ? 'reduce' : 'system',
  });
  await enquadrar(pagina);
  const parado = await pagina.evaluate(leitura);
  await pagina.locator('.cta-ref-botao').hover();
  await pagina.waitForTimeout(1200);
  const comHover = await pagina.evaluate(leitura);
  relatorio[`1440-reduce-${via}`] = {
    /* Sem percurso: o ponto já está pousado no círculo e visível. */
    erroDePousoPx: parado.erroDePouso,
    opacidadeDoPonto: parado.pontoOpacidade,
    transicaoBotao: parado.transicaoBotao,
    /* Sem deslocamento e sem giro no hover. O `transform` do botão NÃO é `none`
       aqui e não deve ser: no desktop ele carrega a centralização na meia-altura
       do cartão (`translateY(-50%)`). O que prova que o avanço está desligado é a
       IGUALDADE entre repouso e hover, mais o `avancoDoBotaoPx` em zero. */
    transformBotaoRepouso: parado.transformBotao,
    transformBotaoHover: comHover.transformBotao,
    transformBrilhoHover: comHover.transformBrilho,
    avancoDoBotaoPx: (comHover.botao?.x ?? 0) - (parado.botao?.x ?? 0),
    /* E o bloco continua legível. */
    tituloEmQuadro: parado.titulo?.emQuadro,
    textoEmQuadro: parado.texto?.emQuadro,
    botaoEmQuadro: parado.botao?.emQuadro,
  };
  if (via === 'sistema') {
    await pagina.screenshot({ path: `${CAPTURAS}/sis253-depois-1440-reduce.png` });
  }
  await contexto.close();
}

/* ── 390 · o mesmo bloco na largura estreita ───────────────────────────────── */
{
  const { contexto, pagina } = await abrir({ largura: 390, altura: 844 });
  await enquadrar(pagina);
  const m = await pagina.evaluate(leitura);
  relatorio['390'] = {
    cartao: m.cartao,
    fioAcimaDoTituloPx: m.fioAcimaDoTituloPx,
    botao: m.botao,
    arte: m.arte,
    quemEstaNoBotao: m.quemEstaNoBotao,
    /* Em 390 o botão fica em fluxo, então o pouso não é critério — o que importa é
       o fio existir e o botão ser alcançável. */
    erroDePousoPx: m.erroDePouso,
    pontoOpacidade: m.pontoOpacidade,
  };
  await pagina.screenshot({ path: `${CAPTURAS}/sis253-depois-390.png` });
  await contexto.close();
}

/* ── as outras rotas com ContactCTA, intactas ──────────────────────────────── */
for (const rota of ['/solucoes', '/quem-somos', '/blog']) {
  const { contexto, pagina } = await abrir({ rota });
  await pagina.waitForTimeout(3500);
  relatorio[`intacta${rota.replace(/\//g, '-')}`] = await pagina.evaluate(() => {
    const h2 = [...document.querySelectorAll('h2')].find((e) =>
      e.textContent.includes('Fale com a Gente'),
    );
    const cartao = h2?.closest('div.rounded-3xl');
    return {
      temLayoutReferencia: !!document.querySelector('.cta-ref'),
      temCartaoNavy: !!cartao,
      fundoDoCartao: cartao ? getComputedStyle(cartao).backgroundImage.slice(0, 72) : null,
      corDoTitulo: h2 ? getComputedStyle(h2).color : null,
      botaoEhLink: !!h2?.closest('section')?.querySelector('a.cta-entrada-b'),
    };
  });
  await contexto.close();
}

await navegador.close();
const saida = `${MEDIDAS}/cta-referencia-sis253.json`;
await writeFile(saida, JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\nmedidas em ${saida}`);
