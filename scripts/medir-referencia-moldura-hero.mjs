/**
 * SIS-190 — mede a moldura em `public/referenciavideo.png` em vez de adivinhá-la.
 *
 * A issue trava a referência e proíbe inventar cor/peso/raio. Então os três
 * números saem daqui:
 *
 *   1. COR e PESO do traço — varredura perpendicular a cada borda. O traço é o
 *      pico de "ciano" (azul+verde altos, vermelho baixo) numa linha que começa
 *      na folha clara de fora e termina no vídeo. Peso = quantos pixels seguidos
 *      ficam acima do meio da subida; é medido em pixels de IMAGEM, e a captura
 *      pode não ser 1:1 com CSS — daí o script também imprimir a largura da
 *      imagem, para dividir depois.
 *   2. RAIO dos cantos — o canto arredondado é o único lugar onde a borda
 *      direita "entra" horizontalmente. Achando a linha em que a borda direita
 *      atinge o x máximo (o trecho reto) e a primeira linha em que ela já está
 *      recuada, a distância entre as duas é o raio.
 *   3. Em QUE LADOS existe traço — é o que decide o caminho A/B/C da issue. Se
 *      o lado esquerdo não tem pico, a moldura é aberta ali (a dissolução da
 *      SIS-178 continua sendo o desenho), e retângulo completo estaria errado.
 *
 * Rodar: node scripts/medir-referencia-moldura-hero.mjs
 */
import sharp from 'sharp';

const ARQ = 'public/referenciavideo.png';

const { data, info } = await sharp(ARQ).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const px = (x, y) => {
  const i = (y * W + x) * C;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
};
/** "Quanto ciano": o traço é azul-esverdeado sobre folha clara e sobre navy. */
const ciano = ({ r, g, b }) => (g + b) / 2 - r;

/**
 * Percorre `n` pixels a partir de (x0,y0) no passo (dx,dy) e devolve o pico de
 * ciano, a largura do pico e a cor no pico.
 */
function varrer(x0, y0, dx, dy, n) {
  const perfil = [];
  for (let k = 0; k < n; k += 1) {
    const x = x0 + dx * k;
    const y = y0 + dy * k;
    if (x < 0 || y < 0 || x >= W || y >= H) break;
    const c = px(x, y);
    perfil.push({ k, x, y, c, v: ciano(c) });
  }
  if (!perfil.length) return null;
  const pico = perfil.reduce((a, b) => (b.v > a.v ? b : a));
  /* Meia altura entre o pico e o fundo da folha (primeiros pixels da varredura,
     que estão fora do quadro): é o critério de espessura menos arbitrário. */
  const fundo = perfil.slice(0, 3).reduce((s, p) => s + p.v, 0) / 3;
  const meia = fundo + (pico.v - fundo) / 2;
  const acima = perfil.filter((p) => p.v >= meia && Math.abs(p.k - pico.k) < 12);
  return {
    pico,
    peso: acima.length,
    fundo: Number(fundo.toFixed(1)),
    hex: `#${[pico.c.r, pico.c.g, pico.c.b].map((n) => n.toString(16).padStart(2, '0')).join('')}`,
  };
}

console.log(`imagem ${W}×${H}`);

/* ── Onde está o quadro ────────────────────────────────────────────────────
   O traço direito é a coluna com maior ciano na metade da altura da imagem. */
const meioY = Math.round(H * 0.5);
let xDir = -1;
let melhor = -Infinity;
for (let x = W - 1; x > W * 0.6; x -= 1) {
  const v = ciano(px(x, meioY));
  if (v > melhor) {
    melhor = v;
    xDir = x;
  }
}

/* Topo e base: varre para baixo/para cima numa coluna bem dentro do quadro. */
const xDentro = Math.round(W * 0.62);
let yTopo = -1;
melhor = -Infinity;
for (let y = Math.round(H * 0.08); y < H * 0.35; y += 1) {
  const v = ciano(px(xDentro, y));
  if (v > melhor) {
    melhor = v;
    yTopo = y;
  }
}
let yBase = -1;
melhor = -Infinity;
for (let y = H - 1; y > H * 0.6; y -= 1) {
  const v = ciano(px(xDentro, y));
  if (v > melhor) {
    melhor = v;
    yBase = y;
  }
}

console.log(`quadro: x direita ${xDir}, topo y ${yTopo}, base y ${yBase}`);
console.log(`altura do quadro ${yBase - yTopo}px`);

const lados = {
  direita: varrer(Math.min(W - 1, xDir + 14), meioY, -1, 0, 30),
  topo: varrer(xDentro, Math.max(0, yTopo - 14), 0, 1, 30),
  base: varrer(xDentro, Math.min(H - 1, yBase + 14), 0, -1, 30),
  /* Esquerda: a issue diz que ali o quadro dissolve. Varrer o terço esquerdo do
     quadro na mesma linha do meio — se não há pico, não há traço. */
  esquerda: varrer(Math.round(W * 0.36), meioY, 1, 0, 40),
};

for (const [nome, m] of Object.entries(lados)) {
  if (!m) {
    console.log(`${nome.padEnd(9)} — fora da imagem`);
    continue;
  }
  console.log(
    `${nome.padEnd(9)} pico ciano ${String(m.pico.v).padStart(4)} (fundo ${m.fundo}) ` +
      `cor ${m.hex} peso ~${m.peso}px @ ${m.pico.x},${m.pico.y}`,
  );
}

/* ── Raio dos cantos ──────────────────────────────────────────────────────
   Para cada linha perto do topo, acha o x do traço direito. No trecho reto ele
   é constante (= xDir); no canto ele recua. A primeira linha, de baixo para
   cima, em que o recuo passa de 1px marca o fim do arco. */
function bordaDireitaEm(y) {
  let melhorX = -1;
  let melhorV = -Infinity;
  for (let x = W - 1; x > W * 0.6; x -= 1) {
    const v = ciano(px(x, y));
    if (v > melhorV) {
      melhorV = v;
      melhorX = x;
    }
  }
  return melhorV > 12 ? melhorX : null;
}
for (const [nome, dir, yBorda] of [
  ['canto sup. dir.', 1, yTopo],
  ['canto inf. dir.', -1, yBase],
]) {
  let raio = 0;
  for (let d = 0; d < 90; d += 1) {
    const x = bordaDireitaEm(yBorda + dir * d);
    if (x === null) continue;
    if (xDir - x <= 1) {
      raio = d;
      break;
    }
  }
  console.log(`${nome}: arco termina ${raio}px depois da borda → raio ≈ ${raio}px de imagem`);
}
