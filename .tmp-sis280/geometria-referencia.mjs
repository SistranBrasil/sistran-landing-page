import sharp from 'sharp';

const f = 'public/imagensexemplo/exemploprograma.png';
const r = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = r.info.width;
const H = r.info.height;
const px = (x, y) => {
  const k = (y * W + x) * r.info.channels;
  return [r.data[k], r.data[k + 1], r.data[k + 2]];
};
const FUNDO = [243, 249, 254];
const dif = (c) => Math.abs(c[0] - FUNDO[0]) + Math.abs(c[1] - FUNDO[1]) + Math.abs(c[2] - FUNDO[2]);

/* SILHUETA: primeira coluna, varrendo da direita da coluna de texto, em que o
   pixel deixa de ser o fundo chapado. Pega a borda do quadro (com o halo). */
console.log('-- borda esquerda do quadro por linha --');
const esq = [];
for (let fy = 0.16; fy <= 0.87; fy += 0.05) {
  const y = Math.round(fy * H);
  let achou = null;
  for (let x = Math.round(0.36 * W); x < Math.round(0.62 * W); x += 1) {
    if (dif(px(x, y)) > 26) {
      achou = x;
      break;
    }
  }
  if (achou !== null) esq.push([y, achou]);
  console.log('y', y, (y / H).toFixed(3), '→ x', achou, achou !== null ? (achou / W).toFixed(4) : '');
}

console.log('\n-- borda de topo e de pe por coluna --');
const topos = [];
const pes = [];
for (let fx = 0.44; fx <= 0.99; fx += 0.06) {
  const x = Math.round(fx * W);
  let topo = null;
  let pe = null;
  for (let y = Math.round(0.04 * H); y < Math.round(0.5 * H); y += 1) {
    if (dif(px(x, y)) > 26) {
      topo = y;
      break;
    }
  }
  for (let y = H - 2; y > Math.round(0.5 * H); y -= 1) {
    if (dif(px(x, y)) > 26) {
      pe = y;
      break;
    }
  }
  if (topo !== null) topos.push([x, topo]);
  if (pe !== null) pes.push([x, pe]);
  console.log('x', x, (x / W).toFixed(3), '→ topo', topo, (topo / H).toFixed(3), '· pe', pe, (pe / H).toFixed(3), '· altura', pe - topo);
}

const reta = (pares) => {
  const n = pares.length;
  const sx = pares.reduce((a, [x]) => a + x, 0);
  const sy = pares.reduce((a, [, y]) => a + y, 0);
  const sxy = pares.reduce((a, [x, y]) => a + x * y, 0);
  const sxx = pares.reduce((a, [x]) => a + x * x, 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { m, graus: (Math.atan(m) * 180) / Math.PI };
};
console.log('\ntopo   :', reta(topos), '(dy/dx; negativo = sobe para a direita)');
console.log('pe     :', reta(pes));
console.log('esquerda (dx/dy):', reta(esq.map(([y, x]) => [y, x])));

/* Altura aparente nas duas pontas: é o que revela perspectiva (rotateY). */
const alturaEm = (fx) => {
  const x = Math.round(fx * W);
  let topo = null;
  let pe = null;
  for (let y = Math.round(0.04 * H); y < Math.round(0.5 * H); y += 1) if (dif(px(x, y)) > 26) { topo = y; break; }
  for (let y = H - 2; y > Math.round(0.5 * H); y -= 1) if (dif(px(x, y)) > 26) { pe = y; break; }
  return { topo, pe, h: pe - topo };
};
console.log('\naltura aparente perto da esquerda (0.46):', alturaEm(0.46));
console.log('altura aparente no meio (0.72):', alturaEm(0.72));
console.log('altura aparente perto da direita (0.97):', alturaEm(0.97));

/* Cor da borda do quadro: média dos pixels na moldura, logo depois da silhueta. */
console.log('\n-- cor da moldura --');
for (const fy of [0.3, 0.5, 0.7]) {
  const y = Math.round(fy * H);
  let x0 = null;
  for (let x = Math.round(0.36 * W); x < Math.round(0.62 * W); x += 1) if (dif(px(x, y)) > 26) { x0 = x; break; }
  if (x0 === null) continue;
  const linha = [];
  for (let d = 0; d < 22; d += 2) linha.push(px(x0 + d, y).join(','));
  console.log('y', y, 'a partir de x', x0, linha.join(' | '));
}
