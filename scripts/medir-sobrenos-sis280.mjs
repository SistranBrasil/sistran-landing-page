/**
 * SIS-280 — portões medidos da seção «Sobre nós / A Sistran» de `/quem-somos`.
 *
 * O que ele mede, e por que cada um existe:
 *
 * · `corredorDoIndicador` — o `ScrollSpy` é `fixed` na JANELA e de 1440px para cima
 *   pinta o rótulo ativo em repouso. Esta seção sangra na janela, então ela paga o
 *   mesmo preço que a SIS-268 mediu em `/solucoes`: sem piso de recuo à esquerda o
 *   rótulo cai sobre o carimbo. O escopo é `nav.fixed.left-3` e NÃO
 *   `nav[aria-label] a[href^="#"]` — o segundo casa outro nav, onde o ScrollSpy nem
 *   monta, e foi o que deu folgas negativas absurdas na SIS-268.
 * · `colunas` — a razão 52/48 do documento, medida depois de o `gap` sair da conta,
 *   e o transbordo da grade para a direita.
 * · `carimbo` — ele tem de SOBREPOR a fotografia («parcialmente sobre a parte
 *   superior esquerda»). Área de interseção > 0 é o portão; a área também é
 *   relatada para não passar por um pixel.
 * · `faixaNavy` — sangra na janela: `left === 0` e largura igual à da janela.
 * · `assinatura` — os sete números de `docs/fonte2.md`, lidos do computado.
 * · `cards` — a issue proíbe cards nesta seção: a contagem tem de ser ZERO.
 * · `contrastes` — pela receita da casa: cor do texto pelo computado, fundo pelo
 *   PIXEL da captura 9px à esquerda do glifo (média de um bloco de 5px), porque o
 *   fundo é degradê e não há cor sólida para ler do CSS.
 * · `movimentoReduzido` — os DOIS canais, e o portão é o traço ciano nascer
 *   DESENHADO (`stroke-dashoffset: 0`): parado no valor inicial ele seria invisível
 *   para sempre.
 *
 * `fullPage` não serve aqui — camadas ancoradas na janela não pintam nela. As
 * capturas rolam cada faixa para dentro do quadro e fotografam o quadro.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-sobrenos-sis280.mjs antes|depois
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const FASE = process.argv[2] ?? 'depois';
const PASTA = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(PASTA, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const LARGURAS = [
  { nome: '1440', width: 1440, height: 960 },
  { nome: '1024', width: 1024, height: 900 },
  { nome: '390', width: 390, height: 844 },
];

const LER = () => {
  const num = (v) => (v === null || v === undefined ? null : Math.round(v * 100) / 100);
  const secao = document.querySelector('#quem-somos');
  if (!secao) return { secaoMontada: false };
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const rc = (el) => {
    const b = r(el);
    return b
      ? { x: num(b.x), y: num(b.y), w: num(b.width), h: num(b.height), right: num(b.right) }
      : null;
  };

  /* O CORREDOR DO INDICADOR. Nós com `opacity < 0.05` ou `visibility: hidden` não
     pintam e não colidem — o rótulo inativo é justamente isso. */
  const nav = document.querySelector('nav.fixed.left-3');
  let corredor = { navMontado: false };
  if (nav) {
    let tinta = 0;
    let peca = null;
    let ativo = null;
    nav.querySelectorAll('a, a > *').forEach((no) => {
      const cs = getComputedStyle(no);
      if (Number(cs.opacity) < 0.05 || cs.visibility === 'hidden') return;
      const b = no.getBoundingClientRect();
      if (b.width === 0) return;
      if (b.right > tinta) {
        tinta = b.right;
        peca = (no.textContent || '').trim().slice(0, 24) || no.tagName;
      }
      if (no.tagName === 'A' && no.getAttribute('aria-current')) ativo = (no.textContent || '').trim();
    });
    const alvo = document.querySelector('.sobre-carimbo-caixa') ?? document.querySelector('.sobre-conteudo');
    const inicio = alvo ? alvo.getBoundingClientRect().left : null;
    corredor = {
      navMontado: true,
      ativo,
      tintaAteX: num(tinta),
      pecaMaisADireita: peca,
      conteudoComecaEmX: num(inicio),
      folgaPx: inicio === null ? null : num(inicio - tinta),
    };
  }

  const foto = document.querySelector('.sobre-foto');
  const copy = document.querySelector('.sobre-copy');
  const carimbo = document.querySelector('.sobre-carimbo-caixa');
  const conteudo = document.querySelector('.sobre-conteudo');
  const faixa = document.querySelector('.sobre-metricas');
  const assin = document.querySelector('.sobre-assinatura');
  const risco = document.querySelector('.sobre-assinatura-risco');
  const traco = document.querySelector('.sobre-assinatura-traco');

  const bf = r(foto);
  const bc = r(copy);
  const bk = r(carimbo);
  const bq = r(conteudo);
  const bn = r(faixa);

  const interseccao = (a, b) => {
    if (!a || !b) return null;
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return w > 0 && h > 0 ? num(w * h) : 0;
  };

  const csA = assin ? getComputedStyle(assin) : null;

  return {
    secaoMontada: true,
    corredorDoIndicador: corredor,
    colunas: bf && bc && bq
      ? {
          foto: rc(foto),
          copy: rc(copy),
          fracaoImagemPct: num((bf.width / (bf.width + bc.width)) * 100),
          razaoFoto: num(bf.width / bf.height),
          sobraADireitaPx: num(bq.right - Math.max(bf.right, bc.right)),
        }
      : null,
    carimbo: bk
      ? {
          caixa: rc(carimbo),
          areaSobreAFotoPx2: interseccao(bk, bf),
          rotateCSS: getComputedStyle(carimbo).rotate,
          larguraFracaoDaFotoPct: bf ? num((bk.width / bf.width) * 100) : null,
        }
      : null,
    faixaNavy: bn
      ? {
          caixa: rc(faixa),
          sangraNaJanela: Math.round(bn.left) === 0 && Math.round(bn.width) === window.innerWidth,
          clipPath: getComputedStyle(faixa).clipPath !== 'none',
        }
      : null,
    metricas: [...document.querySelectorAll('.sobre-metrica')].map((li) => ({
      valor: (li.querySelector('.sr-only')?.textContent || '').trim(),
      contador: (li.querySelector('.font-mono')?.textContent || '').trim(),
      rotulo: (li.querySelector('.sobre-metrica-rotulo')?.textContent || '').trim(),
      detalheVisivel: Number(getComputedStyle(li.querySelector('.sobre-metrica-detalhe')).opacity),
      temIcone: !!li.querySelector('svg'),
      caixa: rc(li),
    })),
    assinatura: csA
      ? {
          texto: assin.textContent.trim(),
          fontFamily: csA.fontFamily,
          fontWeight: csA.fontWeight,
          fontSizePx: csA.fontSize,
          lineHeight: csA.lineHeight,
          color: csA.color,
          rotate: csA.rotate,
          linhas: assin.querySelectorAll('.sobre-assinatura-linha').length,
          tracoLarguraPx: traco ? num(r(traco).width) : null,
          riscoStroke: risco ? getComputedStyle(risco).stroke : null,
          riscoDashoffset: risco ? getComputedStyle(risco).strokeDashoffset : null,
          caixa: rc(assin),
        }
      : null,
    cards: {
      glassCards: secao.querySelectorAll('.glass-card, .glass-card-hover, .notch-card').length,
      orbes: secao.querySelectorAll('.orb').length,
    },
    acentos: {
      visiveis: [...document.querySelectorAll('.sobre-acento-palavra')].filter(
        (n) => n.getBoundingClientRect().width > 0,
      ).length,
      total: document.querySelectorAll('.sobre-acento-palavra').length,
    },
    /* ── A 2ª PASSADA PEDIDA EM CHAT ────────────────────────────────────────
       `tituloPintado` tem de ser FALSE e `tituloNoSumario` TRUE ao mesmo tempo:
       o pedido foi tirar a escrita da vista, e a seção não pode perder o
       cabeçalho do sumário por causa disso. `atmosferaAbaixoDaEscrita` é o portão
       de «que não atrapalhe a escrita»: a camada precisa ficar sob a grade, sem
       ponteiro, e as derivas precisam estar CORRENDO com movimento cheio. */
    segundaPassada: (() => {
      const h2 = document.querySelector('#quem-somos h2');
      const atm = document.querySelector('.sobre-atmosfera');
      const grade = document.querySelector('.sobre-metricas-grade');
      const derivas = [...document.querySelectorAll('[class*="sobre-atmosfera-deriva"]')];
      return {
        tituloTexto: h2 ? h2.textContent.trim() : null,
        tituloPintado: h2 ? !h2.classList.contains('sr-only') : null,
        tituloNoSumario: !!h2,
        eyebrowDaCapa: document.querySelector('#quem-somos-hero, header + * [class*="eyebrow"]')
          ? 'presente'
          : 'ausente',
        chanfrosNaRota: document.querySelectorAll('.notch-divider').length,
        atmosfera: atm
          ? {
              zIndex: getComputedStyle(atm).zIndex,
              zIndexDaGrade: grade ? getComputedStyle(grade).zIndex : null,
              recebePonteiro: getComputedStyle(atm).pointerEvents !== 'none',
              overflow: getComputedStyle(atm).overflow,
              derivas: derivas.map((g) => ({
                animacao: getComputedStyle(g).animationName,
                duracao: getComputedStyle(g).animationDuration,
                estado: getComputedStyle(g).animationPlayState,
              })),
              formas: atm.querySelectorAll('rect').length,
              linhas: atm.querySelectorAll('path').length,
            }
          : null,
      };
    })(),
    transbordoHorizontalPx: num(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  };
};

/* Contraste pela receita da casa: cor do texto pelo computado, fundo pelo PIXEL da
   captura — o fundo desta seção é degradê e não há cor sólida para ler do CSS. */
const lum = ([r, g, b]) => {
  const f = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};

const navegador = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`,
});

const relatorio = { fase: FASE, url: `${URL_BASE}/quem-somos`, quando: new Date().toISOString() };

for (const alvo of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: alvo.width, height: alvo.height },
    deviceScaleFactor: 1,
  });
  /* Uma preferência GUARDADA vence a media query do sistema — por isso o canal
     explícito é gravado como `full` aqui, para medir o estado com movimento. */
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await contexto.newPage();
  await p.goto(`${URL_BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 }).catch(() => {});
  await p.addStyleTag({
    content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  await p.waitForTimeout(1200);

  /* A seção tem de estar EM QUADRO — e não só encostada no topo. Na primeira volta
     desta sonda eu parei o quadro 80px acima da seção e o ScrollSpy ainda marcava
     «Início»: a folga saiu medida contra o rótulo errado (o de seis letras). O
     quadro agora vai com a ÁREA CLARA no meio da janela, que é onde o rótulo desta
     seção acende. */
  await p.evaluate(() => {
    const s = document.querySelector('.sobre-conteudo') ?? document.querySelector('#quem-somos');
    if (!s) return;
    const b = s.getBoundingClientRect();
    window.scrollTo(0, b.top + window.scrollY - (window.innerHeight - b.height) / 2);
  });
  await p.waitForTimeout(1600);

  const bloco = await p.evaluate(LER);

  const caminhoClaro = `${PASTA}/sis280-sobrenos-${FASE}-${alvo.nome}-claro.png`;
  await p.screenshot({ path: caminhoClaro });

  /* CONTRASTES — amostra 9px à esquerda do glifo, média de um bloco de 5px. */
  if (bloco.secaoMontada) {
    const alvos = await p.evaluate(() => {
      const pegar = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.top < 0 || b.bottom > window.innerHeight) return null;
        return { cor: getComputedStyle(el).color, x: Math.round(b.left), y: Math.round(b.top + b.height / 2) };
      };
      return {
        assinatura: pegar('.sobre-assinatura'),
        acento: pegar('.sobre-acento-palavra'),
        paragrafo: pegar('.sobre-paragrafo'),
      };
    });
    const { data, info } = await sharp(caminhoClaro)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const amostra = (x, y, alvoCor) => {
      let s = [0, 0, 0];
      let n = 0;
      let pior = null;
      for (let dx = -2; dx <= 2; dx += 1) {
        for (let dy = -2; dy <= 2; dy += 1) {
          const px = x + dx;
          const py = y + dy;
          if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
          const i = (py * info.width + px) * info.channels;
          const px3 = [data[i], data[i + 1], data[i + 2]];
          s = [s[0] + px3[0], s[1] + px3[1], s[2] + px3[2]];
          n += 1;
          /* «Pior» = o pixel de luminância mais PRÓXIMA da do texto, que é o que dá a
             menor razão do bloco. */
          if (pior === null || Math.abs(lum(px3) - lum(alvoCor)) < Math.abs(lum(pior) - lum(alvoCor))) {
            pior = px3;
          }
        }
      }
      return { media: s.map((v) => Math.round(v / n)), pior };
    };
    bloco.contrastes = {};
    for (const [nome, d] of Object.entries(alvos)) {
      if (!d) {
        bloco.contrastes[nome] = null;
        continue;
      }
      const m = d.cor.match(/\d+/g).slice(0, 3).map(Number);
      const { media, pior } = amostra(d.x - 9, d.y, m);
      bloco.contrastes[nome] = {
        cor: d.cor,
        fundoAmostrado: `rgb(${media.join(' ')})`,
        razao: razao(m, media),
        /* O PIOR PIXEL do bloco, e não só a média: em 11px a franja de antialiasing
           empurra a média para o lado bom e esconde reprovação. É a régua da casa
           para texto pequeno — os dois números vão para a issue. */
        fundoPiorPixel: `rgb(${pior.join(' ')})`,
        razaoPiorPixel: razao(m, pior),
      };
    }
  }

  /* A FAIXA NAVY em quadro, para a captura de conferência e para o contraste dos
     rótulos brancos sobre navy. */
  await p.evaluate(() => {
    const f = document.querySelector('.sobre-metricas');
    if (f) window.scrollTo(0, f.getBoundingClientRect().top + window.scrollY - 80);
  });
  await p.waitForTimeout(900);
  const caminhoNavy = `${PASTA}/sis280-sobrenos-${FASE}-${alvo.nome}-navy.png`;
  await p.screenshot({ path: caminhoNavy });
  if (bloco.secaoMontada) {
    const alvosNavy = await p.evaluate(() => {
      const pegar = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.top < 0 || b.bottom > window.innerHeight) return null;
        return { cor: getComputedStyle(el).color, x: Math.round(b.left), y: Math.round(b.top + b.height / 2) };
      };
      return { rotulo: pegar('.sobre-metrica-rotulo'), detalhe: pegar('.sobre-metrica-detalhe') };
    });
    const { data, info } = await sharp(caminhoNavy)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const amostra = (x, y, alvoCor) => {
      let s = [0, 0, 0];
      let n = 0;
      let pior = null;
      for (let dx = -2; dx <= 2; dx += 1) {
        for (let dy = -2; dy <= 2; dy += 1) {
          const i = ((y + dy) * info.width + (x + dx)) * info.channels;
          if (i < 0 || i >= data.length) continue;
          const px3 = [data[i], data[i + 1], data[i + 2]];
          s = [s[0] + px3[0], s[1] + px3[1], s[2] + px3[2]];
          n += 1;
          if (pior === null || Math.abs(lum(px3) - lum(alvoCor)) < Math.abs(lum(pior) - lum(alvoCor))) {
            pior = px3;
          }
        }
      }
      return { media: s.map((v) => Math.round(v / n)), pior };
    };
    for (const [nome, d] of Object.entries(alvosNavy)) {
      if (!d) {
        bloco.contrastes[nome] = null;
        continue;
      }
      const m = d.cor.match(/\d+/g).slice(0, 3).map(Number);
      const { media, pior } = amostra(d.x - 9, d.y, m);
      bloco.contrastes[nome] = {
        cor: d.cor,
        fundoAmostrado: `rgb(${media.join(' ')})`,
        razao: razao(m, media),
        /* O PIOR PIXEL do bloco, e não só a média: em 11px a franja de antialiasing
           empurra a média para o lado bom e esconde reprovação. É a régua da casa
           para texto pequeno — os dois números vão para a issue. */
        fundoPiorPixel: `rgb(${pior.join(' ')})`,
        razaoPiorPixel: razao(m, pior),
      };
    }
  }

  relatorio[alvo.nome] = bloco;
  await contexto.close();
}

/* OS DOIS CANAIS DE MOVIMENTO REDUZIDO, a 1440. O portão é o traço ciano nascer
   DESENHADO nos dois — parado no valor inicial ele seria invisível para sempre. */
const canais = {};
for (const canal of ['media-query', 'atributo']) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1,
    reducedMotion: canal === 'media-query' ? 'reduce' : 'no-preference',
  });
  await contexto.addInitScript(
    ([c]) => {
      localStorage.setItem('sistran-motion-preference', c === 'atributo' ? 'reduce' : 'full');
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    [canal],
  );
  const p = await contexto.newPage();
  await p.goto(`${URL_BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await p.waitForSelector('#quem-somos', { timeout: 180_000 });
  await p.evaluate(() => {
    const s = document.querySelector('#quem-somos');
    if (s) window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 80);
  });
  await p.waitForTimeout(2200);
  canais[canal] = await p.evaluate(() => {
    const risco = document.querySelector('.sobre-assinatura-risco');
    const carimbo = document.querySelector('.sobre-carimbo .carimbo-batida img, .sobre-carimbo img');
    return {
      dataMotion: document.documentElement.dataset.motion ?? null,
      riscoDashoffset: risco ? getComputedStyle(risco).strokeDashoffset : null,
      riscoAnimacao: risco ? getComputedStyle(risco).animationName : null,
      carimboOpacidade: carimbo
        ? Number(getComputedStyle(carimbo.closest('.carimbo-batida')).opacity)
        : null,
      contadores: [...document.querySelectorAll('.sobre-metrica .font-mono')].map((n) =>
        n.textContent.trim(),
      ),
      /* As derivas dos quadrados são DECORAÇÃO: parar é o certo, e é seguro porque
         as formas já estão desenhadas no estado inicial. O portão é `none` nos
         dois canais — e nenhuma forma desaparecendo. */
      atmosferaDerivas: [...document.querySelectorAll('[class*="sobre-atmosfera-deriva"]')].map(
        (g) => ({
          animacao: getComputedStyle(g).animationName,
          formasVisiveis: [...g.querySelectorAll('rect')].filter(
            (r) => r.getBoundingClientRect().width > 0,
          ).length,
        }),
      ),
    };
  });
  await contexto.close();
}
relatorio.movimentoReduzido = canais;

await navegador.close();
const saida = `${MEDIDAS}/sis280-sobrenos-${FASE}.json`;
await writeFile(saida, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\n→ ${saida}`);
