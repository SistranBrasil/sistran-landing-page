/**
 * SIS-287 — «/sistran-labs · navbar com duas logos (Labs | Sistran)».
 *
 * `node scripts/medir-marcas-labs-sis287.mjs`   (`next dev` em :3000)
 *
 * A issue tem dois riscos, e nenhum dos dois se vê numa captura só:
 *
 *  1. ESTOURO DA PÍLULA. O par da Labs é mais largo que o da University (razão de
 *     tinta 4,39 contra 3,05) e a 1440 o cabeçalho já fechava com 13,5px de
 *     sobra. Então a sonda soma a caixa: `conteudo` = largura do header menos o
 *     respiro, contra `par + mr-3 + botão + menu`, e devolve `sobra`. Negativa =
 *     estourou. Mede também 360, que é a janela onde o bloco mais aperta — a
 *     issue pede 390, mas 390 não é o pior caso.
 *  2. RETÂNGULO PRETO. O arquivo entregue não tem alfa (ver
 *     `scripts/gerar-marca-labs-header-sis287.mjs`). Aqui isso vira número
 *     amostrando o PIXEL da captura em quatro pontos de fundo DENTRO da caixa da
 *     marca: se o derivado estivesse errado, eles viriam perto de (0,0,0); com o
 *     recorte certo vêm no azul da pílula. `luminanciaDeFundo` é a média.
 *
 * E o critério 3, «outras rotas intactas»: as duas marcas e o divisor são medidos
 * em `/sistran-university` e em `/` na mesma passada. A University tem de sair
 * IGUAL ao que a SIS-279 deixou (34/42/30 e 22/27/19) e a home tem de continuar
 * com uma marca só — `temPar: false`.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROTAS = ['/sistran-labs', '/sistran-university', '/'];
const LARGURAS = (process.env.LARGURAS ?? '1440,1024,390,360').split(',').map(Number);

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const MEDIR = () =>
  ((doc, win) => {
    const n = (v) => Math.round(v * 10) / 10;
    const header = doc.querySelector('header');
    if (!header) return null;
    const ch = getComputedStyle(header);
    const cx = header.getBoundingClientRect();
    const conteudo = n(cx.width - parseFloat(ch.paddingLeft) - parseFloat(ch.paddingRight));

    /* O bloco da marca: ou o par (um `div` com dois links) ou o link único das
       demais rotas. Distinguidos pela contagem de `<a>` com marca dentro. */
    const bloco =
      header.querySelector('div.flex.flex-shrink-0.items-center') ??
      header.querySelector('a.inline-flex.flex-shrink-0');
    const marcas = [...(bloco?.querySelectorAll('img') ?? [])].map((img) => {
      /* A caixa que o layout mede é a do INVÓLUCRO recortado, não a do `<img>`,
         que é maior de propósito (a imagem vaza e o `overflow` corta). */
      const inv = img.closest('span.logo-glow') ?? img;
      const b = inv.getBoundingClientRect();
      return { alt: img.getAttribute('alt'), src: img.getAttribute('src'), w: n(b.width), h: n(b.height) };
    });
    const divisor = bloco?.querySelector('span[aria-hidden].w-px');
    const nav = header.querySelector('nav');
    const botao = [...header.querySelectorAll('button')].map((b) =>
      n(b.getBoundingClientRect().width),
    );

    /* A folga é GEOMÉTRICA, não uma soma de larguras e margens. A primeira volta
       desta sonda somava os filhos e devolvia −6 nas TRÊS rotas, inclusive na home
       que não mudou — o sinal de que o erro era da conta: `ml-auto` do `nav` e o
       botão de menu com `display: none` mas `ml-2` vivo entram na soma sem ocupar
       espaço. Ler a distância entre as caixas PINTADAS não tem esse problema. */
    const dir = cx.right - parseFloat(ch.paddingRight);
    const ultimo = [...header.children]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return cs.position !== 'absolute' && cs.display !== 'none';
      })
      .map((el) => el.getBoundingClientRect())
      .reduce((a, b) => (b.right > a.right ? b : a));
    const cxBloco = bloco?.getBoundingClientRect();
    const cxNav = nav && getComputedStyle(nav).display !== 'none' ? nav.getBoundingClientRect() : null;

    return {
      temPar: marcas.length > 1,
      conteudo,
      bloco: bloco ? n(bloco.getBoundingClientRect().width) : null,
      marcas,
      divisor: divisor ? n(divisor.getBoundingClientRect().height) : null,
      nav: nav && getComputedStyle(nav).display !== 'none' ? n(nav.getBoundingClientRect().width) : null,
      botoes: botao,
      /* OS DOIS NÚMEROS do risco 1, ambos têm de ser ≥ 0:
         · `folgaAteOMenu` — do fim do bloco de marcas ao começo do menu (a 1440);
           negativa = as marcas empurraram o menu.
         · `folgaNaDireita` — do último filho pintado à borda interna da pílula;
           negativa = algo saiu da pílula. */
      folgaAteOMenu: cxBloco && cxNav ? n(cxNav.left - cxBloco.right) : null,
      /* Abaixo de 1440 o `nav` não existe, e quem pode colidir com o bloco é o
         botão de menu. Sem esta linha o estreito ficaria sem número: a folga da
         direita mede o último filho contra a pílula, não o bloco contra o vizinho. */
      folgaAteOVizinho: (() => {
        if (!cxBloco) return null;
        const vizinhos = [...header.children]
          .filter((el) => {
            const cs = getComputedStyle(el);
            return cs.position !== 'absolute' && cs.display !== 'none' && el !== bloco;
          })
          .map((el) => el.getBoundingClientRect())
          .filter((b) => b.width > 0 && b.left >= cxBloco.left);
        if (!vizinhos.length) return null;
        return n(Math.min(...vizinhos.map((b) => b.left)) - cxBloco.right);
      })(),
      folgaNaDireita: n(dir - ultimo.right),
      vazaNaJanela: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
      caixaDaPrimeiraMarca: (() => {
        const inv = bloco?.querySelector('span.logo-glow');
        if (!inv) return null;
        const b = inv.getBoundingClientRect();
        return { x: n(b.x), y: n(b.y), w: n(b.width), h: n(b.height), dpr: win.devicePixelRatio };
      })(),
    };
  })(document, window);

const res = { issue: 'SIS-287', erros: [], porLargura: {} };
const nav = await chromium.launch();

for (const width of LARGURAS) {
  res.porLargura[width] = {};
  for (const rota of ROTAS) {
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
    /* A home esconde o header no topo absoluto (`hidden = isHome && !scrolled`):
       sem rolar, ele estaria invisível e a medição sairia de um fantasma. */
    await p.evaluate(() => window.scrollTo(0, 200));
    await p.waitForTimeout(900);
    const m = await p.evaluate(MEDIR);

    /* O NÚMERO do risco 2: quatro pontos de FUNDO dentro da caixa da marca. Se o
       retângulo preto tivesse sobrado, eles viriam escuros. */
    if (m?.caixaDaPrimeiraMarca && rota === '/sistran-labs') {
      const c = m.caixaDaPrimeiraMarca;
      const tiro = await p.screenshot({
        clip: { x: c.x, y: c.y, width: c.w, height: c.h },
      });
      /* `sharp` e não `canvas`: é o que a casa já usa nos scripts de arte, e
         basta ler pixel cru. */
      const { data, info } = await sharp(tiro).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      });
      const em = (x, y) => {
        const i = (y * info.width + x) * info.channels;
        return [data[i], data[i + 1], data[i + 2]];
      };
      /* Pontos de fundo: os quatro cantos internos, a 3px da borda — nesta arte a
         tinta está no meio e os cantos são vão. */
      const lidos = [
        em(3, 3),
        em(info.width - 4, 3),
        em(3, info.height - 4),
        em(info.width - 4, info.height - 4),
      ];
      m.fundoNaCaixa = lidos;
      m.luminanciaDeFundo =
        Math.round(
          (lidos.reduce((s, [r, g, b]) => s + 0.2126 * r + 0.7152 * g + 0.0722 * b, 0) /
            lidos.length) *
            10,
        ) / 10;
    }

    res.porLargura[width][rota] = m;
    if (width === 1440 || width === 390) {
      const h = await p.$('header');
      if (h) {
        await h.screenshot({
          path: `docs/capturas/sis287-${rota === '/' ? 'home' : rota.slice(1)}-${width}.png`,
        });
      }
    }
    await ctx.close();
  }
}

await nav.close();
await writeFile('docs/medidas/sis287-depois.json', `${JSON.stringify(res, null, 1)}\n`, 'utf8');

for (const width of LARGURAS) {
  console.log(`\n== ${width}`);
  for (const rota of ROTAS) {
    const m = res.porLargura[width][rota];
    if (!m) continue;
    console.log(
      ` ${rota.padEnd(20)} par ${String(m.temPar).padEnd(5)} bloco ${String(m.bloco).padEnd(6)} divisor ${String(m.divisor).padEnd(5)} nav ${String(m.nav).padEnd(6)} folgaAteOMenu ${String(m.folgaAteOMenu).padEnd(6)} folgaAteOVizinho ${String(m.folgaAteOVizinho).padEnd(6)} folgaNaDireita ${String(m.folgaNaDireita).padEnd(6)} vaza ${m.vazaNaJanela}`,
    );
    for (const mc of m.marcas) console.log(`    · ${mc.alt} ${mc.w}x${mc.h} ${mc.src}`);
    if (m.luminanciaDeFundo != null) {
      console.log(`    fundo na caixa ${JSON.stringify(m.fundoNaCaixa)} · luminância ${m.luminanciaDeFundo}`);
    }
  }
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
