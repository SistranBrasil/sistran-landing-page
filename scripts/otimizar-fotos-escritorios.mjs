/**
 * Converte as fotos dos escritorios para WebP em duas larguras.
 *
 * As originais em `public/images/escritoriosp` e `public/images/escritoriopb`
 * somam 21 MB — `sp5.png` sozinho tem 9,4 MB. Como o projeto roda com
 * `images: { unoptimized: true }`, o `next/image` nao comprime nada em tempo de
 * execucao: se a foto for grande no disco, ela chega grande no visitante. Entao
 * a compressao acontece aqui, uma vez, e o resultado vai versionado.
 *
 * As originais ficam onde estao, intactas: sao a fonte para regerar.
 *
 * Uso: node scripts/otimizar-fotos-escritorios.mjs
 *
 * `sharp` nao é dependencia declarada do projeto — vem junto com o Next. Isso
 * vale para um script de build-time, mas nao serviria para codigo de runtime.
 */

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const ORIGENS = [
  { pasta: 'public/images/escritoriosp', prefixo: 'sp' },
  { pasta: 'public/images/escritoriopb', prefixo: 'pb' },
];
const DESTINO = 'public/images/escritorios';
const LARGURAS = [960, 1600];
const QUALIDADE = 74;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir(DESTINO, { recursive: true });

let pesoOriginal = 0;
let pesoFinal = 0;
const manifesto = [];

for (const { pasta, prefixo } of ORIGENS) {
  const arquivos = (await readdir(pasta)).filter((nome) => /\.(jpe?g|png)$/i.test(nome)).sort();

  for (const arquivo of arquivos) {
    const caminho = join(pasta, arquivo);
    pesoOriginal += (await stat(caminho)).size;

    const base = `${prefixo}-${parse(arquivo).name.replace(/^(sp|pb)/i, '').replace(/^[-_]+/, '')}`;
    const original = sharp(caminho).rotate();
    const { width = 0, height = 0 } = await original.metadata();
    const registro = { base, largura: width, altura: height, saidas: [] };

    for (const larguraAlvo of LARGURAS) {
      // Nunca ampliar: uma foto menor que o alvo sai no tamanho que tem.
      const largura = Math.min(larguraAlvo, width || larguraAlvo);
      const nome = `${base}-${larguraAlvo}.webp`;
      const saida = join(DESTINO, nome);
      const info = await sharp(caminho)
        .rotate()
        .resize({ width: largura, withoutEnlargement: true })
        .webp({ quality: QUALIDADE })
        .toFile(saida);

      pesoFinal += info.size;
      registro.saidas.push({ nome, largura: info.width, altura: info.height, bytes: info.size });
      console.log(`${caminho} -> ${saida} (${info.width}px, ${kb(info.size)})`);
    }

    manifesto.push(registro);
  }
}

await writeFile(join(DESTINO, 'manifesto.json'), `${JSON.stringify(manifesto, null, 2)}\n`);

console.log(`\noriginais: ${kb(pesoOriginal)}  ->  webp: ${kb(pesoFinal)}`);
