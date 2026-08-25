/**
 * Copy Lock — Regra Zero do relatorio de UX (p3).
 *
 * Extrai TODO o texto visivel do codigo (literais dos dados em `src/data` e nos
 * de texto do JSX em `src/app` / `src/components`) e grava em `copy-lock.json`
 * com IDs estaveis. Depois disso, qualquer alteracao de escrita passa a ser
 * visivel: `node scripts/copy-lock.mjs --check` falha e mostra o que mudou.
 *
 *   node scripts/copy-lock.mjs           grava/atualiza o lock (uso deliberado)
 *   node scripts/copy-lock.mjs --check   verifica; sai com 1 se divergir
 *
 * Sem dependencia nova de proposito: o relatorio manda preservar a stack.
 *
 * O que NAO entra: nomes de classe, caminhos de import, chaves tecnicas, cores,
 * ids kebab/camel e numeros soltos. Sao filtrados por heuristica em
 * `pareceCodigo()`. Falso positivo aqui é inofensivo (uma string tecnica a mais
 * fica travada); falso negativo é o que precisa ser evitado, por isso a
 * heuristica é conservadora.
 *
 * ID = `<caminho relativo>:<n>`, onde n é a ordem de aparicao no arquivo.
 * Mover um bloco dentro do arquivo renumera os IDs seguintes — o teste continua
 * apontando a diferenca, so com ID diferente. O que importa é o conjunto de
 * textos, e ele é comparado tambem por valor (ver `resumo`).
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RAIZ = join(import.meta.dirname, '..');
const SRC = join(RAIZ, 'src');
const LOCK = join(RAIZ, 'copy-lock.json');

const EXTENSOES = ['.ts', '.tsx'];

function arquivos(dir, acc = []) {
  for (const nome of readdirSync(dir).sort()) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) arquivos(caminho, acc);
    else if (EXTENSOES.some((e) => nome.endsWith(e))) acc.push(caminho);
  }
  return acc;
}

/** Heuristica: a string é codigo, nao escrita para o visitante? */
function pareceCodigo(s) {
  if (!/[A-Za-zÀ-ÿ]/.test(s)) return true; // sem letra: numero, simbolo, espaco
  if (s.length < 2) return true;
  if (/^[@./#]/.test(s)) return true; // import, rota, ancora, cor hex
  if (/^https?:\/\//.test(s)) return true; // URL nao é copy
  if (/^[a-z0-9_-]+$/.test(s)) return true; // id kebab/snake
  if (/^[a-z]+(?:[A-Z][a-z0-9]*)+$/.test(s)) return true; // camelCase
  if (/^[A-Z][A-Z0-9_]*$/.test(s)) return true; // CONSTANTE
  if (/(rgba?\(|linear-gradient|cubic-bezier|\d+px|\d+vh|\d+svh|\d+rem)/.test(s)) return true;
  if (/^(?:image|video|font|application)\//.test(s)) return true; // mime
  /* Dado de path SVG. A string TODA precisa ser comando + coordenada: exigir
     apenas o inicio derrubava frase real, porque "A Sistran ..." tambem comeca
     com um comando valido (`A`) seguido de espaco. */
  if (/^[MmLlHhVvCcSsQqTtAaZz][\s\d.,-]/.test(s) && /^[MmLlHhVvCcSsQqTtAaZz\s\d.,-]+$/.test(s))
    return true;
  if (/^[a-z]{2,3}-[A-Z]{2}$/.test(s)) return true; // locale BCP47 ("pt-BR")
  if (/<\/?[a-z]/i.test(s)) return true; // tag citada em comentario
  // Especificador de modulo ("next/navigation", "motion/react").
  if (!/\s/.test(s) && s.includes('/') && /^[a-z@][a-z0-9._/-]*$/i.test(s)) return true;
  /* Fragmentos que o `textoJsx` mais permissivo passou a alcancar: assinatura
     de funcao, chamada, especificador de import e resto de template.
     As fronteiras de palavra sao obrigatorias: sem elas "constante" e "novas"
     seriam lidos como `const` e `new`, e escrita real cairia fora do lock.
     Nao existe regra por pontuacao inicial: frase que continua depois de um
     trecho em destaque comeca com virgula e é escrita legitima. */
  /* Fronteira propria, nao `\b`: para o JS `const` termina antes do `a` de
     "constancia" acentuada, e "constância" seria descartada como codigo. */
  if (/(?<![A-Za-zÀ-ÿ])(?:export|function|const|let|var|return|import|typeof|async|await|new)(?![A-Za-zÀ-ÿ])/.test(s))
    return true;
  if (/\bfrom\s+["']/.test(s)) return true;
  if (/\w\(|\$\{|\$$/.test(s)) return true;
  /* Restos de objeto/tipo colhidos entre `}` e `{`: `, contactPoint:`,
     `: Props)`, `], keywords: [`. Escrita para o visitante nao comeca com dois
     pontos nem termina em nome de propriedade seguido de dois pontos. */
  if (/^\s*[:[\]]/.test(s)) return true;
  if (/\/\*|\*\//.test(s)) return true; // comentario de bloco vazado
  if (/(?:^|\s)\/\//.test(s)) return true; // comentario de linha vazado
  if (/^,\s*(?:[A-Za-z_$][\w$]*:\s*$|[[\]{}])/.test(s)) return true; // resto de objeto/array
  if (/^(?:if|for|while|switch)\s*\(/.test(s)) return true; // condicao vazada
  // Fragmento de codigo que escapou do regex de JSX (`>` ... `<` com logica).
  if (/[;={}]|=>/.test(s)) return true;
  // Cadeia de classes utilitarias: varios tokens, todos com cara de Tailwind.
  const tokens = s.trim().split(/\s+/);
  if (
    tokens.length >= 2 &&
    tokens.every((t) => /^[a-z0-9:[\]/#().,%_!*-]+$/.test(t) && !/[À-ÿ]/.test(t))
  ) {
    return true;
  }
  return false;
}

/** Literais entre quotes, incluindo template sem interpolacao. */
function literais(codigo) {
  const achados = [];
  const re = /(['"`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;
  let m;
  while ((m = re.exec(codigo))) {
    if (m[1] === '`' && m[2].includes('${')) continue; // template dinamico
    achados.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return achados;
}

/**
 * Nos de texto do JSX.
 *
 * A versao anterior exigia `>texto<`: o no tinha de terminar numa tag. Titulo
 * partido em duas partes — `Siga a Sistran no LinkedIn{' '}<span>...` — nao
 * entrava no lock, porque o que vem depois do texto e `{`, nao `<`. Ou seja: os
 * titulos mais visiveis do site, que quase sempre tem um trecho em destaque,
 * estavam fora da Regra Zero.
 *
 * Agora um no comeca depois de `>` ou de `}` e termina antes de `<` ou de `{`.
 * O lookahead evita consumir o delimitador final, para que dois trechos
 * vizinhos (`}texto{`) sejam ambos capturados.
 */
function textoJsx(codigo) {
  const achados = [];
  const re = /[>}]([^<>{}]+)(?=[<{])/g;
  let m;
  while ((m = re.exec(codigo))) achados.push(m[1]);
  return achados;
}

function extrair() {
  const mapa = {};
  for (const caminho of arquivos(SRC)) {
    const rel = relative(RAIZ, caminho).split(sep).join('/');
    const codigo = readFileSync(caminho, 'utf8');
    const brutos = [...literais(codigo), ...textoJsx(codigo)];
    let n = 0;
    for (const bruto of brutos) {
      /* Espaco de renderizacao (indentacao do JSX, quebras de linha) nao é
         conteudo: o relatorio abre excecao justamente para isso. */
      const texto = bruto.replace(/\s+/g, ' ').trim();
      if (!texto || pareceCodigo(texto)) continue;
      mapa[`${rel}:${n++}`] = texto;
    }
  }
  return mapa;
}

const atual = extrair();
const modoCheck = process.argv.includes('--check');

if (!modoCheck) {
  writeFileSync(LOCK, `${JSON.stringify(atual, null, 2)}\n`, 'utf8');
  console.log(`copy-lock.json: ${Object.keys(atual).length} textos travados`);
  process.exit(0);
}

let lock;
try {
  lock = JSON.parse(readFileSync(LOCK, 'utf8'));
} catch {
  console.error('copy-lock.json ausente. Rode: node scripts/copy-lock.mjs');
  process.exit(1);
}

/* Compara por VALOR, nao por ID: mover texto de arquivo/posicao é refatoracao
   permitida; mudar, resumir ou apagar escrita nao é. */
const conta = (mapa) => {
  const m = new Map();
  for (const v of Object.values(mapa)) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
};
const antes = conta(lock);
const depois = conta(atual);

const removidos = [];
const adicionados = [];
for (const [texto, q] of antes) {
  const d = depois.get(texto) ?? 0;
  if (d < q) removidos.push(`${texto}  (${q}x -> ${d}x)`);
}
for (const [texto, q] of depois) {
  const a = antes.get(texto) ?? 0;
  if (a < q) adicionados.push(`${texto}  (${a}x -> ${q}x)`);
}

if (!removidos.length && !adicionados.length) {
  console.log(`copy-lock: OK (${antes.size} textos distintos, nada mudou)`);
  process.exit(0);
}

console.error('copy-lock: a escrita do site mudou.\n');
if (removidos.length) {
  console.error(`Textos perdidos ou alterados (${removidos.length}):`);
  for (const l of removidos) console.error(`  - ${l}`);
}
if (adicionados.length) {
  console.error(`\nTextos novos (${adicionados.length}):`);
  for (const l of adicionados) console.error(`  + ${l}`);
}
console.error(
  '\nSe a mudanca foi deliberada e aprovada pelo dono do conteudo, atualize o' +
    ' lock: node scripts/copy-lock.mjs',
);
process.exit(1);
