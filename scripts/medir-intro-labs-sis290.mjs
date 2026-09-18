/**
 * SIS-290 — «/sistran-labs · intro `nativos digitais`: fundo igual ao O PROGRAMA».
 *
 * `node scripts/medir-intro-labs-sis290.mjs`            (`next dev` em :3000)
 * `ETAPA=antes node scripts/medir-intro-labs-sis290.mjs` grava o arquivo `-antes`
 *
 * A issue troca uma superfície, e superfície tem três riscos que captura nenhuma
 * resolve sozinha:
 *
 *  1. «MESMO FUNDO DO O PROGRAMA» é afirmação COMPARATIVA. Então a sonda abre as
 *     duas rotas na mesma passada e lê o `background` computado das duas seções
 *     MAIS o pixel PINTADO no mesmo ponto relativo (12% e 50% e 88% da largura, a
 *     meia altura). Fundo resolvido contra a caixa não é comparável entre seções
 *     de alturas diferentes; o pixel é.
 *  2. CONTRASTE. Tirar `text-white/85` sem medir é trocar texto invisível por
 *     texto invisível. A sonda calcula a razão WCAG entre a cor computada de cada
 *     parágrafo e o pixel de fundo LOGO ATRÁS dele (não a cor nominal da seção —
 *     a grade de `.section-light::before` e as radiais mudam o pixel por posição).
 *     Mede também os dois `<span class="uppercase">`, que são nós de texto
 *     separados e poderiam ficar de fora dos overrides.
 *  3. AS DUAS EMENDAS. Este bloco fica ENTRE dois navy — o hero acima e «Já
 *     desenvolvemos muitas soluções» abaixo. São duas fronteiras, e cada uma pode
 *     virar listra. Medidas pixel a pixel, contíguo, de −40 a +40 da borda:
 *     `saltoDe1px` é o maior degrau entre pixels VIZINHOS. Amostra a 16px de
 *     distância não distingue LISTRA de RAMPA, e é a listra que incomoda.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ETAPA = process.env.ETAPA ?? 'depois';
const LARGURAS = (process.env.LARGURAS ?? '1440,390').split(',').map(Number);

/* Alvo por rota: a seção a medir e o nome curto para o relatório. */
const ALVOS = [
  { rota: '/sistran-labs', sel: 'section[aria-labelledby="labs-o-que-e"]', nome: 'labs-intro' },
  { rota: '/sistran-university', sel: '#university-programa', nome: 'programa' },
];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const MEDIR = (sel) =>
  ((doc, win, seletor) => {
    const n = (v) => Math.round(v * 10) / 10;
    const secao = doc.querySelector(seletor);
    if (!secao) return null;
    const e = win.getComputedStyle(secao);
    const b = secao.getBoundingClientRect();

    /* Os nós de texto do bloco, com a cor que o navegador REALMENTE aplica. Se um
       override de `.section-light` não alcançar um deles, é aqui que aparece. */
    const textos = [...secao.querySelectorAll('p, span, h2, h3, strong')]
      .filter((el) => el.textContent.trim().length > 0)
      .map((el) => {
        const ce = win.getComputedStyle(el);
        const cb = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          classes: typeof el.className === 'string' ? el.className.slice(0, 40) : null,
          cor: ce.color,
          tamanho: ce.fontSize,
          peso: ce.fontWeight,
          /* Ponto para amostrar o fundo atrás deste texto, em coordenadas de
             página: um pouco à ESQUERDA do começo da linha, onde não há glifo. */
          amostra: { x: n(cb.left + 4), y: n(cb.top + cb.height / 2 + win.scrollY) },
          trecho: el.textContent.trim().slice(0, 34),
        };
      });

    return {
      classes: secao.className,
      fundo: e.backgroundImage.slice(0, 120),
      fundoCor: e.backgroundColor,
      sombra: e.boxShadow,
      /* `::before` é a grade técnica de `.section-light`: sem ela a folha é lisa e
         não é «a superfície da casa» que a issue pede. `content` é a única
         propriedade que prova a existência de um pseudo. */
      grade: (() => {
        const p = win.getComputedStyle(secao, '::before');
        return {
          existe: p.content !== 'none',
          imagem: p.backgroundImage.slice(0, 70),
          modulo: p.backgroundSize,
          ancora: p.backgroundAttachment,
        };
      })(),
      caixa: { topo: n(b.top + win.scrollY), h: n(b.height), w: n(b.width) },
      /* Quem está imediatamente acima e abaixo: as duas emendas. */
      vizinhas: {
        acima: (() => {
          const a = secao.previousElementSibling;
          if (!a) return null;
          return {
            tag: a.tagName,
            classes: typeof a.className === 'string' ? a.className.slice(0, 60) : null,
          };
        })(),
        abaixo: (() => {
          const a = secao.nextElementSibling;
          if (!a) return null;
          return {
            tag: a.tagName,
            classes: typeof a.className === 'string' ? a.className.slice(0, 60) : null,
          };
        })(),
      },
      textos,
      vaza: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
    };
  })(document, window, sel);

const res = { issue: 'SIS-290', etapa: ETAPA, erros: [], porLargura: {} };
const nav = await chromium.launch();

/* Um tiro de página inteira por rota/largura, e todas as amostras de pixel saem
   DELE: rolar entre amostras mudaria a fase da grade, que é
   `background-attachment: fixed` — a malha é ancorada na JANELA, então o pixel
   depende de onde a página estava. Com a captura de página inteira a fase é uma
   só e as leituras são comparáveis. */
const lumDe = (data, info) => (x, y) => {
  const xi = Math.max(0, Math.min(info.width - 1, Math.round(x)));
  const yi = Math.max(0, Math.min(info.height - 1, Math.round(y)));
  const i = (yi * info.width + xi) * info.channels;
  return {
    rgb: [data[i], data[i + 1], data[i + 2]],
    l: Math.round((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) * 10) / 10,
  };
};

/* Luminância relativa WCAG — NÃO a luminância simples de cima. A razão de
   contraste exige a linearização por canal (`gamma`), e usar a versão simples
   inflaria os números num par claro. */
const relativa = ([r, g, b]) => {
  const c = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const razao = (a, b) => {
  const [x, y] = [relativa(a), relativa(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const corDeTexto = (css) => {
  const m = css.match(/-?[\d.]+/g).map(Number);
  return [m[0], m[1], m[2]];
};

for (const width of LARGURAS) {
  res.porLargura[width] = {};

  for (const { rota, sel, nome } of ALVOS) {
    const ctx = await nav.newContext({ viewport: { width, height: 900 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    const p = await ctx.newPage();
    p.on('console', (m) => {
      if (m.type() === 'error') res.erros.push(`${width} ${rota}: ${m.text()}`);
    });
    await p.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
    await p
      .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
      .catch(() => null);
    await p.evaluate(() => document.fonts.ready);
    /* O `data-reveal` da rota de referência começa em `opacity: 0`: sem passar a
       seção pela tela, o texto do Programa seria medido invisível e o contraste
       sairia contra o fundo. Rolar até o fim e voltar ao topo aciona tudo. */
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(800);

    const m = await p.evaluate(MEDIR, sel);
    if (!m) {
      res.erros.push(`${width} ${rota}: seção ${sel} não encontrada`);
      await ctx.close();
      continue;
    }

    const tiro = await p.screenshot({ fullPage: true });
    const { data, info } = await sharp(tiro).ensureAlpha().raw().toBuffer({
      resolveWithObject: true,
    });
    const em = lumDe(data, info);

    /* Item 1 — o pixel do fundo em três colunas, a meia altura da seção. */
    const meio = m.caixa.topo + m.caixa.h / 2;
    m.pixelDoFundo = [0.12, 0.5, 0.88].map((f) => {
      const q = em(width * f, meio);
      return { emX: `${Math.round(f * 100)}%`, rgb: q.rgb, l: q.l };
    });

    /* Item 2 — contraste de cada nó de texto contra o pixel ATRÁS dele. */
    m.textos = m.textos.map((t) => {
      const fundo = em(t.amostra.x, t.amostra.y);
      return {
        ...t,
        fundoAtras: fundo.rgb,
        contraste: razao(corDeTexto(t.cor), fundo.rgb),
      };
    });

    /* Item 3 — as duas emendas, contíguas. */
    const perfilEm = (y0) => {
      const amostras = [];
      for (let d = -40; d <= 40; d += 1) amostras.push({ dy: d, ...em(width / 2, y0 + d) });
      const saltos = amostras.slice(1).map((a, i) => Math.abs(a.l - amostras[i].l));
      const pior = saltos.indexOf(Math.max(...saltos));
      return {
        saltoDe1px: Math.round(Math.max(...saltos) * 10) / 10,
        saltoDe1pxEm: amostras[pior].dy,
        rampaTotal: Math.round((amostras.at(-1).l - amostras[0].l) * 10) / 10,
        perfil: amostras.filter((a) => a.dy % 10 === 0).map((a) => [a.dy, a.l]),
      };
    };
    m.emendas = {
      topo: perfilEm(m.caixa.topo),
      base: perfilEm(m.caixa.topo + m.caixa.h),
    };

    res.porLargura[width][nome] = m;

    const alvo = await p.$(sel);
    if (alvo) {
      await alvo.screenshot({ path: `docs/capturas/sis290-${nome}-${width}-${ETAPA}.png` });
    }
    await ctx.close();
  }
}

await nav.close();
await writeFile(
  `docs/medidas/sis290-${ETAPA}.json`,
  `${JSON.stringify(res, null, 1)}\n`,
  'utf8',
);

for (const width of LARGURAS) {
  console.log(`\n======== ${width}`);
  for (const { nome } of ALVOS) {
    const m = res.porLargura[width][nome];
    if (!m) continue;
    console.log(` ${nome}  ${m.classes}`);
    console.log(`    fundo    ${m.fundo}`);
    console.log(`    cor/somb ${m.fundoCor} · ${m.sombra}`);
    console.log(`    grade    ${JSON.stringify(m.grade)}`);
    console.log(`    caixa    ${JSON.stringify(m.caixa)} vaza ${m.vaza}`);
    console.log(`    vizinhas ${JSON.stringify(m.vizinhas)}`);
    console.log(`    pixel    ${JSON.stringify(m.pixelDoFundo)}`);
    for (const t of m.textos) {
      console.log(
        `    · ${t.tag.padEnd(6)} ${String(t.tamanho).padEnd(6)} ${t.cor.padEnd(22)} atras ${JSON.stringify(t.fundoAtras).padEnd(18)} contraste ${String(t.contraste).padEnd(6)} ${JSON.stringify(t.trecho)}`,
      );
    }
    console.log(
      `    emenda topo salto1px ${m.emendas.topo.saltoDe1px} em ${m.emendas.topo.saltoDe1pxEm} · rampa ${m.emendas.topo.rampaTotal} · ${JSON.stringify(m.emendas.topo.perfil)}`,
    );
    console.log(
      `    emenda base salto1px ${m.emendas.base.saltoDe1px} em ${m.emendas.base.saltoDe1pxEm} · rampa ${m.emendas.base.rampaTotal} · ${JSON.stringify(m.emendas.base.perfil)}`,
    );
  }
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
