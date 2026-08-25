/**
 * Geometria da curva da secao "Sistran em numeros".
 *
 * Tudo aqui é MATEMATICA PURA, resolvida uma vez no carregamento do modulo: nao
 * ha medicao de DOM, nao ha `getTotalLength()` por quadro e o resultado é
 * identico no servidor e no cliente (nenhuma chance de divergencia de
 * hidratacao).
 *
 * Sistema de coordenadas: uma caixa de 700 x 200 unidades que o SVG estica para
 * a largura da trilha com `preserveAspectRatio="none"`. O estica-e-puxa nao
 * engrossa o traco porque os paths usam `vector-effect="non-scaling-stroke"`.
 * Como a caixa tem 700 de largura e sao 7 indicadores, cada um ocupa 100
 * unidades e fica no meio da sua faixa — o mesmo (i + 0.5) / 7 que o CSS usa
 * para centralizar a trilha.
 */

/**
 * Coordenada pronta para virar atributo SVG.
 *
 * `Math.cos`/`Math.sin` NAO sao especificadas bit a bit pelo IEEE 754: o V8 do
 * Node e o do navegador divergem no ultimo digito da mantissa. Como o React
 * compara atributos como texto, `116.58340096719189` (servidor) contra
 * `...188` (cliente) virava aviso de hidratacao. Truncar em tres casas mata a
 * divergencia — e 0.001 unidade de uma caixa de 200 nao existe na tela.
 */
export const coord = (n: number): number => Number(n.toFixed(3));

export const CAIXA_L = 700;
export const CAIXA_A = 200;

/** Altura de cada indicador na caixa. Variacao modesta de proposito: a lente do
 *  indicador ativo é grande, e ondas fundas a jogariam para fora da tela. */
const ALTURAS = [118, 88, 130, 78, 112, 84, 104];

export type Ponto = { x: number; y: number };

/** Ponto de cada indicador, em unidades da caixa. */
export const PONTOS: readonly Ponto[] = ALTURAS.map((y, i) => ({
  x: (i + 0.5) * (CAIXA_L / ALTURAS.length),
  y,
}));

/* A curva comeca antes do primeiro indicador e termina depois do ultimo: assim
   ela atravessa a cena inteira em vez de nascer e morrer nos extremos. */
const ANTES: Ponto = { x: -90, y: 150 };
const DEPOIS: Ponto = { x: 790, y: 66 };

/**
 * Catmull-Rom convertido em cubicas de Bezier: passa exatamente por todos os
 * pontos (é isso que se quer — a curva PASSA nos indicadores) e mantem a
 * tangente continua, entao nao ha quina nem laco.
 */
function curvaSuave(pontos: readonly Ponto[]): string {
  const p = [pontos[0], ...pontos, pontos[pontos.length - 1]];
  let d = `M ${pontos[0].x} ${pontos[0].y}`;
  for (let i = 1; i < p.length - 2; i += 1) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)} ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** O `d` da curva. Um path só, um `d` só — a base e o traco aceso o compartilham. */
export const CURVA_D = curvaSuave([ANTES, ...PONTOS, DEPOIS]);

/* Tabela de amostras para o pulso. A curva é monotona em x, entao dá para
   procurar por x e ler o y — sem `getPointAtLength()` e sem tocar no DOM.
   240 amostras: a menos de meio pixel de erro na largura maxima da trilha. */
const AMOSTRAS = 240;

function pontoNoSegmento(p0: Ponto, c1: Ponto, c2: Ponto, p1: Ponto, t: number): Ponto {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * p0.x + b * c1.x + c * c2.x + e * p1.x,
    y: a * p0.y + b * c1.y + c * c2.y + e * p1.y,
  };
}

const TABELA: Ponto[] = (() => {
  const todos = [ANTES, ...PONTOS, DEPOIS];
  const p = [todos[0], ...todos, todos[todos.length - 1]];
  const amostras: Ponto[] = [];
  const segmentos = p.length - 3;
  for (let i = 1; i < p.length - 2; i += 1) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    const passos = Math.ceil(AMOSTRAS / segmentos);
    for (let s = 0; s <= passos; s += 1) amostras.push(pontoNoSegmento(p1, c1, c2, p2, s / passos));
  }
  return amostras;
})();

/**
 * Ponto da curva na fracao horizontal `f` (0 = borda esquerda da caixa, 1 =
 * direita), devolvido em PORCENTAGEM da caixa — que é a unidade que o CSS
 * consome para posicionar o pulso.
 */
export function pontoNaCurva(f: number): { x: number; y: number } {
  const x = Math.max(0, Math.min(1, f)) * CAIXA_L;
  let i = 0;
  while (i < TABELA.length - 1 && TABELA[i + 1].x < x) i += 1;
  const a = TABELA[i];
  const b = TABELA[Math.min(TABELA.length - 1, i + 1)];
  const t = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
  return {
    x: (x / CAIXA_L) * 100,
    y: ((a.y + (b.y - a.y) * t) / CAIXA_A) * 100,
  };
}

/** Posicao horizontal do indicador `i`, em porcentagem da caixa. */
export function posicaoDoIndicador(i: number, total: number): number {
  return ((i + 0.5) / total) * 100;
}

/** Altura do indicador `i`, em porcentagem da caixa. */
export function alturaDoIndicador(i: number): number {
  return ((PONTOS[i]?.y ?? CAIXA_A / 2) / CAIXA_A) * 100;
}
