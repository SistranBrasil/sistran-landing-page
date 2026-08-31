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
 * O requisito de desenho é "os SETE indicadores visiveis ao mesmo tempo": com
 * sete pontos o desenho ocupa `6 * vao`, entao o vao é o que decide quantos
 * cabem na tela. O valor anterior (280–360px) punha 1680–2160px na horizontal —
 * duas vezes a largura util de um monitor de 1280px, e por isso so o ativo e um
 * vizinho apareciam.
 *
 * Agora: 13,5% da largura, entre 150px e 250px. Em 1280px o vao fica em ~173px
 * (6 x 173 = 1037px de desenho, com folga nas duas pontas) e em 1920px em 250px
 * (1500px). A lente acompanha — ela é derivada do vao no CSS
 * (`--impact-lente`), e nao um `clamp` independente: era o desencontro entre os
 * dois que fazia o conteudo dos vizinhos cair dentro dela.
 *
 * Os vizinhos nao brigam com a lente porque estao deslocados na VERTICAL
 * (`DESVIOS_TRILHO`), onde o circulo da lente ja é estreito — o cruzamento é
 * horizontal, nao area.
 */
export function vaoEntreEtapas(larguraViewport: number): number {
  return Math.min(250, Math.max(150, larguraViewport * 0.135));
}

/**
 * Amplitude da onda entre dois indicadores, em pixels.
 *
 * Reduzida junto com o vao: 70px sobre um vao de 173px dava uma serra, nao uma
 * onda. Mantendo ~30% do vao minimo a curva volta a ler como onda larga.
 *
 * SIS-74: 46px -> 22px. A 46px a curva era uma senoide de amplitude generosa
 * atravessando o palco — a forma mais previsivel que um grafico decorativo pode
 * ter, e metade da razao pela qual a cena lia como template. A 22px sobre um vao
 * de 150–250px ela vira um TRILHO com desvio leve: continua havendo relevo (é
 * dele que sai a leitura de percurso, e é ele que separa os blocos vizinhos), mas
 * o desenho passa a ser tenso em vez de ondulado.
 *
 * Nao é so estetica: `DESVIOS_TRILHO` empurra o conteudo ~130px na vertical, e
 * com 46px de onda os dois relevos somavam e o ritmo dos blocos ficava
 * desencontrado do da curva. Com 22px o desvio do conteudo domina, que é o que
 * deve dominar.
 */
export const AMPLITUDE = 22;

/** Distancia dos pontos de controle, como fracao do vao. */
const CONTROLE = 0.34;

/**
 * Deslocamento vertical do conteudo de cada indicador em relacao a linha-base da
 * curva. Alternam acima/abaixo para os vizinhos nao brigarem com a lente nem
 * entre si, e os valores sao proximos em modulo para o ritmo nao ficar torto.
 *
 * A alternancia agora é ESTRITA. A lista anterior repetia o lado nos indices 3 e
 * 4 (`135, 125`, ambos abaixo), e isso passava desapercebido com vao de 300px —
 * com o vao de ~173px que faz os sete caberem na tela, dois vizinhos do mesmo
 * lado a essa distancia encostariam um no outro.
 */
export const DESVIOS_TRILHO = [-132, 128, -138, 134, -128, 138, -132];

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
 * ── Por que a MARGEM é meia tela, e nao um vao ─────────────────────────────
 * O desenho comecava um vao antes do primeiro indicador e terminava um vao
 * depois do ultimo. Como a trilha se desloca um vao por etapa e o indicador
 * ativo fica sempre no centro da tela, isso deixava a onda comecando e
 * terminando a apenas UM vao (150–250px) do centro — ou seja, no primeiro
 * indicador a metade esquerda da tela abria vazia, e no ultimo a metade direita
 * ficava vazia. Era esse o defeito visivel nas capturas, e nao a falta de
 * efeitos: a onda nascia e morria dentro do quadro.
 *
 * `margem` é o numero de trechos extra em cada ponta, e quem chama passa
 * `ceil(centroX / vao)` — o bastante para que, em qualquer etapa, a onda
 * atravesse a tela de borda a borda. As pontas que caem fora do `viewBox` sao
 * recortadas por ele, que é exatamente o efeito desejado: a curva chega na
 * borda e é cortada, em vez de terminar no ar.
 */
export function criarOnda(
  centroX: number,
  centroY: number,
  vao: number,
  total: number,
  margem = 1,
): Onda {
  const c = vao * CONTROLE;
  const x = (i: number) => centroX + i * vao;
  const primeiro = -Math.max(1, Math.round(margem));
  const ultimo = total - 1 + Math.max(1, Math.round(margem));
  let d = `M ${coord(x(primeiro))} ${coord(centroY)}`;
  for (let i = primeiro; i < ultimo; i += 1) {
    const s = sentido(i + 1);
    const y = coord(centroY + s * AMPLITUDE);
    d += ` C ${coord(x(i) + c)} ${y} ${coord(x(i + 1) - c)} ${y} ${coord(x(i + 1))} ${coord(centroY)}`;
  }
  return { d, largura: x(ultimo) };
}

/**
 * A MESMA onda com amplitude zero: a linha-base reta, de ponta a ponta.
 *
 * Orquestração visual, Prioridade 1 — passagem Números → Parceiros. No fim do
 * percurso a curva "perde amplitude e se torna a linha-base horizontal" de onde
 * os logos dos parceiros emergem. A amplitude está assada no `d` (é o `y` dos
 * pontos de controle), então não há como animá-la sem uma segunda geometria:
 * esta função devolve o MESMO caminho — mesmos comandos, mesmos endpoints, mesma
 * contagem de nós — com os controles na linha-base.
 *
 * Mesma estrutura de comandos de propósito: as duas camadas se cruzam por
 * `opacity`, e com 22px de amplitude o cruzamento lê como a onda assentando. Um
 * caminho de estrutura diferente (`M`+`L`, por exemplo) fecharia a porta para
 * trocar a travessia por interpolação de `d` no dia em que o suporte permitir.
 */
export function criarPlano(
  centroX: number,
  centroY: number,
  vao: number,
  total: number,
  margem = 1,
): string {
  const c = vao * CONTROLE;
  const x = (i: number) => centroX + i * vao;
  const primeiro = -Math.max(1, Math.round(margem));
  const ultimo = total - 1 + Math.max(1, Math.round(margem));
  let d = `M ${coord(x(primeiro))} ${coord(centroY)}`;
  for (let i = primeiro; i < ultimo; i += 1) {
    d += ` C ${coord(x(i) + c)} ${coord(centroY)} ${coord(x(i + 1) - c)} ${coord(centroY)} ${coord(x(i + 1))} ${coord(centroY)}`;
  }
  return d;
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
