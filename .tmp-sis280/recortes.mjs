import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('.tmp-sis280/recortes', { recursive: true });
const f = 'public/imagensexemplo/exemploprograma.png';
const { width: W, height: H } = await sharp(f).metadata();

const recortes = {
  'canto-topo-esq': [0.33, 0.1, 0.22, 0.2],
  'canto-pe-dir': [0.82, 0.74, 0.18, 0.26],
  'coluna-texto': [0.0, 0.29, 0.42, 0.33],
  'acentos-esq': [0.0, 0.0, 0.3, 1.0],
};
for (const [nome, [fx, fy, fw, fh]] of Object.entries(recortes)) {
  await sharp(f)
    .extract({
      left: Math.round(fx * W),
      top: Math.round(fy * H),
      width: Math.round(fw * W),
      height: Math.round(fh * H),
    })
    .resize({ width: Math.min(900, Math.round(fw * W * 2)) })
    .toFile(`.tmp-sis280/recortes/${nome}.png`);
  console.log(nome);
}
