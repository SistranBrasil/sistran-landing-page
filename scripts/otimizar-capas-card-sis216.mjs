/**
 * SIS-216 — derivadas WebP das sete capas do card de acelerador.
 *
 * POR QUE CONVERTER, e não apontar o `next/image` para o PNG
 * `images: { unoptimized: true }` no `next.config.mjs` (SIS-154, apuração em
 * `docs/images-unoptimized.md`) faz o `next/image` servir o arquivo EXATAMENTE
 * como ele está em `public/`: sem `srcset`, sem recorte, sem recompressão. As
 * sete artes de `capa-card/` têm 1672x941 e de 1574 kB a 1816 kB cada — 12,0 MB
 * somados, todos na MESMA seção da mesma rota. Sem derivada, abrir `/solucoes`
 * baixaria isso.
 *
 * DUAS LARGURAS, E ELAS SÃO MEDIDAS, NÃO ESCOLHIDAS
 * O `.container-lp` satura em `max-w-container` (1180px) e gasta `lg:px-8`, ou
 * seja 1116px úteis. Daí saem as duas caixas do arranjo desta issue:
 *
 *   · o card de DESTAQUE (Lumina AI) é de largura total  → 1116px de caixa;
 *   · os outros seis dividem duas colunas com 20px de vão → 548px de caixa.
 *
 * `LARGURA_DESTAQUE = 1672` é o tamanho nativo do arquivo, mantido de propósito:
 * 1116px de caixa pedem 1,5x, e a arte não tem mais que isso para dar. Reduzir
 * para 1116 entregaria borrado em qualquer tela com DPR > 1,5 — e a foto ocupa
 * o card inteiro, não uma miniatura.
 *
 * `LARGURA_CARTAO = 1100` é 2,01x os 548px da coluna: cobre DPR 2 inteiro e mais
 * o zoom de 1,06 do hover (548 × 2 × 1,06 = 1162 — dentro de 1,06 de folga do
 * alvo, e o hover é estado passageiro, não o de leitura). Recortar a 548 daria
 * ~90 kB por peça mas só serviria a DPR 1.
 *
 * `quality: 78` + `smartSubsample`: o mesmo par de
 * `otimizar-capas-solucoes-sis286.mjs`, e pelo mesmo motivo — são renders
 * SINTÉTICOS com painéis de UI saturados (os chips de «Auto / Residencial», os
 * checks verdes do QA, o ciano dos ícones do Guru), onde franja de croma aparece
 * antes de qualquer artefato de luminância.
 *
 * Uso: node scripts/otimizar-capas-card-sis216.mjs
 *
 * `sharp` não é dependência declarada: vem com o Next e serve a script de
 * build-time, nunca a código de runtime.
 */

import { readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const PASTA = 'public/images/solucoes/capa-card';
const QUALIDADE = 78;
const LARGURA_DESTAQUE = 1672;
const LARGURA_CARTAO = 1100;

/** Só a Lumina AI é card de largura total — ver "DUAS LARGURAS". */
const DESTAQUE = 'luminna-ai-realista-componentes-v3.png';

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

const arquivos = (await readdir(PASTA)).filter((f) => f.endsWith('.png'));
let antesTotal = 0;
let depoisTotal = 0;

for (const arquivo of arquivos) {
  const origem = `${PASTA}/${arquivo}`;
  const destino = origem.replace(/\.png$/, '.webp');
  const largura = arquivo === DESTAQUE ? LARGURA_DESTAQUE : LARGURA_CARTAO;

  const antes = (await stat(origem)).size;
  const info = await sharp(origem)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: QUALIDADE, smartSubsample: true })
    .toFile(destino);

  antesTotal += antes;
  depoisTotal += info.size;
  console.log(`${arquivo} (${kb(antes)})`);
  console.log(`  -> ${destino.split('/').pop()} (${info.width}x${info.height}, ${kb(info.size)})`);
}

console.log(`\ntotal: ${kb(antesTotal)} -> ${kb(depoisTotal)}`);
console.log(`reducao: ${Math.round((1 - depoisTotal / antesTotal) * 100)}%`);
