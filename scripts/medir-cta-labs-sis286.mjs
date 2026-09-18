/**
 * SIS-286 — «/sistran-labs · Fale com a Gente! igual ao de /sistran-university».
 *
 * `node scripts/medir-cta-labs-sis286.mjs`   (`next dev` em :3000)
 *
 * A mudança é de duas props, então o risco NÃO está no que eu escrevi: está em
 * três coisas que só aparecem medindo.
 *
 *  1. «IGUAL AO DE `/sistran-university`» é uma afirmação COMPARATIVA. Então a
 *     sonda abre as duas rotas na mesma passada e devolve as peças da referência
 *     lado a lado — cartão, fio (com o `stroke-dashoffset` que o GSAP escreve),
 *     blob, selo, botão e o círculo do botão — em vez de eu afirmar semelhança a
 *     partir de uma captura. Igualdade de peças e de estilo computado; a LARGURA
 *     não tem de bater ao pixel entre rotas só se o container diferir, e por isso
 *     ela é impressa, não comparada às cegas.
 *  2. A EMENDA É CASO NOVO nesta rota. Em `/esg` e na University a seção acima do
 *     fecho é navy, e o topo claro da referência lê como uma subida. Aqui a de
 *     cima é `section-light section-light-blue` — CLARO CONTRA CLARO, e o pé dela
 *     desce a `#cfe7f7` enquanto o topo do fecho é quase branco. Isso vira número
 *     amostrando o PIXEL da captura em cinco alturas atravessando a fronteira:
 *     se houver listra, ela aparece como salto entre duas amostras vizinhas.
 *     `saltoMaximo` é a maior diferença de luminância entre amostras adjacentes.
 *  3. «Outras páginas intactas» — `/esg` tem de continuar COM a referência e as
 *     rotas legadas SEM ela. Medido em `/quem-somos` e `/blog`: `temReferencia`
 *     false e o cartão navy presente. Se as props tivessem virado default no
 *     componente, essas duas acusariam.
 *
 * E o critério do modal: o botão é clicado de verdade e o `ContactModal` é
 * procurado no DOM depois — `contatoNoModal` ligado sem o modal montando seria um
 * botão morto, pior que o link antigo.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const COM_REFERENCIA = ['/sistran-labs', '/sistran-university', '/esg'];
const LEGADAS = ['/quem-somos', '/blog'];
const LARGURAS = (process.env.LARGURAS ?? '1440,390').split(',').map(Number);

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const PECAS = () =>
  ((doc, win) => {
    const n = (v) => Math.round(v * 10) / 10;
    const secao = doc.querySelector('section.cta-ref');
    const legado = doc.querySelector('.cta-entrada-b');

    const peca = (sel, extra) => {
      const el = doc.querySelector(sel);
      if (!el) return null;
      const e = win.getComputedStyle(el);
      const b = el.getBoundingClientRect();
      const base = { existe: true, w: n(b.width), h: n(b.height) };
      for (const k of extra ?? []) base[k] = e[k];
      return base;
    };

    return {
      temReferencia: Boolean(secao),
      /* O cartão navy do caminho antigo. Presente nas legadas, ausente aqui — é o
         par que prova que a bifurcação é por rota e não global. */
      temCartaoNavyLegado: Boolean(legado),
      secao: secao
        ? {
            classes: secao.className,
            fundo: win.getComputedStyle(secao).backgroundImage.slice(0, 60),
            sombra: win.getComputedStyle(secao).boxShadow,
            caixa: (() => {
              const b = secao.getBoundingClientRect();
              return { topo: n(b.top + win.scrollY), h: n(b.height), w: n(b.width) };
            })(),
          }
        : null,
      cartao: peca('.cta-ref-cartao', ['backdropFilter', 'borderTopWidth', 'borderRadius']),
      /* O fio é a peça animada: `stroke-dashoffset` em 0 significa que o GSAP
         terminou de desenhar. Um fio que ficasse no offset cheio estaria invisível
         e a captura não denunciaria (é ciano fino sobre claro). */
      fio: (() => {
        const t = doc.querySelector('.cta-ref-fio-traco');
        if (!t) return null;
        const e = win.getComputedStyle(t);
        return {
          existe: true,
          cor: e.stroke,
          largura: e.strokeWidth,
          dasharray: e.strokeDasharray.slice(0, 40),
          dashoffset: Math.round(parseFloat(e.strokeDashoffset) || 0),
        };
      })(),
      pontoDoFio: peca('.cta-ref-fio-ponto', ['fill', 'opacity']),
      blob: peca('.cta-ref-blob'),
      selo: peca('.cta-ref-selo'),
      botao: (() => {
        const el = doc.querySelector('.cta-ref-botao');
        if (!el) return null;
        const e = win.getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return {
          existe: true,
          tag: el.tagName,
          rotulo: el.textContent.trim(),
          w: n(b.width),
          h: n(b.height),
          fundo: e.backgroundColor,
          cor: e.color,
        };
      })(),
      circuloDoBotao: peca('.cta-ref-botao-circulo', ['backgroundColor']),
      /* O MESMO formato do bloco de hover, em repouso — sem o par, «translate 6px»
         não provaria movimento nenhum. */
      botaoEmRepouso: (() => {
        const b = doc.querySelector('.cta-ref-botao');
        if (!b) return null;
        const e = win.getComputedStyle(b);
        const antes = win.getComputedStyle(doc.querySelector('.cta-ref-botao-circulo'), '::before');
        return {
          translate: e.translate,
          varX: e.getPropertyValue('--cta-ref-botao-x').trim(),
          fundo: e.backgroundColor,
          circuloAntes: { transform: antes.transform, opacidade: antes.opacity },
        };
      })(),
      titulo: doc.querySelector('.cta-ref-titulo')?.textContent.trim() ?? null,
      texto: doc.querySelector('.cta-ref-texto')?.textContent.trim() ?? null,
      /* A seção IMEDIATAMENTE acima do fecho, para a emenda: quem é e onde
         termina. */
      secaoDeCima: (() => {
        if (!secao) return null;
        const ant = secao.previousElementSibling;
        if (!ant) return null;
        const b = ant.getBoundingClientRect();
        return {
          classes: typeof ant.className === 'string' ? ant.className : null,
          fim: n(b.bottom + win.scrollY),
        };
      })(),
      vaza: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
    };
  })(document, window);

const res = { issue: 'SIS-286', erros: [], porLargura: {} };
const nav = await chromium.launch();

const abrir = async (width, rota) => {
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
  /* O fio é desenhado por `ScrollTrigger` com gatilho no cartão: sem trazer o
     bloco para a tela, ele ficaria no offset cheio e a medição do item 1 sairia
     de um fio que a página nunca mostrou assim. */
  await p.evaluate(() =>
    (document.querySelector('section.cta-ref') ?? document.querySelector('footer'))?.scrollIntoView(
      { block: 'center' },
    ),
  );
  await p.waitForTimeout(1800);
  return { ctx, p };
};

for (const width of LARGURAS) {
  res.porLargura[width] = {};

  for (const rota of [...COM_REFERENCIA, ...LEGADAS]) {
    const { ctx, p } = await abrir(width, rota);
    const m = await p.evaluate(PECAS);

    /* A EMENDA, item 2. Cinco alturas atravessando a fronteira entre a seção de
       cima e o fecho, no meio horizontal da janela: −24, −8, +8, +24, +48 px da
       borda. Amostradas da captura de página, não do `getComputedStyle` — o que
       interessa é a cor PINTADA, que é a soma do fundo com as duas sombras de
       54px que se sobrepõem ali. */
    if (m.temReferencia) {
      const y0 = m.secao.caixa.topo;
      /* Pixel a pixel, de −40 a +40. A primeira volta amostrava cinco alturas e
         devolvia «salto 16,5» entre as amostras de −8 e +8 — mas 16 pixels de
         distância não distinguem uma LISTRA (degrau de 1px) de uma RAMPA (a
         mesma diferença distribuída), e é a listra que a issue proíbe. Só a
         leitura contígua responde. */
      const desvios = [];
      for (let d = -40; d <= 40; d += 1) desvios.push(d);
      const alto = Math.max(...desvios) - Math.min(...desvios) + 1;
      await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), y0);
      await p.waitForTimeout(400);
      const deslocamento = await p.evaluate(() => window.scrollY);
      const tiro = await p.screenshot({
        clip: {
          x: Math.round(width / 2) - 2,
          y: y0 - deslocamento + Math.min(...desvios),
          width: 4,
          height: alto,
        },
      });
      const { data, info } = await sharp(tiro).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      });
      const lum = (dy) => {
        const y = dy - Math.min(...desvios);
        const i = (y * info.width + 2) * info.channels;
        return {
          dy,
          rgb: [data[i], data[i + 1], data[i + 2]],
          l: Math.round((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) * 10) / 10,
        };
      };
      const amostras = desvios.map(lum);
      const saltos = amostras.slice(1).map((a, i) => Math.abs(a.l - amostras[i].l));
      const piorEm = saltos.indexOf(Math.max(...saltos));
      m.emenda = {
        /* Impresso decimado de 8 em 8 para caber no console; o perfil inteiro fica
           no JSON. */
        perfil: amostras.filter((a) => a.dy % 8 === 0).map((a) => [a.dy, a.l]),
        /* O NÚMERO do critério: maior degrau entre pixels VIZINHOS. Listra é
           degrau de 1px; rampa é a mesma diferença distribuída, e rampa é o que a
           SIS-93 quis. */
        saltoDe1px: Math.round(Math.max(...saltos) * 10) / 10,
        saltoDe1pxEm: amostras[piorEm].dy,
        rampaTotal: Math.round((amostras.at(-1).l - amostras[0].l) * 10) / 10,
      };
    }

    /* O MODAL, clicado de verdade. */
    if (m.temReferencia && width === 1440) {
      const b = await p.locator('.cta-ref-botao').boundingBox();
      if (b) {
        await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
        await p.waitForTimeout(500);
        /* `translate` e o pseudo do círculo — NÃO `transform`. A primeira volta lia
           `transform` do botão e do círculo e devolvia `none` nas três rotas: o
           hover da referência move o botão pela propriedade INDEPENDENTE
           `translate` (via `--cta-ref-botao-x: 6px`, `globals.css:24002`) e acende
           o `::before` do círculo. Ler a propriedade errada daria «hover morto»
           também em `/esg`, que está entregue. */
        m.botaoEmHover = await p.evaluate(() => {
          const b = document.querySelector('.cta-ref-botao');
          const e = getComputedStyle(b);
          const antes = getComputedStyle(document.querySelector('.cta-ref-botao-circulo'), '::before');
          return {
            translate: e.translate,
            varX: e.getPropertyValue('--cta-ref-botao-x').trim(),
            fundo: e.backgroundColor,
            circuloAntes: { transform: antes.transform, opacidade: antes.opacity },
          };
        });
        if (rota === '/sistran-labs') {
          const alvo = await p.$('section.cta-ref');
          if (alvo) await alvo.screenshot({ path: `docs/capturas/sis286-labs-hover-${width}.png` });
        }
        await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
        await p.waitForTimeout(900);
        /* `dialog[open]` e NÃO `[role="dialog"]`: o `ContactModal` é um `<dialog>`
           NATIVO aberto com `showModal()` (ver o cabeçalho do componente), e o
           papel implícito não aparece como atributo. A primeira volta desta sonda
           procurava o atributo e devolveu `abriu: false` nas TRÊS rotas —
           inclusive em `/esg`, que está entregue desde a SIS-142. Falso negativo
           da sonda, não defeito do botão. */
        m.modal = await p.evaluate(() => {
          const d = document.querySelector('dialog[open]');
          if (!d) return { abriu: false };
          return {
            abriu: true,
            modal: d.matches(':modal'),
            rotulo: d.getAttribute('aria-label') ?? d.querySelector('h2,h3')?.textContent?.trim(),
            altura: Math.round(d.getBoundingClientRect().height),
          };
        });
        await p.keyboard.press('Escape');
        await p.waitForTimeout(400);
      }
    }

    res.porLargura[width][rota] = m;

    if (m.temReferencia && (rota === '/sistran-labs' || rota === '/sistran-university')) {
      const alvo = await p.$('section.cta-ref');
      if (alvo) {
        await alvo.screenshot({
          path: `docs/capturas/sis286-${rota.slice(1)}-${width}.png`,
        });
      }
    }
    await ctx.close();
  }
}

await nav.close();
await writeFile('docs/medidas/sis286-depois.json', `${JSON.stringify(res, null, 1)}\n`, 'utf8');

for (const width of LARGURAS) {
  console.log(`\n======== ${width}`);
  for (const rota of [...COM_REFERENCIA, ...LEGADAS]) {
    const m = res.porLargura[width][rota];
    if (!m) continue;
    console.log(
      ` ${rota.padEnd(22)} ref ${String(m.temReferencia).padEnd(5)} navyLegado ${String(m.temCartaoNavyLegado).padEnd(5)} vaza ${m.vaza}`,
    );
    if (!m.temReferencia) continue;
    console.log(`    titulo   ${JSON.stringify(m.titulo)}`);
    console.log(`    texto    ${JSON.stringify(m.texto)}`);
    console.log(`    cartao   ${JSON.stringify(m.cartao)}`);
    console.log(`    fio      ${JSON.stringify(m.fio)} ponto ${JSON.stringify(m.pontoDoFio)}`);
    console.log(`    blob     ${JSON.stringify(m.blob)} selo ${JSON.stringify(m.selo)}`);
    console.log(`    botao    ${JSON.stringify(m.botao)}`);
    console.log(`    circulo  ${JSON.stringify(m.circuloDoBotao)}`);
    console.log(`    repouso  ${JSON.stringify(m.botaoEmRepouso)}`);
    if (m.botaoEmHover) console.log(`    hover    ${JSON.stringify(m.botaoEmHover)}`);
    if (m.modal) console.log(`    modal    ${JSON.stringify(m.modal)}`);
    console.log(`    de cima  ${JSON.stringify(m.secaoDeCima)}`);
    if (m.emenda) console.log(`    emenda   salto1px ${m.emenda.saltoDe1px} em dy ${m.emenda.saltoDe1pxEm} · rampa ${m.emenda.rampaTotal} · ${JSON.stringify(m.emenda.perfil)}`);
  }
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
