/**
 * SIS-305 — portão contra opacidade Tailwind que não gera CSS.
 *
 * ── O defeito que este script existe para não deixar voltar ──────────────────
 * O modificador de opacidade SEM colchetes (`bg-white/12`) não é um número
 * livre: o Tailwind 3 o procura em `theme.opacity`, cuja escala padrão anda de
 * cinco em cinco (0, 5, 10, …, 100). Valor fora dela — `/12`, `/18`, `/97` —
 * **não gera classe nenhuma**, e o elemento fica sem a propriedade.
 *
 * E nada apita. Não é erro de tipo. O ESLint não interpreta classe de Tailwind.
 * O `next build` não valida nome de utilitário. Classe inexistente é
 * indistinguível de classe ausente.
 *
 * Foi assim que o conserto da SIS-220 nasceu morto: o cartão de fecho de
 * `/solucoes/luminna-ai` estava escrito `bg-[#F1F7FC]/96` e ficou com fundo
 * 100% transparente sobre o vídeo, com a borda caindo na cinza do preflight. O
 * comentário no código ainda justificava «4% deixam o movimento do vídeo
 * insinuado nas bordas» — na prática eram 100%. Só se descobriu por captura de
 * tela, 24 dias depois. A SIS-305 varreu as outras 101 ocorrências.
 *
 * ── A forma certa ────────────────────────────────────────────────────────────
 *   bg-[#F1F7FC]/96      → nada
 *   bg-[#F1F7FC]/[96%]   → background-color: rgb(241 247 252 / 96%)
 *
 * ── Por que um script e não `eslint-plugin-tailwindcss` ──────────────────────
 * A regra `no-custom-classname` do plugin pegaria isto, e mais. O «e mais» é o
 * problema: ela acusa classe montada em tempo de execução, que este projeto usa,
 * e a triagem do falso positivo custa mais do que a falha que se quer barrar.
 * Este script pega exatamente uma coisa e não tem o que triar — decisão de
 * 05/10/2026, registrada na SIS-305.
 */

import fs from 'node:fs';
import path from 'node:path';
import defaultTheme from 'tailwindcss/defaultTheme.js';

const RAIZ = path.resolve(import.meta.dirname, '..');
const FONTE = path.join(RAIZ, 'src');
const CONFIG = path.join(RAIZ, 'tailwind.config.ts');

/* A escala vem do `defaultTheme` do próprio Tailwind instalado, e não de uma
   lista copiada aqui: lista copiada caduca na primeira atualização de versão e
   o portão passa a reprovar o que funciona. */
const ESCALA = new Set(Object.keys(defaultTheme.opacity ?? {}));

/* ⚠️ Se alguém ESTENDER `theme.opacity` no config, a escala deste script fica
   estreita e ele reprovaria classe válida. Falso positivo em portão é pior que
   portão nenhum (ensina a ignorar), então aqui ele para e pede manutenção em vez
   de acusar os arquivos. Detecção por texto porque o config é TypeScript e este
   script é `.mjs` — carregá-lo exigiria um transpilador só para isto. */
const textoConfig = fs.readFileSync(CONFIG, 'utf8');
if (/^\s*opacity\s*:/m.test(textoConfig)) {
  console.error(
    'verificar-opacidades: `tailwind.config.ts` passou a declarar `opacity`.\n' +
      'Este script lê só a escala padrão do Tailwind e ficaria reprovando classe\n' +
      'válida. Ensine-o a ler a escala do tema antes de seguir. (SIS-305)',
  );
  process.exit(2);
}

/* Os utilitários que aceitam o modificador. `shadow` e `ring` entram porque
   também o aceitam, mesmo que hoje não haja ocorrência deles. */
const UTIL =
  'bg|text|border|from|via|to|ring|shadow|fill|stroke|decoration|outline|divide|placeholder|accent|caret';

/* Casa `<util>[-lado]-<cor>/<número>` sem colchetes no número.
   • a cor pode ser arbitrária (`[#0079CB]`) ou do tema (`white`, `sky-500`);
   • `(?![%\w.])` é o que separa o caso ruim do bom: descarta `/[12%]` (começa em
     `[`, não em dígito) e `/0.055`, que é opacidade decimal e válida. */
const PADRAO = new RegExp(
  `\\b(?:${UTIL})(?:-[a-z]+)?-(?:\\[[^\\]\\s]+\\]|[a-z0-9-]+)\\/(\\d{1,3})(?![%\\w.])`,
  'g',
);

const achados = [];

function varrer(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const alvo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (!/^(node_modules|\.next)$/.test(entrada.name)) varrer(alvo);
      continue;
    }
    if (!/\.(tsx?|jsx?|css)$/.test(entrada.name)) continue;
    const linhas = fs.readFileSync(alvo, 'utf8').split('\n');
    linhas.forEach((linha, i) => {
      PADRAO.lastIndex = 0;
      let m;
      while ((m = PADRAO.exec(linha))) {
        if (ESCALA.has(m[1])) continue;

        /* CITAÇÃO, não classe. Vários comentários deste projeto explicam o defeito
           CITANDO a forma quebrada — «`from-[#001A3D]/97` NÃO GERA REGRA». Acusar
           essas linhas seria falso positivo, e pior: o conserto «óbvio» é trocar a
           citação por `/[97%]`, o que inverte o sentido da frase e deixa o
           comentário mentindo. Aconteceu de verdade em 05/10/2026, com o script que
           aplicou as 102 trocas desta issue — sete linhas de prosa foram reescritas
           e tiveram de ser restauradas à mão.
           A regra: utilitário cercado por crase dos dois lados é texto. Uma
           `className` real nunca tem uma única classe entre crases — mesmo em
           template literal, a crase cerca a string inteira, não um utilitário. */
        const antes = linha[m.index - 1];
        const depois = linha[m.index + m[0].length];
        if (antes === '`' && depois === '`') continue;
        achados.push({
          arquivo: path.relative(RAIZ, alvo).replace(/\\/g, '/'),
          linha: i + 1,
          classe: m[0],
          valor: m[1],
        });
      }
    });
  }
}

varrer(FONTE);

if (achados.length === 0) {
  console.log(
    `verificar-opacidades: OK — nenhuma opacidade fora da escala em src/. ` +
      `(escala: ${[...ESCALA].join(', ')})`,
  );
  process.exit(0);
}

console.error(
  `verificar-opacidades: ${achados.length} opacidade(s) fora da escala do tema.\n` +
    'Estas classes NÃO geram CSS — a propriedade simplesmente não é aplicada.\n' +
    'Conserto: ponha o valor entre colchetes, com o sinal de porcento.\n',
);
for (const a of achados) {
  const certo = a.classe.replace(/\/(\d{1,3})$/, '/[$1%]');
  console.error(`  ${a.arquivo}:${a.linha}\n    ${a.classe}  →  ${certo}`);
}
console.error(`\nEscala válida sem colchetes: ${[...ESCALA].join(', ')}`);
process.exit(1);
