/**
 * Geometria da curva da secao "Sistran em numeros".
 *
 * Tudo aqui é MATEMATICA PURA: nao ha medicao de DOM, nao ha `getTotalLength()`
 * por quadro e o resultado é uma funcao dos parametros recebidos — as mesmas
 * entradas dao a mesma saida no servidor e no cliente.
 *
 * ── Por que ESPACO DE PIXELS ────────────────────────────────────────────────
 * A versao anterior trabalhava numa caixa de 700 x 200 unidades que o SVG
 * esticava para a largura da trilha com `preserveAspectRatio="none"`. Isso dava
 * TRES referencias diferentes de posicionamento na mesma cena: o path em
 * unidades esticadas, os indicadores em porcentagem da trilha e a lente em
 * porcentagem da tela. Nada podia ser alinhado com precisao, e o espacamento
 * entre indicadores virava uma fracao da largura da trilha (500-800px) em vez de
 * uma distancia escolhida.
 *
 * Agora existe UMA unidade: o pixel. O `viewBox` do SVG tem exatamente a largura
 * e a altura em pixels do elemento, entao 1 unidade = 1 px, e o mesmo `vao`
 * alimenta posicao dos indicadores, dos nodes, largura do SVG, deslocamento da
 * trilha e o proprio path.
 */

/**
 * Coordenada pronta para virar atributo SVG.
 *
 * As entradas vem de medicao de layout (`getBoundingClientRect`), que devolve
 * floats longos; e como o React compara atributos como TEXTO, um digito de
 * diferenca no fim da mantissa viraria aviso de hidratacao. Truncar em tres
 * casas mata a divergencia — um milesimo de pixel nao existe na tela.
 */
export const coord = (n: number): number => Number(n.toFixed(3));

/**
 * Distancia horizontal entre dois indicadores consecutivos.
 *
 * Piso de 280px para os vizinhos nao encostarem no ativo; teto de 360px para os
 * vizinhos imediatos nunca sairem da tela. Em 1536px o vao fica em ~338px: com
 * a lente central de ~440px sobram ~230px de cada lado, o suficiente para os
 * dois vizinhos aparecerem inteiros.
 */
export function vaoEntreEtapas(larguraViewport: number): number {
  return Math.min(360, Math.max(280, larguraViewport * 0.22));
}

/** Amplitude da onda entre dois indicadores, em pixels. */
export const AMPLITUDE = 70;

/** Distancia dos pontos de controle, como fracao do vao. */
const CONTROLE = 0.34;

/**
 * Deslocamento vertical do conteudo de cada indicador em relacao a linha-base da
 * curva. Alternam acima/abaixo para os vizinhos nao brigarem com a lente nem
 * entre si, e os valores sao proximos em modulo para o ritmo nao ficar torto.
 */
export const DESVIOS_TRILHO = [-135, 125, -140, 135, 125, -135, 130];

/** Lado da onda no trecho que TERMINA no indicador `i`. */
const sentido = (i: number) => (i % 2 === 0 ? -1 : 1);

export type Onda = {
  /** `d` do path, em pixels. */
  d: string;
  /** Largura total do desenho, em pixels. */
  largura: number;
};

/**
 * Onda que passa por todos os indicadores.
 *
 * Cada trecho entre dois indicadores é uma cubica com os DOIS pontos de controle
 * do mesmo lado da linha-base. A consequencia é a que importa: a tangente fica
 * horizontal em cada indicador e todos os endpoints ficam exatamente em
 * `centroY`. Por isso a lente nao salta na vertical de uma etapa para a outra —
 * a curva chega sempre na mesma altura, e é so no meio do caminho que ela sobe
 * ou desce.
 *
 * O desenho comeca um vao antes do primeiro indicador e termina um vao depois do
 * ultimo, para a curva atravessar a cena em vez de nascer e morrer nos extremos.
 */
export function criarOnda(
  centroX: number,
  centroY: number,
  vao: number,
  total: number,
): Onda {
  const c = vao * CONTROLE;
  const x = (i: number) => centroX + i * vao;
  let d = `M ${coord(x(-1))} ${coord(centroY)}`;
  for (let i = -1; i < total; i += 1) {
    const s = sentido(i + 1);
    const y = coord(centroY + s * AMPLITUDE);
    d += ` C ${coord(x(i) + c)} ${y} ${coord(x(i + 1) - c)} ${y} ${coord(x(i + 1))} ${coord(centroY)}`;
  }
  return { d, largura: x(total) };
}

/**
 * Ponto da onda na posicao continua `etapa` (0 = primeiro indicador,
 * `total - 1` = ultimo), em PIXELS da trilha.
 *
 * Resolvido analiticamente, sem tabela de amostras: como os dois pontos de
 * controle de cada trecho estao no mesmo lado, `y(t)` colapsa em
 * `centroY + 3 * s * AMPLITUDE * t * (1 - t)`.
 */
export function pontoNaOnda(
  etapa: number,
  centroX: number,
  centroY: number,
  vao: number,
): { x: number; y: number } {
  const i = Math.floor(etapa);
  const t = etapa - i;
  const u = 1 - t;
  const c = vao * CONTROLE;
  const x0 = centroX + i * vao;
  const x1 = x0 + vao;
  return {
    x: u * u * u * x0 + 3 * u * u * t * (x0 + c) + 3 * u * t * t * (x1 - c) + t * t * t * x1,
    y: centroY + 3 * sentido(i + 1) * AMPLITUDE * t * u,
  };
}
