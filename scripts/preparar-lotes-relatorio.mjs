import fs from 'node:fs';
import path from 'node:path';

const ORIGEM_IN_REVIEW = process.argv[2];
const DESTINO = path.resolve('docs/relatorio-entregas/_lotes');

const done = [
  278, 272, 268, 267, 254, 245, 238, 165, 161, 98, 94, 93, 92, 91, 90, 89, 88,
  87, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 33,
].map((n) => `SIS-${n}`);

const inReview = JSON.parse(fs.readFileSync(ORIGEM_IN_REVIEW, 'utf8'))
  .issues.map((i) => i.id)
  .sort((a, b) => Number(b.slice(4)) - Number(a.slice(4)));

const todas = [...done, ...inReview];
const duplicadas = todas.filter((id, i) => todas.indexOf(id) !== i);
if (duplicadas.length) throw new Error(`ids repetidos: ${duplicadas.join(', ')}`);

const TAMANHO = 22;
fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });

const lotes = [];
for (let i = 0; i < todas.length; i += TAMANHO) {
  const numero = String(lotes.length + 1).padStart(2, '0');
  const ids = todas.slice(i, i + TAMANHO);
  fs.writeFileSync(
    path.join(DESTINO, `lote-${numero}.json`),
    JSON.stringify({ lote: numero, ids }, null, 2),
  );
  lotes.push({ numero, quantidade: ids.length, de: ids[0], ate: ids.at(-1) });
}

console.log(`done: ${done.length} · in review: ${inReview.length} · total: ${todas.length}`);
console.table(lotes);
