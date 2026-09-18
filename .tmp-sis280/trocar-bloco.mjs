/* Troca o bloco da SIS-249 em globals.css pelo da SIS-280, por ÂNCORA de texto e
   não por número de linha: a árvore é compartilhada e as linhas andam. */
import { readFileSync, writeFileSync } from 'node:fs';

const ARQ = 'src/app/globals.css';
const css = readFileSync(ARQ, 'utf8');

const INICIO = '/* SIS-249 · /sistran-university — a seção do Programa ganha fundo composto';
const FIM = 'SIS-253 · «Fale com a Gente!» de /esg no desenho da referência';

const i = css.indexOf(INICIO);
/* O comentário da SIS-253 abre com uma régua de `=`; volta-se até o início dela. */
const marca = css.indexOf(FIM);
const j = marca < 0 ? -1 : css.lastIndexOf('/* ===', marca);
if (i < 0 || j < 0 || j < i) {
  console.error('âncoras não encontradas', { i, j });
  process.exit(1);
}
console.log('substituindo', j - i, 'caracteres');
writeFileSync('.tmp-sis280/bloco-sis249-removido.css', css.slice(i, j), 'utf8');

const novo = readFileSync('.tmp-sis280/bloco.css', 'utf8');
writeFileSync(ARQ, `${css.slice(0, i)}${novo.trimEnd()}\n\n${css.slice(j)}`, 'utf8');
console.log('ok');
