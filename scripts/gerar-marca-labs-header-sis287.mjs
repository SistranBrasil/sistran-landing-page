/**
 * SIS-287 — deriva a marca SISTRAN LABS do header a partir da arte entregue.
 *
 * `node scripts/gerar-marca-labs-header-sis287.mjs`
 *
 *   entrada: public/images/sistran-labs/logosemfundo.png
 *   saída:   public/images/sistran-labs/logo-labs-header.webp
 *
 * ── 1. O NOME DO ARQUIVO MENTE ──
 *
 * Medido antes de decidir qualquer coisa:
 *
 *     logosemfundo.png   1024x576 · srgb · channels: 3 · hasAlpha: FALSE
 *     os quatro cantos   [0, 0, 0, 255]
 *
 * Apesar do «sem fundo», não há canal alfa: o fundo é preto CHAPADO e opaco.
 * Servir isto cru na pílula de vidro do header pintaria um retângulo preto de
 * 1024x576 sobre o degradê azul — é o defeito que o ponto 3 da issue manda
 * evitar, e é o mesmo modo de falha da SIS-235 (arte reentregue sem alfa).
 *
 * ── 2. LUMINÂNCIA VIRA ALFA, e por que isto é lícito aqui ──
 *
 * A arte é monocromática — medida de saturação (`max(r,g,b) - min(r,g,b)`) em
 * todos os 589.824 pixels: **máximo 6**, e ZERO pixel acima de 12. Ou seja, é
 * tinta branca sobre preto, sem nenhuma cor a preservar. Nesse caso a
 * reconstrução do alfa é exata e não uma aproximação: o pixel que o
 * compositor original produziu com `branco × cobertura` sobre preto tem
 * luminância = cobertura. Então `alfa := luminância` e `RGB := branco` devolve
 * exatamente a arte com fundo transparente, **antialiasing incluído**.
 *
 * A alternativa preguiçosa — `mix-blend-mode: screen` no CSS — foi descartada:
 * a pílula tem `backdrop-filter`, e blend sobre elemento com filtro é
 * justamente onde o blend falha em silêncio (ver `.claude/skills/filters.md` e
 * `mix-blend-mode.md`). Corrigir no asset resolve em qualquer navegador.
 *
 * O limiar de 40 de luminância é usado só para MEDIR a caixa de tinta, não para
 * cortar o alfa: cortar em 40 comeria a franja de antialiasing e a marca sairia
 * serrilhada em 34px. O alfa é a luminância inteira, de 0 a 255.
 *
 * ── 3. CORTE NA TINTA ──
 *
 * Caixa de tinta na arte (luminância > 40): **x 43, y 167, 961x219** — 38% da
 * tela de 1024x576. O resto é preto que, virando alfa 0, seria peso transparente
 * e uma `caixa` grande de recortar no `MarcaRecortada`. O arquivo derivado JÁ
 * sai cortado na tinta, então no `TINTA` do `Header.tsx` a caixa é a imagem
 * inteira e a razão do invólucro é a razão da marca: **961/219 = 4,39**.
 *
 * Essa razão é o dado que manda no layout e está registrado na nota do bloco
 * duplo em `Header.tsx`: a marca da University tem razão 3,05, esta é 44% mais
 * larga para a mesma altura, e é por isso que a altura escolhida aqui não é a
 * da University.
 *
 * ── 4. 96px DE ALTURA DE TINTA ──
 *
 * O maior uso em CSS é 42px (faixa `md`). 96px cobre DPR 2 com folga (84px
 * pedidos) e fica a 76% do DPR 3. Acima disso não há ganho: a fonte tem 219px de
 * tinta, e reamostrar para mais do que a tela usa é só byte.
 *
 * ── 5. WebP SEM PERDA, ao contrário dos ícones da SIS-284 ──
 *
 * Aqui vale a razão da SIS-277 e não a daquele script: esta arte é LINHA FINA
 * chapada — trilhas de circuito de 1 a 2px, tipografia de traço fino, o
 * tracejado do «Inovação & IA» — que é exatamente onde a quantização DCT deixa
 * halo cinza em volta de cada traço. E a medição a 96px de tinta fecha a
 * discussão, porque o preço é quase nada:
 *
 *     quality 82 ......... 11,4 kB
 *     quality 90 ......... 11,5 kB
 *     nearLossless 80 .... 12,0 kB
 *     lossless ........... 12,0 kB   ← escolhido
 *
 * `lossless` custa os MESMOS 12,0 kB do `nearLossless` e 0,6 kB mais que o
 * `quality 82`. Numa marca de linha fina que aparece em toda página da rota com
 * `priority`, pagar 0,6 kB para não ter halo nenhum é troca fácil — e sendo
 * empate com o `nearLossless`, não há razão para ficar no aproximado.
 *
 * O PNG fonte FICA onde está, para regerar — mesma política da SIS-277 e da
 * SIS-284.
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const ENTRADA = 'public/images/sistran-labs/logosemfundo.png';
const SAIDA = 'public/images/sistran-labs/logo-labs-header.webp';
const ALTURA_DA_TINTA = 96;
const LIMIAR = 40;

const meta = await sharp(ENTRADA).metadata();
const { data, info } = await sharp(ENTRADA).raw().toBuffer({ resolveWithObject: true });
const canais = info.channels;

const lum = (x, y) => {
  const i = (y * info.width + x) * canais;
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
};

/* A caixa de tinta, medida e não estimada — é ela que decide o corte e a razão
   que o `Header.tsx` usa no invólucro. */
let x0 = info.width;
let y0 = info.height;
let x1 = -1;
let y1 = -1;
let saturacaoMaxima = 0;
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const i = (y * info.width + x) * canais;
    const mx = Math.max(data[i], data[i + 1], data[i + 2]);
    const mn = Math.min(data[i], data[i + 1], data[i + 2]);
    if (mx - mn > saturacaoMaxima) saturacaoMaxima = mx - mn;
    if (lum(x, y) > LIMIAR) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
}
const tinta = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };

if (saturacaoMaxima > 12) {
  /* A guarda existe porque o ponto 2 do cabeçalho só é exato em arte
     MONOCROMÁTICA: com cor de verdade, `alfa := luminância` clarearia os tons
     escuros da marca em vez de recortá-los. Melhor falhar aqui. */
  throw new Error(
    `${ENTRADA} tem cor (saturação máxima ${saturacaoMaxima}) — a reconstrução de alfa por luminância deixaria de ser exata; ver o ponto 2 do cabeçalho`,
  );
}

/* Alfa = luminância, RGB = branco chapado. Um buffer cru de 4 canais em vez de
   `.composite()`/`.boolean()`: a conta é por pixel e não há máscara pronta a
   reaproveitar. */
const rgba = Buffer.alloc(tinta.w * tinta.h * 4);
for (let y = 0; y < tinta.h; y += 1) {
  for (let x = 0; x < tinta.w; x += 1) {
    const o = (y * tinta.w + x) * 4;
    rgba[o] = 255;
    rgba[o + 1] = 255;
    rgba[o + 2] = 255;
    /* Sem limiar: a franja de antialiasing é o que mantém a linha de 1px legível
       a 34px de altura. */
    rgba[o + 3] = Math.round(Math.min(255, lum(tinta.x + x, tinta.y + y)));
  }
}

const largura = Math.round((tinta.w / tinta.h) * ALTURA_DA_TINTA);

await sharp(rgba, { raw: { width: tinta.w, height: tinta.h, channels: 4 } })
  .resize({ width: largura, height: ALTURA_DA_TINTA })
  /* Sem `alphaQuality`: em `lossless` ele não se aplica. E é justamente o alfa
     que precisa sair intacto — aqui ele É o desenho, porque a marca não tem cor
     própria e toda a forma vive nesse canal. */
  .webp({ lossless: true, effort: 6 })
  .toFile(SAIDA);

const [antes, depois] = await Promise.all([stat(ENTRADA), stat(SAIDA)]);
console.log(
  JSON.stringify(
    {
      entrada: {
        arquivo: ENTRADA,
        w: meta.width,
        h: meta.height,
        canais: meta.channels,
        temAlfa: meta.hasAlpha,
        kB: Math.round(antes.size / 1024),
      },
      tinta,
      razaoDaTinta: Math.round((tinta.w / tinta.h) * 100) / 100,
      saturacaoMaxima,
      saida: { arquivo: SAIDA, w: largura, h: ALTURA_DA_TINTA, kB: Math.round((depois.size / 1024) * 10) / 10 },
    },
    null,
    1,
  ),
);
