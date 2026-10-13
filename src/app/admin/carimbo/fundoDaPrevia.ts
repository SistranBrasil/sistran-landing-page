/**
 * O FUNDO DE UMA PRÉVIA DE CARIMBO, escolhido pela cor da tinta.
 *
 * ⚠️ POR QUE NÃO É SEMPRE O XADREZ, que é a convenção para imagem transparente:
 * porque metade das artes é BRANCA — carimbo branco sobre xadrez claro
 * desaparece. O xadrez só cumpre o papel dele quando há contraste com a tinta.
 *
 * ⚠️ POR QUE ESTE MÓDULO EXISTE, em vez da função morar na tela que a usa: são
 * DUAS telas, e elas tinham de concordar. A regra nasceu na lista de lugares, e
 * a tela de CRIAÇÃO continuava abrindo no xadrez — então escolher branco ali
 * mostrava uma prévia vazia, que é o defeito original aparecendo no outro lugar.
 * Regra duplicada é regra que divergiria na primeira correção.
 */

/** Xadrez de transparência em CSS: nenhuma imagem para carregar. */
export const XADREZ = 'repeating-conic-gradient(#e7ebf0 0% 25%, #ffffff 0% 50%) 0 0 / 18px 18px';

/**
 * O navy da casa. Não é um azul qualquer: é o fundo real onde as artes claras
 * vivem no site, então a prévia mostra a peça no contexto dela.
 */
export const NAVY = '#001A3D';

/**
 * A tinta é clara o bastante para desaparecer sobre fundo claro?
 *
 * Usa LUMINÂNCIA PERCEBIDA (0.299/0.587/0.114) e não a média dos canais: num
 * amarelo os dois discordam, e quem decide se o carimbo vai ser visto é a
 * percepção.
 *
 * O CORTE EM 0.55 saiu da paleta medida, não de um palpite — e a primeira versão
 * desta nota errou o número do ciano de cabeça, o que mandou um caso para o lado
 * errado:
 *
 *   Branco  #FFFFFF  1.00 → navy
 *   Ciano   #0ED8F6  0.62 → navy   (sobre branco dá ~1,6:1 de contraste, ilegível)
 *   Coral   #ED5B2A  0.51 → xadrez (~3:1 sobre branco, ainda se lê)
 *   Violeta #7139E8  0.37 → xadrez
 *   Azul    #0757C7  0.30 → xadrez
 *   Grafite #111827  0.09 → xadrez
 *
 * Entre o ciano e o coral é onde a legibilidade sobre claro de fato muda, e é por
 * isso que o corte fica entre os dois e não no meio da escala.
 */
export function tintaClara(cor: string): boolean {
  const hex = cor.replace('#', '');
  /* Cor fora do formato não arrisca palpite: cai no xadrez, que é o padrão
     histórico e nunca esconde tinta escura. */
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return false;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

export function fundoDaPrevia(cor: string): string {
  return tintaClara(cor) ? NAVY : XADREZ;
}
