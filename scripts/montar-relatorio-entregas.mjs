import fs from 'node:fs';
import path from 'node:path';

const PASTA = path.resolve('docs/relatorio-entregas');
const SAIDA = path.resolve('docs/RELATORIO-ENTREGAS-SIS.md');

const partes = fs
  .readdirSync(PASTA)
  .filter((n) => /^parte-\d+\.md$/.test(n))
  .sort();

if (!partes.length) throw new Error('nenhum parte-NN.md encontrado');

const corpos = [];
const indice = [];

for (const nome of partes) {
  const texto = fs.readFileSync(path.join(PASTA, nome), 'utf8').trim();
  corpos.push(texto);

  const linhas = texto.split('\n');
  for (let i = 0; i < linhas.length; i += 1) {
    const cabecalho = linhas[i].match(/^##\s+(SIS-\d+)\s+—\s+(.+)$/);
    if (!cabecalho) continue;
    const [, id, titulo] = cabecalho;
    const metaLinha = linhas.slice(i + 1, i + 5).find((l) => l.startsWith('**Status:**')) ?? '';
    const status = metaLinha.match(/\*\*Status:\*\*\s*([^·\n]+)/)?.[1].trim() ?? '—';
    const labels = metaLinha.match(/\*\*Labels:\*\*\s*([^·\n]+)/)?.[1].trim() ?? '—';

    const fim = linhas.findIndex((l, j) => j > i && /^##\s+SIS-\d+/.test(l));
    const secao = linhas.slice(i, fim === -1 ? linhas.length : fim).join('\n');

    indice.push({
      id,
      titulo,
      status,
      labels,
      parte: nome,
      semRelatorio: secao.includes('Sem relatório de entrega no Linear.'),
      semConferencia: secao.includes('Sem registro de conferência no Linear.'),
    });
  }
}

const idsVistos = indice.map((e) => e.id);
const repetidos = idsVistos.filter((id, i) => idsVistos.indexOf(id) !== i);

const todosIds = fs
  .readdirSync(path.join(PASTA, '_lotes'))
  .filter((n) => n.endsWith('.json'))
  .sort()
  .flatMap((n) => JSON.parse(fs.readFileSync(path.join(PASTA, '_lotes', n), 'utf8')).ids);

const faltando = todosIds.filter((id) => !idsVistos.includes(id));

const porStatus = indice.reduce((acc, e) => {
  acc[e.status] = (acc[e.status] ?? 0) + 1;
  return acc;
}, {});

const semRelatorio = indice.filter((e) => e.semRelatorio);
const semComentarioConferencia = indice.filter((e) => e.semConferencia);

/* A regra do ciclo SIS lê o rastro pela label, não pelo comentário: `In Review` sem
   `conferir` nem `conferido` é issue que nunca entrou em conferência. */
const nuncaConferida = indice.filter(
  (e) => e.status === 'In Review' && !/conferir|conferido/.test(e.labels),
);

const ancora = (id, titulo) =>
  `${id}-${titulo}`
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

const cabecalho = [
  '# Relatório de entregas — time SIS',
  '',
  `Levantado em ${new Date().toLocaleDateString('pt-BR')} a partir do Linear (workspace \`sistran-labs\`, time \`SIS\`).`,
  'Cobre todas as issues que estavam em **Done** e em **In Review**, com o pedido original, o relatório de entrega',
  'do executor e o veredito da conferência, quando houve.',
  '',
  '## Panorama',
  '',
  '| Coluna de origem | Issues |',
  '|---|---|',
  ...Object.entries(porStatus)
    .sort((a, b) => b[1] - a[1])
    .map(([status, n]) => `| ${status} | ${n} |`),
  `| **Total** | **${indice.length}** |`,
  '',
  '## Ressalvas de leitura',
  '',
  'Três coisas que o relatório não pode esconder, porque mudam o peso de cada seção:',
  '',
  `**Sem relatório de entrega no Linear (${semRelatorio.length}).** ` +
    'A issue mudou de coluna sem que ninguém escrevesse o que foi feito. Em parte dos casos ' +
    'o trabalho existe e só não foi documentado — a SIS-198 é o exemplo, e a seção dela traz a ' +
    'entrega reconstruída por leitura do código. Em outros, a issue saltou de `Backlog` direto ' +
    'para `In Review` sem passar por `In Progress`, o que indica migração de status em lote, não entrega. ' +
    'Cada seção diz qual é o caso.',
  '',
  semRelatorio.length ? `> ${semRelatorio.map((e) => e.id).join(', ')}` : '> Nenhuma.',
  '',
  `**Nunca entrou em conferência (${nuncaConferida.length} das ${porStatus['In Review'] ?? 0} em In Review).** ` +
    'Pela regra do ciclo SIS, `In Review` sem label `conferir` nem `conferido` significa que a issue ' +
    'nunca foi auditada. É o sinal mais importante do documento: são entregas que ninguém checou contra o código, ' +
    'e tratá-las como fechadas é uma decisão, não um fato.',
  '',
  `**Sem comentário de conferência (${semComentarioConferencia.length}).** ` +
    'Recorte mais largo e mais frouxo que o anterior: inclui issues que têm a label mas cujo veredito não foi ' +
    'escrito na issue, e as `Done` fechadas deliberadamente sem auditoria. Serve para achar o rastro que falta, ' +
    'não para julgar a entrega.',
  '',
  '## Índice',
  '',
  '| Issue | Título | Origem | Labels | Ressalva |',
  '|---|---|---|---|---|',
  ...indice.map((e) => {
    const ressalvas = [
      e.semRelatorio ? 'sem relatório' : '',
      nuncaConferida.includes(e) ? 'nunca conferida' : '',
      e.semConferencia && !nuncaConferida.includes(e) ? 'sem comentário de conferência' : '',
    ].filter(Boolean);
    return `| [${e.id}](#${ancora(e.id, e.titulo)}) | ${e.titulo} | ${e.status} | ${e.labels} | ${ressalvas.join(' · ') || '—'} |`;
  }),
  '',
  '---',
  '',
].join('\n');

fs.writeFileSync(SAIDA, `${cabecalho}${corpos.join('\n\n---\n\n')}\n`);

console.log(`partes: ${partes.length} · seções: ${indice.length} · destino: ${SAIDA}`);
console.log('por status:', porStatus);
if (repetidos.length) console.log('REPETIDOS:', repetidos.join(', '));
if (faltando.length) console.log('FALTANDO:', faltando.join(', '));
if (!repetidos.length && !faltando.length) console.log('cobertura completa: 261/261');
