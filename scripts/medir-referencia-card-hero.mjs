/**
 * SIS-198 — mede `public/referencia-hero-card-tamanho.png` em vez de adivinhar.
 *
 * A issue proíbe inventar margens e raio: o card tem de nascer no tamanho da
 * referência. Daqui saem quatro coisas:
 *
 *   1. MARGENS do card contra as bordas da captura — em px de imagem e em % da
 *      largura/altura, porque a captura pode não ser 1:1 com CSS.
 *   2. RAIO dos cantos da direita (a esquerda dissolve, como na SIS-190).
 *   3. COR e PESO do traço ciano em cada lado, e em QUE lados ele existe.
 *   4. Onde a borda ESQUERDA do card está, achada por degrau de luminância
 *      (fora do card a folha é mais clara que o interior), já que ali não há
 *      traço para procurar.
 *
 * Rodar: node scripts/medir-referencia-card-hero.mjs
 */
import sharp from 'sharp';

const ARQ = 'public/referencia-hero-card-tamanho.png';

const { data, info } = await sharp(ARQ).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const px = (x, y) => {
  const i = (y * W + x) * C;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
};
/** "Quanto ciano": o traço é azul-esverdeado tanto sobre folha clara como sobre vídeo. */
const ciano = ({ r, g, b }) => (g + b) / 2 - r;
const hex = ({ r, g, b }) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

console.log(`imagem ${W}×${H}`);

/** Pico de ciano num intervalo, varrendo numa direção. */
function picoCiano(x0, y0, dx, dy, n) {
  let melhor = null;
  for (let k = 0; k < n; k += 1) {
    const x = x0 + dx * k;
    const y = y0 + dy * k;
    if (x < 0 || y < 0 || x >= W || y >= H) break;
    const v = ciano(px(x, y));
    if (!melhor || v > melhor.v) melhor = { x, y, v, cor: px(x, y) };
  }
  return melhor;
}

/** Espessura do traço: pixels seguidos acima da meia altura entre pico e fundo. */
function peso(xc, yc, dx, dy, raio = 10) {
  const perfil = [];
  for (let k = -raio; k <= raio; k += 1) {
    const x = xc + dx * k;
    const y = yc + dy * k;
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    perfil.push(ciano(px(x, y)));
  }
  const pico = Math.max(...perfil);
  const fundo = Math.min(...perfil);
  const meia = fundo + (pico - fundo) / 2;
  return perfil.filter((v) => v >= meia).length;
}

/* ── Bordas do card pelo traço ciano ─────────────────────────────────────── */
const meioY = Math.round(H * 0.5);
/* A coluna de sondagem das bordas horizontais é DELIBERADAMENTE a 89% da
   largura, e não no meio: a primeira versão deste script varria em x≈0.62·W e
   encontrava como "topo" a PÍLULA DO CABEÇALHO (`#156aa9` em 1182,97), que é
   mais azul que o traço e ganhava o pico. Ali no fim da direita não há
   cabeçalho, e o traço é o objeto mais ciano da coluna.
   Pela mesma razão a varredura vertical é curta (18% da altura): o percurso
   longo voltava a passar pela pílula. */
const xDentro = Math.round(W * 0.89);

const dir = picoCiano(W - 1, meioY, -1, 0, Math.round(W * 0.25));
const topo = picoCiano(xDentro, 0, 0, 1, Math.round(H * 0.18));
const base = picoCiano(xDentro, H - 1, 0, -1, Math.round(H * 0.18));
/* Esquerda: varre o terço esquerdo do card na linha do meio. Sem pico, não há traço. */
const esq = picoCiano(Math.round(W * 0.02), meioY, 1, 0, Math.round(W * 0.35));

const lados = { direita: dir, topo, base, esquerda: esq };
for (const [nome, m] of Object.entries(lados)) {
  if (!m) {
    console.log(`${nome.padEnd(9)} — sem leitura`);
    continue;
  }
  const [dx, dy] = nome === 'direita' || nome === 'esquerda' ? [1, 0] : [0, 1];
  console.log(
    `${nome.padEnd(9)} pico ciano ${String(m.v).padStart(4)} cor ${hex(m.cor)} ` +
      `peso ~${peso(m.x, m.y, dx, dy)}px @ ${m.x},${m.y}`,
  );
}

/* ── Borda esquerda do card, de DENTRO para FORA ──────────────────────────
   Não por "maior degrau de luminância": a primeira versão fazia isso e
   respondia x=14 — a borda da PÁGINA, onde a captura encosta na moldura do
   navegador, cujo degrau é maior que a sombra suave do card. Aqui o critério é
   outro e não tem esse rival: a partir de uma coluna seguramente DENTRO do
   card, caminha para a esquerda enquanto a cor for a da folha, e para no
   primeiro pixel que deixa de ser. Fora do card há sombra (`#e9edf3` →
   `#dce2e9`), então a saída é limpa.
   A linha é y = 0.75·H, abaixo de qualquer sobreposição do cabeçalho. */
const linhaEsq = Math.round(H * 0.75);
const folha = px(Math.round(W * 0.3), linhaEsq);
const iguais = (a, b) => Math.abs(a.r - b.r) <= 2 && Math.abs(a.g - b.g) <= 2 && Math.abs(a.b - b.b) <= 2;
let esqX = Math.round(W * 0.3);
while (esqX > 0 && iguais(px(esqX - 1, linhaEsq), folha)) esqX -= 1;
console.log(
  `borda esquerda por cor: x ${esqX} @ y ${linhaEsq} — folha ${hex(folha)}, ` +
    `fora ${hex(px(esqX - 4, linhaEsq))} (sombra, sem traço: ciano ${ciano(px(esqX - 1, linhaEsq)).toFixed(0)})`,
);

/* ── Margens ─────────────────────────────────────────────────────────────── */
const dirX = dir?.x ?? W - 1;
const topoY = topo?.y ?? 0;
const baseY = base?.y ?? H - 1;
const pct = (v, total) => `${((v / total) * 100).toFixed(2)}%`;
console.log('');
console.log('margens (px de imagem → % da captura):');
console.log(`  esquerda ${esqX} → ${pct(esqX, W)} da largura`);
console.log(`  direita  ${W - 1 - dirX} → ${pct(W - 1 - dirX, W)} da largura`);
console.log(`  topo     ${topoY} → ${pct(topoY, H)} da altura`);
console.log(`  base     ${H - 1 - baseY} → ${pct(H - 1 - baseY, H)} da altura`);
console.log(`card ${dirX - esqX}×${baseY - topoY} (proporção ${((dirX - esqX) / (baseY - topoY)).toFixed(3)})`);
console.log(`altura do card em % da captura: ${pct(baseY - topoY, H)}`);

/* ── Raio dos cantos da direita ──────────────────────────────────────────── */
function bordaDireitaEm(y) {
  const m = picoCiano(W - 1, y, -1, 0, Math.round(W * 0.25));
  return m && m.v > 12 ? m.x : null;
}
for (const [nome, passo, y0] of [
  ['canto sup. dir.', 1, topoY],
  ['canto inf. dir.', -1, baseY],
]) {
  let raio = 0;
  for (let d = 0; d < 90; d += 1) {
    const x = bordaDireitaEm(y0 + passo * d);
    if (x === null) continue;
    if (dirX - x <= 1) {
      raio = d;
      break;
    }
  }
  console.log(`${nome}: arco termina ${raio}px depois da borda → raio ≈ ${raio}px de imagem`);
}

/* ── Onde o traço MORRE ao longo do topo e da base ────────────────────────
   Este é o achado que decide como o contorno pode ser construído: o traço da
   referência NÃO tem intensidade constante. Na direita ele é cheio e uniforme
   de cima a baixo; no topo e na base ele DESVANECE indo para a esquerda, e na
   esquerda não existe. Ou seja, não é um `border` de quatro lados com opacidade
   — é um traço com gradiente ao longo do próprio percurso, na mesma direção em
   que a mídia dissolve. Uma borda uniforme aqui contradiria a referência.

   Ler com uma ressalva: no TOPO, entre x≈340 e x≈1370, o valor ~98 (`#1c639a`)
   NÃO é o traço — é a barra azul do cabeçalho do site, que cai dentro da janela
   de ±5px da varredura. No topo, só as amostras do fim da direita (≈200+) são
   traço. A BASE não tem esse vizinho e é a leitura limpa do desvanecimento:
   ~16 (nada) até x≈800, subindo de x≈900 até 196 na direita. */
function perfilAoLongo(y, rotulo) {
  const amostras = [];
  for (let x = Math.round(W * 0.06); x < W * 0.96; x += Math.round(W * 0.06)) {
    let melhor = -99;
    for (let d = -5; d <= 5; d += 1) {
      const v = ciano(px(x, y + d));
      if (v > melhor) melhor = v;
    }
    amostras.push(`${x}:${melhor.toFixed(0)}`);
  }
  console.log(`${rotulo} (x:ciano) ${amostras.join('  ')}`);
}
console.log('');
console.log('intensidade do traço ao longo do percurso:');
if (topo) perfilAoLongo(topo.y, '  topo ');
if (base) perfilAoLongo(base.y, '  base ');
