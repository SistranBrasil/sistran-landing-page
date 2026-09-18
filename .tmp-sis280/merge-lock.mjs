/* Atualiza no copy-lock SÓ as chaves de `src/app/sistran-university/page.tsx`.
   A árvore tem trabalho não commitado de outras issues (Header da SIS-279,
   RevealScope, parceiros) que também mudou a escrita; regenerar o lock inteiro
   travaria texto alheio em nome desta issue. Mesmo procedimento da SIS-279. */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LOCK = 'copy-lock.json';
const ALVO = 'src/app/sistran-university/page.tsx:';

const antes = JSON.parse(readFileSync(LOCK, 'utf8'));
copyFileSync(LOCK, '.tmp-sis280/lock-backup.json');
execSync('node scripts/copy-lock.mjs', { stdio: 'inherit' });
const gerado = JSON.parse(readFileSync(LOCK, 'utf8'));

const saida = {};
for (const k of Object.keys(gerado)) {
  if (k.startsWith(ALVO)) saida[k] = gerado[k];
  else if (k in antes) saida[k] = antes[k];
}
/* Chaves que existiam antes e sumiram por mexida alheia voltam como estavam. */
for (const k of Object.keys(antes)) if (!(k in saida)) saida[k] = antes[k];

const ordenado = Object.fromEntries(
  Object.keys(saida)
    .sort((a, b) => {
      const [fa, na] = [a.slice(0, a.lastIndexOf(':')), Number(a.slice(a.lastIndexOf(':') + 1))];
      const [fb, nb] = [b.slice(0, b.lastIndexOf(':')), Number(b.slice(b.lastIndexOf(':') + 1))];
      return fa === fb ? na - nb : fa < fb ? -1 : 1;
    })
    .map((k) => [k, saida[k]]),
);
writeFileSync(LOCK, `${JSON.stringify(ordenado, null, 2)}\n`);
console.log('chaves:', Object.keys(ordenado).length);

/* O que mudou SÓ nas chaves do alvo, para o relatório. */
for (const k of Object.keys(ordenado)) {
  if (!k.startsWith(ALVO)) continue;
  if (antes[k] !== ordenado[k]) console.log('  ~', k, JSON.stringify(antes[k]), '→', JSON.stringify(ordenado[k]));
}
for (const k of Object.keys(antes)) {
  if (k.startsWith(ALVO) && !(k in ordenado)) console.log('  -', k, JSON.stringify(antes[k]));
}
