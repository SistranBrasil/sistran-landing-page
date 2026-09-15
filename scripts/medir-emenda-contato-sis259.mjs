/**
 * SIS-259 — «retirar sombra branca entre logos e SAIBA MAIS…» em `/contato`.
 *
 * `node scripts/medir-emenda-contato-sis259.mjs [antes|depois]`
 *
 * O pedido é sobre uma MANCHA, então o portão tem de ser a cor dos pixels na
 * emenda, não a existência de uma regra CSS. O que se mede:
 *
 *  1. VARREDURA VERTICAL de uma coluna que passa FORA do cartão (à esquerda dele),
 *     do pé da faixa de logos para baixo. Enquanto a rampa existir, essas linhas
 *     leem claro decrescente (`#f5faff` dissolvendo) por ~140px; sem ela, a linha
 *     seguinte à faixa já tem de ser o azul do painel. O número que resume isso é
 *     `linhasClaras`: quantas linhas abaixo da faixa ainda têm luminância acima da
 *     do azul do topo do painel com folga.
 *
 *     A coluna é escolhida FORA do cartão de propósito: por trás dele qualquer
 *     rampa é invisível, e era justamente esse o defeito que o `padding-top`
 *     grande de `.fundo-contato-cena` existia para evitar.
 *
 *  2. O VÃO, número por número: pé da última logo -> topo do cartão. É o que o
 *     item 2 da issue manda encurtar quando a rampa sai, e é o mesmo número que a
 *     SIS-145 mediu (208px a 390, 230,4px a 1440).
 *
 *  3. AS OUTRAS FONTES DE BRANCO que a issue pede para conferir (item 3): a borda
 *     de baixo da faixa, a sombra dela, e o `::after` de `.lp-signals` — cada um
 *     poderia repor a listra depois da rampa sair.
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const rotulo = process.argv[2] === 'antes' ? 'antes' : 'depois';
const T = 'docs/medidas/.tmp259';
await mkdir(T, { recursive: true });
await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const canal = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);

const nav = await chromium.launch();
const res = { rotulo };

for (const largura of [1440, 390]) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: largura === 1440 ? 900 : 844 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  const erros = [];
  p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await p.goto('http://localhost:3000/contato', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 30000 });
  await p.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 30000 });
  await p.locator('.contato-faixa-parceiros').evaluate((n) => n.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await p.waitForTimeout(1800);

  const chave = `w${largura}`;
  res[chave] = { erros };

  res[chave].geometria = await p.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect() ?? null;
    const faixa = r('.contato-faixa-parceiros');
    const cena = r('.fundo-contato-cena');
    const cartao = r('.contact-dialog-inner');
    const olho = document.querySelector('.fundo-contato-cena .eyebrow, .fundo-contato-cena [class*="eyebrow"]');
    /* O pé da ÚLTIMA logo visível da primeira cópia — é dele que o vão se conta,
       não do pé da faixa (a faixa tem respiro interno abaixo das logos). */
    const logos = [...document.querySelectorAll('.contato-faixa-parceiros img')].map((n) => n.getBoundingClientRect());
    const logoPe = logos.length ? Math.max(...logos.map((b) => b.bottom)) : null;
    return {
      faixaPe: faixa ? Math.round(faixa.bottom) : null,
      cenaTopo: cena ? Math.round(cena.top) : null,
      /* Faixa e cena têm de encostar sem sobreposição: a SIS-145 registrou os dois
         lendo o MESMO pixel, e é essa premissa que faz o vão ser o `padding-top`. */
      encostam: faixa && cena ? Math.round(cena.top - faixa.bottom) : null,
      logoPe: logoPe === null ? null : Math.round(logoPe),
      cartaoTopo: cartao ? Math.round(cartao.top) : null,
      vaoLogoCartao: logoPe !== null && cartao ? Math.round(cartao.top - logoPe) : null,
      vaoFaixaCartao: faixa && cartao ? Math.round(cartao.top - faixa.bottom) : null,
      cartaoEsq: cartao ? Math.round(cartao.left) : null,
      paddingTopCena: cena ? getComputedStyle(document.querySelector('.fundo-contato-cena')).paddingTop : null,
      olhoTopo: olho ? Math.round(olho.getBoundingClientRect().top) : null,
    };
  });

  /* item 3 — as outras fontes possíveis do branco. */
  res[chave].outrasFontes = await p.evaluate(() => {
    const s = document.querySelector('.contato-faixa-parceiros .lp-signals');
    const f = document.querySelector('.contato-faixa-parceiros');
    const rampa = document.querySelector('.contato-emenda-clara');
    const cs = (n, pseudo) => (n ? getComputedStyle(n, pseudo) : null);
    const a = cs(s, '::after');
    const b = cs(s, '::before');
    return {
      rampaNoDom: Boolean(rampa),
      rampaAltura: rampa ? getComputedStyle(rampa).height : null,
      rampaFundo: rampa ? getComputedStyle(rampa).backgroundImage : null,
      faixaBordaBaixo: s ? getComputedStyle(s).borderBottomWidth : null,
      faixaSombra: s ? getComputedStyle(s).boxShadow : null,
      faixaFundo: f ? getComputedStyle(f).backgroundColor : null,
      signalsFundo: s ? getComputedStyle(s).backgroundColor : null,
      afterConteudo: a ? a.content : null,
      afterFundo: a ? a.backgroundImage : null,
      beforeConteudo: b ? b.content : null,
      beforeFundo: b ? b.backgroundImage : null,
    };
  });

  /* 1 — a varredura. Uma tira de 1px de largura numa coluna fora do cartão,
     começando 6px ACIMA do pé da faixa (para ter a cor do off-white como
     referência) e descendo 200px. */
  {
    const g = res[chave].geometria;
    const x = Math.max(4, Math.round((g.cartaoEsq ?? 200) / 2));
    const y0 = g.faixaPe - 6;
    const alt = 200;
    const f = `${T}/${rotulo}-${chave}-tira.png`;
    await p.screenshot({ path: f, clip: { x, y: y0, width: 1, height: alt } });
    const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
    const n = info.channels;
    const linhas = [];
    for (let i = 0; i < data.length; i += n) {
      linhas.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
    }
    const offWhite = linhas[0];
    /* A referência de "azul do painel" é o fim da tira, 200px abaixo, onde nem a
       rampa de 140px chegava. */
    const azul = linhas[linhas.length - 1];
    const lAzul = lum(azul.r, azul.g, azul.b);
    const abaixoDaFaixa = linhas.slice(6);
    res[chave].varredura = {
      colunaX: x,
      offWhiteAcimaDaEmenda: `rgb(${offWhite.r},${offWhite.g},${offWhite.b})`,
      azul200pxAbaixo: `rgb(${azul.r},${azul.g},${azul.b})`,
      /* Quantas linhas abaixo da faixa ainda estão CLARAS: luminância acima do
         azul de referência com folga de 0,02 (≈5/255 em tinta escura). É este o
         número que a issue zera. */
      linhasClaras: abaixoDaFaixa.filter((c) => lum(c.r, c.g, c.b) > lAzul + 0.02).length,
      /* O maior excesso de vermelho sobre o azul de referência: o canal R é o que
         denuncia branco sobre azul (o painel lê R baixo, o off-white R=245). */
      maxExcessoR: Math.max(...abaixoDaFaixa.map((c) => c.r - azul.r)),
      primeiras12: abaixoDaFaixa.slice(0, 12).map((c) => `${c.r},${c.g},${c.b}`),
    };
  }

  /* Capturas: da emenda (recorte alto) e da seção inteira. */
  {
    const g = res[chave].geometria;
    await p.screenshot({
      path: `docs/capturas/sis259-contato-emenda-${largura}-${rotulo}.png`,
      clip: { x: 0, y: Math.max(0, g.faixaPe - 170), width: largura, height: Math.min(560, 844) },
    });
    await ctx.close();
  }
}
await writeFile(`docs/medidas/emenda-contato-sis259-${rotulo}.json`, `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
await rm(T, { recursive: true, force: true });
await nav.close();
