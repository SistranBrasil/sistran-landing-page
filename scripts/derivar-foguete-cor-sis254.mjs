/**
 * SIS-254 — deriva a camada de COR do foguete de SOCIAL.
 *
 * O problema que este arquivo resolve: em `/esg`, com a arte ESCONDIDA, o pior
 * fundo sob glifo dentro da caixa do foguete já é 4,94:1 (390), 5,02:1 (1024) e
 * 5,05:1 (1440) contra o `rgb(61 90 128)` de `.section-light .text-ink-muted`
 * (`scripts/medir-foguete-social-sis234.mjs` com `SEM_FOGUETE=1`). O piso de AA
 * pede fundo com luminância ≥ 0,619, ou seja cinza ~206, e a superfície dos
 * cartões de apoio já está em `rgb(208 217 225)`. Sobram ~4 níveis de cinza para
 * escurecer. Os 0,14 de opacidade normal da rodada 1 gastavam esse resto inteiro
 * (4,56:1 medido) — daí a arte 3D não se ler e daí nenhuma opacidade maior caber.
 *
 * O que se faz aqui: separar COR de LUMINOSIDADE. `SetLum` da spec de composição
 * CSS (a conta por trás de `mix-blend-mode: color`) reescreve a arte com o MATIZ
 * e o CROMA originais sobre a LUMINOSIDADE de um tom de referência. Como o
 * contraste WCAG lê luminância, uma camada assim entra com tinta e quase não
 * mexe no contraste — é o caminho `mix` que a conferência autorizou.
 *
 * POR QUE ASSAR EM ARQUIVO EM VEZ DE USAR `mix-blend-mode: color` NO NAVEGADOR:
 * blend só alcança o que foi pintado no mesmo grupo isolado, e a camada do
 * foguete está atrás de três fronteiras que criam contexto de empilhamento (o
 * `-z-10` do wrapper, o `sticky` da âncora e o `transform` da peça móvel). Medido
 * em 14/09: com `mix-blend-color` no wrapper, o blend NÃO viu o fundo da seção —
 * viu transparência, e blend sobre transparência devolve a fonte crua. O medidor
 * acusou 1,19:1 / 2,12:1 / 1,95:1, isto é, o foguete opaco por cima do texto.
 * Assado, o mesmo resultado vira uma imagem normal e não depende de isolamento.
 *
 * Além do `SetLum`, cada pixel passa por um PISO DE CONTRASTE: se o resultado
 * ficar abaixo de `RAZAO` contra a cor do texto, o croma é reduzido em direção ao
 * próprio cinza até passar. Isto é necessário porque `SetLum` preserva a
 * luminosidade da spec (0,3/0,59/0,11 sobre sRGB) e não a luminância relativa da
 * WCAG (coeficientes lineares) — vermelhos e laranjas saturados custam luminância
 * WCAG mesmo com a luminosidade "certa". Com o piso, nenhum pixel da camada de
 * cor entra abaixo do alvo, em nenhuma opacidade.
 *
 * Uso: node scripts/derivar-foguete-cor-sis254.mjs
 * Entrada: public/images/esg/foguete-scroll.webp  (a derivada com alfa da rodada 1)
 * Saída:   public/images/esg/foguete-scroll-cor.webp
 */
import sharp from "sharp";

const ENTRADA = process.env.ENTRADA ?? "public/images/esg/foguete-scroll.webp";
const SAIDA = process.env.SAIDA ?? "public/images/esg/foguete-scroll-cor.webp";
/* Tom de referência: o azul liso de `.section-light.section-light-blue` na faixa
   que o foguete cruza. Um pouco ABAIXO do `rgb(227 241 251)` medido no miolo, de
   propósito — assim, sobre os fundos mais claros da seção a camada praticamente
   não escurece, e sobre a superfície dos cartões (208 217 225) ela CLAREIA. */
const REFERENCIA = (process.env.REFERENCIA ?? "222,235,246").split(",").map(Number);
/* Cor do texto da seção, medida no navegador: `.section-light .text-ink-muted`. */
const TEXTO = (process.env.TEXTO ?? "61,90,128").split(",").map(Number);
/* Piso por pixel. 5,05 é o melhor fundo "sem foguete" medido (1440); pedir isto
   da camada de cor faz dela uma peça que não é o gargalo em nenhuma largura. */
const RAZAO = Number(process.env.RAZAO ?? 5.05);

/* Luminosidade da spec de composição (sRGB, não linear). */
const lumSpec = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];

/* ClipColor da spec: traz o resultado de volta ao gamut girando em torno da
   luminosidade, e não cortando canal — cortar mudaria o matiz. */
const clipColor = (c) => {
  const l = lumSpec(c);
  let o = [...c];
  const n = Math.min(...o);
  if (n < 0) o = o.map((v) => l + ((v - l) * l) / (l - n));
  const x = Math.max(...o);
  if (x > 255) o = o.map((v) => l + ((v - l) * (255 - l)) / (x - l));
  return o;
};

const setLum = (c, l) => {
  const d = l - lumSpec(c);
  return clipColor([c[0] + d, c[1] + d, c[2] + d]);
};

/* Luminância relativa da WCAG. */
const wcag = (c) => {
  const f = c.map((v) => {
    const s = Math.min(255, Math.max(0, v)) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const LTEXTO = wcag(TEXTO);
const LREF = lumSpec(REFERENCIA);

const { data, info } = await sharp(ENTRADA)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const saida = Buffer.alloc(width * height * 4);
let pior = { rz: 99, px: null, arte: null };
let cromaCortado = 0;
let comTinta = 0;

for (let i = 0, j = 0; i < data.length; i += channels, j += 4) {
  const alfa = data[i + 3];
  const arte = [data[i], data[i + 1], data[i + 2]];
  let cor = setLum(arte, LREF);

  /* Piso de contraste: reduz croma em direção ao cinza do próprio pixel até a
     razão passar. Converge sempre — o cinza de luminosidade `LREF` mede 5,77:1
     contra este texto, bem acima de qualquer `RAZAO` plausível. */
  if (razao(LTEXTO, wcag(cor)) < RAZAO) {
    cromaCortado += 1;
    const g = lumSpec(cor);
    let baixo = 0;
    let alto = 1;
    for (let passo = 0; passo < 24; passo += 1) {
      const meio = (baixo + alto) / 2;
      const teste = cor.map((v) => g + (v - g) * meio);
      if (razao(LTEXTO, wcag(teste)) >= RAZAO) baixo = meio;
      else alto = meio;
    }
    cor = cor.map((v) => g + (v - g) * baixo);
  }

  saida[j] = Math.round(cor[0]);
  saida[j + 1] = Math.round(cor[1]);
  saida[j + 2] = Math.round(cor[2]);
  saida[j + 3] = alfa;

  if (alfa > 127) {
    comTinta += 1;
    const rz = razao(LTEXTO, wcag(cor));
    if (rz < pior.rz) pior = { rz, px: cor.map(Math.round), arte };
  }
}

await sharp(saida, { raw: { width, height, channels: 4 } })
  .webp({ quality: 82, alphaQuality: 90, effort: 6 })
  .toFile(SAIDA);

const meta = await sharp(SAIDA).metadata();
console.log(
  `${SAIDA}: ${meta.width}x${meta.height}, ${meta.size} bytes\n` +
    `referência rgb(${REFERENCIA.join(" ")}) (luminosidade ${LREF.toFixed(1)}) | texto rgb(${TEXTO.join(" ")})\n` +
    `pior pixel da camada: ${pior.rz.toFixed(2)}:1 rgb(${pior.px.join(" ")}) (arte rgb(${pior.arte.join(" ")}))\n` +
    `croma reduzido em ${cromaCortado} de ${comTinta} pixels com tinta`,
);
