/**
 * SIS-184 — ESCOLHE O `tom` DE CADA PARADA POR NÚMERO, e não por inspeção.
 *
 * A sonda irmã (`medir-scrollspy-home-sis184.mjs`) já gravou, parada por parada,
 * a captura da janela com aquela parada ATIVA e a caixa exata do rótulo e do
 * traço. Aqui cada pixel da moldura ao redor dessas duas caixas é confrontado
 * com os TRÊS pares que o `ScrollSpy` já tem (nenhuma cor nova — item 3 da
 * issue), e o par escolhido é o que maximiza o PIOR pixel:
 *
 *   escuro (ausência de `tom`) → rótulo #ffffff  · traço #0ed8f6
 *   claro                      → rótulo #0a1f44  · traço #0079CB
 *   medio                      → rótulo #02070e  · traço #02070e
 *
 * Dois portões distintos, porque a WCAG os separa: rótulo é texto (1.4.3, 4,5:1
 * — 11px não chega a «texto grande») e o traço é elemento gráfico (1.4.11, 3:1).
 * Um par que passa no rótulo e falha no traço não serve, então a ordenação usa o
 * par (passa nos dois, depois margem do rótulo).
 *
 * Por que o PIOR e não a média: o rótulo tem 11px com `tracking` largo, e a
 * média da moldura diluiu a franja de antialiasing na primeira leitura desta
 * issue — `contato` marcava 8,75:1 de média com 1,49:1 no pior pixel, porque a
 * tinta atravessa a emenda entre o cartão claro e a foto escura. Média decide
 * errado exatamente nos casos que a issue existe para achar.
 *
 * Uso: node scripts/avaliar-pares-scrollspy-sis184.mjs [antes|depois]
 */

import { readFileSync, writeFileSync } from 'node:fs';

const SUFIXO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const ENTRADA = `docs/medidas/scrollspy-home-sis184-${SUFIXO}.json`;
const SAIDA = `docs/medidas/scrollspy-pares-sis184-${SUFIXO}.json`;

const PARES = {
  escuro: { rotulo: [255, 255, 255], traco: [14, 216, 246] },
  claro: { rotulo: [10, 31, 68], traco: [0, 121, 203] },
  medio: { rotulo: [2, 7, 14], traco: [2, 7, 14] },
};

const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [m, n] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (m + 0.05) / (n + 0.05);
};

const sharp = (await import('sharp')).default;

/* Todos os pixels de uma moldura: as faixas ao redor da caixa, nunca a caixa —
   dentro dela os pixels SÃO a tinta, e medi-los é medir o texto contra si. */
async function moldura(arquivo, [x, y, w, h], folga) {
  const img = sharp(readFileSync(arquivo));
  const meta = await img.metadata();
  const faixas = [
    [x, y - folga - 1, w, folga],
    [x, y + h + 1, w, folga],
    [Math.max(0, x - folga - 1), y, folga, h],
  ];
  const pixels = [];
  for (const [L0, T0, W0, H0] of faixas) {
    const L = Math.max(0, Math.min(Math.round(L0), (meta.width ?? 1) - 2));
    const T = Math.max(0, Math.min(Math.round(T0), (meta.height ?? 1) - 2));
    const W = Math.max(1, Math.min(Math.round(W0), (meta.width ?? 1) - L));
    const H = Math.max(1, Math.min(Math.round(H0), (meta.height ?? 1) - T));
    const { data, info } = await sharp(readFileSync(arquivo))
      .extract({ left: L, top: T, width: W, height: H })
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += info.channels) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  return pixels;
}

const medido = JSON.parse(readFileSync(ENTRADA, 'utf8'));
const saida = {
  issue: 'SIS-184',
  momento: SUFIXO,
  nota: 'gerado por scripts/avaliar-pares-scrollspy-sis184.mjs',
  portoes: { rotulo: '4,5:1 (WCAG 1.4.3, 11px)', traco: '3:1 (WCAG 1.4.11)' },
  pares: PARES,
};

for (const largura of [1440, 1280]) {
  const linhas = [];
  for (const p of medido[largura]?.paradas ?? []) {
    const rotuloVisivel = p.rotulo && p.rotulo.opacidade > 0 && p.rotulo.caixa[2] > 0;
    const pxRotulo = rotuloVisivel ? await moldura(p.arquivo, p.rotulo.caixa, 4) : null;
    const pxTraco = p.traco?.caixa[2] > 0 ? await moldura(p.arquivo, p.traco.caixa, 4) : null;

    const avaliacao = {};
    for (const [nome, par] of Object.entries(PARES)) {
      const rot = pxRotulo
        ? Number(Math.min(...pxRotulo.map((q) => razao(par.rotulo, q))).toFixed(2))
        : null;
      const tra = pxTraco
        ? Number(Math.min(...pxTraco.map((q) => razao(par.traco, q))).toFixed(2))
        : null;
      avaliacao[nome] = {
        rotuloPior: rot,
        tracoPior: tra,
        passaRotulo: rot === null ? null : rot >= 4.5,
        passaTraco: tra === null ? null : tra >= 3,
      };
    }
    /* Ordenação: passar nos DOIS portões primeiro, depois a maior folga no
       rótulo — é a tinta que a pessoa lê. */
    const nota = (a) =>
      (a.passaTraco === false ? 0 : 1) * 1000 +
      (a.passaRotulo === false ? 0 : 1) * 100 +
      (a.rotuloPior ?? a.tracoPior ?? 0);
    const melhor = Object.entries(avaliacao).sort((a, b) => nota(b[1]) - nota(a[1]))[0][0];

    linhas.push({
      id: p.id,
      rotulo: p.rotulo?.caixa ?? null,
      rotuloVisivel,
      /* O que o código faz HOJE, deduzido da tinta que saiu na captura. */
      tomEfetivoHoje:
        p.rotulo?.cor === 'rgb(255, 255, 255)'
          ? 'escuro'
          : p.rotulo?.cor === 'rgb(10, 31, 68)'
            ? 'claro'
            : p.rotulo?.cor === 'rgb(2, 7, 14)'
              ? 'medio'
              : '?',
      avaliacao,
      melhor,
      arquivo: p.arquivo,
    });
  }
  saida[largura] = linhas;
}

writeFileSync(SAIDA, `${JSON.stringify(saida, null, 2)}\n`);
console.log(SAIDA);
for (const largura of [1440, 1280]) {
  console.log(`\n── ${largura} ──  (rot/traco = PIOR pixel; portões 4,5 e 3,0)`);
  for (const l of saida[largura]) {
    const c = (n) => {
      const a = l.avaliacao[n];
      return `${n}: rot ${a.rotuloPior ?? '—'}${a.passaRotulo === false ? '✗' : a.rotuloPior === null ? ' ' : '✓'} traco ${a.tracoPior}${a.passaTraco ? '✓' : '✗'}`;
    };
    console.log(
      `${l.id.padEnd(11)} hoje=${l.tomEfetivoHoje.padEnd(6)} visivel=${String(l.rotuloVisivel).padEnd(5)} | ${c('escuro')} | ${c('claro')} | ${c('medio')} → MELHOR: ${l.melhor}`,
    );
  }
}
