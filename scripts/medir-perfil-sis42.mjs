/**
 * SIS-42 — portões medidos da seção «Perfil & posicionamento» de `/quem-somos`.
 *
 * O que ele mede, e por que cada um existe:
 *
 * · `contratos` — `id="posicionamento"` é âncora do `ScrollSpy` e do menu lateral, e
 *   o nome acessível vem por `aria-labelledby`. A peça trocou de componente; os dois
 *   contratos não podem ter trocado com ela. O portão é o `id` presente E o
 *   `aria-labelledby` RESOLVENDO num nó de texto não vazio — apontar para um `id`
 *   inexistente deixa a seção sem nome e não dá erro nenhum.
 * · `arte` — a fonte tem de ser `posicionamentoperfil.png`, e a caixa pintada tem de
 *   respeitar a razão nativa 1672×941. `naturalWidth` confirma que o byte chegou:
 *   `<Image>` com src errado renderiza a caixa igual e fica em 0.
 * · `casca` — a linguagem do «Fale com a Gente!»: raio, borda, sombra e recorte.
 * · `camadasPintam` — o portão que importa de verdade. `.grade-tecnica` e
 *   `.perfil-riscos` vivem em `z-index: -1`; numa seção sem contexto de empilhamento
 *   elas somem sob o fundo opaco do ancestral, e o CSS continua «certo» no
 *   computado. Então aqui não se lê o computado: fotografa-se a seção, esconde-se a
 *   camada, fotografa-se de novo e conta-se PIXEL DIFERENTE. Zero = camada morta.
 * · `legibilidade` — a arte tem 1672px e corpo de texto de ~20px nessa largura. O
 *   portão é a altura do corpo na tela: `larguraArtePx / 1672 * 20`. Abaixo de ~9px
 *   não se lê, e é por isso que existe a janela de rolagem.
 * · `transbordo` — no `documentElement`, que é onde «sem overflow horizontal» vale.
 *   A rolagem DENTRO da janela é intencional e vai medida em separado.
 * · `escritaPreservada` — cada frase de `src/data/posicionamento.ts` tem de continuar
 *   no DOM. Trocar HTML por PNG apaga texto publicado calado; o portão é a contagem
 *   das frases esperadas encontradas na transcrição.
 * · `emenda` — 2ª passada, o pedido em si: o fundo tem de ser «a mesma cor e
 *   continuação dos números». Computado não serve de prova: `.sobre-metricas` e
 *   `.perfil-secao` declaram o MESMO degradê, mas em CAIXAS de larguras e alturas
 *   diferentes — o mesmo `105deg` percorrido em duas caixas distintas chega na junta
 *   com paradas diferentes, e é justamente isso que desenha a linha horizontal. Então
 *   aqui se lê PIXEL: 3px acima e 3px abaixo da fronteira, em sete colunas, e o portão
 *   é o maior ΔRGB somado entre o par. Acima de ~12 o olho vê a costura.
 * · `chanfros` — a seta branca entre esta seção e «Escritórios» saiu a pedido. O
 *   portão é a CONTAGEM de `.notch-divider` na rota (era 7, tem de ser 6) e nenhum
 *   deles entre `#posicionamento` e `#escritorios`.
 * · `movimento` — a peça é estática. O portão é `animationName: none` em tudo dentro
 *   da seção: nada para parar nos dois canais, e nada que possa ficar invisível.
 *
 * `fullPage` não serve: `.grade-tecnica` é `background-attachment: fixed` e não pinta
 * em captura de página inteira. Cada largura rola a seção para o MEIO do quadro.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-perfil-sis42.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTA = `${URL_BASE}/quem-somos`;
const PASTA = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(PASTA, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const LARGURAS = [
  { nome: '1440', width: 1440, height: 960 },
  { nome: '768', width: 768, height: 900 },
  { nome: '390', width: 390, height: 844 },
];

/* As frases publicadas de `src/data/posicionamento.ts` que a arte desenha. A lista é
   literal de propósito: se alguém editar o módulo de dados e esquecer a transcrição,
   o portão tem de reprovar — uma lista derivada do próprio DOM aprovaria tudo. */
const FRASES = [
  'Perfil & posicionamento',
  'Onde seguros, negócio e tecnologia convergem',
  'Da estratégia à operação, geramos valor em cada etapa da cadeia de seguros.',
  'Soluções',
  'Plataformas de ERP',
  'Apólice e Sinistros',
  'Aceleradores',
  'Connect API, Guru de Seguros, Smart Miner, Fast Claims',
  'Portais',
  'Jornadas de Vendas, Serviços e Sinistros',
  'Agregamos valor a toda cadeia de seguros',
  'Sólido conhecimento em Seguros',
  'Profundo domínio do mercado e das práticas que impulsionam resultados reais.',
  'Falamos segurês!',
  'Negócio & Consultoria',
  'Consultoria de Negócios',
  'Design Thinking',
  'Inovação / Arquitetura',
  'Integrações de Soluções',
  'Data Science / IA',
  'Vilas Ágeis & Serviços',
  'Desenvolvimento',
  'Projetos',
  'Análise Funcional',
  'Quality Assurance',
  'Migrações / Conversões',
  'Sustentação',
];

const LER = (frases) => {
  const num = (v) => (v === null || v === undefined ? null : Math.round(v * 100) / 100);
  const secao = document.querySelector('#posicionamento');
  if (!secao) return { secaoMontada: false };
  const rc = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: num(b.x), y: num(b.y), w: num(b.width), h: num(b.height), right: num(b.right) };
  };

  const rotulado = secao.getAttribute('aria-labelledby');
  const noDoNome = rotulado ? document.getElementById(rotulado) : null;

  const img = secao.querySelector('img');
  const casca = secao.querySelector('.perfil-casca');
  const janela = secao.querySelector('.perfil-janela');
  const grade = secao.querySelector('.grade-tecnica');
  const riscos = secao.querySelector('.perfil-riscos');
  const csS = getComputedStyle(secao);
  const csC = casca ? getComputedStyle(casca) : null;
  const transcricao = (secao.querySelector('.sr-only')?.textContent || '').replace(/\s+/g, ' ');

  return {
    secaoMontada: true,
    contratos: {
      id: secao.id,
      ariaLabelledby: rotulado,
      nomeResolvido: noDoNome ? (noDoNome.textContent || '').trim() : null,
      tagDoNome: noDoNome ? noDoNome.tagName : null,
      /* O ecossistema antigo não pode ter voltado a montar junto. */
      ecossistemaAntigoNaRota: document.querySelectorAll('.eco-secao').length,
      /* A rota inteira só pode ter UM `#posicionamento`. */
      ancorasDuplicadas: document.querySelectorAll('#posicionamento').length,
    },
    empilhamento: {
      isolation: csS.isolation,
      position: csS.position,
      overflow: csS.overflow,
      zIndexDaGrade: grade ? getComputedStyle(grade).zIndex : null,
      zIndexDosRiscos: riscos ? getComputedStyle(riscos).zIndex : null,
      gradeRecebePonteiro: grade ? getComputedStyle(grade).pointerEvents !== 'none' : null,
      gradeAriaHidden: grade ? grade.getAttribute('aria-hidden') !== null : null,
      riscosAriaHidden: riscos ? riscos.getAttribute('aria-hidden') !== null : null,
      riscosFios: riscos ? riscos.querySelectorAll('path').length : null,
    },
    arte: img
      ? {
          src: img.currentSrc || img.src,
          apontaParaArte: /posicionamentoperfil/.test(img.currentSrc || img.src),
          byteChegou: img.naturalWidth > 0,
          naturais: { w: img.naturalWidth, h: img.naturalHeight },
          caixa: rc(img),
          razaoPintada: num(img.getBoundingClientRect().width / img.getBoundingClientRect().height),
          razaoNativa: num(1672 / 941),
          alt: img.getAttribute('alt'),
          altTamanho: (img.getAttribute('alt') || '').length,
          loading: img.getAttribute('loading'),
        }
      : null,
    casca: csC
      ? {
          caixa: rc(casca),
          borderRadius: csC.borderTopLeftRadius,
          border: `${csC.borderTopWidth} ${csC.borderTopStyle} ${csC.borderTopColor}`,
          overflow: csC.overflow,
          boxShadow: csC.boxShadow,
          temDegradeDiagonal: /135deg/.test(csC.backgroundImage),
          brilhoDeCanto: !!secao.querySelector('.perfil-casca-brilho'),
          paddingTopPx: csC.paddingTop,
        }
      : null,
    janela: janela
      ? {
          focalizavel: janela.tabIndex === 0,
          papel: janela.getAttribute('role'),
          nome: janela.getAttribute('aria-label'),
          rolaHorizontal: num(janela.scrollWidth - janela.clientWidth),
          overflowX: getComputedStyle(janela).overflowX,
        }
      : null,
    legibilidade: img
      ? {
          larguraArtePx: num(img.getBoundingClientRect().width),
          /* O corpo de texto desenhado mede ~20px na largura nativa de 1672. */
          corpoDeTextoNaTelaPx: num((img.getBoundingClientRect().width / 1672) * 20),
        }
      : null,
    escritaPreservada: (() => {
      const faltando = frases.filter((f) => !transcricao.includes(f));
      return {
        esperadas: frases.length,
        encontradas: frases.length - faltando.length,
        faltando,
        caracteresNaTranscricao: transcricao.trim().length,
        transcricaoInvisivel: !!secao.querySelector('.sr-only'),
      };
    })(),
    movimento: {
      nosAnimados: [...secao.querySelectorAll('*')].filter(
        (n) => getComputedStyle(n).animationName !== 'none',
      ).length,
      nosComTransicaoDeLayout: [...secao.querySelectorAll('*')].filter((n) =>
        /width|height|top|left/.test(getComputedStyle(n).transitionProperty),
      ).length,
    },
    transbordoDocumentoPx: num(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  };
};

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

const relatorio = { issue: 'SIS-42', url: ROTA, quando: new Date().toISOString() };

/* Conta pixels diferentes entre duas capturas. É o portão de «a camada pinta». */
const diferenca = async (a, b) => {
  const [pa, pb] = await Promise.all([
    sharp(a).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  if (pa.data.length !== pb.data.length) return { comparavel: false };
  let n = 0;
  let maior = 0;
  for (let i = 0; i < pa.data.length; i += pa.info.channels) {
    const d =
      Math.abs(pa.data[i] - pb.data[i]) +
      Math.abs(pa.data[i + 1] - pb.data[i + 1]) +
      Math.abs(pa.data[i + 2] - pb.data[i + 2]);
    if (d > 2) n += 1;
    if (d > maior) maior = d;
  }
  return {
    comparavel: true,
    pixeisDiferentes: n,
    fracaoDoQuadroPct: Math.round((n / (pa.info.width * pa.info.height)) * 10000) / 100,
    maiorDeltaRGB: maior,
  };
};

for (const alvo of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: alvo.width, height: alvo.height },
    deviceScaleFactor: 1,
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await contexto.newPage();
  await p.goto(ROTA, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 240_000 }).catch(() => {});
  await p.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  await p.waitForSelector('#posicionamento', { timeout: 240_000 });
  /* A seção CENTRADA no quadro: camadas ancoradas na janela só pintam assim. */
  await p.evaluate(() => {
    const s = document.querySelector('#posicionamento');
    const b = s.getBoundingClientRect();
    window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
  });
  await p.waitForTimeout(1600);
  await p.evaluate(() => document.fonts?.ready);

  const bloco = await p.evaluate(LER, FRASES);

  const base = `${PASTA}/sis42-perfil-${alvo.nome}.png`;
  await p.screenshot({ path: base });

  /* A DICA DE ROLAGEM — contraste pela receita da casa: cor pelo computado, fundo
     pelo PIXEL da captura 9px à esquerda do glifo, média de um bloco de 5px E o
     pior pixel do bloco (em 12,5px a franja de antialiasing empurra a média para
     o lado bom e esconde reprovação). */
  const dica = await p.evaluate(() => {
    const el = document.querySelector('.perfil-dica');
    if (!el || getComputedStyle(el).display === 'none') return null;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.top < 0 || b.bottom > window.innerHeight) return { foraDeQuadro: true };
    const cs = getComputedStyle(el);
    return {
      texto: el.textContent.trim(),
      cor: cs.color,
      fontSizePx: cs.fontSize,
      x: Math.round(b.left),
      y: Math.round(b.top + b.height / 2),
    };
  });
  if (dica && !dica.foraDeQuadro) {
    const { data, info } = await sharp(base).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const m = dica.cor.match(/[\d.]+/g).slice(0, 3).map(Number);
    let s = [0, 0, 0];
    let n = 0;
    let pior = null;
    for (let dx = -2; dx <= 2; dx += 1) {
      for (let dy = -2; dy <= 2; dy += 1) {
        const px = dica.x - 9 + dx;
        const py = dica.y + dy;
        if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
        const i = (py * info.width + px) * info.channels;
        const px3 = [data[i], data[i + 1], data[i + 2]];
        s = [s[0] + px3[0], s[1] + px3[1], s[2] + px3[2]];
        n += 1;
        if (pior === null || Math.abs(lum(px3) - lum(m)) < Math.abs(lum(pior) - lum(m))) pior = px3;
      }
    }
    const media = s.map((v) => Math.round(v / n));
    /* A COR DECLARADA É TRANSLÚCIDA (`rgba(...,0.72)`). Medir contraste com o
       branco cheio inflaria a razão: o que chega ao olho é o branco COMPOSTO
       sobre o fundo. A composição é feita aqui, contra cada fundo amostrado. */
    const alfa = Number((dica.cor.match(/[\d.]+/g) ?? [])[3] ?? 1);
    const compor = (fundo) => m.map((c, i) => Math.round(alfa * c + (1 - alfa) * fundo[i]));
    bloco.contrasteDaDica = {
      ...dica,
      alfaDoTexto: alfa,
      corComposta: `rgb(${compor(media).join(' ')})`,
      fundoAmostrado: `rgb(${media.join(' ')})`,
      razao: razao(compor(media), media),
      fundoPiorPixel: `rgb(${pior.join(' ')})`,
      razaoPiorPixel: razao(compor(pior), pior),
    };
  } else {
    bloco.contrasteDaDica = dica;
  }

  /* A EMENDA COM A FAIXA DOS NÚMEROS. Captura PRÓPRIA: a captura de cima centra a
     seção, e como ela é mais alta que a janela a fronteira fica acima do quadro.
     Aqui a fronteira vai para o meio vertical e os pixels são lidos do arquivo. */
  const juntaPng = `${PASTA}/sis42-emenda-${alvo.nome}.png`;
  const junta = await p.evaluate(() => {
    const faixa = document.querySelector('.sobre-metricas');
    const secao = document.querySelector('#posicionamento');
    if (!faixa || !secao) return { faixaNaRota: !!faixa, secaoNaRota: !!secao };
    /* VIZINHAS DE FATO? Continuidade só existe se nada estiver no meio. */
    let irma = faixa.parentElement === secao.parentElement ? faixa.nextElementSibling : null;
    const entre = [];
    while (irma && irma !== secao) {
      entre.push(`${irma.tagName.toLowerCase()}.${irma.className || '(sem classe)'}`);
      irma = irma.nextElementSibling;
    }
    window.scrollTo(
      0,
      secao.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
    );
    return {
      mesmoPai: faixa.parentElement === secao.parentElement,
      /* Só é confiável se a busca acima chegou na seção; senão não são irmãs. */
      elementosEntre: irma === secao ? entre : ['(não são irmãs na mesma lista)'],
      degradeDaFaixa: getComputedStyle(faixa).backgroundImage,
      degradeDaSecao: getComputedStyle(secao).backgroundImage,
    };
  });
  if (junta.mesmoPai !== undefined) {
    await p.waitForTimeout(500);
    await p.screenshot({ path: juntaPng });
    const y = await p.evaluate(
      () => Math.round(document.querySelector('#posicionamento').getBoundingClientRect().top),
    );
    const { data, info } = await sharp(juntaPng)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const em = (px, py) => {
      const i = (py * info.width + px) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const colunas = [0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.94].map((f) =>
      Math.min(info.width - 1, Math.round(info.width * f)),
    );
    const pares = colunas.map((x) => {
      const acima = em(x, Math.max(0, y - 3));
      const abaixo = em(x, Math.min(info.height - 1, y + 3));
      const delta =
        Math.abs(acima[0] - abaixo[0]) + Math.abs(acima[1] - abaixo[1]) + Math.abs(acima[2] - abaixo[2]);
      return { x, acima: `rgb(${acima.join(' ')})`, abaixo: `rgb(${abaixo.join(' ')})`, deltaRGB: delta };
    });
    junta.fronteiraYpx = y;
    junta.colunas = pares;
    junta.maiorDeltaRGB = Math.max(...pares.map((c) => c.deltaRGB));
  }
  bloco.emenda = junta;

  bloco.chanfros = await p.evaluate(() => {
    const chanfros = [...document.querySelectorAll('.notch-divider')];
    const secao = document.querySelector('#posicionamento');
    const escritorios = document.querySelector('#escritorios')?.closest('section');
    return {
      naRota: chanfros.length,
      entrePosicionamentoEEscritorios: chanfros.filter((c) => {
        const depoisDaSecao =
          secao && secao.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING;
        const antesDeEscritorios =
          escritorios && escritorios.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING;
        return !!depoisDaSecao && !!antesDeEscritorios;
      }).length,
    };
  });

  /* DE VOLTA AO ENQUADRAMENTO DE `base`. A medição da emenda rolou a página; sem
     voltar, o diff de camadas compararia dois enquadramentos e daria «pinta» para
     qualquer coisa. */
  await p.evaluate(() => {
    const s = document.querySelector('#posicionamento');
    const b = s.getBoundingClientRect();
    window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
  });
  await p.waitForTimeout(600);

  /* AS CAMADAS PINTAM? Esconde uma de cada vez e conta pixel diferente. */
  const semGrade = `${PASTA}/sis42-diag-${alvo.nome}-sem-grade.png`;
  await p.addStyleTag({ content: '#posicionamento .grade-tecnica{display:none!important}' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: semGrade });

  const semNada = `${PASTA}/sis42-diag-${alvo.nome}-sem-nada.png`;
  await p.addStyleTag({ content: '#posicionamento .perfil-riscos{display:none!important}' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: semNada });

  bloco.camadasPintam = {
    grade: await diferenca(base, semGrade),
    riscos: await diferenca(semGrade, semNada),
  };

  relatorio[alvo.nome] = bloco;
  await contexto.close();
}

/* OS DOIS CANAIS DE MOVIMENTO REDUZIDO. A peça é estática, então o portão é
   simétrico: nada animado e a arte VISÍVEL nos dois — decoração pode parar, mas
   nada aqui pode nascer invisível. */
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
  await p.goto(ROTA, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await p.waitForSelector('#posicionamento', { timeout: 240_000 });
  await p.evaluate(() => {
    const s = document.querySelector('#posicionamento');
    window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 80);
  });
  await p.waitForTimeout(2000);
  canais[canal] = await p.evaluate(() => {
    const secao = document.querySelector('#posicionamento');
    const img = secao.querySelector('img');
    const cs = getComputedStyle(img);
    return {
      dataMotion: document.documentElement.dataset.motion ?? null,
      nosAnimados: [...secao.querySelectorAll('*')].filter(
        (n) => getComputedStyle(n).animationName !== 'none',
      ).length,
      arteVisivel: img.getBoundingClientRect().width > 0 && Number(cs.opacity) > 0.99,
      arteOpacidade: Number(cs.opacity),
      transcricaoNoDOM: (secao.querySelector('.sr-only')?.textContent || '').trim().length,
    };
  });
  await contexto.close();
}
relatorio.movimentoReduzido = canais;

await navegador.close();
const saida = `${MEDIDAS}/sis42-perfil.json`;
await writeFile(saida, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\n→ ${saida}`);
