/**
 * SIS-214 — leitor do JSON de `medir-sequencia-luminna-sis214.mjs`. Só formata: põe
 * antes e depois lado a lado para a ordem de leitura ser conferida linha por linha.
 *
 *   node scripts/resumir-sequencia-luminna-sis214.mjs
 */
import { readFile } from 'node:fs/promises';

const DESTINO = 'docs/capturas/sis214-luminna';

for (const marca of ['antes', 'depois']) {
  const j = JSON.parse(await readFile(`${DESTINO}/${marca}.json`, 'utf8'));
  console.log('#####', marca.toUpperCase());
  for (const largura of Object.keys(j)) {
    for (const modo of Object.keys(j[largura])) {
      const b = j[largura][modo];
      console.log('==', largura, modo, JSON.stringify(b['#caixa']));
      if (b['#emendaNumerosSequencia'])
        console.log('   emenda', JSON.stringify(b['#emendaNumerosSequencia']));
      for (const k of Object.keys(b)) {
        if (!k.startsWith('f')) continue;
        const p = b[k];
        console.log(
          '  ',
          k,
          'rol=' + p.rolagem,
          'luminnaAntes=' + p['#luminnaAntesDeDesafios'],
          'domBateY=' + p['#ordemDoDomBateComOY'],
          'verbatim=' + JSON.stringify(p['#verbatim']),
          'visiveis=' + p['#todosVisiveis'],
        );
        for (const i of p.itens)
          console.log(
            '     ',
            i.dom,
            i.tag,
            i.classe,
            'y=' + i.y,
            'vis=' + i.visivel,
            JSON.stringify(i.texto.slice(0, 40)),
          );
      }
    }
  }
}
