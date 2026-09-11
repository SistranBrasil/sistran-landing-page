/**
 * SIS-161 — gera o `d` das divisas internas dos estados brasileiros no MESMO
 * sistema de coordenadas do `BRAZIL_PATH` de `src/components/ui/BrazilOfficesMap.tsx`
 * (`viewBox="0 0 720 640"`).
 *
 * Por que um gerador e nao um arquivo de mapa colado: a issue exige que as
 * divisas casem com o contorno que JA existe no componente. Colar um SVG de
 * outro mapa daria duas projecoes diferentes na mesma caixa, e o desencontro
 * apareceria justamente na borda, que é a parte que se olha.
 *
 * COMO O ENCAIXE É FEITO: transformacao afim de eixos separados (escala e
 * deslocamento em x e y, sem rotacao), ajustada pela CAIXA do proprio
 * `BRAZIL_PATH` contra a caixa do Brasil continental do dataset. Uma projecao
 * cartografica exata nao é reconstruivel a partir do path, e nao precisa ser: no
 * componente as divisas entram RECORTADAS pela silhueta (`clipPath#bm-recorte`),
 * entao qualquer sobra na costa é invisivel e o que se ve é so a malha por
 * dentro.
 *
 * Dataset: github.com/giuliano-macedo/geodata-br-states (limites das 27 UFs,
 * derivado do IBGE). Baixado em tempo de geracao; o resultado é colado no
 * componente para o site nao depender da rede.
 *
 * Uso:
 *   node scripts/gerar-divisas-brasil.mjs
 *   node scripts/gerar-divisas-brasil.mjs --aplicar
 *
 * Sem `--aplicar`, grava somente o cache para inspecao. Com a flag, tambem
 * substitui `DIVISAS_BRASIL` no componente: assim o path publicado sempre pode
 * ser reproduzido pelo algoritmo, sem retoque manual.
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FONTE =
  'https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json';
const CACHE = resolve('node_modules/.cache/br_states.json');

/* Ilhas oceanicas (Fernando de Noronha, Trindade, Atol das Rocas) estao no
   dataset e nao estao na silhueta do componente: entrariam so para esticar a
   caixa de encaixe. O corte é por longitude — nenhum ponto do continente passa
   de -34,5. */
const LON_CONTINENTE = -34.5;

async function baixar() {
  if (existsSync(CACHE)) return readFileSync(CACHE, 'utf8');
  const resposta = await fetch(FONTE);
  if (!resposta.ok) throw new Error(`fonte respondeu ${resposta.status}`);
  const texto = await resposta.text();
  writeFileSync(CACHE, texto);
  return texto;
}

/* Caixa do `BRAZIL_PATH`, lida do proprio componente: se o path mudar, o
   encaixe muda com ele. O path é uma sequencia de `L`/`M` com pares
   `x y` — nao tem curvas, entao todo numero é coordenada. */
function caixaDoPath() {
  const fonte = readFileSync(resolve('src/components/ui/BrazilOfficesMap.tsx'), 'utf8');
  const bloco = fonte.match(/const BRAZIL_PATH =\s*'([^']+)'/);
  if (!bloco) throw new Error('BRAZIL_PATH nao encontrado');
  const numeros = bloco[1].match(/-?\d+(?:\.\d+)?/g).map(Number);
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < numeros.length; i += 2) {
    x0 = Math.min(x0, numeros[i]);
    x1 = Math.max(x1, numeros[i]);
    y0 = Math.min(y0, numeros[i + 1]);
    y1 = Math.max(y1, numeros[i + 1]);
  }
  return { x0, y0, x1, y1 };
}

const chave = (p) => `${p[0]}|${p[1]}`;

const dados = JSON.parse(await baixar());
const aneis = [];
for (const f of dados.features) {
  const uf = f.properties.SIGLA;
  const g = f.geometry;
  const poligonos = g.type === 'MultiPolygon' ? g.coordinates.flat() : g.coordinates;
  for (const anel of poligonos) {
    if (anel.some(([lon]) => lon > LON_CONTINENTE)) continue;
    aneis.push({ uf, pontos: anel });
  }
}

let lon0 = Infinity;
let lon1 = -Infinity;
let lat0 = Infinity;
let lat1 = -Infinity;
for (const { pontos } of aneis) {
  for (const [lon, lat] of pontos) {
    lon0 = Math.min(lon0, lon);
    lon1 = Math.max(lon1, lon);
    lat0 = Math.min(lat0, lat);
    lat1 = Math.max(lat1, lat);
  }
}

const caixa = caixaDoPath();
const escalaX = (caixa.x1 - caixa.x0) / (lon1 - lon0);
const escalaY = (caixa.y1 - caixa.y0) / (lat1 - lat0);
/* y cresce para BAIXO no SVG e a latitude cresce para o norte: o eixo inverte. */
const projetar = ([lon, lat]) => [
  Math.round((caixa.x0 + (lon - lon0) * escalaX) * 10) / 10,
  Math.round((caixa.y1 - (lat - lat0) * escalaY) * 10) / 10,
];

/* Uma divisa entre dois estados aparece nos aneis de DUAS UFs diferentes; a
   costa e as fronteiras com outros paises pertencem a uma só. É a identidade
   dos donos — nao apenas o numero de ocorrencias — que separa as duas coisas.
   Um mesmo anel pode repetir uma aresta, e isso nao a transforma em divisa.

   A identidade é calculada na grade projetada de 0,1 px usada pelo SVG. O
   arredondamento aproxima as bordas dos dois arquivos de estado, que nem sempre
   repetem os mesmos decimais na origem. Colisoes com mais de duas UFs sao
   ambiguas e descartadas; repeticoes dentro de uma unica UF tambem.

   Nao é economia de bytes: o encaixe por caixa acerta os extremos, mas o
   contorno do dataset nao é o mesmo desenho da silhueta do componente. Traçar a
   costa aqui poria uma segunda linha de litoral alguns pixels por DENTRO do
   pais, do lado que mais se olha. O que a arte pede é a malha interna, e a malha
   interna é exatamente o conjunto das arestas repetidas. */
const arestas = new Map();
for (const { uf, pontos } of aneis) {
  const projetados = pontos.map(projetar);
  for (let i = 1; i < projetados.length; i += 1) {
    const a = projetados[i - 1];
    const b = projetados[i];
    if (chave(a) === chave(b)) continue;
    const ka = chave(a);
    const kb = chave(b);
    const id = ka < kb ? `${ka}>${kb}` : `${kb}>${ka}`;
    if (!arestas.has(id)) {
      arestas.set(id, {
        a,
        b,
        ufs: new Set(),
      });
    }
    arestas.get(id).ufs.add(uf);
  }
}
let soltas = 0;
let ambiguas = 0;
for (const [id, aresta] of [...arestas]) {
  if (aresta.ufs.size !== 2) {
    arestas.delete(id);
    if (aresta.ufs.size < 2) soltas += 1;
    else ambiguas += 1;
  }
}

/* Arestas do MESMO PAR de UFs viram polilinhas. A versao anterior montava um
   grafo nacional unico. Num encontro triplo, `find()` pegava a primeira aresta
   livre e podia sair de PR-SP por SP-MS, por exemplo. O subpath continuava
   tecnicamente aberto, mas percorria lados de estados diferentes e lia como um
   quase-contorno/bolha quando simplificado.

   Separar o grafo por par faz cada linha terminar no encontro triplo. Essa é a
   propriedade topologica relevante: uma fronteira PR-SP nunca continua por uma
   fronteira de outro par. */
const porPar = new Map();
for (const { a, b, ufs } of arestas.values()) {
  const par = [...ufs].sort().join('-');
  if (!porPar.has(par)) porPar.set(par, new Map());
  const ka = chave(a);
  const kb = chave(b);
  const idDaGrade = ka < kb ? `${ka}>${kb}` : `${kb}>${ka}`;
  porPar.get(par).set(idDaGrade, [a, b]);
}

const linhas = [];
let bifurcacoes = 0;
for (const [par, arestasDoPar] of porPar) {
  const vizinhos = new Map();
  for (const [id, [a, b]] of arestasDoPar) {
    for (const [p, q] of [
      [a, b],
      [b, a],
    ]) {
      const k = chave(p);
      if (!vizinhos.has(k)) vizinhos.set(k, []);
      vizinhos.get(k).push({ id, ponto: q });
    }
  }
  bifurcacoes += [...vizinhos.values()].filter((lista) => lista.length > 2).length;

  const usada = new Set();
  const percorrer = (inicio, primeira) => {
    const pontos = [inicio];
    let aresta = primeira;
    for (;;) {
      usada.add(aresta.id);
      pontos.push(aresta.ponto);
      const incidentes = vizinhos.get(chave(aresta.ponto)) || [];
      /* Grau diferente de 2 é costa, encontro ou colisao da grade: termina a
         linha aqui em vez de escolher uma continuacao arbitraria. */
      if (incidentes.length !== 2) break;
      const proxima = incidentes.find((item) => !usada.has(item.id));
      if (!proxima) break;
      aresta = proxima;
    }
    linhas.push({ par, pontos });
  };

  /* Primeiro extrai cadeias abertas a partir de pontas e encontros. */
  for (const [k, incidentes] of vizinhos) {
    if (incidentes.length === 2) continue;
    const inicio = k.split('|').map(Number);
    for (const aresta of incidentes) {
      if (!usada.has(aresta.id)) percorrer(inicio, aresta);
    }
  }
  /* O que sobrar é um ciclo genuino do mesmo par (por exemplo, um enclave). */
  for (const [id, [a, b]] of arestasDoPar) {
    if (!usada.has(id)) percorrer(a, { id, ponto: b });
  }
}

/* Douglas-Peucker por polilinha, com as pontas presas: sem isso as emendas
   entre polilinhas vizinhas abririam. */
function simplificar(pontos, tolerancia) {
  if (pontos.length < 3) return pontos;
  const [a] = pontos;
  const b = pontos[pontos.length - 1];
  let pior = 0;
  let indice = 0;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const norma = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pontos.length - 1; i += 1) {
    const p = pontos[i];
    const d = Math.abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / norma;
    if (d > pior) {
      pior = d;
      indice = i;
    }
  }
  if (pior <= tolerancia) return [a, b];
  return [
    ...simplificar(pontos.slice(0, indice + 1), tolerancia),
    ...simplificar(pontos.slice(indice), tolerancia).slice(1),
  ];
}

const TOLERANCIA = 0.9; // em px da caixa de 720x640
/* Pedaços menores que isto (diagonal da caixa da polilinha) sao migalha de
   dataset, nao divisa legivel a 1 px de traco. */
const MINIMO = 4;
const partes = [];
let pontosAntes = 0;
let pontosDepois = 0;
let migalhas = 0;
let retornosAoInicio = 0;
let retornosSpPr = 0;
let verticesRepetidosSpPr = 0;
let arestasDuplicadasNaSaida = 0;
const arestasDaSaida = new Set();
for (const { par, pontos: linha } of linhas) {
  const xs = linha.map((p) => p[0]);
  const ys = linha.map((p) => p[1]);
  const diagonal = Math.hypot(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  );
  if (diagonal < MINIMO) {
    migalhas += 1;
    continue;
  }
  pontosAntes += linha.length;
  const s = simplificar(linha, TOLERANCIA);
  if (s.length < 2) continue;
  pontosDepois += s.length;
  const retorna =
    s[0][0] === s[s.length - 1][0] && s[0][1] === s[s.length - 1][1];
  if (retorna) retornosAoInicio += 1;
  if (retorna && /(^|-)(PR|SP)(-|$)/.test(par)) retornosSpPr += 1;
  if (/(^|-)(PR|SP)(-|$)/.test(par)) {
    verticesRepetidosSpPr += s.length - new Set(s.map(chave)).size;
  }
  for (let i = 1; i < s.length; i += 1) {
    const ka = chave(s[i - 1]);
    const kb = chave(s[i]);
    const id = ka < kb ? `${ka}>${kb}` : `${kb}>${ka}`;
    if (arestasDaSaida.has(id)) arestasDuplicadasNaSaida += 1;
    arestasDaSaida.add(id);
  }
  partes.push(`M${s[0][0]} ${s[0][1]}` + s.slice(1).map((p) => `L${p[0]} ${p[1]}`).join(''));
}

const d = partes.join('');
if (retornosSpPr > 0 || verticesRepetidosSpPr > 0 || arestasDuplicadasNaSaida > 0) {
  throw new Error(
    `topologia invalida: retornos SP/PR=${retornosSpPr}, vertices repetidos SP/PR=${verticesRepetidosSpPr}, arestas duplicadas=${arestasDuplicadasNaSaida}`,
  );
}
console.log(
  JSON.stringify(
    {
      caixaPath: caixa,
      caixaGeo: { lon0, lon1, lat0, lat1 },
      escalaX: Math.round(escalaX * 1000) / 1000,
      escalaY: Math.round(escalaY * 1000) / 1000,
      aneis: aneis.length,
      arestasCompartilhadas: arestas.size,
      arestasDeCostaDescartadas: soltas,
      arestasAmbiguasDescartadas: ambiguas,
      paresDeUfs: porPar.size,
      bifurcacoesDentroDoMesmoPar: bifurcacoes,
      migalhasDescartadas: migalhas,
      polilinhas: partes.length,
      retornosAoInicio,
      retornosSpPr,
      verticesRepetidosSpPr,
      arestasDuplicadasNaSaida,
      pontosAntes,
      pontosDepois,
      tamanhoD: d.length,
    },
    null,
    2,
  ),
);
writeFileSync(resolve('node_modules/.cache/divisas-brasil.txt'), d);
console.log('d escrito em node_modules/.cache/divisas-brasil.txt');

if (process.argv.includes('--aplicar')) {
  const destino = resolve('src/components/ui/BrazilOfficesMap.tsx');
  const fonte = readFileSync(destino, 'utf8');
  const marcador = /const DIVISAS_BRASIL =\s*\n\s*'[^']*';/;
  if (!marcador.test(fonte)) throw new Error('DIVISAS_BRASIL nao encontrado para aplicar');
  writeFileSync(destino, fonte.replace(marcador, `const DIVISAS_BRASIL =\n  '${d}';`));
  console.log('DIVISAS_BRASIL atualizado em src/components/ui/BrazilOfficesMap.tsx');
}

