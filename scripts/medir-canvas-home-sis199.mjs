/**
 * SIS-199 — mede, por RASTER, QUANTO da home é claro e quanto é navy, e onde.
 *
 * A issue manda escolher entre duas saídas e escrever qual: (1) canvas claro
 * contínuo com os palcos escuros por cima, ou (2) home toda clara. Ela também diz
 * como decidir: "se a opção 1 deixar 'buracos' navy grandes, preferir 2". Então a
 * decisão depende de um número que ninguém tem — a ALTURA de página que hoje lê
 * navy. Esta sonda produz esse número.
 *
 * ── O que é medido ─────────────────────────────────────────────────────────
 * O BACKDROP, não o conteúdo. A coluna de amostragem é `x = 8`: a mesma escolha,
 * e pelo mesmo motivo, de `scripts/medir-emenda-hero-grade.mjs` — 8 cai dentro da
 * margem de qualquer cartão da home (o piso do `clamp` da moldura do hero é 20px,
 * e `.container-lp` satura muito depois disso), então a coluna atravessa o fundo
 * das seções e não os cartões que estão em cima dele. Medir no meio da tela leria
 * vídeo, foto e palco de números, que não são o backdrop.
 *
 * A varredura é por DOCUMENTO e não por janela: rola de 800 em 800px (uma janela
 * menos 100px de sobreposição, para nenhuma faixa cair na costura entre dois
 * passos) e, em cada parada, colhe o pixel a cada 25px de altura da janela. Cada
 * amostra vira uma linha `y_documento -> RGB`. Faixas navy contíguas são somadas
 * ao fim: é o "buraco" da issue, em pixels de página.
 *
 * ── Por que rolar, e não `fullPage: true` ──────────────────────────────────
 * A home tem cena `sticky` dirigida por rolagem no hero, na Metrics e na
 * ImpactSequence. Um screenshot de página inteira fotografa o documento com a
 * rolagem em zero e pinta essas cenas no estado inicial — o que não é o que o
 * olho vê ao passar por elas. Rolar e fotografar a janela mede o estado real.
 *
 * ── Classificação ──────────────────────────────────────────────────────────
 * "Claro" = os três canais acima de 200. O `--fundo-claro-secao` fecha em
 * `#e4edf7` (228,237,247) no pior caso e a folha do hero é `#f4f8fc`; o `#1273bc`
 * do `body` é (18,115,188) e o `--palco-marca` é (3,45,103). A fronteira em 200
 * separa os dois grupos com folga larga dos dois lados — não é um limiar
 * apertado que dependa de calibragem.
 *
 * Rodar com o site no ar (`npx next dev -p 3999`):
 *   node scripts/medir-canvas-home-sis199.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const LARGURA = Number(process.env.LARGURA ?? 1440);
const ALTURA = 900;
const X = 8;
const PASSO_ROLAGEM = 800;
const PASSO_AMOSTRA = 25;
const CLARO = 200;

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: LARGURA, height: ALTURA },
  deviceScaleFactor: 1,
});
const pagina = await contexto.newPage();
await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
await pagina.waitForTimeout(3000);

/* O diálogo de preferências de movimento abre na primeira visita com um véu navy
   de tela cheia — sem fechá-lo, a sonda mede o véu. Ver a mesma nota em
   `medir-emenda-hero-grade.mjs`. */
const continuar = pagina.getByRole("button", { name: /continuar/i });
if (await continuar.count()) {
  await continuar.first().click();
  /* 1800ms, e não os 600 de `medir-emenda-hero-grade.mjs`: o véu SAI POR FADE, e
     600ms colhiam o rabo dele. Foi o que produziu, numa rodada, seis amostras
     `3,46,104` nos primeiros 150px de documento e uma solta em y=775 — lidas como
     "navy vazando no hero", quando o pixel do mesmo lugar no screenshot da parada
     era `222,235,246`. Um falso positivo aqui é caro: ele acusa de regressão
     exatamente a seção que a issue veio clarear. */
  await pagina.waitForTimeout(1800);
}

const alturaDoc = await pagina.evaluate(() => document.documentElement.scrollHeight);

/* Endereços das seções, para rotular as faixas.
   ⚠️ Esta leitura acontece DEPOIS da varredura, e não antes: com a rolagem em zero
   as cenas dirigidas ainda não receberam a altura que o GSAP lhes dá, e os retângulos
   saem curtos — foi assim que uma faixa navy de 1.025px voltou rotulada "—", sem
   seção nenhuma cobrindo-a, quando ela é o palco da Metrics. */
const lerSecoes = () =>
  pagina.evaluate(() => {
    const alvos = [
      ["hero #top", "#top"],
      ["BrandGrid", ".marcas-grade"],
      ["SolutionsStory", ".story-solucoes"],
      ["ProofJourney", ".proof-journey"],
      ["Metrics", ".impact-scroll"],
      ["ImpactSequence", "#impacto"],
      ["Contact", ".emenda-luminna"],
      ["Social", ".palco-emenda-de-claro"],
      ["Footer", "footer"],
    ];
    return alvos.flatMap(([nome, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return [];
      const r = el.getBoundingClientRect();
      return [{ nome, sel, topo: Math.round(r.top + window.scrollY), altura: Math.round(r.height) }];
    });
  });

const amostras = [];
for (let rolagem = 0; rolagem < alturaDoc - ALTURA + PASSO_ROLAGEM; rolagem += PASSO_ROLAGEM) {
  const y = Math.min(rolagem, alturaDoc - ALTURA);
  await pagina.evaluate((v) => window.scrollTo(0, v), y);
  /* Espera longa de propósito: as cenas dirigidas buscam quadro de vídeo e
     recalculam `sticky` depois da rolagem. */
  await pagina.waitForTimeout(700);
  const png = await pagina.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  for (let dy = 0; dy < ALTURA; dy += PASSO_AMOSTRA) {
    const b = (dy * info.width + X) * info.channels;
    amostras.push({ doc: y + dy, rgb: [data[b], data[b + 1], data[b + 2]] });
  }
  if (y >= alturaDoc - ALTURA) break;
}

const secoes = await lerSecoes();

/* Uma amostra por posição de documento: passos consecutivos se sobrepõem, e o
   valor lido com a faixa mais para o meio da janela é o mais representativo do
   que o olho vê. Fica o ÚLTIMO lido, que é sempre o de rolagem maior. */
const porDoc = new Map();
for (const a of amostras) porDoc.set(a.doc, a.rgb);
const linhas = [...porDoc.entries()].sort((a, b) => a[0] - b[0]);

const ehClaro = (rgb) => rgb.every((c) => c > CLARO);

const faixas = [];
for (const [doc, rgb] of linhas) {
  const claro = ehClaro(rgb);
  const ultima = faixas[faixas.length - 1];
  if (ultima && ultima.claro === claro) {
    ultima.fim = doc;
    ultima.amostras.push(rgb);
  } else {
    faixas.push({ claro, inicio: doc, fim: doc, amostras: [rgb] });
  }
}

const rotular = (inicio, fim) =>
  secoes
    .filter((s) => s.topo < fim + PASSO_AMOSTRA && s.topo + s.altura > inicio)
    .map((s) => s.nome)
    .join(" + ") || "—";

const totalEscuro = faixas
  .filter((f) => !f.claro)
  .reduce((soma, f) => soma + (f.fim - f.inicio + PASSO_AMOSTRA), 0);

console.log(`\n══ SIS-199 · backdrop da home a ${LARGURA}px ══`);
console.log(`altura de documento: ${alturaDoc}px · coluna x=${X} · amostra a cada ${PASSO_AMOSTRA}px`);
console.log("\n── seções (documento) ──");
for (const s of secoes) {
  console.log(`  ${s.nome.padEnd(16)} ${String(s.topo).padStart(6)} → ${String(s.topo + s.altura).padStart(6)}  (${s.altura}px)`);
}
console.log("\n── faixas do backdrop ──");
for (const f of faixas) {
  const alt = f.fim - f.inicio + PASSO_AMOSTRA;
  const medio = [0, 1, 2].map((c) =>
    Math.round(f.amostras.reduce((s, r) => s + r[c], 0) / f.amostras.length),
  );
  console.log(
    `  ${f.claro ? "CLARO" : "NAVY "} ${String(f.inicio).padStart(6)} → ${String(f.fim).padStart(6)}` +
      `  ${String(alt).padStart(5)}px  médio ${medio.join(",").padEnd(12)} ${rotular(f.inicio, f.fim)}`,
  );
}
console.log(
  `\nnavy total: ${totalEscuro}px de ${alturaDoc}px = ${((totalEscuro / alturaDoc) * 100).toFixed(1)}% da home`,
);

/* ── DEGRAU NA EMENDA ENTRE BLOCOS ─────────────────────────────────────────────
   O total navy acima NÃO mede o que a issue pediu, e a rodada do "antes" provou:
   deu os mesmos 24,7%. Em `x = 8` as seções claras já eram full-bleed, então o
   `#1273bc` do `body` nunca aparecia NAQUELA coluna — ele vazava por baixo de quem
   era translúcido e, principalmente, aparecia como DEGRAU: cada ilha tinha o seu
   branco (`#f4f8fc`, `#f5faff`, o token) e a fronteira entre duas ilhas era um
   salto de tom. É esse salto que o critério "sem degraus de branco diferente entre
   blocos" nomeia, e é ele que se mede aqui.

   Como: rola até a emenda ficar no meio da janela (longe do header translúcido e
   do rodapé), e compara a média de 4 linhas ACIMA com a média de 4 linhas ABAIXO.
   4 linhas, e não 1: o antialiasing da fronteira pinta uma franja de 1-2px que não
   é nem um lado nem o outro. O número relatado é o maior degrau por canal. */
const EMENDAS = [
  ["hero → BrandGrid", "#top", ".marcas-grade"],
  ["BrandGrid → Soluções", ".marcas-grade", ".story-solucoes"],
  ["Soluções → Números", ".story-solucoes", ".impact-scroll"],
  ["Montagem → Contato", "#impacto", ".emenda-luminna"],
  ["Contato → Social", ".emenda-luminna", ".palco-emenda-de-claro"],
];

console.log("\n── degrau na emenda (x=8, média de 4px de cada lado) ──");
for (const [nome, , selAbaixo] of EMENDAS) {
  const yEmenda = await pagina.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return Math.round(el.getBoundingClientRect().top + window.scrollY);
  }, selAbaixo);
  if (yEmenda == null) {
    console.log(`  ${nome.padEnd(24)} (pulada — \`${selAbaixo}\` não existe)`);
    continue;
  }
  const rolagem = Math.max(0, Math.min(yEmenda - ALTURA / 2, alturaDoc - ALTURA));
  await pagina.evaluate((v) => window.scrollTo(0, v), rolagem);
  await pagina.waitForTimeout(900);
  const png = await pagina.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const linha = (dy) => {
    const b = (dy * info.width + X) * info.channels;
    return [data[b], data[b + 1], data[b + 2]];
  };
  const media = (de, ate) => {
    const rs = [];
    for (let dy = de; dy < ate; dy += 1) rs.push(linha(dy));
    return [0, 1, 2].map((c) => Math.round(rs.reduce((s, r) => s + r[c], 0) / rs.length));
  };
  const dyEmenda = yEmenda - rolagem;
  const acima = media(dyEmenda - 6, dyEmenda - 2);
  const abaixo = media(dyEmenda + 2, dyEmenda + 6);
  const degrau = Math.max(...[0, 1, 2].map((c) => Math.abs(acima[c] - abaixo[c])));
  console.log(
    `  ${nome.padEnd(24)} y=${String(yEmenda).padStart(6)}  acima ${acima.join(",").padEnd(12)}` +
      `  abaixo ${abaixo.join(",").padEnd(12)}  degrau ${degrau}`,
  );
}

await contexto.close();
await navegador.close();
