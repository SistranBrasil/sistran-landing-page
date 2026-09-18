import sharp from 'sharp';

const f = 'public/imagensexemplo/exemploprograma.png';
const meta = await sharp(f).metadata();
console.log('referencia', meta.width, meta.height, 'razao', (meta.width / meta.height).toFixed(3));

for (const a of [
  'public/images/university/university-programa.webp',
  'public/images/university/1-Sistran-university.png',
]) {
  const m = await sharp(a).metadata();
  console.log(a, m.width, m.height, (m.width / m.height).toFixed(3), m.size);
}

const r = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = r.info.width;
const H = r.info.height;
const px = (x, y) => {
  const k = (y * W + x) * r.info.channels;
  return [r.data[k], r.data[k + 1], r.data[k + 2]];
};
/* Coordenadas em fração, porque o que se mediu na tela foi a versão de 1024. */
const pf = (fx, fy) => px(Math.round(fx * W), Math.round(fy * H));
const hex = ([R, G, B]) => '#' + [R, G, B].map((c) => c.toString(16).padStart(2, '0')).join('');

console.log('\n-- fundo --');
for (const [fx, fy] of [
  [0.02, 0.03],
  [0.02, 0.5],
  [0.02, 0.95],
  [0.2, 0.03],
  [0.36, 0.5],
  [0.2, 0.96],
  [0.38, 0.95],
]) {
  console.log(fx, fy, hex(pf(fx, fy)), pf(fx, fy).join(','));
}

console.log('\n-- acentos --');
for (const [nome, fx, fy] of [
  ['quadrado pale alto', 0.1, 0.13],
  ['quadrado pale baixo', 0.175, 0.8],
  ['quadrado ciano', 0.888, 0.845],
  ['quadrado pale direita-alto', 0.905, 0.07],
  ['pontilhado', 0.11, 0.8],
  ['pontilhado direita', 0.84, 0.115],
]) {
  console.log(nome.padEnd(26), hex(pf(fx, fy)), pf(fx, fy).join(','));
}

/* O tom mais escuro de cada faixa de texto: é o miolo do glifo. */
const maisEscuro = (x0, x1, y0, y1) => {
  let melhor = null;
  for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y += 1) {
    for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x += 1) {
      const c = px(x, y);
      const s = c[0] + c[1] + c[2];
      if (!melhor || s < melhor.s) melhor = { s, c, x, y };
    }
  }
  return melhor;
};
console.log('\n-- tinta do texto (miolo do glifo) --');
const faixas = {
  'rotulo O PROGRAMA': [0.07, 0.16, 0.34, 0.36],
  'traco do rotulo': [0.01, 0.035, 0.34, 0.36],
  'titulo linha 1': [0.05, 0.35, 0.39, 0.45],
  'titulo linha 2 (ciano)': [0.1, 0.38, 0.45, 0.5],
  paragrafo: [0.05, 0.35, 0.55, 0.58],
};
for (const [k, [x0, x1, y0, y1]] of Object.entries(faixas)) {
  const m = maisEscuro(x0, x1, y0, y1);
  console.log(k.padEnd(24), hex(m.c), m.c.join(','), 'em', m.x, m.y);
}

/* A borda do quadro: pixel saturado ciano. Duas leituras por lado dão a
   inclinação sem precisar adivinhá-la. */
const cianoish = ([R, G, B]) => B > 200 && B - R > 45 && G - R > 20;
console.log('\n-- geometria do quadro --');
const bordaEsq = [];
for (const fy of [0.2, 0.35, 0.5, 0.65, 0.8]) {
  const y = Math.round(fy * H);
  let achou = null;
  for (let x = Math.round(0.33 * W); x < Math.round(0.55 * W); x += 1) {
    if (cianoish(px(x, y))) {
      achou = x;
      break;
    }
  }
  bordaEsq.push([y, achou]);
  console.log('esquerda y=' + y, achou, achou !== null ? (achou / W).toFixed(4) : '');
}
for (const fx of [0.45, 0.6, 0.8, 0.97]) {
  const x = Math.round(fx * W);
  let topo = null;
  let pe = null;
  for (let y = Math.round(0.05 * H); y < Math.round(0.5 * H); y += 1) {
    if (cianoish(px(x, y))) {
      topo = y;
      break;
    }
  }
  for (let y = H - 2; y > Math.round(0.5 * H); y -= 1) {
    if (cianoish(px(x, y))) {
      pe = y;
      break;
    }
  }
  console.log('x=' + x, 'topo', topo, topo !== null ? (topo / H).toFixed(4) : '', '· pe', pe, pe !== null ? (pe / H).toFixed(4) : '');
}
const val = bordaEsq.filter(([, x]) => x !== null);
if (val.length >= 2) {
  const [y0, x0] = val[0];
  const [y1, x1] = val[val.length - 1];
  console.log('inclinacao da borda esquerda: dx/dy =', ((x1 - x0) / (y1 - y0)).toFixed(4), '=>', ((Math.atan2(x1 - x0, y1 - y0) * 180) / Math.PI).toFixed(2), 'graus');
}
