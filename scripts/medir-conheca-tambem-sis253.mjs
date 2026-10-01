/**
 * SIS-253 — «Conheça também» de `/quem-somos` remontado no molde do bloco homônimo
 * de `/solucoes/match-ai`. Escrito no molde de `medir-isg.mjs` (mesma receita de
 * navegador, mesmas funções de contraste).
 *
 * A sonda abre AS DUAS ROTAS e compara. É o que «igual ao molde» exige: número da
 * referência lido na referência, no mesmo navegador e na mesma largura — não
 * transcrito de leitura de código.
 *
 * Portões, e por que cada um existe:
 *
 * · `molde` — o critério literal («não glass notch»): zero `.glass-card`/
 *   `.notch-card` dentro da seção, DOIS cartões, cada um com `.matchai-midia` e
 *   `img.matchai-midia-arte`, proporção 16/10 e véu presente. As classes são as
 *   do Match AI reusadas pelo nome; o portão confere que a regra global realmente
 *   pegou nos nós daqui, e não só que a classe foi escrita.
 * · `tipografia` — corpo, peso e família do `h2` daqui contra o `h2` de lá. É o
 *   primeiro item do pedido («tipografia»), e é o único jeito de provar que
 *   `text-xl font-bold` reproduz o molde em vez de aproximá-lo.
 * · `marcaNaCaixa` — a marca tem de estar CONTIDA na mídia e visível: `max-h-[46%]
 *   max-w-[72%]` são utilitárias, e utilitária escrita não é caixa desenhada.
 *   Confere também `naturalWidth > 0` nas quatro imagens — caminho errado em
 *   `/public` dá 404 silencioso e caixa vazia, sem erro em lugar nenhum.
 * · `copia` — os quatro literais da página (dois títulos, dois apoios), palavra por
 *   palavra. É o critério «copy preservada de algum modo legível»: eles agora vivem
 *   na legenda sob a mídia, e o portão é continuarem no DOM.
 * · `pilula` — o fecho. Tem de computar `rgb(0, 96, 168)` de fundo e branco de
 *   tinta: se `on-dark` não pegasse, `.section-light` repintaria navy
 *   (`rgb(10, 31, 68)`) e o portão reprova por igualdade. Mais o contraste medido
 *   em pixel, média e pior.
 * · `contraste` — legenda (título e apoio) e o rótulo da pílula, com média E pior
 *   pixel. O apoio é de 14px; é ele que a receita da casa manda medir duas vezes.
 * · `emenda` — o `vaza-*` da SIS-77/268, que a issue manda preservar: a seção com
 *   `padding-bottom: 0`, o INVÓLUCRO (não a grade) com `margin-bottom: -80px`, e a
 *   prova de que a pílula é a tinta mais baixa da seção e não pisa nos cartões. Os
 *   dois valores são lidos computados, e o vão contra o bloco de baixo em pixel.
 * · `hover` — o gesto do molde: `scale: 1.06` na arte. Medido pela MATRIZ do
 *   `transform` computado depois do `hover`, não pela regra escrita.
 * · `movimentoReduzido` — os dois canais da casa, com o portão simétrico: escala de
 *   volta a 1 E todos os cartões visíveis (reveal morto em `opacity: 0` é conteúdo
 *   apagado).
 * · `transbordo` — nenhuma rolagem horizontal, nas três larguras.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-conheca-tambem-sis253.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTA = `${URL_BASE}/quem-somos`;
const MOLDE = `${URL_BASE}/solucoes/match-ai`;
const PASTA = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(PASTA, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const SECAO = 'section[aria-labelledby="mais-quem-somos"]';
const SECAO_MOLDE = 'nav[aria-labelledby="conheca-tambem"]';

const LARGURAS = [
  { nome: '1440', width: 1440, height: 960 },
  { nome: '768', width: 768, height: 1000 },
  { nome: '390', width: 390, height: 844 },
];

/* Literais da página. Lista escrita à mão de propósito: derivada do DOM, o portão
   aprovaria qualquer coisa que estivesse lá. */
const TEXTOS = [
  'Sistran Labs: Laboratório de INOVAÇÃO',
  'Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações da Sistran.',
  'Sistran University',
  'Autossuficiência em capacitação de recursos: programa de capacitação intensiva da Sistran.',
  'Ver todas as soluções e serviços',
];

/* Medidas intrínsecas dos quatro arquivos, lidas com `sharp` antes de escrever o
   JSX. O portão confere o `naturalWidth` contra elas: prova que chegou o arquivo
   pretendido, e não outro que por acaso carregou. */
const ARQUIVOS = {
  '/images/sistran-labs/3-aba-sistran-labs.webp': { largura: 1600, altura: 964 },
  '/images/university/university-hero.webp': { largura: 1672, altura: 941 },
  '/images/sistran-labs/logo-labs-header.webp': { largura: 421, altura: 96 },
  '/images/university/logo-university-header.webp': { largura: 291, altura: 96 },
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

/* Contraste pela receita da casa, com média E pior pixel do FUNDO. As coordenadas
   chegam ARREDONDADAS de quem chama: coordenada fracionária indexa pixel
   `undefined` e devolve razão `null` (achado de `medir-diferenciais.mjs`).

   O PONTO AMOSTRADO É LIVRE DE TINTA, e isso é diferente do que a primeira versão
   fazia. Ela centrava a janela no meio da caixa de texto (menos os 9px de
   `medir-isg.mjs`) e caía DENTRO do glifo: o título de 18px media razão 1,00 no pior
   pixel — que é o que sai de comparar uma cor com ela mesma — e a média variava
   6,75 / 5,37 / 4,94 entre as três larguras só porque a janela pegava mais ou menos
   tinta. Nada disso é contraste. Quem chama agora manda o ponto do FUNDO (logo
   abaixo da caixa do texto, ou dentro do recuo da pílula), e as duas razões voltam a
   significar o que o nome diz: média do fundo e pior pixel do fundo. */
const contrasteDe = async (png, alvo) => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = alvo.cor.match(/[\d.]+/g).slice(0, 3).map(Number);
  const alfa = Number((alvo.cor.match(/[\d.]+/g) ?? [])[3] ?? 1);
  let s = [0, 0, 0];
  let n = 0;
  let pior = null;
  for (let dx = -2; dx <= 2; dx += 1) {
    for (let dy = -2; dy <= 2; dy += 1) {
      const px = alvo.x + dx;
      const py = alvo.y + dy;
      if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
      const i = (py * info.width + px) * info.channels;
      const px3 = [data[i], data[i + 1], data[i + 2]];
      s = [s[0] + px3[0], s[1] + px3[1], s[2] + px3[2]];
      n += 1;
      if (pior === null || Math.abs(lum(px3) - lum(m)) < Math.abs(lum(pior) - lum(m))) pior = px3;
    }
  }
  if (!n) return { foraDeQuadro: true };
  const media = s.map((v) => Math.round(v / n));
  const compor = (fundo) => m.map((c, i) => Math.round(alfa * c + (1 - alfa) * fundo[i]));
  return {
    ...alvo,
    alfaDoTexto: alfa,
    fundoAmostrado: `rgb(${media.join(' ')})`,
    razao: razao(compor(media), media),
    fundoPiorPixel: `rgb(${pior.join(' ')})`,
    razaoPiorPixel: razao(compor(pior), pior),
  };
};

const abrir = async (navegador, url, seletor, alvo, reduzido) => {
  const contexto = await navegador.newContext({
    viewport: { width: alvo.width, height: alvo.height },
    deviceScaleFactor: 1,
    reducedMotion: reduzido === 'media-query' ? 'reduce' : 'no-preference',
  });
  await contexto.addInitScript(
    ([c]) => {
      localStorage.setItem('sistran-motion-preference', c === 'atributo' ? 'reduce' : 'full');
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    [reduzido ?? 'full'],
  );
  const p = await contexto.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 240_000 }).catch(() => {});
  await p.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  await p.waitForSelector(seletor, { timeout: 240_000 });
  /* TRÊS centragens: o layout acima da seção ainda muda depois da primeira rolagem
     (cena dos escritórios, imagens), e uma só deixa a seção fora de quadro — sem
     isto o `whileInView` não dispara e tudo é lido em opacidade 0. */
  for (let t = 0; t < 3; t += 1) {
    await p.evaluate((sel) => {
      const b = document.querySelector(sel).getBoundingClientRect();
      window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
    }, seletor);
    await p.waitForTimeout(1100);
  }
  await p.evaluate(() => document.fonts?.ready);
  await p.waitForTimeout(600);
  return { contexto, p };
};

/* Tipografia do `h2` de cada lado. Função só de leitura, aplicada aos dois. */
const TIPOGRAFIA = (sel) => {
  const h2 = document.querySelector(sel)?.querySelector('h2');
  if (!h2) return null;
  const cs = getComputedStyle(h2);
  return {
    texto: (h2.getAttribute('aria-label') ?? h2.textContent ?? '').replace(/\s+/g, ' ').trim(),
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
    lineHeight: cs.lineHeight,
    color: cs.color,
  };
};

const LER = (entrada) => {
  const [textos, arquivos, seletor] = entrada;
  const num = (v) => (v === null || v === undefined ? null : Math.round(v * 100) / 100);
  const secao = document.querySelector(seletor);
  if (!secao) return { secaoMontada: false };
  const cs = getComputedStyle(secao);
  const caixa = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: num(b.left),
      y: num(b.top),
      largura: num(b.width),
      altura: num(b.height),
      direita: num(b.right),
      base: num(b.bottom),
    };
  };
  /* A ESCALA SE LÊ EM `scale`, NÃO NA MATRIZ DE `transform`. A regra do molde
     (`globals.css:28532-28536`) usa a propriedade INDEPENDENTE `scale: 1.06` —
     exatamente para não disputar o `transform` com quem anima a entrada. A primeira
     versão desta sonda lia `DOMMatrixReadOnly(...transform).a` e media 1 no hover
     nas três larguras: `transform` computa `none` ali, e o portão estava reprovando
     um gesto que existe. Defeito da sonda. */
  const escala = (el) => {
    const v = getComputedStyle(el).scale;
    return v === 'none' ? 1 : num(Number(v.split(' ')[0]));
  };

  const invólucro = secao.querySelector('.vaza-cartoes');
  const itens = [...secao.querySelectorAll('ul > li')];
  const pilula = secao.querySelector('a[href="/solucoes"]');
  const texto = (secao.textContent || '').replace(/\s+/g, ' ');
  const abaixo = secao.nextElementSibling;

  return {
    secaoMontada: true,
    /* ── molde ─────────────────────────────────────────────────────────────── */
    molde: {
      glassOuNotch: secao.querySelectorAll('.glass-card, .glass-card-hover, .notch-card').length,
      cartoes: itens.length,
      cartao: itens.map((li) => {
        const midia = li.querySelector('.matchai-midia');
        const arte = li.querySelector('img.matchai-midia-arte');
        /* O véu é o filho com ALFA MAIOR QUE ZERO. A primeira versão desta linha
           pedia só `startsWith('rgba')`, e o primeiro filho da mídia é a arte, cujo
           fundo computa `rgba(0, 0, 0, 0)`: o portão lia o véu como inexistente
           estando ele lá. Defeito da sonda, não da página. */
        const veu = [...(midia?.children ?? [])].find((n) => {
          const c = getComputedStyle(n).backgroundColor.match(/[\d.]+/g) ?? [];
          return c.length === 4 && Number(c[3]) > 0;
        });
        const marca = [...li.querySelectorAll('img')].find((i) => i !== arte);
        const legenda = li.querySelector('figcaption');
        const b = midia?.getBoundingClientRect();
        return {
          href: li.querySelector('a')?.getAttribute('href') ?? null,
          temMidia: !!midia,
          temArte: !!arte,
          midia: caixa(midia),
          proporcao: b ? num(b.width / b.height) : null,
          borderRadius: midia ? getComputedStyle(midia).borderTopLeftRadius : null,
          transicaoDaArte: arte ? getComputedStyle(arte).transitionProperty : null,
          veu: veu ? getComputedStyle(veu).backgroundColor : null,
          arte: { src: arte?.getAttribute('src'), natural: arte?.naturalWidth ?? 0 },
          marca: {
            src: marca?.getAttribute('src'),
            natural: marca?.naturalWidth ?? 0,
            caixa: caixa(marca),
          },
          /* A marca CONTIDA na mídia, com folga — e não «declarada absolute». */
          marcaDentroDaMidia:
            !!marca &&
            !!b &&
            marca.getBoundingClientRect().left >= b.left - 0.5 &&
            marca.getBoundingClientRect().right <= b.right + 0.5 &&
            marca.getBoundingClientRect().top >= b.top - 0.5 &&
            marca.getBoundingClientRect().bottom <= b.bottom + 0.5,
          legendaVisivel:
            !!legenda && legenda.getBoundingClientRect().height > 0 && legenda.textContent !== '',
        };
      }),
    },
    /* ── assets ────────────────────────────────────────────────────────────── */
    assets: [...secao.querySelectorAll('img')].map((i) => {
      const src = decodeURIComponent(i.getAttribute('src') ?? '').replace(/^.*url=|&.*$/g, '');
      const esperado = arquivos[src] ?? null;
      return {
        src,
        naturalWidth: i.naturalWidth,
        naturalHeight: i.naturalHeight,
        esperado,
        confere: !!esperado && i.naturalWidth === esperado.largura && i.naturalHeight === esperado.altura,
      };
    }),
    /* ── cópia ─────────────────────────────────────────────────────────────── */
    copia: textos.map((t) => ({ trecho: t.slice(0, 44), presente: texto.includes(t) })),
    /* ── pílula ────────────────────────────────────────────────────────────── */
    pilula: pilula
      ? {
          href: pilula.getAttribute('href'),
          rotulo: (pilula.textContent || '').trim(),
          fundo: getComputedStyle(pilula).backgroundColor,
          cor: getComputedStyle(pilula).color,
          /* O portão negativo: se `on-dark` não pegasse, a casa repintaria navy. */
          naoFoiRepintadaDeNavy: getComputedStyle(pilula).color !== 'rgb(10, 31, 68)',
          borderRadius: getComputedStyle(pilula).borderTopLeftRadius,
          caixa: caixa(pilula),
        }
      : null,
    /* ── emenda `vaza-*` (SIS-77 / SIS-268) ────────────────────────────────── */
    emenda: {
      classesDaSecao: secao.className,
      paddingBottomDaSecao: cs.paddingBottom,
      /* A classe está no INVÓLUCRO, não na grade: com ela na grade, os −5rem
         subiriam a pílula por cima dos cartões. */
      classeNoInvolucro: !!invólucro && !invólucro.matches('ul'),
      marginBottomDoInvolucro: invólucro ? getComputedStyle(invólucro).marginBottom : null,
      invólucro: caixa(invólucro),
      ultimoCartao: caixa(itens.at(-1)),
      /* A pílula é a tinta mais baixa da seção — e NÃO pisa nos cartões. */
      pilulaAbaixoDosCartoes:
        !!pilula &&
        !!itens.at(-1) &&
        pilula.getBoundingClientRect().top >= itens.at(-1).getBoundingClientRect().bottom - 0.5,
      folgaCartaoPilulaPx:
        pilula && itens.at(-1)
          ? num(
              pilula.getBoundingClientRect().top - itens.at(-1).getBoundingClientRect().bottom,
            )
          : null,
      /* Contra o bloco de baixo: a saliência tem de CAIR dentro dele, sem vão. */
      blocoAbaixo: abaixo?.tagName?.toLowerCase() ?? null,
      baseDaSecao: num(secao.getBoundingClientRect().bottom),
      topoDoBlocoAbaixo: abaixo ? num(abaixo.getBoundingClientRect().top) : null,
      vaoNaFronteiraPx: abaixo
        ? num(abaixo.getBoundingClientRect().top - secao.getBoundingClientRect().bottom)
        : null,
      quantoAPilulaEntraNoBlocoAbaixoPx:
        pilula && abaixo
          ? num(pilula.getBoundingClientRect().bottom - abaixo.getBoundingClientRect().top)
          : null,
    },
    /* ── estado dos cartões e transbordo ───────────────────────────────────── */
    cartoesVisiveis: itens.filter((li) => Number(getComputedStyle(li).opacity) > 0.99).length,
    escalaDaArteEmRepouso: [...secao.querySelectorAll('img.matchai-midia-arte')].map(escala),
    transbordo: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      rolaNaHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    },
  };
};

const navegador = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`,
});

const relatorio = {
  peca: '«Conheça também» de /quem-somos no molde do Match AI',
  issue: 'SIS-253',
  url: ROTA,
  molde: MOLDE,
  quando: new Date().toISOString(),
};

for (const alvo of LARGURAS) {
  const { contexto, p } = await abrir(navegador, ROTA, SECAO, alvo);
  const bloco = await p.evaluate(LER, [TEXTOS, ARQUIVOS, SECAO]);
  bloco.tipografia = await p.evaluate(TIPOGRAFIA, SECAO);

  const base = `${PASTA}/sis253-quem-somos-${alvo.nome}.png`;
  await p.screenshot({ path: base });

  /* CONTRASTE: os três textos da seção. O apoio é de 14px — é dele que a receita
     da casa exige média E pior pixel. */
  const alvos = await p.evaluate((sel) => {
    const secao = document.querySelector(sel);
    const emQuadro = (el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.top > 0 && b.bottom < window.innerHeight;
    };
    const pares = [
      ['legendaTitulo', 'figcaption h3'],
      ['legendaApoio', 'figcaption p'],
      ['pilulaRotulo', 'a[href="/solucoes"]'],
    ];
    return pares.flatMap(([nome, s]) =>
      [...secao.querySelectorAll(s)].filter(emQuadro).slice(0, 1).map((el) => {
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        /* PONTO DE FUNDO, livre de tinta. Nos dois textos da legenda é a faixa
           imediatamente sob a caixa (6px, dentro do respiro que vem depois dela):
           ali o fundo é o mesmo campo da seção que está atrás das letras. Na pílula
           é o recuo interno da esquerda (`px-4`, 16px), que é o próprio azul
           `#0060A8` com que o rótulo tem de contrastar. */
        const fundo =
          nome === 'pilulaRotulo'
            ? { x: b.left + 8, y: b.top + b.height / 2 }
            : { x: b.left + b.width / 2, y: b.bottom + 6 };
        return {
          nome,
          cor: cs.color,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          caixaDoTexto: { x: Math.round(b.left), y: Math.round(b.top) },
          x: Math.round(fundo.x),
          y: Math.round(fundo.y),
        };
      }),
    );
  }, SECAO);
  bloco.contraste = [];
  for (const a of alvos) bloco.contraste.push(await contrasteDe(base, a));

  /* HOVER: o gesto do molde, lido na MATRIZ depois do `hover`. Só onde há ponteiro
     fino — o `@media (hover: hover) and (pointer: fine)` do CSS. */
  bloco.hover = await (async () => {
    const ESC = (el) => {
      const v = getComputedStyle(el).scale;
      return v === 'none' ? 1 : Math.round(Number(v.split(' ')[0]) * 1000) / 1000;
    };
    const arte = p.locator(`${SECAO} img.matchai-midia-arte`).first();
    const antes = await arte.evaluate(ESC);
    await p.locator(`${SECAO} ul > li a`).first().hover();
    await p.waitForTimeout(900);
    const depois = await arte.evaluate(ESC);
    const borda = await p
      .locator(`${SECAO} .matchai-midia`)
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopColor);
    return {
      /* O gesto é gated em `(hover: hover) and (pointer: fine)`. Registrar a
         consulta impede tomar «ambiente sem ponteiro fino» por «regra não pegou». */
      ponteiroFino: await p.evaluate(
        () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
      ),
      escalaAntes: antes,
      escalaNoHover: depois,
      bordaNoHover: borda,
    };
  })();

  relatorio[alvo.nome] = bloco;
  await contexto.close();
}

/* ── O MOLDE, lido na própria rota dele, a 1440 ───────────────────────────────── */
{
  const { contexto, p } = await abrir(navegador, MOLDE, SECAO_MOLDE, LARGURAS[0]);
  relatorio.referencia = {
    tipografia: await p.evaluate(TIPOGRAFIA, SECAO_MOLDE),
    ...(await p.evaluate((sel) => {
      const n = document.querySelector(sel);
      const midia = n.querySelector('.matchai-midia');
      const b = midia?.getBoundingClientRect();
      const veuDaRef = [...(midia?.children ?? [])].find((x) => {
        const c = getComputedStyle(x).backgroundColor.match(/[\d.]+/g) ?? [];
        return c.length === 4 && Number(c[3]) > 0;
      });
      const pilula = [...n.querySelectorAll('a')].find((a) =>
        /Ver todas as solu/i.test(a.textContent ?? ''),
      );
      return {
        cartoes: n.querySelectorAll('.matchai-midia').length,
        proporcaoDaMidia: b ? Math.round((b.width / b.height) * 100) / 100 : null,
        borderRadiusDaMidia: midia ? getComputedStyle(midia).borderTopLeftRadius : null,
        veu: veuDaRef ? getComputedStyle(veuDaRef).backgroundColor : null,
        pilula: pilula
          ? {
              rotulo: pilula.textContent.trim(),
              fundo: getComputedStyle(pilula).backgroundColor,
              cor: getComputedStyle(pilula).color,
              borderRadius: getComputedStyle(pilula).borderTopLeftRadius,
            }
          : null,
      };
    }, SECAO_MOLDE)),
  };
  await p.screenshot({ path: `${PASTA}/sis253-molde-matchai-1440.png` });
  await contexto.close();
}

/* ── MOVIMENTO REDUZIDO: os dois canais da casa ──────────────────────────────── */
const canais = {};
for (const canal of ['media-query', 'atributo']) {
  const { contexto, p } = await abrir(navegador, ROTA, SECAO, LARGURAS[0], canal);
  await p.locator(`${SECAO} ul > li a`).first().hover();
  await p.waitForTimeout(900);
  canais[canal] = await p.evaluate((sel) => {
    const secao = document.querySelector(sel);
    const artes = [...secao.querySelectorAll('img.matchai-midia-arte')];
    const itens = [...secao.querySelectorAll('ul > li')];
    return {
      dataMotion: document.documentElement.dataset.motion ?? null,
      /* Portão do gesto: NO HOVER, a escala tem de continuar 1. Lida em `scale`,
         que é onde a regra do molde escreve (ver a nota do helper `escala`). */
      escalaNoHover: artes.map((el) => {
        const v = getComputedStyle(el).scale;
        return v === 'none' ? 1 : Math.round(Number(v.split(' ')[0]) * 1000) / 1000;
      }),
      transicaoDaArte: artes.map((el) => getComputedStyle(el).transitionDuration),
      /* Portão simétrico: nada se move E tudo VISÍVEL. */
      cartoes: itens.length,
      cartoesVisiveis: itens.filter((li) => Number(getComputedStyle(li).opacity) > 0.99).length,
      piorOpacidade: Math.min(...itens.map((li) => Number(getComputedStyle(li).opacity))),
      piorDeslocamentoPx: Math.max(
        ...itens.map((li) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(li).transform).f)),
      ),
      imagensCarregadas: [...secao.querySelectorAll('img')].filter((i) => i.naturalWidth > 0).length,
    };
  }, SECAO);
  await contexto.close();
}
relatorio.movimentoReduzido = canais;

await navegador.close();
const saida = `${MEDIDAS}/conheca-tambem-sis253.json`;
await writeFile(saida, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
