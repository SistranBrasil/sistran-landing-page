/**
 * SIS-204 — mede a seção «Consultoria» de `/solucoes` contra `docs/consultoria.md`.
 *
 * A entrega anterior desta issue foi PERDIDA e só o resultado dela sobrou em
 * `docs/medidas/sis204-consultoria.json`. Esta sonda existe para responder duas
 * perguntas com número, e não de cabeça:
 *
 *   1. a geometria que o documento prescreve está no DOM renderizado? (container de
 *      1440 com padding de 72–96px no desktop, carimbo de 340/280/240px, título em
 *      clamp(64,6vw,100) / 68 / clamp(48,15vw,64), foto em 16/9 no desktop e 4/3 no
 *      telefone, frentes em 2 colunas no desktop e 1 no telefone, ícone de 64/52px);
 *   2. o «depois» bate com o número da entrega perdida? O arquivo gravado por aqui
 *      é `-regravado`, e NÃO o original — comparar exige os dois no disco.
 *
 * Mede também o que o documento põe como acabamento e que não se vê na captura:
 * a cor de fundo computada da seção (tem de ser `#EFF8FE`), o contraste do título
 * de cada frente e do parágrafo contra esse fundo, e transbordo horizontal.
 *
 * Uso: node scripts/medir-consultoria-sis204.mjs [sufixo]   (padrão: regravado)
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const ROTA = '/solucoes';
const SUFIXO = process.argv[2] ?? 'regravado';
const SAIDA = `docs/medidas/sis204-consultoria-${SUFIXO}.json`;
/* 1536 e 1920 entram só pelo corredor do `ScrollSpy` (ver `consultoria.css`): a
   colisão medida vive na faixa de 1440 a ~1712, e é ali que o padding esquerdo se
   afasta do documento. As três primeiras larguras são as da entrega perdida, para o
   «depois» poder ser comparado com ela. */
const LARGURAS = [390, 768, 1440, 1536, 1920];

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

/* Contraste WCAG a partir de `rgb(...)` computado — a seção é toda opaca, então não
   há alfa para compor. */
function luminancia([r, g, b]) {
  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function razao(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return Number(((x + 0.05) / (y + 0.05)).toFixed(2));
}

const resultado = {};

for (const largura of LARGURAS) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 1000 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pagina = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR). */
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded' });
  await pagina.waitForSelector('[data-route-liberado="true"]', { timeout: 120000 });
  await pagina.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* Rolar até a seção e esperar o reveal acender: com `data-in="false"` os nós estão
     deslocados em 16px, e medir ali leria a posição da ENTRADA, não a do repouso. */
  await pagina.locator('#consultoria').scrollIntoViewIfNeeded();
  await pagina.waitForTimeout(1200);

  const medida = await pagina.evaluate((cor) => {
    const caixa = (sel) => {
      const no = document.querySelector(sel);
      if (!no) return null;
      const r = no.getBoundingClientRect();
      return {
        x: Number(r.x.toFixed(1)),
        y: Number((r.y + window.scrollY).toFixed(1)),
        w: Number(r.width.toFixed(1)),
        h: Number(r.height.toFixed(1)),
      };
    };
    const secao = document.querySelector('#consultoria');
    const conteudo = document.querySelector('.consultoria-conteudo');
    const frentes = [...document.querySelectorAll('.consultoria-frente')];
    const estiloSecao = getComputedStyle(secao);
    const estiloTitulo = getComputedStyle(document.querySelector('.consultoria-titulo'));
    const estiloFrenteTitulo = getComputedStyle(
      document.querySelector('.consultoria-frente-titulo'),
    );
    const estiloParagrafo = getComputedStyle(document.querySelector('.consultoria-paragrafo'));
    const estiloDivisor = getComputedStyle(document.querySelector('.consultoria-divisor-linha'));
    const estiloIcone = getComputedStyle(document.querySelector('.consultoria-frente-icone'));
    const estiloSelo = getComputedStyle(document.querySelector('.consultoria-selo'));

    /* Colunas da grade das frentes: contar os `x` distintos é mais honesto que ler
       `grid-template-columns`, porque é o que o olho vê. */
    const colunas = new Set(frentes.map((n) => Math.round(n.getBoundingClientRect().x))).size;
    const foto = caixa('.consultoria-foto');
    const texto = caixa('.consultoria-texto');
    const selo = caixa('.consultoria-selo');

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      documentScrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      section: caixa('#consultoria'),
      fundoSecao: estiloSecao.backgroundColor,
      paddingConteudo: getComputedStyle(conteudo).padding,
      larguraConteudo: Number(conteudo.getBoundingClientRect().width.toFixed(1)),
      title: caixa('.consultoria-titulo'),
      titleFont: estiloTitulo.fontSize,
      titlePeso: estiloTitulo.fontWeight,
      /* `background-clip: text` com `color: transparent` — o gradiente é o que pinta
         as letras, então o que se confere é o recorte e as três paradas. */
      titleClip: estiloTitulo.webkitBackgroundClip || estiloTitulo.backgroundClip,
      titleCor: estiloTitulo.color,
      titleGradiente: estiloTitulo.backgroundImage,
      stamp: caixa('.consultoria-carimbo'),
      photo: foto,
      photoRazao: foto ? Number((foto.w / foto.h).toFixed(3)) : null,
      photoRaio: getComputedStyle(document.querySelector('.consultoria-foto')).borderRadius,
      photoSrc: document.querySelector('.consultoria-foto-img')?.getAttribute('src'),
      photoAlt: document.querySelector('.consultoria-foto-img')?.getAttribute('alt'),
      selo,
      /* Quanto da cápsula fica ABAIXO da borda inferior da foto (o «parcialmente
         sobreposto à borda inferior» do documento). */
      seloSangraPx: selo && foto ? Number((selo.y + selo.h - (foto.y + foto.h)).toFixed(1)) : null,
      seloAltura: estiloSelo.height,
      seloFundo: estiloSelo.backgroundColor,
      copyBeforePhoto: texto && foto ? texto.y < foto.y || texto.x < foto.x : null,
      areaCount: frentes.length,
      areaColumns: colunas,
      icon: caixa('.consultoria-frente-icone'),
      iconBorda: estiloIcone.border,
      iconCor: estiloIcone.color,
      /* Nenhum card: as frentes não podem ter fundo pintado, borda nem sombra. */
      frenteFundo: [...new Set(frentes.map((n) => getComputedStyle(n).backgroundColor))],
      frenteBorda: [...new Set(frentes.map((n) => getComputedStyle(n).borderStyle))],
      frenteSombra: [...new Set(frentes.map((n) => getComputedStyle(n).boxShadow))],
      divisorTitulo: document.querySelector('.consultoria-divisor-titulo')?.textContent,
      divisorLinha: {
        altura: estiloDivisor.height,
        cor: estiloDivisor.backgroundColor,
        w: caixa('.consultoria-divisor-linha')?.w,
      },
      frenteTituloCor: estiloFrenteTitulo.color,
      frenteTituloTamanho: estiloFrenteTitulo.fontSize,
      paragrafoCor: estiloParagrafo.color,
      paragrafoTamanho: estiloParagrafo.fontSize,
      paragrafoMedida: estiloParagrafo.maxWidth,
      intro: caixa('.consultoria-topo'),
      textosVerbatim: [...document.querySelectorAll('.consultoria-paragrafo')].map((n) =>
        n.textContent.replace(/\s+/g, ' ').trim(),
      ),
      frentesTitulos: [...document.querySelectorAll('.consultoria-frente-titulo')].map((n) =>
        n.textContent.trim(),
      ),
      /* Proibições do documento, conferidas no DOM e não na intenção: nenhum ordinal
         e nenhuma paginação sobraram do layout anterior. */
      ordinais: /\b0[1-4]\s*\/\s*0[1-4]\b/.test(secao.textContent),
      /* O CORREDOR DO ScrollSpy. A tinta sai de um `Range` e não da caixa do
         `<span>`: o `letter-spacing` deixa um rastro no fim da caixa que não é
         letra, e medir a caixa inventaria alguns pixels de invasão. Só os rótulos
         com opacidade em repouso contam — abaixo de 1440 o do ativo é apagado. */
      scrollspy: (() => {
        const visiveis = [...document.querySelectorAll('.scrollspy-rotulo')].filter(
          (n) => Number(getComputedStyle(n).opacity) > 0.5,
        );
        const tintaFim = visiveis.reduce((max, n) => {
          const faixa = document.createRange();
          faixa.selectNodeContents(n);
          return Math.max(max, faixa.getBoundingClientRect().right);
        }, 0);
        const conteudoX = conteudo.getBoundingClientRect().x + parseFloat(
          getComputedStyle(conteudo).paddingLeft,
        );
        return {
          rotulosPintados: visiveis.map((n) => n.textContent),
          tintaFim: Number(tintaFim.toFixed(2)),
          conteudoComecaEm: Number(conteudoX.toFixed(2)),
          folga: Number((conteudoX - tintaFim).toFixed(2)),
        };
      })(),
      cor,
    };
  }, null);

  const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);
  medida.contraste = {
    tituloFrenteSobreFundo: razao(rgb(medida.frenteTituloCor), rgb(medida.fundoSecao)),
    paragrafoSobreFundo: razao(rgb(medida.paragrafoCor), rgb(medida.fundoSecao)),
  };
  delete medida.cor;

  resultado[String(largura)] = medida;
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(`gravado ${SAIDA}`);
for (const [largura, m] of Object.entries(resultado)) {
  console.log(
    largura,
    'fundo',
    m.fundoSecao,
    '| titulo',
    m.titleFont,
    '| carimbo',
    m.stamp?.w,
    '| foto',
    m.photo?.w,
    m.photoRazao,
    '| colunas',
    m.areaColumns,
    '| icone',
    m.icon?.w,
    '| overflow',
    m.overflow,
    '| contraste',
    JSON.stringify(m.contraste),
    '| spy',
    JSON.stringify(m.scrollspy),
  );
}
