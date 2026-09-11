/**
 * SIS-201 — mede a TINTA de cada logo de parceiro para decidir a placa do card.
 *
 * POR QUE MEDIR EM VEZ DE OLHAR
 * O card horizontal tem fundo escuro (imagem editorial + overlay navy). A
 * decisão "chip branco atrás da logo" é o precedente do `PartnersGrid`
 * (`PartnersGrid.tsx:183`, `bg-white` com a logo em `object-contain`), e ela
 * funciona para logo de tinta escura — que é a maioria. Mas basta UM logo
 * desenhado em branco para o chip branco apagá-lo por completo, e o nome do
 * arquivo `st-it-sombra-branca.png` diz exatamente isso. Olhar a miniatura no
 * explorador de arquivos não distingue "PNG de fundo transparente com tinta
 * branca" de "PNG de fundo branco": as duas aparecem claras.
 *
 * O QUE ELE MEDE
 * Decodifica o PNG em RGBA cru (sharp, já instalado como dependência do Next),
 * descarta o que é transparente (alpha <= 128, que é fundo e não tinta) e sobre
 * o que sobra calcula:
 *   - luminância relativa média da tinta (WCAG 2.x, com a linearização de canal);
 *   - a fração de tinta clara (L > 0.5), que é o que denuncia logo branco;
 *   - o contraste da tinta média contra o chip branco (#fff) e contra o fundo
 *     navy do card.
 *
 * A RÉGUA
 * Logo é gráfico essencial: o alvo é WCAG 1.4.11 (non-text contrast), 3:1 — não
 * os 4.5:1 de texto. Quem não alcança 3:1 contra o chip branco não vai no chip
 * branco.
 *
 * O NAVY DO CARD não é uma cor chapada: é `rgba(3, 25, 48, 0.96)` sobre a
 * imagem (`partner-terminal-cards.css:134`). Uso a composição sobre um cinza
 * médio (#808080) como pior caso realista da imagem por baixo — se der 3:1
 * contra esse, dá contra a imagem clara e contra a escura.
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

/* Linearização de canal da WCAG 2.x — não é `v / 255` direto. */
const canal = (v) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

/* Overlay do card composto sobre cinza médio: pior caso realista da imagem. */
const OVER = [3, 25, 48];
const ALPHA = 0.96;
const navy = OVER.map((c) => c * ALPHA + 128 * (1 - ALPHA));
const L_NAVY = luminancia(...navy);
const L_BRANCO = luminancia(255, 255, 255);

const partners = (() => {
  const fonte = readFileSync('src/data/partners.ts', 'utf8');
  const re = /id: '([^']+)'[\s\S]*?logo: '([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(fonte))) out.push({ id: m[1], logo: m[2] });
  return out;
})();

console.log(`navy do card (composto): rgb(${navy.map(Math.round).join(', ')})\n`);
console.log(
  'parceiro'.padEnd(17) +
    'L tinta'.padEnd(9) +
    '% clara'.padEnd(9) +
    'x #fff'.padEnd(9) +
    'x navy'.padEnd(9) +
    'placa',
);
console.log('-'.repeat(66));

const veredito = [];

for (const p of partners) {
  const { data, info } = await sharp(`public${p.logo}`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let soma = 0;
  let claros = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] <= 128) continue; // transparente = fundo, não tinta
    const L = luminancia(data[i], data[i + 1], data[i + 2]);
    soma += L;
    if (L > 0.5) claros += 1;
    n += 1;
  }

  const L = n ? soma / n : 0;
  const fracaoClara = n ? claros / n : 0;
  const cBranco = contraste(L, L_BRANCO);
  const cNavy = contraste(L, L_NAVY);

  /* Tinta predominantemente clara, ou que não alcança 3:1 no branco, vai sem
     chip — direto sobre o navy, onde ela é que tem contraste. */
  const placa = fracaoClara > 0.5 || cBranco < 3 ? 'SEM CHIP (tinta clara)' : 'chip branco';

  veredito.push({ ...p, L, fracaoClara, cBranco, cNavy, placa });
  console.log(
    p.id.padEnd(17) +
      L.toFixed(3).padEnd(9) +
      `${(fracaoClara * 100).toFixed(0)}%`.padEnd(9) +
      `${cBranco.toFixed(2)}:1`.padEnd(9) +
      `${cNavy.toFixed(2)}:1`.padEnd(9) +
      placa,
  );
}

const semChip = veredito.filter((v) => v.placa.startsWith('SEM'));
console.log(`\n${veredito.length - semChip.length} de ${veredito.length} no chip branco.`);
if (semChip.length) {
  console.log('Tinta clara, precisa de tratamento próprio:');
  for (const v of semChip) {
    console.log(
      `  ${v.id} — ${(v.fracaoClara * 100).toFixed(0)}% da tinta clara, ` +
        `${v.cBranco.toFixed(2)}:1 no branco, ${v.cNavy.toFixed(2)}:1 no navy`,
    );
  }
}
