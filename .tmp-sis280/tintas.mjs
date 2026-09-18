import sharp from 'sharp';

const f = 'public/imagensexemplo/exemploprograma.png';
const r = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = r.info.width;
const H = r.info.height;
const px = (x, y) => {
  const k = (y * W + x) * r.info.channels;
  return [r.data[k], r.data[k + 1], r.data[k + 2]];
};
const hex = ([R, G, B]) => '#' + [R, G, B].map((c) => c.toString(16).padStart(2, '0')).join('');
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([R, G, B]) => 0.2126 * lin(R) + 0.7152 * lin(G) + 0.0722 * lin(B);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/* Moda das cores de uma região, ignorando o fundo claro — é como se acha a
   tinta chapada de um glifo antialiasado. */
const moda = (x0, x1, y0, y1, filtro) => {
  const conta = new Map();
  for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y += 1) {
    for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x += 1) {
      const c = px(x, y);
      if (!filtro(c)) continue;
      const k = c.join(',');
      conta.set(k, (conta.get(k) ?? 0) + 1);
    }
  }
  return [...conta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
};

const azul = (c) => c[2] > 150 && c[2] - c[0] > 80 && c[1] > 80 && c[1] < 210;
const escuro = (c) => c[0] + c[1] + c[2] < 200;

console.log('-- titulo linha 2, trecho azul (x 0.145-0.37, y 0.455-0.495) --');
console.log(moda(0.145, 0.37, 0.455, 0.495, azul).map(([k, n]) => `${hex(k.split(',').map(Number))} (${k}) x${n}`).join('\n'));

console.log('\n-- rotulo O PROGRAMA (x 0.095-0.2, y 0.338-0.355) --');
console.log(moda(0.095, 0.2, 0.338, 0.355, azul).map(([k, n]) => `${hex(k.split(',').map(Number))} x${n}`).join('\n'));

console.log('\n-- traco do rotulo (x 0.065-0.09, y 0.34-0.352) --');
console.log(moda(0.065, 0.09, 0.34, 0.352, (c) => c[2] > 200 && c[2] - c[0] > 60).map(([k, n]) => `${hex(k.split(',').map(Number))} x${n}`).join('\n'));

console.log('\n-- titulo linha 1, tinta escura --');
console.log(moda(0.05, 0.35, 0.39, 0.45, escuro).map(([k, n]) => `${hex(k.split(',').map(Number))} x${n}`).join('\n'));

console.log('\n-- paragrafo, tinta --');
console.log(moda(0.05, 0.35, 0.545, 0.575, (c) => c[0] + c[1] + c[2] < 330).map(([k, n]) => `${hex(k.split(',').map(Number))} x${n}`).join('\n'));

console.log('\n-- borda do quadro (ciano chapado) --');
console.log(moda(0.35, 0.42, 0.25, 0.8, (c) => c[2] > 215 && c[1] > 180 && c[2] - c[0] > 90).map(([k, n]) => `${hex(k.split(',').map(Number))} x${n}`).join('\n'));

const FUNDO = [243, 249, 254];
console.log('\n-- contraste contra o fundo', hex(FUNDO), '--');
for (const [nome, c] of [
  ['titulo navy #0a1f44 (token da casa)', [10, 31, 68]],
  ['azul do titulo medido', [26, 133, 240]],
  ['#0079cb (ciano em fundo claro, casa)', [0, 121, 203]],
  ['#1273bc (azul da rota)', [18, 115, 188]],
  ['#024e86 (eyebrow claro, casa)', [2, 78, 134]],
  ['#0063d4 (rotulo medido)', [0, 99, 212]],
  ['#3d5a80 (text-ink-muted claro)', [61, 90, 128]],
]) {
  console.log(nome.padEnd(38), razao(c, FUNDO).toFixed(2) + ':1');
}

/* A GRADE do fundo: passo entre as linhas verticais claras. */
console.log('\n-- passo da grade no fundo (linha y=0.06) --');
const y = Math.round(0.06 * H);
const marcas = [];
for (let x = 2; x < Math.round(0.33 * W); x += 1) {
  const a = px(x - 1, y);
  const b = px(x, y);
  if (Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + Math.abs(b[2] - a[2]) >= 3) marcas.push(x);
}
console.log('transicoes em x:', marcas.join(' '));
