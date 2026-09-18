/**
 * SIS-291 — «/sistran-labs · «Já desenvolvemos…» igual a sistran-labs-5.png
 * (layout + dinâmica)».
 *
 * `node scripts/medir-desenvolvemos-labs-sis291.mjs`      (`next dev` em :3000)
 *
 * Os critérios da issue e o que cada um exige de medida:
 *
 *  1. «Composição a 1440 bate com a referência». Captura é metade da prova; a
 *     outra metade é a GEOMETRIA: duas colunas, o herói à esquerda, os três
 *     cartões à direita, a cascata horizontal, a barra em baixo de tudo. A sonda
 *     lê as caixas e verifica as RELAÇÕES (herói.x < cartões.x, cartões em ordem
 *     vertical, barra abaixo de todos), porque «parece igual» numa captura não
 *     distingue duas colunas de uma coluna com sorte de largura.
 *  2. «Quatro soluções + barra mailto como na referência». Conto os produtos
 *     nomeados na seção e leio o `href` do botão — `mailto:` errado ou ausente é
 *     o tipo de defeito que uma captura nunca mostra.
 *  3. «Dinâmica perceptível no scroll/hover». Para o SCROLL, leio a pose ANTES de
 *     a seção entrar (`data-in="false"`: `opacity` e `transform` de cada peça, e
 *     o `stroke-dashoffset` do fio) e DEPOIS, e confiro que a ORDEM do stagger é
 *     a que a issue pede — o `--reveal-i` de cada peça, lido do computado. Para o
 *     HOVER, leio o `transform`/`box-shadow` em repouso e com o ponteiro em cima,
 *     no herói, no cartão e nos dois botões.
 *  4. «Reduce OK». As duas vias, como sempre: a `@media` do sistema (só existe em
 *     contexto próprio) e o atributo `data-motion="reduce"` que o diálogo da
 *     página escreve. E aqui há um alvo que as regras globais NÃO cobrem: o
 *     `stroke-dashoffset` do fio. Se ele ficar em 1 com reduce, o fio nunca se
 *     desenha e a regra de acessibilidade APAGA conteúdo — é o item que motivou
 *     os espelhos explícitos no CSS, e é medido aqui em número.
 *  5. «Copy-lock atualizado» — fora desta sonda: é `npm run test:copy`.
 *
 * A11y de brinde, porque a folha clara é nova nesta seção: CONTRASTE medido dos
 * textos sobre o branco da cápsula e do cartão (WCAG, luminância relativa com
 * gama por canal), inclusive do letreiro «de seguros», que é justamente o que
 * ficaria ilegível se tivesse sido recortado do asset de letra clara.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = (process.env.LARGURAS ?? '1440,390').split(',').map(Number);
const SEC = 'section[aria-labelledby="labs-solucoes"]';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

/* WCAG 2.x: luminância relativa com a gama POR CANAL. A média dos canais não é
   luminância, e é o erro que faz azul escuro passar por cinza médio. */
const LUM = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const CONTRASTE = (a, b) => {
  const [x, y] = [LUM(a), LUM(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const RGB = (s) => (s?.match(/-?[\d.]+/g) ?? []).slice(0, 3).map(Number);

const PECAS = () => {
  const n = (v) => Math.round(v * 10) / 10;
  const secao = document.querySelector('section[aria-labelledby="labs-solucoes"]');
  if (!secao) return null;

  const caixa = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: n(b.x), y: n(b.y), w: n(b.width), h: n(b.height) };
  };
  const q = (sel) => secao.querySelector(sel);
  const qq = (sel) => [...secao.querySelectorAll(sel)];

  const pose = (el) => {
    if (!el) return null;
    const e = getComputedStyle(el);
    return {
      opacity: Math.round(Number(e.opacity) * 1000) / 1000,
      transform: e.transform,
      revealI: e.getPropertyValue('--reveal-i').trim() || null,
      reveal: el.getAttribute('data-reveal'),
    };
  };

  const cartoes = qq('.labs-solucao-cartao');

  return {
    secao: {
      classes: secao.className,
      /* A folha clara: quem pinta é a classe, então o valor computado é a prova. */
      fundo: getComputedStyle(secao).backgroundColor,
      gradeTecnica: getComputedStyle(secao, '::before').backgroundImage.slice(0, 60),
      dataIn: secao.querySelector('[data-in]')?.getAttribute('data-in'),
      caixa: caixa(secao),
    },
    /* Item 1 — geometria. */
    heroi: caixa(q('.labs-guru')),
    arte: (() => {
      const img = q('.labs-guru-arte');
      if (!img) return null;
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        altVazio: !img.getAttribute('alt')?.trim(),
        atributos: { width: img.getAttribute('width'), height: img.getAttribute('height') },
        natural: { w: img.naturalWidth, h: img.naturalHeight },
        pintada: caixa(img),
        completa: img.complete,
        filtro: getComputedStyle(img).filter,
      };
    })(),
    letreiro: (() => {
      const h = q('.labs-guru-nome');
      const fraco = q('.labs-guru-nome-fraco');
      if (!h) return null;
      return {
        /* Texto ACESSÍVEL (o que o leitor de tela diz), não o pintado. */
        texto: h.textContent.trim().replace(/\s+/g, ' '),
        transformDeTexto: getComputedStyle(h).textTransform,
        corForte: getComputedStyle(h).color,
        corFraco: fraco ? getComputedStyle(fraco).color : null,
        /* A cápsula é pintada por `background: linear-gradient(…)`, e por isso
           `backgroundColor` devolve `rgba(0,0,0,0)` — a primeira volta desta sonda
           calculou o contraste contra esse transparente e devolveu 1.29 nos dois
           pedaços do letreiro, número que não descreve nada. O contraste real é
           contra as PARADAS do degradê, e o pior caso é a mais escura delas.
           Então o que vai medido é o pixel: a cor amostrada pelo `elementFromPoint`
           não serve (é o próprio texto), então leio as paradas declaradas. */
        fundoDaCapsula: getComputedStyle(q('.labs-guru')).backgroundColor,
        degradeDaCapsula: getComputedStyle(q('.labs-guru')).backgroundImage,
      };
    })(),
    botaoGuru: (() => {
      const a = q('.labs-guru-botao');
      return a
        ? { texto: a.textContent.trim(), href: a.getAttribute('href'), caixa: caixa(a) }
        : null;
    })(),
    cartoes: cartoes.map((li) => ({
      nome: li.querySelector('.labs-solucao-nome')?.textContent.trim() ?? null,
      texto: li.querySelector('.labs-solucao-texto')?.textContent.trim() ?? null,
      href: li.querySelector('a')?.getAttribute('href') ?? null,
      temSeta: Boolean(li.querySelector('.labs-solucao-seta')),
      temIcone: Boolean(li.querySelector('.labs-solucao-plaqueta svg')),
      cor: getComputedStyle(li.querySelector('.labs-solucao-nome')).color,
      corTexto: getComputedStyle(li.querySelector('.labs-solucao-texto')).color,
      fundo: getComputedStyle(li).backgroundColor,
      /* O NÓ do fio, que é pseudo e não SVG. */
      no: (() => {
        const e = getComputedStyle(li, '::before');
        return { display: e.display, cor: e.backgroundColor, w: e.width, left: e.left };
      })(),
      caixa: caixa(li),
      pose: pose(li),
    })),
    /* Item 3 — o fio, em número. */
    fio: (() => {
      const svg = q('.labs-desenvolvemos-fio');
      if (!svg) return null;
      const paths = [...svg.querySelectorAll('path')].map((p) => {
        const e = getComputedStyle(p);
        return {
          dasharray: e.strokeDasharray,
          dashoffset: e.strokeDashoffset,
          largura: e.strokeWidth,
          cor: e.stroke,
          pathLength: p.getAttribute('pathLength'),
        };
      });
      return { display: getComputedStyle(svg).display, caixa: caixa(svg), paths };
    })(),
    barra: (() => {
      const d = q('.labs-desenvolvemos-barra');
      const a = q('.labs-desenvolvemos-barra-botao');
      if (!d) return null;
      return {
        caixa: caixa(d),
        texto: q('.labs-desenvolvemos-barra-texto')?.textContent.trim().replace(/\s+/g, ' '),
        temSelo: Boolean(q('.labs-desenvolvemos-selo svg')),
        botao: a
          ? {
              texto: a.textContent.trim(),
              href: a.getAttribute('href'),
              mailto: a.getAttribute('href')?.startsWith('mailto:') ?? false,
              caixa: caixa(a),
            }
          : null,
        fundo: getComputedStyle(d).backgroundColor,
        pose: pose(d),
      };
    })(),
    grafismo: {
      quadrados: qq('.labs-desenvolvemos-grafismo span').length,
      cores: qq('.labs-desenvolvemos-grafismo span').map((s) => getComputedStyle(s).backgroundColor),
    },
    /* Item 3 — a ORDEM do stagger, lida do computado e não do que eu escrevi. */
    stagger: [
      ['titulo', q('.labs-desenvolvemos-titulo')],
      ['risco', q('.labs-desenvolvemos-risco')],
      ['heroi', q('.labs-guru')],
      ...cartoes.map((c, i) => [`cartao${i + 1}`, c]),
      ['barra', q('.labs-desenvolvemos-barra')],
    ].map(([nome, el]) => ({ nome, ...pose(el) })),
    /* A grade não deve produzir barra horizontal, e os presets laterais deslocam
       48px no eixo X — é o defeito que `overflow-x: clip` previne. */
    vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    motion: document.documentElement.getAttribute('data-motion'),
    /* Contra-teste: os textos brancos foram REMOVIDOS desta seção. Um só sobrando
       sobre a folha clara seria texto invisível. */
    classesBrancas: [...secao.querySelectorAll('[class*="text-white"]')].length,
  };
};

const POSE_HOVER = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const e = getComputedStyle(el);
  return {
    transform: e.transform,
    translate: e.translate,
    boxShadow: e.boxShadow.slice(0, 110),
    borderColor: e.borderTopColor,
    background: e.backgroundColor,
  };
};

const res = { issue: 'SIS-291', erros: [], rede: {}, porLargura: {} };
const nav = await chromium.launch();

for (const width of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') res.erros.push(`${width}: ${m.text()}`);
  });
  res.rede[width] = [];
  p.on('response', (r) => {
    const u = r.url();
    if (!/guru-de-seguros-arte|sistran-labs-5/.test(u)) return;
    res.rede[width].push({
      arquivo: u.split('/').pop(),
      status: r.status(),
      bytes: Number(r.headers()['content-length'] ?? 0),
      tipo: r.headers()['content-type'] ?? null,
    });
  });

  await p.goto(`${BASE}/sistran-labs`, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
    .catch(() => null);
  await p.evaluate(() => document.fonts.ready);

  /* ANTES de a seção entrar. Vale como flagrante, MAS é transiente: a primeira
     volta desta sonda mediu aqui o título em `opacity: 0.029` e o herói em `0`
     enquanto a barra estava em `1` — não é defeito da barra, é a leitura pegando a
     página no meio da transição de montagem (o escopo nasce liberado no HTML e o
     cliente o devolve para `false`), e o atraso do stagger da barra é o maior de
     todos, então ela ainda não tinha começado a apagar. Por isso o estado de
     partida DE VERDADE é medido mais abaixo, em `partidaForcada`, com a seção
     assentada e o atributo escrito à mão. */
  const antes = await p.evaluate(() => {
    const s = document.querySelector('section[aria-labelledby="labs-solucoes"]');
    const g = (sel) => {
      const el = s?.querySelector(sel);
      if (!el) return null;
      const e = getComputedStyle(el);
      return { opacity: Math.round(Number(e.opacity) * 1000) / 1000, transform: e.transform };
    };
    const path = s?.querySelector('.labs-desenvolvemos-fio path');
    return {
      dataIn: s?.querySelector('[data-in]')?.getAttribute('data-in'),
      titulo: g('.labs-desenvolvemos-titulo'),
      heroi: g('.labs-guru'),
      cartao1: g('.labs-solucao-cartao'),
      barra: g('.labs-desenvolvemos-barra'),
      fioDashoffset: path ? getComputedStyle(path).strokeDashoffset : null,
    };
  });

  await p.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), SEC);
  await p.waitForTimeout(1800);

  const m = await p.evaluate(PECAS);
  if (!m) {
    res.erros.push(`${width}: seção não encontrada`);
    await ctx.close();
    continue;
  }
  m.antesDeEntrar = antes;

  /* O ESTADO DE PARTIDA, deterministicamente: escrevo `data-in="false"` no escopo,
     espero a transição inteira e leio. É isto que prova que a entrada existe e que
     cada peça parte de onde a issue pede (herói pela direita, cartões pela
     esquerda, título e barra de baixo, fio por desenhar). Sem isto, «tem reveal»
     seria afirmação sobre um instante que a sonda não controla. */
  m.partidaForcada = await p.evaluate(async () => {
    const s = document.querySelector('section[aria-labelledby="labs-solucoes"]');
    const escopo = s?.querySelector('[data-in]');
    escopo?.setAttribute('data-in', 'false');
    await new Promise((r) => setTimeout(r, 1800));
    const g = (sel) => {
      const el = s?.querySelector(sel);
      if (!el) return null;
      const e = getComputedStyle(el);
      return { opacity: Math.round(Number(e.opacity) * 1000) / 1000, transform: e.transform };
    };
    const path = s?.querySelector('.labs-desenvolvemos-fio path');
    const out = {
      dataIn: escopo?.getAttribute('data-in'),
      titulo: g('.labs-desenvolvemos-titulo'),
      risco: g('.labs-desenvolvemos-risco'),
      heroi: g('.labs-guru'),
      cartoes: [...s.querySelectorAll('.labs-solucao-cartao')].map((c) => {
        const e = getComputedStyle(c);
        return { opacity: Math.round(Number(e.opacity) * 1000) / 1000, transform: e.transform };
      }),
      barra: g('.labs-desenvolvemos-barra'),
      fioDashoffset: path ? getComputedStyle(path).strokeDashoffset : null,
    };
    escopo?.setAttribute('data-in', 'true');
    await new Promise((r) => setTimeout(r, 1800));
    return out;
  });

  /* Item 3 — hover, nas quatro peças que a issue nomeia. */
  m.hover = {};
  for (const [nome, sel] of [
    ['heroi', '.labs-guru'],
    ['cartao', '.labs-solucao-cartao'],
    ['botaoGuru', '.labs-guru-botao'],
    ['botaoBarra', '.labs-desenvolvemos-barra-botao'],
  ]) {
    /* TRAZER A PEÇA PARA A TELA antes de mover o ponteiro. `boundingBox` devolve
       coordenada de VIEWPORT, e a 390 o botão da barra fica em y≈1101 numa janela
       de 900 — a primeira volta desta sonda mandou o mouse para fora da tela e
       registrou «hover não muda nada», o que teria passado por defeito de CSS. */
    await p
      .locator(sel)
      .first()
      .scrollIntoViewIfNeeded()
      .catch(() => null);
    await p.waitForTimeout(500);
    const repouso = await p.evaluate(POSE_HOVER, sel);
    const caixa = await p.locator(sel).first().boundingBox().catch(() => null);
    let comHover = null;
    if (caixa) {
      await p.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      await p.waitForTimeout(800);
      comHover = await p.evaluate(POSE_HOVER, sel);
      await p.mouse.move(2, 2);
      await p.waitForTimeout(600);
    }
    m.hover[nome] = { repouso, comHover };
  }

  await p.locator(SEC).screenshot({ path: `docs/capturas/sis291-secao-${width}.png` });

  /* Item 4 — via ATRIBUTO, com hover REAL aplicado: conferir o CSS não prova que
     a regra vence a do bloco de hover. */
  await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  const caixaHeroi = await p.locator('.labs-guru').boundingBox().catch(() => null);
  if (caixaHeroi) {
    await p.mouse.move(caixaHeroi.x + caixaHeroi.width / 2, caixaHeroi.y + caixaHeroi.height / 2);
    await p.waitForTimeout(800);
  }
  m.reduceAtributo = {
    heroi: await p.evaluate(POSE_HOVER, '.labs-guru'),
    fio: await p.evaluate(() => {
      const path = document.querySelector('.labs-desenvolvemos-fio path');
      return path
        ? {
            dashoffset: getComputedStyle(path).strokeDashoffset,
            transition: getComputedStyle(path).transition,
          }
        : null;
    }),
  };
  await p.mouse.move(2, 2);
  await ctx.close();

  /* Item 4 — via @MEDIA, que é flag de contexto e exige contexto novo. */
  const ctxR = await nav.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await ctxR.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const pr = await ctxR.newPage();
  await pr.goto(`${BASE}/sistran-labs`, { waitUntil: 'networkidle' });
  await pr
    .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
    .catch(() => null);
  await pr.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), SEC);
  await pr.waitForTimeout(1600);
  const cr = await pr.locator('.labs-guru').boundingBox().catch(() => null);
  if (cr) {
    await pr.mouse.move(cr.x + cr.width / 2, cr.y + cr.height / 2);
    await pr.waitForTimeout(800);
  }
  m.reduceMedia = {
    heroi: await pr.evaluate(POSE_HOVER, '.labs-guru'),
    cartao: await pr.evaluate(POSE_HOVER, '.labs-solucao-cartao'),
    fio: await pr.evaluate(() => {
      const path = document.querySelector('.labs-desenvolvemos-fio path');
      return path ? { dashoffset: getComputedStyle(path).strokeDashoffset } : null;
    }),
    /* Em reduce o CONTEÚDO tem de estar visível — não é só o movimento que para. */
    opacidades: await pr.evaluate(() =>
      ['.labs-desenvolvemos-titulo', '.labs-guru', '.labs-solucao-cartao', '.labs-desenvolvemos-barra'].map(
        (s) => {
          const el = document.querySelector(s);
          return { sel: s, opacity: el ? getComputedStyle(el).opacity : null };
        },
      ),
    ),
  };
  await ctxR.close();

  /* Contraste sobre a folha clara e sobre o branco das peças. */
  /* PIOR PARADA do degradê da cápsula: `linear-gradient(150deg, #fff 35%, #eef7ff)`
     tem duas, e o contraste mais baixo é contra a mais escura. Ler a lista e pegar
     a de menor luminância é o que faz o número valer para o pixel inteiro, e não
     só para o canto onde o branco é puro. */
  const paradas = [...(m.letreiro?.degradeDaCapsula ?? '').matchAll(/rgba?\([^)]+\)/g)]
    .map((x) => RGB(x[0]))
    .filter((c) => c.length === 3 && !(c[0] === 0 && c[1] === 0 && c[2] === 0));
  const piorParada = paradas.sort((a, b) => LUM(a) - LUM(b))[0] ?? [255, 255, 255];
  m.contraste = {
    piorParadaDaCapsula: piorParada,
    letreiroForte: CONTRASTE(RGB(m.letreiro?.corForte), piorParada),
    letreiroFraco: CONTRASTE(RGB(m.letreiro?.corFraco), piorParada),
    nomeDoCartao: CONTRASTE(RGB(m.cartoes[0]?.cor), RGB(m.cartoes[0]?.fundo)),
    textoDoCartao: CONTRASTE(RGB(m.cartoes[0]?.corTexto), RGB(m.cartoes[0]?.fundo)),
  };

  /* Item 1 — as RELAÇÕES, que é o que «duas colunas» quer dizer. */
  const ys = m.cartoes.map((c) => c.caixa.y);
  m.geometria = {
    duasColunas: Boolean(m.heroi && m.cartoes[0] && m.heroi.x + m.heroi.w <= m.cartoes[0].caixa.x + 1),
    heroiAEsquerda: Boolean(m.heroi && m.cartoes[0] && m.heroi.x < m.cartoes[0].caixa.x),
    cartoesEmOrdem: ys.every((y, i) => i === 0 || y > ys[i - 1]),
    /* A cascata da referência: o do meio avança à direita. */
    cascata: m.cartoes.map((c) => c.caixa.x),
    barraAbaixoDeTudo: Boolean(
      m.barra && m.heroi && m.barra.caixa.y > m.heroi.y + m.heroi.h - 1 && m.barra.caixa.y > Math.max(...ys),
    ),
    produtosNomeados: 1 + m.cartoes.length,
  };

  res.porLargura[width] = m;
}

await nav.close();
await writeFile('docs/medidas/sis291-depois.json', `${JSON.stringify(res, null, 1)}\n`, 'utf8');

for (const width of LARGURAS) {
  const m = res.porLargura[width];
  if (!m) continue;
  console.log(`\n======== ${width}`);
  console.log(` secao      ${JSON.stringify(m.secao)}`);
  console.log(` geometria  ${JSON.stringify(m.geometria)}`);
  console.log(` heroi      ${JSON.stringify(m.heroi)}`);
  console.log(` arte       ${JSON.stringify(m.arte)}`);
  console.log(` letreiro   ${JSON.stringify(m.letreiro)}`);
  console.log(` botaoGuru  ${JSON.stringify(m.botaoGuru)}`);
  for (const c of m.cartoes) console.log(` cartao     ${JSON.stringify(c)}`);
  console.log(` fio        ${JSON.stringify(m.fio)}`);
  console.log(` barra      ${JSON.stringify(m.barra)}`);
  console.log(` grafismo   ${JSON.stringify(m.grafismo)}`);
  console.log(` antes      ${JSON.stringify(m.antesDeEntrar)}`);
  console.log(` partida    ${JSON.stringify(m.partidaForcada)}`);
  console.log(` stagger    ${JSON.stringify(m.stagger)}`);
  for (const [k, v] of Object.entries(m.hover)) {
    console.log(` hover ${k}`);
    console.log(`    repouso ${JSON.stringify(v.repouso)}`);
    console.log(`    hover   ${JSON.stringify(v.comHover)}`);
  }
  console.log(` reduce[attr]  ${JSON.stringify(m.reduceAtributo)}`);
  console.log(` reduce[media] ${JSON.stringify(m.reduceMedia)}`);
  console.log(` contraste  ${JSON.stringify(m.contraste)}`);
  console.log(` brancas ${m.classesBrancas} vaza ${m.vaza} (${m.scrollWidth}/${m.clientWidth})`);
  console.log(` rede       ${JSON.stringify(res.rede[width])}`);
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
