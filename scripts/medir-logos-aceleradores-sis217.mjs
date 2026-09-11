/**
 * SIS-217 — mede a TINTA das logos dos aceleradores contra o navy do card.
 *
 * POR QUE MEDIR
 * O card de `/solucoes` (`Accelerators.tsx`) tem fundo navy translúcido sobre a
 * seção clara. Trocar o glifo Lucide pela logo do produto só é seguro se cada
 * logo tiver tinta clara o bastante para sobreviver a esse navy — e o nome do
 * arquivo não responde isso: `Fastlogo.png` pode ser tinta escura tanto quanto
 * `Lumina-AI-horizontal-branca.png` é branca. Mesmo método da SIS-201
 * (`scripts/medir-logos-parceiros-sis201.mjs`), aplicado a outra superfície.
 *
 * O QUE ELE MEDE
 * Decodifica o PNG em RGBA cru, descarta o transparente (alpha <= 128, que é
 * fundo e não tinta) e sobre o que sobra calcula luminância média da tinta,
 * fração de tinta clara (L > 0.5) e o contraste contra o navy do card.
 *
 * A RÉGUA
 * Logo é gráfico essencial: WCAG 1.4.11 (non-text contrast), 3:1 — não os 4.5:1
 * de texto.
 *
 * O NAVY DO CARD é um degradê translúcido
 * (`linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%,
 * rgba(4,29,55,0.94))`) sobre `.section-light-blue`, cuja base clareia até
 * `#e3f1fb` no meio. A parada mais CLARA do composto é o pior caso para tinta
 * clara, e é ela que este script usa.
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const canal = (v) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

/* Parada mais clara do card (alfa 0,90) sobre a base mais clara da seção. */
const CARD = [6, 38, 69];
const ALPHA = 0.9;
const SECAO = [0xe3, 0xf1, 0xfb];
const navy = CARD.map((c, i) => c * ALPHA + SECAO[i] * (1 - ALPHA));
const L_NAVY = luminancia(...navy);

const aceleradores = (() => {
  const fonte = readFileSync('src/data/accelerators.ts', 'utf8');
  const re = /id: '([^']+)'[\s\S]*?logo: '([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(fonte))) out.push({ id: m[1], logo: m[2] });
  return out;
})();

console.log(`navy do card (parada mais clara, composta): rgb(${navy.map(Math.round).join(', ')})\n`);
console.log(
  'acelerador'.padEnd(19) +
    'px'.padEnd(12) +
    'L tinta'.padEnd(9) +
    '% clara'.padEnd(9) +
    'x navy'.padEnd(9) +
    'veredito',
);
console.log('-'.repeat(74));

let reprovados = 0;

for (const a of aceleradores) {
  const { data, info } = await sharp(`public${a.logo}`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let soma = 0;
  let claros = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] <= 128) continue;
    const L = luminancia(data[i], data[i + 1], data[i + 2]);
    soma += L;
    if (L > 0.5) claros += 1;
    n += 1;
  }

  const L = n ? soma / n : 0;
  const fracaoClara = n ? claros / n : 0;
  const cNavy = contraste(L, L_NAVY);
  const ok = cNavy >= 3;
  if (!ok) reprovados += 1;

  console.log(
    a.id.padEnd(19) +
      `${info.width}x${info.height}`.padEnd(12) +
      L.toFixed(3).padEnd(9) +
      `${(fracaoClara * 100).toFixed(0)}%`.padEnd(9) +
      `${cNavy.toFixed(2)}:1`.padEnd(9) +
      (ok ? 'OK' : 'ABAIXO DE 3:1'),
  );
}

console.log(
  `\n${aceleradores.length - reprovados} de ${aceleradores.length} acima de 3:1 contra o navy.`,
);
process.exit(reprovados ? 1 : 0);
